# Finance Domain - Detailed Model

**Version:** 1.1
**Date:** 2025-10-27
**Status:** Draft
**Context:** Finance Context (Domain)

## Overview

The Finance Domain manages all aspects of financial transactions, budgets, accounts, and financial health tracking. It helps users understand their spending patterns, stay within budgets, and make informed financial decisions.

**Relationship to Bounded Context:**
- This **domain model** defines WHAT the Finance Context does (aggregates, events, rules)
- The **FinanceSupervisor** (architecture) defines HOW it's implemented (LangGraph state machine, Plaid/FinAPI integrations)

---

## Multi-Tenancy Considerations

The Finance Context operates with **tenant-level isolation** and **user-level financial data**:

| **Tenant Type** | **Finance Capabilities** |
|-----------------|-------------------------|
| **INDIVIDUAL** | Personal accounts, budgets, transaction tracking |
| **FAMILY** | Shared family budgets, combined net worth, allowance tracking |
| **TEAM** | Team expense tracking, budget allocation, approval workflows |
| **COMPANY** | Department budgets, expense reports, financial analytics, approval hierarchies |

**Tenant-Specific Features:**
- **Community Tier:** 2 accounts, basic budgets, manual transaction entry
- **Cloud Tier:** 5 accounts, bank sync (Plaid/FinAPI), advanced budgets, spending insights
- **Enterprise Tier:** Unlimited accounts, multi-currency, approval workflows, custom categories, financial reports

**Data Isolation:**
- All transactions scoped to `tenantId` and `userId`
- Account balances tenant-isolated
- Budget calculations respect tenant boundaries
- Bank credentials encrypted per-user with tenant-specific keys

---

## Domain Concepts

### Core Entities

#### 1. Transaction (Aggregate Root)

**Description:** A financial transaction representing money moving in or out of an account.

**Invariants:**
- Amount cannot be zero
- Transaction date cannot be in the future (beyond today)
- Category must be valid
- Currency must match account currency (or be explicitly converted)

**State:**
```typescript
class Transaction {
  // Identity
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  // Core attributes
  private amount: Money; // Value Object
  private type: TransactionType;
  private category: TransactionCategory;
  private description: string;
  private transactionDate: Date;

  // Account reference
  private accountId: string;

  // External sync
  private externalId?: string;
  private externalProvider?: 'plaid' | 'finapi' | 'manual';

  // Classification
  private tags: string[] = [];
  private merchant?: Merchant; // Value Object
  private isRecurring: boolean = false;
  private recurrencePattern?: RecurrencePattern;

  // State
  private status: TransactionStatus;

  // Metadata
  private createdAt: Date;
  private updatedAt: Date;
}

enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer'
}

enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed'
}
```

**Commands:**

```typescript
// Record new transaction
record(data: RecordTransactionData): TransactionRecorded {
  // Validate amount
  if (this.amount.amount === 0) {
    throw new Error('Transaction amount cannot be zero');
  }

  // Validate date
  if (this.transactionDate > new Date()) {
    throw new Error('Transaction date cannot be in the future');
  }

  this.status = TransactionStatus.COMPLETED;

  return new TransactionRecorded({
    transactionId: this.id,
    userId: this.userId,
    accountId: this.accountId,
    amount: this.amount.amount,
    currency: this.amount.currency.code,
    type: this.type,
    category: this.category,
    description: this.description,
    transactionDate: this.transactionDate
  });
}

// Categorize transaction
categorize(category: TransactionCategory): TransactionCategorized {
  this.category = category;
  this.updatedAt = new Date();

  return new TransactionCategorized({
    transactionId: this.id,
    category,
    categorizedAt: new Date()
  });
}

// Add tag
addTag(tag: string): TransactionTagged {
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
  }

  return new TransactionTagged({
    transactionId: this.id,
    tag
  });
}

// Mark as recurring
markRecurring(pattern: RecurrencePattern): TransactionMarkedRecurring {
  this.isRecurring = true;
  this.recurrencePattern = pattern;

  return new TransactionMarkedRecurring({
    transactionId: this.id,
    pattern
  });
}

// Cancel transaction
cancel(reason: string): TransactionCancelled {
  if (this.status === TransactionStatus.CANCELLED) {
    throw new Error('Transaction already cancelled');
  }

  this.status = TransactionStatus.CANCELLED;

  return new TransactionCancelled({
    transactionId: this.id,
    cancelledAt: new Date(),
    reason
  });
}
```

**Queries:**

```typescript
// Check if expense
isExpense(): boolean {
  return this.type === TransactionType.EXPENSE;
}

// Check if income
isIncome(): boolean {
  return this.type === TransactionType.INCOME;
}

// Check if same category
isSameCategory(category: TransactionCategory): boolean {
  return this.category === category;
}

// Get absolute amount
getAbsoluteAmount(): number {
  return Math.abs(this.amount.amount);
}
```

#### 2. Budget (Aggregate Root)

**Description:** A spending limit for a specific category over a time period.

**Invariants:**
- Limit amount must be positive
- Period must be valid (start before end)
- Cannot exceed limit without notification

**State:**
```typescript
class Budget {
  // Identity
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  // Core attributes
  private category: TransactionCategory;
  private limit: Money; // Value Object
  private period: BudgetPeriod; // Value Object
  private rollover: boolean = false;

  // Tracking
  private currentSpending: Money;
  private transactions: string[] = []; // Transaction IDs

  // Alerts
  private alertThresholds: number[] = [50, 75, 90, 100]; // Percentages

  // Metadata
  private createdAt: Date;
  private updatedAt: Date;
}

enum BudgetPeriodType {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  CUSTOM = 'custom'
}
```

**Commands:**

```typescript
// Create budget
create(data: CreateBudgetData): BudgetCreated {
  // Validate limit
  if (this.limit.amount <= 0) {
    throw new Error('Budget limit must be positive');
  }

  // Initialize spending
  this.currentSpending = Money.zero(this.limit.currency);

  return new BudgetCreated({
    budgetId: this.id,
    userId: this.userId,
    category: this.category,
    limit: this.limit.amount,
    currency: this.limit.currency.code,
    periodType: this.period.type,
    startDate: this.period.startDate,
    endDate: this.period.endDate
  });
}

// Add spending (from transaction)
addSpending(transaction: Transaction): DomainEvent[] {
  const events: DomainEvent[] = [];

  // Verify transaction matches budget category
  if (!transaction.isSameCategory(this.category)) {
    throw new Error('Transaction category does not match budget');
  }

  // Add to spending
  const previousSpending = this.currentSpending.amount;
  this.currentSpending = this.currentSpending.add(
    transaction.getAmount()
  );
  this.transactions.push(transaction.getId());

  // Record spending
  events.push(
    new BudgetSpendingAdded({
      budgetId: this.id,
      transactionId: transaction.getId(),
      amount: transaction.getAmount().amount,
      newTotal: this.currentSpending.amount
    })
  );

  // Check thresholds
  const previousPercentage = this.getPercentageUsed(previousSpending);
  const currentPercentage = this.getPercentageUsed();

  for (const threshold of this.alertThresholds) {
    if (previousPercentage < threshold && currentPercentage >= threshold) {
      events.push(
        new BudgetThresholdExceeded({
          budgetId: this.id,
          category: this.category,
          threshold,
          spent: this.currentSpending.amount,
          limit: this.limit.amount
        })
      );
    }
  }

  // Check if exceeded
  if (previousSpending <= this.limit.amount &&
      this.currentSpending.amount > this.limit.amount) {
    events.push(
      new BudgetExceeded({
        budgetId: this.id,
        category: this.category,
        limit: this.limit.amount,
        spent: this.currentSpending.amount,
        overage: this.currentSpending.amount - this.limit.amount
      })
    );
  }

  return events;
}

// Adjust limit
adjustLimit(newLimit: Money): BudgetLimitAdjusted {
  if (newLimit.amount <= 0) {
    throw new Error('Budget limit must be positive');
  }

  if (!newLimit.currency.equals(this.limit.currency)) {
    throw new Error('Cannot change budget currency');
  }

  const oldLimit = this.limit.amount;
  this.limit = newLimit;

  return new BudgetLimitAdjusted({
    budgetId: this.id,
    oldLimit,
    newLimit: newLimit.amount
  });
}

// Reset budget (new period)
reset(): BudgetReset {
  this.currentSpending = Money.zero(this.limit.currency);
  this.transactions = [];

  // Move to next period
  this.period = this.period.next();

  return new BudgetReset({
    budgetId: this.id,
    newPeriodStart: this.period.startDate,
    newPeriodEnd: this.period.endDate
  });
}
```

**Queries:**

```typescript
// Get percentage used
getPercentageUsed(spending?: number): number {
  const spent = spending ?? this.currentSpending.amount;
  return (spent / this.limit.amount) * 100;
}

// Check if exceeded
isExceeded(): boolean {
  return this.currentSpending.amount > this.limit.amount;
}

// Get remaining amount
getRemaining(): Money {
  const remaining = this.limit.amount - this.currentSpending.amount;
  return Money.create(
    Math.max(0, remaining),
    this.limit.currency.code
  );
}

// Get average daily spending
getAverageDailySpending(): number {
  const daysInPeriod = this.period.getDays();
  return this.currentSpending.amount / daysInPeriod;
}

// Get projected end-of-period spending
getProjectedSpending(): Money {
  const dailyAverage = this.getAverageDailySpending();
  const daysInPeriod = this.period.getDays();
  const projected = dailyAverage * daysInPeriod;

  return Money.create(projected, this.limit.currency.code);
}
```

#### 3. Account (Aggregate Root)

**Description:** A financial account (bank account, credit card, cash, etc.).

**Invariants:**
- Balance must be calculated from transactions
- Currency cannot change
- Account name must be unique per user

**State:**
```typescript
class Account {
  // Identity
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  // Core attributes
  private name: string;
  private type: AccountType;
  private currency: Currency; // Value Object
  private balance: Money; // Value Object

  // External sync
  private externalId?: string;
  private externalProvider?: 'plaid' | 'finapi';
  private lastSyncedAt?: Date;

  // Settings
  private isActive: boolean = true;
  private includeInNetWorth: boolean = true;

  // Metadata
  private createdAt: Date;
  private updatedAt: Date;
}

enum AccountType {
  CHECKING = 'checking',
  SAVINGS = 'savings',
  CREDIT_CARD = 'credit_card',
  CASH = 'cash',
  INVESTMENT = 'investment',
  LOAN = 'loan',
  OTHER = 'other'
}
```

**Commands:**

```typescript
// Create account
create(data: CreateAccountData): AccountCreated {
  this.balance = Money.zero(this.currency);

  return new AccountCreated({
    accountId: this.id,
    userId: this.userId,
    name: this.name,
    type: this.type,
    currency: this.currency.code
  });
}

// Update balance (from transaction)
updateBalance(transaction: Transaction): AccountBalanceUpdated {
  const oldBalance = this.balance.amount;

  if (transaction.isExpense()) {
    this.balance = this.balance.subtract(transaction.getAmount());
  } else if (transaction.isIncome()) {
    this.balance = this.balance.add(transaction.getAmount());
  }

  return new AccountBalanceUpdated({
    accountId: this.id,
    transactionId: transaction.getId(),
    oldBalance,
    newBalance: this.balance.amount,
    currency: this.currency.code
  });
}

// Sync with external provider
sync(externalBalance: Money, lastSyncTime: Date): AccountSynced {
  // Check for discrepancy
  const discrepancy = externalBalance.amount - this.balance.amount;

  this.balance = externalBalance;
  this.lastSyncedAt = lastSyncTime;

  return new AccountSynced({
    accountId: this.id,
    provider: this.externalProvider!,
    syncedAt: lastSyncTime,
    balance: externalBalance.amount,
    discrepancy
  });
}

// Close account
close(): AccountClosed {
  if (!this.isActive) {
    throw new Error('Account already closed');
  }

  this.isActive = false;

  return new AccountClosed({
    accountId: this.id,
    closedAt: new Date(),
    finalBalance: this.balance.amount
  });
}
```

### Value Objects

#### Money

```typescript
class Money {
  private constructor(
    public readonly amount: number,
    public readonly currency: Currency
  ) {}

  static create(amount: number, currencyCode: string): Money {
    if (amount === 0) {
      throw new Error('Amount cannot be zero');
    }
    return new Money(amount, Currency.create(currencyCode));
  }

  static zero(currency: Currency): Money {
    return new Money(0, currency);
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount - other.amount, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }

  divide(divisor: number): Money {
    if (divisor === 0) {
      throw new Error('Cannot divide by zero');
    }
    return new Money(this.amount / divisor, this.currency);
  }

  isPositive(): boolean {
    return this.amount > 0;
  }

  isNegative(): boolean {
    return this.amount < 0;
  }

  abs(): Money {
    return new Money(Math.abs(this.amount), this.currency);
  }

  equals(other: Money): boolean {
    return (
      this.amount === other.amount &&
      this.currency.equals(other.currency)
    );
  }

  toString(): string {
    return `${this.currency.symbol}${this.amount.toFixed(2)}`;
  }

  private assertSameCurrency(other: Money): void {
    if (!this.currency.equals(other.currency)) {
      throw new Error(
        `Cannot operate on different currencies: ${this.currency.code} and ${other.currency.code}`
      );
    }
  }
}
```

#### Currency

```typescript
class Currency {
  private constructor(
    public readonly code: string,
    public readonly symbol: string,
    public readonly name: string
  ) {}

  static create(code: string): Currency {
    const currencyData = CURRENCY_MAP[code.toUpperCase()];
    if (!currencyData) {
      throw new Error(`Unknown currency: ${code}`);
    }
    return new Currency(code.toUpperCase(), currencyData.symbol, currencyData.name);
  }

  equals(other: Currency): boolean {
    return this.code === other.code;
  }

  toString(): string {
    return this.code;
  }
}

const CURRENCY_MAP: Record<string, { symbol: string; name: string }> = {
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  JPY: { symbol: '¥', name: 'Japanese Yen' },
  CHF: { symbol: 'CHF', name: 'Swiss Franc' }
  // Add more currencies as needed
};
```

#### BudgetPeriod

```typescript
class BudgetPeriod {
  constructor(
    public readonly type: BudgetPeriodType,
    public readonly startDate: Date,
    public readonly endDate: Date
  ) {
    if (endDate <= startDate) {
      throw new Error('End date must be after start date');
    }
  }

  static currentMonth(): BudgetPeriod {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return new BudgetPeriod(BudgetPeriodType.MONTHLY, start, end);
  }

  static custom(start: Date, end: Date): BudgetPeriod {
    return new BudgetPeriod(BudgetPeriodType.CUSTOM, start, end);
  }

  getDays(): number {
    const diff = this.endDate.getTime() - this.startDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  includes(date: Date): boolean {
    return date >= this.startDate && date <= this.endDate;
  }

  next(): BudgetPeriod {
    switch (this.type) {
      case BudgetPeriodType.WEEKLY:
        return this.addDays(7);
      case BudgetPeriodType.MONTHLY:
        return this.addMonths(1);
      case BudgetPeriodType.QUARTERLY:
        return this.addMonths(3);
      case BudgetPeriodType.YEARLY:
        return this.addYears(1);
      default:
        throw new Error('Cannot calculate next period for custom period');
    }
  }

  private addDays(days: number): BudgetPeriod {
    const newStart = new Date(this.startDate);
    newStart.setDate(newStart.getDate() + days);
    const newEnd = new Date(this.endDate);
    newEnd.setDate(newEnd.getDate() + days);
    return new BudgetPeriod(this.type, newStart, newEnd);
  }

  private addMonths(months: number): BudgetPeriod {
    const newStart = new Date(this.startDate);
    newStart.setMonth(newStart.getMonth() + months);
    const newEnd = new Date(this.endDate);
    newEnd.setMonth(newEnd.getMonth() + months);
    return new BudgetPeriod(this.type, newStart, newEnd);
  }

  private addYears(years: number): BudgetPeriod {
    const newStart = new Date(this.startDate);
    newStart.setFullYear(newStart.getFullYear() + years);
    const newEnd = new Date(this.endDate);
    newEnd.setFullYear(newEnd.getFullYear() + years);
    return new BudgetPeriod(this.type, newStart, newEnd);
  }
}
```

#### Merchant

```typescript
class Merchant {
  constructor(
    public readonly name: string,
    public readonly category?: TransactionCategory,
    public readonly logoUrl?: string
  ) {
    if (!name || name.trim().length === 0) {
      throw new Error('Merchant name cannot be empty');
    }
  }

  equals(other: Merchant): boolean {
    return this.name.toLowerCase() === other.name.toLowerCase();
  }

  toString(): string {
    return this.name;
  }
}
```

#### TransactionCategory

```typescript
enum TransactionCategory {
  // Income
  SALARY = 'salary',
  FREELANCE = 'freelance',
  INVESTMENT_INCOME = 'investment_income',
  OTHER_INCOME = 'other_income',

  // Housing
  RENT = 'rent',
  MORTGAGE = 'mortgage',
  UTILITIES = 'utilities',
  HOME_MAINTENANCE = 'home_maintenance',

  // Transportation
  FUEL = 'fuel',
  PUBLIC_TRANSPORT = 'public_transport',
  CAR_MAINTENANCE = 'car_maintenance',
  PARKING = 'parking',

  // Food
  GROCERIES = 'groceries',
  RESTAURANTS = 'restaurants',
  COFFEE_SHOPS = 'coffee_shops',

  // Shopping
  CLOTHING = 'clothing',
  ELECTRONICS = 'electronics',
  HOBBIES = 'hobbies',
  OTHER_SHOPPING = 'other_shopping',

  // Health
  MEDICAL = 'medical',
  PHARMACY = 'pharmacy',
  FITNESS = 'fitness',

  // Entertainment
  MOVIES = 'movies',
  CONCERTS = 'concerts',
  STREAMING = 'streaming',
  GAMES = 'games',

  // Travel
  FLIGHTS = 'flights',
  HOTELS = 'hotels',
  VACATION = 'vacation',

  // Bills
  INSURANCE = 'insurance',
  PHONE = 'phone',
  INTERNET = 'internet',
  SUBSCRIPTIONS = 'subscriptions',

  // Other
  GIFTS = 'gifts',
  DONATIONS = 'donations',
  FEES = 'fees',
  TAXES = 'taxes',
  UNCATEGORIZED = 'uncategorized'
}
```

## Domain Events

### Transaction Events

```typescript
interface TransactionRecorded extends DomainEvent {
  eventType: 'TransactionRecorded';
  aggregateType: 'Transaction';
  payload: {
    transactionId: string;
    userId: string;
    accountId: string;
    amount: number;
    currency: string;
    type: TransactionType;
    category: TransactionCategory;
    description: string;
    transactionDate: Date;
  };
}

interface TransactionCategorized extends DomainEvent {
  eventType: 'TransactionCategorized';
  aggregateType: 'Transaction';
  payload: {
    transactionId: string;
    category: TransactionCategory;
    categorizedAt: Date;
  };
}

interface TransactionCancelled extends DomainEvent {
  eventType: 'TransactionCancelled';
  aggregateType: 'Transaction';
  payload: {
    transactionId: string;
    cancelledAt: Date;
    reason: string;
  };
}
```

### Budget Events

```typescript
interface BudgetCreated extends DomainEvent {
  eventType: 'BudgetCreated';
  aggregateType: 'Budget';
  payload: {
    budgetId: string;
    userId: string;
    category: TransactionCategory;
    limit: number;
    currency: string;
    periodType: BudgetPeriodType;
    startDate: Date;
    endDate: Date;
  };
}

interface BudgetSpendingAdded extends DomainEvent {
  eventType: 'BudgetSpendingAdded';
  aggregateType: 'Budget';
  payload: {
    budgetId: string;
    transactionId: string;
    amount: number;
    newTotal: number;
  };
}

interface BudgetThresholdExceeded extends DomainEvent {
  eventType: 'BudgetThresholdExceeded';
  aggregateType: 'Budget';
  payload: {
    budgetId: string;
    category: TransactionCategory;
    threshold: number;
    spent: number;
    limit: number;
  };
}

interface BudgetExceeded extends DomainEvent {
  eventType: 'BudgetExceeded';
  aggregateType: 'Budget';
  payload: {
    budgetId: string;
    category: TransactionCategory;
    limit: number;
    spent: number;
    overage: number;
  };
}

interface BudgetReset extends DomainEvent {
  eventType: 'BudgetReset';
  aggregateType: 'Budget';
  payload: {
    budgetId: string;
    newPeriodStart: Date;
    newPeriodEnd: Date;
  };
}
```

### Account Events

```typescript
interface AccountCreated extends DomainEvent {
  eventType: 'AccountCreated';
  aggregateType: 'Account';
  payload: {
    accountId: string;
    userId: string;
    name: string;
    type: AccountType;
    currency: string;
  };
}

interface AccountBalanceUpdated extends DomainEvent {
  eventType: 'AccountBalanceUpdated';
  aggregateType: 'Account';
  payload: {
    accountId: string;
    transactionId: string;
    oldBalance: number;
    newBalance: number;
    currency: string;
  };
}

interface AccountSynced extends DomainEvent {
  eventType: 'AccountSynced';
  aggregateType: 'Account';
  payload: {
    accountId: string;
    provider: string;
    syncedAt: Date;
    balance: number;
    discrepancy: number;
  };
}
```

## Proactive Triggers

The Finance Context emits the following **Proactive Triggers** to the Proactivity Context. These are opportunities detected from financial data that may warrant user notification:

**Terminology Clarification:**
- **Data Signals:** Pull-based state data exposed via MCP (e.g., `finance.account_balance`, `finance.budget_status`)
- **Domain Events:** Push-based state changes (e.g., `TransactionRecorded`, `BudgetExceeded`)
- **Proactive Triggers:** Derived opportunities from financial analysis (below)

### 1. BUDGET_EXCEEDED
**Trigger:** Budget limit has been exceeded
**Data:**
```typescript
{
  triggerType: 'BUDGET_EXCEEDED',
  opportunityType: OpportunityType.URGENT,
  budgetId: string,
  category: TransactionCategory,
  limit: number,
  spent: number,
  overage: number,
  confidence: 1.0 // Always certain
}
```

### 2. UNUSUAL_SPENDING
**Trigger:** Spending pattern deviates significantly from normal
**Data:**
```typescript
{
  triggerType: 'UNUSUAL_SPENDING',
  opportunityType: OpportunityType.TIME_SENSITIVE,
  category: TransactionCategory,
  normalAmount: number,
  actualAmount: number,
  deviationPercentage: number,
  confidence: number
}
```

### 3. RECURRING_PAYMENT_DUE
**Trigger:** Recurring payment detected and upcoming
**Data:**
```typescript
{
  triggerType: 'RECURRING_PAYMENT_DUE',
  opportunityType: OpportunityType.TIME_SENSITIVE,
  description: string,
  amount: number,
  currency: string,
  dueDate: Date,
  confidence: number
}
```

### 4. SAVING_OPPORTUNITY
**Trigger:** Detected potential to save money (e.g., unused subscription)
**Data:**
```typescript
{
  triggerType: 'SAVING_OPPORTUNITY',
  opportunityType: OpportunityType.OPTIMIZATION,
  opportunityType: string,
  potentialSaving: number,
  reasoning: string,
  confidence: number
}
```

### 5. LOW_BALANCE
**Trigger:** Account balance below threshold
**Data:**
```typescript
{
  triggerType: 'LOW_BALANCE',
  opportunityType: OpportunityType.URGENT,
  accountId: string,
  accountName: string,
  balance: number,
  threshold: number,
  confidence: 1.0
}
```

**Note:** These triggers are sent to the Proactivity Context which evaluates them against user preferences and creates Suggestions if appropriate.

## Business Rules

### Transaction Rules

1. **Amount Validation:** Amount cannot be zero
2. **Date Validation:** Cannot record transactions in the future
3. **Currency Consistency:** Transaction currency must match account currency
4. **Category Requirement:** All transactions must have a category (default: UNCATEGORIZED)

### Budget Rules

1. **Positive Limit:** Budget limit must be positive
2. **Valid Period:** End date must be after start date
3. **Alert Thresholds:** Default thresholds at 50%, 75%, 90%, 100%
4. **Automatic Reset:** Budgets reset at start of new period

### Account Rules

1. **Unique Names:** Account names must be unique per user
2. **Balance Calculation:** Balance calculated from transactions, not manually set
3. **Currency Lock:** Account currency cannot change after creation
4. **Sync Discrepancy:** If external balance differs by >1%, emit warning

## Integration Patterns

### Banking API Integration (Anti-Corruption Layer)

```typescript
class PlaidACL {
  async importTransactions(
    accountId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> {
    const plaidTransactions = await this.mcpClient.callTool(
      'plaid_get_transactions',
      { accountId, startDate, endDate }
    );

    return plaidTransactions.map(pt => {
      return new Transaction(
        generateId(),
        this.userId,
        this.tenantId,
        Money.create(pt.amount, pt.currency),
        this.mapTransactionType(pt.amount),
        this.mapCategory(pt.category),
        pt.name,
        new Date(pt.date)
      ).tap(transaction => {
        transaction.setExternalId(pt.transaction_id, 'plaid');
        if (pt.merchant_name) {
          transaction.setMerchant(
            new Merchant(pt.merchant_name, undefined, pt.logo_url)
          );
        }
      });
    });
  }

  private mapTransactionType(amount: number): TransactionType {
    return amount < 0 ? TransactionType.EXPENSE : TransactionType.INCOME;
  }

  private mapCategory(plaidCategory: string[]): TransactionCategory {
    // Map Plaid's category hierarchy to our categories
    const categoryMap: Record<string, TransactionCategory> = {
      'Food and Drink': TransactionCategory.RESTAURANTS,
      'Groceries': TransactionCategory.GROCERIES,
      'Travel': TransactionCategory.VACATION,
      // ... more mappings
    };

    return categoryMap[plaidCategory[0]] || TransactionCategory.UNCATEGORIZED;
  }
}
```

### Budget Tracking (Domain Service)

```typescript
class BudgetTrackingService {
  async processTransaction(transaction: Transaction): Promise<void> {
    // Find relevant budgets
    const budgets = await this.budgetRepository.findByCategory(
      transaction.getUserId(),
      transaction.getCategory()
    );

    for (const budget of budgets) {
      // Add spending to budget
      const events = budget.addSpending(transaction);

      // Save budget
      await this.budgetRepository.save(budget);

      // Publish events
      for (const event of events) {
        await this.eventBus.publish(event);

        // Check if signal should be emitted
        if (event.eventType === 'BudgetExceeded') {
          await this.proactivityClient.emitSignal({
            signalType: 'BUDGET_EXCEEDED',
            budgetId: budget.getId(),
            category: budget.getCategory(),
            limit: budget.getLimit().amount,
            spent: budget.getCurrentSpending().amount,
            overage: budget.getCurrentSpending().amount - budget.getLimit().amount,
            confidence: 1.0
          });
        }
      }
    }
  }
}
```

## Use Cases

### 1. Record Transaction

**Actor:** User or External System (bank sync)

**Flow:**
1. Receive transaction data
2. Create Transaction aggregate
3. Validate invariants
4. Emit TransactionRecorded event
5. Update Account balance
6. Check relevant Budgets
7. Emit BudgetExceeded if applicable → Signal to Proactivity

### 2. Create Budget

**Actor:** User

**Flow:**
1. User specifies category, limit, period
2. Create Budget aggregate
3. Emit BudgetCreated event
4. Start tracking transactions for category

### 3. Sync Bank Account

**Actor:** System (scheduled job)

**Flow:**
1. Connect to bank via Plaid/FinAPI
2. Fetch new transactions
3. Use ACL to translate to domain model
4. Create Transaction aggregates
5. Update Account balance
6. Check for discrepancies
7. Emit AccountSynced event

### 4. Detect Unusual Spending

**Actor:** Proactivity Context (subscribes to TransactionRecorded)

**Flow:**
1. Listen for TransactionRecorded events
2. Compare transaction to historical patterns
3. If deviation > threshold: Emit UNUSUAL_SPENDING signal
4. Orchestrator presents warning to user

## Persistence

### Transaction Repository

```typescript
interface TransactionRepository {
  save(transaction: Transaction): Promise<void>;
  findById(id: string): Promise<Transaction | null>;
  findByAccountId(accountId: string): Promise<Transaction[]>;
  findByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]>;
  findByCategory(
    userId: string,
    category: TransactionCategory
  ): Promise<Transaction[]>;
}
```

### Budget Repository

```typescript
interface BudgetRepository {
  save(budget: Budget): Promise<void>;
  findById(id: string): Promise<Budget | null>;
  findByUserId(userId: string): Promise<Budget[]>;
  findByCategory(
    userId: string,
    category: TransactionCategory
  ): Promise<Budget[]>;
  findActive(userId: string): Promise<Budget[]>;
}
```

### Account Repository

```typescript
interface AccountRepository {
  save(account: Account): Promise<void>;
  findById(id: string): Promise<Account | null>;
  findByUserId(userId: string): Promise<Account[]>;
  findActive(userId: string): Promise<Account[]>;
}
```

## Testing Strategy

### Unit Tests

```typescript
describe('Budget', () => {
  it('should emit BudgetExceeded when limit surpassed', () => {
    const budget = createBudget(TransactionCategory.RESTAURANTS, 500);
    const transaction = createTransaction(TransactionCategory.RESTAURANTS, 600);

    const events = budget.addSpending(transaction);

    expect(events).toContainEventType('BudgetExceeded');
  });

  it('should emit threshold alerts at 50%, 75%, 90%', () => {
    const budget = createBudget(TransactionCategory.GROCERIES, 1000);

    // Add $500 (50%)
    let events = budget.addSpending(createTransaction(500));
    expect(events).toContainEventType('BudgetThresholdExceeded');

    // Add $250 (75%)
    events = budget.addSpending(createTransaction(250));
    expect(events).toContainEventType('BudgetThresholdExceeded');
  });
});
```

## Performance Considerations

1. **Transaction History:** Can grow very large
   - **Optimization:** Partition by date (monthly/yearly)
   - **Archival:** Move old transactions to cold storage

2. **Budget Calculations:** O(n) where n = transactions in period
   - **Optimization:** Cache current spending in Budget aggregate
   - **Update:** Incrementally update on each transaction

3. **Category Analysis:** Expensive for large date ranges
   - **Optimization:** Pre-aggregate monthly/yearly totals
   - **Materialized Views:** Create read models for analytics

## Future Considerations

1. **Multi-Currency Support:** Better handling of foreign transactions
2. **Investment Tracking:** Stocks, bonds, crypto
3. **Bill Prediction:** ML to predict upcoming bills
4. **Smart Categorization:** Auto-categorize based on merchant/description
5. **Financial Goals:** Save for specific goals (house, vacation, etc.)
6. **Debt Tracking:** Loans, credit card debt payoff plans

---

**End of Document**

# Aggregates & Entities

**Version:** 1.0
**Date:** 2025-10-27
**Status:** Draft

## Overview

This document defines the **Aggregates**, **Entities**, and **Value Objects** for all Bounded Contexts in Fidus using Domain-Driven Design principles.

## DDD Building Blocks

### Aggregate
An **Aggregate** is a cluster of domain objects (Entities and Value Objects) that can be treated as a single unit. Each Aggregate has:
- **Aggregate Root:** The main Entity that controls access to the aggregate
- **Boundary:** Only the root can be referenced from outside
- **Invariants:** Business rules that must always be true
- **Consistency:** All changes happen within transaction boundary

### Entity
An **Entity** is an object with a unique identity that persists over time. Two entities with the same attributes but different IDs are different objects.

### Value Object
A **Value Object** has no identity - it's defined by its attributes. Two value objects with the same attributes are considered equal.

---

## Aggregate Design Principles

1. **Small Aggregates:** Keep aggregates small for better performance
2. **Reference by ID:** Aggregates reference other aggregates by ID, not object reference
3. **One Transaction:** One aggregate = one transaction
4. **Invariant Protection:** Aggregates protect business rules
5. **Eventual Consistency:** Between aggregates, use eventual consistency via events

---

## Core Domain Aggregates

### Orchestration Context

#### OrchestrationSession (Aggregate Root)

**Identity:** Session ID
**Lifespan:** Duration of user interaction
**Invariants:**
- Must have a valid user ID
- Must have at least one intent detected
- Cannot route to non-existent supervisor

```typescript
class OrchestrationSession {
  // Identity
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  // State
  private status: 'active' | 'completed' | 'failed';
  private detectedIntent?: Intent;
  private routedSupervisors: string[] = [];
  private startedAt: Date;
  private completedAt?: Date;

  // Value Objects
  private userQuery: UserQuery;
  private context: ExecutionContext;

  constructor(id: string, userId: string, tenantId: string, query: string) {
    this.id = id;
    this.userId = userId;
    this.tenantId = tenantId;
    this.userQuery = new UserQuery(query);
    this.status = 'active';
    this.startedAt = new Date();
    this.context = ExecutionContext.create(userId);
  }

  // Command: Detect Intent
  detectIntent(intent: string, confidence: number): IntentDetected {
    if (confidence < 0.5) {
      throw new Error('Intent confidence too low');
    }

    this.detectedIntent = new Intent(intent, confidence);

    return new IntentDetected({
      sessionId: this.id,
      intent,
      confidence,
      userQuery: this.userQuery.value
    });
  }

  // Command: Route to Supervisor
  routeTo(supervisorId: string): SupervisorRouted {
    if (!this.detectedIntent) {
      throw new Error('Cannot route without detected intent');
    }

    this.routedSupervisors.push(supervisorId);

    return new SupervisorRouted({
      sessionId: this.id,
      supervisorId,
      intent: this.detectedIntent.value
    });
  }

  // Command: Complete Session
  complete(success: boolean): OrchestrationCompleted {
    this.status = success ? 'completed' : 'failed';
    this.completedAt = new Date();

    return new OrchestrationCompleted({
      sessionId: this.id,
      success,
      duration: this.getDuration()
    });
  }

  private getDuration(): number {
    return this.completedAt!.getTime() - this.startedAt.getTime();
  }

  // Query: Get State
  getStatus(): 'active' | 'completed' | 'failed' {
    return this.status;
  }
}
```

**Value Objects:**
```typescript
class UserQuery {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('User query cannot be empty');
    }
  }
}

class Intent {
  constructor(
    public readonly value: string,
    public readonly confidence: number
  ) {
    if (confidence < 0 || confidence > 1) {
      throw new Error('Confidence must be between 0 and 1');
    }
  }
}
```

---

### Proactivity Context

#### Opportunity (Aggregate Root)

**Identity:** Opportunity ID
**Lifespan:** Until user acts on it or dismisses it
**Invariants:**
- Must have confidence >= 0.7 to be suggested
- Cannot present same suggestion twice
- Must reference a valid Signal

```typescript
class Opportunity {
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  private signalId: string;
  private type: OpportunityType;
  private confidence: number;
  private status: 'identified' | 'presented' | 'accepted' | 'dismissed';
  private suggestion?: Suggestion;
  private identifiedAt: Date;
  private presentedAt?: Date;
  private actedAt?: Date;

  constructor(
    id: string,
    userId: string,
    tenantId: string,
    signalId: string,
    type: OpportunityType,
    confidence: number
  ) {
    if (confidence < 0.7) {
      throw new Error('Confidence too low for opportunity');
    }

    this.id = id;
    this.userId = userId;
    this.tenantId = tenantId;
    this.signalId = signalId;
    this.type = type;
    this.confidence = confidence;
    this.status = 'identified';
    this.identifiedAt = new Date();
  }

  // Command: Present to User
  present(suggestionText: string): SuggestionPresented {
    if (this.status !== 'identified') {
      throw new Error('Opportunity already presented or acted upon');
    }

    this.suggestion = new Suggestion(this.id, suggestionText);
    this.status = 'presented';
    this.presentedAt = new Date();

    return new SuggestionPresented({
      opportunityId: this.id,
      suggestionId: this.suggestion.id,
      suggestionText,
      confidence: this.confidence
    });
  }

  // Command: User Accepts
  accept(actionTaken: string): SuggestionAccepted {
    if (this.status !== 'presented') {
      throw new Error('Cannot accept unpresented suggestion');
    }

    this.status = 'accepted';
    this.actedAt = new Date();

    return new SuggestionAccepted({
      opportunityId: this.id,
      suggestionId: this.suggestion!.id,
      actionTaken
    });
  }

  // Command: User Dismisses
  dismiss(reason?: string): SuggestionDismissed {
    if (this.status !== 'presented') {
      throw new Error('Cannot dismiss unpresented suggestion');
    }

    this.status = 'dismissed';
    this.actedAt = new Date();

    return new SuggestionDismissed({
      opportunityId: this.id,
      suggestionId: this.suggestion!.id,
      reason
    });
  }

  // Query
  isRelevant(): boolean {
    return this.confidence >= 0.7;
  }
}
```

**Value Objects:**
```typescript
class OpportunityType {
  constructor(public readonly value: string) {
    const validTypes = [
      'MISSING_ALARM',
      'BUDGET_WARNING',
      'TRAVEL_NEEDED',
      'MISSING_ACCOMMODATION',
      'FOLLOW_UP_REMINDER'
    ];
    if (!validTypes.includes(value)) {
      throw new Error(`Invalid opportunity type: ${value}`);
    }
  }
}

class Suggestion {
  public readonly id: string;
  public readonly text: string;
  public readonly createdAt: Date;

  constructor(opportunityId: string, text: string) {
    this.id = `sug_${opportunityId}_${Date.now()}`;
    this.text = text;
    this.createdAt = new Date();
  }
}
```

---

## Supporting Domain Aggregates

### Identity & Access Context

#### User (Aggregate Root)

**Identity:** User ID
**Invariants:**
- Email must be unique
- Must belong to exactly one Tenant
- Cannot delete user with active sessions

```typescript
class User {
  private readonly id: string;
  private tenantId: string;
  private email: Email; // Value Object
  private passwordHash: string;
  private name: string;
  private status: 'active' | 'inactive' | 'suspended';
  private roles: Role[] = [];
  private createdAt: Date;
  private lastLoginAt?: Date;

  constructor(id: string, tenantId: string, email: string, name: string) {
    this.id = id;
    this.tenantId = tenantId;
    this.email = Email.create(email);
    this.name = name;
    this.status = 'active';
    this.createdAt = new Date();
  }

  // Command: Authenticate
  authenticate(password: string): UserAuthenticated {
    if (!this.verifyPassword(password)) {
      throw new Error('Invalid password');
    }

    if (this.status !== 'active') {
      throw new Error('User account is not active');
    }

    this.lastLoginAt = new Date();

    return new UserAuthenticated({
      userId: this.id,
      tenantId: this.tenantId
    });
  }

  // Command: Grant Role
  grantRole(role: Role): void {
    if (this.hasRole(role.name)) {
      throw new Error('User already has this role');
    }

    this.roles.push(role);
  }

  // Query: Check Permission
  hasPermission(permission: string): boolean {
    return this.roles.some(role => role.hasPermission(permission));
  }

  private hasRole(roleName: string): boolean {
    return this.roles.some(r => r.name === roleName);
  }

  private verifyPassword(password: string): boolean {
    // bcrypt comparison
    return true; // simplified
  }
}
```

**Entities within User Aggregate:**
```typescript
class Role {
  constructor(
    public readonly name: string,
    private permissions: Permission[]
  ) {}

  hasPermission(permission: string): boolean {
    return this.permissions.some(p => p.value === permission);
  }
}

class Permission {
  constructor(public readonly value: string) {}
}
```

**Value Objects:**
```typescript
class Email {
  private constructor(public readonly value: string) {}

  static create(email: string): Email {
    if (!this.isValid(email)) {
      throw new Error('Invalid email format');
    }
    return new Email(email.toLowerCase());
  }

  private static isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
```

---

#### Tenant (Aggregate Root)

**Identity:** Tenant ID
**Invariants:**
- Must have at least one admin user
- Cannot delete tenant with active users

```typescript
class Tenant {
  private readonly id: string;
  private name: string;
  private plan: 'community' | 'cloud' | 'enterprise';
  private status: 'active' | 'suspended' | 'cancelled';
  private quotas: TenantQuotas; // Value Object
  private createdAt: Date;

  constructor(id: string, name: string, plan: 'community' | 'cloud' | 'enterprise') {
    this.id = id;
    this.name = name;
    this.plan = plan;
    this.status = 'active';
    this.quotas = TenantQuotas.forPlan(plan);
    this.createdAt = new Date();
  }

  // Command: Upgrade Plan
  upgradePlan(newPlan: 'cloud' | 'enterprise'): void {
    if (this.plan === 'enterprise') {
      throw new Error('Already on highest plan');
    }

    this.plan = newPlan;
    this.quotas = TenantQuotas.forPlan(newPlan);
  }

  // Query: Check Quota
  canUseTokens(tokens: number): boolean {
    return this.quotas.canUseTokens(tokens);
  }
}
```

**Value Objects:**
```typescript
class TenantQuotas {
  constructor(
    public readonly llmTokensPerDay: number,
    public readonly maxUsers: number,
    public readonly maxPlugins: number
  ) {}

  static forPlan(plan: string): TenantQuotas {
    switch (plan) {
      case 'community':
        return new TenantQuotas(10000, 5, 10);
      case 'cloud':
        return new TenantQuotas(100000, 50, 50);
      case 'enterprise':
        return new TenantQuotas(1000000, -1, -1); // unlimited
      default:
        throw new Error('Invalid plan');
    }
  }

  canUseTokens(tokens: number): boolean {
    return tokens <= this.llmTokensPerDay;
  }
}
```

---

### Profile Context

#### UserProfile (Aggregate Root)

**Identity:** User ID (1:1 with User)
**Invariants:**
- Must have valid timezone
- Inferred preferences must have confidence >= 0.5

```typescript
class UserProfile {
  private readonly userId: string;
  private tenantId: string;

  // Explicit Data
  private timezone: Timezone; // Value Object
  private language: Language; // Value Object
  private explicitPreferences: Map<string, PreferenceValue> = new Map();

  // Inferred Data
  private inferredPreferences: Map<string, InferredPreference> = new Map();
  private interactionHistory: Interaction[] = [];

  constructor(userId: string, tenantId: string, timezone: string, language: string) {
    this.userId = userId;
    this.tenantId = tenantId;
    this.timezone = Timezone.create(timezone);
    this.language = Language.create(language);
  }

  // Command: Set Preference
  setPreference(category: string, key: string, value: any): PreferenceUpdated {
    const preference = new PreferenceValue(key, value);
    this.explicitPreferences.set(`${category}.${key}`, preference);

    return new PreferenceUpdated({
      userId: this.userId,
      category,
      key,
      value,
      isExplicit: true
    });
  }

  // Command: Infer Preference
  inferPreference(
    category: string,
    key: string,
    value: any,
    confidence: number,
    source: string
  ): PreferenceInferred {
    if (confidence < 0.5) {
      throw new Error('Confidence too low to infer preference');
    }

    const preference = new InferredPreference(key, value, confidence, source);
    this.inferredPreferences.set(`${category}.${key}`, preference);

    return new PreferenceInferred({
      userId: this.userId,
      category,
      key,
      value,
      confidence,
      inferredFrom: source
    });
  }

  // Command: Record Interaction
  recordInteraction(interaction: Interaction): void {
    this.interactionHistory.push(interaction);

    // Keep only last 1000 interactions
    if (this.interactionHistory.length > 1000) {
      this.interactionHistory = this.interactionHistory.slice(-1000);
    }
  }

  // Query: Get Preference
  getPreference(category: string, key: string): PreferenceValue | InferredPreference | null {
    const explicitKey = `${category}.${key}`;

    // Explicit preferences take precedence
    if (this.explicitPreferences.has(explicitKey)) {
      return this.explicitPreferences.get(explicitKey)!;
    }

    // Fall back to inferred
    return this.inferredPreferences.get(explicitKey) || null;
  }
}
```

**Entities:**
```typescript
class Interaction {
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly context: Record<string, any>,
    public readonly timestamp: Date
  ) {}
}
```

**Value Objects:**
```typescript
class Timezone {
  private constructor(public readonly value: string) {}

  static create(tz: string): Timezone {
    // Validate timezone (simplified)
    if (!tz || tz.length === 0) {
      throw new Error('Invalid timezone');
    }
    return new Timezone(tz);
  }
}

class Language {
  private constructor(public readonly value: string) {}

  static create(lang: string): Language {
    const validLanguages = ['en', 'de', 'fr', 'es', 'it'];
    if (!validLanguages.includes(lang)) {
      throw new Error('Invalid language');
    }
    return new Language(lang);
  }
}

class PreferenceValue {
  constructor(
    public readonly key: string,
    public readonly value: any
  ) {}
}

class InferredPreference extends PreferenceValue {
  constructor(
    key: string,
    value: any,
    public readonly confidence: number,
    public readonly source: string
  ) {
    super(key, value);
  }
}
```

---

### Plugin Context

#### Plugin (Aggregate Root)

**Identity:** Plugin ID
**Invariants:**
- Must have valid manifest
- Dependencies must be satisfied before activation
- Cannot activate if permissions not granted

```typescript
class Plugin {
  private readonly id: string;
  private name: string;
  private version: string;
  private type: 'supervisor' | 'tool' | 'connector';
  private manifest: PluginManifest; // Value Object
  private status: 'discovered' | 'installed' | 'activated' | 'deactivated';
  private dependencies: Dependency[] = [];
  private permissions: Permission[] = [];
  private installedAt?: Date;
  private activatedAt?: Date;

  constructor(id: string, manifest: PluginManifest) {
    this.id = id;
    this.name = manifest.name;
    this.version = manifest.version;
    this.type = manifest.type;
    this.manifest = manifest;
    this.status = 'discovered';
    this.dependencies = manifest.dependencies;
    this.permissions = manifest.permissions;
  }

  // Command: Install
  install(tenantId: string): PluginInstalled {
    if (this.status !== 'discovered') {
      throw new Error('Plugin already installed');
    }

    this.status = 'installed';
    this.installedAt = new Date();

    return new PluginInstalled({
      pluginId: this.id,
      pluginName: this.name,
      tenantId
    });
  }

  // Command: Activate
  activate(tenantId: string): PluginActivated {
    if (this.status !== 'installed') {
      throw new Error('Plugin must be installed before activation');
    }

    if (!this.areDependenciesSatisfied()) {
      throw new Error('Plugin dependencies not satisfied');
    }

    this.status = 'activated';
    this.activatedAt = new Date();

    return new PluginActivated({
      pluginId: this.id,
      pluginName: this.name,
      tenantId
    });
  }

  // Command: Deactivate
  deactivate(reason?: string): PluginDeactivated {
    if (this.status !== 'activated') {
      throw new Error('Plugin not activated');
    }

    this.status = 'deactivated';

    return new PluginDeactivated({
      pluginId: this.id,
      reason
    });
  }

  // Query
  private areDependenciesSatisfied(): boolean {
    // Check if all dependencies are installed
    return true; // simplified
  }

  getRequiredPermissions(): Permission[] {
    return this.permissions;
  }
}
```

**Value Objects:**
```typescript
class PluginManifest {
  constructor(
    public readonly name: string,
    public readonly version: string,
    public readonly type: 'supervisor' | 'tool' | 'connector',
    public readonly dependencies: Dependency[],
    public readonly permissions: Permission[]
  ) {}

  static fromJSON(json: any): PluginManifest {
    return new PluginManifest(
      json.name,
      json.version,
      json.type,
      json.dependencies || [],
      json.permissions || []
    );
  }
}

class Dependency {
  constructor(
    public readonly name: string,
    public readonly version: string
  ) {}
}
```

---

## Domain Context Aggregates

### Calendar Context

#### Appointment (Aggregate Root)

**Identity:** Appointment ID
**Invariants:**
- End time must be after start time
- Cannot have more than 50 participants
- Location required for in-person meetings

```typescript
class Appointment {
  private readonly id: string;
  private readonly userId: string;
  private tenantId: string;

  private title: string;
  private timeSlot: TimeSlot; // Value Object
  private location?: Location; // Value Object
  private participants: Participant[] = [];
  private recurrence?: RecurrenceRule; // Value Object
  private status: 'scheduled' | 'confirmed' | 'cancelled';
  private createdAt: Date;

  constructor(
    id: string,
    userId: string,
    tenantId: string,
    title: string,
    startTime: Date,
    endTime: Date
  ) {
    this.id = id;
    this.userId = userId;
    this.tenantId = tenantId;
    this.title = title;
    this.timeSlot = TimeSlot.create(startTime, endTime);
    this.status = 'scheduled';
    this.createdAt = new Date();
  }

  // Command: Update
  update(changes: Partial<AppointmentData>): AppointmentUpdated {
    if (this.status === 'cancelled') {
      throw new Error('Cannot update cancelled appointment');
    }

    if (changes.startTime || changes.endTime) {
      this.timeSlot = TimeSlot.create(
        changes.startTime || this.timeSlot.start,
        changes.endTime || this.timeSlot.end
      );
    }

    if (changes.title) this.title = changes.title;
    if (changes.location) this.location = Location.create(changes.location);

    return new AppointmentUpdated({
      appointmentId: this.id,
      changes
    });
  }

  // Command: Add Participant
  addParticipant(email: string, role: 'organizer' | 'attendee'): void {
    if (this.participants.length >= 50) {
      throw new Error('Cannot have more than 50 participants');
    }

    const participant = new Participant(email, role);
    this.participants.push(participant);
  }

  // Command: Cancel
  cancel(reason?: string): AppointmentCancelled {
    if (this.status === 'cancelled') {
      throw new Error('Appointment already cancelled');
    }

    this.status = 'cancelled';

    return new AppointmentCancelled({
      appointmentId: this.id,
      reason
    });
  }

  // Query: Check Conflict
  conflictsWith(other: Appointment): boolean {
    return this.timeSlot.overlapsWith(other.timeSlot);
  }

  // Query
  isUpcoming(): boolean {
    return this.timeSlot.start > new Date() && this.status !== 'cancelled';
  }
}
```

**Entities:**
```typescript
class Participant {
  constructor(
    public readonly email: string,
    public readonly role: 'organizer' | 'attendee'
  ) {}
}
```

**Value Objects:**
```typescript
class TimeSlot {
  private constructor(
    public readonly start: Date,
    public readonly end: Date
  ) {}

  static create(start: Date, end: Date): TimeSlot {
    if (end <= start) {
      throw new Error('End time must be after start time');
    }
    return new TimeSlot(start, end);
  }

  overlapsWith(other: TimeSlot): boolean {
    return this.start < other.end && this.end > other.start;
  }

  getDuration(): number {
    return this.end.getTime() - this.start.getTime();
  }
}

class Location {
  private constructor(
    public readonly type: 'physical' | 'virtual',
    public readonly value: string
  ) {}

  static create(value: string): Location {
    // Detect if URL (virtual) or address (physical)
    const isUrl = value.startsWith('http://') || value.startsWith('https://');
    return new Location(isUrl ? 'virtual' : 'physical', value);
  }
}

class RecurrenceRule {
  constructor(
    public readonly frequency: 'daily' | 'weekly' | 'monthly' | 'yearly',
    public readonly interval: number,
    public readonly until?: Date
  ) {}

  // RFC 5545 RRULE format
  toRRule(): string {
    let rrule = `FREQ=${this.frequency.toUpperCase()};INTERVAL=${this.interval}`;
    if (this.until) {
      rrule += `;UNTIL=${this.until.toISOString()}`;
    }
    return rrule;
  }
}
```

---

### Finance Context

#### Transaction (Aggregate Root)

**Identity:** Transaction ID
**Invariants:**
- Amount cannot be zero
- Must have valid currency
- Cannot modify after reconciled

```typescript
class Transaction {
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  private amount: Money; // Value Object
  private type: 'income' | 'expense' | 'transfer';
  private category?: string;
  private merchant?: string;
  private date: Date;
  private accountId: string;
  private status: 'pending' | 'cleared' | 'reconciled';
  private createdAt: Date;

  constructor(
    id: string,
    userId: string,
    tenantId: string,
    amount: number,
    currency: string,
    type: 'income' | 'expense' | 'transfer'
  ) {
    this.id = id;
    this.userId = userId;
    this.tenantId = tenantId;
    this.amount = Money.create(amount, currency);
    this.type = type;
    this.date = new Date();
    this.status = 'pending';
    this.createdAt = new Date();
  }

  // Command: Categorize
  categorize(category: string, categorizedBy: 'user' | 'ai'): TransactionCategorized {
    if (this.status === 'reconciled') {
      throw new Error('Cannot modify reconciled transaction');
    }

    this.category = category;

    return new TransactionCategorized({
      transactionId: this.id,
      category,
      categorizedBy
    });
  }

  // Command: Clear
  clear(): void {
    if (this.status === 'reconciled') {
      throw new Error('Already reconciled');
    }

    this.status = 'cleared';
  }

  // Command: Reconcile
  reconcile(): void {
    if (this.status !== 'cleared') {
      throw new Error('Transaction must be cleared before reconciliation');
    }

    this.status = 'reconciled';
  }

  // Query
  getAmount(): Money {
    return this.amount;
  }

  isExpense(): boolean {
    return this.type === 'expense';
  }
}
```

**Value Objects:**
```typescript
class Money {
  private constructor(
    public readonly amount: number,
    public readonly currency: Currency
  ) {}

  static create(amount: number, currency: string): Money {
    if (amount === 0) {
      throw new Error('Amount cannot be zero');
    }
    return new Money(amount, Currency.create(currency));
  }

  add(other: Money): Money {
    if (!this.currency.equals(other.currency)) {
      throw new Error('Cannot add money with different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  isNegative(): boolean {
    return this.amount < 0;
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency.equals(other.currency);
  }
}

class Currency {
  private constructor(public readonly code: string) {}

  static create(code: string): Currency {
    const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY'];
    if (!validCurrencies.includes(code)) {
      throw new Error(`Invalid currency: ${code}`);
    }
    return new Currency(code);
  }

  equals(other: Currency): boolean {
    return this.code === other.code;
  }
}
```

---

#### Budget (Aggregate Root)

**Identity:** Budget ID
**Invariants:**
- Amount must be positive
- Period must be valid
- Cannot exceed budget if hard limit

```typescript
class Budget {
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  private category: string;
  private limit: Money; // Value Object
  private period: BudgetPeriod; // Value Object
  private type: 'hard_limit' | 'soft_target';
  private currentSpending: Money;
  private createdAt: Date;

  constructor(
    id: string,
    userId: string,
    tenantId: string,
    category: string,
    amount: number,
    currency: string,
    period: 'weekly' | 'monthly' | 'yearly'
  ) {
    this.id = id;
    this.userId = userId;
    this.tenantId = tenantId;
    this.category = category;
    this.limit = Money.create(amount, currency);
    this.period = BudgetPeriod.create(period);
    this.type = 'soft_target';
    this.currentSpending = Money.create(0, currency);
    this.createdAt = new Date();
  }

  // Command: Add Spending
  addSpending(transaction: Transaction): BudgetExceeded | null {
    if (transaction.getCategory() !== this.category) {
      throw new Error('Transaction category does not match budget');
    }

    this.currentSpending = this.currentSpending.add(transaction.getAmount());

    if (this.isExceeded()) {
      return new BudgetExceeded({
        budgetId: this.id,
        category: this.category,
        limit: this.limit.amount,
        spent: this.currentSpending.amount
      });
    }

    return null;
  }

  // Query: Check if Exceeded
  isExceeded(): boolean {
    return this.currentSpending.amount > this.limit.amount;
  }

  // Query: Get Percentage Used
  getPercentageUsed(): number {
    return (this.currentSpending.amount / this.limit.amount) * 100;
  }

  // Query: Remaining Budget
  getRemainingBudget(): Money {
    const remaining = this.limit.amount - this.currentSpending.amount;
    return Money.create(Math.max(0, remaining), this.limit.currency.code);
  }
}
```

**Value Objects:**
```typescript
class BudgetPeriod {
  private constructor(
    public readonly type: 'weekly' | 'monthly' | 'yearly'
  ) {}

  static create(type: 'weekly' | 'monthly' | 'yearly'): BudgetPeriod {
    return new BudgetPeriod(type);
  }

  getCurrentPeriodStart(): Date {
    const now = new Date();
    switch (this.type) {
      case 'weekly':
        // Start of week (Monday)
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(now.setDate(diff));
      case 'monthly':
        return new Date(now.getFullYear(), now.getMonth(), 1);
      case 'yearly':
        return new Date(now.getFullYear(), 0, 1);
    }
  }
}
```

---

### Travel Context

#### Trip (Aggregate Root)

**Identity:** Trip ID
**Invariants:**
- Must have valid destination
- Outbound date must be before inbound date
- Cannot book if already booked

```typescript
class Trip {
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  private destination: Destination; // Value Object
  private timeframe: TripTimeframe; // Value Object
  private purpose?: 'business' | 'leisure' | 'family';
  private status: 'planned' | 'booked' | 'in_progress' | 'completed' | 'cancelled';
  private bookings: Booking[] = [];
  private itinerary?: Itinerary;
  private createdAt: Date;

  constructor(
    id: string,
    userId: string,
    tenantId: string,
    destination: string,
    outboundDate: Date,
    inboundDate: Date
  ) {
    this.id = id;
    this.userId = userId;
    this.tenantId = tenantId;
    this.destination = Destination.create(destination);
    this.timeframe = TripTimeframe.create(outboundDate, inboundDate);
    this.status = 'planned';
    this.createdAt = new Date();
  }

  // Command: Add Booking
  addBooking(
    type: 'flight' | 'hotel' | 'car',
    confirmationNumber: string,
    provider: string,
    cost: Money
  ): BookingConfirmed {
    if (this.status === 'cancelled') {
      throw new Error('Cannot add booking to cancelled trip');
    }

    const booking = new Booking(type, confirmationNumber, provider, cost);
    this.bookings.push(booking);

    // Auto-mark as booked if we have flight + hotel
    if (this.hasFlightAndHotel()) {
      this.status = 'booked';
    }

    return new BookingConfirmed({
      tripId: this.id,
      bookingType: type,
      confirmationNumber,
      cost
    });
  }

  // Command: Start Trip
  start(): TripStarted {
    if (this.status !== 'booked') {
      throw new Error('Trip must be booked before starting');
    }

    this.status = 'in_progress';

    return new TripStarted({
      tripId: this.id,
      destination: this.destination.city
    });
  }

  // Command: Complete Trip
  complete(): TripCompleted {
    if (this.status !== 'in_progress') {
      throw new Error('Trip not in progress');
    }

    this.status = 'completed';

    return new TripCompleted({
      tripId: this.id,
      destination: this.destination.city,
      duration: this.timeframe.getDuration()
    });
  }

  // Query
  private hasFlightAndHotel(): boolean {
    const hasFlight = this.bookings.some(b => b.type === 'flight');
    const hasHotel = this.bookings.some(b => b.type === 'hotel');
    return hasFlight && hasHotel;
  }

  getTotalCost(): Money {
    if (this.bookings.length === 0) {
      return Money.create(0, 'EUR');
    }

    return this.bookings.reduce(
      (total, booking) => total.add(booking.cost),
      Money.create(0, this.bookings[0].cost.currency.code)
    );
  }
}
```

**Entities:**
```typescript
class Booking {
  public readonly id: string;

  constructor(
    public readonly type: 'flight' | 'hotel' | 'car' | 'activity',
    public readonly confirmationNumber: string,
    public readonly provider: string,
    public readonly cost: Money
  ) {
    this.id = `booking_${Date.now()}_${Math.random()}`;
  }
}
```

**Value Objects:**
```typescript
class Destination {
  private constructor(
    public readonly city: string,
    public readonly country: string
  ) {}

  static create(destination: string): Destination {
    // Parse "Berlin, Germany" or just "Berlin"
    const parts = destination.split(',').map(s => s.trim());
    if (parts.length === 2) {
      return new Destination(parts[0], parts[1]);
    }
    return new Destination(destination, 'Unknown');
  }

  toString(): string {
    return `${this.city}, ${this.country}`;
  }
}

class TripTimeframe {
  private constructor(
    public readonly outbound: Date,
    public readonly inbound: Date
  ) {}

  static create(outbound: Date, inbound: Date): TripTimeframe {
    if (inbound <= outbound) {
      throw new Error('Inbound date must be after outbound date');
    }
    return new TripTimeframe(outbound, inbound);
  }

  getDuration(): number {
    return Math.ceil((this.inbound.getTime() - this.outbound.getTime()) / (1000 * 60 * 60 * 24));
  }
}
```

---

## Aggregate Design Patterns

### Small Aggregates Pattern

**Problem:** Large aggregates hurt performance and concurrency.

**Solution:** Keep aggregates small, reference other aggregates by ID.

```typescript
// ❌ Bad: Large Aggregate
class User {
  private appointments: Appointment[] = []; // Don't embed!
  private transactions: Transaction[] = []; // Don't embed!
}

// ✅ Good: Small Aggregate
class User {
  private readonly id: string;
  // Reference appointments by ID
  // Fetch via repository when needed
}
```

---

### Eventual Consistency Pattern

**Problem:** Need to update multiple aggregates atomically.

**Solution:** Update one aggregate, emit event, let others update eventually.

```typescript
// User books a flight
class TripService {
  async bookFlight(tripId: string, flightDetails: FlightDetails) {
    // 1. Update Trip aggregate (immediate consistency)
    const trip = await this.tripRepository.findById(tripId);
    const event = trip.addBooking('flight', flightDetails);

    await this.tripRepository.save(trip);

    // 2. Emit event
    await this.eventBus.publish(event);

    // 3. Other aggregates update eventually:
    //    - Calendar Context: blocks time (via event subscription)
    //    - Finance Context: records transaction (via event subscription)
  }
}
```

---

## Summary

**Key Principles:**
- ✅ Aggregates are consistency boundaries
- ✅ One aggregate = one transaction
- ✅ Reference other aggregates by ID
- ✅ Use events for cross-aggregate changes
- ✅ Keep aggregates small
- ✅ Protect invariants within aggregate
- ✅ Value objects are immutable

---

**End of Document**

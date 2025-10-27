# Shared Value Objects

## Overview

This document defines **Shared Value Objects** that are used across multiple Bounded Contexts in Fidus. These value objects represent common domain concepts that have consistent meaning and behavior regardless of which context uses them.

**Design Principle:** Value objects are immutable, have no identity, and are compared by their values rather than by reference. Shared value objects promote consistency and reduce duplication across contexts.

---

## Multi-Tenancy Value Objects

### TenantId

Unique identifier for a tenant.

```typescript
class TenantId {
  constructor(public readonly value: string) {
    if (!value || value.length === 0) {
      throw new Error('TenantId cannot be empty');
    }
  }

  equals(other: TenantId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
```

### UserId

Unique identifier for a user.

```typescript
class UserId {
  constructor(public readonly value: string) {
    if (!value || value.length === 0) {
      throw new Error('UserId cannot be empty');
    }
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
```

---

## Temporal Value Objects

### TimeRange

Represents a time period with start and end.

```typescript
class TimeRange {
  constructor(
    public readonly start: Date,
    public readonly end: Date
  ) {
    if (start >= end) {
      throw new Error('Start must be before end');
    }
  }

  getDurationMinutes(): number {
    return (this.end.getTime() - this.start.getTime()) / (1000 * 60);
  }

  getDurationHours(): number {
    return this.getDurationMinutes() / 60;
  }

  contains(timestamp: Date): boolean {
    return timestamp >= this.start && timestamp <= this.end;
  }

  overlaps(other: TimeRange): boolean {
    return this.start < other.end && other.start < this.end;
  }

  static fromDuration(start: Date, durationMinutes: number): TimeRange {
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
    return new TimeRange(start, end);
  }
}
```

**Used by:**
- Calendar Context (event time ranges, availability windows)
- Proactivity Context (opportunity time windows)
- Profile Context (time patterns for habits)

### Duration

Represents a length of time.

```typescript
class Duration {
  constructor(public readonly milliseconds: number) {
    if (milliseconds < 0) {
      throw new Error('Duration cannot be negative');
    }
  }

  get seconds(): number {
    return this.milliseconds / 1000;
  }

  get minutes(): number {
    return this.seconds / 60;
  }

  get hours(): number {
    return this.minutes / 60;
  }

  get days(): number {
    return this.hours / 24;
  }

  static seconds(seconds: number): Duration {
    return new Duration(seconds * 1000);
  }

  static minutes(minutes: number): Duration {
    return new Duration(minutes * 60 * 1000);
  }

  static hours(hours: number): Duration {
    return new Duration(hours * 60 * 60 * 1000);
  }

  static days(days: number): Duration {
    return new Duration(days * 24 * 60 * 60 * 1000);
  }

  add(other: Duration): Duration {
    return new Duration(this.milliseconds + other.milliseconds);
  }

  subtract(other: Duration): Duration {
    return new Duration(Math.max(0, this.milliseconds - other.milliseconds));
  }

  toMilliseconds(): number {
    return this.milliseconds;
  }

  toISOString(): string {
    // ISO 8601 duration format
    const hours = Math.floor(this.hours);
    const minutes = Math.floor(this.minutes % 60);
    const seconds = Math.floor(this.seconds % 60);
    return `PT${hours}H${minutes}M${seconds}S`;
  }
}
```

**Used by:**
- Calendar Context (event duration, buffer time)
- Travel Context (travel duration, flight duration)
- Audit & Compliance Context (retention policy duration)

### RecurrencePattern

Represents a recurring schedule.

```typescript
class RecurrencePattern {
  constructor(
    public readonly frequency: RecurrenceFrequency,
    public readonly interval: number,
    public readonly daysOfWeek?: DayOfWeek[],
    public readonly dayOfMonth?: number,
    public readonly monthOfYear?: number,
    public readonly until?: Date,
    public readonly count?: number
  ) {
    if (interval < 1) {
      throw new Error('Interval must be at least 1');
    }
    if (until && count) {
      throw new Error('Cannot specify both until and count');
    }
  }

  static daily(interval: number = 1): RecurrencePattern {
    return new RecurrencePattern(RecurrenceFrequency.DAILY, interval);
  }

  static weekly(daysOfWeek: DayOfWeek[], interval: number = 1): RecurrencePattern {
    return new RecurrencePattern(
      RecurrenceFrequency.WEEKLY,
      interval,
      daysOfWeek
    );
  }

  static monthly(dayOfMonth: number, interval: number = 1): RecurrencePattern {
    return new RecurrencePattern(
      RecurrenceFrequency.MONTHLY,
      interval,
      undefined,
      dayOfMonth
    );
  }

  static yearly(monthOfYear: number, dayOfMonth: number): RecurrencePattern {
    return new RecurrencePattern(
      RecurrenceFrequency.YEARLY,
      1,
      undefined,
      dayOfMonth,
      monthOfYear
    );
  }

  getNextOccurrence(after: Date): Date | null {
    // Calculate next occurrence based on pattern
    // Implementation depends on frequency
    switch (this.frequency) {
      case RecurrenceFrequency.DAILY:
        return new Date(after.getTime() + this.interval * 24 * 60 * 60 * 1000);
      case RecurrenceFrequency.WEEKLY:
        return this.getNextWeeklyOccurrence(after);
      case RecurrenceFrequency.MONTHLY:
        return this.getNextMonthlyOccurrence(after);
      case RecurrenceFrequency.YEARLY:
        return this.getNextYearlyOccurrence(after);
    }
  }

  private getNextWeeklyOccurrence(after: Date): Date | null {
    if (!this.daysOfWeek || this.daysOfWeek.length === 0) return null;

    const result = new Date(after);
    result.setDate(result.getDate() + 1); // Start from next day

    // Find next matching day of week
    for (let i = 0; i < 7; i++) {
      if (this.daysOfWeek.includes(result.getDay() as DayOfWeek)) {
        return result;
      }
      result.setDate(result.getDate() + 1);
    }

    return null;
  }

  private getNextMonthlyOccurrence(after: Date): Date | null {
    if (!this.dayOfMonth) return null;

    const result = new Date(after);
    result.setMonth(result.getMonth() + this.interval);
    result.setDate(this.dayOfMonth);

    return result;
  }

  private getNextYearlyOccurrence(after: Date): Date | null {
    if (!this.monthOfYear || !this.dayOfMonth) return null;

    const result = new Date(after);
    result.setFullYear(result.getFullYear() + this.interval);
    result.setMonth(this.monthOfYear);
    result.setDate(this.dayOfMonth);

    return result;
  }

  toRRule(): string {
    // Convert to RFC 5545 RRULE format
    const parts: string[] = [];
    parts.push(`FREQ=${this.frequency}`);

    if (this.interval > 1) {
      parts.push(`INTERVAL=${this.interval}`);
    }

    if (this.daysOfWeek && this.daysOfWeek.length > 0) {
      const days = this.daysOfWeek.map(d => ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'][d]);
      parts.push(`BYDAY=${days.join(',')}`);
    }

    if (this.dayOfMonth) {
      parts.push(`BYMONTHDAY=${this.dayOfMonth}`);
    }

    if (this.monthOfYear) {
      parts.push(`BYMONTH=${this.monthOfYear + 1}`);
    }

    if (this.until) {
      parts.push(`UNTIL=${this.until.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
    }

    if (this.count) {
      parts.push(`COUNT=${this.count}`);
    }

    return `RRULE:${parts.join(';')}`;
  }
}

enum RecurrenceFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

enum DayOfWeek {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6
}
```

**Used by:**
- Calendar Context (recurring events, meeting series)
- Finance Context (recurring transactions, subscriptions)
- Proactivity Context (scheduled notifications)

---

## Contact Value Objects

### Email

Email address with validation.

```typescript
class Email {
  constructor(public readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error('Invalid email address');
    }
  }

  private isValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  getDomain(): string {
    return this.value.split('@')[1];
  }

  getLocalPart(): string {
    return this.value.split('@')[0];
  }

  equals(other: Email): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }

  toString(): string {
    return this.value;
  }
}
```

**Used by:**
- Identity Context (user registration, login)
- Profile Context (contact information)
- Communication Context (email recipients)

### PhoneNumber

Phone number with international format.

```typescript
class PhoneNumber {
  constructor(
    public readonly countryCode: string,
    public readonly number: string
  ) {
    if (!this.isValidCountryCode(countryCode)) {
      throw new Error('Invalid country code');
    }
    if (!this.isValidNumber(number)) {
      throw new Error('Invalid phone number');
    }
  }

  private isValidCountryCode(code: string): boolean {
    return /^\+\d{1,3}$/.test(code);
  }

  private isValidNumber(number: string): boolean {
    return /^\d{6,15}$/.test(number.replace(/[\s\-()]/g, ''));
  }

  static parse(phoneString: string): PhoneNumber {
    // Parse international format: +1 (555) 123-4567
    const cleaned = phoneString.replace(/[\s\-()]/g, '');
    const match = cleaned.match(/^(\+\d{1,3})(\d{6,15})$/);

    if (!match) {
      throw new Error('Invalid phone number format');
    }

    return new PhoneNumber(match[1], match[2]);
  }

  format(): string {
    // Format as international: +1 (555) 123-4567
    if (this.countryCode === '+1' && this.number.length === 10) {
      return `${this.countryCode} (${this.number.slice(0, 3)}) ${this.number.slice(3, 6)}-${this.number.slice(6)}`;
    }
    return `${this.countryCode} ${this.number}`;
  }

  toString(): string {
    return `${this.countryCode}${this.number}`;
  }

  equals(other: PhoneNumber): boolean {
    return this.toString() === other.toString();
  }
}
```

**Used by:**
- Identity Context (two-factor authentication)
- Profile Context (contact information)
- Communication Context (SMS, calls)

### Address

Physical address.

```typescript
class Address {
  constructor(
    public readonly street: string,
    public readonly city: string,
    public readonly state: string,
    public readonly postalCode: string,
    public readonly country: string,
    public readonly apartment?: string
  ) {}

  getFullAddress(): string {
    const parts = [this.street];
    if (this.apartment) parts.push(this.apartment);
    parts.push(this.city);
    parts.push(`${this.state} ${this.postalCode}`);
    parts.push(this.country);
    return parts.join(', ');
  }

  getShortAddress(): string {
    return `${this.city}, ${this.state}`;
  }

  equals(other: Address): boolean {
    return (
      this.street === other.street &&
      this.city === other.city &&
      this.state === other.state &&
      this.postalCode === other.postalCode &&
      this.country === other.country &&
      this.apartment === other.apartment
    );
  }
}
```

**Used by:**
- Profile Context (user location)
- Travel Context (destinations, hotels)
- Shopping Context (delivery addresses)

---

## Location Value Objects

### Coordinates

Geographic coordinates (latitude/longitude).

```typescript
class Coordinates {
  constructor(
    public readonly latitude: number,
    public readonly longitude: number
  ) {
    if (latitude < -90 || latitude > 90) {
      throw new Error('Latitude must be between -90 and 90');
    }
    if (longitude < -180 || longitude > 180) {
      throw new Error('Longitude must be between -180 and 180');
    }
  }

  distanceTo(other: Coordinates): number {
    // Haversine formula for great-circle distance
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(other.latitude - this.latitude);
    const dLon = this.toRadians(other.longitude - this.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(this.latitude)) *
      Math.cos(this.toRadians(other.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  equals(other: Coordinates): boolean {
    return this.latitude === other.latitude && this.longitude === other.longitude;
  }

  toString(): string {
    return `${this.latitude},${this.longitude}`;
  }
}
```

**Used by:**
- Travel Context (locations, routes)
- Profile Context (user location)
- Audit Context (geolocation of events)

### Timezone

Timezone with IANA identifier.

```typescript
class Timezone {
  constructor(public readonly ianaIdentifier: string) {
    if (!this.isValid(ianaIdentifier)) {
      throw new Error('Invalid timezone identifier');
    }
  }

  private isValid(identifier: string): boolean {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: identifier });
      return true;
    } catch {
      return false;
    }
  }

  getOffset(date: Date = new Date()): number {
    // Get offset in minutes
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: this.ianaIdentifier,
      timeZoneName: 'shortOffset'
    });

    const parts = formatter.formatToParts(date);
    const offset = parts.find(p => p.type === 'timeZoneName')?.value || '+0';
    const [hours, minutes] = offset.replace('GMT', '').split(':').map(Number);
    return (hours || 0) * 60 + (minutes || 0);
  }

  convertToLocal(utcDate: Date): Date {
    return new Date(utcDate.toLocaleString('en-US', { timeZone: this.ianaIdentifier }));
  }

  convertToUTC(localDate: Date): Date {
    const offset = this.getOffset(localDate);
    return new Date(localDate.getTime() - offset * 60 * 1000);
  }

  equals(other: Timezone): boolean {
    return this.ianaIdentifier === other.ianaIdentifier;
  }

  toString(): string {
    return this.ianaIdentifier;
  }
}
```

**Used by:**
- Profile Context (user timezone)
- Calendar Context (event timezones)
- Travel Context (destination timezones)

---

## Money Value Objects

### Money

Amount of money with currency.

```typescript
class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: Currency
  ) {
    if (!Number.isFinite(amount)) {
      throw new Error('Amount must be a finite number');
    }
  }

  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    this.ensureSameCurrency(other);
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

  negate(): Money {
    return new Money(-this.amount, this.currency);
  }

  isPositive(): boolean {
    return this.amount > 0;
  }

  isNegative(): boolean {
    return this.amount < 0;
  }

  isZero(): boolean {
    return this.amount === 0;
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency.equals(other.currency);
  }

  private ensureSameCurrency(other: Money): void {
    if (!this.currency.equals(other.currency)) {
      throw new Error('Cannot perform operation on different currencies');
    }
  }

  format(): string {
    return this.currency.format(this.amount);
  }

  toString(): string {
    return `${this.amount} ${this.currency.code}`;
  }
}
```

**Used by:**
- Finance Context (transactions, balances, budgets)
- Travel Context (flight prices, hotel costs)
- Shopping Context (product prices, order totals)

### Currency

Currency with ISO 4217 code.

```typescript
class Currency {
  constructor(
    public readonly code: string,
    public readonly symbol: string,
    public readonly decimals: number
  ) {
    if (code.length !== 3) {
      throw new Error('Currency code must be 3 characters');
    }
  }

  static readonly USD = new Currency('USD', '$', 2);
  static readonly EUR = new Currency('EUR', '€', 2);
  static readonly GBP = new Currency('GBP', '£', 2);
  static readonly JPY = new Currency('JPY', '¥', 0);
  static readonly CHF = new Currency('CHF', 'CHF', 2);
  static readonly CAD = new Currency('CAD', 'CA$', 2);
  static readonly AUD = new Currency('AUD', 'A$', 2);

  format(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.code,
      minimumFractionDigits: this.decimals,
      maximumFractionDigits: this.decimals
    }).format(amount);
  }

  equals(other: Currency): boolean {
    return this.code === other.code;
  }

  toString(): string {
    return this.code;
  }
}
```

**Used by:**
- Finance Context (accounts, transactions)
- Travel Context (booking prices)
- Shopping Context (product prices)

---

## Priority & Severity Value Objects

### Priority

Indicates importance/urgency of items.

```typescript
enum Priority {
  CRITICAL = 'CRITICAL',  // Drop everything
  HIGH = 'HIGH',          // Today
  MEDIUM = 'MEDIUM',      // This week
  LOW = 'LOW',            // Sometime
  NONE = 'NONE'           // No priority
}

class PriorityValue {
  constructor(public readonly priority: Priority) {}

  static critical(): PriorityValue {
    return new PriorityValue(Priority.CRITICAL);
  }

  static high(): PriorityValue {
    return new PriorityValue(Priority.HIGH);
  }

  static medium(): PriorityValue {
    return new PriorityValue(Priority.MEDIUM);
  }

  static low(): PriorityValue {
    return new PriorityValue(Priority.LOW);
  }

  isHigherThan(other: PriorityValue): boolean {
    const order = [Priority.NONE, Priority.LOW, Priority.MEDIUM, Priority.HIGH, Priority.CRITICAL];
    return order.indexOf(this.priority) > order.indexOf(other.priority);
  }

  getNumericValue(): number {
    const values = {
      [Priority.CRITICAL]: 4,
      [Priority.HIGH]: 3,
      [Priority.MEDIUM]: 2,
      [Priority.LOW]: 1,
      [Priority.NONE]: 0
    };
    return values[this.priority];
  }

  equals(other: PriorityValue): boolean {
    return this.priority === other.priority;
  }

  toString(): string {
    return this.priority;
  }
}
```

**Used by:**
- Orchestration Context (task prioritization)
- Proactivity Context (suggestion priority)
- Communication Context (message priority)

### ConfidenceScore

Indicates confidence level in predictions/suggestions.

```typescript
class ConfidenceScore {
  constructor(public readonly value: number) {
    if (value < 0.0 || value > 1.0) {
      throw new Error('Confidence score must be between 0.0 and 1.0');
    }
  }

  static low(): ConfidenceScore {
    return new ConfidenceScore(0.3);
  }

  static medium(): ConfidenceScore {
    return new ConfidenceScore(0.6);
  }

  static high(): ConfidenceScore {
    return new ConfidenceScore(0.9);
  }

  isConfident(): boolean {
    return this.value >= 0.7;
  }

  getLevel(): ConfidenceLevel {
    if (this.value >= 0.8) return ConfidenceLevel.HIGH;
    if (this.value >= 0.5) return ConfidenceLevel.MEDIUM;
    return ConfidenceLevel.LOW;
  }

  equals(other: ConfidenceScore): boolean {
    return Math.abs(this.value - other.value) < 0.001;
  }

  toString(): string {
    return `${(this.value * 100).toFixed(1)}%`;
  }
}

enum ConfidenceLevel {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}
```

**Used by:**
- Proactivity Context (opportunity confidence)
- Profile Context (preference confidence)
- Orchestration Context (intent detection confidence)

---

## Notification Value Objects

### NotificationChannel

Delivery method for notifications.

```typescript
enum NotificationChannel {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  WEBHOOK = 'WEBHOOK'
}

class NotificationPreference {
  constructor(
    public readonly channel: NotificationChannel,
    public readonly enabled: boolean,
    public readonly quietHours?: TimeRange
  ) {}

  shouldSend(timestamp: Date): boolean {
    if (!this.enabled) return false;
    if (!this.quietHours) return true;
    return !this.quietHours.contains(timestamp);
  }

  equals(other: NotificationPreference): boolean {
    return this.channel === other.channel && this.enabled === other.enabled;
  }
}
```

**Used by:**
- Proactivity Context (notification delivery)
- Communication Context (message notifications)
- Calendar Context (event reminders)

---

## Data Quality Value Objects

### DataQuality

Indicates quality/reliability of data.

```typescript
class DataQuality {
  constructor(
    public readonly completeness: number,    // 0.0-1.0
    public readonly accuracy: number,        // 0.0-1.0
    public readonly freshness: number,       // 0.0-1.0
    public readonly consistency: number      // 0.0-1.0
  ) {
    this.validate(completeness, 'completeness');
    this.validate(accuracy, 'accuracy');
    this.validate(freshness, 'freshness');
    this.validate(consistency, 'consistency');
  }

  private validate(value: number, name: string): void {
    if (value < 0.0 || value > 1.0) {
      throw new Error(`${name} must be between 0.0 and 1.0`);
    }
  }

  getOverallScore(): number {
    return (this.completeness + this.accuracy + this.freshness + this.consistency) / 4;
  }

  getGrade(): DataGrade {
    const score = this.getOverallScore();
    if (score >= 0.9) return DataGrade.EXCELLENT;
    if (score >= 0.7) return DataGrade.GOOD;
    if (score >= 0.5) return DataGrade.FAIR;
    return DataGrade.POOR;
  }

  isReliable(): boolean {
    return this.getOverallScore() >= 0.7;
  }

  toString(): string {
    return `Quality: ${(this.getOverallScore() * 100).toFixed(1)}% (${this.getGrade()})`;
  }
}

enum DataGrade {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR'
}
```

**Used by:**
- Profile Context (profile quality assessment)
- Plugin Context (sync data quality)
- Proactivity Context (opportunity quality)

---

## Metadata Value Objects

### Metadata

Generic key-value metadata with tags.

```typescript
class Metadata {
  constructor(
    public readonly attributes: Map<string, any>,
    public readonly tags: Set<string>,
    public readonly createdAt: Date,
    public readonly createdBy: string,
    public readonly version: string
  ) {}

  static create(attributes: Record<string, any>): Metadata {
    return new Metadata(
      new Map(Object.entries(attributes)),
      new Set(),
      new Date(),
      'system',
      '1.0'
    );
  }

  getAttribute(key: string): any | undefined {
    return this.attributes.get(key);
  }

  hasTag(tag: string): boolean {
    return this.tags.has(tag);
  }

  addTag(tag: string): void {
    this.tags.add(tag);
  }

  toJSON(): Record<string, any> {
    return {
      attributes: Object.fromEntries(this.attributes),
      tags: Array.from(this.tags),
      createdAt: this.createdAt.toISOString(),
      createdBy: this.createdBy,
      version: this.version
    };
  }
}
```

**Used by:**
- All Contexts (event metadata)
- Audit Context (audit log metadata)
- Plugin Context (sync metadata)

---

## Error Handling Value Objects

### ErrorCode

Structured error code with category.

```typescript
class ErrorCode {
  constructor(
    public readonly category: ErrorCategory,
    public readonly code: string,
    public readonly message: string,
    public readonly retryable: boolean
  ) {}

  static readonly AUTHENTICATION_FAILED = new ErrorCode(
    ErrorCategory.AUTHENTICATION,
    'AUTH_001',
    'Authentication failed',
    false
  );

  static readonly RATE_LIMIT_EXCEEDED = new ErrorCode(
    ErrorCategory.RATE_LIMIT,
    'RATE_001',
    'Rate limit exceeded',
    true
  );

  static readonly NETWORK_ERROR = new ErrorCode(
    ErrorCategory.NETWORK,
    'NET_001',
    'Network error',
    true
  );

  static readonly VALIDATION_ERROR = new ErrorCode(
    ErrorCategory.VALIDATION,
    'VAL_001',
    'Validation failed',
    false
  );

  getFullCode(): string {
    return `${this.category}_${this.code}`;
  }

  equals(other: ErrorCode): boolean {
    return this.getFullCode() === other.getFullCode();
  }

  toString(): string {
    return `${this.getFullCode()}: ${this.message}`;
  }
}

enum ErrorCategory {
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT = 'RATE_LIMIT',
  NETWORK = 'NETWORK',
  INTERNAL = 'INTERNAL'
}
```

**Used by:**
- All Contexts (error handling)
- Plugin Context (sync errors)
- Audit Context (error logging)

---

## Summary

These **Shared Value Objects** provide consistent representations of common domain concepts across all Bounded Contexts. Key characteristics:

- **Immutability:** All value objects are immutable after construction
- **Value Equality:** Compared by value, not identity
- **Validation:** Constructor validates all invariants
- **Type Safety:** Strong typing prevents errors
- **Reusability:** Shared across multiple contexts
- **Domain-Driven:** Represent domain concepts, not technical primitives
- **Self-Contained:** Include relevant behavior (format, calculate, validate)

**Usage Guidelines:**

1. **Always use value objects instead of primitives** for domain concepts (Email vs string, Money vs number)
2. **Validate in constructor** to ensure invariants always hold
3. **Make immutable** to prevent unintended modifications
4. **Implement equals()** for value-based comparison
5. **Add domain methods** that operate on the value (Money.add(), TimeRange.overlaps())
6. **Provide factory methods** for common cases (Duration.hours(), Priority.high())

These value objects are the building blocks for all domain models in Fidus.

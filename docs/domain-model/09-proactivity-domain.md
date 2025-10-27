# Proactivity Domain - Detailed Model

**Version:** 1.0
**Date:** 2025-10-27
**Status:** Draft
**Context:** Proactivity Context (Core Domain)

## Overview

The Proactivity Domain is a **Core Domain** responsible for detecting opportunities and presenting proactive suggestions to users without explicit user requests. It achieves >50% of all system interactions being proactive by continuously monitoring data signals, analyzing domain events, and identifying actionable opportunities.

**Key Insight:** Proactivity is what differentiates Fidus from reactive assistants. It transforms Fidus from "ask and answer" to "anticipate and suggest".

## Core Concepts

### Proactivity Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    DATA INPUTS                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐      ┌──────────────────────┐   │
│  │   Data Signals   │      │   Domain Events      │   │
│  │   (Pull-based)   │      │   (Push-based)       │   │
│  └────────┬─────────┘      └──────────┬───────────┘   │
│           │                            │               │
│           └────────────┬───────────────┘               │
│                        │                               │
└────────────────────────┼───────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              OPPORTUNITY DETECTION ENGINE               │
│  • Signal Collection (dynamic registry)                 │
│  • Event Processing (Redis Pub/Sub)                    │
│  • LLM-based Relevance Evaluation                      │
│  • Confidence Scoring                                   │
│  • Deduplication & Throttling                          │
└────────────────────────┬───────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                OPPORTUNITY AGGREGATES                   │
│  • Opportunity (identified potential action)            │
│  • Suggestion (concrete recommendation)                 │
│  • ProactiveSession (group of related opportunities)    │
└────────────────────────┬───────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│            NOTIFICATION DELIVERY ENGINE                 │
│  • Smart Timing (Do Not Disturb, context-aware)        │
│  • Priority Ordering                                    │
│  • Deduplication                                        │
│  • Multi-Channel Delivery (push, email, in-app)        │
└─────────────────────────────────────────────────────────┘
```

---

## Domain Entities

### 1. Opportunity (Aggregate Root)

**Description:** An identified potential action or insight that could be valuable to the user.

**Invariants:**
- Must have confidence score (0.0-1.0)
- Must be linked to at least one data signal or domain event
- Cannot be presented if confidence < threshold (default: 0.6)
- Must have expiration time (opportunities are time-sensitive)

**State:**
```typescript
class Opportunity {
  // Identity
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  // Core attributes
  private type: OpportunityType; // Value Object
  private category: OpportunityCategory;
  private title: string;
  private description: string;
  private confidence: ConfidenceScore; // Value Object (0.0-1.0)

  // Context
  private triggerType: TriggerType; // TIME_BASED | EVENT_BASED | USER_CUSTOM
  private triggeredBy: TriggerSource[]; // Data signals or events that caused this
  private detectedAt: Date;
  private expiresAt: Date;

  // Reasoning
  private reasoning: string; // LLM explanation for why this is an opportunity
  private relatedContexts: string[]; // Which domain contexts are involved

  // Suggested action
  private suggestedAction?: SuggestedAction; // Value Object
  private actionParameters?: Record<string, any>;

  // Lifecycle
  private status: OpportunityStatus;
  private presentedAt?: Date;
  private respondedAt?: Date;
  private userResponse?: UserResponse; // ACCEPTED | DISMISSED | SNOOZED

  // Metadata
  private createdAt: Date;
  private updatedAt: Date;
}

enum OpportunityType {
  // Time optimization
  FREE_TIME_UTILIZATION = 'free_time_utilization',
  SCHEDULE_OPTIMIZATION = 'schedule_optimization',
  CONFLICT_RESOLUTION = 'conflict_resolution',

  // Financial
  BUDGET_ALERT = 'budget_alert',
  SPENDING_ANOMALY = 'spending_anomaly',
  SAVING_OPPORTUNITY = 'saving_opportunity',

  // Health & Wellness
  WORKOUT_REMINDER = 'workout_reminder',
  HEALTH_MILESTONE = 'health_milestone',
  MEDICATION_REMINDER = 'medication_reminder',

  // Travel
  CHECK_IN_REMINDER = 'check_in_reminder',
  DOCUMENT_EXPIRY_WARNING = 'document_expiry_warning',
  TRIP_PREPARATION = 'trip_preparation',

  // Communication
  URGENT_MESSAGE = 'urgent_message',
  FOLLOW_UP_NEEDED = 'follow_up_needed',
  ACTION_ITEM_DUE = 'action_item_due',

  // Learning
  STUDY_SESSION_DUE = 'study_session_due',
  GOAL_PROGRESS_UPDATE = 'goal_progress_update',

  // Home
  DEVICE_OFFLINE = 'device_offline',
  MAINTENANCE_DUE = 'maintenance_due',

  // Shopping
  PRICE_DROP = 'price_drop',
  LOW_STOCK_ALERT = 'low_stock_alert',

  // Cross-domain
  MULTI_DOMAIN_COORDINATION = 'multi_domain_coordination',
  ROUTINE_SUGGESTION = 'routine_suggestion'
}

enum OpportunityCategory {
  URGENT = 'urgent',           // Requires immediate attention
  TIME_SENSITIVE = 'time_sensitive', // Has a deadline
  OPTIMIZATION = 'optimization',     // Improves efficiency
  INSIGHT = 'insight',         // Informational
  ROUTINE = 'routine'          // Regular recurring suggestion
}

enum TriggerType {
  TIME_BASED = 'time_based',     // Scheduled check (e.g., morning briefing)
  EVENT_BASED = 'event_based',   // Domain event triggered (e.g., appointment cancelled)
  USER_CUSTOM = 'user_custom'    // User-defined trigger with prompt
}

enum OpportunityStatus {
  DETECTED = 'detected',       // Just identified
  VALIDATED = 'validated',     // Confidence check passed
  QUEUED = 'queued',          // Waiting for delivery
  PRESENTED = 'presented',     // Shown to user
  ACCEPTED = 'accepted',       // User accepted
  DISMISSED = 'dismissed',     // User dismissed
  SNOOZED = 'snoozed',        // User snoozed (remind later)
  EXPIRED = 'expired'         // Deadline passed
}

enum UserResponse {
  ACCEPTED = 'accepted',
  DISMISSED = 'dismissed',
  SNOOZED = 'snoozed',
  EXECUTED = 'executed'  // User took action
}
```

**Commands:**

```typescript
// Detect new opportunity
static detect(params: DetectOpportunityParams): Opportunity {
  const opportunity = new Opportunity(
    generateId(),
    params.userId,
    params.tenantId,
    params.type,
    params.category,
    params.title,
    params.description,
    ConfidenceScore.create(params.confidence)
  );

  opportunity.triggerType = params.triggerType;
  opportunity.triggeredBy = params.triggeredBy;
  opportunity.detectedAt = new Date();
  opportunity.reasoning = params.reasoning;
  opportunity.status = OpportunityStatus.DETECTED;

  // Set expiration based on category
  opportunity.expiresAt = this.calculateExpiration(
    params.category,
    new Date()
  );

  return opportunity;
}

// Validate confidence (business rule: >= 0.6)
validate(): OpportunityValidated | OpportunityRejected {
  if (this.confidence.value < 0.6) {
    return new OpportunityRejected({
      opportunityId: this.id,
      reason: 'Confidence below threshold',
      confidence: this.confidence.value
    });
  }

  this.status = OpportunityStatus.VALIDATED;

  return new OpportunityValidated({
    opportunityId: this.id,
    userId: this.userId,
    type: this.type,
    confidence: this.confidence.value,
    validatedAt: new Date()
  });
}

// Present to user
present(channel: NotificationChannel): OpportunityPresented {
  if (this.status !== OpportunityStatus.VALIDATED &&
      this.status !== OpportunityStatus.QUEUED) {
    throw new Error('Can only present validated or queued opportunities');
  }

  // Check if expired
  if (new Date() > this.expiresAt) {
    this.status = OpportunityStatus.EXPIRED;
    throw new Error('Opportunity has expired');
  }

  this.status = OpportunityStatus.PRESENTED;
  this.presentedAt = new Date();

  return new OpportunityPresented({
    opportunityId: this.id,
    userId: this.userId,
    type: this.type,
    title: this.title,
    description: this.description,
    channel,
    presentedAt: this.presentedAt
  });
}

// User accepts
accept(): OpportunityAccepted {
  if (this.status !== OpportunityStatus.PRESENTED) {
    throw new Error('Can only accept presented opportunities');
  }

  this.status = OpportunityStatus.ACCEPTED;
  this.userResponse = UserResponse.ACCEPTED;
  this.respondedAt = new Date();

  return new OpportunityAccepted({
    opportunityId: this.id,
    userId: this.userId,
    type: this.type,
    acceptedAt: this.respondedAt
  });
}

// User dismisses
dismiss(reason?: string): OpportunityDismissed {
  if (this.status !== OpportunityStatus.PRESENTED) {
    throw new Error('Can only dismiss presented opportunities');
  }

  this.status = OpportunityStatus.DISMISSED;
  this.userResponse = UserResponse.DISMISSED;
  this.respondedAt = new Date();

  return new OpportunityDismissed({
    opportunityId: this.id,
    userId: this.userId,
    type: this.type,
    dismissedAt: this.respondedAt,
    reason
  });
}

// User snoozes (remind later)
snooze(snoozeUntil: Date): OpportunitySnoozed {
  if (this.status !== OpportunityStatus.PRESENTED) {
    throw new Error('Can only snooze presented opportunities');
  }

  if (snoozeUntil > this.expiresAt) {
    throw new Error('Cannot snooze beyond expiration time');
  }

  this.status = OpportunityStatus.SNOOZED;
  this.userResponse = UserResponse.SNOOZED;

  return new OpportunitySnoozed({
    opportunityId: this.id,
    userId: this.userId,
    snoozedUntil: snoozeUntil
  });
}
```

**Queries:**

```typescript
// Check if still valid
isValid(): boolean {
  return new Date() <= this.expiresAt &&
         this.status !== OpportunityStatus.EXPIRED;
}

// Check if should be presented now
shouldPresentNow(userContext: UserContext): boolean {
  // Don't present if:
  // - Not validated
  // - Expired
  // - User is in Do Not Disturb
  // - User is busy (in meeting, etc.)

  if (this.status !== OpportunityStatus.VALIDATED) return false;
  if (!this.isValid()) return false;
  if (userContext.doNotDisturb) return false;
  if (userContext.currentActivity === 'meeting') return false;

  return true;
}

// Get time until expiration
getTimeUntilExpiration(): number {
  return this.expiresAt.getTime() - new Date().getTime();
}

// Calculate acceptance rate for this type (historical)
static async getAcceptanceRate(
  userId: string,
  type: OpportunityType,
  repository: OpportunityRepository
): Promise<number> {
  const opportunities = await repository.findByUserAndType(userId, type);
  const accepted = opportunities.filter(o =>
    o.userResponse === UserResponse.ACCEPTED
  );

  return accepted.length / opportunities.length;
}
```

---

### 2. Suggestion (Aggregate Root)

**Description:** A concrete, actionable recommendation derived from one or more opportunities.

**Invariants:**
- Must reference at least one opportunity
- Must have clear call-to-action
- Cannot be presented twice (prevent spam)

**State:**
```typescript
class Suggestion {
  // Identity
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  // Content
  private title: string;
  private message: string;
  private callToAction: string; // "Book flight now", "Review budget", etc.

  // Context
  private opportunityIds: string[]; // Can aggregate multiple opportunities
  private priority: SuggestionPriority; // Value Object
  private category: OpportunityCategory;

  // Action
  private suggestedAction?: SuggestedAction; // Value Object
  private actionDeepLink?: string; // URL to execute action

  // Delivery
  private deliveryChannel: NotificationChannel;
  private deliveryStrategy: DeliveryStrategy; // Value Object
  private deliveredAt?: Date;
  private readAt?: Date;

  // Response
  private status: SuggestionStatus;
  private userResponse?: UserResponse;
  private respondedAt?: Date;

  // Metadata
  private createdAt: Date;
  private expiresAt: Date;
}

enum SuggestionStatus {
  DRAFT = 'draft',
  QUEUED = 'queued',
  DELIVERED = 'delivered',
  READ = 'read',
  ACTED_UPON = 'acted_upon',
  DISMISSED = 'dismissed',
  EXPIRED = 'expired'
}
```

**Commands:**

```typescript
// Create suggestion from opportunities
static fromOpportunities(
  opportunities: Opportunity[],
  userId: string,
  tenantId: string
): Suggestion {
  // Aggregate multiple opportunities into single suggestion
  const title = this.generateTitle(opportunities);
  const message = this.generateMessage(opportunities);
  const callToAction = this.generateCTA(opportunities);

  const suggestion = new Suggestion(
    generateId(),
    userId,
    tenantId,
    title,
    message,
    callToAction
  );

  suggestion.opportunityIds = opportunities.map(o => o.id);
  suggestion.priority = this.calculatePriority(opportunities);
  suggestion.category = opportunities[0].category; // Primary category

  return suggestion;
}

// Deliver to user
deliver(channel: NotificationChannel): SuggestionDelivered {
  if (this.status !== SuggestionStatus.QUEUED) {
    throw new Error('Can only deliver queued suggestions');
  }

  this.status = SuggestionStatus.DELIVERED;
  this.deliveryChannel = channel;
  this.deliveredAt = new Date();

  return new SuggestionDelivered({
    suggestionId: this.id,
    userId: this.userId,
    title: this.title,
    message: this.message,
    channel,
    deliveredAt: this.deliveredAt
  });
}

// User reads
markAsRead(): SuggestionRead {
  if (this.status !== SuggestionStatus.DELIVERED) {
    throw new Error('Can only mark delivered suggestions as read');
  }

  this.status = SuggestionStatus.READ;
  this.readAt = new Date();

  return new SuggestionRead({
    suggestionId: this.id,
    readAt: this.readAt
  });
}

// User acts on suggestion
act(): SuggestionActedUpon {
  if (this.status !== SuggestionStatus.DELIVERED &&
      this.status !== SuggestionStatus.READ) {
    throw new Error('Can only act on delivered/read suggestions');
  }

  this.status = SuggestionStatus.ACTED_UPON;
  this.userResponse = UserResponse.EXECUTED;
  this.respondedAt = new Date();

  return new SuggestionActedUpon({
    suggestionId: this.id,
    opportunityIds: this.opportunityIds,
    actedAt: this.respondedAt
  });
}
```

---

### 3. ProactiveSession (Aggregate Root)

**Description:** A time-bounded session grouping related opportunities (e.g., "Morning Briefing", "End of Day Summary").

**State:**
```typescript
class ProactiveSession {
  // Identity
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  // Core attributes
  private name: string; // "Morning Briefing", "Weekly Review"
  private sessionType: SessionType;
  private triggerSchedule: CronExpression; // Value Object

  // Opportunities
  private opportunityIds: string[] = [];
  private suggestionIds: string[] = [];

  // Lifecycle
  private startedAt: Date;
  private completedAt?: Date;
  private status: SessionStatus;

  // Metadata
  private createdAt: Date;
}

enum SessionType {
  MORNING_BRIEFING = 'morning_briefing',
  END_OF_DAY = 'end_of_day',
  WEEKLY_REVIEW = 'weekly_review',
  CUSTOM = 'custom'
}

enum SessionStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
```

---

## Value Objects

### ConfidenceScore

```typescript
class ConfidenceScore {
  private constructor(public readonly value: number) {}

  static create(value: number): ConfidenceScore {
    if (value < 0 || value > 1) {
      throw new Error('Confidence must be between 0 and 1');
    }
    return new ConfidenceScore(value);
  }

  isAboveThreshold(threshold: number = 0.6): boolean {
    return this.value >= threshold;
  }

  toString(): string {
    return `${(this.value * 100).toFixed(1)}%`;
  }
}
```

### SuggestedAction

```typescript
class SuggestedAction {
  constructor(
    public readonly supervisorTarget: string, // Which supervisor to call
    public readonly toolName: string,         // Which tool on that supervisor
    public readonly parameters: Record<string, any>
  ) {}

  toExecutableCommand(): ExecutableCommand {
    return {
      supervisor: this.supervisorTarget,
      tool: this.toolName,
      params: this.parameters
    };
  }
}
```

### SuggestionPriority

```typescript
class SuggestionPriority {
  constructor(
    public readonly level: PriorityLevel,
    public readonly score: number // 0-100
  ) {
    if (score < 0 || score > 100) {
      throw new Error('Priority score must be 0-100');
    }
  }

  static fromOpportunities(opportunities: Opportunity[]): SuggestionPriority {
    // Calculate priority based on:
    // - Urgency
    // - Confidence
    // - Number of opportunities
    // - User historical acceptance rate

    let score = 0;

    // Urgency weight
    if (opportunities.some(o => o.category === OpportunityCategory.URGENT)) {
      score += 40;
    }

    // Confidence weight
    const avgConfidence = opportunities.reduce((sum, o) =>
      sum + o.confidence.value, 0
    ) / opportunities.length;
    score += avgConfidence * 30;

    // Aggregation weight
    score += Math.min(opportunities.length * 10, 30);

    const level = this.scoreToLevel(score);
    return new SuggestionPriority(level, score);
  }

  private static scoreToLevel(score: number): PriorityLevel {
    if (score >= 80) return PriorityLevel.CRITICAL;
    if (score >= 60) return PriorityLevel.HIGH;
    if (score >= 40) return PriorityLevel.MEDIUM;
    return PriorityLevel.LOW;
  }
}

enum PriorityLevel {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}
```

### TriggerSource

```typescript
class TriggerSource {
  constructor(
    public readonly type: 'data_signal' | 'domain_event' | 'user_custom',
    public readonly source: string, // e.g., "calendar.free_slots" or "AppointmentCancelled"
    public readonly data: Record<string, any>
  ) {}

  isDataSignal(): boolean {
    return this.type === 'data_signal';
  }

  isDomainEvent(): boolean {
    return this.type === 'domain_event';
  }
}
```

### DeliveryStrategy

```typescript
class DeliveryStrategy {
  constructor(
    public readonly respectDoNotDisturb: boolean = true,
    public readonly maxRetries: number = 3,
    public readonly retryDelay: number = 300000, // 5 minutes
    public readonly deduplicate: boolean = true,
    public readonly deduplicationWindow: number = 3600000 // 1 hour
  ) {}

  static default(): DeliveryStrategy {
    return new DeliveryStrategy(true, 3, 300000, true, 3600000);
  }

  static urgent(): DeliveryStrategy {
    return new DeliveryStrategy(false, 1, 0, false, 0);
  }
}
```

### CronExpression

```typescript
class CronExpression {
  private constructor(public readonly expression: string) {}

  static create(expression: string): CronExpression {
    if (!this.isValid(expression)) {
      throw new Error(`Invalid cron expression: ${expression}`);
    }
    return new CronExpression(expression);
  }

  static daily(hour: number, minute: number = 0): CronExpression {
    return new CronExpression(`${minute} ${hour} * * *`);
  }

  static weekly(dayOfWeek: number, hour: number, minute: number = 0): CronExpression {
    return new CronExpression(`${minute} ${hour} * * ${dayOfWeek}`);
  }

  private static isValid(expression: string): boolean {
    // Validate cron expression format
    const parts = expression.split(' ');
    return parts.length === 5;
  }

  getNextRun(from: Date = new Date()): Date {
    // Calculate next execution time based on cron expression
    // Implementation would use a cron parsing library
    throw new Error('Not implemented - use cron library');
  }
}
```

---

## Domain Events

### Opportunity Events

```typescript
interface OpportunityDetected extends DomainEvent {
  eventType: 'OpportunityDetected';
  aggregateType: 'Opportunity';
  payload: {
    opportunityId: string;
    userId: string;
    type: OpportunityType;
    category: OpportunityCategory;
    confidence: number;
    triggerType: TriggerType;
    detectedAt: Date;
  };
}

interface OpportunityValidated extends DomainEvent {
  eventType: 'OpportunityValidated';
  aggregateType: 'Opportunity';
  payload: {
    opportunityId: string;
    userId: string;
    type: OpportunityType;
    confidence: number;
    validatedAt: Date;
  };
}

interface OpportunityRejected extends DomainEvent {
  eventType: 'OpportunityRejected';
  aggregateType: 'Opportunity';
  payload: {
    opportunityId: string;
    reason: string;
    confidence: number;
  };
}

interface OpportunityPresented extends DomainEvent {
  eventType: 'OpportunityPresented';
  aggregateType: 'Opportunity';
  payload: {
    opportunityId: string;
    userId: string;
    type: OpportunityType;
    title: string;
    description: string;
    channel: NotificationChannel;
    presentedAt: Date;
  };
}

interface OpportunityAccepted extends DomainEvent {
  eventType: 'OpportunityAccepted';
  aggregateType: 'Opportunity';
  payload: {
    opportunityId: string;
    userId: string;
    type: OpportunityType;
    acceptedAt: Date;
  };
}

interface OpportunityDismissed extends DomainEvent {
  eventType: 'OpportunityDismissed';
  aggregateType: 'Opportunity';
  payload: {
    opportunityId: string;
    userId: string;
    type: OpportunityType;
    dismissedAt: Date;
    reason?: string;
  };
}

interface OpportunitySnoozed extends DomainEvent {
  eventType: 'OpportunitySnoozed';
  aggregateType: 'Opportunity';
  payload: {
    opportunityId: string;
    userId: string;
    snoozedUntil: Date;
  };
}
```

### Suggestion Events

```typescript
interface SuggestionCreated extends DomainEvent {
  eventType: 'SuggestionCreated';
  aggregateType: 'Suggestion';
  payload: {
    suggestionId: string;
    userId: string;
    opportunityIds: string[];
    title: string;
    priority: PriorityLevel;
  };
}

interface SuggestionDelivered extends DomainEvent {
  eventType: 'SuggestionDelivered';
  aggregateType: 'Suggestion';
  payload: {
    suggestionId: string;
    userId: string;
    title: string;
    message: string;
    channel: NotificationChannel;
    deliveredAt: Date;
  };
}

interface SuggestionRead extends DomainEvent {
  eventType: 'SuggestionRead';
  aggregateType: 'Suggestion';
  payload: {
    suggestionId: string;
    readAt: Date;
  };
}

interface SuggestionActedUpon extends DomainEvent {
  eventType: 'SuggestionActedUpon';
  aggregateType: 'Suggestion';
  payload: {
    suggestionId: string;
    opportunityIds: string[];
    actedAt: Date;
  };
}
```

### Session Events

```typescript
interface ProactiveSessionStarted extends DomainEvent {
  eventType: 'ProactiveSessionStarted';
  aggregateType: 'ProactiveSession';
  payload: {
    sessionId: string;
    userId: string;
    sessionType: SessionType;
    startedAt: Date;
  };
}

interface ProactiveSessionCompleted extends DomainEvent {
  eventType: 'ProactiveSessionCompleted';
  aggregateType: 'ProactiveSession';
  payload: {
    sessionId: string;
    userId: string;
    opportunityCount: number;
    suggestionCount: number;
    completedAt: Date;
  };
}
```

---

## Domain Services

### OpportunityDetectionService

```typescript
class OpportunityDetectionService {
  constructor(
    private signalRegistry: SignalRegistry,
    private eventBus: EventBus,
    private llm: LLMService,
    private userProfileService: UserProfileService
  ) {}

  // Time-based detection (scheduled)
  async detectOpportunities(
    userId: string,
    sessionType: SessionType
  ): Promise<Opportunity[]> {
    const opportunities: Opportunity[] = [];

    // 1. Collect data signals (pull-based)
    const signals = await this.collectSignals(userId);

    // 2. Load user profile & preferences
    const userProfile = await this.userProfileService.getProfile(userId);

    // 3. LLM analysis per domain
    for (const [domain, signalData] of Object.entries(signals)) {
      const domainOpportunities = await this.analyzeDomain(
        domain,
        signalData,
        userProfile
      );
      opportunities.push(...domainOpportunities);
    }

    // 4. Filter by confidence
    const validated = opportunities.filter(o =>
      o.confidence.value >= 0.6
    );

    // 5. Deduplicate
    return this.deduplicate(validated);
  }

  // Event-based detection (reactive)
  async processEvent(event: DomainEvent): Promise<Opportunity | null> {
    // 1. Check if event is relevant for proactivity
    const relevance = await this.evaluateEventRelevance(event);

    if (!relevance.isRelevant) {
      return null;
    }

    // 2. Load user context
    const userContext = await this.userProfileService.getContext(event.userId);

    // 3. Create opportunity
    const opportunity = Opportunity.detect({
      userId: event.userId,
      tenantId: event.tenantId,
      type: this.mapEventToOpportunityType(event),
      category: relevance.category,
      title: relevance.title,
      description: relevance.description,
      confidence: relevance.confidence,
      triggerType: TriggerType.EVENT_BASED,
      triggeredBy: [new TriggerSource('domain_event', event.eventType, event.payload)],
      reasoning: relevance.reasoning
    });

    // 4. Validate
    const validationResult = opportunity.validate();

    if (validationResult instanceof OpportunityRejected) {
      return null;
    }

    return opportunity;
  }

  private async collectSignals(userId: string): Promise<Record<string, any>> {
    // Collect all registered data signals
    const signalProviders = await this.signalRegistry.getAll();
    const signals: Record<string, any> = {};

    for (const provider of signalProviders) {
      try {
        signals[provider.domain] = await provider.collect(userId);
      } catch (error) {
        console.error(`Failed to collect signals from ${provider.domain}:`, error);
      }
    }

    return signals;
  }

  private async analyzeDomain(
    domain: string,
    signalData: any,
    userProfile: UserProfile
  ): Promise<Opportunity[]> {
    const prompt = `
Analyze the following signals for ${domain} domain and detect opportunities:

Signals:
${JSON.stringify(signalData, null, 2)}

User Profile:
${JSON.stringify(userProfile.toJSON(), null, 2)}

Identify actionable opportunities. For each opportunity, provide:
1. Type (e.g., "free_time_utilization", "budget_alert")
2. Title (concise, user-friendly)
3. Description (2-3 sentences)
4. Confidence (0.0-1.0)
5. Reasoning (why is this an opportunity?)
6. Suggested action (if applicable)

Format: JSON array of opportunities.
    `;

    const response = await this.llm.complete(prompt);
    const opportunities = JSON.parse(response);

    return opportunities.map((opp: any) =>
      Opportunity.detect({
        userId: userProfile.userId,
        tenantId: userProfile.tenantId,
        type: opp.type,
        category: this.inferCategory(opp.type),
        title: opp.title,
        description: opp.description,
        confidence: opp.confidence,
        triggerType: TriggerType.TIME_BASED,
        triggeredBy: [new TriggerSource('data_signal', `${domain}.signals`, signalData)],
        reasoning: opp.reasoning
      })
    );
  }

  private deduplicate(opportunities: Opportunity[]): Opportunity[] {
    // Remove duplicate opportunities (same type + similar content within 1 hour)
    const seen = new Map<string, Opportunity>();

    for (const opp of opportunities) {
      const key = `${opp.type}_${opp.title}`;

      if (!seen.has(key)) {
        seen.set(key, opp);
      } else {
        // Keep the one with higher confidence
        const existing = seen.get(key)!;
        if (opp.confidence.value > existing.confidence.value) {
          seen.set(key, opp);
        }
      }
    }

    return Array.from(seen.values());
  }
}
```

### NotificationDeliveryService

```typescript
class NotificationDeliveryService {
  async deliverSuggestion(
    suggestion: Suggestion,
    userContext: UserContext
  ): Promise<void> {
    // 1. Check Do Not Disturb
    if (userContext.doNotDisturb && suggestion.priority.level !== PriorityLevel.CRITICAL) {
      // Queue for later
      await this.queueForLater(suggestion);
      return;
    }

    // 2. Check user availability
    if (!this.isUserAvailable(userContext) && suggestion.priority.level !== PriorityLevel.CRITICAL) {
      await this.queueForLater(suggestion);
      return;
    }

    // 3. Deduplicate
    if (await this.wasRecentlyDelivered(suggestion)) {
      return; // Skip duplicate
    }

    // 4. Deliver via appropriate channel
    const channel = this.selectChannel(suggestion, userContext);
    await this.deliver(suggestion, channel);

    // 5. Emit event
    await this.eventBus.publish(
      suggestion.deliver(channel)
    );
  }

  private isUserAvailable(userContext: UserContext): boolean {
    // Check if user is available for notifications
    if (userContext.currentActivity === 'meeting') return false;
    if (userContext.currentActivity === 'focus_mode') return false;
    return true;
  }

  private selectChannel(
    suggestion: Suggestion,
    userContext: UserContext
  ): NotificationChannel {
    // Select best channel based on priority and user preferences
    if (suggestion.priority.level === PriorityLevel.CRITICAL) {
      return NotificationChannel.PUSH; // Always use push for critical
    }

    // Use user's preferred channel
    return userContext.preferredNotificationChannel || NotificationChannel.IN_APP;
  }

  private async deliver(
    suggestion: Suggestion,
    channel: NotificationChannel
  ): Promise<void> {
    switch (channel) {
      case NotificationChannel.PUSH:
        await this.pushNotificationService.send(suggestion);
        break;
      case NotificationChannel.EMAIL:
        await this.emailService.send(suggestion);
        break;
      case NotificationChannel.IN_APP:
        await this.inAppNotificationService.send(suggestion);
        break;
      case NotificationChannel.SMS:
        await this.smsService.send(suggestion);
        break;
    }
  }
}
```

---

## Business Rules

### Rule 1: Confidence Threshold
**Description:** Opportunities must have confidence >= 0.6 to be presented
**Rationale:** Avoid noise from low-confidence suggestions
**Exception:** User can lower threshold in settings

### Rule 2: Expiration
**Description:** Opportunities expire based on category:
- URGENT: 1 hour
- TIME_SENSITIVE: 24 hours
- OPTIMIZATION: 7 days
- INSIGHT: 30 days
- ROUTINE: Never expires

### Rule 3: Do Not Disturb
**Description:** Respect Do Not Disturb unless CRITICAL priority
**Exception:** Critical alerts (health emergencies, urgent messages from VIPs)

### Rule 4: Deduplication Window
**Description:** Same opportunity type cannot be presented twice within 1 hour
**Rationale:** Prevent spam

### Rule 5: Acceptance Rate Feedback Loop
**Description:** Track acceptance rate per opportunity type per user
**Action:** If acceptance rate < 20% for 10 opportunities, reduce frequency by 50%

---

## Use Cases

### UC1: Morning Briefing (Time-Based)

**Flow:**
1. Scheduler triggers at 8:00 AM
2. ProactivityEngine creates ProactiveSession
3. OpportunityDetectionService collects signals from all domains
4. LLM analyzes each domain's signals
5. Multiple opportunities detected (calendar conflicts, budget alerts, etc.)
6. Opportunities aggregated into single "Morning Briefing" Suggestion
7. NotificationDeliveryService delivers to user
8. User reads and accepts/dismisses items

### UC2: Appointment Cancelled (Event-Based)

**Flow:**
1. Calendar Context emits `AppointmentCancelled` event
2. ProactivityEngine receives event via Redis Pub/Sub
3. OpportunityDetectionService evaluates relevance
4. Detects opportunity: "Free time available, workout goal incomplete"
5. Creates Opportunity (type: FREE_TIME_UTILIZATION)
6. Validates confidence (>= 0.6)
7. Creates Suggestion: "You have 2 hours free now - perfect for workout!"
8. NotificationDeliveryService delivers
9. User accepts → triggers HealthSupervisor

### UC3: User Custom Trigger

**Flow:**
1. User creates custom trigger: "Every Friday at 5 PM, summarize week's finances"
2. Stored as ProactiveSession with cron schedule
3. Friday 5 PM: Scheduler triggers
4. OpportunityDetectionService collects Finance signals
5. LLM generates custom summary based on user's prompt
6. Delivered as Suggestion

---

## Integration Patterns

### Integration with Domain Contexts

**Pattern:** Proactivity Context subscribes to ALL domain events

```typescript
// Subscribe to all domain events
eventBus.subscribe('*', async (event: DomainEvent) => {
  const opportunity = await opportunityDetectionService.processEvent(event);

  if (opportunity) {
    await opportunityRepository.save(opportunity);
    await eventBus.publish(opportunity.validate());
  }
});
```

### Integration with User Profile

```typescript
// Check user's historical acceptance rate
const acceptanceRate = await Opportunity.getAcceptanceRate(
  userId,
  OpportunityType.WORKOUT_REMINDER,
  opportunityRepository
);

// Adjust frequency based on acceptance
if (acceptanceRate < 0.2) {
  // User doesn't like workout reminders, reduce frequency
  await userProfileService.updatePreference(
    userId,
    'proactivity.workout_reminder_frequency',
    'low'
  );
}
```

---

## Multi-Tenancy Considerations

### Tenant-Level Proactivity Settings

```typescript
interface TenantProactivitySettings {
  tenantId: string;

  // Global proactivity toggle
  proactivityEnabled: boolean;

  // Per-category settings
  categorySettings: {
    [category in OpportunityCategory]: {
      enabled: boolean;
      maxDailyOpportunities: number;
      minConfidenceThreshold: number;
    }
  };

  // Notification preferences (tenant-wide defaults)
  defaultNotificationChannel: NotificationChannel;
  respectDoNotDisturb: boolean;

  // Family/Team coordination
  sharedOpportunities: boolean; // Share opportunities across family members
  coordinationMode: 'individual' | 'coordinated';
}
```

**Example: Family Coordination**

If `sharedOpportunities = true` and family member A has free time, Proactivity can suggest family activities:

```typescript
// Detect: Dad has 2 hours free, Mom also available, kids' schedule allows
// Opportunity: "Family has 2 hours together this afternoon - movie?"
```

---

## Persistence

### Opportunity Repository

```typescript
interface OpportunityRepository {
  save(opportunity: Opportunity): Promise<void>;
  findById(id: string): Promise<Opportunity | null>;
  findByUserId(userId: string): Promise<Opportunity[]>;
  findByUserAndType(userId: string, type: OpportunityType): Promise<Opportunity[]>;
  findByStatus(userId: string, status: OpportunityStatus): Promise<Opportunity[]>;
  findExpired(): Promise<Opportunity[]>; // For cleanup job
}
```

### Suggestion Repository

```typescript
interface SuggestionRepository {
  save(suggestion: Suggestion): Promise<void>;
  findById(id: string): Promise<Suggestion | null>;
  findByUserId(userId: string): Promise<Suggestion[]>;
  findUnread(userId: string): Promise<Suggestion[]>;
  findQueued(): Promise<Suggestion[]>; // For delivery job
}
```

---

## Performance Considerations

1. **Signal Collection:** Parallel collection from all domains
2. **LLM Analysis:** Batch analysis per domain (not per signal)
3. **Event Processing:** Async processing with queue (BullMQ)
4. **Deduplication:** Cache recent opportunities in Redis

---

## Testing Strategy

### Unit Tests

```typescript
describe('Opportunity', () => {
  it('should reject low confidence opportunities', () => {
    const opportunity = Opportunity.detect({
      confidence: 0.4, // Below threshold
      // ...
    });

    const result = opportunity.validate();

    expect(result).toBeInstanceOf(OpportunityRejected);
  });

  it('should expire after category-specific duration', () => {
    const opportunity = Opportunity.detect({
      category: OpportunityCategory.URGENT,
      // ...
    });

    // Fast-forward 1.5 hours
    jest.advanceTimersByTime(1.5 * 60 * 60 * 1000);

    expect(opportunity.isValid()).toBe(false);
    expect(opportunity.status).toBe(OpportunityStatus.EXPIRED);
  });
});
```

---

## Future Enhancements

1. **Machine Learning:** Train models on user acceptance patterns
2. **Multi-Modal Opportunities:** Voice suggestions, visual cues
3. **Proactive Actions:** Execute actions without user confirmation (with permission)
4. **Community Opportunities:** Share anonymized opportunities with community for training
5. **Explainable Proactivity:** "Why did you suggest this?" with detailed reasoning

---

**End of Document**

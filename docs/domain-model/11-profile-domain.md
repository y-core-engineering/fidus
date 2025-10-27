# Profile Domain Model

## Overview

The **Profile Context** is a **Supporting Domain** in Fidus that manages rich user profiles, preferences, behavioral patterns, relationships, and contextual knowledge. It serves as the central knowledge repository about users, enabling personalized interactions across all Domain Contexts.

**Relationship to Bounded Context:**
- This **domain model** defines WHAT the Profile Context does (aggregates, events, rules)
- The **ProfileSupervisor** (architecture) defines HOW it's implemented (Neo4j graph database, embeddings, MCP integrations)

---

## Multi-Tenancy Considerations

The Profile Context operates with **tenant-level isolation** for privacy and security:

| **Tenant Type** | **Profile Capabilities** |
|-----------------|-------------------------|
| **INDIVIDUAL** | Single user profile, personal preferences, private relationships |
| **FAMILY** | Family member profiles, shared preferences, family relationships, parental controls |
| **TEAM** | Team member profiles, role-based preferences, team relationships, work contexts |
| **COMPANY** | Employee profiles, department structure, org-wide policies, corporate relationships |

**Tenant-Specific Features:**
- **Community Tier:** Basic profile (preferences, habits)
- **Cloud Tier:** Extended profile (relationships, behavioral patterns, embeddings)
- **Enterprise Tier:** Advanced profile (role hierarchies, department structures, custom attributes)

**Data Isolation:**
- All profiles scoped to `tenantId`
- Relationships cannot cross tenant boundaries
- Shared preferences inherit from tenant-level defaults
- Graph database uses tenant-partitioned storage

---

## Core Bounded Context

**Name:** Profile Context

**Type:** Supporting Domain (serves all Domain Contexts)

**Responsibility:** Maintain comprehensive user profiles including preferences, behaviors, relationships, and contextual knowledge to enable personalized experiences.

**Domain Language:**
- **Profile:** Comprehensive representation of a user
- **Preference:** User's stated choice or setting
- **Habit:** Observed behavioral pattern
- **Relationship:** Connection to another person with context
- **Context:** Situational information affecting behavior
- **Attribute:** Custom key-value data about the user
- **Embedding:** Vector representation for semantic search

---

## Aggregates

### 1. UserProfile (Aggregate Root)

The **UserProfile** is the central aggregate representing everything known about a user. It combines explicit preferences, observed habits, relationships, and contextual information.

**Identity:**
- `profileId: string` - Unique identifier
- `userId: string` - Reference to Identity Context
- `tenantId: string` - Tenant scope

**Core Attributes:**
- `personalInfo: PersonalInfo` - Basic demographic information
- `preferences: Map<string, Preference>` - Explicit user choices (grouped by domain)
- `habits: Habit[]` - Observed behavioral patterns
- `relationships: Relationship[]` - Connections to other people
- `contexts: UserContext[]` - Situational contexts (work, home, travel)
- `attributes: Map<string, CustomAttribute>` - Custom key-value data
- `embedding: ProfileEmbedding?` - Vector representation for similarity search

**Lifecycle:**
- `status: ProfileStatus` - INCOMPLETE | ACTIVE | ARCHIVED
- `completeness: number` - 0.0-1.0 score indicating profile richness
- `lastEnriched: Date` - Last time profile was updated with new data
- `createdAt: Date`
- `updatedAt: Date`

**Invariants:**
1. Profile must have at least basic personal info to be ACTIVE
2. Preferences must have valid domain scope
3. Habits must have at least 3 observations to be considered reliable
4. Relationships must reference valid profiles within the same tenant
5. Completeness score must be recalculated after any change

**Commands:**

```typescript
class UserProfile {
  // Core aggregate root
  private readonly profileId: string;
  private readonly userId: string;
  private readonly tenantId: string;

  private personalInfo: PersonalInfo;
  private preferences: Map<string, Preference> = new Map();
  private habits: Habit[] = [];
  private relationships: Relationship[] = [];
  private contexts: UserContext[] = [];
  private attributes: Map<string, CustomAttribute> = new Map();
  private embedding?: ProfileEmbedding;

  private status: ProfileStatus = ProfileStatus.INCOMPLETE;
  private completeness: number = 0.0;
  private lastEnriched: Date;

  // Command: Set preference
  setPreference(
    domain: string,
    key: string,
    value: any,
    confidence: number = 1.0
  ): PreferenceSet {
    const preference = Preference.create(domain, key, value, confidence);
    this.preferences.set(`${domain}.${key}`, preference);
    this.recalculateCompleteness();
    this.lastEnriched = new Date();

    return new PreferenceSet({
      profileId: this.profileId,
      userId: this.userId,
      tenantId: this.tenantId,
      domain,
      key,
      value,
      confidence,
      timestamp: new Date()
    });
  }

  // Command: Record observed behavior
  recordBehavior(
    action: string,
    context: ContextSnapshot,
    metadata: Record<string, any>
  ): BehaviorRecorded {
    // Check if this behavior matches an existing habit
    const matchingHabit = this.habits.find(h => h.matches(action, context));

    if (matchingHabit) {
      matchingHabit.recordObservation(new Date());
    } else {
      // Create new habit if this is first observation
      const habit = Habit.fromObservation(action, context, metadata);
      this.habits.push(habit);
    }

    this.lastEnriched = new Date();

    return new BehaviorRecorded({
      profileId: this.profileId,
      userId: this.userId,
      tenantId: this.tenantId,
      action,
      context: context.toJSON(),
      metadata,
      timestamp: new Date()
    });
  }

  // Command: Add relationship
  addRelationship(
    relatedProfileId: string,
    type: RelationshipType,
    strength: number,
    metadata: Record<string, any>
  ): RelationshipAdded {
    // Validate related profile exists in same tenant (would be done via domain service)
    const relationship = Relationship.create(
      relatedProfileId,
      type,
      strength,
      metadata
    );

    this.relationships.push(relationship);
    this.recalculateCompleteness();
    this.lastEnriched = new Date();

    return new RelationshipAdded({
      profileId: this.profileId,
      userId: this.userId,
      tenantId: this.tenantId,
      relatedProfileId,
      type,
      strength,
      metadata,
      timestamp: new Date()
    });
  }

  // Command: Update context
  updateContext(
    contextType: ContextType,
    data: Record<string, any>
  ): ContextUpdated {
    const existingContext = this.contexts.find(c => c.type === contextType);

    if (existingContext) {
      existingContext.update(data);
    } else {
      const newContext = UserContext.create(contextType, data);
      this.contexts.push(newContext);
    }

    this.lastEnriched = new Date();

    return new ContextUpdated({
      profileId: this.profileId,
      userId: this.userId,
      tenantId: this.tenantId,
      contextType,
      data,
      timestamp: new Date()
    });
  }

  // Command: Generate embedding
  async generateEmbedding(
    embeddingService: EmbeddingService
  ): Promise<ProfileEmbeddingGenerated> {
    const profileText = this.toSemanticText();
    const vector = await embeddingService.embed(profileText);

    this.embedding = ProfileEmbedding.create(vector, embeddingService.model);

    return new ProfileEmbeddingGenerated({
      profileId: this.profileId,
      userId: this.userId,
      tenantId: this.tenantId,
      model: embeddingService.model,
      dimensions: vector.length,
      timestamp: new Date()
    });
  }

  // Query: Get preference
  getPreference(domain: string, key: string): Preference | undefined {
    return this.preferences.get(`${domain}.${key}`);
  }

  // Query: Get habits by pattern
  getHabitsByPattern(pattern: string): Habit[] {
    return this.habits.filter(h => h.action.includes(pattern) && h.isReliable());
  }

  // Query: Get relationships by type
  getRelationshipsByType(type: RelationshipType): Relationship[] {
    return this.relationships.filter(r => r.type === type);
  }

  // Query: Get context
  getContext(type: ContextType): UserContext | undefined {
    return this.contexts.find(c => c.type === type);
  }

  // Private: Calculate completeness score
  private recalculateCompleteness(): void {
    let score = 0.0;

    // Personal info: 20%
    if (this.personalInfo.isComplete()) score += 0.2;

    // Preferences: 30%
    const preferenceScore = Math.min(this.preferences.size / 20, 1.0);
    score += preferenceScore * 0.3;

    // Habits: 20%
    const reliableHabits = this.habits.filter(h => h.isReliable()).length;
    const habitScore = Math.min(reliableHabits / 10, 1.0);
    score += habitScore * 0.2;

    // Relationships: 15%
    const relationshipScore = Math.min(this.relationships.length / 5, 1.0);
    score += relationshipScore * 0.15;

    // Contexts: 10%
    const contextScore = Math.min(this.contexts.length / 4, 1.0);
    score += contextScore * 0.1;

    // Embedding: 5%
    if (this.embedding) score += 0.05;

    this.completeness = Math.round(score * 100) / 100;

    // Update status based on completeness
    if (this.completeness >= 0.4 && this.status === ProfileStatus.INCOMPLETE) {
      this.status = ProfileStatus.ACTIVE;
    }
  }

  // Private: Convert profile to semantic text for embedding
  private toSemanticText(): string {
    const parts: string[] = [];

    // Personal info
    parts.push(`Name: ${this.personalInfo.name}`);
    if (this.personalInfo.location) {
      parts.push(`Location: ${this.personalInfo.location}`);
    }

    // Preferences
    for (const [key, pref] of this.preferences) {
      parts.push(`Prefers ${key}: ${pref.value}`);
    }

    // Habits
    const reliableHabits = this.habits.filter(h => h.isReliable());
    for (const habit of reliableHabits) {
      parts.push(`Regularly ${habit.action} ${habit.getFrequencyDescription()}`);
    }

    // Relationships
    for (const rel of this.relationships) {
      parts.push(`Has ${rel.type} relationship (strength: ${rel.strength})`);
    }

    return parts.join('. ');
  }
}
```

**Domain Events:**
- `PreferenceSet` - User preference was explicitly set
- `BehaviorRecorded` - User behavior was observed and recorded
- `RelationshipAdded` - Relationship to another person was added
- `RelationshipUpdated` - Relationship strength or metadata changed
- `ContextUpdated` - User context information was updated
- `ProfileEmbeddingGenerated` - Vector embedding was created/refreshed
- `ProfileCompletenessChanged` - Completeness score changed significantly (>10%)

---

### 2. Preference (Entity)

**Preference** represents an explicit user choice or setting for a specific domain and key.

**Identity:**
- `domain: string` - Domain scope (e.g., "calendar", "communication", "travel")
- `key: string` - Preference key (e.g., "meeting_duration", "notification_method")

**Attributes:**
- `value: any` - Preference value (can be string, number, boolean, object)
- `confidence: number` - 0.0-1.0 confidence score (1.0 = explicitly set, <1.0 = inferred)
- `source: PreferenceSource` - Where preference came from (USER_STATED | INFERRED | IMPORTED)
- `lastModified: Date`
- `expiresAt?: Date` - Optional expiration for temporary preferences

**Methods:**

```typescript
class Preference {
  static create(
    domain: string,
    key: string,
    value: any,
    confidence: number = 1.0,
    source: PreferenceSource = PreferenceSource.USER_STATED
  ): Preference {
    if (confidence < 0.0 || confidence > 1.0) {
      throw new Error('Confidence must be between 0.0 and 1.0');
    }

    return new Preference(domain, key, value, confidence, source, new Date());
  }

  isExpired(): boolean {
    return this.expiresAt ? new Date() > this.expiresAt : false;
  }

  isConfident(): boolean {
    return this.confidence >= 0.7;
  }
}
```

---

### 3. Habit (Entity)

**Habit** represents an observed behavioral pattern with temporal and contextual information.

**Attributes:**
- `habitId: string` - Unique identifier
- `action: string` - Action pattern (e.g., "books_meetings", "checks_email")
- `frequency: Frequency` - How often habit occurs (DAILY | WEEKLY | MONTHLY | IRREGULAR)
- `timePatterns: TimePattern[]` - When habit typically occurs
- `contextConditions: ContextCondition[]` - Conditions under which habit occurs
- `observations: Observation[]` - Historical observations
- `reliability: number` - 0.0-1.0 score based on consistency
- `firstObserved: Date`
- `lastObserved: Date`

**Methods:**

```typescript
class Habit {
  static fromObservation(
    action: string,
    context: ContextSnapshot,
    metadata: Record<string, any>
  ): Habit {
    const observation = Observation.create(new Date(), context, metadata);
    return new Habit(
      generateId(),
      action,
      Frequency.IRREGULAR,
      [],
      [],
      [observation],
      0.0,
      new Date(),
      new Date()
    );
  }

  recordObservation(timestamp: Date): void {
    this.observations.push(Observation.create(timestamp, context, {}));
    this.lastObserved = timestamp;
    this.recalculateFrequency();
    this.recalculateReliability();
  }

  matches(action: string, context: ContextSnapshot): boolean {
    // Check if action matches
    if (!action.includes(this.action) && !this.action.includes(action)) {
      return false;
    }

    // Check if context conditions match
    for (const condition of this.contextConditions) {
      if (!condition.matches(context)) {
        return false;
      }
    }

    return true;
  }

  isReliable(): boolean {
    return this.observations.length >= 3 && this.reliability >= 0.6;
  }

  getFrequencyDescription(): string {
    switch (this.frequency) {
      case Frequency.DAILY:
        return 'every day';
      case Frequency.WEEKLY:
        return 'every week';
      case Frequency.MONTHLY:
        return 'every month';
      default:
        return 'occasionally';
    }
  }

  private recalculateFrequency(): void {
    if (this.observations.length < 2) return;

    // Calculate average time between observations
    const intervals = [];
    for (let i = 1; i < this.observations.length; i++) {
      const interval = this.observations[i].timestamp.getTime() -
                      this.observations[i-1].timestamp.getTime();
      intervals.push(interval);
    }

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const avgDays = avgInterval / (1000 * 60 * 60 * 24);

    if (avgDays <= 2) {
      this.frequency = Frequency.DAILY;
    } else if (avgDays <= 10) {
      this.frequency = Frequency.WEEKLY;
    } else if (avgDays <= 40) {
      this.frequency = Frequency.MONTHLY;
    } else {
      this.frequency = Frequency.IRREGULAR;
    }
  }

  private recalculateReliability(): void {
    if (this.observations.length < 3) {
      this.reliability = 0.0;
      return;
    }

    // Calculate coefficient of variation of intervals
    const intervals = [];
    for (let i = 1; i < this.observations.length; i++) {
      const interval = this.observations[i].timestamp.getTime() -
                      this.observations[i-1].timestamp.getTime();
      intervals.push(interval);
    }

    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / mean;

    // Lower CV = more reliable (invert and clamp)
    this.reliability = Math.max(0.0, Math.min(1.0, 1.0 - cv));
  }
}
```

---

### 4. Relationship (Entity)

**Relationship** represents a connection to another person with context and strength.

**Attributes:**
- `relatedProfileId: string` - Reference to related UserProfile
- `type: RelationshipType` - Type of relationship
- `strength: number` - 0.0-1.0 connection strength
- `metadata: Record<string, any>` - Additional context
- `createdAt: Date`
- `lastInteraction: Date`

**RelationshipType:**
```typescript
enum RelationshipType {
  FAMILY = 'FAMILY',
  FRIEND = 'FRIEND',
  COLLEAGUE = 'COLLEAGUE',
  MANAGER = 'MANAGER',
  DIRECT_REPORT = 'DIRECT_REPORT',
  CLIENT = 'CLIENT',
  VENDOR = 'VENDOR',
  OTHER = 'OTHER'
}
```

**Methods:**

```typescript
class Relationship {
  static create(
    relatedProfileId: string,
    type: RelationshipType,
    strength: number = 0.5,
    metadata: Record<string, any> = {}
  ): Relationship {
    if (strength < 0.0 || strength > 1.0) {
      throw new Error('Strength must be between 0.0 and 1.0');
    }

    return new Relationship(
      relatedProfileId,
      type,
      strength,
      metadata,
      new Date(),
      new Date()
    );
  }

  recordInteraction(): void {
    this.lastInteraction = new Date();
    // Could adjust strength based on interaction frequency
  }

  isStale(): boolean {
    const daysSinceInteraction =
      (Date.now() - this.lastInteraction.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceInteraction > 90; // 3 months
  }
}
```

---

## Value Objects

### 1. PersonalInfo

Basic demographic and contact information.

```typescript
class PersonalInfo {
  constructor(
    public readonly name: string,
    public readonly email?: string,
    public readonly phone?: string,
    public readonly location?: string,
    public readonly timezone?: string,
    public readonly language?: string,
    public readonly dateOfBirth?: Date
  ) {}

  isComplete(): boolean {
    return !!(this.name && this.email && this.timezone && this.language);
  }
}
```

### 2. ContextSnapshot

Snapshot of situational context at a specific point in time.

```typescript
class ContextSnapshot {
  constructor(
    public readonly timestamp: Date,
    public readonly location?: string,
    public readonly activity?: string,
    public readonly deviceType?: string,
    public readonly timeOfDay?: TimeOfDay,
    public readonly dayOfWeek?: DayOfWeek,
    public readonly metadata: Record<string, any> = {}
  ) {}

  toJSON(): Record<string, any> {
    return {
      timestamp: this.timestamp.toISOString(),
      location: this.location,
      activity: this.activity,
      deviceType: this.deviceType,
      timeOfDay: this.timeOfDay,
      dayOfWeek: this.dayOfWeek,
      metadata: this.metadata
    };
  }
}
```

### 3. ProfileEmbedding

Vector representation of profile for semantic search.

```typescript
class ProfileEmbedding {
  constructor(
    public readonly vector: number[],
    public readonly model: string,
    public readonly generatedAt: Date
  ) {}

  static create(vector: number[], model: string): ProfileEmbedding {
    return new ProfileEmbedding(vector, model, new Date());
  }

  isStale(): boolean {
    const daysSinceGeneration =
      (Date.now() - this.generatedAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceGeneration > 30; // Regenerate monthly
  }

  cosineSimilarity(other: ProfileEmbedding): number {
    if (this.vector.length !== other.vector.length) {
      throw new Error('Vector dimensions must match');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < this.vector.length; i++) {
      dotProduct += this.vector[i] * other.vector[i];
      normA += this.vector[i] * this.vector[i];
      normB += other.vector[i] * other.vector[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
```

### 4. UserContext

Situational context affecting user behavior.

```typescript
enum ContextType {
  WORK = 'WORK',
  HOME = 'HOME',
  TRAVEL = 'TRAVEL',
  COMMUTE = 'COMMUTE',
  LEISURE = 'LEISURE',
  FOCUS = 'FOCUS'
}

class UserContext {
  constructor(
    public readonly type: ContextType,
    public data: Record<string, any>,
    public updatedAt: Date
  ) {}

  static create(type: ContextType, data: Record<string, any>): UserContext {
    return new UserContext(type, data, new Date());
  }

  update(data: Record<string, any>): void {
    this.data = { ...this.data, ...data };
    this.updatedAt = new Date();
  }
}
```

### 5. CustomAttribute

Custom key-value attribute with type information.

```typescript
enum AttributeType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  OBJECT = 'OBJECT'
}

class CustomAttribute {
  constructor(
    public readonly key: string,
    public readonly value: any,
    public readonly type: AttributeType,
    public readonly category?: string
  ) {}

  static create(key: string, value: any, category?: string): CustomAttribute {
    const type = CustomAttribute.inferType(value);
    return new CustomAttribute(key, value, type, category);
  }

  private static inferType(value: any): AttributeType {
    if (typeof value === 'string') return AttributeType.STRING;
    if (typeof value === 'number') return AttributeType.NUMBER;
    if (typeof value === 'boolean') return AttributeType.BOOLEAN;
    if (value instanceof Date) return AttributeType.DATE;
    return AttributeType.OBJECT;
  }
}
```

### 6. TimePattern

Temporal pattern for habit occurrence.

```typescript
class TimePattern {
  constructor(
    public readonly timeOfDay?: TimeOfDay,
    public readonly dayOfWeek?: DayOfWeek,
    public readonly timeRange?: TimeRange
  ) {}

  matches(timestamp: Date): boolean {
    if (this.timeOfDay) {
      const hour = timestamp.getHours();
      const expectedTimeOfDay = this.getTimeOfDay(hour);
      if (expectedTimeOfDay !== this.timeOfDay) return false;
    }

    if (this.dayOfWeek) {
      if (timestamp.getDay() !== this.dayOfWeek) return false;
    }

    if (this.timeRange) {
      const time = timestamp.getHours() * 60 + timestamp.getMinutes();
      if (!this.timeRange.contains(time)) return false;
    }

    return true;
  }

  private getTimeOfDay(hour: number): TimeOfDay {
    if (hour >= 5 && hour < 12) return TimeOfDay.MORNING;
    if (hour >= 12 && hour < 17) return TimeOfDay.AFTERNOON;
    if (hour >= 17 && hour < 21) return TimeOfDay.EVENING;
    return TimeOfDay.NIGHT;
  }
}

enum TimeOfDay {
  MORNING = 'MORNING',   // 5am-12pm
  AFTERNOON = 'AFTERNOON', // 12pm-5pm
  EVENING = 'EVENING',   // 5pm-9pm
  NIGHT = 'NIGHT'        // 9pm-5am
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

class TimeRange {
  constructor(
    public readonly startMinutes: number, // Minutes from midnight
    public readonly endMinutes: number
  ) {}

  contains(minutes: number): boolean {
    return minutes >= this.startMinutes && minutes <= this.endMinutes;
  }
}
```

### 7. ContextCondition

Condition that must be met for a habit to apply.

```typescript
class ContextCondition {
  constructor(
    public readonly field: string,
    public readonly operator: ConditionOperator,
    public readonly value: any
  ) {}

  matches(context: ContextSnapshot): boolean {
    const contextValue = (context as any)[this.field] || context.metadata[this.field];

    switch (this.operator) {
      case ConditionOperator.EQUALS:
        return contextValue === this.value;
      case ConditionOperator.CONTAINS:
        return contextValue?.includes(this.value);
      case ConditionOperator.GREATER_THAN:
        return contextValue > this.value;
      case ConditionOperator.LESS_THAN:
        return contextValue < this.value;
      default:
        return false;
    }
  }
}

enum ConditionOperator {
  EQUALS = 'EQUALS',
  CONTAINS = 'CONTAINS',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN'
}
```

---

## Domain Events

### 1. PreferenceSet

Emitted when a user preference is explicitly set or updated.

```typescript
interface PreferenceSet {
  profileId: string;
  userId: string;
  tenantId: string;
  domain: string;
  key: string;
  value: any;
  confidence: number;
  timestamp: Date;
}
```

**Subscribers:**
- Proactivity Context (adjust suggestions based on preferences)
- All Domain Contexts (adapt behavior to user preferences)

### 2. BehaviorRecorded

Emitted when user behavior is observed and recorded.

```typescript
interface BehaviorRecorded {
  profileId: string;
  userId: string;
  tenantId: string;
  action: string;
  context: Record<string, any>;
  metadata: Record<string, any>;
  timestamp: Date;
}
```

**Subscribers:**
- Proactivity Context (detect patterns for suggestions)
- Analytics Context (aggregate behavioral data)

### 3. RelationshipAdded

Emitted when a new relationship is added to a profile.

```typescript
interface RelationshipAdded {
  profileId: string;
  userId: string;
  tenantId: string;
  relatedProfileId: string;
  type: RelationshipType;
  strength: number;
  metadata: Record<string, any>;
  timestamp: Date;
}
```

**Subscribers:**
- Communication Context (prioritize messages from strong relationships)
- Calendar Context (suggest meeting times considering relationships)

### 4. RelationshipUpdated

Emitted when relationship strength or metadata changes.

```typescript
interface RelationshipUpdated {
  profileId: string;
  userId: string;
  tenantId: string;
  relatedProfileId: string;
  oldStrength: number;
  newStrength: number;
  changes: Record<string, any>;
  timestamp: Date;
}
```

### 5. ContextUpdated

Emitted when user context information changes.

```typescript
interface ContextUpdated {
  profileId: string;
  userId: string;
  tenantId: string;
  contextType: ContextType;
  data: Record<string, any>;
  timestamp: Date;
}
```

**Subscribers:**
- Proactivity Context (adjust suggestions based on context)
- All Domain Contexts (adapt behavior to current context)

### 6. ProfileEmbeddingGenerated

Emitted when profile embedding is created or refreshed.

```typescript
interface ProfileEmbeddingGenerated {
  profileId: string;
  userId: string;
  tenantId: string;
  model: string;
  dimensions: number;
  timestamp: Date;
}
```

**Subscribers:**
- Search Context (enable semantic profile search)

### 7. ProfileCompletenessChanged

Emitted when profile completeness score changes significantly (>10%).

```typescript
interface ProfileCompletenessChanged {
  profileId: string;
  userId: string;
  tenantId: string;
  oldCompleteness: number;
  newCompleteness: number;
  timestamp: Date;
}
```

**Subscribers:**
- Onboarding Context (track onboarding progress)
- Proactivity Context (suggest profile enrichment)

---

## Domain Services

### 1. ProfileEnrichmentService

**Responsibility:** Automatically enrich profiles with inferred data from observations.

```typescript
interface ProfileEnrichmentService {
  inferPreferences(
    profile: UserProfile,
    behaviors: BehaviorRecorded[]
  ): Promise<Map<string, Preference>>;

  detectHabits(
    profile: UserProfile,
    behaviors: BehaviorRecorded[]
  ): Promise<Habit[]>;

  suggestRelationships(
    profile: UserProfile,
    communicationData: CommunicationData[]
  ): Promise<Relationship[]>;

  enrichFromExternalSource(
    profile: UserProfile,
    source: ExternalDataSource,
    data: any
  ): Promise<void>;
}
```

**Implementation Notes:**
- Uses LLM to infer preferences from behavioral patterns
- Applies statistical analysis to detect reliable habits
- Analyzes communication frequency/patterns to suggest relationships
- Supports import from external services (Google, Apple, etc.)

### 2. ProfileMatchingService

**Responsibility:** Find similar profiles based on embeddings and attributes.

```typescript
interface ProfileMatchingService {
  findSimilarProfiles(
    profile: UserProfile,
    limit: number,
    minSimilarity: number
  ): Promise<SimilarProfile[]>;

  matchByAttributes(
    criteria: Record<string, any>,
    tenantId: string
  ): Promise<UserProfile[]>;

  clusterProfiles(
    tenantId: string,
    numClusters: number
  ): Promise<ProfileCluster[]>;
}

interface SimilarProfile {
  profile: UserProfile;
  similarity: number;
  matchingAttributes: string[];
}
```

**Implementation Notes:**
- Uses cosine similarity on embeddings
- Supports attribute-based filtering
- K-means clustering for profile segmentation
- Tenant-scoped search only

### 3. RelationshipGraphService

**Responsibility:** Analyze relationship networks and suggest connections.

```typescript
interface RelationshipGraphService {
  buildGraph(tenantId: string): Promise<RelationshipGraph>;

  findShortestPath(
    fromProfileId: string,
    toProfileId: string
  ): Promise<ProfilePath>;

  suggestIntroductions(
    profileId: string,
    limit: number
  ): Promise<IntroductionSuggestion[]>;

  getInfluentialProfiles(
    tenantId: string,
    limit: number
  ): Promise<UserProfile[]>;
}

interface IntroductionSuggestion {
  suggestedProfile: UserProfile;
  mutualConnections: UserProfile[];
  reason: string;
}
```

**Implementation Notes:**
- Uses Neo4j graph database
- Implements graph algorithms (shortest path, centrality, community detection)
- Suggests introductions based on mutual connections and shared attributes

---

## Business Rules

### 1. Habit Reliability Threshold

**Rule:** A habit must have at least 3 observations and reliability >= 0.6 to be considered reliable.

**Rationale:** Prevents acting on insufficient or inconsistent behavioral data.

**Enforcement:**
- `Habit.isReliable()` checks observation count and reliability score
- Profile completeness calculation only counts reliable habits
- Proactivity Context only uses reliable habits for suggestions

### 2. Preference Confidence

**Rule:** Preferences with confidence < 0.7 are considered "tentative" and should be confirmed before making critical decisions.

**Rationale:** Inferred preferences may be incorrect; explicit user confirmation provides better experience.

**Enforcement:**
- `Preference.isConfident()` checks confidence threshold
- UI should prompt user to confirm tentative preferences
- Critical operations (e.g., booking flights) require confident preferences

### 3. Relationship Staleness

**Rule:** Relationships without interaction for >90 days are marked as "stale" and have reduced weight in recommendations.

**Rationale:** People's relationships change over time; stale data leads to irrelevant suggestions.

**Enforcement:**
- `Relationship.isStale()` checks last interaction date
- Proactivity Context reduces weight of stale relationships
- UI prompts user to update or remove stale relationships

### 4. Embedding Freshness

**Rule:** Profile embeddings must be regenerated at least every 30 days.

**Rationale:** Profiles change over time; stale embeddings lead to poor search results.

**Enforcement:**
- `ProfileEmbedding.isStale()` checks generation date
- Background job regenerates stale embeddings
- ProfileMatchingService triggers regeneration if embedding missing or stale

### 5. Tenant Isolation

**Rule:** Profiles, relationships, and searches must NEVER cross tenant boundaries.

**Rationale:** Privacy and security requirement for multi-tenant system.

**Enforcement:**
- All queries scoped by `tenantId`
- Relationship validation checks both profiles are in same tenant
- Graph database uses tenant-partitioned storage
- Application-level security checks on all operations

---

## Use Cases

### Use Case 1: Infer User Preferences from Behavior

**Actor:** System (ProfileEnrichmentService)

**Trigger:** Scheduled job (nightly) or manual enrichment request

**Preconditions:**
- User has active profile
- At least 10 behavioral observations recorded

**Flow:**
1. ProfileEnrichmentService retrieves all BehaviorRecorded events for user
2. Groups behaviors by domain and action type
3. For each behavior pattern:
   - Calculate frequency and consistency
   - If pattern is significant (>5 occurrences, >0.6 consistency):
     - Infer preference from pattern
     - Calculate confidence score (0.5-0.9 for inferred)
     - Create Preference with INFERRED source
4. Call UserProfile.setPreference() for each inferred preference
5. Emit PreferenceSet events
6. Recalculate profile completeness

**Postconditions:**
- Profile has additional inferred preferences
- Completeness score increased
- Proactivity Context notified of new preferences

**Example:**
```
Behaviors observed:
- User books meetings at 10am-11am (8 times)
- User books meetings at 2pm-3pm (6 times)
- User never books meetings at 8am-9am (0 times)

Inferred preferences:
- calendar.preferred_meeting_times = ["10:00-11:00", "14:00-15:00"] (confidence: 0.75)
- calendar.avoid_meeting_times = ["08:00-09:00"] (confidence: 0.65)
```

---

### Use Case 2: Suggest Relationships from Communication Patterns

**Actor:** User (via ProfileEnrichmentService)

**Trigger:** User connects email/calendar account via Plugin Context

**Preconditions:**
- User has active profile
- Communication plugin integrated
- User granted permission to analyze communication data

**Flow:**
1. Plugin Context emits PluginDataSynced event with communication data
2. ProfileEnrichmentService receives event
3. Analyzes communication patterns:
   - Email frequency with each contact
   - Meeting attendance with each contact
   - Response times and message lengths
4. For each significant contact (>5 interactions in past 90 days):
   - Check if related UserProfile exists (match by email)
   - Calculate relationship strength (0.0-1.0) based on:
     - Frequency (40%)
     - Recency (30%)
     - Bidirectionality (30%)
   - Infer relationship type based on:
     - Email domain (same = COLLEAGUE)
     - Communication style (formal = CLIENT/VENDOR, casual = FRIEND)
     - Meeting patterns (1-on-1s with manager = MANAGER)
5. Present relationship suggestions to user in UI
6. User confirms/rejects each suggestion
7. For confirmed relationships:
   - Call UserProfile.addRelationship()
   - Emit RelationshipAdded event
8. Recalculate profile completeness

**Postconditions:**
- Profile has new confirmed relationships
- RelationshipGraph updated
- Proactivity Context can use relationships for suggestions

**Example:**
```
Communication analysis for sarah@example.com:
- 24 emails in past 90 days
- 8 meetings attended together
- Average response time: 2 hours
- Same email domain as user

Suggested relationship:
- Type: COLLEAGUE
- Strength: 0.82 (HIGH)
- Metadata: { sameTeam: true, frequentCollaborator: true }
```

---

### Use Case 3: Context-Aware Profile Query

**Actor:** Domain Context (e.g., Calendar, Communication)

**Trigger:** Domain Context needs to make personalized decision

**Preconditions:**
- User has active profile
- Domain Context has current user context

**Flow:**
1. Domain Context captures current ContextSnapshot:
   - Location (from device)
   - Time of day
   - Day of week
   - Activity (from calendar if available)
   - Device type
2. Domain Context queries ProfileSupervisor via MCP:
   ```
   GET /profile/preferences?domain=calendar&context={...}
   ```
3. ProfileSupervisor retrieves UserProfile
4. Filters preferences by domain
5. For each preference:
   - Check if preference has context conditions
   - If yes, evaluate conditions against ContextSnapshot
   - If no, include as default
6. Return matching preferences ranked by confidence
7. Domain Context uses preferences to make decision
8. Domain Context records decision as BehaviorRecorded event
9. ProfileSupervisor stores behavior for future enrichment

**Postconditions:**
- Domain Context has context-aware preferences
- User behavior recorded for learning

**Example:**
```
Request from CalendarSupervisor:
{
  domain: "calendar",
  context: {
    timeOfDay: "MORNING",
    dayOfWeek: MONDAY,
    location: "office",
    activity: "commute"
  }
}

Response:
[
  {
    key: "meeting_duration",
    value: 30, // Shorter meetings on Monday morning
    confidence: 0.85
  },
  {
    key: "buffer_time",
    value: 15, // More buffer during commute
    confidence: 0.78
  }
]
```

---

## Repository Interfaces

### ProfileRepository

```typescript
interface ProfileRepository {
  // Basic CRUD
  save(profile: UserProfile): Promise<void>;
  findById(profileId: string): Promise<UserProfile | null>;
  findByUserId(userId: string, tenantId: string): Promise<UserProfile | null>;
  delete(profileId: string): Promise<void>;

  // Query by attributes
  findByAttribute(
    key: string,
    value: any,
    tenantId: string
  ): Promise<UserProfile[]>;

  // Embedding search
  findByEmbeddingSimilarity(
    embedding: number[],
    tenantId: string,
    limit: number,
    minSimilarity: number
  ): Promise<UserProfile[]>;

  // Tenant queries
  findByTenant(tenantId: string, limit: number, offset: number): Promise<UserProfile[]>;
  countByTenant(tenantId: string): Promise<number>;

  // Completeness queries
  findIncompleteProfiles(tenantId: string, threshold: number): Promise<UserProfile[]>;
}
```

### RelationshipRepository

```typescript
interface RelationshipRepository {
  // Relationship queries
  findRelationships(profileId: string): Promise<Relationship[]>;
  findRelationshipsByType(
    profileId: string,
    type: RelationshipType
  ): Promise<Relationship[]>;

  // Graph queries (delegated to Neo4j)
  findShortestPath(
    fromProfileId: string,
    toProfileId: string
  ): Promise<string[]>;

  findMutualConnections(
    profileId1: string,
    profileId2: string
  ): Promise<string[]>;

  findStaleRelationships(
    tenantId: string,
    daysThreshold: number
  ): Promise<Relationship[]>;
}
```

---

## Integration Points

### Inbound (Profile Context consumes)

| **Source Context** | **Event** | **Purpose** |
|-------------------|-----------|-------------|
| Identity Context | UserRegistered | Create initial profile |
| Identity Context | UserUpdated | Update personal info |
| Plugin Context | PluginDataSynced | Import external data (contacts, calendars, etc.) |
| All Domain Contexts | DomainEventOccurred | Record behavior for habit detection |
| Communication Context | MessageSent, MessageReceived | Build relationship graph |
| Calendar Context | MeetingScheduled, MeetingAttended | Infer preferences and relationships |

### Outbound (Profile Context publishes)

| **Event** | **Subscribers** |
|-----------|----------------|
| PreferenceSet | All Domain Contexts, Proactivity Context |
| BehaviorRecorded | Proactivity Context, Analytics Context |
| RelationshipAdded | Communication Context, Calendar Context |
| RelationshipUpdated | Communication Context, Calendar Context |
| ContextUpdated | All Domain Contexts, Proactivity Context |
| ProfileEmbeddingGenerated | Search Context |
| ProfileCompletenessChanged | Onboarding Context, Proactivity Context |

### MCP Interface

The Profile Context exposes MCP tools for other Supervisors:

```typescript
interface ProfileMCPTools {
  // Read operations
  get_preference(domain: string, key: string, context?: ContextSnapshot): Preference | null;
  get_habits(pattern?: string): Habit[];
  get_relationships(type?: RelationshipType): Relationship[];
  get_context(type: ContextType): UserContext | null;

  // Write operations
  set_preference(domain: string, key: string, value: any, confidence?: number): void;
  record_behavior(action: string, context: ContextSnapshot, metadata?: Record<string, any>): void;
  add_relationship(relatedProfileId: string, type: RelationshipType, strength: number, metadata?: Record<string, any>): void;
  update_context(type: ContextType, data: Record<string, any>): void;

  // Search operations
  find_similar_profiles(limit: number, minSimilarity: number): UserProfile[];
  match_profiles(criteria: Record<string, any>): UserProfile[];
}
```

---

## Testing Strategy

### Unit Tests

**Aggregate Tests:**
```typescript
describe('UserProfile', () => {
  it('should set preference and emit PreferenceSet event');
  it('should record behavior and create or update habit');
  it('should add relationship with validation');
  it('should update context and emit ContextUpdated event');
  it('should recalculate completeness score correctly');
  it('should transition status from INCOMPLETE to ACTIVE at 40% completeness');
});

describe('Habit', () => {
  it('should detect DAILY frequency from observations');
  it('should calculate reliability based on consistency');
  it('should require 3 observations to be reliable');
  it('should match action and context conditions');
});

describe('Relationship', () => {
  it('should validate strength range');
  it('should detect stale relationships after 90 days');
  it('should record interaction timestamps');
});
```

**Value Object Tests:**
```typescript
describe('ProfileEmbedding', () => {
  it('should calculate cosine similarity correctly');
  it('should detect stale embeddings after 30 days');
  it('should validate vector dimensions match');
});

describe('TimePattern', () => {
  it('should match timestamp against time of day');
  it('should match timestamp against day of week');
  it('should match timestamp against time range');
});
```

### Integration Tests

```typescript
describe('Profile Enrichment Flow', () => {
  it('should infer preferences from behavior patterns');
  it('should detect habits from repeated observations');
  it('should suggest relationships from communication data');
  it('should import data from external sources');
});

describe('Profile Matching Flow', () => {
  it('should find similar profiles by embedding similarity');
  it('should match profiles by attributes');
  it('should cluster profiles within tenant');
});

describe('Relationship Graph Flow', () => {
  it('should build relationship graph for tenant');
  it('should find shortest path between profiles');
  it('should suggest introductions based on mutual connections');
});
```

### End-to-End Tests

```typescript
describe('Profile Context E2E', () => {
  it('should create profile on user registration');
  it('should enrich profile from calendar integration');
  it('should use preferences in domain context decision');
  it('should update habits from recorded behaviors');
  it('should generate and refresh embeddings');
  it('should respect tenant isolation in all operations');
});
```

---

## Implementation Notes

### Storage Strategy

**Primary Storage:** PostgreSQL
- Profiles, preferences, habits, relationships
- JSONB columns for flexible attributes and metadata
- Indexes on tenantId, userId, completeness

**Graph Storage:** Neo4j
- Relationship graph for advanced queries
- Nodes: UserProfile
- Edges: Relationship (with type and strength)
- Enables shortest path, centrality, community detection

**Vector Storage:** pgvector (PostgreSQL extension)
- Profile embeddings for semantic search
- Cosine similarity search with indexes

**Cache:** Redis
- Hot profiles (recently accessed)
- Preference lookups
- TTL: 1 hour

### Event Serialization

```typescript
// Event payload format
{
  "eventType": "PreferenceSet",
  "eventId": "evt_abc123",
  "aggregateId": "profile_xyz789",
  "aggregateType": "UserProfile",
  "tenantId": "tenant_001",
  "timestamp": "2025-01-15T10:30:00Z",
  "payload": {
    "profileId": "profile_xyz789",
    "userId": "user_123",
    "tenantId": "tenant_001",
    "domain": "calendar",
    "key": "meeting_duration",
    "value": 30,
    "confidence": 1.0
  },
  "metadata": {
    "causationId": "cmd_def456",
    "correlationId": "req_ghi789",
    "userId": "user_123"
  }
}
```

### Performance Considerations

**Embedding Generation:**
- Expensive operation (LLM call)
- Run asynchronously in background job
- Batch process for multiple profiles
- Cache embeddings for 30 days

**Habit Detection:**
- CPU-intensive statistical calculations
- Run in background job (nightly)
- Process only profiles with new behaviors
- Use sampling for large behavior datasets

**Relationship Graph:**
- Neo4j handles graph queries efficiently
- Limit graph traversal depth (max 3 hops)
- Cache frequently accessed paths
- Precompute centrality scores (daily)

---

## Open Questions / Future Enhancements

1. **Privacy Controls:** How should users control what behaviors are recorded? Opt-in/opt-out per domain?

2. **Data Retention:** How long should behavioral observations be retained? GDPR considerations?

3. **Cross-Tenant Relationships:** Should Enterprise tier support relationships across tenant boundaries (e.g., client/vendor relationships)?

4. **Preference Conflicts:** How to handle conflicting preferences (e.g., "prefer morning meetings" vs "avoid meetings before 10am")?

5. **Habit Decay:** Should habit reliability decay over time if no recent observations?

6. **Explainability:** Should we provide explanations for inferred preferences ("We noticed you always book 30-minute meetings...")?

7. **Profile Versioning:** Should we maintain profile history for time-travel queries?

---

## Summary

The **Profile Context** is a critical Supporting Domain that enables personalization across Fidus. Key characteristics:

- **Rich User Models:** Combines explicit preferences, observed habits, relationships, and contextual data
- **Continuous Learning:** Automatically enriches profiles from behavioral observations
- **Context-Aware:** Provides preferences that adapt to user's current situation
- **Graph-Based Relationships:** Enables social features and introduction suggestions
- **Semantic Search:** Vector embeddings enable finding similar users
- **Privacy-Focused:** Tenant isolation, explicit consent for data collection
- **Multi-Tier Support:** Basic profiles for Community, rich profiles for Cloud, advanced features for Enterprise

This domain model provides the foundation for Fidus to understand users deeply and provide truly personalized experiences.

# Memory Domain - Entity-Relationship Model

**Version:** 3.0
**Date:** 2025-11-19
**Status:** Active
**Part of:** Fidus Memory System
**Supersedes:** Profile Domain v2.0 (Situational Context)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| **1.0** | 2024-XX-XX | Initial profile domain with preferences |
| **2.0** | 2025-11-03 | Added Situational Context (Situation as entity) |
| **3.0** | 2025-11-19 | **Major refactoring:** Situational Context as Relationship Qualifier (ADR-0001), added Person, Organization, Goal, Habit, Event, Object, Location entities |

**Migration from v2.0 to v3.0:** See [ADR-0001: Situational Context as Relationship Qualifier](../adr/ADR-0001-situational-context-as-relationship-qualifier.md) and [ADR-0002: Property Placement Strategy](../adr/ADR-0002-property-placement-and-geospatial-exception.md)

**Critical Changes in v3.0:**
- ❌ **Removed:** `Situation` entity (was Neo4j node in v2.0)
- ✅ **Added:** `Situation` as Value Object (Qdrant payload only)
- ✅ **Added:** 7 new entity types (Person, Organization, Goal, Habit, Event, Object, Location)
- ✅ **Changed:** Relationships now have `situation_id` reference instead of `IN_SITUATION` relationship
- ✅ **Changed (ADR-0002):** Role, status, type moved from Neo4j to Qdrant context
- ✅ **Changed (ADR-0002):** Neo4j stores ONLY structural + temporal boundaries
- ✅ **Changed (ADR-0002):** Qdrant stores ALL descriptive/contextual properties

---

## Overview

The **Memory Domain** is a **Core Domain** in Fidus that manages:

1. **Domain Entities** - Things with independent identity (Person, Organization, Goal, etc.)
2. **Relationships** - How the user connects to entities (KNOWS, WORKS_AT, PURSUES, etc.)
3. **Situational Context** - Flexible, AI-generated metadata qualifying relationships (time, emotion, activity, etc.)
4. **Preferences** - User's learned likes/dislikes in various contexts

**Architecture Principle:** **3-Layer Separation**

```
Layer 1: Domain Entities (Neo4j Nodes)
  ↓  Independent identity, minimal core schema + AI-discovered properties

Layer 2: Relationships (Neo4j Relationships)
  ↓  Stable connections with role, relationship_type, situation_id

Layer 3: Situational Context (Qdrant)
  ↓  Flexible, AI-generated context factors (NO fixed schema!)
```

**Reference:** [Entity-Relationship Model Architecture](../architecture/10-entity-relationship-model.md)

---

## Multi-Tenancy & GDPR

**Tenant Isolation:**
- All entities scoped to `tenantId`
- Relationships cannot cross tenant boundaries
- Qdrant payloads filtered by `tenant_id`

**GDPR Right to Erasure:**
- Delete User → CASCADE delete all entities owned by user
- Delete Entity → CASCADE delete all relationships to entity
- Delete Relationship → CASCADE delete situation in Qdrant (via `situation_id`)
- Retention: Context data subject to same deletion as entities

---

## 1. Domain Entities (Neo4j Nodes)

**Design Principle:** Minimal core schema + AI-discovered properties

### 1.1 User (Aggregate Root)

**Identity:**
- `id: UUID` - Unique identifier
- `tenant_id: UUID` - Tenant scope

**Core Properties (Required):**
- `email: string` - User email (from auth system)
- `created_at: timestamp` - Creation time
- `updated_at: timestamp` - Last update time

**User Attributes (Optional):**
- `name: string` - Display name
- `preferred_language: string` - e.g., "de", "en"
- `timezone: string` - e.g., "Europe/Berlin"
- `skills: string[]` - List of skills (Priority 🟢 Low, may be upgraded to entity later)

**AI-Discovered Properties (Examples, not exhaustive):**
- `notification_preferences: object` - Learned preferences
- `active_hours: string[]` - When user is typically active
- Any other properties the AI discovers from conversation

**Cypher Example:**
```cypher
CREATE (u:User {
  id: randomUUID(),
  tenant_id: $tenant_id,
  email: "user@example.com",
  name: "Max Mustermann",
  preferred_language: "de",
  timezone: "Europe/Berlin",
  skills: ["python", "typescript"],
  created_at: datetime(),
  updated_at: datetime()
})
```

**Invariants:**
1. User must have valid `email`
2. User must belong to exactly one tenant
3. `skills` array must contain lowercase strings

---

### 1.2 Person

**Aggregate:** Person (can exist independently)

**Identity:**
- `id: UUID` - Unique identifier
- `tenant_id: UUID` - Tenant scope

**Core Properties (Required):**
- `name: string` - Person's name (e.g., "Anna Schmidt")
- `created_at: timestamp`
- `updated_at: timestamp`

**AI-Discovered Properties (Examples):**
- `profession: string` - e.g., "Software Engineer"
- `topics: string[]` - Shared interests, e.g., ["tech", "hiking"]
- `communication_style: string` - e.g., "direct", "diplomatic"
- `availability_pattern: string` - e.g., "weekdays 9-17"
- `contact_preferences: object` - How they prefer to be contacted
- Any other properties extracted from conversation

**Cypher Example:**
```cypher
CREATE (p:Person {
  id: randomUUID(),
  tenant_id: $tenant_id,
  name: "Anna Schmidt",
  profession: "Software Engineer",  // AI-discovered
  topics: ["technology", "hiking", "photography"],  // AI-discovered
  communication_style: "direct",  // AI-discovered
  created_at: datetime(),
  updated_at: datetime()
})
```

**Relationships:**
- `(User)-[:KNOWS {role, relationship_type, situation_id}]->(Person)`

**Invariants:**
1. Person must have non-empty `name`
2. Person belongs to one tenant (no cross-tenant sharing)

---

### 1.3 Organization

**Aggregate:** Organization (can exist independently)

**Identity:**
- `id: UUID`
- `tenant_id: UUID`

**Core Properties (Required):**
- `name: string` - Organization name (e.g., "ACME Corp")
- `created_at: timestamp`
- `updated_at: timestamp`

**AI-Discovered Properties (Examples):**
- `industry: string` - e.g., "technology", "healthcare"
- `size: string` - e.g., "startup", "enterprise"
- `location: string` - e.g., "Berlin, Germany"
- `culture: string` - e.g., "remote-first", "hierarchical"
- `benefits: string[]` - e.g., ["gym", "flextime"]
- Any other properties

**Cypher Example:**
```cypher
CREATE (o:Organization {
  id: randomUUID(),
  tenant_id: $tenant_id,
  name: "ACME Corp",
  industry: "technology",  // AI-discovered
  size: "enterprise",  // AI-discovered
  culture: "remote-first",  // AI-discovered
  created_at: datetime(),
  updated_at: datetime()
})
```

**Relationships:**
- `(User)-[:WORKS_AT {role, department, situation_id}]->(Organization)`
- `(User)-[:MEMBER_OF {membership_type, situation_id}]->(Organization)`

**Invariants:**
1. Organization must have non-empty `name`

---

### 1.4 Goal

**Aggregate:** Goal (represents user objectives)

**Identity:**
- `id: UUID`
- `tenant_id: UUID`

**Core Properties (Required):**
- `description: string` - Goal description (e.g., "Abnehmen auf 75kg")
- `type: string` - Category (e.g., "health", "career", "learning")
- `created_at: timestamp`
- `updated_at: timestamp`

**AI-Discovered Properties (Examples):**
- `target_value: string` - e.g., "75kg", "B2 German"
- `current_value: string` - Current progress
- `deadline: date` - Target completion date
- `motivation: string` - Why this goal matters
- `obstacles: string[]` - Identified challenges
- `strategies: string[]` - Approaches being used
- `milestones: object[]` - Sub-goals
- Any other properties

**Cypher Example:**
```cypher
CREATE (g:Goal {
  id: randomUUID(),
  tenant_id: $tenant_id,
  description: "Abnehmen auf 75kg",
  type: "health",
  target_value: "75kg",  // AI-discovered
  current_value: "82kg",  // AI-discovered
  deadline: date("2026-06-01"),  // AI-discovered
  motivation: "Gesundheit verbessern",  // AI-discovered
  obstacles: ["Zeit", "Süßigkeiten"],  // AI-discovered
  strategies: ["Joggen", "Kalorienzählen"],  // AI-discovered
  created_at: datetime(),
  updated_at: datetime()
})
```

**Relationships:**
- `(User)-[:PURSUES {priority, status, situation_id}]->(Goal)`

**Invariants:**
1. Goal must have non-empty `description`
2. `type` should be AI-categorized (not enforced schema)

---

### 1.5 Habit

**Aggregate:** Habit (recurring behaviors)

**Identity:**
- `id: UUID`
- `tenant_id: UUID`

**Core Properties (Required):**
- `description: string` - Habit description (e.g., "Joggen montags")
- `type: string` - Category (e.g., "exercise", "learning", "self-care")
- `created_at: timestamp`
- `updated_at: timestamp`

**AI-Discovered Properties (Examples):**
- `frequency: string` - e.g., "daily", "3x/week", "monthly"
- `trigger: string` - What initiates the habit (e.g., "waking up", "after work")
- `duration_minutes: number` - Typical duration
- `location: string` - Where it happens
- `benefits: string[]` - Why user does it
- `challenges: string[]` - Obstacles to consistency
- Any other properties

**Cypher Example:**
```cypher
CREATE (h:Habit {
  id: randomUUID(),
  tenant_id: $tenant_id,
  description: "Joggen montags",
  type: "exercise",
  frequency: "weekly",  // AI-discovered
  trigger: "Monday morning",  // AI-discovered
  duration_minutes: 45,  // AI-discovered
  location: "park",  // AI-discovered
  created_at: datetime(),
  updated_at: datetime()
})
```

**Relationships:**
- `(User)-[:HAS_HABIT {consistency, situation_id}]->(Habit)`

**Invariants:**
1. Habit must have non-empty `description`

---

### 1.6 Event

**Aggregate:** Event (scheduled occurrences)

**Identity:**
- `id: UUID`
- `tenant_id: UUID`

**Core Properties (Required):**
- `title: string` - Event name (e.g., "Q4 Review Meeting")
- `date: date` or `datetime` - When it occurs
- `created_at: timestamp`
- `updated_at: timestamp`

**AI-Discovered Properties (Examples):**
- `location: string` - Where it happens
- `duration_minutes: number` - How long
- `participants: string[]` - Who attends
- `preparation_needed: string[]` - What to prepare
- `importance: string` - e.g., "high", "medium", "low"
- `recurrence: string` - e.g., "weekly", "monthly"
- Any other properties

**Cypher Example:**
```cypher
CREATE (e:Event {
  id: randomUUID(),
  tenant_id: $tenant_id,
  title: "Q4 Review Meeting",
  date: datetime("2025-11-25T14:00:00"),
  location: "Meeting Room A",  // AI-discovered
  duration_minutes: 90,  // AI-discovered
  participants: ["Anna", "Bob", "CEO"],  // AI-discovered
  importance: "high",  // AI-discovered
  created_at: datetime(),
  updated_at: datetime()
})
```

**Relationships:**
- `(User)-[:ATTENDS {role, situation_id}]->(Event)`

**Invariants:**
1. Event must have `title` and `date`

---

### 1.7 Object

**Aggregate:** Object (physical things user owns/uses)

**Identity:**
- `id: UUID`
- `tenant_id: UUID`

**Core Properties (Required):**
- `name: string` - Object name (e.g., "MacBook Pro 2023")
- `type: string` - Category (e.g., "laptop", "car", "appliance")
- `created_at: timestamp`
- `updated_at: timestamp`

**AI-Discovered Properties (Examples):**
- `brand: string` - e.g., "Apple", "Tesla"
- `model: string` - Specific model
- `purchase_date: date` - When acquired
- `usage_context: string` - When/how it's used (e.g., "work", "personal")
- `maintenance_schedule: string` - Service intervals
- `location: string` - Where it's stored
- Any other properties

**Cypher Example:**
```cypher
CREATE (obj:Object {
  id: randomUUID(),
  tenant_id: $tenant_id,
  name: "MacBook Pro",
  type: "laptop",
  brand: "Apple",  // AI-discovered
  model: "M3 Max 16-inch",  // AI-discovered
  usage_context: "work",  // AI-discovered
  created_at: datetime(),
  updated_at: datetime()
})
```

**Relationships:**
- `(User)-[:OWNS {usage_context, situation_id}]->(Object)`

**Invariants:**
1. Object must have `name` and `type`

---

### 1.8 Location

**Aggregate:** Location (places with significance)

**Identity:**
- `id: UUID`
- `tenant_id: UUID`

**Core Properties (Required):**
- `name: string` - Location name (e.g., "Café Central")
- `type: string` - Category (e.g., "cafe", "office", "home")
- `created_at: timestamp`
- `updated_at: timestamp`

**AI-Discovered Properties (Examples):**
- `address: string` - Physical address
- `city: string` - City name
- `atmosphere: string` - e.g., "quiet", "busy", "cozy"
- `wifi_quality: string` - e.g., "excellent", "poor"
- `visit_frequency: string` - e.g., "daily", "weekly"
- `favorite_spot: string` - Specific area within location
- Any other properties

**Cypher Example:**
```cypher
CREATE (l:Location {
  id: randomUUID(),
  tenant_id: $tenant_id,
  name: "Café Central",
  type: "cafe",
  address: "Hauptstraße 42, Berlin",  // AI-discovered
  atmosphere: "quiet and cozy",  // AI-discovered
  wifi_quality: "excellent",  // AI-discovered
  visit_frequency: "weekly",  // AI-discovered
  created_at: datetime(),
  updated_at: datetime()
})
```

**Relationships:**
- `(User)-[:FREQUENTS {visit_pattern, situation_id}]->(Location)`

**Invariants:**
1. Location must have `name` and `type`

---

### 1.9 Preference

**Aggregate:** Preference (user likes/dislikes)

**Identity:**
- `id: UUID`
- `tenant_id: UUID`

**Core Properties (Required):**
- `value: string` - What the user prefers (e.g., "Cappuccino", "Jazz")
- `category: string` - Domain category (e.g., "food", "music", "workflow")
- `created_at: timestamp`
- `updated_at: timestamp`

**AI-Discovered Properties (Examples):**
- `strength: string` - e.g., "strong", "mild"
- `alternatives: string[]` - Other acceptable options
- `excludes: string[]` - What to avoid
- Any other properties

**Cypher Example:**
```cypher
CREATE (p:Preference {
  id: randomUUID(),
  tenant_id: $tenant_id,
  value: "Cappuccino",
  category: "coffee",
  strength: "medium",  // AI-discovered
  alternatives: ["Latte", "Flat White"],  // AI-discovered
  excludes: ["Espresso", "Americano"],  // AI-discovered
  created_at: datetime(),
  updated_at: datetime()
})
```

**Relationships:**
- `(User)-[:HAS_PREFERENCE {confidence, source, situation_id}]->(Preference)`

**Invariants:**
1. Preference must have `value` and `category`

---

## 2. Relationships (Neo4j Relationships)

**Design Principle (ADR-0002):** Neo4j stores ONLY structural + temporal properties. ALL context in Qdrant.

### Standard Relationship Properties (All Relationships)

```cypher
[relationship_type {
  relationship_instance_id: UUID,  // Unique ID for this relationship instance
  situation_id: UUID,              // Reference to Qdrant context
  observed_at: datetime,           // When was this relationship observed
  confidence: float,               // AI confidence (0.0-1.0)
  source: string                   // "explicit" | "implicit"

  // Optional temporal boundaries (for efficient date queries):
  // started_at, ended_at, joined_at, left_at, attended_at, target_date
}]
```

**Temporal Boundaries (ADR-0002):**
- **WORKS_AT:** `started_at`, `ended_at`
- **MEMBER_OF:** `joined_at`, `left_at`
- **PURSUES:** `started_at`, `target_date`, `ended_at`
- **HAS_HABIT:** `started_at`, `ended_at`
- **ATTENDS:** `attended_at`
- **KNOWS, OWNS, FREQUENTS, HAS_PREFERENCE:** No temporal boundaries

---

### 2.1 KNOWS (User → Person) - ADR-0002 Compliant

**Connects:** User to Person

**Neo4j Properties (STRUCTURAL ONLY - no temporal boundaries):**
- `relationship_instance_id`: UUID
- `situation_id`: UUID (Qdrant reference)
- `observed_at`: datetime
- `confidence`: float
- `source`: string

**Qdrant Context (ALL DESCRIPTIVE + SITUATIONAL):**
- `role`: "colleague", "friend", "family", "mentor" (now in Qdrant!)
- `relationship_type`: "professional", "personal", "family" (now in Qdrant!)
- `communication_frequency`: "daily", "weekly" (AI-learned, now in Qdrant!)
- `topics`: ["work", "tech", "hiking"] (AI-learned, now in Qdrant!)
- `emotion`: "friendly", "tense", "respectful" (situational)
- `mood`: "collaborative", "distant" (situational)
- `activity`: "project_discussion", "lunch" (situational)
- `location`: "office", "cafe" (situational)
- `time_of_day`: "morning", "evening" (situational)

**Cypher Example (v3.0 - ADR-0002):**
```cypher
// Neo4j: STRUCTURAL ONLY
MATCH (u:User {id: $user_id, tenant_id: $tenant_id})
MATCH (p:Person {id: $person_id, tenant_id: $tenant_id})
CREATE (u)-[r:KNOWS {
  relationship_instance_id: randomUUID(),
  situation_id: $situation_id,       // Reference to Qdrant
  observed_at: datetime(),
  confidence: 0.9,
  source: "explicit"
}]->(p)
```

```python
# Qdrant: ALL CONTEXT
{
  "id": $situation_id,
  "payload": {
    "relationship_instance_id": "rel-uuid",
    "context": {
      "role": "colleague",                    # Now in Qdrant!
      "relationship_type": "professional",     # Now in Qdrant!
      "communication_frequency": "daily",      # Now in Qdrant!
      "topics": ["work", "tech"],             # Now in Qdrant!
      "emotion": "friendly",                   # Situational
      "mood": "collaborative"                  # Situational
    }
  }
}
```

**BREAKING CHANGE (v3.0):** `role`, `relationship_type`, etc. moved from Neo4j to Qdrant per ADR-0002!

**Invariants:**
1. `confidence` must be 0.0-1.0
2. Both User and Person must exist in same tenant
3. Role must be in Qdrant context, NOT Neo4j!

---

### 2.2 WORKS_AT (User → Organization) - ADR-0002 Compliant

**Connects:** User to Organization

**Neo4j Properties (STRUCTURAL + TEMPORAL):**
- `relationship_instance_id`: UUID
- `situation_id`: UUID
- `started_at`: date (✅ Temporal boundary)
- `ended_at`: date | null (✅ Temporal boundary)
- `observed_at`: datetime
- `confidence`: float
- `source`: string

**Qdrant Context (ALL DESCRIPTIVE + SITUATIONAL):**
- `role`: "Senior Engineer", "Manager" (now in Qdrant!)
- `department`: "Product Development" (now in Qdrant!)
- `employment_type`: "full_time", "part_time" (now in Qdrant!)
- `satisfaction_level`: "high", "medium", "low" (now in Qdrant!)
- `started_at`: "2023-01-15" (copied for completeness)
- `ended_at`: null (copied for completeness)
- `mood`: "productive", "frustrated" (situational)
- `stress_level`: "high", "low" (situational)
- `activity`: "coding", "meetings" (situational)
- `deadline_pressure`: "high", "normal" (situational)

**Cypher Example (v3.0 - ADR-0002):**
```cypher
// Neo4j: STRUCTURAL + TEMPORAL ONLY
MATCH (u:User {id: $user_id})
MATCH (o:Organization {id: $org_id})
CREATE (u)-[r:WORKS_AT {
  relationship_instance_id: randomUUID(),
  situation_id: $situation_id,
  started_at: date("2023-01-15"),    // ✅ Temporal boundary
  ended_at: null,                     // ✅ Still active
  observed_at: datetime(),
  confidence: 1.0,
  source: "explicit"
}]->(o)
```

```python
# Qdrant: ALL CONTEXT
{
  "id": $situation_id,
  "payload": {
    "relationship_instance_id": "rel-uuid",
    "context": {
      "role": "Senior Engineer",             # Now in Qdrant!
      "department": "Product Development",    # Now in Qdrant!
      "employment_type": "full_time",         # Now in Qdrant!
      "satisfaction_level": "high",           # Now in Qdrant!
      "started_at": "2023-01-15",            # Copied
      "ended_at": null,                       # Copied
      "mood": "productive",                   # Situational
      "stress_level": "medium"                # Situational
    }
  }
}
```

**Temporal Query Example:**
```cypher
// Find who worked at ACME during 2023 (efficient!)
MATCH (u:User)-[r:WORKS_AT]->(o:Organization {name: "ACME Corp"})
WHERE r.started_at <= date("2023-12-31")
  AND (r.ended_at IS NULL OR r.ended_at >= date("2023-01-01"))
RETURN u.name
```

---

### 2.3 MEMBER_OF (User → Organization) - ADR-0002 Compliant

**Connects:** User to Organization (non-employment membership)

**Examples:** Gym membership, club membership, community membership

**Neo4j Properties (STRUCTURAL + TEMPORAL):**
- `relationship_instance_id`: UUID
- `situation_id`: UUID
- `joined_at`: date (✅ Temporal boundary)
- `left_at`: date | null (✅ Temporal boundary)
- `observed_at`: datetime
- `confidence`: float
- `source`: string

**Qdrant Context (ALL DESCRIPTIVE + SITUATIONAL):**
- `membership_type`: "gym", "club", "community" (now in Qdrant!)
- `status`: "active", "lapsed" (now in Qdrant!)
- `role`: "member", "organizer" (now in Qdrant!)
- `joined_at`: "2024-01-01" (copied)
- `left_at`: null (copied)
- `engagement_level`: "high", "low" (situational)

**Cypher Example (v3.0 - ADR-0002):**
```cypher
CREATE (u)-[r:MEMBER_OF {
  relationship_instance_id: randomUUID(),
  situation_id: $situation_id,
  joined_at: date("2024-01-01"),     // ✅ Temporal boundary
  left_at: null,                      // ✅ Still active
  observed_at: datetime(),
  confidence: 1.0,
  source: "explicit"
}]->(o)
```

```python
# Qdrant: ALL CONTEXT
{
  "context": {
    "membership_type": "gym",          # Now in Qdrant!
    "status": "active",                # Now in Qdrant!
    "role": "member",                  # Now in Qdrant!
    "joined_at": "2024-01-01",        # Copied
    "engagement_level": "high"         # Situational
  }
}
```

---

### 2.4 PURSUES (User → Goal)

**Connects:** User to Goal

**Stable Properties (Neo4j):**
- `priority: string` - e.g., "high", "medium", "low"
- `status: string` - e.g., "active", "paused", "completed", "abandoned"
- `started_at: date` - When goal pursuit started
- `target_date: date` - When goal should be achieved (optional)
- `commitment_level: string` - AI-assessed commitment (e.g., "strong", "wavering")
- `main_obstacle: string` - Primary challenge (AI-discovered)

**Situational Context (Qdrant):**
- `motivation_level: string` - Current motivation (situational!)
- `recent_progress: string` - Recent wins/setbacks
- `emotion: string` - How they feel about the goal right now
- ... (AI-generated)

**Cypher Example:**
```cypher
MATCH (u:User {id: $user_id})
MATCH (g:Goal {id: $goal_id})
CREATE (u)-[r:PURSUES {
  relationship_instance_id: randomUUID(),
  situation_id: $situation_id,
  priority: "high",             // STABLE
  status: "active",             // STABLE (changes via commands, not situational)
  started_at: date("2025-11-01"),
  target_date: date("2026-06-01"),
  commitment_level: "strong",   // STABLE (overall assessment)
  main_obstacle: "time_management",  // STABLE (primary challenge)
  observed_at: datetime(),
  confidence: 0.85
}]->(g)
```

---

### 2.5 HAS_HABIT (User → Habit)

**Connects:** User to Habit

**Stable Properties (Neo4j):**
- `consistency: float` - Adherence rate (0.0-1.0, e.g., 0.85 = 85% consistent)
- `started_at: date` - When habit was established
- `last_performed: datetime` - Most recent occurrence
- `streak_days: number` - Current consecutive days (if applicable)

**Situational Context (Qdrant):**
- `energy_level: string` - Energy when performing habit
- `motivation: string` - Why doing it today
- `location: string` - Where habit is performed
- ... (AI-generated)

**Cypher Example:**
```cypher
MATCH (u:User {id: $user_id})
MATCH (h:Habit {id: $habit_id})
CREATE (u)-[r:HAS_HABIT {
  relationship_instance_id: randomUUID(),
  situation_id: $situation_id,
  consistency: 0.85,           // STABLE (overall pattern)
  started_at: date("2025-01-01"),
  last_performed: datetime(),
  streak_days: 42,             // STABLE (current streak)
  observed_at: datetime(),
  confidence: 0.9
}]->(h)
```

---

### 2.6 ATTENDS (User → Event)

**Connects:** User to Event

**Stable Properties (Neo4j):**
- `role: string` - Role at event (e.g., "presenter", "participant", "organizer")
- `attendance_status: string` - e.g., "confirmed", "tentative", "declined"
- `importance: string` - How important this event is (e.g., "high", "medium", "low")

**Situational Context (Qdrant):**
- `preparation_level: string` - How prepared user feels
- `stress_level: string` - Stress about the event
- `emotion: string` - How they feel about attending
- ... (AI-generated)

**Cypher Example:**
```cypher
MATCH (u:User {id: $user_id})
MATCH (e:Event {id: $event_id})
CREATE (u)-[r:ATTENDS {
  relationship_instance_id: randomUUID(),
  situation_id: $situation_id,
  role: "presenter",           // STABLE
  attendance_status: "confirmed",
  importance: "high",          // STABLE
  observed_at: datetime(),
  confidence: 1.0
}]->(e)
```

---

### 2.7 OWNS (User → Object)

**Connects:** User to Object

**Stable Properties (Neo4j):**
- `usage_context: string` - Primary use case (e.g., "work", "personal", "shared")
- `acquired_at: date` - When object was acquired (optional)
- `sentimental_value: string` - Emotional attachment (AI-assessed, e.g., "high", "low")

**Situational Context (Qdrant):**
- `current_location: string` - Where object is right now (situational!)
- `condition: string` - Current state (situational!)
- ... (AI-generated)

**Cypher Example:**
```cypher
MATCH (u:User {id: $user_id})
MATCH (o:Object {id: $object_id})
CREATE (u)-[r:OWNS {
  relationship_instance_id: randomUUID(),
  situation_id: $situation_id,
  usage_context: "work",       // STABLE
  acquired_at: date("2023-05-15"),
  sentimental_value: "low",    // STABLE (overall)
  observed_at: datetime(),
  confidence: 1.0
}]->(o)
```

---

### 2.8 FREQUENTS (User → Location)

**Connects:** User to Location

**Stable Properties (Neo4j):**
- `visit_pattern: string` - How often user visits (AI-learned, e.g., "daily", "weekly", "monthly")
- `first_visit: date` - When user first went there (optional)
- `favorite_aspects: string[]` - What user likes about this place (AI-discovered)

**Situational Context (Qdrant):**
- `visit_purpose: string` - Why visiting today (e.g., "work", "relaxation", "meeting")
- `mood: string` - Current mood at location
- `activity: string` - What doing at location
- ... (AI-generated)

**Cypher Example:**
```cypher
MATCH (u:User {id: $user_id})
MATCH (l:Location {id: $location_id})
CREATE (u)-[r:FREQUENTS {
  relationship_instance_id: randomUUID(),
  situation_id: $situation_id,
  visit_pattern: "weekly",     // STABLE (learned pattern)
  first_visit: date("2024-03-01"),
  favorite_aspects: ["quiet", "good wifi", "coffee"],  // STABLE
  observed_at: datetime(),
  confidence: 0.9
}]->(l)
```

---

### 2.9 HAS_PREFERENCE (User → Preference)

**Connects:** User to Preference

**Stable Properties (Neo4j):**
- `strength: string` - How strong the preference is (e.g., "strong", "mild", "flexible")
- `source: string` - How learned (e.g., "explicit" = user stated, "implicit" = AI inferred)

**Situational Context (Qdrant):**
- `time_of_day: string` - When preference applies
- `activity: string` - During what activity
- `mood: string` - In what mood
- `emotion: string` - Emotional state
- ... (AI-generated, VERY important for preferences!)

**Cypher Example:**
```cypher
MATCH (u:User {id: $user_id})
MATCH (p:Preference {id: $pref_id})
CREATE (u)-[r:HAS_PREFERENCE {
  relationship_instance_id: randomUUID(),
  situation_id: $situation_id,  // CRITICAL: Context determines when preference applies!
  strength: "strong",           // STABLE
  source: "explicit",           // STABLE
  observed_at: datetime(),
  confidence: 0.95
}]->(p)
```

**Note:** Preferences are HIGHLY context-dependent! The same user may prefer different things in different situations. This is why `situation_id` is critical for preferences.

---

## 3. Value Objects

### 3.1 ContextFactors (Qdrant Payload)

**Type:** Value Object (NOT an entity!)

**Purpose:** Flexible, AI-generated situational metadata

**Schema:** **NONE!** AI determines structure dynamically

**Structure:**
```python
class ContextFactors(BaseModel):
    factors: dict[str, Any]  # Completely flexible!

    @field_validator('factors')
    @classmethod
    def validate_snake_case(cls, v: dict) -> dict:
        # Only constraint: keys must be snake_case
        for key in v.keys():
            if not key.islower() or ' ' in key:
                raise ValueError(f"Context factor '{key}' must be in snake_case format")
        return v
```

**Examples:**

```python
# Example 1: Work context
context = ContextFactors(factors={
    "time_of_day": "morning",
    "location": "office",
    "activity": "project_discussion",
    "mood": "focused",
    "deadline_pressure": "high",
    "coffee_consumed": 2,
    "energy_level": "medium"
})

# Example 2: Social context
context = ContextFactors(factors={
    "time_of_day": "evening",
    "location": "cafe",
    "social_setting": "one_on_one",
    "emotion": "relaxed",
    "topic": "personal",
    "atmosphere": "quiet"
})

# Example 3: Health context
context = ContextFactors(factors={
    "time_of_day": "morning",
    "activity": "post_workout",
    "energy_level": "low",
    "physical_state": "exhausted",
    "heart_rate_bpm": 145,
    "hydration_level": "good"
})
```

**Critical:** The AI can invent **ANY new factors** without schema changes!

---

### 3.2 Situation (Qdrant Document)

**Type:** Value Object (combines context + embedding)

**Storage:** Qdrant ONLY (NOT Neo4j!)

**Purpose:** Store flexible context with vector embedding for similarity search

**Structure:**
```python
class Situation(BaseModel):
    id: str  # UUID (referenced by Neo4j relationships as situation_id)
    tenant_id: str
    user_id: str
    context: ContextFactors  # Flexible context factors
    embedding: list[float]  # 768-dim vector (nomic-embed-text)
    created_at: str  # ISO 8601 timestamp
    updated_at: str
```

**Qdrant Schema:**
```python
{
  "id": "sit-uuid",
  "vector": [0.1, 0.2, ...],  # 768-dim embedding
  "payload": {
    # Fixed metadata (for filtering)
    "tenant_id": "tenant-1",
    "user_id": "user-123",
    "entity_type": "person" | "preference" | "goal" | ...,
    "entity_id": "entity-uuid",
    "relationship_type": "KNOWS" | "HAS_PREFERENCE" | ...,
    "relationship_instance_id": "rel-uuid",
    "created_at": "2025-11-19T10:00:00Z",
    "updated_at": "2025-11-19T10:00:00Z",

    # FLEXIBLE CONTEXT (NO SCHEMA!)
    "context": {
      # AI-generated factors (completely flexible!)
      "time_of_day": "morning",
      "emotion": "stressed",
      "activity": "project_work",
      "deadline_pressure": "high",
      "coffee_count_today": 3,
      # ... ANY other factors AI discovers!
    }
  }
}
```

**Key Points:**
1. ✅ **No required fields** in `context` object
2. ✅ **Flat or nested** structures (max 2-3 levels recommended)
3. ✅ **Any JSON types** (string, number, boolean, array, object)
4. ✅ **New factors emerge** without system changes
5. ✅ **Domain-specific factors** (e.g., `heart_rate_bpm` for health)

---

## 4. Bounded Contexts

### 4.1 Memory Context (Core Domain)

**Responsibility:** Manage user's personal knowledge graph (entities, relationships, context)

**Aggregates:**
- User (Aggregate Root)
- Person, Organization, Goal, Habit, Event, Object, Location, Preference (Independent Aggregates)

**Services:**
- EntityExtractionService - AI extracts entities from conversation
- RelationshipService - Creates/updates relationships
- ContextStorageService - Stores situations in Qdrant
- ContextRetrievalService - Finds similar situations (similarity search)

**Integration:**
- Provides preferences to all Domain Supervisors
- Consumes events from Calendar, Finance, etc. to enrich entities

---

## 5. Ubiquitous Language Updates

### New Terms (v3.0)

| Term | Definition | Example |
|------|------------|---------|
| **Entity** | Domain object with independent identity | Person, Organization, Goal |
| **Relationship** | Stable connection between User and Entity | KNOWS, WORKS_AT, PURSUES |
| **Role** | User's role in a relationship (STABLE property) | "colleague", "friend", "father" |
| **Relationship Type** | Nature of relationship (STABLE property) | "professional", "personal", "family" |
| **Situational Context** | Flexible, AI-generated metadata qualifying relationships | emotion, time_of_day, activity, mood |
| **Context Factor** | Individual piece of situational metadata | "emotion: stressed", "time_of_day: morning" |
| **Situation** | Snapshot of context at a point in time (Value Object) | {emotion: "stressed", deadline_pressure: "high", ...} |
| **AI-Discovered Property** | Property dynamically added by AI from conversation | "communication_style: direct" on Person |
| **Stable Property** | Relationship property that doesn't change situationally | role, relationship_type, employment_type |

### Deprecated Terms (v2.0 → v3.0)

| Deprecated Term | Replacement | Reason |
|-----------------|-------------|--------|
| ❌ Situation (Entity) | ✅ Situation (Value Object in Qdrant) | Situation is not a domain entity, it's metadata |
| ❌ IN_SITUATION (Relationship) | ✅ situation_id (Property) | Direct reference is simpler |
| ❌ Role (Entity) | ✅ role (Relationship Property) | Role describes relationship, not a thing |
| ❌ Emotion (Entity) | ✅ emotion (Context Factor) | Emotion is situational, not independent |
| ❌ UserContext (v1.0) | ✅ Situation (v2.0+) | Renamed for clarity |

### Clarified Terms

| Term | v2.0 Definition | v3.0 Definition | Change |
|------|-----------------|-----------------|--------|
| **Context** | Ambiguous (could mean situation or domain) | **Situational Context** = metadata in Qdrant | Clarified scope |
| **Preference** | Static user choice | **Context-dependent** user choice | Added context dependency |
| **Profile** | User aggregate | User aggregate + all related entities | Expanded scope |

---

## 6. Anti-Patterns (What NOT to Do)

### ❌ Anti-Pattern 1: Role as Entity

**WRONG:**
```cypher
CREATE (r:Role {name: "colleague"})
CREATE (u:User)-[:HAS_ROLE]->(r)
```

**CORRECT:**
```cypher
CREATE (u:User)-[:KNOWS {role: "colleague"}]->(p:Person)
```

**Reason:** Role is a property of the relationship, not a thing with independent identity.

---

### ❌ Anti-Pattern 2: Emotion as Entity

**WRONG:**
```cypher
CREATE (e:Emotion {type: "stressed"})
CREATE (u:User)-[:FEELS]->(e)
```

**CORRECT (in Qdrant):**
```python
{
  "context": {
    "emotion": "stressed",
    "stress_level": "high"
  }
}
```

**Reason:** Emotions are highly situational and have no independent identity.

---

### ❌ Anti-Pattern 3: Context Properties in Neo4j

**WRONG:**
```cypher
CREATE (u)-[:KNOWS {
  role: "colleague",
  emotion: "friendly",         // ❌ Situational!
  time_of_day: "morning",      // ❌ Situational!
  mood: "energetic"            // ❌ Situational!
}]->(p)
```

**CORRECT:**
```cypher
// Neo4j: STABLE properties only
CREATE (u)-[:KNOWS {
  role: "colleague",           // ✅ Stable
  relationship_type: "professional",  // ✅ Stable
  situation_id: "sit-123"      // ✅ Reference to Qdrant
}]->(p)

// Qdrant: SITUATIONAL context
{
  "id": "sit-123",
  "context": {
    "emotion": "friendly",
    "time_of_day": "morning",
    "mood": "energetic"
  }
}
```

**Reason:** Situational context belongs in Qdrant, not Neo4j. Neo4j stores stable properties only.

---

### ❌ Anti-Pattern 4: Fixed Context Schema

**WRONG:**
```python
class Context(BaseModel):
    time_of_day: Literal["morning", "afternoon", "evening"]  # ❌ Fixed!
    location: Literal["home", "office", "cafe"]  # ❌ Fixed!
    emotion: Literal["happy", "sad", "stressed"]  # ❌ Fixed!
```

**CORRECT:**
```python
class ContextFactors(BaseModel):
    factors: dict[str, Any]  # ✅ Fully flexible!
```

**Reason:** AI must be free to discover new context factors without schema changes.

---

## 7. Implementation Guidelines

### 7.1 Entity Creation (AI-Driven)

```python
# User says: "Ich habe heute mit Anna über das Projekt gesprochen"

# 1. AI extracts entity
entity_extraction = {
    "entity_type": "person",
    "name": "Anna",
    "properties": {
        "profession": "colleague",  # Inferred from context
        "topics": ["work_projects"]  # Observed discussion topics
    }
}

# 2. Create Neo4j node (minimal schema)
await neo4j.run("""
    MERGE (p:Person {name: $name, tenant_id: $tenant_id})
    ON CREATE SET
        p.id = randomUUID(),
        p.created_at = datetime(),
        p.profession = $profession,
        p.topics = $topics
    ON MATCH SET
        p.updated_at = datetime(),
        p.topics = CASE
            WHEN NOT $topics[0] IN p.topics
            THEN p.topics + $topics
            ELSE p.topics
        END
""", name="Anna", profession="colleague", topics=["work_projects"])
```

**Key:** AI dynamically adds properties (`profession`, `topics`) without schema migration.

---

### 7.2 Relationship Creation with Context

```python
# User says: "Anna ist meine Kollegin, wir arbeiten oft morgens zusammen an Projekten"

# 1. AI extracts relationship + context
extraction = {
    "relationship_type": "KNOWS",
    "stable_properties": {  # Neo4j
        "role": "colleague",
        "relationship_type": "professional",
        "communication_frequency": "daily",  # AI inferred
        "topics": ["work", "projects"]  # AI observed
    },
    "situational_context": {  # Qdrant
        "time_of_day": "morning",
        "activity": "project_collaboration",
        "location": "office",  # Inferred
        "mood": "focused"  # Inferred
    }
}

# 2. Store context in Qdrant
situation_id = str(uuid4())
relationship_instance_id = str(uuid4())
embedding = await embedding_service.embed(situational_context)

await qdrant.upsert(
    collection_name="situations",
    points=[{
        "id": situation_id,
        "vector": embedding,
        "payload": {
            "entity_type": "person",
            "entity_id": person_id,
            "relationship_type": "KNOWS",
            "relationship_instance_id": relationship_instance_id,
            "user_id": user_id,
            "tenant_id": tenant_id,
            "context": situational_context  # Full flexible context!
        }
    }]
)

# 3. Create relationship in Neo4j (stable properties only)
await neo4j.run("""
    MATCH (u:User {id: $user_id, tenant_id: $tenant_id})
    MATCH (p:Person {id: $person_id, tenant_id: $tenant_id})
    CREATE (u)-[r:KNOWS {
        relationship_instance_id: $rel_id,
        situation_id: $sit_id,
        role: $role,
        relationship_type: $rel_type,
        communication_frequency: $comm_freq,
        topics: $topics,
        observed_at: datetime(),
        confidence: 0.9,
        source: "explicit"
    }]->(p)
""",
    user_id=user_id,
    person_id=person_id,
    rel_id=relationship_instance_id,
    sit_id=situation_id,
    role="colleague",
    rel_type="professional",
    comm_freq="daily",
    topics=["work", "projects"]
)
```

---

### 7.3 Context-Aware Retrieval

```python
# User asks: "Mit wem sollte ich über das dringende Projekt sprechen?"
# Current context: stressed, high deadline pressure, morning

# 1. Extract current context
current_context = {
    "activity": "project_work",
    "emotion": "stressed",
    "deadline_pressure": "high",
    "urgency": "high",
    "time_of_day": "morning"
}

# 2. Generate embedding
embedding = await embedding_service.embed(current_context)

# 3. Find similar situations in Qdrant
results = await qdrant.search(
    collection_name="situations",
    query_vector=embedding,
    query_filter={
        "must": [
            {"key": "user_id", "match": {"value": user_id}},
            {"key": "tenant_id", "match": {"value": tenant_id}},
            {"key": "entity_type", "match": {"value": "person"}},
            {"key": "relationship_type", "match": {"value": "KNOWS"}}
        ]
    },
    limit=5
)

# 4. Get person entities from Neo4j
situation_ids = [r.id for r in results]

persons = await neo4j.run("""
    MATCH (u:User {id: $user_id})-[r:KNOWS]->(p:Person)
    WHERE r.situation_id IN $sit_ids
    RETURN p.name, r.role, r.topics, r.confidence
    ORDER BY r.confidence DESC
""", user_id=user_id, sit_ids=situation_ids)

# Result: "Anna (colleague, 0.95 similarity) - she's great with urgent projects"
```

---

## 8. Migration from v2.0 to v3.0

**See:** [ADR-0001 Implementation Plan](../adr/ADR-0001-situational-context-as-relationship-qualifier.md#implementation-plan)

**Key Changes:**
1. Delete `Situation` nodes from Neo4j
2. Delete `IN_SITUATION` relationships
3. Add `situation_id` property to all relationships
4. Update Qdrant payload structure
5. Migrate existing context data

**Note:** No production data exists yet, so migration is not needed.

---

## 9. Related Documents

- **[ADR-0002: Property Placement Strategy and Geospatial Exception](../adr/ADR-0002-property-placement-and-geospatial-exception.md)** - **CRITICAL:** Neo4j vs Qdrant property placement
- **[ADR-0001: Situational Context as Relationship Qualifier](../adr/ADR-0001-situational-context-as-relationship-qualifier.md)** - Technical decision
- **[Entity-Relationship Model Architecture](../architecture/10-entity-relationship-model.md)** - Architecture overview
- **[Situational Context Architecture](../architecture/08-situational-context-architecture.md)** - Context principles
- **[Profile Domain v2.0](11-profile-domain.md)** - Previous version (deprecated)

---

**Maintained by:** Memory Team
**Last Updated:** 2025-11-19
**Next Review:** After implementing Person, Organization, Goal entities

---

**End of Document**

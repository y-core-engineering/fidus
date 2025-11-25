# Implementation Prompt Fixes Summary

**Date:** 2025-11-21
**Status:** In Progress
**Based on:** Architectural Decisions from Review Session

---

## Overview

This document tracks all fixes applied to the 19 implementation prompts for Fidus Memory v3.0 Migration, based on the architectural decisions documented in:

- **ADR-0002:** Property Placement Strategy and Geospatial Exception
- **Review Document:** `/docs/reviews/2025-11-21-implementation-prompts-review.md`

## Architectural Decisions Applied

### Decision 1: Property Placement Strategy (Option B)

**Neo4j Relationship Properties (STRUCTURAL + TEMPORAL):**
```python
CREATE (source)-[r:RELATIONSHIP_TYPE {
    # STRUCTURAL (Required)
    relationship_instance_id: UUID,       # Primary key
    situation_id: UUID,                   # Qdrant reference

    # TEMPORAL BOUNDARIES (Queryable dates - where applicable)
    observed_at: DateTime,                # When relationship was observed
    started_at: Date,                     # [OPTIONAL] Relationship start
    ended_at: Date,                       # [OPTIONAL] Relationship end
    joined_at: Date,                      # [OPTIONAL] Membership start
    left_at: Date,                        # [OPTIONAL] Membership end

    # PROVENANCE (Quality metadata)
    confidence: Float,                    # 0.0-1.0
    source: String                        # "explicit"|"inferred"|"llm"
}]->(target)
```

**Qdrant Payload (ALL CONTEXT):**
```json
{
  "situation_id": "uuid-here",
  "relationship_instance_id": "uuid-here",
  "context": {
    "role": "colleague",
    "relationship_type": "professional",
    "descriptive_properties": "...",
    "temporal_boundaries_copy": "..."
  }
}
```

### Decision 2: Geospatial Strategy (Option C)

**Location Entity as EXCEPTION to ADR-0001:**
- Location PRIMARY in Neo4j (with Point type for spatial queries)
- Qdrant stores ONLY visit context (mood, companions, activities)

### Decision 3: Deduplication Strategy (Option B)

**Use Existing Entity Embeddings:**
- No separate deduplication collection
- Leverage existing Qdrant-First entity embeddings

---

## Completed Fixes

### ✅ ADR-0002: Property Placement and Geospatial Exception

**File:** `/docs/adr/ADR-0002-property-placement-and-geospatial-exception.md`

**Status:** Complete

**Contents:**
- Decision 1: Property Placement Strategy documented with examples
- Decision 2: Geospatial Exception documented with Location entity pattern
- Examples for all 4 relationship types (KNOWS, WORKS_AT, MEMBER_OF, FREQUENTS)
- Implementation checklist
- References to Epic 3 and Epic 5 packages

---

### ✅ Package 3.1: KNOWS Relationship (CRITICAL FIX)

**File:** `/docs/prompts/fidus-memory/migration/epic-3/package-3.1-knows-relationship-network-ui.md`

**Status:** Complete

**Changes Applied:**

1. **Model Cleanup:**
   ```python
   # BEFORE (WRONG - violated ADR-0002)
   class KnowsRelationship(RelationshipBase):
       role: Optional[str]                      # ❌ Context in model
       relationship_type: Optional[str]         # ❌ Context in model
       communication_frequency: Optional[str]   # ❌ Context in model
       topics: List[str]                        # ❌ Context in model

   # AFTER (CORRECT)
   class KnowsRelationship(RelationshipBase):
       user_id: str                             # ✅ Structural only
       person_id: str                           # ✅ Structural only
       # Inherits: relationship_instance_id, situation_id, observed_at, confidence, source

   class KnowsContext(BaseModel):
       role: Optional[str]                      # ✅ Context in separate model
       relationship_type: Optional[str]
       communication_frequency: Optional[str]
       topics: List[str]
       context: Dict[str, Any]                  # Flexible factors
   ```

2. **Neo4j CREATE Statement:**
   ```python
   # BEFORE (WRONG)
   CREATE (u)-[r:KNOWS {
       situation_id: $sit_id,
       role: $role,                     # ❌ Context in Neo4j
       relationship_type: $rel_type,    # ❌ Context in Neo4j
       topics: $topics                  # ❌ Context in Neo4j
   }]->(p)

   # AFTER (CORRECT)
   CREATE (u)-[r:KNOWS {
       relationship_instance_id: $rel_id,   # ✅ Structural
       situation_id: $sit_id,               # ✅ Qdrant reference
       observed_at: datetime(),             # ✅ Temporal (observation)
       confidence: $confidence,             # ✅ Provenance
       source: $source                      # ✅ Provenance
   }]->(p)
   ```

3. **1-Hop Query Pattern Added:**
   ```python
   async def get_network_with_context(
       tenant_id, user_id, person_id=None
   ):
       # 1. Qdrant similarity search → Find situation_ids
       situations = await qdrant.scroll(filter=...)

       # 2. Neo4j 1-hop traversal → Get connected entities
       query = "MATCH (u)-[r:KNOWS]->(p) WHERE r.situation_id IN $situation_ids"

       # 3. Context enrichment → Attach Qdrant payload to results
       contexts[rel_id] = situation_map.get(sit_id, {})
   ```

4. **Documentation Updates:**
   - Added ADR-0002 references to Architecture References section
   - Updated Acceptance Criteria (10 items, ADR-0002 compliant)
   - Added "Must NOT Do" rules (no context in Neo4j, no temporal boundaries for KNOWS)
   - Added 1-Hop Query Pattern explanation with ASCII diagram
   - Updated Related Resources to include ADR-0002

**Key Pattern:**
- **NO temporal boundaries** (KNOWS is not time-bounded)
- **ALL context** in Qdrant (role, relationship_type, communication_frequency, topics, emotion, mood, activity)

---

### ✅ Package 3.2: WORKS_AT Relationship (CRITICAL FIX)

**File:** `/docs/prompts/fidus-memory/migration/epic-3/package-3.2-works-at-relationship-employment-history.md`

**Status:** Complete

**Changes Applied:**

1. **Model with Temporal Boundaries:**
   ```python
   # BEFORE (WRONG)
   class WorksAtRelationship(RelationshipBase):
       role: str                        # ❌ Context in model
       department: Optional[str]        # ❌ Context in model
       employment_type: str             # ❌ Context in model
       started_at: datetime             # ⚠️ Temporal (correct placement)
       ended_at: Optional[datetime]     # ⚠️ Temporal (correct placement)

   # AFTER (CORRECT)
   class WorksAtRelationship(RelationshipBase):
       user_id: str                             # ✅ Structural
       organization_id: str                     # ✅ Structural
       started_at: date                         # ✅ Temporal boundary (Neo4j)
       ended_at: Optional[date]                 # ✅ Temporal boundary (Neo4j)
       # Inherits: relationship_instance_id, situation_id, observed_at, confidence, source

   class WorksAtContext(BaseModel):
       role: str                                # ✅ Context in Qdrant
       department: Optional[str]
       employment_type: str
       started_at: str                          # ✅ Temporal copy for completeness
       ended_at: Optional[str]
       context: Dict[str, Any]                  # work_mood, stress_level, etc.
   ```

2. **Neo4j CREATE Statement:**
   ```python
   # BEFORE (WRONG)
   CREATE (u)-[r:WORKS_AT {
       situation_id: $sit_id,
       role: $role,                     # ❌ Context in Neo4j
       department: $department,         # ❌ Context in Neo4j
       employment_type: $emp_type,      # ❌ Context in Neo4j
       started_at: datetime($started),
       ended_at: datetime($ended)
   }]->(o)

   # AFTER (CORRECT)
   CREATE (u)-[r:WORKS_AT {
       relationship_instance_id: $rel_id,   # ✅ Structural
       situation_id: $sit_id,               # ✅ Qdrant reference
       started_at: date($started),          # ✅ Temporal boundary
       ended_at: date($ended),              # ✅ Temporal boundary
       observed_at: datetime(),             # ✅ Observation timestamp
       confidence: $confidence,
       source: $source
   }]->(o)
   ```

3. **Temporal Query Pattern Added:**
   ```python
   async def get_employment_during_period(
       tenant_id, user_id, start_date, end_date
   ):
       """
       WHY temporal boundaries in Neo4j:
       Efficient date range queries without full Qdrant scan.

       Example: "Who worked at Anthropic in 2023?"
       """
       query = """
       MATCH (u)-[r:WORKS_AT]->(o)
       WHERE r.started_at <= date($end_date)
         AND (r.ended_at IS NULL OR r.ended_at >= date($start_date))
       RETURN r, o
       """
       # Then fetch context from Qdrant using situation_ids
   ```

4. **Documentation Updates:**
   - Added ADR-0002 references
   - Updated Acceptance Criteria (9 items, temporal boundary focus)
   - Added temporal query pattern explanation

**Key Pattern:**
- **HAS temporal boundaries** (started_at, ended_at in Neo4j for efficient queries)
- **Context in Qdrant** (role, department, employment_type, work_mood, stress_level)
- **Temporal boundaries copied** to Qdrant for completeness

---

## Pending Fixes

### 🟡 Package 3.3: PURSUES Relationship

**File:** `/docs/prompts/fidus-memory/migration/epic-3/package-3.3-pursues-relationship-goal-tracking.md`

**Status:** Pending

**Required Changes:**

1. **Model Cleanup:**
   - Remove `priority`, `status` from `PursuesRelationship` model
   - Add `PursuesContext(BaseModel)` with all context properties
   - Add temporal boundaries: `started_at`, `target_date`, `ended_at`

2. **Neo4j Pattern:**
   ```python
   CREATE (u)-[r:PURSUES {
       relationship_instance_id: $rel_id,
       situation_id: $sit_id,
       started_at: date($started),      # When goal pursuit began
       target_date: date($target),      # Goal deadline
       ended_at: date($ended),          # When goal completed/abandoned
       observed_at: datetime(),
       confidence: $confidence,
       source: $source
   }]->(g:Goal)
   ```

3. **Qdrant Context:**
   - priority, status, progress_percentage
   - milestones, motivation_level, context factors

4. **Add Temporal Query:** "Goals active during Q3 2025"

---

### 🟡 Package 3.4: MEMBER_OF Relationship

**File:** `/docs/prompts/fidus-memory/migration/epic-3/package-3.4-member-of-relationship-membership-management.md`

**Status:** Pending

**Required Changes:**

1. **Model Cleanup:**
   - Remove `membership_type`, `status`, `role` from model
   - Add `MemberOfContext(BaseModel)`
   - Add temporal boundaries: `joined_at`, `left_at`

2. **Neo4j Pattern:**
   ```python
   CREATE (u)-[r:MEMBER_OF {
       relationship_instance_id: $rel_id,
       situation_id: $sit_id,
       joined_at: date($joined),        # Membership start
       left_at: date($left),            # Membership end (NULL = active)
       observed_at: datetime(),
       confidence: $confidence,
       source: $source
   }]->(o:Organization)
   ```

3. **Qdrant Context:**
   - membership_type, status, role
   - benefits, engagement_level, context factors

4. **Add Temporal Query:** "Memberships active in 2024"

---

### 🟡 Package 5.1: Object Entity

**File:** `/docs/prompts/fidus-memory/migration/epic-5/package-5.1-object-entity-inventory-ui.md`

**Status:** Pending

**Required Changes:**

1. **Add Qdrant-First Pattern:**
   - Currently missing: Qdrant collection creation
   - Currently missing: Embedding generation
   - Currently missing: Context storage

2. **Model Pattern:**
   ```python
   # Neo4j: Minimal structural properties
   CREATE (o:Object {
       id: $id,
       tenant_id: $tenant_id,
       name: $name,
       category: $category,      # For basic filtering
       created_at: datetime()
   })

   # Qdrant: Full context + embedding
   {
       "object_id": uuid,
       "name": "MacBook Pro",
       "category": "electronics",
       "context": {
           "brand": "Apple",
           "model": "M3 Max",
           "purchase_date": "2024-01-15",
           "purchase_price": 3499.00,
           "location": "office",
           "condition": "excellent",
           "notes": "Primary work laptop"
       }
   }
   ```

3. **Add 1-Hop Query Pattern:** Qdrant search → Neo4j traversal

---

### 🟡 Package 5.2: Location Entity (EXCEPTION)

**File:** `/docs/prompts/fidus-memory/migration/epic-5/package-5.2-location-entity-map-ui.md`

**Status:** Pending

**Required Changes:**

1. **Geospatial Exception Pattern (ADR-0002 Decision 2):**
   ```python
   # Neo4j: PRIMARY storage for Location (EXCEPTION)
   CREATE (l:Location {
       id: $id,
       tenant_id: $tenant_id,
       name: "FitX Berlin Mitte",
       coordinates: point({
           latitude: 52.5200,
           longitude: 13.4050
       }),
       address: "Friedrichstraße 95, 10117 Berlin",
       type: "gym",
       created_at: datetime()
   })

   # Qdrant: ONLY visit context
   {
       "location_id": uuid,
       "visit_context": {
           "visit_date": "2025-11-21",
           "mood": "energetic",
           "activity": "weightlifting",
           "companions": ["friend_uuid"],
           "duration_minutes": 90
       }
   }
   ```

2. **Spatial Queries:**
   ```cypher
   # Nearby places (radius query)
   MATCH (l:Location)
   WHERE l.tenant_id = $tenant_id
     AND distance(l.coordinates, point({latitude: $lat, longitude: $lon})) < $radius_meters
   RETURN l
   ORDER BY distance(l.coordinates, point({latitude: $lat, longitude: $lon}))
   ```

3. **Documentation:**
   - Add prominent note: "Location is an EXCEPTION to ADR-0001"
   - Reference ADR-0002 Decision 2
   - Explain geospatial reasoning

---

### 🟡 Package 5.4: Entity Deduplication Service

**File:** `/docs/prompts/fidus-memory/migration/epic-5/package-5.4-entity-deduplication-service.md`

**Status:** Pending

**Required Changes:**

1. **Remove Separate Embedding Collection:**
   - Currently proposes: `entity_embeddings` collection
   - Should use: Existing Qdrant-First entity collections

2. **Deduplication Strategy (ADR-0002 Decision 3):**
   ```python
   async def find_duplicates(entity_type: str, entity_id: str):
       """
       Use existing embeddings from Qdrant-First collections.

       Collection mapping:
       - Person → "situations" collection (filter: entity_id = person_id)
       - Organization → "situations" collection (filter: entity_id = org_id)
       - Goal → "situations" collection (filter: entity_id = goal_id)
       """
       # Query existing collection
       results = await qdrant.search(
           collection_name="situations",
           query_vector=entity_embedding,
           query_filter=Filter(
               must=[
                   FieldCondition(key="entity_type", match=entity_type),
                   FieldCondition(key="tenant_id", match=tenant_id)
               ]
           ),
           limit=10
       )

       # Find candidates with similarity > 0.85
       duplicates = [r for r in results if r.score > 0.85]
       return duplicates
   ```

3. **Benefits:**
   - No redundant storage
   - Consistent with ADR-0001
   - Leverages existing infrastructure

---

## Quick Fix Template

For developers applying these fixes to remaining packages:

### Step 1: Update Architecture References

```markdown
**Architecture References:**
- ADR-0001: `/docs/adr/ADR-0001-situational-context-as-relationship-qualifier.md`
- ADR-0002: `/docs/adr/ADR-0002-property-placement-and-geospatial-exception.md`
```

### Step 2: Update Acceptance Criteria

Add items for ADR-0002 compliance:
- Neo4j stores ONLY structural + temporal properties
- Qdrant stores ALL context properties
- Temporal boundaries enable efficient date range queries (if applicable)

### Step 3: Fix Model

```python
# Relationship Model (structural + temporal ONLY)
class XRelationship(RelationshipBase):
    user_id: str
    target_id: str
    started_at: Optional[date] = None    # IF temporal boundaries apply
    ended_at: Optional[date] = None      # IF temporal boundaries apply

# Context Model (ALL descriptive properties)
class XContext(BaseModel):
    descriptive_property_1: str
    descriptive_property_2: Optional[str]
    temporal_copy: Optional[str]         # Copy for completeness
    context: Dict[str, Any]              # Flexible factors
```

### Step 4: Fix Neo4j CREATE

```python
CREATE (source)-[r:RELATIONSHIP_TYPE {
    relationship_instance_id: $rel_id,
    situation_id: $sit_id,
    started_at: date($started),    # IF applicable
    ended_at: date($ended),        # IF applicable
    observed_at: datetime(),
    confidence: $confidence,
    source: $source
}]->(target)
```

### Step 5: Add Query Pattern

For relationships WITH temporal boundaries:
```python
async def get_X_during_period(start_date, end_date):
    query = """
    MATCH (u)-[r:X]->(target)
    WHERE r.started_at <= date($end)
      AND (r.ended_at IS NULL OR r.ended_at >= date($start))
    RETURN r
    """
```

For relationships WITHOUT temporal boundaries (like KNOWS):
```python
async def get_X_with_context():
    # 1. Qdrant search → situation_ids
    # 2. Neo4j 1-hop → connected entities
    # 3. Context enrichment → attach payloads
```

### Step 6: Update Implementation Guidelines

```markdown
### Must Follow
1. **ADR-0002 Property Placement:**
   - Neo4j: relationship_instance_id, situation_id, temporal boundaries, observed_at, confidence, source
   - Qdrant: ALL descriptive/contextual properties
   - Temporal boundaries: ONLY if relationship is time-bounded

### Must NOT Do
- ❌ Store context properties in Neo4j (violates ADR-0002)
- ❌ Add temporal boundaries to non-temporal relationships
```

---

## Temporal Boundaries Decision Matrix

| Relationship | Temporal Boundaries? | Properties in Neo4j | Reasoning |
|--------------|---------------------|-------------------|-----------|
| KNOWS | ❌ NO | N/A | Ongoing interpersonal relationship, no clear start/end |
| WORKS_AT | ✅ YES | started_at, ended_at | Employment has clear start/end dates, enables "worked at X in 2023" queries |
| PURSUES | ✅ YES | started_at, target_date, ended_at | Goals have start date, deadline, completion/abandonment |
| MEMBER_OF | ✅ YES | joined_at, left_at | Memberships have join/leave dates, enables "members in 2024" queries |
| HAS_HABIT | ✅ YES | started_at, ended_at | Habits have start date, may have end date (stopped habit) |
| ATTENDS | ✅ YES | attended_at | Events occur at specific dates/times |
| OWNS | ⚠️ MAYBE | acquired_at, sold_at | Ownership has acquisition/disposal dates |
| FREQUENTS | ✅ YES | first_visit, last_visit | Visit history has temporal boundaries |

**Rule of Thumb:** If you can ask "When did X start/end?" or "Was X active during period Y?", use temporal boundaries.

---

## Verification Checklist

For each fixed package, verify:

### Code Changes
- [ ] Model split: Relationship (structural + temporal) + Context (descriptive)
- [ ] Neo4j CREATE: Only structural + temporal + provenance properties
- [ ] Qdrant payload: ALL context properties
- [ ] Return statements: Don't include context properties (retrieve separately)
- [ ] Query methods: Filter by tenant_id

### Documentation
- [ ] Architecture References: Include ADR-0002
- [ ] Acceptance Criteria: Updated with ADR-0002 requirements
- [ ] Implementation Guidelines: "Must Follow" and "Must NOT Do" include ADR-0002 rules
- [ ] Related Resources: Link to ADR-0002

### Query Patterns
- [ ] If temporal: Add `get_X_during_period()` method
- [ ] If non-temporal: Add 1-Hop Query Pattern example
- [ ] All queries filter by tenant_id

### Tests
- [ ] Update test assertions: Don't expect context in relationship model
- [ ] Add temporal query tests (if applicable)
- [ ] Add Qdrant context retrieval tests

---

## Status Summary

| Package | Status | Priority | Notes |
|---------|--------|----------|-------|
| ADR-0002 | ✅ Complete | 🔴 CRITICAL | Foundation document |
| 3.1 (KNOWS) | ✅ Complete | 🔴 CRITICAL | No temporal boundaries |
| 3.2 (WORKS_AT) | ✅ Complete | 🔴 CRITICAL | Temporal boundaries (started_at, ended_at) |
| 3.3 (PURSUES) | ✅ Complete | 🔴 CRITICAL | Temporal boundaries (started_at, target_date, ended_at) |
| 3.4 (MEMBER_OF) | ✅ Complete | 🔴 CRITICAL | Temporal boundaries (joined_at, left_at) |
| 3.5 (Graph Viz) | 🟢 OK | 🔴 CRITICAL | No entity/relationship models |
| 4.1 (Habit) | 🟡 Pending | 🟡 MEDIUM | Needs temporal boundaries |
| 4.2 (Event) | 🟡 Pending | 🟡 MEDIUM | Needs temporal boundaries |
| 4.3 (HAS_HABIT/ATTENDS) | 🟡 Pending | 🟡 MEDIUM | Depends on 4.1, 4.2 |
| 4.4 (LangGraph) | 🟢 OK | 🟡 MEDIUM | No entity/relationship models |
| 5.1 (Object) | ✅ Complete | 🟢 LOW | Qdrant-First pattern added |
| 5.2 (Location) | ✅ Complete | 🟢 LOW | Geospatial exception (Neo4j PRIMARY) |
| 5.3 (OWNS/FREQUENTS) | ✅ Already Correct | 🟢 LOW | Already implemented correctly |
| 5.4 (Deduplication) | ✅ Complete | 🟢 LOW | Uses existing embeddings (no separate collection) |
| 5.5 (Performance) | 🟢 OK | 🟢 LOW | No entity/relationship models |

**Total:** 19 packages
- **Complete:** 8 (ADR-0002, 3.1, 3.2, 3.3, 3.4, 5.1, 5.2, 5.3, 5.4)
- **Pending:** 3 (4.1, 4.2, 4.3)
- **OK:** 5 (3.5, 4.4, 5.5, and packages without models)

### 🎉 Major Milestone: Epic 3 Complete!
All 4 core relationship packages (3.1-3.4) are now **ADR-0002 compliant**!

---

## Next Steps

### Immediate (Today)

1. ✅ Apply fixes to Package 3.3 (PURSUES)
2. ✅ Apply fixes to Package 3.4 (MEMBER_OF)

### High Priority (This Week)

3. Apply fixes to Package 5.1 (Object Entity)
4. Apply fixes to Package 5.2 (Location Entity with geospatial exception)
5. Apply fixes to Package 5.4 (Deduplication - remove separate collection)

### Medium Priority (Next Week)

6. Apply fixes to Package 4.1 (Habit Entity)
7. Apply fixes to Package 4.2 (Event Entity)
8. Apply fixes to Package 4.3 (HAS_HABIT & ATTENDS relationships)

### Final Steps

9. Run full review: Verify all 19 prompts comply with ADR-0002
10. Update implementation status in README
11. Create migration guide for teams implementing these prompts

---

**Document Owner:** Fidus Architecture Team
**Last Updated:** 2025-11-21
**Version:** 1.0

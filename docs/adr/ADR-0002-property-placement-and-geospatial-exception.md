# ADR-0002: Property Placement Strategy and Geospatial Exception

**Status:** Accepted
**Date:** 2025-11-21
**Supersedes:** None
**Related:** [ADR-0001](./ADR-0001-situational-context-as-relationship-qualifier.md)

---

## Context

During the implementation of Fidus Memory v3.0 migration prompts, two critical ambiguities emerged:

1. **Property Placement Boundary:** ADR-0001 establishes Qdrant as PRIMARY storage and Neo4j as SECONDARY with references. However, the boundary between "structural" (Neo4j) and "contextual" (Qdrant) properties was unclear, leading to systematic violations across Epic 3 relationship prompts.

2. **Geospatial Conflict:** ADR-0001 requires Qdrant-First pattern, but Qdrant lacks native geospatial indexing (radius queries, nearest neighbor by coordinates). The Location entity requires efficient spatial queries for "nearby places" use cases.

**Review Findings:**
- All 4 Epic 3 relationship prompts (KNOWS, WORKS_AT, PURSUES, MEMBER_OF) stored context properties in Neo4j
- Epic 5 Location entity (5.2) had no clear strategy for geospatial data
- No concrete examples of which properties belong where

---

## Decision

### 1. Property Placement Strategy (Hybrid with Temporal Boundaries)

**Neo4j Relationship Properties (STRUCTURAL + TEMPORAL):**
```python
CREATE (source)-[r:RELATIONSHIP_TYPE {
    # STRUCTURAL (Required)
    relationship_instance_id: UUID,       # Primary key
    situation_id: UUID,                   # Qdrant reference

    # TEMPORAL BOUNDARIES (Queryable dates)
    observed_at: DateTime,                # When relationship was observed
    started_at: Date,                     # [OPTIONAL] Relationship start
    ended_at: Date,                       # [OPTIONAL] Relationship end

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
    "communication_frequency": "weekly",
    "topics": ["ML", "startups"],
    "mood": "friendly",
    "department": "Engineering"
  },
  "metadata": {
    "conversation_id": "uuid",
    "turn_id": 42
  }
}
```

**Rationale:**
- **Temporal boundaries** (started_at, ended_at, joined_at, left_at) enable efficient graph queries: "Who worked at X in 2022?" without full Qdrant scan
- **All descriptive/contextual properties** in Qdrant preserve ADR-0001 principle (Qdrant PRIMARY)
- **1-Hop Query Pattern** remains efficient: Qdrant similarity search → Neo4j 1-hop traversal → Context enrichment

### 2. Geospatial Exception (Location Entity Neo4j Primary)

**Location Entity (Neo4j PRIMARY):**
```cypher
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
    created_at: datetime(),
    updated_at: datetime()
})
```

**Visit Context (Qdrant ONLY):**
```json
{
  "location_id": "uuid-here",
  "visit_context": {
    "visit_date": "2025-11-21",
    "mood": "energetic",
    "activity": "weightlifting",
    "companions": ["friend_uuid_123"],
    "duration_minutes": 90,
    "notes": "Great leg day!"
  }
}
```

**Spatial Query Example:**
```cypher
MATCH (l:Location)
WHERE l.tenant_id = $tenant_id
  AND distance(l.coordinates, point({latitude: $lat, longitude: $lon})) < $radius_meters
RETURN l
ORDER BY distance(l.coordinates, point({latitude: $lat, longitude: $lon}))
LIMIT 20
```

**Rationale:**
- **Exception from ADR-0001:** Location is the ONLY entity type where Neo4j is PRIMARY
- **Geospatial queries** (radius search, nearest neighbor) require Neo4j Point type and spatial index
- **Visit context** (mood, companions, activities) still stored in Qdrant for semantic search
- **Trade-off:** Efficient spatial queries outweigh strict Qdrant-First adherence for this entity type

---

## Consequences

### Positive

1. **Clear Property Placement Rule:**
   - Developers now have concrete guidance: "Is it a date/time boundary? → Neo4j. Is it descriptive? → Qdrant."
   - No more ambiguity about which properties go where

2. **Efficient Temporal Queries:**
   - "Who worked at X between 2020-2023?" → Fast Neo4j query
   - "Show employment history for 2022" → No Qdrant full scan required

3. **Optimal Geospatial Performance:**
   - Radius queries: < 50ms for 1M locations (Neo4j spatial index)
   - vs. Qdrant workaround: Full scan with haversine distance (> 500ms)

4. **Preserved ADR-0001 Intent:**
   - Context still in Qdrant (semantic search, embeddings)
   - Neo4j only stores queryable boundaries and structural references

### Negative

1. **Data Duplication (Minor):**
   - Temporal boundaries stored in BOTH systems (Neo4j for queries, Qdrant for completeness)
   - Impact: ~50 bytes per relationship (negligible)

2. **Architectural Complexity:**
   - Location entity follows different pattern than other entities
   - Developers must remember: "Location is special"

3. **Migration Burden:**
   - Existing KNOWS, WORKS_AT, PURSUES, MEMBER_OF relationships need property migration
   - Estimated: ~500 lines of migration code across 4 prompts

### Risks & Mitigation

| Risk | Mitigation |
|------|-----------|
| Developers forget Location is exception | Document prominently in Entity Overview (solution-architecture) |
| Temporal boundaries drift between systems | Include Qdrant payload in rollback logic |
| Geospatial queries still slow | Add composite Neo4j index: (tenant_id, coordinates) |

---

## Examples by Relationship Type

### 1. KNOWS Relationship (No Temporal Boundaries)
```python
# Neo4j (STRUCTURAL ONLY)
CREATE (u)-[r:KNOWS {
    relationship_instance_id: $rel_id,
    situation_id: $sit_id,
    observed_at: datetime(),
    confidence: 0.9,
    source: "explicit"
}]->(p)

# Qdrant (ALL CONTEXT)
{
  "context": {
    "role": "colleague",
    "communication_frequency": "weekly",
    "topics": ["ML", "startups"]
  }
}
```

### 2. WORKS_AT Relationship (With Temporal Boundaries)
```python
# Neo4j (STRUCTURAL + TEMPORAL)
CREATE (u)-[r:WORKS_AT {
    relationship_instance_id: $rel_id,
    situation_id: $sit_id,
    started_at: date("2020-01-15"),      # ✅ Temporal boundary
    ended_at: date("2023-12-31"),        # ✅ Temporal boundary
    observed_at: datetime(),
    confidence: 0.95,
    source: "explicit"
}]->(o)

# Qdrant (ALL CONTEXT + TEMPORAL COPY)
{
  "context": {
    "role": "Senior ML Engineer",
    "department": "AI Research",
    "employment_type": "full-time",
    "work_mood": "productive",
    "started_at": "2020-01-15",          # Copied for completeness
    "ended_at": "2023-12-31"             # Copied for completeness
  }
}
```

### 3. MEMBER_OF Relationship (With Temporal Boundaries)
```python
# Neo4j (STRUCTURAL + TEMPORAL)
CREATE (u)-[r:MEMBER_OF {
    relationship_instance_id: $rel_id,
    situation_id: $sit_id,
    joined_at: date("2021-06-01"),       # ✅ Temporal boundary
    left_at: null,                       # ✅ Still active
    observed_at: datetime(),
    confidence: 1.0,
    source: "explicit"
}]->(o)

# Qdrant (ALL CONTEXT + TEMPORAL COPY)
{
  "context": {
    "membership_type": "premium",
    "role": "member",
    "status": "active",
    "joined_at": "2021-06-01",
    "engagement_level": "high"
  }
}
```

### 4. FREQUENTS Relationship (Location Exception)
```python
# Neo4j (MINIMAL - Location is PRIMARY)
CREATE (u)-[r:FREQUENTS {
    relationship_instance_id: $rel_id,
    situation_id: $sit_id,
    first_visit: date("2023-01-10"),     # ✅ Temporal boundary
    last_visit: date("2025-11-21"),      # ✅ Temporal boundary
    observed_at: datetime(),
    confidence: 0.85,
    source: "inferred"
}]->(l:Location)

# Qdrant (VISIT CONTEXT ONLY)
{
  "location_id": "uuid-here",
  "visit_context": {
    "frequency": "3x per week",
    "typical_activities": ["gym", "sauna"],
    "preferred_time": "evening",
    "mood": "energetic"
  }
}
```

---

## Implementation Checklist

### Phase 1: Epic 3 Relationship Fixes (CRITICAL)
- [ ] Package 3.1: Fix KNOWS relationship (remove context from Neo4j)
- [ ] Package 3.2: Fix WORKS_AT relationship (add temporal boundaries)
- [ ] Package 3.3: Fix PURSUES relationship (add temporal boundaries)
- [ ] Package 3.4: Fix MEMBER_OF relationship (add temporal boundaries)
- [ ] All Epic 3: Add 1-Hop Query Pattern examples

### Phase 2: Epic 5 Entity Fixes (HIGH)
- [ ] Package 5.1: Add Qdrant-First pattern to Object entity
- [ ] Package 5.2: Implement Location geospatial exception
- [ ] Package 5.3: Verify OWNS/FREQUENTS follow pattern (already correct)

### Phase 3: Documentation Updates
- [ ] Update solution-architecture Entity Overview (Location exception)
- [ ] Update domain-model Relationship Catalog (property lists)
- [ ] Update WBS package descriptions (reference ADR-0002)

---

## References

- **ADR-0001:** [Situational Context as Relationship Qualifier](./ADR-0001-situational-context-as-relationship-qualifier.md)
- **Review Document:** [Implementation Prompts Review](../reviews/2025-11-21-implementation-prompts-review.md)
- **WBS:** [Migration v3.0 Work Breakdown Structure](../prototypes/fidus-memory/migration-v3-wbs.md)
- **Neo4j Spatial:** [Point Type Documentation](https://neo4j.com/docs/cypher-manual/current/values-and-types/spatial/)
- **Qdrant Filtering:** [Payload Filtering](https://qdrant.tech/documentation/concepts/filtering/)

---

**Decision Makers:** Fidus Architecture Team
**Approval Date:** 2025-11-21
**Next Review:** After Epic 3 implementation complete

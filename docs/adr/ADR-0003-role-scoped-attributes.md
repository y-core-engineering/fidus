# ADR-0003: Role-Scoped Attributes (Skills, Goals, Preferences)

**Status:** proposed
**Date:** 2025-12-02
**Supersedes:** Partially supersedes User.skills in Package 1.2

---

## Context

The current architecture (Package 1.2) stores skills as a flat array on the User entity:

```python
User {
    skills: ["Python", "TypeScript", "Eventplanung"]  # All skills in one list
}
```

This approach has significant limitations:

1. **No context separation:** Skills at work vs. skills in a hobby club are mixed together
2. **No role association:** We can't answer "What skills do I use as Software Engineer?"
3. **No goals per context:** Career goals at Company A are different from goals at Hobby Club B
4. **Preferences without context:** "I prefer remote work" only makes sense in a work context

**Real-world example:**

A user might be:
- **Software Engineer** at ACME Corp → Skills: Python, TypeScript; Goals: Tech Lead promotion
- **Board Member** at Sports Club → Skills: Event planning; Goals: Increase membership
- **Friend** of Anna → Preferences: Joint hiking trips

These are fundamentally different contexts that should not be mixed.

---

## Decision

**Role-Scoped Attributes:** Skills, Goals, and Preferences are stored as **context properties on relationships in Qdrant**, not as User-level attributes.

### Data Model

**Neo4j (Structural + Temporal only):**
```cypher
(User)-[:WORKS_AT {
    relationship_instance_id: "uuid",
    situation_id: "sit-uuid",           // Reference to Qdrant
    started_at: date("2023-01-15"),     // Temporal boundary
    ended_at: null,
    observed_at: datetime(),
    confidence: 0.95,
    source: "explicit"
}]->(Organization {name: "ACME Corp"})
```

**Qdrant (All Context including Role-Scoped Attributes):**
```python
{
    "id": "sit-uuid",
    "vector": [...],
    "payload": {
        "relationship_instance_id": "uuid",
        "relationship_type": "WORKS_AT",
        "user_id": "user-123",
        "entity_id": "org-acme",
        "tenant_id": "tenant-1",

        # Role definition
        "role": "Software Engineer",
        "department": "Product Development",

        # Role-Scoped Attributes (NEW)
        "skills": ["Python", "TypeScript", "FastAPI", "Neo4j"],
        "goals": [
            {"description": "Become Tech Lead", "priority": "high", "target_date": "2026-01"},
            {"description": "Learn Rust", "priority": "medium"}
        ],
        "preferences": [
            {"type": "work_style", "value": "remote", "strength": 0.9},
            {"type": "meeting_time", "value": "mornings", "strength": 0.7}
        ],

        # Situational context (existing)
        "mood": "productive",
        "stress_level": "medium",
        "activity": "coding"
    }
}
```

### Query Examples

**"What skills do I use at ACME?"**
```python
results = qdrant.search(
    collection_name="situations",
    query_filter={
        "must": [
            {"key": "user_id", "match": {"value": "user-123"}},
            {"key": "relationship_type", "match": {"value": "WORKS_AT"}},
            {"key": "entity_id", "match": {"value": "org-acme"}}
        ]
    }
)
# Returns: skills: ["Python", "TypeScript", "FastAPI", "Neo4j"]
```

**"What are my goals across all work contexts?"**
```python
results = qdrant.search(
    collection_name="situations",
    query_filter={
        "must": [
            {"key": "user_id", "match": {"value": "user-123"}},
            {"key": "relationship_type", "match": {"value": "WORKS_AT"}}
        ],
        "must_not": []
    }
)
# Returns goals from all WORKS_AT relationships
```

**"Find contexts where I use Python"**
```python
# Semantic search on skills
embedding = embed("Python programming")
results = qdrant.search(
    collection_name="situations",
    query_vector=embedding,
    query_filter={
        "must": [
            {"key": "user_id", "match": {"value": "user-123"}},
            {"key": "skills", "match": {"any": ["Python"]}}
        ]
    }
)
```

---

## Rationale

### Why this is better

| Aspect | User-Level (Current) | Role-Scoped (Proposed) |
|--------|---------------------|------------------------|
| Context separation | All skills mixed | Skills per relationship |
| Query capability | "All my skills" only | "Skills at X", "Skills for role Y" |
| Goal tracking | Global goals | Goals per context |
| AI suggestions | Generic | Context-aware ("As Software Engineer, you might...") |
| Data accuracy | Stale (what about old jobs?) | Always current per relationship |

### Alignment with existing architecture

This decision is **fully compatible** with:
- **ADR-0001:** Qdrant-First pattern (skills/goals/preferences go to Qdrant)
- **ADR-0002:** Property placement (descriptive properties in Qdrant, structural in Neo4j)
- **Entity-Relationship Model:** Relationships already have `situation_id` pointing to Qdrant

### Abgrenzung zu HAS_PREFERENCE (General Preferences)

**WICHTIG:** ADR-0003 betrifft NUR **kontext-spezifische** Attribute. Es gibt weiterhin **allgemeine Präferenzen**:

| Typ | Speicherort | Beispiel | ADR |
|-----|-------------|----------|-----|
| **Role-Scoped Preference** | Qdrant Context auf Relationship | "Remote Work" bei WORKS_AT → ACME | **ADR-0003** |
| **General Preference** | `HAS_PREFERENCE → Preference` Entity | "Ich mag Sushi" | Entity-Model |

**Entscheidungsregel:**

```
"Ich mag X"
   │
   ├── Nur in bestimmtem Kontext relevant?
   │   └── JA → Role-Scoped auf Relationship (ADR-0003)
   │         Beispiel: "Ich mag Remote Work" → WORKS_AT context
   │
   └── Generell gültig (ohne spezifische Beziehung)?
       └── NEIN → HAS_PREFERENCE → Preference Entity
             Beispiel: "Ich mag Sushi" → (User)-[:HAS_PREFERENCE]->(Preference {value: "Sushi"})
```

**Vollständiges Modell:**

```
User
│
├── [Role-Scoped - ADR-0003]
│   ├── WORKS_AT → Org: skills, goals, work_preferences
│   ├── MEMBER_OF → Club: skills, goals, club_preferences
│   └── KNOWS → Person: relationship_preferences
│
├── [General - Entity Model]
│   └── HAS_PREFERENCE → Preference: "Sushi", "Jazz", "Wandern"
│
└── [User Properties]
    └── preferred_language, timezone, notification_preferences
```

**Siehe:** [Entity-Relationship Model: Abschnitt 4.3](../architecture/10-entity-relationship-model.md#43-vollständiges-attribute-modell-role-scoped-vs-general)

### Trade-offs

**Advantages:**
- Accurate, context-aware data
- Better AI suggestions ("At ACME, you use Python...")
- Natural representation of reality
- Enables skill progression tracking per context

**Disadvantages:**
- More complex queries for "all skills across all contexts"
- Potential duplication if same skill used in multiple contexts
- Migration complexity from User.skills

---

## Consequences

### Changes to Package 1.2 (User Entity)

**Remove from User entity:**
```python
# BEFORE
class User(BaseModel):
    skills: List[str] = Field(default_factory=list)  # REMOVE

# AFTER
class User(BaseModel):
    # skills removed - now on relationships
    # Keep only: id, tenant_id, email, name, preferred_language, timezone, ai_properties
```

**UI Change:**
- User Profile no longer shows editable skills
- Instead: "View skills by context" → links to relationships

### Changes to Epic 3 (Relationships)

**Extend Qdrant context schema:**
```python
# In relationship context (Qdrant payload)
{
    "role": "Software Engineer",

    # NEW: Role-Scoped Attributes
    "skills": ["Python", "TypeScript"],
    "goals": [{"description": "...", "priority": "...", "target_date": "..."}],
    "preferences": [{"type": "...", "value": "...", "strength": 0.0-1.0}],

    # Existing situational context
    "mood": "...",
    "activity": "..."
}
```

**UI Changes:**
- Relationship detail view shows skills/goals/preferences
- "Add skill to this context" button
- "Add goal for this role" form

### New Package Required

**Package 3.6: Role-Scoped Attributes UI** (NEW)
- Skills editor per relationship
- Goals tracker per relationship
- Preferences manager per relationship
- "All my skills" aggregation view

### Migration Path

1. **Phase 1:** Add skills/goals/preferences to relationship contexts (Epic 3, Package 3.6)
2. **Phase 2:** Create aggregation endpoints ("all skills across contexts")
3. **Phase 3:** Deprecate User.skills (mark as legacy)
4. **Phase 4:** Remove User.skills from schema

### Migration Script (Existing Data)

For existing users with `skills` arrays, migrate data to WORKS_AT relationships:

```python
# packages/api/fidus/scripts/migrate_user_skills_to_relationships.py
"""
Migration script: User.skills → Role-Scoped Skills on Relationships (ADR-0003)

This script migrates existing User.skills to the user's primary WORKS_AT relationship.
Run this AFTER Package 3.6 is deployed and relationships exist.
"""

async def migrate_user_skills(neo4j_driver, qdrant_client):
    """
    Migrate User.skills to primary WORKS_AT relationship context.

    Strategy:
    1. Find all users with non-empty skills arrays
    2. For each user, find their primary WORKS_AT relationship
    3. Add skills to the relationship context in Qdrant
    4. Optionally: Remove skills from User node (Phase 4)
    """
    query = """
    MATCH (u:User)
    WHERE u.skills IS NOT NULL AND size(u.skills) > 0
    OPTIONAL MATCH (u)-[r:WORKS_AT]->(o:Organization)
    RETURN u.id as user_id, u.tenant_id as tenant_id,
           u.skills as skills, r.relationship_instance_id as rel_id
    ORDER BY r.started_at DESC
    LIMIT 1  // Primary (most recent) WORKS_AT
    """

    async with neo4j_driver.session() as session:
        result = await session.run(query)
        records = [record async for record in result]

    for record in records:
        user_id = record["user_id"]
        tenant_id = record["tenant_id"]
        skills = record["skills"]
        rel_id = record["rel_id"]

        if rel_id:
            # Add skills to existing WORKS_AT relationship
            await add_skills_to_relationship(qdrant_client, rel_id, skills)
            logger.info(f"Migrated {len(skills)} skills for user {user_id} to relationship {rel_id}")
        else:
            # No WORKS_AT relationship - create placeholder or log warning
            logger.warning(f"User {user_id} has skills but no WORKS_AT relationship. "
                          f"Skills will remain on User until relationship is created.")

async def add_skills_to_relationship(qdrant_client, relationship_id: str, skills: list[str]):
    """Add skills to relationship context in Qdrant."""
    # Fetch existing context
    results = await qdrant_client.scroll(
        collection_name="situations",
        scroll_filter={"must": [{"key": "relationship_instance_id", "match": {"value": relationship_id}}]},
        limit=1,
        with_payload=True
    )

    if not results[0]:
        raise ValueError(f"Relationship context not found: {relationship_id}")

    context = results[0][0].payload

    # Add skills (avoiding duplicates)
    existing_skills = {s["name"].lower() for s in context.get("skills", [])}
    new_skills = [
        {"name": skill, "proficiency": "intermediate", "source": "migrated"}
        for skill in skills
        if skill.lower() not in existing_skills
    ]

    context["skills"] = context.get("skills", []) + new_skills

    # Update Qdrant
    await qdrant_client.upsert(
        collection_name="situations",
        points=[PointStruct(
            id=relationship_id,
            vector=context.get("_vector", [0] * 1536),  # Preserve existing vector
            payload=context
        )]
    )
```

---

## Open Questions

1. **Skill deduplication:** If "Python" appears in 3 contexts, how to show "I know Python" without repetition?
   - **Proposed:** Aggregation endpoint with deduplication

2. **Skill proficiency:** Should skills have proficiency levels per context?
   - **Proposed:** Yes, `{"skill": "Python", "proficiency": "expert", "years": 5}`

3. **Goal dependencies:** Can goals reference each other across contexts?
   - **Proposed:** Future enhancement, not in v3.0

---

## Related Documents

- [ADR-0001: Situational Context as Relationship Qualifier](ADR-0001-situational-context-as-relationship-qualifier.md)
- [ADR-0002: Property Placement Strategy](ADR-0002-property-placement-and-geospatial-exception.md)
- [Entity-Relationship Model](../architecture/10-entity-relationship-model.md)
- [Package 1.2: User Entity](../prompts/fidus-memory/migration/epic-1/package-1.2-user-entity-profile-ui.md)
- [Package 3.1: KNOWS Relationship](../prompts/fidus-memory/migration/epic-3/package-3.1-knows-relationship-network-ui.md)

---

**Author:** Architecture Team
**Reviewers:** TBD
**Approval:** Pending

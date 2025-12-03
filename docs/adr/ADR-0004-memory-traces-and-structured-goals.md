# ADR-0004: Memory Traces and Structured Goals

**Status:** proposed
**Date:** 2025-12-03
**Deciders:** Fidus Architecture Team
**Supersedes:** None
**Related:** ADR-0001, ADR-0002, ADR-0003

---

## Context

### Problem Statement

The current Fidus Memory system extracts and stores user preferences effectively, but fails to capture two critical types of information:

1. **Structured Goals with Constraints:** When users express quantitative goals (e.g., "My daily calorie budget is 2000 kcal"), the system stores vague text like `"follows a strict diet plan"` instead of the actual numeric value.

2. **AI-Generated Artifacts:** When the AI generates structured content (e.g., a recipe, a workout plan, a packing list) and the user expresses positive feedback, the system stores only `"likes it"` without preserving the actual content.

### Example Scenario

**User says:** "I need a lunch recipe with max 500 kcal, my daily budget is 2000 kcal"

**AI generates:** A detailed recipe with ingredients, steps, and nutritional information

**User says:** "Das sieht gut aus!"

**Current storage:**
```
Preference { key: "caloric_intake", value: "follows a strict diet plan" }
Preference { key: "recipe", value: "likes it" }
```

**Problems:**
- Numeric constraint (2000 kcal/day, 500 kcal/meal) is lost
- The actual recipe content is not preserved
- No relationship between constraint satisfaction and artifact
- Cannot query "show me recipes under 400 kcal that I liked"

### Alternatives Considered

1. **Static Domain Entities (Recipe, Plan, etc.):** Create fixed entities for each content type
   - ❌ Not AI-driven - requires new code for each domain
   - ❌ Schema explosion as domains grow

2. **Extended Preference.value as JSON:** Store structured data in preference value field
   - ❌ Breaks existing preference model
   - ❌ Preferences are about opinions, not artifacts

3. **Situation-only storage:** Store everything in situational context
   - ❌ Situations are temporal snapshots, not persistent artifacts
   - ❌ No structure for constraint validation

4. **Memory Traces + Structured Goals (chosen):** Introduce two new concepts
   - ✅ AI-driven type discovery
   - ✅ Flexible JSON schema
   - ✅ Queryable and searchable
   - ✅ Maintains constraint relationships

---

## Decision

We introduce two new architectural concepts to Fidus Memory:

### 1. Structured Goals

**Definition:** A Goal is a user intention with measurable parameters and optional constraints.

**Storage:** Neo4j node with parameters stored in Qdrant context

```
┌─────────────────────────────────────────────────────────────────┐
│                         GOAL MODEL                              │
├─────────────────────────────────────────────────────────────────┤
│  Neo4j Node: Goal                                               │
│  ├── id: UUID                                                   │
│  ├── tenant_id: string                                          │
│  ├── name: string (AI-discovered, e.g., "calorie_management")   │
│  ├── goal_type: string ("constraint", "target", "habit")        │
│  ├── status: string ("active", "paused", "completed")           │
│  ├── created_at: datetime                                       │
│  └── updated_at: datetime                                       │
│                                                                 │
│  Neo4j Relationship: (User)-[:PURSUES {situation_id}]->(Goal)   │
│                                                                 │
│  Qdrant Payload (situation_id reference):                       │
│  ├── parameters: [                                              │
│  │     { name: "daily_budget", value: 2000, unit: "kcal",       │
│  │       constraint_type: "max" },                              │
│  │     { name: "lunch_ratio", value: 0.25, unit: "percentage" } │
│  │   ]                                                          │
│  ├── derived_constraints: [                                     │
│  │     { name: "lunch_budget", expression: "daily_budget * 0.25",│
│  │       computed_value: 500, unit: "kcal" }                    │
│  │   ]                                                          │
│  └── context: { source: "explicit", confidence: 0.95 }          │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Memory Traces

**Definition:** A Memory Trace is a record of an AI-generated or user-provided artifact with structured content.

**Key Insight:** This is NOT a static entity. The `trace_type` is AI-discovered, allowing the system to learn new content types organically.

**Storage:** Qdrant collection with vector embeddings for similarity search

```
┌─────────────────────────────────────────────────────────────────┐
│                      MEMORY TRACE MODEL                         │
├─────────────────────────────────────────────────────────────────┤
│  Qdrant Collection: memory_traces                               │
│                                                                 │
│  Point Payload:                                                 │
│  ├── id: UUID                                                   │
│  ├── tenant_id: string                                          │
│  ├── user_id: string                                            │
│  │                                                              │
│  ├── trace_type: string   # AI-discovered!                      │
│  │   Examples: "recipe", "workout_plan", "packing_list",        │
│  │             "recommendation", "answer", "analysis"           │
│  │                                                              │
│  ├── content: dict        # Flexible JSON, structure varies     │
│  │   Recipe example:                                            │
│  │   {                                                          │
│  │     "name": "Hähnchen-Gemüse-Wok",                          │
│  │     "nutrition": { "calories": 450, "protein": "45g" },     │
│  │     "ingredients": [...],                                    │
│  │     "steps": [...]                                           │
│  │   }                                                          │
│  │                                                              │
│  ├── source: "ai_generated" | "user_provided" | "external"     │
│  ├── conversation_id: UUID | null                               │
│  │                                                              │
│  ├── feedback: "positive" | "negative" | "neutral" | null      │
│  ├── feedback_at: datetime | null                               │
│  │                                                              │
│  ├── created_at: datetime                                       │
│  ├── accessed_at: datetime   # Last reference                   │
│  ├── access_count: int       # Usage frequency                  │
│  │                                                              │
│  └── embedding: vector[1024]  # For similarity search           │
│                                                                 │
│  Neo4j Relationships (optional, for graph queries):             │
│  ├── (User)-[:HAS_TRACE {feedback, created_at}]->(TraceRef)    │
│  ├── (TraceRef)-[:SATISFIES {constraint, satisfied}]->(Goal)   │
│  └── (TraceRef)-[:ALIGNS_WITH]->(Preference)                   │
└─────────────────────────────────────────────────────────────────┘
```

### Relationship Diagram

```
                    ┌─────────────┐
                    │    USER     │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    ┌───────────┐    ┌───────────┐    ┌───────────┐
    │   GOAL    │    │PREFERENCE │    │  TRACE    │
    │(Intention)│    │ (Opinion) │    │(Artifact) │
    └─────┬─────┘    └─────┬─────┘    └─────┬─────┘
          │                │                │
          │     ┌──────────┘                │
          │     │                           │
          ▼     ▼                           │
    ┌───────────────┐                       │
    │   SATISFIES   │◄──────────────────────┘
    │ (Constraint   │
    │  Validation)  │
    └───────────────┘
```

---

## Rationale

### Why Goals Separate from Preferences?

| Aspect | Preference | Goal |
|--------|------------|------|
| Nature | Opinion/Taste | Intention/Commitment |
| Example | "I like spicy food" | "Lose 5kg by March" |
| Measurable | No | Yes (parameters) |
| Temporal | Relatively stable | Has deadline/progress |
| Validation | N/A | Artifacts can satisfy |

### Why Memory Traces Instead of Domain Entities?

| Aspect | Domain Entity | Memory Trace |
|--------|---------------|--------------|
| Schema | Fixed (Recipe, Plan, ...) | Flexible JSON |
| New types | Requires code change | AI discovers `trace_type` |
| Storage | Multiple collections | Single collection |
| Search | Type-specific queries | Vector similarity + filters |

### Why Qdrant-Primary for Traces?

1. **Vector Search:** "Find similar recipes to my favorites"
2. **Flexible Payload:** No schema migration for new trace types
3. **Fast Filtering:** `trace_type == "recipe" AND content.calories < 500`
4. **Embedding-based Discovery:** Find conceptually similar content

---

## Consequences

### Positive

1. **Complete Information Capture:** Numeric values and structured content preserved
2. **AI-Driven Extensibility:** New trace types emerge without code changes
3. **Constraint Validation:** Can check if artifact satisfies user goals
4. **Rich Queries:** "Show me recipes under 400 kcal with chicken that I liked"
5. **Personalization Loop:** Feedback improves future recommendations

### Negative

1. **Increased Storage:** Traces store full content (larger than preference strings)
2. **Extraction Complexity:** Trace extractor must parse AI responses
3. **New Qdrant Collection:** Additional infrastructure to manage
4. **Migration Required:** Existing simple preferences don't have traces

### Neutral

1. **Optional Neo4j Nodes:** TraceRef nodes only needed for graph queries
2. **Backward Compatible:** Existing preferences continue to work

---

## Implementation Notes

### Trace Extraction Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      AI RESPONSE                                │
│  "Hier ist ein Rezept für Hähnchen-Gemüse-Wok..."             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    TRACE EXTRACTOR                              │
│  1. Detect structured content in response                       │
│  2. Classify trace_type (recipe, plan, list, ...)              │
│  3. Parse content into structured JSON                          │
│  4. Generate embedding for similarity search                    │
│  5. Store in Qdrant                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FEEDBACK HANDLER                             │
│  User: "Das sieht gut aus!"                                    │
│  → Update trace.feedback = "positive"                          │
│  → Link to satisfied constraints (if any)                      │
└─────────────────────────────────────────────────────────────────┘
```

### Goal Parameter Types

```python
class GoalParameter(BaseModel):
    name: str                                    # e.g., "daily_budget"
    value: float | int | str                     # e.g., 2000
    unit: str | None                             # e.g., "kcal"
    constraint_type: Literal["min", "max", "equals", "between"] | None
    min_value: float | None                      # For "between"
    max_value: float | None                      # For "between"

class DerivedConstraint(BaseModel):
    name: str                                    # e.g., "lunch_budget"
    expression: str                              # e.g., "daily_budget * 0.25"
    computed_value: float                        # e.g., 500
    unit: str | None                             # e.g., "kcal"
```

### Trace Content Examples

**Recipe Trace:**
```json
{
  "trace_type": "recipe",
  "content": {
    "name": "Hähnchen-Gemüse-Wok",
    "cuisine": "asian-fusion",
    "nutrition": {
      "calories": 450,
      "protein": "45g",
      "carbs": "25g",
      "fat": "18g"
    },
    "ingredients": [
      {"item": "Hähnchenbrustfilet", "amount": 300, "unit": "g"},
      {"item": "Paprika", "amount": 2, "unit": "piece"}
    ],
    "steps": ["Hähnchen schneiden...", "Gemüse anbraten..."],
    "prep_time": "15min",
    "cook_time": "15min",
    "servings": 2
  }
}
```

**Workout Plan Trace:**
```json
{
  "trace_type": "workout_plan",
  "content": {
    "name": "4-Week Strength Program",
    "goal": "muscle_building",
    "frequency": "3x/week",
    "exercises": [
      {"name": "Squats", "sets": 4, "reps": "8-10", "rest": "90s"},
      {"name": "Bench Press", "sets": 4, "reps": "8-10", "rest": "90s"}
    ],
    "duration_weeks": 4
  }
}
```

**Packing List Trace:**
```json
{
  "trace_type": "packing_list",
  "content": {
    "trip_type": "beach_vacation",
    "duration": "7 days",
    "categories": {
      "clothing": ["Swimsuit", "T-shirts (5)", "Shorts (3)"],
      "toiletries": ["Sunscreen", "Toothbrush"],
      "electronics": ["Phone charger", "Camera"]
    }
  }
}
```

---

## Migration Strategy

### Phase 1: Infrastructure (Package 6.1)
- Create `memory_traces` Qdrant collection
- Extend Goal entity with parameter storage
- Implement Goal repository with constraint support

### Phase 2: Trace Extraction (Package 6.2)
- Implement TraceExtractor service
- Add trace detection to chat response pipeline
- Store traces in Qdrant

### Phase 3: Feedback Loop (Package 6.3)
- Implement feedback collection on traces
- Link traces to satisfied goals/constraints
- Build trace query API

### Phase 4: UI Integration (Package 6.4)
- Trace viewer component
- Goal dashboard with constraint tracking
- "Show similar" functionality using embeddings

---

## References

- ADR-0001: Situational Context as Relationship Qualifier
- ADR-0002: Property Placement Strategy
- ADR-0003: Role-Scoped Attributes
- Entity-Relationship Model: `/docs/architecture/10-entity-relationship-model.md`

---

## Decision Outcome

**Chosen option:** Memory Traces + Structured Goals

This architecture enables:
1. Capture of numeric goals with constraints
2. Preservation of AI-generated content
3. AI-driven type discovery for new content categories
4. Constraint validation between artifacts and goals
5. Semantic search across all user artifacts

---

**Document Status:** Proposed
**Last Updated:** 2025-12-03
**Maintained by:** Fidus Architecture Team

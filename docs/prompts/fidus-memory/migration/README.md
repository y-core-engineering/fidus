# Fidus Memory v3.0 Migration - Implementation Prompts

**Version:** 1.0
**Created:** 2025-11-21
**Total Prompts:** 19
**Status:** Complete

---

## Overview

This directory contains **19 detailed, standalone implementation prompts** for the Fidus Memory v3.0 migration. Each prompt provides complete specifications for implementing one work package from the [Work Breakdown Structure](../../../prototypes/fidus-memory/migration-v3-wbs.md).

### What Are These Prompts?

Each implementation prompt is a **comprehensive guide** for developers (human or AI) that includes:

- ✅ **Complete role definition** - Senior Full-Stack Software Engineer expertise
- ✅ **Context & background** - Current state, migration goals, architecture references
- ✅ **Concrete code examples** - 10-30 code blocks with full implementations
- ✅ **API specifications** - OpenAPI schemas, endpoint definitions
- ✅ **Testing requirements** - Unit, integration, and E2E test scenarios
- ✅ **Implementation guidelines** - Must Follow / Must NOT Do rules
- ✅ **Step-by-step plan** - Phased implementation approach
- ✅ **Verification checklist** - Functionality, quality, security, deployment checks
- ✅ **Risk mitigation** - Specific risks with concrete mitigation strategies
- ✅ **Success criteria** - Clear definition of package completion

### How to Use These Prompts

1. **For Human Developers:**
   - Pick a package prompt file
   - Read the context and specifications
   - Follow the implementation plan
   - Copy/adapt the code examples
   - Run tests as specified
   - Verify against the checklist

2. **For AI Agents:**
   - Load the prompt file as system context
   - Execute the implementation autonomously
   - Each prompt is standalone (no WBS reading required)
   - All necessary context is included

3. **For Project Managers:**
   - Use prompts to estimate complexity
   - Distribute packages to teams based on parallel work opportunities
   - Track completion via verification checklists

---

## Directory Structure

```
docs/prompts/fidus-memory/migration/
├── README.md (this file)
├── epic-1/                    # Foundation (2 packages)
│   ├── package-1.1-qdrant-first-migration.md
│   └── package-1.2-user-entity-profile-ui.md
├── epic-2/                    # Core Entities (3 packages)
│   ├── package-2.1-person-entity-management-ui.md
│   ├── package-2.2-organization-entity-management-ui.md
│   └── package-2.3-goal-entity-tracking-ui.md
├── epic-3/                    # Core Relationships (5 packages)
│   ├── package-3.1-knows-relationship-network-ui.md
│   ├── package-3.2-works-at-relationship-employment-history.md
│   ├── package-3.3-pursues-relationship-goal-tracking.md
│   ├── package-3.4-member-of-relationship-membership-management.md
│   └── package-3.5-interactive-graph-visualization-ui.md
├── epic-4/                    # Extended Entities (4 packages)
│   ├── package-4.1-habit-entity-streak-tracking-ui.md
│   ├── package-4.2-event-entity-calendar-ui.md
│   ├── package-4.3-has-habit-attends-relationships.md
│   └── package-4.4-langgraph-orchestration-engine.md
└── epic-5/                    # Completion (5 packages)
    ├── package-5.1-object-entity-inventory-ui.md
    ├── package-5.2-location-entity-map-ui.md
    ├── package-5.3-owns-frequents-relationships.md
    ├── package-5.4-entity-deduplication-service.md
    └── package-5.5-performance-optimization-monitoring.md
```

**Total Size:** ~764 KB of implementation guidance

---

## Epic Summaries

### Epic 1: Foundation & Architecture Compliance (🔴 CRITICAL)

**Goal:** Establish v3.0 architecture patterns and create the aggregate root (User entity).

| Package | Description | Size | Priority |
|---------|-------------|------|----------|
| 1.1 | Qdrant-First Pattern Migration | 41 KB | 🔴 CRITICAL |
| 1.2 | User Entity Foundation with Profile UI | 47 KB | 🔴 CRITICAL |

**Key Outcomes:**
- ✅ ADR-0001 compliance (Qdrant PRIMARY, Neo4j SECONDARY)
- ✅ User entity as aggregate root
- ✅ 1-Hop query pattern
- ✅ Migration from v1.0 to v3.0 pattern

---

### Epic 2: Core Entity Implementation (🔴 CRITICAL)

**Goal:** Implement high-priority entities with full CRUD + UI.

| Package | Description | Size | Priority |
|---------|-------------|------|----------|
| 2.1 | Person Entity with Management UI | 65 KB | 🔴 CRITICAL |
| 2.2 | Organization Entity with Management UI | 58 KB | 🔴 CRITICAL |
| 2.3 | Goal Entity with Progress Tracking UI | 41 KB | 🔴 CRITICAL |

**Key Outcomes:**
- ✅ 3 core entities implemented
- ✅ LLM extraction from conversations
- ✅ Flexible `ai_properties` for dynamic attributes
- ✅ Full UI (list, detail, create/edit)

**Parallel Work:** Packages 2.1, 2.2, 2.3 can be developed simultaneously (Wave 1)

---

### Epic 3: Core Relationship Implementation (🔴 CRITICAL)

**Goal:** Connect entities via graph relationships with Qdrant-First context storage.

| Package | Description | Size | Priority |
|---------|-------------|------|----------|
| 3.1 | KNOWS Relationship with Network UI | 48 KB | 🔴 CRITICAL |
| 3.2 | WORKS_AT Relationship with Employment History | 34 KB | 🔴 CRITICAL |
| 3.3 | PURSUES Relationship with Goal Tracking | 23 KB | 🔴 CRITICAL |
| 3.4 | MEMBER_OF Relationship with Membership Management | 25 KB | 🔴 CRITICAL |
| 3.5 | Interactive Graph Visualization UI | 25 KB | 🔴 CRITICAL |

**Key Outcomes:**
- ✅ 4 core relationships implemented
- ✅ Situational context stored in Qdrant
- ✅ 1-Hop queries with `situation_id`
- ✅ Interactive graph visualization

**Parallel Work:** Packages 3.1, 3.2, 3.3, 3.4 can be developed simultaneously (Wave 2)

---

### Epic 4: Extended Features (🟡 MEDIUM)

**Goal:** Add remaining entities, orchestration, and advanced features.

| Package | Description | Size | Priority |
|---------|-------------|------|----------|
| 4.1 | Habit Entity with Streak Tracking UI | 47 KB | 🟡 MEDIUM |
| 4.2 | Event Entity with Calendar UI | 45 KB | 🟡 MEDIUM |
| 4.3 | HAS_HABIT & ATTENDS Relationships | 27 KB | 🟡 MEDIUM |
| 4.4 | LangGraph Orchestration Engine | 26 KB | 🟡 MEDIUM |

**Key Outcomes:**
- ✅ 2 additional entities (Habit, Event)
- ✅ 2 additional relationships
- ✅ LangGraph state machine replaces direct LLM calls
- ✅ Multi-step reasoning with rollback

**Parallel Work:** Packages 4.1 and 4.2 can be developed simultaneously (Wave 3)

---

### Epic 5: Completion & Optimization (🟢 LOW)

**Goal:** Complete entity coverage, add deduplication, and optimize performance.

| Package | Description | Size | Priority |
|---------|-------------|------|----------|
| 5.1 | Object Entity with Inventory UI | 48 KB | 🟢 LOW |
| 5.2 | Location Entity with Map UI | 41 KB | 🟢 LOW |
| 5.3 | OWNS & FREQUENTS Relationships | 29 KB | 🟢 LOW |
| 5.4 | Entity Deduplication Service | 28 KB | 🟢 LOW |
| 5.5 | Performance Optimization & Monitoring | 25 KB | 🟢 LOW |

**Key Outcomes:**
- ✅ 2 final entities (Object, Location)
- ✅ 2 final relationships (OWNS, FREQUENTS)
- ✅ Embedding-based deduplication
- ✅ Production monitoring (Prometheus, Grafana)
- ✅ 100% entity coverage (9/9)

**Parallel Work:** Packages 5.1 and 5.2 can be developed simultaneously (Wave 4)

---

## Implementation Status

Track package completion here:

### Epic 1: Foundation
- [ ] Package 1.1: Qdrant-First Pattern Migration
- [ ] Package 1.2: User Entity Foundation with Profile UI

### Epic 2: Core Entities
- [ ] Package 2.1: Person Entity with Management UI
- [ ] Package 2.2: Organization Entity with Management UI
- [ ] Package 2.3: Goal Entity with Progress Tracking UI

### Epic 3: Core Relationships
- [ ] Package 3.1: KNOWS Relationship with Network UI
- [ ] Package 3.2: WORKS_AT Relationship with Employment History
- [ ] Package 3.3: PURSUES Relationship with Goal Tracking
- [ ] Package 3.4: MEMBER_OF Relationship with Membership Management
- [ ] Package 3.5: Interactive Graph Visualization UI

### Epic 4: Extended Features
- [ ] Package 4.1: Habit Entity with Streak Tracking UI
- [ ] Package 4.2: Event Entity with Calendar UI
- [ ] Package 4.3: HAS_HABIT & ATTENDS Relationships
- [ ] Package 4.4: LangGraph Orchestration Engine

### Epic 5: Completion
- [ ] Package 5.1: Object Entity with Inventory UI
- [ ] Package 5.2: Location Entity with Map UI
- [ ] Package 5.3: OWNS & FREQUENTS Relationships
- [ ] Package 5.4: Entity Deduplication Service
- [ ] Package 5.5: Performance Optimization & Monitoring

---

## Parallel Work Opportunities

### Wave 1: Core Entities (After Package 1.2)
**Can work in parallel:**
- Team A: Package 2.1 (Person)
- Team B: Package 2.2 (Organization)
- Team C: Package 2.3 (Goal)

### Wave 2: Core Relationships (After Wave 1)
**Can work in parallel:**
- Team A: Package 3.1 (KNOWS)
- Team B: Package 3.2 (WORKS_AT)
- Team C: Package 3.3 (PURSUES)
- Team D: Package 3.4 (MEMBER_OF)

### Wave 3: Extended Entities (Can run alongside Wave 2)
**Can work in parallel:**
- Team E: Package 4.1 (Habit)
- Team F: Package 4.2 (Event)

### Wave 4: Final Entities (After Package 1.2)
**Can work in parallel:**
- Team G: Package 5.1 (Object)
- Team H: Package 5.2 (Location)

### Sequential (No Parallelization)
- Package 1.1 → 1.2 (Sequential)
- Package 3.5 (Requires ALL Wave 2 complete)
- Package 4.3 (Requires Packages 4.1 AND 4.2)
- Package 4.4 (Requires Package 3.5)
- Package 5.3 (Requires Packages 5.1 AND 5.2)
- Package 5.4 (Requires Packages 2.1 AND 2.2)
- Package 5.5 (Requires Package 3.5)

---

## Architecture Patterns

All prompts implement these core patterns:

### 1. Qdrant-First Pattern (ADR-0001)
```
1. Store context in Qdrant (PRIMARY) - full payload
2. Store relationship in Neo4j (SECONDARY) - situation_id reference only
3. Rollback Qdrant on Neo4j failure
```

### 2. Vertical Slicing
Each package delivers:
- Backend: Entity/Relationship models + Repository + Business logic
- API: FastAPI endpoints with OpenAPI schemas
- Frontend: React components with @fidus/ui
- Tests: Unit + Integration + E2E

### 3. Feature Flags
All functionality behind feature flags:
```python
ENABLE_PERSON_ENTITY: bool = env.bool("ENABLE_PERSON_ENTITY", False)
```

### 4. Multi-Tenancy
All operations scoped to `tenant_id`:
```python
WHERE p.tenant_id = $tenant_id
```

---

## Technology Stack

**Backend:**
- Python 3.11+, FastAPI 0.104+, Pydantic
- LiteLLM (Ollama local, OpenAI/Anthropic optional)
- LangGraph (state machines, orchestration)

**Databases:**
- Neo4j 5.x (graph relationships)
- Qdrant 1.7+ (vector search, context storage)
- PostgreSQL 15+ (structured data)
- Redis 7+ (caching)

**Frontend:**
- Next.js 14 (App Router)
- React 18 (Hooks, Server/Client Components)
- TypeScript 5+ (strict mode)
- @fidus/ui design system
- TanStack Query (data fetching)

**Testing:**
- pytest, pytest-asyncio (Python)
- Playwright (E2E)
- Vitest, Testing Library (React)
- locust (load testing)

---

## Related Documentation

- **Work Breakdown Structure:** [migration-v3-wbs.md](../../../prototypes/fidus-memory/migration-v3-wbs.md)
- **Architecture Review:** [2025-11-21-fidus-memory-architecture-review.md](../../../reviews/2025-11-21-fidus-memory-architecture-review.md)
- **WBS Review:** [2025-11-21-wbs-architecture-review.md](../../../reviews/2025-11-21-wbs-architecture-review.md)
- **Solution Architecture:** [/docs/solution-architecture/](../../../solution-architecture/)
- **Domain Model:** [/docs/domain-model/](../../../domain-model/)
- **ADR-0001:** [/docs/adr/ADR-0001-situational-context-as-relationship-qualifier.md](../../../adr/ADR-0001-situational-context-as-relationship-qualifier.md)

---

## Quality Criteria

Each prompt was evaluated on:

1. ✅ **Completeness:** All WBS information included and expanded
2. ✅ **Actionability:** Developer can start immediately without questions
3. ✅ **Specificity:** Concrete code examples, file paths, function signatures
4. ✅ **Testability:** Clear E2E test scenarios with step-by-step instructions
5. ✅ **Context:** Links to relevant docs, explains "why", references prerequisites
6. ✅ **Risk Awareness:** Identifies technical risks with mitigation
7. ✅ **Verification:** Checklist for marking package complete

---

## Version History

- **v1.0 (2025-11-21):** Initial generation of 19 implementation prompts
  - Generated from WBS v1.1
  - Meta-prompt: [package-implementation-prompt-generator.md](../package-implementation-prompt-generator.md)
  - Total size: ~764 KB
  - All prompts follow standardized template structure

---

## Feedback & Questions

For questions or feedback about these prompts, contact the Fidus Architecture Team or create an issue in the project repository.

---

**Document Status:** ✅ Complete
**Last Updated:** 2025-11-21
**Maintained by:** Fidus Architecture Team

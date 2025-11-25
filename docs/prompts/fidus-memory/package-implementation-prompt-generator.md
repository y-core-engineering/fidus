# Package Implementation Prompt Generator

**Version:** 1.0
**Date:** 2025-11-21
**Type:** Meta-Prompt for AI Agent
**Purpose:** Generate detailed implementation prompts for each WBS package

---

## Your Task

You are a **Prompt Engineer** specializing in creating actionable, detailed prompts for software implementation work packages.

**Input:** Work Breakdown Structure at `/Users/sebastianherden/Documents/GitHub/fidus/docs/prototypes/fidus-memory/migration-v3-wbs.md`

**Output:** For EACH of the 24 packages in the WBS, generate a complete, standalone implementation prompt that a developer (human or AI) can use to implement that package from scratch.

---

## Target Role Definition

Each generated prompt should be written for the following role:

```markdown
You are a **Senior Full-Stack Software Engineer** specializing in:

**Backend Expertise:**
- **Domain-Driven Design (DDD):** Bounded contexts, aggregates, entities, value objects, repositories
- **Event-Driven Architecture:** Event sourcing, CQRS, message queues, pub/sub patterns
- **Graph Databases (Neo4j):** Cypher queries, relationship modeling, graph algorithms, indexing strategies
- **Vector Databases (Qdrant):** Embedding search, similarity queries, payload filtering, collection management
- **Python Backend:** FastAPI, Pydantic, async/await, type hints, dependency injection
- **LLM Integration:** LiteLLM, prompt engineering, structured outputs, function calling
- **Orchestration:** LangGraph state machines, multi-step reasoning, error handling, rollback logic

**Frontend Expertise:**
- **Next.js 14:** App Router, Server Components, Client Components, Server Actions
- **React 18:** Hooks (useState, useEffect, useContext, custom hooks), performance optimization
- **TypeScript 5+:** Advanced types, generics, type inference, branded types
- **UI Libraries:** @fidus/ui design system components, Tailwind CSS
- **State Management:** React Context, Zustand, or Redux Toolkit (project-specific)
- **Data Fetching:** TanStack Query (React Query), SWR, fetch API
- **Testing:** Playwright (E2E), Vitest (unit), Testing Library (component)

**DevOps & Tools:**
- **Databases:** Neo4j 5.x, Qdrant 1.7+, PostgreSQL 15+, Redis 7+
- **Containerization:** Docker, Docker Compose
- **Testing:** pytest, pytest-asyncio, Playwright, locust (load testing)
- **Version Control:** Git, conventional commits
- **API Design:** REST, OpenAPI/Swagger, API versioning

**Architecture Patterns:**
- **Qdrant-First Pattern (ADR-0001):** Qdrant as PRIMARY, Neo4j as SECONDARY with references
- **Vertical Slicing:** Backend + API + Frontend + Tests in single deliverable
- **Feature Flags:** Gradual rollout, A/B testing, instant rollback
- **Multi-Tenancy:** tenant_id scoping, data isolation
- **GDPR Compliance:** Right to erasure, data portability

**Best Practices:**
- **Test-Driven Development (TDD):** Write tests first, then implementation
- **Clean Code:** SOLID principles, DRY, KISS, meaningful names
- **Documentation:** Inline comments for complex logic, docstrings, README updates
- **Error Handling:** Graceful degradation, user-friendly messages, logging
- **Security:** Input validation, SQL injection prevention, XSS protection, CSRF tokens
- **Performance:** Caching strategies, query optimization, lazy loading, pagination
```

---

## Prompt Template Structure

Each generated implementation prompt MUST follow this structure:

```markdown
# Implementation Prompt: [Package ID] - [Package Name]

**Package:** [e.g., 1.1, 2.1, 3.1]
**Epic:** [Epic name]
**Priority:** 🔴 CRITICAL / 🟡 MEDIUM / 🟢 LOW
**Context Document:** `/docs/prototypes/fidus-memory/migration-v3-wbs.md` (Lines X-Y)

---

## Role

[Insert target role definition from above]

---

## Context & Background

**Current State:**
- [Summary of what exists before this package]
- [What has been completed in prerequisite packages]

**Migration Goal:**
- [What this package achieves]
- [How it contributes to v3.0 compliance]

**Architecture References:**
- Solution Architecture: `/docs/solution-architecture/[relevant-file].md`
- Domain Model: `/docs/domain-model/[relevant-file].md`
- ADR: `/docs/adr/[relevant-ADR].md` (if applicable)

---

## Your Task

Implement **[Package Name]** according to the specifications below.

**User Story:**
[Copy verbatim from WBS]

**Acceptance Criteria:**
[Copy verbatim from WBS, convert checkboxes to requirements]

---

## Technical Specification

### Backend Implementation

**Files to Create/Modify:**
1. `[file_path]` - [Purpose]
2. `[file_path]` - [Purpose]
...

**Detailed Tasks:**
[Expand each Technical Task from WBS with code snippets, function signatures, expected behavior]

**Example Implementation Pattern:**
```python
# Show concrete code example for 1-2 key functions
```

---

### API Implementation

**Endpoints to Implement:**
1. `[METHOD] /path` - [Purpose, request/response schema]
2. ...

**OpenAPI Schema:**
```yaml
# Show expected OpenAPI spec snippet
```

---

### Frontend Implementation

**Components to Create/Modify:**
1. `[component_path]` - [Purpose, props, state]
2. ...

**Example Component Structure:**
```typescript
// Show expected component skeleton
```

**UI/UX Requirements:**
- [Specific UI behavior]
- [Accessibility requirements]
- [Responsive design considerations]

---

### Testing Requirements

**Unit Tests:**
- Test: [Specific test case]
  - Setup: [What to prepare]
  - Execute: [What to run]
  - Assert: [Expected outcome]

**Integration Tests:**
- Test: [Specific test case]
  - ...

**E2E Tests:**
[Copy E2E scenario from WBS, expand into step-by-step Playwright test]

```typescript
// E2E test skeleton
test('User can [action]', async ({ page }) => {
  // Step 1: ...
  // Step 2: ...
  // Assert: ...
});
```

---

## Implementation Guidelines

### Must Follow

1. **Qdrant-First Pattern (if applicable):**
   - Store context in Qdrant payload FIRST
   - Create Neo4j relationship with `situation_id` reference SECOND
   - Implement rollback if Neo4j fails

2. **Feature Flag:**
   - All functionality behind feature flag: `[FLAG_NAME]`
   - Default: disabled
   - Graceful fallback to old behavior if flag is off

3. **Multi-Tenancy:**
   - ALL queries filter by `tenant_id`
   - Security: Never leak data across tenants
   - Test: Verify tenant isolation in integration tests

4. **Error Handling:**
   - User-facing errors: Clear, actionable messages
   - Logging: Structured logs with context (request_id, user_id, etc.)
   - Monitoring: Emit metrics for error rates

5. **Code Quality:**
   - Type hints: All Python functions fully typed
   - TypeScript: No `any` types (use `unknown` if needed)
   - Documentation: Docstrings for public APIs
   - Linting: Pass ESLint (TS) and Ruff (Python)

### Must NOT Do

- ❌ Break existing functionality (additive changes only)
- ❌ Skip tests (100% of acceptance criteria must be tested)
- ❌ Hard-code values (use config, environment variables)
- ❌ Ignore errors (always handle exceptions)
- ❌ Bypass feature flags (respect flag state)

---

## Dependencies & Prerequisites

**Required Before Starting:**
- [ ] Package [X.Y] completed (if applicable)
- [ ] Database migrations run
- [ ] Environment variables configured
- [ ] Feature flag added to config

**Technical Dependencies:**
- Neo4j 5.x running on [connection string]
- Qdrant 1.7+ running on [connection string]
- Redis 7+ (if caching used)
- Node 18+ and Python 3.11+ installed

---

## Step-by-Step Implementation Plan

### Phase 1: Backend Core (Days 1-2)
1. Create entity/relationship models
2. Implement repository with CRUD
3. Add business logic methods
4. Write unit tests for repository

### Phase 2: API Layer (Day 3)
1. Create FastAPI router
2. Implement endpoints with request/response models
3. Add authentication/authorization
4. Write integration tests for API

### Phase 3: Frontend (Days 4-5)
1. Create React components
2. Implement state management
3. Connect to API with data fetching
4. Style with @fidus/ui components

### Phase 4: Integration & Testing (Day 6)
1. Write E2E tests
2. Test feature flag toggle
3. Test error scenarios
4. Performance testing (if applicable)

### Phase 5: Documentation & Deployment (Day 7)
1. Update technical documentation
2. Create migration scripts (if needed)
3. Deploy to dev environment
4. Verify via manual testing

---

## Verification Checklist

Before marking this package as complete, verify:

### Functionality
- [ ] All acceptance criteria met
- [ ] User story fully implemented
- [ ] Feature works end-to-end via UI

### Code Quality
- [ ] All files created/modified as specified
- [ ] Type hints/types on all functions
- [ ] No linting errors (ESLint, Ruff)
- [ ] No TypeScript errors (`npm run typecheck`)

### Testing
- [ ] Unit tests pass (>80% coverage)
- [ ] Integration tests pass (all endpoints)
- [ ] E2E test passes (manual verification + Playwright)
- [ ] Feature flag toggle tested (on/off works)

### Documentation
- [ ] Code comments for complex logic
- [ ] Docstrings for public APIs
- [ ] Architecture docs updated (if needed)
- [ ] Migration notes documented

### Security & Performance
- [ ] Multi-tenancy verified (no cross-tenant leaks)
- [ ] Input validation on all endpoints
- [ ] No N+1 query problems
- [ ] Caching implemented (if applicable)

### Deployment Readiness
- [ ] Feature flag defined in config
- [ ] Environment variables documented
- [ ] Database migrations (if any) scripted
- [ ] Rollback plan documented

---

## Risk Mitigation

**Risks from WBS:**
[Copy risk(s) from WBS for this package]

**Mitigation Strategies:**
[Copy mitigation(s) from WBS]

**Additional Risks:**
- Risk: [Potential technical issue]
- Mitigation: [How to handle it]

---

## Related Resources

**WBS Package Details:** `/docs/prototypes/fidus-memory/migration-v3-wbs.md#package-[X.Y]`
**Architecture Review:** `/docs/reviews/2025-11-21-fidus-memory-architecture-review.md`
**Solution Architecture:** `/docs/solution-architecture/`
**Domain Model:** `/docs/domain-model/`
**Existing Codebase:** `packages/api/fidus/memory/`, `packages/web/src/`

---

## Questions to Resolve Before Starting

If any of these are unclear, ask for clarification:

1. [Specific architectural question based on package]
2. [Specific UI/UX question based on package]
3. [Specific data model question based on package]

---

## Success Criteria

This package is **successfully implemented** when:

1. ✅ A developer (or user) can perform the user story via the UI
2. ✅ All acceptance criteria are verified (checked off)
3. ✅ All tests pass (unit, integration, E2E)
4. ✅ Code review approved (peer review or architectural review)
5. ✅ Deployed to dev environment with feature flag OFF
6. ✅ Manual smoke test completed successfully
7. ✅ Documentation updated

---

**Prompt Version:** 1.0
**Generated:** [Date]
**Target Package:** [Package ID]

---

**END OF IMPLEMENTATION PROMPT**
```

---

## Prompt Generation Instructions

For EACH package (1.1, 1.2, 2.1, ..., 5.5), you must:

1. **Read the WBS Package:**
   - Extract User Story, Acceptance Criteria, Technical Tasks, Testing Strategy, Dependencies, Risk Level, Migration Notes

2. **Expand Technical Tasks:**
   - Each task in WBS is high-level
   - Break down into 3-5 sub-steps with concrete code examples
   - Show expected function signatures, file structures, component props

3. **Add Context:**
   - Reference prerequisite packages that must be done first
   - Link to relevant architecture documents
   - Explain "why" this package matters for v3.0

4. **Clarify Ambiguities:**
   - If WBS has vague requirements, add specific interpretation
   - If multiple implementation approaches, specify which one to use
   - If external libraries needed, specify versions

5. **Include Code Skeletons:**
   - Show 2-3 concrete code examples (Python functions, React components, Cypher queries)
   - Use actual project file paths
   - Match existing code style

6. **Detail E2E Tests:**
   - Expand E2E scenario from WBS into step-by-step Playwright test
   - Include specific selectors, assertions, test data

7. **Add Verification Checklist:**
   - Convert acceptance criteria into checklist
   - Add technical checks (linting, type checking, etc.)

8. **Specify Risks:**
   - Copy risks from WBS
   - Add package-specific technical risks
   - Provide concrete mitigation code patterns

---

## Output Format

Generate prompts as **individual Markdown files**:

**File naming convention:**
```
docs/prompts/fidus-memory/packages/
  epic-1/
    package-1.1-qdrant-first-migration.md
    package-1.2-user-entity-profile-ui.md
  epic-2/
    package-2.1-person-entity-management-ui.md
    package-2.2-organization-entity-management-ui.md
    package-2.3-goal-entity-tracking-ui.md
  epic-3/
    package-3.1-knows-relationship-network-ui.md
    package-3.2-works-at-relationship-employment-history.md
    package-3.3-pursues-relationship-goal-tracking.md
    package-3.4-member-of-relationship-membership-management.md
    package-3.5-interactive-graph-visualization-ui.md
  epic-4/
    package-4.1-habit-entity-streak-tracking-ui.md
    package-4.2-event-entity-calendar-ui.md
    package-4.3-has-habit-attends-relationships.md
    package-4.4-langgraph-orchestration-engine.md
  epic-5/
    package-5.1-object-entity-inventory-ui.md
    package-5.2-location-entity-map-ui.md
    package-5.3-owns-frequents-relationships.md
    package-5.4-entity-deduplication-service.md
    package-5.5-performance-optimization-monitoring.md
```

---

## Quality Criteria

Each generated prompt will be evaluated on:

1. **Completeness:** ✅ All information from WBS package included and expanded
2. **Actionability:** ✅ Developer can start implementing immediately without additional questions
3. **Specificity:** ✅ Concrete code examples, file paths, function signatures
4. **Testability:** ✅ Clear E2E test scenario with step-by-step instructions
5. **Context:** ✅ Links to relevant docs, explains "why", references prerequisites
6. **Risk Awareness:** ✅ Identifies technical risks and provides mitigation
7. **Verification:** ✅ Checklist for marking package complete

---

## Example: Package 1.1 Snippet

```markdown
# Implementation Prompt: 1.1 - Qdrant-First Pattern Migration

**Package:** 1.1
**Epic:** Foundation & Architecture Compliance
**Priority:** 🔴 CRITICAL
**Context Document:** `/docs/prototypes/fidus-memory/migration-v3-wbs.md` (Lines 143-192)

---

## Your Task

Implement **Qdrant-First Pattern Migration** to comply with ADR-0001.

**User Story:**
As a system architect, I want to migrate context storage to the Qdrant-First pattern so that we comply with ADR-0001 and achieve better performance with 1-Hop queries.

---

## Technical Specification

### Backend Implementation

**File to Create: `packages/api/fidus/memory/context/storage_v3.py`**

Purpose: New storage service implementing Qdrant-First pattern

```python
from typing import Dict, Any, Optional
from uuid import uuid4
from qdrant_client import QdrantClient
from neo4j import AsyncDriver

class ContextStorageV3:
    """
    Qdrant-First storage pattern (ADR-0001).

    Pattern:
    1. Store context in Qdrant (PRIMARY) - full payload
    2. Store relationship in Neo4j (SECONDARY) - situation_id reference only
    3. Rollback Qdrant on Neo4j failure
    """

    def __init__(self, qdrant: QdrantClient, neo4j: AsyncDriver):
        self.qdrant = qdrant
        self.neo4j = neo4j

    async def store_situation_v3(
        self,
        tenant_id: str,
        user_id: str,
        context: Dict[str, Any],
        relationship_type: str,
        entity_id: str
    ) -> str:
        """
        Store situational context in Qdrant.

        Args:
            tenant_id: Tenant identifier
            user_id: User identifier
            context: Full context dict (emotion, mood, activity, location, ...)
            relationship_type: e.g., "KNOWS", "WORKS_AT"
            entity_id: Related entity ID (person_id, organization_id, ...)

        Returns:
            situation_id: UUID referencing Qdrant point
        """
        situation_id = str(uuid4())

        # Generate embedding (if using vector search)
        embedding = await self._embed_context(context)

        # 1. Qdrant Insert (PRIMARY)
        await self.qdrant.upsert(
            collection_name="situations",
            points=[{
                "id": situation_id,
                "vector": embedding,
                "payload": {
                    "tenant_id": tenant_id,
                    "user_id": user_id,
                    "relationship_type": relationship_type,
                    "entity_id": entity_id,
                    "context": context,  # FULL flexible context!
                    "created_at": datetime.utcnow().isoformat()
                }
            }]
        )

        return situation_id

    async def store_relationship_with_context(
        self,
        user_id: str,
        entity_id: str,
        relationship_type: str,
        situation_id: str,
        properties: Dict[str, Any]
    ) -> None:
        """
        Create Neo4j relationship with situation_id reference (SECONDARY).

        Implements 1-Hop pattern: No IN_SITUATION edge, just property.
        """
        relationship_instance_id = str(uuid4())

        query = f"""
        MATCH (u:User {{id: $user_id}})
        MATCH (e {{id: $entity_id}})
        CREATE (u)-[r:{relationship_type} {{
            relationship_instance_id: $rel_id,
            situation_id: $sit_id,
            observed_at: datetime(),
            confidence: $confidence,
            source: $source
        }}]->(e)
        RETURN r
        """

        try:
            async with self.neo4j.session() as session:
                await session.run(
                    query,
                    user_id=user_id,
                    entity_id=entity_id,
                    rel_id=relationship_instance_id,
                    sit_id=situation_id,
                    confidence=properties.get("confidence", 0.9),
                    source=properties.get("source", "explicit")
                )
        except Exception as e:
            # Rollback: Delete from Qdrant
            await self.qdrant.delete(
                collection_name="situations",
                points_selector=[situation_id]
            )
            raise RuntimeError(f"Neo4j failed, rolled back Qdrant: {e}")
```

**Key Implementation Notes:**
- Qdrant is PRIMARY: Store BEFORE Neo4j
- Neo4j has ONLY `situation_id` property (not full context)
- Rollback logic: If Neo4j fails, delete Qdrant point
- 1-Hop queries: `MATCH (u:User)-[r:KNOWS {situation_id: $sid}]->(p:Person)`

[Continue with remaining tasks, API, frontend, tests...]
```

---

## Begin Your Work

1. Read `/docs/prototypes/fidus-memory/migration-v3-wbs.md` thoroughly
2. For each of the 24 packages, generate a complete implementation prompt following the template above
3. Save each prompt as a separate markdown file in the appropriate epic folder
4. Ensure all prompts are consistent in structure and quality
5. Cross-reference dependencies (e.g., Package 2.1 should reference completion of 1.2)

**Remember:** Each prompt should be **standalone and actionable**. A developer should be able to pick up that prompt and implement the package without needing to read the entire WBS or ask clarifying questions.

---

**Meta-Prompt Version:** 1.0
**Created:** 2025-11-21
**Maintained by:** Fidus Architecture Team

---

**END OF META-PROMPT**

# Implementation Prompt: 4.1 - Habit Entity with Streak Tracking UI

**Package:** 4.1
**Epic:** Extended Entities & Orchestration
**Priority:** 🟡 MEDIUM
**Context Document:** `/docs/prototypes/fidus-memory/migration-v3-wbs.md` (Lines 840-889)

---

## Role

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

---

## Context & Background

**Current State:**
- ✅ Package 1.1 (Qdrant-First) completed: Context storage pattern established
- ✅ Package 1.2 (User entity) completed: User aggregate root operational
- ✅ Packages 2.1-2.3 (Core entities) completed: Person, Organization, Goal entities exist
- ✅ Packages 3.1-3.5 (Core relationships) completed: Graph relationships operational
- ❌ No Habit entity exists
- ❌ No habit tracking or streak calculation functionality

**Migration Goal:**
- Implement Habit entity for tracking recurring activities with ADR-0002 compliant property placement
- Build streak calculation logic for motivation
- Create LLM extractor to identify habits from conversations
- Build habit tracking UI with calendar heatmap visualization
- Enable users to check in daily and monitor progress
- Prepare foundation for HAS_HABIT relationship in Package 4.3 (User -[HAS_HABIT]-> Habit with temporal boundaries: started_at, ended_at)

**Architecture References:**
- Solution Architecture: `/docs/solution-architecture/15-entity-management.md`
- Domain Model: `/docs/domain-model/entity-model.md`
- ADR-0001: `/docs/adr/ADR-0001-situational-context-as-relationship-qualifier.md` (Qdrant-First Pattern)
- ADR-0002: `/docs/adr/ADR-0002-property-placement-and-geospatial-exception.md` (Property Placement Strategy)
- WBS: `/docs/prototypes/fidus-memory/migration-v3-wbs.md#package-41`

---

## Your Task

Implement **Habit Entity with Streak Tracking UI** according to the specifications below.

**User Story:**
As a user, I want to track my daily habits and see my streak progress to stay motivated.

**Acceptance Criteria:**
1. Backend: Habit entity model with ADR-0002 compliant property placement
2. Backend: Neo4j stores ONLY structural properties (id, tenant_id, user_id, created_at, updated_at)
3. Backend: Qdrant stores ALL habit context (name, description, frequency, target_days, current_streak, check_ins, ai_properties)
4. Backend: HabitRepository with Qdrant-First pattern operational
5. Backend: LLM habit extractor functional
6. API: Habit CRUD + check-in endpoint responding correctly
7. Frontend: Habit tracker component with calendar heatmap rendering
8. Frontend: Check-in button with streak display showing current streak
9. Tests: Create habit, check in daily, verify streak increments correctly, validate Qdrant-First pattern
10. Documentation: Habit tracking guide created with ADR-0002 references

---

## Technical Specification

### Backend Implementation

**Files to Create:**

1. **`packages/api/fidus/memory/entities/habit.py`**
   - Purpose: Habit entity model with streak logic
   - Contains: Core properties, computed properties for streak tracking

2. **`packages/api/fidus/memory/repositories/habit_repository.py`**
   - Purpose: Data access layer for habits
   - Contains: CRUD operations, check-in logic, calendar data retrieval

3. **`packages/api/fidus/memory/services/habit_extractor.py`**
   - Purpose: LLM-based habit extraction from conversations
   - Contains: Prompt engineering for identifying habits

**Detailed Implementation:**

#### 1. Habit Entity Model (`packages/api/fidus/memory/entities/habit.py`)

```python
from datetime import datetime, date, timedelta
from typing import Dict, Any, List, Optional, Literal
from uuid import UUID, uuid4
from pydantic import BaseModel, Field


class HabitCheckIn(BaseModel):
    """Record of a single habit completion."""
    date: date
    completed_at: datetime = Field(default_factory=datetime.utcnow)
    notes: Optional[str] = None


class Habit(BaseModel):
    """
    Habit entity for tracking recurring activities.

    Following ADR-0002: Qdrant-First pattern.
    - Neo4j stores ONLY: id, tenant_id, user_id, qdrant_id, created_at, updated_at
    - Qdrant stores ALL context: name, description, frequency, check_ins, streaks, ai_properties

    This enables semantic search over habit patterns while maintaining
    structural relationships in the graph.
    """
    id: UUID = Field(default_factory=uuid4)
    tenant_id: str
    user_id: str
    qdrant_id: str = Field(default_factory=lambda: f"habit_{uuid4().hex}")

    # Core properties (stored in Qdrant)
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    frequency: Literal["daily", "weekly", "custom"] = "daily"
    target_days: int = Field(gt=0, default=7, description="Number of days to complete habit")

    # Tracking (stored in Qdrant)
    current_streak: int = Field(default=0, ge=0)
    longest_streak: int = Field(default=0, ge=0)
    total_completions: int = Field(default=0, ge=0)
    check_ins: List[HabitCheckIn] = Field(default_factory=list)

    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # AI-discovered properties (stored in Qdrant)
    ai_properties: Dict[str, Any] = Field(default_factory=dict)

    @property
    def is_due_today(self) -> bool:
        """Check if habit is due today based on last check-in."""
        if not self.check_ins:
            return True

        last_check_in = max(self.check_ins, key=lambda x: x.date)
        return last_check_in.date < date.today()

    @property
    def completion_rate(self) -> float:
        """Calculate completion rate over last 30 days."""
        if not self.check_ins:
            return 0.0

        thirty_days_ago = date.today() - timedelta(days=30)
        recent_check_ins = [
            ci for ci in self.check_ins
            if ci.date >= thirty_days_ago
        ]

        if self.frequency == "daily":
            expected_days = 30
        elif self.frequency == "weekly":
            expected_days = 4  # ~4 weeks
        else:
            expected_days = self.target_days

        return min(1.0, len(recent_check_ins) / expected_days)

    @property
    def last_check_in_date(self) -> Optional[date]:
        """Get the date of the most recent check-in."""
        if not self.check_ins:
            return None
        return max(self.check_ins, key=lambda x: x.date).date

    def calculate_streak(self) -> int:
        """
        Calculate current streak based on consecutive check-ins.

        Returns:
            Number of consecutive days with check-ins up to today
        """
        if not self.check_ins:
            return 0

        # Sort check-ins by date descending
        sorted_check_ins = sorted(self.check_ins, key=lambda x: x.date, reverse=True)

        today = date.today()
        streak = 0
        expected_date = today

        # Allow grace period: if last check-in was yesterday, streak continues
        if sorted_check_ins[0].date < today - timedelta(days=1):
            return 0

        for check_in in sorted_check_ins:
            if check_in.date == expected_date or check_in.date == expected_date - timedelta(days=1):
                streak += 1
                expected_date = check_in.date - timedelta(days=1)
            else:
                break

        return streak

    class Config:
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "tenant_id": "tenant_123",
                "user_id": "user_456",
                "name": "Meditate 10 minutes",
                "description": "Daily meditation practice",
                "frequency": "daily",
                "target_days": 30,
                "current_streak": 7,
                "longest_streak": 14,
                "total_completions": 45,
                "check_ins": [],
                "ai_properties": {
                    "best_time": "morning",
                    "difficulty": "easy"
                }
            }
        }
```

#### 2. Habit Repository (`packages/api/fidus/memory/repositories/habit_repository.py`)

```python
from datetime import date, datetime, timedelta
from typing import List, Optional, Dict, Any
from uuid import UUID
import logging

from neo4j import AsyncDriver
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, Filter, FieldCondition, MatchValue
from fidus.memory.entities.habit import Habit, HabitCheckIn

logger = logging.getLogger(__name__)


class HabitRepository:
    """
    Repository for managing Habit entities following Qdrant-First pattern (ADR-0002).

    Pattern:
    1. Store full habit context in Qdrant (PRIMARY)
    2. Store minimal reference in Neo4j (SECONDARY)
    3. All queries start from Qdrant, optionally enrich with Neo4j
    """

    def __init__(self, qdrant_client: QdrantClient, neo4j_driver: AsyncDriver):
        self.qdrant = qdrant_client
        self.neo4j = neo4j_driver
        self.collection_name = "habits"

    async def create(self, habit: Habit) -> Habit:
        """
        Create a new habit following Qdrant-First pattern.

        Following ADR-0002:
        - Qdrant stores: name, description, frequency, check_ins, streaks, ai_properties
        - Neo4j stores: id, tenant_id, user_id, qdrant_id, created_at, updated_at
        """
        # Step 1: Store in Qdrant (PRIMARY)
        try:
            embedding = await self._embed_habit(habit)

            point = PointStruct(
                id=habit.qdrant_id,
                vector=embedding,
                payload={
                    "habit_id": str(habit.id),
                    "tenant_id": habit.tenant_id,
                    "user_id": habit.user_id,
                    "name": habit.name,
                    "description": habit.description,
                    "frequency": habit.frequency,
                    "target_days": habit.target_days,
                    "current_streak": habit.current_streak,
                    "longest_streak": habit.longest_streak,
                    "total_completions": habit.total_completions,
                    "check_ins": [ci.model_dump() for ci in habit.check_ins],
                    "created_at": habit.created_at.isoformat(),
                    "updated_at": habit.updated_at.isoformat(),
                    "ai_properties": habit.ai_properties
                }
            )

            self.qdrant.upsert(
                collection_name=self.collection_name,
                points=[point]
            )

            logger.info(f"Stored habit in Qdrant: {habit.qdrant_id}")

        except Exception as e:
            logger.error(f"Failed to store in Qdrant: {e}")
            raise RuntimeError(f"Qdrant storage failed: {e}")

        # Step 2: Create Neo4j node (SECONDARY)
        # Following ADR-0002: ONLY structural properties
        try:
            query = """
            CREATE (h:Habit {
                id: $id,
                tenant_id: $tenant_id,
                user_id: $user_id,
                qdrant_id: $qdrant_id,
                created_at: datetime($created_at),
                updated_at: datetime($updated_at)
            })
            RETURN h
            """

            async with self.neo4j.session() as session:
                await session.run(
                    query,
                    id=str(habit.id),
                    tenant_id=habit.tenant_id,
                    user_id=habit.user_id,
                    qdrant_id=habit.qdrant_id,
                    created_at=habit.created_at.isoformat(),
                    updated_at=habit.updated_at.isoformat()
                )

            logger.info(f"Created Neo4j Habit: {habit.id}")

        except Exception as e:
            # Rollback: Delete from Qdrant
            logger.error(f"Neo4j failed, rolling back Qdrant: {e}")
            try:
                self.qdrant.delete(
                    collection_name=self.collection_name,
                    points_selector=[habit.qdrant_id]
                )
            except Exception as rollback_error:
                logger.error(f"Rollback failed: {rollback_error}")

            raise RuntimeError(f"Neo4j failed, rolled back Qdrant: {e}")

        return habit

    async def get(self, habit_id: UUID, tenant_id: str) -> Optional[Habit]:
        """
        Get a habit by ID following Qdrant-First pattern.

        Query flow:
        1. Fetch from Qdrant (contains all context)
        2. Optionally verify in Neo4j (for relationship queries)
        """
        # Fetch from Qdrant
        results = self.qdrant.scroll(
            collection_name=self.collection_name,
            scroll_filter=Filter(
                must=[
                    FieldCondition(key="habit_id", match=MatchValue(value=str(habit_id))),
                    FieldCondition(key="tenant_id", match=MatchValue(value=tenant_id))
                ]
            ),
            limit=1
        )

        if not results[0]:
            return None

        payload = results[0][0].payload
        return self._payload_to_habit(payload)

    async def update(self, habit: Habit) -> Habit:
        """
        Update an existing habit following Qdrant-First pattern.

        Following ADR-0002:
        - Update Qdrant payload (all context changes)
        - Update Neo4j timestamp only
        """
        habit.updated_at = datetime.utcnow()

        # Step 1: Update Qdrant (PRIMARY)
        try:
            embedding = await self._embed_habit(habit)

            point = PointStruct(
                id=habit.qdrant_id,
                vector=embedding,
                payload={
                    "habit_id": str(habit.id),
                    "tenant_id": habit.tenant_id,
                    "user_id": habit.user_id,
                    "name": habit.name,
                    "description": habit.description,
                    "frequency": habit.frequency,
                    "target_days": habit.target_days,
                    "current_streak": habit.current_streak,
                    "longest_streak": habit.longest_streak,
                    "total_completions": habit.total_completions,
                    "check_ins": [ci.model_dump() for ci in habit.check_ins],
                    "created_at": habit.created_at.isoformat(),
                    "updated_at": habit.updated_at.isoformat(),
                    "ai_properties": habit.ai_properties
                }
            )

            self.qdrant.upsert(
                collection_name=self.collection_name,
                points=[point]
            )

            logger.info(f"Updated habit in Qdrant: {habit.qdrant_id}")

        except Exception as e:
            logger.error(f"Failed to update in Qdrant: {e}")
            raise RuntimeError(f"Qdrant update failed: {e}")

        # Step 2: Update Neo4j timestamp (SECONDARY)
        try:
            query = """
            MATCH (h:Habit {id: $id, tenant_id: $tenant_id})
            SET h.updated_at = datetime($updated_at)
            RETURN h
            """

            async with self.neo4j.session() as session:
                await session.run(
                    query,
                    id=str(habit.id),
                    tenant_id=habit.tenant_id,
                    updated_at=habit.updated_at.isoformat()
                )

        except Exception as e:
            logger.warning(f"Neo4j timestamp update failed: {e}")
            # Non-critical: Qdrant is source of truth

        return habit

    async def delete(self, habit_id: UUID, tenant_id: str) -> bool:
        """
        Delete a habit from both systems.

        Follows Qdrant-First: delete from both, but Qdrant is critical.
        """
        # Delete from Qdrant
        try:
            # First get qdrant_id
            habit = await self.get(habit_id, tenant_id)
            if not habit:
                return False

            self.qdrant.delete(
                collection_name=self.collection_name,
                points_selector=[habit.qdrant_id]
            )
            logger.info(f"Deleted habit from Qdrant: {habit.qdrant_id}")
        except Exception as e:
            logger.error(f"Failed to delete from Qdrant: {e}")
            raise

        # Delete from Neo4j
        try:
            query = """
            MATCH (h:Habit {id: $id, tenant_id: $tenant_id})
            DETACH DELETE h
            RETURN count(h) as deleted
            """

            async with self.neo4j.session() as session:
                result = await session.run(query, id=str(habit_id), tenant_id=tenant_id)
                record = await result.single()
                return record["deleted"] > 0
        except Exception as e:
            logger.warning(f"Neo4j deletion failed: {e}")
            return True  # Qdrant deletion succeeded

    async def list_by_user(self, user_id: str, tenant_id: str) -> List[Habit]:
        """
        List all habits for a user following Qdrant-First pattern.

        Query Qdrant directly for full context.
        """
        results = self.qdrant.scroll(
            collection_name=self.collection_name,
            scroll_filter=Filter(
                must=[
                    FieldCondition(key="user_id", match=MatchValue(value=user_id)),
                    FieldCondition(key="tenant_id", match=MatchValue(value=tenant_id))
                ]
            ),
            limit=100,
            order_by="created_at"
        )

        return [self._payload_to_habit(point.payload) for point in results[0]]

    async def check_in(self, habit_id: UUID, tenant_id: str, notes: Optional[str] = None) -> Habit:
        """
        Record a check-in for today and update streak.

        Returns:
            Updated Habit entity with new streak
        """
        habit = await self.get(habit_id, tenant_id)
        if not habit:
            raise ValueError(f"Habit {habit_id} not found")

        # Check if already checked in today
        today = date.today()
        if any(ci.date == today for ci in habit.check_ins):
            raise ValueError("Already checked in today")

        # Add check-in
        check_in = HabitCheckIn(date=today, notes=notes)
        habit.check_ins.append(check_in)
        habit.total_completions += 1

        # Recalculate streak
        habit.current_streak = habit.calculate_streak()
        if habit.current_streak > habit.longest_streak:
            habit.longest_streak = habit.current_streak

        # Save
        return await self.update(habit)

    async def get_habit_calendar(
        self,
        habit_id: UUID,
        tenant_id: str,
        days: int = 90
    ) -> Dict[str, Any]:
        """
        Get calendar data for the last N days.

        Returns:
            {
                "habit_id": "...",
                "current_streak": 7,
                "calendar": [
                    {"date": "2025-11-21", "completed": true},
                    {"date": "2025-11-20", "completed": true},
                    ...
                ]
            }
        """
        habit = await self.get(habit_id, tenant_id)
        if not habit:
            raise ValueError(f"Habit {habit_id} not found")

        # Build calendar for last N days
        today = date.today()
        calendar = []

        for i in range(days):
            check_date = today - timedelta(days=i)
            completed = any(ci.date == check_date for ci in habit.check_ins)
            calendar.append({
                "date": check_date.isoformat(),
                "completed": completed
            })

        return {
            "habit_id": str(habit.id),
            "current_streak": habit.current_streak,
            "longest_streak": habit.longest_streak,
            "completion_rate": habit.completion_rate,
            "calendar": calendar
        }

    def _payload_to_habit(self, payload: Dict[str, Any]) -> Habit:
        """Convert Qdrant payload to Habit entity."""
        check_ins_data = payload.get("check_ins", [])
        check_ins = [HabitCheckIn(**ci) for ci in check_ins_data]

        return Habit(
            id=UUID(payload["habit_id"]),
            tenant_id=payload["tenant_id"],
            user_id=payload["user_id"],
            qdrant_id=payload.get("qdrant_id", f"habit_{uuid4().hex}"),
            name=payload["name"],
            description=payload.get("description"),
            frequency=payload["frequency"],
            target_days=payload["target_days"],
            current_streak=payload["current_streak"],
            longest_streak=payload["longest_streak"],
            total_completions=payload["total_completions"],
            check_ins=check_ins,
            created_at=datetime.fromisoformat(payload["created_at"]),
            updated_at=datetime.fromisoformat(payload["updated_at"]),
            ai_properties=payload.get("ai_properties", {})
        )

    async def _embed_habit(self, habit: Habit) -> List[float]:
        """
        Generate embedding for habit semantic search.

        Embeds: name + description + frequency + ai_properties context
        """
        # Placeholder: integrate with LiteLLM
        text = f"{habit.name} {habit.description or ''} {habit.frequency}"
        import random
        return [random.random() for _ in range(1536)]
```

---

### 1-Hop Query Pattern Examples

Following ADR-0002, habits can be queried using the 1-Hop pattern when relationships exist:

#### Example: Get User's Habits via HAS_HABIT Relationship (Package 4.3)

```python
async def get_user_habits_with_context(
    user_id: str,
    tenant_id: str,
    neo4j: AsyncDriver,
    qdrant: QdrantClient
) -> List[Dict[str, Any]]:
    """
    1-Hop Query Pattern: User -> HAS_HABIT -> Habit

    Step 1: Neo4j traversal (structural + temporal)
    Step 2: Qdrant enrichment (context)
    """
    # Step 1: Get structural data from Neo4j
    query = """
    MATCH (u:User {id: $user_id, tenant_id: $tenant_id})-[r:HAS_HABIT]->(h:Habit)
    WHERE r.ended_at IS NULL OR r.ended_at >= date()
    RETURN
        h.id AS habit_id,
        h.qdrant_id AS qdrant_id,
        r.started_at AS started_at,
        r.ended_at AS ended_at
    ORDER BY h.created_at DESC
    """

    async with neo4j.session() as session:
        result = await session.run(query, user_id=user_id, tenant_id=tenant_id)
        records = await result.data()

    if not records:
        return []

    # Step 2: Fetch context from Qdrant
    qdrant_ids = [r["qdrant_id"] for r in records]

    habits_context = qdrant.scroll(
        collection_name="habits",
        scroll_filter=Filter(
            must=[
                FieldCondition(key="qdrant_id", match=MatchValue(value=qdrant_ids))
            ]
        ),
        limit=len(qdrant_ids)
    )

    context_map = {h.payload["qdrant_id"]: h.payload for h in habits_context[0]}

    # Step 3: Combine
    enriched = []
    for record in records:
        context = context_map.get(record["qdrant_id"], {})
        enriched.append({
            "habit_id": record["habit_id"],
            "started_at": record["started_at"],
            "ended_at": record["ended_at"],
            # Context from Qdrant
            "name": context.get("name"),
            "description": context.get("description"),
            "frequency": context.get("frequency"),
            "current_streak": context.get("current_streak"),
            "longest_streak": context.get("longest_streak"),
            "check_ins": context.get("check_ins", [])
        })

    return enriched
```

#### Example: Semantic Search for Similar Habits

```python
async def find_similar_habits(
    habit_name: str,
    tenant_id: str,
    qdrant: QdrantClient,
    limit: int = 5
) -> List[Habit]:
    """
    Semantic search across habits using Qdrant embeddings.

    Use case: "Show me habits similar to 'morning meditation'"
    """
    # Embed query
    query_embedding = await embed_text(habit_name)

    # Search Qdrant
    results = qdrant.search(
        collection_name="habits",
        query_vector=query_embedding,
        query_filter=Filter(
            must=[
                FieldCondition(key="tenant_id", match=MatchValue(value=tenant_id))
            ]
        ),
        limit=limit
    )

    return [_payload_to_habit(hit.payload) for hit in results]
```

---

### HAS_HABIT Relationship Pattern (Package 4.3 Foundation)

This package prepares for the HAS_HABIT relationship in Package 4.3. Following ADR-0002, the relationship will use temporal boundaries:

```python
# Neo4j Relationship (STRUCTURAL + TEMPORAL)
CREATE (u:User)-[r:HAS_HABIT {
    relationship_instance_id: $rel_id,
    situation_id: $sit_id,
    started_at: date("2025-01-01"),      # ✅ When user started habit
    ended_at: null,                      # ✅ null = active habit
    observed_at: datetime(),
    confidence: 1.0,
    source: "explicit"
}]->(h:Habit)

# Qdrant Context (HABIT ENGAGEMENT PATTERNS)
{
  "situation_id": "uuid-here",
  "relationship_instance_id": "uuid-here",
  "context": {
    "motivation": "health improvement",
    "commitment_level": "high",
    "reminder_preference": "morning",
    "support_system": ["friend_uuid_123"],
    "started_at": "2025-01-01",          # Copied for completeness
    "ended_at": null
  }
}
```

**Temporal Queries Enabled:**
- "Which habits did user have active in February 2025?"
- "What is the user's longest-running active habit?"
- "Show all habits started this year"

All queries follow the pattern: Neo4j for temporal filtering → Qdrant for context enrichment.

---

#### 3. Habit Extractor Service (`packages/api/fidus/memory/services/habit_extractor.py`)

```python
from typing import Optional
from fidus.memory.entities.habit import Habit
from fidus.llm.client import LLMClient


class HabitExtractor:
    """
    Extract habits from natural language using LLM.
    """

    def __init__(self, llm_client: LLMClient):
        self.llm = llm_client

    async def extract(
        self,
        text: str,
        user_id: str,
        tenant_id: str
    ) -> Optional[Habit]:
        """
        Extract habit information from text.

        Args:
            text: User's message
            user_id: User identifier
            tenant_id: Tenant identifier

        Returns:
            Habit entity if detected, None otherwise
        """
        prompt = f"""
        Extract habit information from the following text.

        Text: "{text}"

        If the text describes a recurring activity or goal the user wants to track,
        extract the following:
        - name (required): Short name of the habit
        - description (optional): Detailed description
        - frequency: "daily", "weekly", or "custom"
        - target_days: Number of days to complete (default: 7 for weekly, 30 for daily)

        Additional properties you may identify:
        - best_time: When user prefers to do this (morning, evening, etc.)
        - difficulty: User's perceived difficulty (easy, medium, hard)
        - motivation: Why they want to do this

        Return JSON format:
        {{
            "name": "...",
            "description": "...",
            "frequency": "daily|weekly|custom",
            "target_days": 30,
            "ai_properties": {{
                "best_time": "...",
                "difficulty": "...",
                "motivation": "..."
            }}
        }}

        If no habit is detected, return: {{"detected": false}}
        """

        response = await self.llm.generate_structured(
            prompt=prompt,
            schema={
                "type": "object",
                "properties": {
                    "detected": {"type": "boolean"},
                    "name": {"type": "string"},
                    "description": {"type": "string"},
                    "frequency": {"type": "string", "enum": ["daily", "weekly", "custom"]},
                    "target_days": {"type": "integer"},
                    "ai_properties": {"type": "object"}
                },
                "required": ["detected"]
            }
        )

        if not response.get("detected", False):
            return None

        return Habit(
            tenant_id=tenant_id,
            user_id=user_id,
            name=response["name"],
            description=response.get("description"),
            frequency=response.get("frequency", "daily"),
            target_days=response.get("target_days", 7),
            ai_properties=response.get("ai_properties", {})
        )
```

---

### API Implementation

**Files to Create:**

1. **`packages/api/fidus/memory/routes/habit_routes.py`**
   - Purpose: FastAPI router for habit endpoints
   - Contains: CRUD operations + check-in endpoint

**Endpoints to Implement:**

1. `POST /api/memory/entities/habit` - Create new habit
2. `GET /api/memory/entities/habit/{habit_id}` - Get habit by ID
3. `PUT /api/memory/entities/habit/{habit_id}` - Update habit
4. `DELETE /api/memory/entities/habit/{habit_id}` - Delete habit
5. `GET /api/memory/entities/habit?user_id={id}` - List user's habits
6. `POST /api/memory/entities/habit/{habit_id}/check-in` - Record completion
7. `GET /api/memory/entities/habit/{habit_id}/calendar` - Get calendar data

**Implementation Example:**

```python
from fastapi import APIRouter, Depends, HTTPException, Query
from uuid import UUID
from typing import List, Optional

from fidus.memory.entities.habit import Habit
from fidus.memory.repositories.habit_repository import HabitRepository
from fidus.dependencies import get_habit_repository, get_current_user


router = APIRouter(prefix="/api/memory/entities/habit", tags=["habits"])


@router.post("/", response_model=Habit)
async def create_habit(
    habit: Habit,
    repo: HabitRepository = Depends(get_habit_repository),
    current_user: dict = Depends(get_current_user)
):
    """Create a new habit."""
    # Validate tenant_id matches current user
    if habit.tenant_id != current_user["tenant_id"]:
        raise HTTPException(status_code=403, detail="Tenant mismatch")

    return await repo.create(habit)


@router.get("/{habit_id}", response_model=Habit)
async def get_habit(
    habit_id: UUID,
    repo: HabitRepository = Depends(get_habit_repository),
    current_user: dict = Depends(get_current_user)
):
    """Get a habit by ID."""
    habit = await repo.get(habit_id, current_user["tenant_id"])
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return habit


@router.put("/{habit_id}", response_model=Habit)
async def update_habit(
    habit_id: UUID,
    updated_habit: Habit,
    repo: HabitRepository = Depends(get_habit_repository),
    current_user: dict = Depends(get_current_user)
):
    """Update an existing habit."""
    existing = await repo.get(habit_id, current_user["tenant_id"])
    if not existing:
        raise HTTPException(status_code=404, detail="Habit not found")

    updated_habit.id = habit_id
    updated_habit.tenant_id = current_user["tenant_id"]
    return await repo.update(updated_habit)


@router.delete("/{habit_id}")
async def delete_habit(
    habit_id: UUID,
    repo: HabitRepository = Depends(get_habit_repository),
    current_user: dict = Depends(get_current_user)
):
    """Delete a habit."""
    deleted = await repo.delete(habit_id, current_user["tenant_id"])
    if not deleted:
        raise HTTPException(status_code=404, detail="Habit not found")
    return {"status": "deleted"}


@router.get("/", response_model=List[Habit])
async def list_habits(
    user_id: str = Query(...),
    repo: HabitRepository = Depends(get_habit_repository),
    current_user: dict = Depends(get_current_user)
):
    """List all habits for a user."""
    return await repo.list_by_user(user_id, current_user["tenant_id"])


@router.post("/{habit_id}/check-in", response_model=Habit)
async def check_in_habit(
    habit_id: UUID,
    notes: Optional[str] = None,
    repo: HabitRepository = Depends(get_habit_repository),
    current_user: dict = Depends(get_current_user)
):
    """Record a check-in for today."""
    try:
        return await repo.check_in(habit_id, current_user["tenant_id"], notes)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{habit_id}/calendar")
async def get_habit_calendar(
    habit_id: UUID,
    days: int = Query(90, ge=1, le=365),
    repo: HabitRepository = Depends(get_habit_repository),
    current_user: dict = Depends(get_current_user)
):
    """Get calendar data for habit visualization."""
    try:
        return await repo.get_habit_calendar(habit_id, current_user["tenant_id"], days)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
```

**OpenAPI Schema Example:**

```yaml
paths:
  /api/memory/entities/habit/{habit_id}/check-in:
    post:
      summary: Check in habit for today
      tags:
        - habits
      parameters:
        - name: habit_id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                notes:
                  type: string
                  nullable: true
      responses:
        200:
          description: Habit updated with check-in
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Habit'
        400:
          description: Already checked in today
        404:
          description: Habit not found
```

---

### Frontend Implementation

**Components to Create:**

1. **`packages/web/src/components/memory/HabitTracker.tsx`**
   - Purpose: Main habit tracker page
   - Props: None (fetches data internally)
   - State: List of habits, loading state

2. **`packages/web/src/components/memory/HabitCard.tsx`**
   - Purpose: Individual habit card with check-in button
   - Props: `habit: Habit`, `onCheckIn: () => void`
   - State: Check-in loading state

3. **`packages/web/src/components/memory/HabitCalendarHeatmap.tsx`**
   - Purpose: Visual calendar showing completion history
   - Props: `calendarData: CalendarData`
   - Library: react-calendar-heatmap

**Implementation Example:**

#### HabitTracker Component

```typescript
// packages/web/src/components/memory/HabitTracker.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Skeleton } from '@fidus/ui';
import { HabitCard } from './HabitCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHabits, checkInHabit } from '@/lib/api/memory';

interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  current_streak: number;
  longest_streak: number;
  total_completions: number;
  is_due_today: boolean;
  completion_rate: number;
}

export function HabitTracker() {
  const queryClient = useQueryClient();

  const { data: habits, isLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: () => getHabits(),
  });

  const checkInMutation = useMutation({
    mutationFn: (habitId: string) => checkInHabit(habitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  const handleCheckIn = async (habitId: string) => {
    try {
      await checkInMutation.mutateAsync(habitId);
    } catch (error) {
      console.error('Check-in failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Habits</h1>
        <Button href="/memory/habits/new">+ New Habit</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits?.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onCheckIn={() => handleCheckIn(habit.id)}
            isCheckingIn={checkInMutation.isPending}
          />
        ))}
      </div>

      {habits?.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-500 mb-4">No habits yet</p>
          <Button href="/memory/habits/new">Create your first habit</Button>
        </Card>
      )}
    </div>
  );
}
```

#### HabitCard Component

```typescript
// packages/web/src/components/memory/HabitCard.tsx
'use client';

import { Card, Button, Badge } from '@fidus/ui';
import { CheckCircleIcon, FireIcon } from '@heroicons/react/24/solid';

interface HabitCardProps {
  habit: {
    id: string;
    name: string;
    description?: string;
    frequency: string;
    current_streak: number;
    longest_streak: number;
    is_due_today: boolean;
    completion_rate: number;
  };
  onCheckIn: () => void;
  isCheckingIn: boolean;
}

export function HabitCard({ habit, onCheckIn, isCheckingIn }: HabitCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{habit.name}</h3>
          {habit.description && (
            <p className="text-sm text-gray-600 mt-1">{habit.description}</p>
          )}
        </div>
        <Badge variant={habit.is_due_today ? 'warning' : 'success'}>
          {habit.frequency}
        </Badge>
      </div>

      {/* Streak Display */}
      {habit.current_streak > 0 && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-orange-50 rounded-lg">
          <FireIcon className="h-6 w-6 text-orange-500" />
          <div>
            <p className="text-sm font-semibold text-orange-700">
              {habit.current_streak} day streak!
            </p>
            <p className="text-xs text-orange-600">
              Best: {habit.longest_streak} days
            </p>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress (30 days)</span>
          <span>{Math.round(habit.completion_rate * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${habit.completion_rate * 100}%` }}
          />
        </div>
      </div>

      {/* Check-in Button */}
      <Button
        onClick={onCheckIn}
        disabled={!habit.is_due_today || isCheckingIn}
        variant={habit.is_due_today ? 'primary' : 'secondary'}
        className="w-full"
      >
        {!habit.is_due_today ? (
          <>
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            Completed Today
          </>
        ) : (
          'Check In'
        )}
      </Button>

      <Button
        href={`/memory/habits/${habit.id}`}
        variant="ghost"
        className="w-full mt-2"
      >
        View Details
      </Button>
    </Card>
  );
}
```

#### Calendar Heatmap Component

```typescript
// packages/web/src/components/memory/HabitCalendarHeatmap.tsx
'use client';

import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip } from '@fidus/ui';

interface CalendarDataPoint {
  date: string;
  completed: boolean;
}

interface HabitCalendarHeatmapProps {
  calendarData: CalendarDataPoint[];
  currentStreak: number;
}

export function HabitCalendarHeatmap({
  calendarData,
  currentStreak
}: HabitCalendarHeatmapProps) {
  const values = calendarData.map(point => ({
    date: new Date(point.date),
    count: point.completed ? 1 : 0,
  }));

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90);

  return (
    <div className="habit-calendar">
      <h3 className="text-lg font-semibold mb-4">
        Last 90 Days
        {currentStreak > 0 && (
          <span className="ml-3 text-orange-500">
            🔥 {currentStreak} day streak
          </span>
        )}
      </h3>

      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={values}
        classForValue={(value) => {
          if (!value || value.count === 0) {
            return 'color-empty';
          }
          return 'color-filled';
        }}
        tooltipDataAttrs={(value: any) => {
          if (!value || !value.date) {
            return {};
          }
          return {
            'data-tip': `${value.date.toLocaleDateString()}: ${
              value.count > 0 ? 'Completed' : 'Missed'
            }`,
          };
        }}
      />

      <style jsx>{`
        :global(.color-empty) {
          fill: #ebedf0;
        }
        :global(.color-filled) {
          fill: #10b981;
        }
        :global(.color-filled:hover) {
          fill: #059669;
        }
      `}</style>
    </div>
  );
}
```

**UI/UX Requirements:**
- Habit cards must show streak prominently with fire emoji (🔥)
- Check-in button disabled if already checked in today (show checkmark)
- Calendar heatmap uses green for completed days, gray for missed
- Progress bar shows 30-day completion rate
- Responsive grid layout: 1 column mobile, 2 tablet, 3 desktop
- Loading skeletons while fetching data
- Empty state with "Create your first habit" CTA

**Routes to Add:**
- `/memory/habits` - Main habit tracker page
- `/memory/habits/new` - Create new habit form
- `/memory/habits/[id]` - Habit detail page with calendar

---

### Testing Requirements

**Unit Tests:**

```python
# packages/api/tests/unit/memory/test_habit.py

import pytest
from datetime import date, timedelta
from fidus.memory.entities.habit import Habit, HabitCheckIn


def test_streak_calculation_consecutive_days():
    """Test streak increments with consecutive daily check-ins."""
    habit = Habit(
        tenant_id="test",
        user_id="user1",
        name="Meditate",
        frequency="daily"
    )

    # Add 3 consecutive days
    today = date.today()
    habit.check_ins = [
        HabitCheckIn(date=today),
        HabitCheckIn(date=today - timedelta(days=1)),
        HabitCheckIn(date=today - timedelta(days=2)),
    ]

    streak = habit.calculate_streak()
    assert streak == 3


def test_streak_breaks_with_gap():
    """Test streak resets when a day is missed."""
    habit = Habit(
        tenant_id="test",
        user_id="user1",
        name="Meditate",
        frequency="daily"
    )

    today = date.today()
    habit.check_ins = [
        HabitCheckIn(date=today),
        HabitCheckIn(date=today - timedelta(days=1)),
        # Gap here - day 2 missed
        HabitCheckIn(date=today - timedelta(days=3)),
    ]

    streak = habit.calculate_streak()
    assert streak == 2  # Only counts today and yesterday


def test_is_due_today_no_check_ins():
    """Test habit is due when no check-ins exist."""
    habit = Habit(
        tenant_id="test",
        user_id="user1",
        name="Meditate",
        frequency="daily"
    )

    assert habit.is_due_today is True


def test_is_due_today_already_checked_in():
    """Test habit is not due when already checked in today."""
    habit = Habit(
        tenant_id="test",
        user_id="user1",
        name="Meditate",
        frequency="daily"
    )
    habit.check_ins = [HabitCheckIn(date=date.today())]

    assert habit.is_due_today is False


def test_completion_rate_calculation():
    """Test 30-day completion rate calculation."""
    habit = Habit(
        tenant_id="test",
        user_id="user1",
        name="Meditate",
        frequency="daily"
    )

    # Check in 15 out of last 30 days
    today = date.today()
    habit.check_ins = [
        HabitCheckIn(date=today - timedelta(days=i))
        for i in range(0, 30, 2)  # Every other day
    ]

    rate = habit.completion_rate
    assert 0.48 < rate < 0.52  # ~50% (15/30)
```

**Integration Tests:**

```python
# packages/api/tests/integration/memory/test_habit_api.py

import pytest
from httpx import AsyncClient
from datetime import date


@pytest.mark.asyncio
async def test_create_and_check_in_habit(client: AsyncClient, auth_headers):
    """Test creating a habit and checking in."""
    # Create habit
    habit_data = {
        "tenant_id": "test_tenant",
        "user_id": "user123",
        "name": "Morning Meditation",
        "description": "10 minutes of mindfulness",
        "frequency": "daily",
        "target_days": 30
    }

    response = await client.post(
        "/api/memory/entities/habit",
        json=habit_data,
        headers=auth_headers
    )
    assert response.status_code == 200
    habit = response.json()
    habit_id = habit["id"]

    # Check in
    response = await client.post(
        f"/api/memory/entities/habit/{habit_id}/check-in",
        headers=auth_headers
    )
    assert response.status_code == 200
    updated_habit = response.json()

    assert updated_habit["current_streak"] == 1
    assert updated_habit["total_completions"] == 1
    assert len(updated_habit["check_ins"]) == 1


@pytest.mark.asyncio
async def test_cannot_check_in_twice_same_day(client: AsyncClient, auth_headers):
    """Test that checking in twice on the same day fails."""
    # Create and check in once
    habit = await create_habit(client, auth_headers)
    habit_id = habit["id"]

    await client.post(
        f"/api/memory/entities/habit/{habit_id}/check-in",
        headers=auth_headers
    )

    # Try to check in again
    response = await client.post(
        f"/api/memory/entities/habit/{habit_id}/check-in",
        headers=auth_headers
    )
    assert response.status_code == 400
    assert "Already checked in" in response.json()["detail"]


@pytest.mark.asyncio
async def test_get_habit_calendar(client: AsyncClient, auth_headers):
    """Test retrieving calendar data for a habit."""
    habit = await create_habit(client, auth_headers)
    habit_id = habit["id"]

    # Check in
    await client.post(
        f"/api/memory/entities/habit/{habit_id}/check-in",
        headers=auth_headers
    )

    # Get calendar
    response = await client.get(
        f"/api/memory/entities/habit/{habit_id}/calendar?days=7",
        headers=auth_headers
    )
    assert response.status_code == 200
    calendar_data = response.json()

    assert calendar_data["habit_id"] == habit_id
    assert calendar_data["current_streak"] == 1
    assert len(calendar_data["calendar"]) == 7
    assert calendar_data["calendar"][0]["completed"] is True  # Today
```

**E2E Tests:**

```typescript
// packages/web/tests/e2e/memory/habit-workflow.spec.ts

import { test, expect } from '@playwright/test';

test('User can create habit, check in, and see streak', async ({ page }) => {
  // Navigate to habits page
  await page.goto('/memory/habits');

  // Click create new habit
  await page.click('text=New Habit');

  // Fill form
  await page.fill('input[name="name"]', 'Daily Reading');
  await page.fill('textarea[name="description"]', 'Read for 30 minutes');
  await page.selectOption('select[name="frequency"]', 'daily');
  await page.fill('input[name="target_days"]', '30');

  // Submit
  await page.click('button[type="submit"]');

  // Verify habit appears in list
  await expect(page.locator('text=Daily Reading')).toBeVisible();

  // Click check-in button
  await page.click('button:has-text("Check In")');

  // Verify streak badge appears
  await expect(page.locator('text=1 day streak')).toBeVisible();

  // Verify button changes to "Completed Today"
  await expect(page.locator('button:has-text("Completed Today")')).toBeDisabled();

  // Navigate to detail page
  await page.click('text=View Details');

  // Verify calendar heatmap shows today as completed
  const today = new Date().toLocaleDateString();
  const completedCell = page.locator(`[data-tip*="${today}"][data-tip*="Completed"]`);
  await expect(completedCell).toBeVisible();
});


test('Habit streak increments over multiple days', async ({ page }) => {
  // This test requires time manipulation or test data setup
  // Simulating by creating habit with pre-populated check-ins

  await page.goto('/memory/habits');

  // Assume habit exists with 7-day streak (from test data)
  await expect(page.locator('text=7 day streak')).toBeVisible();

  // Check progress bar shows ~100% for perfect streak
  const progressBar = page.locator('.bg-blue-600');
  const width = await progressBar.evaluate(el =>
    el.style.width || getComputedStyle(el).width
  );
  expect(parseInt(width)).toBeGreaterThan(90);
});
```

---

## Implementation Guidelines

### Must Follow

1. **ADR-0002 Compliance (CRITICAL):**
   - **Qdrant PRIMARY**: Store ALL habit context (name, description, frequency, check_ins, streaks, ai_properties)
   - **Neo4j SECONDARY**: Store ONLY structural properties (id, tenant_id, user_id, qdrant_id, created_at, updated_at)
   - **Write Order**: Qdrant first, then Neo4j (Qdrant-First pattern)
   - **Read Order**: Query Qdrant for context, optionally Neo4j for relationships
   - **Rollback**: If Neo4j write fails, delete from Qdrant

2. **Streak Calculation Logic:**
   - Streak counts consecutive days with check-ins
   - Grace period: If last check-in was yesterday, streak continues if user checks in today
   - Break: If 2+ days gap, streak resets to 1 (current check-in only)
   - Update `longest_streak` whenever `current_streak` exceeds it

3. **Feature Flag:**
   - All functionality behind feature flag: `ENABLE_HABIT_ENTITY`
   - Default: disabled in production, enabled in dev/staging
   - Backend: Check flag before processing habit extraction
   - Frontend: Hide habits nav link if flag is off

4. **Multi-Tenancy:**
   - ALL queries filter by `tenant_id`
   - Verify tenant_id in auth middleware before operations
   - Test: Verify users from different tenants cannot access each other's habits

5. **Error Handling:**
   - Qdrant failure: CRITICAL - abort operation
   - Neo4j failure: Rollback Qdrant, log error
   - Check-in twice same day: Return 400 with "Already checked in today"
   - Habit not found: Return 404 with "Habit not found"
   - Invalid frequency: Return 422 with validation error

6. **Code Quality:**
   - Type hints: All Python functions fully typed
   - TypeScript: No `any` types (use proper Habit interface)
   - Documentation: Docstrings for all public methods referencing ADR-0002
   - Linting: Pass Ruff (Python) and ESLint (TypeScript)

### Must NOT Do

- ❌ **VIOLATION**: Store context properties (name, description, frequency) in Neo4j
- ❌ **VIOLATION**: Query Neo4j for habit details (use Qdrant)
- ❌ **VIOLATION**: Skip Qdrant rollback on Neo4j failure
- ❌ Allow checking in for past dates (only today)
- ❌ Modify check-ins after creation (immutable once recorded)
- ❌ Allow negative streaks or completion counts
- ❌ Skip tenant_id validation (security critical)
- ❌ Store sensitive health data without GDPR considerations

---

## Dependencies & Prerequisites

**Required Before Starting:**
- [x] Package 1.1 (Qdrant-First) completed
- [x] Package 1.2 (User entity) completed
- [ ] Neo4j 5.x running and accessible
- [ ] Feature flag `ENABLE_HABIT_ENTITY` added to config
- [ ] react-calendar-heatmap library installed: `npm install react-calendar-heatmap`

**Technical Dependencies:**
- Neo4j 5.x: `neo4j://localhost:7687`
- Node 18+: For Next.js frontend
- Python 3.11+: For FastAPI backend
- LiteLLM client configured for habit extraction

---

## Step-by-Step Implementation Plan

### Phase 1: Backend Core
1. Create Habit entity model with streak calculation logic
2. Implement HabitRepository with CRUD and check-in methods
3. Add Neo4j constraints for habit uniqueness
4. Write unit tests for streak calculation logic

### Phase 2: API Layer
1. Create FastAPI router with CRUD endpoints
2. Implement check-in endpoint with validation
3. Add calendar data endpoint
4. Write integration tests for all endpoints

### Phase 3: LLM Extraction
1. Create HabitExtractor service
2. Design extraction prompt
3. Test extraction with sample conversations
4. Integrate into chat workflow

### Phase 4: Frontend Components
1. Create HabitTracker main component
2. Implement HabitCard with check-in button
3. Integrate calendar heatmap library
4. Add routes in Next.js App Router

### Phase 5: Integration & Testing
1. Write E2E tests for full workflow
2. Test feature flag toggle
3. Test multi-tenancy isolation
4. Performance test with 100+ habits

### Phase 6: Documentation
1. Update entity management documentation
2. Add habit tracking user guide
3. Document API endpoints in OpenAPI
4. Create migration notes

---

## Verification Checklist

Before marking this package as complete, verify:

### Functionality
- [ ] User can create habit via UI
- [ ] User can check in habit daily
- [ ] Streak increments correctly with consecutive check-ins
- [ ] Streak resets when day is missed
- [ ] Calendar heatmap displays check-in history
- [ ] Cannot check in twice on same day
- [ ] LLM extracts habits from conversations (e.g., "I want to meditate daily")

### Code Quality
- [ ] All files created as specified
- [ ] Type hints on all Python functions
- [ ] No TypeScript `any` types
- [ ] No linting errors (Ruff, ESLint)
- [ ] No TypeScript compilation errors

### Testing
- [ ] Unit tests pass (>80% coverage)
- [ ] Integration tests pass (all endpoints)
- [ ] E2E test passes (create → check in → view streak)
- [ ] Feature flag toggle tested (on/off works)
- [ ] Multi-tenancy verified (no cross-tenant access)

### Documentation
- [ ] Docstrings for public APIs
- [ ] Entity management docs updated
- [ ] API endpoints documented in OpenAPI
- [ ] Migration notes written

### Performance
- [ ] Calendar endpoint <500ms for 90 days
- [ ] Check-in endpoint <200ms
- [ ] UI renders smoothly with 50+ habits
- [ ] No memory leaks in heatmap component

### Deployment Readiness
- [ ] Feature flag `ENABLE_HABIT_ENTITY` in config
- [ ] No breaking changes to existing code
- [ ] Rollback plan documented
- [ ] Database indexes added for performance

---

## Risk Mitigation

**Risks from WBS:**
- Risk: None identified (LOW priority package)

**Additional Risks:**
- **Risk:** Streak calculation logic may have edge cases
  - Mitigation: Comprehensive unit tests covering all scenarios, property-based testing
- **Risk:** Calendar heatmap performance degrades with years of data
  - Mitigation: Limit calendar queries to 90-365 days, implement pagination if needed
- **Risk:** Users may manually manipulate check-ins by editing database
  - Mitigation: Audit log for check-ins, make check-ins immutable, admin review for anomalies

---

## Related Resources

**WBS Package Details:** `/docs/prototypes/fidus-memory/migration-v3-wbs.md#package-41`
**Architecture Review:** `/docs/reviews/2025-11-21-fidus-memory-architecture-review.md`
**Solution Architecture:** `/docs/solution-architecture/15-entity-management.md`
**Domain Model:** `/docs/domain-model/entity-model.md`
**Existing Codebase:**
- Entities: `packages/api/fidus/memory/entities/`
- Repositories: `packages/api/fidus/memory/repositories/`
- API Routes: `packages/api/fidus/memory/routes/`
- Frontend Components: `packages/web/src/components/memory/`

---

## Questions to Resolve Before Starting

If any of these are unclear, ask for clarification:

1. Should weekly habits allow check-ins on any day of the week, or specific days?
2. Should we support habit templates (e.g., "Exercise", "Meditate") for quick creation?
3. Should longest_streak be all-time or resettable?
4. Should we send reminder notifications when a habit is due? (Out of scope or future enhancement?)
5. Should the calendar heatmap show different colors for different completion percentages (partial completion)?

---

## Success Criteria

This package is **successfully implemented** when:

1. ✅ A user can create a habit via the UI and see it in their habit list
2. ✅ A user can check in daily and see their streak increment
3. ✅ The calendar heatmap visually displays the last 90 days of check-ins
4. ✅ Streak resets correctly when a day is missed
5. ✅ LLM extracts habits from conversation (e.g., "I want to exercise daily")
6. ✅ All tests pass (unit, integration, E2E)
7. ✅ Code review approved
8. ✅ Deployed to dev with feature flag OFF
9. ✅ Manual smoke test completed successfully
10. ✅ Documentation updated

---

**Prompt Version:** 1.0
**Generated:** 2025-11-21
**Target Package:** 4.1

---

**END OF IMPLEMENTATION PROMPT**

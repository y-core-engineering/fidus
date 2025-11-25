# Implementation Prompt: 4.3 - HAS_HABIT & ATTENDS Relationships

**Package:** 4.3
**Epic:** Extended Entities & Orchestration
**Priority:** 🟡 MEDIUM
**Context Document:** `/docs/prototypes/fidus-memory/migration-v3-wbs.md` (Lines 941-983)

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
- ✅ Packages 3.1-3.4 (Core relationships) completed: Base relationship pattern established
- ✅ Package 4.1 (Habit entity) completed: Habit tracking functional
- ✅ Package 4.2 (Event entity) completed: Event management functional
- ❌ No relationship between User and Habit entities
- ❌ No relationship between User and Event entities
- ❌ No situational context stored for habit check-ins or event attendance

**Migration Goal:**
- Implement HAS_HABIT relationship connecting User to Habit
- Implement ATTENDS relationship connecting User to Event
- Store situational context in Qdrant (PRIMARY) following ADR-0001
- Create Neo4j relationships with `situation_id` references (SECONDARY)
- Enable context-based queries for habits and events
- Enhance UI to display context factors when viewing habits/events

**Architecture References:**
- Solution Architecture: `/docs/solution-architecture/15-entity-management.md`
- ADR-0001: `/docs/adr/ADR-0001-qdrant-first-pattern.md` (Qdrant-First Pattern)
- ADR-0002: `/docs/adr/ADR-0002-property-placement-and-geospatial-exception.md` (Property Placement Strategy)
- Base Relationship Pattern: `packages/api/fidus/memory/entities/relationship.py` (from Package 3.1)
- Reference Implementations: Package 3.2 (WORKS_AT), Package 3.3 (PURSUES)

---

## Your Task

Implement **HAS_HABIT & ATTENDS Relationships** according to the specifications below.

**User Story:**
As a user, I want relationships between me and my habits/events so the system can provide contextual reminders and insights.

**Acceptance Criteria:**
1. Backend: HAS_HABIT relationship with ADR-0002 compliant property placement
2. Backend: Neo4j stores ONLY structural + temporal properties (relationship_instance_id, situation_id, started_at, ended_at, observed_at, confidence, source)
3. Backend: Qdrant stores ALL context properties (energy_level, motivation_level, difficulty_experienced, time_of_day, location, notes)
4. Backend: Temporal boundaries (started_at, ended_at) enable efficient "habits active during period X" queries
5. Backend: ATTENDS relationship with ADR-0002 compliant property placement
6. Backend: Neo4j stores ONLY structural + temporal properties for ATTENDS (attended_at as temporal boundary)
7. Backend: Qdrant stores ALL context properties for ATTENDS (attendance_status, mood_before, mood_after, energy_level, engagement_level)
8. API: HAS_HABIT and ATTENDS CRUD endpoints operational
9. Frontend: Habit/Event details show relationship context from Qdrant
10. Tests: Create relationships with context, query by date range, track context changes over time - all passing
11. Documentation: Relationship implementation guide updated with ADR-0002 references

---

## Technical Specification

### Backend Implementation

**Files to Create:**

1. **`packages/api/fidus/memory/relationships/has_habit.py`**
   - Purpose: HAS_HABIT relationship model
   - Contains: Properties specific to habit relationships

2. **`packages/api/fidus/memory/services/has_habit_relationship_service.py`**
   - Purpose: Business logic for HAS_HABIT relationships
   - Contains: Qdrant-First CRUD operations

3. **`packages/api/fidus/memory/relationships/attends.py`**
   - Purpose: ATTENDS relationship model
   - Contains: Properties specific to event attendance

4. **`packages/api/fidus/memory/services/attends_relationship_service.py`**
   - Purpose: Business logic for ATTENDS relationships
   - Contains: Qdrant-First CRUD operations

**Detailed Implementation:**

#### 1. HAS_HABIT Relationship Model (`packages/api/fidus/memory/relationships/has_habit.py`)

```python
from datetime import datetime, date
from typing import Optional, Literal, Dict, Any
from pydantic import BaseModel, Field

from fidus.memory.entities.relationship import RelationshipBase


class HasHabitRelationship(RelationshipBase):
    """
    HAS_HABIT relationship connecting User to Habit.

    Following ADR-0002: Temporal boundaries (started_at, ended_at) in Neo4j.
    Context properties (energy_level, motivation_level, etc.) in Qdrant ONLY.
    """
    # Entity references (structural)
    user_id: str
    habit_id: str = Field(..., description="ID of the Habit entity")

    # Temporal boundaries (ADR-0002: stored in Neo4j for efficient queries)
    started_at: date = Field(..., description="When user started this habit")
    ended_at: Optional[date] = Field(None, description="When user stopped this habit (null = still active)")

    @property
    def is_active(self) -> bool:
        """Check if this is an active habit."""
        return self.ended_at is None

    @property
    def duration_days(self) -> int:
        """Calculate habit duration in days."""
        from datetime import datetime
        end = datetime.combine(self.ended_at, datetime.min.time()) if self.ended_at else datetime.utcnow()
        start = datetime.combine(self.started_at, datetime.min.time())
        return (end - start).days

    class Config:
        json_schema_extra = {
            "example": {
                "relationship_instance_id": "550e8400-e29b-41d4-a716-446655440000",
                "situation_id": "sit_abc123",
                "user_id": "user_123",
                "habit_id": "habit_xyz789",
                "started_at": "2025-01-01",
                "ended_at": None,
                "observed_at": "2025-11-21T08:00:00Z",
                "confidence": 1.0,
                "source": "explicit"
            }
        }


class HasHabitContext(BaseModel):
    """
    Context properties for HAS_HABIT relationships (stored in Qdrant).

    Following ADR-0002: ALL descriptive/contextual properties in Qdrant.
    Temporal boundaries copied here for completeness.
    """
    # Context properties (stored in Qdrant ONLY)
    energy_level: Optional[Literal["low", "medium", "high"]] = None
    motivation_level: Optional[Literal["low", "medium", "high"]] = None
    difficulty_experienced: Optional[Literal["easy", "medium", "hard"]] = None
    time_of_day: Optional[str] = Field(None, description="morning, afternoon, evening, night")
    location: Optional[str] = None

    # Check-in notes
    notes: Optional[str] = None

    # Temporal boundaries (copied from Neo4j for completeness)
    started_at: str = Field(..., description="Habit start date ISO format")
    ended_at: Optional[str] = Field(None, description="Habit end date ISO format")

    # Flexible context factors (mood, check-in details, etc.)
    context: Dict[str, Any] = Field(default_factory=dict)
```

#### 2. HAS_HABIT Service (`packages/api/fidus/memory/services/has_habit_relationship_service.py`)

```python
from typing import Dict, Any, List, Optional
from uuid import uuid4, UUID
from datetime import datetime

from qdrant_client import QdrantClient
from neo4j import AsyncDriver

from fidus.memory.relationships.has_habit import HasHabitRelationship
from fidus.memory.entities.relationship import RelationshipContext


class HasHabitRelationshipService:
    """
    Service for managing HAS_HABIT relationships with Qdrant-First pattern.

    Pattern:
    1. Store context in Qdrant (PRIMARY)
    2. Create Neo4j relationship with situation_id reference (SECONDARY)
    3. Rollback Qdrant if Neo4j fails
    """

    def __init__(self, qdrant_client: QdrantClient, neo4j_driver: AsyncDriver):
        self.qdrant = qdrant_client
        self.neo4j = neo4j_driver
        self.collection_name = "situations"

    async def create_has_habit_relationship(
        self,
        tenant_id: str,
        user_id: str,
        habit_id: str,
        started_at: Optional[datetime] = None,
        ended_at: Optional[datetime] = None,
        energy_level: Optional[str] = None,
        motivation_level: Optional[str] = None,
        difficulty_experienced: Optional[str] = None,
        time_of_day: Optional[str] = None,
        location: Optional[str] = None,
        notes: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> HasHabitRelationship:
        """
        Create HAS_HABIT relationship with Qdrant-First pattern.

        Args:
            tenant_id: Tenant identifier
            user_id: User entity ID
            habit_id: Habit entity ID
            started_at: When habit tracking began (defaults to now)
            ended_at: When habit tracking ended (None = still active)
            energy_level: Energy level during check-in
            motivation_level: Motivation level
            difficulty_experienced: Difficulty level
            time_of_day: Time of day for check-in
            location: Location during check-in
            notes: Check-in notes
            context: Additional context factors

        Returns:
            HasHabitRelationship with situation_id populated
        """
        situation_id = f"sit_{uuid4().hex}"
        relationship_instance_id = uuid4()
        started_at = started_at or datetime.utcnow()

        # Build context payload
        context_data = RelationshipContext(
            tenant_id=tenant_id,
            user_id=user_id,
            entity_id=habit_id,
            relationship_type="HAS_HABIT",
            **(context or {})
        )

        # Step 1: Store in Qdrant (PRIMARY)
        try:
            embedding = await self._embed_context(context_data.dict())

            point = PointStruct(
                id=situation_id,
                vector=embedding,
                payload={
                    "situation_id": situation_id,
                    "tenant_id": tenant_id,
                    "user_id": user_id,
                    "entity_id": habit_id,
                    "relationship_type": "HAS_HABIT",
                    "relationship_instance_id": str(relationship_instance_id),
                    "energy_level": energy_level,
                    "motivation_level": motivation_level,
                    "difficulty_experienced": difficulty_experienced,
                    "time_of_day": time_of_day,
                    "location": location,
                    "notes": notes,
                    "started_at": started_at.isoformat(),
                    "ended_at": ended_at.isoformat() if ended_at else None,
                    "context": context or {},
                    "created_at": datetime.utcnow().isoformat()
                }
            )

            await self.qdrant.upsert(
                collection_name=self.collection_name,
                points=[point]
            )

            logger.info(f"Stored habit context in Qdrant: {situation_id}")

        except Exception as e:
            logger.error(f"Failed to store in Qdrant: {e}")
            raise RuntimeError(f"Qdrant storage failed: {e}")

        # Step 2: Create Neo4j relationship (SECONDARY)
        # Following ADR-0002: ONLY structural + temporal boundary properties
        try:
            query = """
            MATCH (u:User {id: $user_id, tenant_id: $tenant_id})
            MATCH (h:Habit {id: $habit_id, tenant_id: $tenant_id})
            CREATE (u)-[r:HAS_HABIT {
                relationship_instance_id: $rel_id,
                situation_id: $sit_id,
                started_at: date($started_at),
                ended_at: CASE WHEN $ended_at IS NOT NULL THEN date($ended_at) ELSE NULL END,
                observed_at: datetime(),
                confidence: $confidence,
                source: $source
            }]->(h)
            RETURN r
            """

            async with self.neo4j.session() as session:
                await session.run(
                    query,
                    tenant_id=tenant_id,
                    user_id=user_id,
                    habit_id=habit_id,
                    rel_id=str(relationship_instance_id),
                    sit_id=situation_id,
                    started_at=started_at.isoformat() if isinstance(started_at, datetime) else started_at.strftime('%Y-%m-%d'),
                    ended_at=ended_at.isoformat() if ended_at and isinstance(ended_at, datetime) else (ended_at.strftime('%Y-%m-%d') if ended_at else None),
                    confidence=1.0,
                    source="explicit"
                )

            logger.info(f"Created Neo4j HAS_HABIT: {relationship_instance_id}")

        except Exception as e:
            # Rollback: Delete from Qdrant
            logger.error(f"Neo4j failed, rolling back Qdrant: {e}")
            try:
                await self.qdrant.delete(
                    collection_name=self.collection_name,
                    points_selector=[situation_id]
                )
            except Exception as rollback_error:
                logger.error(f"Rollback failed: {rollback_error}")

            raise RuntimeError(f"Neo4j failed, rolled back Qdrant: {e}")

        # Return relationship model (structural + temporal properties only)
        # Context is stored in Qdrant and can be retrieved separately
        return HasHabitRelationship(
            relationship_instance_id=relationship_instance_id,
            situation_id=situation_id,
            user_id=user_id,
            habit_id=habit_id,
            started_at=started_at if isinstance(started_at, date) else started_at.date(),
            ended_at=ended_at.date() if ended_at and isinstance(ended_at, datetime) else ended_at,
            observed_at=datetime.utcnow(),
            confidence=1.0,
            source="explicit"
        )

    async def get_by_situation_id(
        self,
        situation_id: str,
        tenant_id: str
    ) -> Optional[Dict[str, Any]]:
        """Retrieve relationship context from Qdrant."""
        results = await self.qdrant.retrieve(
            collection_name=self.collection_name,
            ids=[situation_id]
        )

        if not results:
            return None

        point = results[0]
        if point.payload.get("tenant_id") != tenant_id:
            return None  # Tenant isolation

        return point.payload

    async def find_similar_contexts(
        self,
        user_id: str,
        tenant_id: str,
        habit_id: str,
        current_context: Dict[str, Any],
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Find similar habit check-in contexts.

        Args:
            user_id: User identifier
            tenant_id: Tenant identifier
            habit_id: Habit identifier
            current_context: Current context factors
            limit: Max results

        Returns:
            List of similar contexts with metadata
        """
        # Generate embedding for current context
        embedding = await self._generate_embedding_from_dict(current_context)

        # Search Qdrant
        results = await self.qdrant.search(
            collection_name=self.collection_name,
            query_vector=embedding,
            query_filter={
                "must": [
                    {"key": "tenant_id", "match": {"value": tenant_id}},
                    {"key": "user_id", "match": {"value": user_id}},
                    {"key": "entity_id", "match": {"value": habit_id}},
                    {"key": "relationship_type", "match": {"value": "HAS_HABIT"}}
                ]
            },
            limit=limit
        )

        return [
            {
                "situation_id": hit.id,
                "score": hit.score,
                "context": hit.payload
            }
            for hit in results
        ]

    async def get_active_habits(
        self,
        tenant_id: str,
        user_id: str
    ) -> List[HasHabitRelationship]:
        """
        Get user's active habits (HAS_HABIT with ended_at = NULL).

        Following ADR-0002: Returns structural + temporal properties.
        Use get_habit_context_history() to retrieve context from Qdrant.
        """
        query = """
        MATCH (u:User {id: $user_id, tenant_id: $tenant_id})-[r:HAS_HABIT]->(h:Habit)
        WHERE r.ended_at IS NULL
        RETURN r, h
        ORDER BY r.started_at DESC
        """

        async with self.neo4j.session() as session:
            result = await session.run(query, tenant_id=tenant_id, user_id=user_id)
            records = await result.data()

            habits = []
            for record in records:
                rel = record["r"]
                habits.append(HasHabitRelationship(
                    relationship_instance_id=rel["relationship_instance_id"],
                    situation_id=rel["situation_id"],
                    user_id=user_id,
                    habit_id=record["h"]["id"],
                    started_at=rel["started_at"],
                    ended_at=rel.get("ended_at"),
                    observed_at=rel["observed_at"],
                    confidence=rel["confidence"],
                    source=rel["source"]
                ))

            return habits

    async def get_habit_context_history(
        self,
        user_id: str,
        tenant_id: str,
        habit_id: str,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """
        Get historical contexts for a habit (last N check-ins).

        Following ADR-0002: Returns structural + temporal properties only.
        """
        query = """
        MATCH (u:User {id: $user_id, tenant_id: $tenant_id})-[r:HAS_HABIT]->(h:Habit {id: $habit_id})
        RETURN r.situation_id as situation_id
        ORDER BY r.observed_at DESC
        LIMIT $limit
        """

        async with self.neo4j.session() as session:
            result = await session.run(
                query,
                user_id=user_id,
                tenant_id=tenant_id,
                habit_id=habit_id,
                limit=limit
            )
            records = await result.data()

        # Retrieve contexts from Qdrant
        situation_ids = [record["situation_id"] for record in records if record.get("situation_id")]
        if not situation_ids:
            return []

        points = await self.qdrant.retrieve(
            collection_name=self.collection_name,
            ids=situation_ids
        )

        return [point.payload for point in points]

    async def get_habits_during_period(
        self,
        tenant_id: str,
        user_id: str,
        start_date: date,
        end_date: date
    ) -> List[Dict[str, Any]]:
        """
        Temporal Query Pattern (ADR-0002): Find habits tracked during a date range.

        This demonstrates WHY temporal boundaries are stored in Neo4j:
        Efficient date range queries without full Qdrant scan.

        Example: "Which habits was I tracking in January 2025?"
        """
        query = """
        MATCH (u:User {id: $user_id, tenant_id: $tenant_id})-[r:HAS_HABIT]->(h:Habit)
        WHERE r.started_at <= date($end_date)
          AND (r.ended_at IS NULL OR r.ended_at >= date($start_date))
        RETURN
            r.relationship_instance_id AS rel_id,
            r.situation_id AS sit_id,
            r.started_at AS started_at,
            r.ended_at AS ended_at,
            r.confidence AS confidence,
            h.id AS habit_id,
            h.name AS habit_name
        ORDER BY r.started_at DESC
        """

        async with self.neo4j.session() as session:
            result = await session.run(
                query,
                tenant_id=tenant_id,
                user_id=user_id,
                start_date=start_date.isoformat(),
                end_date=end_date.isoformat()
            )
            records = await result.data()

            # Fetch context from Qdrant for enrichment
            situation_ids = [r["sit_id"] for r in records]

            if not situation_ids:
                return []

            situations = await self.qdrant.scroll(
                collection_name=self.collection_name,
                scroll_filter=Filter(
                    must=[
                        FieldCondition(key="situation_id", match=MatchValue(value=situation_ids))
                    ]
                ),
                limit=len(situation_ids)
            )

            situation_map = {s.payload["situation_id"]: s.payload for s in situations[0]}

            # Combine Neo4j temporal data with Qdrant context
            enriched = []
            for record in records:
                sit_id = record["sit_id"]
                context = situation_map.get(sit_id, {})

                enriched.append({
                    "relationship_id": record["rel_id"],
                    "situation_id": sit_id,
                    "habit_id": record["habit_id"],
                    "habit_name": record["habit_name"],
                    "started_at": record["started_at"],
                    "ended_at": record["ended_at"],
                    "confidence": record["confidence"],
                    # Context from Qdrant
                    "energy_level": context.get("energy_level"),
                    "motivation_level": context.get("motivation_level"),
                    "difficulty_experienced": context.get("difficulty_experienced"),
                    "time_of_day": context.get("time_of_day"),
                    "location": context.get("location")
                })

            return enriched

    async def _embed_context(self, context: Dict[str, Any]) -> List[float]:
        """Generate embedding for context similarity search."""
        # Placeholder: integrate with LiteLLM
        import random
        return [random.random() for _ in range(1536)]
```

#### 3. ATTENDS Relationship Model (`packages/api/fidus/memory/relationships/attends.py`)

```python
from datetime import datetime, date
from typing import Optional, Literal, Dict, Any
from pydantic import BaseModel, Field

from fidus.memory.entities.relationship import RelationshipBase


class AttendsRelationship(RelationshipBase):
    """
    ATTENDS relationship connecting User to Event.

    Following ADR-0002: Temporal boundary (attended_at) in Neo4j.
    Context properties (attendance_status, mood, engagement) in Qdrant ONLY.
    """
    # Entity references (structural)
    user_id: str
    event_id: str = Field(..., description="ID of the Event entity")

    # Temporal boundary (ADR-0002: stored in Neo4j for efficient queries)
    attended_at: datetime = Field(..., description="When user attended the event")

    @property
    def attended_date(self) -> date:
        """Get attendance date (without time)."""
        return self.attended_at.date()

    class Config:
        json_schema_extra = {
            "example": {
                "relationship_instance_id": "550e8400-e29b-41d4-a716-446655440000",
                "situation_id": "sit_abc123",
                "user_id": "user_123",
                "event_id": "event_xyz789",
                "attended_at": "2025-11-21T14:00:00Z",
                "observed_at": "2025-11-21T14:00:00Z",
                "confidence": 1.0,
                "source": "explicit"
            }
        }


class AttendsContext(BaseModel):
    """
    Context properties for ATTENDS relationships (stored in Qdrant).

    Following ADR-0002: ALL descriptive/contextual properties in Qdrant.
    Temporal boundary copied here for completeness.
    """
    # Attendance status
    attendance_status: Literal["confirmed", "tentative", "declined", "attended"] = "confirmed"

    # Context properties (stored in Qdrant ONLY)
    mood_before: Optional[str] = None
    mood_after: Optional[str] = None
    energy_level: Optional[Literal["low", "medium", "high"]] = None
    engagement_level: Optional[Literal["low", "medium", "high"]] = None

    # Notes
    notes: Optional[str] = None
    key_takeaways: Optional[str] = None

    # Temporal boundary (copied from Neo4j for completeness)
    attended_at: str = Field(..., description="Event attendance datetime ISO format")

    # Flexible context factors (companions, activities, etc.)
    context: Dict[str, Any] = Field(default_factory=dict)
```

#### 4. ATTENDS Service (`packages/api/fidus/memory/services/attends_relationship_service.py`)

```python
from typing import Dict, Any, List, Optional
from uuid import uuid4
from datetime import datetime, date
import logging

from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, Filter, FieldCondition, MatchValue
from neo4j import AsyncDriver

from fidus.memory.relationships.attends import AttendsRelationship
from fidus.memory.entities.relationship import RelationshipContext

logger = logging.getLogger(__name__)


class AttendsRelationshipService:
    """
    Service for managing ATTENDS relationships following Qdrant-First pattern.

    Handles event attendance tracking and context analysis.
    """

    def __init__(self, qdrant: QdrantClient, neo4j: AsyncDriver):
        self.qdrant = qdrant
        self.neo4j = neo4j
        self.collection_name = "situations"

    async def create_attends_relationship(
        self,
        tenant_id: str,
        user_id: str,
        event_id: str,
        attended_at: Optional[datetime] = None,
        attendance_status: str = "attended",
        mood_before: Optional[str] = None,
        mood_after: Optional[str] = None,
        energy_level: Optional[str] = None,
        engagement_level: Optional[str] = None,
        notes: Optional[str] = None,
        key_takeaways: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> AttendsRelationship:
        """
        Create ATTENDS relationship with Qdrant-First pattern.

        Args:
            tenant_id: Tenant identifier
            user_id: User entity ID
            event_id: Event entity ID
            attended_at: When user attended the event (defaults to now)
            attendance_status: Attendance status
            mood_before: Mood before event
            mood_after: Mood after event
            energy_level: Energy level during/after event
            engagement_level: Engagement level
            notes: Notes about attendance
            key_takeaways: Key takeaways from event
            context: Additional context factors

        Returns:
            AttendsRelationship with situation_id populated
        """
        situation_id = f"sit_{uuid4().hex}"
        relationship_instance_id = uuid4()
        attended_at = attended_at or datetime.utcnow()

        # Build context payload
        context_data = RelationshipContext(
            tenant_id=tenant_id,
            user_id=user_id,
            entity_id=event_id,
            relationship_type="ATTENDS",
            **(context or {})
        )

        # Step 1: Store in Qdrant (PRIMARY)
        try:
            embedding = await self._embed_context(context_data.dict())

            point = PointStruct(
                id=situation_id,
                vector=embedding,
                payload={
                    "situation_id": situation_id,
                    "tenant_id": tenant_id,
                    "user_id": user_id,
                    "entity_id": event_id,
                    "relationship_type": "ATTENDS",
                    "relationship_instance_id": str(relationship_instance_id),
                    "attendance_status": attendance_status,
                    "mood_before": mood_before,
                    "mood_after": mood_after,
                    "energy_level": energy_level,
                    "engagement_level": engagement_level,
                    "notes": notes,
                    "key_takeaways": key_takeaways,
                    "attended_at": attended_at.isoformat(),
                    "context": context or {},
                    "created_at": datetime.utcnow().isoformat()
                }
            )

            await self.qdrant.upsert(
                collection_name=self.collection_name,
                points=[point]
            )

            logger.info(f"Stored event attendance context in Qdrant: {situation_id}")

        except Exception as e:
            logger.error(f"Qdrant storage failed: {e}")
            raise RuntimeError(f"Qdrant storage failed: {e}")

        # Step 2: Create Neo4j relationship (SECONDARY)
        # Following ADR-0002: ONLY structural + temporal boundary properties
        try:
            query = """
            MATCH (u:User {id: $user_id, tenant_id: $tenant_id})
            MATCH (e:Event {id: $event_id, tenant_id: $tenant_id})
            CREATE (u)-[r:ATTENDS {
                relationship_instance_id: $rel_id,
                situation_id: $sit_id,
                attended_at: datetime($attended_at),
                observed_at: datetime(),
                confidence: $confidence,
                source: $source
            }]->(e)
            RETURN r
            """

            async with self.neo4j.session() as session:
                await session.run(
                    query,
                    tenant_id=tenant_id,
                    user_id=user_id,
                    event_id=event_id,
                    rel_id=str(relationship_instance_id),
                    sit_id=situation_id,
                    attended_at=attended_at.isoformat(),
                    confidence=1.0,
                    source="explicit"
                )

            logger.info(f"Created Neo4j ATTENDS: {relationship_instance_id}")

        except Exception as e:
            # Rollback: Delete from Qdrant
            logger.error(f"Neo4j failed, rolling back Qdrant: {e}")
            try:
                await self.qdrant.delete(
                    collection_name=self.collection_name,
                    points_selector=[situation_id]
                )
            except Exception as rollback_error:
                logger.error(f"Rollback failed: {rollback_error}")

            raise RuntimeError(f"Neo4j failed, rolled back Qdrant: {e}")

        # Return relationship model (structural + temporal properties only)
        # Context is stored in Qdrant and can be retrieved separately
        return AttendsRelationship(
            relationship_instance_id=relationship_instance_id,
            situation_id=situation_id,
            user_id=user_id,
            event_id=event_id,
            attended_at=attended_at,
            observed_at=datetime.utcnow(),
            confidence=1.0,
            source="explicit"
        )

    async def get_event_attendance_history(
        self,
        user_id: str,
        tenant_id: str,
        event_id: str
    ) -> List[Dict[str, Any]]:
        """
        Get all attendance records for an event.

        Following ADR-0002: Returns structural + temporal properties.
        """
        query = """
        MATCH (u:User {id: $user_id, tenant_id: $tenant_id})-[r:ATTENDS]->(e:Event {id: $event_id})
        RETURN r.situation_id as situation_id
        ORDER BY r.attended_at DESC
        """

        async with self.neo4j.session() as session:
            result = await session.run(
                query,
                user_id=user_id,
                tenant_id=tenant_id,
                event_id=event_id
            )
            records = await result.data()

        situation_ids = [record["situation_id"] for record in records if record.get("situation_id")]
        if not situation_ids:
            return []

        points = await self.qdrant.retrieve(
            collection_name=self.collection_name,
            ids=situation_ids
        )

        return [point.payload for point in points]

    async def get_events_attended_during_period(
        self,
        tenant_id: str,
        user_id: str,
        start_date: date,
        end_date: date
    ) -> List[Dict[str, Any]]:
        """
        Temporal Query Pattern (ADR-0002): Find events attended during a date range.

        This demonstrates WHY temporal boundaries are stored in Neo4j:
        Efficient date range queries without full Qdrant scan.

        Example: "Which events did I attend in Q1 2025?"
        """
        query = """
        MATCH (u:User {id: $user_id, tenant_id: $tenant_id})-[r:ATTENDS]->(e:Event)
        WHERE date(r.attended_at) >= date($start_date)
          AND date(r.attended_at) <= date($end_date)
        RETURN
            r.relationship_instance_id AS rel_id,
            r.situation_id AS sit_id,
            r.attended_at AS attended_at,
            r.confidence AS confidence,
            e.id AS event_id,
            e.title AS event_title
        ORDER BY r.attended_at DESC
        """

        async with self.neo4j.session() as session:
            result = await session.run(
                query,
                tenant_id=tenant_id,
                user_id=user_id,
                start_date=start_date.isoformat(),
                end_date=end_date.isoformat()
            )
            records = await result.data()

            # Fetch context from Qdrant for enrichment
            situation_ids = [r["sit_id"] for r in records]

            if not situation_ids:
                return []

            situations = await self.qdrant.scroll(
                collection_name=self.collection_name,
                scroll_filter=Filter(
                    must=[
                        FieldCondition(key="situation_id", match=MatchValue(value=situation_ids))
                    ]
                ),
                limit=len(situation_ids)
            )

            situation_map = {s.payload["situation_id"]: s.payload for s in situations[0]}

            # Combine Neo4j temporal data with Qdrant context
            enriched = []
            for record in records:
                sit_id = record["sit_id"]
                context = situation_map.get(sit_id, {})

                enriched.append({
                    "relationship_id": record["rel_id"],
                    "situation_id": sit_id,
                    "event_id": record["event_id"],
                    "event_title": record["event_title"],
                    "attended_at": record["attended_at"],
                    "confidence": record["confidence"],
                    # Context from Qdrant
                    "attendance_status": context.get("attendance_status"),
                    "mood_before": context.get("mood_before"),
                    "mood_after": context.get("mood_after"),
                    "energy_level": context.get("energy_level"),
                    "engagement_level": context.get("engagement_level"),
                    "notes": context.get("notes"),
                    "key_takeaways": context.get("key_takeaways")
                })

            return enriched

    async def _embed_context(self, context: Dict[str, Any]) -> List[float]:
        """Generate embedding for context similarity search."""
        # Placeholder: integrate with LiteLLM
        import random
        return [random.random() for _ in range(1536)]
```

---

### API Implementation

**Files to Create:**

1. **`packages/api/fidus/memory/routes/has_habit_routes.py`**
2. **`packages/api/fidus/memory/routes/attends_routes.py`**

**Endpoints to Implement:**

**HAS_HABIT:**
1. `POST /api/memory/relationships/has-habit` - Create relationship
2. `GET /api/memory/relationships/has-habit/{rel_id}` - Get relationship
3. `GET /api/memory/relationships/has-habit/habit/{habit_id}/history` - Get context history
4. `GET /api/memory/relationships/has-habit/similar?habit_id={id}` - Find similar contexts

**ATTENDS:**
1. `POST /api/memory/relationships/attends` - Create relationship
2. `GET /api/memory/relationships/attends/{rel_id}` - Get relationship
3. `GET /api/memory/relationships/attends/event/{event_id}/history` - Get attendance history

**Implementation Example:**

```python
# packages/api/fidus/memory/routes/has_habit_routes.py

from fastapi import APIRouter, Depends, HTTPException
from typing import List
from uuid import UUID

from fidus.memory.relationships.has_habit import HasHabitRelationship
from fidus.memory.services.has_habit_relationship_service import HasHabitRelationshipService
from fidus.dependencies import get_has_habit_service, get_current_user


router = APIRouter(prefix="/api/memory/relationships/has-habit", tags=["relationships"])


@router.post("/", response_model=HasHabitRelationship)
async def create_has_habit(
    relationship: HasHabitRelationship,
    service: HasHabitRelationshipService = Depends(get_has_habit_service),
    current_user: dict = Depends(get_current_user)
):
    """Create HAS_HABIT relationship with context."""
    return await service.create(
        user_id=current_user["user_id"],
        tenant_id=current_user["tenant_id"],
        relationship=relationship
    )


@router.get("/habit/{habit_id}/history")
async def get_habit_context_history(
    habit_id: str,
    limit: int = 50,
    service: HasHabitRelationshipService = Depends(get_has_habit_service),
    current_user: dict = Depends(get_current_user)
):
    """Get context history for a habit."""
    return await service.get_habit_context_history(
        user_id=current_user["user_id"],
        tenant_id=current_user["tenant_id"],
        habit_id=habit_id,
        limit=limit
    )
```

---

### Frontend Implementation

**Components to Modify:**

1. **`packages/web/src/components/memory/HabitCard.tsx`**
   - Add context display on hover or in detail view
   - Show energy/motivation levels with icons

2. **`packages/web/src/components/memory/EventModal.tsx`**
   - Add attendance context section
   - Display mood before/after, engagement level

**Implementation Example:**

```typescript
// Update HabitCard to show context on hover

<Card onMouseEnter={() => setShowContext(true)} onMouseLeave={() => setShowContext(false)}>
  {showContext && (
    <div className="absolute top-0 right-0 p-2 bg-white shadow-lg rounded">
      <p className="text-xs">Energy: {context.energy_level}</p>
      <p className="text-xs">Motivation: {context.motivation_level}</p>
      <p className="text-xs">Time: {context.time_of_day}</p>
    </div>
  )}
</Card>
```

---

### Testing Requirements

**Integration Tests:**

```python
# packages/api/tests/integration/memory/test_has_habit_service.py

@pytest.mark.asyncio
async def test_create_has_habit_with_context():
    """Test creating HAS_HABIT relationship with Qdrant-First pattern."""
    service = HasHabitRelationshipService(qdrant_client, neo4j_driver)

    relationship = HasHabitRelationship(
        habit_id="habit_123",
        energy_level="high",
        motivation_level="high",
        time_of_day="morning",
        location="home"
    )

    result = await service.create(
        user_id="user_456",
        tenant_id="tenant_789",
        relationship=relationship
    )

    assert result.situation_id is not None

    # Verify Qdrant
    context = await service.get_by_situation_id(result.situation_id, "tenant_789")
    assert context["ai_properties"]["energy_level"] == "high"


@pytest.mark.asyncio
async def test_rollback_on_neo4j_failure():
    """Test Qdrant rollback when Neo4j fails."""
    # Mock Neo4j to fail
    # Verify Qdrant point is deleted
    pass
```

---

## Implementation Guidelines

### Must Follow

1. **ADR-0002 Compliance (CRITICAL):**
   - **HAS_HABIT Neo4j properties:** relationship_instance_id, situation_id, started_at, ended_at, observed_at, confidence, source
   - **HAS_HABIT Qdrant context:** energy_level, motivation_level, difficulty_experienced, time_of_day, location, notes, plus flexible context dictionary
   - **ATTENDS Neo4j properties:** relationship_instance_id, situation_id, attended_at, observed_at, confidence, source
   - **ATTENDS Qdrant context:** attendance_status, mood_before, mood_after, energy_level, engagement_level, notes, key_takeaways, plus flexible context dictionary
   - **Temporal boundaries enable efficient date range queries** without full Qdrant scan

2. **Qdrant-First Pattern:**
   - Store context in Qdrant BEFORE Neo4j
   - Neo4j stores ONLY structural + temporal boundary properties
   - Rollback Qdrant if Neo4j fails

3. **Feature Flags:**
   - `ENABLE_HAS_HABIT_RELATIONSHIP` - default disabled
   - `ENABLE_ATTENDS_RELATIONSHIP` - default disabled

4. **Multi-Tenancy:**
   - Filter all Qdrant queries by tenant_id
   - Verify tenant in Neo4j queries

5. **Temporal Integrity:**
   - Validate `started_at <= ended_at` for HAS_HABIT (if both provided)
   - Ensure `attended_at` is not in future for ATTENDS

### Must NOT Do

- ❌ Store context properties (energy_level, motivation_level, mood, etc.) in Neo4j
- ❌ Store only temporal boundaries in Qdrant without context
- ❌ Allow `started_at` or `attended_at` in future
- ❌ Allow `ended_at` before `started_at` for HAS_HABIT
- ❌ Skip rollback on Neo4j failure
- ❌ Create relationships without temporal boundaries

---

## Success Criteria

1. ✅ HAS_HABIT relationship with ADR-0002 compliant property placement
2. ✅ HAS_HABIT temporal boundaries (started_at, ended_at) enable date range queries
3. ✅ ATTENDS relationship with ADR-0002 compliant property placement
4. ✅ ATTENDS temporal boundary (attended_at) enables date range queries
5. ✅ Context properties stored exclusively in Qdrant, retrieved via situation_id
6. ✅ Temporal query methods demonstrate efficient Neo4j date filtering
7. ✅ Context displayed in UI from Qdrant enrichment
8. ✅ All tests pass (unit, integration, E2E)
9. ✅ Documentation updated with ADR-0002 references

---

**Prompt Version:** 1.0
**Generated:** 2025-11-21
**Target Package:** 4.3

---

**END OF IMPLEMENTATION PROMPT**

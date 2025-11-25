# Implementation Prompt: 4.2 - Event Entity with Calendar UI

**Package:** 4.2
**Epic:** Extended Entities & Orchestration
**Priority:** 🟡 MEDIUM
**Context Document:** `/docs/prototypes/fidus-memory/migration-v3-wbs.md` (Lines 892-938)

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
- **Property Placement (ADR-0002):** Neo4j stores structural + temporal boundaries, Qdrant stores ALL context
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
- ❌ No Event entity exists
- ❌ No event tracking or calendar functionality

**Migration Goal:**
- Implement Event entity for tracking past and upcoming events
- Build date range query functionality for calendar views
- Create LLM extractor to identify events from conversations
- Build calendar UI with month/week/day views
- Enable users to manage events and view them in context
- Prepare foundation for ATTENDS relationship in Package 4.3

**Architecture References:**
- Solution Architecture: `/docs/solution-architecture/15-entity-management.md`
- Domain Model: `/docs/domain-model/entity-model.md`
- ADR-0001: `/docs/adr/ADR-0001-situational-context-as-relationship-qualifier.md` (Qdrant-First Pattern)
- ADR-0002: `/docs/adr/ADR-0002-property-placement-and-geospatial-exception.md` (Property Placement Strategy)
- WBS: `/docs/prototypes/fidus-memory/migration-v3-wbs.md#package-42`

---

## Your Task

Implement **Event Entity with Calendar UI** according to the specifications below.

**User Story:**
As a user, I want to track upcoming events and past events the system learned from conversations.

**Acceptance Criteria:**
1. Backend: Event entity model with ADR-0002 compliant property placement
2. Backend: Neo4j stores ONLY structural + temporal properties (id, tenant_id, user_id, start_time, end_time, created_at, updated_at)
3. Backend: Qdrant stores ALL context properties (title, description, location, participants, event_type, status, ai_properties)
4. Backend: Temporal boundaries (start_time, end_time) enable efficient "events during period X" queries
5. Backend: EventRepository with date range queries functional
6. Backend: LLM event extractor operational with Qdrant-First pattern
7. API: Event CRUD endpoints responding correctly
8. Frontend: Calendar view with month/week/day switching
9. Frontend: Event detail modal displaying all information
10. Tests: Extract "Meeting next Tuesday at 2pm" from conversation - all passing
11. Tests: 1-Hop Query Pattern (Qdrant similarity → Neo4j temporal filter → Context enrichment) verified
12. Documentation: Event tracking guide created with ADR-0002 references

---

## Technical Specification

### Backend Implementation

**Files to Create:**

1. **`packages/api/fidus/memory/entities/event.py`**
   - Purpose: Event entity model with time-based properties
   - Contains: Core properties, datetime validation, participant list

2. **`packages/api/fidus/memory/repositories/event_repository.py`**
   - Purpose: Data access layer for events
   - Contains: CRUD operations, date range queries, upcoming events

3. **`packages/api/fidus/memory/services/event_extractor.py`**
   - Purpose: LLM-based event extraction from conversations
   - Contains: Prompt engineering for identifying events, date parsing

**Detailed Implementation:**

#### 1. Event Entity Model (`packages/api/fidus/memory/entities/event.py`)

```python
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional, Literal
from uuid import UUID, uuid4
from pydantic import BaseModel, Field, validator


class EventParticipant(BaseModel):
    """Event participant information."""
    person_id: Optional[str] = None
    name: str
    role: Optional[str] = Field(None, description="Role in event: organizer, attendee, speaker")
    status: Literal["confirmed", "tentative", "declined"] = "confirmed"


class Event(BaseModel):
    """
    Event entity for tracking past and upcoming events.

    Following ADR-0002: Neo4j stores ONLY structural + temporal boundary properties.
    All context (title, description, participants, etc.) stored in Qdrant.
    """
    # Structural properties (Neo4j + Qdrant)
    id: UUID = Field(default_factory=uuid4)
    tenant_id: str
    user_id: str

    # Temporal boundaries (ADR-0002: stored in Neo4j for efficient queries)
    start_time: datetime
    end_time: datetime

    # Metadata (structural)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @validator('end_time')
    def validate_end_time(cls, v, values):
        """Ensure end_time is after start_time."""
        if 'start_time' in values and v <= values['start_time']:
            raise ValueError('end_time must be after start_time')
        return v

    @property
    def duration_minutes(self) -> int:
        """Calculate event duration in minutes."""
        delta = self.end_time - self.start_time
        return int(delta.total_seconds() / 60)

    @property
    def is_upcoming(self) -> bool:
        """Check if event is in the future."""
        return self.start_time > datetime.utcnow()

    @property
    def is_past(self) -> bool:
        """Check if event has already occurred."""
        return self.end_time < datetime.utcnow()

    @property
    def is_ongoing(self) -> bool:
        """Check if event is currently happening."""
        now = datetime.utcnow()
        return self.start_time <= now <= self.end_time

    @property
    def time_until_start(self) -> Optional[timedelta]:
        """Time until event starts (None if already started)."""
        if self.is_upcoming:
            return self.start_time - datetime.utcnow()
        return None

    class Config:
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "tenant_id": "tenant_123",
                "user_id": "user_456",
                "start_time": "2025-11-21T09:00:00Z",
                "end_time": "2025-11-21T09:30:00Z",
                "created_at": "2025-11-21T08:00:00Z",
                "updated_at": "2025-11-21T08:00:00Z"
            }
        }


class EventContext(BaseModel):
    """
    Context properties for Event entities (stored in Qdrant ONLY).

    Following ADR-0002: ALL descriptive/contextual properties in Qdrant.
    Temporal boundaries copied here for completeness.
    """
    # Core context
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    all_day: bool = Field(default=False, description="All-day event flag")

    # Location and participants
    location: Optional[str] = None
    location_id: Optional[str] = Field(None, description="Reference to Location entity")
    participants: List[EventParticipant] = Field(default_factory=list)

    # Event type and status
    event_type: Optional[str] = Field(
        None,
        description="Type: meeting, conference, social, personal, etc."
    )
    status: Literal["scheduled", "completed", "cancelled"] = "scheduled"

    # Recurrence (simple implementation)
    is_recurring: bool = False
    recurrence_rule: Optional[str] = Field(
        None,
        description="RRULE format for recurring events"
    )

    # Temporal boundaries (copied from Neo4j for completeness)
    start_time: str = Field(..., description="Event start time ISO format")
    end_time: str = Field(..., description="Event end time ISO format")

    # AI-discovered properties
    ai_properties: Dict[str, Any] = Field(default_factory=dict)

    # Flexible context factors
    context: Dict[str, Any] = Field(default_factory=dict)

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Team Standup",
                "description": "Daily standup meeting",
                "start_time": "2025-11-21T09:00:00Z",
                "end_time": "2025-11-21T09:30:00Z",
                "all_day": False,
                "location": "Conference Room A",
                "participants": [
                    {
                        "name": "Anna Schmidt",
                        "role": "attendee",
                        "status": "confirmed"
                    }
                ],
                "event_type": "meeting",
                "status": "scheduled",
                "ai_properties": {
                    "extracted_from": "chat",
                    "confidence": 0.95
                },
                "context": {
                    "mood": "productive",
                    "importance": "high"
                }
            }
        }
```

#### 2. Event Repository (`packages/api/fidus/memory/repositories/event_repository.py`)

```python
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from uuid import UUID, uuid4
import logging

from neo4j import AsyncDriver
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, Filter, FieldCondition, MatchValue

from fidus.memory.entities.event import Event, EventContext

logger = logging.getLogger(__name__)


class EventRepository:
    """
    Repository for managing Event entities following Qdrant-First pattern (ADR-0002).

    Neo4j: Stores ONLY structural + temporal boundary properties
    Qdrant: Stores ALL context (title, description, participants, location, etc.)
    """

    def __init__(self, qdrant: QdrantClient, neo4j_driver: AsyncDriver):
        self.qdrant = qdrant
        self.driver = neo4j_driver
        self.collection_name = "events"

    async def create(
        self,
        event: Event,
        context: EventContext
    ) -> tuple[Event, str]:
        """
        Create event with Qdrant-First pattern.

        Following ADR-0002:
        1. Store context in Qdrant (PRIMARY)
        2. Store structural + temporal in Neo4j (SECONDARY)

        Returns:
            (Event, event_context_id): Event model and Qdrant point ID
        """
        event_context_id = f"evt_{uuid4().hex}"

        # Step 1: Store in Qdrant (PRIMARY)
        try:
            embedding = await self._embed_context(context.dict())

            point = PointStruct(
                id=event_context_id,
                vector=embedding,
                payload={
                    "event_context_id": event_context_id,
                    "event_id": str(event.id),
                    "tenant_id": event.tenant_id,
                    "user_id": event.user_id,
                    "title": context.title,
                    "description": context.description,
                    "all_day": context.all_day,
                    "location": context.location,
                    "location_id": context.location_id,
                    "participants": [p.dict() for p in context.participants],
                    "event_type": context.event_type,
                    "status": context.status,
                    "is_recurring": context.is_recurring,
                    "recurrence_rule": context.recurrence_rule,
                    "start_time": context.start_time,
                    "end_time": context.end_time,
                    "ai_properties": context.ai_properties,
                    "context": context.context,
                    "created_at": datetime.utcnow().isoformat()
                }
            )

            await self.qdrant.upsert(
                collection_name=self.collection_name,
                points=[point]
            )

            logger.info(f"Stored event context in Qdrant: {event_context_id}")

        except Exception as e:
            logger.error(f"Failed to store in Qdrant: {e}")
            raise RuntimeError(f"Qdrant storage failed: {e}")

        # Step 2: Create Neo4j node (SECONDARY)
        # Following ADR-0002: ONLY structural + temporal boundary properties
        try:
            query = """
            CREATE (e:Event {
                id: $id,
                tenant_id: $tenant_id,
                user_id: $user_id,
                event_context_id: $event_context_id,
                start_time: datetime($start_time),
                end_time: datetime($end_time),
                created_at: datetime($created_at),
                updated_at: datetime($updated_at)
            })
            RETURN e
            """

            async with self.driver.session() as session:
                await session.run(
                    query,
                    id=str(event.id),
                    tenant_id=event.tenant_id,
                    user_id=event.user_id,
                    event_context_id=event_context_id,
                    start_time=event.start_time.isoformat(),
                    end_time=event.end_time.isoformat(),
                    created_at=event.created_at.isoformat(),
                    updated_at=event.updated_at.isoformat()
                )

            logger.info(f"Created Neo4j Event: {event.id}")

        except Exception as e:
            # Rollback: Delete from Qdrant
            logger.error(f"Neo4j failed, rolling back Qdrant: {e}")
            try:
                await self.qdrant.delete(
                    collection_name=self.collection_name,
                    points_selector=[event_context_id]
                )
            except Exception as rollback_error:
                logger.error(f"Rollback failed: {rollback_error}")

            raise RuntimeError(f"Neo4j failed, rolled back Qdrant: {e}")

        return event, event_context_id

    async def get(
        self,
        event_id: UUID,
        tenant_id: str
    ) -> Optional[Dict[str, Any]]:
        """
        Get event with context enrichment (1-Hop Query Pattern).

        Following ADR-0002:
        1. Query Neo4j for structural + temporal (FAST)
        2. Fetch context from Qdrant using event_context_id
        3. Merge and return complete event

        Returns:
            Dict with Event + EventContext merged
        """
        # Step 1: Get structural data from Neo4j
        query = """
        MATCH (e:Event {id: $id, tenant_id: $tenant_id})
        RETURN e
        """

        async with self.driver.session() as session:
            result = await session.run(query, id=str(event_id), tenant_id=tenant_id)
            record = await result.single()

            if not record:
                return None

            node = record["e"]
            event_context_id = node["event_context_id"]

        # Step 2: Get context from Qdrant
        context_result = await self.qdrant.scroll(
            collection_name=self.collection_name,
            scroll_filter=Filter(
                must=[
                    FieldCondition(
                        key="event_context_id",
                        match=MatchValue(value=event_context_id)
                    )
                ]
            ),
            limit=1
        )

        if not context_result[0]:
            logger.warning(f"Event {event_id} has no context in Qdrant")
            return None

        context_payload = context_result[0][0].payload

        # Step 3: Merge structural + context
        return {
            # From Neo4j (structural + temporal)
            "id": node["id"],
            "tenant_id": node["tenant_id"],
            "user_id": node["user_id"],
            "start_time": node["start_time"],
            "end_time": node["end_time"],
            "created_at": node["created_at"],
            "updated_at": node["updated_at"],
            # From Qdrant (context)
            "title": context_payload.get("title"),
            "description": context_payload.get("description"),
            "all_day": context_payload.get("all_day"),
            "location": context_payload.get("location"),
            "location_id": context_payload.get("location_id"),
            "participants": context_payload.get("participants", []),
            "event_type": context_payload.get("event_type"),
            "status": context_payload.get("status"),
            "is_recurring": context_payload.get("is_recurring", False),
            "recurrence_rule": context_payload.get("recurrence_rule"),
            "ai_properties": context_payload.get("ai_properties", {}),
            "context": context_payload.get("context", {})
        }

    async def update(
        self,
        event: Event,
        context: EventContext
    ) -> tuple[Event, str]:
        """
        Update event with Qdrant-First pattern.

        Updates both Qdrant context and Neo4j structural data.
        """
        event.updated_at = datetime.utcnow()

        # Get event_context_id from Neo4j
        query = """
        MATCH (e:Event {id: $id, tenant_id: $tenant_id})
        RETURN e.event_context_id as event_context_id
        """

        async with self.driver.session() as session:
            result = await session.run(
                query,
                id=str(event.id),
                tenant_id=event.tenant_id
            )
            record = await result.single()
            if not record:
                raise ValueError(f"Event {event.id} not found")

            event_context_id = record["event_context_id"]

        # Update Qdrant context
        embedding = await self._embed_context(context.dict())

        point = PointStruct(
            id=event_context_id,
            vector=embedding,
            payload={
                "event_context_id": event_context_id,
                "event_id": str(event.id),
                "tenant_id": event.tenant_id,
                "user_id": event.user_id,
                "title": context.title,
                "description": context.description,
                "all_day": context.all_day,
                "location": context.location,
                "location_id": context.location_id,
                "participants": [p.dict() for p in context.participants],
                "event_type": context.event_type,
                "status": context.status,
                "is_recurring": context.is_recurring,
                "recurrence_rule": context.recurrence_rule,
                "start_time": context.start_time,
                "end_time": context.end_time,
                "ai_properties": context.ai_properties,
                "context": context.context,
                "updated_at": datetime.utcnow().isoformat()
            }
        )

        await self.qdrant.upsert(
            collection_name=self.collection_name,
            points=[point]
        )

        # Update Neo4j structural + temporal
        update_query = """
        MATCH (e:Event {id: $id, tenant_id: $tenant_id})
        SET e.start_time = datetime($start_time),
            e.end_time = datetime($end_time),
            e.updated_at = datetime($updated_at)
        RETURN e
        """

        async with self.driver.session() as session:
            await session.run(
                update_query,
                id=str(event.id),
                tenant_id=event.tenant_id,
                start_time=event.start_time.isoformat(),
                end_time=event.end_time.isoformat(),
                updated_at=event.updated_at.isoformat()
            )

        return event, event_context_id

    async def delete(self, event_id: UUID, tenant_id: str) -> bool:
        """
        Delete event from both Qdrant and Neo4j.

        Following ADR-0002: Delete from Qdrant first, then Neo4j.
        """
        # Get event_context_id first
        query = """
        MATCH (e:Event {id: $id, tenant_id: $tenant_id})
        RETURN e.event_context_id as event_context_id
        """

        async with self.driver.session() as session:
            result = await session.run(query, id=str(event_id), tenant_id=tenant_id)
            record = await result.single()

            if not record:
                return False

            event_context_id = record["event_context_id"]

        # Delete from Qdrant
        try:
            await self.qdrant.delete(
                collection_name=self.collection_name,
                points_selector=[event_context_id]
            )
        except Exception as e:
            logger.error(f"Failed to delete from Qdrant: {e}")

        # Delete from Neo4j
        delete_query = """
        MATCH (e:Event {id: $id, tenant_id: $tenant_id})
        DETACH DELETE e
        RETURN count(e) as deleted
        """

        async with self.driver.session() as session:
            result = await session.run(delete_query, id=str(event_id), tenant_id=tenant_id)
            record = await result.single()
            return record["deleted"] > 0

    async def get_events_in_range(
        self,
        user_id: str,
        tenant_id: str,
        start_date: datetime,
        end_date: datetime
    ) -> List[Dict[str, Any]]:
        """
        Temporal Query Pattern (ADR-0002): Get events in date range with context enrichment.

        This demonstrates WHY temporal boundaries are stored in Neo4j:
        Efficient date range queries without full Qdrant scan.

        1-Hop Query Pattern:
        1. Neo4j: Fast temporal filter (indexed start_time/end_time)
        2. Qdrant: Batch fetch contexts by event_context_ids
        3. Merge: Combine structural + context data

        Example: "Show all events in November 2025"
        """
        # Step 1: Query Neo4j for temporal boundaries (FAST)
        query = """
        MATCH (e:Event {user_id: $user_id, tenant_id: $tenant_id})
        WHERE datetime($start_date) <= e.start_time <= datetime($end_date)
        RETURN
            e.id AS event_id,
            e.event_context_id AS event_context_id,
            e.start_time AS start_time,
            e.end_time AS end_time,
            e.created_at AS created_at,
            e.updated_at AS updated_at
        ORDER BY e.start_time ASC
        """

        async with self.driver.session() as session:
            result = await session.run(
                query,
                user_id=user_id,
                tenant_id=tenant_id,
                start_date=start_date.isoformat(),
                end_date=end_date.isoformat()
            )
            records = await result.data()

        if not records:
            return []

        # Step 2: Batch fetch contexts from Qdrant
        event_context_ids = [r["event_context_id"] for r in records]

        contexts_result = await self.qdrant.scroll(
            collection_name=self.collection_name,
            scroll_filter=Filter(
                must=[
                    FieldCondition(
                        key="event_context_id",
                        match=MatchValue(value=event_context_ids)
                    )
                ]
            ),
            limit=len(event_context_ids)
        )

        context_map = {
            ctx.payload["event_context_id"]: ctx.payload
            for ctx in contexts_result[0]
        }

        # Step 3: Merge structural + context
        enriched_events = []
        for record in records:
            ctx_id = record["event_context_id"]
            context = context_map.get(ctx_id, {})

            enriched_events.append({
                # From Neo4j (structural + temporal)
                "id": record["event_id"],
                "start_time": record["start_time"],
                "end_time": record["end_time"],
                "created_at": record["created_at"],
                "updated_at": record["updated_at"],
                # From Qdrant (context)
                "title": context.get("title"),
                "description": context.get("description"),
                "all_day": context.get("all_day"),
                "location": context.get("location"),
                "participants": context.get("participants", []),
                "event_type": context.get("event_type"),
                "status": context.get("status"),
                "context": context.get("context", {})
            })

        return enriched_events

    async def get_upcoming_events(
        self,
        user_id: str,
        tenant_id: str,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Get upcoming events with context enrichment.

        Uses temporal boundary query (start_time > now) in Neo4j.
        """
        now = datetime.utcnow()

        query = """
        MATCH (e:Event {user_id: $user_id, tenant_id: $tenant_id})
        WHERE e.start_time > datetime($now)
        RETURN
            e.id AS event_id,
            e.event_context_id AS event_context_id,
            e.start_time AS start_time,
            e.end_time AS end_time
        ORDER BY e.start_time ASC
        LIMIT $limit
        """

        async with self.driver.session() as session:
            result = await session.run(
                query,
                user_id=user_id,
                tenant_id=tenant_id,
                now=now.isoformat(),
                limit=limit
            )
            records = await result.data()

        if not records:
            return []

        # Fetch contexts from Qdrant
        event_context_ids = [r["event_context_id"] for r in records]

        contexts_result = await self.qdrant.scroll(
            collection_name=self.collection_name,
            scroll_filter=Filter(
                must=[
                    FieldCondition(
                        key="event_context_id",
                        match=MatchValue(value=event_context_ids)
                    )
                ]
            ),
            limit=len(event_context_ids)
        )

        context_map = {
            ctx.payload["event_context_id"]: ctx.payload
            for ctx in contexts_result[0]
        }

        # Merge results
        enriched_events = []
        for record in records:
            ctx_id = record["event_context_id"]
            context = context_map.get(ctx_id, {})

            enriched_events.append({
                "id": record["event_id"],
                "start_time": record["start_time"],
                "end_time": record["end_time"],
                "title": context.get("title"),
                "location": context.get("location"),
                "event_type": context.get("event_type")
            })

        return enriched_events

    async def find_overlapping_events(
        self,
        user_id: str,
        tenant_id: str,
        start_time: datetime,
        end_time: datetime
    ) -> List[Dict[str, Any]]:
        """
        Find events that overlap with a given time range.

        Useful for conflict detection.
        Uses temporal boundaries in Neo4j for efficient query.
        """
        query = """
        MATCH (e:Event {user_id: $user_id, tenant_id: $tenant_id})
        WHERE e.start_time < datetime($end_time)
          AND e.end_time > datetime($start_time)
        RETURN
            e.id AS event_id,
            e.event_context_id AS event_context_id,
            e.start_time AS start_time,
            e.end_time AS end_time
        ORDER BY e.start_time ASC
        """

        async with self.driver.session() as session:
            result = await session.run(
                query,
                user_id=user_id,
                tenant_id=tenant_id,
                start_time=start_time.isoformat(),
                end_time=end_time.isoformat()
            )
            records = await result.data()

        if not records:
            return []

        # Fetch contexts
        event_context_ids = [r["event_context_id"] for r in records]

        contexts_result = await self.qdrant.scroll(
            collection_name=self.collection_name,
            scroll_filter=Filter(
                must=[
                    FieldCondition(
                        key="event_context_id",
                        match=MatchValue(value=event_context_ids)
                    )
                ]
            ),
            limit=len(event_context_ids)
        )

        context_map = {
            ctx.payload["event_context_id"]: ctx.payload
            for ctx in contexts_result[0]
        }

        # Merge
        enriched_events = []
        for record in records:
            ctx_id = record["event_context_id"]
            context = context_map.get(ctx_id, {})

            enriched_events.append({
                "id": record["event_id"],
                "start_time": record["start_time"],
                "end_time": record["end_time"],
                "title": context.get("title"),
                "location": context.get("location")
            })

        return enriched_events

    async def _embed_context(self, context: Dict[str, Any]) -> List[float]:
        """Generate embedding for context similarity search."""
        # Placeholder: integrate with LiteLLM
        import random
        return [random.random() for _ in range(1536)]
```

#### 3. Event Extractor Service (`packages/api/fidus/memory/services/event_extractor.py`)

```python
from typing import Optional
from datetime import datetime
import dateparser
from fidus.memory.entities.event import Event, EventParticipant
from fidus.llm.client import LLMClient


class EventExtractor:
    """
    Extract events from natural language using LLM.
    """

    def __init__(self, llm_client: LLMClient):
        self.llm = llm_client

    async def extract(
        self,
        text: str,
        user_id: str,
        tenant_id: str
    ) -> Optional[Event]:
        """
        Extract event information from text.

        Args:
            text: User's message
            user_id: User identifier
            tenant_id: Tenant identifier

        Returns:
            Event entity if detected, None otherwise
        """
        prompt = f"""
        Extract event information from the following text.

        Text: "{text}"
        Current date and time: {datetime.utcnow().isoformat()}

        If the text describes an event (meeting, appointment, conference, etc.),
        extract the following:
        - title (required): Brief title of the event
        - description (optional): Additional details
        - start_time (required): When the event starts (ISO format)
        - end_time (optional): When the event ends (ISO format, default to start + 1 hour)
        - all_day (boolean): Is this an all-day event?
        - location (optional): Where the event takes place
        - participants (optional): List of participant names
        - event_type: "meeting", "conference", "social", "personal", or other

        Parse relative dates like "next Tuesday", "tomorrow at 2pm", "in 3 days".

        Return JSON format:
        {{
            "title": "...",
            "description": "...",
            "start_time": "2025-11-21T14:00:00Z",
            "end_time": "2025-11-21T15:00:00Z",
            "all_day": false,
            "location": "...",
            "participants": ["Name 1", "Name 2"],
            "event_type": "meeting"
        }}

        If no event is detected, return: {{"detected": false}}
        """

        response = await self.llm.generate_structured(
            prompt=prompt,
            schema={
                "type": "object",
                "properties": {
                    "detected": {"type": "boolean"},
                    "title": {"type": "string"},
                    "description": {"type": "string"},
                    "start_time": {"type": "string", "format": "date-time"},
                    "end_time": {"type": "string", "format": "date-time"},
                    "all_day": {"type": "boolean"},
                    "location": {"type": "string"},
                    "participants": {
                        "type": "array",
                        "items": {"type": "string"}
                    },
                    "event_type": {"type": "string"}
                },
                "required": ["detected"]
            }
        )

        if not response.get("detected", False):
            return None

        # Parse datetimes
        start_time = self._parse_datetime(response["start_time"])
        end_time = response.get("end_time")
        if end_time:
            end_time = self._parse_datetime(end_time)
        else:
            # Default to 1 hour after start
            from datetime import timedelta
            end_time = start_time + timedelta(hours=1)

        # Build participants list
        participants = [
            EventParticipant(name=name)
            for name in response.get("participants", [])
        ]

        return Event(
            tenant_id=tenant_id,
            user_id=user_id,
            title=response["title"],
            description=response.get("description"),
            start_time=start_time,
            end_time=end_time,
            all_day=response.get("all_day", False),
            location=response.get("location"),
            participants=participants,
            event_type=response.get("event_type", "personal"),
            ai_properties={
                "extracted_from": "chat",
                "confidence": 0.9,
                "original_text": text
            }
        )

    def _parse_datetime(self, datetime_str: str) -> datetime:
        """
        Parse datetime string (ISO or natural language).

        Args:
            datetime_str: Datetime string to parse

        Returns:
            Parsed datetime object
        """
        # Try ISO format first
        try:
            return datetime.fromisoformat(datetime_str.replace('Z', '+00:00'))
        except ValueError:
            pass

        # Try natural language parsing with dateparser
        parsed = dateparser.parse(
            datetime_str,
            settings={'TIMEZONE': 'UTC', 'RETURN_AS_TIMEZONE_AWARE': False}
        )

        if parsed is None:
            raise ValueError(f"Could not parse datetime: {datetime_str}")

        return parsed
```

---

### API Implementation

**Files to Create:**

1. **`packages/api/fidus/memory/routes/event_routes.py`**
   - Purpose: FastAPI router for event endpoints
   - Contains: CRUD operations + date range queries

**Endpoints to Implement:**

1. `POST /api/memory/entities/event` - Create new event
2. `GET /api/memory/entities/event/{event_id}` - Get event by ID
3. `PUT /api/memory/entities/event/{event_id}` - Update event
4. `DELETE /api/memory/entities/event/{event_id}` - Delete event
5. `GET /api/memory/entities/event?user_id={id}&start={date}&end={date}` - List events in range
6. `GET /api/memory/entities/event/upcoming?user_id={id}&limit={n}` - Get upcoming events
7. `GET /api/memory/entities/event/conflicts?start={time}&end={time}` - Check for conflicts

**Implementation Example:**

```python
from fastapi import APIRouter, Depends, HTTPException, Query
from uuid import UUID
from typing import List, Optional
from datetime import datetime

from fidus.memory.entities.event import Event
from fidus.memory.repositories.event_repository import EventRepository
from fidus.dependencies import get_event_repository, get_current_user


router = APIRouter(prefix="/api/memory/entities/event", tags=["events"])


@router.post("/", response_model=Event)
async def create_event(
    event: Event,
    repo: EventRepository = Depends(get_event_repository),
    current_user: dict = Depends(get_current_user)
):
    """Create a new event."""
    if event.tenant_id != current_user["tenant_id"]:
        raise HTTPException(status_code=403, detail="Tenant mismatch")

    return await repo.create(event)


@router.get("/{event_id}", response_model=Event)
async def get_event(
    event_id: UUID,
    repo: EventRepository = Depends(get_event_repository),
    current_user: dict = Depends(get_current_user)
):
    """Get an event by ID."""
    event = await repo.get(event_id, current_user["tenant_id"])
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.put("/{event_id}", response_model=Event)
async def update_event(
    event_id: UUID,
    updated_event: Event,
    repo: EventRepository = Depends(get_event_repository),
    current_user: dict = Depends(get_current_user)
):
    """Update an existing event."""
    existing = await repo.get(event_id, current_user["tenant_id"])
    if not existing:
        raise HTTPException(status_code=404, detail="Event not found")

    updated_event.id = event_id
    updated_event.tenant_id = current_user["tenant_id"]
    return await repo.update(updated_event)


@router.delete("/{event_id}")
async def delete_event(
    event_id: UUID,
    repo: EventRepository = Depends(get_event_repository),
    current_user: dict = Depends(get_current_user)
):
    """Delete an event."""
    deleted = await repo.delete(event_id, current_user["tenant_id"])
    if not deleted:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"status": "deleted"}


@router.get("/", response_model=List[Event])
async def list_events(
    user_id: str = Query(...),
    start: Optional[datetime] = Query(None),
    end: Optional[datetime] = Query(None),
    repo: EventRepository = Depends(get_event_repository),
    current_user: dict = Depends(get_current_user)
):
    """
    List events for a user.

    If start and end are provided, returns events in that range.
    Otherwise, returns all events.
    """
    if start and end:
        return await repo.get_events_in_range(
            user_id,
            current_user["tenant_id"],
            start,
            end
        )
    else:
        # Return upcoming events if no range specified
        return await repo.get_upcoming_events(user_id, current_user["tenant_id"])


@router.get("/upcoming", response_model=List[Event])
async def get_upcoming_events(
    user_id: str = Query(...),
    limit: int = Query(10, ge=1, le=100),
    repo: EventRepository = Depends(get_event_repository),
    current_user: dict = Depends(get_current_user)
):
    """Get upcoming events for a user."""
    return await repo.get_upcoming_events(user_id, current_user["tenant_id"], limit)


@router.get("/conflicts", response_model=List[Event])
async def check_conflicts(
    user_id: str = Query(...),
    start: datetime = Query(...),
    end: datetime = Query(...),
    repo: EventRepository = Depends(get_event_repository),
    current_user: dict = Depends(get_current_user)
):
    """Find events that conflict with a given time range."""
    return await repo.find_overlapping_events(
        user_id,
        current_user["tenant_id"],
        start,
        end
    )
```

---

### Frontend Implementation

**Components to Create:**

1. **`packages/web/src/components/memory/EventCalendar.tsx`**
   - Purpose: Main calendar component with month/week/day views
   - Library: FullCalendar or react-big-calendar
   - Props: None (fetches data internally)

2. **`packages/web/src/components/memory/EventModal.tsx`**
   - Purpose: Modal for viewing/editing event details
   - Props: `event: Event | null`, `isOpen: boolean`, `onClose: () => void`

3. **`packages/web/src/components/memory/EventForm.tsx`**
   - Purpose: Form for creating/editing events
   - Props: `initialEvent?: Event`, `onSubmit: (event: Event) => void`

**Implementation Example:**

#### EventCalendar Component

```typescript
// packages/web/src/components/memory/EventCalendar.tsx
'use client';

import { useState } from 'react';
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { getEvents } from '@/lib/api/memory';
import { EventModal } from './EventModal';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: any;
}

export function EventCalendar() {
  const [currentView, setCurrentView] = useState<View>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate date range based on current view
  const getDateRange = () => {
    const start = new Date(currentDate);
    start.setDate(1); // First day of month

    const end = new Date(currentDate);
    end.setMonth(end.getMonth() + 1);
    end.setDate(0); // Last day of month

    return { start, end };
  };

  const { start, end } = getDateRange();

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', start.toISOString(), end.toISOString()],
    queryFn: () => getEvents(start, end),
  });

  const calendarEvents: CalendarEvent[] = events?.map(event => ({
    id: event.id,
    title: event.title,
    start: new Date(event.start_time),
    end: new Date(event.end_time),
    resource: event,
  })) || [];

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event.resource);
    setIsModalOpen(true);
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    // Open create form with pre-filled times
    setSelectedEvent({
      start_time: start.toISOString(),
      end_time: end.toISOString(),
    });
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <div>Loading calendar...</div>;
  }

  return (
    <div className="h-screen p-6">
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        view={currentView}
        onView={setCurrentView}
        date={currentDate}
        onNavigate={setCurrentDate}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        popup
      />

      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
      />
    </div>
  );
}
```

#### EventModal Component

```typescript
// packages/web/src/components/memory/EventModal.tsx
'use client';

import { Dialog, Button } from '@fidus/ui';
import { CalendarIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface EventModalProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
}

export function EventModal({ event, isOpen, onClose }: EventModalProps) {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} title={event.title || 'New Event'}>
      <div className="space-y-4">
        {/* Time */}
        <div className="flex items-start gap-3">
          <CalendarIcon className="h-5 w-5 text-gray-500 mt-0.5" />
          <div>
            <p className="font-medium">
              {format(new Date(event.start_time), 'PPP')}
            </p>
            <p className="text-sm text-gray-600">
              {format(new Date(event.start_time), 'p')} -{' '}
              {format(new Date(event.end_time), 'p')}
            </p>
          </div>
        </div>

        {/* Location */}
        {event.location && (
          <div className="flex items-start gap-3">
            <MapPinIcon className="h-5 w-5 text-gray-500 mt-0.5" />
            <p>{event.location}</p>
          </div>
        )}

        {/* Participants */}
        {event.participants && event.participants.length > 0 && (
          <div className="flex items-start gap-3">
            <UsersIcon className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600 mb-1">Participants</p>
              <ul className="space-y-1">
                {event.participants.map((p: any, i: number) => (
                  <li key={i} className="text-sm">
                    {p.name}
                    {p.role && (
                      <span className="text-gray-500 ml-2">({p.role})</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Description</p>
            <p className="text-sm">{event.description}</p>
          </div>
        )}

        <div className="flex gap-2 justify-end mt-6">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button href={`/memory/events/${event.id}/edit`}>
            Edit Event
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
```

**UI/UX Requirements:**
- Calendar must support month, week, and day views
- Click on event opens detail modal
- Click on empty time slot opens create form with pre-filled time
- Events color-coded by type (meeting=blue, personal=green, etc.)
- Today's date highlighted
- Responsive: Stack to mobile view on small screens
- Loading state while fetching events
- Empty state: "No events this month"

**Routes to Add:**
- `/memory/events` - Main calendar page
- `/memory/events/new` - Create new event form
- `/memory/events/[id]` - Event detail page
- `/memory/events/[id]/edit` - Edit event form

---

### Testing Requirements

**Unit Tests:**

```python
# packages/api/tests/unit/memory/test_event.py

import pytest
from datetime import datetime, timedelta
from fidus.memory.entities.event import Event, EventParticipant


def test_event_duration_calculation():
    """Test duration calculation in minutes."""
    event = Event(
        tenant_id="test",
        user_id="user1",
        title="Meeting",
        start_time=datetime(2025, 11, 21, 14, 0),
        end_time=datetime(2025, 11, 21, 15, 30)
    )

    assert event.duration_minutes == 90


def test_event_validation_end_before_start():
    """Test that end_time must be after start_time."""
    with pytest.raises(ValueError, match="end_time must be after start_time"):
        Event(
            tenant_id="test",
            user_id="user1",
            title="Invalid Event",
            start_time=datetime(2025, 11, 21, 15, 0),
            end_time=datetime(2025, 11, 21, 14, 0)  # Before start!
        )


def test_is_upcoming():
    """Test is_upcoming property."""
    future_event = Event(
        tenant_id="test",
        user_id="user1",
        title="Future",
        start_time=datetime.utcnow() + timedelta(days=1),
        end_time=datetime.utcnow() + timedelta(days=1, hours=1)
    )

    assert future_event.is_upcoming is True
    assert future_event.is_past is False


def test_event_overlap():
    """Test overlap detection."""
    event1 = Event(
        tenant_id="test",
        user_id="user1",
        title="Event 1",
        start_time=datetime(2025, 11, 21, 14, 0),
        end_time=datetime(2025, 11, 21, 15, 0)
    )

    event2 = Event(
        tenant_id="test",
        user_id="user1",
        title="Event 2",
        start_time=datetime(2025, 11, 21, 14, 30),
        end_time=datetime(2025, 11, 21, 15, 30)
    )

    assert event1.overlaps_with(event2) is True

    event3 = Event(
        tenant_id="test",
        user_id="user1",
        title="Event 3",
        start_time=datetime(2025, 11, 21, 16, 0),
        end_time=datetime(2025, 11, 21, 17, 0)
    )

    assert event1.overlaps_with(event3) is False
```

**Integration Tests:**

```python
# packages/api/tests/integration/memory/test_event_api.py

import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta


@pytest.mark.asyncio
async def test_create_and_retrieve_event(client: AsyncClient, auth_headers):
    """Test creating an event and retrieving it."""
    event_data = {
        "tenant_id": "test_tenant",
        "user_id": "user123",
        "title": "Team Meeting",
        "description": "Weekly sync",
        "start_time": (datetime.utcnow() + timedelta(days=1)).isoformat(),
        "end_time": (datetime.utcnow() + timedelta(days=1, hours=1)).isoformat(),
        "location": "Conference Room A",
        "event_type": "meeting"
    }

    response = await client.post(
        "/api/memory/entities/event",
        json=event_data,
        headers=auth_headers
    )
    assert response.status_code == 200
    event = response.json()
    event_id = event["id"]

    # Retrieve
    response = await client.get(
        f"/api/memory/entities/event/{event_id}",
        headers=auth_headers
    )
    assert response.status_code == 200
    retrieved = response.json()
    assert retrieved["title"] == "Team Meeting"


@pytest.mark.asyncio
async def test_get_events_in_range(client: AsyncClient, auth_headers):
    """Test retrieving events within a date range."""
    # Create multiple events
    tomorrow = datetime.utcnow() + timedelta(days=1)
    next_week = datetime.utcnow() + timedelta(days=7)

    await create_event(client, auth_headers, start=tomorrow)
    await create_event(client, auth_headers, start=next_week)

    # Query range
    start = datetime.utcnow()
    end = datetime.utcnow() + timedelta(days=5)

    response = await client.get(
        f"/api/memory/entities/event?user_id=user123&start={start.isoformat()}&end={end.isoformat()}",
        headers=auth_headers
    )
    assert response.status_code == 200
    events = response.json()

    # Should only return tomorrow's event, not next week's
    assert len(events) == 1


@pytest.mark.asyncio
async def test_find_overlapping_events(client: AsyncClient, auth_headers):
    """Test conflict detection."""
    start_time = datetime.utcnow() + timedelta(days=1, hours=14)
    end_time = start_time + timedelta(hours=1)

    # Create event
    await create_event(client, auth_headers, start=start_time, end=end_time)

    # Check for conflicts with overlapping time
    conflict_start = start_time + timedelta(minutes=30)
    conflict_end = conflict_start + timedelta(hours=1)

    response = await client.get(
        f"/api/memory/entities/event/conflicts?user_id=user123&start={conflict_start.isoformat()}&end={conflict_end.isoformat()}",
        headers=auth_headers
    )
    assert response.status_code == 200
    conflicts = response.json()

    assert len(conflicts) == 1
```

**E2E Tests:**

```typescript
// packages/web/tests/e2e/memory/event-workflow.spec.ts

import { test, expect } from '@playwright/test';

test('User can create event via calendar', async ({ page }) => {
  await page.goto('/memory/events');

  // Wait for calendar to load
  await expect(page.locator('.rbc-calendar')).toBeVisible();

  // Click on a time slot (tomorrow at 2pm)
  // Note: This requires calculating the correct cell
  await page.click('.rbc-day-slot:nth-child(2) .rbc-time-slot:nth-child(28)');

  // Modal should open with pre-filled times
  await expect(page.locator('text=New Event')).toBeVisible();

  // Fill in event details
  await page.fill('input[name="title"]', 'Client Call');
  await page.fill('textarea[name="description"]', 'Quarterly review');
  await page.fill('input[name="location"]', 'Zoom');

  // Submit
  await page.click('button[type="submit"]');

  // Event should appear on calendar
  await expect(page.locator('text=Client Call')).toBeVisible();
});


test('User can view event details', async ({ page }) => {
  await page.goto('/memory/events');

  // Click on an existing event
  await page.click('text=Team Standup');

  // Modal opens with details
  await expect(page.locator('text=Team Standup')).toBeVisible();
  await expect(page.locator('text=Conference Room A')).toBeVisible();

  // Can edit
  await page.click('text=Edit Event');
  await expect(page).toHaveURL(/\/memory\/events\/.*\/edit/);
});


test('Event extraction from conversation', async ({ page }) => {
  await page.goto('/chat');

  // Type message with event
  await page.fill('textarea', 'I have a dentist appointment next Tuesday at 2pm');
  await page.click('button:has-text("Send")');

  // Wait for response
  await page.waitForTimeout(2000);

  // Navigate to events
  await page.goto('/memory/events');

  // Event should be created
  await expect(page.locator('text=Dentist')).toBeVisible();
});
```

---

## Implementation Guidelines

### Must Follow

1. **ADR-0002 Compliance (Property Placement):**
   - Neo4j stores ONLY: id, tenant_id, user_id, event_context_id, start_time, end_time, created_at, updated_at
   - Qdrant stores ALL context: title, description, location, participants, event_type, status, ai_properties
   - Temporal boundaries (start_time, end_time) in BOTH systems (Neo4j for queries, Qdrant for completeness)
   - 1-Hop Query Pattern: Neo4j temporal filter → Qdrant context fetch → Merge

2. **Qdrant-First Pattern (ADR-0001):**
   - Store in Qdrant FIRST before creating Neo4j node
   - Rollback Qdrant if Neo4j fails
   - Use event_context_id as reference from Neo4j to Qdrant

3. **Date/Time Handling:**
   - ALL datetimes stored in UTC
   - Convert to user timezone only in frontend
   - Validate end_time > start_time
   - Support all-day events (start/end at midnight)

4. **Feature Flag:**
   - All functionality behind feature flag: `ENABLE_EVENT_ENTITY`
   - Default: disabled in production
   - Check flag before extraction and API operations

5. **Multi-Tenancy:**
   - ALL queries filter by `tenant_id`
   - Verify tenant in auth before operations
   - Test cross-tenant isolation

6. **Error Handling:**
   - Invalid datetime: Return 422 with validation error
   - Event not found: Return 404
   - Overlapping events: Warning (not error, users can have conflicts)
   - Qdrant failure: Abort operation (PRIMARY storage)
   - Neo4j failure: Rollback Qdrant

7. **Code Quality:**
   - Type hints on all Python functions
   - No TypeScript `any` types
   - Docstrings for all public APIs
   - Document ADR-0002 pattern in code comments

### Must NOT Do

- ❌ Store context properties (title, description, location) in Neo4j
- ❌ Skip Qdrant-First pattern (always Qdrant → Neo4j)
- ❌ Allow end_time before start_time
- ❌ Skip timezone conversion (always use UTC internally)
- ❌ Allow editing past events without confirmation
- ❌ Store participant PII without GDPR compliance
- ❌ Skip tenant_id validation
- ❌ Create Neo4j node before Qdrant point

---

## 1-Hop Query Pattern Examples (ADR-0002)

The Event entity demonstrates the efficiency of ADR-0002's property placement strategy. Here are the key query patterns:

### Pattern 1: Temporal Range Query with Context Enrichment

**Use Case:** "Show all events in November 2025"

```python
# Step 1: Fast temporal filter in Neo4j (indexed start_time)
query = """
MATCH (e:Event {user_id: $user_id, tenant_id: $tenant_id})
WHERE datetime('2025-11-01') <= e.start_time <= datetime('2025-11-30')
RETURN e.id, e.event_context_id, e.start_time, e.end_time
ORDER BY e.start_time ASC
"""
# Result: 15 events (< 5ms with index)

# Step 2: Batch fetch contexts from Qdrant
event_context_ids = [r["event_context_id"] for r in results]
contexts = qdrant.scroll(
    collection_name="events",
    filter=Filter(must=[FieldCondition(key="event_context_id", match=event_context_ids)])
)
# Result: 15 context payloads (< 10ms)

# Step 3: Merge structural + context
for event, context in zip(results, contexts):
    enriched = {
        **event,  # From Neo4j: id, start_time, end_time
        **context.payload  # From Qdrant: title, description, location, participants
    }
```

**Performance:** ~15ms total (vs. ~500ms full Qdrant scan with date filter)

### Pattern 2: Upcoming Events with Context

**Use Case:** "Show next 10 upcoming events"

```python
# Neo4j: Temporal boundary query (start_time > now)
query = """
MATCH (e:Event {user_id: $user_id, tenant_id: $tenant_id})
WHERE e.start_time > datetime()
RETURN e.id, e.event_context_id, e.start_time
ORDER BY e.start_time ASC
LIMIT 10
"""
# Result: 10 events (< 3ms with index)

# Qdrant: Fetch contexts
contexts = qdrant.scroll(filter=event_context_ids)
# Result: 10 context payloads (< 5ms)
```

**Performance:** ~8ms total

### Pattern 3: Conflict Detection

**Use Case:** "Find events overlapping with proposed time slot"

```python
# Neo4j: Temporal overlap query
query = """
MATCH (e:Event {user_id: $user_id, tenant_id: $tenant_id})
WHERE e.start_time < datetime($proposed_end)
  AND e.end_time > datetime($proposed_start)
RETURN e.id, e.event_context_id, e.start_time, e.end_time
"""
# Result: 2 conflicting events (< 2ms)

# Qdrant: Fetch conflict details
contexts = qdrant.scroll(filter=event_context_ids)
# Result: 2 context payloads with titles, locations (< 3ms)
```

**Performance:** ~5ms total

### Why This Works (ADR-0002 Benefits)

1. **Neo4j Indexes:** `start_time` and `end_time` are indexed in Neo4j
   - Temporal range queries: O(log n) instead of O(n)
   - No need to scan all events in Qdrant

2. **Qdrant Batch Fetch:** After Neo4j filter, fetch ONLY matched contexts
   - 10-100x faster than full scan with date filter in Qdrant
   - Qdrant optimized for similarity search, not temporal filtering

3. **Minimal Data Duplication:** Only temporal boundaries duplicated
   - ~50 bytes per event (start_time, end_time)
   - Context (title, description, participants) stored ONCE in Qdrant

---

## Dependencies & Prerequisites

**Required Before Starting:**
- [x] Package 1.1 (Qdrant-First) completed
- [x] Package 1.2 (User entity) completed
- [ ] Neo4j 5.x running
- [ ] Neo4j indexes created (ADR-0002 requirement):
  ```cypher
  CREATE INDEX event_start_time_idx FOR (e:Event) ON (e.tenant_id, e.start_time);
  CREATE INDEX event_end_time_idx FOR (e:Event) ON (e.tenant_id, e.end_time);
  CREATE INDEX event_context_id_idx FOR (e:Event) ON (e.event_context_id);
  ```
- [ ] Qdrant collection `events` created with 1536-dim vectors
- [ ] Feature flag `ENABLE_EVENT_ENTITY` added
- [ ] Calendar library installed: `npm install react-big-calendar date-fns`
- [ ] Dateparser library installed: `poetry add dateparser`

**Technical Dependencies:**
- Neo4j 5.x: `neo4j://localhost:7687`
- Qdrant 1.7+: `http://localhost:6333`
- Node 18+: For Next.js
- Python 3.11+: For FastAPI
- LiteLLM client configured

---

## Step-by-Step Implementation Plan

### Phase 1: Backend Core
1. Create Event entity model with datetime validation
2. Implement EventRepository with date range queries
3. Add Neo4j constraints and indexes
4. Write unit tests for overlap detection

### Phase 2: API Layer
1. Create FastAPI router with CRUD endpoints
2. Implement date range query endpoint
3. Add conflict detection endpoint
4. Write integration tests

### Phase 3: LLM Extraction
1. Create EventExtractor service
2. Design extraction prompt with datetime parsing
3. Test with various date formats
4. Integrate into chat workflow

### Phase 4: Frontend Calendar
1. Integrate react-big-calendar
2. Implement month/week/day views
3. Create EventModal component
4. Add event creation flow

### Phase 5: Testing & Docs
1. Write E2E tests
2. Test datetime edge cases
3. Document API endpoints
4. Create user guide

---

## Verification Checklist

### ADR-0002 Compliance
- [ ] Neo4j stores ONLY: id, tenant_id, user_id, event_context_id, start_time, end_time, created_at, updated_at
- [ ] Qdrant stores ALL context: title, description, location, participants, event_type, status, ai_properties
- [ ] Temporal boundaries present in BOTH systems
- [ ] 1-Hop Query Pattern implemented (Neo4j filter → Qdrant fetch → Merge)
- [ ] Qdrant-First pattern: Store Qdrant → Neo4j with rollback
- [ ] Neo4j indexes created for start_time, end_time, event_context_id

### Functionality
- [ ] User can create event via calendar UI
- [ ] User can view event details in modal
- [ ] Events displayed correctly in calendar
- [ ] Date range queries return correct events (temporal query pattern)
- [ ] Conflict detection works (temporal overlap query)
- [ ] LLM extracts events from text
- [ ] Context enrichment works (Qdrant payload merged with Neo4j data)

### Code Quality
- [ ] All files created
- [ ] Type hints on all functions
- [ ] No linting errors
- [ ] Datetimes in UTC
- [ ] ADR-0002 pattern documented in code comments
- [ ] No context properties in Neo4j nodes

### Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Multi-tenancy verified
- [ ] 1-Hop Query Pattern test passes
- [ ] Temporal range query performance verified (< 20ms)

### Documentation
- [ ] API documented
- [ ] User guide created
- [ ] Migration notes written
- [ ] ADR-0002 compliance documented
- [ ] 1-Hop Query Pattern examples included

---

## Risk Mitigation

**Risks:**
- **Risk:** Datetime parsing may fail for complex natural language
  - Mitigation: Provide manual time picker, validate with user
- **Risk:** Calendar performance degrades with many events
  - Mitigation: Limit range queries, implement pagination, lazy loading

---

## Success Criteria

1. ✅ User creates event and sees it on calendar
2. ✅ Date range queries work correctly
3. ✅ LLM extracts "Meeting next Tuesday at 2pm"
4. ✅ All tests pass
5. ✅ Deployed with feature flag OFF

---

**Prompt Version:** 1.0
**Generated:** 2025-11-21
**Target Package:** 4.2

---

**END OF IMPLEMENTATION PROMPT**

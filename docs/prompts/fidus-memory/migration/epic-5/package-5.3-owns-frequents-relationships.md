# Implementation Prompt: 5.3 - OWNS & FREQUENTS Relationships

**Package:** 5.3
**Epic:** Completion & Optimization
**Priority:** 🟢 LOW
**Context Document:** `/docs/prototypes/fidus-memory/migration-v3-wbs.md` (Lines 1144-1186)

---

## Role

You are a **Senior Full-Stack Software Engineer** specializing in:

**Backend Expertise:**
- **Domain-Driven Design (DDD):** Aggregates, entities, repositories
- **Graph Databases (Neo4j):** Relationship modeling, Cypher queries
- **Vector Databases (Qdrant):** Context storage, similarity search
- **Python Backend:** FastAPI, Pydantic, async/await
- **Qdrant-First Pattern (ADR-0001):** Qdrant PRIMARY, Neo4j SECONDARY with situation_id

**Frontend Expertise:**
- **Next.js 14:** App Router, Server Components
- **React 18:** Hooks, state management
- **TypeScript 5+:** Advanced types
- **UI Libraries:** @fidus/ui design system

---

## Context & Background

**Current State:**
- Qdrant-First pattern operational (Package 1.1)
- User, Object, Location entities implemented (Packages 1.2, 5.1, 5.2)
- 6/9 relationships implemented (KNOWS, WORKS_AT, PURSUES, MEMBER_OF, HAS_HABIT, ATTENDS)
- No ownership or frequency tracking for objects/locations

**Migration Goal:**
- Add OWNS relationship connecting User to Object
- Add FREQUENTS relationship connecting User to Location
- Increase relationship coverage to 8/9 (89%)
- Store situational context in Qdrant (Qdrant-First pattern)
- Enable context-aware queries (e.g., "objects I use at work")
- Complete entity-relationship coverage for low-priority entities

**Architecture References:**
- Solution Architecture: `/docs/solution-architecture/15-entity-management.md`
- ADR: `/docs/adr/ADR-0001-qdrant-first-pattern.md`
- Reference Implementation: `packages/api/fidus/memory/relationships/knows.py` (Packages 3.1)

---

## Your Task

Implement **OWNS & FREQUENTS Relationships** according to specifications below.

**User Story:**
As a user, I want relationships between me and my objects/locations for better context understanding.

**Acceptance Criteria:**
1. Backend: OWNS relationship service with Qdrant-First pattern
2. Backend: FREQUENTS relationship service with Qdrant-First pattern
3. Backend: Context properties: usage_purpose, condition, frequency, last_visit
4. API: CRUD endpoints for both relationships
5. Frontend: Object detail shows ownership context
6. Frontend: Location detail shows frequency context
7. Frontend: Context history timeline for both relationships
8. Tests: Create relationships with situational context, query by similar context
9. Documentation: Update relationship management guide

---

## Technical Specification

### Backend Implementation

**Files to Create/Modify:**

1. **`packages/api/fidus/memory/relationships/owns.py`** - OWNS relationship model
2. **`packages/api/fidus/memory/services/owns_relationship_service.py`** - OWNS service with Qdrant-First
3. **`packages/api/fidus/memory/relationships/frequents.py`** - FREQUENTS relationship model
4. **`packages/api/fidus/memory/services/frequents_relationship_service.py`** - FREQUENTS service
5. **`packages/api/fidus/memory/routes/owns_routes.py`** - OWNS API endpoints
6. **`packages/api/fidus/memory/routes/frequents_routes.py`** - FREQUENTS API endpoints
7. **`packages/api/fidus/config.py`** - Feature flags

**Detailed Tasks:**

#### Task 1: Create OWNS Relationship Model

**File:** `packages/api/fidus/memory/relationships/owns.py`

```python
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from datetime import datetime
from uuid import uuid4


class OwnsRelationship(BaseModel):
    """
    OWNS relationship: User → Object

    Tracks ownership with situational context stored in Qdrant.
    """
    relationship_instance_id: str = Field(default_factory=lambda: str(uuid4()))
    user_id: str = Field(..., description="Owner user ID")
    object_id: str = Field(..., description="Owned object ID")

    # Relationship-specific properties (stored in Neo4j)
    usage_purpose: Optional[str] = Field(None, description="Primary use case: work, personal, hobby")
    acquisition_date: Optional[datetime] = Field(None, description="When acquired")
    condition: Optional[str] = Field(None, description="Current condition: new, used, damaged")
    location_stored: Optional[str] = Field(None, description="Where object is kept")

    # Context reference (points to Qdrant)
    situation_id: str = Field(..., description="Reference to Qdrant situational context")

    # Metadata
    observed_at: datetime = Field(default_factory=datetime.utcnow)
    confidence: float = Field(0.9, ge=0.0, le=1.0)
    source: str = Field("explicit", description="explicit, inferred, llm_extracted")

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user_1",
                "object_id": "obj_123",
                "usage_purpose": "work",
                "acquisition_date": "2024-03-15T00:00:00Z",
                "condition": "new",
                "location_stored": "office desk",
                "situation_id": "sit_456",
                "confidence": 0.95,
                "source": "explicit"
            }
        }


class OwnsRelationshipCreate(BaseModel):
    """Request model for creating OWNS relationship"""
    object_id: str
    usage_purpose: Optional[str] = None
    acquisition_date: Optional[datetime] = None
    condition: Optional[str] = None
    location_stored: Optional[str] = None

    # Situational context (will be stored in Qdrant)
    context: Dict[str, Any] = Field(
        default_factory=dict,
        description="Situational factors: emotion, mood, activity, location, social_context, etc."
    )


class OwnsRelationshipUpdate(BaseModel):
    """Request model for updating OWNS relationship"""
    usage_purpose: Optional[str] = None
    condition: Optional[str] = None
    location_stored: Optional[str] = None
```

---

#### Task 2: Create OWNS Relationship Service

**File:** `packages/api/fidus/memory/services/owns_relationship_service.py`

```python
from typing import List, Optional, Dict, Any
from uuid import uuid4
from qdrant_client import QdrantClient
from neo4j import AsyncDriver
from datetime import datetime

from fidus.memory.relationships.owns import (
    OwnsRelationship,
    OwnsRelationshipCreate,
    OwnsRelationshipUpdate
)
from fidus.memory.context.storage_v3 import ContextStorageV3


class OwnsRelationshipService:
    """
    Service for OWNS relationships following Qdrant-First pattern.

    Pattern:
    1. Store context in Qdrant (PRIMARY) with full situational factors
    2. Create Neo4j relationship (SECONDARY) with situation_id reference
    3. Rollback Qdrant on Neo4j failure
    """

    def __init__(self, qdrant: QdrantClient, neo4j: AsyncDriver):
        self.qdrant = qdrant
        self.neo4j = neo4j
        self.context_storage = ContextStorageV3(qdrant, neo4j)

    async def create_owns_relationship(
        self,
        tenant_id: str,
        user_id: str,
        rel_data: OwnsRelationshipCreate
    ) -> OwnsRelationship:
        """
        Create OWNS relationship with Qdrant-First pattern.

        Steps:
        1. Store context in Qdrant (PRIMARY)
        2. Create Neo4j relationship with situation_id (SECONDARY)
        3. Rollback on failure
        """
        relationship_instance_id = str(uuid4())

        # Step 1: Store context in Qdrant (PRIMARY)
        situation_id = await self.context_storage.store_situation_v3(
            tenant_id=tenant_id,
            user_id=user_id,
            context=rel_data.context,
            relationship_type="OWNS",
            entity_id=rel_data.object_id
        )

        # Step 2: Create Neo4j relationship (SECONDARY)
        try:
            query = """
            MATCH (u:User {id: $user_id, tenant_id: $tenant_id})
            MATCH (o:Object {id: $object_id, tenant_id: $tenant_id})
            CREATE (u)-[r:OWNS {
                relationship_instance_id: $rel_id,
                situation_id: $situation_id,
                usage_purpose: $usage_purpose,
                acquisition_date: $acquisition_date,
                condition: $condition,
                location_stored: $location_stored,
                observed_at: datetime(),
                confidence: $confidence,
                source: $source
            }]->(o)
            RETURN r
            """

            async with self.neo4j.session() as session:
                await session.run(
                    query,
                    user_id=user_id,
                    tenant_id=tenant_id,
                    object_id=rel_data.object_id,
                    rel_id=relationship_instance_id,
                    situation_id=situation_id,
                    usage_purpose=rel_data.usage_purpose,
                    acquisition_date=rel_data.acquisition_date.isoformat() if rel_data.acquisition_date else None,
                    condition=rel_data.condition,
                    location_stored=rel_data.location_stored,
                    confidence=0.9,
                    source="explicit"
                )

        except Exception as e:
            # Rollback: Delete from Qdrant
            await self.qdrant.delete(
                collection_name="situations",
                points_selector=[situation_id]
            )
            raise RuntimeError(f"Neo4j relationship creation failed, rolled back Qdrant: {e}")

        # Step 3: Return relationship
        return OwnsRelationship(
            relationship_instance_id=relationship_instance_id,
            user_id=user_id,
            object_id=rel_data.object_id,
            usage_purpose=rel_data.usage_purpose,
            acquisition_date=rel_data.acquisition_date,
            condition=rel_data.condition,
            location_stored=rel_data.location_stored,
            situation_id=situation_id
        )

    async def get_owns_relationships(
        self,
        user_id: str,
        tenant_id: str,
        object_id: Optional[str] = None
    ) -> List[OwnsRelationship]:
        """
        Get all OWNS relationships for user.

        Optionally filter by specific object.
        """
        object_filter = "AND o.id = $object_id" if object_id else ""

        query = f"""
        MATCH (u:User {{id: $user_id, tenant_id: $tenant_id}})-[r:OWNS]->(o:Object)
        {object_filter}
        RETURN r, o.id as object_id
        ORDER BY r.observed_at DESC
        """

        async with self.neo4j.session() as session:
            result = await session.run(
                query,
                user_id=user_id,
                tenant_id=tenant_id,
                object_id=object_id
            )
            records = await result.data()

        return [self._record_to_relationship(record) for record in records]

    async def get_context_history(
        self,
        relationship_instance_id: str,
        tenant_id: str
    ) -> List[Dict[str, Any]]:
        """
        Get context history for OWNS relationship from Qdrant.

        Returns all situation contexts associated with this relationship.
        """
        # Get situation_id from Neo4j
        query = """
        MATCH ()-[r:OWNS {relationship_instance_id: $rel_id}]->()
        WHERE r.tenant_id = $tenant_id OR EXISTS(()-[r]->(:Object {tenant_id: $tenant_id}))
        RETURN r.situation_id as situation_id
        """

        async with self.neo4j.session() as session:
            result = await session.run(
                query,
                rel_id=relationship_instance_id,
                tenant_id=tenant_id
            )
            record = await result.single()

            if not record:
                return []

            situation_id = record["situation_id"]

        # Fetch context from Qdrant
        points = self.qdrant.retrieve(
            collection_name="situations",
            ids=[situation_id]
        )

        if not points:
            return []

        return [point.payload.get("context", {}) for point in points]

    async def update_owns_relationship(
        self,
        relationship_instance_id: str,
        tenant_id: str,
        update_data: OwnsRelationshipUpdate
    ) -> Optional[OwnsRelationship]:
        """Update OWNS relationship properties"""
        updates = []
        params = {
            "rel_id": relationship_instance_id,
            "tenant_id": tenant_id
        }

        if update_data.usage_purpose is not None:
            updates.append("r.usage_purpose = $usage_purpose")
            params["usage_purpose"] = update_data.usage_purpose
        if update_data.condition is not None:
            updates.append("r.condition = $condition")
            params["condition"] = update_data.condition
        if update_data.location_stored is not None:
            updates.append("r.location_stored = $location_stored")
            params["location_stored"] = update_data.location_stored

        if not updates:
            return None

        updates.append("r.updated_at = datetime()")

        query = f"""
        MATCH (u:User {{tenant_id: $tenant_id}})-[r:OWNS {{relationship_instance_id: $rel_id}}]->(o:Object)
        SET {', '.join(updates)}
        RETURN r, u.id as user_id, o.id as object_id
        """

        async with self.neo4j.session() as session:
            result = await session.run(query, **params)
            record = await result.single()

            if not record:
                return None

            return self._record_to_relationship(record)

    async def delete_owns_relationship(
        self,
        relationship_instance_id: str,
        tenant_id: str
    ) -> bool:
        """
        Delete OWNS relationship and clean up Qdrant context.
        """
        # Get situation_id before deletion
        query = """
        MATCH (u:User {tenant_id: $tenant_id})-[r:OWNS {relationship_instance_id: $rel_id}]->(o:Object)
        WITH r.situation_id as sit_id, r
        DELETE r
        RETURN sit_id
        """

        async with self.neo4j.session() as session:
            result = await session.run(
                query,
                rel_id=relationship_instance_id,
                tenant_id=tenant_id
            )
            record = await result.single()

            if not record:
                return False

            situation_id = record["sit_id"]

        # Clean up Qdrant
        if situation_id:
            await self.qdrant.delete(
                collection_name="situations",
                points_selector=[situation_id]
            )

        return True

    def _record_to_relationship(self, record: dict) -> OwnsRelationship:
        """Convert Neo4j record to OwnsRelationship"""
        r = record["r"]
        return OwnsRelationship(
            relationship_instance_id=r["relationship_instance_id"],
            user_id=record.get("user_id"),
            object_id=record.get("object_id"),
            usage_purpose=r.get("usage_purpose"),
            acquisition_date=r.get("acquisition_date"),
            condition=r.get("condition"),
            location_stored=r.get("location_stored"),
            situation_id=r["situation_id"],
            observed_at=r.get("observed_at"),
            confidence=r.get("confidence", 0.9),
            source=r.get("source", "explicit")
        )
```

---

#### Task 3: Create FREQUENTS Relationship Model & Service

**File:** `packages/api/fidus/memory/relationships/frequents.py`

```python
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from datetime import datetime
from uuid import uuid4


class FrequentsRelationship(BaseModel):
    """
    FREQUENTS relationship: User → Location

    Tracks location visitation frequency with situational context.
    """
    relationship_instance_id: str = Field(default_factory=lambda: str(uuid4()))
    user_id: str = Field(..., description="User who frequents the location")
    location_id: str = Field(..., description="Location being frequented")

    # Relationship-specific properties
    frequency: Optional[str] = Field(None, description="daily, weekly, monthly, occasionally")
    last_visit: Optional[datetime] = Field(None, description="Last visit timestamp")
    visit_count: int = Field(0, description="Number of recorded visits")
    purpose: Optional[str] = Field(None, description="Reason for visits: work, leisure, errands, exercise")

    # Context reference
    situation_id: str = Field(..., description="Reference to Qdrant context")

    # Metadata
    observed_at: datetime = Field(default_factory=datetime.utcnow)
    confidence: float = Field(0.9, ge=0.0, le=1.0)
    source: str = Field("explicit")

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user_1",
                "location_id": "loc_123",
                "frequency": "daily",
                "last_visit": "2025-11-21T08:00:00Z",
                "visit_count": 45,
                "purpose": "exercise",
                "situation_id": "sit_789"
            }
        }


class FrequentsRelationshipCreate(BaseModel):
    """Request model for creating FREQUENTS relationship"""
    location_id: str
    frequency: Optional[str] = None
    purpose: Optional[str] = None
    context: Dict[str, Any] = Field(default_factory=dict)


class FrequentsRelationshipUpdate(BaseModel):
    """Request model for updating FREQUENTS relationship"""
    frequency: Optional[str] = None
    purpose: Optional[str] = None
    visit_count: Optional[int] = None
```

**File:** `packages/api/fidus/memory/services/frequents_relationship_service.py`

```python
from typing import List, Optional, Dict, Any
from uuid import uuid4
from qdrant_client import QdrantClient
from neo4j import AsyncDriver
from datetime import datetime

from fidus.memory.relationships.frequents import (
    FrequentsRelationship,
    FrequentsRelationshipCreate,
    FrequentsRelationshipUpdate
)
from fidus.memory.context.storage_v3 import ContextStorageV3


class FrequentsRelationshipService:
    """
    Service for FREQUENTS relationships with Qdrant-First pattern.
    """

    def __init__(self, qdrant: QdrantClient, neo4j: AsyncDriver):
        self.qdrant = qdrant
        self.neo4j = neo4j
        self.context_storage = ContextStorageV3(qdrant, neo4j)

    async def create_frequents_relationship(
        self,
        tenant_id: str,
        user_id: str,
        rel_data: FrequentsRelationshipCreate
    ) -> FrequentsRelationship:
        """Create FREQUENTS relationship with Qdrant-First pattern"""
        relationship_instance_id = str(uuid4())

        # Store context in Qdrant
        situation_id = await self.context_storage.store_situation_v3(
            tenant_id=tenant_id,
            user_id=user_id,
            context=rel_data.context,
            relationship_type="FREQUENTS",
            entity_id=rel_data.location_id
        )

        # Create Neo4j relationship
        try:
            query = """
            MATCH (u:User {id: $user_id, tenant_id: $tenant_id})
            MATCH (l:Location {id: $location_id, tenant_id: $tenant_id})
            CREATE (u)-[r:FREQUENTS {
                relationship_instance_id: $rel_id,
                situation_id: $situation_id,
                frequency: $frequency,
                last_visit: datetime(),
                visit_count: 1,
                purpose: $purpose,
                observed_at: datetime(),
                confidence: 0.9,
                source: 'explicit'
            }]->(l)
            RETURN r
            """

            async with self.neo4j.session() as session:
                await session.run(
                    query,
                    user_id=user_id,
                    tenant_id=tenant_id,
                    location_id=rel_data.location_id,
                    rel_id=relationship_instance_id,
                    situation_id=situation_id,
                    frequency=rel_data.frequency,
                    purpose=rel_data.purpose
                )

        except Exception as e:
            await self.qdrant.delete(
                collection_name="situations",
                points_selector=[situation_id]
            )
            raise RuntimeError(f"Neo4j failed, rolled back Qdrant: {e}")

        return FrequentsRelationship(
            relationship_instance_id=relationship_instance_id,
            user_id=user_id,
            location_id=rel_data.location_id,
            frequency=rel_data.frequency,
            last_visit=datetime.utcnow(),
            visit_count=1,
            purpose=rel_data.purpose,
            situation_id=situation_id
        )

    async def record_visit(
        self,
        relationship_instance_id: str,
        tenant_id: str,
        context: Dict[str, Any]
    ) -> bool:
        """
        Record a new visit to location.

        Increments visit_count, updates last_visit, stores new context in Qdrant.
        """
        # Get existing relationship
        query = """
        MATCH (u:User {tenant_id: $tenant_id})-[r:FREQUENTS {relationship_instance_id: $rel_id}]->(l:Location)
        SET r.visit_count = r.visit_count + 1,
            r.last_visit = datetime()
        RETURN u.id as user_id, l.id as location_id
        """

        async with self.neo4j.session() as session:
            result = await session.run(
                query,
                rel_id=relationship_instance_id,
                tenant_id=tenant_id
            )
            record = await result.single()

            if not record:
                return False

        # Store new visit context in Qdrant (append to history)
        await self.context_storage.store_situation_v3(
            tenant_id=tenant_id,
            user_id=record["user_id"],
            context=context,
            relationship_type="FREQUENTS",
            entity_id=record["location_id"]
        )

        return True

    async def get_frequents_relationships(
        self,
        user_id: str,
        tenant_id: str,
        location_id: Optional[str] = None
    ) -> List[FrequentsRelationship]:
        """Get all FREQUENTS relationships for user"""
        location_filter = "AND l.id = $location_id" if location_id else ""

        query = f"""
        MATCH (u:User {{id: $user_id, tenant_id: $tenant_id}})-[r:FREQUENTS]->(l:Location)
        {location_filter}
        RETURN r, l.id as location_id
        ORDER BY r.last_visit DESC
        """

        async with self.neo4j.session() as session:
            result = await session.run(
                query,
                user_id=user_id,
                tenant_id=tenant_id,
                location_id=location_id
            )
            records = await result.data()

        return [self._record_to_relationship(record) for record in records]

    def _record_to_relationship(self, record: dict) -> FrequentsRelationship:
        """Convert Neo4j record to FrequentsRelationship"""
        r = record["r"]
        return FrequentsRelationship(
            relationship_instance_id=r["relationship_instance_id"],
            user_id=record.get("user_id", ""),
            location_id=record.get("location_id", ""),
            frequency=r.get("frequency"),
            last_visit=r.get("last_visit"),
            visit_count=r.get("visit_count", 0),
            purpose=r.get("purpose"),
            situation_id=r["situation_id"],
            observed_at=r.get("observed_at"),
            confidence=r.get("confidence", 0.9),
            source=r.get("source", "explicit")
        )
```

---

### API Implementation

Create REST endpoints for both relationships following the same pattern as existing relationship routes.

**Key Endpoints:**

```
POST   /api/memory/relationships/owns          - Create OWNS
GET    /api/memory/relationships/owns          - List user's OWNS
GET    /api/memory/relationships/owns/{rel_id} - Get specific OWNS
PUT    /api/memory/relationships/owns/{rel_id} - Update OWNS
DELETE /api/memory/relationships/owns/{rel_id} - Delete OWNS
GET    /api/memory/relationships/owns/{rel_id}/context - Get context history

POST   /api/memory/relationships/frequents              - Create FREQUENTS
POST   /api/memory/relationships/frequents/{rel_id}/visit - Record visit
GET    /api/memory/relationships/frequents              - List FREQUENTS
DELETE /api/memory/relationships/frequents/{rel_id}     - Delete FREQUENTS
```

---

### Frontend Implementation

**File:** `packages/web/src/components/memory/OwnsContextPanel.tsx`

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, Badge, Timeline } from '@fidus/ui';
import { getOwnsRelationship, getContextHistory } from '@/lib/api/memory';

interface OwnsContextPanelProps {
  objectId: string;
}

export function OwnsContextPanel({ objectId }: OwnsContextPanelProps) {
  const { data: ownership } = useQuery({
    queryKey: ['owns', objectId],
    queryFn: () => getOwnsRelationship(objectId)
  });

  const { data: contextHistory = [] } = useQuery({
    queryKey: ['owns-context', ownership?.relationship_instance_id],
    queryFn: () => getContextHistory('owns', ownership!.relationship_instance_id),
    enabled: !!ownership
  });

  if (!ownership) {
    return <div>No ownership data</div>;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-4">Ownership Context</h3>

      <div className="space-y-4">
        <div>
          <label className="font-medium">Usage Purpose:</label>
          <Badge>{ownership.usage_purpose || 'Not specified'}</Badge>
        </div>

        <div>
          <label className="font-medium">Condition:</label>
          <span className="ml-2">{ownership.condition || 'Unknown'}</span>
        </div>

        <div>
          <label className="font-medium">Location Stored:</label>
          <span className="ml-2">{ownership.location_stored || 'Not specified'}</span>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-medium mb-2">Context History</h4>
        <Timeline>
          {contextHistory.map((ctx, idx) => (
            <Timeline.Item key={idx}>
              <div className="text-sm">
                <div className="font-medium">
                  {new Date(ctx.timestamp).toLocaleDateString()}
                </div>
                <div className="text-gray-600">
                  Mood: {ctx.mood}, Activity: {ctx.activity}
                </div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </Card>
  );
}
```

---

### Testing Requirements

**Integration Test:**

```python
@pytest.mark.asyncio
async def test_owns_relationship_qdrant_first_pattern(qdrant, neo4j, tenant_id, user_id):
    """Test OWNS relationship follows Qdrant-First pattern"""
    service = OwnsRelationshipService(qdrant, neo4j)

    # Create relationship
    rel_data = OwnsRelationshipCreate(
        object_id="obj_123",
        usage_purpose="work",
        condition="new",
        context={
            "emotion": "excited",
            "activity": "unboxing",
            "location": "home"
        }
    )

    owns = await service.create_owns_relationship(tenant_id, user_id, rel_data)

    # Verify Qdrant has context
    points = qdrant.retrieve("situations", ids=[owns.situation_id])
    assert len(points) == 1
    assert points[0].payload["context"]["emotion"] == "excited"

    # Verify Neo4j has relationship with situation_id reference
    async with neo4j.session() as session:
        result = await session.run(
            "MATCH ()-[r:OWNS {relationship_instance_id: $rel_id}]->() RETURN r",
            rel_id=owns.relationship_instance_id
        )
        record = await result.single()
        assert record["r"]["situation_id"] == owns.situation_id
        assert record["r"]["usage_purpose"] == "work"
```

---

## Implementation Guidelines

### Must Follow

1. **Qdrant-First Pattern:**
   - Store context in Qdrant FIRST
   - Create Neo4j relationship SECOND
   - Rollback Qdrant on Neo4j failure

2. **Feature Flags:**
   - `ENABLE_OWNS_RELATIONSHIP`
   - `ENABLE_FREQUENTS_RELATIONSHIP`

3. **Context Properties:**
   - OWNS: usage_purpose, condition, location_stored
   - FREQUENTS: frequency, last_visit, visit_count, purpose

4. **Error Handling:**
   - Rollback Qdrant if Neo4j fails
   - Log errors with relationship_instance_id

### Must NOT Do

- Skip Qdrant-First pattern
- Store full context in Neo4j
- Miss rollback logic

---

## Verification Checklist

### Functionality
- [ ] User can create OWNS relationship with context
- [ ] User can create FREQUENTS relationship
- [ ] Context stored in Qdrant, situation_id in Neo4j
- [ ] Rollback works on Neo4j failure
- [ ] Context history retrievable

### Code Quality
- [ ] Follows KNOWS pattern (Package 3.1)
- [ ] Type hints complete
- [ ] No linting errors

### Testing
- [ ] Integration tests pass (Qdrant-First)
- [ ] Rollback tests pass
- [ ] E2E tests pass

---

## Success Criteria

This package is **successfully implemented** when:

1. User can create OWNS relationship (User → Object)
2. User can create FREQUENTS relationship (User → Location)
3. Situational context stored in Qdrant
4. Neo4j relationships have situation_id references
5. Rollback works on failures
6. All tests pass
7. Relationship coverage: 8/9 (89%)

---

**Prompt Version:** 1.0
**Generated:** 2025-11-21
**Target Package:** 5.3 - OWNS & FREQUENTS Relationships

---

**END OF IMPLEMENTATION PROMPT**

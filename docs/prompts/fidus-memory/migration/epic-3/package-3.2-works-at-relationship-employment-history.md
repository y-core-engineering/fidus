# Implementation Prompt: 3.2 - WORKS_AT Relationship with Employment History

**Package:** 3.2
**Epic:** Core Relationships & Graph Visualization
**Priority:** 🔴 CRITICAL
**Context Document:** `/docs/prototypes/fidus-memory/migration-v3-wbs.md` (Lines 617-665)

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

**Frontend Expertise:**
- **Next.js 14:** App Router, Server Components, Client Components, Server Actions
- **React 18:** Hooks (useState, useEffect, useContext, custom hooks), performance optimization
- **TypeScript 5+:** Advanced types, generics, type inference, branded types
- **UI Libraries:** @fidus/ui design system components, Tailwind CSS
- **Data Fetching:** TanStack Query (React Query), SWR, fetch API
- **Testing:** Playwright (E2E), Vitest (unit), Testing Library (component)

**Architecture Patterns:**
- **Qdrant-First Pattern (ADR-0001):** Qdrant as PRIMARY, Neo4j as SECONDARY with references
- **Vertical Slicing:** Backend + API + Frontend + Tests in single deliverable
- **Feature Flags:** Gradual rollout, A/B testing, instant rollback
- **Multi-Tenancy:** tenant_id scoping, data isolation
- **GDPR Compliance:** Right to erasure, data portability

---

## Context & Background

**Current State:**
- ✅ Package 1.1 (Qdrant-First) completed: Context storage pattern established
- ✅ Package 1.2 (User entity) completed: User aggregate root operational
- ✅ Package 2.2 (Organization entity) completed: Organization entities can be created and managed
- ✅ Package 3.1 (KNOWS relationship) completed: Base relationship pattern established
- ❌ No employment relationships exist between User and Organization
- ❌ No employment history tracking

**Migration Goal:**
- Implement WORKS_AT relationship to connect User to Organization entities
- Track employment history with start/end dates
- Store work context (mood, stress level, activity) in Qdrant following ADR-0001
- Build UI for employment timeline and current employer display
- Enable context-based work pattern analysis

**Architecture References:**
- Solution Architecture: `/docs/solution-architecture/15-entity-management.md`
- ADR-0001: `/docs/adr/ADR-0001-situational-context-as-relationship-qualifier.md` (Qdrant-First Pattern)
- ADR-0002: `/docs/adr/ADR-0002-property-placement-and-geospatial-exception.md` (Property Placement Strategy)
- Base Relationship Pattern: `packages/api/fidus/memory/entities/relationship.py` (from Package 3.1)

---

## Your Task

Implement **WORKS_AT Relationship with Employment History** according to the specifications below.

**User Story:**
As a user, I want to track my employment history and the system to understand my work context when making suggestions.

**Acceptance Criteria:**
1. Backend: WORKS_AT relationship with ADR-0002 compliant property placement
2. Backend: Neo4j stores ONLY structural + temporal properties (relationship_instance_id, situation_id, started_at, ended_at, observed_at, confidence, source)
3. Backend: Qdrant stores ALL context properties (role, department, employment_type, work_mood, stress_level, activity)
4. Backend: Temporal boundaries (started_at, ended_at) enable efficient "employment during period X" queries
5. API: WORKS_AT CRUD endpoints operational
6. Frontend: Employment history timeline component showing temporal boundaries
7. Frontend: Current employer badge on profile (where ended_at IS NULL)
8. Tests: Create WORKS_AT, query by date range, track context changes over time - all passing
9. Documentation: Employment tracking guide updated with ADR-0002 references

---

## Technical Specification

### Backend Implementation

**Files to Create:**

1. **`packages/api/fidus/memory/relationships/works_at.py`**
   - Purpose: WORKS_AT-specific relationship model
   - Extends: `RelationshipBase` from Package 3.1

2. **`packages/api/fidus/memory/services/works_at_relationship_service.py`**
   - Purpose: Business logic for employment relationships
   - Implements: Qdrant-First pattern, employment history queries

3. **`packages/api/fidus/memory/routes/works_at_routes.py`**
   - Purpose: FastAPI endpoints for WORKS_AT relationships

**Detailed Implementation:**

#### 1. WORKS_AT Relationship Model (`packages/api/fidus/memory/relationships/works_at.py`)

```python
from datetime import datetime, date
from typing import Optional, Literal, Dict, Any
from pydantic import BaseModel, Field

from fidus.memory.entities.relationship import RelationshipBase


class WorksAtRelationship(RelationshipBase):
    """
    WORKS_AT relationship connecting User to Organization.

    Following ADR-0002: Temporal boundaries (started_at, ended_at) in Neo4j.
    Context properties (role, department, employment_type) in Qdrant ONLY.
    """
    # Entity references (structural)
    user_id: str
    organization_id: str

    # Temporal boundaries (ADR-0002: stored in Neo4j for efficient queries)
    started_at: date = Field(..., description="Employment start date")
    ended_at: Optional[date] = Field(None, description="Employment end date (null = current)")

    @property
    def is_current(self) -> bool:
        """Check if this is an active employment."""
        return self.ended_at is None

    @property
    def duration_days(self) -> int:
        """Calculate employment duration in days."""
        from datetime import datetime
        end = datetime.combine(self.ended_at, datetime.min.time()) if self.ended_at else datetime.utcnow()
        start = datetime.combine(self.started_at, datetime.min.time())
        return (end - start).days

    class Config:
        json_schema_extra = {
            "example": {
                "relationship_instance_id": "550e8400-e29b-41d4-a716-446655440000",
                "situation_id": "sit_work_123",
                "user_id": "user_123",
                "organization_id": "org_anthropic",
                "started_at": "2023-01-15",
                "ended_at": None,
                "observed_at": "2025-11-21T10:30:00Z",
                "confidence": 1.0,
                "source": "explicit"
            }
        }


class WorksAtContext(BaseModel):
    """
    Context properties for WORKS_AT relationships (stored in Qdrant).

    Following ADR-0002: ALL descriptive/contextual properties in Qdrant.
    Temporal boundaries copied here for completeness.
    """
    role: str = Field(..., description="Job title or role")
    department: Optional[str] = Field(None, description="Department or team")
    employment_type: Literal["full-time", "part-time", "contract", "intern"] = "full-time"

    # Temporal boundaries (copied from Neo4j for completeness)
    started_at: str = Field(..., description="Employment start date ISO format")
    ended_at: Optional[str] = Field(None, description="Employment end date ISO format")

    # Flexible context factors (work mood, stress, activity, etc.)
    context: Dict[str, Any] = Field(default_factory=dict)
```

#### 2. WORKS_AT Service (`packages/api/fidus/memory/services/works_at_relationship_service.py`)

```python
from typing import Dict, Any, List, Optional
from uuid import uuid4
from datetime import datetime
import logging

from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, Filter, FieldCondition, MatchValue
from neo4j import AsyncDriver

from fidus.memory.relationships.works_at import WorksAtRelationship
from fidus.memory.entities.relationship import RelationshipContext

logger = logging.getLogger(__name__)


class WorksAtRelationshipService:
    """
    Service for managing WORKS_AT relationships following Qdrant-First pattern.

    Handles employment history tracking and work context analysis.
    """

    def __init__(self, qdrant: QdrantClient, neo4j: AsyncDriver):
        self.qdrant = qdrant
        self.neo4j = neo4j
        self.collection_name = "situations"

    async def create_works_at_relationship(
        self,
        tenant_id: str,
        user_id: str,
        organization_id: str,
        role: str,
        department: Optional[str] = None,
        employment_type: str = "full-time",
        started_at: Optional[datetime] = None,
        ended_at: Optional[datetime] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> WorksAtRelationship:
        """
        Create WORKS_AT relationship with Qdrant-First pattern.

        Args:
            tenant_id: Tenant identifier
            user_id: User entity ID
            organization_id: Organization entity ID
            role: Job title/role
            department: Department or team name
            employment_type: Type of employment
            started_at: Employment start date (defaults to now)
            ended_at: Employment end date (None = current)
            context: Work context (mood, stress_level, activity, etc.)

        Returns:
            WorksAtRelationship with situation_id populated
        """
        situation_id = f"sit_{uuid4().hex}"
        relationship_instance_id = uuid4()
        started_at = started_at or datetime.utcnow()

        # Build context payload
        context_data = RelationshipContext(
            tenant_id=tenant_id,
            user_id=user_id,
            entity_id=organization_id,
            relationship_type="WORKS_AT",
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
                    "entity_id": organization_id,
                    "relationship_type": "WORKS_AT",
                    "relationship_instance_id": str(relationship_instance_id),
                    "role": role,
                    "department": department,
                    "employment_type": employment_type,
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

            logger.info(f"Stored work context in Qdrant: {situation_id}")

        except Exception as e:
            logger.error(f"Failed to store in Qdrant: {e}")
            raise RuntimeError(f"Qdrant storage failed: {e}")

        # Step 2: Create Neo4j relationship (SECONDARY)
        # Following ADR-0002: ONLY structural + temporal boundary properties
        try:
            query = """
            MATCH (u:User {id: $user_id, tenant_id: $tenant_id})
            MATCH (o:Organization {id: $org_id, tenant_id: $tenant_id})
            CREATE (u)-[r:WORKS_AT {
                relationship_instance_id: $rel_id,
                situation_id: $sit_id,
                started_at: date($started_at),
                ended_at: CASE WHEN $ended_at IS NOT NULL THEN date($ended_at) ELSE NULL END,
                observed_at: datetime(),
                confidence: $confidence,
                source: $source
            }]->(o)
            RETURN r
            """

            async with self.neo4j.session() as session:
                await session.run(
                    query,
                    tenant_id=tenant_id,
                    user_id=user_id,
                    org_id=organization_id,
                    rel_id=str(relationship_instance_id),
                    sit_id=situation_id,
                    started_at=started_at.isoformat() if isinstance(started_at, datetime) else started_at.strftime('%Y-%m-%d'),
                    ended_at=ended_at.isoformat() if ended_at and isinstance(ended_at, datetime) else (ended_at.strftime('%Y-%m-%d') if ended_at else None),
                    confidence=1.0,
                    source="explicit"
                )

            logger.info(f"Created Neo4j WORKS_AT: {relationship_instance_id}")

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
        return WorksAtRelationship(
            relationship_instance_id=relationship_instance_id,
            situation_id=situation_id,
            user_id=user_id,
            organization_id=organization_id,
            started_at=started_at if isinstance(started_at, date) else started_at.date(),
            ended_at=ended_at.date() if ended_at and isinstance(ended_at, datetime) else ended_at,
            observed_at=datetime.utcnow(),
            confidence=1.0,
            source="explicit"
        )

    async def get_current_employer(
        self,
        tenant_id: str,
        user_id: str
    ) -> Optional[WorksAtRelationship]:
        """
        Get user's current employer (WORKS_AT with ended_at = NULL).

        Following ADR-0002: Returns structural + temporal properties.
        Use get_employment_with_context() to retrieve context from Qdrant.
        """
        query = """
        MATCH (u:User {id: $user_id, tenant_id: $tenant_id})-[r:WORKS_AT]->(o:Organization)
        WHERE r.ended_at IS NULL
        RETURN r, o
        ORDER BY r.started_at DESC
        LIMIT 1
        """

        async with self.neo4j.session() as session:
            result = await session.run(query, tenant_id=tenant_id, user_id=user_id)
            record = await result.single()

            if not record:
                return None

            rel = record["r"]
            return WorksAtRelationship(
                relationship_instance_id=rel["relationship_instance_id"],
                situation_id=rel["situation_id"],
                user_id=user_id,
                organization_id=record["o"]["id"],
                started_at=rel["started_at"],
                ended_at=rel.get("ended_at"),
                observed_at=rel["observed_at"],
                confidence=rel["confidence"],
                source=rel["source"]
            )

    async def get_employment_history(
        self,
        tenant_id: str,
        user_id: str
    ) -> List[WorksAtRelationship]:
        """
        Get chronological employment history for user.

        Following ADR-0002: Returns structural + temporal properties only.
        """
        query = """
        MATCH (u:User {id: $user_id, tenant_id: $tenant_id})-[r:WORKS_AT]->(o:Organization)
        RETURN r, o
        ORDER BY r.started_at DESC
        """

        async with self.neo4j.session() as session:
            result = await session.run(query, tenant_id=tenant_id, user_id=user_id)
            records = await result.data()

            history = []
            for record in records:
                rel = record["r"]
                history.append(WorksAtRelationship(
                    relationship_instance_id=rel["relationship_instance_id"],
                    situation_id=rel["situation_id"],
                    user_id=user_id,
                    organization_id=record["o"]["id"],
                    started_at=rel["started_at"],
                    ended_at=rel.get("ended_at"),
                    observed_at=rel["observed_at"],
                    confidence=rel["confidence"],
                    source=rel["source"]
                ))

            return history

    async def get_employment_during_period(
        self,
        tenant_id: str,
        user_id: str,
        start_date: date,
        end_date: date
    ) -> List[Dict[str, Any]]:
        """
        Temporal Query Pattern (ADR-0002): Find employments during a date range.

        This demonstrates WHY temporal boundaries are stored in Neo4j:
        Efficient date range queries without full Qdrant scan.

        Example: "Who worked at Anthropic in 2023?"
        """
        query = """
        MATCH (u:User {id: $user_id, tenant_id: $tenant_id})-[r:WORKS_AT]->(o:Organization)
        WHERE r.started_at <= date($end_date)
          AND (r.ended_at IS NULL OR r.ended_at >= date($start_date))
        RETURN
            r.relationship_instance_id AS rel_id,
            r.situation_id AS sit_id,
            r.started_at AS started_at,
            r.ended_at AS ended_at,
            r.confidence AS confidence,
            o.id AS org_id,
            o.name AS org_name
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
                    "organization_id": record["org_id"],
                    "organization_name": record["org_name"],
                    "started_at": record["started_at"],
                    "ended_at": record["ended_at"],
                    "confidence": record["confidence"],
                    # Context from Qdrant
                    "role": context.get("role"),
                    "department": context.get("department"),
                    "employment_type": context.get("employment_type"),
                    "work_mood": context.get("context", {}).get("work_mood"),
                    "stress_level": context.get("context", {}).get("stress_level")
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

**File: `packages/api/fidus/memory/routes/works_at_routes.py`**

```python
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from fidus.memory.services.works_at_relationship_service import WorksAtRelationshipService
from fidus.memory.relationships.works_at import WorksAtRelationship
from fidus.dependencies import get_qdrant_client, get_neo4j_driver, get_current_user

router = APIRouter(prefix="/api/memory/relationships/works-at", tags=["relationships"])


class CreateWorksAtRequest(BaseModel):
    user_id: str
    organization_id: str
    role: str
    department: Optional[str] = None
    employment_type: str = "full-time"
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    context: Optional[dict] = None


@router.post("", response_model=WorksAtRelationship)
async def create_works_at_relationship(
    request: CreateWorksAtRequest,
    service: WorksAtRelationshipService = Depends(lambda: WorksAtRelationshipService(
        qdrant=get_qdrant_client(),
        neo4j=get_neo4j_driver()
    )),
    current_user = Depends(get_current_user)
):
    """
    Create WORKS_AT relationship with work context.

    Tracks employment with start/end dates and contextual factors.
    """
    try:
        relationship = await service.create_works_at_relationship(
            tenant_id=current_user.tenant_id,
            user_id=request.user_id,
            organization_id=request.organization_id,
            role=request.role,
            department=request.department,
            employment_type=request.employment_type,
            started_at=request.started_at,
            ended_at=request.ended_at,
            context=request.context
        )
        return relationship
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/current", response_model=Optional[WorksAtRelationship])
async def get_current_employer(
    user_id: str,
    service: WorksAtRelationshipService = Depends(lambda: WorksAtRelationshipService(
        qdrant=get_qdrant_client(),
        neo4j=get_neo4j_driver()
    )),
    current_user = Depends(get_current_user)
):
    """Get user's current employer (WORKS_AT with no end date)."""
    return await service.get_current_employer(
        tenant_id=current_user.tenant_id,
        user_id=user_id
    )


@router.get("/history", response_model=List[WorksAtRelationship])
async def get_employment_history(
    user_id: str,
    service: WorksAtRelationshipService = Depends(lambda: WorksAtRelationshipService(
        qdrant=get_qdrant_client(),
        neo4j=get_neo4j_driver()
    )),
    current_user = Depends(get_current_user)
):
    """Get chronological employment history."""
    return await service.get_employment_history(
        tenant_id=current_user.tenant_id,
        user_id=user_id
    )
```

---

### Frontend Implementation

**Components to Create:**

#### 1. **`packages/web/src/components/memory/EmploymentTimeline.tsx`**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Card } from '@fidus/ui';
import { getEmploymentHistory } from '@/lib/api/memory';

interface Employment {
  id: string;
  organization: { id: string; name: string };
  role: string;
  department?: string;
  employment_type: string;
  started_at: string;
  ended_at?: string;
}

interface EmploymentTimelineProps {
  userId: string;
}

export function EmploymentTimeline({ userId }: EmploymentTimelineProps) {
  const [history, setHistory] = useState<Employment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [userId]);

  async function loadHistory() {
    try {
      const data = await getEmploymentHistory(userId);
      setHistory(data);
    } catch (error) {
      console.error('Failed to load employment history:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatDuration(started: string, ended?: string): string {
    const start = new Date(started);
    const end = ended ? new Date(ended) : new Date();
    const months = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) return `${remainingMonths} months`;
    if (remainingMonths === 0) return `${years} ${years === 1 ? 'year' : 'years'}`;
    return `${years}y ${remainingMonths}m`;
  }

  if (loading) return <Card>Loading...</Card>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Employment History</h2>

      <div className="relative border-l-2 border-gray-200 pl-8 space-y-6">
        {history.map((job, idx) => (
          <div key={job.id} className="relative">
            {/* Timeline dot */}
            <div className={`absolute -left-10 w-4 h-4 rounded-full ${
              !job.ended_at ? 'bg-green-500' : 'bg-gray-400'
            }`} />

            <Card className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{job.role}</h3>
                  <p className="text-gray-600">{job.organization.name}</p>
                  {job.department && (
                    <p className="text-sm text-gray-500">{job.department}</p>
                  )}
                </div>
                {!job.ended_at && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                    Current
                  </span>
                )}
              </div>

              <div className="mt-2 text-sm text-gray-500">
                <p>
                  {new Date(job.started_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  {' '}-{' '}
                  {job.ended_at
                    ? new Date(job.ended_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    : 'Present'
                  }
                </p>
                <p className="text-gray-400">
                  {formatDuration(job.started_at, job.ended_at)}
                </p>
              </div>

              <div className="mt-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  job.employment_type === 'full-time' ? 'bg-blue-100 text-blue-800' :
                  job.employment_type === 'part-time' ? 'bg-purple-100 text-purple-800' :
                  job.employment_type === 'contract' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {job.employment_type}
                </span>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### 2. **`packages/web/src/components/memory/WorksAtForm.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, TextField, Select, Card } from '@fidus/ui';
import { createWorksAtRelationship } from '@/lib/api/memory';

interface WorksAtFormProps {
  userId: string;
  organizationId?: string;
  initialData?: any;
}

export function WorksAtForm({ userId, organizationId, initialData }: WorksAtFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    organization_id: organizationId || '',
    role: initialData?.role || '',
    department: initialData?.department || '',
    employment_type: initialData?.employment_type || 'full-time',
    started_at: initialData?.started_at || '',
    ended_at: initialData?.ended_at || '',
    context: {
      mood: '',
      stress_level: '',
      activity: ''
    }
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await createWorksAtRelationship({
        user_id: userId,
        organization_id: formData.organization_id,
        role: formData.role,
        department: formData.department || undefined,
        employment_type: formData.employment_type,
        started_at: formData.started_at ? new Date(formData.started_at).toISOString() : undefined,
        ended_at: formData.ended_at ? new Date(formData.ended_at).toISOString() : undefined,
        context: formData.context
      });

      router.push('/memory/profile');
    } catch (error) {
      console.error('Failed to create employment:', error);
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Add Employment</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Role / Job Title"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          placeholder="e.g., Senior Software Engineer"
          required
        />

        <TextField
          label="Department"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          placeholder="e.g., AI Safety"
        />

        <Select
          label="Employment Type"
          value={formData.employment_type}
          onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
        >
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="intern">Intern</option>
        </Select>

        <TextField
          label="Start Date"
          type="date"
          value={formData.started_at}
          onChange={(e) => setFormData({ ...formData, started_at: e.target.value })}
          required
        />

        <TextField
          label="End Date (leave empty if current)"
          type="date"
          value={formData.ended_at}
          onChange={(e) => setFormData({ ...formData, ended_at: e.target.value })}
        />

        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Work Context</h3>

          <TextField
            label="Mood"
            value={formData.context.mood}
            onChange={(e) => setFormData({
              ...formData,
              context: { ...formData.context, mood: e.target.value }
            })}
            placeholder="e.g., productive, stressed, motivated"
          />

          <TextField
            label="Stress Level"
            value={formData.context.stress_level}
            onChange={(e) => setFormData({
              ...formData,
              context: { ...formData.context, stress_level: e.target.value }
            })}
            placeholder="e.g., low, medium, high"
          />

          <TextField
            label="Activity"
            value={formData.context.activity}
            onChange={(e) => setFormData({
              ...formData,
              context: { ...formData.context, activity: e.target.value }
            })}
            placeholder="e.g., coding, meetings, planning"
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit">Save Employment</Button>
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
```

#### 3. **Update UserProfile Component**

Add current employer badge:

```typescript
// packages/web/src/components/memory/UserProfile.tsx

import { useEffect, useState } from 'react';
import { Card, Badge } from '@fidus/ui';
import { getCurrentEmployer } from '@/lib/api/memory';

export function UserProfile({ userId }: { userId: string }) {
  const [currentEmployer, setCurrentEmployer] = useState<any>(null);

  useEffect(() => {
    loadCurrentEmployer();
  }, [userId]);

  async function loadCurrentEmployer() {
    try {
      const employer = await getCurrentEmployer(userId);
      setCurrentEmployer(employer);
    } catch (error) {
      console.error('Failed to load current employer:', error);
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold">Profile</h2>

      {currentEmployer && (
        <div className="mt-4 flex items-center gap-2">
          <Badge variant="success">
            {currentEmployer.role} at {currentEmployer.organization.name}
          </Badge>
        </div>
      )}

      {/* ... rest of profile ... */}
    </Card>
  );
}
```

#### 4. **API Client (`packages/web/src/lib/api/memory.ts`)**

```typescript
// Add to existing memory.ts file

export async function createWorksAtRelationship(data: any) {
  const response = await fetch(`${API_BASE}/api/memory/relationships/works-at`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include'
  });

  if (!response.ok) throw new Error('Failed to create employment');
  return response.json();
}

export async function getCurrentEmployer(userId: string) {
  const response = await fetch(
    `${API_BASE}/api/memory/relationships/works-at/current?user_id=${userId}`,
    { credentials: 'include' }
  );

  if (!response.ok) throw new Error('Failed to load current employer');
  return response.json();
}

export async function getEmploymentHistory(userId: string) {
  const response = await fetch(
    `${API_BASE}/api/memory/relationships/works-at/history?user_id=${userId}`,
    { credentials: 'include' }
  );

  if (!response.ok) throw new Error('Failed to load employment history');
  return response.json();
}
```

---

### Testing Requirements

**Integration Test:**

```python
# packages/api/tests/integration/memory/test_works_at_service.py

import pytest
from datetime import datetime
from fidus.memory.services.works_at_relationship_service import WorksAtRelationshipService


@pytest.mark.asyncio
async def test_create_works_at_and_get_current(mock_qdrant, mock_neo4j):
    """Test creating WORKS_AT and retrieving current employer."""
    service = WorksAtRelationshipService(qdrant=mock_qdrant, neo4j=mock_neo4j)

    # Create current employment
    relationship = await service.create_works_at_relationship(
        tenant_id="tenant_123",
        user_id="user_456",
        organization_id="org_anthropic",
        role="Senior Software Engineer",
        department="AI Safety",
        employment_type="full-time",
        started_at=datetime(2023, 1, 15),
        ended_at=None,  # Current
        context={"mood": "productive", "stress_level": "medium"}
    )

    assert relationship.is_current is True
    assert relationship.role == "Senior Software Engineer"

    # Get current employer
    current = await service.get_current_employer(
        tenant_id="tenant_123",
        user_id="user_456"
    )

    assert current is not None
    assert current.organization_id == "org_anthropic"


@pytest.mark.asyncio
async def test_employment_history_chronological_order(mock_qdrant, mock_neo4j):
    """Test employment history returns in chronological order."""
    service = WorksAtRelationshipService(qdrant=mock_qdrant, neo4j=mock_neo4j)

    # Create multiple employments
    await service.create_works_at_relationship(
        tenant_id="tenant_123",
        user_id="user_456",
        organization_id="org_google",
        role="Software Engineer",
        started_at=datetime(2020, 1, 1),
        ended_at=datetime(2022, 12, 31)
    )

    await service.create_works_at_relationship(
        tenant_id="tenant_123",
        user_id="user_456",
        organization_id="org_anthropic",
        role="Senior SWE",
        started_at=datetime(2023, 1, 15),
        ended_at=None
    )

    history = await service.get_employment_history(
        tenant_id="tenant_123",
        user_id="user_456"
    )

    assert len(history) == 2
    # Newest first
    assert history[0].organization_id == "org_anthropic"
    assert history[1].organization_id == "org_google"
```

**E2E Test:**

```typescript
// packages/web/tests/e2e/memory/works-at-workflow.spec.ts

import { test, expect } from '@playwright/test';

test('User can add employment and see in history', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');

  // Navigate to profile
  await page.goto('/memory/profile');

  // Click "Add Employment"
  await page.click('button:has-text("Add Employment")');

  // Fill form
  await page.selectOption('select[name="organization"]', 'org_anthropic');
  await page.fill('input[name="role"]', 'Senior Software Engineer');
  await page.fill('input[name="department"]', 'AI Safety');
  await page.selectOption('select[name="employment_type"]', 'full-time');
  await page.fill('input[name="started_at"]', '2023-01-15');
  // Leave ended_at empty (current)

  await page.click('button:has-text("Save Employment")');

  // Verify redirect to profile
  await expect(page).toHaveURL('/memory/profile');

  // Verify badge appears
  const badge = page.locator('[data-testid="current-employer-badge"]');
  await expect(badge).toBeVisible();
  await expect(badge).toContainText('Senior Software Engineer at Anthropic');

  // Check employment history
  await page.click('button:has-text("View History")');

  const timeline = page.locator('[data-testid="employment-timeline"]');
  await expect(timeline).toBeVisible();

  const currentJob = timeline.locator('.employment-item').first();
  await expect(currentJob).toContainText('Current');
  await expect(currentJob).toContainText('Senior Software Engineer');
});


test('User can mark employment as ended', async ({ page }) => {
  await page.goto('/memory/profile');

  // Edit existing employment
  await page.click('[data-testid="edit-employment-btn"]');

  // Set end date
  await page.fill('input[name="ended_at"]', '2024-12-31');
  await page.click('button:has-text("Save")');

  // Verify badge disappears
  const badge = page.locator('[data-testid="current-employer-badge"]');
  await expect(badge).not.toBeVisible();

  // Verify still in history but not marked "Current"
  await page.click('button:has-text("View History")');
  const timeline = page.locator('[data-testid="employment-timeline"]');
  const job = timeline.locator('.employment-item').first();
  await expect(job).not.toContainText('Current');
});
```

---

## Implementation Guidelines

### Must Follow

1. **Qdrant-First Pattern:** Store work context in Qdrant before creating Neo4j relationship
2. **Feature Flag:** `ENABLE_WORKS_AT_RELATIONSHIP` - default disabled
3. **Multi-Tenancy:** Filter all queries by `tenant_id`
4. **Temporal Integrity:** Validate `started_at < ended_at` (if both provided)
5. **Current Employment:** Only one WORKS_AT with `ended_at = NULL` per user-organization pair

### Must NOT Do

- ❌ Allow multiple "current" employments to same organization
- ❌ Allow `started_at` in future
- ❌ Allow `ended_at` before `started_at`
- ❌ Skip rollback on Neo4j failure

---

## Dependencies & Prerequisites

**Required Before Starting:**
- [x] Package 1.1: Qdrant-First pattern established
- [x] Package 1.2: User entity operational
- [x] Package 2.2: Organization entity operational
- [x] Package 3.1: Base relationship pattern established
- [ ] Neo4j indexes: `CREATE INDEX works_at_user_idx FOR ()-[r:WORKS_AT]-() ON (r.user_id)`
- [ ] Feature flag: `ENABLE_WORKS_AT_RELATIONSHIP` added to config

---

## Success Criteria

1. ✅ User can add employment via UI
2. ✅ Current employer badge shows on profile
3. ✅ Employment timeline displays chronologically
4. ✅ Work context stored in Qdrant, referenced from Neo4j
5. ✅ All tests pass (unit, integration, E2E)
6. ✅ Documentation updated

---

**Prompt Version:** 1.0
**Generated:** 2025-11-21
**Target Package:** 3.2

---

**END OF IMPLEMENTATION PROMPT**

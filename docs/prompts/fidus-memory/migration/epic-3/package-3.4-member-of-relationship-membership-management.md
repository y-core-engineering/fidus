# Implementation Prompt: 3.4 - MEMBER_OF Relationship with Membership Management

**Package:** 3.4
**Epic:** Core Relationships & Graph Visualization
**Priority:** 🔴 CRITICAL
**Context Document:** `/docs/prototypes/fidus-memory/migration-v3-wbs.md` (Lines 716-768)

---

## Role

You are a **Senior Full-Stack Software Engineer** implementing organizational membership tracking distinct from employment relationships, following Qdrant-First pattern.

---

## Context & Background

**Current State:**
- ✅ Package 1.1 (Qdrant-First) completed
- ✅ Package 1.2 (User entity) completed
- ✅ Package 2.2 (Organization entity) completed
- ✅ Package 3.2 (WORKS_AT relationship) completed: Employment tracking operational
- ❌ No way to distinguish membership (clubs, communities) from employment
- ❌ No membership management UI

**Migration Goal:**
- Implement MEMBER_OF relationship for non-employment affiliations (clubs, associations, communities)
- Clearly distinguish from WORKS_AT (employment) in data model and UI
- Track membership properties: role, type, joined date, status, involvement level
- Store participation context in Qdrant (frequency, contribution type, satisfaction)
- Build UI showing membership badges and organization member lists

**Architecture References:**
- Solution Architecture: `/docs/solution-architecture/15-entity-management.md`
- ADR-0001: `/docs/adr/ADR-0001-situational-context-as-relationship-qualifier.md` (Qdrant-First Pattern)
- ADR-0002: `/docs/adr/ADR-0002-property-placement-and-geospatial-exception.md` (Property Placement Strategy)
- Base Relationship Pattern: `packages/api/fidus/memory/entities/relationship.py` (from Package 3.1)
- WORKS_AT Pattern: `packages/api/fidus/memory/relationships/works_at.py` (for comparison)

---

## Your Task

Implement **MEMBER_OF Relationship with Membership Management** according to the specifications below.

**User Story:**
As a user, I want to track my memberships in organizations (clubs, associations, communities) separately from employment so the system understands different types of organizational affiliations.

**Acceptance Criteria:**
1. Backend: MEMBER_OF relationship with ADR-0002 compliant property placement
2. Backend: Neo4j stores ONLY structural + temporal properties (relationship_instance_id, situation_id, joined_at, left_at, observed_at, confidence, source)
3. Backend: Qdrant stores ALL context properties (role, membership_type, status, involvement_level, participation_frequency, contribution_type, satisfaction)
4. Backend: Temporal boundaries (joined_at, left_at) enable efficient "memberships during period X" queries
5. API: MEMBER_OF CRUD endpoints operational
6. Frontend: Membership badges on UserProfile (visually distinct from employment)
7. Frontend: Organization detail shows members list
8. Frontend: Visual distinction from WORKS_AT (different icon/color)
9. Tests: Create membership, verify distinct from employment, query by date range - all passing
10. Documentation: Membership tracking guide updated with ADR-0002 references

---

## Technical Specification

### Backend Implementation

**File: `packages/api/fidus/memory/relationships/member_of.py`**

```python
from datetime import datetime, date
from typing import Optional, Literal, Dict, Any
from pydantic import BaseModel, Field

from fidus.memory.entities.relationship import RelationshipBase


class MemberOfRelationship(RelationshipBase):
    """
    MEMBER_OF relationship connecting User to Organization.

    Represents non-employment affiliations like club memberships,
    community participation, association membership.

    Following ADR-0002: Temporal boundaries (joined_at, left_at) in Neo4j.
    Context properties (role, membership_type, status, involvement_level) in Qdrant ONLY.

    DISTINCTION from WORKS_AT:
    - WORKS_AT = Employment (salary, formal role, work obligations)
    - MEMBER_OF = Voluntary participation (clubs, communities, associations)
    """
    # Entity references (structural)
    user_id: str
    organization_id: str

    # Temporal boundaries (ADR-0002: stored in Neo4j for efficient queries)
    joined_at: date = Field(..., description="Membership start date")
    left_at: Optional[date] = Field(None, description="Membership end date (null = active member)")

    @property
    def is_active(self) -> bool:
        """Check if this is an active membership."""
        return self.left_at is None

    @property
    def duration_days(self) -> int:
        """Calculate membership duration in days."""
        from datetime import datetime
        end = datetime.combine(self.left_at, datetime.min.time()) if self.left_at else datetime.utcnow()
        start = datetime.combine(self.joined_at, datetime.min.time())
        return (end - start).days

    class Config:
        json_schema_extra = {
            "example": {
                "relationship_instance_id": "550e8400-e29b-41d4-a716-446655440000",
                "situation_id": "sit_member_123",
                "user_id": "user_123",
                "organization_id": "org_chess_club",
                "joined_at": "2024-01-01",
                "left_at": None,
                "observed_at": "2025-11-21T10:30:00Z",
                "confidence": 1.0,
                "source": "explicit"
            }
        }


class MemberOfContext(BaseModel):
    """
    Context properties for MEMBER_OF relationships (stored in Qdrant).

    Following ADR-0002: ALL descriptive/contextual properties in Qdrant.
    Temporal boundaries copied here for completeness.
    """
    role: Optional[str] = Field(
        None,
        description="Membership role: member, board member, volunteer, contributor"
    )
    membership_type: Literal["active", "honorary", "alumni", "supporter"] = "active"
    status: Literal["active", "inactive", "pending"] = "active"
    involvement_level: Optional[Literal["high", "medium", "low"]] = Field(
        None,
        description="Level of participation/involvement"
    )

    # Temporal boundaries (copied from Neo4j for completeness)
    joined_at: str = Field(..., description="Membership start date ISO format")
    left_at: Optional[str] = Field(None, description="Membership end date ISO format")

    # Flexible context factors (participation frequency, contribution type, satisfaction, etc.)
    context: Dict[str, Any] = Field(default_factory=dict)
```

**File: `packages/api/fidus/memory/services/member_of_relationship_service.py`**

```python
from typing import Dict, Any, List, Optional
from uuid import uuid4
from datetime import datetime, date
import logging

from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, Filter, FieldCondition, MatchValue
from neo4j import AsyncDriver

from fidus.memory.relationships.member_of import MemberOfRelationship
from fidus.memory.entities.relationship import RelationshipContext

logger = logging.getLogger(__name__)


class MemberOfRelationshipService:
    """
    Service for managing MEMBER_OF relationships (organizational memberships).

    Implements Qdrant-First pattern for participation context tracking.
    """

    def __init__(self, qdrant: QdrantClient, neo4j: AsyncDriver):
        self.qdrant = qdrant
        self.neo4j = neo4j
        self.collection_name = "situations"

    async def create_member_of_relationship(
        self,
        tenant_id: str,
        user_id: str,
        organization_id: str,
        role: Optional[str] = None,
        membership_type: str = "active",
        status: str = "active",
        involvement_level: Optional[str] = None,
        joined_at: Optional[datetime] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> MemberOfRelationship:
        """
        Create MEMBER_OF relationship with Qdrant-First pattern.

        Args:
            tenant_id: Tenant identifier
            user_id: User entity ID
            organization_id: Organization entity ID (club, community, etc.)
            role: Membership role (member, board member, volunteer, etc.)
            membership_type: Type (active, honorary, alumni, supporter)
            status: Membership status (active, inactive, pending)
            involvement_level: Participation level (high, medium, low)
            joined_at: Membership start date (defaults to now)
            context: Participation context (frequency, contribution, satisfaction)

        Returns:
            MemberOfRelationship with situation_id populated
        """
        situation_id = f"sit_{uuid4().hex}"
        relationship_instance_id = uuid4()
        joined_at = joined_at or datetime.utcnow()

        # Build context payload
        context_data = RelationshipContext(
            tenant_id=tenant_id,
            user_id=user_id,
            entity_id=organization_id,
            relationship_type="MEMBER_OF",
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
                    "relationship_type": "MEMBER_OF",
                    "relationship_instance_id": str(relationship_instance_id),
                    "role": role,
                    "membership_type": membership_type,
                    "status": status,
                    "involvement_level": involvement_level,
                    "joined_at": joined_at.isoformat(),
                    "left_at": None,
                    "context": context or {},
                    "created_at": datetime.utcnow().isoformat()
                }
            )

            await self.qdrant.upsert(
                collection_name=self.collection_name,
                points=[point]
            )

            logger.info(f"Stored membership context in Qdrant: {situation_id}")

        except Exception as e:
            logger.error(f"Qdrant storage failed: {e}")
            raise RuntimeError(f"Qdrant storage failed: {e}")

        # Step 2: Create Neo4j relationship (SECONDARY)
        # Following ADR-0002: ONLY structural + temporal boundary properties
        try:
            query = """
            MATCH (u:User {id: $user_id, tenant_id: $tenant_id})
            MATCH (o:Organization {id: $org_id, tenant_id: $tenant_id})
            CREATE (u)-[r:MEMBER_OF {
                relationship_instance_id: $rel_id,
                situation_id: $sit_id,
                joined_at: date($joined_at),
                left_at: CASE WHEN $left_at IS NOT NULL THEN date($left_at) ELSE NULL END,
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
                    joined_at=joined_at.isoformat() if isinstance(joined_at, datetime) else joined_at.strftime('%Y-%m-%d'),
                    left_at=None,  # New memberships are always active
                    confidence=1.0,
                    source="explicit"
                )

            logger.info(f"Created Neo4j MEMBER_OF: {relationship_instance_id}")

        except Exception as e:
            # Rollback Qdrant
            logger.error(f"Neo4j failed, rolling back: {e}")
            await self.qdrant.delete(
                collection_name=self.collection_name,
                points_selector=[situation_id]
            )
            raise RuntimeError(f"Neo4j failed, rolled back Qdrant: {e}")

        # Return relationship model (structural + temporal properties only)
        # Context is stored in Qdrant and can be retrieved separately
        return MemberOfRelationship(
            relationship_instance_id=relationship_instance_id,
            situation_id=situation_id,
            user_id=user_id,
            organization_id=organization_id,
            joined_at=joined_at if isinstance(joined_at, date) else joined_at.date(),
            left_at=None,
            observed_at=datetime.utcnow(),
            confidence=1.0,
            source="explicit"
        )

    async def get_active_memberships(
        self,
        tenant_id: str,
        user_id: str
    ) -> List[MemberOfRelationship]:
        """
        Get user's active memberships (left_at = NULL).

        Following ADR-0002: Returns structural + temporal properties.
        Use get_membership_with_context() to retrieve context from Qdrant.

        Returns:
            List of active MEMBER_OF relationships
        """
        query = """
        MATCH (u:User {id: $user_id, tenant_id: $tenant_id})-[r:MEMBER_OF]->(o:Organization)
        WHERE r.left_at IS NULL
        RETURN r, o
        ORDER BY r.joined_at DESC
        """

        async with self.neo4j.session() as session:
            result = await session.run(query, tenant_id=tenant_id, user_id=user_id)
            records = await result.data()

            memberships = []
            for record in records:
                rel = record["r"]
                memberships.append(MemberOfRelationship(
                    relationship_instance_id=rel["relationship_instance_id"],
                    situation_id=rel["situation_id"],
                    user_id=user_id,
                    organization_id=record["o"]["id"],
                    joined_at=rel["joined_at"],
                    left_at=rel.get("left_at"),
                    observed_at=rel["observed_at"],
                    confidence=rel["confidence"],
                    source=rel["source"]
                ))

            return memberships

    async def get_organization_members(
        self,
        tenant_id: str,
        organization_id: str,
        active_only: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Get all members of an organization.

        Args:
            tenant_id: Tenant identifier
            organization_id: Organization entity ID
            active_only: If True, only return active members (left_at IS NULL)

        Returns:
            List of members with relationship details
        """
        query = """
        MATCH (u:User {tenant_id: $tenant_id})-[r:MEMBER_OF]->(o:Organization {id: $org_id, tenant_id: $tenant_id})
        WHERE ($active_only = false OR r.left_at IS NULL)
        RETURN u, r
        ORDER BY r.joined_at DESC
        """

        async with self.neo4j.session() as session:
            result = await session.run(
                query,
                tenant_id=tenant_id,
                org_id=organization_id,
                active_only=active_only
            )
            records = await result.data()

            members = []
            for record in records:
                user = record["u"]
                rel = record["r"]
                members.append({
                    "user_id": user["id"],
                    "user_name": user.get("name"),
                    "joined_at": rel["joined_at"],
                    "left_at": rel.get("left_at"),
                    "is_active": rel.get("left_at") is None
                })

            return members

    async def get_memberships_active_during_period(
        self,
        tenant_id: str,
        user_id: str,
        start_date: date,
        end_date: date
    ) -> List[Dict[str, Any]]:
        """
        Temporal Query Pattern (ADR-0002): Find memberships during a date range.

        This demonstrates WHY temporal boundaries are stored in Neo4j:
        Efficient date range queries without full Qdrant scan.

        Example: "Which organizations was user a member of in 2023?"
        """
        query = """
        MATCH (u:User {id: $user_id, tenant_id: $tenant_id})-[r:MEMBER_OF]->(o:Organization)
        WHERE r.joined_at <= date($end_date)
          AND (r.left_at IS NULL OR r.left_at >= date($start_date))
        RETURN
            r.relationship_instance_id AS rel_id,
            r.situation_id AS sit_id,
            r.joined_at AS joined_at,
            r.left_at AS left_at,
            r.confidence AS confidence,
            o.id AS org_id,
            o.name AS org_name
        ORDER BY r.joined_at DESC
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
                    "joined_at": record["joined_at"],
                    "left_at": record["left_at"],
                    "confidence": record["confidence"],
                    # Context from Qdrant
                    "role": context.get("role"),
                    "membership_type": context.get("membership_type"),
                    "status": context.get("status"),
                    "involvement_level": context.get("involvement_level"),
                    "participation_frequency": context.get("context", {}).get("participation_frequency"),
                    "contribution_type": context.get("context", {}).get("contribution_type")
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

**File: `packages/api/fidus/memory/routes/member_of_routes.py`**

```python
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from fidus.memory.services.member_of_relationship_service import MemberOfRelationshipService
from fidus.memory.relationships.member_of import MemberOfRelationship
from fidus.dependencies import get_qdrant_client, get_neo4j_driver, get_current_user

router = APIRouter(prefix="/api/memory/relationships/member-of", tags=["relationships"])


class CreateMemberOfRequest(BaseModel):
    user_id: str
    organization_id: str
    role: Optional[str] = None
    membership_type: str = "active"
    status: str = "active"
    involvement_level: Optional[str] = None
    joined_at: Optional[datetime] = None
    context: Optional[dict] = None


@router.post("", response_model=MemberOfRelationship)
async def create_member_of_relationship(
    request: CreateMemberOfRequest,
    service: MemberOfRelationshipService = Depends(lambda: MemberOfRelationshipService(
        qdrant=get_qdrant_client(),
        neo4j=get_neo4j_driver()
    )),
    current_user = Depends(get_current_user)
):
    """
    Create MEMBER_OF relationship (organizational membership).

    Distinct from WORKS_AT (employment).
    Following ADR-0002: Context properties stored in Qdrant.
    """
    try:
        return await service.create_member_of_relationship(
            tenant_id=current_user.tenant_id,
            user_id=request.user_id,
            organization_id=request.organization_id,
            role=request.role,
            membership_type=request.membership_type,
            status=request.status,
            involvement_level=request.involvement_level,
            joined_at=request.joined_at,
            context=request.context
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("", response_model=List[MemberOfRelationship])
async def get_active_memberships(
    user_id: str,
    active: bool = True,
    service: MemberOfRelationshipService = Depends(lambda: MemberOfRelationshipService(
        qdrant=get_qdrant_client(),
        neo4j=get_neo4j_driver()
    )),
    current_user = Depends(get_current_user)
):
    """Get user's memberships (default: active only)."""
    return await service.get_active_memberships(
        tenant_id=current_user.tenant_id,
        user_id=user_id
    )


@router.get("/organization/{organization_id}/members")
async def get_organization_members(
    organization_id: str,
    active_only: bool = True,
    service: MemberOfRelationshipService = Depends(lambda: MemberOfRelationshipService(
        qdrant=get_qdrant_client(),
        neo4j=get_neo4j_driver()
    )),
    current_user = Depends(get_current_user)
):
    """Get all members of an organization."""
    return await service.get_organization_members(
        tenant_id=current_user.tenant_id,
        organization_id=organization_id,
        active_only=active_only
    )
```

---

### Frontend Implementation

**Component: `packages/web/src/components/memory/MembershipBadge.tsx`**

```typescript
'use client';

import { Badge } from '@fidus/ui';
import { Users } from 'lucide-react'; // Group icon for memberships

interface MembershipBadgeProps {
  membership: {
    organization: { name: string };
    role?: string;
    membership_type: string;
    involvement_level?: string;
  };
}

export function MembershipBadge({ membership }: MembershipBadgeProps) {
  const getColorByType = (type: string) => {
    switch (type) {
      case 'active': return 'bg-green-100 text-green-800 border-green-300';
      case 'honorary': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'alumni': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'supporter': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${getColorByType(membership.membership_type)}`}>
      <Users size={16} />
      <span className="font-medium">
        {membership.role || 'Member'} at {membership.organization.name}
      </span>
      {membership.involvement_level && (
        <span className="text-xs opacity-75">
          ({membership.involvement_level} involvement)
        </span>
      )}
    </div>
  );
}
```

**Update UserProfile:**

```typescript
// packages/web/src/components/memory/UserProfile.tsx

import { MembershipBadge } from './MembershipBadge';
import { Briefcase, Users } from 'lucide-react';

export function UserProfile({ userId }: { userId: string }) {
  const [memberships, setMemberships] = useState([]);

  useEffect(() => {
    loadMemberships();
  }, [userId]);

  async function loadMemberships() {
    const data = await getActiveMemberships(userId);
    setMemberships(data);
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold">Profile</h2>

      {/* Employment (WORKS_AT) - Briefcase icon */}
      {currentEmployer && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <Briefcase size={16} />
            Employment
          </h3>
          <Badge variant="primary" className="mt-2">
            {currentEmployer.role} at {currentEmployer.organization.name}
          </Badge>
        </div>
      )}

      {/* Memberships (MEMBER_OF) - Group icon */}
      {memberships.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <Users size={16} />
            Memberships
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {memberships.map(membership => (
              <MembershipBadge key={membership.id} membership={membership} />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
```

**Update OrganizationDetail:**

```typescript
// packages/web/src/components/memory/OrganizationDetail.tsx

export function OrganizationDetail({ organizationId }: { organizationId: string }) {
  const [members, setMembers] = useState([]);
  const [employees, setEmployees] = useState([]);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2>{organization.name}</h2>

        {/* Employees (WORKS_AT) */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Briefcase size={20} />
            Employees ({employees.length})
          </h3>
          <div className="mt-2 space-y-2">
            {employees.map(emp => (
              <div key={emp.user_id} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                <span className="font-medium">{emp.user_name}</span>
                <span className="text-sm text-gray-600">- {emp.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Members (MEMBER_OF) */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users size={20} />
            Members ({members.length})
          </h3>
          <div className="mt-2 space-y-2">
            {members.map(member => (
              <div key={member.user_id} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                <span className="font-medium">{member.user_name}</span>
                <span className="text-sm text-gray-600">- {member.role || 'Member'}</span>
                {member.involvement_level && (
                  <Badge variant="success" size="sm">{member.involvement_level}</Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
```

**API Client:**

```typescript
// packages/web/src/lib/api/memory.ts

export async function getActiveMemberships(userId: string) {
  const response = await fetch(
    `${API_BASE}/api/memory/relationships/member-of?user_id=${userId}&active=true`,
    { credentials: 'include' }
  );
  if (!response.ok) throw new Error('Failed to load memberships');
  return response.json();
}

export async function getOrganizationMembers(organizationId: string) {
  const response = await fetch(
    `${API_BASE}/api/memory/relationships/member-of/organization/${organizationId}/members`,
    { credentials: 'include' }
  );
  if (!response.ok) throw new Error('Failed to load members');
  return response.json();
}
```

---

### Testing Requirements

**Integration Test:**

```python
@pytest.mark.asyncio
async def test_member_of_distinct_from_works_at():
    """Verify MEMBER_OF and WORKS_AT are distinct relationship types."""
    service_member = MemberOfRelationshipService(qdrant=qdrant, neo4j=neo4j)
    service_works = WorksAtRelationshipService(qdrant=qdrant, neo4j=neo4j)

    # Create both types to same organization
    await service_works.create_works_at_relationship(
        tenant_id="tenant_123",
        user_id="user_456",
        organization_id="org_tech_hub",
        role="Software Engineer"
    )

    await service_member.create_member_of_relationship(
        tenant_id="tenant_123",
        user_id="user_456",
        organization_id="org_tech_hub",
        role="community member"
    )

    # Query Neo4j: both should exist as separate relationships
    query = """
    MATCH (u:User {id: $user_id})-[r]->(o:Organization {id: $org_id})
    RETURN type(r) as rel_type
    """

    async with neo4j.session() as session:
        result = await session.run(query, user_id="user_456", org_id="org_tech_hub")
        records = await result.data()

    rel_types = [r["rel_type"] for r in records]
    assert "WORKS_AT" in rel_types
    assert "MEMBER_OF" in rel_types
```

**E2E Test:**

```typescript
test('Membership badge distinct from employment badge', async ({ page }) => {
  await page.goto('/memory/profile');

  // Should see employment badge with briefcase icon
  const employmentBadge = page.locator('[data-testid="employment-badge"]');
  await expect(employmentBadge.locator('svg[data-icon="briefcase"]')).toBeVisible();

  // Should see membership badge with group icon
  const membershipBadge = page.locator('[data-testid="membership-badge"]');
  await expect(membershipBadge.locator('svg[data-icon="users"]')).toBeVisible();

  // Visual distinction: different colors
  await expect(employmentBadge).toHaveCSS('background-color', 'rgb(59, 130, 246)'); // Blue
  await expect(membershipBadge).toHaveCSS('background-color', 'rgb(34, 197, 94)'); // Green
});
```

---

## Implementation Guidelines

### Must Follow

1. **ADR-0002 Compliance:**
   - Neo4j stores ONLY: relationship_instance_id, situation_id, joined_at, left_at, observed_at, confidence, source
   - Qdrant stores ALL context: role, membership_type, status, involvement_level, participation_frequency, contribution_type, satisfaction
   - Temporal boundaries (joined_at, left_at) enable efficient date range queries

2. **Clear Distinction:** MEMBER_OF ≠ WORKS_AT (different icons, colors, labels)
3. **Semantic Clarity:** Use "member", "club", "community" language (not "employee", "work")
4. **Multi-Membership:** Users can have multiple active memberships to same organization
5. **Qdrant-First Pattern:** Store membership context in Qdrant before creating Neo4j relationship
6. **Feature Flag:** `ENABLE_MEMBER_OF_RELATIONSHIP` - default disabled
7. **Multi-Tenancy:** Filter all queries by `tenant_id`
8. **Temporal Integrity:** Validate `joined_at < left_at` (if both provided)

### Must NOT Do

- ❌ Store context properties (role, membership_type, status, involvement_level) in Neo4j
- ❌ Confuse MEMBER_OF with WORKS_AT in UI
- ❌ Use work-related terminology (salary, department, etc.)
- ❌ Allow employment properties on MEMBER_OF
- ❌ Mix icons/colors between relationship types
- ❌ Skip rollback on Neo4j failure

---

## Dependencies & Prerequisites

**Required Before Starting:**
- [x] Package 1.1: Qdrant-First pattern established
- [x] Package 1.2: User entity operational
- [x] Package 2.2: Organization entity operational
- [x] Package 3.1: Base relationship pattern established
- [x] Package 3.2: WORKS_AT relationship (for comparison/distinction)
- [ ] Neo4j indexes: `CREATE INDEX member_of_user_idx FOR ()-[r:MEMBER_OF]-() ON (r.user_id)`
- [ ] Feature flag: `ENABLE_MEMBER_OF_RELATIONSHIP` added to config

---

## Success Criteria

1. ✅ User can add membership via UI (distinct from employment)
2. ✅ Membership badge uses group icon (not briefcase)
3. ✅ Organization detail shows separate member/employee lists
4. ✅ Membership context stored in Qdrant, temporal boundaries in Neo4j (ADR-0002 compliant)
5. ✅ Temporal queries work efficiently ("memberships during period X")
6. ✅ All tests pass (unit, integration, E2E - including distinction test)
7. ✅ Documentation updated with clear MEMBER_OF vs WORKS_AT explanation and ADR-0002 references

---

**Prompt Version:** 1.0
**Generated:** 2025-11-21
**Target Package:** 3.4

---

**END OF IMPLEMENTATION PROMPT**

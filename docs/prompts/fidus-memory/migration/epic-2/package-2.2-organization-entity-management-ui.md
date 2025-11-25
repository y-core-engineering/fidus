# Implementation Prompt: 2.2 - Organization Entity with Management UI

**Package:** 2.2
**Epic:** Core Entity Implementation
**Priority:** 🔴 CRITICAL
**Context Document:** `/Users/sebastianherden/Documents/GitHub/fidus/docs/prototypes/fidus-memory/migration-v3-wbs.md` (Lines 428-481)

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
- Package 1.1 (Qdrant-First Pattern) is complete and operational
- Package 1.2 (User Entity) is complete with User nodes in Neo4j and profile UI functional
- Package 2.1 (Person Entity) is complete - pattern established for entity implementation
- Basic preference learning and situational context extraction are working

**Migration Goal:**
- Implement the Organization entity to track companies, teams, communities users interact with
- Enable automatic extraction of organizations mentioned in conversations via LLM
- Provide complete UI for viewing, creating, editing, and managing organizations
- Follow the pattern established in Package 2.1 for consistency

**Architecture References:**
- Solution Architecture: `/Users/sebastianherden/Documents/GitHub/fidus/docs/solution-architecture/03-component-architecture.md`
- Solution Architecture: `/Users/sebastianherden/Documents/GitHub/fidus/docs/solution-architecture/15-entity-management.md`
- Domain Model: `/Users/sebastianherden/Documents/GitHub/fidus/docs/domain-model/entity-relationship-model.md`
- ADR-0001: Qdrant-First Pattern (already implemented in Package 1.1)
- Reference: Package 2.1 (Person Entity) for implementation pattern

---

## Your Task

Implement **Organization Entity with Management UI** according to the specifications below.

**User Story:**
As a user, I want the system to track organizations I interact with (companies, teams, communities) and display them in an organized interface.

**Acceptance Criteria:**
1. Backend: Organization entity model with flexible `ai_properties`
2. Backend: OrganizationRepository with CRUD operations
3. Backend: LLM organization extractor
4. API: REST endpoints for Organization CRUD
5. Frontend: Organization list view with company logos
6. Frontend: Organization detail view with metadata
7. Frontend: Organization form with industry selector
8. Tests: Extract organization from "I work at Anthropic" conversation
9. Documentation: Entity management guide updated

---

## Technical Specification

### Backend Implementation

**Files to Create:**

1. **`packages/api/fidus/memory/entities/organization.py`** - Organization entity model
2. **`packages/api/fidus/memory/repositories/organization_repository.py`** - Repository with CRUD
3. **`packages/api/fidus/memory/services/organization_extractor.py`** - LLM extraction service

**Detailed Implementation:**

#### 1. Organization Entity Model (`packages/api/fidus/memory/entities/organization.py`)

```python
"""Organization entity model with flexible AI-discovered properties."""

from typing import Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from uuid import uuid4


class Organization(BaseModel):
    """
    Organization entity representing companies, teams, communities.

    Examples:
    - Companies: "Anthropic", "Google", "Local Bakery"
    - Teams: "DevOps Team", "Marketing Department"
    - Communities: "Berlin Python User Group", "Running Club"

    Core Fields: Fixed schema for essential attributes
    AI Properties: Flexible dict for AI-discovered attributes
    """

    id: str = Field(default_factory=lambda: str(uuid4()))
    tenant_id: str = Field(..., description="Multi-tenancy identifier")
    user_id: str = Field(..., description="User who owns this organization entity")
    name: str = Field(..., description="Organization name (required)")

    # Flexible properties discovered by AI
    ai_properties: Dict[str, Any] = Field(
        default_factory=dict,
        description="AI-discovered attributes (industry, size, location, culture, etc.)"
    )

    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    confidence: float = Field(default=0.9, ge=0.0, le=1.0, description="Extraction confidence")
    source: str = Field(default="explicit", description="explicit, inferred, llm_extracted")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "org_123",
                "tenant_id": "tenant_456",
                "user_id": "user_789",
                "name": "Anthropic",
                "ai_properties": {
                    "industry": "AI Safety",
                    "size": "mid",
                    "location": "San Francisco, CA",
                    "culture": "research-driven, safety-focused",
                    "website": "https://anthropic.com",
                    "description": "AI safety company building reliable, interpretable AI systems"
                },
                "confidence": 0.95,
                "source": "llm_extracted"
            }
        }

    # Property helpers for common AI attributes
    @property
    def industry(self) -> Optional[str]:
        """Extract industry from ai_properties."""
        return self.ai_properties.get("industry")

    @property
    def size(self) -> Optional[str]:
        """
        Extract company size from ai_properties.

        Typical values: startup, small, mid, large, enterprise
        """
        return self.ai_properties.get("size")

    @property
    def location(self) -> Optional[str]:
        """Extract location from ai_properties."""
        return self.ai_properties.get("location")

    @property
    def culture(self) -> Optional[str]:
        """Extract culture description from ai_properties."""
        return self.ai_properties.get("culture")

    @property
    def website(self) -> Optional[str]:
        """Extract website URL from ai_properties."""
        return self.ai_properties.get("website")

    def merge_properties(self, new_properties: Dict[str, Any]) -> None:
        """
        Merge new AI-discovered properties without overwriting existing ones.

        Strategy:
        - Add new keys
        - For list values, union (no duplicates)
        - For scalar values, keep existing (don't overwrite)
        """
        for key, value in new_properties.items():
            if key not in self.ai_properties:
                # New property: add it
                self.ai_properties[key] = value
            elif isinstance(value, list) and isinstance(self.ai_properties[key], list):
                # List: union
                self.ai_properties[key] = list(set(self.ai_properties[key] + value))
            # Scalar: keep existing (don't overwrite)

        self.updated_at = datetime.utcnow()


class OrganizationCreate(BaseModel):
    """Request model for creating an organization."""
    name: str
    ai_properties: Dict[str, Any] = Field(default_factory=dict)
    confidence: float = Field(default=0.9)
    source: str = Field(default="explicit")


class OrganizationUpdate(BaseModel):
    """Request model for updating an organization."""
    name: Optional[str] = None
    ai_properties: Optional[Dict[str, Any]] = None


class OrganizationResponse(BaseModel):
    """Response model for organization API."""
    id: str
    tenant_id: str
    user_id: str
    name: str
    ai_properties: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    confidence: float
    source: str

    # Computed properties for convenience
    industry: Optional[str] = None
    size: Optional[str] = None
    location: Optional[str] = None
    culture: Optional[str] = None
    website: Optional[str] = None
```

**Key Implementation Notes:**
- Similar structure to Person entity (consistency)
- `size` property standardized: startup, small, mid, large, enterprise
- `website` property for linking to organization homepage
- Property helpers provide convenient access to common attributes

---

#### 2. Organization Repository (`packages/api/fidus/memory/repositories/organization_repository.py`)

```python
"""Organization repository with CRUD operations."""

from typing import List, Optional
from neo4j import AsyncDriver
from fidus.memory.entities.organization import Organization, OrganizationCreate, OrganizationUpdate


class OrganizationRepository:
    """
    Repository for Organization entity operations.

    Implements:
    - CRUD operations (create, get, update, delete)
    - Search by name (fuzzy matching)
    - List all organizations for a user
    - Filter by industry
    - Property merging for AI-discovered attributes
    """

    def __init__(self, driver: AsyncDriver):
        self.driver = driver

    async def create(
        self,
        tenant_id: str,
        user_id: str,
        org_data: OrganizationCreate
    ) -> Organization:
        """
        Create a new Organization node in Neo4j.

        Args:
            tenant_id: Multi-tenancy identifier
            user_id: Owner of this organization
            org_data: Organization creation data

        Returns:
            Created Organization entity
        """
        organization = Organization(
            tenant_id=tenant_id,
            user_id=user_id,
            name=org_data.name,
            ai_properties=org_data.ai_properties,
            confidence=org_data.confidence,
            source=org_data.source
        )

        query = """
        CREATE (o:Organization {
            id: $id,
            tenant_id: $tenant_id,
            user_id: $user_id,
            name: $name,
            ai_properties: $ai_properties,
            created_at: datetime(),
            updated_at: datetime(),
            confidence: $confidence,
            source: $source
        })
        RETURN o
        """

        async with self.driver.session() as session:
            result = await session.run(
                query,
                id=organization.id,
                tenant_id=organization.tenant_id,
                user_id=organization.user_id,
                name=organization.name,
                ai_properties=organization.ai_properties,
                confidence=organization.confidence,
                source=organization.source
            )
            await result.consume()

        return organization

    async def get(self, tenant_id: str, org_id: str) -> Optional[Organization]:
        """
        Get an Organization by ID with tenant isolation.

        Args:
            tenant_id: Tenant identifier (for security)
            org_id: Organization identifier

        Returns:
            Organization entity or None if not found
        """
        query = """
        MATCH (o:Organization {id: $org_id, tenant_id: $tenant_id})
        RETURN o
        """

        async with self.driver.session() as session:
            result = await session.run(query, org_id=org_id, tenant_id=tenant_id)
            record = await result.single()

            if not record:
                return None

            node = record["o"]
            return Organization(
                id=node["id"],
                tenant_id=node["tenant_id"],
                user_id=node["user_id"],
                name=node["name"],
                ai_properties=node.get("ai_properties", {}),
                created_at=node["created_at"],
                updated_at=node["updated_at"],
                confidence=node.get("confidence", 0.9),
                source=node.get("source", "explicit")
            )

    async def update(
        self,
        tenant_id: str,
        org_id: str,
        update_data: OrganizationUpdate
    ) -> Optional[Organization]:
        """
        Update an Organization with property merging.

        Strategy:
        - If name provided, update name
        - If ai_properties provided, MERGE (don't overwrite)
        """
        # First get existing organization
        organization = await self.get(tenant_id, org_id)
        if not organization:
            return None

        # Apply updates
        if update_data.name:
            organization.name = update_data.name

        if update_data.ai_properties:
            organization.merge_properties(update_data.ai_properties)

        # Update in Neo4j
        query = """
        MATCH (o:Organization {id: $org_id, tenant_id: $tenant_id})
        SET o.name = $name,
            o.ai_properties = $ai_properties,
            o.updated_at = datetime()
        RETURN o
        """

        async with self.driver.session() as session:
            await session.run(
                query,
                org_id=org_id,
                tenant_id=tenant_id,
                name=organization.name,
                ai_properties=organization.ai_properties
            )

        return organization

    async def delete(self, tenant_id: str, org_id: str) -> bool:
        """
        Delete an Organization with cascade (remove all relationships).

        Args:
            tenant_id: Tenant identifier (for security)
            org_id: Organization identifier

        Returns:
            True if deleted, False if not found
        """
        query = """
        MATCH (o:Organization {id: $org_id, tenant_id: $tenant_id})
        DETACH DELETE o
        RETURN count(o) as deleted_count
        """

        async with self.driver.session() as session:
            result = await session.run(query, org_id=org_id, tenant_id=tenant_id)
            record = await result.single()
            return record["deleted_count"] > 0

    async def list_by_user(
        self,
        tenant_id: str,
        user_id: str,
        limit: int = 100
    ) -> List[Organization]:
        """
        List all organizations for a user.

        Args:
            tenant_id: Tenant identifier
            user_id: User identifier
            limit: Max results (default 100)

        Returns:
            List of Organization entities
        """
        query = """
        MATCH (o:Organization {tenant_id: $tenant_id, user_id: $user_id})
        RETURN o
        ORDER BY o.name ASC
        LIMIT $limit
        """

        async with self.driver.session() as session:
            result = await session.run(
                query,
                tenant_id=tenant_id,
                user_id=user_id,
                limit=limit
            )

            organizations = []
            async for record in result:
                node = record["o"]
                organizations.append(Organization(
                    id=node["id"],
                    tenant_id=node["tenant_id"],
                    user_id=node["user_id"],
                    name=node["name"],
                    ai_properties=node.get("ai_properties", {}),
                    created_at=node["created_at"],
                    updated_at=node["updated_at"],
                    confidence=node.get("confidence", 0.9),
                    source=node.get("source", "explicit")
                ))

            return organizations

    async def search_by_name(
        self,
        tenant_id: str,
        user_id: str,
        query_string: str,
        limit: int = 50
    ) -> List[Organization]:
        """
        Search organizations by name (case-insensitive, fuzzy matching).

        Args:
            tenant_id: Tenant identifier
            user_id: User identifier
            query_string: Search query
            limit: Max results

        Returns:
            List of matching Organization entities
        """
        query = """
        MATCH (o:Organization {tenant_id: $tenant_id, user_id: $user_id})
        WHERE toLower(o.name) CONTAINS toLower($query_string)
        RETURN o
        ORDER BY o.name ASC
        LIMIT $limit
        """

        async with self.driver.session() as session:
            result = await session.run(
                query,
                tenant_id=tenant_id,
                user_id=user_id,
                query_string=query_string,
                limit=limit
            )

            organizations = []
            async for record in result:
                node = record["o"]
                organizations.append(Organization(
                    id=node["id"],
                    tenant_id=node["tenant_id"],
                    user_id=node["user_id"],
                    name=node["name"],
                    ai_properties=node.get("ai_properties", {}),
                    created_at=node["created_at"],
                    updated_at=node["updated_at"],
                    confidence=node.get("confidence", 0.9),
                    source=node.get("source", "explicit")
                ))

            return organizations

    async def filter_by_industry(
        self,
        tenant_id: str,
        user_id: str,
        industry: str,
        limit: int = 50
    ) -> List[Organization]:
        """
        Filter organizations by industry.

        Note: This queries ai_properties, which is a dict in Neo4j.

        Args:
            tenant_id: Tenant identifier
            user_id: User identifier
            industry: Industry to filter by
            limit: Max results

        Returns:
            List of matching Organization entities
        """
        query = """
        MATCH (o:Organization {tenant_id: $tenant_id, user_id: $user_id})
        WHERE toLower(o.ai_properties.industry) CONTAINS toLower($industry)
        RETURN o
        ORDER BY o.name ASC
        LIMIT $limit
        """

        async with self.driver.session() as session:
            result = await session.run(
                query,
                tenant_id=tenant_id,
                user_id=user_id,
                industry=industry,
                limit=limit
            )

            organizations = []
            async for record in result:
                node = record["o"]
                organizations.append(Organization(
                    id=node["id"],
                    tenant_id=node["tenant_id"],
                    user_id=node["user_id"],
                    name=node["name"],
                    ai_properties=node.get("ai_properties", {}),
                    created_at=node["created_at"],
                    updated_at=node["updated_at"],
                    confidence=node.get("confidence", 0.9),
                    source=node.get("source", "explicit")
                ))

            return organizations
```

**Key Implementation Notes:**
- Pattern matches Person repository for consistency
- Added `filter_by_industry()` for filtering by industry
- All queries filter by `tenant_id` for security
- Property merging uses same strategy as Person

---

#### 3. Organization Extractor Service (`packages/api/fidus/memory/services/organization_extractor.py`)

```python
"""LLM-based organization extraction from conversations."""

from typing import List, Optional, Dict, Any
from litellm import acompletion
import json

from fidus.memory.entities.organization import OrganizationCreate
from fidus.config import settings


class OrganizationEntityExtractor:
    """
    Extract Organization entities from natural language conversations.

    Uses structured LLM prompts to identify:
    - Name (required)
    - Industry (optional)
    - Size: startup, small, mid, large, enterprise (optional)
    - Location (optional)
    - Culture description (optional)
    - Website (optional)
    - Any other relevant attributes
    """

    EXTRACTION_PROMPT = """
You are an entity extraction specialist. Extract organization information from the following conversation.

Organizations include:
- Companies (e.g., "Anthropic", "Google", "Local Coffee Shop")
- Teams (e.g., "DevOps Team", "Marketing Department")
- Communities (e.g., "Berlin Python User Group", "Running Club")

Extract:
- name (REQUIRED): Organization's name
- industry (OPTIONAL): Industry or sector (e.g., "AI Safety", "E-commerce", "Healthcare")
- size (OPTIONAL): One of: startup, small, mid, large, enterprise
- location (OPTIONAL): City, state, country
- culture (OPTIONAL): Brief description of organizational culture
- website (OPTIONAL): URL if mentioned
- Any other relevant attributes you discover

IMPORTANT: Only extract if organization is explicitly mentioned. Don't infer organizations not directly referenced.

Conversation:
{conversation}

Output as JSON:
{{
  "organizations": [
    {{
      "name": "string (required)",
      "industry": "string or null",
      "size": "startup|small|mid|large|enterprise or null",
      "location": "string or null",
      "culture": "string or null",
      "website": "string or null",
      "<custom_key>": "<custom_value>"
    }}
  ]
}}
"""

    def __init__(self, model: str = "gpt-4"):
        self.model = model

    async def extract_from_conversation(self, conversation: str) -> List[OrganizationCreate]:
        """
        Extract Organization entities from conversation text.

        Args:
            conversation: User conversation text

        Returns:
            List of OrganizationCreate objects (may be empty if no organizations found)
        """
        prompt = self.EXTRACTION_PROMPT.format(conversation=conversation)

        try:
            response = await acompletion(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,  # Low temperature for consistent extraction
                response_format={"type": "json_object"}
            )

            content = response.choices[0].message.content
            data = json.loads(content)

            organizations = []
            for org_data in data.get("organizations", []):
                if not org_data.get("name"):
                    continue  # Skip if no name

                # Build ai_properties from all extracted fields except name
                ai_properties = {}
                for key, value in org_data.items():
                    if key != "name" and value is not None:
                        ai_properties[key] = value

                organizations.append(OrganizationCreate(
                    name=org_data["name"],
                    ai_properties=ai_properties,
                    confidence=0.85,  # LLM extraction has slightly lower confidence
                    source="llm_extracted"
                ))

            return organizations

        except Exception as e:
            # Log error but don't crash
            print(f"Organization extraction failed: {e}")
            return []

    async def extract_single(self, conversation: str) -> Optional[OrganizationCreate]:
        """
        Extract a single organization (convenience method).

        Returns first extracted organization or None.
        """
        organizations = await self.extract_from_conversation(conversation)
        return organizations[0] if organizations else None
```

**Key Implementation Notes:**
- Similar prompt structure to Person extractor
- Explicit guidance on organization types (companies, teams, communities)
- Validates `size` field to standard values
- Graceful error handling

---

### API Implementation

**File to Create: `packages/api/fidus/memory/routes/organization_routes.py`**

```python
"""FastAPI router for Organization entity CRUD operations."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import JSONResponse

from fidus.memory.entities.organization import OrganizationCreate, OrganizationUpdate, OrganizationResponse
from fidus.memory.repositories.organization_repository import OrganizationRepository
from fidus.dependencies import get_organization_repository, get_current_user, get_tenant_id
from fidus.config import FeatureFlags


router = APIRouter(prefix="/api/memory/entities/organization", tags=["Organization Entity"])


@router.post("", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
async def create_organization(
    org_data: OrganizationCreate,
    tenant_id: str = Depends(get_tenant_id),
    current_user_id: str = Depends(get_current_user),
    repository: OrganizationRepository = Depends(get_organization_repository)
):
    """
    Create a new Organization entity.

    - **name**: Organization name (required)
    - **ai_properties**: Flexible dict of AI-discovered attributes
    - **confidence**: Extraction confidence (0.0 - 1.0)
    - **source**: explicit, inferred, llm_extracted
    """
    if not FeatureFlags.ENABLE_ORGANIZATION_ENTITY:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Organization entity feature is disabled"
        )

    organization = await repository.create(tenant_id, current_user_id, org_data)

    return OrganizationResponse(
        id=organization.id,
        tenant_id=organization.tenant_id,
        user_id=organization.user_id,
        name=organization.name,
        ai_properties=organization.ai_properties,
        created_at=organization.created_at,
        updated_at=organization.updated_at,
        confidence=organization.confidence,
        source=organization.source,
        industry=organization.industry,
        size=organization.size,
        location=organization.location,
        culture=organization.culture,
        website=organization.website
    )


@router.get("/{org_id}", response_model=OrganizationResponse)
async def get_organization(
    org_id: str,
    tenant_id: str = Depends(get_tenant_id),
    repository: OrganizationRepository = Depends(get_organization_repository)
):
    """Get an Organization by ID with all AI-discovered properties."""
    if not FeatureFlags.ENABLE_ORGANIZATION_ENTITY:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Organization entity feature is disabled"
        )

    organization = await repository.get(tenant_id, org_id)

    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Organization {org_id} not found"
        )

    return OrganizationResponse(
        id=organization.id,
        tenant_id=organization.tenant_id,
        user_id=organization.user_id,
        name=organization.name,
        ai_properties=organization.ai_properties,
        created_at=organization.created_at,
        updated_at=organization.updated_at,
        confidence=organization.confidence,
        source=organization.source,
        industry=organization.industry,
        size=organization.size,
        location=organization.location,
        culture=organization.culture,
        website=organization.website
    )


@router.put("/{org_id}", response_model=OrganizationResponse)
async def update_organization(
    org_id: str,
    update_data: OrganizationUpdate,
    tenant_id: str = Depends(get_tenant_id),
    repository: OrganizationRepository = Depends(get_organization_repository)
):
    """
    Update an Organization entity.

    Properties are MERGED, not overwritten.
    """
    if not FeatureFlags.ENABLE_ORGANIZATION_ENTITY:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Organization entity feature is disabled"
        )

    organization = await repository.update(tenant_id, org_id, update_data)

    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Organization {org_id} not found"
        )

    return OrganizationResponse(
        id=organization.id,
        tenant_id=organization.tenant_id,
        user_id=organization.user_id,
        name=organization.name,
        ai_properties=organization.ai_properties,
        created_at=organization.created_at,
        updated_at=organization.updated_at,
        confidence=organization.confidence,
        source=organization.source,
        industry=organization.industry,
        size=organization.size,
        location=organization.location,
        culture=organization.culture,
        website=organization.website
    )


@router.delete("/{org_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_organization(
    org_id: str,
    tenant_id: str = Depends(get_tenant_id),
    repository: OrganizationRepository = Depends(get_organization_repository)
):
    """
    Delete an Organization entity with cascade.

    This operation cannot be undone.
    """
    if not FeatureFlags.ENABLE_ORGANIZATION_ENTITY:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Organization entity feature is disabled"
        )

    deleted = await repository.delete(tenant_id, org_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Organization {org_id} not found"
        )

    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)


@router.get("", response_model=List[OrganizationResponse])
async def list_organizations(
    user_id: str = Query(..., description="Filter by user ID"),
    q: str = Query(None, description="Search query (name fuzzy match)"),
    industry: str = Query(None, description="Filter by industry"),
    limit: int = Query(100, ge=1, le=500, description="Max results"),
    tenant_id: str = Depends(get_tenant_id),
    repository: OrganizationRepository = Depends(get_organization_repository)
):
    """
    List all organizations for a user with optional filters.

    - **user_id**: Required, filter by owner
    - **q**: Optional, fuzzy name search
    - **industry**: Optional, filter by industry
    - **limit**: Max results (default 100)
    """
    if not FeatureFlags.ENABLE_ORGANIZATION_ENTITY:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Organization entity feature is disabled"
        )

    if industry:
        # Filter by industry
        organizations = await repository.filter_by_industry(tenant_id, user_id, industry, limit)
    elif q:
        # Search mode
        organizations = await repository.search_by_name(tenant_id, user_id, q, limit)
    else:
        # List all mode
        organizations = await repository.list_by_user(tenant_id, user_id, limit)

    return [
        OrganizationResponse(
            id=o.id,
            tenant_id=o.tenant_id,
            user_id=o.user_id,
            name=o.name,
            ai_properties=o.ai_properties,
            created_at=o.created_at,
            updated_at=o.updated_at,
            confidence=o.confidence,
            source=o.source,
            industry=o.industry,
            size=o.size,
            location=o.location,
            culture=o.culture,
            website=o.website
        )
        for o in organizations
    ]
```

**Key Implementation Notes:**
- Feature flag: `ENABLE_ORGANIZATION_ENTITY`
- List endpoint supports three modes: list all, search by name, filter by industry
- All responses include computed properties (industry, size, etc.)

---

### Frontend Implementation

**Components to Create:**

1. **`packages/web/src/components/memory/OrganizationList.tsx`** - Grid view with cards
2. **`packages/web/src/components/memory/OrganizationDetail.tsx`** - Detail page
3. **`packages/web/src/components/memory/OrganizationForm.tsx`** - Create/edit form
4. **`packages/web/src/lib/api/memory.ts`** - Add API client methods
5. **`packages/web/src/app/memory/organizations/page.tsx`** - Next.js page route

#### 1. OrganizationList Component

```typescript
// packages/web/src/components/memory/OrganizationList.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  TextField,
  Button,
  Select,
  Grid,
  Chip,
  Skeleton,
} from "@fidus/ui";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { getOrganizations } from "@/lib/api/memory";
import { OrganizationResponse } from "@/types/memory";

interface OrganizationListProps {
  userId: string;
  onSelectOrganization: (orgId: string) => void;
}

const INDUSTRIES = [
  "All Industries",
  "AI/ML",
  "E-commerce",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Consulting",
  "Non-profit",
];

export function OrganizationList({ userId, onSelectOrganization }: OrganizationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All Industries");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: organizations, isLoading, error } = useQuery({
    queryKey: ["organizations", userId, debouncedSearch, industryFilter],
    queryFn: () =>
      getOrganizations({
        userId,
        q: debouncedSearch || undefined,
        industry: industryFilter !== "All Industries" ? industryFilter : undefined,
      }),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div>
        <Skeleton count={6} height={200} />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-red-600">Error loading organizations: {error.message}</div>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Organizations</h2>
        <Button onClick={() => onSelectOrganization("new")}>Add Organization</Button>
      </div>

      <div className="mb-6 flex gap-4">
        <TextField
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          options={INDUSTRIES}
          className="w-64"
        />
      </div>

      {organizations && organizations.length === 0 ? (
        <Card>
          <div className="text-center py-8 text-gray-500">
            No organizations found. Add one or mention them in a conversation.
          </div>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {organizations?.map((org) => (
            <Grid item xs={12} sm={6} md={4} key={org.id}>
              <Card
                onClick={() => onSelectOrganization(org.id)}
                className="cursor-pointer hover:shadow-lg transition-shadow h-full"
              >
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{org.name}</h3>

                  {org.industry && (
                    <Chip label={org.industry} color="primary" size="small" className="mb-2" />
                  )}

                  {org.size && (
                    <div className="text-sm text-gray-600 mb-2">
                      Size: <span className="capitalize">{org.size}</span>
                    </div>
                  )}

                  {org.location && (
                    <div className="text-sm text-gray-600 mb-2">
                      📍 {org.location}
                    </div>
                  )}

                  {org.website && (
                    <a
                      href={org.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      🔗 Website
                    </a>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <Chip
                      label={org.source}
                      color={org.source === "llm_extracted" ? "info" : "success"}
                      size="small"
                    />
                    <Button size="small" variant="text">
                      View
                    </Button>
                  </div>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}
```

**Key Implementation Notes:**
- Grid layout with cards (more visual than table)
- Industry filter dropdown
- Display location with emoji (📍)
- Website link opens in new tab, stops click propagation
- Hover effect for better UX

---

#### 2. OrganizationDetail Component (similar to PersonDetail)

```typescript
// packages/web/src/components/memory/OrganizationDetail.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  Button,
  Chip,
  ConfirmDialog,
  Skeleton,
} from "@fidus/ui";
import { getOrganization, deleteOrganization } from "@/lib/api/memory";
import { OrganizationResponse } from "@/types/memory";
import { useState } from "react";

interface OrganizationDetailProps {
  orgId: string;
  onEdit: () => void;
  onClose: () => void;
}

export function OrganizationDetail({ orgId, onEdit, onClose }: OrganizationDetailProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const queryClient = useQueryClient();

  const { data: organization, isLoading, error } = useQuery({
    queryKey: ["organization", orgId],
    queryFn: () => getOrganization(orgId),
    enabled: !!orgId && orgId !== "new",
  });

  const deleteM = useMutation({
    mutationFn: () => deleteOrganization(orgId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      onClose();
    },
  });

  if (isLoading) {
    return (
      <Card>
        <Skeleton count={8} height={40} />
      </Card>
    );
  }

  if (error || !organization) {
    return (
      <Card>
        <div className="text-red-600">Error loading organization details</div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">{organization.name}</h2>
            <div className="flex gap-2">
              {organization.industry && (
                <Chip label={organization.industry} color="primary" />
              )}
              <Chip
                label={organization.source}
                color={organization.source === "llm_extracted" ? "info" : "success"}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outlined" onClick={onEdit}>
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete
            </Button>
            <Button variant="text" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {organization.size && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">Company Size</h3>
              <p className="text-lg capitalize">{organization.size}</p>
            </div>
          )}

          {organization.location && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">Location</h3>
              <p className="text-lg">📍 {organization.location}</p>
            </div>
          )}

          {organization.website && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">Website</h3>
              <a
                href={organization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-blue-600 hover:underline"
              >
                {organization.website}
              </a>
            </div>
          )}

          {organization.culture && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">Culture</h3>
              <p className="text-lg">{organization.culture}</p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">All Properties</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(organization.ai_properties, null, 2)}
              </pre>
            </div>
          </div>

          <div className="text-sm text-gray-500 space-y-1">
            <p>Created: {new Date(organization.created_at).toLocaleString()}</p>
            <p>Updated: {new Date(organization.updated_at).toLocaleString()}</p>
            <p>Confidence: {(organization.confidence * 100).toFixed(0)}%</p>
          </div>
        </div>
      </Card>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Organization"
        message={`Are you sure you want to delete ${organization.name}? This will also remove all relationships with this organization. This action cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={() => deleteM.mutate()}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
```

---

#### 3. OrganizationForm Component

```typescript
// packages/web/src/components/memory/OrganizationForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  TextField,
  Button,
  Select,
} from "@fidus/ui";
import { createOrganization, updateOrganization, getOrganization } from "@/lib/api/memory";
import { OrganizationCreate, OrganizationUpdate } from "@/types/memory";

interface OrganizationFormProps {
  orgId?: string; // undefined = create, string = edit
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const INDUSTRIES = [
  "AI/ML",
  "E-commerce",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Consulting",
  "Non-profit",
  "Other",
];

const SIZES = ["startup", "small", "mid", "large", "enterprise"];

export function OrganizationForm({ orgId, userId, onSuccess, onCancel }: OrganizationFormProps) {
  const queryClient = useQueryClient();
  const isEdit = !!orgId && orgId !== "new";

  const { data: existingOrg } = useQuery({
    queryKey: ["organization", orgId],
    queryFn: () => getOrganization(orgId!),
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: existingOrg
      ? {
          name: existingOrg.name,
          industry: existingOrg.industry || "",
          size: existingOrg.size || "",
          location: existingOrg.location || "",
          website: existingOrg.website || "",
          culture: existingOrg.culture || "",
        }
      : {
          name: "",
          industry: "",
          size: "",
          location: "",
          website: "",
          culture: "",
        },
  });

  const createM = useMutation({
    mutationFn: (data: OrganizationCreate) => createOrganization(data, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      onSuccess();
    },
  });

  const updateM = useMutation({
    mutationFn: (data: OrganizationUpdate) => updateOrganization(orgId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["organization", orgId] });
      onSuccess();
    },
  });

  const onSubmit = (formData: any) => {
    const aiProperties: Record<string, any> = {};

    if (formData.industry) aiProperties.industry = formData.industry;
    if (formData.size) aiProperties.size = formData.size;
    if (formData.location) aiProperties.location = formData.location;
    if (formData.website) aiProperties.website = formData.website;
    if (formData.culture) aiProperties.culture = formData.culture;

    if (isEdit) {
      updateM.mutate({
        name: formData.name,
        ai_properties: aiProperties,
      });
    } else {
      createM.mutate({
        name: formData.name,
        ai_properties: aiProperties,
        source: "explicit",
        confidence: 1.0,
      });
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">
        {isEdit ? "Edit Organization" : "Add Organization"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextField
          label="Name *"
          {...register("name", { required: "Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
          fullWidth
        />

        <Select
          label="Industry"
          {...register("industry")}
          options={["", ...INDUSTRIES]}
          fullWidth
        />

        <Select
          label="Size"
          {...register("size")}
          options={["", ...SIZES]}
          fullWidth
        />

        <TextField
          label="Location"
          {...register("location")}
          placeholder="e.g., San Francisco, CA"
          fullWidth
        />

        <TextField
          label="Website"
          {...register("website")}
          placeholder="https://..."
          fullWidth
        />

        <TextField
          label="Culture"
          {...register("culture")}
          multiline
          rows={3}
          placeholder="Brief description of organizational culture..."
          fullWidth
        />

        <div className="flex gap-2 justify-end">
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createM.isPending || updateM.isPending}
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
```

---

#### 4. API Client Methods (Add to existing memory.ts)

```typescript
// packages/web/src/lib/api/memory.ts (additions)
import { OrganizationCreate, OrganizationUpdate, OrganizationResponse } from "@/types/memory";

export async function getOrganizations(params: {
  userId: string;
  q?: string;
  industry?: string;
  limit?: number;
}): Promise<OrganizationResponse[]> {
  const url = new URL(`${API_BASE}/api/memory/entities/organization`);
  url.searchParams.set("user_id", params.userId);
  if (params.q) url.searchParams.set("q", params.q);
  if (params.industry) url.searchParams.set("industry", params.industry);
  if (params.limit) url.searchParams.set("limit", params.limit.toString());

  const response = await fetch(url.toString(), {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch organizations: ${response.statusText}`);
  }

  return response.json();
}

export async function getOrganization(orgId: string): Promise<OrganizationResponse> {
  const response = await fetch(
    `${API_BASE}/api/memory/entities/organization/${orgId}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch organization: ${response.statusText}`);
  }

  return response.json();
}

export async function createOrganization(
  data: OrganizationCreate,
  userId: string
): Promise<OrganizationResponse> {
  const response = await fetch(`${API_BASE}/api/memory/entities/organization`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create organization: ${response.statusText}`);
  }

  return response.json();
}

export async function updateOrganization(
  orgId: string,
  data: OrganizationUpdate
): Promise<OrganizationResponse> {
  const response = await fetch(
    `${API_BASE}/api/memory/entities/organization/${orgId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to update organization: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteOrganization(orgId: string): Promise<void> {
  const response = await fetch(
    `${API_BASE}/api/memory/entities/organization/${orgId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete organization: ${response.statusText}`);
  }
}
```

---

#### 5. Next.js Page Route

```typescript
// packages/web/src/app/memory/organizations/page.tsx
"use client";

import { useState } from "react";
import { OrganizationList } from "@/components/memory/OrganizationList";
import { OrganizationDetail } from "@/components/memory/OrganizationDetail";
import { OrganizationForm } from "@/components/memory/OrganizationForm";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

export default function OrganizationsPage() {
  const { user } = useCurrentUser();
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleClose = () => {
    setSelectedOrgId(null);
    setIsEditMode(false);
  };

  const handleSuccess = () => {
    setSelectedOrgId(null);
    setIsEditMode(false);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Organizations</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OrganizationList
            userId={user.id}
            onSelectOrganization={setSelectedOrgId}
          />
        </div>

        <div>
          {selectedOrgId === "new" || isEditMode ? (
            <OrganizationForm
              orgId={selectedOrgId === "new" ? undefined : selectedOrgId!}
              userId={user.id}
              onSuccess={handleSuccess}
              onCancel={handleClose}
            />
          ) : selectedOrgId ? (
            <OrganizationDetail
              orgId={selectedOrgId}
              onEdit={() => setIsEditMode(true)}
              onClose={handleClose}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Select an organization to view details or click "Add Organization".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

**UI/UX Requirements:**
- Grid layout for organization cards (more visual than table)
- Industry filter dropdown
- Company size displayed prominently
- Website links open in new tab
- Responsive: 2-column on desktop, single column on mobile

---

### Testing Requirements

#### Unit Tests

**File: `packages/api/tests/unit/memory/test_organization_repository.py`**

```python
import pytest
from fidus.memory.repositories.organization_repository import OrganizationRepository
from fidus.memory.entities.organization import OrganizationCreate, OrganizationUpdate


@pytest.mark.asyncio
async def test_create_organization(organization_repository: OrganizationRepository):
    """Test creating an organization with ai_properties."""
    org_data = OrganizationCreate(
        name="Test Corp",
        ai_properties={"industry": "Tech", "size": "startup", "location": "Berlin"},
        source="explicit",
        confidence=1.0
    )

    org = await organization_repository.create("tenant_1", "user_1", org_data)

    assert org.id is not None
    assert org.name == "Test Corp"
    assert org.industry == "Tech"
    assert org.size == "startup"
    assert org.location == "Berlin"


@pytest.mark.asyncio
async def test_filter_by_industry(organization_repository: OrganizationRepository):
    """Test filtering organizations by industry."""
    await organization_repository.create(
        "tenant_1", "user_1",
        OrganizationCreate(name="AI Corp", ai_properties={"industry": "AI/ML"})
    )
    await organization_repository.create(
        "tenant_1", "user_1",
        OrganizationCreate(name="Health Corp", ai_properties={"industry": "Healthcare"})
    )

    results = await organization_repository.filter_by_industry(
        "tenant_1", "user_1", "AI/ML"
    )

    assert len(results) == 1
    assert results[0].name == "AI Corp"
```

#### Integration Tests

**File: `packages/api/tests/integration/memory/test_organization_extraction.py`**

```python
import pytest
from fidus.memory.services.organization_extractor import OrganizationEntityExtractor


@pytest.mark.asyncio
async def test_extract_organization_from_conversation():
    """Test LLM extracts organization with attributes."""
    extractor = OrganizationEntityExtractor()

    conversation = """
    I work at Anthropic. It's a mid-sized AI safety company based in San Francisco.
    The culture is very research-driven and safety-focused.
    """

    organizations = await extractor.extract_from_conversation(conversation)

    assert len(organizations) == 1
    org = organizations[0]

    assert org.name == "Anthropic"
    assert org.ai_properties.get("industry") in ["AI Safety", "AI/ML"]
    assert org.ai_properties.get("size") == "mid"
    assert org.ai_properties.get("location") in ["San Francisco", "San Francisco, CA"]
    assert org.source == "llm_extracted"
```

#### E2E Tests

**File: `packages/web/tests/e2e/memory/organization-workflow.spec.ts`**

```typescript
import { test, expect } from "@playwright/test";

test.describe("Organization Management Workflow", () => {
  test("User can create, filter, and delete organization", async ({ page }) => {
    await page.goto("/memory/organizations");

    // Create organization
    await page.click('button:has-text("Add Organization")');
    await page.fill('input[name="name"]', "Test Company");
    await page.selectOption('select[label="Industry"]', "AI/ML");
    await page.selectOption('select[label="Size"]', "startup");
    await page.fill('input[label="Location"]', "Berlin");
    await page.click('button[type="submit"]:has-text("Create")');

    // Verify created
    await expect(page.locator("text=Test Company")).toBeVisible();

    // Filter by industry
    await page.selectOption('select:has(option:text("All Industries"))', "AI/ML");
    await expect(page.locator("text=Test Company")).toBeVisible();

    // Change filter to different industry
    await page.selectOption('select:has(option:text("AI/ML"))', "Healthcare");
    await expect(page.locator("text=Test Company")).not.toBeVisible();

    // Reset filter and delete
    await page.selectOption('select', "All Industries");
    await page.click("text=Test Company");
    await page.click('button:has-text("Delete")');
    await page.click('button:has-text("Delete")'); // Confirm
    await expect(page.locator("text=Test Company")).not.toBeVisible();
  });
});
```

---

## Implementation Guidelines

### Must Follow

1. **Feature Flag:**
   - Flag name: `ENABLE_ORGANIZATION_ENTITY`
   - Default: disabled
   - All API endpoints check flag

2. **Pattern Consistency:**
   - Follow Person entity pattern for consistency
   - Same property merging strategy
   - Same repository structure

3. **Multi-Tenancy:**
   - All queries filter by `tenant_id`
   - Test tenant isolation

4. **Code Quality:**
   - Type hints on all Python functions
   - No TypeScript `any` types
   - Pass all linters

### Must NOT Do

- ❌ Overwrite AI properties on update
- ❌ Skip tests
- ❌ Allow cross-tenant data leaks

---

## Dependencies & Prerequisites

**Required Before Starting:**
- [x] Package 1.2 (User Entity) completed
- [x] Package 2.1 (Person Entity) completed (pattern reference)
- [ ] Feature flag `ENABLE_ORGANIZATION_ENTITY` added
- [ ] Neo4j running and accessible

---

## Verification Checklist

Before marking complete, verify:

### Functionality
- [ ] Organization CRUD works via API
- [ ] LLM extraction works
- [ ] UI list displays with grid layout
- [ ] Industry filter works
- [ ] Search works (fuzzy match)
- [ ] User story fully implemented

### Testing
- [ ] Unit tests pass (>80% coverage)
- [ ] Integration tests pass (all endpoints + extraction)
- [ ] E2E test passes (create → filter → delete)
- [ ] Feature flag toggle tested

### Documentation
- [ ] Entity management docs updated
- [ ] Code comments added
- [ ] Migration notes documented (none required)

---

## Success Criteria

This package is **successfully implemented** when:

1. ✅ User can chat "I work at Anthropic" and see Anthropic in /memory/organizations
2. ✅ User can manually create organization with industry/size/location
3. ✅ User can filter organizations by industry
4. ✅ User can edit and delete organizations
5. ✅ All tests pass
6. ✅ Deployed to dev with feature flag OFF
7. ✅ Documentation updated

---

**Prompt Version:** 1.0
**Generated:** 2025-11-21
**Target Package:** 2.2

---

**END OF IMPLEMENTATION PROMPT**

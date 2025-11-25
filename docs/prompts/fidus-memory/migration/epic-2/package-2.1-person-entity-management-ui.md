# Implementation Prompt: 2.1 - Person Entity with Management UI

**Package:** 2.1
**Epic:** Core Entity Implementation
**Priority:** 🔴 CRITICAL
**Context Document:** `/Users/sebastianherden/Documents/GitHub/fidus/docs/prototypes/fidus-memory/migration-v3-wbs.md` (Lines 370-426)

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
- No Person entity exists yet (this is the first non-User entity)
- Basic preference learning and situational context extraction are working

**Migration Goal:**
- Implement the Person entity as the first domain entity in the v3.0 Entity-Relationship Model
- Enable automatic extraction of people mentioned in conversations via LLM
- Provide complete UI for viewing, creating, editing, and managing a user's network of contacts
- Establish the pattern for all subsequent entity implementations (Organization, Goal, etc.)

**Architecture References:**
- Solution Architecture: `/Users/sebastianherden/Documents/GitHub/fidus/docs/solution-architecture/03-component-architecture.md`
- Solution Architecture: `/Users/sebastianherden/Documents/GitHub/fidus/docs/solution-architecture/15-entity-management.md`
- Domain Model: `/Users/sebastianherden/Documents/GitHub/fidus/docs/domain-model/entity-relationship-model.md`
- ADR-0001: Qdrant-First Pattern (already implemented in Package 1.1)

---

## Your Task

Implement **Person Entity with Management UI** according to the specifications below.

**User Story:**
As a user, I want the system to automatically recognize people I mention in conversations and provide a UI to view and manage my network of contacts.

**Acceptance Criteria:**
1. Backend: Person entity model with flexible `ai_properties` for AI-discovered attributes
2. Backend: PersonRepository with CRUD + search operations
3. Backend: LLM person extractor in `PersonEntityExtractor` class
4. API: REST endpoints for Person CRUD
5. Frontend: Person list view with search/filter
6. Frontend: Person detail view showing all attributes
7. Frontend: Person creation/edit form
8. Tests: E2E test extracts person from conversation and displays in UI
9. Documentation: Update entity management docs

---

## Technical Specification

### Backend Implementation

**Files to Create:**

1. **`packages/api/fidus/memory/entities/person.py`** - Person entity model
2. **`packages/api/fidus/memory/repositories/person_repository.py`** - Repository with CRUD + search
3. **`packages/api/fidus/memory/services/person_extractor.py`** - LLM extraction service

**Detailed Implementation:**

#### 1. Person Entity Model (`packages/api/fidus/memory/entities/person.py`)

```python
"""Person entity model with flexible AI-discovered properties."""

from typing import Dict, Any, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from uuid import uuid4


class Person(BaseModel):
    """
    Person entity representing individuals mentioned in user conversations.

    Core Fields: Fixed schema for essential attributes
    AI Properties: Flexible dict for AI-discovered attributes (profession, topics, etc.)
    """

    id: str = Field(default_factory=lambda: str(uuid4()))
    tenant_id: str = Field(..., description="Multi-tenancy identifier")
    user_id: str = Field(..., description="User who owns this person entity")
    name: str = Field(..., description="Person's name (required)")

    # Flexible properties discovered by AI
    ai_properties: Dict[str, Any] = Field(
        default_factory=dict,
        description="AI-discovered attributes (profession, topics, communication_style, etc.)"
    )

    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    confidence: float = Field(default=0.9, ge=0.0, le=1.0, description="Extraction confidence")
    source: str = Field(default="explicit", description="explicit, inferred, llm_extracted")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "person_123",
                "tenant_id": "tenant_456",
                "user_id": "user_789",
                "name": "Anna Schmidt",
                "ai_properties": {
                    "profession": "Software Engineer",
                    "topics": ["Python", "Machine Learning", "DevOps"],
                    "communication_style": "direct, technical",
                    "company": "Anthropic",
                    "notes": "Works on Claude team"
                },
                "confidence": 0.95,
                "source": "llm_extracted"
            }
        }

    # Property helpers for common AI attributes
    @property
    def profession(self) -> Optional[str]:
        """Extract profession from ai_properties."""
        return self.ai_properties.get("profession")

    @property
    def topics(self) -> List[str]:
        """Extract topics from ai_properties."""
        return self.ai_properties.get("topics", [])

    @property
    def communication_style(self) -> Optional[str]:
        """Extract communication style from ai_properties."""
        return self.ai_properties.get("communication_style")

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


class PersonCreate(BaseModel):
    """Request model for creating a person."""
    name: str
    ai_properties: Dict[str, Any] = Field(default_factory=dict)
    confidence: float = Field(default=0.9)
    source: str = Field(default="explicit")


class PersonUpdate(BaseModel):
    """Request model for updating a person."""
    name: Optional[str] = None
    ai_properties: Optional[Dict[str, Any]] = None


class PersonResponse(BaseModel):
    """Response model for person API."""
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
    profession: Optional[str] = None
    topics: List[str] = Field(default_factory=list)
    communication_style: Optional[str] = None
```

**Key Implementation Notes:**
- `ai_properties` is a flexible dict allowing LLM to discover arbitrary attributes
- Property helpers (`@property`) provide convenient access to common attributes
- `merge_properties()` intelligently merges new AI discoveries without overwriting existing data
- Pydantic models for request/response ensure type safety

---

#### 2. Person Repository (`packages/api/fidus/memory/repositories/person_repository.py`)

```python
"""Person repository with CRUD and search operations."""

from typing import List, Optional
from neo4j import AsyncDriver
from fidus.memory.entities.person import Person, PersonCreate, PersonUpdate


class PersonRepository:
    """
    Repository for Person entity operations.

    Implements:
    - CRUD operations (create, get, update, delete)
    - Search by name (fuzzy matching)
    - List all persons for a user
    - Property merging for AI-discovered attributes
    """

    def __init__(self, driver: AsyncDriver):
        self.driver = driver

    async def create(self, tenant_id: str, user_id: str, person_data: PersonCreate) -> Person:
        """
        Create a new Person node in Neo4j.

        Args:
            tenant_id: Multi-tenancy identifier
            user_id: Owner of this person
            person_data: Person creation data

        Returns:
            Created Person entity
        """
        person = Person(
            tenant_id=tenant_id,
            user_id=user_id,
            name=person_data.name,
            ai_properties=person_data.ai_properties,
            confidence=person_data.confidence,
            source=person_data.source
        )

        query = """
        CREATE (p:Person {
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
        RETURN p
        """

        async with self.driver.session() as session:
            result = await session.run(
                query,
                id=person.id,
                tenant_id=person.tenant_id,
                user_id=person.user_id,
                name=person.name,
                ai_properties=person.ai_properties,
                confidence=person.confidence,
                source=person.source
            )
            await result.consume()

        return person

    async def get(self, tenant_id: str, person_id: str) -> Optional[Person]:
        """
        Get a Person by ID with tenant isolation.

        Args:
            tenant_id: Tenant identifier (for security)
            person_id: Person identifier

        Returns:
            Person entity or None if not found
        """
        query = """
        MATCH (p:Person {id: $person_id, tenant_id: $tenant_id})
        RETURN p
        """

        async with self.driver.session() as session:
            result = await session.run(query, person_id=person_id, tenant_id=tenant_id)
            record = await result.single()

            if not record:
                return None

            node = record["p"]
            return Person(
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

    async def update(self, tenant_id: str, person_id: str, update_data: PersonUpdate) -> Optional[Person]:
        """
        Update a Person with property merging.

        Strategy:
        - If name provided, update name
        - If ai_properties provided, MERGE (don't overwrite)
        """
        # First get existing person
        person = await self.get(tenant_id, person_id)
        if not person:
            return None

        # Apply updates
        if update_data.name:
            person.name = update_data.name

        if update_data.ai_properties:
            person.merge_properties(update_data.ai_properties)

        # Update in Neo4j
        query = """
        MATCH (p:Person {id: $person_id, tenant_id: $tenant_id})
        SET p.name = $name,
            p.ai_properties = $ai_properties,
            p.updated_at = datetime()
        RETURN p
        """

        async with self.driver.session() as session:
            await session.run(
                query,
                person_id=person_id,
                tenant_id=tenant_id,
                name=person.name,
                ai_properties=person.ai_properties
            )

        return person

    async def delete(self, tenant_id: str, person_id: str) -> bool:
        """
        Delete a Person with cascade (remove all relationships).

        Args:
            tenant_id: Tenant identifier (for security)
            person_id: Person identifier

        Returns:
            True if deleted, False if not found
        """
        query = """
        MATCH (p:Person {id: $person_id, tenant_id: $tenant_id})
        DETACH DELETE p
        RETURN count(p) as deleted_count
        """

        async with self.driver.session() as session:
            result = await session.run(query, person_id=person_id, tenant_id=tenant_id)
            record = await result.single()
            return record["deleted_count"] > 0

    async def list_by_user(self, tenant_id: str, user_id: str, limit: int = 100) -> List[Person]:
        """
        List all persons for a user.

        Args:
            tenant_id: Tenant identifier
            user_id: User identifier
            limit: Max results (default 100)

        Returns:
            List of Person entities
        """
        query = """
        MATCH (p:Person {tenant_id: $tenant_id, user_id: $user_id})
        RETURN p
        ORDER BY p.name ASC
        LIMIT $limit
        """

        async with self.driver.session() as session:
            result = await session.run(
                query,
                tenant_id=tenant_id,
                user_id=user_id,
                limit=limit
            )

            persons = []
            async for record in result:
                node = record["p"]
                persons.append(Person(
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

            return persons

    async def search_by_name(
        self,
        tenant_id: str,
        user_id: str,
        query_string: str,
        limit: int = 50
    ) -> List[Person]:
        """
        Search persons by name (case-insensitive, fuzzy matching).

        Args:
            tenant_id: Tenant identifier
            user_id: User identifier
            query_string: Search query
            limit: Max results

        Returns:
            List of matching Person entities
        """
        query = """
        MATCH (p:Person {tenant_id: $tenant_id, user_id: $user_id})
        WHERE toLower(p.name) CONTAINS toLower($query_string)
        RETURN p
        ORDER BY p.name ASC
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

            persons = []
            async for record in result:
                node = record["p"]
                persons.append(Person(
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

            return persons

    async def update_properties(
        self,
        tenant_id: str,
        person_id: str,
        new_properties: dict
    ) -> Optional[Person]:
        """
        Merge new AI-discovered properties into existing person.

        Convenience method for LLM extraction workflows.
        """
        return await self.update(
            tenant_id,
            person_id,
            PersonUpdate(ai_properties=new_properties)
        )
```

**Key Implementation Notes:**
- All queries filter by `tenant_id` for multi-tenancy security
- `update()` uses `merge_properties()` to preserve existing AI discoveries
- `search_by_name()` uses case-insensitive CONTAINS for fuzzy matching
- `delete()` uses DETACH DELETE to cascade-remove relationships

---

#### 3. Person Extractor Service (`packages/api/fidus/memory/services/person_extractor.py`)

```python
"""LLM-based person extraction from conversations."""

from typing import List, Optional, Dict, Any
from litellm import acompletion
import json

from fidus.memory.entities.person import PersonCreate
from fidus.config import settings


class PersonEntityExtractor:
    """
    Extract Person entities from natural language conversations.

    Uses structured LLM prompts to identify:
    - Name (required)
    - Profession (optional)
    - Topics of interest (optional)
    - Communication style (optional)
    - Any other relevant attributes
    """

    EXTRACTION_PROMPT = """
You are an entity extraction specialist. Extract person information from the following conversation.

Extract:
- name (REQUIRED): Person's full name
- profession (OPTIONAL): Job title or role (e.g., "Software Engineer", "Doctor", "Student")
- topics (OPTIONAL): Topics of interest as list (e.g., ["Python", "AI", "Photography"])
- communication_style (OPTIONAL): Brief description of how they communicate
- Any other relevant attributes you discover

IMPORTANT: Only extract if person is explicitly mentioned. Don't infer people not directly referenced.

Conversation:
{conversation}

Output as JSON:
{{
  "persons": [
    {{
      "name": "string (required)",
      "profession": "string or null",
      "topics": ["string"] or null,
      "communication_style": "string or null",
      "<custom_key>": "<custom_value>"
    }}
  ]
}}
"""

    def __init__(self, model: str = "gpt-4"):
        self.model = model

    async def extract_from_conversation(self, conversation: str) -> List[PersonCreate]:
        """
        Extract Person entities from conversation text.

        Args:
            conversation: User conversation text

        Returns:
            List of PersonCreate objects (may be empty if no persons found)
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

            persons = []
            for person_data in data.get("persons", []):
                if not person_data.get("name"):
                    continue  # Skip if no name

                # Build ai_properties from all extracted fields except name
                ai_properties = {}
                for key, value in person_data.items():
                    if key != "name" and value is not None:
                        ai_properties[key] = value

                persons.append(PersonCreate(
                    name=person_data["name"],
                    ai_properties=ai_properties,
                    confidence=0.85,  # LLM extraction has slightly lower confidence
                    source="llm_extracted"
                ))

            return persons

        except Exception as e:
            # Log error but don't crash
            print(f"Person extraction failed: {e}")
            return []

    async def extract_single(self, conversation: str) -> Optional[PersonCreate]:
        """
        Extract a single person (convenience method).

        Returns first extracted person or None.
        """
        persons = await self.extract_from_conversation(conversation)
        return persons[0] if persons else None
```

**Key Implementation Notes:**
- Uses structured JSON output for reliable parsing
- Flexible prompt allows LLM to discover arbitrary attributes
- Low temperature (0.3) for consistent extraction
- Graceful error handling (returns empty list on failure)
- Confidence score lower (0.85) for LLM-extracted vs manually entered

---

### API Implementation

**File to Create: `packages/api/fidus/memory/routes/person_routes.py`**

```python
"""FastAPI router for Person entity CRUD operations."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import JSONResponse

from fidus.memory.entities.person import PersonCreate, PersonUpdate, PersonResponse
from fidus.memory.repositories.person_repository import PersonRepository
from fidus.dependencies import get_person_repository, get_current_user, get_tenant_id
from fidus.config import FeatureFlags


router = APIRouter(prefix="/api/memory/entities/person", tags=["Person Entity"])


@router.post("", response_model=PersonResponse, status_code=status.HTTP_201_CREATED)
async def create_person(
    person_data: PersonCreate,
    tenant_id: str = Depends(get_tenant_id),
    current_user_id: str = Depends(get_current_user),
    repository: PersonRepository = Depends(get_person_repository)
):
    """
    Create a new Person entity.

    - **name**: Person's name (required)
    - **ai_properties**: Flexible dict of AI-discovered attributes
    - **confidence**: Extraction confidence (0.0 - 1.0)
    - **source**: explicit, inferred, llm_extracted
    """
    if not FeatureFlags.ENABLE_PERSON_ENTITY:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Person entity feature is disabled"
        )

    person = await repository.create(tenant_id, current_user_id, person_data)

    return PersonResponse(
        id=person.id,
        tenant_id=person.tenant_id,
        user_id=person.user_id,
        name=person.name,
        ai_properties=person.ai_properties,
        created_at=person.created_at,
        updated_at=person.updated_at,
        confidence=person.confidence,
        source=person.source,
        profession=person.profession,
        topics=person.topics,
        communication_style=person.communication_style
    )


@router.get("/{person_id}", response_model=PersonResponse)
async def get_person(
    person_id: str,
    tenant_id: str = Depends(get_tenant_id),
    repository: PersonRepository = Depends(get_person_repository)
):
    """Get a Person by ID with all AI-discovered properties."""
    if not FeatureFlags.ENABLE_PERSON_ENTITY:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Person entity feature is disabled"
        )

    person = await repository.get(tenant_id, person_id)

    if not person:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Person {person_id} not found"
        )

    return PersonResponse(
        id=person.id,
        tenant_id=person.tenant_id,
        user_id=person.user_id,
        name=person.name,
        ai_properties=person.ai_properties,
        created_at=person.created_at,
        updated_at=person.updated_at,
        confidence=person.confidence,
        source=person.source,
        profession=person.profession,
        topics=person.topics,
        communication_style=person.communication_style
    )


@router.put("/{person_id}", response_model=PersonResponse)
async def update_person(
    person_id: str,
    update_data: PersonUpdate,
    tenant_id: str = Depends(get_tenant_id),
    repository: PersonRepository = Depends(get_person_repository)
):
    """
    Update a Person entity.

    Properties are MERGED, not overwritten:
    - New keys are added
    - List values are unioned
    - Existing scalar values are preserved
    """
    if not FeatureFlags.ENABLE_PERSON_ENTITY:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Person entity feature is disabled"
        )

    person = await repository.update(tenant_id, person_id, update_data)

    if not person:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Person {person_id} not found"
        )

    return PersonResponse(
        id=person.id,
        tenant_id=person.tenant_id,
        user_id=person.user_id,
        name=person.name,
        ai_properties=person.ai_properties,
        created_at=person.created_at,
        updated_at=person.updated_at,
        confidence=person.confidence,
        source=person.source,
        profession=person.profession,
        topics=person.topics,
        communication_style=person.communication_style
    )


@router.delete("/{person_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_person(
    person_id: str,
    tenant_id: str = Depends(get_tenant_id),
    repository: PersonRepository = Depends(get_person_repository)
):
    """
    Delete a Person entity with cascade (removes all relationships).

    This operation cannot be undone.
    """
    if not FeatureFlags.ENABLE_PERSON_ENTITY:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Person entity feature is disabled"
        )

    deleted = await repository.delete(tenant_id, person_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Person {person_id} not found"
        )

    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)


@router.get("", response_model=List[PersonResponse])
async def list_persons(
    user_id: str = Query(..., description="Filter by user ID"),
    q: str = Query(None, description="Search query (name fuzzy match)"),
    limit: int = Query(100, ge=1, le=500, description="Max results"),
    tenant_id: str = Depends(get_tenant_id),
    repository: PersonRepository = Depends(get_person_repository)
):
    """
    List all persons for a user with optional search.

    - **user_id**: Required, filter by owner
    - **q**: Optional, fuzzy name search
    - **limit**: Max results (default 100)
    """
    if not FeatureFlags.ENABLE_PERSON_ENTITY:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Person entity feature is disabled"
        )

    if q:
        # Search mode
        persons = await repository.search_by_name(tenant_id, user_id, q, limit)
    else:
        # List all mode
        persons = await repository.list_by_user(tenant_id, user_id, limit)

    return [
        PersonResponse(
            id=p.id,
            tenant_id=p.tenant_id,
            user_id=p.user_id,
            name=p.name,
            ai_properties=p.ai_properties,
            created_at=p.created_at,
            updated_at=p.updated_at,
            confidence=p.confidence,
            source=p.source,
            profession=p.profession,
            topics=p.topics,
            communication_style=p.communication_style
        )
        for p in persons
    ]
```

**OpenAPI Schema (Auto-generated):**

```yaml
/api/memory/entities/person:
  post:
    summary: Create Person
    requestBody:
      content:
        application/json:
          schema:
            type: object
            required: [name]
            properties:
              name:
                type: string
                example: "Anna Schmidt"
              ai_properties:
                type: object
                example: {"profession": "Software Engineer", "topics": ["Python", "AI"]}
              confidence:
                type: number
                minimum: 0
                maximum: 1
                example: 0.9
              source:
                type: string
                enum: [explicit, inferred, llm_extracted]
    responses:
      201:
        description: Person created successfully
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PersonResponse'

  get:
    summary: List Persons
    parameters:
      - name: user_id
        in: query
        required: true
        schema:
          type: string
      - name: q
        in: query
        required: false
        schema:
          type: string
        description: Search query (name fuzzy match)
      - name: limit
        in: query
        schema:
          type: integer
          default: 100
    responses:
      200:
        description: List of persons
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: '#/components/schemas/PersonResponse'

/api/memory/entities/person/{person_id}:
  get:
    summary: Get Person
    responses:
      200:
        description: Person details
      404:
        description: Person not found

  put:
    summary: Update Person
    requestBody:
      content:
        application/json:
          schema:
            type: object
            properties:
              name:
                type: string
              ai_properties:
                type: object
    responses:
      200:
        description: Person updated successfully

  delete:
    summary: Delete Person
    responses:
      204:
        description: Person deleted successfully
      404:
        description: Person not found
```

---

### Frontend Implementation

**Components to Create:**

1. **`packages/web/src/components/memory/PersonList.tsx`** - List view with search
2. **`packages/web/src/components/memory/PersonDetail.tsx`** - Detail view
3. **`packages/web/src/components/memory/PersonForm.tsx`** - Create/edit form
4. **`packages/web/src/lib/api/memory.ts`** - API client methods
5. **`packages/web/src/app/memory/people/page.tsx`** - Next.js page route

#### 1. PersonList Component

```typescript
// packages/web/src/components/memory/PersonList.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Skeleton,
} from "@fidus/ui";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { getPersons } from "@/lib/api/memory";
import { PersonResponse } from "@/types/memory";

interface PersonListProps {
  userId: string;
  onSelectPerson: (personId: string) => void;
}

export function PersonList({ userId, onSelectPerson }: PersonListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: persons, isLoading, error } = useQuery({
    queryKey: ["persons", userId, debouncedSearch],
    queryFn: () => getPersons({ userId, q: debouncedSearch || undefined }),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <Card>
        <Skeleton count={5} height={60} />
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-red-600">Error loading persons: {error.message}</div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">People</h2>
        <Button onClick={() => onSelectPerson("new")}>Add Person</Button>
      </div>

      <div className="mb-4">
        <TextField
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
        />
      </div>

      {persons && persons.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No people found. Add someone or mention them in a conversation.
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Profession</TableCell>
              <TableCell>Topics</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {persons?.map((person) => (
              <TableRow
                key={person.id}
                onClick={() => onSelectPerson(person.id)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableCell className="font-medium">{person.name}</TableCell>
                <TableCell>{person.profession || "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {person.topics.slice(0, 3).map((topic) => (
                      <Chip key={topic} label={topic} size="small" />
                    ))}
                    {person.topics.length > 3 && (
                      <Chip label={`+${person.topics.length - 3}`} size="small" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    label={person.source}
                    color={
                      person.source === "explicit"
                        ? "success"
                        : person.source === "llm_extracted"
                        ? "info"
                        : "default"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button size="small" variant="text">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
```

#### 2. PersonDetail Component

```typescript
// packages/web/src/components/memory/PersonDetail.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  Button,
  Chip,
  ConfirmDialog,
  Skeleton,
} from "@fidus/ui";
import { getPerson, deletePerson } from "@/lib/api/memory";
import { PersonResponse } from "@/types/memory";
import { useState } from "react";

interface PersonDetailProps {
  personId: string;
  onEdit: () => void;
  onClose: () => void;
}

export function PersonDetail({ personId, onEdit, onClose }: PersonDetailProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const queryClient = useQueryClient();

  const { data: person, isLoading, error } = useQuery({
    queryKey: ["person", personId],
    queryFn: () => getPerson(personId),
    enabled: !!personId && personId !== "new",
  });

  const deleteM = useMutation({
    mutationFn: () => deletePerson(personId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["persons"] });
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

  if (error || !person) {
    return (
      <Card>
        <div className="text-red-600">Error loading person details</div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">{person.name}</h2>
            <Chip
              label={person.source}
              color={person.source === "llm_extracted" ? "info" : "success"}
            />
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
          {person.profession && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">
                Profession
              </h3>
              <p className="text-lg">{person.profession}</p>
            </div>
          )}

          {person.communication_style && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">
                Communication Style
              </h3>
              <p className="text-lg">{person.communication_style}</p>
            </div>
          )}

          {person.topics.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                Topics
              </h3>
              <div className="flex gap-2 flex-wrap">
                {person.topics.map((topic) => (
                  <Chip key={topic} label={topic} />
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              All Properties
            </h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(person.ai_properties, null, 2)}
              </pre>
            </div>
          </div>

          <div className="text-sm text-gray-500 space-y-1">
            <p>Created: {new Date(person.created_at).toLocaleString()}</p>
            <p>Updated: {new Date(person.updated_at).toLocaleString()}</p>
            <p>Confidence: {(person.confidence * 100).toFixed(0)}%</p>
          </div>
        </div>
      </Card>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Person"
        message={`Are you sure you want to delete ${person.name}? This will also remove all relationships with this person. This action cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={() => deleteM.mutate()}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
```

#### 3. PersonForm Component

```typescript
// packages/web/src/components/memory/PersonForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  TextField,
  Button,
  Autocomplete,
} from "@fidus/ui";
import { createPerson, updatePerson, getPerson } from "@/lib/api/memory";
import { PersonCreate, PersonUpdate } from "@/types/memory";
import { useState } from "react";

interface PersonFormProps {
  personId?: string; // undefined = create, string = edit
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const COMMON_PROFESSIONS = [
  "Software Engineer",
  "Product Manager",
  "Designer",
  "Data Scientist",
  "Teacher",
  "Doctor",
  "Lawyer",
  "Entrepreneur",
  "Consultant",
  "Student",
];

const COMMON_TOPICS = [
  "Python",
  "JavaScript",
  "AI/ML",
  "DevOps",
  "Design",
  "Product Management",
  "Marketing",
  "Sales",
  "Finance",
  "Healthcare",
  "Education",
  "Photography",
  "Music",
  "Travel",
];

export function PersonForm({ personId, userId, onSuccess, onCancel }: PersonFormProps) {
  const queryClient = useQueryClient();
  const isEdit = !!personId && personId !== "new";

  const { data: existingPerson } = useQuery({
    queryKey: ["person", personId],
    queryFn: () => getPerson(personId!),
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: existingPerson
      ? {
          name: existingPerson.name,
          profession: existingPerson.profession || "",
          communication_style: existingPerson.communication_style || "",
        }
      : {
          name: "",
          profession: "",
          communication_style: "",
        },
  });

  const [topics, setTopics] = useState<string[]>(existingPerson?.topics || []);

  const createM = useMutation({
    mutationFn: (data: PersonCreate) => createPerson(data, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["persons"] });
      onSuccess();
    },
  });

  const updateM = useMutation({
    mutationFn: (data: PersonUpdate) => updatePerson(personId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["persons"] });
      queryClient.invalidateQueries({ queryKey: ["person", personId] });
      onSuccess();
    },
  });

  const onSubmit = (formData: any) => {
    const aiProperties: Record<string, any> = {};

    if (formData.profession) {
      aiProperties.profession = formData.profession;
    }
    if (topics.length > 0) {
      aiProperties.topics = topics;
    }
    if (formData.communication_style) {
      aiProperties.communication_style = formData.communication_style;
    }

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
        {isEdit ? "Edit Person" : "Add Person"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextField
          label="Name *"
          {...register("name", { required: "Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
          fullWidth
        />

        <Autocomplete
          label="Profession"
          options={COMMON_PROFESSIONS}
          value={watch("profession")}
          onChange={(value) => setValue("profession", value)}
          freeSolo
          fullWidth
        />

        <Autocomplete
          label="Topics"
          options={COMMON_TOPICS}
          value={topics}
          onChange={(value) => setTopics(value as string[])}
          multiple
          freeSolo
          fullWidth
        />

        <TextField
          label="Communication Style"
          {...register("communication_style")}
          multiline
          rows={3}
          placeholder="e.g., direct, technical, friendly, formal..."
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

#### 4. API Client Methods

```typescript
// packages/web/src/lib/api/memory.ts
import { PersonCreate, PersonUpdate, PersonResponse } from "@/types/memory";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getPersons(params: {
  userId: string;
  q?: string;
  limit?: number;
}): Promise<PersonResponse[]> {
  const url = new URL(`${API_BASE}/api/memory/entities/person`);
  url.searchParams.set("user_id", params.userId);
  if (params.q) url.searchParams.set("q", params.q);
  if (params.limit) url.searchParams.set("limit", params.limit.toString());

  const response = await fetch(url.toString(), {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch persons: ${response.statusText}`);
  }

  return response.json();
}

export async function getPerson(personId: string): Promise<PersonResponse> {
  const response = await fetch(
    `${API_BASE}/api/memory/entities/person/${personId}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch person: ${response.statusText}`);
  }

  return response.json();
}

export async function createPerson(
  data: PersonCreate,
  userId: string
): Promise<PersonResponse> {
  const response = await fetch(`${API_BASE}/api/memory/entities/person`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create person: ${response.statusText}`);
  }

  return response.json();
}

export async function updatePerson(
  personId: string,
  data: PersonUpdate
): Promise<PersonResponse> {
  const response = await fetch(
    `${API_BASE}/api/memory/entities/person/${personId}`,
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
    throw new Error(`Failed to update person: ${response.statusText}`);
  }

  return response.json();
}

export async function deletePerson(personId: string): Promise<void> {
  const response = await fetch(
    `${API_BASE}/api/memory/entities/person/${personId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete person: ${response.statusText}`);
  }
}
```

#### 5. Next.js Page Route

```typescript
// packages/web/src/app/memory/people/page.tsx
"use client";

import { useState } from "react";
import { PersonList } from "@/components/memory/PersonList";
import { PersonDetail } from "@/components/memory/PersonDetail";
import { PersonForm } from "@/components/memory/PersonForm";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

export default function PeoplePage() {
  const { user } = useCurrentUser();
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleClose = () => {
    setSelectedPersonId(null);
    setIsEditMode(false);
  };

  const handleSuccess = () => {
    setSelectedPersonId(null);
    setIsEditMode(false);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">My Network</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <PersonList
            userId={user.id}
            onSelectPerson={setSelectedPersonId}
          />
        </div>

        <div>
          {selectedPersonId === "new" || isEditMode ? (
            <PersonForm
              personId={selectedPersonId === "new" ? undefined : selectedPersonId!}
              userId={user.id}
              onSuccess={handleSuccess}
              onCancel={handleClose}
            />
          ) : selectedPersonId ? (
            <PersonDetail
              personId={selectedPersonId}
              onEdit={() => setIsEditMode(true)}
              onClose={handleClose}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Select a person to view details or click "Add Person" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

**UI/UX Requirements:**
- Responsive: 2-column layout on desktop, single column on mobile
- Search debounced to avoid excessive API calls (300ms)
- Loading states with skeleton screens
- Confirm dialog before delete (prevent accidental deletion)
- Chips for visual categorization (topics, source)
- Autocomplete with common professions/topics + allow custom
- Error handling with user-friendly messages

---

### Testing Requirements

#### Unit Tests

**File: `packages/api/tests/unit/memory/test_person_repository.py`**

```python
import pytest
from fidus.memory.repositories.person_repository import PersonRepository
from fidus.memory.entities.person import PersonCreate, PersonUpdate


@pytest.mark.asyncio
async def test_create_person(person_repository: PersonRepository):
    """Test creating a person with ai_properties."""
    person_data = PersonCreate(
        name="Test Person",
        ai_properties={"profession": "Tester", "topics": ["Testing", "QA"]},
        source="explicit",
        confidence=1.0
    )

    person = await person_repository.create("tenant_1", "user_1", person_data)

    assert person.id is not None
    assert person.name == "Test Person"
    assert person.profession == "Tester"
    assert person.topics == ["Testing", "QA"]


@pytest.mark.asyncio
async def test_merge_properties_preserves_existing(person_repository: PersonRepository):
    """Test that update merges properties without overwriting."""
    # Create person
    person_data = PersonCreate(
        name="Test Person",
        ai_properties={"profession": "Engineer", "topics": ["Python"]},
    )
    person = await person_repository.create("tenant_1", "user_1", person_data)

    # Update with new properties
    update_data = PersonUpdate(
        ai_properties={"topics": ["AI"], "communication_style": "direct"}
    )
    updated = await person_repository.update("tenant_1", person.id, update_data)

    # Assert: profession preserved, topics merged, communication_style added
    assert updated.profession == "Engineer"  # preserved
    assert set(updated.topics) == {"Python", "AI"}  # merged
    assert updated.communication_style == "direct"  # added


@pytest.mark.asyncio
async def test_search_by_name_case_insensitive(person_repository: PersonRepository):
    """Test search by name is case-insensitive."""
    await person_repository.create("tenant_1", "user_1", PersonCreate(name="Anna Schmidt"))
    await person_repository.create("tenant_1", "user_1", PersonCreate(name="Thomas Klein"))

    results = await person_repository.search_by_name("tenant_1", "user_1", "anna")

    assert len(results) == 1
    assert results[0].name == "Anna Schmidt"


@pytest.mark.asyncio
async def test_tenant_isolation(person_repository: PersonRepository):
    """Test that tenant_id isolation works."""
    await person_repository.create("tenant_1", "user_1", PersonCreate(name="Person A"))
    await person_repository.create("tenant_2", "user_2", PersonCreate(name="Person B"))

    # User 1 should only see Person A
    persons = await person_repository.list_by_user("tenant_1", "user_1")
    assert len(persons) == 1
    assert persons[0].name == "Person A"
```

#### Integration Tests

**File: `packages/api/tests/integration/memory/test_person_extraction.py`**

```python
import pytest
from fidus.memory.services.person_extractor import PersonEntityExtractor


@pytest.mark.asyncio
async def test_extract_person_from_conversation():
    """Test LLM extracts person with attributes."""
    extractor = PersonEntityExtractor()

    conversation = """
    I met Anna Schmidt yesterday. She's a software engineer at Anthropic.
    We discussed Python and AI safety. She has a very direct communication style.
    """

    persons = await extractor.extract_from_conversation(conversation)

    assert len(persons) == 1
    person = persons[0]

    assert person.name == "Anna Schmidt"
    assert person.ai_properties.get("profession") in ["Software Engineer", "software engineer"]
    assert "Python" in str(person.ai_properties.get("topics", []))
    assert person.source == "llm_extracted"
    assert person.confidence < 1.0  # LLM extraction has lower confidence


@pytest.mark.asyncio
async def test_extract_multiple_persons():
    """Test extracting multiple persons from one conversation."""
    extractor = PersonEntityExtractor()

    conversation = """
    I had lunch with Thomas (product manager) and Sarah (designer).
    They both work at Google.
    """

    persons = await extractor.extract_from_conversation(conversation)

    assert len(persons) == 2
    names = [p.name for p in persons]
    assert "Thomas" in names
    assert "Sarah" in names


@pytest.mark.asyncio
async def test_no_person_mentioned_returns_empty():
    """Test that no extraction happens when no person mentioned."""
    extractor = PersonEntityExtractor()

    conversation = "I went to the park today. It was sunny."

    persons = await extractor.extract_from_conversation(conversation)

    assert len(persons) == 0
```

#### E2E Tests

**File: `packages/web/tests/e2e/memory/person-workflow.spec.ts`**

```typescript
import { test, expect } from "@playwright/test";

test.describe("Person Management Workflow", () => {
  test("User can create, view, edit, and delete a person", async ({ page }) => {
    // Step 1: Navigate to people page
    await page.goto("/memory/people");
    await expect(page.locator("h1")).toContainText("My Network");

    // Step 2: Click "Add Person"
    await page.click('button:has-text("Add Person")');
    await expect(page.locator("h2")).toContainText("Add Person");

    // Step 3: Fill form
    await page.fill('input[name="name"]', "Thomas Klein");
    await page.fill('input[label="Profession"]', "DevOps Engineer");

    // Add topics
    await page.click('input[label="Topics"]');
    await page.fill('input[label="Topics"]', "Docker");
    await page.keyboard.press("Enter");
    await page.fill('input[label="Topics"]', "Kubernetes");
    await page.keyboard.press("Enter");

    await page.fill('textarea[label="Communication Style"]', "friendly, helpful");

    // Step 4: Submit form
    await page.click('button[type="submit"]:has-text("Create")');

    // Step 5: Verify person appears in list
    await expect(page.locator("text=Thomas Klein")).toBeVisible();
    await expect(page.locator("text=DevOps Engineer")).toBeVisible();

    // Step 6: Click to view details
    await page.click("text=Thomas Klein");
    await expect(page.locator("h2")).toContainText("Thomas Klein");
    await expect(page.locator("text=friendly, helpful")).toBeVisible();

    // Step 7: Edit person
    await page.click('button:has-text("Edit")');
    await page.fill('input[name="name"]', "Thomas K. Klein");
    await page.click('button[type="submit"]:has-text("Update")');

    // Step 8: Verify update
    await expect(page.locator("h2")).toContainText("Thomas K. Klein");

    // Step 9: Delete person
    await page.click('button:has-text("Delete")');
    await page.click('button:has-text("Delete")'); // Confirm dialog

    // Step 10: Verify deletion
    await expect(page.locator("text=Thomas K. Klein")).not.toBeVisible();
  });

  test("Search filters persons by name", async ({ page }) => {
    // Setup: Create multiple persons
    await page.goto("/memory/people");
    // ... create Anna, Thomas, Sarah ...

    // Type in search
    await page.fill('input[placeholder="Search by name..."]', "anna");

    // Verify only Anna visible
    await expect(page.locator("text=Anna")).toBeVisible();
    await expect(page.locator("text=Thomas")).not.toBeVisible();
  });

  test("LLM extraction from conversation", async ({ page }) => {
    // Step 1: Go to chat
    await page.goto("/chat");

    // Step 2: Send message mentioning person
    await page.fill('textarea[placeholder="Type a message..."]',
      "I met Julia Schneider today. She's a data scientist at OpenAI.");
    await page.keyboard.press("Enter");

    // Wait for processing
    await page.waitForTimeout(3000);

    // Step 3: Navigate to people
    await page.goto("/memory/people");

    // Step 4: Verify person extracted
    await expect(page.locator("text=Julia Schneider")).toBeVisible();
    await expect(page.locator("text=Data Scientist")).toBeVisible();

    // Step 5: Check source chip
    await expect(page.locator('span:has-text("llm_extracted")')).toBeVisible();
  });
});
```

---

## Implementation Guidelines

### Must Follow

1. **Feature Flag:**
   - All functionality behind feature flag: `ENABLE_PERSON_ENTITY`
   - Add to `packages/api/fidus/config.py`:
     ```python
     class FeatureFlags:
         ENABLE_PERSON_ENTITY: bool = env.bool("ENABLE_PERSON_ENTITY", False)
     ```
   - Default: disabled
   - API endpoints check flag and return 501 if disabled

2. **Multi-Tenancy:**
   - ALL Neo4j queries filter by `tenant_id`
   - Security: User cannot access persons from other tenants
   - Test: Verify tenant isolation in integration tests

3. **AI Properties Merging:**
   - NEVER overwrite existing AI properties
   - Use `merge_properties()` method for intelligent merging
   - List values: union (no duplicates)
   - Scalar values: preserve existing

4. **Error Handling:**
   - User-facing errors: Clear, actionable messages
   - Logging: Structured logs with `tenant_id`, `user_id`, `person_id`
   - LLM extraction failures: Graceful fallback (return empty list)

5. **Code Quality:**
   - Type hints: All Python functions fully typed
   - TypeScript: No `any` types (use `unknown` if needed)
   - Docstrings: All public methods documented
   - Linting: Pass Ruff (Python) and ESLint (TypeScript)

### Must NOT Do

- ❌ Break existing functionality (additive changes only)
- ❌ Skip tests (100% of acceptance criteria must be tested)
- ❌ Hard-code tenant_id or user_id
- ❌ Allow cross-tenant data leaks
- ❌ Overwrite AI properties on update (use merge)

---

## Dependencies & Prerequisites

**Required Before Starting:**
- [x] Package 1.1 (Qdrant-First Pattern) completed
- [x] Package 1.2 (User Entity) completed
- [ ] Neo4j 5.x running and accessible
- [ ] Feature flag `ENABLE_PERSON_ENTITY` added to config
- [ ] LiteLLM configured with API key

**Technical Dependencies:**
- Neo4j 5.x on `neo4j://localhost:7687`
- Python 3.11+ with FastAPI, Pydantic
- Node 18+ with Next.js 14, React 18
- LiteLLM for LLM calls

---

## Step-by-Step Implementation Plan

### Phase 1: Backend Core (Tasks 1-5)
1. Create `person.py` entity model with `ai_properties` dict
2. Create `person_repository.py` with CRUD + search
3. Write unit tests for repository
4. Create `person_extractor.py` LLM service
5. Write integration tests for extraction

### Phase 2: API Layer (Tasks 6-12)
1. Create `person_routes.py` FastAPI router
2. Implement POST `/api/memory/entities/person` (create)
3. Implement GET `/api/memory/entities/person/{id}` (get)
4. Implement PUT `/api/memory/entities/person/{id}` (update)
5. Implement DELETE `/api/memory/entities/person/{id}` (delete)
6. Implement GET `/api/memory/entities/person?user_id=...&q=...` (list/search)
7. Write integration tests for all endpoints

### Phase 3: Frontend (Tasks 13-17)
1. Create `PersonList.tsx` component with search
2. Create `PersonDetail.tsx` component
3. Create `PersonForm.tsx` component
4. Create API client methods in `memory.ts`
5. Create Next.js page route at `/memory/people`
6. Test UI components manually

### Phase 4: Integration & Testing (Tasks 18-19)
1. Write E2E test: Create → View → Edit → Delete
2. Write E2E test: Search functionality
3. Write E2E test: LLM extraction from conversation
4. Test feature flag toggle (on/off)

### Phase 5: Documentation (Task 20)
1. Update `/Users/sebastianherden/Documents/GitHub/fidus/docs/solution-architecture/15-entity-management.md`
2. Add Person entity specification with example properties
3. Document property merging strategy
4. Add code examples for common workflows

---

## Verification Checklist

Before marking this package as complete, verify:

### Functionality
- [ ] Person can be created via API (POST)
- [ ] Person can be retrieved via API (GET)
- [ ] Person can be updated via API (PUT) with property merging
- [ ] Person can be deleted via API (DELETE) with cascade
- [ ] Person list can be queried by user_id
- [ ] Person search works (case-insensitive fuzzy match)
- [ ] LLM extraction works from conversation text
- [ ] UI: Person list displays with search
- [ ] UI: Person detail shows all properties
- [ ] UI: Person form creates/edits successfully
- [ ] User story fully implemented end-to-end

### Code Quality
- [ ] All files created as specified
- [ ] Type hints on all Python functions
- [ ] No TypeScript `any` types used
- [ ] No Ruff linting errors
- [ ] No ESLint errors
- [ ] `npm run typecheck` passes

### Testing
- [ ] Unit tests pass (>80% coverage for repository)
- [ ] Integration tests pass (all endpoints + extraction)
- [ ] E2E test passes (create → view → edit → delete workflow)
- [ ] E2E test passes (search functionality)
- [ ] E2E test passes (LLM extraction)
- [ ] Feature flag toggle tested (on/off works correctly)

### Documentation
- [ ] Code comments for complex logic (property merging)
- [ ] Docstrings for all public methods
- [ ] `/docs/solution-architecture/15-entity-management.md` updated
- [ ] Migration notes documented (none required for this package)

### Security & Performance
- [ ] Multi-tenancy verified (no cross-tenant leaks)
- [ ] Input validation on all API endpoints (Pydantic)
- [ ] No N+1 query problems (checked with EXPLAIN PLAN)
- [ ] Search query debounced in UI (300ms)

### Deployment Readiness
- [ ] Feature flag `ENABLE_PERSON_ENTITY` defined in config
- [ ] Environment variables documented (LiteLLM API key)
- [ ] No database migrations required (Person is new entity)
- [ ] Rollback plan: Set `ENABLE_PERSON_ENTITY=false`

---

## Risk Mitigation

**Risks from WBS:**
- **Risk:** LLM may extract incomplete or incorrect person data
- **Mitigation:** Confidence scoring (0.85 for LLM vs 1.0 for manual), user confirmation workflow, easy editing in UI

- **Risk:** Duplicate persons if name variations occur ("Anna" vs "Anna Schmidt")
- **Mitigation:** Accept for now, defer to Package 5.4 (entity deduplication), allow duplicates in meantime

**Additional Risks:**
- **Risk:** Property merging may not handle edge cases (e.g., conflicting scalar values)
- **Mitigation:** Document merge strategy clearly, test with various data types, allow manual override in UI

- **Risk:** Large `ai_properties` dict may slow Neo4j queries
- **Mitigation:** Monitor query performance, add pagination to list endpoint if needed

---

## Related Resources

**WBS Package Details:** `/Users/sebastianherden/Documents/GitHub/fidus/docs/prototypes/fidus-memory/migration-v3-wbs.md` (Lines 370-426)

**Architecture References:**
- Solution Architecture: `/Users/sebastianherden/Documents/GitHub/fidus/docs/solution-architecture/03-component-architecture.md`
- Solution Architecture: `/Users/sebastianherden/Documents/GitHub/fidus/docs/solution-architecture/15-entity-management.md`
- Domain Model: `/Users/sebastianherden/Documents/GitHub/fidus/docs/domain-model/entity-relationship-model.md`

**Existing Codebase:**
- Backend: `packages/api/fidus/memory/`
- Frontend: `packages/web/src/components/memory/`
- Tests: `packages/api/tests/`, `packages/web/tests/e2e/`

---

## Questions to Resolve Before Starting

If any of these are unclear, ask for clarification:

1. **UI Layout:** Should PersonList and PersonDetail be side-by-side (2-column) or full-width (1-column with modal)?
   - **Answer:** Side-by-side on desktop (shown in implementation), modal on mobile.

2. **Search Behavior:** Should search be instant (every keystroke) or require "Enter" key?
   - **Answer:** Debounced (300ms) for balance between UX and API load.

3. **LLM Model:** Which LiteLLM model should be used for extraction?
   - **Answer:** Default to `gpt-4`, configurable via environment variable.

---

## Success Criteria

This package is **successfully implemented** when:

1. ✅ A user can chat "I met Anna Schmidt, she's an engineer" and see Anna in /memory/people
2. ✅ A user can manually create a person with custom properties via the UI
3. ✅ A user can search for persons by name
4. ✅ A user can edit a person and add new properties (existing properties preserved)
5. ✅ A user can delete a person with confirmation dialog
6. ✅ All acceptance criteria are verified (checked off)
7. ✅ All tests pass (unit, integration, E2E)
8. ✅ Code review approved
9. ✅ Deployed to dev environment with feature flag OFF
10. ✅ Manual smoke test completed successfully
11. ✅ Documentation updated

---

**Prompt Version:** 1.0
**Generated:** 2025-11-21
**Target Package:** 2.1

---

**END OF IMPLEMENTATION PROMPT**

# Implementation Prompt: 5.1 - Object Entity with Inventory UI

**Package:** 5.1
**Epic:** Completion & Optimization
**Priority:** 🟢 LOW
**Context Document:** `/docs/prototypes/fidus-memory/migration-v3-wbs.md` (Lines 1051-1092)

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
- User entity operational (Package 1.2)
- Person, Organization, Goal entities implemented (Packages 2.1-2.3)
- Core relationships (KNOWS, WORKS_AT, PURSUES, MEMBER_OF) operational (Packages 3.1-3.4)
- Extended entities (Habit, Event) and relationships (HAS_HABIT, ATTENDS) implemented (Packages 4.1-4.3)
- LangGraph orchestration engine operational (Package 4.4)
- Entity coverage: 7/9 entities (User, Person, Organization, Goal, Habit, Event implemented)
- Relationship coverage: 6/9 relationships implemented

**Migration Goal:**
- Add Object entity to track possessions and frequently used items
- Increase entity coverage to 8/9 (89%)
- Enable AI-driven object extraction from conversations
- Provide inventory management UI for users to view and organize their objects
- Prepare for OWNS relationship implementation (Package 5.3)

**Architecture References:**
- Solution Architecture: `/docs/solution-architecture/15-entity-management.md`
- Domain Model: Entity-Relationship Model (9 entity types specification)
- ADR-0001: `/docs/adr/ADR-0001-situational-context-as-relationship-qualifier.md`
- ADR-0002: `/docs/adr/ADR-0002-property-placement-and-geospatial-exception.md` (Qdrant-First pattern)

---

## Your Task

Implement **Object Entity with Inventory UI** according to the specifications below.

**User Story:**
As a user, I want to track objects I own or use frequently so the system can make recommendations based on my possessions.

**Acceptance Criteria:**
1. Backend: Object entity model following Qdrant-First pattern (ADR-0002)
   - Neo4j: Minimal structural fields (id, tenant_id, name, category, created_at)
   - Qdrant: Full context (brand, model, purchase_date, purchase_price, condition, location, notes, etc.)
2. Backend: ObjectRepository with CRUD operations for both Neo4j and Qdrant
3. Backend: Qdrant collection setup with embedding dimension configuration
4. Backend: Embedding generation service for object context
5. Backend: LLM object extractor to identify objects from conversation
6. Backend: 1-Hop Query Pattern implementation (Qdrant search → Neo4j traversal)
7. API: REST endpoints for Object CRUD operations
8. Frontend: Inventory list view with category filtering
9. Frontend: Object detail view showing all properties and metadata
10. Frontend: Object creation/edit form with category selection
11. Tests: Extract "I bought a MacBook Pro" from conversation and create Object entity
12. Tests: Verify Qdrant-First pattern (context in Qdrant, structure in Neo4j)
13. Documentation: Update entity management guide with Object implementation

---

## Technical Specification

### Backend Implementation

**Files to Create/Modify:**

1. **`packages/api/fidus/memory/entities/object.py`** - Object entity Pydantic model (Qdrant-First pattern)
2. **`packages/api/fidus/memory/repositories/object_repository.py`** - Repository with CRUD for Neo4j + Qdrant
3. **`packages/api/fidus/memory/services/object_embedding_service.py`** - Generate embeddings for object context
4. **`packages/api/fidus/memory/services/object_extractor.py`** - LLM-powered object extraction from conversation
5. **`packages/api/fidus/memory/services/qdrant_service.py`** - Qdrant collection management and queries
6. **`packages/api/fidus/memory/routes/object_routes.py`** - FastAPI router with CRUD endpoints
7. **`packages/api/fidus/config.py`** - Add feature flag `ENABLE_OBJECT_ENTITY`

**Detailed Tasks:**

#### Task 1: Create Object Entity Model (Qdrant-First Pattern)

**File:** `packages/api/fidus/memory/entities/object.py`

```python
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from datetime import datetime, date
from uuid import uuid4


class Object(BaseModel):
    """
    Object entity representing physical items the user owns or uses.

    QDRANT-FIRST PATTERN (ADR-0002):
    - Neo4j: MINIMAL structural fields (id, tenant_id, name, category, created_at)
    - Qdrant: FULL context (brand, model, purchase details, condition, location, notes)

    This enables:
    - Semantic search: "Show me my Apple devices" (Qdrant embedding search)
    - Graph traversal: "Who owns this object?" (Neo4j relationships)
    - Efficient filtering: Category-based queries (Neo4j index)
    """
    id: str = Field(default_factory=lambda: str(uuid4()))
    tenant_id: str = Field(..., description="Multi-tenancy identifier")
    user_id: str = Field(..., description="Owner user ID")
    name: str = Field(..., min_length=1, max_length=255, description="Object name")

    # Minimal structural field for basic filtering
    category: Optional[str] = Field(None, description="Basic category for filtering (e.g., 'electronics', 'furniture')")

    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "id": "obj_123",
                "tenant_id": "tenant_1",
                "user_id": "user_1",
                "name": "MacBook Pro",
                "category": "electronics",
                "created_at": "2025-11-21T10:00:00Z",
                "updated_at": "2025-11-21T10:00:00Z"
            }
        }


class ObjectContext(BaseModel):
    """
    Full context stored in Qdrant for semantic search.

    This includes ALL descriptive properties about the object.
    """
    # Core descriptive fields
    brand: Optional[str] = Field(None, description="Manufacturer or brand")
    model: Optional[str] = Field(None, description="Model number or variant")

    # Purchase information
    purchase_date: Optional[date] = Field(None, description="When object was acquired")
    purchase_price: Optional[float] = Field(None, description="Purchase price in local currency")
    purchase_location: Optional[str] = Field(None, description="Where it was purchased")

    # Physical attributes
    color: Optional[str] = Field(None, description="Object color")
    condition: Optional[str] = Field(None, description="Condition: new, used, refurbished, broken")
    location: Optional[str] = Field(None, description="Where object is kept (e.g., 'office', 'bedroom')")

    # Usage and purpose
    usage_purpose: Optional[str] = Field(None, description="What the object is used for")
    usage_frequency: Optional[str] = Field(None, description="How often it's used (daily, weekly, rarely)")

    # Additional metadata
    notes: Optional[str] = Field(None, description="Free-form notes about the object")
    tags: list[str] = Field(default_factory=list, description="User-defined tags")

    # Flexible AI-discovered properties
    ai_properties: Dict[str, Any] = Field(
        default_factory=dict,
        description="Additional AI-discovered attributes"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "brand": "Apple",
                "model": "16-inch M3 Max",
                "purchase_date": "2024-03-15",
                "purchase_price": 3999.99,
                "purchase_location": "Apple Store Berlin",
                "color": "Space Gray",
                "condition": "new",
                "location": "office desk",
                "usage_purpose": "software development",
                "usage_frequency": "daily",
                "notes": "Work laptop, configured with extra RAM",
                "tags": ["work", "computer", "primary-device"],
                "ai_properties": {
                    "storage": "1TB SSD",
                    "ram": "32GB",
                    "warranty_expires": "2027-03-15"
                }
            }
        }


class ObjectWithContext(BaseModel):
    """Combined object with full context (for API responses)"""
    # Neo4j fields
    id: str
    tenant_id: str
    user_id: str
    name: str
    category: Optional[str]
    created_at: datetime
    updated_at: datetime

    # Qdrant context
    context: ObjectContext

    # Semantic search score (when applicable)
    relevance_score: Optional[float] = None


class ObjectCreate(BaseModel):
    """Request model for creating an object"""
    name: str = Field(..., min_length=1, max_length=255)
    category: Optional[str] = None
    context: ObjectContext = Field(default_factory=ObjectContext)


class ObjectUpdate(BaseModel):
    """Request model for updating an object"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    category: Optional[str] = None
    context: Optional[ObjectContext] = None
```

**Key Implementation Notes:**
- **Neo4j stores MINIMAL fields**: id, tenant_id, user_id, name, category (for basic filtering), timestamps
- **Qdrant stores FULL CONTEXT**: All descriptive properties (brand, model, purchase details, condition, location, notes)
- **ObjectContext** is a structured model for type safety but stored as payload in Qdrant
- **Semantic search enabled**: "Show me my Apple devices" queries Qdrant embeddings
- **1-Hop pattern**: Search Qdrant → Get object IDs → Traverse Neo4j relationships
- Follows ADR-0002 Qdrant-First pattern

---

#### Task 2: Create Qdrant Service

**File:** `packages/api/fidus/memory/services/qdrant_service.py`

```python
from typing import List, Optional, Dict, Any
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
from fidus.memory.entities.object import ObjectContext
import json


class QdrantService:
    """
    Service for managing Qdrant collections and operations.

    Handles:
    - Collection creation and management
    - Point insertion/update/deletion
    - Semantic search with filters
    """

    OBJECTS_COLLECTION = "objects"
    EMBEDDING_DIMENSION = 1536  # OpenAI text-embedding-3-small dimension

    def __init__(self, qdrant_client: QdrantClient):
        self.client = qdrant_client

    async def ensure_objects_collection(self) -> None:
        """
        Ensure the objects collection exists with proper configuration.

        Creates collection if it doesn't exist.
        """
        collections = await self.client.get_collections()
        collection_names = [c.name for c in collections.collections]

        if self.OBJECTS_COLLECTION not in collection_names:
            await self.client.create_collection(
                collection_name=self.OBJECTS_COLLECTION,
                vectors_config=VectorParams(
                    size=self.EMBEDDING_DIMENSION,
                    distance=Distance.COSINE
                )
            )

    async def upsert_object_context(
        self,
        object_id: str,
        tenant_id: str,
        user_id: str,
        name: str,
        category: Optional[str],
        context: ObjectContext,
        embedding: List[float]
    ) -> None:
        """
        Insert or update object context in Qdrant.

        Args:
            object_id: Neo4j object ID
            tenant_id: Multi-tenancy identifier
            user_id: Owner user ID
            name: Object name (for search context)
            category: Object category (for filtering)
            context: Full object context
            embedding: Text embedding vector
        """
        payload = {
            "object_id": object_id,
            "tenant_id": tenant_id,
            "user_id": user_id,
            "name": name,
            "category": category,
            "context": context.model_dump(mode="json")
        }

        point = PointStruct(
            id=object_id,
            vector=embedding,
            payload=payload
        )

        await self.client.upsert(
            collection_name=self.OBJECTS_COLLECTION,
            points=[point]
        )

    async def search_objects(
        self,
        query_embedding: List[float],
        tenant_id: str,
        user_id: Optional[str] = None,
        category: Optional[str] = None,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Semantic search for objects by embedding.

        Args:
            query_embedding: Query vector
            tenant_id: Multi-tenancy filter
            user_id: Optional user filter
            category: Optional category filter
            limit: Max results

        Returns:
            List of search results with scores
        """
        # Build filter
        must_conditions = [
            FieldCondition(key="tenant_id", match=MatchValue(value=tenant_id))
        ]

        if user_id:
            must_conditions.append(
                FieldCondition(key="user_id", match=MatchValue(value=user_id))
            )

        if category:
            must_conditions.append(
                FieldCondition(key="category", match=MatchValue(value=category))
            )

        filter_obj = Filter(must=must_conditions)

        # Search
        results = await self.client.search(
            collection_name=self.OBJECTS_COLLECTION,
            query_vector=query_embedding,
            query_filter=filter_obj,
            limit=limit
        )

        return [
            {
                "object_id": r.payload["object_id"],
                "name": r.payload["name"],
                "category": r.payload.get("category"),
                "context": ObjectContext(**r.payload["context"]),
                "score": r.score
            }
            for r in results
        ]

    async def get_object_context(
        self,
        object_id: str,
        tenant_id: str
    ) -> Optional[Dict[str, Any]]:
        """
        Retrieve object context from Qdrant by ID.

        Args:
            object_id: Object identifier
            tenant_id: Multi-tenancy check

        Returns:
            Object context or None
        """
        try:
            point = await self.client.retrieve(
                collection_name=self.OBJECTS_COLLECTION,
                ids=[object_id]
            )

            if not point or len(point) == 0:
                return None

            payload = point[0].payload

            # Verify tenant isolation
            if payload["tenant_id"] != tenant_id:
                return None

            return {
                "object_id": payload["object_id"],
                "name": payload["name"],
                "category": payload.get("category"),
                "context": ObjectContext(**payload["context"])
            }

        except Exception:
            return None

    async def delete_object_context(
        self,
        object_id: str,
        tenant_id: str
    ) -> bool:
        """
        Delete object context from Qdrant.

        Args:
            object_id: Object identifier
            tenant_id: Multi-tenancy check

        Returns:
            True if deleted, False otherwise
        """
        # Verify ownership before deletion
        existing = await self.get_object_context(object_id, tenant_id)
        if not existing:
            return False

        await self.client.delete(
            collection_name=self.OBJECTS_COLLECTION,
            points_selector=[object_id]
        )

        return True
```

---

#### Task 3: Create Object Embedding Service

**File:** `packages/api/fidus/memory/services/object_embedding_service.py`

```python
from typing import List
from litellm import aembedding
from fidus.memory.entities.object import ObjectContext


class ObjectEmbeddingService:
    """
    Service for generating embeddings for object context.

    Uses LiteLLM to generate embeddings from object descriptions.
    """

    def __init__(self, model: str = "text-embedding-3-small"):
        self.model = model

    async def generate_embedding(
        self,
        name: str,
        context: ObjectContext
    ) -> List[float]:
        """
        Generate embedding for object based on name and context.

        Creates a rich text representation of the object for semantic search.

        Args:
            name: Object name
            context: Full object context

        Returns:
            Embedding vector
        """
        # Build rich text representation
        text_parts = [f"Object: {name}"]

        if context.brand:
            text_parts.append(f"Brand: {context.brand}")

        if context.model:
            text_parts.append(f"Model: {context.model}")

        if context.category:
            text_parts.append(f"Category: {context.category}")

        if context.usage_purpose:
            text_parts.append(f"Purpose: {context.usage_purpose}")

        if context.location:
            text_parts.append(f"Location: {context.location}")

        if context.notes:
            text_parts.append(f"Notes: {context.notes}")

        if context.tags:
            text_parts.append(f"Tags: {', '.join(context.tags)}")

        text = ". ".join(text_parts)

        # Generate embedding
        response = await aembedding(
            model=self.model,
            input=[text]
        )

        return response.data[0]["embedding"]
```

---

#### Task 4: Create ObjectRepository (Dual Storage)

**File:** `packages/api/fidus/memory/repositories/object_repository.py`

```python
from typing import List, Optional
from neo4j import AsyncDriver
from fidus.memory.entities.object import Object, ObjectCreate, ObjectUpdate, ObjectWithContext, ObjectContext
from fidus.memory.services.qdrant_service import QdrantService
from fidus.memory.services.object_embedding_service import ObjectEmbeddingService
from datetime import datetime


class ObjectRepository:
    """
    Repository for Object entity CRUD operations.

    QDRANT-FIRST PATTERN (ADR-0002):
    - Neo4j: Stores MINIMAL structural data
    - Qdrant: Stores FULL context with embeddings
    """

    def __init__(
        self,
        neo4j_driver: AsyncDriver,
        qdrant_service: QdrantService,
        embedding_service: ObjectEmbeddingService
    ):
        self.driver = neo4j_driver
        self.qdrant = qdrant_service
        self.embeddings = embedding_service

    async def create(
        self,
        tenant_id: str,
        user_id: str,
        obj_data: ObjectCreate
    ) -> ObjectWithContext:
        """
        Create new Object in BOTH Neo4j and Qdrant.

        Neo4j: Minimal structure (id, tenant_id, user_id, name, category)
        Qdrant: Full context with embedding

        Args:
            tenant_id: Multi-tenancy identifier
            user_id: Owner user ID
            obj_data: Object creation data

        Returns:
            Created Object with context
        """
        # Create minimal Neo4j object
        obj = Object(
            tenant_id=tenant_id,
            user_id=user_id,
            name=obj_data.name,
            category=obj_data.category
        )

        # 1. Insert minimal structure in Neo4j
        query = """
        CREATE (o:Object {
            id: $id,
            tenant_id: $tenant_id,
            user_id: $user_id,
            name: $name,
            category: $category,
            created_at: datetime(),
            updated_at: datetime()
        })
        RETURN o
        """

        async with self.driver.session() as session:
            result = await session.run(
                query,
                id=obj.id,
                tenant_id=obj.tenant_id,
                user_id=obj.user_id,
                name=obj.name,
                category=obj.category
            )
            await result.consume()

        # 2. Generate embedding for context
        embedding = await self.embeddings.generate_embedding(
            name=obj.name,
            context=obj_data.context
        )

        # 3. Store full context in Qdrant
        await self.qdrant.upsert_object_context(
            object_id=obj.id,
            tenant_id=tenant_id,
            user_id=user_id,
            name=obj.name,
            category=obj.category,
            context=obj_data.context,
            embedding=embedding
        )

        return ObjectWithContext(
            id=obj.id,
            tenant_id=obj.tenant_id,
            user_id=obj.user_id,
            name=obj.name,
            category=obj.category,
            created_at=obj.created_at,
            updated_at=obj.updated_at,
            context=obj_data.context
        )

    async def get(
        self,
        object_id: str,
        tenant_id: str
    ) -> Optional[ObjectWithContext]:
        """
        Get Object with full context from BOTH Neo4j and Qdrant.

        1-HOP QUERY PATTERN:
        1. Get minimal structure from Neo4j
        2. Get full context from Qdrant
        3. Combine and return
        """
        # 1. Get minimal structure from Neo4j
        query = """
        MATCH (o:Object {id: $object_id, tenant_id: $tenant_id})
        RETURN o
        """

        async with self.driver.session() as session:
            result = await session.run(query, object_id=object_id, tenant_id=tenant_id)
            record = await result.single()

            if not record:
                return None

            node = record["o"]

        # 2. Get full context from Qdrant
        qdrant_result = await self.qdrant.get_object_context(object_id, tenant_id)

        if not qdrant_result:
            # Fallback: return without context if Qdrant data missing
            return ObjectWithContext(
                id=node["id"],
                tenant_id=node["tenant_id"],
                user_id=node["user_id"],
                name=node["name"],
                category=node.get("category"),
                created_at=node["created_at"],
                updated_at=node["updated_at"],
                context=ObjectContext()
            )

        # 3. Combine
        return ObjectWithContext(
            id=node["id"],
            tenant_id=node["tenant_id"],
            user_id=node["user_id"],
            name=node["name"],
            category=node.get("category"),
            created_at=node["created_at"],
            updated_at=node["updated_at"],
            context=qdrant_result["context"]
        )

    async def list_by_user(
        self,
        user_id: str,
        tenant_id: str,
        category: Optional[str] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[ObjectWithContext]:
        """
        List objects for user with optional category filter.

        1-HOP QUERY PATTERN:
        1. Get object IDs from Neo4j (with filtering)
        2. Batch fetch contexts from Qdrant
        3. Combine and return
        """
        # 1. Get object IDs from Neo4j
        category_filter = "AND o.category = $category" if category else ""

        query = f"""
        MATCH (o:Object {{user_id: $user_id, tenant_id: $tenant_id}})
        {category_filter}
        RETURN o
        ORDER BY o.created_at DESC
        SKIP $offset
        LIMIT $limit
        """

        async with self.driver.session() as session:
            result = await session.run(
                query,
                user_id=user_id,
                tenant_id=tenant_id,
                category=category,
                offset=offset,
                limit=limit
            )
            records = await result.data()

        # 2. Batch fetch contexts from Qdrant
        objects_with_context = []
        for record in records:
            node = record["o"]
            qdrant_result = await self.qdrant.get_object_context(node["id"], tenant_id)

            context = qdrant_result["context"] if qdrant_result else ObjectContext()

            objects_with_context.append(
                ObjectWithContext(
                    id=node["id"],
                    tenant_id=node["tenant_id"],
                    user_id=node["user_id"],
                    name=node["name"],
                    category=node.get("category"),
                    created_at=node["created_at"],
                    updated_at=node["updated_at"],
                    context=context
                )
            )

        return objects_with_context

    async def search_by_semantic(
        self,
        query: str,
        tenant_id: str,
        user_id: Optional[str] = None,
        category: Optional[str] = None,
        limit: int = 10
    ) -> List[ObjectWithContext]:
        """
        Semantic search for objects by natural language query.

        1-HOP QUERY PATTERN:
        1. Generate query embedding
        2. Search Qdrant (semantic search)
        3. Get Neo4j structural data for matching objects
        4. Combine and return with relevance scores
        """
        # 1. Generate query embedding
        from litellm import aembedding
        response = await aembedding(
            model="text-embedding-3-small",
            input=[query]
        )
        query_embedding = response.data[0]["embedding"]

        # 2. Semantic search in Qdrant
        results = await self.qdrant.search_objects(
            query_embedding=query_embedding,
            tenant_id=tenant_id,
            user_id=user_id,
            category=category,
            limit=limit
        )

        # 3. Get Neo4j data for matching objects
        objects_with_context = []
        for result in results:
            # Get structural data from Neo4j
            query_neo4j = """
            MATCH (o:Object {id: $object_id, tenant_id: $tenant_id})
            RETURN o
            """

            async with self.driver.session() as session:
                neo4j_result = await session.run(
                    query_neo4j,
                    object_id=result["object_id"],
                    tenant_id=tenant_id
                )
                record = await neo4j_result.single()

                if record:
                    node = record["o"]
                    objects_with_context.append(
                        ObjectWithContext(
                            id=node["id"],
                            tenant_id=node["tenant_id"],
                            user_id=node["user_id"],
                            name=node["name"],
                            category=node.get("category"),
                            created_at=node["created_at"],
                            updated_at=node["updated_at"],
                            context=result["context"],
                            relevance_score=result["score"]
                        )
                    )

        return objects_with_context

    async def update(
        self,
        object_id: str,
        tenant_id: str,
        update_data: ObjectUpdate
    ) -> Optional[ObjectWithContext]:
        """
        Update object in BOTH Neo4j and Qdrant.

        Updates:
        - Neo4j: name, category (if changed)
        - Qdrant: full context + regenerate embedding
        """
        # Get existing object
        existing = await self.get(object_id, tenant_id)
        if not existing:
            return None

        # Build Neo4j update
        updates = []
        params = {"object_id": object_id, "tenant_id": tenant_id}

        updated_name = update_data.name or existing.name
        updated_category = update_data.category if update_data.category is not None else existing.category

        if update_data.name:
            updates.append("o.name = $name")
            params["name"] = update_data.name

        if update_data.category is not None:
            updates.append("o.category = $category")
            params["category"] = update_data.category

        updates.append("o.updated_at = datetime()")

        # Update Neo4j
        if updates:
            query = f"""
            MATCH (o:Object {{id: $object_id, tenant_id: $tenant_id}})
            SET {', '.join(updates)}
            RETURN o
            """

            async with self.driver.session() as session:
                result = await session.run(query, **params)
                record = await result.single()
                if not record:
                    return None
                node = record["o"]

        # Update Qdrant context
        updated_context = update_data.context or existing.context

        # Regenerate embedding
        embedding = await self.embeddings.generate_embedding(
            name=updated_name,
            context=updated_context
        )

        await self.qdrant.upsert_object_context(
            object_id=object_id,
            tenant_id=tenant_id,
            user_id=existing.user_id,
            name=updated_name,
            category=updated_category,
            context=updated_context,
            embedding=embedding
        )

        # Return updated object
        return await self.get(object_id, tenant_id)

    async def delete(self, object_id: str, tenant_id: str) -> bool:
        """
        Delete object from BOTH Neo4j and Qdrant.

        Cascade delete:
        1. Delete from Neo4j (includes relationships)
        2. Delete from Qdrant
        """
        # 1. Delete from Neo4j
        query = """
        MATCH (o:Object {id: $object_id, tenant_id: $tenant_id})
        DETACH DELETE o
        RETURN count(o) as deleted
        """

        async with self.driver.session() as session:
            result = await session.run(query, object_id=object_id, tenant_id=tenant_id)
            record = await result.single()
            neo4j_deleted = record["deleted"] > 0 if record else False

        # 2. Delete from Qdrant
        qdrant_deleted = await self.qdrant.delete_object_context(object_id, tenant_id)

        return neo4j_deleted and qdrant_deleted
```

---

#### Task 5: Create Object Extractor Service

**File:** `packages/api/fidus/memory/services/object_extractor.py`

```python
from typing import List, Optional, Dict, Any
from litellm import acompletion
from pydantic import BaseModel
from fidus.memory.entities.object import ObjectCreate


class ExtractedObject(BaseModel):
    """LLM extraction result"""
    name: str
    category: Optional[str] = None
    brand: Optional[str] = None
    confidence: float = 0.0
    ai_properties: Dict[str, Any] = {}


class ObjectExtractor:
    """
    LLM-powered service to extract Object entities from conversation.
    """

    EXTRACTION_PROMPT = """
    Extract object information from the user's message.

    Objects are physical items the user owns, uses, or mentions acquiring.

    Extract:
    - name (required): The object's name or description
    - category (optional): electronics, furniture, tools, clothing, vehicle, appliance, book, toy, sports_equipment, musical_instrument, art, jewelry, other
    - brand (optional): Manufacturer or brand name
    - Any other relevant attributes: model, color, condition, size, price, purchase_location, usage_purpose, etc.

    Return ONLY objects that the user explicitly owns, bought, or uses regularly.
    Do NOT extract objects that are just mentioned in passing or belong to others.

    Examples:
    - "I bought a new MacBook Pro" → name: "MacBook Pro", category: "electronics", brand: "Apple"
    - "My Gibson Les Paul guitar" → name: "Les Paul guitar", category: "musical_instrument", brand: "Gibson"
    - "I use my Vitamix blender daily" → name: "Vitamix blender", category: "appliance", brand: "Vitamix"

    Return empty list if no objects found.
    """

    def __init__(self, model: str = "gpt-4o-mini"):
        self.model = model

    async def extract_from_message(
        self,
        message: str,
        conversation_history: Optional[List[str]] = None
    ) -> List[ExtractedObject]:
        """
        Extract objects from user message.

        Args:
            message: Current user message
            conversation_history: Previous messages for context (optional)

        Returns:
            List of extracted objects with confidence scores
        """
        messages = [
            {"role": "system", "content": self.EXTRACTION_PROMPT},
            {"role": "user", "content": message}
        ]

        # Add conversation history for context if available
        if conversation_history:
            context = "\n".join(conversation_history[-3:])  # Last 3 messages
            messages.insert(1, {"role": "assistant", "content": f"Context: {context}"})

        try:
            response = await acompletion(
                model=self.model,
                messages=messages,
                response_format={
                    "type": "json_schema",
                    "json_schema": {
                        "name": "object_extraction",
                        "strict": True,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "objects": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "name": {"type": "string"},
                                            "category": {"type": ["string", "null"]},
                                            "brand": {"type": ["string", "null"]},
                                            "confidence": {"type": "number"},
                                            "ai_properties": {"type": "object"}
                                        },
                                        "required": ["name", "confidence"],
                                        "additionalProperties": False
                                    }
                                }
                            },
                            "required": ["objects"],
                            "additionalProperties": False
                        }
                    }
                }
            )

            content = response.choices[0].message.content
            import json
            data = json.loads(content)

            return [
                ExtractedObject(**obj)
                for obj in data.get("objects", [])
                if obj.get("confidence", 0) > 0.6  # Confidence threshold
            ]

        except Exception as e:
            # Log error but don't fail the entire flow
            print(f"Object extraction error: {e}")
            return []

    def to_object_create(self, extracted: ExtractedObject) -> ObjectCreate:
        """Convert extracted object to ObjectCreate model"""
        return ObjectCreate(
            name=extracted.name,
            category=extracted.category,
            brand=extracted.brand,
            ai_properties=extracted.ai_properties
        )
```

---

#### Task 6: Add Feature Flag

**File:** `packages/api/fidus/config.py`

```python
class FeatureFlags:
    # ... existing flags ...
    ENABLE_OBJECT_ENTITY: bool = env.bool("ENABLE_OBJECT_ENTITY", False)
```

---

### 1-Hop Query Pattern Example

The following example demonstrates the Qdrant-First 1-Hop Query Pattern for semantic search:

```python
# Example: "Show me my Apple devices"

# Step 1: Generate query embedding
from litellm import aembedding
response = await aembedding(
    model="text-embedding-3-small",
    input=["Apple devices electronics computers"]
)
query_embedding = response.data[0]["embedding"]

# Step 2: Semantic search in Qdrant
qdrant_results = await qdrant_service.search_objects(
    query_embedding=query_embedding,
    tenant_id="tenant_123",
    user_id="user_456",
    category="electronics",  # Optional filter
    limit=10
)
# Returns: [
#   {"object_id": "obj_1", "name": "MacBook Pro", "context": {...}, "score": 0.92},
#   {"object_id": "obj_2", "name": "iPhone 15", "context": {...}, "score": 0.87}
# ]

# Step 3: 1-Hop traversal in Neo4j (get relationships)
for result in qdrant_results:
    # Get who owns this object
    query = """
    MATCH (u:User)-[:OWNS]->(o:Object {id: $object_id})
    RETURN u.name as owner, o.name as object_name
    """
    # Execute query...

# Result: Rich context from Qdrant + Graph relationships from Neo4j
```

**Key Benefits:**
- **Semantic search**: Find objects by meaning, not just keywords
- **Efficient filtering**: Category filter in Neo4j index (fast)
- **Rich context**: All descriptive properties from Qdrant
- **Graph traversal**: 1-hop to find related entities (users, locations)

---

### API Implementation

**Endpoints to Implement:**

**File:** `packages/api/fidus/memory/routes/object_routes.py`

```python
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from fidus.memory.entities.object import Object, ObjectCreate, ObjectUpdate
from fidus.memory.repositories.object_repository import ObjectRepository
from fidus.auth import get_current_user, User
from fidus.dependencies import get_neo4j_driver, get_feature_flags
from fidus.config import FeatureFlags

router = APIRouter(prefix="/api/memory/entities/object", tags=["objects"])


@router.post("", response_model=Object, status_code=201)
async def create_object(
    obj_data: ObjectCreate,
    current_user: User = Depends(get_current_user),
    neo4j_driver = Depends(get_neo4j_driver),
    flags: FeatureFlags = Depends(get_feature_flags)
):
    """
    Create a new Object entity.

    Requires ENABLE_OBJECT_ENTITY feature flag.
    """
    if not flags.ENABLE_OBJECT_ENTITY:
        raise HTTPException(status_code=404, detail="Object entity not enabled")

    repo = ObjectRepository(neo4j_driver)
    obj = await repo.create(
        tenant_id=current_user.tenant_id,
        user_id=current_user.id,
        obj_data=obj_data
    )
    return obj


@router.get("/{object_id}", response_model=Object)
async def get_object(
    object_id: str,
    current_user: User = Depends(get_current_user),
    neo4j_driver = Depends(get_neo4j_driver),
    flags: FeatureFlags = Depends(get_feature_flags)
):
    """Get Object by ID with tenant isolation"""
    if not flags.ENABLE_OBJECT_ENTITY:
        raise HTTPException(status_code=404, detail="Object entity not enabled")

    repo = ObjectRepository(neo4j_driver)
    obj = await repo.get(object_id, current_user.tenant_id)

    if not obj:
        raise HTTPException(status_code=404, detail="Object not found")

    return obj


@router.get("", response_model=List[Object])
async def list_objects(
    user_id: Optional[str] = Query(None, description="Filter by user ID"),
    category: Optional[str] = Query(None, description="Filter by category"),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    neo4j_driver = Depends(get_neo4j_driver),
    flags: FeatureFlags = Depends(get_feature_flags)
):
    """
    List objects with optional filters.

    Defaults to current user's objects if user_id not specified.
    """
    if not flags.ENABLE_OBJECT_ENTITY:
        raise HTTPException(status_code=404, detail="Object entity not enabled")

    target_user_id = user_id or current_user.id

    repo = ObjectRepository(neo4j_driver)
    objects = await repo.list_by_user(
        user_id=target_user_id,
        tenant_id=current_user.tenant_id,
        category=category,
        limit=limit,
        offset=offset
    )
    return objects


@router.put("/{object_id}", response_model=Object)
async def update_object(
    object_id: str,
    update_data: ObjectUpdate,
    current_user: User = Depends(get_current_user),
    neo4j_driver = Depends(get_neo4j_driver),
    flags: FeatureFlags = Depends(get_feature_flags)
):
    """Update Object with property merging for ai_properties"""
    if not flags.ENABLE_OBJECT_ENTITY:
        raise HTTPException(status_code=404, detail="Object entity not enabled")

    repo = ObjectRepository(neo4j_driver)
    obj = await repo.update(object_id, current_user.tenant_id, update_data)

    if not obj:
        raise HTTPException(status_code=404, detail="Object not found")

    return obj


@router.delete("/{object_id}", status_code=204)
async def delete_object(
    object_id: str,
    current_user: User = Depends(get_current_user),
    neo4j_driver = Depends(get_neo4j_driver),
    flags: FeatureFlags = Depends(get_feature_flags)
):
    """Delete Object and cascade delete relationships"""
    if not flags.ENABLE_OBJECT_ENTITY:
        raise HTTPException(status_code=404, detail="Object entity not enabled")

    repo = ObjectRepository(neo4j_driver)
    deleted = await repo.delete(object_id, current_user.tenant_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Object not found")

    return None
```

**OpenAPI Schema:**

```yaml
/api/memory/entities/object:
  post:
    summary: Create Object
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ObjectCreate'
    responses:
      201:
        description: Object created
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Object'
  get:
    summary: List Objects
    parameters:
      - name: user_id
        in: query
        schema:
          type: string
      - name: category
        in: query
        schema:
          type: string
      - name: limit
        in: query
        schema:
          type: integer
          default: 100
      - name: offset
        in: query
        schema:
          type: integer
          default: 0
    responses:
      200:
        description: List of objects
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: '#/components/schemas/Object'

/api/memory/entities/object/{object_id}:
  get:
    summary: Get Object
    parameters:
      - name: object_id
        in: path
        required: true
        schema:
          type: string
    responses:
      200:
        description: Object details
  put:
    summary: Update Object
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ObjectUpdate'
    responses:
      200:
        description: Updated object
  delete:
    summary: Delete Object
    responses:
      204:
        description: Object deleted
```

---

### Frontend Implementation

**Components to Create/Modify:**

1. **`packages/web/src/components/memory/ObjectList.tsx`** - Table/grid view with category filter
2. **`packages/web/src/components/memory/ObjectDetail.tsx`** - Detail view with all properties
3. **`packages/web/src/components/memory/ObjectForm.tsx`** - Create/edit form
4. **`packages/web/src/lib/api/memory.ts`** - API client methods
5. **`packages/web/src/app/memory/objects/page.tsx`** - Next.js page component

**Example Component Structure:**

**File:** `packages/web/src/components/memory/ObjectList.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Select,
  TextField,
  Button,
  Badge
} from '@fidus/ui';
import { getObjects } from '@/lib/api/memory';
import { Object } from '@/types/memory';
import Link from 'next/link';

const CATEGORIES = [
  'all',
  'electronics',
  'furniture',
  'tools',
  'clothing',
  'vehicle',
  'appliance',
  'book',
  'toy',
  'sports_equipment',
  'musical_instrument',
  'art',
  'jewelry',
  'other'
];

export function ObjectList() {
  const [category, setCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: objects = [], isLoading, error } = useQuery({
    queryKey: ['objects', category === 'all' ? undefined : category],
    queryFn: () => getObjects({
      category: category === 'all' ? undefined : category
    })
  });

  const filteredObjects = objects.filter(obj =>
    obj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    obj.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Inventory</h2>
        <Link href="/memory/objects/new">
          <Button>Add Object</Button>
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-64"
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>
              {cat.replace('_', ' ').charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </Select>

        <TextField
          placeholder="Search objects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">Error loading objects</div>
      ) : filteredObjects.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No objects found. Start tracking your possessions by adding items.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredObjects.map(obj => (
              <TableRow key={obj.id}>
                <TableCell className="font-medium">{obj.name}</TableCell>
                <TableCell>
                  {obj.category && (
                    <Badge variant="secondary">
                      {obj.category.replace('_', ' ')}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{obj.brand || '—'}</TableCell>
                <TableCell>
                  {obj.ai_properties?.model && (
                    <span className="text-sm text-gray-600">
                      {obj.ai_properties.model}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Link href={`/memory/objects/${obj.id}`}>
                    <Button variant="ghost" size="sm">View</Button>
                  </Link>
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

**File:** `packages/web/src/components/memory/ObjectForm.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  Card,
  TextField,
  Select,
  Button,
  DatePicker
} from '@fidus/ui';
import { createObject, updateObject } from '@/lib/api/memory';
import { Object, ObjectCreate } from '@/types/memory';

interface ObjectFormProps {
  object?: Object;
  mode: 'create' | 'edit';
}

export function ObjectForm({ object, mode }: ObjectFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<ObjectCreate>({
    name: object?.name || '',
    category: object?.category || '',
    brand: object?.brand || '',
    purchase_date: object?.purchase_date || undefined,
    ai_properties: object?.ai_properties || {}
  });

  const mutation = useMutation({
    mutationFn: mode === 'create'
      ? createObject
      : (data: ObjectCreate) => updateObject(object!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['objects'] });
      router.push('/memory/objects');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {mode === 'create' ? 'Add Object' : 'Edit Object'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., MacBook Pro"
        />

        <Select
          label="Category"
          value={formData.category || ''}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          <option value="">Select category...</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <option value="tools">Tools</option>
          <option value="clothing">Clothing</option>
          <option value="vehicle">Vehicle</option>
          <option value="appliance">Appliance</option>
          <option value="book">Book</option>
          <option value="toy">Toy</option>
          <option value="sports_equipment">Sports Equipment</option>
          <option value="musical_instrument">Musical Instrument</option>
          <option value="art">Art</option>
          <option value="jewelry">Jewelry</option>
          <option value="other">Other</option>
        </Select>

        <TextField
          label="Brand"
          value={formData.brand || ''}
          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          placeholder="e.g., Apple"
        />

        <DatePicker
          label="Purchase Date"
          value={formData.purchase_date}
          onChange={(date) => setFormData({ ...formData, purchase_date: date })}
        />

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1"
          >
            {mutation.isPending ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>

        {mutation.isError && (
          <div className="text-red-600 text-sm">
            Error: {mutation.error.message}
          </div>
        )}
      </form>
    </Card>
  );
}
```

**UI/UX Requirements:**
- Responsive table layout with category badges
- Search filters objects by name and brand
- Category dropdown with all predefined categories
- Visual distinction between categories using badge colors
- Empty state messaging when no objects exist
- Loading skeletons during data fetch
- Accessibility: ARIA labels, keyboard navigation

---

### Testing Requirements

**Unit Tests:**

**File:** `packages/api/tests/unit/memory/test_object_repository.py`

```python
import pytest
from fidus.memory.entities.object import ObjectCreate
from fidus.memory.repositories.object_repository import ObjectRepository


@pytest.mark.asyncio
async def test_create_object(neo4j_driver, tenant_id, user_id):
    """Test creating an object"""
    repo = ObjectRepository(neo4j_driver)

    obj_data = ObjectCreate(
        name="MacBook Pro",
        category="electronics",
        brand="Apple",
        ai_properties={"model": "M3 Max", "color": "Space Gray"}
    )

    obj = await repo.create(tenant_id, user_id, obj_data)

    assert obj.id is not None
    assert obj.name == "MacBook Pro"
    assert obj.category == "electronics"
    assert obj.brand == "Apple"
    assert obj.ai_properties["model"] == "M3 Max"


@pytest.mark.asyncio
async def test_list_objects_by_category(neo4j_driver, tenant_id, user_id):
    """Test filtering objects by category"""
    repo = ObjectRepository(neo4j_driver)

    # Create objects in different categories
    await repo.create(tenant_id, user_id, ObjectCreate(
        name="Laptop", category="electronics"
    ))
    await repo.create(tenant_id, user_id, ObjectCreate(
        name="Desk", category="furniture"
    ))
    await repo.create(tenant_id, user_id, ObjectCreate(
        name="Phone", category="electronics"
    ))

    electronics = await repo.list_by_user(user_id, tenant_id, category="electronics")

    assert len(electronics) == 2
    assert all(obj.category == "electronics" for obj in electronics)


@pytest.mark.asyncio
async def test_update_object_merges_ai_properties(neo4j_driver, tenant_id, user_id):
    """Test that ai_properties are merged, not replaced"""
    repo = ObjectRepository(neo4j_driver)

    obj = await repo.create(tenant_id, user_id, ObjectCreate(
        name="Laptop",
        ai_properties={"color": "silver", "storage": "512GB"}
    ))

    from fidus.memory.entities.object import ObjectUpdate
    updated = await repo.update(obj.id, tenant_id, ObjectUpdate(
        ai_properties={"ram": "16GB"}  # New property
    ))

    # Verify merge
    assert updated.ai_properties["color"] == "silver"  # Original preserved
    assert updated.ai_properties["storage"] == "512GB"  # Original preserved
    assert updated.ai_properties["ram"] == "16GB"  # New added
```

**Integration Tests:**

**File:** `packages/api/tests/integration/memory/test_object_api.py`

```python
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_object_crud_flow(client: AsyncClient, auth_headers, tenant_id):
    """Test complete CRUD flow for Object entity"""

    # Create
    response = await client.post(
        "/api/memory/entities/object",
        json={
            "name": "MacBook Pro",
            "category": "electronics",
            "brand": "Apple",
            "ai_properties": {"model": "16-inch M3 Max"}
        },
        headers=auth_headers
    )
    assert response.status_code == 201
    obj = response.json()
    object_id = obj["id"]

    # Read
    response = await client.get(
        f"/api/memory/entities/object/{object_id}",
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["name"] == "MacBook Pro"

    # Update
    response = await client.put(
        f"/api/memory/entities/object/{object_id}",
        json={"brand": "Apple Inc."},
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["brand"] == "Apple Inc."

    # List
    response = await client.get(
        "/api/memory/entities/object?category=electronics",
        headers=auth_headers
    )
    assert response.status_code == 200
    assert len(response.json()) >= 1

    # Delete
    response = await client.delete(
        f"/api/memory/entities/object/{object_id}",
        headers=auth_headers
    )
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_object_extraction_from_conversation(client: AsyncClient, auth_headers):
    """Test LLM extracts object from conversation"""

    response = await client.post(
        "/api/memory/chat",
        json={"message": "I just bought a new iPhone 15 Pro"},
        headers=auth_headers
    )

    assert response.status_code == 200

    # Verify object was created
    objects_response = await client.get(
        "/api/memory/entities/object",
        headers=auth_headers
    )
    objects = objects_response.json()

    iphone = next((o for o in objects if "iPhone" in o["name"]), None)
    assert iphone is not None
    assert iphone["category"] == "electronics"
    assert iphone["brand"] == "Apple"
```

**E2E Tests:**

**File:** `packages/web/tests/e2e/memory/object-workflow.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test('User can create and manage objects', async ({ page }) => {
  // Step 1: Login
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Step 2: Navigate to Objects page
  await page.goto('/memory/objects');
  await expect(page.locator('h2')).toContainText('My Inventory');

  // Step 3: Create new object
  await page.click('text=Add Object');
  await page.fill('[name="name"]', 'MacBook Pro');
  await page.selectOption('[name="category"]', 'electronics');
  await page.fill('[name="brand"]', 'Apple');
  await page.click('button:has-text("Create")');

  // Step 4: Verify object appears in list
  await expect(page.locator('table')).toContainText('MacBook Pro');
  await expect(page.locator('table')).toContainText('electronics');

  // Step 5: Filter by category
  await page.selectOption('select[label="Category"]', 'electronics');
  await expect(page.locator('table tbody tr')).toHaveCount(1);

  // Step 6: View object details
  await page.click('text=View');
  await expect(page.locator('h2')).toContainText('MacBook Pro');

  // Step 7: Edit object
  await page.click('text=Edit');
  await page.fill('[name="name"]', 'MacBook Pro 16"');
  await page.click('button:has-text("Update")');
  await expect(page.locator('table')).toContainText('MacBook Pro 16"');

  // Step 8: Delete object
  await page.click('text=View');
  await page.click('button:has-text("Delete")');
  await page.click('button:has-text("Confirm")');

  // Step 9: Verify deletion
  await expect(page.locator('table')).not.toContainText('MacBook Pro');
});

test('LLM extracts object from conversation', async ({ page }) => {
  // Step 1: Login and navigate to chat
  await page.goto('/chat');

  // Step 2: Send message mentioning object
  await page.fill('[placeholder="Type a message..."]', 'I bought a new Gibson Les Paul guitar');
  await page.click('button[type="submit"]');

  // Step 3: Wait for response
  await expect(page.locator('.message')).toContainText('Gibson Les Paul');

  // Step 4: Navigate to objects
  await page.goto('/memory/objects');

  // Step 5: Verify object was extracted
  await expect(page.locator('table')).toContainText('Les Paul');
  await expect(page.locator('table')).toContainText('musical_instrument');
  await expect(page.locator('table')).toContainText('Gibson');
});
```

---

## Implementation Guidelines

### Must Follow

1. **Qdrant-First Pattern (ADR-0002) - CRITICAL:**
   - Neo4j stores ONLY: id, tenant_id, user_id, name, category, created_at, updated_at
   - Qdrant stores ALL CONTEXT: brand, model, purchase details, condition, location, notes, tags, ai_properties
   - Every object MUST have an embedding in Qdrant
   - NEVER store descriptive properties in Neo4j
   - Use ObjectContext model for all context data

2. **Dual-Storage Consistency:**
   - Create: Insert to BOTH Neo4j and Qdrant (atomic-like operation)
   - Read: Fetch from BOTH (1-Hop Query Pattern)
   - Update: Update BOTH systems
   - Delete: Delete from BOTH systems
   - Handle failures gracefully (rollback or compensating transaction)

3. **Flexible Schema:**
   - Use `ai_properties` dict in ObjectContext for extensibility
   - LLM can discover and add arbitrary attributes
   - Do NOT hard-code all possible properties

4. **Feature Flag:**
   - All functionality behind `ENABLE_OBJECT_ENTITY` flag
   - Default: disabled
   - Graceful fallback if flag is off (404 response)

5. **Multi-Tenancy:**
   - ALL queries filter by `tenant_id` (Neo4j AND Qdrant)
   - Security: Never leak objects across tenants
   - Test: Verify tenant isolation in BOTH storage systems

6. **Error Handling:**
   - User-facing errors: "Object not found" (not internal errors)
   - Logging: Structured logs with `request_id`, `user_id`, `object_id`
   - Monitoring: Emit metrics for creation/update/delete rates
   - Track Qdrant sync failures separately

7. **Code Quality:**
   - Type hints: All Python functions fully typed
   - TypeScript: No `any` types
   - Documentation: Docstrings for repository methods
   - Linting: Pass Ruff (Python) and ESLint (TS)

### Must NOT Do

- Store context properties (brand, model, purchase details) in Neo4j (ADR-0002 violation)
- Skip Qdrant storage (every object MUST have embedding)
- Break existing functionality (additive only)
- Skip tests (100% acceptance criteria coverage)
- Hard-code categories (use constants)
- Ignore tenant isolation (in either storage system)
- Bypass feature flag
- Create objects without embeddings

---

## Dependencies & Prerequisites

**Required Before Starting:**
- Package 1.2 completed (User entity operational)
- Neo4j 5.x running and accessible
- Qdrant 1.7+ running and accessible
- LiteLLM configured for embeddings and object extraction
- Feature flag `ENABLE_OBJECT_ENTITY` added to config
- ADR-0002 (Qdrant-First pattern) reviewed and understood

**Technical Dependencies:**
- Neo4j 5.x: `neo4j://localhost:7687` (structural data)
- Qdrant 1.7+: `http://localhost:6333` (context + embeddings)
- Python 3.11+, FastAPI, Pydantic
- qdrant-client 1.7+
- litellm (embeddings + LLM extraction)
- Node 18+, Next.js 14, React 18
- @fidus/ui design system installed

---

## Step-by-Step Implementation Plan

### Phase 1: Backend Core - Qdrant-First Setup (Days 1-2)
1. Create Object entity model (minimal Neo4j fields)
2. Create ObjectContext model (full Qdrant payload)
3. Implement QdrantService (collection setup, CRUD operations)
4. Implement ObjectEmbeddingService (embedding generation)
5. Write unit tests for Qdrant service

### Phase 2: Dual-Storage Repository (Day 3)
1. Implement ObjectRepository with dual-storage pattern
2. Create method: CRUD operations for both Neo4j + Qdrant
3. Implement 1-Hop Query Pattern (search_by_semantic)
4. Write unit tests for repository (verify both storage systems)

### Phase 3: LLM Extraction (Day 4)
1. Create ObjectExtractor service
2. Define extraction prompt with examples
3. Implement structured output parsing
4. Write integration tests for extraction

### Phase 4: API Layer (Day 5)
1. Create FastAPI router with CRUD endpoints
2. Add feature flag checks
3. Implement request/response validation
4. Add semantic search endpoint
5. Write integration tests for all endpoints

### Phase 5: Frontend (Days 6-7)
1. Create ObjectList component with filtering
2. Create ObjectForm for create/edit (with full context fields)
3. Create ObjectDetail view (show Qdrant context)
4. Implement API client methods
5. Add Next.js routes

### Phase 6: Testing & Integration (Day 8)
1. Write E2E tests for full workflow
2. Test LLM extraction end-to-end
3. Test Qdrant-First pattern (verify data in both systems)
4. Test semantic search functionality
5. Test feature flag toggle
6. Test tenant isolation (both Neo4j and Qdrant)

### Phase 7: Documentation (Day 9)
1. Update entity management docs with Qdrant-First pattern
2. Add OpenAPI documentation
3. Create usage examples (including semantic search)
4. Document 1-Hop Query Pattern
5. Deploy to dev environment

---

## Verification Checklist

### Functionality
- [ ] User can create object via UI (stored in both Neo4j and Qdrant)
- [ ] User can view objects in inventory list
- [ ] User can filter by category (Neo4j index query)
- [ ] User can search semantically ("show me my Apple devices")
- [ ] User can edit object properties (updates both storage systems)
- [ ] User can delete object (cascade delete from both systems)
- [ ] LLM extracts objects from conversation
- [ ] Full context (brand, model, purchase details) stored in Qdrant
- [ ] Minimal structure (id, name, category) stored in Neo4j

### Qdrant-First Pattern Compliance (ADR-0002)
- [ ] Neo4j stores ONLY: id, tenant_id, user_id, name, category, created_at, updated_at
- [ ] Qdrant stores FULL CONTEXT: brand, model, purchase details, condition, location, notes, tags, ai_properties
- [ ] Embeddings generated for all objects
- [ ] Semantic search returns relevant objects with scores
- [ ] 1-Hop Query Pattern implemented (Qdrant search → Neo4j traversal)
- [ ] No context properties stored in Neo4j (verified by inspection)

### Code Quality
- [ ] All files created as specified
- [ ] Type hints on all Python functions
- [ ] No TypeScript `any` types
- [ ] No linting errors (Ruff, ESLint)
- [ ] Docstrings on public methods
- [ ] ObjectContext model properly structured

### Testing
- [ ] Unit tests pass (>80% coverage)
- [ ] Integration tests pass (all endpoints)
- [ ] E2E test passes (create/view/edit/delete flow)
- [ ] E2E test passes (LLM extraction)
- [ ] E2E test passes (semantic search)
- [ ] Feature flag toggle tested
- [ ] Qdrant collection creation tested
- [ ] Dual-storage consistency tested (create/update/delete)

### Documentation
- [ ] Code comments for complex logic
- [ ] OpenAPI schema complete
- [ ] Entity management docs updated
- [ ] README updated with Object examples

### Security & Performance
- [ ] Multi-tenancy verified (no cross-tenant leaks)
- [ ] Input validation on all endpoints
- [ ] Category filter uses index
- [ ] Pagination working for large inventories

### Deployment Readiness
- [ ] Feature flag defined in config
- [ ] Environment variables documented
- [ ] Neo4j indexes created
- [ ] Rollback plan documented

---

## Risk Mitigation

**Risks from WBS:**
- Risk: LOW - Object entity is low priority, fewer dependencies

**Additional Risks:**
- Risk: LLM may extract objects user doesn't own (just mentions)
  - Mitigation: Explicit prompt instructions, confidence threshold, user confirmation
- Risk: Category list may be incomplete or culturally biased
  - Mitigation: Include "other" category, allow custom categories in ai_properties, make categories suggestions not restrictions

---

## Related Resources

**WBS Package Details:** `/docs/prototypes/fidus-memory/migration-v3-wbs.md#package-51`
**Architecture Review:** `/docs/reviews/2025-11-21-fidus-memory-architecture-review.md`
**Solution Architecture:** `/docs/solution-architecture/15-entity-management.md`
**Domain Model:** Entity-Relationship Model specification
**Existing Code:** `packages/api/fidus/memory/entities/person.py` (pattern reference)

---

## Questions to Resolve Before Starting

1. Should objects support images/photos for visual identification?
2. Should we integrate with product databases (e.g., Amazon API) for auto-filling details?
3. Should objects have a "value" field for insurance/inventory purposes?
4. Should we track object location (which room, which storage)?

---

## Success Criteria

This package is **successfully implemented** when:

1. A user can view their object inventory at `/memory/objects`
2. A user can create/edit/delete objects via UI
3. A user can filter objects by category
4. LLM extracts objects from conversation (e.g., "I bought a MacBook Pro")
5. Extracted objects appear in inventory automatically
6. All acceptance criteria verified
7. All tests pass (unit, integration, E2E)
8. Feature flag `ENABLE_OBJECT_ENTITY` can be toggled
9. Code review approved
10. Deployed to dev with manual smoke test successful

---

**Prompt Version:** 1.0
**Generated:** 2025-11-21
**Target Package:** 5.1 - Object Entity with Inventory UI

---

**END OF IMPLEMENTATION PROMPT**

# Implementation Prompt: 3.1 - KNOWS Relationship with Network UI

**Package:** 3.1
**Epic:** Core Relationships & Graph Visualization
**Priority:** 🔴 CRITICAL
**Context Document:** `/docs/prototypes/fidus-memory/migration-v3-wbs.md` (Lines 555-614)

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
- ✅ Package 2.1 (Person entity) completed: Person entities can be created and managed
- ❌ No relationships exist yet between User and Person entities
- ❌ No situational context qualifiers on relationships

**Migration Goal:**
- Implement the KNOWS relationship to connect User to Person entities
- Store relationship context in Qdrant (PRIMARY) following ADR-0001
- Create Neo4j relationship with `situation_id` reference (SECONDARY)
- Build UI for visualizing and managing network connections
- Enable context-based relationship queries

**Architecture References:**
- Solution Architecture: `/docs/solution-architecture/15-entity-management.md`
- ADR-0001: `/docs/adr/ADR-0001-situational-context-as-relationship-qualifier.md` (Qdrant-First Pattern)
- ADR-0002: `/docs/adr/ADR-0002-property-placement-and-geospatial-exception.md` (Property Placement Strategy)
- Domain Model: `/docs/domain-model/relationship-model.md`

---

## Your Task

Implement **KNOWS Relationship with Network UI** according to the specifications below.

**User Story:**
As a user, I want the system to track my relationships with people, understand the context of our interactions, and visualize my network.

**Acceptance Criteria:**
1. Backend: KNOWS relationship service with Qdrant-First pattern implemented (ADR-0001 + ADR-0002 compliant)
2. Backend: Neo4j stores ONLY structural properties (relationship_instance_id, situation_id, observed_at, confidence, source)
3. Backend: Qdrant stores ALL context properties (role, relationship_type, communication_frequency, topics, emotion, mood, activity)
4. Backend: 1-Hop Query Pattern implemented (Qdrant search → Neo4j traversal → Context enrichment)
5. API: KNOWS relationship CRUD endpoints operational
6. Frontend: Network view showing User-Person connections
7. Frontend: Relationship detail panel with context history from Qdrant
8. Frontend: Add/edit relationship form functional
9. Tests: Create KNOWS, attach context, query by similar context, verify rollback - all passing
10. Documentation: Relationship implementation guide updated with ADR-0002 references

---

## Technical Specification

### Backend Implementation

**Files to Create:**

1. **`packages/api/fidus/memory/entities/relationship.py`**
   - Purpose: Base relationship model for all relationship types
   - Contains: Common fields like `relationship_instance_id`, `situation_id`, `observed_at`, `confidence`, `source`

2. **`packages/api/fidus/memory/relationships/knows.py`**
   - Purpose: KNOWS-specific relationship model
   - Contains: Extended properties specific to person relationships

3. **`packages/api/fidus/memory/services/knows_relationship_service.py`**
   - Purpose: Business logic for managing KNOWS relationships
   - Contains: CRUD operations following Qdrant-First pattern

4. **`packages/api/fidus/memory/services/relationship_extractor.py`**
   - Purpose: LLM-based relationship extraction from conversations
   - Contains: Prompt engineering for identifying relationships

**Detailed Implementation:**

#### 1. Base Relationship Model (`packages/api/fidus/memory/entities/relationship.py`)

```python
from datetime import datetime
from typing import Dict, Any, Optional, Literal
from uuid import UUID, uuid4
from pydantic import BaseModel, Field


class RelationshipBase(BaseModel):
    """
    Base model for all relationship types (ADR-0001 compliant).

    Pattern:
    - situation_id references Qdrant point (PRIMARY storage)
    - Neo4j relationship holds only situation_id + metadata
    """
    relationship_instance_id: UUID = Field(default_factory=uuid4)
    situation_id: Optional[str] = None
    observed_at: datetime = Field(default_factory=datetime.utcnow)
    confidence: float = Field(ge=0.0, le=1.0, default=0.9)
    source: Literal["explicit", "inferred", "extracted"] = "explicit"

    class Config:
        json_schema_extra = {
            "example": {
                "relationship_instance_id": "550e8400-e29b-41d4-a716-446655440000",
                "situation_id": "sit_abc123def456",
                "observed_at": "2025-11-21T10:30:00Z",
                "confidence": 0.95,
                "source": "extracted"
            }
        }


class RelationshipContext(BaseModel):
    """
    Situational context stored in Qdrant payload.

    This is the PRIMARY storage following ADR-0001.
    """
    tenant_id: str
    user_id: str
    entity_id: str
    relationship_type: str

    # Flexible context factors
    emotion: Optional[str] = None
    mood: Optional[str] = None
    activity: Optional[str] = None
    location: Optional[str] = None
    time_of_day: Optional[str] = None
    communication_channel: Optional[str] = None

    # Additional AI-discovered properties
    ai_properties: Dict[str, Any] = Field(default_factory=dict)

    created_at: datetime = Field(default_factory=datetime.utcnow)
```

#### 2. KNOWS Relationship Model (`packages/api/fidus/memory/relationships/knows.py`)

```python
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from fidus.memory.entities.relationship import RelationshipBase


class KnowsRelationship(RelationshipBase):
    """
    KNOWS relationship connecting User to Person.

    Following ADR-0002: Context properties stored in Qdrant ONLY.
    Neo4j stores only structural properties + situation_id reference.
    """
    # Entity references (structural)
    user_id: str
    person_id: str

    class Config:
        json_schema_extra = {
            "example": {
                "relationship_instance_id": "550e8400-e29b-41d4-a716-446655440000",
                "situation_id": "sit_abc123",
                "user_id": "user_123",
                "person_id": "person_456",
                "observed_at": "2025-11-21T10:30:00Z",
                "confidence": 0.95,
                "source": "extracted"
            }
        }


class KnowsContext(BaseModel):
    """
    Context properties for KNOWS relationships (stored in Qdrant).

    Following ADR-0002: ALL descriptive/contextual properties in Qdrant.
    """
    role: Optional[str] = Field(
        None,
        description="Relationship role: colleague, friend, mentor, family, etc."
    )
    relationship_type: Optional[str] = Field(
        None,
        description="Type: professional, personal, familial"
    )
    communication_frequency: Optional[str] = Field(
        None,
        description="Frequency: daily, weekly, monthly, rarely"
    )
    topics: List[str] = Field(
        default_factory=list,
        description="Common topics discussed"
    )
    # Flexible context factors (emotion, mood, activity, etc.)
    context: Dict[str, Any] = Field(default_factory=dict)
```

#### 3. KNOWS Service (`packages/api/fidus/memory/services/knows_relationship_service.py`)

```python
from typing import Dict, Any, List, Optional
from uuid import uuid4
from datetime import datetime
import logging

from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, Filter, FieldCondition, MatchValue
from neo4j import AsyncDriver

from fidus.memory.relationships.knows import KnowsRelationship
from fidus.memory.entities.relationship import RelationshipContext

logger = logging.getLogger(__name__)


class KnowsRelationshipService:
    """
    Service for managing KNOWS relationships following Qdrant-First pattern.

    Pattern (ADR-0001):
    1. Store context in Qdrant (PRIMARY) - full situational data
    2. Create Neo4j relationship (SECONDARY) - situation_id reference only
    3. Rollback Qdrant if Neo4j fails
    """

    def __init__(self, qdrant: QdrantClient, neo4j: AsyncDriver):
        self.qdrant = qdrant
        self.neo4j = neo4j
        self.collection_name = "situations"

    async def create_knows_relationship(
        self,
        tenant_id: str,
        user_id: str,
        person_id: str,
        role: Optional[str] = None,
        relationship_type: Optional[str] = None,
        communication_frequency: Optional[str] = None,
        topics: Optional[List[str]] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> KnowsRelationship:
        """
        Create KNOWS relationship with Qdrant-First pattern.

        Args:
            tenant_id: Tenant identifier
            user_id: User entity ID
            person_id: Person entity ID
            role: Relationship role (colleague, friend, etc.)
            relationship_type: Type (professional, personal, etc.)
            communication_frequency: Frequency (daily, weekly, etc.)
            topics: List of common topics
            context: Situational context (emotion, mood, activity, etc.)

        Returns:
            KnowsRelationship with situation_id populated

        Raises:
            RuntimeError: If Neo4j fails (Qdrant is rolled back)
        """
        situation_id = f"sit_{uuid4().hex}"
        relationship_instance_id = uuid4()

        # Build context payload
        context_data = RelationshipContext(
            tenant_id=tenant_id,
            user_id=user_id,
            entity_id=person_id,
            relationship_type="KNOWS",
            **(context or {})
        )

        # Step 1: Store in Qdrant (PRIMARY)
        try:
            # Generate embedding for context similarity search
            embedding = await self._embed_context(context_data.dict())

            point = PointStruct(
                id=situation_id,
                vector=embedding,
                payload={
                    "situation_id": situation_id,
                    "tenant_id": tenant_id,
                    "user_id": user_id,
                    "entity_id": person_id,
                    "relationship_type": "KNOWS",
                    "relationship_instance_id": str(relationship_instance_id),
                    "role": role,
                    "communication_frequency": communication_frequency,
                    "topics": topics or [],
                    "context": context or {},
                    "created_at": datetime.utcnow().isoformat()
                }
            )

            await self.qdrant.upsert(
                collection_name=self.collection_name,
                points=[point]
            )

            logger.info(f"Stored context in Qdrant: {situation_id}")

        except Exception as e:
            logger.error(f"Failed to store in Qdrant: {e}")
            raise RuntimeError(f"Qdrant storage failed: {e}")

        # Step 2: Create Neo4j relationship (SECONDARY)
        # Following ADR-0002: ONLY structural properties + situation_id reference
        try:
            query = """
            MATCH (u:User {id: $user_id, tenant_id: $tenant_id})
            MATCH (p:Person {id: $person_id, tenant_id: $tenant_id})
            CREATE (u)-[r:KNOWS {
                relationship_instance_id: $rel_id,
                situation_id: $sit_id,
                observed_at: datetime(),
                confidence: $confidence,
                source: $source
            }]->(p)
            RETURN r
            """

            async with self.neo4j.session() as session:
                await session.run(
                    query,
                    tenant_id=tenant_id,
                    user_id=user_id,
                    person_id=person_id,
                    rel_id=str(relationship_instance_id),
                    sit_id=situation_id,
                    confidence=0.9,
                    source="explicit"
                )

            logger.info(f"Created Neo4j relationship: {relationship_instance_id}")

        except Exception as e:
            # Rollback: Delete from Qdrant
            logger.error(f"Neo4j failed, rolling back Qdrant: {e}")
            try:
                await self.qdrant.delete(
                    collection_name=self.collection_name,
                    points_selector=[situation_id]
                )
                logger.info(f"Rolled back Qdrant point: {situation_id}")
            except Exception as rollback_error:
                logger.error(f"Rollback failed: {rollback_error}")

            raise RuntimeError(f"Neo4j failed, rolled back Qdrant: {e}")

        # Return relationship model (structural properties only)
        # Context is stored in Qdrant and can be retrieved separately
        return KnowsRelationship(
            relationship_instance_id=relationship_instance_id,
            situation_id=situation_id,
            user_id=user_id,
            person_id=person_id,
            observed_at=datetime.utcnow(),
            confidence=0.9,
            source="explicit"
        )

    async def get_relationships_by_context(
        self,
        tenant_id: str,
        user_id: str,
        context: Dict[str, Any],
        limit: int = 10
    ) -> List[KnowsRelationship]:
        """
        Find KNOWS relationships by similar context.

        Uses Qdrant vector similarity search.
        """
        embedding = await self._embed_context(context)

        results = await self.qdrant.search(
            collection_name=self.collection_name,
            query_vector=embedding,
            query_filter=Filter(
                must=[
                    FieldCondition(key="tenant_id", match=MatchValue(value=tenant_id)),
                    FieldCondition(key="user_id", match=MatchValue(value=user_id)),
                    FieldCondition(key="relationship_type", match=MatchValue(value="KNOWS"))
                ]
            ),
            limit=limit
        )

        relationships = []
        for hit in results:
            payload = hit.payload
            # Return structural properties only (ADR-0002)
            # Context available in payload for separate retrieval
            relationships.append(KnowsRelationship(
                relationship_instance_id=payload["relationship_instance_id"],
                situation_id=payload["situation_id"],
                user_id=payload["user_id"],
                person_id=payload["entity_id"],
                confidence=hit.score,
                source="retrieved"
            ))

        return relationships

    async def get_network_with_context(
        self,
        tenant_id: str,
        user_id: str,
        person_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        1-Hop Query Pattern (ADR-0001 + ADR-0002):

        1. Qdrant similarity search → Find situation_ids
        2. Neo4j 1-hop traversal → Get connected entities
        3. Context enrichment → Attach Qdrant payload to results

        This pattern enables efficient graph queries with rich context.
        """
        # Step 1: Query Qdrant for situations
        qdrant_filter = Filter(
            must=[
                FieldCondition(key="tenant_id", match=MatchValue(value=tenant_id)),
                FieldCondition(key="user_id", match=MatchValue(value=user_id)),
                FieldCondition(key="relationship_type", match=MatchValue(value="KNOWS"))
            ]
        )

        if person_id:
            qdrant_filter.must.append(
                FieldCondition(key="entity_id", match=MatchValue(value=person_id))
            )

        situations = await self.qdrant.scroll(
            collection_name=self.collection_name,
            scroll_filter=qdrant_filter,
            limit=100
        )

        situation_map = {s.payload["situation_id"]: s.payload for s in situations[0]}
        situation_ids = list(situation_map.keys())

        if not situation_ids:
            return {"nodes": [], "edges": [], "contexts": {}}

        # Step 2: Neo4j 1-hop traversal
        query = """
        MATCH (u:User {id: $user_id, tenant_id: $tenant_id})-[r:KNOWS]->(p:Person)
        WHERE r.situation_id IN $situation_ids
        RETURN
            r.relationship_instance_id AS rel_id,
            r.situation_id AS sit_id,
            r.observed_at AS observed_at,
            r.confidence AS confidence,
            p.id AS person_id,
            p.name AS person_name
        """

        async with self.neo4j.session() as session:
            result = await session.run(
                query,
                tenant_id=tenant_id,
                user_id=user_id,
                situation_ids=situation_ids
            )

            edges = []
            contexts = {}

            async for record in result:
                sit_id = record["sit_id"]
                rel_id = record["rel_id"]

                # Step 3: Enrich with Qdrant context
                context_payload = situation_map.get(sit_id, {})

                edges.append({
                    "relationship_id": rel_id,
                    "situation_id": sit_id,
                    "user_id": user_id,
                    "person_id": record["person_id"],
                    "person_name": record["person_name"],
                    "observed_at": record["observed_at"],
                    "confidence": record["confidence"]
                })

                contexts[rel_id] = {
                    "role": context_payload.get("role"),
                    "relationship_type": context_payload.get("relationship_type"),
                    "communication_frequency": context_payload.get("communication_frequency"),
                    "topics": context_payload.get("topics", []),
                    "emotion": context_payload.get("context", {}).get("emotion"),
                    "mood": context_payload.get("context", {}).get("mood"),
                    "activity": context_payload.get("context", {}).get("activity")
                }

        return {
            "edges": edges,
            "contexts": contexts
        }

    async def _embed_context(self, context: Dict[str, Any]) -> List[float]:
        """
        Generate embedding for context similarity search.

        TODO: Integrate with LiteLLM embedding model
        """
        # Placeholder: return random vector
        # In production, use: litellm.embedding(model="text-embedding-ada-002", input=context_text)
        import random
        return [random.random() for _ in range(1536)]
```

**1-Hop Query Pattern Explained:**

The `get_network_with_context()` method demonstrates the PRIMARY query pattern for ADR-0001 + ADR-0002:

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Qdrant Similarity Search (PRIMARY)                          │
│    - Query: tenant_id, user_id, relationship_type="KNOWS"      │
│    - Returns: situation_ids + full context payloads            │
└──────────────────────┬──────────────────────────────────────────┘
                       │ situation_ids
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. Neo4j 1-Hop Traversal (SECONDARY)                           │
│    - Query: MATCH (u)-[r:KNOWS]->(p) WHERE r.situation_id IN   │
│    - Returns: Structural properties + connected entities        │
└──────────────────────┬──────────────────────────────────────────┘
                       │ edges + situation_ids
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Context Enrichment (JOIN)                                   │
│    - Attach Qdrant payload to each edge using situation_id     │
│    - Returns: Complete graph with rich context                 │
└─────────────────────────────────────────────────────────────────┘
```

**Why This Pattern?**

- ✅ **Qdrant PRIMARY:** All queries start with context/semantic search
- ✅ **Neo4j SECONDARY:** Graph structure used for traversal only
- ✅ **Efficient:** Single Qdrant scroll + single Neo4j query
- ✅ **Flexible:** Add context properties without Neo4j schema changes
- ✅ **ADR-0002 Compliant:** Clear separation of structural vs contextual data

#### 4. Relationship Extractor (`packages/api/fidus/memory/services/relationship_extractor.py`)

```python
from typing import List, Dict, Any, Optional
import logging
from litellm import completion

from fidus.memory.relationships.knows import KnowsRelationship

logger = logging.getLogger(__name__)


class RelationshipExtractor:
    """
    LLM-based relationship extraction from conversations.
    """

    def __init__(self, model: str = "gpt-4"):
        self.model = model

    async def extract_knows_relationships(
        self,
        user_id: str,
        conversation: str,
        existing_persons: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Extract KNOWS relationships from conversation.

        Args:
            user_id: User identifier
            conversation: User message text
            existing_persons: List of known persons to match against

        Returns:
            List of relationship dicts with person_id, role, topics, etc.
        """
        person_names = [p["name"] for p in existing_persons]

        prompt = f"""
You are analyzing a conversation to extract interpersonal relationships.

Conversation: "{conversation}"

Known persons: {', '.join(person_names) if person_names else 'None'}

Extract any mentions of relationships between the user and people. For each relationship, identify:
1. Person name (must match existing persons if possible)
2. Role (colleague, friend, mentor, family, etc.)
3. Relationship type (professional, personal, familial)
4. Communication frequency (daily, weekly, monthly, rarely)
5. Topics discussed
6. Confidence (0.0-1.0)

Return as JSON array:
[
  {{
    "person_name": "Anna Schmidt",
    "role": "colleague",
    "relationship_type": "professional",
    "communication_frequency": "weekly",
    "topics": ["machine learning", "project planning"],
    "confidence": 0.95
  }}
]

Return empty array [] if no relationships found.
"""

        try:
            response = await completion(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )

            extracted = response.choices[0].message.content
            # Parse JSON and match to person_ids
            # TODO: Implement matching logic

            return []  # Placeholder

        except Exception as e:
            logger.error(f"Relationship extraction failed: {e}")
            return []
```

---

### API Implementation

**Endpoints to Implement:**

**File: `packages/api/fidus/memory/routes/knows_routes.py`**

```python
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from fidus.memory.services.knows_relationship_service import KnowsRelationshipService
from fidus.memory.relationships.knows import KnowsRelationship
from fidus.dependencies import get_qdrant_client, get_neo4j_driver, get_current_user

router = APIRouter(prefix="/api/memory/relationships/knows", tags=["relationships"])


class CreateKnowsRequest(BaseModel):
    user_id: str
    person_id: str
    role: Optional[str] = None
    relationship_type: Optional[str] = None
    communication_frequency: Optional[str] = None
    topics: Optional[List[str]] = None
    context: Optional[dict] = None


@router.post("", response_model=KnowsRelationship)
async def create_knows_relationship(
    request: CreateKnowsRequest,
    service: KnowsRelationshipService = Depends(lambda: KnowsRelationshipService(
        qdrant=get_qdrant_client(),
        neo4j=get_neo4j_driver()
    )),
    current_user = Depends(get_current_user)
):
    """
    Create KNOWS relationship with situational context.

    Pattern: Qdrant-First (ADR-0001)
    1. Store context in Qdrant
    2. Create Neo4j relationship
    3. Rollback on failure
    """
    try:
        relationship = await service.create_knows_relationship(
            tenant_id=current_user.tenant_id,
            user_id=request.user_id,
            person_id=request.person_id,
            role=request.role,
            relationship_type=request.relationship_type,
            communication_frequency=request.communication_frequency,
            topics=request.topics,
            context=request.context
        )
        return relationship
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{relationship_id}", response_model=KnowsRelationship)
async def get_knows_relationship(
    relationship_id: str,
    # TODO: Implement get by ID
):
    """Get KNOWS relationship by ID with context history."""
    raise HTTPException(status_code=501, detail="Not implemented")


@router.get("", response_model=List[KnowsRelationship])
async def list_knows_relationships(
    user_id: str,
    person_id: Optional[str] = None,
    # TODO: Implement list with filters
):
    """List KNOWS relationships with optional filters."""
    raise HTTPException(status_code=501, detail="Not implemented")
```

**OpenAPI Schema:**

```yaml
/api/memory/relationships/knows:
  post:
    summary: Create KNOWS relationship
    requestBody:
      content:
        application/json:
          schema:
            type: object
            required: [user_id, person_id]
            properties:
              user_id: {type: string}
              person_id: {type: string}
              role: {type: string, enum: [colleague, friend, mentor, family]}
              relationship_type: {type: string, enum: [professional, personal, familial]}
              communication_frequency: {type: string, enum: [daily, weekly, monthly, rarely]}
              topics: {type: array, items: {type: string}}
              context:
                type: object
                properties:
                  emotion: {type: string}
                  mood: {type: string}
                  activity: {type: string}
    responses:
      200:
        description: Relationship created
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/KnowsRelationship'
```

---

### Frontend Implementation

**Components to Create:**

#### 1. **`packages/web/src/components/memory/NetworkView.tsx`**

Purpose: Graph visualization showing User-Person connections

```typescript
'use client';

import { useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Card } from '@fidus/ui';
import { getNetworkGraph } from '@/lib/api/memory';

interface NetworkViewProps {
  userId: string;
}

export function NetworkView({ userId }: NetworkViewProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    loadNetworkGraph();
  }, [userId]);

  async function loadNetworkGraph() {
    try {
      const data = await getNetworkGraph(userId);

      // Transform API data to React Flow format
      const flowNodes: Node[] = [
        // User node (center)
        {
          id: data.user.id,
          type: 'default',
          position: { x: 400, y: 300 },
          data: {
            label: data.user.name,
            type: 'user'
          },
          style: {
            background: '#FF6B6B',
            color: 'white',
            border: '2px solid #C92A2A',
            borderRadius: '50%',
            width: 80,
            height: 80,
          }
        },
        // Person nodes (around user)
        ...data.persons.map((person, idx) => ({
          id: person.id,
          type: 'default',
          position: {
            x: 400 + 200 * Math.cos((idx * 2 * Math.PI) / data.persons.length),
            y: 300 + 200 * Math.sin((idx * 2 * Math.PI) / data.persons.length),
          },
          data: {
            label: person.name,
            type: 'person'
          },
          style: {
            background: '#4ECDC4',
            color: 'white',
            border: '2px solid #1A936F',
            borderRadius: '50%',
            width: 60,
            height: 60,
          }
        }))
      ];

      const flowEdges: Edge[] = data.relationships.map(rel => ({
        id: rel.id,
        source: rel.user_id,
        target: rel.person_id,
        label: rel.role || 'knows',
        type: 'default',
        style: { stroke: '#888' },
        data: rel
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);
    } catch (error) {
      console.error('Failed to load network:', error);
    }
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(_, node) => setSelectedNode(node)}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {selectedNode && (
        <div className="w-96 p-4 border-l">
          <RelationshipPanel nodeId={selectedNode.id} />
        </div>
      )}
    </div>
  );
}
```

#### 2. **`packages/web/src/components/memory/RelationshipPanel.tsx`**

Purpose: Side panel showing relationship details and context history

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Card, Button } from '@fidus/ui';
import { getRelationshipDetails } from '@/lib/api/memory';

interface RelationshipPanelProps {
  nodeId: string;
}

export function RelationshipPanel({ nodeId }: RelationshipPanelProps) {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetails();
  }, [nodeId]);

  async function loadDetails() {
    setLoading(true);
    try {
      const data = await getRelationshipDetails(nodeId);
      setDetails(data);
    } catch (error) {
      console.error('Failed to load details:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Card>Loading...</Card>;
  if (!details) return <Card>No details available</Card>;

  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold">{details.person.name}</h3>

      <div>
        <p className="text-sm text-gray-500">Role</p>
        <p className="font-medium">{details.relationship.role}</p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Communication Frequency</p>
        <p className="font-medium">{details.relationship.communication_frequency}</p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Topics</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {details.relationship.topics.map((topic: string) => (
            <span key={topic} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
              {topic}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500 mb-2">Context History</p>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {details.context_history.map((ctx: any) => (
            <Card key={ctx.id} className="p-2 text-sm">
              <p className="font-medium">{ctx.activity}</p>
              <p className="text-gray-600">Mood: {ctx.mood} • Emotion: {ctx.emotion}</p>
              <p className="text-xs text-gray-400">{new Date(ctx.created_at).toLocaleDateString()}</p>
            </Card>
          ))}
        </div>
      </div>

      <Button onClick={() => window.location.href = `/memory/relationships/${details.relationship.id}/edit`}>
        Edit Relationship
      </Button>
    </Card>
  );
}
```

#### 3. **`packages/web/src/components/memory/KnowsForm.tsx`**

Purpose: Form to create/edit KNOWS relationships

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, TextField, Select, Card } from '@fidus/ui';
import { createKnowsRelationship } from '@/lib/api/memory';

interface KnowsFormProps {
  userId: string;
  personId?: string;
  initialData?: any;
}

export function KnowsForm({ userId, personId, initialData }: KnowsFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    person_id: personId || '',
    role: initialData?.role || '',
    relationship_type: initialData?.relationship_type || 'professional',
    communication_frequency: initialData?.communication_frequency || 'weekly',
    topics: initialData?.topics?.join(', ') || '',
    context: {
      emotion: '',
      mood: '',
      activity: ''
    }
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await createKnowsRelationship({
        user_id: userId,
        person_id: formData.person_id,
        role: formData.role,
        relationship_type: formData.relationship_type,
        communication_frequency: formData.communication_frequency,
        topics: formData.topics.split(',').map(t => t.trim()),
        context: formData.context
      });

      router.push('/memory/network');
    } catch (error) {
      console.error('Failed to create relationship:', error);
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? 'Edit' : 'Add'} Relationship
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          placeholder="e.g., colleague, friend, mentor"
        />

        <Select
          label="Relationship Type"
          value={formData.relationship_type}
          onChange={(e) => setFormData({ ...formData, relationship_type: e.target.value })}
        >
          <option value="professional">Professional</option>
          <option value="personal">Personal</option>
          <option value="familial">Familial</option>
        </Select>

        <Select
          label="Communication Frequency"
          value={formData.communication_frequency}
          onChange={(e) => setFormData({ ...formData, communication_frequency: e.target.value })}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="rarely">Rarely</option>
        </Select>

        <TextField
          label="Topics"
          value={formData.topics}
          onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
          placeholder="software engineering, machine learning (comma-separated)"
        />

        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Current Context</h3>

          <TextField
            label="Emotion"
            value={formData.context.emotion}
            onChange={(e) => setFormData({
              ...formData,
              context: { ...formData.context, emotion: e.target.value }
            })}
            placeholder="e.g., friendly, professional"
          />

          <TextField
            label="Mood"
            value={formData.context.mood}
            onChange={(e) => setFormData({
              ...formData,
              context: { ...formData.context, mood: e.target.value }
            })}
            placeholder="e.g., productive, relaxed"
          />

          <TextField
            label="Activity"
            value={formData.context.activity}
            onChange={(e) => setFormData({
              ...formData,
              context: { ...formData.context, activity: e.target.value }
            })}
            placeholder="e.g., project discussion, coffee meeting"
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit">Save Relationship</Button>
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
```

#### 4. **API Client (`packages/web/src/lib/api/memory.ts`)**

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function createKnowsRelationship(data: any) {
  const response = await fetch(`${API_BASE}/api/memory/relationships/knows`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include'
  });

  if (!response.ok) throw new Error('Failed to create relationship');
  return response.json();
}

export async function getNetworkGraph(userId: string) {
  const response = await fetch(
    `${API_BASE}/api/memory/relationships/knows?user_id=${userId}`,
    { credentials: 'include' }
  );

  if (!response.ok) throw new Error('Failed to load network');
  return response.json();
}

export async function getRelationshipDetails(relationshipId: string) {
  const response = await fetch(
    `${API_BASE}/api/memory/relationships/knows/${relationshipId}`,
    { credentials: 'include' }
  );

  if (!response.ok) throw new Error('Failed to load details');
  return response.json();
}
```

**UI/UX Requirements:**
- Network graph is interactive: users can drag nodes, zoom, pan
- Clicking a node opens the relationship panel
- Relationship panel shows context history as a timeline
- Form validates required fields before submission
- Loading states and error messages for all async operations
- Responsive design: graph adapts to screen size
- Accessibility: keyboard navigation, ARIA labels

---

### Testing Requirements

**Unit Tests:**

**File: `packages/api/tests/unit/memory/test_knows_service.py`**

```python
import pytest
from unittest.mock import AsyncMock, MagicMock
from fidus.memory.services.knows_relationship_service import KnowsRelationshipService


@pytest.fixture
def mock_qdrant():
    return AsyncMock()


@pytest.fixture
def mock_neo4j():
    driver = MagicMock()
    driver.session = MagicMock()
    return driver


@pytest.mark.asyncio
async def test_create_knows_relationship_success(mock_qdrant, mock_neo4j):
    """Test successful KNOWS relationship creation with Qdrant-First pattern."""
    service = KnowsRelationshipService(qdrant=mock_qdrant, neo4j=mock_neo4j)

    relationship = await service.create_knows_relationship(
        tenant_id="tenant_123",
        user_id="user_456",
        person_id="person_789",
        role="colleague",
        relationship_type="professional",
        communication_frequency="weekly",
        topics=["software engineering"],
        context={"emotion": "friendly", "activity": "project_discussion"}
    )

    # Verify Qdrant was called first
    assert mock_qdrant.upsert.called
    # Verify Neo4j was called second
    assert mock_neo4j.session.called
    # Verify situation_id populated
    assert relationship.situation_id is not None
    assert relationship.role == "colleague"


@pytest.mark.asyncio
async def test_create_knows_relationship_rollback_on_neo4j_failure(mock_qdrant, mock_neo4j):
    """Test Qdrant rollback when Neo4j fails."""
    service = KnowsRelationshipService(qdrant=mock_qdrant, neo4j=mock_neo4j)

    # Simulate Neo4j failure
    mock_neo4j.session.side_effect = Exception("Neo4j connection failed")

    with pytest.raises(RuntimeError, match="rolled back Qdrant"):
        await service.create_knows_relationship(
            tenant_id="tenant_123",
            user_id="user_456",
            person_id="person_789"
        )

    # Verify rollback: Qdrant delete was called
    assert mock_qdrant.delete.called
```

**Integration Tests:**

**File: `packages/api/tests/integration/memory/test_knows_api.py`**

```python
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_knows_relationship_e2e(async_client: AsyncClient, test_user, test_person):
    """Test creating KNOWS relationship via API."""
    response = await async_client.post(
        "/api/memory/relationships/knows",
        json={
            "user_id": test_user.id,
            "person_id": test_person.id,
            "role": "colleague",
            "relationship_type": "professional",
            "communication_frequency": "weekly",
            "topics": ["machine learning", "startups"],
            "context": {
                "emotion": "friendly",
                "mood": "productive",
                "activity": "project_discussion"
            }
        }
    )

    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "colleague"
    assert data["situation_id"] is not None
    assert len(data["topics"]) == 2


@pytest.mark.asyncio
async def test_query_relationships_by_similar_context(async_client: AsyncClient, test_user):
    """Test querying relationships by similar context."""
    # Create relationship with context
    await async_client.post(
        "/api/memory/relationships/knows",
        json={
            "user_id": test_user.id,
            "person_id": "person_123",
            "context": {"emotion": "friendly", "activity": "project_discussion"}
        }
    )

    # Query by similar context
    response = await async_client.get(
        f"/api/memory/relationships/knows/search?user_id={test_user.id}",
        params={"context": {"emotion": "friendly", "activity": "brainstorming"}}
    )

    assert response.status_code == 200
    results = response.json()
    assert len(results) > 0
    assert results[0]["context"]["emotion"] == "friendly"
```

**E2E Tests:**

**File: `packages/web/tests/e2e/memory/knows-workflow.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';

test('User can create KNOWS relationship and view in network', async ({ page }) => {
  // Step 1: Login
  await page.goto('/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');

  // Step 2: Navigate to network view
  await page.goto('/memory/network');
  await expect(page.locator('h1')).toContainText('My Network');

  // Step 3: Click "Add Relationship" button
  await page.click('button:has-text("Add Relationship")');

  // Step 4: Fill form
  await page.selectOption('select[name="person"]', 'person_anna_schmidt');
  await page.fill('input[name="role"]', 'colleague');
  await page.selectOption('select[name="relationship_type"]', 'professional');
  await page.selectOption('select[name="communication_frequency"]', 'weekly');
  await page.fill('input[name="topics"]', 'machine learning, startups');

  // Add context
  await page.fill('input[name="context.emotion"]', 'friendly');
  await page.fill('input[name="context.mood"]', 'productive');
  await page.fill('input[name="context.activity"]', 'project discussion');

  // Step 5: Submit form
  await page.click('button:has-text("Save Relationship")');

  // Step 6: Verify redirect to network view
  await expect(page).toHaveURL('/memory/network');

  // Step 7: Verify edge appears in graph
  const graph = page.locator('.react-flow');
  await expect(graph).toBeVisible();

  // Find edge with label "colleague"
  const edge = page.locator('.react-flow__edge-text:has-text("colleague")');
  await expect(edge).toBeVisible();

  // Step 8: Click person node
  await page.click('.react-flow__node:has-text("Anna Schmidt")');

  // Step 9: Verify relationship panel opens
  const panel = page.locator('[data-testid="relationship-panel"]');
  await expect(panel).toBeVisible();
  await expect(panel).toContainText('colleague');
  await expect(panel).toContainText('weekly');
  await expect(panel).toContainText('machine learning');

  // Step 10: Verify context history
  await expect(panel.locator('[data-testid="context-history"]')).toBeVisible();
  await expect(panel).toContainText('project discussion');
  await expect(panel).toContainText('friendly');
});
```

---

## Implementation Guidelines

### Must Follow

1. **Qdrant-First Pattern (ADR-0001 + ADR-0002):**
   - Store ALL context in Qdrant payload FIRST (role, relationship_type, communication_frequency, topics, emotion, mood, activity)
   - Create Neo4j relationship with ONLY structural properties SECOND (relationship_instance_id, situation_id, observed_at, confidence, source)
   - **NO temporal boundaries** for KNOWS (no started_at/ended_at) - this is not a time-bounded relationship
   - Implement rollback: if Neo4j fails, delete Qdrant point
   - Verify rollback in tests
   - Use 1-Hop Query Pattern for all relationship queries (see `get_network_with_context()` example)

2. **Feature Flag:**
   - All functionality behind feature flag: `ENABLE_KNOWS_RELATIONSHIP`
   - Default: disabled
   - Graceful fallback: if flag is off, return empty list for queries

3. **Multi-Tenancy:**
   - ALL Qdrant queries filter by `tenant_id`
   - ALL Neo4j queries include `MATCH` on `tenant_id` (if applicable)
   - Security test: Verify tenant A cannot see tenant B's relationships

4. **Error Handling:**
   - User-facing errors: "Failed to create relationship. Please try again."
   - Backend logs: Include `request_id`, `user_id`, `person_id`, error stack
   - Monitoring: Emit `relationship_creation_errors_total` metric

5. **Code Quality:**
   - Type hints: All Python functions fully typed
   - TypeScript: No `any` types (use proper types)
   - Documentation: Docstrings on all service methods
   - Linting: Pass Ruff (Python) and ESLint (TypeScript)

### Must NOT Do

- ❌ Break existing functionality
- ❌ Skip Qdrant-First pattern (no direct Neo4j-only relationships)
- ❌ Store context properties in Neo4j (violates ADR-0002) - ALL context must be in Qdrant
- ❌ Add temporal boundaries to KNOWS relationship (started_at/ended_at) - not applicable for this relationship type
- ❌ Hard-code tenant_id or user_id
- ❌ Ignore rollback failures
- ❌ Skip tests for error scenarios
- ❌ Query Neo4j without filtering by tenant_id (security risk)

---

## Dependencies & Prerequisites

**Required Before Starting:**
- [x] Package 1.1 completed: Qdrant-First pattern established
- [x] Package 1.2 completed: User entity operational
- [x] Package 2.1 completed: Person entity operational
- [ ] Neo4j constraints: `CREATE CONSTRAINT user_id_unique FOR (u:User) REQUIRE u.id IS UNIQUE`
- [ ] Neo4j constraints: `CREATE CONSTRAINT person_id_unique FOR (p:Person) REQUIRE p.id IS UNIQUE`
- [ ] Qdrant collection: `situations` collection created with vector dimension 1536
- [ ] Feature flag: `ENABLE_KNOWS_RELATIONSHIP` added to config

**Technical Dependencies:**
- Neo4j 5.x running on `bolt://localhost:7687`
- Qdrant 1.7+ running on `http://localhost:6333`
- React Flow library: `npm install reactflow`
- Node 18+ and Python 3.11+ installed

---

## Step-by-Step Implementation Plan

### Phase 1: Backend Core (Days 1-2)
1. Create `relationship.py` base model
2. Create `knows.py` KNOWS-specific model
3. Implement `KnowsRelationshipService` with Qdrant-First pattern
4. Write unit tests for service (success + rollback scenarios)
5. Test manually with curl/Postman

### Phase 2: API Layer (Day 3)
1. Create `knows_routes.py` FastAPI router
2. Implement `POST /api/memory/relationships/knows` endpoint
3. Implement `GET /api/memory/relationships/knows/{id}` endpoint
4. Add authentication/authorization middleware
5. Write integration tests for API

### Phase 3: Frontend (Days 4-5)
1. Install React Flow: `npm install reactflow`
2. Create `NetworkView.tsx` component with graph rendering
3. Create `RelationshipPanel.tsx` for details
4. Create `KnowsForm.tsx` for add/edit
5. Add API client methods in `memory.ts`
6. Style components with @fidus/ui and Tailwind

### Phase 4: Integration & Testing (Day 6)
1. Write E2E test with Playwright (full workflow)
2. Test feature flag toggle (on/off)
3. Test multi-tenancy isolation
4. Test error scenarios (Qdrant failure, Neo4j failure)
5. Performance test: Create 100 relationships, verify graph renders <2s

### Phase 5: Documentation & Deployment (Day 7)
1. Update `/docs/solution-architecture/15-entity-management.md`
2. Add rollback runbook to operations docs
3. Deploy to dev environment
4. Manual smoke test: Create relationship via UI, verify in Neo4j and Qdrant
5. Enable feature flag in dev

---

## Verification Checklist

Before marking this package as complete, verify:

### Functionality
- [ ] User can create KNOWS relationship via API
- [ ] User can create KNOWS relationship via UI form
- [ ] Relationship appears in network graph visualization
- [ ] Clicking person node shows relationship panel with context
- [ ] Context history displays correctly
- [ ] Feature flag toggle works (on: new behavior, off: no-op)

### Code Quality
- [ ] All files created as specified
- [ ] Type hints on all Python functions
- [ ] No TypeScript `any` types
- [ ] No linting errors (Ruff, ESLint)
- [ ] No type checking errors (`mypy`, `npm run typecheck`)

### Testing
- [ ] Unit tests pass (>80% coverage for service)
- [ ] Integration tests pass (API endpoints)
- [ ] E2E test passes (Playwright workflow)
- [ ] Rollback test passes (Neo4j failure → Qdrant cleanup)

### Documentation
- [ ] Docstrings on all service methods
- [ ] Inline comments for Qdrant-First pattern
- [ ] Architecture docs updated
- [ ] API endpoints documented in OpenAPI

### Security & Performance
- [ ] Multi-tenancy verified (no cross-tenant leaks)
- [ ] Input validation on all endpoints
- [ ] Graph renders <2s with 50 nodes
- [ ] No N+1 query problems

### Deployment Readiness
- [ ] Feature flag `ENABLE_KNOWS_RELATIONSHIP` in config
- [ ] Neo4j constraints created
- [ ] Qdrant collection created
- [ ] Rollback plan documented

---

## Risk Mitigation

**Risks from WBS:**
- **Risk:** Qdrant-Neo4j synchronization may fail, leaving inconsistent state
- **Mitigation:** Transactional approach with rollback, health check endpoint validates consistency

- **Risk:** Graph visualization may be slow with large networks (>100 nodes)
- **Mitigation:** Implement pagination, lazy loading, zoom/pan controls

**Additional Risks:**
- **Risk:** Embedding generation may be slow (>500ms per relationship)
- **Mitigation:** Cache embeddings, use batch embedding API, consider async processing

- **Risk:** React Flow performance degrades with >200 nodes
- **Mitigation:** Implement virtualization, clustering for dense areas, depth limiting

---

## Related Resources

**WBS Package Details:** `/docs/prototypes/fidus-memory/migration-v3-wbs.md#package-31`
**Architecture Review:** `/docs/reviews/2025-11-21-fidus-memory-architecture-review.md`
**Implementation Prompts Review:** `/docs/reviews/2025-11-21-implementation-prompts-review.md`
**ADR-0001:** `/docs/adr/ADR-0001-situational-context-as-relationship-qualifier.md` (Qdrant-First Pattern)
**ADR-0002:** `/docs/adr/ADR-0002-property-placement-and-geospatial-exception.md` (Property Placement Strategy)
**Solution Architecture:** `/docs/solution-architecture/15-entity-management.md`
**Existing Codebase:**
- Backend: `packages/api/fidus/memory/`
- Frontend: `packages/web/src/components/memory/`

---

## Questions to Resolve Before Starting

If any of these are unclear, ask for clarification:

1. **Embedding Model:** Which embedding model should be used for context similarity? (e.g., text-embedding-ada-002, sentence-transformers)
2. **Graph Layout:** Should we use force-directed layout or fixed circular layout for network visualization?
3. **Context Schema:** Are there any required context fields beyond emotion/mood/activity, or should all be optional?
4. **Deduplication:** How should we handle duplicate KNOWS relationships between same user-person pair? (Allow multiples with different contexts, or merge?)

---

## Success Criteria

This package is **successfully implemented** when:

1. ✅ A user can create a KNOWS relationship via the UI and see it in the network graph
2. ✅ All acceptance criteria are verified (checked off)
3. ✅ All tests pass (unit, integration, E2E)
4. ✅ Qdrant-First pattern verified: Context in Qdrant, situation_id in Neo4j
5. ✅ Rollback test passes: Neo4j failure triggers Qdrant cleanup
6. ✅ Deployed to dev environment with feature flag OFF
7. ✅ Manual smoke test completed successfully
8. ✅ Documentation updated

---

**Prompt Version:** 1.0
**Generated:** 2025-11-21
**Target Package:** 3.1

---

**END OF IMPLEMENTATION PROMPT**

# Implementation Prompt: 1.1 - Qdrant-First Pattern Migration

**Package:** 1.1
**Epic:** Foundation & Architecture Compliance
**Priority:** 🔴 CRITICAL
**Context Document:** `/docs/prototypes/fidus-memory/migration-v3-wbs.md` (Lines 249-298)

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
- Fidus Memory v2.2.0 uses legacy v1.0 pattern: Situational context stored in Neo4j `Situation` nodes with `IN_SITUATION` relationships
- This creates 2-Hop queries: `MATCH (u:User)-[r:HAS_PREFERENCE]->()-[:IN_SITUATION]->(s:Situation)` which are slow
- Violates ADR-0001: Qdrant should be PRIMARY storage, Neo4j SECONDARY
- MCP Server integration is functional but using outdated pattern
- Preference learning and situational context extraction are working

**Migration Goal:**
- Implement Qdrant-First pattern: Store full context in Qdrant payload (PRIMARY), Neo4j only holds `situation_id` reference (SECONDARY)
- Reduce to 1-Hop queries: `MATCH (u:User)-[r:HAS_PREFERENCE {situation_id: $sid}]->(p:Preference)`
- Achieve better performance through Qdrant payload indexes on `tenant_id`, `user_id`, `relationship_type`
- Enable feature flag for gradual rollout with zero downtime
- Maintain backward compatibility during migration

**Architecture References:**
- Solution Architecture: `/docs/solution-architecture/14-situational-context.md`
- ADR: `/docs/adr/ADR-0001-qdrant-first-pattern.md`
- Domain Model: `/docs/domain-model/memory-domain-model.md`

---

## Your Task

Implement **Qdrant-First Pattern Migration** according to the specifications below.

**User Story:**
As a system architect, I want to migrate context storage to the Qdrant-First pattern so that we comply with ADR-0001 and achieve better performance with 1-Hop queries.

**Acceptance Criteria:**
1. Backend: New `ContextStorageV3` service in `packages/api/fidus/memory/context/storage_v3.py`
2. Backend: Context stored in Qdrant payload (PRIMARY), Neo4j only holds `situation_id` reference (SECONDARY)
3. Backend: `IN_SITUATION` relationship removed, replaced with `situation_id` property on relationships
4. Backend: Migration script converts existing Situation nodes to Qdrant-only storage
5. API: Feature flag `USE_QDRANT_FIRST` to toggle between old/new pattern
6. Frontend: Admin panel to monitor migration progress in `packages/web/src/components/memory/admin/MigrationStatus.tsx`
7. Tests: Parallel testing with old and new patterns validates identical behavior
8. Documentation: Update `docs/solution-architecture/14-situational-context.md` with v3.0 examples

---

## Technical Specification

### Backend Implementation

**Files to Create:**

1. **`packages/api/fidus/memory/context/storage_v3.py`** - New storage service implementing Qdrant-First pattern

```python
"""
Qdrant-First context storage service (ADR-0001 compliant).

This module implements the v3.0 storage pattern where:
1. Qdrant is PRIMARY: Full context stored in payload
2. Neo4j is SECONDARY: Only situation_id reference stored
3. 1-Hop queries: Direct relationship property lookup
"""

from typing import Dict, Any, Optional, List
from uuid import uuid4
from datetime import datetime
import logging

from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, Filter, FieldCondition, MatchValue
from neo4j import AsyncDriver, AsyncSession

logger = logging.getLogger(__name__)


class ContextStorageV3:
    """
    Qdrant-First storage pattern (ADR-0001).

    Pattern:
    1. Store context in Qdrant (PRIMARY) - full payload with all situational factors
    2. Store relationship in Neo4j (SECONDARY) - situation_id reference only
    3. Rollback Qdrant on Neo4j failure for consistency
    4. Enable 1-Hop queries: MATCH (u:User)-[r {situation_id: $sid}]->(e)
    """

    def __init__(self, qdrant: QdrantClient, neo4j: AsyncDriver, collection_name: str = "situations"):
        self.qdrant = qdrant
        self.neo4j = neo4j
        self.collection_name = collection_name

    async def store_situation_v3(
        self,
        tenant_id: str,
        user_id: str,
        context: Dict[str, Any],
        relationship_type: str,
        entity_id: str,
        embedding: Optional[List[float]] = None
    ) -> str:
        """
        Store situational context in Qdrant (PRIMARY).

        Args:
            tenant_id: Tenant identifier for multi-tenancy
            user_id: User identifier
            context: Full context dict (emotion, mood, activity, location, time_of_day, etc.)
            relationship_type: e.g., "KNOWS", "WORKS_AT", "HAS_PREFERENCE"
            entity_id: Related entity ID (person_id, organization_id, preference_id, etc.)
            embedding: Optional vector embedding for similarity search

        Returns:
            situation_id: UUID referencing Qdrant point

        Raises:
            RuntimeError: If Qdrant upsert fails
        """
        situation_id = str(uuid4())

        # Default embedding if not provided (zero vector for now)
        if embedding is None:
            embedding = [0.0] * 384  # TODO: Replace with actual embedding generation

        # Prepare Qdrant payload with full context
        payload = {
            "tenant_id": tenant_id,
            "user_id": user_id,
            "relationship_type": relationship_type,
            "entity_id": entity_id,
            "context": context,  # FULL flexible context dictionary
            "created_at": datetime.utcnow().isoformat(),
            "version": "v3.0"
        }

        try:
            # 1. Qdrant Insert (PRIMARY) - Must succeed first
            self.qdrant.upsert(
                collection_name=self.collection_name,
                points=[
                    PointStruct(
                        id=situation_id,
                        vector=embedding,
                        payload=payload
                    )
                ]
            )
            logger.info(f"Stored situation {situation_id} in Qdrant for user {user_id}")
            return situation_id

        except Exception as e:
            logger.error(f"Failed to store situation in Qdrant: {e}")
            raise RuntimeError(f"Qdrant storage failed: {e}")

    async def store_relationship_with_context(
        self,
        user_id: str,
        entity_id: str,
        entity_label: str,
        relationship_type: str,
        situation_id: str,
        properties: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Create Neo4j relationship with situation_id reference (SECONDARY).

        Implements 1-Hop pattern: No IN_SITUATION edge, just property.

        Args:
            user_id: User node ID
            entity_id: Target entity node ID
            entity_label: Neo4j label for target entity (e.g., "Person", "Preference")
            relationship_type: Relationship type (e.g., "KNOWS", "HAS_PREFERENCE")
            situation_id: Reference to Qdrant point
            properties: Additional relationship properties

        Returns:
            relationship_instance_id: UUID for this relationship instance

        Raises:
            RuntimeError: If Neo4j fails (triggers Qdrant rollback externally)
        """
        relationship_instance_id = str(uuid4())
        properties = properties or {}

        query = f"""
        MATCH (u:User {{id: $user_id}})
        MATCH (e:{entity_label} {{id: $entity_id}})
        CREATE (u)-[r:{relationship_type} {{
            relationship_instance_id: $rel_id,
            situation_id: $sit_id,
            observed_at: datetime(),
            confidence: $confidence,
            source: $source
        }}]->(e)
        RETURN r.relationship_instance_id as id
        """

        try:
            async with self.neo4j.session() as session:
                result = await session.run(
                    query,
                    user_id=user_id,
                    entity_id=entity_id,
                    rel_id=relationship_instance_id,
                    sit_id=situation_id,
                    confidence=properties.get("confidence", 0.9),
                    source=properties.get("source", "explicit")
                )
                record = await result.single()
                logger.info(f"Created relationship {relationship_instance_id} in Neo4j")
                return record["id"]

        except Exception as e:
            logger.error(f"Failed to create relationship in Neo4j: {e}")
            raise RuntimeError(f"Neo4j relationship creation failed: {e}")

    async def store_with_rollback(
        self,
        tenant_id: str,
        user_id: str,
        context: Dict[str, Any],
        relationship_type: str,
        entity_id: str,
        entity_label: str,
        properties: Optional[Dict[str, Any]] = None,
        embedding: Optional[List[float]] = None
    ) -> tuple[str, str]:
        """
        Store context in Qdrant and relationship in Neo4j with rollback on failure.

        This is the main method to use for storing contextual relationships.

        Returns:
            (situation_id, relationship_instance_id)

        Raises:
            RuntimeError: If either operation fails (with automatic rollback)
        """
        situation_id = None
        try:
            # Step 1: Store in Qdrant (PRIMARY)
            situation_id = await self.store_situation_v3(
                tenant_id=tenant_id,
                user_id=user_id,
                context=context,
                relationship_type=relationship_type,
                entity_id=entity_id,
                embedding=embedding
            )

            # Step 2: Store in Neo4j (SECONDARY)
            relationship_id = await self.store_relationship_with_context(
                user_id=user_id,
                entity_id=entity_id,
                entity_label=entity_label,
                relationship_type=relationship_type,
                situation_id=situation_id,
                properties=properties
            )

            return situation_id, relationship_id

        except Exception as e:
            # Rollback: Delete from Qdrant if Neo4j failed
            if situation_id:
                try:
                    self.qdrant.delete(
                        collection_name=self.collection_name,
                        points_selector=[situation_id]
                    )
                    logger.warning(f"Rolled back Qdrant point {situation_id} due to Neo4j failure")
                except Exception as rollback_error:
                    logger.error(f"Rollback failed: {rollback_error}")

            raise RuntimeError(f"Storage failed and rolled back: {e}")

    async def get_context_by_situation_id(self, situation_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve full context from Qdrant by situation_id.

        Args:
            situation_id: Qdrant point ID

        Returns:
            Context dictionary or None if not found
        """
        try:
            points = self.qdrant.retrieve(
                collection_name=self.collection_name,
                ids=[situation_id]
            )
            if points:
                return points[0].payload.get("context")
            return None
        except Exception as e:
            logger.error(f"Failed to retrieve context: {e}")
            return None

    async def query_contexts_by_filters(
        self,
        tenant_id: str,
        user_id: Optional[str] = None,
        relationship_type: Optional[str] = None,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """
        Query contexts by filters using Qdrant payload filtering.

        Args:
            tenant_id: Required tenant filter
            user_id: Optional user filter
            relationship_type: Optional relationship type filter
            limit: Max results to return

        Returns:
            List of context payloads
        """
        conditions = [
            FieldCondition(key="tenant_id", match=MatchValue(value=tenant_id))
        ]

        if user_id:
            conditions.append(FieldCondition(key="user_id", match=MatchValue(value=user_id)))

        if relationship_type:
            conditions.append(
                FieldCondition(key="relationship_type", match=MatchValue(value=relationship_type))
            )

        try:
            results = self.qdrant.scroll(
                collection_name=self.collection_name,
                scroll_filter=Filter(must=conditions),
                limit=limit,
                with_payload=True,
                with_vectors=False
            )
            return [point.payload for point in results[0]]
        except Exception as e:
            logger.error(f"Failed to query contexts: {e}")
            return []
```

**Key Implementation Notes:**
- Qdrant is PRIMARY: Store BEFORE Neo4j
- Neo4j has ONLY `situation_id` property (not full context)
- Rollback logic: If Neo4j fails, delete Qdrant point
- 1-Hop queries: `MATCH (u:User)-[r:KNOWS {situation_id: $sid}]->(p:Person)`
- Multi-tenancy: All queries filter by `tenant_id`

---

2. **`packages/api/fidus/memory/context/models.py`** - Update models to include `situation_id`

```python
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from datetime import datetime


class RelationshipContext(BaseModel):
    """Context for a relationship instance (v3.0)."""

    relationship_instance_id: str = Field(..., description="Unique ID for this relationship instance")
    situation_id: str = Field(..., description="Reference to Qdrant context point")
    observed_at: datetime = Field(default_factory=datetime.utcnow)
    confidence: float = Field(default=0.9, ge=0.0, le=1.0)
    source: str = Field(default="explicit", description="How relationship was created: explicit, inferred, extracted")


class SituationalContext(BaseModel):
    """Full situational context stored in Qdrant (v3.0)."""

    tenant_id: str
    user_id: str
    relationship_type: str
    entity_id: str
    context: Dict[str, Any] = Field(
        default_factory=dict,
        description="Flexible context: emotion, mood, activity, location, time_of_day, etc."
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)
    version: str = Field(default="v3.0")
```

---

3. **`packages/api/fidus/config.py`** - Add feature flag

```python
class FeatureFlags:
    """Feature flags for gradual rollout."""

    USE_QDRANT_FIRST: bool = env.bool("USE_QDRANT_FIRST", default=False)
    # ... other flags
```

---

4. **`packages/api/scripts/migrate_situations_to_qdrant.py`** - Migration script

```python
#!/usr/bin/env python3
"""
Migration script: Convert Neo4j Situation nodes to Qdrant-First pattern.

This script:
1. Reads all Situation nodes from Neo4j
2. Creates corresponding Qdrant points with full context
3. Updates Neo4j relationships to use situation_id property
4. Optionally deletes old Situation nodes after verification
"""

import asyncio
import logging
from typing import List, Dict, Any
from uuid import uuid4

from qdrant_client import QdrantClient
from neo4j import AsyncGraphDatabase

from fidus.memory.context.storage_v3 import ContextStorageV3

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def fetch_situations_from_neo4j(neo4j_driver) -> List[Dict[str, Any]]:
    """Fetch all Situation nodes with their relationships."""
    query = """
    MATCH (s:Situation)
    OPTIONAL MATCH (u:User)-[r]->(e)-[:IN_SITUATION]->(s)
    RETURN s.id as situation_id,
           s.tenant_id as tenant_id,
           s.context as context,
           u.id as user_id,
           type(r) as relationship_type,
           e.id as entity_id,
           labels(e)[0] as entity_label,
           r.relationship_instance_id as rel_instance_id
    """
    async with neo4j_driver.session() as session:
        result = await session.run(query)
        return [dict(record) async for record in result]


async def migrate_situation_to_qdrant(
    situation: Dict[str, Any],
    storage_v3: ContextStorageV3
) -> str:
    """Migrate one Situation node to Qdrant."""
    situation_id = situation["situation_id"] or str(uuid4())

    await storage_v3.store_situation_v3(
        tenant_id=situation["tenant_id"],
        user_id=situation["user_id"],
        context=situation["context"] or {},
        relationship_type=situation["relationship_type"],
        entity_id=situation["entity_id"],
        embedding=None  # TODO: Generate embedding if needed
    )

    logger.info(f"Migrated situation {situation_id} to Qdrant")
    return situation_id


async def update_neo4j_relationship_with_situation_id(
    neo4j_driver,
    rel_instance_id: str,
    situation_id: str
):
    """Update Neo4j relationship to include situation_id property."""
    query = """
    MATCH ()-[r {relationship_instance_id: $rel_id}]->()
    SET r.situation_id = $sit_id
    RETURN r
    """
    async with neo4j_driver.session() as session:
        await session.run(query, rel_id=rel_instance_id, sit_id=situation_id)
    logger.info(f"Updated relationship {rel_instance_id} with situation_id {situation_id}")


async def remove_in_situation_edges(neo4j_driver):
    """Remove old IN_SITUATION relationships."""
    query = """
    MATCH ()-[r:IN_SITUATION]->()
    DELETE r
    """
    async with neo4j_driver.session() as session:
        result = await session.run(query)
        summary = await result.consume()
        logger.info(f"Deleted {summary.counters.relationships_deleted} IN_SITUATION relationships")


async def main():
    # Initialize connections
    qdrant = QdrantClient(url="http://localhost:6333")
    neo4j_driver = AsyncGraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "password"))
    storage_v3 = ContextStorageV3(qdrant, neo4j_driver)

    # Step 1: Fetch all Situation nodes
    logger.info("Fetching Situation nodes from Neo4j...")
    situations = await fetch_situations_from_neo4j(neo4j_driver)
    logger.info(f"Found {len(situations)} situations to migrate")

    # Step 2: Migrate each to Qdrant
    for situation in situations:
        try:
            situation_id = await migrate_situation_to_qdrant(situation, storage_v3)

            # Step 3: Update Neo4j relationship with situation_id
            if situation["rel_instance_id"]:
                await update_neo4j_relationship_with_situation_id(
                    neo4j_driver,
                    situation["rel_instance_id"],
                    situation_id
                )
        except Exception as e:
            logger.error(f"Failed to migrate situation {situation.get('situation_id')}: {e}")

    # Step 4: Remove IN_SITUATION edges
    logger.info("Removing IN_SITUATION relationships...")
    await remove_in_situation_edges(neo4j_driver)

    # Step 5: Optionally delete Situation nodes (manual verification recommended first)
    # await delete_situation_nodes(neo4j_driver)

    logger.info("Migration complete!")
    await neo4j_driver.close()


if __name__ == "__main__":
    asyncio.run(main())
```

---

### API Implementation

**Files to Create:**

1. **`packages/api/fidus/memory/routes/admin_routes.py`** - Admin endpoints for migration

```python
from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any
from pydantic import BaseModel

from fidus.memory.context.storage_v3 import ContextStorageV3
from fidus.dependencies import get_storage_v3

router = APIRouter(prefix="/api/memory/admin", tags=["admin"])


class MigrationStatus(BaseModel):
    """Migration progress status."""
    total_situations: int
    migrated_situations: int
    failed_migrations: int
    progress_percentage: float
    status: str  # "not_started", "in_progress", "completed", "failed"


@router.post("/migrate-qdrant-first")
async def trigger_migration(storage: ContextStorageV3 = Depends(get_storage_v3)) -> Dict[str, Any]:
    """
    Trigger Qdrant-First migration.

    This endpoint starts the background migration process.
    Monitor progress via GET /api/memory/admin/migration-status.
    """
    # TODO: Implement background task with Celery or similar
    # For now, return mock response
    return {
        "message": "Migration started",
        "job_id": "migration-job-123",
        "status": "in_progress"
    }


@router.get("/migration-status")
async def get_migration_status(storage: ContextStorageV3 = Depends(get_storage_v3)) -> MigrationStatus:
    """
    Get migration progress status.

    Returns current state of Qdrant-First migration.
    """
    # TODO: Implement actual status tracking
    return MigrationStatus(
        total_situations=1000,
        migrated_situations=750,
        failed_migrations=5,
        progress_percentage=75.0,
        status="in_progress"
    )
```

---

### Frontend Implementation

**Files to Create:**

1. **`packages/web/src/components/memory/admin/MigrationStatus.tsx`** - Admin panel component

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@fidus/ui/Card';
import { Button } from '@fidus/ui/Button';
import { Progress } from '@fidus/ui/Progress';
import { Alert, AlertDescription } from '@fidus/ui/Alert';
import { Switch } from '@fidus/ui/Switch';

interface MigrationStatusData {
  total_situations: number;
  migrated_situations: number;
  failed_migrations: number;
  progress_percentage: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
}

export function MigrationStatus() {
  const [status, setStatus] = useState<MigrationStatusData | null>(null);
  const [useQdrantFirst, setUseQdrantFirst] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch migration status on mount
    fetchMigrationStatus();

    // Poll every 5 seconds if migration in progress
    const interval = setInterval(() => {
      if (status?.status === 'in_progress') {
        fetchMigrationStatus();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [status?.status]);

  const fetchMigrationStatus = async () => {
    try {
      const response = await fetch('/api/memory/admin/migration-status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to fetch migration status:', error);
    }
  };

  const startMigration = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/memory/admin/migrate-qdrant-first', {
        method: 'POST',
      });
      if (response.ok) {
        await fetchMigrationStatus();
      }
    } catch (error) {
      console.error('Failed to start migration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFeatureFlag = async (enabled: boolean) => {
    // TODO: Implement feature flag toggle API call
    setUseQdrantFirst(enabled);
  };

  if (!status) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Qdrant-First Migration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Migration Progress */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Migration Progress</span>
              <span className="text-sm text-muted-foreground">
                {status.migrated_situations} / {status.total_situations}
              </span>
            </div>
            <Progress value={status.progress_percentage} />
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm">Status:</span>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                status.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : status.status === 'in_progress'
                  ? 'bg-blue-100 text-blue-800'
                  : status.status === 'failed'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {status.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {/* Failed Migrations Warning */}
          {status.failed_migrations > 0 && (
            <Alert variant="warning">
              <AlertDescription>
                {status.failed_migrations} migrations failed. Check logs for details.
              </AlertDescription>
            </Alert>
          )}

          {/* Start Migration Button */}
          {status.status === 'not_started' && (
            <Button onClick={startMigration} disabled={isLoading}>
              {isLoading ? 'Starting...' : 'Start Migration'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Feature Flag Toggle */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Flag</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">USE_QDRANT_FIRST</p>
              <p className="text-sm text-muted-foreground">
                Enable Qdrant-First pattern for new context storage
              </p>
            </div>
            <Switch checked={useQdrantFirst} onCheckedChange={toggleFeatureFlag} />
          </div>

          {useQdrantFirst && (
            <Alert variant="info" className="mt-4">
              <AlertDescription>
                Qdrant-First pattern is enabled. New contexts will use the v3.0 storage pattern.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### Testing Requirements

**Unit Tests:**

**File:** `packages/api/tests/unit/memory/test_storage_v3.py`

```python
import pytest
from unittest.mock import AsyncMock, MagicMock
from fidus.memory.context.storage_v3 import ContextStorageV3


@pytest.fixture
def mock_qdrant():
    return MagicMock()


@pytest.fixture
def mock_neo4j():
    return AsyncMock()


@pytest.fixture
def storage_v3(mock_qdrant, mock_neo4j):
    return ContextStorageV3(mock_qdrant, mock_neo4j)


@pytest.mark.asyncio
async def test_store_situation_v3_success(storage_v3, mock_qdrant):
    """Test successful storage of situation in Qdrant."""
    context = {"emotion": "happy", "activity": "meeting"}

    situation_id = await storage_v3.store_situation_v3(
        tenant_id="tenant-1",
        user_id="user-1",
        context=context,
        relationship_type="KNOWS",
        entity_id="person-1"
    )

    assert situation_id is not None
    mock_qdrant.upsert.assert_called_once()
    call_args = mock_qdrant.upsert.call_args
    assert call_args[1]["collection_name"] == "situations"


@pytest.mark.asyncio
async def test_store_with_rollback_neo4j_failure(storage_v3, mock_qdrant, mock_neo4j):
    """Test rollback when Neo4j fails."""
    mock_neo4j.session.return_value.__aenter__.return_value.run.side_effect = Exception("Neo4j error")

    context = {"emotion": "neutral"}

    with pytest.raises(RuntimeError, match="Storage failed and rolled back"):
        await storage_v3.store_with_rollback(
            tenant_id="tenant-1",
            user_id="user-1",
            context=context,
            relationship_type="KNOWS",
            entity_id="person-1",
            entity_label="Person"
        )

    # Verify Qdrant delete was called (rollback)
    mock_qdrant.delete.assert_called_once()


@pytest.mark.asyncio
async def test_get_context_by_situation_id(storage_v3, mock_qdrant):
    """Test retrieval of context by situation_id."""
    mock_point = MagicMock()
    mock_point.payload = {"context": {"emotion": "excited"}}
    mock_qdrant.retrieve.return_value = [mock_point]

    context = await storage_v3.get_context_by_situation_id("situation-123")

    assert context == {"emotion": "excited"}
    mock_qdrant.retrieve.assert_called_once_with(
        collection_name="situations",
        ids=["situation-123"]
    )
```

---

**Integration Tests:**

**File:** `packages/api/tests/integration/memory/test_storage_v3.py`

```python
import pytest
from qdrant_client import QdrantClient
from neo4j import AsyncGraphDatabase

from fidus.memory.context.storage_v3 import ContextStorageV3


@pytest.fixture
async def qdrant_client():
    """Provide Qdrant client connected to test instance."""
    client = QdrantClient(url="http://localhost:6333")
    # Ensure collection exists
    # TODO: Create collection if not exists
    yield client


@pytest.fixture
async def neo4j_driver():
    """Provide Neo4j driver connected to test instance."""
    driver = AsyncGraphDatabase.driver(
        "bolt://localhost:7687",
        auth=("neo4j", "test-password")
    )
    yield driver
    await driver.close()


@pytest.mark.asyncio
async def test_full_storage_workflow(qdrant_client, neo4j_driver):
    """Test complete Qdrant-First storage workflow."""
    storage = ContextStorageV3(qdrant_client, neo4j_driver)

    # Store context via v3 pattern
    context = {
        "emotion": "focused",
        "activity": "coding",
        "location": "home_office"
    }

    situation_id, rel_id = await storage.store_with_rollback(
        tenant_id="tenant-test",
        user_id="user-123",
        context=context,
        relationship_type="KNOWS",
        entity_id="person-456",
        entity_label="Person",
        properties={"confidence": 0.95}
    )

    # Verify Qdrant storage
    retrieved_context = await storage.get_context_by_situation_id(situation_id)
    assert retrieved_context == context

    # Verify Neo4j relationship has situation_id
    query = "MATCH ()-[r {relationship_instance_id: $rel_id}]->() RETURN r.situation_id as sit_id"
    async with neo4j_driver.session() as session:
        result = await session.run(query, rel_id=rel_id)
        record = await result.single()
        assert record["sit_id"] == situation_id
```

---

**E2E Test:**

**File:** `packages/web/tests/e2e/memory/migration-workflow.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test('Admin can monitor Qdrant-First migration progress', async ({ page }) => {
  // Step 1: Navigate to admin panel
  await page.goto('/memory/admin');

  // Step 2: Verify migration status card is visible
  await expect(page.getByText('Qdrant-First Migration')).toBeVisible();

  // Step 3: Check initial migration status
  const progressText = await page.getByText(/\d+ \/ \d+/).textContent();
  expect(progressText).toBeTruthy();

  // Step 4: Start migration if not started
  const startButton = page.getByRole('button', { name: /start migration/i });
  if (await startButton.isVisible()) {
    await startButton.click();
    await expect(page.getByText(/in progress/i)).toBeVisible();
  }

  // Step 5: Verify progress bar updates
  const progressBar = page.locator('[role="progressbar"]');
  await expect(progressBar).toBeVisible();

  // Step 6: Toggle feature flag
  const featureFlagSwitch = page.getByRole('switch', { name: /USE_QDRANT_FIRST/i });
  await featureFlagSwitch.click();
  await expect(page.getByText(/Qdrant-First pattern is enabled/i)).toBeVisible();

  // Step 7: Verify no failed migrations alert
  const warningAlert = page.locator('[role="alert"]').filter({ hasText: /failed/i });
  if (await warningAlert.isVisible()) {
    const failedCount = await warningAlert.textContent();
    console.log(`Warning: ${failedCount}`);
  }
});
```

---

## Implementation Guidelines

### Must Follow

1. **Qdrant-First Pattern:**
   - ALWAYS store in Qdrant BEFORE Neo4j
   - Neo4j relationships MUST include `situation_id` property
   - Implement rollback if Neo4j fails
   - Use 1-Hop queries: `MATCH (u)-[r {situation_id: $sid}]->(e)`

2. **Feature Flag:**
   - All new storage logic behind `USE_QDRANT_FIRST` flag
   - Default: disabled
   - Graceful fallback to old pattern if flag is off
   - Allow instant rollback by setting flag to false

3. **Multi-Tenancy:**
   - ALL Qdrant queries MUST filter by `tenant_id`
   - Security: Never leak data across tenants
   - Add payload index on `tenant_id` for performance

4. **Error Handling:**
   - Log all errors with context (situation_id, user_id, operation)
   - Emit metrics for storage failures
   - User-facing errors: "Failed to store context. Please try again."

5. **Code Quality:**
   - Type hints on all Python functions
   - Docstrings for public methods
   - Pass Ruff linting
   - No hardcoded values

### Must NOT Do

- ❌ Break existing v1.0 storage (maintain parallel paths)
- ❌ Skip rollback logic (data consistency critical)
- ❌ Bypass feature flag
- ❌ Delete Situation nodes without admin confirmation
- ❌ Ignore migration failures (must be logged and recoverable)

---

## Dependencies & Prerequisites

**Required Before Starting:**
- [ ] Neo4j 5.x running with existing Situation nodes
- [ ] Qdrant 1.7+ running (collection "situations" created)
- [ ] Python 3.11+ installed
- [ ] Environment variables configured: `QDRANT_URL`, `NEO4J_URI`

**Technical Dependencies:**
- `qdrant-client>=1.7.0`
- `neo4j>=5.0.0`
- `pydantic>=2.0.0`
- `fastapi>=0.100.0`

---

## Step-by-Step Implementation Plan

### Phase 1: Backend Core
1. Create `storage_v3.py` with `ContextStorageV3` class
2. Implement `store_situation_v3()` method
3. Implement `store_relationship_with_context()` method
4. Implement `store_with_rollback()` wrapper method
5. Add feature flag to config
6. Write unit tests for all methods

### Phase 2: Migration Script
1. Create `migrate_situations_to_qdrant.py` script
2. Implement Situation node fetching from Neo4j
3. Implement Qdrant migration logic
4. Implement Neo4j relationship updates
5. Add dry-run mode for testing
6. Test on small dataset first

### Phase 3: API Layer
1. Create admin routes in `admin_routes.py`
2. Implement `POST /api/memory/admin/migrate-qdrant-first`
3. Implement `GET /api/memory/admin/migration-status`
4. Add authentication/authorization for admin endpoints
5. Write integration tests for API

### Phase 4: Frontend
1. Create `MigrationStatus.tsx` component
2. Implement progress bar visualization
3. Add feature flag toggle UI
4. Connect to API endpoints
5. Add polling for status updates
6. Style with @fidus/ui components

### Phase 5: Integration & Testing
1. Write E2E test for full migration workflow
2. Test feature flag toggle (on/off works)
3. Test rollback scenario (simulate Neo4j failure)
4. Performance test with 1000+ situations
5. Verify 1-Hop query performance improvement

### Phase 6: Documentation & Deployment
1. Update `docs/solution-architecture/14-situational-context.md`
2. Add migration runbook with rollback instructions
3. Create admin guide for migration monitoring
4. Deploy to dev environment with flag OFF
5. Run migration on dev data
6. Enable flag after verification

---

## Verification Checklist

### Functionality
- [ ] Context stored in Qdrant with full payload
- [ ] Neo4j relationships have `situation_id` property
- [ ] No `IN_SITUATION` relationships created
- [ ] Rollback works when Neo4j fails
- [ ] Feature flag toggles between old/new pattern
- [ ] Admin panel displays migration progress
- [ ] 1-Hop queries work correctly

### Code Quality
- [ ] All files created as specified
- [ ] Type hints on all Python functions
- [ ] No Ruff linting errors
- [ ] Docstrings for public methods
- [ ] No hardcoded values

### Testing
- [ ] Unit tests pass (>80% coverage)
- [ ] Integration tests pass with real databases
- [ ] E2E test passes (admin workflow)
- [ ] Rollback test passes
- [ ] Parallel testing validates equivalence with v1.0

### Documentation
- [ ] Solution architecture updated with v3.0 examples
- [ ] Migration runbook created
- [ ] Rollback procedure documented
- [ ] Code comments for complex logic

### Security & Performance
- [ ] Multi-tenancy verified (no cross-tenant leaks)
- [ ] Qdrant payload indexes added (`tenant_id`, `user_id`, `relationship_type`)
- [ ] Query performance benchmarked (1-Hop vs 2-Hop)
- [ ] No N+1 query problems

### Deployment Readiness
- [ ] Feature flag `USE_QDRANT_FIRST` defined in config
- [ ] Migration script tested on dev data
- [ ] Rollback tested (set flag to false, verify old pattern works)
- [ ] Monitoring alerts configured for migration failures

---

## Risk Mitigation

**Risks from WBS:**

**Risk:** Migration may corrupt existing context data if not thoroughly tested
**Mitigation:**
- Feature flag allows instant rollback
- Parallel testing validates equivalence between old and new patterns
- Dry-run mode available in migration script
- Keep Situation nodes until migration fully verified
- Comprehensive logging of all migration steps

**Risk:** Performance degradation if Qdrant queries are not optimized
**Mitigation:**
- Benchmark before/after migration with 1000+ situations
- Add Qdrant payload indexes on `tenant_id`, `user_id`, `relationship_type`
- Use Qdrant scroll API for large result sets (avoid loading all in memory)
- Monitor query latency with Prometheus metrics

**Additional Risks:**

**Risk:** Migration script runs out of memory with large datasets
**Mitigation:**
- Process situations in batches (100 at a time)
- Use async/await to avoid blocking
- Add progress checkpointing (resume from last processed ID)

**Risk:** Network failures during migration cause inconsistent state
**Mitigation:**
- Implement idempotent migration (can safely re-run)
- Use transaction-like approach: Qdrant → Neo4j → rollback on failure
- Log all operations for manual recovery if needed

---

## Related Resources

**WBS Package Details:** `/docs/prototypes/fidus-memory/migration-v3-wbs.md#package-11`
**Architecture Review:** `/docs/reviews/2025-11-21-fidus-memory-architecture-review.md`
**Solution Architecture:** `/docs/solution-architecture/14-situational-context.md`
**ADR-0001:** `/docs/adr/ADR-0001-qdrant-first-pattern.md`
**Existing Codebase:**
- `packages/api/fidus/memory/context/` (current v1.0 implementation)
- `packages/api/fidus/infrastructure/qdrant_client.py`
- `packages/api/fidus/infrastructure/neo4j_client.py`

---

## Questions to Resolve Before Starting

1. **Embedding Generation:** Should situation contexts have vector embeddings for similarity search? If yes, which embedding model?
2. **Collection Schema:** Should we create a new Qdrant collection "situations_v3" or reuse existing?
3. **Migration Timeline:** Is there a maintenance window for running the migration script, or should it run gradually in background?
4. **Situation Node Cleanup:** When should old Situation nodes be deleted from Neo4j? Immediately after migration or after verification period?
5. **Rollback Strategy:** If we need to rollback, should we keep dual-write (both v1.0 and v3.0) for a transition period?

---

## Success Criteria

This package is **successfully implemented** when:

1. ✅ A developer can store context via v3.0 pattern with feature flag ON
2. ✅ Context is retrievable from Qdrant by `situation_id`
3. ✅ Neo4j relationships have `situation_id` property (no `IN_SITUATION` edges)
4. ✅ 1-Hop queries work: `MATCH (u)-[r {situation_id: $sid}]->(e)`
5. ✅ Rollback logic tested: Neo4j failure triggers Qdrant cleanup
6. ✅ Admin can monitor migration progress via UI
7. ✅ Feature flag toggle works (instant switch between old/new pattern)
8. ✅ All tests pass (unit, integration, E2E)
9. ✅ Performance improved: 1-Hop queries faster than 2-Hop baseline
10. ✅ Documentation updated with v3.0 examples

---

**Prompt Version:** 1.0
**Generated:** 2025-11-21
**Target Package:** 1.1

---

**END OF IMPLEMENTATION PROMPT**

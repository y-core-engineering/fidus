# Implementation Prompt: 5.5 - Performance Optimization & Monitoring

**Package:** 5.5
**Epic:** Completion & Optimization
**Priority:** 🟢 LOW
**Context Document:** `/docs/prototypes/fidus-memory/migration-v3-wbs.md` (Lines 1243-1299)

---

## Role

You are a **Senior Full-Stack Software Engineer** and **Performance Engineer** specializing in:

**Backend Performance:**
- **Database Optimization:** Neo4j EXPLAIN PLAN analysis, composite indexes, query tuning
- **Caching Strategies:** Redis, cache invalidation patterns, TTL strategies
- **Query Optimization:** N+1 prevention, batch operations, pagination
- **Async Processing:** Background jobs, queue management, concurrency

**Monitoring & Observability:**
- **Metrics:** Prometheus client, custom metrics, histograms, counters
- **Logging:** Structured logging, correlation IDs, log aggregation
- **Tracing:** Request tracing, slow query detection
- **Dashboards:** Grafana, visualization, alerting rules

**Frontend Performance:**
- **React Optimization:** Memo, useMemo, useCallback, lazy loading
- **Loading States:** Skeleton screens, optimistic updates, progressive loading
- **Bundle Optimization:** Code splitting, tree shaking, lazy imports

---

## Context & Background

**Current State:**
- All 9 entities implemented (User, Person, Organization, Goal, Habit, Event, Object, Location)
- All 9 relationships implemented (KNOWS, WORKS_AT, PURSUES, MEMBER_OF, HAS_HABIT, ATTENDS, OWNS, FREQUENTS)
- Graph visualization operational (Package 3.5)
- LangGraph orchestration operational (Package 4.4)
- Entity deduplication service operational (Package 5.4)
- No systematic performance optimization
- No production monitoring

**Migration Goal:**
- Optimize Neo4j queries with EXPLAIN PLAN analysis
- Add Qdrant payload indexes
- Implement Redis caching for hot paths
- Add batch operations for bulk entity creation
- Export Prometheus metrics
- Create Grafana dashboard
- Add frontend loading states and optimizations
- Ensure system production-ready

**Architecture References:**
- Solution Architecture: `/docs/solution-architecture/03-component-architecture.md`
- Performance Guide: To be created in this package

---

## Your Task

Implement **Performance Optimization & Monitoring** according to specifications below.

**User Story:**
As a system operator, I want the system to be fast, scalable, and observable so I can ensure production readiness.

**Acceptance Criteria:**
1. Backend: Neo4j query optimization with EXPLAIN PLAN analysis
2. Backend: Qdrant payload indexes on frequently filtered fields
3. Backend: Redis caching for hot-path queries
4. Backend: Batch operations for bulk entity creation
5. API: Response time logging and metrics collection
6. Frontend: Loading states, skeleton screens, optimistic updates
7. Monitoring: Prometheus metrics exported at `/metrics` endpoint
8. Monitoring: Grafana dashboard for key metrics
9. Tests: Load tests with 1000+ entities verify p95 <500ms
10. Documentation: Performance tuning guide

---

## Technical Specification

### Backend Optimization

**Files to Create/Modify:**

1. **`packages/api/scripts/optimize_neo4j_indexes.py`** - Create missing indexes
2. **`packages/api/scripts/setup_qdrant_indexes.py`** - Create Qdrant payload indexes
3. **`packages/api/fidus/memory/services/batch_operations.py`** - Bulk entity creation
4. **`packages/api/fidus/infrastructure/cache.py`** - Redis caching decorator
5. **`packages/api/fidus/monitoring/metrics.py`** - Prometheus metrics
6. **`packages/api/fidus/middleware/timing.py`** - Response time middleware
7. **`packages/api/monitoring/grafana-dashboard.json`** - Grafana dashboard config

**Detailed Tasks:**

#### Task 1: Neo4j Query Optimization

**File:** `packages/api/scripts/optimize_neo4j_indexes.py`

```python
"""
Create optimized Neo4j indexes based on EXPLAIN PLAN analysis.

Run this script to create all performance-critical indexes.
"""
from neo4j import GraphDatabase
import os


def optimize_neo4j_indexes():
    neo4j_uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    neo4j_user = os.getenv("NEO4J_USER", "neo4j")
    neo4j_password = os.getenv("NEO4J_PASSWORD", "password")

    driver = GraphDatabase.driver(neo4j_uri, auth=(neo4j_user, neo4j_password))

    with driver.session() as session:
        indexes = [
            # User indexes
            ("user_id_unique", "FOR (u:User) REQUIRE u.id IS UNIQUE"),
            ("user_tenant_idx", "FOR (u:User) ON (u.tenant_id)"),
            ("user_email_idx", "FOR (u:User) ON (u.email)"),

            # Person indexes
            ("person_id_unique", "FOR (p:Person) REQUIRE p.id IS UNIQUE"),
            ("person_tenant_idx", "FOR (p:Person) ON (p.tenant_id)"),
            ("person_user_idx", "FOR (p:Person) ON (p.user_id)"),
            ("person_name_idx", "FOR (p:Person) ON (p.name)"),

            # Organization indexes
            ("org_id_unique", "FOR (o:Organization) REQUIRE o.id IS UNIQUE"),
            ("org_tenant_idx", "FOR (o:Organization) ON (o.tenant_id)"),
            ("org_name_idx", "FOR (o:Organization) ON (o.name)"),

            # Goal indexes
            ("goal_id_unique", "FOR (g:Goal) REQUIRE g.id IS UNIQUE"),
            ("goal_user_idx", "FOR (g:Goal) ON (g.user_id)"),

            # Habit indexes
            ("habit_id_unique", "FOR (h:Habit) REQUIRE h.id IS UNIQUE"),
            ("habit_user_idx", "FOR (h:Habit) ON (h.user_id)"),

            # Event indexes
            ("event_id_unique", "FOR (e:Event) REQUIRE e.id IS UNIQUE"),
            ("event_user_idx", "FOR (e:Event) ON (e.user_id)"),
            ("event_date_idx", "FOR (e:Event) ON (e.start_time)"),

            # Object indexes
            ("object_id_unique", "FOR (o:Object) REQUIRE o.id IS UNIQUE"),
            ("object_user_idx", "FOR (o:Object) ON (o.user_id)"),
            ("object_category_idx", "FOR (o:Object) ON (o.category)"),

            # Location indexes (includes geospatial)
            ("location_id_unique", "FOR (l:Location) REQUIRE l.id IS UNIQUE"),
            ("location_user_idx", "FOR (l:Location) ON (l.user_id)"),
            ("location_coordinates_idx", "FOR (l:Location) ON (l.coordinates)"),
            ("location_type_idx", "FOR (l:Location) ON (l.type)"),

            # Relationship composite indexes (for fast lookups)
            ("knows_user_person_idx", "FOR ()-[r:KNOWS]-() ON (r.user_id, r.person_id)"),
            ("works_at_user_org_idx", "FOR ()-[r:WORKS_AT]-() ON (r.user_id, r.organization_id)"),
            ("pursues_user_goal_idx", "FOR ()-[r:PURSUES]-() ON (r.user_id, r.goal_id)"),
            ("owns_user_object_idx", "FOR ()-[r:OWNS]-() ON (r.user_id, r.object_id)"),
            ("frequents_user_loc_idx", "FOR ()-[r:FREQUENTS]-() ON (r.user_id, r.location_id)"),

            # Situational context indexes
            ("rel_situation_id_idx", "FOR ()-[r]-() ON (r.situation_id)"),
        ]

        for name, definition in indexes:
            try:
                session.run(f"CREATE INDEX {name} IF NOT EXISTS {definition}")
                print(f"✓ Created index: {name}")
            except Exception as e:
                print(f"✗ Failed to create {name}: {e}")

    driver.close()
    print("\n✅ Neo4j index optimization complete")


if __name__ == "__main__":
    optimize_neo4j_indexes()
```

---

#### Task 2: Qdrant Payload Indexes

**File:** `packages/api/scripts/setup_qdrant_indexes.py`

```python
"""
Create Qdrant payload indexes for fast filtering.

Indexes improve query performance on frequently filtered fields.
"""
from qdrant_client import QdrantClient
from qdrant_client.models import PayloadSchemaType
import os


def setup_qdrant_indexes():
    qdrant_url = os.getenv("QDRANT_URL", "http://localhost:6333")
    client = QdrantClient(url=qdrant_url)

    collections = ["situations", "entity_embeddings"]

    for collection in collections:
        print(f"\nSetting up indexes for collection: {collection}")

        # Tenant ID index (keyword)
        client.create_payload_index(
            collection_name=collection,
            field_name="tenant_id",
            field_schema=PayloadSchemaType.KEYWORD
        )
        print("✓ Created index: tenant_id")

        # User ID index (keyword)
        client.create_payload_index(
            collection_name=collection,
            field_name="user_id",
            field_schema=PayloadSchemaType.KEYWORD
        )
        print("✓ Created index: user_id")

        if collection == "situations":
            # Relationship type index
            client.create_payload_index(
                collection_name=collection,
                field_name="relationship_type",
                field_schema=PayloadSchemaType.KEYWORD
            )
            print("✓ Created index: relationship_type")

            # Entity ID index
            client.create_payload_index(
                collection_name=collection,
                field_name="entity_id",
                field_schema=PayloadSchemaType.KEYWORD
            )
            print("✓ Created index: entity_id")

        elif collection == "entity_embeddings":
            # Entity type index
            client.create_payload_index(
                collection_name=collection,
                field_name="entity_type",
                field_schema=PayloadSchemaType.KEYWORD
            )
            print("✓ Created index: entity_type")

    print("\n✅ Qdrant payload indexes created successfully")


if __name__ == "__main__":
    setup_qdrant_indexes()
```

---

#### Task 3: Redis Caching Layer

**File:** `packages/api/fidus/infrastructure/cache.py`

```python
"""
Redis caching decorator for expensive operations.
"""
import redis.asyncio as redis
import json
from typing import Any, Optional, Callable
from functools import wraps
import hashlib
import os


class CacheService:
    """
    Async Redis cache with automatic serialization.
    """

    def __init__(self):
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        self.redis = redis.from_url(redis_url, decode_responses=True)

    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        value = await self.redis.get(key)
        if value:
            return json.loads(value)
        return None

    async def set(self, key: str, value: Any, ttl: int = 300):
        """Set value in cache with TTL (seconds)"""
        await self.redis.setex(key, ttl, json.dumps(value))

    async def delete(self, key: str):
        """Delete key from cache"""
        await self.redis.delete(key)

    async def delete_pattern(self, pattern: str):
        """Delete all keys matching pattern"""
        keys = await self.redis.keys(pattern)
        if keys:
            await self.redis.delete(*keys)

    def cache_result(self, key_prefix: str, ttl: int = 300):
        """
        Decorator to cache function results.

        Usage:
            @cache_service.cache_result("user_profile", ttl=600)
            async def get_user_profile(user_id: str):
                ...
        """
        def decorator(func: Callable):
            @wraps(func)
            async def wrapper(*args, **kwargs):
                # Generate cache key from function name and arguments
                key_parts = [key_prefix, func.__name__]
                key_parts.extend(str(arg) for arg in args)
                key_parts.extend(f"{k}={v}" for k, v in sorted(kwargs.items()))

                cache_key = hashlib.md5(":".join(key_parts).encode()).hexdigest()

                # Try to get from cache
                cached = await self.get(cache_key)
                if cached is not None:
                    return cached

                # Compute result
                result = await func(*args, **kwargs)

                # Store in cache
                await self.set(cache_key, result, ttl=ttl)

                return result

            return wrapper
        return decorator


# Global cache instance
cache_service = CacheService()


# Invalidation helpers
async def invalidate_user_cache(user_id: str):
    """Invalidate all cache entries for user"""
    await cache_service.delete_pattern(f"*user_id={user_id}*")


async def invalidate_entity_cache(entity_type: str, entity_id: str):
    """Invalidate cache for specific entity"""
    await cache_service.delete_pattern(f"*{entity_type}*{entity_id}*")
```

**Usage Example:**

```python
from fidus.infrastructure.cache import cache_service

class PersonRepository:
    @cache_service.cache_result("person", ttl=600)  # Cache for 10 minutes
    async def get(self, person_id: str, tenant_id: str):
        # Expensive query...
        pass

    async def update(self, person_id: str, tenant_id: str, data):
        # Update person...
        # Invalidate cache
        await cache_service.delete_pattern(f"*person*{person_id}*")
```

---

#### Task 4: Batch Operations

**File:** `packages/api/fidus/memory/services/batch_operations.py`

```python
"""
Batch operations for bulk entity creation.

Improves performance for importing large datasets.
"""
from typing import List, Dict, Any
from neo4j import AsyncDriver
from qdrant_client import QdrantClient
from fidus.memory.entities.person import Person, PersonCreate


class BatchOperations:
    """
    Service for batch entity creation with optimized queries.
    """

    def __init__(self, neo4j: AsyncDriver, qdrant: QdrantClient):
        self.neo4j = neo4j
        self.qdrant = qdrant

    async def bulk_create_persons(
        self,
        tenant_id: str,
        user_id: str,
        persons: List[PersonCreate]
    ) -> List[Person]:
        """
        Create multiple Person entities in a single transaction.

        Up to 10x faster than individual creates for large batches.
        """
        person_entities = [
            Person(
                tenant_id=tenant_id,
                user_id=user_id,
                name=p.name,
                ai_properties=p.ai_properties
            )
            for p in persons
        ]

        # Batch insert into Neo4j
        query = """
        UNWIND $persons AS person
        CREATE (p:Person {
            id: person.id,
            tenant_id: person.tenant_id,
            user_id: person.user_id,
            name: person.name,
            ai_properties: person.ai_properties,
            created_at: datetime(),
            updated_at: datetime()
        })
        """

        person_dicts = [
            {
                "id": p.id,
                "tenant_id": p.tenant_id,
                "user_id": p.user_id,
                "name": p.name,
                "ai_properties": p.ai_properties
            }
            for p in person_entities
        ]

        async with self.neo4j.session() as session:
            await session.run(query, persons=person_dicts)

        # TODO: Batch index in Qdrant for deduplication
        # For now, individual indexing (optimize in future)

        return person_entities

    async def bulk_create_relationships(
        self,
        relationship_type: str,
        relationships: List[Dict[str, Any]]
    ) -> int:
        """
        Create multiple relationships in a single transaction.

        Args:
            relationship_type: e.g., "KNOWS", "WORKS_AT"
            relationships: List of dicts with source_id, target_id, properties

        Returns:
            Number of relationships created
        """
        query = f"""
        UNWIND $rels AS rel
        MATCH (source {{id: rel.source_id, tenant_id: rel.tenant_id}})
        MATCH (target {{id: rel.target_id, tenant_id: rel.tenant_id}})
        CREATE (source)-[r:{relationship_type}]->(target)
        SET r = rel.properties
        RETURN count(r) as created
        """

        async with self.neo4j.session() as session:
            result = await session.run(query, rels=relationships)
            record = await result.single()
            return record["created"] if record else 0
```

---

#### Task 5: Prometheus Metrics

**File:** `packages/api/fidus/monitoring/metrics.py`

```python
"""
Prometheus metrics for observability.
"""
from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST
from fastapi import Response


# Entity metrics
entity_created_total = Counter(
    "entity_created_total",
    "Total number of entities created",
    ["entity_type", "tenant_id"]
)

entity_updated_total = Counter(
    "entity_updated_total",
    "Total number of entities updated",
    ["entity_type", "tenant_id"]
)

entity_deleted_total = Counter(
    "entity_deleted_total",
    "Total number of entities deleted",
    ["entity_type", "tenant_id"]
)

# Relationship metrics
relationship_created_total = Counter(
    "relationship_created_total",
    "Total number of relationships created",
    ["relationship_type", "tenant_id"]
)

# Query performance metrics
query_duration_seconds = Histogram(
    "query_duration_seconds",
    "Query duration in seconds",
    ["query_type", "database"],
    buckets=[0.01, 0.05, 0.1, 0.5, 1.0, 2.0, 5.0]
)

api_request_duration_seconds = Histogram(
    "api_request_duration_seconds",
    "API request duration in seconds",
    ["method", "endpoint", "status"],
    buckets=[0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0]
)

# Cache metrics
cache_hit_total = Counter(
    "cache_hit_total",
    "Total cache hits"
)

cache_miss_total = Counter(
    "cache_miss_total",
    "Total cache misses"
)

cache_hit_rate = Gauge(
    "cache_hit_rate",
    "Cache hit rate (0-1)"
)

# LLM metrics
llm_request_total = Counter(
    "llm_request_total",
    "Total LLM requests",
    ["model", "operation"]
)

llm_request_duration_seconds = Histogram(
    "llm_request_duration_seconds",
    "LLM request duration in seconds",
    ["model"],
    buckets=[0.5, 1.0, 2.0, 5.0, 10.0, 30.0]
)

# Error metrics
error_total = Counter(
    "error_total",
    "Total errors",
    ["error_type", "component"]
)


def metrics_endpoint():
    """FastAPI endpoint for Prometheus to scrape"""
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)
```

---

#### Task 6: Response Time Middleware

**File:** `packages/api/fidus/middleware/timing.py`

```python
"""
Middleware to track API response times.
"""
from fastapi import Request
from time import time
from fidus.monitoring.metrics import api_request_duration_seconds
import logging

logger = logging.getLogger(__name__)


async def timing_middleware(request: Request, call_next):
    """
    Track response time for all API requests.

    Logs slow queries (>1s) and emits Prometheus metrics.
    """
    start_time = time()

    response = await call_next(request)

    duration = time() - start_time

    # Emit metrics
    api_request_duration_seconds.labels(
        method=request.method,
        endpoint=request.url.path,
        status=response.status_code
    ).observe(duration)

    # Log slow requests
    if duration > 1.0:
        logger.warning(
            f"Slow request: {request.method} {request.url.path} "
            f"took {duration:.2f}s (status={response.status_code})"
        )

    # Add timing header
    response.headers["X-Response-Time"] = f"{duration:.3f}s"

    return response
```

---

### Frontend Optimization

**File:** `packages/web/src/components/memory/PersonListOptimized.tsx`

```typescript
'use client';

import { memo, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Skeleton } from '@fidus/ui';
import { getPersons } from '@/lib/api/memory';
import { Person } from '@/types/memory';

// Memoized person card component
const PersonCard = memo(({ person }: { person: Person }) => {
  return (
    <div className="p-4 border rounded-lg hover:shadow-lg transition">
      <h3 className="font-bold">{person.name}</h3>
      {person.profession && (
        <p className="text-sm text-gray-600">{person.profession}</p>
      )}
    </div>
  );
});

PersonCard.displayName = 'PersonCard';

// Loading skeleton
function PersonListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-24 rounded-lg" />
      ))}
    </div>
  );
}

export function PersonListOptimized() {
  const { data: persons = [], isLoading } = useQuery({
    queryKey: ['persons'],
    queryFn: getPersons,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Memoize expensive computations
  const sortedPersons = useMemo(() => {
    return [...persons].sort((a, b) => a.name.localeCompare(b.name));
  }, [persons]);

  if (isLoading) {
    return <PersonListSkeleton />;
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">People</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedPersons.map(person => (
          <PersonCard key={person.id} person={person} />
        ))}
      </div>
    </Card>
  );
}
```

---

### Monitoring Dashboard

**File:** `packages/api/monitoring/grafana-dashboard.json`

```json
{
  "dashboard": {
    "title": "Fidus Memory System Metrics",
    "panels": [
      {
        "title": "API Request Rate",
        "targets": [
          {
            "expr": "rate(api_request_duration_seconds_count[5m])"
          }
        ]
      },
      {
        "title": "API Response Time (p95)",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(api_request_duration_seconds_bucket[5m]))"
          }
        ]
      },
      {
        "title": "Cache Hit Rate",
        "targets": [
          {
            "expr": "rate(cache_hit_total[5m]) / (rate(cache_hit_total[5m]) + rate(cache_miss_total[5m]))"
          }
        ]
      },
      {
        "title": "Entity Creation Rate",
        "targets": [
          {
            "expr": "sum(rate(entity_created_total[5m])) by (entity_type)"
          }
        ]
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "sum(rate(error_total[5m])) by (error_type)"
          }
        ]
      },
      {
        "title": "LLM Request Duration",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(llm_request_duration_seconds_bucket[5m]))"
          }
        ]
      }
    ]
  }
}
```

---

### Testing Requirements

**Load Test:**

**File:** `packages/api/tests/load/test_performance.py`

```python
from locust import HttpUser, task, between


class MemorySystemUser(HttpUser):
    wait_time = between(1, 3)

    def on_start(self):
        """Login before load test"""
        response = self.client.post("/api/auth/login", json={
            "email": "test@example.com",
            "password": "password123"
        })
        self.token = response.json()["token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}

    @task(3)
    def list_persons(self):
        """List persons (hot path)"""
        self.client.get("/api/memory/entities/person", headers=self.headers)

    @task(2)
    def get_person(self):
        """Get specific person"""
        self.client.get("/api/memory/entities/person/person_1", headers=self.headers)

    @task(1)
    def create_person(self):
        """Create person"""
        self.client.post(
            "/api/memory/entities/person",
            json={"name": "Test Person"},
            headers=self.headers
        )

    @task(1)
    def query_graph(self):
        """Query graph"""
        self.client.get("/api/memory/graph?depth=2", headers=self.headers)
```

**Run load test:**
```bash
locust -f packages/api/tests/load/test_performance.py --host=http://localhost:8000
```

---

## Implementation Guidelines

### Must Follow

1. **Indexes First:**
   - Run EXPLAIN PLAN on all queries
   - Create indexes before load testing
   - Composite indexes for multi-field queries

2. **Caching Strategy:**
   - Cache hot paths (user profile, person list)
   - TTL: 5-10 minutes for entity lists
   - Invalidate on updates

3. **Frontend Performance:**
   - Skeleton screens for all loading states
   - Memo expensive components
   - Lazy load large components

4. **Monitoring:**
   - Export metrics at `/metrics`
   - Log slow queries (>1s)
   - Alert on p95 >2s

---

## Verification Checklist

### Performance
- [ ] Neo4j indexes created (20+ indexes)
- [ ] Qdrant payload indexes created
- [ ] Redis caching operational
- [ ] API p95 response time <500ms (load test)
- [ ] Graph rendering <2s (200 nodes)
- [ ] Cache hit rate >70%

### Monitoring
- [ ] Prometheus metrics exported
- [ ] Grafana dashboard imported
- [ ] Slow query logging works
- [ ] Alerts configured

### Frontend
- [ ] All list views have skeletons
- [ ] Expensive components memoized
- [ ] No unnecessary re-renders

---

## Success Criteria

1. API p95 response time <500ms under load
2. Graph renders 200 nodes in <2s
3. Cache hit rate >70%
4. Prometheus metrics exported at `/metrics`
5. Grafana dashboard shows key metrics
6. Load test passes (1000 concurrent users)
7. All tests pass

---

**Prompt Version:** 1.0
**Generated:** 2025-11-21
**Target Package:** 5.5 - Performance Optimization & Monitoring

---

**END OF IMPLEMENTATION PROMPT**

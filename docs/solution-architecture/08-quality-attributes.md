# Quality Attributes

**Version:** 1.0
**Date:** 2025-10-27
**Status:** Draft (Awaiting Human Review)
**Part of:** Fidus Solution Architecture
**Author:** AI-Generated

---

## Table of Contents

1. [Overview](#overview)
2. [Quality Attribute Framework](#quality-attribute-framework)
3. [Performance](#performance)
4. [Scalability](#scalability)
5. [Availability & Reliability](#availability--reliability)
6. [Maintainability](#maintainability)
7. [Testability](#testability)
8. [Usability](#usability)
9. [Observability](#observability)
10. [Portability](#portability)
11. [Interoperability](#interoperability)
12. [Localization & Internationalization](#localization--internationalization)
13. [Quality Attribute Tradeoffs](#quality-attribute-tradeoffs)
14. [Quality Metrics Dashboard](#quality-metrics-dashboard)

---

## Overview

This document defines all **Non-Functional Requirements (NFRs)** for the Fidus system, detailing specific, measurable quality attributes and the strategies to achieve them.

### Quality Attribute Priorities

```mermaid
graph TD
    QA[Quality Attributes]

    QA --> Critical[Critical Priority]
    QA --> High[High Priority]
    QA --> Medium[Medium Priority]

    Critical --> Security[Security<br/>Privacy First]
    Critical --> Privacy[Privacy<br/>Data Protection]
    Critical --> Correctness[Correctness<br/>Data Integrity]

    High --> Performance[Performance<br/>Response Time]
    High --> Availability[Availability<br/>Uptime]
    High --> Maintainability[Maintainability<br/>Code Quality]

    Medium --> Scalability[Scalability<br/>Load Handling]
    Medium --> Usability[Usability<br/>User Experience]
    Medium --> Observability[Observability<br/>Monitoring]

    style Critical fill:#f94144
    style High fill:#f9c74f
    style Medium fill:#90be6d
```

### Quality Attribute Categories

| Category | Attributes | Stakeholder |
|----------|-----------|-------------|
| **Runtime** | Performance, Scalability, Availability, Security | Users, Operators |
| **Design-Time** | Maintainability, Testability, Portability | Developers, DevOps |
| **User-Facing** | Usability, Accessibility, Internationalization | End Users |
| **Operational** | Observability, Deployability, Recoverability | Operations Team |

---

## Quality Attribute Framework

### Attribute Definition Template

Each quality attribute is defined using this structure:

```mermaid
flowchart LR
    Definition[Definition] --> Metric[Measurable Metric]
    Metric --> Target[Target Value]
    Target --> Strategy[Implementation Strategy]
    Strategy --> Validation[Validation Method]

    style Definition fill:#4ecdc4
    style Metric fill:#f9c74f
    style Target fill:#90be6d
    style Strategy fill:#95e1d3
    style Validation fill:#ffe66d
```

**Example: Response Time**

- **Definition:** Time from user request to response displayed
- **Metric:** P95 latency (milliseconds)
- **Target:** <2000ms for 95% of requests
- **Strategy:** Caching, database indexing, async processing
- **Validation:** Load testing, APM monitoring

---

## Performance

### Definition

**Performance** is the responsiveness of the system, measured by latency and throughput.

### Performance Requirements

```mermaid
graph LR
    User[User Request] -->|Target: < 2s| Response[Response Delivered]

    subgraph "Latency Budget"
        Network[Network: 50ms]
        Gateway[API Gateway: 50ms]
        Auth[Authentication: 100ms]
        Agent[Agent Processing: 500ms]
        LLM[LLM Inference: 1000ms]
        DB[Database Query: 200ms]
        Render[UI Render: 100ms]
    end

    User --> Network
    Network --> Gateway
    Gateway --> Auth
    Auth --> Agent
    Agent --> LLM
    Agent --> DB
    LLM --> Render
    DB --> Render
    Render --> Response

    style User fill:#4ecdc4
    style Response fill:#90be6d
```

### Latency Targets

| Operation Type | P50 | P95 | P99 | Strategy |
|----------------|-----|-----|-----|----------|
| **Simple Query** (appointments list) | 300ms | 500ms | 800ms | Redis cache, indexed queries |
| **Create Operation** (new appointment) | 400ms | 700ms | 1000ms | Async event processing |
| **LLM Query (Local)** | 800ms | 1500ms | 2500ms | Model optimization (quantization) |
| **LLM Query (Cloud)** | 500ms | 1000ms | 1500ms | OpenAI API (optimized prompts) |
| **Complex Multi-Agent** | 1500ms | 3000ms | 5000ms | Parallel execution, streaming |
| **Data Export** | 2000ms | 5000ms | 10000ms | Background job with progress |

### Throughput Targets

| Tier | Users | Requests/Second | Strategy |
|------|-------|-----------------|----------|
| **MVP** | 100 | 10 req/s | Single server |
| **Startup** | 1,000 | 100 req/s | Horizontal scaling (3 servers) |
| **Growth** | 10,000 | 1,000 req/s | Load balancing, CDN |
| **Enterprise** | 100,000+ | 10,000 req/s | Kubernetes, auto-scaling |

### Performance Optimization Strategies

#### 1. Caching Strategy

```mermaid
flowchart TD
    Request[User Request] --> Cache{Check Cache}

    Cache -->|Hit| Return[Return Cached Data<br/>~10ms]
    Cache -->|Miss| DB[Query Database<br/>~200ms]

    DB --> Store[Store in Cache<br/>TTL: 5min]
    Store --> Return

    style Return fill:#90be6d
    style Cache fill:#f9c74f
```

**Cache Layers:**

| Layer | Technology | TTL | Use Case |
|-------|-----------|-----|----------|
| **Browser Cache** | HTTP Cache-Control | 1 hour | Static assets (CSS, JS, images) |
| **CDN Cache** | CloudFlare | 1 hour | Static assets, API responses (public) |
| **Application Cache** | Redis | 5 minutes | User profiles, budgets, appointments |
| **Query Cache** | PostgreSQL | N/A | Frequently used queries |
| **LLM Cache** | Redis | 1 hour | Identical prompts (deduplication) |

**Implementation:**

```python
from functools import wraps
import hashlib
import json


def cached(ttl: int = 300):
    """Cache function result in Redis."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key from function name + arguments
            key_parts = [func.__name__] + [str(arg) for arg in args]
            cache_key = f"cache:{hashlib.md5(':'.join(key_parts).encode()).hexdigest()}"

            # Check cache
            cached_value = await redis.get(cache_key)
            if cached_value:
                return json.loads(cached_value)

            # Cache miss - execute function
            result = await func(*args, **kwargs)

            # Store in cache
            await redis.setex(cache_key, ttl, json.dumps(result))

            return result
        return wrapper
    return decorator


# Usage
@cached(ttl=300)  # 5 minutes
async def get_user_appointments(user_id: str, date: str):
    """Get appointments (cached)."""
    return await db.query("SELECT * FROM appointments WHERE user_id = ? AND date = ?", (user_id, date))
```

#### 2. Database Optimization

**Indexing Strategy:**

```sql
-- User queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_tenant ON users(tenant_id);

-- Appointment queries
CREATE INDEX idx_appointments_user_date ON appointments(user_id, start_time);
CREATE INDEX idx_appointments_tenant_time ON appointments(tenant_id, start_time, end_time);
CREATE INDEX idx_appointments_fulltext ON appointments USING gin(to_tsvector('english', title || ' ' || description));

-- Transaction queries
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_category ON transactions(tenant_id, category, date DESC);

-- Event sourcing
CREATE INDEX idx_events_aggregate ON events(aggregate_id, version);
CREATE INDEX idx_events_tenant_time ON events(tenant_id, created_at DESC);
```

**Query Optimization:**

```python
# ❌ BAD: N+1 query problem
appointments = await db.query("SELECT * FROM appointments WHERE user_id = ?", (user_id,))
for apt in appointments:
    # This runs a query for EACH appointment!
    participants = await db.query("SELECT * FROM participants WHERE appointment_id = ?", (apt.id,))

# ✅ GOOD: Join query (1 query instead of N+1)
appointments = await db.query("""
    SELECT
        a.*,
        json_agg(p.*) as participants
    FROM appointments a
    LEFT JOIN participants p ON p.appointment_id = a.id
    WHERE a.user_id = ?
    GROUP BY a.id
""", (user_id,))
```

**Connection Pooling:**

```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.pool import QueuePool


# Database connection pool
engine = create_async_engine(
    "postgresql+asyncpg://fidus:password@localhost:5432/fidus",
    poolclass=QueuePool,
    pool_size=20,           # 20 connections in pool
    max_overflow=10,        # Allow 10 additional connections
    pool_pre_ping=True,     # Verify connection before using
    pool_recycle=3600,      # Recycle connections after 1 hour
    echo=False
)
```

#### 3. Async Processing

```mermaid
sequenceDiagram
    participant User
    participant API
    participant Agent
    participant Event Bus
    participant Worker

    User->>API: POST /trip/book
    API->>Agent: Initiate booking

    Agent->>Event Bus: Publish TripBookingStarted
    Agent-->>API: HTTP 202 Accepted<br/>{job_id: "123"}
    API-->>User: "Booking in progress..."

    Event Bus->>Worker: Deliver event
    Worker->>Worker: Book flight (30s)
    Worker->>Worker: Book hotel (20s)

    Worker->>Event Bus: Publish TripBookingCompleted
    Event Bus->>User: WebSocket notification<br/>"Trip booked!"
```

**Long-Running Operations:**

| Operation | Sync/Async | Reason |
|-----------|-----------|--------|
| **Create Appointment** | Sync | Fast (<500ms) |
| **Book Flight** | Async | External API, slow (30s) |
| **Export Data** | Async | Large dataset (1M records) |
| **Generate Report** | Async | Compute-intensive |
| **Send Email** | Async | External service, non-critical |

**Implementation:**

```python
from celery import Celery

celery_app = Celery('fidus', broker='redis://localhost:6379')


@celery_app.task
def export_user_data(user_id: str):
    """Export user data (async task)."""
    # Long-running operation
    data = collect_all_user_data(user_id)
    zip_file = create_zip_archive(data)
    upload_to_storage(zip_file)
    send_email_with_link(user_id, zip_file.url)


# API endpoint
@app.post("/export")
async def request_export(user: FidusJWT = Depends(verify_jwt)):
    """Request data export (returns immediately)."""
    task = export_user_data.delay(user.user_id)
    return {"job_id": task.id, "status": "pending"}
```

#### 4. LLM Optimization

**Prompt Caching:**

```python
import hashlib


class LLMService:
    async def complete_with_cache(
        self,
        prompt: str,
        temperature: float = 0.7
    ) -> str:
        """Complete with prompt caching."""

        # Generate cache key from prompt
        cache_key = f"llm_cache:{hashlib.sha256(prompt.encode()).hexdigest()}"

        # Check cache (1 hour TTL)
        cached_response = await redis.get(cache_key)
        if cached_response:
            return cached_response

        # Cache miss - call LLM
        response = await self.llm.complete(prompt, temperature=temperature)

        # Store in cache
        await redis.setex(cache_key, 3600, response)

        return response
```

**Prompt Optimization:**

```python
# ❌ BAD: Verbose prompt (more tokens = slower + more expensive)
prompt = """
You are a helpful AI assistant for a personal productivity application called Fidus.
The user has asked you to help them schedule an appointment.
Please analyze the following user message and extract the relevant details
such as the title of the appointment, the date and time, the duration,
and any participants who should be invited.

User message: "Schedule a meeting with Sarah tomorrow at 2pm"

Please provide your response in JSON format with the following structure:
{
    "title": "...",
    "date": "...",
    "time": "...",
    "participants": [...]
}
"""

# ✅ GOOD: Concise prompt (fewer tokens = faster + cheaper)
prompt = """Extract appointment details (JSON):
User: "Schedule a meeting with Sarah tomorrow at 2pm"
Format: {"title": "", "date": "", "time": "", "participants": []}
"""
```

**Model Selection:**

| Task | Model | Speed | Quality | Cost |
|------|-------|-------|---------|------|
| **Intent Detection** | Llama 3.1 8B | ⚡⚡⚡ | ⭐⭐⭐ | Free |
| **Data Extraction** | Llama 3.1 8B | ⚡⚡⚡ | ⭐⭐⭐ | Free |
| **Complex Reasoning** | Llama 3.1 70B or GPT-4 | ⚡ | ⭐⭐⭐⭐⭐ | $$$ |
| **Response Generation** | Llama 3.1 8B | ⚡⚡⚡ | ⭐⭐⭐ | Free |

**Streaming Responses:**

```python
async def stream_llm_response(prompt: str):
    """Stream LLM response (SSE)."""
    async for chunk in llm.stream(prompt):
        yield f"data: {json.dumps({'text': chunk})}\n\n"


@app.get("/chat/stream")
async def chat_stream(message: str):
    """Stream chat response."""
    return StreamingResponse(
        stream_llm_response(message),
        media_type="text/event-stream"
    )
```

---

## Scalability

### Definition

**Scalability** is the system's ability to handle increasing load by adding resources.

### Scalability Architecture

```mermaid
flowchart TD
    Users[Users] --> LB[Load Balancer<br/>Nginx/Traefik]

    LB --> API1[API Server 1]
    LB --> API2[API Server 2]
    LB --> API3[API Server 3]

    API1 --> Cache[(Redis Cache<br/>Master)]
    API2 --> Cache
    API3 --> Cache

    Cache --> CacheReplica[(Redis Replica)]

    API1 --> DB[(PostgreSQL<br/>Primary)]
    API2 --> DB
    API3 --> DB

    DB --> DBReplica[(PostgreSQL<br/>Read Replica)]

    API1 --> Queue[Event Bus<br/>BullMQ]
    API2 --> Queue
    API3 --> Queue

    Queue --> Worker1[Worker 1]
    Queue --> Worker2[Worker 2]
    Queue --> Worker3[Worker 3]

    style LB fill:#f9c74f
    style Cache fill:#4ecdc4
    style DB fill:#90be6d
    style Queue fill:#ff6b6b
```

### Horizontal Scaling Strategy

| Component | Scaling Method | Max Instances | Bottleneck |
|-----------|---------------|---------------|------------|
| **API Servers** | Horizontal (stateless) | Unlimited | Load balancer capacity |
| **Agent Workers** | Horizontal (stateless) | Unlimited | Event bus throughput |
| **PostgreSQL** | Vertical + read replicas | 1 primary + N replicas | Write throughput |
| **Redis** | Vertical + replication | 1 master + N replicas | Memory |
| **LLM (Ollama)** | Horizontal (GPU-bound) | N (GPU count) | GPU availability |

### Load Testing Targets

```mermaid
graph TD
    Load[Load Testing]

    Load --> Light[Light Load<br/>100 users<br/>10 req/s]
    Load --> Normal[Normal Load<br/>1000 users<br/>100 req/s]
    Load --> Peak[Peak Load<br/>5000 users<br/>500 req/s]
    Load --> Stress[Stress Test<br/>10000 users<br/>1000 req/s]

    Light --> Pass1[✅ <500ms P95]
    Normal --> Pass2[✅ <1000ms P95]
    Peak --> Pass3[✅ <2000ms P95]
    Stress --> Pass4[✅ <5000ms P95<br/>No errors]

    style Light fill:#90be6d
    style Normal fill:#f9c74f
    style Peak fill:#ff6b6b
    style Stress fill:#f94144
```

**Load Testing Tool: k6**

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up to 100 users
    { duration: '5m', target: 100 },   // Stay at 100 users
    { duration: '2m', target: 500 },   // Ramp up to 500 users
    { duration: '5m', target: 500 },   // Stay at 500 users
    { duration: '2m', target: 0 },     // Ramp down to 0 users
  ],
  thresholds: {
    'http_req_duration': ['p(95)<2000'],  // 95% of requests < 2s
    'http_req_failed': ['rate<0.01'],     // Error rate < 1%
  },
};

export default function() {
  const token = 'Bearer ...';

  // Test GET /appointments
  let res = http.get('https://api.fidus.ai/appointments', {
    headers: { 'Authorization': token },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 2s': (r) => r.timings.duration < 2000,
  });

  sleep(1);
}
```

### Auto-Scaling Configuration

**Kubernetes Horizontal Pod Autoscaler:**

```yaml
# kubernetes/api-hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: fidus-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: fidus-api
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300  # Wait 5 min before scaling down
    scaleUp:
      stabilizationWindowSeconds: 60   # Wait 1 min before scaling up
```

---

## Availability & Reliability

### Definition

**Availability** is the percentage of time the system is operational and accessible.

### Availability Targets

| Tier | Uptime Target | Downtime/Year | Downtime/Month | Strategy |
|------|---------------|---------------|----------------|----------|
| **Community Edition** | 95% | 18.25 days | 36 hours | Single server, daily backups |
| **Starter** | 99% | 3.65 days | 7.2 hours | Active-passive failover |
| **Pro** | 99.9% | 8.76 hours | 43 minutes | Active-active, auto-failover |
| **Enterprise** | 99.99% | 52.6 minutes | 4.32 minutes | Multi-region, zero-downtime deployment |

### High Availability Architecture

```mermaid
flowchart TD
    subgraph "Region 1 (Primary)"
        LB1[Load Balancer]
        API1a[API Server 1a]
        API1b[API Server 1b]
        DB1[PostgreSQL Primary]
        Redis1[Redis Master]
    end

    subgraph "Region 2 (Standby)"
        LB2[Load Balancer]
        API2a[API Server 2a]
        API2b[API Server 2b]
        DB2[PostgreSQL Replica<br/>Streaming Replication]
        Redis2[Redis Replica]
    end

    Users[Users] --> DNS[DNS Failover<br/>Route53/CloudFlare]

    DNS -->|Primary| LB1
    DNS -.->|Failover| LB2

    LB1 --> API1a
    LB1 --> API1b

    API1a --> DB1
    API1b --> DB1
    API1a --> Redis1
    API1b --> Redis1

    DB1 -.->|Async Replication| DB2
    Redis1 -.->|Replication| Redis2

    style DNS fill:#f9c74f
    style DB1 fill:#90be6d
    style DB2 fill:#4ecdc4
```

### Reliability Patterns

#### 1. Circuit Breaker

```python
from circuitbreaker import circuit


@circuit(failure_threshold=5, recovery_timeout=60, expected_exception=Exception)
async def call_external_api(url: str):
    """Call external API with circuit breaker."""
    response = await httpx.get(url, timeout=5.0)
    response.raise_for_status()
    return response.json()


# Usage
try:
    data = await call_external_api("https://external-api.com/data")
except CircuitBreakerError:
    # Circuit is open (too many failures)
    # Return cached data or default value
    data = get_cached_data()
```

**Circuit Breaker States:**

```mermaid
stateDiagram-v2
    [*] --> Closed: Initial State

    Closed --> Open: Failure Threshold<br/>Exceeded (5 failures)
    Open --> HalfOpen: Recovery Timeout<br/>(60 seconds)
    HalfOpen --> Closed: Test Request<br/>Succeeds
    HalfOpen --> Open: Test Request<br/>Fails

    note right of Closed
        Normal operation
        Requests pass through
    end note

    note right of Open
        Fast fail
        Don't call service
        Return error/cached data
    end note

    note right of HalfOpen
        Test if service recovered
        Allow one request through
    end note
```

#### 2. Retry with Exponential Backoff

```python
import asyncio
from tenacity import retry, stop_after_attempt, wait_exponential


@retry(
    stop=stop_after_attempt(5),
    wait=wait_exponential(multiplier=1, min=1, max=30),
    reraise=True
)
async def call_with_retry(url: str):
    """Call with automatic retry (exponential backoff)."""
    response = await httpx.get(url, timeout=5.0)
    response.raise_for_status()
    return response.json()


# Retry timeline:
# Attempt 1: Immediate
# Attempt 2: Wait 1s
# Attempt 3: Wait 2s
# Attempt 4: Wait 4s
# Attempt 5: Wait 8s
# Give up after 5 attempts
```

#### 3. Graceful Degradation

```python
async def get_appointments(user_id: str):
    """Get appointments with graceful degradation."""

    try:
        # Try primary data source
        return await db.query_appointments(user_id)
    except DatabaseError:
        try:
            # Fallback to cache
            cached = await redis.get(f"appointments:{user_id}")
            if cached:
                return json.loads(cached)
        except RedisError:
            pass

        # Fallback to empty list with error message
        return {
            "appointments": [],
            "error": "Could not load appointments. Please try again later.",
            "degraded": True
        }
```

### Health Checks

```python
from fastapi import FastAPI, status
from fastapi.responses import JSONResponse


@app.get("/health")
async def health_check():
    """Basic health check (liveness probe)."""
    return {"status": "ok"}


@app.get("/health/ready")
async def readiness_check():
    """Readiness check (check dependencies)."""
    health = {
        "status": "ok",
        "checks": {}
    }

    # Check database
    try:
        await db.execute("SELECT 1")
        health["checks"]["database"] = "ok"
    except Exception as e:
        health["checks"]["database"] = f"error: {str(e)}"
        health["status"] = "degraded"

    # Check Redis
    try:
        await redis.ping()
        health["checks"]["redis"] = "ok"
    except Exception as e:
        health["checks"]["redis"] = f"error: {str(e)}"
        health["status"] = "degraded"

    # Check LLM
    try:
        await llm.complete("test", max_tokens=1)
        health["checks"]["llm"] = "ok"
    except Exception as e:
        health["checks"]["llm"] = f"error: {str(e)}"
        health["status"] = "degraded"

    if health["status"] == "degraded":
        return JSONResponse(health, status_code=status.HTTP_503_SERVICE_UNAVAILABLE)

    return health
```

**Kubernetes Health Probes:**

```yaml
# kubernetes/api-deployment.yaml
spec:
  containers:
  - name: api
    image: fidus/api:latest
    ports:
    - containerPort: 8000
    livenessProbe:
      httpGet:
        path: /health
        port: 8000
      initialDelaySeconds: 10
      periodSeconds: 10
      failureThreshold: 3
    readinessProbe:
      httpGet:
        path: /health/ready
        port: 8000
      initialDelaySeconds: 5
      periodSeconds: 5
      failureThreshold: 3
```

---

## Maintainability

### Definition

**Maintainability** is the ease with which the system can be modified, fixed, and enhanced.

### Maintainability Metrics

| Metric | Target | Current | Tool |
|--------|--------|---------|------|
| **Code Coverage** | >80% | TBD | pytest-cov, Vitest |
| **Cyclomatic Complexity** | <10 per function | TBD | Radon, ESLint |
| **Technical Debt Ratio** | <5% | TBD | SonarQube |
| **Code Duplication** | <3% | TBD | SonarQube |
| **Documentation Coverage** | 100% (public APIs) | TBD | Manual review |

### Code Quality Standards

#### 1. Coding Conventions

**Python (PEP 8 + Type Hints):**

```python
# ✅ GOOD: Type hints, docstring, clear naming
async def create_appointment(
    user_id: str,
    tenant_id: str,
    data: AppointmentCreate
) -> Appointment:
    """Create a new appointment.

    Args:
        user_id: ID of the user creating the appointment
        tenant_id: Tenant ID for isolation
        data: Appointment data (validated)

    Returns:
        Created appointment

    Raises:
        ConflictError: If appointment conflicts with existing appointment
    """
    # Check for conflicts
    conflicts = await repository.find_conflicts(
        tenant_id=tenant_id,
        start=data.start,
        end=data.end
    )

    if conflicts:
        raise ConflictError(f"Appointment conflicts with {len(conflicts)} existing appointments")

    # Create appointment
    appointment = Appointment(
        id=str(uuid.uuid4()),
        tenant_id=tenant_id,
        owner_id=user_id,
        **data.dict()
    )

    await repository.save(appointment)

    return appointment
```

**TypeScript (Strict Mode):**

```typescript
// ✅ GOOD: Strict types, JSDoc, clear naming
/**
 * Create a new appointment
 * @param data - Validated appointment data
 * @returns Created appointment
 * @throws ConflictError if appointment conflicts with existing appointment
 */
export async function createAppointment(
  data: AppointmentCreate
): Promise<Appointment> {
  // Validate data
  const validated = appointmentSchema.parse(data);

  // Check for conflicts
  const conflicts = await findConflictingAppointments(
    validated.start,
    validated.end
  );

  if (conflicts.length > 0) {
    throw new ConflictError(
      `Appointment conflicts with ${conflicts.length} existing appointments`
    );
  }

  // Create appointment
  const appointment: Appointment = {
    id: crypto.randomUUID(),
    ...validated,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.appointments.create(appointment);

  return appointment;
}
```

#### 2. Architecture Patterns

**Repository Pattern:**

```python
# domain/repositories/appointment_repository.py
from abc import ABC, abstractmethod
from typing import List, Optional


class AppointmentRepository(ABC):
    """Abstract repository for appointments."""

    @abstractmethod
    async def find_by_id(self, appointment_id: str, tenant_id: str) -> Optional[Appointment]:
        """Find appointment by ID."""
        pass

    @abstractmethod
    async def find_conflicts(
        self,
        tenant_id: str,
        start: datetime,
        end: datetime
    ) -> List[Appointment]:
        """Find conflicting appointments."""
        pass

    @abstractmethod
    async def save(self, appointment: Appointment) -> None:
        """Save appointment."""
        pass


# infrastructure/repositories/postgres_appointment_repository.py
class PostgresAppointmentRepository(AppointmentRepository):
    """PostgreSQL implementation of AppointmentRepository."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def find_by_id(self, appointment_id: str, tenant_id: str) -> Optional[Appointment]:
        query = select(AppointmentModel).where(
            AppointmentModel.id == appointment_id,
            AppointmentModel.tenant_id == tenant_id
        )
        result = await self.session.execute(query)
        model = result.scalar_one_or_none()
        return Appointment.from_model(model) if model else None
```

#### 3. Dependency Injection

```python
# dependencies.py
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession


async def get_db_session() -> AsyncSession:
    """Get database session."""
    async with AsyncSessionLocal() as session:
        yield session


async def get_appointment_repository(
    session: AsyncSession = Depends(get_db_session)
) -> AppointmentRepository:
    """Get appointment repository."""
    return PostgresAppointmentRepository(session)


# routes/appointments.py
@app.post("/appointments")
async def create_appointment(
    data: AppointmentCreate,
    user: FidusJWT = Depends(verify_jwt),
    repository: AppointmentRepository = Depends(get_appointment_repository)
):
    """Create appointment (dependency injection)."""
    appointment = await repository.save(
        Appointment.create(
            tenant_id=user.tenant_id,
            owner_id=user.user_id,
            **data.dict()
        )
    )
    return appointment
```

### Technical Debt Management

```mermaid
flowchart TD
    Identify[Identify Tech Debt] --> Categorize{Categorize}

    Categorize -->|Quick Fix| QuickWin[Quick Win<br/>< 2 hours]
    Categorize -->|Medium| Medium[Medium Priority<br/>2-8 hours]
    Categorize -->|Large| Large[Large Refactor<br/>> 8 hours]

    QuickWin --> Sprint[Add to Sprint]
    Medium --> Backlog[Add to Backlog]
    Large --> Plan[Plan Refactor]

    Plan --> Break[Break into Tasks]
    Break --> Backlog

    Sprint --> Implement[Implement]
    Backlog --> Implement

    Implement --> Review[Code Review]
    Review --> Merge[Merge to Main]

    style QuickWin fill:#90be6d
    style Medium fill:#f9c74f
    style Large fill:#ff6b6b
```

**Technical Debt Register:**

| ID | Description | Category | Effort | Impact | Priority |
|----|-------------|----------|--------|--------|----------|
| TD-001 | Remove duplicate date parsing logic | Code Quality | 2h | Low | Low |
| TD-002 | Refactor LLM service (too many responsibilities) | Architecture | 8h | High | High |
| TD-003 | Add missing unit tests for Finance domain | Testing | 6h | High | High |
| TD-004 | Upgrade SQLAlchemy 1.4 → 2.0 | Dependency | 16h | Medium | Medium |

---

## Testability

### Definition

**Testability** is the ease with which tests can be written and executed.

### Test Pyramid

```mermaid
graph TD
    subgraph "Test Pyramid"
        E2E[E2E Tests<br/>10%<br/>Playwright]
        Integration[Integration Tests<br/>30%<br/>pytest, Vitest]
        Unit[Unit Tests<br/>60%<br/>pytest, Vitest]
    end

    Unit --> Integration
    Integration --> E2E

    style E2E fill:#ff6b6b
    style Integration fill:#f9c74f
    style Unit fill:#90be6d
```

### Test Coverage Targets

| Layer | Coverage Target | Tool | Run Frequency |
|-------|----------------|------|---------------|
| **Unit Tests** | >80% | pytest, Vitest | Every commit |
| **Integration Tests** | >60% | pytest, Vitest | Every commit |
| **E2E Tests** | >40% (critical flows) | Playwright | Every PR, nightly |
| **Load Tests** | N/A | k6 | Weekly |
| **Security Tests** | N/A | SAST, DAST | Every PR |

### Unit Testing

**Backend (pytest):**

```python
# tests/domain/test_appointment.py
import pytest
from datetime import datetime, timedelta
from fidus.domain.appointment import Appointment, ConflictError


class TestAppointment:
    """Unit tests for Appointment aggregate."""

    def test_create_appointment(self):
        """Should create appointment with valid data."""
        appointment = Appointment.create(
            tenant_id="tenant-123",
            owner_id="user-456",
            title="Team Meeting",
            start=datetime(2025, 11, 4, 10, 0),
            end=datetime(2025, 11, 4, 11, 0)
        )

        assert appointment.id is not None
        assert appointment.title == "Team Meeting"
        assert appointment.duration == timedelta(hours=1)

    def test_detect_conflict(self):
        """Should detect overlapping appointments."""
        apt1 = Appointment.create(
            tenant_id="tenant-123",
            owner_id="user-456",
            title="Meeting 1",
            start=datetime(2025, 11, 4, 10, 0),
            end=datetime(2025, 11, 4, 11, 0)
        )

        apt2 = Appointment.create(
            tenant_id="tenant-123",
            owner_id="user-456",
            title="Meeting 2",
            start=datetime(2025, 11, 4, 10, 30),
            end=datetime(2025, 11, 4, 11, 30)
        )

        assert apt1.conflicts_with(apt2)

    def test_no_conflict_different_tenant(self):
        """Should not detect conflict for different tenant."""
        apt1 = Appointment.create(
            tenant_id="tenant-123",
            owner_id="user-456",
            title="Meeting 1",
            start=datetime(2025, 11, 4, 10, 0),
            end=datetime(2025, 11, 4, 11, 0)
        )

        apt2 = Appointment.create(
            tenant_id="tenant-789",  # Different tenant
            owner_id="user-456",
            title="Meeting 2",
            start=datetime(2025, 11, 4, 10, 30),
            end=datetime(2025, 11, 4, 11, 30)
        )

        assert not apt1.conflicts_with(apt2)
```

**Frontend (Vitest):**

```typescript
// components/AppointmentCard.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppointmentCard } from './AppointmentCard';

describe('AppointmentCard', () => {
  it('should render appointment details', () => {
    const appointment = {
      id: 'apt-123',
      title: 'Team Meeting',
      start: new Date('2025-11-04T10:00:00Z'),
      end: new Date('2025-11-04T11:00:00Z'),
      location: 'Office',
    };

    render(<AppointmentCard appointment={appointment} />);

    expect(screen.getByText('Team Meeting')).toBeInTheDocument();
    expect(screen.getByText('Office')).toBeInTheDocument();
  });

  it('should format time correctly', () => {
    const appointment = {
      id: 'apt-123',
      title: 'Meeting',
      start: new Date('2025-11-04T14:00:00Z'),
      end: new Date('2025-11-04T15:30:00Z'),
    };

    render(<AppointmentCard appointment={appointment} />);

    expect(screen.getByText(/2:00 PM - 3:30 PM/)).toBeInTheDocument();
  });
});
```

### Integration Testing

```python
# tests/integration/test_appointment_api.py
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_appointment_api(client: AsyncClient, auth_token: str):
    """Integration test: Create appointment via API."""

    response = await client.post(
        "/appointments",
        json={
            "title": "Team Meeting",
            "start": "2025-11-04T10:00:00Z",
            "end": "2025-11-04T11:00:00Z",
            "location": "Office"
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Team Meeting"
    assert data["id"] is not None


@pytest.mark.asyncio
async def test_conflict_detection_api(client: AsyncClient, auth_token: str):
    """Integration test: API should detect conflicts."""

    # Create first appointment
    await client.post(
        "/appointments",
        json={
            "title": "Meeting 1",
            "start": "2025-11-04T10:00:00Z",
            "end": "2025-11-04T11:00:00Z"
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )

    # Try to create conflicting appointment
    response = await client.post(
        "/appointments",
        json={
            "title": "Meeting 2",
            "start": "2025-11-04T10:30:00Z",
            "end": "2025-11-04T11:30:00Z"
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )

    assert response.status_code == 409  # Conflict
    assert "conflicts" in response.json()["detail"].lower()
```

### End-to-End Testing

```typescript
// e2e/appointment.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Appointment Management', () => {
  test('should create and view appointment', async ({ page }) => {
    // Login
    await page.goto('http://localhost:3000/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard');

    // Navigate to appointments
    await page.click('text=Appointments');

    // Create appointment
    await page.click('text=New Appointment');
    await page.fill('[name="title"]', 'E2E Test Meeting');
    await page.fill('[name="start"]', '2025-11-04T10:00');
    await page.fill('[name="end"]', '2025-11-04T11:00');
    await page.click('button:has-text("Create")');

    // Verify appointment appears in list
    await expect(page.locator('text=E2E Test Meeting')).toBeVisible();
  });

  test('should detect and show conflict warning', async ({ page }) => {
    await page.goto('http://localhost:3000/appointments');

    // Create first appointment
    await page.click('text=New Appointment');
    await page.fill('[name="title"]', 'Meeting 1');
    await page.fill('[name="start"]', '2025-11-04T10:00');
    await page.fill('[name="end"]', '2025-11-04T11:00');
    await page.click('button:has-text("Create")');

    // Try to create conflicting appointment
    await page.click('text=New Appointment');
    await page.fill('[name="title"]', 'Meeting 2');
    await page.fill('[name="start"]', '2025-11-04T10:30');
    await page.fill('[name="end"]', '2025-11-04T11:30');
    await page.click('button:has-text("Create")');

    // Should show conflict warning
    await expect(page.locator('text=conflicts')).toBeVisible();
  });
});
```

---

## Usability

### Definition

**Usability** is the ease with which users can learn and use the system.

### Usability Goals

| Goal | Metric | Target | Validation |
|------|--------|--------|------------|
| **Learnability** | Time to first task completion | <5 minutes | User testing |
| **Efficiency** | Tasks per minute | >4 | User testing |
| **Memorability** | Task completion after 1 week absence | >80% | User testing |
| **Error Rate** | User errors per task | <0.1 | Analytics |
| **Satisfaction** | SUS Score | >75 | Survey |

### Design Principles

```mermaid
flowchart LR
    Principles[Design Principles]

    Principles --> Simple[Simplicity<br/>Minimal UI]
    Principles --> Consistent[Consistency<br/>Same patterns]
    Principles --> Feedback[Feedback<br/>Show progress]
    Principles --> Error[Error Prevention<br/>Validation]
    Principles --> Accessibility[Accessibility<br/>WCAG 2.1 AA]

    style Simple fill:#90be6d
    style Consistent fill:#4ecdc4
    style Feedback fill:#f9c74f
    style Error fill:#ff6b6b
    style Accessibility fill:#95e1d3
```

### Accessibility Standards (WCAG 2.1 Level AA)

```typescript
// Accessible button component
export function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      // WCAG: Keyboard accessible
      tabIndex={0}
      // WCAG: Screen reader support
      role="button"
      aria-label={props['aria-label']}
      // WCAG: Focus visible
      className="focus:ring-2 focus:ring-blue-500"
    >
      {children}
    </button>
  );
}

// Accessible form input
export function Input({ label, error, ...props }: InputProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        {...props}
        // WCAG: Associate error with input
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        // WCAG: Minimum contrast ratio (4.5:1)
        className="border-gray-300 text-gray-900"
      />
      {error && (
        <span id={errorId} role="alert" className="text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}
```

**WCAG Checklist:**

- ✅ Color contrast ratio ≥4.5:1 (normal text) and ≥3:1 (large text)
- ✅ All interactive elements keyboard accessible
- ✅ Focus indicators visible
- ✅ Alt text for all images
- ✅ Form labels associated with inputs
- ✅ Error messages in `role="alert"` regions
- ✅ Semantic HTML (headings, landmarks)
- ✅ ARIA attributes where needed

---

## Observability

### Definition

**Observability** is the ability to understand system behavior through external outputs.

### Three Pillars of Observability

```mermaid
flowchart TD
    Observability[Observability]

    Observability --> Metrics[Metrics<br/>Prometheus]
    Observability --> Logs[Logs<br/>Structured Logging]
    Observability --> Traces[Traces<br/>OpenTelemetry]

    Metrics --> Grafana[Grafana Dashboards]
    Logs --> Loki[Loki / ELK]
    Traces --> Jaeger[Jaeger]

    Grafana --> Alerts[Alerting<br/>PagerDuty/Slack]
    Loki --> Search[Log Search]
    Jaeger --> Debug[Debugging]

    style Metrics fill:#90be6d
    style Logs fill:#4ecdc4
    style Traces fill:#f9c74f
```

### Observability Implementation

**1. Metrics (Prometheus):**

```python
from prometheus_client import Counter, Histogram, Gauge

# Request metrics
http_requests_total = Counter(
    'fidus_http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

http_request_duration = Histogram(
    'fidus_http_request_duration_seconds',
    'HTTP request duration',
    ['method', 'endpoint'],
    buckets=[0.1, 0.5, 1, 2, 5]
)

# Business metrics
appointments_created = Counter(
    'fidus_appointments_created_total',
    'Total appointments created',
    ['tenant_id']
)

active_users = Gauge(
    'fidus_active_users',
    'Number of active users in last 5 minutes'
)
```

**2. Structured Logging:**

```python
import structlog

logger = structlog.get_logger()

# Log with context
logger.info(
    "appointment_created",
    tenant_id="tenant-123",
    user_id="user-456",
    appointment_id="apt-789",
    title="Team Meeting",
    duration_ms=1250
)

# JSON output:
# {
#   "event": "appointment_created",
#   "tenant_id": "tenant-123",
#   "user_id": "user-456",
#   "appointment_id": "apt-789",
#   "title": "Team Meeting",
#   "duration_ms": 1250,
#   "timestamp": "2025-10-27T14:30:00.000Z",
#   "level": "info"
# }
```

**3. Distributed Tracing:**

```python
from opentelemetry import trace
from opentelemetry.exporter.jaeger import JaegerExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

# Setup tracing
trace.set_tracer_provider(TracerProvider())
jaeger_exporter = JaegerExporter(agent_host_name="localhost", agent_port=6831)
trace.get_tracer_provider().add_span_processor(BatchSpanProcessor(jaeger_exporter))

tracer = trace.get_tracer(__name__)

# Trace function
@tracer.start_as_current_span("create_appointment")
async def create_appointment(data: AppointmentCreate):
    span = trace.get_current_span()
    span.set_attribute("tenant_id", data.tenant_id)
    span.set_attribute("appointment.title", data.title)

    # Implementation
    appointment = await repository.save(data)

    span.set_attribute("appointment.id", appointment.id)
    return appointment
```

### Alerting Rules

```yaml
# prometheus/alerts.yml
groups:
- name: fidus_alerts
  interval: 30s
  rules:
  - alert: HighErrorRate
    expr: rate(fidus_http_requests_total{status=~"5.."}[5m]) > 0.05
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected"
      description: "Error rate is {{ $value }} (threshold: 0.05)"

  - alert: HighResponseTime
    expr: histogram_quantile(0.95, rate(fidus_http_request_duration_seconds_bucket[5m])) > 2
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High response time detected"
      description: "P95 latency is {{ $value }}s (threshold: 2s)"

  - alert: DatabaseDown
    expr: up{job="postgres"} == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "PostgreSQL is down"
      description: "Database has been down for 1 minute"
```

---

## Portability

### Definition

**Portability** is the ease with which the system can run on different environments.

### Deployment Options

```mermaid
flowchart TD
    Fidus[Fidus System]

    Fidus --> Local[Local Development<br/>Docker Compose]
    Fidus --> SelfHost[Self-Hosted<br/>Docker Compose]
    Fidus --> Cloud[Cloud<br/>Kubernetes]

    Local --> Laptop[Developer Laptop<br/>Mac/Linux/Windows]

    SelfHost --> VPS[VPS<br/>Hetzner/DigitalOcean]
    SelfHost --> OnPrem[On-Premises<br/>Company Datacenter]

    Cloud --> AWS[AWS EKS]
    Cloud --> Azure[Azure AKS]
    Cloud --> GCP[Google GKE]

    style Local fill:#90be6d
    style SelfHost fill:#4ecdc4
    style Cloud fill:#f9c74f
```

### Platform Support

| Platform | Supported | Notes |
|----------|-----------|-------|
| **Linux (x86_64)** | ✅ Yes | Primary platform |
| **Linux (ARM64)** | ✅ Yes | Raspberry Pi, AWS Graviton |
| **macOS (Intel)** | ✅ Yes | Development |
| **macOS (Apple Silicon)** | ✅ Yes | Development (Rosetta 2) |
| **Windows (WSL2)** | ✅ Yes | Development only |
| **Windows (Native)** | ⚠️ Limited | Docker Desktop required |

### Container Portability

```dockerfile
# Multi-architecture build
FROM --platform=$BUILDPLATFORM python:3.11-slim AS builder

ARG TARGETPLATFORM
ARG BUILDPLATFORM

RUN echo "Building on $BUILDPLATFORM for $TARGETPLATFORM"

# Build for both AMD64 and ARM64
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.11-slim
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY . .

CMD ["uvicorn", "fidus.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
# Build for multiple platforms
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t fidus/api:latest \
  --push \
  .
```

---

## Interoperability

### Definition

**Interoperability** is the ability to exchange data with external systems.

### Integration Points

```mermaid
flowchart LR
    Fidus[Fidus System]

    Fidus <-->|MCP| GoogleCal[Google Calendar]
    Fidus <-->|MCP| Outlook[Microsoft Outlook]
    Fidus <-->|MCP| Todoist[Todoist]
    Fidus <-->|MCP| Notion[Notion]
    Fidus <-->|Webhook| Stripe[Stripe]
    Fidus <-->|OAuth| GitHub[GitHub]
    Fidus <-->|REST API| Weather[Weather API]

    style Fidus fill:#4ecdc4
    style GoogleCal fill:#90be6d
    style Outlook fill:#90be6d
    style Todoist fill:#90be6d
```

### Standard Protocols

| Protocol | Use Case | Implementation |
|----------|----------|----------------|
| **MCP (Model Context Protocol)** | Agent-to-agent communication | HTTP + SSE, JSON-RPC |
| **OAuth 2.0** | User authentication | Auth0 / Keycloak |
| **OpenAPI 3.1** | REST API documentation | FastAPI auto-generation |
| **WebHooks** | Event notifications | Stripe, GitHub |
| **JSON-RPC 2.0** | MCP transport | MCP servers |
| **Server-Sent Events (SSE)** | Real-time updates | MCP, progress updates |

---

## Localization & Internationalization

### Definition

**i18n** (Internationalization) is the ability to support multiple languages and regions.

### Supported Languages (MVP)

| Language | Code | Status | Priority |
|----------|------|--------|----------|
| **English** | en-US | ✅ Complete | Primary |
| **German** | de-DE | 🟡 Planned | High |
| **French** | fr-FR | ⚠️ Future | Medium |
| **Spanish** | es-ES | ⚠️ Future | Medium |

### i18n Implementation

**Frontend (next-intl):**

```typescript
// messages/en.json
{
  "appointments": {
    "title": "Appointments",
    "create": "New Appointment",
    "edit": "Edit Appointment",
    "delete": "Delete Appointment",
    "conflict": "This appointment conflicts with {count} existing appointments"
  }
}

// messages/de.json
{
  "appointments": {
    "title": "Termine",
    "create": "Neuer Termin",
    "edit": "Termin bearbeiten",
    "delete": "Termin löschen",
    "conflict": "Dieser Termin überschneidet sich mit {count} vorhandenen Terminen"
  }
}

// Component usage
import { useTranslations } from 'next-intl';

export function AppointmentList() {
  const t = useTranslations('appointments');

  return (
    <div>
      <h1>{t('title')}</h1>
      <button>{t('create')}</button>
    </div>
  );
}
```

**Backend (LLM Responses):**

```python
class LocalizationService:
    """Localize LLM responses based on user language."""

    async def complete_localized(
        self,
        prompt: str,
        user_language: str = "en"
    ) -> str:
        """Generate LLM response in user's language."""

        # Add language instruction to prompt
        localized_prompt = f"""
Language: {user_language}

{prompt}

Respond in {user_language}.
"""

        return await llm.complete(localized_prompt)
```

---

## Quality Attribute Tradeoffs

### Tradeoff Analysis

```mermaid
graph TD
    Perf[Performance] -.->|Conflicts with| Security[Security]
    Perf -.->|Conflicts with| Observability[Observability]

    Security -.->|Conflicts with| Usability[Usability]

    Scalability[Scalability] -.->|Conflicts with| Simplicity[Simplicity]

    Availability[Availability] -.->|Requires| Cost[Higher Cost]

    Privacy[Privacy] -.->|Conflicts with| Analytics[Analytics]

    style Perf fill:#90be6d
    style Security fill:#f94144
    style Privacy fill:#4ecdc4
```

**Key Tradeoffs:**

| Attribute A | ⬆️ Increases | Attribute B | ⬇️ Decreases | Mitigation |
|------------|-------------|------------|-------------|------------|
| **Security** | Encryption overhead | **Performance** | Latency +50ms | Use hardware acceleration (AES-NI) |
| **Privacy** | Local LLM | **Performance** | Slower inference | Offer cloud LLM opt-in |
| **Observability** | Logging overhead | **Performance** | Latency +20ms | Async logging, sampling |
| **Availability** | Redundancy | **Cost** | 3x infrastructure | Start with active-passive failover |
| **Usability** | Fewer options | **Flexibility** | Less power-user features | Add "Advanced" mode |

---

## Quality Metrics Dashboard

### System Health Dashboard

```mermaid
graph TD
    subgraph "Key Metrics"
        RPS[Requests/Second<br/>Target: 100]
        Latency[P95 Latency<br/>Target: <2s]
        Errors[Error Rate<br/>Target: <1%]
        Uptime[Uptime<br/>Target: 99.9%]
    end

    subgraph "Business Metrics"
        ActiveUsers[Active Users<br/>Last 24h]
        Appointments[Appointments Created<br/>Today]
        LLMUsage[LLM Tokens Used<br/>Today]
    end

    subgraph "Infrastructure Metrics"
        CPU[CPU Usage<br/>Target: <70%]
        Memory[Memory Usage<br/>Target: <80%]
        DBConn[DB Connections<br/>Target: <80% pool]
    end

    style RPS fill:#90be6d
    style Latency fill:#90be6d
    style Errors fill:#90be6d
    style Uptime fill:#90be6d
```

### Quality Gates (CI/CD)

```yaml
# .github/workflows/quality-gates.yml
name: Quality Gates

on: [pull_request]

jobs:
  quality-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # Gate 1: Code Coverage
      - name: Check Code Coverage
        run: |
          pnpm test -- --coverage
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 80%"
            exit 1
          fi

      # Gate 2: Linting
      - name: Check Linting
        run: pnpm lint

      # Gate 3: Type Checking
      - name: Check Types
        run: pnpm typecheck

      # Gate 4: Security Scan
      - name: Security Scan
        run: pnpm audit

      # Gate 5: Performance Budget
      - name: Check Performance Budget
        run: |
          pnpm build
          SIZE=$(du -k dist | cut -f1)
          if [ $SIZE -gt 5000 ]; then
            echo "Bundle size $SIZE KB exceeds 5000 KB"
            exit 1
          fi
```

---

## Conclusion

This document defines comprehensive quality attributes for the Fidus system, with specific, measurable targets and implementation strategies for each attribute.

### Priority Summary

**Critical (Must Have for MVP):**
- ✅ Security & Privacy
- ✅ Performance (<2s P95 latency)
- ✅ Correctness (data integrity)

**High Priority (Should Have for MVP):**
- ✅ Availability (99% uptime)
- ✅ Maintainability (>80% test coverage)
- ✅ Usability (SUS >75)

**Medium Priority (Nice to Have Post-MVP):**
- ⚠️ Scalability (1000+ req/s)
- ⚠️ Multi-region deployment
- ⚠️ Advanced observability (distributed tracing)

### Next Steps

For related documentation, see:
- [05-data-flows.md](05-data-flows.md) - Performance-optimized data flows
- [06-technology-decisions.md](06-technology-decisions.md) - Technology choices supporting quality attributes
- [07-security-compliance.md](07-security-compliance.md) - Security quality attributes

---

**Version History:**
- v1.0 (2025-10-27): Initial comprehensive quality attributes documentation

---

**End of Quality Attributes Document**

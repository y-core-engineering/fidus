# Implementation Prompt: 2.3 - Goal Entity with Progress Tracking UI

**Package:** 2.3
**Epic:** Core Entity Implementation
**Priority:** 🔴 CRITICAL
**Context Document:** `/Users/sebastianherden/Documents/GitHub/fidus/docs/prototypes/fidus-memory/migration-v3-wbs.md` (Lines 485-539)

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
- Package 2.1 (Person Entity) and 2.2 (Organization Entity) are complete - pattern established
- Basic preference learning and situational context extraction are working

**Migration Goal:**
- Implement the Goal entity to enable users to set and track personal goals
- Enable automatic extraction of goals mentioned in conversations via LLM
- Provide complete UI for creating, tracking progress, and viewing goal insights
- Establish foundation for Package 3.3 (PURSUES relationship with context tracking)

**Architecture References:**
- Solution Architecture: `/Users/sebastianherden/Documents/GitHub/fidus/docs/solution-architecture/03-component-architecture.md`
- Solution Architecture: `/Users/sebastianherden/Documents/GitHub/fidus/docs/solution-architecture/15-entity-management.md`
- Domain Model: `/Users/sebastianherden/Documents/GitHub/fidus/docs/domain-model/entity-relationship-model.md`
- ADR-0001: Qdrant-First Pattern (already implemented in Package 1.1)
- Reference: Packages 2.1, 2.2 (Person, Organization entities) for implementation pattern

---

## Your Task

Implement **Goal Entity with Progress Tracking UI** according to the specifications below.

**User Story:**
As a user, I want to set and track personal goals with the system monitoring my progress and providing insights based on my conversations.

**Acceptance Criteria:**
1. Backend: Goal entity with `type`, `target_value`, `current_value`, `deadline`
2. Backend: GoalRepository with progress calculation methods
3. Backend: LLM goal extractor from user statements
4. API: Goal CRUD + progress update endpoints
5. Frontend: Goal board with Kanban-style cards
6. Frontend: Goal detail with progress chart
7. Frontend: Goal creation form with templates
8. Tests: Extract "I want to lose 5kg by June" and track updates
9. Documentation: Goal tracking guide

---

## Technical Specification

### Backend Implementation

**Files to Create:**

1. **`packages/api/fidus/memory/entities/goal.py`** - Goal entity model with progress logic
2. **`packages/api/fidus/memory/repositories/goal_repository.py`** - Repository with CRUD + progress tracking
3. **`packages/api/fidus/memory/services/goal_extractor.py`** - LLM extraction service

**Detailed Implementation:**

#### 1. Goal Entity Model (`packages/api/fidus/memory/entities/goal.py`)

```python
"""Goal entity model with progress tracking logic."""

from typing import Dict, Any, Optional, List
from datetime import datetime, date
from pydantic import BaseModel, Field
from uuid import uuid4
from enum import Enum


class GoalType(str, Enum):
    """Standardized goal types."""
    HEALTH = "health"
    CAREER = "career"
    PERSONAL = "personal"
    LEARNING = "learning"
    FINANCIAL = "financial"
    SOCIAL = "social"
    OTHER = "other"


class GoalStatus(str, Enum):
    """Goal status for Kanban board."""
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"
    ABANDONED = "abandoned"


class Goal(BaseModel):
    """
    Goal entity representing personal objectives with progress tracking.

    Examples:
    - Health: "Lose 5kg by June", "Run 10km"
    - Career: "Get promoted to Senior Engineer", "Complete certification"
    - Learning: "Reach B2 German level", "Learn React"
    - Financial: "Save $10,000", "Pay off student loans"

    Core Fields: Fixed schema for essential attributes
    AI Properties: Flexible dict for AI-discovered attributes
    """

    id: str = Field(default_factory=lambda: str(uuid4()))
    tenant_id: str = Field(..., description="Multi-tenancy identifier")
    user_id: str = Field(..., description="User who owns this goal")
    description: str = Field(..., description="Goal description (required)")

    # Goal classification
    type: GoalType = Field(default=GoalType.OTHER, description="Goal type")
    status: GoalStatus = Field(default=GoalStatus.TODO, description="Current status")

    # Progress tracking
    target_value: Optional[str] = Field(None, description="Target value (e.g., '10km', 'B2', '$10000')")
    current_value: Optional[str] = Field(None, description="Current progress value")
    unit: Optional[str] = Field(None, description="Unit of measurement (e.g., 'kg', 'km', 'hours')")

    # Timeline
    deadline: Optional[date] = Field(None, description="Target completion date")
    started_at: Optional[datetime] = Field(None, description="When user started working on this")
    completed_at: Optional[datetime] = Field(None, description="When goal was completed")

    # Flexible properties discovered by AI
    ai_properties: Dict[str, Any] = Field(
        default_factory=dict,
        description="AI-discovered attributes (strategies, obstacles, motivation, etc.)"
    )

    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    confidence: float = Field(default=0.9, ge=0.0, le=1.0, description="Extraction confidence")
    source: str = Field(default="explicit", description="explicit, inferred, llm_extracted")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "goal_123",
                "tenant_id": "tenant_456",
                "user_id": "user_789",
                "description": "Lose 5kg by June",
                "type": "health",
                "status": "in_progress",
                "target_value": "75",
                "current_value": "78",
                "unit": "kg",
                "deadline": "2025-06-30",
                "ai_properties": {
                    "strategies": ["Exercise 3x/week", "Reduce sugar intake"],
                    "obstacles": ["Busy schedule", "Travel"],
                    "motivation": "Improve health and fitness"
                },
                "confidence": 0.90,
                "source": "llm_extracted"
            }
        }

    # Computed properties for progress tracking
    @property
    def progress_percentage(self) -> Optional[float]:
        """
        Calculate progress percentage if target and current values are numeric.

        Returns:
            Percentage (0-100) or None if not calculable
        """
        if not self.target_value or not self.current_value:
            return None

        try:
            target = float(self.target_value)
            current = float(self.current_value)

            # Handle different progress directions
            # For weight loss: current < target is progress
            # For savings: current > 0 is progress toward target
            # Generic: (current / target) * 100

            # Simple approach: absolute progress
            if target == 0:
                return 100.0 if current >= target else 0.0

            # For decreasing goals (e.g., weight loss from 80kg to 75kg)
            # If target < initial implied value, invert calculation
            # For now, use simple ratio
            progress = (current / target) * 100

            # Clamp between 0 and 100
            return max(0.0, min(100.0, progress))

        except (ValueError, TypeError):
            return None

    @property
    def is_overdue(self) -> bool:
        """Check if goal is past deadline and not completed."""
        if not self.deadline:
            return False
        if self.status == GoalStatus.DONE:
            return False

        return date.today() > self.deadline

    @property
    def days_remaining(self) -> Optional[int]:
        """
        Calculate days remaining until deadline.

        Returns:
            Number of days or None if no deadline
        """
        if not self.deadline:
            return None

        delta = self.deadline - date.today()
        return delta.days

    @property
    def is_completed(self) -> bool:
        """Check if goal is marked as done."""
        return self.status == GoalStatus.DONE

    def update_progress(self, new_value: str, timestamp: Optional[datetime] = None) -> None:
        """
        Update current progress value.

        Args:
            new_value: New progress value
            timestamp: When the progress was recorded (default: now)
        """
        self.current_value = new_value
        self.updated_at = timestamp or datetime.utcnow()

        # If not started yet, mark as started
        if not self.started_at:
            self.started_at = self.updated_at

        # Auto-transition to in_progress if still in todo
        if self.status == GoalStatus.TODO:
            self.status = GoalStatus.IN_PROGRESS

    def mark_completed(self, timestamp: Optional[datetime] = None) -> None:
        """Mark goal as completed."""
        self.status = GoalStatus.DONE
        self.completed_at = timestamp or datetime.utcnow()
        self.updated_at = self.completed_at

    def merge_properties(self, new_properties: Dict[str, Any]) -> None:
        """
        Merge new AI-discovered properties.

        Strategy:
        - Add new keys
        - For list values, union (no duplicates)
        - For scalar values, keep existing
        """
        for key, value in new_properties.items():
            if key not in self.ai_properties:
                self.ai_properties[key] = value
            elif isinstance(value, list) and isinstance(self.ai_properties[key], list):
                self.ai_properties[key] = list(set(self.ai_properties[key] + value))

        self.updated_at = datetime.utcnow()


class GoalCreate(BaseModel):
    """Request model for creating a goal."""
    description: str
    type: GoalType = GoalType.OTHER
    target_value: Optional[str] = None
    current_value: Optional[str] = None
    unit: Optional[str] = None
    deadline: Optional[date] = None
    ai_properties: Dict[str, Any] = Field(default_factory=dict)
    confidence: float = Field(default=0.9)
    source: str = Field(default="explicit")


class GoalUpdate(BaseModel):
    """Request model for updating a goal."""
    description: Optional[str] = None
    type: Optional[GoalType] = None
    status: Optional[GoalStatus] = None
    target_value: Optional[str] = None
    current_value: Optional[str] = None
    deadline: Optional[date] = None
    ai_properties: Optional[Dict[str, Any]] = None


class GoalProgressUpdate(BaseModel):
    """Request model for updating only progress."""
    current_value: str
    timestamp: Optional[datetime] = None


class GoalResponse(BaseModel):
    """Response model for goal API."""
    id: str
    tenant_id: str
    user_id: str
    description: str
    type: GoalType
    status: GoalStatus
    target_value: Optional[str]
    current_value: Optional[str]
    unit: Optional[str]
    deadline: Optional[date]
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    ai_properties: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    confidence: float
    source: str

    # Computed properties
    progress_percentage: Optional[float] = None
    is_overdue: bool = False
    days_remaining: Optional[int] = None
    is_completed: bool = False
```

**Key Implementation Notes:**
- `GoalType` enum standardizes goal categories
- `GoalStatus` enum supports Kanban board workflow (todo, in_progress, done, abandoned)
- Progress tracking with `target_value`, `current_value`, `unit`
- Computed properties for progress percentage, days remaining, overdue status
- `update_progress()` method auto-transitions status to in_progress
- Timeline tracking with `started_at`, `completed_at`

---

#### 2. Goal Repository (`packages/api/fidus/memory/repositories/goal_repository.py`)

```python
"""Goal repository with CRUD and progress tracking operations."""

from typing import List, Optional
from datetime import datetime, date
from neo4j import AsyncDriver
from fidus.memory.entities.goal import Goal, GoalCreate, GoalUpdate, GoalStatus


class GoalRepository:
    """
    Repository for Goal entity operations.

    Implements:
    - CRUD operations (create, get, update, delete)
    - Progress updates
    - Status transitions (todo → in_progress → done)
    - Filtering by status, type, deadline
    - Property merging for AI-discovered attributes
    """

    def __init__(self, driver: AsyncDriver):
        self.driver = driver

    async def create(
        self,
        tenant_id: str,
        user_id: str,
        goal_data: GoalCreate
    ) -> Goal:
        """
        Create a new Goal node in Neo4j.

        Args:
            tenant_id: Multi-tenancy identifier
            user_id: Owner of this goal
            goal_data: Goal creation data

        Returns:
            Created Goal entity
        """
        goal = Goal(
            tenant_id=tenant_id,
            user_id=user_id,
            description=goal_data.description,
            type=goal_data.type,
            target_value=goal_data.target_value,
            current_value=goal_data.current_value,
            unit=goal_data.unit,
            deadline=goal_data.deadline,
            ai_properties=goal_data.ai_properties,
            confidence=goal_data.confidence,
            source=goal_data.source
        )

        query = """
        CREATE (g:Goal {
            id: $id,
            tenant_id: $tenant_id,
            user_id: $user_id,
            description: $description,
            type: $type,
            status: $status,
            target_value: $target_value,
            current_value: $current_value,
            unit: $unit,
            deadline: $deadline,
            started_at: $started_at,
            completed_at: $completed_at,
            ai_properties: $ai_properties,
            created_at: datetime(),
            updated_at: datetime(),
            confidence: $confidence,
            source: $source
        })
        RETURN g
        """

        async with self.driver.session() as session:
            result = await session.run(
                query,
                id=goal.id,
                tenant_id=goal.tenant_id,
                user_id=goal.user_id,
                description=goal.description,
                type=goal.type.value,
                status=goal.status.value,
                target_value=goal.target_value,
                current_value=goal.current_value,
                unit=goal.unit,
                deadline=goal.deadline.isoformat() if goal.deadline else None,
                started_at=goal.started_at,
                completed_at=goal.completed_at,
                ai_properties=goal.ai_properties,
                confidence=goal.confidence,
                source=goal.source
            )
            await result.consume()

        return goal

    async def get(self, tenant_id: str, goal_id: str) -> Optional[Goal]:
        """Get a Goal by ID with tenant isolation."""
        query = """
        MATCH (g:Goal {id: $goal_id, tenant_id: $tenant_id})
        RETURN g
        """

        async with self.driver.session() as session:
            result = await session.run(query, goal_id=goal_id, tenant_id=tenant_id)
            record = await result.single()

            if not record:
                return None

            node = record["g"]
            return self._node_to_goal(node)

    async def update(
        self,
        tenant_id: str,
        goal_id: str,
        update_data: GoalUpdate
    ) -> Optional[Goal]:
        """Update a Goal with property merging."""
        goal = await self.get(tenant_id, goal_id)
        if not goal:
            return None

        # Apply updates
        if update_data.description:
            goal.description = update_data.description
        if update_data.type:
            goal.type = update_data.type
        if update_data.status:
            goal.status = update_data.status
        if update_data.target_value:
            goal.target_value = update_data.target_value
        if update_data.current_value:
            goal.current_value = update_data.current_value
        if update_data.deadline:
            goal.deadline = update_data.deadline
        if update_data.ai_properties:
            goal.merge_properties(update_data.ai_properties)

        goal.updated_at = datetime.utcnow()

        # Update in Neo4j
        query = """
        MATCH (g:Goal {id: $goal_id, tenant_id: $tenant_id})
        SET g.description = $description,
            g.type = $type,
            g.status = $status,
            g.target_value = $target_value,
            g.current_value = $current_value,
            g.deadline = $deadline,
            g.ai_properties = $ai_properties,
            g.updated_at = datetime()
        RETURN g
        """

        async with self.driver.session() as session:
            await session.run(
                query,
                goal_id=goal_id,
                tenant_id=tenant_id,
                description=goal.description,
                type=goal.type.value,
                status=goal.status.value,
                target_value=goal.target_value,
                current_value=goal.current_value,
                deadline=goal.deadline.isoformat() if goal.deadline else None,
                ai_properties=goal.ai_properties
            )

        return goal

    async def update_progress(
        self,
        tenant_id: str,
        goal_id: str,
        new_value: str,
        timestamp: Optional[datetime] = None
    ) -> Optional[Goal]:
        """
        Update only the progress value of a goal.

        Convenience method for progress tracking without full update.
        """
        goal = await self.get(tenant_id, goal_id)
        if not goal:
            return None

        goal.update_progress(new_value, timestamp)

        query = """
        MATCH (g:Goal {id: $goal_id, tenant_id: $tenant_id})
        SET g.current_value = $current_value,
            g.status = $status,
            g.started_at = $started_at,
            g.updated_at = datetime()
        RETURN g
        """

        async with self.driver.session() as session:
            await session.run(
                query,
                goal_id=goal_id,
                tenant_id=tenant_id,
                current_value=goal.current_value,
                status=goal.status.value,
                started_at=goal.started_at
            )

        return goal

    async def mark_completed(
        self,
        tenant_id: str,
        goal_id: str,
        timestamp: Optional[datetime] = None
    ) -> Optional[Goal]:
        """Mark a goal as completed."""
        goal = await self.get(tenant_id, goal_id)
        if not goal:
            return None

        goal.mark_completed(timestamp)

        query = """
        MATCH (g:Goal {id: $goal_id, tenant_id: $tenant_id})
        SET g.status = $status,
            g.completed_at = $completed_at,
            g.updated_at = datetime()
        RETURN g
        """

        async with self.driver.session() as session:
            await session.run(
                query,
                goal_id=goal_id,
                tenant_id=tenant_id,
                status=goal.status.value,
                completed_at=goal.completed_at
            )

        return goal

    async def delete(self, tenant_id: str, goal_id: str) -> bool:
        """Delete a Goal with cascade."""
        query = """
        MATCH (g:Goal {id: $goal_id, tenant_id: $tenant_id})
        DETACH DELETE g
        RETURN count(g) as deleted_count
        """

        async with self.driver.session() as session:
            result = await session.run(query, goal_id=goal_id, tenant_id=tenant_id)
            record = await result.single()
            return record["deleted_count"] > 0

    async def list_by_user(
        self,
        tenant_id: str,
        user_id: str,
        status: Optional[GoalStatus] = None,
        limit: int = 100
    ) -> List[Goal]:
        """
        List goals for a user with optional status filter.

        Args:
            tenant_id: Tenant identifier
            user_id: User identifier
            status: Optional status filter (todo, in_progress, done)
            limit: Max results

        Returns:
            List of Goal entities
        """
        if status:
            query = """
            MATCH (g:Goal {tenant_id: $tenant_id, user_id: $user_id, status: $status})
            RETURN g
            ORDER BY g.created_at DESC
            LIMIT $limit
            """
            params = {
                "tenant_id": tenant_id,
                "user_id": user_id,
                "status": status.value,
                "limit": limit
            }
        else:
            query = """
            MATCH (g:Goal {tenant_id: $tenant_id, user_id: $user_id})
            RETURN g
            ORDER BY g.created_at DESC
            LIMIT $limit
            """
            params = {
                "tenant_id": tenant_id,
                "user_id": user_id,
                "limit": limit
            }

        async with self.driver.session() as session:
            result = await session.run(query, **params)

            goals = []
            async for record in result:
                node = record["g"]
                goals.append(self._node_to_goal(node))

            return goals

    async def get_active_goals(
        self,
        tenant_id: str,
        user_id: str
    ) -> List[Goal]:
        """Get goals that are not completed or abandoned."""
        query = """
        MATCH (g:Goal {tenant_id: $tenant_id, user_id: $user_id})
        WHERE g.status IN ['todo', 'in_progress']
        RETURN g
        ORDER BY g.deadline ASC NULLS LAST
        """

        async with self.driver.session() as session:
            result = await session.run(
                query,
                tenant_id=tenant_id,
                user_id=user_id
            )

            goals = []
            async for record in result:
                node = record["g"]
                goals.append(self._node_to_goal(node))

            return goals

    def _node_to_goal(self, node) -> Goal:
        """Convert Neo4j node to Goal entity."""
        return Goal(
            id=node["id"],
            tenant_id=node["tenant_id"],
            user_id=node["user_id"],
            description=node["description"],
            type=node["type"],
            status=node["status"],
            target_value=node.get("target_value"),
            current_value=node.get("current_value"),
            unit=node.get("unit"),
            deadline=date.fromisoformat(node["deadline"]) if node.get("deadline") else None,
            started_at=node.get("started_at"),
            completed_at=node.get("completed_at"),
            ai_properties=node.get("ai_properties", {}),
            created_at=node["created_at"],
            updated_at=node["updated_at"],
            confidence=node.get("confidence", 0.9),
            source=node.get("source", "explicit")
        )
```

**Key Implementation Notes:**
- `update_progress()` method for quick progress updates
- `mark_completed()` method for status transition
- `get_active_goals()` filters by status (todo, in_progress)
- Status transitions handled automatically in entity logic

---

#### 3. Goal Extractor Service (`packages/api/fidus/memory/services/goal_extractor.py`)

```python
"""LLM-based goal extraction from conversations."""

from typing import List, Optional, Dict, Any
from datetime import date
from litellm import acompletion
import json
from dateutil import parser

from fidus.memory.entities.goal import GoalCreate, GoalType
from fidus.config import settings


class GoalEntityExtractor:
    """
    Extract Goal entities from natural language conversations.

    Uses structured LLM prompts to identify:
    - Description (required)
    - Type: health, career, personal, learning, financial, social (optional)
    - Target value (optional)
    - Current value (optional)
    - Unit (optional)
    - Deadline (optional)
    - Strategies, obstacles, motivation (optional)
    """

    EXTRACTION_PROMPT = """
You are an entity extraction specialist. Extract goal information from the following conversation.

Goals represent personal objectives the user wants to achieve.

Extract:
- description (REQUIRED): Clear description of the goal
- type (OPTIONAL): One of: health, career, personal, learning, financial, social, other
- target_value (OPTIONAL): Numeric target (e.g., "75" for 75kg, "10" for 10km, "B2" for language level)
- current_value (OPTIONAL): Current progress (same format as target)
- unit (OPTIONAL): Unit of measurement (e.g., "kg", "km", "hours", "level")
- deadline (OPTIONAL): Target date in YYYY-MM-DD format
- strategies (OPTIONAL): List of strategies to achieve the goal
- obstacles (OPTIONAL): List of potential obstacles
- motivation (OPTIONAL): Why this goal matters

IMPORTANT: Only extract if a goal is explicitly stated. Don't infer goals from general statements.

Conversation:
{conversation}

Output as JSON:
{{
  "goals": [
    {{
      "description": "string (required)",
      "type": "health|career|personal|learning|financial|social|other or null",
      "target_value": "string or null",
      "current_value": "string or null",
      "unit": "string or null",
      "deadline": "YYYY-MM-DD or null",
      "strategies": ["string"] or null,
      "obstacles": ["string"] or null,
      "motivation": "string or null"
    }}
  ]
}}
"""

    def __init__(self, model: str = "gpt-4"):
        self.model = model

    async def extract_from_conversation(self, conversation: str) -> List[GoalCreate]:
        """
        Extract Goal entities from conversation text.

        Args:
            conversation: User conversation text

        Returns:
            List of GoalCreate objects (may be empty if no goals found)
        """
        prompt = self.EXTRACTION_PROMPT.format(conversation=conversation)

        try:
            response = await acompletion(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                response_format={"type": "json_object"}
            )

            content = response.choices[0].message.content
            data = json.loads(content)

            goals = []
            for goal_data in data.get("goals", []):
                if not goal_data.get("description"):
                    continue  # Skip if no description

                # Parse deadline if present
                deadline = None
                if goal_data.get("deadline"):
                    try:
                        deadline = parser.parse(goal_data["deadline"]).date()
                    except:
                        pass  # Invalid date format

                # Parse type
                goal_type = GoalType.OTHER
                if goal_data.get("type"):
                    try:
                        goal_type = GoalType(goal_data["type"])
                    except ValueError:
                        pass  # Invalid type

                # Build ai_properties
                ai_properties = {}
                for key in ["strategies", "obstacles", "motivation"]:
                    if goal_data.get(key):
                        ai_properties[key] = goal_data[key]

                goals.append(GoalCreate(
                    description=goal_data["description"],
                    type=goal_type,
                    target_value=goal_data.get("target_value"),
                    current_value=goal_data.get("current_value"),
                    unit=goal_data.get("unit"),
                    deadline=deadline,
                    ai_properties=ai_properties,
                    confidence=0.85,
                    source="llm_extracted"
                ))

            return goals

        except Exception as e:
            print(f"Goal extraction failed: {e}")
            return []

    async def extract_single(self, conversation: str) -> Optional[GoalCreate]:
        """Extract a single goal (convenience method)."""
        goals = await self.extract_from_conversation(conversation)
        return goals[0] if goals else None
```

**Key Implementation Notes:**
- Structured prompt extracts quantifiable goals (target, current, unit)
- Date parsing with `dateutil.parser` for flexible date formats
- Validates `type` against `GoalType` enum
- Extracts strategies, obstacles, motivation into `ai_properties`

---

### API Implementation

**Key Endpoints:**
1. `POST /api/memory/entities/goal` - Create goal
2. `GET /api/memory/entities/goal/{id}` - Get goal
3. `PUT /api/memory/entities/goal/{id}` - Update goal
4. `PATCH /api/memory/entities/goal/{id}/progress` - Update progress only
5. `PATCH /api/memory/entities/goal/{id}/complete` - Mark complete
6. `DELETE /api/memory/entities/goal/{id}` - Delete goal
7. `GET /api/memory/entities/goal?user_id=...&status=...` - List/filter goals

(Full API implementation follows pattern of Person/Organization routes - omitted for brevity)

---

### Frontend Implementation

**Components to Create:**

1. **`packages/web/src/components/memory/GoalBoard.tsx`** - Kanban board (To Do / In Progress / Done)
2. **`packages/web/src/components/memory/GoalCard.tsx`** - Card component with progress bar
3. **`packages/web/src/components/memory/GoalDetail.tsx`** - Detail page with progress chart
4. **`packages/web/src/components/memory/GoalForm.tsx`** - Create/edit form with type selector
5. **`packages/web/src/app/memory/goals/page.tsx`** - Next.js page route

#### 1. GoalBoard Component (Kanban Style)

```typescript
// packages/web/src/components/memory/GoalBoard.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card, Button, Skeleton } from "@fidus/ui";
import { getGoals, updateGoal } from "@/lib/api/memory";
import { GoalCard } from "./GoalCard";
import { GoalStatus } from "@/types/memory";

interface GoalBoardProps {
  userId: string;
  onSelectGoal: (goalId: string) => void;
}

const COLUMNS = [
  { id: "todo", title: "To Do", status: GoalStatus.TODO },
  { id: "in_progress", title: "In Progress", status: GoalStatus.IN_PROGRESS },
  { id: "done", title: "Done", status: GoalStatus.DONE },
];

export function GoalBoard({ userId, onSelectGoal }: GoalBoardProps) {
  const queryClient = useQueryClient();

  const { data: goals, isLoading } = useQuery({
    queryKey: ["goals", userId],
    queryFn: () => getGoals({ userId }),
    enabled: !!userId,
  });

  const updateStatusM = useMutation({
    mutationFn: ({ goalId, status }: { goalId: string; status: GoalStatus }) =>
      updateGoal(goalId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = COLUMNS.find((col) => col.id === destination.droppableId)?.status;

    if (newStatus) {
      updateStatusM.mutate({ goalId: draggableId, status: newStatus });
    }
  };

  if (isLoading) {
    return <Skeleton count={5} height={200} />;
  }

  const goalsByStatus = (status: GoalStatus) =>
    goals?.filter((g) => g.status === status) || [];

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((column) => (
          <div key={column.id} className="flex-1 min-w-[300px]">
            <Card className="p-4">
              <h3 className="text-lg font-bold mb-4">
                {column.title} ({goalsByStatus(column.status).length})
              </h3>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-3 min-h-[400px]"
                  >
                    {goalsByStatus(column.status).map((goal, index) => (
                      <Draggable key={goal.id} draggableId={goal.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <GoalCard
                              goal={goal}
                              onClick={() => onSelectGoal(goal.id)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Card>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
```

#### 2. GoalCard Component

```typescript
// packages/web/src/components/memory/GoalCard.tsx
"use client";

import { Card, Chip, LinearProgress } from "@fidus/ui";
import { GoalResponse } from "@/types/memory";

interface GoalCardProps {
  goal: GoalResponse;
  onClick: () => void;
}

export function GoalCard({ goal, onClick }: GoalCardProps) {
  const progress = goal.progress_percentage || 0;
  const isOverdue = goal.is_overdue;

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-md transition-shadow p-4"
    >
      <div className="mb-2">
        <Chip label={goal.type} size="small" color="primary" />
        {isOverdue && <Chip label="Overdue" size="small" color="error" className="ml-2" />}
      </div>

      <h4 className="font-semibold mb-2">{goal.description}</h4>

      {goal.progress_percentage !== null && (
        <div className="mb-2">
          <LinearProgress value={progress} className="mb-1" />
          <div className="text-sm text-gray-600">
            {progress.toFixed(0)}% complete
          </div>
        </div>
      )}

      {goal.target_value && (
        <div className="text-sm text-gray-600">
          Target: {goal.target_value} {goal.unit}
          {goal.current_value && ` | Current: ${goal.current_value} ${goal.unit}`}
        </div>
      )}

      {goal.deadline && (
        <div className="text-sm text-gray-500 mt-2">
          Due: {new Date(goal.deadline).toLocaleDateString()}
          {goal.days_remaining !== null && ` (${goal.days_remaining} days)`}
        </div>
      )}
    </Card>
  );
}
```

**Key Implementation Notes:**
- Kanban board with drag-and-drop using `react-beautiful-dnd`
- Three columns: To Do, In Progress, Done
- Progress bar with percentage
- Overdue indicator (red chip)
- Days remaining display

---

### Testing Requirements

#### E2E Test

```typescript
// packages/web/tests/e2e/memory/goal-workflow.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Goal Tracking Workflow", () => {
  test("User can create, update progress, and complete goal", async ({ page }) => {
    await page.goto("/memory/goals");

    // Create goal
    await page.click('button:has-text("Add Goal")');
    await page.fill('input[name="description"]', "Run 10km");
    await page.selectOption('select[name="type"]', "health");
    await page.fill('input[name="target_value"]', "10");
    await page.fill('input[name="current_value"]', "0");
    await page.fill('input[name="unit"]', "km");
    await page.fill('input[name="deadline"]', "2025-12-31");
    await page.click('button[type="submit"]');

    // Verify appears in "To Do" column
    await expect(page.locator('text="Run 10km"')).toBeVisible();
    await expect(page.locator('text="To Do"').locator('..').locator('text="Run 10km"')).toBeVisible();

    // Click goal to open detail
    await page.click('text="Run 10km"');

    // Update progress
    await page.click('button:has-text("Update Progress")');
    await page.fill('input[name="current_value"]', "5");
    await page.click('button:has-text("Save")');

    // Verify progress bar shows 50%
    await expect(page.locator('text="50% complete"')).toBeVisible();

    // Drag to "Done" column
    await page.dragAndDrop(
      'text="Run 10km"',
      '.column-done' // Assuming class name
    );

    // Verify appears in "Done" column
    await expect(page.locator('text="Done"').locator('..').locator('text="Run 10km"')).toBeVisible();
  });

  test("Extract goal from conversation", async ({ page }) => {
    await page.goto("/chat");

    // Send message with goal
    await page.fill('textarea', "I want to lose 5kg by June next year.");
    await page.keyboard.press("Enter");

    await page.waitForTimeout(3000); // Wait for extraction

    // Navigate to goals
    await page.goto("/memory/goals");

    // Verify goal extracted
    await expect(page.locator('text="lose 5kg"')).toBeVisible();
    await expect(page.locator('text="health"')).toBeVisible();
  });
});
```

---

## Implementation Guidelines

### Must Follow

1. **Feature Flag:**
   - Flag name: `ENABLE_GOAL_ENTITY`
   - Default: disabled

2. **Progress Calculation:**
   - Handle numeric and non-numeric values gracefully
   - Return `None` for progress_percentage if not calculable

3. **Status Transitions:**
   - Auto-transition TODO → IN_PROGRESS on first progress update
   - Manual transition to DONE via drag-and-drop or button

4. **Code Quality:**
   - Type hints on all functions
   - No `any` types in TypeScript

### Must NOT Do

- ❌ Overwrite AI properties on update
- ❌ Skip tests
- ❌ Hard-code status values (use enums)

---

## Dependencies & Prerequisites

**Required Before Starting:**
- [x] Package 1.2 (User Entity) completed
- [x] Packages 2.1, 2.2 (Person, Organization) completed (pattern reference)
- [ ] Feature flag `ENABLE_GOAL_ENTITY` added
- [ ] `react-beautiful-dnd` installed for drag-and-drop

---

## Verification Checklist

### Functionality
- [ ] Goal CRUD works via API
- [ ] Progress update works
- [ ] Status transitions work (drag-and-drop)
- [ ] Progress percentage calculated correctly
- [ ] LLM extraction works
- [ ] UI Kanban board displays with 3 columns
- [ ] User story fully implemented

### Testing
- [ ] Unit tests pass (>80% coverage)
- [ ] Integration tests pass
- [ ] E2E test passes (create → progress → complete)
- [ ] E2E test passes (LLM extraction)

### Documentation
- [ ] Goal tracking guide added
- [ ] Progress calculation documented
- [ ] Migration notes documented

---

## Success Criteria

This package is **successfully implemented** when:

1. ✅ User can chat "I want to lose 5kg by June" and see goal in /memory/goals
2. ✅ User can create goal manually with target/current/deadline
3. ✅ User can update progress and see progress bar
4. ✅ User can drag-and-drop goals between status columns
5. ✅ User can mark goal as complete
6. ✅ All tests pass
7. ✅ Deployed to dev with feature flag OFF
8. ✅ Documentation updated

---

**Prompt Version:** 1.0
**Generated:** 2025-11-21
**Target Package:** 2.3

---

**END OF IMPLEMENTATION PROMPT**

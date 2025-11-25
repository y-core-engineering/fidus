# Implementation Prompt: 3.3 - PURSUES Relationship with Goal Tracking

**Package:** 3.3
**Epic:** Core Relationships & Graph Visualization
**Priority:** 🔴 CRITICAL
**Context Document:** `/docs/prototypes/fidus-memory/migration-v3-wbs.md` (Lines 667-714)

---

## Role

You are a **Senior Full-Stack Software Engineer** implementing graph relationships with Qdrant-First pattern, context-based ML analysis, and React-based data visualization.

---

## Context & Background

**Current State:**
- ✅ Package 1.1 (Qdrant-First) completed
- ✅ Package 1.2 (User entity) completed
- ✅ Package 2.3 (Goal entity) completed: Goals can be tracked with progress
- ✅ Package 3.1, 3.2 (KNOWS, WORKS_AT) completed: Base relationship pattern established
- ❌ No link between User and Goal entities
- ❌ No context-based goal progress analysis

**Migration Goal:**
- Implement PURSUES relationship connecting User to Goal
- Track contextual factors affecting goal progress (motivation, obstacles, strategies)
- Analyze patterns: when/where/how user makes progress
- Build UI showing context insights ("You're most productive in mornings")

**Architecture References:**
- Solution Architecture: `/docs/solution-architecture/15-entity-management.md`
- ADR-0001: `/docs/adr/ADR-0001-situational-context-as-relationship-qualifier.md` (Qdrant-First Pattern)
- ADR-0002: `/docs/adr/ADR-0002-property-placement-and-geospatial-exception.md` (Property Placement Strategy)
- Base Relationship Pattern: `packages/api/fidus/memory/entities/relationship.py` (from Package 3.1)

---

## Your Task

Implement **PURSUES Relationship with Goal Tracking** according to the specifications below.

**User Story:**
As a user, I want to link my goals to my activities and see how contextual factors affect my progress.

**Acceptance Criteria:**
1. Backend: PURSUES relationship with ADR-0002 compliant property placement
2. Backend: Neo4j stores ONLY structural + temporal properties (relationship_instance_id, situation_id, started_at, target_date, ended_at, observed_at, confidence, source)
3. Backend: Qdrant stores ALL context properties (motivation_level, obstacles, strategies, progress_value)
4. Backend: Temporal boundaries (started_at, target_date, ended_at) enable efficient "goals active during period X" queries
5. API: PURSUES CRUD endpoints operational
6. Frontend: Goal detail shows related context patterns
7. Frontend: Insights panel: "You make most progress in mornings"
8. Tests: Track goal progress with varying contexts - all passing
9. Documentation: Goal-context correlation guide updated with ADR-0002 references

---

## Technical Specification

### Backend Implementation

**File: `packages/api/fidus/memory/relationships/pursues.py`**

```python
from datetime import datetime, date
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

from fidus.memory.entities.relationship import RelationshipBase


class PursuesRelationship(RelationshipBase):
    """
    PURSUES relationship connecting User to Goal.

    Following ADR-0002: Temporal boundaries (started_at, target_date, ended_at) in Neo4j.
    Context properties (motivation_level, obstacles, strategies) in Qdrant ONLY.
    """
    # Entity references (structural)
    user_id: str
    goal_id: str

    # Temporal boundaries (ADR-0002: stored in Neo4j for efficient queries)
    started_at: date = Field(..., description="When goal pursuit began")
    target_date: Optional[date] = Field(None, description="Goal deadline or target date")
    ended_at: Optional[date] = Field(None, description="When goal completed/abandoned (null = still pursuing)")

    @property
    def is_active(self) -> bool:
        """Check if this is an active goal pursuit."""
        return self.ended_at is None

    @property
    def duration_days(self) -> int:
        """Calculate goal pursuit duration in days."""
        from datetime import datetime
        end = datetime.combine(self.ended_at, datetime.min.time()) if self.ended_at else datetime.utcnow()
        start = datetime.combine(self.started_at, datetime.min.time())
        return (end - start).days

    class Config:
        json_schema_extra = {
            "example": {
                "relationship_instance_id": "550e8400-e29b-41d4-a716-446655440000",
                "situation_id": "sit_pursue_123",
                "user_id": "user_123",
                "goal_id": "goal_learn_spanish",
                "started_at": "2025-01-01",
                "target_date": "2025-12-31",
                "ended_at": None,
                "observed_at": "2025-11-21T10:30:00Z",
                "confidence": 0.9,
                "source": "explicit"
            }
        }


class PursuesContext(BaseModel):
    """
    Context properties for PURSUES relationships (stored in Qdrant).

    Following ADR-0002: ALL descriptive/contextual properties in Qdrant.
    Temporal boundaries copied here for completeness.
    """
    motivation_level: Optional[str] = Field(
        None,
        description="Motivation level: high, medium, low"
    )
    obstacles: List[str] = Field(
        default_factory=list,
        description="Current obstacles or challenges"
    )
    strategies: List[str] = Field(
        default_factory=list,
        description="Strategies or methods being used"
    )
    progress_value: Optional[float] = Field(
        None,
        description="Progress at time of observation (0.0-1.0)"
    )

    # Temporal boundaries (copied from Neo4j for completeness)
    started_at: str = Field(..., description="Goal pursuit start date ISO format")
    target_date: Optional[str] = Field(None, description="Goal deadline ISO format")
    ended_at: Optional[str] = Field(None, description="Goal completion/abandonment date ISO format")

    # Flexible context factors (mood, location, activity, etc.)
    context: Dict[str, Any] = Field(default_factory=dict)
```

**File: `packages/api/fidus/memory/services/pursues_relationship_service.py`**

```python
from typing import Dict, Any, List, Optional
from uuid import uuid4
from datetime import datetime, date
from collections import Counter
import logging

from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, Filter, FieldCondition, MatchValue
from neo4j import AsyncDriver

from fidus.memory.relationships.pursues import PursuesRelationship
from fidus.memory.entities.relationship import RelationshipContext

logger = logging.getLogger(__name__)


class PursuesRelationshipService:
    """
    Service for managing PURSUES relationships with context-based progress analysis.
    """

    def __init__(self, qdrant: QdrantClient, neo4j: AsyncDriver):
        self.qdrant = qdrant
        self.neo4j = neo4j
        self.collection_name = "situations"

    async def create_pursues_relationship(
        self,
        tenant_id: str,
        user_id: str,
        goal_id: str,
        started_at: Optional[datetime] = None,
        target_date: Optional[datetime] = None,
        ended_at: Optional[datetime] = None,
        motivation_level: Optional[str] = None,
        obstacles: Optional[List[str]] = None,
        strategies: Optional[List[str]] = None,
        progress_value: Optional[float] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> PursuesRelationship:
        """
        Create PURSUES relationship with Qdrant-First pattern.

        Args:
            tenant_id: Tenant identifier
            user_id: User entity ID
            goal_id: Goal entity ID
            started_at: When goal pursuit began (defaults to now)
            target_date: Goal deadline or target date
            ended_at: When goal completed/abandoned (None = still pursuing)
            motivation_level: Motivation level (high, medium, low)
            obstacles: List of current obstacles or challenges
            strategies: List of strategies or methods being used
            progress_value: Progress at time of observation (0.0-1.0)
            context: Additional context (mood, location, activity, etc.)

        Returns:
            PursuesRelationship with situation_id populated
        """
        situation_id = f"sit_{uuid4().hex}"
        relationship_instance_id = uuid4()
        started_at = started_at or datetime.utcnow()

        # Build context payload
        context_data = RelationshipContext(
            tenant_id=tenant_id,
            user_id=user_id,
            entity_id=goal_id,
            relationship_type="PURSUES",
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
                    "entity_id": goal_id,
                    "relationship_type": "PURSUES",
                    "relationship_instance_id": str(relationship_instance_id),
                    "motivation_level": motivation_level,
                    "obstacles": obstacles or [],
                    "strategies": strategies or [],
                    "progress_value": progress_value,
                    "started_at": started_at.isoformat(),
                    "target_date": target_date.isoformat() if target_date else None,
                    "ended_at": ended_at.isoformat() if ended_at else None,
                    "context": context or {},
                    "created_at": datetime.utcnow().isoformat()
                }
            )

            await self.qdrant.upsert(
                collection_name=self.collection_name,
                points=[point]
            )

            logger.info(f"Stored goal pursuit context in Qdrant: {situation_id}")

        except Exception as e:
            logger.error(f"Qdrant storage failed: {e}")
            raise RuntimeError(f"Qdrant storage failed: {e}")

        # Step 2: Create Neo4j relationship (SECONDARY)
        # Following ADR-0002: ONLY structural + temporal boundary properties
        try:
            query = """
            MATCH (u:User {id: $user_id, tenant_id: $tenant_id})
            MATCH (g:Goal {id: $goal_id, tenant_id: $tenant_id})
            CREATE (u)-[r:PURSUES {
                relationship_instance_id: $rel_id,
                situation_id: $sit_id,
                started_at: date($started_at),
                target_date: CASE WHEN $target_date IS NOT NULL THEN date($target_date) ELSE NULL END,
                ended_at: CASE WHEN $ended_at IS NOT NULL THEN date($ended_at) ELSE NULL END,
                observed_at: datetime(),
                confidence: $confidence,
                source: $source
            }]->(g)
            RETURN r
            """

            async with self.neo4j.session() as session:
                await session.run(
                    query,
                    tenant_id=tenant_id,
                    user_id=user_id,
                    goal_id=goal_id,
                    rel_id=str(relationship_instance_id),
                    sit_id=situation_id,
                    started_at=started_at.isoformat() if isinstance(started_at, datetime) else started_at.strftime('%Y-%m-%d'),
                    target_date=target_date.isoformat() if target_date and isinstance(target_date, datetime) else (target_date.strftime('%Y-%m-%d') if target_date else None),
                    ended_at=ended_at.isoformat() if ended_at and isinstance(ended_at, datetime) else (ended_at.strftime('%Y-%m-%d') if ended_at else None),
                    confidence=0.9,
                    source="explicit"
                )

            logger.info(f"Created Neo4j PURSUES: {relationship_instance_id}")

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
        return PursuesRelationship(
            relationship_instance_id=relationship_instance_id,
            situation_id=situation_id,
            user_id=user_id,
            goal_id=goal_id,
            started_at=started_at if isinstance(started_at, date) else started_at.date(),
            target_date=target_date.date() if target_date and isinstance(target_date, datetime) else target_date,
            ended_at=ended_at.date() if ended_at and isinstance(ended_at, datetime) else ended_at,
            observed_at=datetime.utcnow(),
            confidence=0.9,
            source="explicit"
        )

    async def analyze_context_patterns(
        self,
        tenant_id: str,
        user_id: str,
        goal_id: str,
        min_samples: int = 10
    ) -> Dict[str, Any]:
        """
        Analyze contextual patterns affecting goal progress.

        Returns insights like:
        - Most productive time_of_day
        - Best location for progress
        - Most effective strategies
        - Common obstacles
        """
        # Query all PURSUES contexts for this goal
        results = await self.qdrant.scroll(
            collection_name=self.collection_name,
            scroll_filter=Filter(
                must=[
                    FieldCondition(key="tenant_id", match=MatchValue(value=tenant_id)),
                    FieldCondition(key="user_id", match=MatchValue(value=user_id)),
                    FieldCondition(key="entity_id", match=MatchValue(value=goal_id)),
                    FieldCondition(key="relationship_type", match=MatchValue(value="PURSUES"))
                ]
            ),
            limit=100
        )

        points = results[0]

        if len(points) < min_samples:
            return {
                "status": "insufficient_data",
                "message": f"Need at least {min_samples} data points, have {len(points)}",
                "insights": []
            }

        # Analyze patterns
        time_of_day_counts = Counter()
        location_counts = Counter()
        mood_counts = Counter()
        strategy_counts = Counter()
        obstacle_counts = Counter()

        progress_by_time = {}
        progress_by_location = {}
        progress_by_mood = {}

        for point in points:
            payload = point.payload
            context = payload.get("context", {})
            progress = payload.get("progress_value", 0)

            # Count occurrences
            if tod := context.get("time_of_day"):
                time_of_day_counts[tod] += 1
                progress_by_time.setdefault(tod, []).append(progress)

            if loc := context.get("location"):
                location_counts[loc] += 1
                progress_by_location.setdefault(loc, []).append(progress)

            if mood := context.get("mood"):
                mood_counts[mood] += 1
                progress_by_mood.setdefault(mood, []).append(progress)

            for strategy in payload.get("strategies", []):
                strategy_counts[strategy] += 1

            for obstacle in payload.get("obstacles", []):
                obstacle_counts[obstacle] += 1

        # Generate insights
        insights = []

        # Best time of day (highest average progress)
        if progress_by_time:
            best_time = max(progress_by_time.items(), key=lambda x: sum(x[1]) / len(x[1]))
            insights.append({
                "type": "time_optimization",
                "message": f"You make most progress in {best_time[0]}",
                "confidence": min(len(best_time[1]) / min_samples, 1.0),
                "evidence": {
                    "time_of_day": best_time[0],
                    "average_progress": sum(best_time[1]) / len(best_time[1]),
                    "sample_size": len(best_time[1])
                }
            })

        # Best location
        if progress_by_location:
            best_location = max(progress_by_location.items(), key=lambda x: sum(x[1]) / len(x[1]))
            insights.append({
                "type": "location_optimization",
                "message": f"You're most productive at {best_location[0]}",
                "confidence": min(len(best_location[1]) / min_samples, 1.0),
                "evidence": {
                    "location": best_location[0],
                    "average_progress": sum(best_location[1]) / len(best_location[1]),
                    "sample_size": len(best_location[1])
                }
            })

        # Most effective strategies
        if strategy_counts:
            top_strategy = strategy_counts.most_common(1)[0]
            insights.append({
                "type": "strategy_effectiveness",
                "message": f"Most frequently used strategy: {top_strategy[0]}",
                "confidence": min(top_strategy[1] / len(points), 1.0),
                "evidence": {
                    "strategy": top_strategy[0],
                    "frequency": top_strategy[1],
                    "total_observations": len(points)
                }
            })

        # Common obstacles
        if obstacle_counts:
            top_obstacle = obstacle_counts.most_common(1)[0]
            insights.append({
                "type": "obstacle_awareness",
                "message": f"Most common obstacle: {top_obstacle[0]}",
                "confidence": min(top_obstacle[1] / len(points), 1.0),
                "evidence": {
                    "obstacle": top_obstacle[0],
                    "frequency": top_obstacle[1]
                }
            })

        return {
            "status": "success",
            "sample_size": len(points),
            "insights": insights,
            "raw_data": {
                "time_of_day_distribution": dict(time_of_day_counts),
                "location_distribution": dict(location_counts),
                "mood_distribution": dict(mood_counts),
                "top_strategies": strategy_counts.most_common(5),
                "top_obstacles": obstacle_counts.most_common(5)
            }
        }

    async def get_goals_active_during_period(
        self,
        tenant_id: str,
        user_id: str,
        start_date: date,
        end_date: date
    ) -> List[Dict[str, Any]]:
        """
        Temporal Query Pattern (ADR-0002): Find goals pursued during a date range.

        This demonstrates WHY temporal boundaries are stored in Neo4j:
        Efficient date range queries without full Qdrant scan.

        Example: "Which goals was I working on in Q1 2025?"
        """
        query = """
        MATCH (u:User {id: $user_id, tenant_id: $tenant_id})-[r:PURSUES]->(g:Goal)
        WHERE r.started_at <= date($end_date)
          AND (r.ended_at IS NULL OR r.ended_at >= date($start_date))
        RETURN
            r.relationship_instance_id AS rel_id,
            r.situation_id AS sit_id,
            r.started_at AS started_at,
            r.target_date AS target_date,
            r.ended_at AS ended_at,
            r.confidence AS confidence,
            g.id AS goal_id,
            g.title AS goal_title
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
                    "goal_id": record["goal_id"],
                    "goal_title": record["goal_title"],
                    "started_at": record["started_at"],
                    "target_date": record["target_date"],
                    "ended_at": record["ended_at"],
                    "confidence": record["confidence"],
                    # Context from Qdrant
                    "motivation_level": context.get("motivation_level"),
                    "obstacles": context.get("obstacles", []),
                    "strategies": context.get("strategies", []),
                    "progress_value": context.get("progress_value")
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

**File: `packages/api/fidus/memory/routes/pursues_routes.py`**

```python
from typing import Optional, List
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from fidus.memory.services.pursues_relationship_service import PursuesRelationshipService
from fidus.memory.relationships.pursues import PursuesRelationship
from fidus.dependencies import get_qdrant_client, get_neo4j_driver, get_current_user

router = APIRouter(prefix="/api/memory/relationships/pursues", tags=["relationships"])


class CreatePursuesRequest(BaseModel):
    user_id: str
    goal_id: str
    started_at: Optional[datetime] = None
    target_date: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    motivation_level: Optional[str] = None
    obstacles: Optional[List[str]] = None
    strategies: Optional[List[str]] = None
    progress_value: Optional[float] = None
    context: Optional[dict] = None


@router.post("", response_model=PursuesRelationship)
async def create_pursues_relationship(
    request: CreatePursuesRequest,
    service: PursuesRelationshipService = Depends(lambda: PursuesRelationshipService(
        qdrant=get_qdrant_client(),
        neo4j=get_neo4j_driver()
    )),
    current_user = Depends(get_current_user)
):
    """
    Create PURSUES relationship with goal context.

    Tracks goal pursuit with temporal boundaries and contextual factors.
    """
    try:
        return await service.create_pursues_relationship(
            tenant_id=current_user.tenant_id,
            user_id=request.user_id,
            goal_id=request.goal_id,
            started_at=request.started_at,
            target_date=request.target_date,
            ended_at=request.ended_at,
            motivation_level=request.motivation_level,
            obstacles=request.obstacles,
            strategies=request.strategies,
            progress_value=request.progress_value,
            context=request.context
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/insights")
async def get_goal_insights(
    goal_id: str,
    user_id: str,
    service: PursuesRelationshipService = Depends(lambda: PursuesRelationshipService(
        qdrant=get_qdrant_client(),
        neo4j=get_neo4j_driver()
    )),
    current_user = Depends(get_current_user)
):
    """
    Get context-based insights for goal.

    Analyzes patterns to identify optimal conditions for progress.
    """
    try:
        return await service.analyze_context_patterns(
            tenant_id=current_user.tenant_id,
            user_id=user_id,
            goal_id=goal_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

### Frontend Implementation

**Component: `packages/web/src/components/memory/ContextInsights.tsx`**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Card, Badge } from '@fidus/ui';
import { getGoalInsights } from '@/lib/api/memory';

interface Insight {
  type: string;
  message: string;
  confidence: number;
  evidence: any;
}

interface ContextInsightsProps {
  goalId: string;
  userId: string;
}

export function ContextInsights({ goalId, userId }: ContextInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    loadInsights();
  }, [goalId]);

  async function loadInsights() {
    try {
      const data = await getGoalInsights(goalId, userId);
      setStatus(data.status);
      setInsights(data.insights || []);
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Card>Analyzing patterns...</Card>;

  if (status === 'insufficient_data') {
    return (
      <Card className="p-4 bg-blue-50">
        <p className="text-sm text-blue-800">
          Keep tracking your progress! We need at least 10 data points to generate insights.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Context Insights</h3>

      <div className="space-y-3">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{insight.message}</p>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {insight.type === 'time_optimization' && (
                    <Badge variant="info">
                      🕐 {insight.evidence.time_of_day}
                    </Badge>
                  )}
                  {insight.type === 'location_optimization' && (
                    <Badge variant="success">
                      📍 {insight.evidence.location}
                    </Badge>
                  )}
                  {insight.type === 'strategy_effectiveness' && (
                    <Badge variant="warning">
                      ⚡ {insight.evidence.strategy}
                    </Badge>
                  )}
                  {insight.type === 'obstacle_awareness' && (
                    <Badge variant="error">
                      ⚠️ {insight.evidence.obstacle}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="ml-4">
                <div className="text-xs text-gray-500">
                  Confidence: {(insight.confidence * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {insight.evidence.sample_size && (
              <p className="text-xs text-gray-500 mt-2">
                Based on {insight.evidence.sample_size} observations
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
```

**Update GoalDetail Component:**

```typescript
// packages/web/src/components/memory/GoalDetail.tsx

import { ContextInsights } from './ContextInsights';

export function GoalDetail({ goalId, userId }: { goalId: string; userId: string }) {
  return (
    <div className="space-y-6">
      {/* Existing goal details */}

      {/* Add insights panel */}
      <ContextInsights goalId={goalId} userId={userId} />

      {/* Existing progress chart */}
    </div>
  );
}
```

**API Client:**

```typescript
// packages/web/src/lib/api/memory.ts

export async function getGoalInsights(goalId: string, userId: string) {
  const response = await fetch(
    `${API_BASE}/api/memory/relationships/pursues/insights?goal_id=${goalId}&user_id=${userId}`,
    { credentials: 'include' }
  );

  if (!response.ok) throw new Error('Failed to load insights');
  return response.json();
}
```

---

### Testing Requirements

**Integration Test:**

```python
@pytest.mark.asyncio
async def test_context_pattern_analysis():
    """Test insight generation from goal progress contexts."""
    service = PursuesRelationshipService(qdrant=real_qdrant, neo4j=real_neo4j)

    # Create 15 progress updates with varying contexts
    for i in range(15):
        await service.create_pursues_relationship(
            tenant_id="tenant_123",
            user_id="user_456",
            goal_id="goal_spanish",
            motivation_level="high" if i % 2 == 0 else "medium",
            strategies=["daily practice"],
            progress_value=0.1 * i,
            context={
                "time_of_day": "morning" if i < 10 else "evening",
                "location": "home",
                "mood": "focused"
            }
        )

    # Analyze patterns
    insights = await service.analyze_context_patterns(
        tenant_id="tenant_123",
        user_id="user_456",
        goal_id="goal_spanish"
    )

    assert insights["status"] == "success"
    assert len(insights["insights"]) > 0

    # Should identify "morning" as best time
    time_insight = next(i for i in insights["insights"] if i["type"] == "time_optimization")
    assert "morning" in time_insight["message"].lower()
```

**E2E Test:**

```typescript
test('User sees context insights for goal', async ({ page }) => {
  await page.goto('/memory/goals/goal_spanish');

  // Wait for insights to load
  const insightsPanel = page.locator('[data-testid="context-insights"]');
  await expect(insightsPanel).toBeVisible();

  // Should show time insight
  await expect(insightsPanel).toContainText('most progress');

  // Should show confidence score
  await expect(insightsPanel).toContainText('Confidence:');

  // Should show based on X observations
  await expect(insightsPanel).toContainText('observations');
});
```

---

## Implementation Guidelines

### Must Follow

1. **ADR-0002 Compliance:**
   - Neo4j stores ONLY: relationship_instance_id, situation_id, started_at, target_date, ended_at, observed_at, confidence, source
   - Qdrant stores ALL context: motivation_level, obstacles, strategies, progress_value, plus flexible context dictionary
   - Temporal boundaries enable efficient "goals active during period X" queries

2. **Qdrant-First Pattern:** Store goal context in Qdrant before creating Neo4j relationship

3. **Feature Flag:** `ENABLE_PURSUES_RELATIONSHIP` - default disabled

4. **Multi-Tenancy:** Filter all queries by `tenant_id`

5. **Temporal Integrity:**
   - Validate `started_at <= target_date` (if both provided)
   - Validate `started_at <= ended_at` (if both provided)

6. **Minimum Sample Size:** Do not generate insights with <10 data points (configurable)

7. **Confidence Scoring:** Always show confidence based on sample size

8. **Statistical Validity:** Avoid spurious correlations (e.g., require minimum frequency)

9. **Privacy:** Never expose raw context data to other users (multi-tenancy)

### Must NOT Do

- ❌ Store context properties (motivation_level, obstacles, strategies, progress_value) in Neo4j
- ❌ Store only temporal boundaries in Qdrant without context
- ❌ Allow `started_at` in future
- ❌ Allow `ended_at` before `started_at`
- ❌ Skip rollback on Neo4j failure
- ❌ Generate insights from insufficient data
- ❌ Make causal claims ("X causes Y") - use correlational language
- ❌ Hard-code insight thresholds
- ❌ Skip confidence scoring

---

## Dependencies & Prerequisites

- [x] Package 1.1: Qdrant-First
- [x] Package 1.2: User entity
- [x] Package 2.3: Goal entity
- [x] Package 3.1: Base relationship pattern
- [ ] Feature flag: `ENABLE_PURSUES_RELATIONSHIP`

---

## Success Criteria

1. ✅ User can track goal progress with context
2. ✅ Insights panel shows patterns after 10+ observations
3. ✅ Insights include time/location/strategy recommendations
4. ✅ Confidence scores displayed
5. ✅ All tests pass

---

**Prompt Version:** 1.0
**Generated:** 2025-11-21
**Target Package:** 3.3

---

**END OF IMPLEMENTATION PROMPT**

# Implementation Prompt: 4.4 - LangGraph Orchestration Engine

**Package:** 4.4
**Epic:** Extended Entities & Orchestration
**Priority:** 🟡 MEDIUM
**Context Document:** `/docs/prototypes/fidus-memory/migration-v3-wbs.md` (Lines 986-1036)

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
- ✅ Packages 2.1-2.3 (Core entities) completed: Person, Organization, Goal entities exist
- ✅ Packages 3.1-3.5 (Core relationships) completed: All relationship types operational
- ✅ Packages 4.1-4.3 (Extended entities) completed: Habit, Event, and their relationships exist
- ❌ Current implementation uses direct LLM calls without orchestration
- ❌ No multi-step reasoning or error recovery logic
- ❌ No rollback mechanism for failed entity extractions
- ❌ Limited ability to handle complex, multi-entity conversations

**Migration Goal:**
- Replace direct LLM calls with LangGraph state machine
- Implement multi-step reasoning: analyze → extract → validate → store
- Add error handling and rollback logic
- Enable complex workflows (e.g., extracting multiple entities from one message)
- Improve observability and debugging of agent behavior
- Prepare foundation for future advanced workflows (planning, multi-turn reasoning)

**Architecture References:**
- Solution Architecture: `/docs/solution-architecture/16-orchestration.md`
- LangGraph Documentation: https://langchain-ai.github.io/langgraph/
- Current Simple Agent: `packages/api/fidus/memory/agents/simple_agent.py`

---

## Your Task

Implement **LangGraph Orchestration Engine** according to the specifications below.

**User Story:**
As a system architect, I want to replace direct LLM calls with a LangGraph state machine for better error handling, rollback, and multi-step reasoning.

**Acceptance Criteria:**
1. Backend: LangGraph state machine implemented in `orchestrator.py`
2. Backend: States defined: analyze_request → extract_entities → extract_relationships → store_context
3. Backend: Rollback logic functional (on failures, cleanup Qdrant/Neo4j)
4. API: Orchestrator replaces simple_agent in chat endpoint
5. Frontend: No changes required (transparent backend upgrade)
6. Tests: Multi-step workflow tests passing
7. Tests: Rollback scenario verified (simulate Neo4j failure, check Qdrant cleanup)
8. Documentation: Orchestration architecture guide created with Mermaid diagrams

---

## Technical Specification

### Backend Implementation

**Files to Create:**

1. **`packages/api/fidus/memory/orchestrator.py`**
   - Purpose: LangGraph state machine for memory agent
   - Contains: State definition, node implementations, graph construction

2. **`packages/api/fidus/memory/orchestrator_nodes.py`**
   - Purpose: Individual node implementations
   - Contains: analyze_request, extract_entities, extract_relationships, store_context, handle_error

3. **`packages/api/fidus/memory/orchestrator_state.py`**
   - Purpose: State model for LangGraph
   - Contains: MemoryAgentState with all fields

**Detailed Implementation:**

#### 1. State Model (`packages/api/fidus/memory/orchestrator_state.py`)

```python
from typing import TypedDict, List, Dict, Any, Optional, Literal
from pydantic import BaseModel


class Message(BaseModel):
    """Message in conversation."""
    role: Literal["user", "assistant", "system"]
    content: str


class ExtractedEntity(BaseModel):
    """Extracted entity from conversation."""
    entity_type: str  # "person", "organization", "goal", "habit", "event"
    entity_data: Dict[str, Any]
    confidence: float


class ExtractedRelationship(BaseModel):
    """Extracted relationship from conversation."""
    relationship_type: str  # "KNOWS", "WORKS_AT", etc.
    from_entity: str
    to_entity: str
    context: Dict[str, Any]
    confidence: float


class MemoryAgentState(TypedDict):
    """
    State for LangGraph orchestrator.

    This state is passed between nodes and accumulates results.
    """
    # Input
    messages: List[Message]
    user_id: str
    tenant_id: str

    # Analysis
    intent: Optional[str]  # "extract", "query", "update", "delete"
    entities_to_extract: List[str]  # ["person", "organization"]
    relationships_to_extract: List[str]  # ["KNOWS", "WORKS_AT"]

    # Extracted data
    extracted_entities: List[ExtractedEntity]
    extracted_relationships: List[ExtractedRelationship]

    # Storage results
    stored_entity_ids: Dict[str, str]  # entity_type -> entity_id
    stored_situation_ids: List[str]

    # Error handling
    errors: List[str]
    rollback_performed: bool

    # Response
    response_message: Optional[str]
```

#### 2. Node Implementations (`packages/api/fidus/memory/orchestrator_nodes.py`)

```python
from typing import Dict, Any
from fidus.memory.orchestrator_state import MemoryAgentState, ExtractedEntity, ExtractedRelationship
from fidus.llm.client import LLMClient


class OrchestratorNodes:
    """
    Implementation of LangGraph nodes for memory orchestrator.
    """

    def __init__(
        self,
        llm_client: LLMClient,
        entity_services: Dict[str, Any],
        relationship_services: Dict[str, Any]
    ):
        self.llm = llm_client
        self.entity_services = entity_services
        self.relationship_services = relationship_services

    async def analyze_request(self, state: MemoryAgentState) -> MemoryAgentState:
        """
        Analyze user message to determine intent and what to extract.

        Returns:
            Updated state with intent and extraction targets
        """
        user_message = state["messages"][-1]["content"]

        prompt = f"""
        Analyze the following user message and determine:
        1. Intent: What does the user want? (extract, query, update, delete)
        2. What entities should be extracted? (person, organization, goal, habit, event)
        3. What relationships should be extracted? (KNOWS, WORKS_AT, PURSUES, HAS_HABIT, ATTENDS)

        User message: "{user_message}"

        Return JSON:
        {{
            "intent": "extract|query|update|delete",
            "entities_to_extract": ["person", "organization"],
            "relationships_to_extract": ["KNOWS", "WORKS_AT"]
        }}

        If no extraction needed, return empty lists.
        """

        response = await self.llm.generate_structured(
            prompt=prompt,
            schema={
                "type": "object",
                "properties": {
                    "intent": {"type": "string"},
                    "entities_to_extract": {"type": "array", "items": {"type": "string"}},
                    "relationships_to_extract": {"type": "array", "items": {"type": "string"}}
                },
                "required": ["intent", "entities_to_extract", "relationships_to_extract"]
            }
        )

        state["intent"] = response["intent"]
        state["entities_to_extract"] = response["entities_to_extract"]
        state["relationships_to_extract"] = response["relationships_to_extract"]

        return state

    async def extract_entities(self, state: MemoryAgentState) -> MemoryAgentState:
        """
        Extract entities based on analysis.

        Calls appropriate extractors in parallel.
        """
        entities_to_extract = state.get("entities_to_extract", [])
        if not entities_to_extract:
            return state

        user_message = state["messages"][-1]["content"]
        extracted_entities = []

        # Call extractors in parallel
        for entity_type in entities_to_extract:
            extractor = self.entity_services.get(f"{entity_type}_extractor")
            if not extractor:
                continue

            try:
                entity = await extractor.extract(
                    text=user_message,
                    user_id=state["user_id"],
                    tenant_id=state["tenant_id"]
                )

                if entity:
                    extracted_entities.append(ExtractedEntity(
                        entity_type=entity_type,
                        entity_data=entity.model_dump(),
                        confidence=0.9
                    ))
            except Exception as e:
                state["errors"].append(f"Failed to extract {entity_type}: {str(e)}")

        state["extracted_entities"] = extracted_entities
        return state

    async def extract_relationships(self, state: MemoryAgentState) -> MemoryAgentState:
        """
        Extract relationships based on extracted entities.

        Determines relationships between entities found in the message.
        """
        relationships_to_extract = state.get("relationships_to_extract", [])
        extracted_entities = state.get("extracted_entities", [])

        if not relationships_to_extract or len(extracted_entities) < 2:
            return state

        # Simplified: Extract relationships between first two entities
        # In production: Use more sophisticated logic
        extracted_relationships = []

        for rel_type in relationships_to_extract:
            # Placeholder: Implement relationship extraction logic
            # For now, assume relationship exists if both entities present
            pass

        state["extracted_relationships"] = extracted_relationships
        return state

    async def store_context(self, state: MemoryAgentState) -> MemoryAgentState:
        """
        Store extracted entities and relationships with Qdrant-First pattern.

        Implements rollback on failure.
        """
        stored_entity_ids = {}
        stored_situation_ids = []
        errors = []

        try:
            # Store entities
            for extracted in state.get("extracted_entities", []):
                entity_type = extracted.entity_type
                repository = self.entity_services.get(f"{entity_type}_repository")

                if not repository:
                    errors.append(f"No repository for {entity_type}")
                    continue

                try:
                    # Create entity
                    from fidus.memory.entities import ENTITY_CLASSES
                    EntityClass = ENTITY_CLASSES[entity_type]
                    entity = EntityClass(**extracted.entity_data)

                    created_entity = await repository.create(entity)
                    stored_entity_ids[entity_type] = str(created_entity.id)

                except Exception as e:
                    errors.append(f"Failed to store {entity_type}: {str(e)}")
                    raise  # Trigger rollback

            # Store relationships with Qdrant-First
            for rel in state.get("extracted_relationships", []):
                try:
                    rel_service = self.relationship_services.get(rel.relationship_type.lower())
                    if not rel_service:
                        continue

                    # Create relationship with context
                    relationship = await rel_service.create(
                        user_id=state["user_id"],
                        tenant_id=state["tenant_id"],
                        relationship_data=rel.context
                    )

                    stored_situation_ids.append(relationship.situation_id)

                except Exception as e:
                    errors.append(f"Failed to create {rel.relationship_type}: {str(e)}")
                    raise  # Trigger rollback

            state["stored_entity_ids"] = stored_entity_ids
            state["stored_situation_ids"] = stored_situation_ids
            state["errors"] = errors

        except Exception as e:
            # Trigger error handling node
            state["errors"].append(f"Storage failed: {str(e)}")
            raise

        return state

    async def handle_error(self, state: MemoryAgentState) -> MemoryAgentState:
        """
        Handle errors and perform rollback.

        Cleanup Qdrant and Neo4j if storage failed.
        """
        # Rollback: Delete stored entities
        for entity_type, entity_id in state.get("stored_entity_ids", {}).items():
            try:
                repository = self.entity_services.get(f"{entity_type}_repository")
                if repository:
                    await repository.delete(entity_id, state["tenant_id"])
            except Exception as e:
                state["errors"].append(f"Rollback failed for {entity_type}: {str(e)}")

        # Rollback: Delete Qdrant situations
        for situation_id in state.get("stored_situation_ids", []):
            try:
                # Delete from Qdrant
                from fidus.infrastructure.qdrant_client import get_qdrant_client
                qdrant = get_qdrant_client()
                await qdrant.delete(
                    collection_name="situations",
                    points_selector=[situation_id]
                )
            except Exception as e:
                state["errors"].append(f"Qdrant rollback failed: {str(e)}")

        state["rollback_performed"] = True
        return state

    async def generate_response(self, state: MemoryAgentState) -> MemoryAgentState:
        """Generate response message for user."""
        if state.get("rollback_performed"):
            state["response_message"] = "I encountered an error and couldn't save that information. Please try again."
            return state

        extracted_count = len(state.get("extracted_entities", []))
        if extracted_count > 0:
            entity_types = [e.entity_type for e in state["extracted_entities"]]
            state["response_message"] = f"Got it! I've saved {extracted_count} items: {', '.join(entity_types)}."
        else:
            state["response_message"] = "I understood your message."

        return state
```

#### 3. LangGraph Orchestrator (`packages/api/fidus/memory/orchestrator.py`)

```python
from typing import Dict, Any
from langgraph.graph import StateGraph, END
from fidus.memory.orchestrator_state import MemoryAgentState
from fidus.memory.orchestrator_nodes import OrchestratorNodes


class MemoryOrchestrator:
    """
    LangGraph-based orchestrator for memory agent.

    Replaces simple_agent.py with multi-step reasoning and error handling.
    """

    def __init__(
        self,
        llm_client,
        entity_services: Dict[str, Any],
        relationship_services: Dict[str, Any]
    ):
        self.nodes = OrchestratorNodes(llm_client, entity_services, relationship_services)
        self.graph = self._build_graph()

    def _build_graph(self) -> StateGraph:
        """
        Build LangGraph state machine.

        Flow:
        START → analyze_request → extract_entities → extract_relationships → store_context → generate_response → END
                                                                                ↓ (on error)
                                                                           handle_error → generate_response → END
        """
        workflow = StateGraph(MemoryAgentState)

        # Add nodes
        workflow.add_node("analyze_request", self.nodes.analyze_request)
        workflow.add_node("extract_entities", self.nodes.extract_entities)
        workflow.add_node("extract_relationships", self.nodes.extract_relationships)
        workflow.add_node("store_context", self.nodes.store_context)
        workflow.add_node("handle_error", self.nodes.handle_error)
        workflow.add_node("generate_response", self.nodes.generate_response)

        # Define edges
        workflow.set_entry_point("analyze_request")

        workflow.add_edge("analyze_request", "extract_entities")
        workflow.add_edge("extract_entities", "extract_relationships")

        # Conditional: If extraction intent, go to store_context; else skip to response
        workflow.add_conditional_edges(
            "extract_relationships",
            self._should_store,
            {
                "store": "store_context",
                "skip": "generate_response"
            }
        )

        # Conditional: If storage succeeds, generate response; if fails, handle error
        workflow.add_conditional_edges(
            "store_context",
            self._check_errors,
            {
                "success": "generate_response",
                "error": "handle_error"
            }
        )

        workflow.add_edge("handle_error", "generate_response")
        workflow.add_edge("generate_response", END)

        return workflow.compile()

    def _should_store(self, state: MemoryAgentState) -> str:
        """Determine if we should store data or skip."""
        if state.get("intent") == "extract" and (
            state.get("extracted_entities") or state.get("extracted_relationships")
        ):
            return "store"
        return "skip"

    def _check_errors(self, state: MemoryAgentState) -> str:
        """Check if errors occurred during storage."""
        if state.get("errors"):
            return "error"
        return "success"

    async def process(self, state: MemoryAgentState) -> MemoryAgentState:
        """
        Process a conversation turn through the orchestrator.

        Args:
            state: Initial state with messages, user_id, tenant_id

        Returns:
            Final state with response_message
        """
        # Initialize empty fields
        state.setdefault("errors", [])
        state.setdefault("rollback_performed", False)
        state.setdefault("extracted_entities", [])
        state.setdefault("extracted_relationships", [])
        state.setdefault("stored_entity_ids", {})
        state.setdefault("stored_situation_ids", [])

        # Run graph
        final_state = await self.graph.ainvoke(state)

        return final_state
```

---

### API Integration

**Files to Modify:**

1. **`packages/api/fidus/memory/agents/persistent_agent.py`**
   - Replace simple_agent with orchestrator
   - Add feature flag check

**Implementation:**

```python
# packages/api/fidus/memory/agents/persistent_agent.py

from fidus.memory.orchestrator import MemoryOrchestrator
from fidus.memory.agents.simple_agent import SimpleAgent
from fidus.config import FeatureFlags


class PersistentMemoryAgent:
    def __init__(self, ...):
        self.feature_flags = FeatureFlags()

        if self.feature_flags.USE_LANGGRAPH_ORCHESTRATOR:
            self.agent = MemoryOrchestrator(
                llm_client=llm_client,
                entity_services=entity_services,
                relationship_services=relationship_services
            )
        else:
            self.agent = SimpleAgent(...)

    async def process_message(self, message: str, user_id: str, tenant_id: str) -> str:
        """Process user message and return response."""
        if self.feature_flags.USE_LANGGRAPH_ORCHESTRATOR:
            state = {
                "messages": [{"role": "user", "content": message}],
                "user_id": user_id,
                "tenant_id": tenant_id
            }

            final_state = await self.agent.process(state)
            return final_state["response_message"]
        else:
            return await self.agent.process(message, user_id, tenant_id)
```

---

### Testing Requirements

**Unit Tests:**

```python
# packages/api/tests/unit/memory/test_orchestrator_nodes.py

import pytest
from fidus.memory.orchestrator_nodes import OrchestratorNodes


@pytest.mark.asyncio
async def test_analyze_request_extract_intent():
    """Test intent classification."""
    nodes = OrchestratorNodes(llm_client, {}, {})

    state = {
        "messages": [{"role": "user", "content": "I met Anna Schmidt today"}],
        "user_id": "user123",
        "tenant_id": "tenant456"
    }

    result = await nodes.analyze_request(state)

    assert result["intent"] == "extract"
    assert "person" in result["entities_to_extract"]
```

**Integration Tests:**

```python
# packages/api/tests/integration/memory/test_orchestrator.py

@pytest.mark.asyncio
async def test_multi_entity_extraction():
    """Test extracting multiple entities from one message."""
    orchestrator = MemoryOrchestrator(llm_client, entity_services, relationship_services)

    state = {
        "messages": [
            {"role": "user", "content": "I met Anna at Google to discuss my goal of learning Python"}
        ],
        "user_id": "user123",
        "tenant_id": "tenant456"
    }

    final_state = await orchestrator.process(state)

    # Should extract: Person (Anna), Organization (Google), Goal (learning Python)
    assert len(final_state["extracted_entities"]) >= 2
    assert final_state["response_message"] is not None


@pytest.mark.asyncio
async def test_rollback_on_neo4j_failure(mock_neo4j_failure):
    """Test rollback when Neo4j fails."""
    orchestrator = MemoryOrchestrator(llm_client, entity_services, relationship_services)

    state = {
        "messages": [{"role": "user", "content": "I met Bob"}],
        "user_id": "user123",
        "tenant_id": "tenant456"
    }

    final_state = await orchestrator.process(state)

    assert final_state["rollback_performed"] is True
    assert len(final_state["errors"]) > 0

    # Verify Qdrant cleanup
    # Check that situation_ids were deleted from Qdrant
```

---

## Implementation Guidelines

### Must Follow

1. **LangGraph Best Practices:**
   - Define state with TypedDict
   - Keep nodes pure (input state → output state)
   - Use conditional edges for branching logic
   - Always return to END node

2. **Error Handling:**
   - Catch exceptions in nodes
   - Add errors to state instead of raising
   - Implement rollback in handle_error node
   - Log all errors for debugging

3. **Feature Flag:**
   - All orchestrator usage behind `USE_LANGGRAPH_ORCHESTRATOR`
   - Default: False in production
   - Fallback to simple_agent if flag is off

4. **Performance:**
   - Run extractors in parallel where possible
   - Limit state size (avoid storing large payloads)
   - Add timeout for LLM calls

---

## Dependencies & Prerequisites

**Required Before Starting:**
- [x] All Epic 3 packages completed (entities and relationships exist)
- [ ] LangGraph installed: `poetry add langgraph`
- [ ] Feature flag `USE_LANGGRAPH_ORCHESTRATOR` added to config
- [ ] simple_agent.py exists as fallback reference

**Technical Dependencies:**
- LangGraph 0.2+
- LiteLLM client configured
- All entity and relationship services operational

---

## Step-by-Step Implementation Plan

### Phase 1: State & Nodes
1. Define MemoryAgentState TypedDict
2. Implement analyze_request node
3. Implement extract_entities node
4. Write unit tests for nodes

### Phase 2: Graph Construction
1. Build LangGraph workflow
2. Define conditional edges
3. Test graph execution

### Phase 3: Error Handling
1. Implement handle_error node
2. Add rollback logic
3. Test rollback scenario

### Phase 4: Integration
1. Replace simple_agent in persistent_agent
2. Add feature flag check
3. Write integration tests

### Phase 5: Documentation
1. Create architecture diagram (Mermaid)
2. Document state machine flow
3. Add troubleshooting guide

---

## Verification Checklist

### Functionality
- [ ] Orchestrator processes multi-entity messages
- [ ] Rollback works on Neo4j failure
- [ ] Feature flag toggle works
- [ ] Response messages generated correctly

### Code Quality
- [ ] All files created
- [ ] Type hints on all functions
- [ ] No linting errors

### Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Rollback test verified

### Documentation
- [ ] Architecture diagram created
- [ ] State machine documented
- [ ] Migration notes written

---

## Risk Mitigation

**Risks:**
- **Risk:** LangGraph adds latency overhead
  - Mitigation: Benchmark before/after, optimize node execution, add timeouts
- **Risk:** Increased complexity makes debugging harder
  - Mitigation: Add comprehensive logging, state inspection tools, graph visualization

---

## Success Criteria

1. ✅ LangGraph orchestrator processes complex messages
2. ✅ Multi-entity extraction works
3. ✅ Rollback functional on failures
4. ✅ All tests pass
5. ✅ Deployed with feature flag OFF

---

**Prompt Version:** 1.0
**Generated:** 2025-11-21
**Target Package:** 4.4

---

**END OF IMPLEMENTATION PROMPT**

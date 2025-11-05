from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from fidus.memory.simple_agent import InMemoryAgent
from fidus.memory.persistent_agent import PersistentAgent
from typing import Dict
import json
import logging
import traceback
import os

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/memory", tags=["memory"])

# Check if Neo4j is configured
USE_NEO4J = bool(os.getenv("NEO4J_URI"))

# Per-user agent cache (Phase 4: Multi-User Support)
# Key: user_id, Value: agent instance
_user_agents: Dict[str, InMemoryAgent | PersistentAgent] = {}


def get_user_agent(user_id: str) -> InMemoryAgent | PersistentAgent:
    """Get or create agent instance for a specific user.

    Phase 4: Multi-User Support
    - Each user gets their own agent instance for isolation
    - Agents are cached to maintain conversation history
    - PersistentAgent uses tenant_id = user_id for data isolation

    Args:
        user_id: User identifier from auth middleware

    Returns:
        Agent instance for this user
    """
    if user_id not in _user_agents:
        if USE_NEO4J:
            logger.info(f"Creating PersistentAgent for user: {user_id}")
            # Use user_id as tenant_id for data isolation in Neo4j
            agent = PersistentAgent(tenant_id=user_id)
        else:
            logger.info(f"Creating InMemoryAgent for user: {user_id}")
            agent = InMemoryAgent()

        _user_agents[user_id] = agent

    return _user_agents[user_id]


# Global agent for backwards compatibility with startup/shutdown events
# This is only used in main.py startup/shutdown, not in endpoints
if USE_NEO4J:
    logger.info("Using PersistentAgent with Neo4j (multi-user mode)")
    agent = PersistentAgent(tenant_id="default-tenant")
else:
    logger.info("Using InMemoryAgent (Neo4j not configured)")
    agent = InMemoryAgent()


class ChatRequest(BaseModel):
    user_id: str
    message: str


class ChatResponse(BaseModel):
    response: str


class PreferenceItem(BaseModel):
    id: str | None = None  # UUID from Neo4j (None for in-memory mode)
    key: str
    value: str
    sentiment: str  # "positive", "negative", or "neutral"
    confidence: float
    is_exception: bool = False
    domain: str | None = None  # Domain extracted from key (e.g., "food" from "food.pizza")
    created_at: str | None = None  # ISO timestamp
    updated_at: str | None = None  # ISO timestamp
    reinforcement_count: int = 0  # How many times user accepted this preference
    rejection_count: int = 0  # How many times user rejected this preference


class PreferencesResponse(BaseModel):
    preferences: list[PreferenceItem]


class AIConfigResponse(BaseModel):
    model: str
    provider: str  # "openai", "anthropic", "ollama", etc.
    is_local: bool  # True for Ollama, False for cloud providers


class ContextFactor(BaseModel):
    key: str
    value: str


class SituationItem(BaseModel):
    id: str
    tenant_id: str
    user_id: str
    factors: dict[str, str]  # Context factors
    preference_ids: list[str] = []  # Linked preference IDs
    created_at: str
    updated_at: str


class SituationsResponse(BaseModel):
    situations: list[SituationItem]


class PreferenceWithContext(BaseModel):
    preference: PreferenceItem
    situations: list[SituationItem]  # Situations where this preference was learned


@router.post("/chat")
async def chat_stream(chat_request: ChatRequest, request: Request):
    """Chat endpoint with SSE streaming.

    Phase 3: Passes user_id to agent for context-aware preference learning.
    Phase 4: Uses user_id from auth middleware for multi-user isolation.
    """
    try:
        # Phase 4: Get user_id from auth middleware
        user_id = request.state.user_id

        # Phase 4: Get user-specific agent instance
        user_agent = get_user_agent(user_id)

        # Connect agent if needed (for PersistentAgent)
        if USE_NEO4J and not user_agent._connected:
            await user_agent.connect()

        async def event_generator():
            try:
                # Phase 3: Pass user_id to agent for context tracking
                # Phase 4: Use user-specific agent
                async for event in user_agent.chat_stream(chat_request.message, user_id=user_id):
                    # SSE format: "data: {json}\n\n"
                    yield f"data: {event}\n"
            except Exception as e:
                logger.error(f"Error in stream: {str(e)}")
                logger.error(traceback.format_exc())
                error_event = {
                    "type": "error",
                    "message": str(e)
                }
                yield f"data: {error_event}\n\n"

        return StreamingResponse(
            event_generator(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no"
            }
        )
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat/legacy", response_model=ChatResponse)
async def chat_legacy(chat_request: ChatRequest, request: Request):
    """Legacy non-streaming chat endpoint (for backwards compatibility).

    Phase 3: Passes user_id to agent for context-aware preference learning.
    Phase 4: Uses user_id from auth middleware for multi-user isolation.
    """
    try:
        # Phase 4: Get user_id from auth middleware
        user_id = request.state.user_id

        # Phase 4: Get user-specific agent instance
        user_agent = get_user_agent(user_id)

        # Connect agent if needed (for PersistentAgent)
        if USE_NEO4J and not user_agent._connected:
            await user_agent.connect()

        # Phase 3: Pass user_id to agent for context tracking
        # Phase 4: Use user-specific agent
        response = await user_agent.chat(chat_request.message, user_id=user_id)
        return ChatResponse(response=response)
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/preferences", response_model=PreferencesResponse)
async def get_preferences(request: Request):
    """Get all learned preferences with sentiment.

    Phase 4: Returns only preferences for the authenticated user.
    """
    try:
        # Phase 4: Get user_id from auth middleware
        user_id = request.state.user_id

        # Phase 4: Get user-specific agent instance
        user_agent = get_user_agent(user_id)

        # Connect agent if needed (for PersistentAgent)
        if USE_NEO4J and not user_agent._connected:
            await user_agent.connect()

        if USE_NEO4J:
            # Get preferences from Neo4j (includes IDs and all fields)
            neo4j_prefs = await user_agent.get_all_preferences()
            preferences = [
                PreferenceItem(
                    id=pref.get("id"),
                    key=pref["key"],
                    value=pref["value"],
                    sentiment=pref.get("sentiment", "neutral"),
                    confidence=pref["confidence"],
                    is_exception=pref.get("is_exception", False),
                    domain=pref.get("domain", pref["key"].split(".")[0]),
                    created_at=str(pref["created_at"]) if pref.get("created_at") else None,
                    updated_at=str(pref["updated_at"]) if pref.get("updated_at") else None,
                    reinforcement_count=pref.get("reinforcement_count", 0),
                    rejection_count=pref.get("rejection_count", 0)
                )
                for pref in neo4j_prefs
                if pref["confidence"] >= 0.5  # Filter out low-confidence (deleted) preferences
            ]
        else:
            # Fallback to in-memory (no IDs available)
            preferences = [
                PreferenceItem(
                    key=key,
                    value=pref["value"],
                    sentiment=pref.get("sentiment", "neutral"),
                    confidence=pref["confidence"],
                    is_exception=pref.get("is_exception", False),
                    domain=key.split(".")[0]
                )
                for key, pref in user_agent.preferences.items()
                if pref["confidence"] >= 0.5
            ]
        return PreferencesResponse(preferences=preferences)
    except Exception as e:
        logger.error(f"Error in preferences endpoint: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


class UpdatePreferenceRequest(BaseModel):
    key: str
    value: str
    sentiment: str
    confidence: float
    is_exception: bool = False


@router.put("/preferences/{key}")
async def update_preference(key: str, update_request: UpdatePreferenceRequest, request: Request):
    """Manually update a preference (used for conflict resolution).

    Phase 4: Updates only the authenticated user's preferences.
    """
    try:
        # Phase 4: Get user_id from auth middleware
        user_id = request.state.user_id

        # Phase 4: Get user-specific agent instance
        user_agent = get_user_agent(user_id)

        # Update preference in agent
        user_agent.preferences[key] = {
            "value": update_request.value,
            "sentiment": update_request.sentiment,
            "confidence": update_request.confidence,
            "is_exception": update_request.is_exception
        }
        logger.info(f"User {user_id} manually updated preference: {key} = {update_request.value} ({update_request.sentiment}, {update_request.confidence:.0%})")
        return {"status": "updated", "key": key}
    except Exception as e:
        logger.error(f"Error updating preference: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/config", response_model=AIConfigResponse)
async def get_ai_config(request: Request):
    """Get AI configuration info (model, provider, local vs cloud).

    Phase 4: Returns config for the authenticated user's agent.
    """
    try:
        # Phase 4: Get user_id from auth middleware
        user_id = request.state.user_id

        # Phase 4: Get user-specific agent instance
        user_agent = get_user_agent(user_id)

        model = user_agent.llm_model

        # Determine provider and whether it's local
        if model.startswith("ollama/"):
            provider = "ollama"
            is_local = True
        elif model.startswith("gpt-") or model.startswith("o1-"):
            provider = "openai"
            is_local = False
        elif model.startswith("claude-"):
            provider = "anthropic"
            is_local = False
        elif model.startswith("gemini-"):
            provider = "google"
            is_local = False
        else:
            # Default: assume cloud provider
            provider = "unknown"
            is_local = False

        return AIConfigResponse(
            model=model,
            provider=provider,
            is_local=is_local
        )
    except Exception as e:
        logger.error(f"Error getting AI config: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# Phase 2: Persistent agent endpoints (only available with Neo4j)


class AcceptRejectRequest(BaseModel):
    preference_id: str


@router.post("/preferences/accept")
async def accept_preference(accept_request: AcceptRejectRequest, request: Request):
    """Accept a preference, increasing confidence by +0.1.

    Phase 4: Accepts only the authenticated user's preferences.
    """
    if not USE_NEO4J:
        raise HTTPException(status_code=501, detail="Persistent preferences require Neo4j")

    try:
        # Phase 4: Get user_id from auth middleware
        user_id = request.state.user_id

        # Phase 4: Get user-specific agent instance
        user_agent = get_user_agent(user_id)

        # Connect agent if needed
        if not user_agent._connected:
            await user_agent.connect()

        updated = await user_agent.accept_preference(accept_request.preference_id)
        return {
            "status": "accepted",
            "preference_id": accept_request.preference_id,
            "new_confidence": updated["confidence"]
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error accepting preference: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/preferences/reject")
async def reject_preference(reject_request: AcceptRejectRequest, request: Request):
    """Reject a preference, decreasing confidence by -0.15.

    Phase 4: Rejects only the authenticated user's preferences.
    """
    if not USE_NEO4J:
        raise HTTPException(status_code=501, detail="Persistent preferences require Neo4j")

    try:
        # Phase 4: Get user_id from auth middleware
        user_id = request.state.user_id

        # Phase 4: Get user-specific agent instance
        user_agent = get_user_agent(user_id)

        # Connect agent if needed
        if not user_agent._connected:
            await user_agent.connect()

        updated = await user_agent.reject_preference(reject_request.preference_id)
        return {
            "status": "rejected",
            "preference_id": reject_request.preference_id,
            "new_confidence": updated["confidence"]
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error rejecting preference: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/preferences/{preference_id}")
async def delete_preference(preference_id: str, request: Request):
    """Delete a single preference.

    Phase 4: Deletes only the authenticated user's preferences.
    """
    if not USE_NEO4J:
        raise HTTPException(status_code=501, detail="Persistent preferences require Neo4j")

    try:
        # Phase 4: Get user_id from auth middleware
        user_id = request.state.user_id

        # Phase 4: Get user-specific agent instance
        user_agent = get_user_agent(user_id)

        # Connect agent if needed
        if not user_agent._connected:
            await user_agent.connect()

        deleted = await user_agent.delete_preference(preference_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Preference not found")

        return {"status": "deleted", "preference_id": preference_id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting preference: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/preferences")
async def delete_all_preferences(request: Request):
    """Delete all preferences for the current user.

    Phase 4: Deletes only the authenticated user's preferences.
    """
    if not USE_NEO4J:
        raise HTTPException(status_code=501, detail="Persistent preferences require Neo4j")

    try:
        # Phase 4: Get user_id from auth middleware
        user_id = request.state.user_id

        # Phase 4: Get user-specific agent instance
        user_agent = get_user_agent(user_id)

        # Connect agent if needed
        if not user_agent._connected:
            await user_agent.connect()

        count = await user_agent.delete_all_preferences()
        return {"status": "deleted_all", "count": count}
    except Exception as e:
        logger.error(f"Error deleting all preferences: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/purge-all")
async def purge_all_memories(request: Request):
    """Purge ALL memories: preferences, situations, and embeddings from all databases.

    Phase 4: Purges only the authenticated user's data.

    This removes:
    - All Preferences from Neo4j
    - All Situations from Neo4j
    - All embeddings from Qdrant
    - Clears in-memory preferences

    WARNING: This action cannot be undone!
    """
    if not USE_NEO4J:
        raise HTTPException(status_code=501, detail="Purge requires Neo4j")

    try:
        # Phase 4: Get user_id from auth middleware
        user_id = request.state.user_id

        # Phase 4: Get user-specific agent instance
        user_agent = get_user_agent(user_id)

        # Connect agent if needed
        if not user_agent._connected:
            await user_agent.connect()

        deleted_counts = {
            "preferences": 0,
            "situations": 0,
            "qdrant_collections": 0
        }

        # 1. Delete all situations from Neo4j (do this FIRST to remove relationships)
        from fidus.memory.context.storage import ContextStorageService
        storage = ContextStorageService()

        async with storage.neo4j_driver.session() as session:
            # Delete all Situation nodes for this user (using tenant_id = user_id)
            result = await session.run("""
                MATCH (s:Situation {tenant_id: $tenant_id})
                DETACH DELETE s
                RETURN count(s) as count
            """, tenant_id=user_id)

            record = await result.single()
            deleted_counts["situations"] = record["count"] if record else 0

        # 2. Delete all preferences from Neo4j + in-memory
        deleted_counts["preferences"] = await user_agent.delete_all_preferences()

        # 3. Delete all embeddings from Qdrant
        try:
            from qdrant_client import QdrantClient
            from fidus.config import config as app_config

            qdrant_client = QdrantClient(
                host=app_config.qdrant_host,
                port=app_config.qdrant_port,
                grpc_port=app_config.qdrant_grpc_port,
                prefer_grpc=True,
            )

            # Delete the entire collection (will be recreated on next use)
            collection_name = f"situations_{user_id}"
            try:
                qdrant_client.delete_collection(collection_name)
                deleted_counts["qdrant_collections"] = 1
                logger.info(f"Deleted Qdrant collection: {collection_name}")
            except Exception as e:
                logger.warning(f"Qdrant collection might not exist: {e}")

        except Exception as e:
            logger.warning(f"Could not delete Qdrant data: {e}")

        logger.info(
            f"Purged all memories for user {user_id}: "
            f"{deleted_counts['preferences']} preferences, "
            f"{deleted_counts['situations']} situations, "
            f"{deleted_counts['qdrant_collections']} Qdrant collections"
        )

        return {
            "status": "purged_all",
            "deleted": deleted_counts,
            "message": "All memories have been permanently deleted from all databases"
        }

    except Exception as e:
        logger.error(f"Error purging all memories: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# Phase 3: Situational Context endpoints


@router.get("/situations", response_model=SituationsResponse)
async def get_situations(request: Request):
    """Get all situations with their context factors (Phase 3).

    Phase 4: Returns only the authenticated user's situations.
    """
    if not USE_NEO4J:
        raise HTTPException(status_code=501, detail="Situational context requires Neo4j")

    # Phase 4: Get user_id from auth middleware
    user_id = request.state.user_id

    # Phase 4: Get user-specific agent instance
    user_agent = get_user_agent(user_id)

    if not user_agent.enable_context_awareness or not user_agent.context_agent:
        raise HTTPException(status_code=501, detail="Context-awareness is disabled")

    try:
        # Query Neo4j for all situations
        from fidus.memory.context.storage import ContextStorageService
        storage = ContextStorageService()

        # Get all situations from Neo4j for this user (using tenant_id = user_id)
        async with storage.neo4j_driver.session() as session:
            result = await session.run("""
                MATCH (s:Situation {tenant_id: $tenant_id})
                OPTIONAL MATCH (s)<-[:IN_SITUATION]-(p:Preference)
                RETURN s, collect(p.id) as preference_ids
                ORDER BY s.created_at DESC
                LIMIT 100
            """, tenant_id=user_id)

            records = await result.values()
            situations = []

            for record in records:
                situation_node = record[0]
                preference_ids = record[1] if len(record) > 1 else []

                situations.append(SituationItem(
                    id=situation_node["id"],
                    tenant_id=situation_node["tenant_id"],
                    user_id=situation_node["user_id"],
                    factors=json.loads(situation_node["factors"]),
                    preference_ids=[pid for pid in preference_ids if pid],
                    created_at=situation_node["created_at"],
                    updated_at=situation_node["updated_at"]
                ))

        return SituationsResponse(situations=situations)
    except Exception as e:
        logger.error(f"Error getting situations: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/preferences/{preference_id}/context")
async def get_preference_context(preference_id: str, request: Request):
    """Get situational context for a specific preference (Phase 3).

    Phase 4: Returns only context for the authenticated user's preferences.
    """
    if not USE_NEO4J:
        raise HTTPException(status_code=501, detail="Situational context requires Neo4j")

    # Phase 4: Get user_id from auth middleware
    user_id = request.state.user_id

    # Phase 4: Get user-specific agent instance
    user_agent = get_user_agent(user_id)

    if not user_agent.enable_context_awareness or not user_agent.context_agent:
        raise HTTPException(status_code=501, detail="Context-awareness is disabled")

    try:
        from fidus.memory.context.storage import ContextStorageService
        storage = ContextStorageService()

        # Query Neo4j for situations linked to this preference (for this user)
        async with storage.neo4j_driver.session() as session:
            result = await session.run("""
                MATCH (p:Preference {id: $preference_id, tenant_id: $tenant_id})-[:IN_SITUATION]->(s:Situation)
                RETURN s
                ORDER BY s.created_at DESC
            """, preference_id=preference_id, tenant_id=user_id)

            records = await result.values()
            situations = []

            for record in records:
                situation_node = record[0]
                situations.append(SituationItem(
                    id=situation_node["id"],
                    tenant_id=situation_node["tenant_id"],
                    user_id=situation_node["user_id"],
                    factors=json.loads(situation_node["factors"]),
                    preference_ids=[preference_id],
                    created_at=situation_node["created_at"],
                    updated_at=situation_node["updated_at"]
                ))

        return {"preference_id": preference_id, "situations": situations}
    except Exception as e:
        logger.error(f"Error getting preference context: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

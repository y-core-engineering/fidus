from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from fidus.memory.simple_agent import InMemoryAgent
from fidus.memory.persistent_agent import PersistentAgent
from fidus.config import config
import logging
import traceback
import os

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/memory", tags=["memory"])

# Check if Neo4j is configured
USE_NEO4J = bool(os.getenv("NEO4J_URI"))

# Agent instance (persistent if Neo4j available, otherwise in-memory)
if USE_NEO4J:
    logger.info("Using PersistentAgent with Neo4j")
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


@router.post("/chat")
async def chat_stream(request: ChatRequest):
    """Chat endpoint with SSE streaming."""
    try:
        async def event_generator():
            try:
                async for event in agent.chat_stream(request.message):
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
async def chat_legacy(request: ChatRequest):
    """Legacy non-streaming chat endpoint (for backwards compatibility)."""
    try:
        response = await agent.chat(request.message)
        return ChatResponse(response=response)
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/preferences", response_model=PreferencesResponse)
async def get_preferences():
    """Get all learned preferences with sentiment."""
    try:
        if USE_NEO4J:
            # Get preferences from Neo4j (includes IDs and all fields)
            neo4j_prefs = await agent.get_all_preferences()
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
                for key, pref in agent.preferences.items()
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
async def update_preference(key: str, request: UpdatePreferenceRequest):
    """Manually update a preference (used for conflict resolution)."""
    try:
        # Update preference in agent
        agent.preferences[key] = {
            "value": request.value,
            "sentiment": request.sentiment,
            "confidence": request.confidence,
            "is_exception": request.is_exception
        }
        logger.info(f"Manually updated preference: {key} = {request.value} ({request.sentiment}, {request.confidence:.0%})")
        return {"status": "updated", "key": key}
    except Exception as e:
        logger.error(f"Error updating preference: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/config", response_model=AIConfigResponse)
async def get_ai_config():
    """Get AI configuration info (model, provider, local vs cloud)."""
    try:
        model = agent.llm_model

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
async def accept_preference(request: AcceptRejectRequest):
    """Accept a preference, increasing confidence by +0.1."""
    if not USE_NEO4J:
        raise HTTPException(status_code=501, detail="Persistent preferences require Neo4j")

    try:
        updated = await agent.accept_preference(request.preference_id)
        return {
            "status": "accepted",
            "preference_id": request.preference_id,
            "new_confidence": updated["confidence"]
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error accepting preference: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/preferences/reject")
async def reject_preference(request: AcceptRejectRequest):
    """Reject a preference, decreasing confidence by -0.15."""
    if not USE_NEO4J:
        raise HTTPException(status_code=501, detail="Persistent preferences require Neo4j")

    try:
        updated = await agent.reject_preference(request.preference_id)
        return {
            "status": "rejected",
            "preference_id": request.preference_id,
            "new_confidence": updated["confidence"]
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error rejecting preference: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/preferences/{preference_id}")
async def delete_preference(preference_id: str):
    """Delete a single preference."""
    if not USE_NEO4J:
        raise HTTPException(status_code=501, detail="Persistent preferences require Neo4j")

    try:
        deleted = await agent.delete_preference(preference_id)
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
async def delete_all_preferences():
    """Delete all preferences for the current tenant."""
    if not USE_NEO4J:
        raise HTTPException(status_code=501, detail="Persistent preferences require Neo4j")

    try:
        count = await agent.delete_all_preferences()
        return {"status": "deleted_all", "count": count}
    except Exception as e:
        logger.error(f"Error deleting all preferences: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

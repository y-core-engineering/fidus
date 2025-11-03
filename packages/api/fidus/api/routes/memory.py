from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from fidus.memory.simple_agent import InMemoryAgent
import logging
import traceback

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/memory", tags=["memory"])

# In-memory agent instance (session-scoped for Phase 1)
agent = InMemoryAgent()


class ChatRequest(BaseModel):
    user_id: str
    message: str


class ChatResponse(BaseModel):
    response: str


class PreferenceItem(BaseModel):
    key: str
    value: str
    sentiment: str  # "positive", "negative", or "neutral"
    confidence: float
    is_exception: bool = False


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
        preferences = [
            PreferenceItem(
                key=key,
                value=pref["value"],
                sentiment=pref.get("sentiment", "neutral"),
                confidence=pref["confidence"],
                is_exception=pref.get("is_exception", False)
            )
            for key, pref in agent.preferences.items()
            if pref["confidence"] >= 0.5  # Filter out low-confidence (deleted) preferences
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

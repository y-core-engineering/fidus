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


class PreferencesResponse(BaseModel):
    preferences: list[PreferenceItem]


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
                confidence=pref["confidence"]
            )
            for key, pref in agent.preferences.items()
        ]
        return PreferencesResponse(preferences=preferences)
    except Exception as e:
        logger.error(f"Error in preferences endpoint: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fidus.memory.simple_agent import InMemoryAgent

router = APIRouter(prefix="/memory", tags=["memory"])

# In-memory agent instance (session-scoped for Phase 1)
agent = InMemoryAgent()


class ChatRequest(BaseModel):
    user_id: str
    message: str


class ChatResponse(BaseModel):
    response: str


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Chat endpoint with in-memory preference learning."""
    try:
        response = await agent.chat(request.message)
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

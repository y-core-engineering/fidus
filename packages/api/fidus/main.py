from dotenv import load_dotenv

# Load environment variables from .env file BEFORE any other imports
# This ensures env vars are available when modules are initialized
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fidus.api.routes import memory
import logging

logger = logging.getLogger(__name__)

app = FastAPI(title="Fidus Memory API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(memory.router)


@app.on_event("startup")
async def startup_event():
    """Initialize connections on startup."""
    # Connect PersistentAgent to Neo4j if configured
    if hasattr(memory.agent, 'connect'):
        try:
            await memory.agent.connect()
            logger.info("Successfully connected PersistentAgent to Neo4j")
        except Exception as e:
            logger.error(f"Failed to connect to Neo4j: {e}")
            logger.warning("Falling back to in-memory mode")


@app.on_event("shutdown")
async def shutdown_event():
    """Clean up connections on shutdown."""
    # Disconnect PersistentAgent from Neo4j
    if hasattr(memory.agent, 'disconnect'):
        try:
            await memory.agent.disconnect()
            logger.info("Disconnected PersistentAgent from Neo4j")
        except Exception as e:
            logger.error(f"Error disconnecting from Neo4j: {e}")


@app.get("/health")
async def health():
    return {"status": "ok"}

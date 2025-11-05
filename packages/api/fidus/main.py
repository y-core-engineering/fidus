from dotenv import load_dotenv

# Load environment variables from .env file BEFORE any other imports
# This ensures env vars are available when modules are initialized
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fidus.api.routes import memory, mcp, health
from fidus.api.middleware.auth import SimpleAuthMiddleware
from fidus.memory.mcp_server import PreferenceMCPServer
import logging

logger = logging.getLogger(__name__)

app = FastAPI(title="Fidus Memory API")

# Authentication middleware (Phase 4: Multi-User Support)
# MUST be added before CORS to ensure user_id is available
app.add_middleware(SimpleAuthMiddleware)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health.router)  # Health checks (no auth required)
app.include_router(memory.router)  # Memory endpoints (auth required)
app.include_router(mcp.router)     # MCP endpoints (auth required)


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

    # Initialize MCP server with the memory agent
    try:
        mcp_server = PreferenceMCPServer(memory.agent)
        mcp.init_mcp_server(mcp_server)
        logger.info("Successfully initialized MCP server")
    except Exception as e:
        logger.error(f"Failed to initialize MCP server: {e}")
        logger.warning("MCP endpoints will not be available")


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


# Health check moved to health.router (see fidus/api/routes/health.py)

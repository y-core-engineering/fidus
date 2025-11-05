"""Health check endpoints for monitoring Fidus Memory API.

Provides basic health checks and database connectivity checks for:
- Neo4j (graph database for preferences and situations)
- PostgreSQL (relational database for structured data)
- Qdrant (vector database for embeddings)
- Redis (cache layer)
"""

import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any

logger = logging.getLogger(__name__)

router = APIRouter(tags=["health"])


class HealthResponse(BaseModel):
    """Basic health check response."""
    status: str
    message: str = "OK"


class DatabaseHealthDetail(BaseModel):
    """Health status for a single database."""
    status: str  # "ok" or "error"
    message: str
    details: Dict[str, Any] | None = None


class DatabaseHealthResponse(BaseModel):
    """Detailed health check response for all databases."""
    status: str  # "healthy" (all ok), "degraded" (some errors), or "unhealthy" (all errors)
    databases: Dict[str, DatabaseHealthDetail]


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Basic health check endpoint.

    Returns 200 OK if the API is running.
    Does not check database connectivity.
    """
    return HealthResponse(status="ok", message="Fidus Memory API is running")


@router.get("/health/db", response_model=DatabaseHealthResponse)
async def database_health_check() -> DatabaseHealthResponse:
    """Detailed health check for all database connections.

    Checks connectivity to:
    - Neo4j (graph database)
    - PostgreSQL (relational database)
    - Qdrant (vector database)
    - Redis (cache)

    Returns:
        DatabaseHealthResponse with status for each database
    """
    databases: Dict[str, DatabaseHealthDetail] = {}

    # Check Neo4j
    databases["neo4j"] = await _check_neo4j()

    # Check PostgreSQL
    databases["postgresql"] = await _check_postgresql()

    # Check Qdrant
    databases["qdrant"] = await _check_qdrant()

    # Check Redis
    databases["redis"] = await _check_redis()

    # Determine overall status
    error_count = sum(1 for db in databases.values() if db.status == "error")

    if error_count == 0:
        overall_status = "healthy"
    elif error_count == len(databases):
        overall_status = "unhealthy"
    else:
        overall_status = "degraded"

    return DatabaseHealthResponse(
        status=overall_status,
        databases=databases
    )


async def _check_neo4j() -> DatabaseHealthDetail:
    """Check Neo4j connectivity."""
    try:
        from fidus.config import config
        from fidus.infrastructure.neo4j_client import Neo4jPreferenceStore

        store = Neo4jPreferenceStore(config)
        await store.connect()

        # Simple query to verify connection
        async with store.driver.session() as session:
            result = await session.run("RETURN 1 as test")
            await result.single()

        await store.disconnect()

        return DatabaseHealthDetail(
            status="ok",
            message="Connected to Neo4j",
            details={"uri": config.neo4j_uri}
        )
    except Exception as e:
        logger.error(f"Neo4j health check failed: {e}")
        return DatabaseHealthDetail(
            status="error",
            message=f"Neo4j connection failed: {str(e)}"
        )


async def _check_postgresql() -> DatabaseHealthDetail:
    """Check PostgreSQL connectivity."""
    try:
        from fidus.config import config
        from fidus.memory.context.storage import ContextStorageService

        # Check if PostgreSQL is configured
        if not config.postgres_url:
            return DatabaseHealthDetail(
                status="ok",
                message="PostgreSQL not configured (optional)",
                details={"configured": False}
            )

        storage = ContextStorageService()

        # Execute simple query to verify connection
        async with storage.postgres_pool.acquire() as conn:
            result = await conn.fetchval("SELECT 1")
            if result != 1:
                raise ValueError("Unexpected query result")

        return DatabaseHealthDetail(
            status="ok",
            message="Connected to PostgreSQL",
            details={"url": config.postgres_url.split("@")[-1]}  # Hide credentials
        )
    except Exception as e:
        logger.error(f"PostgreSQL health check failed: {e}")
        return DatabaseHealthDetail(
            status="error",
            message=f"PostgreSQL connection failed: {str(e)}"
        )


async def _check_qdrant() -> DatabaseHealthDetail:
    """Check Qdrant connectivity."""
    try:
        from fidus.config import config
        from qdrant_client import QdrantClient

        client = QdrantClient(
            host=config.qdrant_host,
            port=config.qdrant_port,
            grpc_port=config.qdrant_grpc_port,
            prefer_grpc=True,
        )

        # Get cluster info to verify connection
        info = client.get_collections()

        return DatabaseHealthDetail(
            status="ok",
            message="Connected to Qdrant",
            details={
                "host": config.qdrant_host,
                "port": config.qdrant_port,
                "collections_count": len(info.collections) if info else 0
            }
        )
    except Exception as e:
        logger.error(f"Qdrant health check failed: {e}")
        return DatabaseHealthDetail(
            status="error",
            message=f"Qdrant connection failed: {str(e)}"
        )


async def _check_redis() -> DatabaseHealthDetail:
    """Check Redis connectivity."""
    try:
        from fidus.config import config
        import redis.asyncio as aioredis

        # Check if Redis is configured
        if not config.redis_url:
            return DatabaseHealthDetail(
                status="ok",
                message="Redis not configured (optional)",
                details={"configured": False}
            )

        redis_client = await aioredis.from_url(
            config.redis_url,
            encoding="utf-8",
            decode_responses=True
        )

        # Ping Redis to verify connection
        await redis_client.ping()
        await redis_client.close()

        return DatabaseHealthDetail(
            status="ok",
            message="Connected to Redis",
            details={"url": config.redis_url.split("@")[-1]}  # Hide credentials
        )
    except Exception as e:
        logger.error(f"Redis health check failed: {e}")
        return DatabaseHealthDetail(
            status="error",
            message=f"Redis connection failed: {str(e)}"
        )

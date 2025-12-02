"""Admin API routes for Fidus Memory.

Endpoints for system administration and monitoring.

Architecture References:
- ADR-0001: Situational Context as Relationship Qualifier (Qdrant-First)
- ADR-0002: Property Placement Strategy
"""

import logging
import os
from typing import Any, Dict

from fastapi import APIRouter, HTTPException, Request

from fidus.config import config

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/memory/admin", tags=["admin"])

# Check if required services are configured
USE_NEO4J = bool(os.getenv("NEO4J_URI"))
USE_QDRANT = bool(os.getenv("QDRANT_HOST"))


# --- Helper Functions ---


async def check_admin_access(request: Request) -> str:
    """Check if user has admin access.

    For now, this is a simple check. In production, implement proper
    role-based access control.

    Returns:
        user_id: The authenticated user's ID

    Raises:
        HTTPException: If user is not authorized
    """
    user_id = getattr(request.state, "user_id", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")

    # TODO: Implement proper admin role check
    # For now, allow all authenticated users for development
    return user_id


# --- Endpoints ---


@router.get("/system-status")
async def get_system_status(request: Request) -> Dict[str, Any]:
    """Get current system status.

    Returns the status of:
    - neo4j_configured: Whether Neo4j is configured
    - qdrant_configured: Whether Qdrant is configured
    - storage_pattern: Current storage pattern (always Qdrant-First)
    """
    await check_admin_access(request)

    return {
        "neo4j_configured": USE_NEO4J,
        "qdrant_configured": USE_QDRANT,
        "storage_pattern": "qdrant-first",
        "architecture_version": "v3.0",
    }


@router.get("/storage-stats")
async def get_storage_stats(request: Request) -> Dict[str, Any]:
    """Get statistics about stored data (Qdrant-First pattern).

    Returns counts of:
    - Situation nodes in Neo4j (reference only)
    - Preferences with situation_id (1-Hop pattern)
    - Qdrant situations collection stats
    """
    await check_admin_access(request)

    if not USE_NEO4J:
        raise HTTPException(
            status_code=501, detail="Stats require Neo4j to be configured"
        )

    try:
        from neo4j import AsyncGraphDatabase

        neo4j_driver = AsyncGraphDatabase.driver(
            os.getenv("NEO4J_URI", "bolt://localhost:7687"),
            auth=(
                os.getenv("NEO4J_USER", "neo4j"),
                os.getenv("NEO4J_PASSWORD", "neo4j_password"),
            ),
        )

        async with neo4j_driver.session() as session:
            # Count Situation nodes
            result = await session.run("MATCH (s:Situation) RETURN count(s) as count")
            record = await result.single()
            situation_count = record["count"] if record else 0

            # Count Preferences with situation_id (1-Hop pattern)
            result = await session.run(
                "MATCH (p:Preference) WHERE p.situation_id IS NOT NULL RETURN count(p) as count"
            )
            record = await result.single()
            preferences_with_context = record["count"] if record else 0

            # Count total Preferences
            result = await session.run(
                "MATCH (p:Preference) RETURN count(p) as count"
            )
            record = await result.single()
            total_preferences = record["count"] if record else 0

        await neo4j_driver.close()

        return {
            "neo4j": {
                "situation_nodes": situation_count,
                "total_preferences": total_preferences,
                "preferences_with_situation_id": preferences_with_context,
            },
            "storage_pattern": "qdrant-first",
            "query_pattern": "1-hop",
        }

    except Exception as e:
        logger.error(f"Failed to get storage stats: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {e}")

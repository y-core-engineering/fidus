"""
Database connection dependencies.

Provides async context managers for Neo4j and Qdrant connections.
"""

import os
from typing import AsyncGenerator
from contextlib import asynccontextmanager

from neo4j import AsyncGraphDatabase, AsyncDriver
from qdrant_client import AsyncQdrantClient

from fidus.config import PrototypeConfig


# Singleton driver instances
_neo4j_driver: AsyncDriver | None = None
_qdrant_client: AsyncQdrantClient | None = None


async def get_neo4j_driver() -> AsyncGenerator[AsyncDriver, None]:
    """
    Get Neo4j async driver as FastAPI dependency.

    Yields:
        AsyncDriver: Neo4j async driver instance

    Raises:
        RuntimeError: If Neo4j is not configured

    Usage:
        @router.get("/users")
        async def get_users(driver: AsyncDriver = Depends(get_neo4j_driver)):
            async with driver.session() as session:
                ...
    """
    global _neo4j_driver

    if not os.getenv("NEO4J_URI"):
        raise RuntimeError("Neo4j is not configured. Set NEO4J_URI environment variable.")

    if _neo4j_driver is None:
        config = PrototypeConfig()
        _neo4j_driver = AsyncGraphDatabase.driver(
            config.neo4j_uri,
            auth=(config.neo4j_user, config.neo4j_password),
        )

    try:
        yield _neo4j_driver
    finally:
        # Don't close - driver is reused across requests
        pass


async def close_neo4j_driver() -> None:
    """Close the Neo4j driver. Call on application shutdown."""
    global _neo4j_driver
    if _neo4j_driver is not None:
        await _neo4j_driver.close()
        _neo4j_driver = None


async def get_qdrant_client() -> AsyncGenerator[AsyncQdrantClient, None]:
    """
    Get Qdrant async client as FastAPI dependency.

    Yields:
        AsyncQdrantClient: Qdrant async client instance

    Usage:
        @router.get("/search")
        async def search(client: AsyncQdrantClient = Depends(get_qdrant_client)):
            ...
    """
    global _qdrant_client

    if _qdrant_client is None:
        config = PrototypeConfig()
        _qdrant_client = AsyncQdrantClient(
            host=config.qdrant_host,
            port=config.qdrant_port,
        )

    try:
        yield _qdrant_client
    finally:
        # Don't close - client is reused across requests
        pass


async def close_qdrant_client() -> None:
    """Close the Qdrant client. Call on application shutdown."""
    global _qdrant_client
    if _qdrant_client is not None:
        await _qdrant_client.close()
        _qdrant_client = None

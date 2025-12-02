"""
Repository dependencies.

Provides FastAPI dependencies for domain repositories.
"""

from typing import AsyncGenerator

from neo4j import AsyncDriver
from fastapi import Depends

from fidus.dependencies.database import get_neo4j_driver
from fidus.memory.repositories.user_repository import UserRepository


async def get_user_repository(
    driver: AsyncDriver = Depends(get_neo4j_driver),
) -> AsyncGenerator[UserRepository, None]:
    """
    Get UserRepository as FastAPI dependency.

    Args:
        driver: Neo4j driver (injected)

    Yields:
        UserRepository: Repository instance

    Usage:
        @router.get("/users/{user_id}")
        async def get_user(
            user_id: str,
            repo: UserRepository = Depends(get_user_repository)
        ):
            return await repo.get(user_id, tenant_id)
    """
    yield UserRepository(driver)

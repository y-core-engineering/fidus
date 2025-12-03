"""
Repository dependencies.

Provides FastAPI dependencies for domain repositories.
"""

from typing import AsyncGenerator

from neo4j import AsyncDriver
from fastapi import Depends

from fidus.dependencies.database import get_neo4j_driver
from fidus.memory.repositories.user_repository import UserRepository
from fidus.memory.repositories.person_repository import PersonRepository
from fidus.memory.repositories.organization_repository import OrganizationRepository


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


async def get_person_repository(
    driver: AsyncDriver = Depends(get_neo4j_driver),
) -> AsyncGenerator[PersonRepository, None]:
    """
    Get PersonRepository as FastAPI dependency.

    Args:
        driver: Neo4j driver (injected)

    Yields:
        PersonRepository: Repository instance

    Usage:
        @router.get("/person/{person_id}")
        async def get_person(
            person_id: str,
            repo: PersonRepository = Depends(get_person_repository)
        ):
            return await repo.get(tenant_id, person_id)
    """
    yield PersonRepository(driver)


async def get_organization_repository(
    driver: AsyncDriver = Depends(get_neo4j_driver),
) -> AsyncGenerator[OrganizationRepository, None]:
    """
    Get OrganizationRepository as FastAPI dependency.

    Args:
        driver: Neo4j driver (injected)

    Yields:
        OrganizationRepository: Repository instance

    Usage:
        @router.get("/organization/{org_id}")
        async def get_organization(
            org_id: str,
            repo: OrganizationRepository = Depends(get_organization_repository)
        ):
            return await repo.get(tenant_id, org_id)
    """
    yield OrganizationRepository(driver)

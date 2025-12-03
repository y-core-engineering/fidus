"""
Fidus Dependency Injection module.

Provides FastAPI dependencies for database connections and repositories.
"""

from fidus.dependencies.database import (
    get_neo4j_driver,
    get_qdrant_client,
)
from fidus.dependencies.repositories import (
    get_user_repository,
    get_person_repository,
)
from fidus.dependencies.auth import (
    get_current_user,
    get_current_tenant,
)

__all__ = [
    "get_neo4j_driver",
    "get_qdrant_client",
    "get_user_repository",
    "get_person_repository",
    "get_current_user",
    "get_current_tenant",
]

"""
Feature Flags for Fidus API.

Provides feature flag utilities for gradual rollout and fallback capabilities.

Usage:
    from fidus.feature_flags import is_user_entity_enabled, require_user_entity
    from fidus.feature_flags import is_person_entity_enabled, require_person_entity

    if is_user_entity_enabled():
        # Use User entity as aggregate root
        user = await repo.get(user_id, tenant_id)
    else:
        # Fallback to direct tenant_id queries
        entities = await legacy_query(tenant_id)

Environment Variables:
    USE_USER_ENTITY: Enable User entity as aggregate root (default: true)
                     Set to 'false' to use legacy tenant_id-based queries
    ENABLE_PERSON_ENTITY: Enable Person entity CRUD (default: false)
                          Set to 'true' to enable person management
"""

import logging
from functools import wraps
from typing import Callable, TypeVar, ParamSpec

from fastapi import HTTPException, status

from fidus.config import config

logger = logging.getLogger(__name__)

P = ParamSpec("P")
T = TypeVar("T")


def is_user_entity_enabled() -> bool:
    """
    Check if User entity feature is enabled.

    When enabled:
    - User is the aggregate root for all memory entities
    - All entities reference User via user_id
    - GDPR cascade delete works through User relationships

    When disabled (fallback):
    - Direct tenant_id-based queries are used
    - Entities may not have user_id references
    - Legacy behavior is preserved

    Returns:
        bool: True if User entity feature is enabled
    """
    return config.use_user_entity


def require_user_entity(func: Callable[P, T]) -> Callable[P, T]:
    """
    Decorator that requires User entity feature to be enabled.

    If the feature is disabled, returns 503 Service Unavailable.
    Use this for endpoints that only work with User entity enabled.

    Example:
        @router.get("/user/{user_id}")
        @require_user_entity
        async def get_user(user_id: str, tenant_id: str):
            ...
    """
    @wraps(func)
    async def wrapper(*args: P.args, **kwargs: P.kwargs) -> T:
        if not is_user_entity_enabled():
            logger.warning(
                f"User entity feature disabled, blocking access to {func.__name__}"
            )
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="User entity feature is currently disabled. "
                       "Set USE_USER_ENTITY=true to enable."
            )
        return await func(*args, **kwargs)
    return wrapper


def with_user_entity_fallback(
    legacy_func: Callable[P, T]
) -> Callable[[Callable[P, T]], Callable[P, T]]:
    """
    Decorator that provides fallback to legacy function when User entity is disabled.

    Example:
        async def legacy_get_entities(tenant_id: str):
            # Old implementation using tenant_id directly
            ...

        @with_user_entity_fallback(legacy_get_entities)
        async def get_entities(user_id: str, tenant_id: str):
            # New implementation using User entity
            ...
    """
    def decorator(func: Callable[P, T]) -> Callable[P, T]:
        @wraps(func)
        async def wrapper(*args: P.args, **kwargs: P.kwargs) -> T:
            if is_user_entity_enabled():
                return await func(*args, **kwargs)
            else:
                logger.info(
                    f"Using legacy fallback for {func.__name__} "
                    f"(USE_USER_ENTITY=false)"
                )
                return await legacy_func(*args, **kwargs)
        return wrapper
    return decorator


def is_person_entity_enabled() -> bool:
    """
    Check if Person entity feature is enabled.

    When enabled:
    - Person CRUD API is available
    - LLM extraction of persons is active
    - Person management UI is accessible

    When disabled:
    - Person API returns 501 Not Implemented
    - No persons are extracted from conversations

    Returns:
        bool: True if Person entity feature is enabled
    """
    return config.enable_person_entity


def require_person_entity(func: Callable[P, T]) -> Callable[P, T]:
    """
    Decorator that requires Person entity feature to be enabled.

    If the feature is disabled, returns 501 Not Implemented.
    Use this for endpoints that only work with Person entity enabled.

    Example:
        @router.get("/person/{person_id}")
        @require_person_entity
        async def get_person(person_id: str, tenant_id: str):
            ...
    """
    @wraps(func)
    async def wrapper(*args: P.args, **kwargs: P.kwargs) -> T:
        if not is_person_entity_enabled():
            logger.warning(
                f"Person entity feature disabled, blocking access to {func.__name__}"
            )
            raise HTTPException(
                status_code=status.HTTP_501_NOT_IMPLEMENTED,
                detail="Person entity feature is currently disabled. "
                       "Set ENABLE_PERSON_ENTITY=true to enable."
            )
        return await func(*args, **kwargs)
    return wrapper


def log_feature_status() -> None:
    """Log current feature flag status. Call on application startup."""
    if is_user_entity_enabled():
        logger.info("Feature: USE_USER_ENTITY=true - User entity is aggregate root")
    else:
        logger.warning(
            "Feature: USE_USER_ENTITY=false - Using legacy tenant_id queries. "
            "This is a fallback mode and should not be used in production."
        )

    if is_person_entity_enabled():
        logger.info("Feature: ENABLE_PERSON_ENTITY=true - Person entity CRUD is enabled")
    else:
        logger.info("Feature: ENABLE_PERSON_ENTITY=false - Person entity CRUD is disabled")

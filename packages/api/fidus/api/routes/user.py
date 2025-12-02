"""
User API routes.

These endpoints require the USE_USER_ENTITY feature flag to be enabled.
When disabled, endpoints return 503 Service Unavailable.
"""

from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
import logging

from neo4j import AsyncDriver

from fidus.memory.entities.user import UserCreate, UserUpdate, UserResponse
from fidus.memory.repositories.user_repository import UserRepository, ensure_user_constraints
from fidus.dependencies import get_user_repository, get_neo4j_driver
from fidus.feature_flags import require_user_entity, is_user_entity_enabled

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/memory/user", tags=["user"])


@router.get("/feature-status", status_code=status.HTTP_200_OK)
async def get_feature_status():
    """
    Get the current status of the User entity feature flag.

    Returns whether the User entity feature is enabled and provides
    guidance on how to enable/disable it.
    """
    enabled = is_user_entity_enabled()
    return {
        "feature": "USE_USER_ENTITY",
        "enabled": enabled,
        "description": (
            "User entity is the aggregate root for all memory entities"
            if enabled
            else "Legacy tenant_id-based queries are being used (fallback mode)"
        ),
        "hint": (
            "Set USE_USER_ENTITY=false to disable"
            if enabled
            else "Set USE_USER_ENTITY=true to enable User entity as aggregate root"
        ),
    }


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
@require_user_entity
async def create_user(
    user_data: UserCreate,
    repo: UserRepository = Depends(get_user_repository),
) -> UserResponse:
    """
    Create a new user.

    Requires tenant_id and email. Email must be unique within tenant.
    """
    try:
        user = await repo.create(user_data)
        return UserResponse(**user.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/{user_id}", response_model=UserResponse)
@require_user_entity
async def get_user(
    user_id: str,
    tenant_id: str,
    repo: UserRepository = Depends(get_user_repository),
) -> UserResponse:
    """
    Get user by ID.

    Requires tenant_id for multi-tenancy isolation.
    """
    user = await repo.get(user_id, tenant_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return UserResponse(**user.model_dump())


@router.get("/by-email/{email}", response_model=UserResponse)
@require_user_entity
async def get_user_by_email(
    email: str,
    tenant_id: str,
    repo: UserRepository = Depends(get_user_repository),
) -> UserResponse:
    """
    Get user by email.

    Requires tenant_id for multi-tenancy isolation.
    """
    user = await repo.get_by_email(email, tenant_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return UserResponse(**user.model_dump())


@router.put("/{user_id}", response_model=UserResponse)
@require_user_entity
async def update_user(
    user_id: str,
    tenant_id: str,
    updates: UserUpdate,
    repo: UserRepository = Depends(get_user_repository),
) -> UserResponse:
    """
    Update user properties.

    Supports partial updates. Only provided fields will be updated.
    ai_properties are merged (not overwritten).
    """
    user = await repo.update(user_id, tenant_id, updates)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return UserResponse(**user.model_dump())


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
@require_user_entity
async def delete_user(
    user_id: str,
    tenant_id: str,
    confirm: bool,
    repo: UserRepository = Depends(get_user_repository),
):
    """
    Delete user and all related data (GDPR cascade delete).

    WARNING: This is irreversible. All entities and relationships
    connected to this user will be permanently deleted.

    Requires confirm=true query parameter to prevent accidental deletion.
    """
    if not confirm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must set confirm=true to delete user"
        )

    deleted = await repo.delete(user_id, tenant_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")


@router.get("/", response_model=List[UserResponse])
@require_user_entity
async def list_users(
    tenant_id: str,
    limit: int = 100,
    repo: UserRepository = Depends(get_user_repository),
) -> List[UserResponse]:
    """
    List all users for a tenant.

    Supports pagination via limit parameter.
    """
    users = await repo.list_by_tenant(tenant_id, limit)
    return [UserResponse(**user.model_dump()) for user in users]


@router.post("/ensure-constraints", status_code=status.HTTP_200_OK)
@require_user_entity
async def create_constraints(
    driver: AsyncDriver = Depends(get_neo4j_driver),
):
    """
    Create Neo4j constraints and indexes for User entity.

    Should be called once during deployment or migration.
    """
    await ensure_user_constraints(driver)
    return {"status": "constraints_created"}

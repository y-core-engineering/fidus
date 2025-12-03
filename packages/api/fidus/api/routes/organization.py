"""
Organization API routes.

These endpoints require the ENABLE_ORGANIZATION_ENTITY feature flag to be enabled.
When disabled, endpoints return 501 Not Implemented.
"""

from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
import logging

from neo4j import AsyncDriver

from fidus.memory.entities.organization import (
    OrganizationCreate,
    OrganizationUpdate,
    OrganizationResponse,
)
from fidus.memory.repositories.organization_repository import (
    OrganizationRepository,
    ensure_organization_constraints,
)
from fidus.dependencies import (
    get_organization_repository,
    get_neo4j_driver,
    get_current_user,
    get_current_tenant,
)
from fidus.feature_flags import (
    require_organization_entity,
    is_organization_entity_enabled,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/memory/entities/organization", tags=["organization"])


@router.get("/feature-status", status_code=status.HTTP_200_OK)
async def get_feature_status():
    """
    Get the current status of the Organization entity feature flag.

    Returns whether the Organization entity feature is enabled and provides
    guidance on how to enable/disable it.
    """
    enabled = is_organization_entity_enabled()
    return {
        "feature": "ENABLE_ORGANIZATION_ENTITY",
        "enabled": enabled,
        "description": (
            "Organization entity CRUD is enabled"
            if enabled
            else "Organization entity feature is disabled"
        ),
        "hint": (
            "Set ENABLE_ORGANIZATION_ENTITY=false to disable"
            if enabled
            else "Set ENABLE_ORGANIZATION_ENTITY=true to enable Organization entity management"
        ),
    }


@router.post("", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
@require_organization_entity
async def create_organization(
    org_data: OrganizationCreate,
    tenant_id: str = Depends(get_current_tenant),
    user_id: str = Depends(get_current_user),
    repo: OrganizationRepository = Depends(get_organization_repository),
) -> OrganizationResponse:
    """
    Create a new Organization entity.

    - **name**: Organization name (required)
    - **ai_properties**: Flexible dict of AI-discovered attributes (industry, size, etc.)
    - **confidence**: Extraction confidence (0.0 - 1.0)
    - **source**: explicit, inferred, llm_extracted
    """
    organization = await repo.create(tenant_id, user_id, org_data)
    return OrganizationResponse.from_organization(organization)


@router.get("/{org_id}", response_model=OrganizationResponse)
@require_organization_entity
async def get_organization(
    org_id: str,
    tenant_id: str = Depends(get_current_tenant),
    repo: OrganizationRepository = Depends(get_organization_repository),
) -> OrganizationResponse:
    """
    Get an Organization by ID with all AI-discovered properties.
    """
    organization = await repo.get(tenant_id, org_id)

    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Organization {org_id} not found",
        )

    return OrganizationResponse.from_organization(organization)


@router.put("/{org_id}", response_model=OrganizationResponse)
@require_organization_entity
async def update_organization(
    org_id: str,
    update_data: OrganizationUpdate,
    tenant_id: str = Depends(get_current_tenant),
    repo: OrganizationRepository = Depends(get_organization_repository),
) -> OrganizationResponse:
    """
    Update an Organization entity.

    Properties are MERGED, not overwritten:
    - New keys are added
    - List values are unioned
    - Existing scalar values are preserved
    """
    organization = await repo.update(tenant_id, org_id, update_data)

    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Organization {org_id} not found",
        )

    return OrganizationResponse.from_organization(organization)


@router.delete("/{org_id}", status_code=status.HTTP_204_NO_CONTENT)
@require_organization_entity
async def delete_organization(
    org_id: str,
    tenant_id: str = Depends(get_current_tenant),
    repo: OrganizationRepository = Depends(get_organization_repository),
):
    """
    Delete an Organization entity with cascade (removes all relationships).

    This operation cannot be undone.
    """
    deleted = await repo.delete(tenant_id, org_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Organization {org_id} not found",
        )


@router.get("", response_model=List[OrganizationResponse])
@require_organization_entity
async def list_organizations(
    user_id: str = Query(..., description="Filter by user ID"),
    q: Optional[str] = Query(None, description="Search query (name fuzzy match)"),
    industry: Optional[str] = Query(None, description="Filter by industry"),
    limit: int = Query(100, ge=1, le=500, description="Max results"),
    tenant_id: str = Depends(get_current_tenant),
    repo: OrganizationRepository = Depends(get_organization_repository),
) -> List[OrganizationResponse]:
    """
    List all organizations for a user with optional search and filters.

    - **user_id**: Required, filter by owner
    - **q**: Optional, fuzzy name search
    - **industry**: Optional, filter by industry
    - **limit**: Max results (default 100)
    """
    if q:
        # Search mode
        organizations = await repo.search_by_name(tenant_id, user_id, q, limit)
    elif industry:
        # Filter by industry
        organizations = await repo.filter_by_industry(tenant_id, user_id, industry, limit)
    else:
        # List all mode
        organizations = await repo.list_by_user(tenant_id, user_id, limit)

    return [OrganizationResponse.from_organization(o) for o in organizations]


@router.post("/ensure-constraints", status_code=status.HTTP_200_OK)
@require_organization_entity
async def create_constraints(
    driver: AsyncDriver = Depends(get_neo4j_driver),
):
    """
    Create Neo4j constraints and indexes for Organization entity.

    Should be called once during deployment or migration.
    """
    await ensure_organization_constraints(driver)
    return {"status": "constraints_created"}

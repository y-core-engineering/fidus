"""
Person API routes.

These endpoints require the ENABLE_PERSON_ENTITY feature flag to be enabled.
When disabled, endpoints return 501 Not Implemented.
"""

from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List
import logging

from neo4j import AsyncDriver

from fidus.memory.entities.person import PersonCreate, PersonUpdate, PersonResponse
from fidus.memory.repositories.person_repository import (
    PersonRepository,
    ensure_person_constraints,
)
from fidus.dependencies import (
    get_person_repository,
    get_neo4j_driver,
    get_current_user,
    get_current_tenant,
)
from fidus.feature_flags import require_person_entity, is_person_entity_enabled

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/memory/entities/person", tags=["person"])


@router.get("/feature-status", status_code=status.HTTP_200_OK)
async def get_feature_status():
    """
    Get the current status of the Person entity feature flag.

    Returns whether the Person entity feature is enabled and provides
    guidance on how to enable/disable it.
    """
    enabled = is_person_entity_enabled()
    return {
        "feature": "ENABLE_PERSON_ENTITY",
        "enabled": enabled,
        "description": (
            "Person entity CRUD is enabled"
            if enabled
            else "Person entity feature is disabled"
        ),
        "hint": (
            "Set ENABLE_PERSON_ENTITY=false to disable"
            if enabled
            else "Set ENABLE_PERSON_ENTITY=true to enable Person entity management"
        ),
    }


@router.post("", response_model=PersonResponse, status_code=status.HTTP_201_CREATED)
@require_person_entity
async def create_person(
    person_data: PersonCreate,
    tenant_id: str = Depends(get_current_tenant),
    user_id: str = Depends(get_current_user),
    repo: PersonRepository = Depends(get_person_repository),
) -> PersonResponse:
    """
    Create a new Person entity.

    - **name**: Person's name (required)
    - **ai_properties**: Flexible dict of AI-discovered attributes
    - **confidence**: Extraction confidence (0.0 - 1.0)
    - **source**: explicit, inferred, llm_extracted
    """
    person = await repo.create(tenant_id, user_id, person_data)
    return PersonResponse.from_person(person)


@router.get("/{person_id}", response_model=PersonResponse)
@require_person_entity
async def get_person(
    person_id: str,
    tenant_id: str = Depends(get_current_tenant),
    repo: PersonRepository = Depends(get_person_repository),
) -> PersonResponse:
    """
    Get a Person by ID with all AI-discovered properties.
    """
    person = await repo.get(tenant_id, person_id)

    if not person:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Person {person_id} not found",
        )

    return PersonResponse.from_person(person)


@router.put("/{person_id}", response_model=PersonResponse)
@require_person_entity
async def update_person(
    person_id: str,
    update_data: PersonUpdate,
    tenant_id: str = Depends(get_current_tenant),
    repo: PersonRepository = Depends(get_person_repository),
) -> PersonResponse:
    """
    Update a Person entity.

    Properties are MERGED, not overwritten:
    - New keys are added
    - List values are unioned
    - Existing scalar values are preserved
    """
    person = await repo.update(tenant_id, person_id, update_data)

    if not person:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Person {person_id} not found",
        )

    return PersonResponse.from_person(person)


@router.delete("/{person_id}", status_code=status.HTTP_204_NO_CONTENT)
@require_person_entity
async def delete_person(
    person_id: str,
    tenant_id: str = Depends(get_current_tenant),
    repo: PersonRepository = Depends(get_person_repository),
):
    """
    Delete a Person entity with cascade (removes all relationships).

    This operation cannot be undone.
    """
    deleted = await repo.delete(tenant_id, person_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Person {person_id} not found",
        )


@router.get("", response_model=List[PersonResponse])
@require_person_entity
async def list_persons(
    user_id: str = Query(..., description="Filter by user ID"),
    q: str = Query(None, description="Search query (name fuzzy match)"),
    limit: int = Query(100, ge=1, le=500, description="Max results"),
    tenant_id: str = Depends(get_current_tenant),
    repo: PersonRepository = Depends(get_person_repository),
) -> List[PersonResponse]:
    """
    List all persons for a user with optional search.

    - **user_id**: Required, filter by owner
    - **q**: Optional, fuzzy name search
    - **limit**: Max results (default 100)
    """
    if q:
        # Search mode
        persons = await repo.search_by_name(tenant_id, user_id, q, limit)
    else:
        # List all mode
        persons = await repo.list_by_user(tenant_id, user_id, limit)

    return [PersonResponse.from_person(p) for p in persons]


@router.post("/ensure-constraints", status_code=status.HTTP_200_OK)
@require_person_entity
async def create_constraints(
    driver: AsyncDriver = Depends(get_neo4j_driver),
):
    """
    Create Neo4j constraints and indexes for Person entity.

    Should be called once during deployment or migration.
    """
    await ensure_person_constraints(driver)
    return {"status": "constraints_created"}

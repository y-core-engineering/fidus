"""
Organization repository: Database operations for Organization entity.

Implements CRUD operations with multi-tenancy and property merging.
"""

from typing import List, Optional
from datetime import datetime
import json
import logging

from neo4j import AsyncDriver
from fidus.memory.entities.organization import (
    Organization,
    OrganizationCreate,
    OrganizationUpdate,
)

logger = logging.getLogger(__name__)


class OrganizationRepository:
    """
    Repository for Organization entity operations.

    Implements:
    - CRUD operations (create, get, update, delete)
    - Search by name (fuzzy matching)
    - List all organizations for a user
    - Filter by industry
    - Property merging for AI-discovered attributes
    """

    def __init__(self, neo4j_driver: AsyncDriver):
        self.driver = neo4j_driver

    async def create(
        self, tenant_id: str, user_id: str, org_data: OrganizationCreate
    ) -> Organization:
        """
        Create a new Organization node in Neo4j.

        Args:
            tenant_id: Multi-tenancy identifier
            user_id: Owner of this organization
            org_data: Organization creation data

        Returns:
            Created Organization entity
        """
        organization = Organization(
            tenant_id=tenant_id,
            user_id=user_id,
            name=org_data.name,
            ai_properties=org_data.ai_properties,
            confidence=org_data.confidence,
            source=org_data.source,
        )
        now = datetime.utcnow()

        query = """
        CREATE (o:Organization {
            id: $id,
            tenant_id: $tenant_id,
            user_id: $user_id,
            name: $name,
            ai_properties: $ai_properties,
            created_at: datetime($created_at),
            updated_at: datetime($updated_at),
            confidence: $confidence,
            source: $source
        })
        RETURN o
        """

        async with self.driver.session() as session:
            result = await session.run(
                query,
                id=organization.id,
                tenant_id=organization.tenant_id,
                user_id=organization.user_id,
                name=organization.name,
                ai_properties=json.dumps(organization.ai_properties),
                created_at=now.isoformat(),
                updated_at=now.isoformat(),
                confidence=organization.confidence,
                source=organization.source,
            )
            await result.consume()
            logger.info(
                f"Created organization {organization.id} for user {user_id}",
                extra={
                    "organization_id": organization.id,
                    "user_id": user_id,
                    "tenant_id": tenant_id,
                },
            )

        return organization

    async def get(self, tenant_id: str, org_id: str) -> Optional[Organization]:
        """
        Get an Organization by ID with tenant isolation.

        Args:
            tenant_id: Tenant identifier (for security)
            org_id: Organization identifier

        Returns:
            Organization entity or None if not found
        """
        query = """
        MATCH (o:Organization {id: $org_id, tenant_id: $tenant_id})
        RETURN o
        """

        async with self.driver.session() as session:
            result = await session.run(query, org_id=org_id, tenant_id=tenant_id)
            record = await result.single()

            if not record:
                return None

            return self._record_to_organization(record["o"])

    async def update(
        self, tenant_id: str, org_id: str, update_data: OrganizationUpdate
    ) -> Optional[Organization]:
        """
        Update an Organization with property merging.

        Strategy:
        - If name provided, update name
        - If ai_properties provided, MERGE (don't overwrite)
        """
        # First get existing organization
        organization = await self.get(tenant_id, org_id)
        if not organization:
            return None

        # Apply updates
        if update_data.name:
            organization.name = update_data.name

        if update_data.ai_properties:
            organization.merge_properties(update_data.ai_properties)

        # Update in Neo4j
        query = """
        MATCH (o:Organization {id: $org_id, tenant_id: $tenant_id})
        SET o.name = $name,
            o.ai_properties = $ai_properties,
            o.updated_at = datetime($updated_at)
        RETURN o
        """

        now = datetime.utcnow()
        async with self.driver.session() as session:
            result = await session.run(
                query,
                org_id=org_id,
                tenant_id=tenant_id,
                name=organization.name,
                ai_properties=json.dumps(organization.ai_properties),
                updated_at=now.isoformat(),
            )
            await result.consume()
            logger.info(
                f"Updated organization {org_id}",
                extra={"organization_id": org_id, "tenant_id": tenant_id},
            )

        organization.updated_at = now
        return organization

    async def delete(self, tenant_id: str, org_id: str) -> bool:
        """
        Delete an Organization with cascade (remove all relationships).

        Args:
            tenant_id: Tenant identifier (for security)
            org_id: Organization identifier

        Returns:
            True if deleted, False if not found
        """
        query = """
        MATCH (o:Organization {id: $org_id, tenant_id: $tenant_id})
        DETACH DELETE o
        RETURN count(o) as deleted_count
        """

        async with self.driver.session() as session:
            result = await session.run(query, org_id=org_id, tenant_id=tenant_id)
            record = await result.single()
            deleted = record["deleted_count"] > 0

            if deleted:
                logger.info(
                    f"Deleted organization {org_id}",
                    extra={"organization_id": org_id, "tenant_id": tenant_id},
                )
            return deleted

    async def list_by_user(
        self, tenant_id: str, user_id: str, limit: int = 100
    ) -> List[Organization]:
        """
        List all organizations for a user.

        Args:
            tenant_id: Tenant identifier
            user_id: User identifier
            limit: Max results (default 100)

        Returns:
            List of Organization entities
        """
        query = """
        MATCH (o:Organization {tenant_id: $tenant_id, user_id: $user_id})
        RETURN o
        ORDER BY o.name ASC
        LIMIT $limit
        """

        async with self.driver.session() as session:
            result = await session.run(
                query,
                tenant_id=tenant_id,
                user_id=user_id,
                limit=limit,
            )

            organizations = []
            async for record in result:
                organizations.append(self._record_to_organization(record["o"]))

            return organizations

    async def search_by_name(
        self,
        tenant_id: str,
        user_id: str,
        query_string: str,
        limit: int = 50,
    ) -> List[Organization]:
        """
        Search organizations by name (case-insensitive, contains matching).

        Args:
            tenant_id: Tenant identifier
            user_id: User identifier
            query_string: Search query
            limit: Max results

        Returns:
            List of matching Organization entities
        """
        query = """
        MATCH (o:Organization {tenant_id: $tenant_id, user_id: $user_id})
        WHERE toLower(o.name) CONTAINS toLower($query_string)
        RETURN o
        ORDER BY o.name ASC
        LIMIT $limit
        """

        async with self.driver.session() as session:
            result = await session.run(
                query,
                tenant_id=tenant_id,
                user_id=user_id,
                query_string=query_string,
                limit=limit,
            )

            organizations = []
            async for record in result:
                organizations.append(self._record_to_organization(record["o"]))

            return organizations

    async def filter_by_industry(
        self,
        tenant_id: str,
        user_id: str,
        industry: str,
        limit: int = 50,
    ) -> List[Organization]:
        """
        Filter organizations by industry (from ai_properties).

        Args:
            tenant_id: Tenant identifier
            user_id: User identifier
            industry: Industry to filter by
            limit: Max results

        Returns:
            List of matching Organization entities
        """
        query = """
        MATCH (o:Organization {tenant_id: $tenant_id, user_id: $user_id})
        WHERE o.ai_properties CONTAINS $industry_pattern
        RETURN o
        ORDER BY o.name ASC
        LIMIT $limit
        """

        # Since ai_properties is stored as JSON string, we search for the pattern
        industry_pattern = f'"industry": "{industry}"'

        async with self.driver.session() as session:
            result = await session.run(
                query,
                tenant_id=tenant_id,
                user_id=user_id,
                industry_pattern=industry_pattern,
                limit=limit,
            )

            organizations = []
            async for record in result:
                organizations.append(self._record_to_organization(record["o"]))

            return organizations

    async def find_by_name_exact(
        self, tenant_id: str, user_id: str, name: str
    ) -> Optional[Organization]:
        """
        Find an organization by exact name match.

        Useful for deduplication when extracting organizations from conversations.

        Args:
            tenant_id: Tenant identifier
            user_id: User identifier
            name: Exact name to match

        Returns:
            Organization if found, None otherwise
        """
        query = """
        MATCH (o:Organization {tenant_id: $tenant_id, user_id: $user_id})
        WHERE o.name = $name
        RETURN o
        LIMIT 1
        """

        async with self.driver.session() as session:
            result = await session.run(
                query,
                tenant_id=tenant_id,
                user_id=user_id,
                name=name,
            )
            record = await result.single()

            if not record:
                return None

            return self._record_to_organization(record["o"])

    async def update_properties(
        self,
        tenant_id: str,
        org_id: str,
        new_properties: dict,
    ) -> Optional[Organization]:
        """
        Merge new AI-discovered properties into existing organization.

        Convenience method for LLM extraction workflows.
        """
        return await self.update(
            tenant_id,
            org_id,
            OrganizationUpdate(ai_properties=new_properties),
        )

    def _record_to_organization(self, record) -> Organization:
        """Convert Neo4j record to Organization entity."""
        # Parse ai_properties from JSON string
        ai_properties = {}
        if record.get("ai_properties"):
            try:
                ai_properties = json.loads(record["ai_properties"])
            except (json.JSONDecodeError, TypeError):
                ai_properties = {}

        # Handle datetime conversion
        created_at = record.get("created_at")
        updated_at = record.get("updated_at")

        # Neo4j datetime objects need to be converted
        if hasattr(created_at, "to_native"):
            created_at = created_at.to_native()
        elif isinstance(created_at, str):
            created_at = datetime.fromisoformat(created_at.replace("Z", "+00:00"))

        if hasattr(updated_at, "to_native"):
            updated_at = updated_at.to_native()
        elif isinstance(updated_at, str):
            updated_at = datetime.fromisoformat(updated_at.replace("Z", "+00:00"))

        return Organization(
            id=record["id"],
            tenant_id=record["tenant_id"],
            user_id=record["user_id"],
            name=record["name"],
            ai_properties=ai_properties,
            created_at=created_at or datetime.utcnow(),
            updated_at=updated_at or datetime.utcnow(),
            confidence=record.get("confidence", 0.9),
            source=record.get("source", "explicit"),
        )


async def ensure_organization_constraints(neo4j_driver: AsyncDriver) -> None:
    """
    Create Neo4j constraints and indexes for Organization entity.

    This should be run on application startup or via migration script.
    """
    constraints = [
        "CREATE CONSTRAINT organization_id_unique IF NOT EXISTS FOR (o:Organization) REQUIRE o.id IS UNIQUE",
        "CREATE INDEX organization_tenant_user_idx IF NOT EXISTS FOR (o:Organization) ON (o.tenant_id, o.user_id)",
        "CREATE INDEX organization_name_idx IF NOT EXISTS FOR (o:Organization) ON (o.name)",
    ]

    async with neo4j_driver.session() as session:
        for constraint in constraints:
            try:
                await session.run(constraint)
                logger.info(f"Created constraint/index: {constraint}")
            except Exception as e:
                logger.warning(f"Constraint/index may already exist: {e}")

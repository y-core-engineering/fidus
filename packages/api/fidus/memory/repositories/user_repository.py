"""
User repository: Database operations for User entity.
"""

from typing import Optional, List
from uuid import uuid4
from datetime import datetime
import json
import logging

from neo4j import AsyncDriver
from fidus.memory.entities.user import User, UserCreate, UserUpdate

logger = logging.getLogger(__name__)


class UserRepository:
    """Repository for User entity operations."""

    def __init__(self, neo4j_driver: AsyncDriver):
        self.driver = neo4j_driver

    async def create(self, user_data: UserCreate) -> User:
        """
        Create a new user in Neo4j.

        Args:
            user_data: User creation data

        Returns:
            Created User entity

        Raises:
            ValueError: If user with email already exists
        """
        user_id = str(uuid4())
        now = datetime.utcnow()

        # NOTE (ADR-0003): Skills are stored on relationship contexts in Qdrant, not on User
        query = """
        MERGE (u:User {email: $email, tenant_id: $tenant_id})
        ON CREATE SET
            u.id = $user_id,
            u.name = $name,
            u.preferred_language = $preferred_language,
            u.timezone = $timezone,
            u.ai_properties = $ai_properties,
            u.created_at = datetime($created_at),
            u.updated_at = datetime($updated_at)
        ON MATCH SET
            u._already_exists = true
        RETURN u, u._already_exists IS NOT NULL as already_exists
        """

        async with self.driver.session() as session:
            result = await session.run(
                query,
                user_id=user_id,
                tenant_id=user_data.tenant_id,
                email=user_data.email,
                name=user_data.name,
                preferred_language=user_data.preferred_language,
                timezone=user_data.timezone,
                ai_properties=json.dumps(user_data.ai_properties),
                created_at=now.isoformat(),
                updated_at=now.isoformat()
            )
            record = await result.single()

            if record["already_exists"]:
                raise ValueError(f"User with email {user_data.email} already exists")

            return self._record_to_user(record["u"])

    async def get(self, user_id: str, tenant_id: str) -> Optional[User]:
        """
        Retrieve user by ID.

        Args:
            user_id: User identifier
            tenant_id: Tenant identifier (for multi-tenancy isolation)

        Returns:
            User entity or None if not found
        """
        query = """
        MATCH (u:User {id: $user_id, tenant_id: $tenant_id})
        RETURN u
        """

        async with self.driver.session() as session:
            result = await session.run(query, user_id=user_id, tenant_id=tenant_id)
            record = await result.single()

            if not record:
                return None

            return self._record_to_user(record["u"])

    async def get_by_email(self, email: str, tenant_id: str) -> Optional[User]:
        """
        Retrieve user by email.

        Args:
            email: User email
            tenant_id: Tenant identifier (for multi-tenancy isolation)

        Returns:
            User entity or None if not found
        """
        query = """
        MATCH (u:User {email: $email, tenant_id: $tenant_id})
        RETURN u
        """

        async with self.driver.session() as session:
            result = await session.run(query, email=email, tenant_id=tenant_id)
            record = await result.single()

            if not record:
                return None

            return self._record_to_user(record["u"])

    async def update(self, user_id: str, tenant_id: str, updates: UserUpdate) -> Optional[User]:
        """
        Update user properties.

        Args:
            user_id: User identifier
            tenant_id: Tenant identifier
            updates: Fields to update

        Returns:
            Updated User entity or None if not found
        """
        # Build dynamic SET clause
        set_clauses = ["u.updated_at = datetime($updated_at)"]
        params = {
            "user_id": user_id,
            "tenant_id": tenant_id,
            "updated_at": datetime.utcnow().isoformat()
        }

        if updates.name is not None:
            set_clauses.append("u.name = $name")
            params["name"] = updates.name

        if updates.preferred_language is not None:
            set_clauses.append("u.preferred_language = $preferred_language")
            params["preferred_language"] = updates.preferred_language

        if updates.timezone is not None:
            set_clauses.append("u.timezone = $timezone")
            params["timezone"] = updates.timezone

        # NOTE (ADR-0003): Skills are stored on relationship contexts in Qdrant, not on User

        if updates.ai_properties is not None:
            # Merge ai_properties (don't overwrite, add new keys)
            set_clauses.append("""
                u.ai_properties = CASE
                    WHEN u.ai_properties IS NULL THEN $ai_properties
                    ELSE apoc.convert.toJson(
                        apoc.map.merge(
                            apoc.convert.fromJsonMap(u.ai_properties),
                            apoc.convert.fromJsonMap($ai_properties)
                        )
                    )
                END
            """)
            params["ai_properties"] = json.dumps(updates.ai_properties)

        query = f"""
        MATCH (u:User {{id: $user_id, tenant_id: $tenant_id}})
        SET {', '.join(set_clauses)}
        RETURN u
        """

        async with self.driver.session() as session:
            result = await session.run(query, **params)
            record = await result.single()

            if not record:
                return None

            return self._record_to_user(record["u"])

    async def delete(self, user_id: str, tenant_id: str) -> bool:
        """
        Delete user and cascade delete all related entities (GDPR compliance).

        This implements the "Right to Erasure" by deleting:
        1. All relationships originating from User
        2. All entities connected to User
        3. The User node itself

        Args:
            user_id: User identifier
            tenant_id: Tenant identifier

        Returns:
            True if deleted, False if not found
        """
        # GDPR cascade delete: delete user and all connected entities
        # Using multiple queries to avoid Cypher syntax issues with DELETE and MATCH
        query = """
        MATCH (u:User {id: $user_id, tenant_id: $tenant_id})
        OPTIONAL MATCH (u)-[r]->(e)
        DETACH DELETE e
        WITH u
        DETACH DELETE u
        RETURN count(*) as deleted_count
        """

        async with self.driver.session() as session:
            result = await session.run(query, user_id=user_id, tenant_id=tenant_id)
            record = await result.single()
            deleted_count = record["deleted_count"]

            logger.info(f"Deleted user {user_id} and all related data (GDPR cascade delete)")
            return deleted_count > 0

    async def list_by_tenant(self, tenant_id: str, limit: int = 100) -> List[User]:
        """
        List all users for a tenant.

        Args:
            tenant_id: Tenant identifier
            limit: Maximum number of users to return

        Returns:
            List of User entities
        """
        query = """
        MATCH (u:User {tenant_id: $tenant_id})
        RETURN u
        ORDER BY u.created_at DESC
        LIMIT $limit
        """

        async with self.driver.session() as session:
            result = await session.run(query, tenant_id=tenant_id, limit=limit)
            records = [record async for record in result]
            return [self._record_to_user(record["u"]) for record in records]

    def _record_to_user(self, record) -> User:
        """Convert Neo4j record to User entity."""
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

        return User(
            id=record["id"],
            tenant_id=record["tenant_id"],
            email=record["email"],
            name=record["name"],
            preferred_language=record.get("preferred_language", "en"),
            timezone=record.get("timezone", "UTC"),
            ai_properties=ai_properties,
            created_at=created_at or datetime.utcnow(),
            updated_at=updated_at or datetime.utcnow()
        )


async def ensure_user_constraints(neo4j_driver: AsyncDriver) -> None:
    """
    Create Neo4j constraints and indexes for User entity.

    This should be run on application startup or via migration script.
    """
    constraints = [
        "CREATE CONSTRAINT user_id_unique IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE",
        "CREATE CONSTRAINT user_email_tenant_unique IF NOT EXISTS FOR (u:User) REQUIRE (u.email, u.tenant_id) IS UNIQUE",
        "CREATE INDEX user_tenant_idx IF NOT EXISTS FOR (u:User) ON (u.tenant_id)",
        "CREATE INDEX user_email_idx IF NOT EXISTS FOR (u:User) ON (u.email)"
    ]

    async with neo4j_driver.session() as session:
        for constraint in constraints:
            try:
                await session.run(constraint)
                logger.info(f"Created constraint/index: {constraint}")
            except Exception as e:
                logger.warning(f"Constraint/index may already exist: {e}")

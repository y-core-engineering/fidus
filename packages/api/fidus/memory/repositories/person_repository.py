"""
Person repository: Database operations for Person entity.

Implements CRUD operations with multi-tenancy and property merging.
"""

from typing import List, Optional
from datetime import datetime
import json
import logging

from neo4j import AsyncDriver
from fidus.memory.entities.person import Person, PersonCreate, PersonUpdate

logger = logging.getLogger(__name__)


class PersonRepository:
    """
    Repository for Person entity operations.

    Implements:
    - CRUD operations (create, get, update, delete)
    - Search by name (fuzzy matching)
    - List all persons for a user
    - Property merging for AI-discovered attributes
    """

    def __init__(self, neo4j_driver: AsyncDriver):
        self.driver = neo4j_driver

    async def create(
        self, tenant_id: str, user_id: str, person_data: PersonCreate
    ) -> Person:
        """
        Create a new Person node in Neo4j.

        Args:
            tenant_id: Multi-tenancy identifier
            user_id: Owner of this person
            person_data: Person creation data

        Returns:
            Created Person entity
        """
        person = Person(
            tenant_id=tenant_id,
            user_id=user_id,
            name=person_data.name,
            ai_properties=person_data.ai_properties,
            confidence=person_data.confidence,
            source=person_data.source,
        )
        now = datetime.utcnow()

        query = """
        CREATE (p:Person {
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
        RETURN p
        """

        async with self.driver.session() as session:
            result = await session.run(
                query,
                id=person.id,
                tenant_id=person.tenant_id,
                user_id=person.user_id,
                name=person.name,
                ai_properties=json.dumps(person.ai_properties),
                created_at=now.isoformat(),
                updated_at=now.isoformat(),
                confidence=person.confidence,
                source=person.source,
            )
            await result.consume()
            logger.info(
                f"Created person {person.id} for user {user_id}",
                extra={"person_id": person.id, "user_id": user_id, "tenant_id": tenant_id},
            )

        return person

    async def get(self, tenant_id: str, person_id: str) -> Optional[Person]:
        """
        Get a Person by ID with tenant isolation.

        Args:
            tenant_id: Tenant identifier (for security)
            person_id: Person identifier

        Returns:
            Person entity or None if not found
        """
        query = """
        MATCH (p:Person {id: $person_id, tenant_id: $tenant_id})
        RETURN p
        """

        async with self.driver.session() as session:
            result = await session.run(
                query, person_id=person_id, tenant_id=tenant_id
            )
            record = await result.single()

            if not record:
                return None

            return self._record_to_person(record["p"])

    async def update(
        self, tenant_id: str, person_id: str, update_data: PersonUpdate
    ) -> Optional[Person]:
        """
        Update a Person with property merging.

        Strategy:
        - If name provided, update name
        - If ai_properties provided, MERGE (don't overwrite)
        """
        # First get existing person
        person = await self.get(tenant_id, person_id)
        if not person:
            return None

        # Apply updates
        if update_data.name:
            person.name = update_data.name

        if update_data.ai_properties:
            person.merge_properties(update_data.ai_properties)

        # Update in Neo4j
        query = """
        MATCH (p:Person {id: $person_id, tenant_id: $tenant_id})
        SET p.name = $name,
            p.ai_properties = $ai_properties,
            p.updated_at = datetime($updated_at)
        RETURN p
        """

        now = datetime.utcnow()
        async with self.driver.session() as session:
            result = await session.run(
                query,
                person_id=person_id,
                tenant_id=tenant_id,
                name=person.name,
                ai_properties=json.dumps(person.ai_properties),
                updated_at=now.isoformat(),
            )
            await result.consume()
            logger.info(
                f"Updated person {person_id}",
                extra={"person_id": person_id, "tenant_id": tenant_id},
            )

        person.updated_at = now
        return person

    async def delete(self, tenant_id: str, person_id: str) -> bool:
        """
        Delete a Person with cascade (remove all relationships).

        Args:
            tenant_id: Tenant identifier (for security)
            person_id: Person identifier

        Returns:
            True if deleted, False if not found
        """
        query = """
        MATCH (p:Person {id: $person_id, tenant_id: $tenant_id})
        DETACH DELETE p
        RETURN count(p) as deleted_count
        """

        async with self.driver.session() as session:
            result = await session.run(
                query, person_id=person_id, tenant_id=tenant_id
            )
            record = await result.single()
            deleted = record["deleted_count"] > 0

            if deleted:
                logger.info(
                    f"Deleted person {person_id}",
                    extra={"person_id": person_id, "tenant_id": tenant_id},
                )
            return deleted

    async def list_by_user(
        self, tenant_id: str, user_id: str, limit: int = 100
    ) -> List[Person]:
        """
        List all persons for a user.

        Args:
            tenant_id: Tenant identifier
            user_id: User identifier
            limit: Max results (default 100)

        Returns:
            List of Person entities
        """
        query = """
        MATCH (p:Person {tenant_id: $tenant_id, user_id: $user_id})
        RETURN p
        ORDER BY p.name ASC
        LIMIT $limit
        """

        async with self.driver.session() as session:
            result = await session.run(
                query,
                tenant_id=tenant_id,
                user_id=user_id,
                limit=limit,
            )

            persons = []
            async for record in result:
                persons.append(self._record_to_person(record["p"]))

            return persons

    async def search_by_name(
        self,
        tenant_id: str,
        user_id: str,
        query_string: str,
        limit: int = 50,
    ) -> List[Person]:
        """
        Search persons by name (case-insensitive, contains matching).

        Args:
            tenant_id: Tenant identifier
            user_id: User identifier
            query_string: Search query
            limit: Max results

        Returns:
            List of matching Person entities
        """
        query = """
        MATCH (p:Person {tenant_id: $tenant_id, user_id: $user_id})
        WHERE toLower(p.name) CONTAINS toLower($query_string)
        RETURN p
        ORDER BY p.name ASC
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

            persons = []
            async for record in result:
                persons.append(self._record_to_person(record["p"]))

            return persons

    async def find_by_name_exact(
        self, tenant_id: str, user_id: str, name: str
    ) -> Optional[Person]:
        """
        Find a person by exact name match.

        Useful for deduplication when extracting persons from conversations.

        Args:
            tenant_id: Tenant identifier
            user_id: User identifier
            name: Exact name to match

        Returns:
            Person if found, None otherwise
        """
        query = """
        MATCH (p:Person {tenant_id: $tenant_id, user_id: $user_id})
        WHERE p.name = $name
        RETURN p
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

            return self._record_to_person(record["p"])

    async def update_properties(
        self,
        tenant_id: str,
        person_id: str,
        new_properties: dict,
    ) -> Optional[Person]:
        """
        Merge new AI-discovered properties into existing person.

        Convenience method for LLM extraction workflows.
        """
        return await self.update(
            tenant_id,
            person_id,
            PersonUpdate(ai_properties=new_properties),
        )

    def _record_to_person(self, record) -> Person:
        """Convert Neo4j record to Person entity."""
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

        return Person(
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


async def ensure_person_constraints(neo4j_driver: AsyncDriver) -> None:
    """
    Create Neo4j constraints and indexes for Person entity.

    This should be run on application startup or via migration script.
    """
    constraints = [
        "CREATE CONSTRAINT person_id_unique IF NOT EXISTS FOR (p:Person) REQUIRE p.id IS UNIQUE",
        "CREATE INDEX person_tenant_user_idx IF NOT EXISTS FOR (p:Person) ON (p.tenant_id, p.user_id)",
        "CREATE INDEX person_name_idx IF NOT EXISTS FOR (p:Person) ON (p.name)",
    ]

    async with neo4j_driver.session() as session:
        for constraint in constraints:
            try:
                await session.run(constraint)
                logger.info(f"Created constraint/index: {constraint}")
            except Exception as e:
                logger.warning(f"Constraint/index may already exist: {e}")

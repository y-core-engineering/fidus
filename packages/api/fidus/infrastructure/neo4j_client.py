"""Neo4j client for Fidus Memory persistence.

This module provides a Neo4j-based preference store that implements
multi-tenant graph storage for user preferences with confidence scoring.
"""

import uuid
from typing import Dict, List, Optional, Any
from neo4j import AsyncGraphDatabase, AsyncDriver, AsyncSession
from fidus.config import PrototypeConfig


class Neo4jPreferenceStore:
    """Neo4j-based preference store with multi-tenant support.

    Stores user preferences in a graph database with:
    - Multi-tenancy (tenant_id required for all operations)
    - Confidence scoring (0.0 to 0.95)
    - Domain categorization
    - Relationship tracking

    Schema:
        (Preference {
            id: string (UUID),
            tenant_id: string,
            key: string,
            sentiment: string,
            confidence: float,
            domain: string,
            created_at: datetime,
            updated_at: datetime
        })
    """

    def __init__(self, config: PrototypeConfig, cache: Optional[Any] = None):
        """Initialize Neo4j connection.

        Args:
            config: PrototypeConfig instance with Neo4j credentials
            cache: Optional SessionCache instance for performance optimization
        """
        self.config = config
        self.cache = cache
        self._driver: Optional[AsyncDriver] = None

    async def connect(self) -> None:
        """Establish connection to Neo4j database."""
        self._driver = AsyncGraphDatabase.driver(
            self.config.neo4j_uri,
            auth=(self.config.neo4j_user, self.config.neo4j_password),
        )
        # Verify connection
        await self._driver.verify_connectivity()

        # Create constraints for better performance
        await self._create_constraints()

    async def disconnect(self) -> None:
        """Close connection to Neo4j database."""
        if self._driver:
            await self._driver.close()
            self._driver = None

    async def _create_constraints(self) -> None:
        """Create database constraints and indexes."""
        if not self._driver:
            raise RuntimeError("Driver not initialized. Call connect() first.")

        async with self._driver.session() as session:
            # Unique constraint on preference ID
            await session.run(
                """
                CREATE CONSTRAINT preference_id_unique IF NOT EXISTS
                FOR (p:Preference)
                REQUIRE p.id IS UNIQUE
                """
            )

            # Index on tenant_id for fast filtering
            await session.run(
                """
                CREATE INDEX preference_tenant_idx IF NOT EXISTS
                FOR (p:Preference)
                ON (p.tenant_id)
                """
            )

            # Index on key for fast lookups
            await session.run(
                """
                CREATE INDEX preference_key_idx IF NOT EXISTS
                FOR (p:Preference)
                ON (p.key)
                """
            )

    async def create_preference(
        self,
        tenant_id: str,
        key: str,
        sentiment: str,
        confidence: float = 0.5,
        value: str = "",
        user_id: Optional[str] = None,
    ) -> Dict[str, any]:
        """Create a new preference.

        Args:
            tenant_id: Tenant identifier (required for multi-tenancy)
            key: Preference key (e.g., "food.cappuccino")
            sentiment: Sentiment value ("positive" or "negative")
            confidence: Confidence score (0.0 to 0.95)
            value: Descriptive text for the preference
            user_id: Optional user identifier for cache invalidation (defaults to tenant_id)

        Returns:
            Created preference as dictionary

        Raises:
            RuntimeError: If driver not initialized
            ValueError: If confidence is out of range
        """
        if not self._driver:
            raise RuntimeError("Driver not initialized. Call connect() first.")

        if not 0.0 <= confidence <= 0.95:
            raise ValueError(f"Confidence must be between 0.0 and 0.95, got {confidence}")

        # Use tenant_id as user_id if not provided
        if user_id is None:
            user_id = tenant_id

        # Extract domain from key (e.g., "food" from "food.cappuccino")
        domain = key.split(".")[0] if "." in key else "general"

        # Generate UUID
        preference_id = str(uuid.uuid4())

        async with self._driver.session() as session:
            result = await session.run(
                """
                CREATE (p:Preference {
                    id: $id,
                    tenant_id: $tenant_id,
                    key: $key,
                    value: $value,
                    sentiment: $sentiment,
                    confidence: $confidence,
                    domain: $domain,
                    created_at: datetime(),
                    updated_at: datetime(),
                    reinforcement_count: 0,
                    rejection_count: 0
                })
                RETURN p
                """,
                id=preference_id,
                tenant_id=tenant_id,
                key=key,
                value=value,
                sentiment=sentiment,
                confidence=confidence,
                domain=domain,
            )

            record = await result.single()
            if not record:
                raise RuntimeError("Failed to create preference")

            node = record["p"]

            # Invalidate cache after creating preference
            if self.cache:
                await self.cache.invalidate_preferences(tenant_id, user_id)

            return dict(node)

    async def get_preferences(
        self,
        tenant_id: str,
        user_id: Optional[str] = None,
    ) -> List[Dict[str, any]]:
        """Get all preferences for a tenant.

        Args:
            tenant_id: Tenant identifier
            user_id: Optional user identifier for cache key (defaults to tenant_id)

        Returns:
            List of preferences as dictionaries

        Raises:
            RuntimeError: If driver not initialized
        """
        # Use tenant_id as user_id if not provided (for backwards compatibility)
        if user_id is None:
            user_id = tenant_id

        # Check cache first if available
        if self.cache:
            cached = await self.cache.get_cached_preferences(tenant_id, user_id)
            if cached is not None:
                return cached

        # Cache miss - fetch from database
        if not self._driver:
            raise RuntimeError("Driver not initialized. Call connect() first.")

        async with self._driver.session() as session:
            result = await session.run(
                """
                MATCH (p:Preference)
                WHERE p.tenant_id = $tenant_id
                RETURN p
                ORDER BY p.created_at DESC
                """,
                tenant_id=tenant_id,
            )

            preferences = []
            async for record in result:
                node = record["p"]
                preferences.append(dict(node))

            # Cache the result if cache is available
            if self.cache:
                await self.cache.cache_preferences(tenant_id, user_id, preferences)

            return preferences

    async def update_confidence(
        self,
        tenant_id: str,
        preference_id: str,
        delta: float,
        user_id: Optional[str] = None,
    ) -> Dict[str, any]:
        """Update confidence score for a preference.

        Args:
            tenant_id: Tenant identifier (for security check)
            preference_id: Preference UUID
            delta: Change in confidence (+0.1 for accept, -0.15 for reject)
            user_id: Optional user identifier for cache invalidation (defaults to tenant_id)

        Returns:
            Updated preference as dictionary

        Raises:
            RuntimeError: If driver not initialized
            ValueError: If preference not found or tenant mismatch
        """
        if not self._driver:
            raise RuntimeError("Driver not initialized. Call connect() first.")

        # Use tenant_id as user_id if not provided
        if user_id is None:
            user_id = tenant_id

        async with self._driver.session() as session:
            result = await session.run(
                """
                MATCH (p:Preference)
                WHERE p.id = $id AND p.tenant_id = $tenant_id
                SET p.confidence = CASE
                    WHEN p.confidence + $delta > 0.95 THEN 0.95
                    WHEN p.confidence + $delta < 0.0 THEN 0.0
                    ELSE p.confidence + $delta
                END,
                p.reinforcement_count = CASE
                    WHEN $delta > 0 THEN p.reinforcement_count + 1
                    ELSE p.reinforcement_count
                END,
                p.rejection_count = CASE
                    WHEN $delta < 0 THEN p.rejection_count + 1
                    ELSE p.rejection_count
                END,
                p.updated_at = datetime()
                RETURN p
                """,
                id=preference_id,
                tenant_id=tenant_id,
                delta=delta,
            )

            record = await result.single()
            if not record:
                raise ValueError(
                    f"Preference {preference_id} not found for tenant {tenant_id}"
                )

            node = record["p"]

            # Invalidate cache after updating preference
            if self.cache:
                await self.cache.invalidate_preferences(tenant_id, user_id)

            return dict(node)

    async def delete_preference(
        self,
        tenant_id: str,
        preference_id: str,
        user_id: Optional[str] = None,
    ) -> bool:
        """Delete a preference.

        Args:
            tenant_id: Tenant identifier (for security check)
            preference_id: Preference UUID
            user_id: Optional user identifier for cache invalidation (defaults to tenant_id)

        Returns:
            True if deleted, False if not found

        Raises:
            RuntimeError: If driver not initialized
        """
        if not self._driver:
            raise RuntimeError("Driver not initialized. Call connect() first.")

        # Use tenant_id as user_id if not provided
        if user_id is None:
            user_id = tenant_id

        async with self._driver.session() as session:
            result = await session.run(
                """
                MATCH (p:Preference)
                WHERE p.id = $id AND p.tenant_id = $tenant_id
                DETACH DELETE p
                RETURN count(p) as deleted_count
                """,
                id=preference_id,
                tenant_id=tenant_id,
            )

            record = await result.single()
            deleted_count = record["deleted_count"] if record else 0

            # Invalidate cache after deleting preference
            if deleted_count > 0 and self.cache:
                await self.cache.invalidate_preferences(tenant_id, user_id)

            return deleted_count > 0

    async def delete_all_preferences(
        self,
        tenant_id: str,
        user_id: Optional[str] = None,
    ) -> int:
        """Delete all preferences for a tenant.

        Args:
            tenant_id: Tenant identifier
            user_id: Optional user identifier for cache invalidation (defaults to tenant_id)

        Returns:
            Number of preferences deleted

        Raises:
            RuntimeError: If driver not initialized
        """
        if not self._driver:
            raise RuntimeError("Driver not initialized. Call connect() first.")

        # Use tenant_id as user_id if not provided
        if user_id is None:
            user_id = tenant_id

        async with self._driver.session() as session:
            result = await session.run(
                """
                MATCH (p:Preference)
                WHERE p.tenant_id = $tenant_id
                DETACH DELETE p
                RETURN count(p) as deleted_count
                """,
                tenant_id=tenant_id,
            )

            record = await result.single()
            deleted_count = record["deleted_count"] if record else 0

            # Invalidate cache after deleting all preferences
            if deleted_count > 0 and self.cache:
                await self.cache.invalidate_preferences(tenant_id, user_id)

            return deleted_count

    async def cleanup_orphaned_situations(self, tenant_id: str) -> int:
        """Delete situations that have no linked preferences (orphaned).

        Args:
            tenant_id: Tenant identifier

        Returns:
            Number of orphaned situations deleted

        Raises:
            RuntimeError: If driver not initialized
        """
        if not self._driver:
            raise RuntimeError("Driver not initialized. Call connect() first.")

        async with self._driver.session() as session:
            result = await session.run(
                """
                MATCH (s:Situation {tenant_id: $tenant_id})
                WHERE NOT (s)<-[:IN_SITUATION]-(:Preference)
                DETACH DELETE s
                RETURN count(s) as deleted_count
                """,
                tenant_id=tenant_id,
            )

            record = await result.single()
            return record["deleted_count"] if record else 0

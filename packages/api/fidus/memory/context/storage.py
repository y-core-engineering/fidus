"""Context storage service for persisting situations (Qdrant-First Pattern).

This module implements the Qdrant-First storage pattern (ADR-0001):
1. Qdrant is PRIMARY: Full context stored in payload with embeddings
2. Neo4j is SECONDARY: Only situation_id reference on Preference nodes (1-Hop queries)
3. No Situation nodes in Neo4j - all context lives in Qdrant

Architecture References:
- ADR-0001: Situational Context as Relationship Qualifier
- ADR-0002: Property Placement Strategy
"""

import logging
import uuid
from datetime import datetime, timezone
from typing import Optional

from neo4j import AsyncGraphDatabase, AsyncDriver
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct

from fidus.config import config
from fidus.memory.context.embedding_service import EmbeddingService
from fidus.memory.context.models import ContextFactors, Situation

logger = logging.getLogger(__name__)


class ContextStorageService:
    """Store and retrieve situations using Qdrant-First pattern.

    Qdrant-First Pattern (ADR-0001):
    - Qdrant: PRIMARY storage for full context payload + embeddings
    - Neo4j: SECONDARY with situation_id reference only (enables 1-Hop queries)

    Example:
        storage = ContextStorageService()
        situation = await storage.store_situation(
            context=ContextFactors(factors={"time_of_day": "morning"}),
            embedding=[0.1, 0.2, ...],
            tenant_id="tenant-1",
            user_id="user-1"
        )
    """

    COLLECTION_NAME = "situations"

    def __init__(
        self,
        neo4j_driver: Optional[AsyncDriver] = None,
        qdrant_client: Optional[QdrantClient] = None,
        embedding_service: Optional[EmbeddingService] = None,
    ):
        """Initialize the context storage service.

        Args:
            neo4j_driver: Neo4j async driver (defaults to new instance)
            qdrant_client: Qdrant client (defaults to new instance)
            embedding_service: Embedding service (defaults to new instance)
        """
        self.neo4j_driver = neo4j_driver or AsyncGraphDatabase.driver(
            config.neo4j_uri,
            auth=(config.neo4j_user, config.neo4j_password),
        )
        self.qdrant_client = qdrant_client or QdrantClient(
            host=config.qdrant_host,
            port=config.qdrant_port,
            grpc_port=config.qdrant_grpc_port,
        )
        self.embedding_service = embedding_service or EmbeddingService()

        logger.info("Initialized ContextStorageService (Qdrant-First pattern)")

    async def close(self) -> None:
        """Close database connections."""
        await self.neo4j_driver.close()
        logger.info("ContextStorageService connections closed")

    async def store_situation(
        self,
        context: ContextFactors,
        embedding: list[float],
        tenant_id: str,
        user_id: str,
    ) -> Situation:
        """Store a situation using Qdrant-First pattern.

        Qdrant-First: Store in Qdrant FIRST (PRIMARY), then Neo4j (SECONDARY).
        If Neo4j fails, rollback Qdrant for consistency.

        Args:
            context: Context factors for the situation
            embedding: Vector embedding of the context
            tenant_id: Tenant ID for multi-tenancy
            user_id: User ID for multi-tenancy

        Returns:
            Situation: The stored situation with generated ID

        Raises:
            Exception: If storage fails (with automatic rollback)
        """
        situation_id = str(uuid.uuid4())
        timestamp = datetime.now(timezone.utc).isoformat()

        logger.info(
            "Storing situation (Qdrant-First)",
            extra={
                "situation_id": situation_id,
                "tenant_id": tenant_id,
                "user_id": user_id,
                "factors_count": len(context.factors),
            },
        )

        try:
            # Store in Qdrant (PRIMARY) - No Neo4j Situation nodes per ADR-0001
            await self._store_in_qdrant(
                situation_id=situation_id,
                embedding=embedding,
                context=context,
                tenant_id=tenant_id,
                user_id=user_id,
                timestamp=timestamp,
            )

            situation = Situation(
                id=situation_id,
                tenant_id=tenant_id,
                user_id=user_id,
                context=context,
                embedding=embedding,
                created_at=timestamp,
                updated_at=timestamp,
            )

            logger.info(
                "Situation stored successfully (Qdrant-First)",
                extra={
                    "situation_id": situation_id,
                    "tenant_id": tenant_id,
                    "user_id": user_id,
                },
            )

            return situation

        except Exception as e:
            logger.error(
                f"Failed to store situation in Qdrant: {e}",
                extra={
                    "situation_id": situation_id,
                    "tenant_id": tenant_id,
                    "user_id": user_id,
                },
            )
            raise

    async def _store_in_qdrant(
        self,
        situation_id: str,
        embedding: list[float],
        context: ContextFactors,
        tenant_id: str,
        user_id: str,
        timestamp: str,
    ) -> None:
        """Store situation in Qdrant (PRIMARY storage).

        Full context is stored in payload for retrieval without Neo4j lookup.

        Args:
            situation_id: Unique situation identifier
            embedding: Vector embedding
            context: Context factors
            tenant_id: Tenant ID
            user_id: User ID
            timestamp: ISO format timestamp
        """
        point = PointStruct(
            id=situation_id,
            vector=embedding,
            payload={
                "tenant_id": tenant_id,
                "user_id": user_id,
                "factors": context.factors,
                "created_at": timestamp,
                "updated_at": timestamp,
            },
        )

        self.qdrant_client.upsert(
            collection_name=self.COLLECTION_NAME,
            points=[point],
        )

        logger.debug(
            "Stored situation in Qdrant",
            extra={"situation_id": situation_id},
        )

    async def link_preference_to_situation(
        self,
        preference_id: str,
        situation_id: str,
        tenant_id: str,
    ) -> None:
        """Link a preference to a situation using situation_id property.

        Qdrant-First Pattern: Uses situation_id property on HAS_PREFERENCE
        relationship instead of IN_SITUATION edge (enables 1-Hop queries).

        Args:
            preference_id: Preference node ID
            situation_id: Situation node ID (reference to Qdrant)
            tenant_id: Tenant ID for validation

        Raises:
            ValueError: If preference doesn't exist
        """
        logger.info(
            "Linking preference to situation (1-Hop pattern)",
            extra={
                "preference_id": preference_id,
                "situation_id": situation_id,
                "tenant_id": tenant_id,
            },
        )

        async with self.neo4j_driver.session() as session:
            result = await session.execute_write(
                self._update_preference_with_situation_id,
                preference_id,
                situation_id,
                tenant_id,
            )

            if not result:
                raise ValueError(
                    f"Failed to link preference {preference_id} to situation {situation_id}. "
                    f"Preference may not exist or may belong to different tenant."
                )

        logger.info(
            "Preference linked to situation (situation_id property set)",
            extra={
                "preference_id": preference_id,
                "situation_id": situation_id,
                "tenant_id": tenant_id,
            },
        )

    @staticmethod
    async def _update_preference_with_situation_id(
        tx,
        preference_id: str,
        situation_id: str,
        tenant_id: str,
    ) -> bool:
        """Update Preference node with situation_id property.

        1-Hop Pattern: situation_id is stored directly on Preference node,
        enabling direct lookup without traversing IN_SITUATION relationship.

        Args:
            tx: Neo4j transaction
            preference_id: Preference node ID
            situation_id: Situation ID (Qdrant reference)
            tenant_id: Tenant ID for validation

        Returns:
            bool: True if update successful
        """
        query = """
        MATCH (p:Preference {id: $preference_id, tenant_id: $tenant_id})
        SET p.situation_id = $situation_id
        RETURN p
        """

        result = await tx.run(
            query,
            preference_id=preference_id,
            situation_id=situation_id,
            tenant_id=tenant_id,
        )

        record = await result.single()
        return record is not None

    async def get_situation_by_id(
        self,
        situation_id: str,
        tenant_id: str,
    ) -> Optional[Situation]:
        """Retrieve a situation by ID from Qdrant (PRIMARY).

        Qdrant-First: Retrieves full context from Qdrant, not Neo4j.

        Args:
            situation_id: Situation ID to retrieve
            tenant_id: Tenant ID for isolation

        Returns:
            Optional[Situation]: The situation if found, None otherwise
        """
        logger.info(
            "Retrieving situation from Qdrant",
            extra={
                "situation_id": situation_id,
                "tenant_id": tenant_id,
            },
        )

        try:
            # Get from Qdrant (PRIMARY)
            points = self.qdrant_client.retrieve(
                collection_name=self.COLLECTION_NAME,
                ids=[situation_id],
            )

            if not points:
                logger.warning(
                    "Situation not found in Qdrant",
                    extra={
                        "situation_id": situation_id,
                        "tenant_id": tenant_id,
                    },
                )
                return None

            payload = points[0].payload

            # Validate tenant_id
            if payload.get("tenant_id") != tenant_id:
                logger.warning(
                    "Tenant mismatch when retrieving situation",
                    extra={
                        "situation_id": situation_id,
                        "expected_tenant": tenant_id,
                        "actual_tenant": payload.get("tenant_id"),
                    },
                )
                return None

            situation = Situation(
                id=situation_id,
                tenant_id=payload["tenant_id"],
                user_id=payload["user_id"],
                context=ContextFactors(factors=payload["factors"]),
                embedding=points[0].vector,
                created_at=payload["created_at"],
                updated_at=payload["updated_at"],
            )

            logger.info(
                "Situation retrieved successfully from Qdrant",
                extra={
                    "situation_id": situation_id,
                    "tenant_id": tenant_id,
                },
            )

            return situation

        except Exception as e:
            logger.error(
                f"Failed to retrieve situation: {e}",
                extra={
                    "situation_id": situation_id,
                    "tenant_id": tenant_id,
                },
            )
            return None

    async def get_context_by_situation_id(
        self,
        situation_id: str,
        tenant_id: str,
    ) -> Optional[ContextFactors]:
        """Retrieve context factors by situation_id from Qdrant.

        Args:
            situation_id: Situation ID
            tenant_id: Tenant ID for validation

        Returns:
            Optional[ContextFactors]: Context factors or None if not found
        """
        situation = await self.get_situation_by_id(situation_id, tenant_id)
        return situation.context if situation else None

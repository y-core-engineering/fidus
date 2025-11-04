"""Context storage service for persisting situations in Neo4j and Qdrant.

This module provides storage and retrieval of situations with their context
in both the graph database (Neo4j) and vector database (Qdrant).
"""

import json
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
    """Store and retrieve situations in Neo4j and Qdrant.

    This service manages the persistence of situations with their context:
    - Neo4j: Stores situation nodes with properties and relationships
    - Qdrant: Stores situation embeddings for similarity search

    Both databases are kept in sync with multi-tenancy enforcement.

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

        logger.info("Initialized ContextStorageService")

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
        """Store a situation in both Neo4j and Qdrant.

        Args:
            context: Context factors for the situation
            embedding: Vector embedding of the context
            tenant_id: Tenant ID for multi-tenancy
            user_id: User ID for multi-tenancy

        Returns:
            Situation: The stored situation with generated ID

        Raises:
            Exception: If storage fails in either database
        """
        situation_id = str(uuid.uuid4())
        timestamp = datetime.now(timezone.utc).isoformat()

        logger.info(
            "Storing situation",
            extra={
                "situation_id": situation_id,
                "tenant_id": tenant_id,
                "user_id": user_id,
                "factors_count": len(context.factors),
            },
        )

        try:
            # Store in Neo4j
            await self._store_in_neo4j(
                situation_id=situation_id,
                context=context,
                tenant_id=tenant_id,
                user_id=user_id,
                timestamp=timestamp,
            )

            # Store in Qdrant
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
                "Situation stored successfully",
                extra={
                    "situation_id": situation_id,
                    "tenant_id": tenant_id,
                    "user_id": user_id,
                },
            )

            return situation

        except Exception as e:
            logger.error(
                f"Failed to store situation: {e}",
                extra={
                    "situation_id": situation_id,
                    "tenant_id": tenant_id,
                    "user_id": user_id,
                },
            )
            raise

    async def _store_in_neo4j(
        self,
        situation_id: str,
        context: ContextFactors,
        tenant_id: str,
        user_id: str,
        timestamp: str,
    ) -> None:
        """Store situation in Neo4j graph database.

        Args:
            situation_id: Unique situation identifier
            context: Context factors
            tenant_id: Tenant ID
            user_id: User ID
            timestamp: ISO format timestamp
        """
        async with self.neo4j_driver.session() as session:
            await session.execute_write(
                self._create_situation_node,
                situation_id,
                context,
                tenant_id,
                user_id,
                timestamp,
            )

    @staticmethod
    async def _create_situation_node(
        tx,
        situation_id: str,
        context: ContextFactors,
        tenant_id: str,
        user_id: str,
        timestamp: str,
    ) -> None:
        """Create a Situation node in Neo4j.

        Args:
            tx: Neo4j transaction
            situation_id: Unique situation identifier
            context: Context factors
            tenant_id: Tenant ID
            user_id: User ID
            timestamp: ISO format timestamp
        """
        query = """
        CREATE (s:Situation {
            id: $situation_id,
            tenant_id: $tenant_id,
            user_id: $user_id,
            factors: $factors,
            created_at: $timestamp,
            updated_at: $timestamp
        })
        RETURN s
        """

        await tx.run(
            query,
            situation_id=situation_id,
            tenant_id=tenant_id,
            user_id=user_id,
            factors=json.dumps(context.factors),  # Serialize dict to JSON string for Neo4j
            timestamp=timestamp,
        )

    async def _store_in_qdrant(
        self,
        situation_id: str,
        embedding: list[float],
        context: ContextFactors,
        tenant_id: str,
        user_id: str,
        timestamp: str,
    ) -> None:
        """Store situation embedding in Qdrant vector database.

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

    async def link_preference_to_situation(
        self,
        preference_id: str,
        situation_id: str,
        tenant_id: str,
    ) -> None:
        """Link a preference to a situation in Neo4j.

        Creates an IN_SITUATION relationship between a Preference
        node and a Situation node.

        Args:
            preference_id: Preference node ID
            situation_id: Situation node ID
            tenant_id: Tenant ID for validation

        Raises:
            ValueError: If nodes don't exist or belong to different tenants
        """
        logger.info(
            "Linking preference to situation",
            extra={
                "preference_id": preference_id,
                "situation_id": situation_id,
                "tenant_id": tenant_id,
            },
        )

        async with self.neo4j_driver.session() as session:
            result = await session.execute_write(
                self._create_preference_situation_link,
                preference_id,
                situation_id,
                tenant_id,
            )

            if not result:
                raise ValueError(
                    f"Failed to link preference {preference_id} to situation {situation_id}. "
                    f"Nodes may not exist or may belong to different tenants."
                )

        logger.info(
            "Preference linked to situation",
            extra={
                "preference_id": preference_id,
                "situation_id": situation_id,
                "tenant_id": tenant_id,
            },
        )

    @staticmethod
    async def _create_preference_situation_link(
        tx,
        preference_id: str,
        situation_id: str,
        tenant_id: str,
    ) -> bool:
        """Create IN_SITUATION relationship in Neo4j.

        Args:
            tx: Neo4j transaction
            preference_id: Preference node ID
            situation_id: Situation node ID
            tenant_id: Tenant ID for validation

        Returns:
            bool: True if link created successfully
        """
        query = """
        MATCH (p:Preference {id: $preference_id, tenant_id: $tenant_id})
        MATCH (s:Situation {id: $situation_id, tenant_id: $tenant_id})
        CREATE (p)-[:IN_SITUATION]->(s)
        RETURN p, s
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
        """Retrieve a situation by ID from Neo4j and Qdrant.

        Args:
            situation_id: Situation ID to retrieve
            tenant_id: Tenant ID for isolation

        Returns:
            Optional[Situation]: The situation if found, None otherwise
        """
        logger.info(
            "Retrieving situation",
            extra={
                "situation_id": situation_id,
                "tenant_id": tenant_id,
            },
        )

        # Get from Neo4j (includes tenant validation)
        async with self.neo4j_driver.session() as session:
            result = await session.execute_read(
                self._get_situation_node,
                situation_id,
                tenant_id,
            )

            if not result:
                logger.warning(
                    "Situation not found",
                    extra={
                        "situation_id": situation_id,
                        "tenant_id": tenant_id,
                    },
                )
                return None

        # Get embedding from Qdrant
        points = self.qdrant_client.retrieve(
            collection_name=self.COLLECTION_NAME,
            ids=[situation_id],
        )

        if not points:
            logger.warning(
                "Situation embedding not found in Qdrant",
                extra={
                    "situation_id": situation_id,
                    "tenant_id": tenant_id,
                },
            )
            embedding = None
        else:
            # Validate tenant_id from Qdrant payload
            if points[0].payload["tenant_id"] != tenant_id:
                logger.error(
                    "Tenant mismatch in Qdrant",
                    extra={
                        "situation_id": situation_id,
                        "expected_tenant": tenant_id,
                        "actual_tenant": points[0].payload["tenant_id"],
                    },
                )
                return None

            embedding = points[0].vector

        situation = Situation(
            id=result["id"],
            tenant_id=result["tenant_id"],
            user_id=result["user_id"],
            context=ContextFactors(factors=json.loads(result["factors"])),  # Deserialize JSON string back to dict
            embedding=embedding,
            created_at=result["created_at"],
            updated_at=result["updated_at"],
        )

        logger.info(
            "Situation retrieved successfully",
            extra={
                "situation_id": situation_id,
                "tenant_id": tenant_id,
            },
        )

        return situation

    @staticmethod
    async def _get_situation_node(
        tx,
        situation_id: str,
        tenant_id: str,
    ) -> Optional[dict]:
        """Retrieve situation node from Neo4j.

        Args:
            tx: Neo4j transaction
            situation_id: Situation ID
            tenant_id: Tenant ID for isolation

        Returns:
            Optional[dict]: Situation data if found
        """
        query = """
        MATCH (s:Situation {id: $situation_id, tenant_id: $tenant_id})
        RETURN s.id AS id,
               s.tenant_id AS tenant_id,
               s.user_id AS user_id,
               s.factors AS factors,
               s.created_at AS created_at,
               s.updated_at AS updated_at
        """

        result = await tx.run(
            query,
            situation_id=situation_id,
            tenant_id=tenant_id,
        )

        record = await result.single()

        if not record:
            return None

        return dict(record)

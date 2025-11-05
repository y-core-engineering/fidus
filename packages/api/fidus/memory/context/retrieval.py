"""Context retrieval service for similarity-based situation search.

This module provides retrieval of similar situations from Qdrant based on
vector similarity, enabling context-aware preference matching.
"""

import logging
from typing import Optional

from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue, ScoredPoint

from fidus.config import config
from fidus.memory.context.models import ContextFactors, Situation

logger = logging.getLogger(__name__)


class ContextRetrievalService:
    """Retrieve similar situations from Qdrant using vector similarity.

    This service performs similarity search in the vector database to find
    situations that match the current context, enabling context-aware
    preference recommendations.

    Example:
        retrieval = ContextRetrievalService()
        similar = await retrieval.find_similar_situations(
            query_embedding=[0.1, 0.2, ...],
            user_id="user-1",
            tenant_id="tenant-1",
            top_k=5,
            min_score=0.7
        )
    """

    COLLECTION_NAME = "situations"

    def __init__(self, qdrant_client: Optional[QdrantClient] = None):
        """Initialize the context retrieval service.

        Args:
            qdrant_client: Qdrant client (defaults to new instance)
        """
        self.qdrant_client = qdrant_client or QdrantClient(
            host=config.qdrant_host,
            port=config.qdrant_port,
            grpc_port=config.qdrant_grpc_port,
        )

        logger.info("Initialized ContextRetrievalService")

    def find_similar_situations(
        self,
        query_embedding: list[float],
        user_id: str,
        tenant_id: str,
        top_k: int = 5,
        min_score: float = 0.7,
    ) -> list[Situation]:
        """Find similar situations using vector similarity search.

        This method searches Qdrant for situations with embeddings similar
        to the query embedding, filtered by user_id and tenant_id for isolation.

        Args:
            query_embedding: Vector embedding to search for
            user_id: User ID for isolation (only returns user's situations)
            tenant_id: Tenant ID for multi-tenancy enforcement
            top_k: Maximum number of results to return
            min_score: Minimum similarity score (0.0 to 1.0)

        Returns:
            list[Situation]: Similar situations sorted by score (highest first)
        """
        logger.info(
            f"Searching for similar situations",
            extra={
                "tenant_id": tenant_id,
                "user_id": user_id,
                "top_k": top_k,
                "min_score": min_score,
            },
        )

        try:
            # Build filter for user and tenant isolation
            search_filter = Filter(
                must=[
                    FieldCondition(
                        key="tenant_id",
                        match=MatchValue(value=tenant_id),
                    ),
                    FieldCondition(
                        key="user_id",
                        match=MatchValue(value=user_id),
                    ),
                ]
            )

            # Search Qdrant
            results = self.qdrant_client.search(
                collection_name=self.COLLECTION_NAME,
                query_vector=query_embedding,
                query_filter=search_filter,
                limit=top_k,
                score_threshold=min_score,
                with_payload=True,
                with_vectors=True,
            )

            # Convert to Situation objects
            situations = self._convert_to_situations(results)

            logger.info(
                f"Found {len(situations)} similar situations",
                extra={
                    "tenant_id": tenant_id,
                    "user_id": user_id,
                    "count": len(situations),
                },
            )

            return situations

        except Exception as e:
            logger.error(
                f"Similarity search failed: {e}",
                extra={"tenant_id": tenant_id, "user_id": user_id},
            )
            raise

    def _convert_to_situations(self, scored_points: list[ScoredPoint]) -> list[Situation]:
        """Convert Qdrant scored points to Situation objects.

        Args:
            scored_points: Results from Qdrant search

        Returns:
            list[Situation]: Converted situations with scores
        """
        situations = []

        for point in scored_points:
            try:
                situation = Situation(
                    id=str(point.id),
                    tenant_id=point.payload["tenant_id"],
                    user_id=point.payload["user_id"],
                    context=ContextFactors(factors=point.payload["factors"]),
                    embedding=point.vector if point.vector else None,
                    created_at=point.payload.get("created_at"),
                    updated_at=point.payload.get("updated_at"),
                )

                # Store similarity score in a custom attribute for reference
                # Note: This is not part of the Situation model but can be used
                # by calling code to understand relevance
                object.__setattr__(situation, "_similarity_score", point.score)

                situations.append(situation)

            except Exception as e:
                logger.warning(
                    f"Failed to convert scored point to Situation: {e}",
                    extra={"point_id": point.id},
                )
                continue

        return situations

    def get_situation_preferences(
        self,
        situation_id: str,
        tenant_id: str,
    ) -> list[dict]:
        """Get preferences linked to a specific situation.

        This is a placeholder for Neo4j integration. In the full implementation,
        this would query Neo4j for preferences with IN_SITUATION relationships.

        Args:
            situation_id: Situation ID
            tenant_id: Tenant ID for validation

        Returns:
            list[dict]: Preference records linked to the situation
        """
        logger.info(
            f"Retrieving preferences for situation",
            extra={
                "situation_id": situation_id,
                "tenant_id": tenant_id,
            },
        )

        # TODO: Implement Neo4j query
        # MATCH (p:Preference {tenant_id: $tenant_id})-[:IN_SITUATION]->(s:Situation {id: $situation_id})
        # RETURN p

        logger.warning(
            "get_situation_preferences not yet implemented - requires Neo4j integration"
        )

        return []

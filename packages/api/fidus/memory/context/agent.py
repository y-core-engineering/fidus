"""Context-aware agent for orchestrating all context services.

This module provides the main agent that coordinates context extraction,
embedding generation, storage, and retrieval for context-aware preferences.
"""

import logging
from typing import Optional

from fidus.memory.context.embedding_service import EmbeddingService
from fidus.memory.context.extractor import DynamicContextExtractor
from fidus.memory.context.merger import ContextMerger
from fidus.memory.context.models import ContextFactors, Situation
from fidus.memory.context.retrieval import ContextRetrievalService
from fidus.memory.context.storage import ContextStorageService
from fidus.memory.context.system_provider import SystemContextProvider

logger = logging.getLogger(__name__)


class ContextAwareAgent:
    """Orchestrate all context services for context-aware preference learning.

    This agent coordinates:
    1. Dynamic context extraction from user messages (LLM)
    2. System context extraction (time, date, etc.)
    3. Context merging (LLM takes precedence)
    4. Embedding generation for similarity search
    5. Context storage in Neo4j + Qdrant
    6. Similar context retrieval for preference matching

    Example:
        agent = ContextAwareAgent()

        # Record a preference with context
        situation = await agent.record_preference_with_context(
            message="I want a cappuccino",
            preference_id="pref-123",
            tenant_id="tenant-1",
            user_id="user-1"
        )

        # Get relevant preferences based on context
        preferences = await agent.get_relevant_preferences(
            message="Good morning",
            tenant_id="tenant-1",
            user_id="user-1"
        )
    """

    def __init__(
        self,
        extractor: Optional[DynamicContextExtractor] = None,
        system_provider: Optional[SystemContextProvider] = None,
        merger: Optional[ContextMerger] = None,
        embedding_service: Optional[EmbeddingService] = None,
        storage: Optional[ContextStorageService] = None,
        retrieval: Optional[ContextRetrievalService] = None,
    ):
        """Initialize the context-aware agent.

        Args:
            extractor: Dynamic context extractor (defaults to new instance)
            system_provider: System context provider (defaults to new instance)
            merger: Context merger (defaults to new instance)
            embedding_service: Embedding service (defaults to new instance)
            storage: Context storage service (defaults to new instance)
            retrieval: Context retrieval service (defaults to new instance)
        """
        self.extractor = extractor or DynamicContextExtractor()
        self.system_provider = system_provider or SystemContextProvider()
        self.merger = merger or ContextMerger()
        self.embedding_service = embedding_service or EmbeddingService()
        self.storage = storage or ContextStorageService()
        self.retrieval = retrieval or ContextRetrievalService()

        logger.info("Initialized ContextAwareAgent")

    async def close(self) -> None:
        """Close database connections."""
        await self.storage.close()
        logger.info("ContextAwareAgent connections closed")

    async def extract_and_merge_context(
        self,
        message: str,
        tenant_id: str,
        user_id: str,
    ) -> ContextFactors:
        """Extract context from message and merge with system context.

        Args:
            message: User message to extract context from
            tenant_id: Tenant ID for logging
            user_id: User ID for logging

        Returns:
            ContextFactors: Merged context (LLM + system)
        """
        logger.info(
            f"Extracting and merging context",
            extra={
                "tenant_id": tenant_id,
                "user_id": user_id,
                "message_length": len(message),
            },
        )

        # Extract dynamic context via LLM
        llm_result = await self.extractor.extract(
            message=message,
            tenant_id=tenant_id,
            user_id=user_id,
        )

        # Extract system context
        system_context = self.system_provider.get_context(
            tenant_id=tenant_id,
            user_id=user_id,
        )

        # Merge contexts (LLM takes precedence)
        merged_context = self.merger.merge(
            llm_context=llm_result.context,
            system_context=system_context,
            tenant_id=tenant_id,
            user_id=user_id,
        )

        logger.info(
            f"Context extracted and merged",
            extra={
                "tenant_id": tenant_id,
                "user_id": user_id,
                "llm_factors": len(llm_result.context.factors),
                "system_factors": len(system_context.factors),
                "merged_factors": len(merged_context.factors),
                "llm_confidence": llm_result.confidence,
            },
        )

        return merged_context

    async def record_preference_with_context(
        self,
        message: str,
        preference_id: str,
        tenant_id: str,
        user_id: str,
    ) -> Situation:
        """Record a preference with its situational context.

        This method:
        1. Extracts context from the user's message
        2. Generates an embedding for the context
        3. Stores the situation in Neo4j + Qdrant
        4. Links the preference to the situation

        Args:
            message: User message expressing the preference
            preference_id: ID of the preference being recorded
            tenant_id: Tenant ID
            user_id: User ID

        Returns:
            Situation: The stored situation with context

        Raises:
            Exception: If any step fails
        """
        logger.info(
            f"Recording preference with context",
            extra={
                "preference_id": preference_id,
                "tenant_id": tenant_id,
                "user_id": user_id,
            },
        )

        try:
            # Extract and merge context
            context = await self.extract_and_merge_context(
                message=message,
                tenant_id=tenant_id,
                user_id=user_id,
            )

            # Generate embedding
            embedding = await self.embedding_service.generate_embedding(
                context=context,
                tenant_id=tenant_id,
                user_id=user_id,
            )

            # Store situation
            situation = await self.storage.store_situation(
                context=context,
                embedding=embedding,
                tenant_id=tenant_id,
                user_id=user_id,
            )

            # Link preference to situation
            await self.storage.link_preference_to_situation(
                preference_id=preference_id,
                situation_id=situation.id,
                tenant_id=tenant_id,
            )

            logger.info(
                f"Preference recorded with context",
                extra={
                    "preference_id": preference_id,
                    "situation_id": situation.id,
                    "tenant_id": tenant_id,
                    "user_id": user_id,
                    "factors_count": len(context.factors),
                },
            )

            return situation

        except Exception as e:
            logger.error(
                f"Failed to record preference with context: {e}",
                extra={
                    "preference_id": preference_id,
                    "tenant_id": tenant_id,
                    "user_id": user_id,
                },
            )
            raise

    async def get_relevant_preferences(
        self,
        message: str,
        tenant_id: str,
        user_id: str,
        top_k: int = 5,
        min_score: float = 0.7,
    ) -> list[Situation]:
        """Get preferences relevant to the current context.

        This method:
        1. Extracts context from the user's message
        2. Generates an embedding for the context
        3. Searches for similar situations in Qdrant
        4. Returns situations with their linked preferences

        Args:
            message: User message to extract context from
            tenant_id: Tenant ID
            user_id: User ID
            top_k: Maximum number of similar situations to return
            min_score: Minimum similarity score (0.0 to 1.0)

        Returns:
            list[Situation]: Similar situations ordered by relevance

        Raises:
            Exception: If any step fails
        """
        logger.info(
            f"Getting relevant preferences",
            extra={
                "tenant_id": tenant_id,
                "user_id": user_id,
                "top_k": top_k,
                "min_score": min_score,
            },
        )

        try:
            # Extract and merge context
            context = await self.extract_and_merge_context(
                message=message,
                tenant_id=tenant_id,
                user_id=user_id,
            )

            # Generate embedding for query
            query_embedding = await self.embedding_service.generate_embedding(
                context=context,
                tenant_id=tenant_id,
                user_id=user_id,
            )

            # Find similar situations
            similar_situations = self.retrieval.find_similar_situations(
                query_embedding=query_embedding,
                user_id=user_id,
                tenant_id=tenant_id,
                top_k=top_k,
                min_score=min_score,
            )

            logger.info(
                f"Found {len(similar_situations)} relevant situations",
                extra={
                    "tenant_id": tenant_id,
                    "user_id": user_id,
                    "count": len(similar_situations),
                },
            )

            return similar_situations

        except Exception as e:
            logger.error(
                f"Failed to get relevant preferences: {e}",
                extra={
                    "tenant_id": tenant_id,
                    "user_id": user_id,
                },
            )
            raise

    def format_context(self, context: ContextFactors) -> str:
        """Format context for display.

        Args:
            context: Context factors to format

        Returns:
            str: Human-readable context representation
        """
        return self.merger.format_for_display(context)

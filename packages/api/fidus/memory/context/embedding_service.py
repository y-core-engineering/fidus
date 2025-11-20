"""Embedding service for generating vector representations of context.

This module provides embedding generation for situational context, allowing
similarity-based matching of situations in the vector database.
"""

import logging
import os
from typing import Optional

from litellm import embedding
from tenacity import retry, stop_after_attempt, wait_exponential

from fidus.config import config
from fidus.memory.context.models import ContextFactors

logger = logging.getLogger(__name__)


class EmbeddingService:
    """Generate embeddings for context factors using configured embedding model.

    This service converts context factors into vector representations for
    similarity search in Qdrant. It uses the embedding model specified in
    configuration and validates that vector dimensions match expectations.

    Example:
        service = EmbeddingService()
        context = ContextFactors(factors={"time_of_day": "morning", "mood": "energetic"})
        embedding = await service.generate_embedding(context)
        # embedding = [0.123, -0.456, 0.789, ...] (length: 1536 for text-embedding-3-small)
    """

    def __init__(self, model: Optional[str] = None):
        """Initialize the embedding service.

        Args:
            model: Embedding model to use (defaults to config.embedding_model)
        """
        self.model = model or config.embedding_model
        self.expected_dimension = config.get_embedding_dimension()

        logger.info(
            f"Initialized EmbeddingService",
            extra={
                "model": self.model,
                "expected_dimension": self.expected_dimension,
            },
        )

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        reraise=True,
    )
    async def generate_embedding(
        self,
        context: ContextFactors,
        tenant_id: str,
        user_id: str,
    ) -> list[float]:
        """Generate embedding vector for context factors.

        This method converts context factors into a text representation and
        generates an embedding vector using the configured model. The vector
        can be used for similarity search in Qdrant.

        Args:
            context: Context factors to embed
            tenant_id: Tenant ID for logging and tracking
            user_id: User ID for logging and tracking

        Returns:
            list[float]: Embedding vector

        Raises:
            ValueError: If embedding dimensions don't match expected size
            Exception: If embedding generation fails after retries
        """
        logger.info(
            f"Generating embedding for context",
            extra={
                "tenant_id": tenant_id,
                "user_id": user_id,
                "factors_count": len(context.factors),
            },
        )

        # Convert context to text representation
        text = self._context_to_text(context)

        if not text:
            logger.warning(
                f"Empty context provided for embedding",
                extra={"tenant_id": tenant_id, "user_id": user_id},
            )
            # Return zero vector for empty context
            return [0.0] * self.expected_dimension

        try:
            # Build kwargs for embedding
            embedding_kwargs = {
                "model": self.model,
                "input": [text],  # LiteLLM expects a list of texts
            }

            # Add api_base for models using custom endpoints (LiteLLM/OpenAI-compatible)
            # Ollama models use OLLAMA_API_BASE, non-ollama models use OPENAI_API_BASE
            if self.model.startswith("ollama/"):
                ollama_base = os.getenv("OLLAMA_API_BASE", "http://localhost:11434")
                embedding_kwargs["api_base"] = ollama_base
                logger.info(f"Using Ollama API base: {ollama_base}")
            else:
                # For non-ollama models, use OPENAI_API_BASE if set
                openai_base = os.getenv("OPENAI_API_BASE")
                if openai_base:
                    embedding_kwargs["api_base"] = openai_base
                    logger.info(f"Using OpenAI API base: {openai_base}")

            # Generate embedding using LiteLLM
            response = embedding(**embedding_kwargs)

            # Extract embedding vector
            embedding_vector = response.data[0]["embedding"]

            # Validate dimensions
            if len(embedding_vector) != self.expected_dimension:
                raise ValueError(
                    f"Embedding dimension mismatch: expected {self.expected_dimension}, "
                    f"got {len(embedding_vector)} for model {self.model}"
                )

            logger.info(
                f"Embedding generated successfully",
                extra={
                    "tenant_id": tenant_id,
                    "user_id": user_id,
                    "dimension": len(embedding_vector),
                },
            )

            return embedding_vector

        except Exception as e:
            logger.error(
                f"Embedding generation failed: {e}",
                extra={"tenant_id": tenant_id, "user_id": user_id},
            )
            raise

    def generate_embedding_sync(
        self,
        context: ContextFactors,
        tenant_id: str,
        user_id: str,
    ) -> list[float]:
        """Synchronous version of generate_embedding() for non-async contexts.

        Args:
            context: Context factors to embed
            tenant_id: Tenant ID for logging and tracking
            user_id: User ID for logging and tracking

        Returns:
            list[float]: Embedding vector
        """
        logger.info(
            f"Generating embedding for context (sync)",
            extra={
                "tenant_id": tenant_id,
                "user_id": user_id,
                "factors_count": len(context.factors),
            },
        )

        # Convert context to text representation
        text = self._context_to_text(context)

        if not text:
            logger.warning(
                f"Empty context provided for embedding",
                extra={"tenant_id": tenant_id, "user_id": user_id},
            )
            # Return zero vector for empty context
            return [0.0] * self.expected_dimension

        try:
            # Generate embedding using LiteLLM
            response = embedding(
                model=self.model,
                input=[text],
            )

            # Extract embedding vector
            embedding_vector = response.data[0]["embedding"]

            # Validate dimensions
            if len(embedding_vector) != self.expected_dimension:
                raise ValueError(
                    f"Embedding dimension mismatch: expected {self.expected_dimension}, "
                    f"got {len(embedding_vector)} for model {self.model}"
                )

            logger.info(
                f"Embedding generated successfully",
                extra={
                    "tenant_id": tenant_id,
                    "user_id": user_id,
                    "dimension": len(embedding_vector),
                },
            )

            return embedding_vector

        except Exception as e:
            logger.error(
                f"Embedding generation failed: {e}",
                extra={"tenant_id": tenant_id, "user_id": user_id},
            )
            raise

    def _context_to_text(self, context: ContextFactors) -> str:
        """Convert context factors to text representation for embedding.

        Args:
            context: Context factors to convert

        Returns:
            str: Text representation of context

        Example:
            context = ContextFactors(factors={
                "time_of_day": "morning",
                "mood": "energetic",
                "location": "gym"
            })
            text = service._context_to_text(context)
            # Returns: "location: gym, mood: energetic, time_of_day: morning"
        """
        if not context.factors:
            return ""

        # Sort by key for consistent representation
        sorted_factors = sorted(context.factors.items())

        # Format as "key: value" pairs
        formatted_pairs = [f"{key}: {value}" for key, value in sorted_factors]

        return ", ".join(formatted_pairs)

    def calculate_similarity(
        self,
        embedding1: list[float],
        embedding2: list[float],
    ) -> float:
        """Calculate cosine similarity between two embeddings.

        Args:
            embedding1: First embedding vector
            embedding2: Second embedding vector

        Returns:
            float: Cosine similarity score (0.0 to 1.0)

        Raises:
            ValueError: If embeddings have different dimensions
        """
        if len(embedding1) != len(embedding2):
            raise ValueError(
                f"Embedding dimension mismatch: {len(embedding1)} vs {len(embedding2)}"
            )

        # Calculate dot product
        dot_product = sum(a * b for a, b in zip(embedding1, embedding2))

        # Calculate magnitudes
        magnitude1 = sum(a * a for a in embedding1) ** 0.5
        magnitude2 = sum(b * b for b in embedding2) ** 0.5

        # Avoid division by zero
        if magnitude1 == 0.0 or magnitude2 == 0.0:
            return 0.0

        # Cosine similarity
        similarity = dot_product / (magnitude1 * magnitude2)

        # Clamp to [0, 1] range
        return max(0.0, min(1.0, similarity))

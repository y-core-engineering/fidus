"""Configuration for Fidus Memory prototype.

This module provides configuration management for the Fidus Memory system,
including Neo4j connection settings and LLM configuration.
"""

import os
from typing import Optional


class PrototypeConfig:
    """Configuration for Fidus Memory prototype.

    Loads configuration from environment variables with sensible defaults
    for development and production environments.
    """

    def __init__(self):
        """Initialize configuration from environment variables."""
        # Neo4j Configuration
        self.neo4j_uri: str = os.getenv("NEO4J_URI", "bolt://localhost:7687")
        self.neo4j_user: str = os.getenv("NEO4J_USER", "neo4j")
        self.neo4j_password: str = os.getenv("NEO4J_PASSWORD", "password")

        # Qdrant Configuration
        self.qdrant_host: str = os.getenv("QDRANT_HOST", "localhost")
        self.qdrant_port: int = int(os.getenv("QDRANT_PORT", "6333"))
        self.qdrant_grpc_port: int = int(os.getenv("QDRANT_GRPC_PORT", "6334"))

        # LLM Configuration
        self.llm_model: str = os.getenv("FIDUS_LLM_MODEL", "ollama/llama3.2:3b")
        self.ollama_api_base: Optional[str] = os.getenv("OLLAMA_API_BASE")
        self.openai_api_key: Optional[str] = os.getenv("OPENAI_API_KEY")
        self.anthropic_api_key: Optional[str] = os.getenv("ANTHROPIC_API_KEY")

        # Embedding Configuration
        self.embedding_model: str = os.getenv("FIDUS_EMBEDDING_MODEL", "ollama/nomic-embed-text")
        # Mapping of embedding models to their vector dimensions
        self.embedding_dimensions: dict[str, int] = {
            "ollama/nomic-embed-text": 768,
            "openai/text-embedding-3-small": 1536,
            "openai/text-embedding-3-large": 3072,
            "openai/text-embedding-ada-002": 1536,
        }

        # Application Configuration
        self.environment: str = os.getenv("ENVIRONMENT", "development")
        self.log_level: str = os.getenv("LOG_LEVEL", "INFO")

    @property
    def is_production(self) -> bool:
        """Check if running in production environment."""
        return self.environment.lower() == "production"

    @property
    def is_development(self) -> bool:
        """Check if running in development environment."""
        return self.environment.lower() == "development"

    def get_embedding_dimension(self) -> int:
        """Get the vector dimension for the configured embedding model.

        Returns:
            int: The dimension of the embedding vectors for the current model.

        Raises:
            ValueError: If the configured embedding model is not in the known dimensions map.
        """
        if self.embedding_model not in self.embedding_dimensions:
            raise ValueError(
                f"Unknown embedding model: {self.embedding_model}. "
                f"Supported models: {', '.join(self.embedding_dimensions.keys())}"
            )
        return self.embedding_dimensions[self.embedding_model]


# Global config instance
config = PrototypeConfig()

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

        # LLM Configuration
        self.llm_model: str = os.getenv("FIDUS_LLM_MODEL", "ollama/llama3.2:3b")
        self.ollama_api_base: Optional[str] = os.getenv("OLLAMA_API_BASE")
        self.openai_api_key: Optional[str] = os.getenv("OPENAI_API_KEY")
        self.anthropic_api_key: Optional[str] = os.getenv("ANTHROPIC_API_KEY")

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


# Global config instance
config = PrototypeConfig()

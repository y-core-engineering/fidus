"""Qdrant collection setup for situational context storage.

This module provides functionality to initialize Qdrant collections for storing
situation embeddings with proper schema and multi-tenancy support.
"""

import logging
from typing import Optional

from qdrant_client import QdrantClient
from qdrant_client.http import models as qdrant_models
from qdrant_client.http.exceptions import UnexpectedResponse

from fidus.config import config

logger = logging.getLogger(__name__)


class QdrantSetup:
    """Setup and manage Qdrant collections for Fidus Memory."""

    COLLECTION_NAME = "situations"

    def __init__(
        self,
        host: Optional[str] = None,
        port: Optional[int] = None,
        grpc_port: Optional[int] = None,
    ):
        """Initialize Qdrant setup client.

        Args:
            host: Qdrant host (defaults to config.qdrant_host)
            port: Qdrant HTTP port (defaults to config.qdrant_port)
            grpc_port: Qdrant gRPC port (defaults to config.qdrant_grpc_port)
        """
        self.host = host or config.qdrant_host
        self.port = port or config.qdrant_port
        self.grpc_port = grpc_port or config.qdrant_grpc_port

        self.client = QdrantClient(
            host=self.host,
            port=self.port,
            grpc_port=self.grpc_port,
            prefer_grpc=True,
        )

    def create_collection(self, recreate: bool = False) -> bool:
        """Create the situations collection with proper schema.

        Args:
            recreate: If True, delete existing collection before creating

        Returns:
            bool: True if collection was created, False if it already existed

        Raises:
            ValueError: If embedding model dimension is not configured
            UnexpectedResponse: If Qdrant API returns an error
        """
        try:
            # Check if collection exists
            collections = self.client.get_collections().collections
            collection_names = [col.name for col in collections]

            if self.COLLECTION_NAME in collection_names:
                if recreate:
                    logger.info(f"Deleting existing collection: {self.COLLECTION_NAME}")
                    self.client.delete_collection(self.COLLECTION_NAME)
                else:
                    logger.info(f"Collection already exists: {self.COLLECTION_NAME}")
                    return False

            # Get embedding dimension from config
            vector_size = config.get_embedding_dimension()
            logger.info(f"Creating collection with vector size: {vector_size}")

            # Create collection with cosine distance metric
            self.client.create_collection(
                collection_name=self.COLLECTION_NAME,
                vectors_config=qdrant_models.VectorParams(
                    size=vector_size,
                    distance=qdrant_models.Distance.COSINE,
                ),
            )

            # Create payload index for tenant_id (required for multi-tenancy)
            self.client.create_payload_index(
                collection_name=self.COLLECTION_NAME,
                field_name="tenant_id",
                field_schema=qdrant_models.PayloadSchemaType.KEYWORD,
            )

            # Create payload index for user_id (required for user isolation)
            self.client.create_payload_index(
                collection_name=self.COLLECTION_NAME,
                field_name="user_id",
                field_schema=qdrant_models.PayloadSchemaType.KEYWORD,
            )

            # Create payload index for situation_id (for Neo4j cross-reference)
            self.client.create_payload_index(
                collection_name=self.COLLECTION_NAME,
                field_name="situation_id",
                field_schema=qdrant_models.PayloadSchemaType.KEYWORD,
            )

            logger.info(f"Successfully created collection: {self.COLLECTION_NAME}")
            return True

        except UnexpectedResponse as e:
            logger.error(f"Qdrant API error: {e}")
            raise
        except Exception as e:
            logger.error(f"Failed to create collection: {e}")
            raise

    def delete_collection(self) -> bool:
        """Delete the situations collection.

        Returns:
            bool: True if collection was deleted, False if it didn't exist
        """
        try:
            collections = self.client.get_collections().collections
            collection_names = [col.name for col in collections]

            if self.COLLECTION_NAME not in collection_names:
                logger.info(f"Collection does not exist: {self.COLLECTION_NAME}")
                return False

            self.client.delete_collection(self.COLLECTION_NAME)
            logger.info(f"Successfully deleted collection: {self.COLLECTION_NAME}")
            return True

        except Exception as e:
            logger.error(f"Failed to delete collection: {e}")
            raise

    def collection_info(self) -> dict:
        """Get information about the situations collection.

        Returns:
            dict: Collection information including count and config

        Raises:
            ValueError: If collection does not exist
        """
        try:
            info = self.client.get_collection(self.COLLECTION_NAME)
            return {
                "name": info.config.params.vectors.size,
                "vector_size": info.config.params.vectors.size,
                "distance": info.config.params.vectors.distance,
                "points_count": info.points_count,
                "status": info.status,
            }
        except UnexpectedResponse:
            raise ValueError(f"Collection does not exist: {self.COLLECTION_NAME}")

    def health_check(self) -> bool:
        """Check if Qdrant is accessible and healthy.

        Returns:
            bool: True if Qdrant is accessible, False otherwise
        """
        try:
            self.client.get_collections()
            return True
        except Exception as e:
            logger.error(f"Qdrant health check failed: {e}")
            return False


def setup_qdrant(recreate: bool = False) -> None:
    """Setup Qdrant collection for Fidus Memory.

    This is a convenience function for command-line usage.

    Args:
        recreate: If True, delete and recreate the collection
    """
    logging.basicConfig(level=logging.INFO)

    setup = QdrantSetup()

    # Health check
    if not setup.health_check():
        logger.error("Qdrant is not accessible. Please check your configuration.")
        return

    # Create collection
    try:
        created = setup.create_collection(recreate=recreate)
        if created:
            logger.info("Qdrant setup completed successfully")
            info = setup.collection_info()
            logger.info(f"Collection info: {info}")
        else:
            logger.info("Collection already exists. Use recreate=True to recreate.")
    except Exception as e:
        logger.error(f"Setup failed: {e}")
        raise


if __name__ == "__main__":
    import sys

    recreate = "--recreate" in sys.argv
    setup_qdrant(recreate=recreate)

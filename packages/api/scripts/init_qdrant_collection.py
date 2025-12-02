#!/usr/bin/env python3
"""
Initialize Qdrant collection with proper indexes for v3.0 Qdrant-First pattern.

This script:
1. Creates the 'situations' collection if it doesn't exist
2. Creates payload indexes for efficient filtering on tenant_id, user_id, relationship_type

Usage:
    python init_qdrant_collection.py

    # With custom host/port
    python init_qdrant_collection.py --host localhost --port 6333

Architecture References:
- ADR-0001: Situational Context as Relationship Qualifier
- ADR-0002: Property Placement Strategy
"""

import argparse
import logging
import os
import sys

from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PayloadSchemaType,
)

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from fidus.config import config
    EMBEDDING_DIM = config.get_embedding_dimension()
except (ImportError, ValueError):
    EMBEDDING_DIM = 1024  # Default to bge-m3 dimension

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

COLLECTION_NAME = "situations"


def create_collection_with_indexes(
    client: QdrantClient,
    collection_name: str = COLLECTION_NAME,
    vector_size: int = EMBEDDING_DIM,
) -> bool:
    """Create Qdrant collection with payload indexes.

    Args:
        client: Qdrant client instance
        collection_name: Name of the collection to create
        vector_size: Dimension of the embedding vectors

    Returns:
        True if successful
    """
    # Check if collection exists
    collections = client.get_collections()
    collection_names = [c.name for c in collections.collections]

    if collection_name in collection_names:
        logger.info(f"Collection '{collection_name}' already exists")
        # Still create indexes if they don't exist
    else:
        logger.info(f"Creating collection '{collection_name}' with vector size {vector_size}")
        client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(
                size=vector_size,
                distance=Distance.COSINE,
            ),
        )
        logger.info(f"Collection '{collection_name}' created successfully")

    # Create payload indexes for efficient filtering
    # These are critical for multi-tenancy and query performance
    indexes_to_create = [
        ("tenant_id", PayloadSchemaType.KEYWORD),
        ("user_id", PayloadSchemaType.KEYWORD),
        ("relationship_type", PayloadSchemaType.KEYWORD),
        ("entity_id", PayloadSchemaType.KEYWORD),
        ("version", PayloadSchemaType.KEYWORD),
    ]

    for field_name, schema_type in indexes_to_create:
        try:
            client.create_payload_index(
                collection_name=collection_name,
                field_name=field_name,
                field_schema=schema_type,
            )
            logger.info(f"Created index on '{field_name}' ({schema_type})")
        except Exception as e:
            # Index might already exist
            if "already exists" in str(e).lower():
                logger.info(f"Index on '{field_name}' already exists")
            else:
                logger.warning(f"Failed to create index on '{field_name}': {e}")

    return True


def verify_collection(client: QdrantClient, collection_name: str = COLLECTION_NAME) -> dict:
    """Verify collection exists and has correct configuration.

    Args:
        client: Qdrant client instance
        collection_name: Name of the collection to verify

    Returns:
        Collection info dict
    """
    try:
        info = client.get_collection(collection_name)
        logger.info(f"Collection '{collection_name}' verification:")
        logger.info(f"  - Points count: {info.points_count}")
        logger.info(f"  - Vectors count: {info.vectors_count}")
        logger.info(f"  - Status: {info.status}")

        # Get payload index info
        if info.payload_schema:
            logger.info("  - Payload indexes:")
            for field, schema in info.payload_schema.items():
                logger.info(f"    - {field}: {schema}")

        return {
            "name": collection_name,
            "points_count": info.points_count,
            "vectors_count": info.vectors_count,
            "status": str(info.status),
            "payload_schema": {k: str(v) for k, v in (info.payload_schema or {}).items()},
        }
    except Exception as e:
        logger.error(f"Failed to verify collection: {e}")
        return {"error": str(e)}


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Initialize Qdrant collection for v3.0 Qdrant-First pattern"
    )
    parser.add_argument(
        "--host",
        type=str,
        default=os.getenv("QDRANT_HOST", "localhost"),
        help="Qdrant host",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=int(os.getenv("QDRANT_PORT", "6333")),
        help="Qdrant port",
    )
    parser.add_argument(
        "--vector-size",
        type=int,
        default=EMBEDDING_DIM,
        help=f"Vector dimension (default: {EMBEDDING_DIM} for bge-m3)",
    )
    parser.add_argument(
        "--verify-only",
        action="store_true",
        help="Only verify collection, don't create",
    )

    args = parser.parse_args()

    logger.info(f"Connecting to Qdrant at {args.host}:{args.port}")

    client = QdrantClient(host=args.host, port=args.port)

    if args.verify_only:
        result = verify_collection(client)
        if "error" in result:
            return 1
        return 0

    # Create collection and indexes
    success = create_collection_with_indexes(
        client=client,
        collection_name=COLLECTION_NAME,
        vector_size=args.vector_size,
    )

    if success:
        # Verify after creation
        verify_collection(client)
        logger.info("Qdrant initialization complete!")
        return 0
    else:
        logger.error("Failed to initialize Qdrant collection")
        return 1


if __name__ == "__main__":
    sys.exit(main())

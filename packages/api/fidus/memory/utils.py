"""Reusable utility functions for memory operations.

This module exposes standalone functions from the PersistentAgent and ContextAwareAgent
for use by MCP tools and other components without requiring full agent initialization.
"""

import logging
from typing import List, Dict, Any, Optional

from fidus.config import config
from fidus.infrastructure.neo4j_client import Neo4jPreferenceStore
from fidus.memory.context.agent import ContextAwareAgent
from fidus.memory.context.models import Situation

logger = logging.getLogger(__name__)

# Global instances (initialized on first use)
_neo4j_store: Optional[Neo4jPreferenceStore] = None
_context_agent: Optional[ContextAwareAgent] = None


async def get_neo4j_store() -> Neo4jPreferenceStore:
    """Get or create Neo4j store instance."""
    global _neo4j_store
    if _neo4j_store is None:
        _neo4j_store = Neo4jPreferenceStore(config)
        await _neo4j_store.connect()
        logger.info("Initialized Neo4j store")
    return _neo4j_store


async def get_context_agent() -> ContextAwareAgent:
    """Get or create ContextAwareAgent instance."""
    global _context_agent
    if _context_agent is None:
        _context_agent = ContextAwareAgent()
        logger.info("Initialized ContextAwareAgent")
    return _context_agent


async def get_user_preferences(
    user_id: str,
    min_confidence: float = 0.5,
) -> List[Dict[str, Any]]:
    """Get user preferences from Neo4j.

    Args:
        user_id: User/tenant identifier
        min_confidence: Minimum confidence threshold (0.0-1.0)

    Returns:
        List of preference dictionaries with keys:
        - id: Neo4j node ID
        - key: Preference key (e.g., "food.beverages.coffee")
        - value: Preference value
        - sentiment: positive/negative/neutral
        - confidence: 0.0-1.0
    """
    store = await get_neo4j_store()

    try:
        # Get all preferences for this user
        all_prefs = await store.get_preferences(user_id)

        # Filter by confidence
        filtered = [
            pref for pref in all_prefs
            if pref.get("confidence", 0.0) >= min_confidence
        ]

        logger.info(
            f"Retrieved {len(filtered)}/{len(all_prefs)} preferences "
            f"for user {user_id} (min_confidence={min_confidence})"
        )

        return filtered

    except Exception as e:
        logger.error(f"Failed to get preferences for user {user_id}: {e}")
        return []


async def search_similar_situations(
    query: str,
    user_id: str,
    limit: int = 3,
    min_score: float = 0.0,
) -> List[Dict[str, Any]]:
    """Search for similar past situations using semantic similarity.

    Args:
        query: Query message to find similar situations
        user_id: User/tenant identifier
        limit: Maximum number of results
        min_score: Minimum similarity score (0.0-1.0)

    Returns:
        List of situation dictionaries with keys:
        - id: Situation ID
        - message: Original message
        - factors: Context factors (dict)
        - score: Similarity score (0.0-1.0)
        - timestamp: When situation was recorded
    """
    agent = await get_context_agent()

    try:
        # Use ContextAwareAgent's retrieval service
        situations = await agent.retrieval.search_similar_situations(
            query=query,
            user_id=user_id,
            limit=limit,
            min_score=min_score,
        )

        logger.info(
            f"Found {len(situations)} similar situations for user {user_id} "
            f"(query: '{query[:50]}...', limit={limit})"
        )

        return [
            {
                "id": str(sit.id),
                "message": sit.message,
                "factors": sit.factors.model_dump() if sit.factors else {},
                "score": sit.similarity_score or 0.0,
                "timestamp": sit.timestamp.isoformat() if sit.timestamp else None,
            }
            for sit in situations
        ]

    except Exception as e:
        logger.error(f"Failed to search situations for user {user_id}: {e}")
        return []


async def learn_preferences_from_message(
    message: str,
    user_id: str,
) -> None:
    """Learn and store preferences from a message.

    This uses the existing Preference Learner logic to extract
    preferences from natural language and store them in Neo4j.

    Args:
        message: User message to learn from
        user_id: User/tenant identifier
    """
    # TODO: This would need to use the PersistentAgent's preference learning logic
    # For now, we'll skip this as it requires more complex integration
    # with the LLM-based preference extraction
    logger.info(f"Preference learning from message for user {user_id}: '{message[:50]}...'")
    # Placeholder - actual implementation would call PersistentAgent._extract_preferences()


async def extract_and_store_situation(
    message: str,
    user_id: str,
    preference_ids: Optional[List[str]] = None,
) -> Optional[Situation]:
    """Extract context from message and store as situation.

    Args:
        message: User message to extract context from
        user_id: User/tenant identifier
        preference_ids: Optional list of preference IDs to link

    Returns:
        Stored Situation object, or None if extraction failed
    """
    agent = await get_context_agent()

    try:
        # Extract and merge context
        context = await agent.extract_and_merge_context(
            message=message,
            tenant_id=user_id,
            user_id=user_id,
        )

        # Generate embedding
        embedding = await agent.embedding_service.generate_embedding(
            text=message,
            context_factors=context,
        )

        # Store situation
        situation = await agent.storage.store_situation(
            message=message,
            context_factors=context,
            embedding=embedding,
            tenant_id=user_id,
            user_id=user_id,
            preference_ids=preference_ids or [],
        )

        logger.info(
            f"Stored situation for user {user_id}: "
            f"{len(context.factors)} factors, "
            f"linked to {len(preference_ids or [])} preferences"
        )

        return situation

    except Exception as e:
        logger.error(f"Failed to extract/store situation for user {user_id}: {e}")
        return None


async def close_connections() -> None:
    """Close all global connections."""
    global _neo4j_store, _context_agent

    if _neo4j_store:
        await _neo4j_store.disconnect()
        _neo4j_store = None
        logger.info("Closed Neo4j store connection")

    if _context_agent:
        await _context_agent.close()
        _context_agent = None
        logger.info("Closed ContextAwareAgent connections")

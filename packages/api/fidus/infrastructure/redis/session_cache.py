"""Redis session cache for Fidus Memory performance optimization.

This module provides a Redis-based caching layer for user preferences
and context retrieval results to improve performance and reduce database load.
"""

import hashlib
import json
from typing import Dict, List, Optional, Any
from datetime import datetime
import redis.asyncio as redis
from fidus.config import PrototypeConfig


class Neo4jJSONEncoder(json.JSONEncoder):
    """Custom JSON encoder for Neo4j data types.

    Handles serialization of Neo4j DateTime and other special types.
    """

    def default(self, obj: Any) -> Any:
        """Convert Neo4j types to JSON-serializable formats.

        Args:
            obj: Object to serialize

        Returns:
            JSON-serializable representation of the object
        """
        # Handle Neo4j DateTime objects
        if hasattr(obj, 'to_native'):
            # Neo4j temporal types have to_native() method
            return obj.to_native().isoformat()

        # Handle standard Python datetime
        if isinstance(obj, datetime):
            return obj.isoformat()

        # Fall back to default serialization
        return super().default(obj)


class SessionCache:
    """Redis-based session cache for user preferences and context.

    Provides caching with TTL (Time To Live) for:
    - User preferences (5-minute TTL)
    - Context retrieval results (10-minute TTL)

    All cache keys are multi-tenant aware and include tenant_id + user_id
    to ensure proper isolation between tenants.

    Cache key formats:
        - Preferences: prefs:{tenant_id}:{user_id}
        - Context: context:{tenant_id}:{user_id}:{context_hash}
    """

    # TTL constants (in seconds)
    PREFERENCES_TTL = 300  # 5 minutes
    CONTEXT_TTL = 600  # 10 minutes

    def __init__(self, config: PrototypeConfig):
        """Initialize Redis connection.

        Args:
            config: PrototypeConfig instance with Redis URL
        """
        self.config = config
        self._client: Optional[redis.Redis] = None

    async def connect(self) -> None:
        """Establish connection to Redis."""
        self._client = redis.from_url(
            self.config.redis_url,
            encoding="utf-8",
            decode_responses=True,
        )
        # Verify connection
        await self._client.ping()

    async def disconnect(self) -> None:
        """Close connection to Redis."""
        if self._client:
            await self._client.aclose()
            self._client = None

    def _get_preferences_key(self, tenant_id: str, user_id: str) -> str:
        """Generate cache key for user preferences.

        Args:
            tenant_id: Tenant identifier
            user_id: User identifier

        Returns:
            Cache key in format: prefs:{tenant_id}:{user_id}
        """
        return f"prefs:{tenant_id}:{user_id}"

    def _get_context_key(self, tenant_id: str, user_id: str, context: Dict[str, Any]) -> str:
        """Generate cache key for context retrieval.

        Args:
            tenant_id: Tenant identifier
            user_id: User identifier
            context: Context dictionary to hash

        Returns:
            Cache key in format: context:{tenant_id}:{user_id}:{hash}
        """
        # Create deterministic hash of context
        context_str = json.dumps(context, sort_keys=True)
        context_hash = hashlib.sha256(context_str.encode()).hexdigest()[:16]
        return f"context:{tenant_id}:{user_id}:{context_hash}"

    async def cache_preferences(
        self,
        tenant_id: str,
        user_id: str,
        preferences: List[Dict[str, Any]],
    ) -> None:
        """Cache user preferences with 5-minute TTL.

        Args:
            tenant_id: Tenant identifier
            user_id: User identifier
            preferences: List of preference dictionaries

        Raises:
            RuntimeError: If Redis client not initialized
        """
        if not self._client:
            raise RuntimeError("Redis client not initialized. Call connect() first.")

        key = self._get_preferences_key(tenant_id, user_id)
        value = json.dumps(preferences, cls=Neo4jJSONEncoder)

        await self._client.setex(
            key,
            self.PREFERENCES_TTL,
            value,
        )

    async def get_cached_preferences(
        self,
        tenant_id: str,
        user_id: str,
    ) -> Optional[List[Dict[str, Any]]]:
        """Retrieve cached user preferences.

        Args:
            tenant_id: Tenant identifier
            user_id: User identifier

        Returns:
            List of cached preferences, or None if cache miss

        Raises:
            RuntimeError: If Redis client not initialized
        """
        if not self._client:
            raise RuntimeError("Redis client not initialized. Call connect() first.")

        key = self._get_preferences_key(tenant_id, user_id)
        value = await self._client.get(key)

        if value is None:
            return None

        return json.loads(value)

    async def invalidate_preferences(
        self,
        tenant_id: str,
        user_id: str,
    ) -> None:
        """Invalidate cached user preferences.

        Called when preferences are created, updated, or deleted.

        Args:
            tenant_id: Tenant identifier
            user_id: User identifier

        Raises:
            RuntimeError: If Redis client not initialized
        """
        if not self._client:
            raise RuntimeError("Redis client not initialized. Call connect() first.")

        key = self._get_preferences_key(tenant_id, user_id)
        await self._client.delete(key)

    async def cache_context_retrieval(
        self,
        tenant_id: str,
        user_id: str,
        context: Dict[str, Any],
        preferences: List[Dict[str, Any]],
    ) -> None:
        """Cache context-based preference retrieval with 10-minute TTL.

        Args:
            tenant_id: Tenant identifier
            user_id: User identifier
            context: Context dictionary used for retrieval
            preferences: Retrieved preferences to cache

        Raises:
            RuntimeError: If Redis client not initialized
        """
        if not self._client:
            raise RuntimeError("Redis client not initialized. Call connect() first.")

        key = self._get_context_key(tenant_id, user_id, context)
        value = json.dumps(preferences, cls=Neo4jJSONEncoder)

        await self._client.setex(
            key,
            self.CONTEXT_TTL,
            value,
        )

    async def get_cached_context_retrieval(
        self,
        tenant_id: str,
        user_id: str,
        context: Dict[str, Any],
    ) -> Optional[List[Dict[str, Any]]]:
        """Retrieve cached context-based preferences.

        Args:
            tenant_id: Tenant identifier
            user_id: User identifier
            context: Context dictionary used for retrieval

        Returns:
            List of cached preferences, or None if cache miss

        Raises:
            RuntimeError: If Redis client not initialized
        """
        if not self._client:
            raise RuntimeError("Redis client not initialized. Call connect() first.")

        key = self._get_context_key(tenant_id, user_id, context)
        value = await self._client.get(key)

        if value is None:
            return None

        return json.loads(value)

    async def clear_all_cache(self, tenant_id: str, user_id: str) -> None:
        """Clear all cache entries for a specific user.

        Args:
            tenant_id: Tenant identifier
            user_id: User identifier

        Raises:
            RuntimeError: If Redis client not initialized
        """
        if not self._client:
            raise RuntimeError("Redis client not initialized. Call connect() first.")

        # Clear preferences cache
        prefs_key = self._get_preferences_key(tenant_id, user_id)
        await self._client.delete(prefs_key)

        # Clear all context cache entries for this user
        pattern = f"context:{tenant_id}:{user_id}:*"
        cursor = 0
        while True:
            cursor, keys = await self._client.scan(
                cursor=cursor,
                match=pattern,
                count=100,
            )
            if keys:
                await self._client.delete(*keys)
            if cursor == 0:
                break

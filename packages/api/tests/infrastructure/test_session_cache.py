"""Unit tests for Redis SessionCache.

Tests verify:
- Caching and retrieval of preferences
- Cache miss handling
- Cache invalidation
- TTL expiration
- Multi-tenancy isolation
"""

import pytest
import asyncio
from typing import Dict, Any, List
from fidus.infrastructure.redis.session_cache import SessionCache
from fidus.config import PrototypeConfig


@pytest.fixture
async def cache() -> SessionCache:
    """Create and connect SessionCache instance."""
    config = PrototypeConfig()
    cache = SessionCache(config)
    await cache.connect()
    yield cache
    await cache.disconnect()


@pytest.fixture
def tenant_id() -> str:
    """Tenant ID for tests."""
    return PrototypeConfig.PROTOTYPE_TENANT_ID


@pytest.fixture
def user_id() -> str:
    """User ID for tests."""
    return "test-user-123"


@pytest.fixture
def sample_preferences() -> List[Dict[str, Any]]:
    """Sample preferences for testing."""
    return [
        {
            "id": "pref-1",
            "tenant_id": PrototypeConfig.PROTOTYPE_TENANT_ID,
            "key": "food.cappuccino",
            "sentiment": "positive",
            "confidence": 0.8,
            "domain": "food",
        },
        {
            "id": "pref-2",
            "tenant_id": PrototypeConfig.PROTOTYPE_TENANT_ID,
            "key": "food.kale",
            "sentiment": "negative",
            "confidence": 0.6,
            "domain": "food",
        },
    ]


@pytest.fixture
def sample_context() -> Dict[str, Any]:
    """Sample context for testing."""
    return {
        "activity": "ordering coffee",
        "location": "coffee shop",
        "time_of_day": "morning",
    }


class TestSessionCacheBasics:
    """Test basic cache operations."""

    async def test_connect_disconnect(self) -> None:
        """Test Redis connection and disconnection."""
        config = PrototypeConfig()
        cache = SessionCache(config)

        # Connect should succeed
        await cache.connect()
        assert cache._client is not None

        # Disconnect should clean up
        await cache.disconnect()
        assert cache._client is None

    async def test_cache_and_retrieve_preferences(
        self,
        cache: SessionCache,
        tenant_id: str,
        user_id: str,
        sample_preferences: List[Dict[str, Any]],
    ) -> None:
        """Test caching and retrieving preferences."""
        # Cache preferences
        await cache.cache_preferences(tenant_id, user_id, sample_preferences)

        # Retrieve from cache
        cached = await cache.get_cached_preferences(tenant_id, user_id)

        assert cached is not None
        assert len(cached) == 2
        assert cached[0]["id"] == "pref-1"
        assert cached[1]["id"] == "pref-2"

    async def test_cache_miss(
        self,
        cache: SessionCache,
        tenant_id: str,
        user_id: str,
    ) -> None:
        """Test cache miss returns None."""
        # Request non-existent cache entry
        cached = await cache.get_cached_preferences(tenant_id, "non-existent-user")

        assert cached is None

    async def test_invalidate_preferences(
        self,
        cache: SessionCache,
        tenant_id: str,
        user_id: str,
        sample_preferences: List[Dict[str, Any]],
    ) -> None:
        """Test cache invalidation."""
        # Cache preferences
        await cache.cache_preferences(tenant_id, user_id, sample_preferences)

        # Verify cached
        cached = await cache.get_cached_preferences(tenant_id, user_id)
        assert cached is not None

        # Invalidate cache
        await cache.invalidate_preferences(tenant_id, user_id)

        # Verify cache miss after invalidation
        cached = await cache.get_cached_preferences(tenant_id, user_id)
        assert cached is None


class TestSessionCacheTTL:
    """Test TTL (Time To Live) behavior."""

    async def test_preferences_ttl_expiration(
        self,
        cache: SessionCache,
        tenant_id: str,
        user_id: str,
        sample_preferences: List[Dict[str, Any]],
    ) -> None:
        """Test that preferences cache expires after TTL.

        Note: This test uses a short wait time to verify TTL logic.
        In production, TTL is 5 minutes (300 seconds).
        """
        # Temporarily set short TTL for testing
        original_ttl = cache.PREFERENCES_TTL
        cache.PREFERENCES_TTL = 2  # 2 seconds for testing

        try:
            # Cache preferences
            await cache.cache_preferences(tenant_id, user_id, sample_preferences)

            # Verify cached immediately
            cached = await cache.get_cached_preferences(tenant_id, user_id)
            assert cached is not None

            # Wait for TTL to expire
            await asyncio.sleep(3)

            # Verify cache miss after expiration
            cached = await cache.get_cached_preferences(tenant_id, user_id)
            assert cached is None

        finally:
            # Restore original TTL
            cache.PREFERENCES_TTL = original_ttl

    async def test_context_ttl_expiration(
        self,
        cache: SessionCache,
        tenant_id: str,
        user_id: str,
        sample_context: Dict[str, Any],
        sample_preferences: List[Dict[str, Any]],
    ) -> None:
        """Test that context cache expires after TTL.

        Note: This test uses a short wait time to verify TTL logic.
        In production, TTL is 10 minutes (600 seconds).
        """
        # Temporarily set short TTL for testing
        original_ttl = cache.CONTEXT_TTL
        cache.CONTEXT_TTL = 2  # 2 seconds for testing

        try:
            # Cache context retrieval
            await cache.cache_context_retrieval(
                tenant_id, user_id, sample_context, sample_preferences
            )

            # Verify cached immediately
            cached = await cache.get_cached_context_retrieval(
                tenant_id, user_id, sample_context
            )
            assert cached is not None

            # Wait for TTL to expire
            await asyncio.sleep(3)

            # Verify cache miss after expiration
            cached = await cache.get_cached_context_retrieval(
                tenant_id, user_id, sample_context
            )
            assert cached is None

        finally:
            # Restore original TTL
            cache.CONTEXT_TTL = original_ttl


class TestSessionCacheMultiTenancy:
    """Test multi-tenancy isolation."""

    async def test_tenant_isolation(
        self,
        cache: SessionCache,
        user_id: str,
        sample_preferences: List[Dict[str, Any]],
    ) -> None:
        """Test that cache entries are isolated by tenant."""
        tenant_1 = "tenant-1"
        tenant_2 = "tenant-2"

        # Cache preferences for tenant 1
        prefs_1 = [{"id": "pref-1", "key": "food.coffee"}]
        await cache.cache_preferences(tenant_1, user_id, prefs_1)

        # Cache different preferences for tenant 2
        prefs_2 = [{"id": "pref-2", "key": "food.tea"}]
        await cache.cache_preferences(tenant_2, user_id, prefs_2)

        # Verify tenant 1 gets their preferences
        cached_1 = await cache.get_cached_preferences(tenant_1, user_id)
        assert cached_1 is not None
        assert len(cached_1) == 1
        assert cached_1[0]["id"] == "pref-1"

        # Verify tenant 2 gets their preferences
        cached_2 = await cache.get_cached_preferences(tenant_2, user_id)
        assert cached_2 is not None
        assert len(cached_2) == 1
        assert cached_2[0]["id"] == "pref-2"

    async def test_user_isolation(
        self,
        cache: SessionCache,
        tenant_id: str,
    ) -> None:
        """Test that cache entries are isolated by user."""
        user_1 = "user-1"
        user_2 = "user-2"

        # Cache preferences for user 1
        prefs_1 = [{"id": "pref-1", "key": "food.coffee"}]
        await cache.cache_preferences(tenant_id, user_1, prefs_1)

        # Cache different preferences for user 2
        prefs_2 = [{"id": "pref-2", "key": "food.tea"}]
        await cache.cache_preferences(tenant_id, user_2, prefs_2)

        # Verify user 1 gets their preferences
        cached_1 = await cache.get_cached_preferences(tenant_id, user_1)
        assert cached_1 is not None
        assert len(cached_1) == 1
        assert cached_1[0]["id"] == "pref-1"

        # Verify user 2 gets their preferences
        cached_2 = await cache.get_cached_preferences(tenant_id, user_2)
        assert cached_2 is not None
        assert len(cached_2) == 1
        assert cached_2[0]["id"] == "pref-2"


class TestSessionCacheContext:
    """Test context-based caching."""

    async def test_cache_and_retrieve_context(
        self,
        cache: SessionCache,
        tenant_id: str,
        user_id: str,
        sample_context: Dict[str, Any],
        sample_preferences: List[Dict[str, Any]],
    ) -> None:
        """Test caching and retrieving context-based preferences."""
        # Cache context retrieval
        await cache.cache_context_retrieval(
            tenant_id, user_id, sample_context, sample_preferences
        )

        # Retrieve from cache
        cached = await cache.get_cached_context_retrieval(
            tenant_id, user_id, sample_context
        )

        assert cached is not None
        assert len(cached) == 2
        assert cached[0]["id"] == "pref-1"

    async def test_different_contexts_different_cache(
        self,
        cache: SessionCache,
        tenant_id: str,
        user_id: str,
    ) -> None:
        """Test that different contexts have different cache entries."""
        context_1 = {"activity": "ordering coffee"}
        context_2 = {"activity": "ordering tea"}

        prefs_1 = [{"id": "pref-1", "key": "food.coffee"}]
        prefs_2 = [{"id": "pref-2", "key": "food.tea"}]

        # Cache for context 1
        await cache.cache_context_retrieval(tenant_id, user_id, context_1, prefs_1)

        # Cache for context 2
        await cache.cache_context_retrieval(tenant_id, user_id, context_2, prefs_2)

        # Verify context 1 retrieves correct preferences
        cached_1 = await cache.get_cached_context_retrieval(
            tenant_id, user_id, context_1
        )
        assert cached_1 is not None
        assert cached_1[0]["id"] == "pref-1"

        # Verify context 2 retrieves correct preferences
        cached_2 = await cache.get_cached_context_retrieval(
            tenant_id, user_id, context_2
        )
        assert cached_2 is not None
        assert cached_2[0]["id"] == "pref-2"

    async def test_context_hash_stability(
        self,
        cache: SessionCache,
        tenant_id: str,
        user_id: str,
        sample_preferences: List[Dict[str, Any]],
    ) -> None:
        """Test that same context produces same cache key."""
        # Same context in different order
        context_1 = {"activity": "coffee", "location": "shop"}
        context_2 = {"location": "shop", "activity": "coffee"}

        # Cache with first context
        await cache.cache_context_retrieval(
            tenant_id, user_id, context_1, sample_preferences
        )

        # Retrieve with second context (same data, different order)
        cached = await cache.get_cached_context_retrieval(
            tenant_id, user_id, context_2
        )

        # Should retrieve same cache entry
        assert cached is not None
        assert len(cached) == 2


class TestSessionCacheClearAll:
    """Test clearing all cache entries for a user."""

    async def test_clear_all_cache(
        self,
        cache: SessionCache,
        tenant_id: str,
        user_id: str,
        sample_preferences: List[Dict[str, Any]],
        sample_context: Dict[str, Any],
    ) -> None:
        """Test clearing all cache entries for a user."""
        # Cache preferences
        await cache.cache_preferences(tenant_id, user_id, sample_preferences)

        # Cache context
        await cache.cache_context_retrieval(
            tenant_id, user_id, sample_context, sample_preferences
        )

        # Verify both are cached
        assert await cache.get_cached_preferences(tenant_id, user_id) is not None
        assert (
            await cache.get_cached_context_retrieval(
                tenant_id, user_id, sample_context
            )
            is not None
        )

        # Clear all cache
        await cache.clear_all_cache(tenant_id, user_id)

        # Verify both are cleared
        assert await cache.get_cached_preferences(tenant_id, user_id) is None
        assert (
            await cache.get_cached_context_retrieval(
                tenant_id, user_id, sample_context
            )
            is None
        )


class TestSessionCacheErrors:
    """Test error handling."""

    async def test_cache_without_connect(self) -> None:
        """Test that operations fail without connect()."""
        config = PrototypeConfig()
        cache = SessionCache(config)

        # Should raise RuntimeError
        with pytest.raises(RuntimeError, match="not initialized"):
            await cache.cache_preferences("tenant", "user", [])

    async def test_get_without_connect(self) -> None:
        """Test that retrieval fails without connect()."""
        config = PrototypeConfig()
        cache = SessionCache(config)

        # Should raise RuntimeError
        with pytest.raises(RuntimeError, match="not initialized"):
            await cache.get_cached_preferences("tenant", "user")

    async def test_invalidate_without_connect(self) -> None:
        """Test that invalidation fails without connect()."""
        config = PrototypeConfig()
        cache = SessionCache(config)

        # Should raise RuntimeError
        with pytest.raises(RuntimeError, match="not initialized"):
            await cache.invalidate_preferences("tenant", "user")

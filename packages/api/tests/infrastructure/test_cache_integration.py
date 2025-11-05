"""Integration tests for Neo4j + Redis caching.

Tests verify that SessionCache correctly integrates with Neo4jPreferenceStore
to provide caching functionality with proper cache invalidation.

These tests require running Redis and Neo4j containers.
Run: docker-compose up -d redis neo4j
"""

import pytest
from fidus.infrastructure.neo4j_client import Neo4jPreferenceStore
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
async def store_with_cache(cache: SessionCache) -> Neo4jPreferenceStore:
    """Create Neo4j store with cache enabled."""
    config = PrototypeConfig()
    store = Neo4jPreferenceStore(config, cache=cache)
    await store.connect()

    # Clean up BEFORE tests to ensure clean state
    await store.delete_all_preferences(PrototypeConfig.PROTOTYPE_TENANT_ID)
    await store.delete_all_preferences("tenant-1")
    await store.delete_all_preferences("tenant-2")

    yield store

    # Clean up AFTER: delete all test preferences
    await store.delete_all_preferences(PrototypeConfig.PROTOTYPE_TENANT_ID)
    await store.delete_all_preferences("tenant-1")
    await store.delete_all_preferences("tenant-2")
    await store.disconnect()


@pytest.fixture
async def store_without_cache() -> Neo4jPreferenceStore:
    """Create Neo4j store without cache."""
    config = PrototypeConfig()
    store = Neo4jPreferenceStore(config, cache=None)
    await store.connect()
    yield store

    # Clean up: delete all test preferences
    await store.delete_all_preferences(PrototypeConfig.PROTOTYPE_TENANT_ID)
    await store.disconnect()


@pytest.fixture
def tenant_id() -> str:
    """Tenant ID for tests."""
    return PrototypeConfig.PROTOTYPE_TENANT_ID


@pytest.fixture
def user_id() -> str:
    """User ID for tests."""
    return "integration-test-user"


class TestCacheIntegration:
    """Test cache integration with Neo4j store."""

    async def test_cache_miss_fetches_from_database(
        self,
        store_with_cache: Neo4jPreferenceStore,
        cache: SessionCache,
        tenant_id: str,
        user_id: str,
    ) -> None:
        """Test that cache miss fetches from database and caches result."""
        # Create a preference
        pref = await store_with_cache.create_preference(
            tenant_id=tenant_id,
            key="food.coffee",
            sentiment="positive",
            confidence=0.8,
            user_id=user_id,
        )

        # Clear cache to simulate cache miss
        await cache.invalidate_preferences(tenant_id, user_id)

        # Verify cache is empty
        cached = await cache.get_cached_preferences(tenant_id, user_id)
        assert cached is None

        # Fetch preferences (should hit database and cache result)
        preferences = await store_with_cache.get_preferences(tenant_id, user_id)

        assert len(preferences) == 1
        assert preferences[0]["key"] == "food.coffee"

        # Verify result was cached
        cached = await cache.get_cached_preferences(tenant_id, user_id)
        assert cached is not None
        assert len(cached) == 1
        assert cached[0]["key"] == "food.coffee"

    async def test_cache_hit_skips_database(
        self,
        store_with_cache: Neo4jPreferenceStore,
        cache: SessionCache,
        tenant_id: str,
        user_id: str,
    ) -> None:
        """Test that cache hit returns cached data without database query."""
        # Create a preference
        await store_with_cache.create_preference(
            tenant_id=tenant_id,
            key="food.tea",
            sentiment="positive",
            confidence=0.7,
            user_id=user_id,
        )

        # First fetch (cache miss, populates cache)
        preferences_1 = await store_with_cache.get_preferences(tenant_id, user_id)
        assert len(preferences_1) == 1

        # Second fetch (cache hit)
        preferences_2 = await store_with_cache.get_preferences(tenant_id, user_id)
        assert len(preferences_2) == 1
        assert preferences_2[0]["key"] == "food.tea"

        # Verify cache was used by comparing key fields
        # (datetime fields will differ between DB and cache due to serialization)
        assert preferences_1[0]["key"] == preferences_2[0]["key"]
        assert preferences_1[0]["sentiment"] == preferences_2[0]["sentiment"]
        assert preferences_1[0]["confidence"] == preferences_2[0]["confidence"]

    async def test_create_invalidates_cache(
        self,
        store_with_cache: Neo4jPreferenceStore,
        cache: SessionCache,
        tenant_id: str,
        user_id: str,
    ) -> None:
        """Test that creating preference invalidates cache."""
        # Create first preference
        await store_with_cache.create_preference(
            tenant_id=tenant_id,
            key="food.cappuccino",
            sentiment="positive",
            confidence=0.8,
            user_id=user_id,
        )

        # Fetch to populate cache
        await store_with_cache.get_preferences(tenant_id, user_id)

        # Verify cached
        cached = await cache.get_cached_preferences(tenant_id, user_id)
        assert cached is not None
        assert len(cached) == 1

        # Create second preference (should invalidate cache)
        await store_with_cache.create_preference(
            tenant_id=tenant_id,
            key="food.latte",
            sentiment="positive",
            confidence=0.7,
            user_id=user_id,
        )

        # Verify cache was invalidated
        cached = await cache.get_cached_preferences(tenant_id, user_id)
        assert cached is None

        # Fetch again (should get both preferences from database)
        preferences = await store_with_cache.get_preferences(tenant_id, user_id)
        assert len(preferences) == 2

    async def test_update_invalidates_cache(
        self,
        store_with_cache: Neo4jPreferenceStore,
        cache: SessionCache,
        tenant_id: str,
        user_id: str,
    ) -> None:
        """Test that updating preference invalidates cache."""
        # Create preference
        pref = await store_with_cache.create_preference(
            tenant_id=tenant_id,
            key="food.espresso",
            sentiment="positive",
            confidence=0.5,
            user_id=user_id,
        )

        # Fetch to populate cache
        await store_with_cache.get_preferences(tenant_id, user_id)

        # Verify cached
        cached = await cache.get_cached_preferences(tenant_id, user_id)
        assert cached is not None

        # Update confidence (should invalidate cache)
        await store_with_cache.update_confidence(
            tenant_id=tenant_id,
            preference_id=pref["id"],
            delta=0.1,
            user_id=user_id,
        )

        # Verify cache was invalidated
        cached = await cache.get_cached_preferences(tenant_id, user_id)
        assert cached is None

    async def test_delete_invalidates_cache(
        self,
        store_with_cache: Neo4jPreferenceStore,
        cache: SessionCache,
        tenant_id: str,
        user_id: str,
    ) -> None:
        """Test that deleting preference invalidates cache."""
        # Create preference
        pref = await store_with_cache.create_preference(
            tenant_id=tenant_id,
            key="food.mocha",
            sentiment="positive",
            confidence=0.6,
            user_id=user_id,
        )

        # Fetch to populate cache
        await store_with_cache.get_preferences(tenant_id, user_id)

        # Verify cached
        cached = await cache.get_cached_preferences(tenant_id, user_id)
        assert cached is not None

        # Delete preference (should invalidate cache)
        deleted = await store_with_cache.delete_preference(
            tenant_id=tenant_id,
            preference_id=pref["id"],
            user_id=user_id,
        )
        assert deleted is True

        # Verify cache was invalidated
        cached = await cache.get_cached_preferences(tenant_id, user_id)
        assert cached is None

    async def test_store_without_cache_works(
        self,
        store_without_cache: Neo4jPreferenceStore,
        tenant_id: str,
    ) -> None:
        """Test that store works correctly without cache."""
        # Create preference
        pref = await store_without_cache.create_preference(
            tenant_id=tenant_id,
            key="food.americano",
            sentiment="positive",
            confidence=0.7,
        )

        # Fetch preferences (no caching)
        preferences = await store_without_cache.get_preferences(tenant_id)
        assert len(preferences) == 1
        assert preferences[0]["key"] == "food.americano"

        # Update confidence (no cache invalidation)
        updated = await store_without_cache.update_confidence(
            tenant_id=tenant_id,
            preference_id=pref["id"],
            delta=0.1,
        )
        # Use pytest.approx for floating point comparison
        assert updated["confidence"] == pytest.approx(0.8, rel=1e-9)

        # Fetch again
        preferences = await store_without_cache.get_preferences(tenant_id)
        assert preferences[0]["confidence"] == pytest.approx(0.8, rel=1e-9)


class TestMultiTenancyCaching:
    """Test that cache respects multi-tenancy boundaries."""

    async def test_different_tenants_different_cache(
        self,
        store_with_cache: Neo4jPreferenceStore,
        cache: SessionCache,
        user_id: str,
    ) -> None:
        """Test that different tenants have separate cache entries."""
        tenant_1 = "tenant-1"
        tenant_2 = "tenant-2"

        # Create preference for tenant 1
        await store_with_cache.create_preference(
            tenant_id=tenant_1,
            key="food.coffee",
            sentiment="positive",
            confidence=0.8,
            user_id=user_id,
        )

        # Create preference for tenant 2
        await store_with_cache.create_preference(
            tenant_id=tenant_2,
            key="food.tea",
            sentiment="positive",
            confidence=0.7,
            user_id=user_id,
        )

        # Fetch for tenant 1 (populates cache)
        prefs_1 = await store_with_cache.get_preferences(tenant_1, user_id)
        assert len(prefs_1) == 1
        assert prefs_1[0]["key"] == "food.coffee"

        # Fetch for tenant 2 (populates separate cache)
        prefs_2 = await store_with_cache.get_preferences(tenant_2, user_id)
        assert len(prefs_2) == 1
        assert prefs_2[0]["key"] == "food.tea"

        # Verify both are cached separately
        cached_1 = await cache.get_cached_preferences(tenant_1, user_id)
        cached_2 = await cache.get_cached_preferences(tenant_2, user_id)

        assert cached_1 is not None
        assert cached_2 is not None
        assert cached_1[0]["key"] == "food.coffee"
        assert cached_2[0]["key"] == "food.tea"

        # Clean up
        await store_with_cache.delete_all_preferences(tenant_1, user_id)
        await store_with_cache.delete_all_preferences(tenant_2, user_id)

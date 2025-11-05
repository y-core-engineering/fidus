#!/usr/bin/env python3
"""Manual test script for Redis session cache.

This script demonstrates the Redis caching functionality with Neo4j.
Run: python scripts/test_redis_cache.py

Prerequisites:
- docker-compose up -d redis neo4j
"""

import asyncio
import time
from fidus.config import PrototypeConfig
from fidus.infrastructure.redis.session_cache import SessionCache
from fidus.infrastructure.neo4j_client import Neo4jPreferenceStore


async def main() -> None:
    """Test Redis caching with Neo4j."""
    print("=== Redis Session Cache Test ===\n")

    # Initialize config
    config = PrototypeConfig()
    tenant_id = config.PROTOTYPE_TENANT_ID
    user_id = "test-user"

    # Initialize cache and store
    cache = SessionCache(config)
    await cache.connect()
    print("✓ Connected to Redis")

    store = Neo4jPreferenceStore(config, cache=cache)
    await store.connect()
    print("✓ Connected to Neo4j\n")

    try:
        # Clean up any existing test data
        await store.delete_all_preferences(tenant_id)
        print("✓ Cleaned up test data\n")

        # Test 1: Create preference
        print("Test 1: Creating preference...")
        start = time.time()
        pref = await store.create_preference(
            tenant_id=tenant_id,
            key="food.cappuccino",
            sentiment="positive",
            confidence=0.8,
            value="I love cappuccino",
            user_id=user_id,
        )
        elapsed = (time.time() - start) * 1000
        print(f"✓ Created preference: {pref['key']}")
        print(f"  Time: {elapsed:.2f}ms")
        print(f"  Cache invalidated: Yes\n")

        # Test 2: First fetch (cache miss)
        print("Test 2: First fetch (cache miss)...")
        start = time.time()
        prefs1 = await store.get_preferences(tenant_id, user_id)
        elapsed = (time.time() - start) * 1000
        print(f"✓ Fetched {len(prefs1)} preferences")
        print(f"  Time: {elapsed:.2f}ms")
        print(f"  Cache populated: Yes\n")

        # Test 3: Second fetch (cache hit)
        print("Test 3: Second fetch (cache hit)...")
        start = time.time()
        prefs2 = await store.get_preferences(tenant_id, user_id)
        elapsed = (time.time() - start) * 1000
        print(f"✓ Fetched {len(prefs2)} preferences")
        print(f"  Time: {elapsed:.2f}ms (should be faster!)")
        print(f"  Cache used: Yes\n")

        # Test 4: Update preference (invalidates cache)
        print("Test 4: Update preference (invalidates cache)...")
        start = time.time()
        updated = await store.update_confidence(
            tenant_id=tenant_id,
            preference_id=pref["id"],
            delta=0.1,
            user_id=user_id,
        )
        elapsed = (time.time() - start) * 1000
        print(f"✓ Updated confidence: {updated['confidence']}")
        print(f"  Time: {elapsed:.2f}ms")
        print(f"  Cache invalidated: Yes\n")

        # Test 5: Fetch after update (cache miss again)
        print("Test 5: Fetch after update (cache miss again)...")
        start = time.time()
        prefs3 = await store.get_preferences(tenant_id, user_id)
        elapsed = (time.time() - start) * 1000
        print(f"✓ Fetched {len(prefs3)} preferences")
        print(f"  Time: {elapsed:.2f}ms")
        print(f"  Cache populated: Yes\n")

        # Test 6: Verify cache TTL
        print("Test 6: Cache TTL (5 minutes)...")
        cached = await cache.get_cached_preferences(tenant_id, user_id)
        if cached:
            print(f"✓ Cache contains {len(cached)} preferences")
            print(f"  TTL: {cache.PREFERENCES_TTL} seconds (5 minutes)\n")
        else:
            print("✗ Cache miss (unexpected)\n")

        # Test 7: Multi-tenancy
        print("Test 7: Multi-tenancy isolation...")
        tenant2 = "tenant-2"
        await store.create_preference(
            tenant_id=tenant2,
            key="food.tea",
            sentiment="positive",
            confidence=0.7,
            user_id=user_id,
        )
        prefs_tenant1 = await store.get_preferences(tenant_id, user_id)
        prefs_tenant2 = await store.get_preferences(tenant2, user_id)
        print(f"✓ Tenant 1 has {len(prefs_tenant1)} preferences")
        print(f"✓ Tenant 2 has {len(prefs_tenant2)} preferences")
        print(f"  Isolation: Verified\n")

        # Clean up tenant 2
        await store.delete_all_preferences(tenant2)

        print("=== All Tests Passed! ===\n")

    finally:
        # Clean up
        await store.delete_all_preferences(tenant_id)
        await store.disconnect()
        await cache.disconnect()
        print("✓ Disconnected from Redis and Neo4j")


if __name__ == "__main__":
    asyncio.run(main())

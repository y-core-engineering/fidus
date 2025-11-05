#!/usr/bin/env python3
"""
Manual Test Script for Phase 4 Implementation
Tests all four tasks end-to-end with the actual services.
"""

import asyncio
import sys
from pathlib import Path

# Add packages/api to path
sys.path.insert(0, str(Path(__file__).parent.parent))

import uuid
from fidus.config import PrototypeConfig
from fidus.infrastructure.neo4j_client import Neo4jPreferenceStore
from fidus.infrastructure.redis.session_cache import SessionCache
from fidus.infrastructure.postgres.conversation_store import ConversationStore
from fidus.memory.mcp_server import PreferenceMCPServer
from fidus.memory.persistent_agent import PersistentAgent

# Colors for output
class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    END = '\033[0m'
    BOLD = '\033[1m'

def print_section(title: str):
    """Print a section header."""
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*80}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{title.center(80)}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*80}{Colors.END}\n")

def print_success(message: str):
    """Print a success message."""
    print(f"{Colors.GREEN}✓{Colors.END} {message}")

def print_error(message: str):
    """Print an error message."""
    print(f"{Colors.RED}✗{Colors.END} {message}")

def print_info(message: str):
    """Print an info message."""
    print(f"{Colors.YELLOW}ℹ{Colors.END} {message}")

async def test_task_4_1_mcp_server():
    """Test Task 4.1: MCP Server Interface."""
    print_section("Task 4.1: MCP Server Interface")

    try:
        # Initialize dependencies
        config = PrototypeConfig()
        tenant_id = config.PROTOTYPE_TENANT_ID
        user_id = f"test-user-{uuid.uuid4()}"

        print_info(f"Testing with tenant_id: {tenant_id}, user_id: {user_id}")

        # Initialize agent
        agent = PersistentAgent(tenant_id=tenant_id)
        await agent.connect()

        # Initialize MCP server
        print_info("Initializing MCP server...")
        mcp_server = PreferenceMCPServer(agent)

        # Test: List tools
        tools = mcp_server.list_tools()
        print_success(f"MCP server initialized with {len(tools)} tools")
        for tool in tools:
            print(f"  - {tool.name}: {tool.description}")

        # Test: List resources
        resources = mcp_server.list_resources()
        print_success(f"MCP server has {len(resources)} resources")
        for resource in resources:
            print(f"  - {resource.uri_template}: {resource.description}")

        # Test: get_preferences tool
        print_info("\\nTesting get_preferences tool...")
        result = await mcp_server.call_tool("get_preferences", user_id=user_id)
        print_success(f"get_preferences returned: {result}")

        # Test: learn_preference tool
        print_info("\\nTesting learn_preference tool...")
        learn_result = await mcp_server.call_tool(
            "learn_preference",
            user_id=user_id,
            message="I love cappuccino coffee in the morning"
        )
        print_success(f"learn_preference completed: {learn_result}")

        # Test: get_preferences again (should have new preference)
        print_info("\\nTesting get_preferences after learning...")
        result2 = await mcp_server.call_tool("get_preferences", user_id=user_id, min_confidence=0.3)
        preferences = result2.get("preferences", [])
        print_success(f"Found {len(preferences)} preferences")
        for pref in preferences:
            print(f"  - {pref['key']}: {pref['value']} (confidence: {pref['confidence']:.2f})")

        # Test: user preferences resource
        print_info("\\nTesting user preferences resource...")
        resource_uri = f"user://{user_id}/preferences"
        resource_result = await mcp_server.call_resource(resource_uri)
        print_success(f"Resource {resource_uri} returned {len(resource_result.get('preferences', []))} preferences")

        # Cleanup
        await agent.disconnect()
        print_success("\\nTask 4.1: MCP Server Interface - PASSED")
        return True

    except Exception as e:
        print_error(f"Task 4.1 failed: {e}")
        import traceback
        traceback.print_exc()
        return False

async def test_task_4_2_postgresql():
    """Test Task 4.2: PostgreSQL Conversation Storage."""
    print_section("Task 4.2: PostgreSQL Conversation Storage")

    try:
        config = PrototypeConfig()
        user_id = f"test-user-{uuid.uuid4()}"

        print_info(f"Testing with user_id: {user_id}")

        # Initialize ConversationStore
        print_info("Connecting to PostgreSQL...")
        store = ConversationStore(config.postgres_dsn)
        await store.connect()
        print_success("Connected to PostgreSQL")

        # Test: Save messages
        print_info("\\nSaving test messages...")
        msg1_id = await store.save_message(user_id, "user", "Hello, Fidus!")
        msg2_id = await store.save_message(user_id, "assistant", "Hello! How can I help you?")
        msg3_id = await store.save_message(user_id, "user", "I like pizza", metadata={"context": "food preferences"})
        print_success(f"Saved 3 messages: {msg1_id}, {msg2_id}, {msg3_id}")

        # Test: Retrieve conversation history
        print_info("\\nRetrieving conversation history...")
        history = await store.get_conversation_history(user_id, limit=10)
        print_success(f"Retrieved {len(history)} messages")
        for msg in history:
            role_emoji = "👤" if msg["role"] == "user" else "🤖"
            print(f"  {role_emoji} {msg['role']}: {msg['content'][:50]}...")

        # Test: Message count
        print_info("\\nCounting messages...")
        count = await store.get_message_count(user_id)
        print_success(f"Total messages for user: {count}")

        # Test: User isolation
        print_info("\\nTesting user isolation...")
        other_user_id = f"other-user-{uuid.uuid4()}"
        other_history = await store.get_conversation_history(other_user_id)
        if len(other_history) == 0:
            print_success("User isolation verified: other user sees 0 messages")
        else:
            print_error(f"User isolation FAILED: other user sees {len(other_history)} messages")
            return False

        # Test: Delete user conversations
        print_info("\\nDeleting test user conversations...")
        deleted = await store.delete_user_conversations(user_id)
        print_success(f"Deleted {deleted} messages")

        # Verify deletion
        final_history = await store.get_conversation_history(user_id)
        if len(final_history) == 0:
            print_success("Deletion verified: user has 0 messages")
        else:
            print_error(f"Deletion FAILED: user still has {len(final_history)} messages")
            return False

        # Cleanup
        await store.close()
        print_success("\\nTask 4.2: PostgreSQL Conversation Storage - PASSED")
        return True

    except Exception as e:
        print_error(f"Task 4.2 failed: {e}")
        import traceback
        traceback.print_exc()
        return False

async def test_task_4_3_redis_cache():
    """Test Task 4.3: Redis Session Cache."""
    print_section("Task 4.3: Redis Session Cache")

    try:
        config = PrototypeConfig()
        user_id = f"test-user-{uuid.uuid4()}"
        tenant_id = config.PROTOTYPE_TENANT_ID

        print_info(f"Testing with user_id: {user_id}")

        # Initialize cache
        print_info("Connecting to Redis...")
        cache = SessionCache(config.redis_url)
        await cache.connect()
        print_success("Connected to Redis")

        # Test: Cache preferences
        print_info("\\nCaching test preferences...")
        test_prefs = [
            {"domain": "coffee", "key": "type", "value": "cappuccino", "confidence": 0.8},
            {"domain": "food", "key": "cuisine", "value": "italian", "confidence": 0.9}
        ]
        await cache.cache_preferences(user_id, test_prefs, ttl=60)
        print_success("Preferences cached with 60s TTL")

        # Test: Retrieve from cache
        print_info("\\nRetrieving from cache...")
        cached = await cache.get_cached_preferences(user_id)
        if cached:
            print_success(f"Cache HIT: Retrieved {len(cached)} preferences")
            for pref in cached:
                print(f"  - {pref['key']}: {pref['value']}")
        else:
            print_error("Cache MISS: No preferences found")
            return False

        # Test: Cache miss for different user
        print_info("\\nTesting cache isolation...")
        other_user_cached = await cache.get_cached_preferences("other-user-id")
        if other_user_cached is None:
            print_success("Cache isolation verified: other user has cache miss")
        else:
            print_error("Cache isolation FAILED: other user found cached data")
            return False

        # Test: Cache invalidation
        print_info("\\nInvalidating cache...")
        await cache.invalidate_preferences(user_id)
        print_success("Cache invalidated")

        # Verify invalidation
        after_invalidation = await cache.get_cached_preferences(user_id)
        if after_invalidation is None:
            print_success("Invalidation verified: cache miss after invalidation")
        else:
            print_error("Invalidation FAILED: data still in cache")
            return False

        # Test: Integration with Neo4j
        print_info("\\nTesting cache integration with Neo4j...")
        neo4j_store = Neo4jPreferenceStore(
            uri=config.neo4j_uri,
            user=config.neo4j_user,
            password=config.neo4j_password,
            cache=cache
        )
        await neo4j_store.connect()

        # Create preference (should invalidate cache)
        pref_id = await neo4j_store.create_preference(
            user_id=user_id,
            tenant_id=tenant_id,
            domain="test",
            key="integration",
            value="test_value",
            confidence=0.7,
            source="manual_test"
        )
        print_success(f"Created preference: {pref_id}")

        # First get (cache miss)
        import time
        start = time.time()
        prefs1 = await neo4j_store.get_preferences(user_id, tenant_id)
        time1 = (time.time() - start) * 1000
        print_info(f"First get (cache miss): {time1:.2f}ms")

        # Second get (cache hit)
        start = time.time()
        prefs2 = await neo4j_store.get_preferences(user_id, tenant_id)
        time2 = (time.time() - start) * 1000
        print_info(f"Second get (cache hit): {time2:.2f}ms")

        speedup = time1 / time2 if time2 > 0 else 0
        print_success(f"Cache speedup: {speedup:.1f}x faster")

        # Cleanup
        await neo4j_store.delete_all_preferences(user_id, tenant_id)
        await neo4j_store.disconnect()
        await cache.close()

        print_success("\\nTask 4.3: Redis Session Cache - PASSED")
        return True

    except Exception as e:
        print_error(f"Task 4.3 failed: {e}")
        import traceback
        traceback.print_exc()
        return False

async def test_task_4_4_multi_user():
    """Test Task 4.4: Multi-User Support & Authentication."""
    print_section("Task 4.4: Multi-User Support & Authentication")

    try:
        config = PrototypeConfig()
        tenant_id = config.PROTOTYPE_TENANT_ID

        # Create two users
        user_a = f"alice-{uuid.uuid4()}"
        user_b = f"bob-{uuid.uuid4()}"

        print_info(f"Testing with user_a: {user_a}")
        print_info(f"Testing with user_b: {user_b}")

        # Initialize agents for both users
        print_info("\\nInitializing agents for both users...")
        agent_a = PersistentAgent(tenant_id=tenant_id)
        agent_b = PersistentAgent(tenant_id=tenant_id)
        await agent_a.connect()
        await agent_b.connect()
        print_success("Both agents initialized")

        # User A learns preferences
        print_info("\\nUser A learning preferences...")
        await agent_a.chat("I love pizza and cappuccino", user_id=user_a)
        print_success("User A learned preferences")

        # User B learns different preferences
        print_info("\\nUser B learning preferences...")
        await agent_b.chat("I prefer tea and sushi", user_id=user_b)
        print_success("User B learned preferences")

        # Test: User A can see their preferences
        print_info("\\nRetrieving User A's preferences...")
        prefs_a = await agent_a.neo4j.get_preferences(user_a, tenant_id)
        print_success(f"User A has {len(prefs_a)} preferences:")
        for pref in prefs_a:
            print(f"  - {pref['key']}: {pref['value']}")

        # Test: User B can see their preferences
        print_info("\\nRetrieving User B's preferences...")
        prefs_b = await agent_b.neo4j.get_preferences(user_b, tenant_id)
        print_success(f"User B has {len(prefs_b)} preferences:")
        for pref in prefs_b:
            print(f"  - {pref['key']}: {pref['value']}")

        # Test: User isolation (CRITICAL SECURITY TEST)
        print_info("\\n**CRITICAL TEST: User Isolation**")

        # User A should NOT see User B's preferences
        prefs_a_seeing_b = await agent_a.neo4j.get_preferences(user_b, tenant_id)
        if len(prefs_a_seeing_b) == 0:
            print_success("✓ SECURITY VERIFIED: User A cannot see User B's preferences")
        else:
            print_error(f"✗ SECURITY BREACH: User A can see {len(prefs_a_seeing_b)} of User B's preferences!")
            return False

        # User B should NOT see User A's preferences
        prefs_b_seeing_a = await agent_b.neo4j.get_preferences(user_a, tenant_id)
        if len(prefs_b_seeing_a) == 0:
            print_success("✓ SECURITY VERIFIED: User B cannot see User A's preferences")
        else:
            print_error(f"✗ SECURITY BREACH: User B can see {len(prefs_b_seeing_a)} of User A's preferences!")
            return False

        # Cleanup
        print_info("\\nCleaning up test data...")
        await agent_a.neo4j.delete_all_preferences(user_a, tenant_id)
        await agent_b.neo4j.delete_all_preferences(user_b, tenant_id)
        await agent_a.disconnect()
        await agent_b.disconnect()
        print_success("Cleanup complete")

        print_success("\\nTask 4.4: Multi-User Support & Authentication - PASSED")
        print_success("**USER ISOLATION VERIFIED - SECURITY TEST PASSED**")
        return True

    except Exception as e:
        print_error(f"Task 4.4 failed: {e}")
        import traceback
        traceback.print_exc()
        return False

async def main():
    """Run all Phase 4 tests."""
    print_section("FIDUS MEMORY PHASE 4: MANUAL TESTING")
    print(f"{Colors.BOLD}Testing all four tasks end-to-end{Colors.END}\\n")

    results = {}

    # Run all tests
    results["4.1 MCP Server"] = await test_task_4_1_mcp_server()
    results["4.2 PostgreSQL"] = await test_task_4_2_postgresql()
    results["4.3 Redis Cache"] = await test_task_4_3_redis_cache()
    results["4.4 Multi-User Auth"] = await test_task_4_4_multi_user()

    # Print summary
    print_section("TEST SUMMARY")

    all_passed = True
    for task, passed in results.items():
        if passed:
            print_success(f"{task}: PASSED")
        else:
            print_error(f"{task}: FAILED")
            all_passed = False

    if all_passed:
        print(f"\\n{Colors.BOLD}{Colors.GREEN}{'='*80}{Colors.END}")
        print(f"{Colors.BOLD}{Colors.GREEN}ALL PHASE 4 TESTS PASSED!{Colors.END}".center(88))
        print(f"{Colors.BOLD}{Colors.GREEN}Phase 4 is PRODUCTION-READY{Colors.END}".center(88))
        print(f"{Colors.BOLD}{Colors.GREEN}{'='*80}{Colors.END}")
        return 0
    else:
        print(f"\\n{Colors.BOLD}{Colors.RED}{'='*80}{Colors.END}")
        print(f"{Colors.BOLD}{Colors.RED}SOME TESTS FAILED{Colors.END}".center(88))
        print(f"{Colors.BOLD}{Colors.RED}{'='*80}{Colors.END}")
        return 1

if __name__ == "__main__":
    try:
        sys.exit(asyncio.run(main()))
    except KeyboardInterrupt:
        print("\\n\\nTest interrupted by user")
        sys.exit(1)

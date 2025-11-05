"""Manual test script for ConversationStore.

This script demonstrates the basic functionality of the ConversationStore
including saving messages, retrieving history, and cleanup.

Usage:
    poetry run python -m fidus.infrastructure.postgres.manual_test
"""

import asyncio
from fidus.infrastructure.postgres.conversation_store import ConversationStore
from fidus.config import PrototypeConfig


async def main() -> None:
    """Run manual test of ConversationStore."""
    print("=== ConversationStore Manual Test ===\n")

    # Initialize store
    store = ConversationStore()
    await store.initialize()
    print("✓ ConversationStore initialized\n")

    # Test data
    user_id = "demo-user"
    tenant_id = PrototypeConfig.PROTOTYPE_TENANT_ID

    # Save some messages
    print("1. Saving conversation messages...")
    await store.save_message(
        user_id=user_id,
        tenant_id=tenant_id,
        role="user",
        content="What's the weather like today?",
        metadata={"source": "web_ui", "ip": "127.0.0.1"},
    )

    await store.save_message(
        user_id=user_id,
        tenant_id=tenant_id,
        role="assistant",
        content="I can help you check the weather. Where are you located?",
        metadata={"model": "llama3.2", "tokens": 15},
    )

    await store.save_message(
        user_id=user_id,
        tenant_id=tenant_id,
        role="user",
        content="I'm in Berlin, Germany",
    )

    await store.save_message(
        user_id=user_id,
        tenant_id=tenant_id,
        role="assistant",
        content="The weather in Berlin today is sunny with a high of 22°C.",
        metadata={"model": "llama3.2", "tokens": 18, "weather_api": "openweather"},
    )

    print("✓ Saved 4 messages\n")

    # Retrieve conversation history
    print("2. Retrieving conversation history...")
    messages = await store.get_conversation_history(
        user_id=user_id,
        tenant_id=tenant_id,
    )

    print(f"✓ Retrieved {len(messages)} messages:\n")
    for i, msg in enumerate(messages, 1):
        print(f"  [{i}] {msg.role}: {msg.content}")
        if msg.metadata:
            print(f"      metadata: {msg.metadata}")

    print()

    # Get message count
    count = await store.get_message_count(user_id=user_id, tenant_id=tenant_id)
    print(f"3. Total message count: {count}\n")

    # Test cleanup (won't delete anything since messages are new)
    print("4. Testing 7-day cleanup (should delete 0 messages)...")
    deleted = await store.cleanup_old_conversations()
    print(f"✓ Cleaned up {deleted} old messages\n")

    # Test user data deletion
    print("5. Testing user data deletion (privacy feature)...")
    deleted = await store.delete_user_conversations(
        user_id=user_id,
        tenant_id=tenant_id,
    )
    print(f"✓ Deleted {deleted} messages for user {user_id}\n")

    # Verify deletion
    messages_after = await store.get_conversation_history(
        user_id=user_id,
        tenant_id=tenant_id,
    )
    print(f"6. Messages after deletion: {len(messages_after)}\n")

    # Close store
    await store.close()
    print("✓ ConversationStore closed\n")

    print("=== Test Complete ===")


if __name__ == "__main__":
    asyncio.run(main())

"""Integration tests for ConversationStore.

These tests require a running PostgreSQL instance with the schema initialized.
Tests verify:
- Message storage and retrieval
- Conversation history ordering
- Multi-tenancy isolation
- Privacy features (user data deletion)
- 7-day retention cleanup
"""

from __future__ import annotations

import json
import pytest
import asyncpg
from datetime import datetime, timedelta, timezone
from uuid import uuid4

from fidus.infrastructure.postgres.conversation_store import (
    ConversationStore,
    ConversationMessage,
)
from fidus.config import PrototypeConfig


@pytest.fixture
async def db_pool() -> asyncpg.Pool:
    """Create database connection pool for tests.

    Returns:
        asyncpg.Pool: Database connection pool

    Note:
        Requires PostgreSQL to be running with schema initialized.
    """
    from fidus.config import config

    pool = await asyncpg.create_pool(
        host=config.postgres_host,
        port=config.postgres_port,
        user=config.postgres_user,
        password=config.postgres_password,
        database=config.postgres_db,
        min_size=1,
        max_size=5,
    )

    yield pool

    await pool.close()


@pytest.fixture
async def conversation_store(db_pool: asyncpg.Pool) -> ConversationStore:
    """Create ConversationStore instance for tests.

    Args:
        db_pool: Database connection pool fixture

    Returns:
        ConversationStore: Initialized conversation store
    """
    store = ConversationStore(pool=db_pool)
    yield store
    # No need to close since pool is managed by db_pool fixture


@pytest.fixture
async def clean_database(db_pool: asyncpg.Pool) -> None:
    """Clean database before each test.

    Args:
        db_pool: Database connection pool fixture
    """
    async with db_pool.acquire() as conn:
        await conn.execute("DELETE FROM conversations")

    yield

    # Clean up after test
    async with db_pool.acquire() as conn:
        await conn.execute("DELETE FROM conversations")


@pytest.mark.asyncio
async def test_save_and_retrieve_message(
    conversation_store: ConversationStore,
    clean_database: None,
) -> None:
    """Test saving and retrieving a single message."""
    # Arrange
    user_id = "test-user-1"
    tenant_id = PrototypeConfig.PROTOTYPE_TENANT_ID

    # Act - Save message
    saved_message = await conversation_store.save_message(
        user_id=user_id,
        tenant_id=tenant_id,
        role="user",
        content="Hello, Fidus!",
        metadata={"source": "test"},
    )

    # Act - Retrieve messages
    messages = await conversation_store.get_conversation_history(
        user_id=user_id,
        tenant_id=tenant_id,
    )

    # Assert
    assert len(messages) == 1
    message = messages[0]
    assert message.id == saved_message.id
    assert message.user_id == user_id
    assert message.tenant_id == tenant_id
    assert message.role == "user"
    assert message.content == "Hello, Fidus!"
    assert message.metadata == {"source": "test"}


@pytest.mark.asyncio
async def test_conversation_history_ordering(
    conversation_store: ConversationStore,
    clean_database: None,
) -> None:
    """Test that conversation history is returned in chronological order (oldest first)."""
    # Arrange
    user_id = "test-user-2"
    tenant_id = PrototypeConfig.PROTOTYPE_TENANT_ID

    # Act - Save multiple messages
    msg1 = await conversation_store.save_message(
        user_id=user_id,
        tenant_id=tenant_id,
        role="user",
        content="First message",
    )

    msg2 = await conversation_store.save_message(
        user_id=user_id,
        tenant_id=tenant_id,
        role="assistant",
        content="Second message",
    )

    msg3 = await conversation_store.save_message(
        user_id=user_id,
        tenant_id=tenant_id,
        role="user",
        content="Third message",
    )

    # Act - Retrieve messages
    messages = await conversation_store.get_conversation_history(
        user_id=user_id,
        tenant_id=tenant_id,
    )

    # Assert - Check chronological order (oldest first)
    assert len(messages) == 3
    assert messages[0].id == msg1.id
    assert messages[0].content == "First message"
    assert messages[1].id == msg2.id
    assert messages[1].content == "Second message"
    assert messages[2].id == msg3.id
    assert messages[2].content == "Third message"


@pytest.mark.asyncio
async def test_conversation_history_limit(
    conversation_store: ConversationStore,
    clean_database: None,
) -> None:
    """Test that conversation history respects the limit parameter."""
    # Arrange
    user_id = "test-user-3"
    tenant_id = PrototypeConfig.PROTOTYPE_TENANT_ID

    # Save 10 messages
    for i in range(10):
        await conversation_store.save_message(
            user_id=user_id,
            tenant_id=tenant_id,
            role="user",
            content=f"Message {i}",
        )

    # Act - Retrieve with limit
    messages = await conversation_store.get_conversation_history(
        user_id=user_id,
        tenant_id=tenant_id,
        limit=5,
    )

    # Assert - Should return only 5 messages (oldest 5)
    assert len(messages) == 5
    assert messages[0].content == "Message 0"
    assert messages[4].content == "Message 4"


@pytest.mark.asyncio
async def test_user_isolation(
    conversation_store: ConversationStore,
    clean_database: None,
) -> None:
    """Test that users can only see their own conversations (multi-tenancy)."""
    # Arrange
    user1 = "test-user-4a"
    user2 = "test-user-4b"
    tenant_id = PrototypeConfig.PROTOTYPE_TENANT_ID

    # Act - Save messages for different users
    await conversation_store.save_message(
        user_id=user1,
        tenant_id=tenant_id,
        role="user",
        content="User 1 message",
    )

    await conversation_store.save_message(
        user_id=user2,
        tenant_id=tenant_id,
        role="user",
        content="User 2 message",
    )

    # Act - Retrieve messages for each user
    user1_messages = await conversation_store.get_conversation_history(
        user_id=user1,
        tenant_id=tenant_id,
    )

    user2_messages = await conversation_store.get_conversation_history(
        user_id=user2,
        tenant_id=tenant_id,
    )

    # Assert - Each user sees only their own messages
    assert len(user1_messages) == 1
    assert user1_messages[0].content == "User 1 message"
    assert user1_messages[0].user_id == user1

    assert len(user2_messages) == 1
    assert user2_messages[0].content == "User 2 message"
    assert user2_messages[0].user_id == user2


@pytest.mark.asyncio
async def test_tenant_isolation(
    conversation_store: ConversationStore,
    clean_database: None,
) -> None:
    """Test that tenants can only see their own data (multi-tenancy)."""
    # Arrange
    user_id = "test-user-5"
    tenant1 = "tenant-1"
    tenant2 = "tenant-2"

    # Act - Save messages for different tenants
    await conversation_store.save_message(
        user_id=user_id,
        tenant_id=tenant1,
        role="user",
        content="Tenant 1 message",
    )

    await conversation_store.save_message(
        user_id=user_id,
        tenant_id=tenant2,
        role="user",
        content="Tenant 2 message",
    )

    # Act - Retrieve messages for each tenant
    tenant1_messages = await conversation_store.get_conversation_history(
        user_id=user_id,
        tenant_id=tenant1,
    )

    tenant2_messages = await conversation_store.get_conversation_history(
        user_id=user_id,
        tenant_id=tenant2,
    )

    # Assert - Each tenant sees only their own messages
    assert len(tenant1_messages) == 1
    assert tenant1_messages[0].content == "Tenant 1 message"
    assert tenant1_messages[0].tenant_id == tenant1

    assert len(tenant2_messages) == 1
    assert tenant2_messages[0].content == "Tenant 2 message"
    assert tenant2_messages[0].tenant_id == tenant2


@pytest.mark.asyncio
async def test_delete_user_conversations(
    conversation_store: ConversationStore,
    clean_database: None,
) -> None:
    """Test deleting all conversations for a user (privacy feature)."""
    # Arrange
    user_id = "test-user-6"
    tenant_id = PrototypeConfig.PROTOTYPE_TENANT_ID

    # Save multiple messages
    for i in range(5):
        await conversation_store.save_message(
            user_id=user_id,
            tenant_id=tenant_id,
            role="user",
            content=f"Message {i}",
        )

    # Verify messages exist
    messages_before = await conversation_store.get_conversation_history(
        user_id=user_id,
        tenant_id=tenant_id,
    )
    assert len(messages_before) == 5

    # Act - Delete user conversations
    deleted_count = await conversation_store.delete_user_conversations(
        user_id=user_id,
        tenant_id=tenant_id,
    )

    # Assert
    assert deleted_count == 5

    # Verify messages are deleted
    messages_after = await conversation_store.get_conversation_history(
        user_id=user_id,
        tenant_id=tenant_id,
    )
    assert len(messages_after) == 0


@pytest.mark.asyncio
async def test_cleanup_old_conversations(
    conversation_store: ConversationStore,
    clean_database: None,
    db_pool: asyncpg.Pool,
) -> None:
    """Test automatic cleanup of conversations older than 7 days."""
    # Arrange
    user_id = "test-user-7"
    tenant_id = PrototypeConfig.PROTOTYPE_TENANT_ID

    # Insert old message directly (bypass created_at auto-generation)
    old_timestamp = datetime.now(timezone.utc) - timedelta(days=8)

    async with db_pool.acquire() as conn:
        await conn.execute(
            """
            INSERT INTO conversations (id, user_id, tenant_id, role, content, metadata, created_at)
            VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7)
            """,
            uuid4(),
            user_id,
            tenant_id,
            "user",
            "Old message (8 days ago)",
            json.dumps({}),  # Serialize to JSON string for JSONB cast
            old_timestamp,
        )

    # Insert recent message
    await conversation_store.save_message(
        user_id=user_id,
        tenant_id=tenant_id,
        role="user",
        content="Recent message",
    )

    # Verify both messages exist
    messages_before = await conversation_store.get_conversation_history(
        user_id=user_id,
        tenant_id=tenant_id,
    )
    assert len(messages_before) == 2

    # Act - Cleanup old conversations
    deleted_count = await conversation_store.cleanup_old_conversations()

    # Assert - Old message deleted, recent message remains
    assert deleted_count == 1

    messages_after = await conversation_store.get_conversation_history(
        user_id=user_id,
        tenant_id=tenant_id,
    )
    assert len(messages_after) == 1
    assert messages_after[0].content == "Recent message"


@pytest.mark.asyncio
async def test_invalid_role(
    conversation_store: ConversationStore,
    clean_database: None,
) -> None:
    """Test that invalid roles are rejected."""
    # Arrange
    user_id = "test-user-8"
    tenant_id = PrototypeConfig.PROTOTYPE_TENANT_ID

    # Act & Assert - Should raise ValueError
    with pytest.raises(ValueError, match="Invalid role"):
        await conversation_store.save_message(
            user_id=user_id,
            tenant_id=tenant_id,
            role="invalid_role",  # Invalid role
            content="This should fail",
        )


@pytest.mark.asyncio
async def test_get_message_count(
    conversation_store: ConversationStore,
    clean_database: None,
) -> None:
    """Test getting message count for a user."""
    # Arrange
    user_id = "test-user-9"
    tenant_id = PrototypeConfig.PROTOTYPE_TENANT_ID

    # Act - Initially zero
    initial_count = await conversation_store.get_message_count(
        user_id=user_id,
        tenant_id=tenant_id,
    )
    assert initial_count == 0

    # Save messages
    for i in range(3):
        await conversation_store.save_message(
            user_id=user_id,
            tenant_id=tenant_id,
            role="user",
            content=f"Message {i}",
        )

    # Act - Should be 3
    final_count = await conversation_store.get_message_count(
        user_id=user_id,
        tenant_id=tenant_id,
    )

    # Assert
    assert final_count == 3


@pytest.mark.asyncio
async def test_store_without_initialization(db_pool: asyncpg.Pool) -> None:
    """Test that store raises error if used before initialization."""
    # Arrange - Create store without pool
    store = ConversationStore()

    # Act & Assert - Should raise RuntimeError
    with pytest.raises(RuntimeError, match="not initialized"):
        await store.save_message(
            user_id="test-user",
            tenant_id="test-tenant",
            role="user",
            content="This should fail",
        )


@pytest.mark.asyncio
async def test_message_to_dict(
    conversation_store: ConversationStore,
    clean_database: None,
) -> None:
    """Test ConversationMessage.to_dict() serialization."""
    # Arrange & Act
    message = await conversation_store.save_message(
        user_id="test-user-10",
        tenant_id=PrototypeConfig.PROTOTYPE_TENANT_ID,
        role="assistant",
        content="Test response",
        metadata={"model": "llama3.2", "tokens": 42},
    )

    # Act
    message_dict = message.to_dict()

    # Assert
    assert message_dict["user_id"] == "test-user-10"
    assert message_dict["tenant_id"] == PrototypeConfig.PROTOTYPE_TENANT_ID
    assert message_dict["role"] == "assistant"
    assert message_dict["content"] == "Test response"
    assert message_dict["metadata"] == {"model": "llama3.2", "tokens": 42}
    assert "id" in message_dict
    assert "created_at" in message_dict

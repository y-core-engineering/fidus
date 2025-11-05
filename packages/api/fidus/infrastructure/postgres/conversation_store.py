"""PostgreSQL-based conversation storage with 7-day retention.

This module provides conversation history storage with automatic cleanup
for privacy compliance. All data is scoped to tenant_id + user_id for
multi-tenancy isolation.
"""

from __future__ import annotations

import asyncpg  # type: ignore[import-untyped]
import json
import logging
from typing import Any, List, Dict, Optional
from datetime import datetime, timezone
from uuid import UUID, uuid4

from fidus.config import config

logger = logging.getLogger(__name__)


class ConversationMessage:
    """Represents a single message in a conversation.

    Attributes:
        id: Unique message identifier
        user_id: User identifier (multi-tenancy)
        tenant_id: Tenant identifier (multi-tenancy)
        role: Message role (user, assistant, system)
        content: Message content
        metadata: Optional metadata as dictionary
        created_at: Message timestamp
    """

    def __init__(
        self,
        user_id: str,
        tenant_id: str,
        role: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None,
        id: Optional[UUID] = None,
        created_at: Optional[datetime] = None,
    ):
        """Initialize conversation message.

        Args:
            user_id: User identifier
            tenant_id: Tenant identifier
            role: Message role (user, assistant, system)
            content: Message content
            metadata: Optional metadata dictionary
            id: Optional message ID (generated if not provided)
            created_at: Optional timestamp (set to now if not provided)
        """
        self.id = id or uuid4()
        self.user_id = user_id
        self.tenant_id = tenant_id
        self.role = role
        self.content = content
        self.metadata = metadata or {}
        self.created_at = created_at or datetime.now(timezone.utc)

    def to_dict(self) -> Dict[str, Any]:
        """Convert message to dictionary.

        Returns:
            Dictionary representation of message
        """
        return {
            "id": str(self.id),
            "user_id": self.user_id,
            "tenant_id": self.tenant_id,
            "role": self.role,
            "content": self.content,
            "metadata": self.metadata,
            "created_at": self.created_at.isoformat(),
        }

    @classmethod
    def from_record(cls, record: asyncpg.Record) -> ConversationMessage:
        """Create message from database record.

        Args:
            record: Database record from asyncpg

        Returns:
            ConversationMessage instance
        """
        # Parse metadata if it's a JSON string
        metadata = record["metadata"]
        if isinstance(metadata, str):
            metadata = json.loads(metadata)

        return cls(
            id=record["id"],
            user_id=record["user_id"],
            tenant_id=record["tenant_id"],
            role=record["role"],
            content=record["content"],
            metadata=metadata,
            created_at=record["created_at"],
        )


class ConversationStore:
    """PostgreSQL-based conversation storage with automatic 7-day retention.

    This class handles storing and retrieving conversation messages with
    multi-tenancy isolation and automatic cleanup for privacy compliance.

    Multi-Tenancy: All operations are scoped to tenant_id + user_id.
    Privacy: Messages are automatically deleted after 7 days.
    """

    def __init__(self, pool: Optional[asyncpg.Pool] = None):
        """Initialize conversation store.

        Args:
            pool: Optional asyncpg connection pool (created if not provided)
        """
        self.pool = pool
        self._pool_created_internally = pool is None

    async def initialize(self) -> None:
        """Initialize database connection pool.

        Must be called before using the store if pool was not provided.
        """
        if self.pool is None:
            logger.info(f"Connecting to PostgreSQL: {config.postgres_host}:{config.postgres_port}")
            self.pool = await asyncpg.create_pool(
                host=config.postgres_host,
                port=config.postgres_port,
                user=config.postgres_user,
                password=config.postgres_password,
                database=config.postgres_db,
                min_size=2,
                max_size=10,
            )
            logger.info("PostgreSQL connection pool created")

    async def close(self) -> None:
        """Close database connection pool.

        Should be called when shutting down the application.
        """
        if self.pool and self._pool_created_internally:
            await self.pool.close()
            logger.info("PostgreSQL connection pool closed")

    async def save_message(
        self,
        user_id: str,
        tenant_id: str,
        role: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> ConversationMessage:
        """Save a message to conversation history.

        Args:
            user_id: User identifier
            tenant_id: Tenant identifier
            role: Message role (user, assistant, system)
            content: Message content
            metadata: Optional metadata dictionary

        Returns:
            Created ConversationMessage

        Raises:
            RuntimeError: If store not initialized
            ValueError: If role is invalid
        """
        if self.pool is None:
            raise RuntimeError("ConversationStore not initialized. Call initialize() first.")

        # Validate role
        valid_roles = {"user", "assistant", "system"}
        if role not in valid_roles:
            raise ValueError(f"Invalid role: {role}. Must be one of {valid_roles}")

        # Create message
        message = ConversationMessage(
            user_id=user_id,
            tenant_id=tenant_id,
            role=role,
            content=content,
            metadata=metadata,
        )

        # Insert into database
        # Note: asyncpg handles JSONB columns automatically, pass dict directly
        async with self.pool.acquire() as conn:
            await conn.execute(
                """
                INSERT INTO conversations (id, user_id, tenant_id, role, content, metadata, created_at)
                VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7)
                """,
                message.id,
                message.user_id,
                message.tenant_id,
                message.role,
                message.content,
                json.dumps(message.metadata),  # Convert to JSON string for JSONB cast
                message.created_at,
            )

        logger.debug(
            f"Saved {role} message for user {user_id} in tenant {tenant_id} (id={message.id})"
        )

        return message

    async def get_conversation_history(
        self,
        user_id: str,
        tenant_id: str,
        limit: int = 20,
    ) -> List[ConversationMessage]:
        """Get conversation history for a user.

        Messages are returned in chronological order (oldest first) to
        maintain proper conversation flow.

        Args:
            user_id: User identifier
            tenant_id: Tenant identifier
            limit: Maximum number of messages to retrieve (default: 20)

        Returns:
            List of ConversationMessage in chronological order

        Raises:
            RuntimeError: If store not initialized
        """
        if self.pool is None:
            raise RuntimeError("ConversationStore not initialized. Call initialize() first.")

        async with self.pool.acquire() as conn:
            records = await conn.fetch(
                """
                SELECT id, user_id, tenant_id, role, content, metadata, created_at
                FROM conversations
                WHERE user_id = $1 AND tenant_id = $2
                ORDER BY created_at ASC
                LIMIT $3
                """,
                user_id,
                tenant_id,
                limit,
            )

        messages = [ConversationMessage.from_record(record) for record in records]

        logger.debug(
            f"Retrieved {len(messages)} messages for user {user_id} in tenant {tenant_id}"
        )

        return messages

    async def cleanup_old_conversations(self) -> int:
        """Delete conversations older than 7 days (privacy feature).

        This method should be called periodically to enforce the 7-day
        retention policy for privacy compliance.

        Returns:
            Number of messages deleted

        Raises:
            RuntimeError: If store not initialized
        """
        if self.pool is None:
            raise RuntimeError("ConversationStore not initialized. Call initialize() first.")

        async with self.pool.acquire() as conn:
            result = await conn.fetchval("SELECT delete_old_conversations()")

        deleted_count = int(result) if result is not None else 0

        logger.info(f"Cleaned up {deleted_count} old conversation messages (7-day retention)")

        return deleted_count

    async def delete_user_conversations(
        self,
        user_id: str,
        tenant_id: str,
    ) -> int:
        """Delete all conversation history for a user (privacy feature).

        This is a GDPR compliance feature allowing users to request
        deletion of their data.

        Args:
            user_id: User identifier
            tenant_id: Tenant identifier

        Returns:
            Number of messages deleted

        Raises:
            RuntimeError: If store not initialized
        """
        if self.pool is None:
            raise RuntimeError("ConversationStore not initialized. Call initialize() first.")

        async with self.pool.acquire() as conn:
            result = await conn.execute(
                """
                DELETE FROM conversations
                WHERE user_id = $1 AND tenant_id = $2
                """,
                user_id,
                tenant_id,
            )

        # Extract count from result string like "DELETE 5"
        deleted_count = int(result.split()[-1]) if result else 0

        logger.info(
            f"Deleted {deleted_count} messages for user {user_id} in tenant {tenant_id}"
        )

        return deleted_count

    async def get_message_count(
        self,
        user_id: str,
        tenant_id: str,
    ) -> int:
        """Get total message count for a user.

        Args:
            user_id: User identifier
            tenant_id: Tenant identifier

        Returns:
            Total number of messages

        Raises:
            RuntimeError: If store not initialized
        """
        if self.pool is None:
            raise RuntimeError("ConversationStore not initialized. Call initialize() first.")

        async with self.pool.acquire() as conn:
            count = await conn.fetchval(
                """
                SELECT COUNT(*)
                FROM conversations
                WHERE user_id = $1 AND tenant_id = $2
                """,
                user_id,
                tenant_id,
            )

        return count or 0

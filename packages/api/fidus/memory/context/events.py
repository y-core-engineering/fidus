"""Domain events for context and situation management.

This module defines domain events emitted during context extraction,
situation storage, and preference linking operations.
"""

from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, Field

from fidus.memory.context.models import ContextFactors


class DomainEvent(BaseModel):
    """Base class for all domain events."""

    event_id: str = Field(description="Unique event identifier")
    event_type: str = Field(description="Type of event")
    tenant_id: str = Field(description="Tenant ID")
    user_id: str = Field(description="User ID")
    timestamp: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        description="ISO format timestamp",
    )
    metadata: dict = Field(
        default_factory=dict,
        description="Additional event metadata",
    )


class ContextExtracted(DomainEvent):
    """Event emitted when context is successfully extracted from a message.

    This event is published after both LLM and system context extraction
    and merging are complete.
    """

    event_type: str = "context.extracted"
    context: ContextFactors = Field(description="Extracted and merged context")
    message: str = Field(description="Original user message")
    llm_confidence: float = Field(
        description="Confidence score from LLM extraction"
    )
    llm_factors_count: int = Field(
        description="Number of factors from LLM"
    )
    system_factors_count: int = Field(
        description="Number of factors from system"
    )


class SituationStored(DomainEvent):
    """Event emitted when a situation is successfully stored.

    This event is published after the situation is persisted in both
    Neo4j and Qdrant databases.
    """

    event_type: str = "situation.stored"
    situation_id: str = Field(description="Unique situation identifier")
    context: ContextFactors = Field(description="Situation context")
    embedding_dimension: int = Field(description="Dimension of embedding vector")


class PreferenceLinkedToSituation(DomainEvent):
    """Event emitted when a preference is linked to a situation.

    This event is published after the IN_SITUATION relationship is
    created in Neo4j.
    """

    event_type: str = "preference.linked_to_situation"
    preference_id: str = Field(description="Preference node ID")
    situation_id: str = Field(description="Situation node ID")


class SimilarSituationsFound(DomainEvent):
    """Event emitted when similar situations are found via search.

    This event is published after a successful similarity search in Qdrant.
    """

    event_type: str = "situations.similar_found"
    query_context: ContextFactors = Field(description="Query context")
    results_count: int = Field(description="Number of results found")
    top_score: Optional[float] = Field(
        default=None,
        description="Highest similarity score",
    )
    min_score_threshold: float = Field(
        description="Minimum score threshold used"
    )


class ContextExtractionFailed(DomainEvent):
    """Event emitted when context extraction fails.

    This event is published when LLM extraction encounters an error.
    """

    event_type: str = "context.extraction_failed"
    message: str = Field(description="User message that failed extraction")
    error_type: str = Field(description="Type of error")
    error_message: str = Field(description="Error message")
    retry_count: int = Field(
        default=0,
        description="Number of retries attempted",
    )


class EmbeddingGenerationFailed(DomainEvent):
    """Event emitted when embedding generation fails.

    This event is published when the embedding service encounters an error.
    """

    event_type: str = "embedding.generation_failed"
    context: ContextFactors = Field(description="Context that failed embedding")
    error_type: str = Field(description="Type of error")
    error_message: str = Field(description="Error message")
    retry_count: int = Field(
        default=0,
        description="Number of retries attempted",
    )


class SituationStorageFailed(DomainEvent):
    """Event emitted when situation storage fails.

    This event is published when storing in Neo4j or Qdrant fails.
    """

    event_type: str = "situation.storage_failed"
    context: ContextFactors = Field(description="Context that failed to store")
    database: str = Field(description="Database that failed (neo4j or qdrant)")
    error_type: str = Field(description="Type of error")
    error_message: str = Field(description="Error message")


class EventPublisher:
    """Publisher for domain events.

    This is a simple in-memory event publisher. In production, this would
    publish to a message broker (Redis, Kafka, etc.) for event-driven
    architecture.
    """

    def __init__(self) -> None:
        """Initialize the event publisher."""
        self._handlers: dict[str, list] = {}

    def subscribe(self, event_type: str, handler) -> None:
        """Subscribe a handler to an event type.

        Args:
            event_type: Type of event to subscribe to
            handler: Callable to handle the event
        """
        if event_type not in self._handlers:
            self._handlers[event_type] = []
        self._handlers[event_type].append(handler)

    def publish(self, event: DomainEvent) -> None:
        """Publish an event to all subscribers.

        Args:
            event: Domain event to publish
        """
        handlers = self._handlers.get(event.event_type, [])
        for handler in handlers:
            try:
                handler(event)
            except Exception as e:
                # Log but don't fail on handler errors
                print(f"Event handler failed: {e}")

    async def publish_async(self, event: DomainEvent) -> None:
        """Publish an event asynchronously.

        Args:
            event: Domain event to publish
        """
        handlers = self._handlers.get(event.event_type, [])
        for handler in handlers:
            try:
                if hasattr(handler, "__call__"):
                    result = handler(event)
                    # Await if it's a coroutine
                    if hasattr(result, "__await__"):
                        await result
            except Exception as e:
                # Log but don't fail on handler errors
                print(f"Async event handler failed: {e}")


# Global event publisher instance
event_publisher = EventPublisher()

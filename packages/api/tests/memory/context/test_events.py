"""Tests for domain events."""

import uuid

import pytest

from fidus.memory.context.events import (
    ContextExtracted,
    ContextExtractionFailed,
    EmbeddingGenerationFailed,
    EventPublisher,
    PreferenceLinkedToSituation,
    SimilarSituationsFound,
    SituationStored,
    SituationStorageFailed,
)
from fidus.memory.context.models import ContextFactors


class TestDomainEvents:
    """Tests for domain event models."""

    def test_context_extracted_event(self) -> None:
        """Should create ContextExtracted event with all fields."""
        context = ContextFactors(
            factors={"time_of_day": "morning", "mood": "energetic"}
        )

        event = ContextExtracted(
            event_id=str(uuid.uuid4()),
            tenant_id="tenant-1",
            user_id="user-1",
            context=context,
            message="I feel great this morning",
            llm_confidence=0.9,
            llm_factors_count=1,
            system_factors_count=1,
        )

        assert event.event_type == "context.extracted"
        assert event.context == context
        assert event.llm_confidence == 0.9
        assert event.llm_factors_count == 1
        assert event.system_factors_count == 1
        assert event.timestamp is not None

    def test_situation_stored_event(self) -> None:
        """Should create SituationStored event."""
        context = ContextFactors(factors={"time_of_day": "morning"})

        event = SituationStored(
            event_id=str(uuid.uuid4()),
            tenant_id="tenant-1",
            user_id="user-1",
            situation_id="sit-123",
            context=context,
            embedding_dimension=768,
        )

        assert event.event_type == "situation.stored"
        assert event.situation_id == "sit-123"
        assert event.embedding_dimension == 768

    def test_preference_linked_to_situation_event(self) -> None:
        """Should create PreferenceLinkedToSituation event."""
        event = PreferenceLinkedToSituation(
            event_id=str(uuid.uuid4()),
            tenant_id="tenant-1",
            user_id="user-1",
            preference_id="pref-123",
            situation_id="sit-456",
        )

        assert event.event_type == "preference.linked_to_situation"
        assert event.preference_id == "pref-123"
        assert event.situation_id == "sit-456"

    def test_similar_situations_found_event(self) -> None:
        """Should create SimilarSituationsFound event."""
        query_context = ContextFactors(factors={"time_of_day": "morning"})

        event = SimilarSituationsFound(
            event_id=str(uuid.uuid4()),
            tenant_id="tenant-1",
            user_id="user-1",
            query_context=query_context,
            results_count=3,
            top_score=0.95,
            min_score_threshold=0.7,
        )

        assert event.event_type == "situations.similar_found"
        assert event.results_count == 3
        assert event.top_score == 0.95
        assert event.min_score_threshold == 0.7

    def test_context_extraction_failed_event(self) -> None:
        """Should create ContextExtractionFailed event."""
        event = ContextExtractionFailed(
            event_id=str(uuid.uuid4()),
            tenant_id="tenant-1",
            user_id="user-1",
            message="Test message",
            error_type="ValueError",
            error_message="Invalid JSON response",
            retry_count=2,
        )

        assert event.event_type == "context.extraction_failed"
        assert event.error_type == "ValueError"
        assert event.retry_count == 2

    def test_embedding_generation_failed_event(self) -> None:
        """Should create EmbeddingGenerationFailed event."""
        context = ContextFactors(factors={"mood": "happy"})

        event = EmbeddingGenerationFailed(
            event_id=str(uuid.uuid4()),
            tenant_id="tenant-1",
            user_id="user-1",
            context=context,
            error_type="ConnectionError",
            error_message="API is down",
            retry_count=1,
        )

        assert event.event_type == "embedding.generation_failed"
        assert event.error_type == "ConnectionError"

    def test_situation_storage_failed_event(self) -> None:
        """Should create SituationStorageFailed event."""
        context = ContextFactors(factors={"mood": "happy"})

        event = SituationStorageFailed(
            event_id=str(uuid.uuid4()),
            tenant_id="tenant-1",
            user_id="user-1",
            context=context,
            database="qdrant",
            error_type="ConnectionError",
            error_message="Qdrant is down",
        )

        assert event.event_type == "situation.storage_failed"
        assert event.database == "qdrant"


class TestEventPublisher:
    """Tests for EventPublisher."""

    @pytest.fixture
    def publisher(self) -> EventPublisher:
        """Create event publisher for testing."""
        return EventPublisher()

    def test_subscribe_and_publish(self, publisher: EventPublisher) -> None:
        """Should publish events to subscribers."""
        received_events = []

        def handler(event):
            received_events.append(event)

        # Subscribe
        publisher.subscribe("context.extracted", handler)

        # Publish event
        event = ContextExtracted(
            event_id=str(uuid.uuid4()),
            tenant_id="tenant-1",
            user_id="user-1",
            context=ContextFactors(factors={"mood": "happy"}),
            message="Test",
            llm_confidence=0.9,
            llm_factors_count=1,
            system_factors_count=0,
        )

        publisher.publish(event)

        # Should receive event
        assert len(received_events) == 1
        assert received_events[0] == event

    def test_multiple_subscribers(self, publisher: EventPublisher) -> None:
        """Should publish to multiple subscribers."""
        received_1 = []
        received_2 = []

        def handler_1(event):
            received_1.append(event)

        def handler_2(event):
            received_2.append(event)

        # Subscribe both handlers
        publisher.subscribe("situation.stored", handler_1)
        publisher.subscribe("situation.stored", handler_2)

        # Publish event
        event = SituationStored(
            event_id=str(uuid.uuid4()),
            tenant_id="tenant-1",
            user_id="user-1",
            situation_id="sit-123",
            context=ContextFactors(factors={}),
            embedding_dimension=768,
        )

        publisher.publish(event)

        # Both should receive
        assert len(received_1) == 1
        assert len(received_2) == 1

    def test_no_subscribers(self, publisher: EventPublisher) -> None:
        """Should handle publishing with no subscribers."""
        event = ContextExtracted(
            event_id=str(uuid.uuid4()),
            tenant_id="tenant-1",
            user_id="user-1",
            context=ContextFactors(factors={}),
            message="Test",
            llm_confidence=0.5,
            llm_factors_count=0,
            system_factors_count=0,
        )

        # Should not raise exception
        publisher.publish(event)

    def test_handler_exception(self, publisher: EventPublisher) -> None:
        """Should continue publishing even if handler fails."""
        received = []

        def bad_handler(event):
            raise Exception("Handler failed")

        def good_handler(event):
            received.append(event)

        # Subscribe both handlers
        publisher.subscribe("context.extracted", bad_handler)
        publisher.subscribe("context.extracted", good_handler)

        # Publish event
        event = ContextExtracted(
            event_id=str(uuid.uuid4()),
            tenant_id="tenant-1",
            user_id="user-1",
            context=ContextFactors(factors={}),
            message="Test",
            llm_confidence=0.5,
            llm_factors_count=0,
            system_factors_count=0,
        )

        publisher.publish(event)

        # Good handler should still receive event
        assert len(received) == 1

    @pytest.mark.asyncio
    async def test_publish_async(self, publisher: EventPublisher) -> None:
        """Should publish events asynchronously."""
        received_events = []

        async def async_handler(event):
            received_events.append(event)

        # Subscribe
        publisher.subscribe("context.extracted", async_handler)

        # Publish event
        event = ContextExtracted(
            event_id=str(uuid.uuid4()),
            tenant_id="tenant-1",
            user_id="user-1",
            context=ContextFactors(factors={"mood": "happy"}),
            message="Test",
            llm_confidence=0.9,
            llm_factors_count=1,
            system_factors_count=0,
        )

        await publisher.publish_async(event)

        # Should receive event
        assert len(received_events) == 1
        assert received_events[0] == event

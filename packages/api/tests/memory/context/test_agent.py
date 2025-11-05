"""Tests for context-aware agent."""

from unittest.mock import AsyncMock, Mock

import pytest

from fidus.memory.context.agent import ContextAwareAgent
from fidus.memory.context.models import (
    ContextExtractionResult,
    ContextFactors,
    Situation,
)


class TestContextAwareAgent:
    """Tests for ContextAwareAgent."""

    @pytest.fixture
    def mock_extractor(self) -> Mock:
        """Create mock dynamic context extractor."""
        return Mock()

    @pytest.fixture
    def mock_system_provider(self) -> Mock:
        """Create mock system context provider."""
        return Mock()

    @pytest.fixture
    def mock_merger(self) -> Mock:
        """Create mock context merger."""
        return Mock()

    @pytest.fixture
    def mock_embedding_service(self) -> Mock:
        """Create mock embedding service."""
        return Mock()

    @pytest.fixture
    def mock_storage(self) -> Mock:
        """Create mock context storage."""
        mock = Mock()
        mock.close = AsyncMock()
        return mock

    @pytest.fixture
    def mock_retrieval(self) -> Mock:
        """Create mock context retrieval."""
        return Mock()

    @pytest.fixture
    def agent(
        self,
        mock_extractor: Mock,
        mock_system_provider: Mock,
        mock_merger: Mock,
        mock_embedding_service: Mock,
        mock_storage: Mock,
        mock_retrieval: Mock,
    ) -> ContextAwareAgent:
        """Create context-aware agent with mocked dependencies."""
        return ContextAwareAgent(
            extractor=mock_extractor,
            system_provider=mock_system_provider,
            merger=mock_merger,
            embedding_service=mock_embedding_service,
            storage=mock_storage,
            retrieval=mock_retrieval,
        )

    @pytest.mark.asyncio
    async def test_extract_and_merge_context(
        self,
        agent: ContextAwareAgent,
        mock_extractor: Mock,
        mock_system_provider: Mock,
        mock_merger: Mock,
    ) -> None:
        """Should extract LLM and system context and merge them."""
        # Mock LLM extraction
        llm_context = ContextFactors(factors={"mood": "energetic"})
        mock_extractor.extract = AsyncMock(
            return_value=ContextExtractionResult(
                context=llm_context,
                confidence=0.9,
                explanation="User mentions energy",
            )
        )

        # Mock system context
        system_context = ContextFactors(
            factors={"time_of_day": "morning", "day_of_week": "monday"}
        )
        mock_system_provider.get_context.return_value = system_context

        # Mock merger
        merged_context = ContextFactors(
            factors={
                "mood": "energetic",
                "time_of_day": "morning",
                "day_of_week": "monday",
            }
        )
        mock_merger.merge.return_value = merged_context

        # Extract and merge
        result = await agent.extract_and_merge_context(
            message="I feel energetic",
            tenant_id="tenant-1",
            user_id="user-1",
        )

        # Should call extractor
        mock_extractor.extract.assert_called_once_with(
            message="I feel energetic",
            tenant_id="tenant-1",
            user_id="user-1",
        )

        # Should call system provider
        mock_system_provider.get_context.assert_called_once_with(
            tenant_id="tenant-1",
            user_id="user-1",
        )

        # Should call merger
        mock_merger.merge.assert_called_once_with(
            llm_context=llm_context,
            system_context=system_context,
            tenant_id="tenant-1",
            user_id="user-1",
        )

        # Should return merged context
        assert result == merged_context

    @pytest.mark.asyncio
    async def test_record_preference_with_context(
        self,
        agent: ContextAwareAgent,
        mock_extractor: Mock,
        mock_system_provider: Mock,
        mock_merger: Mock,
        mock_embedding_service: Mock,
        mock_storage: Mock,
    ) -> None:
        """Should record preference with full context workflow."""
        # Mock context extraction
        merged_context = ContextFactors(
            factors={"time_of_day": "morning", "mood": "energetic"}
        )
        mock_extractor.extract = AsyncMock(
            return_value=ContextExtractionResult(
                context=ContextFactors(factors={"mood": "energetic"}),
                confidence=0.9,
            )
        )
        mock_system_provider.get_context.return_value = ContextFactors(
            factors={"time_of_day": "morning"}
        )
        mock_merger.merge.return_value = merged_context

        # Mock embedding generation
        embedding = [0.1] * 768
        mock_embedding_service.generate_embedding = AsyncMock(
            return_value=embedding
        )

        # Mock storage
        situation = Situation(
            id="sit-123",
            tenant_id="tenant-1",
            user_id="user-1",
            context=merged_context,
            embedding=embedding,
        )
        mock_storage.store_situation = AsyncMock(return_value=situation)
        mock_storage.link_preference_to_situation = AsyncMock()

        # Record preference
        result = await agent.record_preference_with_context(
            message="I want a cappuccino",
            preference_id="pref-123",
            tenant_id="tenant-1",
            user_id="user-1",
        )

        # Should generate embedding
        mock_embedding_service.generate_embedding.assert_called_once_with(
            context=merged_context,
            tenant_id="tenant-1",
            user_id="user-1",
        )

        # Should store situation
        mock_storage.store_situation.assert_called_once_with(
            context=merged_context,
            embedding=embedding,
            tenant_id="tenant-1",
            user_id="user-1",
        )

        # Should link preference to situation
        mock_storage.link_preference_to_situation.assert_called_once_with(
            preference_id="pref-123",
            situation_id="sit-123",
            tenant_id="tenant-1",
        )

        # Should return situation
        assert result == situation

    @pytest.mark.asyncio
    async def test_record_preference_with_context_failure(
        self,
        agent: ContextAwareAgent,
        mock_extractor: Mock,
        mock_system_provider: Mock,
        mock_merger: Mock,
        mock_embedding_service: Mock,
    ) -> None:
        """Should handle failures during preference recording."""
        # Mock context extraction
        mock_extractor.extract = AsyncMock(
            return_value=ContextExtractionResult(
                context=ContextFactors(factors={"mood": "happy"}),
                confidence=0.9,
            )
        )
        mock_system_provider.get_context.return_value = ContextFactors(
            factors={"time_of_day": "morning"}
        )
        mock_merger.merge.return_value = ContextFactors(
            factors={"mood": "happy", "time_of_day": "morning"}
        )

        # Mock embedding failure
        mock_embedding_service.generate_embedding = AsyncMock(
            side_effect=Exception("Embedding failed")
        )

        # Should raise exception
        with pytest.raises(Exception) as exc_info:
            await agent.record_preference_with_context(
                message="I like coffee",
                preference_id="pref-123",
                tenant_id="tenant-1",
                user_id="user-1",
            )

        assert "Embedding failed" in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_get_relevant_preferences(
        self,
        agent: ContextAwareAgent,
        mock_extractor: Mock,
        mock_system_provider: Mock,
        mock_merger: Mock,
        mock_embedding_service: Mock,
        mock_retrieval: Mock,
    ) -> None:
        """Should retrieve relevant preferences based on context."""
        # Mock context extraction
        merged_context = ContextFactors(
            factors={"time_of_day": "morning", "location": "home"}
        )
        mock_extractor.extract = AsyncMock(
            return_value=ContextExtractionResult(
                context=ContextFactors(factors={"location": "home"}),
                confidence=0.85,
            )
        )
        mock_system_provider.get_context.return_value = ContextFactors(
            factors={"time_of_day": "morning"}
        )
        mock_merger.merge.return_value = merged_context

        # Mock embedding generation
        query_embedding = [0.15] * 768
        mock_embedding_service.generate_embedding = AsyncMock(
            return_value=query_embedding
        )

        # Mock retrieval
        similar_situations = [
            Situation(
                id="sit-1",
                tenant_id="tenant-1",
                user_id="user-1",
                context=ContextFactors(factors={"time_of_day": "morning"}),
            ),
            Situation(
                id="sit-2",
                tenant_id="tenant-1",
                user_id="user-1",
                context=ContextFactors(factors={"location": "home"}),
            ),
        ]
        mock_retrieval.find_similar_situations.return_value = similar_situations

        # Get relevant preferences
        result = await agent.get_relevant_preferences(
            message="Good morning",
            tenant_id="tenant-1",
            user_id="user-1",
            top_k=5,
            min_score=0.7,
        )

        # Should generate embedding
        mock_embedding_service.generate_embedding.assert_called_once_with(
            context=merged_context,
            tenant_id="tenant-1",
            user_id="user-1",
        )

        # Should search for similar situations
        mock_retrieval.find_similar_situations.assert_called_once_with(
            query_embedding=query_embedding,
            user_id="user-1",
            tenant_id="tenant-1",
            top_k=5,
            min_score=0.7,
        )

        # Should return similar situations
        assert result == similar_situations
        assert len(result) == 2

    @pytest.mark.asyncio
    async def test_get_relevant_preferences_empty_results(
        self,
        agent: ContextAwareAgent,
        mock_extractor: Mock,
        mock_system_provider: Mock,
        mock_merger: Mock,
        mock_embedding_service: Mock,
        mock_retrieval: Mock,
    ) -> None:
        """Should handle empty retrieval results."""
        # Mock context extraction
        mock_extractor.extract = AsyncMock(
            return_value=ContextExtractionResult(
                context=ContextFactors(factors={}),
                confidence=0.1,
            )
        )
        mock_system_provider.get_context.return_value = ContextFactors(
            factors={"time_of_day": "night"}
        )
        mock_merger.merge.return_value = ContextFactors(
            factors={"time_of_day": "night"}
        )

        # Mock embedding
        mock_embedding_service.generate_embedding = AsyncMock(
            return_value=[0.1] * 768
        )

        # Mock empty retrieval
        mock_retrieval.find_similar_situations.return_value = []

        # Get relevant preferences
        result = await agent.get_relevant_preferences(
            message="Hello",
            tenant_id="tenant-1",
            user_id="user-1",
        )

        assert result == []

    @pytest.mark.asyncio
    async def test_get_relevant_preferences_failure(
        self,
        agent: ContextAwareAgent,
        mock_extractor: Mock,
        mock_system_provider: Mock,
        mock_merger: Mock,
        mock_embedding_service: Mock,
    ) -> None:
        """Should handle failures during preference retrieval."""
        # Mock context extraction
        mock_extractor.extract = AsyncMock(
            return_value=ContextExtractionResult(
                context=ContextFactors(factors={"mood": "happy"}),
                confidence=0.9,
            )
        )
        mock_system_provider.get_context.return_value = ContextFactors(
            factors={"time_of_day": "morning"}
        )
        mock_merger.merge.return_value = ContextFactors(
            factors={"mood": "happy", "time_of_day": "morning"}
        )

        # Mock embedding failure
        mock_embedding_service.generate_embedding = AsyncMock(
            side_effect=Exception("Embedding service is down")
        )

        # Should raise exception
        with pytest.raises(Exception) as exc_info:
            await agent.get_relevant_preferences(
                message="Good morning",
                tenant_id="tenant-1",
                user_id="user-1",
            )

        assert "Embedding service is down" in str(exc_info.value)

    def test_format_context(
        self,
        agent: ContextAwareAgent,
        mock_merger: Mock,
    ) -> None:
        """Should format context using merger."""
        context = ContextFactors(
            factors={"time_of_day": "morning", "mood": "energetic"}
        )

        mock_merger.format_for_display.return_value = (
            "mood: energetic, time_of_day: morning"
        )

        result = agent.format_context(context)

        mock_merger.format_for_display.assert_called_once_with(context)
        assert result == "mood: energetic, time_of_day: morning"

    @pytest.mark.asyncio
    async def test_close_connections(
        self,
        agent: ContextAwareAgent,
        mock_storage: Mock,
    ) -> None:
        """Should close storage connections."""
        await agent.close()

        mock_storage.close.assert_called_once()

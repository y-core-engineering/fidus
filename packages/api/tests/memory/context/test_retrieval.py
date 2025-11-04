"""Tests for context retrieval service."""

from unittest.mock import Mock

import pytest

from fidus.memory.context.models import ContextFactors, Situation
from fidus.memory.context.retrieval import ContextRetrievalService


class TestContextRetrievalService:
    """Tests for ContextRetrievalService."""

    @pytest.fixture
    def mock_qdrant_client(self) -> Mock:
        """Create mock Qdrant client."""
        return Mock()

    @pytest.fixture
    def retrieval(self, mock_qdrant_client: Mock) -> ContextRetrievalService:
        """Create retrieval service with mocked client."""
        return ContextRetrievalService(qdrant_client=mock_qdrant_client)

    def test_find_similar_situations(
        self,
        retrieval: ContextRetrievalService,
        mock_qdrant_client: Mock,
    ) -> None:
        """Should find similar situations with proper filtering."""
        # Mock Qdrant search results
        mock_point_1 = Mock()
        mock_point_1.id = "sit-123"
        mock_point_1.score = 0.95
        mock_point_1.vector = [0.1] * 768
        mock_point_1.payload = {
            "tenant_id": "tenant-1",
            "user_id": "user-1",
            "factors": {"time_of_day": "morning", "mood": "energetic"},
            "created_at": "2024-01-01T10:00:00",
            "updated_at": "2024-01-01T10:00:00",
        }

        mock_point_2 = Mock()
        mock_point_2.id = "sit-456"
        mock_point_2.score = 0.82
        mock_point_2.vector = [0.2] * 768
        mock_point_2.payload = {
            "tenant_id": "tenant-1",
            "user_id": "user-1",
            "factors": {"time_of_day": "morning", "location": "home"},
            "created_at": "2024-01-02T09:00:00",
            "updated_at": "2024-01-02T09:00:00",
        }

        mock_qdrant_client.search.return_value = [mock_point_1, mock_point_2]

        # Search for similar situations
        query_embedding = [0.15] * 768
        situations = retrieval.find_similar_situations(
            query_embedding=query_embedding,
            user_id="user-1",
            tenant_id="tenant-1",
            top_k=5,
            min_score=0.7,
        )

        # Should call Qdrant search with proper parameters
        mock_qdrant_client.search.assert_called_once()
        call_args = mock_qdrant_client.search.call_args

        assert call_args.kwargs["collection_name"] == "situations"
        assert call_args.kwargs["query_vector"] == query_embedding
        assert call_args.kwargs["limit"] == 5
        assert call_args.kwargs["score_threshold"] == 0.7
        assert call_args.kwargs["with_payload"] is True
        assert call_args.kwargs["with_vectors"] is True

        # Should have filter for tenant_id and user_id
        search_filter = call_args.kwargs["query_filter"]
        assert search_filter is not None
        assert len(search_filter.must) == 2

        # Should return Situation objects
        assert len(situations) == 2
        assert isinstance(situations[0], Situation)
        assert isinstance(situations[1], Situation)

        # First situation
        assert situations[0].id == "sit-123"
        assert situations[0].tenant_id == "tenant-1"
        assert situations[0].user_id == "user-1"
        assert situations[0].context.factors["time_of_day"] == "morning"
        assert situations[0].context.factors["mood"] == "energetic"
        assert situations[0].embedding == [0.1] * 768
        assert hasattr(situations[0], "_similarity_score")
        assert situations[0]._similarity_score == 0.95

        # Second situation
        assert situations[1].id == "sit-456"
        assert situations[1].context.factors["time_of_day"] == "morning"
        assert situations[1].context.factors["location"] == "home"
        assert situations[1]._similarity_score == 0.82

    def test_find_similar_situations_empty_results(
        self,
        retrieval: ContextRetrievalService,
        mock_qdrant_client: Mock,
    ) -> None:
        """Should handle empty search results."""
        mock_qdrant_client.search.return_value = []

        query_embedding = [0.1] * 768
        situations = retrieval.find_similar_situations(
            query_embedding=query_embedding,
            user_id="user-1",
            tenant_id="tenant-1",
        )

        assert situations == []

    def test_find_similar_situations_with_invalid_point(
        self,
        retrieval: ContextRetrievalService,
        mock_qdrant_client: Mock,
    ) -> None:
        """Should skip invalid points and continue."""
        # Valid point
        mock_point_1 = Mock()
        mock_point_1.id = "sit-123"
        mock_point_1.score = 0.95
        mock_point_1.vector = [0.1] * 768
        mock_point_1.payload = {
            "tenant_id": "tenant-1",
            "user_id": "user-1",
            "factors": {"time_of_day": "morning"},
            "created_at": "2024-01-01T10:00:00",
            "updated_at": "2024-01-01T10:00:00",
        }

        # Invalid point (missing required fields)
        mock_point_2 = Mock()
        mock_point_2.id = "sit-456"
        mock_point_2.score = 0.82
        mock_point_2.vector = None
        mock_point_2.payload = {}  # Missing required fields

        mock_qdrant_client.search.return_value = [mock_point_1, mock_point_2]

        query_embedding = [0.15] * 768
        situations = retrieval.find_similar_situations(
            query_embedding=query_embedding,
            user_id="user-1",
            tenant_id="tenant-1",
        )

        # Should only return valid situation
        assert len(situations) == 1
        assert situations[0].id == "sit-123"

    def test_find_similar_situations_custom_parameters(
        self,
        retrieval: ContextRetrievalService,
        mock_qdrant_client: Mock,
    ) -> None:
        """Should respect custom top_k and min_score parameters."""
        mock_qdrant_client.search.return_value = []

        query_embedding = [0.1] * 768
        retrieval.find_similar_situations(
            query_embedding=query_embedding,
            user_id="user-1",
            tenant_id="tenant-1",
            top_k=10,
            min_score=0.85,
        )

        call_args = mock_qdrant_client.search.call_args
        assert call_args.kwargs["limit"] == 10
        assert call_args.kwargs["score_threshold"] == 0.85

    def test_find_similar_situations_qdrant_failure(
        self,
        retrieval: ContextRetrievalService,
        mock_qdrant_client: Mock,
    ) -> None:
        """Should raise exception on Qdrant failure."""
        mock_qdrant_client.search.side_effect = Exception("Qdrant is down")

        query_embedding = [0.1] * 768

        with pytest.raises(Exception) as exc_info:
            retrieval.find_similar_situations(
                query_embedding=query_embedding,
                user_id="user-1",
                tenant_id="tenant-1",
            )

        assert "Qdrant is down" in str(exc_info.value)

    def test_find_similar_situations_no_vectors(
        self,
        retrieval: ContextRetrievalService,
        mock_qdrant_client: Mock,
    ) -> None:
        """Should handle points without vectors."""
        mock_point = Mock()
        mock_point.id = "sit-123"
        mock_point.score = 0.95
        mock_point.vector = None  # No vector returned
        mock_point.payload = {
            "tenant_id": "tenant-1",
            "user_id": "user-1",
            "factors": {"time_of_day": "morning"},
            "created_at": "2024-01-01T10:00:00",
            "updated_at": "2024-01-01T10:00:00",
        }

        mock_qdrant_client.search.return_value = [mock_point]

        query_embedding = [0.1] * 768
        situations = retrieval.find_similar_situations(
            query_embedding=query_embedding,
            user_id="user-1",
            tenant_id="tenant-1",
        )

        assert len(situations) == 1
        assert situations[0].embedding is None

    def test_get_situation_preferences_placeholder(
        self, retrieval: ContextRetrievalService
    ) -> None:
        """Should return empty list (placeholder implementation)."""
        preferences = retrieval.get_situation_preferences(
            situation_id="sit-123",
            tenant_id="tenant-1",
        )

        assert preferences == []

    def test_convert_to_situations_preserves_order(
        self,
        retrieval: ContextRetrievalService,
        mock_qdrant_client: Mock,
    ) -> None:
        """Should preserve score-based ordering from Qdrant."""
        # Create points in descending score order
        points = []
        for i, score in enumerate([0.95, 0.88, 0.75]):
            point = Mock()
            point.id = f"sit-{i}"
            point.score = score
            point.vector = [0.1] * 768
            point.payload = {
                "tenant_id": "tenant-1",
                "user_id": "user-1",
                "factors": {"score_index": str(i)},
                "created_at": "2024-01-01T10:00:00",
                "updated_at": "2024-01-01T10:00:00",
            }
            points.append(point)

        mock_qdrant_client.search.return_value = points

        query_embedding = [0.1] * 768
        situations = retrieval.find_similar_situations(
            query_embedding=query_embedding,
            user_id="user-1",
            tenant_id="tenant-1",
        )

        # Should maintain order
        assert len(situations) == 3
        assert situations[0]._similarity_score == 0.95
        assert situations[1]._similarity_score == 0.88
        assert situations[2]._similarity_score == 0.75

"""Tests for embedding service."""

import math
from unittest.mock import Mock, patch

import pytest

from fidus.memory.context.embedding_service import EmbeddingService
from fidus.memory.context.models import ContextFactors


class TestEmbeddingService:
    """Tests for EmbeddingService."""

    @pytest.fixture
    def service(self) -> EmbeddingService:
        """Create embedding service instance for testing."""
        # Use ollama model since that's what config defaults to
        return EmbeddingService(model="ollama/nomic-embed-text")

    def test_context_to_text(self, service: EmbeddingService) -> None:
        """Should convert context factors to text representation."""
        context = ContextFactors(
            factors={
                "time_of_day": "morning",
                "mood": "energetic",
                "location": "gym",
            }
        )

        text = service._context_to_text(context)

        # Should be sorted alphabetically
        assert text == "location: gym, mood: energetic, time_of_day: morning"

    def test_context_to_text_empty(self, service: EmbeddingService) -> None:
        """Should handle empty context."""
        context = ContextFactors(factors={})

        text = service._context_to_text(context)

        assert text == ""

    def test_context_to_text_single_factor(self, service: EmbeddingService) -> None:
        """Should handle single factor."""
        context = ContextFactors(factors={"mood": "happy"})

        text = service._context_to_text(context)

        assert text == "mood: happy"

    @patch("fidus.memory.context.embedding_service.embedding")
    def test_generate_embedding_sync(
        self, mock_embedding: Mock, service: EmbeddingService
    ) -> None:
        """Should generate embedding vector for context."""
        # Mock embedding response (768 dimensions for nomic-embed-text)
        mock_embedding.return_value = Mock(
            data=[{"embedding": [0.1] * 768}]
        )

        context = ContextFactors(
            factors={
                "time_of_day": "morning",
                "mood": "energetic",
            }
        )

        embedding_vector = service.generate_embedding_sync(
            context=context,
            tenant_id="tenant-1",
            user_id="user-1",
        )

        # Should call embedding API
        mock_embedding.assert_called_once()
        call_args = mock_embedding.call_args

        assert call_args.kwargs["model"] == "ollama/nomic-embed-text"
        assert call_args.kwargs["input"] == [
            "mood: energetic, time_of_day: morning"
        ]

        # Should return embedding vector
        assert len(embedding_vector) == 768
        assert all(v == 0.1 for v in embedding_vector)

    @patch("fidus.memory.context.embedding_service.embedding")
    def test_generate_embedding_empty_context(
        self, mock_embedding: Mock, service: EmbeddingService
    ) -> None:
        """Should return zero vector for empty context."""
        context = ContextFactors(factors={})

        embedding_vector = service.generate_embedding_sync(
            context=context,
            tenant_id="tenant-1",
            user_id="user-1",
        )

        # Should NOT call embedding API
        mock_embedding.assert_not_called()

        # Should return zero vector (768 for nomic-embed-text)
        assert len(embedding_vector) == 768
        assert all(v == 0.0 for v in embedding_vector)

    @patch("fidus.memory.context.embedding_service.embedding")
    def test_generate_embedding_dimension_validation(
        self, mock_embedding: Mock, service: EmbeddingService
    ) -> None:
        """Should validate embedding dimensions."""
        # Mock embedding with wrong dimensions (1536 instead of 768)
        mock_embedding.return_value = Mock(
            data=[{"embedding": [0.1] * 1536}]  # Wrong dimension
        )

        context = ContextFactors(factors={"mood": "happy"})

        with pytest.raises(ValueError) as exc_info:
            service.generate_embedding_sync(
                context=context,
                tenant_id="tenant-1",
                user_id="user-1",
            )

        assert "dimension mismatch" in str(exc_info.value).lower()
        assert "expected 768" in str(exc_info.value)
        assert "got 1536" in str(exc_info.value)

    @patch("fidus.memory.context.embedding_service.embedding")
    def test_generate_embedding_api_failure(
        self, mock_embedding: Mock, service: EmbeddingService
    ) -> None:
        """Should handle embedding API failures."""
        # Mock API failure
        mock_embedding.side_effect = Exception("API is down")

        context = ContextFactors(factors={"mood": "happy"})

        with pytest.raises(Exception) as exc_info:
            service.generate_embedding_sync(
                context=context,
                tenant_id="tenant-1",
                user_id="user-1",
            )

        assert "API is down" in str(exc_info.value)

    def test_calculate_similarity_identical(
        self, service: EmbeddingService
    ) -> None:
        """Should return 1.0 for identical embeddings."""
        embedding1 = [0.1, 0.2, 0.3, 0.4]
        embedding2 = [0.1, 0.2, 0.3, 0.4]

        similarity = service.calculate_similarity(embedding1, embedding2)

        assert similarity == pytest.approx(1.0, abs=0.001)

    def test_calculate_similarity_orthogonal(
        self, service: EmbeddingService
    ) -> None:
        """Should return 0.0 for orthogonal embeddings."""
        embedding1 = [1.0, 0.0, 0.0, 0.0]
        embedding2 = [0.0, 1.0, 0.0, 0.0]

        similarity = service.calculate_similarity(embedding1, embedding2)

        assert similarity == pytest.approx(0.0, abs=0.001)

    def test_calculate_similarity_partial_overlap(
        self, service: EmbeddingService
    ) -> None:
        """Should return value between 0 and 1 for partial overlap."""
        embedding1 = [1.0, 1.0, 0.0, 0.0]
        embedding2 = [1.0, 0.0, 1.0, 0.0]

        similarity = service.calculate_similarity(embedding1, embedding2)

        # Cosine similarity for these vectors: 0.5
        assert 0.4 < similarity < 0.6
        assert similarity == pytest.approx(0.5, abs=0.001)

    def test_calculate_similarity_dimension_mismatch(
        self, service: EmbeddingService
    ) -> None:
        """Should raise error for dimension mismatch."""
        embedding1 = [0.1, 0.2, 0.3]
        embedding2 = [0.1, 0.2]  # Different dimension

        with pytest.raises(ValueError) as exc_info:
            service.calculate_similarity(embedding1, embedding2)

        assert "dimension mismatch" in str(exc_info.value).lower()

    def test_calculate_similarity_zero_vector(
        self, service: EmbeddingService
    ) -> None:
        """Should handle zero vectors gracefully."""
        embedding1 = [0.0, 0.0, 0.0, 0.0]
        embedding2 = [0.1, 0.2, 0.3, 0.4]

        similarity = service.calculate_similarity(embedding1, embedding2)

        assert similarity == 0.0

    def test_calculate_similarity_both_zero(
        self, service: EmbeddingService
    ) -> None:
        """Should handle both zero vectors."""
        embedding1 = [0.0, 0.0, 0.0, 0.0]
        embedding2 = [0.0, 0.0, 0.0, 0.0]

        similarity = service.calculate_similarity(embedding1, embedding2)

        assert similarity == 0.0

    def test_calculate_similarity_negative_values(
        self, service: EmbeddingService
    ) -> None:
        """Should handle negative values in embeddings."""
        embedding1 = [1.0, -1.0, 0.5, -0.5]
        embedding2 = [1.0, -1.0, 0.5, -0.5]

        similarity = service.calculate_similarity(embedding1, embedding2)

        assert similarity == pytest.approx(1.0, abs=0.001)

    def test_calculate_similarity_opposite_vectors(
        self, service: EmbeddingService
    ) -> None:
        """Should return 0.0 for opposite vectors (clamped)."""
        embedding1 = [1.0, 1.0, 1.0, 1.0]
        embedding2 = [-1.0, -1.0, -1.0, -1.0]

        similarity = service.calculate_similarity(embedding1, embedding2)

        # Cosine similarity would be -1.0, but we clamp to [0, 1]
        assert similarity == 0.0

    @patch("fidus.memory.context.embedding_service.embedding")
    def test_expected_dimension_from_config(
        self, mock_embedding: Mock
    ) -> None:
        """Should use expected dimension from config."""
        # Test with different model
        service_768 = EmbeddingService(model="ollama/nomic-embed-text")

        assert service_768.expected_dimension == 768

        # Mock embedding response with correct dimension for this model
        mock_embedding.return_value = Mock(
            data=[{"embedding": [0.1] * 768}]
        )

        context = ContextFactors(factors={"mood": "happy"})

        embedding_vector = service_768.generate_embedding_sync(
            context=context,
            tenant_id="tenant-1",
            user_id="user-1",
        )

        assert len(embedding_vector) == 768

    def test_similarity_calculation_mathematical_properties(
        self, service: EmbeddingService
    ) -> None:
        """Should verify mathematical properties of cosine similarity."""
        # Test symmetry: sim(A, B) = sim(B, A)
        emb_a = [0.1, 0.2, 0.3]
        emb_b = [0.4, 0.5, 0.6]

        sim_ab = service.calculate_similarity(emb_a, emb_b)
        sim_ba = service.calculate_similarity(emb_b, emb_a)

        assert sim_ab == pytest.approx(sim_ba, abs=0.001)

        # Test range: 0.0 <= similarity <= 1.0
        assert 0.0 <= sim_ab <= 1.0

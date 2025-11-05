"""Tests for dynamic context extraction."""

import json
from unittest.mock import Mock, patch

import pytest

from fidus.memory.context.extractor import DynamicContextExtractor
from fidus.memory.context.models import ContextFactors, ContextExtractionResult


class TestDynamicContextExtractor:
    """Tests for DynamicContextExtractor."""

    @pytest.fixture
    def extractor(self) -> DynamicContextExtractor:
        """Create extractor instance for testing."""
        return DynamicContextExtractor(model="gpt-4o-mini")

    @patch("fidus.memory.context.extractor.completion")
    def test_extract_temporal_context(
        self, mock_completion: Mock, extractor: DynamicContextExtractor
    ) -> None:
        """Should extract temporal context from message."""
        # Mock LLM response
        mock_completion.return_value = Mock(
            choices=[
                Mock(
                    message=Mock(
                        content=json.dumps(
                            {
                                "context_factors": {"time_of_day": "morning"},
                                "confidence": 0.9,
                                "explanation": "Message mentions '9am'",
                            }
                        )
                    )
                )
            ]
        )

        result = extractor.extract_sync(
            message="I need coffee, it's 9am",
            tenant_id="tenant-1",
            user_id="user-1",
        )

        assert isinstance(result, ContextExtractionResult)
        assert result.context.factors["time_of_day"] == "morning"
        assert result.confidence == 0.9
        assert "9am" in result.explanation

    @patch("fidus.memory.context.extractor.completion")
    def test_extract_custom_context(
        self, mock_completion: Mock, extractor: DynamicContextExtractor
    ) -> None:
        """Should extract custom context factors organically."""
        # Mock LLM response with custom factor
        mock_completion.return_value = Mock(
            choices=[
                Mock(
                    message=Mock(
                        content=json.dumps(
                            {
                                "context_factors": {
                                    "activity": "exercising",
                                    "energy_level": "high",
                                },
                                "confidence": 0.85,
                                "explanation": "User mentions going to gym",
                            }
                        )
                    )
                )
            ]
        )

        result = extractor.extract_sync(
            message="Just finished my workout at the gym",
            tenant_id="tenant-1",
            user_id="user-1",
        )

        assert result.context.factors["activity"] == "exercising"
        assert result.context.factors["energy_level"] == "high"
        assert result.confidence == 0.85

    @patch("fidus.memory.context.extractor.completion")
    def test_extract_empty_context(
        self, mock_completion: Mock, extractor: DynamicContextExtractor
    ) -> None:
        """Should handle messages with no clear context."""
        # Mock LLM response with empty context
        mock_completion.return_value = Mock(
            choices=[
                Mock(
                    message=Mock(
                        content=json.dumps(
                            {
                                "context_factors": {},
                                "confidence": 0.1,
                                "explanation": "No clear context found",
                            }
                        )
                    )
                )
            ]
        )

        result = extractor.extract_sync(
            message="Hello", tenant_id="tenant-1", user_id="user-1"
        )

        assert result.context.factors == {}
        assert result.confidence == 0.1

    @patch("fidus.memory.context.extractor.completion")
    def test_extract_invalid_snake_case(
        self, mock_completion: Mock, extractor: DynamicContextExtractor
    ) -> None:
        """Should handle invalid factor names gracefully."""
        # Mock LLM response with invalid factor name
        mock_completion.return_value = Mock(
            choices=[
                Mock(
                    message=Mock(
                        content=json.dumps(
                            {
                                "context_factors": {"TimeOfDay": "morning"},  # Invalid: not snake_case
                                "confidence": 0.9,
                                "explanation": "Extracted time",
                            }
                        )
                    )
                )
            ]
        )

        result = extractor.extract_sync(
            message="It's morning", tenant_id="tenant-1", user_id="user-1"
        )

        # Should return empty context with low confidence when validation fails
        assert result.context.factors == {}
        assert result.confidence == 0.0
        assert "Validation failed" in result.explanation

    @patch("fidus.memory.context.extractor.completion")
    def test_extract_invalid_json(
        self, mock_completion: Mock, extractor: DynamicContextExtractor
    ) -> None:
        """Should handle invalid JSON response from LLM."""
        # Mock LLM response with invalid JSON
        mock_completion.return_value = Mock(
            choices=[Mock(message=Mock(content="This is not JSON"))]
        )

        with pytest.raises(ValueError) as exc_info:
            extractor.extract_sync(
                message="Test message", tenant_id="tenant-1", user_id="user-1"
            )

        assert "Invalid JSON response" in str(exc_info.value)

    @patch("fidus.memory.context.extractor.completion")
    def test_extract_llm_failure(
        self, mock_completion: Mock, extractor: DynamicContextExtractor
    ) -> None:
        """Should handle LLM API failures."""
        # Mock LLM API failure
        mock_completion.side_effect = Exception("LLM API is down")

        with pytest.raises(Exception) as exc_info:
            extractor.extract_sync(
                message="Test message", tenant_id="tenant-1", user_id="user-1"
            )

        assert "LLM API is down" in str(exc_info.value)

    @patch("fidus.memory.context.extractor.completion")
    def test_extract_multiple_factors(
        self, mock_completion: Mock, extractor: DynamicContextExtractor
    ) -> None:
        """Should extract multiple context factors from rich message."""
        # Mock LLM response with multiple factors
        mock_completion.return_value = Mock(
            choices=[
                Mock(
                    message=Mock(
                        content=json.dumps(
                            {
                                "context_factors": {
                                    "time_of_day": "evening",
                                    "day_of_week": "friday",
                                    "location": "home",
                                    "mood": "relaxed",
                                    "activity": "socializing",
                                },
                                "confidence": 0.95,
                                "explanation": "Message indicates Friday evening at home with friends",
                            }
                        )
                    )
                )
            ]
        )

        result = extractor.extract_sync(
            message="It's Friday night, having friends over for dinner",
            tenant_id="tenant-1",
            user_id="user-1",
        )

        assert len(result.context.factors) == 5
        assert result.context.factors["time_of_day"] == "evening"
        assert result.context.factors["day_of_week"] == "friday"
        assert result.context.factors["location"] == "home"
        assert result.context.factors["mood"] == "relaxed"
        assert result.context.factors["activity"] == "socializing"
        assert result.confidence == 0.95

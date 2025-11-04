"""Tests for context models."""

import pytest
from pydantic import ValidationError

from fidus.memory.context.models import ContextFactors, Situation, ContextExtractionResult


class TestContextFactors:
    """Tests for ContextFactors model."""

    def test_valid_snake_case_factors(self) -> None:
        """Should accept valid snake_case factor names."""
        factors = ContextFactors(
            factors={
                "time_of_day": "morning",
                "location": "home",
                "weather": "sunny",
            }
        )

        assert factors.factors["time_of_day"] == "morning"
        assert factors.factors["location"] == "home"
        assert factors.factors["weather"] == "sunny"

    def test_invalid_uppercase_factor(self) -> None:
        """Should reject factor names with uppercase letters."""
        with pytest.raises(ValidationError) as exc_info:
            ContextFactors(factors={"TimeOfDay": "morning"})

        assert "snake_case" in str(exc_info.value)

    def test_invalid_spaces_in_factor(self) -> None:
        """Should reject factor names with spaces."""
        with pytest.raises(ValidationError) as exc_info:
            ContextFactors(factors={"time of day": "morning"})

        assert "snake_case" in str(exc_info.value)

    def test_empty_factors(self) -> None:
        """Should accept empty factors dictionary."""
        factors = ContextFactors(factors={})
        assert factors.factors == {}

    def test_default_empty_factors(self) -> None:
        """Should default to empty factors if not provided."""
        factors = ContextFactors()
        assert factors.factors == {}

    def test_merge_override_true(self) -> None:
        """Should override existing values when merge override=True."""
        factors1 = ContextFactors(factors={"time_of_day": "morning", "location": "home"})
        factors2 = ContextFactors(factors={"time_of_day": "afternoon", "weather": "sunny"})

        merged = factors1.merge(factors2, override=True)

        assert merged.factors["time_of_day"] == "afternoon"  # overridden
        assert merged.factors["location"] == "home"  # kept from factors1
        assert merged.factors["weather"] == "sunny"  # added from factors2

    def test_merge_override_false(self) -> None:
        """Should keep existing values when merge override=False."""
        factors1 = ContextFactors(factors={"time_of_day": "morning", "location": "home"})
        factors2 = ContextFactors(factors={"time_of_day": "afternoon", "weather": "sunny"})

        merged = factors1.merge(factors2, override=False)

        assert merged.factors["time_of_day"] == "morning"  # kept from factors1
        assert merged.factors["location"] == "home"  # kept from factors1
        assert merged.factors["weather"] == "sunny"  # added from factors2

    def test_format_for_display(self) -> None:
        """Should format factors as readable string."""
        factors = ContextFactors(
            factors={"time_of_day": "morning", "location": "home", "weather": "sunny"}
        )

        display = factors.format_for_display()

        # Should be alphabetically sorted
        assert display == "location: home, time_of_day: morning, weather: sunny"

    def test_format_for_display_empty(self) -> None:
        """Should handle empty factors gracefully."""
        factors = ContextFactors(factors={})
        display = factors.format_for_display()

        assert display == "No context factors"


class TestSituation:
    """Tests for Situation model."""

    def test_situation_creation(self) -> None:
        """Should create situation with required fields."""
        situation = Situation(
            id="123e4567-e89b-12d3-a456-426614174000",
            tenant_id="tenant-1",
            user_id="user-1",
            context=ContextFactors(factors={"time_of_day": "morning"}),
        )

        assert situation.id == "123e4567-e89b-12d3-a456-426614174000"
        assert situation.tenant_id == "tenant-1"
        assert situation.user_id == "user-1"
        assert situation.context.factors["time_of_day"] == "morning"
        assert situation.embedding is None

    def test_situation_with_embedding(self) -> None:
        """Should store embedding vector."""
        embedding = [0.1, 0.2, 0.3, 0.4, 0.5]
        situation = Situation(
            id="123e4567-e89b-12d3-a456-426614174000",
            tenant_id="tenant-1",
            user_id="user-1",
            context=ContextFactors(factors={"time_of_day": "morning"}),
            embedding=embedding,
        )

        assert situation.embedding == embedding

    def test_situation_string_representation(self) -> None:
        """Should provide readable string representation."""
        situation = Situation(
            id="123e4567-e89b-12d3-a456-426614174000",
            tenant_id="tenant-1",
            user_id="user-1",
            context=ContextFactors(factors={"time_of_day": "morning", "location": "home"}),
        )

        string_repr = str(situation)

        assert "Situation" in string_repr
        assert "time_of_day" in string_repr
        assert "location" in string_repr


class TestContextExtractionResult:
    """Tests for ContextExtractionResult model."""

    def test_extraction_result_creation(self) -> None:
        """Should create extraction result with valid confidence."""
        result = ContextExtractionResult(
            context=ContextFactors(factors={"time_of_day": "morning"}),
            confidence=0.95,
            explanation="Detected morning time from message",
        )

        assert result.context.factors["time_of_day"] == "morning"
        assert result.confidence == 0.95
        assert result.explanation == "Detected morning time from message"

    def test_extraction_result_confidence_bounds(self) -> None:
        """Should enforce confidence between 0.0 and 1.0."""
        # Valid confidence
        result = ContextExtractionResult(
            context=ContextFactors(factors={}), confidence=0.0
        )
        assert result.confidence == 0.0

        result = ContextExtractionResult(
            context=ContextFactors(factors={}), confidence=1.0
        )
        assert result.confidence == 1.0

        # Invalid confidence > 1.0
        with pytest.raises(ValidationError):
            ContextExtractionResult(
                context=ContextFactors(factors={}), confidence=1.5
            )

        # Invalid confidence < 0.0
        with pytest.raises(ValidationError):
            ContextExtractionResult(
                context=ContextFactors(factors={}), confidence=-0.1
            )

    def test_extraction_result_optional_explanation(self) -> None:
        """Should allow optional explanation field."""
        result = ContextExtractionResult(
            context=ContextFactors(factors={}), confidence=0.5
        )

        assert result.explanation is None

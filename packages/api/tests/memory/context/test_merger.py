"""Tests for context merger."""

import pytest

from fidus.memory.context.merger import ContextMerger
from fidus.memory.context.models import ContextFactors


class TestContextMerger:
    """Tests for ContextMerger."""

    @pytest.fixture
    def merger(self) -> ContextMerger:
        """Create merger instance for testing."""
        return ContextMerger()

    def test_merge_llm_and_system_context(self, merger: ContextMerger) -> None:
        """Should merge LLM and system context without conflicts."""
        llm_context = ContextFactors(
            factors={
                "mood": "energetic",
                "activity": "working",
            }
        )

        system_context = ContextFactors(
            factors={
                "time_of_day": "morning",
                "day_of_week": "monday",
                "is_weekend": "false",
            }
        )

        merged = merger.merge(
            llm_context=llm_context,
            system_context=system_context,
            tenant_id="tenant-1",
            user_id="user-1",
        )

        # Should have all factors from both sources
        assert len(merged.factors) == 5
        assert merged.factors["mood"] == "energetic"
        assert merged.factors["activity"] == "working"
        assert merged.factors["time_of_day"] == "morning"
        assert merged.factors["day_of_week"] == "monday"
        assert merged.factors["is_weekend"] == "false"

    def test_merge_llm_overrides_system(self, merger: ContextMerger) -> None:
        """Should prioritize LLM context over system context on conflicts."""
        llm_context = ContextFactors(
            factors={
                "time_of_day": "late_night",  # User says "late night"
                "mood": "tired",
            }
        )

        system_context = ContextFactors(
            factors={
                "time_of_day": "evening",  # System says "evening" (e.g., 9 PM)
                "is_weekend": "false",
            }
        )

        merged = merger.merge(
            llm_context=llm_context,
            system_context=system_context,
            tenant_id="tenant-1",
            user_id="user-1",
        )

        # LLM value should win
        assert merged.factors["time_of_day"] == "late_night"
        assert merged.factors["mood"] == "tired"
        assert merged.factors["is_weekend"] == "false"

    def test_merge_empty_llm_context(self, merger: ContextMerger) -> None:
        """Should use only system context when LLM context is empty."""
        llm_context = ContextFactors(factors={})

        system_context = ContextFactors(
            factors={
                "time_of_day": "afternoon",
                "day_of_week": "wednesday",
            }
        )

        merged = merger.merge(
            llm_context=llm_context,
            system_context=system_context,
            tenant_id="tenant-1",
            user_id="user-1",
        )

        # Should have only system factors
        assert len(merged.factors) == 2
        assert merged.factors["time_of_day"] == "afternoon"
        assert merged.factors["day_of_week"] == "wednesday"

    def test_merge_empty_system_context(self, merger: ContextMerger) -> None:
        """Should use only LLM context when system context is empty."""
        llm_context = ContextFactors(
            factors={
                "location": "cafe",
                "activity": "meeting",
            }
        )

        system_context = ContextFactors(factors={})

        merged = merger.merge(
            llm_context=llm_context,
            system_context=system_context,
            tenant_id="tenant-1",
            user_id="user-1",
        )

        # Should have only LLM factors
        assert len(merged.factors) == 2
        assert merged.factors["location"] == "cafe"
        assert merged.factors["activity"] == "meeting"

    def test_merge_both_empty(self, merger: ContextMerger) -> None:
        """Should handle both contexts being empty."""
        llm_context = ContextFactors(factors={})
        system_context = ContextFactors(factors={})

        merged = merger.merge(
            llm_context=llm_context,
            system_context=system_context,
            tenant_id="tenant-1",
            user_id="user-1",
        )

        assert merged.factors == {}

    def test_format_for_display_with_factors(self, merger: ContextMerger) -> None:
        """Should format context factors as readable string."""
        context = ContextFactors(
            factors={
                "time_of_day": "morning",
                "mood": "energetic",
                "location": "home",
            }
        )

        formatted = merger.format_for_display(context)

        # Should be sorted alphabetically by key
        assert formatted == "location: home, mood: energetic, time_of_day: morning"

    def test_format_for_display_empty(self, merger: ContextMerger) -> None:
        """Should handle empty context gracefully."""
        context = ContextFactors(factors={})

        formatted = merger.format_for_display(context)

        assert formatted == "No context available"

    def test_format_for_display_single_factor(self, merger: ContextMerger) -> None:
        """Should format single factor correctly."""
        context = ContextFactors(factors={"mood": "happy"})

        formatted = merger.format_for_display(context)

        assert formatted == "mood: happy"

    def test_format_for_display_special_characters(
        self, merger: ContextMerger
    ) -> None:
        """Should handle special characters in values."""
        context = ContextFactors(
            factors={
                "location": "cafe & restaurant",
                "activity": "eating/drinking",
            }
        )

        formatted = merger.format_for_display(context)

        assert "activity: eating/drinking" in formatted
        assert "location: cafe & restaurant" in formatted

    def test_merge_preserves_context_factors_type(
        self, merger: ContextMerger
    ) -> None:
        """Should return ContextFactors instance."""
        llm_context = ContextFactors(factors={"mood": "happy"})
        system_context = ContextFactors(factors={"time_of_day": "morning"})

        merged = merger.merge(
            llm_context=llm_context,
            system_context=system_context,
            tenant_id="tenant-1",
            user_id="user-1",
        )

        assert isinstance(merged, ContextFactors)

    def test_merge_multiple_overlapping_factors(
        self, merger: ContextMerger
    ) -> None:
        """Should handle multiple overlapping factors correctly."""
        llm_context = ContextFactors(
            factors={
                "time_of_day": "early_morning",
                "location": "gym",
                "activity": "exercising",
            }
        )

        system_context = ContextFactors(
            factors={
                "time_of_day": "morning",
                "day_of_week": "tuesday",
                "is_weekend": "false",
                "season": "winter",
            }
        )

        merged = merger.merge(
            llm_context=llm_context,
            system_context=system_context,
            tenant_id="tenant-1",
            user_id="user-1",
        )

        # LLM should override time_of_day
        assert merged.factors["time_of_day"] == "early_morning"
        # LLM-only factors should be present
        assert merged.factors["location"] == "gym"
        assert merged.factors["activity"] == "exercising"
        # System-only factors should be present
        assert merged.factors["day_of_week"] == "tuesday"
        assert merged.factors["is_weekend"] == "false"
        assert merged.factors["season"] == "winter"
        # Total count
        assert len(merged.factors) == 6

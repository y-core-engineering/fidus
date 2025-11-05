"""Tests for system context provider."""

from datetime import datetime

import pytest

from fidus.memory.context.models import ContextFactors
from fidus.memory.context.system_provider import SystemContextProvider


class TestSystemContextProvider:
    """Tests for SystemContextProvider."""

    def test_morning_classification(self) -> None:
        """Should classify morning time (6-11)."""
        # 8:00 AM on a Tuesday
        provider = SystemContextProvider(
            current_time=datetime(2024, 1, 16, 8, 0, 0)  # Tuesday
        )
        context = provider.get_context(tenant_id="tenant-1", user_id="user-1")

        assert context.factors["time_of_day"] == "morning"
        assert context.factors["day_of_week"] == "tuesday"
        assert context.factors["is_weekend"] == "false"
        assert context.factors["is_work_hours"] == "false"  # Before 9 AM
        assert context.factors["season"] == "winter"

    def test_afternoon_classification(self) -> None:
        """Should classify afternoon time (12-17)."""
        # 2:00 PM on a Wednesday
        provider = SystemContextProvider(
            current_time=datetime(2024, 7, 17, 14, 0, 0)  # Wednesday
        )
        context = provider.get_context(tenant_id="tenant-1", user_id="user-1")

        assert context.factors["time_of_day"] == "afternoon"
        assert context.factors["day_of_week"] == "wednesday"
        assert context.factors["is_weekend"] == "false"
        assert context.factors["is_work_hours"] == "true"
        assert context.factors["season"] == "summer"

    def test_evening_classification(self) -> None:
        """Should classify evening time (18-23)."""
        # 8:00 PM on a Friday
        provider = SystemContextProvider(
            current_time=datetime(2024, 4, 19, 20, 0, 0)  # Friday
        )
        context = provider.get_context(tenant_id="tenant-1", user_id="user-1")

        assert context.factors["time_of_day"] == "evening"
        assert context.factors["day_of_week"] == "friday"
        assert context.factors["is_weekend"] == "false"
        assert context.factors["is_work_hours"] == "false"  # After 5 PM
        assert context.factors["season"] == "spring"

    def test_night_classification(self) -> None:
        """Should classify night time (0-5)."""
        # 3:00 AM on a Sunday
        provider = SystemContextProvider(
            current_time=datetime(2024, 10, 20, 3, 0, 0)  # Sunday
        )
        context = provider.get_context(tenant_id="tenant-1", user_id="user-1")

        assert context.factors["time_of_day"] == "night"
        assert context.factors["day_of_week"] == "sunday"
        assert context.factors["is_weekend"] == "true"
        assert context.factors["is_work_hours"] == "false"
        assert context.factors["season"] == "fall"

    def test_weekend_detection(self) -> None:
        """Should detect weekend days (Saturday/Sunday)."""
        # Saturday
        provider_sat = SystemContextProvider(
            current_time=datetime(2024, 1, 13, 12, 0, 0)  # Saturday
        )
        context_sat = provider_sat.get_context(
            tenant_id="tenant-1", user_id="user-1"
        )

        assert context_sat.factors["day_of_week"] == "saturday"
        assert context_sat.factors["is_weekend"] == "true"
        assert context_sat.factors["is_work_hours"] == "false"

        # Sunday
        provider_sun = SystemContextProvider(
            current_time=datetime(2024, 1, 14, 12, 0, 0)  # Sunday
        )
        context_sun = provider_sun.get_context(
            tenant_id="tenant-1", user_id="user-1"
        )

        assert context_sun.factors["day_of_week"] == "sunday"
        assert context_sun.factors["is_weekend"] == "true"
        assert context_sun.factors["is_work_hours"] == "false"

    def test_work_hours_detection(self) -> None:
        """Should detect work hours (9-17 on weekdays)."""
        # Monday 10 AM - work hours
        provider_work = SystemContextProvider(
            current_time=datetime(2024, 1, 15, 10, 0, 0)  # Monday
        )
        context_work = provider_work.get_context(
            tenant_id="tenant-1", user_id="user-1"
        )

        assert context_work.factors["is_work_hours"] == "true"
        assert context_work.factors["is_weekend"] == "false"

        # Monday 8 AM - before work hours
        provider_early = SystemContextProvider(
            current_time=datetime(2024, 1, 15, 8, 0, 0)  # Monday
        )
        context_early = provider_early.get_context(
            tenant_id="tenant-1", user_id="user-1"
        )

        assert context_early.factors["is_work_hours"] == "false"

        # Monday 6 PM - after work hours
        provider_late = SystemContextProvider(
            current_time=datetime(2024, 1, 15, 18, 0, 0)  # Monday
        )
        context_late = provider_late.get_context(
            tenant_id="tenant-1", user_id="user-1"
        )

        assert context_late.factors["is_work_hours"] == "false"

    def test_season_winter(self) -> None:
        """Should classify winter months (Dec, Jan, Feb)."""
        for month in [12, 1, 2]:
            provider = SystemContextProvider(
                current_time=datetime(2024, month, 15, 12, 0, 0)
            )
            context = provider.get_context(tenant_id="tenant-1", user_id="user-1")
            assert context.factors["season"] == "winter"

    def test_season_spring(self) -> None:
        """Should classify spring months (Mar, Apr, May)."""
        for month in [3, 4, 5]:
            provider = SystemContextProvider(
                current_time=datetime(2024, month, 15, 12, 0, 0)
            )
            context = provider.get_context(tenant_id="tenant-1", user_id="user-1")
            assert context.factors["season"] == "spring"

    def test_season_summer(self) -> None:
        """Should classify summer months (Jun, Jul, Aug)."""
        for month in [6, 7, 8]:
            provider = SystemContextProvider(
                current_time=datetime(2024, month, 15, 12, 0, 0)
            )
            context = provider.get_context(tenant_id="tenant-1", user_id="user-1")
            assert context.factors["season"] == "summer"

    def test_season_fall(self) -> None:
        """Should classify fall months (Sep, Oct, Nov)."""
        for month in [9, 10, 11]:
            provider = SystemContextProvider(
                current_time=datetime(2024, month, 15, 12, 0, 0)
            )
            context = provider.get_context(tenant_id="tenant-1", user_id="user-1")
            assert context.factors["season"] == "fall"

    def test_boundary_morning_start(self) -> None:
        """Should classify 6:00 AM as morning (boundary)."""
        provider = SystemContextProvider(
            current_time=datetime(2024, 1, 15, 6, 0, 0)
        )
        context = provider.get_context(tenant_id="tenant-1", user_id="user-1")
        assert context.factors["time_of_day"] == "morning"

    def test_boundary_afternoon_start(self) -> None:
        """Should classify 12:00 PM as afternoon (boundary)."""
        provider = SystemContextProvider(
            current_time=datetime(2024, 1, 15, 12, 0, 0)
        )
        context = provider.get_context(tenant_id="tenant-1", user_id="user-1")
        assert context.factors["time_of_day"] == "afternoon"

    def test_boundary_evening_start(self) -> None:
        """Should classify 18:00 (6 PM) as evening (boundary)."""
        provider = SystemContextProvider(
            current_time=datetime(2024, 1, 15, 18, 0, 0)
        )
        context = provider.get_context(tenant_id="tenant-1", user_id="user-1")
        assert context.factors["time_of_day"] == "evening"

    def test_boundary_night_start(self) -> None:
        """Should classify midnight as night (boundary)."""
        provider = SystemContextProvider(
            current_time=datetime(2024, 1, 15, 0, 0, 0)
        )
        context = provider.get_context(tenant_id="tenant-1", user_id="user-1")
        assert context.factors["time_of_day"] == "night"

    def test_returns_context_factors_model(self) -> None:
        """Should return ContextFactors instance."""
        provider = SystemContextProvider(
            current_time=datetime(2024, 6, 15, 14, 30, 0)
        )
        context = provider.get_context(tenant_id="tenant-1", user_id="user-1")

        assert isinstance(context, ContextFactors)
        assert "time_of_day" in context.factors
        assert "day_of_week" in context.factors
        assert "is_weekend" in context.factors
        assert "is_work_hours" in context.factors
        assert "season" in context.factors

    def test_uses_current_time_when_not_provided(self) -> None:
        """Should use current time when current_time is None."""
        provider = SystemContextProvider()  # No current_time provided
        context = provider.get_context(tenant_id="tenant-1", user_id="user-1")

        # Should have all expected factors
        assert isinstance(context, ContextFactors)
        assert len(context.factors) == 5
        assert all(
            key in context.factors
            for key in [
                "time_of_day",
                "day_of_week",
                "is_weekend",
                "is_work_hours",
                "season",
            ]
        )

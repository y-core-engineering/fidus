"""System-level context provider for automatic context extraction.

This module provides system-based context that doesn't require LLM analysis,
such as time of day, day of week, season, etc.
"""

import logging
from datetime import datetime
from typing import Optional

from fidus.memory.context.models import ContextFactors

logger = logging.getLogger(__name__)


class SystemContextProvider:
    """Provides system-level context based on time and other automatic signals.

    This provider extracts context that can be determined without LLM analysis,
    such as temporal context (time of day, day of week, season) and system state.

    Example:
        provider = SystemContextProvider()
        context = provider.get_context()
        # context.factors = {
        #     "time_of_day": "morning",
        #     "day_of_week": "monday",
        #     "is_weekend": "false",
        #     "season": "winter"
        # }
    """

    # Time of day thresholds (24-hour format)
    NIGHT_START = 0
    MORNING_START = 6
    AFTERNOON_START = 12
    EVENING_START = 18

    def __init__(self, current_time: Optional[datetime] = None):
        """Initialize the system context provider.

        Args:
            current_time: Optional datetime for testing. If None, uses current time.
        """
        self.current_time = current_time

    def get_context(
        self,
        tenant_id: str,
        user_id: str,
    ) -> ContextFactors:
        """Get system-level context for the current moment.

        Args:
            tenant_id: Tenant ID for logging and tracking
            user_id: User ID for logging and tracking

        Returns:
            ContextFactors: System-derived context factors
        """
        logger.info(
            f"Getting system context",
            extra={
                "tenant_id": tenant_id,
                "user_id": user_id,
            },
        )

        now = self.current_time or datetime.now()

        factors = {
            "time_of_day": self._classify_time(now),
            "day_of_week": now.strftime("%A").lower(),
            "is_weekend": "true" if now.weekday() >= 5 else "false",
            "is_work_hours": self._is_work_hours(now),
            "season": self._get_season(now),
        }

        logger.debug(
            f"System context extracted",
            extra={
                "tenant_id": tenant_id,
                "user_id": user_id,
                "factors": factors,
            },
        )

        return ContextFactors(factors=factors)

    def _classify_time(self, dt: datetime) -> str:
        """Classify time of day based on hour.

        Args:
            dt: Datetime to classify

        Returns:
            str: Time classification (night, morning, afternoon, evening)
        """
        hour = dt.hour

        if self.NIGHT_START <= hour < self.MORNING_START:
            return "night"
        elif self.MORNING_START <= hour < self.AFTERNOON_START:
            return "morning"
        elif self.AFTERNOON_START <= hour < self.EVENING_START:
            return "afternoon"
        else:  # 18-23
            return "evening"

    def _is_work_hours(self, dt: datetime) -> str:
        """Check if current time is within typical work hours (9-17 weekdays).

        Args:
            dt: Datetime to check

        Returns:
            str: "true" if work hours, "false" otherwise
        """
        is_weekday = dt.weekday() < 5  # Monday-Friday
        is_business_hours = 9 <= dt.hour < 17

        return "true" if (is_weekday and is_business_hours) else "false"

    def _get_season(self, dt: datetime) -> str:
        """Determine season based on month (Northern Hemisphere).

        Args:
            dt: Datetime to check

        Returns:
            str: Season (spring, summer, fall, winter)
        """
        month = dt.month

        # Northern Hemisphere seasons
        if month in [12, 1, 2]:
            return "winter"
        elif month in [3, 4, 5]:
            return "spring"
        elif month in [6, 7, 8]:
            return "summer"
        else:  # 9, 10, 11
            return "fall"

"""Context merger for combining LLM and system context.

This module provides functionality to merge context from different sources,
with LLM-extracted context taking precedence over system context.
"""

import logging

from fidus.memory.context.models import ContextFactors

logger = logging.getLogger(__name__)


class ContextMerger:
    """Merges context from multiple sources with prioritization.

    The merger combines context factors from different sources:
    - LLM-extracted context (dynamic, user-specific)
    - System context (automatic, time-based)

    LLM-extracted context takes precedence over system context when
    both sources provide the same factor.

    Example:
        merger = ContextMerger()
        final = merger.merge(
            llm_context=ContextFactors(factors={"mood": "energetic"}),
            system_context=ContextFactors(factors={"time_of_day": "morning"})
        )
        # final.factors = {"mood": "energetic", "time_of_day": "morning"}
    """

    def merge(
        self,
        llm_context: ContextFactors,
        system_context: ContextFactors,
        tenant_id: str,
        user_id: str,
    ) -> ContextFactors:
        """Merge LLM and system context, with LLM taking precedence.

        Args:
            llm_context: Context extracted from user message via LLM
            system_context: Context from system provider (time, etc.)
            tenant_id: Tenant ID for logging
            user_id: User ID for logging

        Returns:
            ContextFactors: Merged context with LLM values taking precedence
        """
        logger.debug(
            f"Merging contexts",
            extra={
                "tenant_id": tenant_id,
                "user_id": user_id,
                "llm_factors_count": len(llm_context.factors),
                "system_factors_count": len(system_context.factors),
            },
        )

        # System context first, then LLM context (override=True by default)
        merged = system_context.merge(llm_context, override=True)

        logger.info(
            f"Contexts merged",
            extra={
                "tenant_id": tenant_id,
                "user_id": user_id,
                "merged_factors_count": len(merged.factors),
                "factors": merged.factors,
            },
        )

        return merged

    def format_for_display(self, context: ContextFactors) -> str:
        """Format context factors as human-readable string.

        Args:
            context: Context factors to format

        Returns:
            str: Human-readable representation of context

        Example:
            context = ContextFactors(factors={
                "time_of_day": "morning",
                "mood": "energetic",
                "location": "home"
            })
            formatted = merger.format_for_display(context)
            # Returns: "time_of_day: morning, mood: energetic, location: home"
        """
        if not context.factors:
            return "No context available"

        # Sort by key for consistent output
        sorted_factors = sorted(context.factors.items())

        # Format as "key: value" pairs
        formatted_pairs = [f"{key}: {value}" for key, value in sorted_factors]

        return ", ".join(formatted_pairs)

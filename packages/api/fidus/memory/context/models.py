"""Pydantic models for situational context.

This module defines the data models for representing situational context
that influences user preferences. Context factors are discovered dynamically
by the LLM rather than using a fixed schema.
"""

from typing import Optional
from pydantic import BaseModel, Field, field_validator


class ContextFactors(BaseModel):
    """Context factors extracted from user message.

    Context factors are discovered dynamically by the LLM and stored as
    key-value pairs. Factor names must be in snake_case format.

    Examples:
        {"time_of_day": "morning", "location": "home", "mood": "relaxed"}
        {"day_of_week": "monday", "weather": "rainy"}
        {"season": "winter", "activity": "working"}
    """

    factors: dict[str, str] = Field(
        default_factory=dict,
        description="Context factors as key-value pairs (e.g., time_of_day: morning)"
    )

    @field_validator('factors')
    @classmethod
    def validate_snake_case(cls, v: dict[str, str]) -> dict[str, str]:
        """Validate that all factor names are in snake_case format.

        Args:
            v: Dictionary of context factors

        Returns:
            dict[str, str]: Validated factors

        Raises:
            ValueError: If any factor name is not in snake_case
        """
        for key in v.keys():
            if not key.islower() or ' ' in key:
                raise ValueError(
                    f"Context factor '{key}' must be in snake_case format (lowercase with underscores)"
                )
        return v

    def merge(self, other: 'ContextFactors', override: bool = True) -> 'ContextFactors':
        """Merge with another ContextFactors instance.

        Args:
            other: Another ContextFactors to merge with
            override: If True, values from 'other' override existing values

        Returns:
            ContextFactors: New merged instance
        """
        if override:
            merged = {**self.factors, **other.factors}
        else:
            merged = {**other.factors, **self.factors}

        return ContextFactors(factors=merged)

    def format_for_display(self) -> str:
        """Format context factors for human-readable display.

        Returns:
            str: Formatted string like "time_of_day: morning, location: home"
        """
        if not self.factors:
            return "No context factors"

        return ", ".join(f"{key}: {value}" for key, value in sorted(self.factors.items()))


class Situation(BaseModel):
    """A situation represents a specific context with vector embedding.

    A situation combines context factors with their vector representation
    for similarity search. Multiple preferences can share the same situation.
    """

    id: str = Field(
        description="Unique identifier for the situation (UUID)"
    )

    tenant_id: str = Field(
        description="Tenant ID for multi-tenancy isolation"
    )

    user_id: str = Field(
        description="User ID who owns this situation"
    )

    context: ContextFactors = Field(
        description="Context factors for this situation"
    )

    embedding: Optional[list[float]] = Field(
        default=None,
        description="Vector embedding of the context for similarity search"
    )

    created_at: Optional[str] = Field(
        default=None,
        description="ISO 8601 timestamp when situation was created"
    )

    updated_at: Optional[str] = Field(
        default=None,
        description="ISO 8601 timestamp when situation was last updated"
    )

    def __str__(self) -> str:
        """String representation of the situation."""
        return f"Situation({self.context.format_for_display()})"


class ContextExtractionResult(BaseModel):
    """Result of context extraction from a user message.

    This model represents the LLM's analysis of a user message to identify
    relevant context factors.
    """

    context: ContextFactors = Field(
        description="Extracted context factors"
    )

    confidence: float = Field(
        ge=0.0,
        le=1.0,
        description="Confidence score for the extraction (0.0 to 1.0)"
    )

    explanation: Optional[str] = Field(
        default=None,
        description="Optional explanation of why these factors were extracted"
    )

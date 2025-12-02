"""Pydantic models for situational context.

This module defines the data models for representing situational context
that influences user preferences. Context factors are discovered dynamically
by the LLM rather than using a fixed schema.

Version History:
- v1.0/v2.0: Situation as Neo4j node with IN_SITUATION relationship
- v3.0 (ADR-0001): Situation as Qdrant payload, situation_id on relationships

Architecture References:
- ADR-0001: Situational Context as Relationship Qualifier
- ADR-0002: Property Placement Strategy (Neo4j: structural/temporal, Qdrant: all context)
"""

from datetime import datetime
from typing import Any, Dict, Optional

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


# =============================================================================
# v3.0 Models (ADR-0001 Compliant)
# =============================================================================


class RelationshipContext(BaseModel):
    """Context for a relationship instance (v3.0).

    Per ADR-0001: situation_id references Qdrant payload.
    Per ADR-0002: Neo4j stores ONLY structural + temporal properties.
    """

    relationship_instance_id: str = Field(
        ...,
        description="Unique ID for this relationship instance",
    )

    situation_id: str = Field(
        ...,
        description="Reference to Qdrant context point (PRIMARY storage)",
    )

    observed_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="When this relationship was observed",
    )

    confidence: float = Field(
        default=0.9,
        ge=0.0,
        le=1.0,
        description="AI confidence in this relationship (0.0 to 1.0)",
    )

    source: str = Field(
        default="explicit",
        description='How relationship was created: "explicit", "inferred", "extracted"',
    )


class SituationalContextV3(BaseModel):
    """Full situational context stored in Qdrant (v3.0).

    Per ADR-0001: This is the PRIMARY storage location for context.
    Per ADR-0002: Contains ALL descriptive and contextual properties.

    The 'context' field is completely flexible and AI-driven.
    No required fields - the LLM decides what context factors are relevant.

    Example context fields (all optional, AI-discovered):
    - Descriptive: role, relationship_type, status, priority, department
    - Situational: emotion, mood, activity, location, time_of_day
    - Temporal (copied): started_at, ended_at, joined_at, left_at
    """

    tenant_id: str = Field(
        ...,
        description="Tenant ID for multi-tenancy isolation",
    )

    user_id: str = Field(
        ...,
        description="User ID who owns this context",
    )

    relationship_type: str = Field(
        ...,
        description='Relationship type: "KNOWS", "WORKS_AT", "HAS_PREFERENCE", etc.',
    )

    entity_id: str = Field(
        ...,
        description="Related entity ID (person_id, organization_id, preference_id)",
    )

    context: Dict[str, Any] = Field(
        default_factory=dict,
        description="Flexible context: role, emotion, mood, activity, location, etc. (AI-driven)",
    )

    relationship_instance_id: Optional[str] = Field(
        default=None,
        description="Reference to Neo4j relationship for correlation",
    )

    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="When this context was created",
    )

    version: str = Field(
        default="v3.0",
        description="Storage pattern version",
    )


class TemporalBoundaries(BaseModel):
    """Temporal boundary properties for Neo4j relationships (ADR-0002).

    Per ADR-0002: Temporal boundaries are stored in Neo4j for efficient date queries.
    All other context properties go to Qdrant.

    Only include properties relevant to the relationship type:
    - WORKS_AT: started_at, ended_at
    - MEMBER_OF: joined_at, left_at
    - PURSUES: started_at, target_date, ended_at
    - HAS_HABIT: started_at, ended_at
    - ATTENDS: attended_at
    - KNOWS, OWNS, FREQUENTS, HAS_PREFERENCE: No temporal boundaries
    """

    started_at: Optional[str] = Field(
        default=None,
        description="When relationship started (WORKS_AT, PURSUES, HAS_HABIT)",
    )

    ended_at: Optional[str] = Field(
        default=None,
        description="When relationship ended (WORKS_AT, PURSUES, HAS_HABIT)",
    )

    joined_at: Optional[str] = Field(
        default=None,
        description="When user joined (MEMBER_OF)",
    )

    left_at: Optional[str] = Field(
        default=None,
        description="When user left (MEMBER_OF)",
    )

    attended_at: Optional[str] = Field(
        default=None,
        description="When user attended (ATTENDS)",
    )

    target_date: Optional[str] = Field(
        default=None,
        description="Target completion date (PURSUES)",
    )

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary, excluding None values."""
        return {k: v for k, v in self.model_dump().items() if v is not None}

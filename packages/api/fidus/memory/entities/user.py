"""
User entity: Aggregate root for the memory domain.

All other entities (Person, Organization, Goal, etc.) relate to User.

NOTE (ADR-0003): Skills are stored as role-scoped attributes on relationship
contexts in Qdrant, not on the User entity. See docs/adr/ADR-0003-role-scoped-attributes.md
"""

from typing import Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr, field_validator


class User(BaseModel):
    """
    User entity with flexible AI-discovered properties.

    This is the aggregate root for all memory entities. Every entity
    in the memory system belongs to a specific user.

    NOTE (ADR-0003): Skills, goals, and role-specific preferences are stored
    on relationship contexts in Qdrant, not on the User entity.
    """

    id: str = Field(..., description="Unique user identifier (UUID)")
    tenant_id: str = Field(..., description="Tenant identifier for multi-tenancy")
    email: EmailStr = Field(..., description="User email address (unique)")
    name: str = Field(..., description="User's full name")
    preferred_language: str = Field(default="en", description="ISO 639-1 language code")
    timezone: str = Field(default="UTC", description="IANA timezone (e.g., 'Europe/Berlin')")
    ai_properties: Dict[str, Any] = Field(
        default_factory=dict,
        description="Flexible properties discovered by AI (interests, traits, etc.)"
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @field_validator("preferred_language")
    @classmethod
    def validate_language(cls, v: str) -> str:
        """Ensure language is valid ISO 639-1 code."""
        valid_languages = ["en", "de", "fr", "es", "it", "pt", "nl", "pl", "ja", "zh", "ko"]
        if v not in valid_languages:
            raise ValueError(f"Language must be one of {valid_languages}")
        return v

    model_config = {
        "json_schema_extra": {
            "example": {
                "id": "user-123",
                "tenant_id": "tenant-456",
                "email": "max@example.com",
                "name": "Max Mustermann",
                "preferred_language": "de",
                "timezone": "Europe/Berlin",
                "ai_properties": {
                    "interests": ["AI", "Music", "Travel"],
                    "personality_traits": ["curious", "analytical"],
                    "communication_style": "direct"
                }
            }
        }
    }


class UserCreate(BaseModel):
    """Request model for creating a user."""

    tenant_id: str
    email: EmailStr
    name: str
    preferred_language: str = "en"
    timezone: str = "UTC"
    ai_properties: Dict[str, Any] = Field(default_factory=dict)


class UserUpdate(BaseModel):
    """Request model for updating a user."""

    name: Optional[str] = None
    preferred_language: Optional[str] = None
    timezone: Optional[str] = None
    ai_properties: Optional[Dict[str, Any]] = None


class UserResponse(BaseModel):
    """Response model for user API."""

    id: str
    tenant_id: str
    email: str
    name: str
    preferred_language: str
    timezone: str
    ai_properties: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

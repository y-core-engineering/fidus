"""
Organization entity model with flexible AI-discovered properties.

This is the second domain entity in the v3.0 Entity-Relationship Model.
Organizations represent companies, teams, and communities mentioned in user conversations.
"""

from typing import Any, Dict, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from uuid import uuid4


class Organization(BaseModel):
    """
    Organization entity representing companies, teams, communities.

    Examples:
    - Companies: "Anthropic", "Google", "Local Bakery"
    - Teams: "DevOps Team", "Marketing Department"
    - Communities: "Berlin Python User Group", "Running Club"

    Core Fields: Fixed schema for essential attributes
    AI Properties: Flexible dict for AI-discovered attributes
    """

    id: str = Field(default_factory=lambda: str(uuid4()))
    tenant_id: str = Field(..., description="Multi-tenancy identifier")
    user_id: str = Field(..., description="User who owns this organization entity")
    name: str = Field(..., description="Organization name (required)")

    # Flexible properties discovered by AI
    ai_properties: Dict[str, Any] = Field(
        default_factory=dict,
        description="AI-discovered attributes (industry, size, location, culture, etc.)"
    )

    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    confidence: float = Field(
        default=0.9, ge=0.0, le=1.0, description="Extraction confidence"
    )
    source: str = Field(
        default="explicit", description="explicit, inferred, llm_extracted"
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "id": "org_123",
                "tenant_id": "tenant_456",
                "user_id": "user_789",
                "name": "Anthropic",
                "ai_properties": {
                    "industry": "AI Safety",
                    "size": "mid",
                    "location": "San Francisco, CA",
                    "culture": "research-driven, safety-focused",
                    "website": "https://anthropic.com",
                    "description": "AI safety company building reliable, interpretable AI systems"
                },
                "confidence": 0.95,
                "source": "llm_extracted"
            }
        }
    }

    # Property helpers for common AI attributes
    @property
    def industry(self) -> Optional[str]:
        """Extract industry from ai_properties."""
        return self.ai_properties.get("industry")

    @property
    def size(self) -> Optional[str]:
        """
        Extract company size from ai_properties.

        Typical values: startup, small, mid, large, enterprise
        """
        return self.ai_properties.get("size")

    @property
    def location(self) -> Optional[str]:
        """Extract location from ai_properties."""
        return self.ai_properties.get("location")

    @property
    def culture(self) -> Optional[str]:
        """Extract culture description from ai_properties."""
        return self.ai_properties.get("culture")

    @property
    def website(self) -> Optional[str]:
        """Extract website URL from ai_properties."""
        return self.ai_properties.get("website")

    @property
    def description(self) -> Optional[str]:
        """Extract description from ai_properties."""
        return self.ai_properties.get("description")

    def merge_properties(self, new_properties: Dict[str, Any]) -> None:
        """
        Merge new AI-discovered properties without overwriting existing ones.

        Strategy:
        - Add new keys
        - For list values, union (no duplicates)
        - For scalar values, keep existing (don't overwrite)
        """
        for key, value in new_properties.items():
            if key not in self.ai_properties:
                # New property: add it
                self.ai_properties[key] = value
            elif isinstance(value, list) and isinstance(self.ai_properties[key], list):
                # List: union (preserving order, removing duplicates)
                existing = self.ai_properties[key]
                for item in value:
                    if item not in existing:
                        existing.append(item)
            # Scalar: keep existing (don't overwrite)

        self.updated_at = datetime.utcnow()


class OrganizationCreate(BaseModel):
    """Request model for creating an organization."""

    name: str = Field(..., min_length=1, max_length=255, description="Organization name")
    ai_properties: Dict[str, Any] = Field(default_factory=dict)
    confidence: float = Field(default=0.9, ge=0.0, le=1.0)
    source: str = Field(default="explicit")


class OrganizationUpdate(BaseModel):
    """Request model for updating an organization."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    ai_properties: Optional[Dict[str, Any]] = None


class OrganizationResponse(BaseModel):
    """Response model for organization API."""

    id: str
    tenant_id: str
    user_id: str
    name: str
    ai_properties: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    confidence: float
    source: str

    # Computed properties for convenience
    industry: Optional[str] = None
    size: Optional[str] = None
    location: Optional[str] = None
    culture: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None

    @classmethod
    def from_organization(cls, org: Organization) -> "OrganizationResponse":
        """Create OrganizationResponse from Organization entity."""
        return cls(
            id=org.id,
            tenant_id=org.tenant_id,
            user_id=org.user_id,
            name=org.name,
            ai_properties=org.ai_properties,
            created_at=org.created_at,
            updated_at=org.updated_at,
            confidence=org.confidence,
            source=org.source,
            industry=org.industry,
            size=org.size,
            location=org.location,
            culture=org.culture,
            website=org.website,
            description=org.description,
        )

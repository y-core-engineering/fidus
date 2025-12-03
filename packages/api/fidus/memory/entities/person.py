"""
Person entity model with flexible AI-discovered properties.

This is the first domain entity in the v3.0 Entity-Relationship Model.
Persons represent individuals mentioned in user conversations.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from uuid import uuid4


class Person(BaseModel):
    """
    Person entity representing individuals mentioned in user conversations.

    Core Fields: Fixed schema for essential attributes
    AI Properties: Flexible dict for AI-discovered attributes (profession, topics, etc.)
    """

    id: str = Field(default_factory=lambda: str(uuid4()))
    tenant_id: str = Field(..., description="Multi-tenancy identifier")
    user_id: str = Field(..., description="User who owns this person entity")
    name: str = Field(..., description="Person's name (required)")

    # Flexible properties discovered by AI
    ai_properties: Dict[str, Any] = Field(
        default_factory=dict,
        description="AI-discovered attributes (profession, topics, communication_style, etc.)"
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
                "id": "person_123",
                "tenant_id": "tenant_456",
                "user_id": "user_789",
                "name": "Anna Schmidt",
                "ai_properties": {
                    "profession": "Software Engineer",
                    "topics": ["Python", "Machine Learning", "DevOps"],
                    "communication_style": "direct, technical",
                    "company": "Anthropic",
                    "notes": "Works on Claude team"
                },
                "confidence": 0.95,
                "source": "llm_extracted"
            }
        }
    }

    # Property helpers for common AI attributes
    @property
    def profession(self) -> Optional[str]:
        """Extract profession from ai_properties."""
        return self.ai_properties.get("profession")

    @property
    def topics(self) -> List[str]:
        """Extract topics from ai_properties."""
        return self.ai_properties.get("topics", [])

    @property
    def communication_style(self) -> Optional[str]:
        """Extract communication style from ai_properties."""
        return self.ai_properties.get("communication_style")

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


class PersonCreate(BaseModel):
    """Request model for creating a person."""

    name: str = Field(..., min_length=1, max_length=255, description="Person's name")
    ai_properties: Dict[str, Any] = Field(default_factory=dict)
    confidence: float = Field(default=0.9, ge=0.0, le=1.0)
    source: str = Field(default="explicit")


class PersonUpdate(BaseModel):
    """Request model for updating a person."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    ai_properties: Optional[Dict[str, Any]] = None


class PersonResponse(BaseModel):
    """Response model for person API."""

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
    profession: Optional[str] = None
    topics: List[str] = Field(default_factory=list)
    communication_style: Optional[str] = None

    @classmethod
    def from_person(cls, person: Person) -> "PersonResponse":
        """Create PersonResponse from Person entity."""
        return cls(
            id=person.id,
            tenant_id=person.tenant_id,
            user_id=person.user_id,
            name=person.name,
            ai_properties=person.ai_properties,
            created_at=person.created_at,
            updated_at=person.updated_at,
            confidence=person.confidence,
            source=person.source,
            profession=person.profession,
            topics=person.topics,
            communication_style=person.communication_style,
        )

"""Unit tests for Person entity.

Tests the Person entity model, including:
- Basic creation and validation
- AI properties handling
- Property merging strategy
- Response model creation
"""

import pytest
from datetime import datetime
from pydantic import ValidationError
from fidus.memory.entities.person import Person, PersonCreate, PersonUpdate, PersonResponse


class TestPersonEntity:
    """Tests for Person entity model."""

    def test_create_person_with_required_fields(self):
        """Test creating a person with only required fields."""
        person = Person(
            tenant_id="tenant-123",
            user_id="user-456",
            name="Anna Schmidt",
        )

        assert person.tenant_id == "tenant-123"
        assert person.user_id == "user-456"
        assert person.name == "Anna Schmidt"
        assert person.ai_properties == {}
        assert person.confidence == 0.9
        assert person.source == "explicit"
        assert person.id is not None

    def test_create_person_with_all_fields(self):
        """Test creating a person with all fields."""
        now = datetime.utcnow()
        person = Person(
            id="person-123",
            tenant_id="tenant-456",
            user_id="user-789",
            name="Max Mustermann",
            ai_properties={
                "profession": "Software Engineer",
                "topics": ["Python", "AI"],
                "communication_style": "technical",
            },
            created_at=now,
            updated_at=now,
            confidence=0.95,
            source="llm_extracted",
        )

        assert person.id == "person-123"
        assert person.profession == "Software Engineer"
        assert person.topics == ["Python", "AI"]
        assert person.communication_style == "technical"
        assert person.confidence == 0.95
        assert person.source == "llm_extracted"

    def test_property_helpers(self):
        """Test convenience property accessors."""
        person = Person(
            tenant_id="t1",
            user_id="u1",
            name="Test",
            ai_properties={
                "profession": "Designer",
                "topics": ["UX", "Figma"],
                "communication_style": "visual",
            },
        )

        assert person.profession == "Designer"
        assert person.topics == ["UX", "Figma"]
        assert person.communication_style == "visual"

    def test_property_helpers_empty(self):
        """Test property accessors with empty ai_properties."""
        person = Person(
            tenant_id="t1",
            user_id="u1",
            name="Test",
        )

        assert person.profession is None
        assert person.topics == []
        assert person.communication_style is None

    def test_merge_properties_add_new(self):
        """Test merging adds new properties."""
        person = Person(
            tenant_id="t1",
            user_id="u1",
            name="Test",
            ai_properties={"profession": "Engineer"},
        )

        person.merge_properties({"company": "Anthropic"})

        assert person.ai_properties["profession"] == "Engineer"
        assert person.ai_properties["company"] == "Anthropic"

    def test_merge_properties_preserve_existing(self):
        """Test merging preserves existing scalar values."""
        person = Person(
            tenant_id="t1",
            user_id="u1",
            name="Test",
            ai_properties={"profession": "Original"},
        )

        person.merge_properties({"profession": "New"})

        # Original value should be preserved
        assert person.ai_properties["profession"] == "Original"

    def test_merge_properties_union_lists(self):
        """Test merging unions list values without duplicates."""
        person = Person(
            tenant_id="t1",
            user_id="u1",
            name="Test",
            ai_properties={"topics": ["Python", "AI"]},
        )

        person.merge_properties({"topics": ["AI", "ML", "DevOps"]})

        # Should have union: Python, AI, ML, DevOps
        assert set(person.topics) == {"Python", "AI", "ML", "DevOps"}
        # Order preserved: original first, then new
        assert person.topics[0] == "Python"
        assert person.topics[1] == "AI"

    def test_merge_properties_updates_timestamp(self):
        """Test merging updates the updated_at timestamp."""
        person = Person(
            tenant_id="t1",
            user_id="u1",
            name="Test",
        )
        original_updated = person.updated_at

        # Wait a tiny bit to ensure different timestamp
        import time
        time.sleep(0.01)

        person.merge_properties({"new_prop": "value"})

        assert person.updated_at > original_updated

    def test_validate_name_required(self):
        """Test that name is required."""
        with pytest.raises(ValidationError):
            Person(
                tenant_id="t1",
                user_id="u1",
                # Missing name
            )

    def test_validate_confidence_range(self):
        """Test confidence must be between 0 and 1."""
        with pytest.raises(ValidationError):
            Person(
                tenant_id="t1",
                user_id="u1",
                name="Test",
                confidence=1.5,  # Invalid: > 1.0
            )

        with pytest.raises(ValidationError):
            Person(
                tenant_id="t1",
                user_id="u1",
                name="Test",
                confidence=-0.1,  # Invalid: < 0.0
            )


class TestPersonCreate:
    """Tests for PersonCreate model."""

    def test_create_with_required_fields(self):
        """Test PersonCreate with required fields only."""
        create = PersonCreate(name="Test Person")

        assert create.name == "Test Person"
        assert create.ai_properties == {}
        assert create.confidence == 0.9
        assert create.source == "explicit"

    def test_create_with_all_fields(self):
        """Test PersonCreate with all fields."""
        create = PersonCreate(
            name="Test Person",
            ai_properties={"profession": "Engineer"},
            confidence=0.8,
            source="inferred",
        )

        assert create.name == "Test Person"
        assert create.ai_properties == {"profession": "Engineer"}
        assert create.confidence == 0.8
        assert create.source == "inferred"

    def test_validate_name_length(self):
        """Test name length validation."""
        # Empty name should fail
        with pytest.raises(ValidationError):
            PersonCreate(name="")

        # Name too long should fail
        with pytest.raises(ValidationError):
            PersonCreate(name="x" * 256)


class TestPersonUpdate:
    """Tests for PersonUpdate model."""

    def test_update_all_fields_optional(self):
        """Test that all fields in PersonUpdate are optional."""
        update = PersonUpdate()

        assert update.name is None
        assert update.ai_properties is None

    def test_update_partial(self):
        """Test partial update."""
        update = PersonUpdate(
            name="New Name",
            ai_properties={"company": "New Company"},
        )

        assert update.name == "New Name"
        assert update.ai_properties == {"company": "New Company"}


class TestPersonResponse:
    """Tests for PersonResponse model."""

    def test_response_from_person(self):
        """Test creating response from person model."""
        now = datetime.utcnow()
        person = Person(
            id="person-123",
            tenant_id="tenant-456",
            user_id="user-789",
            name="Test Person",
            ai_properties={
                "profession": "Engineer",
                "topics": ["Python"],
                "communication_style": "casual",
            },
            created_at=now,
            updated_at=now,
            confidence=0.95,
            source="llm_extracted",
        )

        response = PersonResponse.from_person(person)

        assert response.id == person.id
        assert response.tenant_id == person.tenant_id
        assert response.user_id == person.user_id
        assert response.name == person.name
        assert response.ai_properties == person.ai_properties
        assert response.profession == "Engineer"
        assert response.topics == ["Python"]
        assert response.communication_style == "casual"
        assert response.confidence == 0.95
        assert response.source == "llm_extracted"

    def test_response_with_empty_ai_properties(self):
        """Test response when ai_properties is empty."""
        person = Person(
            id="person-123",
            tenant_id="tenant-456",
            user_id="user-789",
            name="Test Person",
        )

        response = PersonResponse.from_person(person)

        assert response.profession is None
        assert response.topics == []
        assert response.communication_style is None

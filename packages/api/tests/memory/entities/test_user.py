"""Unit tests for User entity.

NOTE (ADR-0003): Skills are stored as role-scoped attributes on relationship
contexts in Qdrant, not on the User entity.
"""

import pytest
from datetime import datetime
from pydantic import ValidationError
from fidus.memory.entities.user import User, UserCreate, UserUpdate, UserResponse


class TestUserEntity:
    """Tests for User entity model."""

    def test_create_user_with_required_fields(self):
        """Test creating a user with only required fields."""
        user = User(
            id="user-123",
            tenant_id="tenant-456",
            email="test@example.com",
            name="Test User",
        )

        assert user.id == "user-123"
        assert user.tenant_id == "tenant-456"
        assert user.email == "test@example.com"
        assert user.name == "Test User"
        assert user.preferred_language == "en"
        assert user.timezone == "UTC"
        assert user.ai_properties == {}

    def test_create_user_with_all_fields(self):
        """Test creating a user with all fields."""
        now = datetime.utcnow()
        user = User(
            id="user-123",
            tenant_id="tenant-456",
            email="test@example.com",
            name="Test User",
            preferred_language="de",
            timezone="Europe/Berlin",
            ai_properties={"interests": ["AI", "Music"]},
            created_at=now,
            updated_at=now,
        )

        assert user.preferred_language == "de"
        assert user.timezone == "Europe/Berlin"
        assert user.ai_properties == {"interests": ["AI", "Music"]}

    # NOTE (ADR-0003): Skills tests removed - skills now on relationship contexts

    def test_validate_language_valid(self):
        """Test that valid language codes are accepted."""
        valid_languages = ["en", "de", "fr", "es", "it", "pt", "nl", "pl", "ja", "zh", "ko"]
        for lang in valid_languages:
            user = User(
                id="user-123",
                tenant_id="tenant-456",
                email="test@example.com",
                name="Test User",
                preferred_language=lang,
            )
            assert user.preferred_language == lang

    def test_validate_language_invalid(self):
        """Test that invalid language codes raise error."""
        with pytest.raises(ValidationError) as exc_info:
            User(
                id="user-123",
                tenant_id="tenant-456",
                email="test@example.com",
                name="Test User",
                preferred_language="invalid",
            )
        assert "Language must be one of" in str(exc_info.value)

    def test_validate_email_format(self):
        """Test that invalid email format raises error."""
        with pytest.raises(ValidationError):
            User(
                id="user-123",
                tenant_id="tenant-456",
                email="not-an-email",
                name="Test User",
            )


class TestUserCreate:
    """Tests for UserCreate model."""

    def test_create_with_required_fields(self):
        """Test UserCreate with required fields only."""
        user_create = UserCreate(
            tenant_id="tenant-456",
            email="test@example.com",
            name="Test User",
        )

        assert user_create.tenant_id == "tenant-456"
        assert user_create.email == "test@example.com"
        assert user_create.name == "Test User"
        assert user_create.preferred_language == "en"
        assert user_create.timezone == "UTC"
        assert user_create.ai_properties == {}


class TestUserUpdate:
    """Tests for UserUpdate model."""

    def test_update_all_fields_optional(self):
        """Test that all fields in UserUpdate are optional."""
        update = UserUpdate()

        assert update.name is None
        assert update.preferred_language is None
        assert update.timezone is None
        assert update.ai_properties is None

    def test_update_partial(self):
        """Test partial update."""
        update = UserUpdate(name="New Name", ai_properties={"interest": "coding"})

        assert update.name == "New Name"
        assert update.ai_properties == {"interest": "coding"}
        assert update.preferred_language is None


class TestUserResponse:
    """Tests for UserResponse model."""

    def test_response_from_user(self):
        """Test creating response from user model."""
        now = datetime.utcnow()
        user = User(
            id="user-123",
            tenant_id="tenant-456",
            email="test@example.com",
            name="Test User",
            created_at=now,
            updated_at=now,
        )

        response = UserResponse(**user.model_dump())

        assert response.id == user.id
        assert response.email == user.email
        assert response.name == user.name

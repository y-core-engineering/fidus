"""Unit tests for UserRepository.

NOTE (ADR-0003): Skills are stored as role-scoped attributes on relationship
contexts in Qdrant, not on the User entity.
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from datetime import datetime

from fidus.memory.repositories.user_repository import UserRepository
from fidus.memory.entities.user import UserCreate, UserUpdate


class MockAsyncContextManager:
    """Mock async context manager for Neo4j session."""

    def __init__(self, session):
        self.session = session

    async def __aenter__(self):
        return self.session

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        pass


@pytest.fixture
def mock_neo4j_driver():
    """Create a mock Neo4j driver."""
    driver = MagicMock()
    return driver


@pytest.fixture
def user_repo(mock_neo4j_driver):
    """Create a UserRepository with mock driver."""
    return UserRepository(mock_neo4j_driver)


class TestUserRepositoryCreate:
    """Tests for UserRepository.create()."""

    @pytest.mark.asyncio
    async def test_create_user_success(self, user_repo, mock_neo4j_driver):
        """Test successful user creation."""
        user_data = UserCreate(
            tenant_id="tenant-1",
            email="test@example.com",
            name="Test User",
        )

        # Mock Neo4j response
        mock_session = AsyncMock()
        mock_neo4j_driver.session.return_value = MockAsyncContextManager(mock_session)

        mock_result = AsyncMock()
        mock_record = MagicMock()
        mock_record.__getitem__ = lambda self, key: {
            "u": {
                "id": "user-123",
                "tenant_id": "tenant-1",
                "email": "test@example.com",
                "name": "Test User",
                "preferred_language": "en",
                "timezone": "UTC",
                "ai_properties": "{}",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
            },
            "already_exists": False,
        }[key]
        mock_result.single = AsyncMock(return_value=mock_record)
        mock_session.run = AsyncMock(return_value=mock_result)

        user = await user_repo.create(user_data)

        assert user.id == "user-123"
        assert user.email == "test@example.com"
        mock_session.run.assert_called_once()

    @pytest.mark.asyncio
    async def test_create_user_duplicate_email(self, user_repo, mock_neo4j_driver):
        """Test user creation with duplicate email raises ValueError."""
        user_data = UserCreate(
            tenant_id="tenant-1",
            email="duplicate@example.com",
            name="Test User",
        )

        # Mock duplicate email scenario
        mock_session = AsyncMock()
        mock_neo4j_driver.session.return_value = MockAsyncContextManager(mock_session)

        mock_result = AsyncMock()
        mock_record = MagicMock()
        mock_record.__getitem__ = lambda self, key: {
            "u": None,
            "already_exists": True,
        }[key]
        mock_result.single = AsyncMock(return_value=mock_record)
        mock_session.run = AsyncMock(return_value=mock_result)

        with pytest.raises(ValueError, match="already exists"):
            await user_repo.create(user_data)


class TestUserRepositoryGet:
    """Tests for UserRepository.get()."""

    @pytest.mark.asyncio
    async def test_get_user_found(self, user_repo, mock_neo4j_driver):
        """Test getting an existing user."""
        mock_session = AsyncMock()
        mock_neo4j_driver.session.return_value = MockAsyncContextManager(mock_session)

        mock_result = AsyncMock()
        mock_record = MagicMock()
        mock_record.__getitem__ = lambda self, key: {
            "u": {
                "id": "user-123",
                "tenant_id": "tenant-1",
                "email": "test@example.com",
                "name": "Test User",
                "preferred_language": "en",
                "timezone": "UTC",
                "ai_properties": "{}",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
            },
        }[key]
        mock_result.single = AsyncMock(return_value=mock_record)
        mock_session.run = AsyncMock(return_value=mock_result)

        user = await user_repo.get("user-123", "tenant-1")

        assert user is not None
        assert user.id == "user-123"
        assert user.email == "test@example.com"

    @pytest.mark.asyncio
    async def test_get_user_not_found(self, user_repo, mock_neo4j_driver):
        """Test getting a non-existent user returns None."""
        mock_session = AsyncMock()
        mock_neo4j_driver.session.return_value = MockAsyncContextManager(mock_session)

        mock_result = AsyncMock()
        mock_result.single = AsyncMock(return_value=None)
        mock_session.run = AsyncMock(return_value=mock_result)

        user = await user_repo.get("non-existent", "tenant-1")

        assert user is None


class TestUserRepositoryUpdate:
    """Tests for UserRepository.update()."""

    @pytest.mark.asyncio
    async def test_update_user_success(self, user_repo, mock_neo4j_driver):
        """Test successful user update."""
        updates = UserUpdate(name="Updated Name")

        mock_session = AsyncMock()
        mock_neo4j_driver.session.return_value = MockAsyncContextManager(mock_session)

        mock_result = AsyncMock()
        mock_record = MagicMock()
        mock_record.__getitem__ = lambda self, key: {
            "u": {
                "id": "user-123",
                "tenant_id": "tenant-1",
                "email": "test@example.com",
                "name": "Updated Name",
                "preferred_language": "en",
                "timezone": "UTC",
                "ai_properties": "{}",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
            },
        }[key]
        mock_result.single = AsyncMock(return_value=mock_record)
        mock_session.run = AsyncMock(return_value=mock_result)

        user = await user_repo.update("user-123", "tenant-1", updates)

        assert user is not None
        assert user.name == "Updated Name"

    @pytest.mark.asyncio
    async def test_update_user_not_found(self, user_repo, mock_neo4j_driver):
        """Test updating a non-existent user returns None."""
        updates = UserUpdate(name="Updated Name")

        mock_session = AsyncMock()
        mock_neo4j_driver.session.return_value = MockAsyncContextManager(mock_session)

        mock_result = AsyncMock()
        mock_result.single = AsyncMock(return_value=None)
        mock_session.run = AsyncMock(return_value=mock_result)

        user = await user_repo.update("non-existent", "tenant-1", updates)

        assert user is None


class TestUserRepositoryDelete:
    """Tests for UserRepository.delete()."""

    @pytest.mark.asyncio
    async def test_delete_user_success(self, user_repo, mock_neo4j_driver):
        """Test GDPR cascade delete removes user and all related data."""
        mock_session = AsyncMock()
        mock_neo4j_driver.session.return_value = MockAsyncContextManager(mock_session)

        mock_result = AsyncMock()
        mock_record = MagicMock()
        mock_record.__getitem__ = lambda self, key: {"deleted_count": 1}[key]
        mock_result.single = AsyncMock(return_value=mock_record)
        mock_session.run = AsyncMock(return_value=mock_result)

        deleted = await user_repo.delete("user-123", "tenant-1")

        assert deleted is True
        mock_session.run.assert_called_once()

    @pytest.mark.asyncio
    async def test_delete_user_not_found(self, user_repo, mock_neo4j_driver):
        """Test deleting a non-existent user returns False."""
        mock_session = AsyncMock()
        mock_neo4j_driver.session.return_value = MockAsyncContextManager(mock_session)

        mock_result = AsyncMock()
        mock_record = MagicMock()
        mock_record.__getitem__ = lambda self, key: {"deleted_count": 0}[key]
        mock_result.single = AsyncMock(return_value=mock_record)
        mock_session.run = AsyncMock(return_value=mock_result)

        deleted = await user_repo.delete("non-existent", "tenant-1")

        assert deleted is False


class TestUserRepositoryListByTenant:
    """Tests for UserRepository.list_by_tenant()."""

    @pytest.mark.asyncio
    async def test_list_users_success(self, user_repo, mock_neo4j_driver):
        """Test listing users for a tenant."""
        mock_session = AsyncMock()
        mock_neo4j_driver.session.return_value = MockAsyncContextManager(mock_session)

        # Create mock records as an async iterator
        mock_records = []
        for i in range(3):
            mock_record = MagicMock()
            mock_record.__getitem__ = lambda self, key, idx=i: {
                "u": {
                    "id": f"user-{idx}",
                    "tenant_id": "tenant-1",
                    "email": f"user{idx}@example.com",
                    "name": f"User {idx}",
                    "preferred_language": "en",
                    "timezone": "UTC",
                    "ai_properties": "{}",
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow(),
                },
            }[key]
            mock_records.append(mock_record)

        mock_result = AsyncMock()

        async def async_iter():
            for record in mock_records:
                yield record

        mock_result.__aiter__ = lambda self: async_iter()
        mock_session.run = AsyncMock(return_value=mock_result)

        users = await user_repo.list_by_tenant("tenant-1", limit=10)

        assert len(users) == 3

    @pytest.mark.asyncio
    async def test_list_users_empty(self, user_repo, mock_neo4j_driver):
        """Test listing users for a tenant with no users."""
        mock_session = AsyncMock()
        mock_neo4j_driver.session.return_value = MockAsyncContextManager(mock_session)

        mock_result = AsyncMock()

        async def async_iter():
            return
            yield  # Make this a generator

        mock_result.__aiter__ = lambda self: async_iter()
        mock_session.run = AsyncMock(return_value=mock_result)

        users = await user_repo.list_by_tenant("tenant-1")

        assert len(users) == 0

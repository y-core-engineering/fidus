"""Tests for Neo4j preference store.

These tests verify the Neo4j client implementation including:
- Connection management
- CRUD operations
- Multi-tenancy enforcement
- Confidence scoring
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fidus.infrastructure.neo4j_client import Neo4jPreferenceStore
from fidus.config import PrototypeConfig


@pytest.fixture
def mock_config():
    """Create a mock configuration."""
    config = MagicMock(spec=PrototypeConfig)
    config.neo4j_uri = "bolt://localhost:7687"
    config.neo4j_user = "neo4j"
    config.neo4j_password = "password"
    return config


@pytest.fixture
def store(mock_config):
    """Create a Neo4jPreferenceStore instance."""
    return Neo4jPreferenceStore(mock_config)


@pytest.fixture
def mock_driver():
    """Create a mock Neo4j driver."""
    driver = MagicMock()
    session = AsyncMock()

    # Create proper async context manager
    async def session_context():
        return session

    # Mock session() to return an async context manager
    context_mgr = MagicMock()
    context_mgr.__aenter__ = AsyncMock(return_value=session)
    context_mgr.__aexit__ = AsyncMock(return_value=None)
    driver.session.return_value = context_mgr
    driver.verify_connectivity = AsyncMock()
    driver.close = AsyncMock()

    return driver, session


class TestConnection:
    """Tests for connection management."""

    @pytest.mark.asyncio
    async def test_connect_success(self, store, mock_driver):
        """Should successfully connect to Neo4j."""
        driver, session = mock_driver

        with patch(
            "fidus.infrastructure.neo4j_client.AsyncGraphDatabase.driver",
            return_value=driver,
        ):
            await store.connect()

            # Verify connection was established
            driver.verify_connectivity.assert_called_once()

            # Verify constraints were created
            assert session.run.call_count >= 3  # At least 3 constraints/indexes

    @pytest.mark.asyncio
    async def test_disconnect(self, store, mock_driver):
        """Should properly disconnect from Neo4j."""
        driver, _ = mock_driver

        with patch(
            "fidus.infrastructure.neo4j_client.AsyncGraphDatabase.driver",
            return_value=driver,
        ):
            await store.connect()
            await store.disconnect()

            # Verify driver was closed
            driver.close.assert_called_once()


class TestCreatePreference:
    """Tests for creating preferences."""

    @pytest.mark.asyncio
    async def test_create_preference_success(self, store, mock_driver):
        """Should create a preference with correct attributes."""
        driver, session = mock_driver

        # Mock the result
        mock_record = MagicMock()
        mock_record.__getitem__.return_value = {
            "id": "test-id",
            "tenant_id": "tenant-1",
            "key": "food.cappuccino",
            "sentiment": "positive",
            "confidence": 0.5,
            "domain": "food",
        }
        mock_result = AsyncMock()
        mock_result.single.return_value = mock_record
        session.run.return_value = mock_result

        with patch(
            "fidus.infrastructure.neo4j_client.AsyncGraphDatabase.driver",
            return_value=driver,
        ):
            await store.connect()
            preference = await store.create_preference(
                tenant_id="tenant-1",
                key="food.cappuccino",
                sentiment="positive",
                confidence=0.5,
            )

            # Verify preference was created
            assert preference["key"] == "food.cappuccino"
            assert preference["sentiment"] == "positive"
            assert preference["confidence"] == 0.5
            assert preference["domain"] == "food"
            assert preference["tenant_id"] == "tenant-1"

    @pytest.mark.asyncio
    async def test_create_preference_extracts_domain(self, store, mock_driver):
        """Should extract domain from key."""
        driver, session = mock_driver

        mock_record = MagicMock()
        mock_record.__getitem__.return_value = {
            "id": "test-id",
            "key": "lifestyle.mornings",
            "domain": "lifestyle",
        }
        mock_result = AsyncMock()
        mock_result.single.return_value = mock_record
        session.run.return_value = mock_result

        with patch(
            "fidus.infrastructure.neo4j_client.AsyncGraphDatabase.driver",
            return_value=driver,
        ):
            await store.connect()
            await store.create_preference(
                tenant_id="tenant-1",
                key="lifestyle.mornings",
                sentiment="negative",
            )

            # Verify domain extraction
            call_kwargs = session.run.call_args[1]
            assert call_kwargs["domain"] == "lifestyle"

    @pytest.mark.asyncio
    async def test_create_preference_invalid_confidence(self, store, mock_driver):
        """Should reject invalid confidence values."""
        driver, _ = mock_driver

        with patch(
            "fidus.infrastructure.neo4j_client.AsyncGraphDatabase.driver",
            return_value=driver,
        ):
            await store.connect()

            # Test confidence > 0.95
            with pytest.raises(ValueError, match="Confidence must be between"):
                await store.create_preference(
                    tenant_id="tenant-1",
                    key="test.key",
                    sentiment="positive",
                    confidence=1.0,
                )

            # Test confidence < 0.0
            with pytest.raises(ValueError, match="Confidence must be between"):
                await store.create_preference(
                    tenant_id="tenant-1",
                    key="test.key",
                    sentiment="positive",
                    confidence=-0.1,
                )

    @pytest.mark.asyncio
    async def test_create_preference_without_connection(self, store):
        """Should raise error if not connected."""
        with pytest.raises(RuntimeError, match="Driver not initialized"):
            await store.create_preference(
                tenant_id="tenant-1",
                key="test.key",
                sentiment="positive",
            )


class TestGetPreferences:
    """Tests for retrieving preferences."""

    @pytest.mark.asyncio
    async def test_get_preferences_success(self, store, mock_driver):
        """Should retrieve all preferences for a tenant."""
        driver, session = mock_driver

        # Mock multiple records
        mock_result = AsyncMock()
        mock_result.__aiter__.return_value = [
            {"p": {"id": "1", "key": "food.cappuccino", "tenant_id": "tenant-1"}},
            {"p": {"id": "2", "key": "food.tea", "tenant_id": "tenant-1"}},
        ]
        session.run.return_value = mock_result

        with patch(
            "fidus.infrastructure.neo4j_client.AsyncGraphDatabase.driver",
            return_value=driver,
        ):
            await store.connect()
            preferences = await store.get_preferences(tenant_id="tenant-1")

            # Verify preferences were retrieved
            assert len(preferences) == 2
            assert preferences[0]["key"] == "food.cappuccino"
            assert preferences[1]["key"] == "food.tea"

            # Verify query used correct tenant_id
            call_kwargs = session.run.call_args[1]
            assert call_kwargs["tenant_id"] == "tenant-1"

    @pytest.mark.asyncio
    async def test_get_preferences_empty(self, store, mock_driver):
        """Should return empty list for tenant with no preferences."""
        driver, session = mock_driver

        mock_result = AsyncMock()
        mock_result.__aiter__.return_value = []
        session.run.return_value = mock_result

        with patch(
            "fidus.infrastructure.neo4j_client.AsyncGraphDatabase.driver",
            return_value=driver,
        ):
            await store.connect()
            preferences = await store.get_preferences(tenant_id="tenant-1")

            assert preferences == []


class TestUpdateConfidence:
    """Tests for confidence score updates."""

    @pytest.mark.asyncio
    async def test_update_confidence_increase(self, store, mock_driver):
        """Should increase confidence on accept."""
        driver, session = mock_driver

        mock_record = MagicMock()
        mock_record.__getitem__.return_value = {
            "id": "pref-1",
            "confidence": 0.6,  # 0.5 + 0.1
        }
        mock_result = AsyncMock()
        mock_result.single.return_value = mock_record
        session.run.return_value = mock_result

        with patch(
            "fidus.infrastructure.neo4j_client.AsyncGraphDatabase.driver",
            return_value=driver,
        ):
            await store.connect()
            updated = await store.update_confidence(
                tenant_id="tenant-1",
                preference_id="pref-1",
                delta=0.1,
            )

            assert updated["confidence"] == 0.6

    @pytest.mark.asyncio
    async def test_update_confidence_decrease(self, store, mock_driver):
        """Should decrease confidence on reject."""
        driver, session = mock_driver

        mock_record = MagicMock()
        mock_record.__getitem__.return_value = {
            "id": "pref-1",
            "confidence": 0.35,  # 0.5 - 0.15
        }
        mock_result = AsyncMock()
        mock_result.single.return_value = mock_record
        session.run.return_value = mock_result

        with patch(
            "fidus.infrastructure.neo4j_client.AsyncGraphDatabase.driver",
            return_value=driver,
        ):
            await store.connect()
            updated = await store.update_confidence(
                tenant_id="tenant-1",
                preference_id="pref-1",
                delta=-0.15,
            )

            assert updated["confidence"] == 0.35

    @pytest.mark.asyncio
    async def test_update_confidence_not_found(self, store, mock_driver):
        """Should raise error if preference not found."""
        driver, session = mock_driver

        mock_result = AsyncMock()
        mock_result.single.return_value = None
        session.run.return_value = mock_result

        with patch(
            "fidus.infrastructure.neo4j_client.AsyncGraphDatabase.driver",
            return_value=driver,
        ):
            await store.connect()

            with pytest.raises(ValueError, match="not found"):
                await store.update_confidence(
                    tenant_id="tenant-1",
                    preference_id="nonexistent",
                    delta=0.1,
                )


class TestDeletePreference:
    """Tests for deleting preferences."""

    @pytest.mark.asyncio
    async def test_delete_preference_success(self, store, mock_driver):
        """Should delete a preference."""
        driver, session = mock_driver

        mock_record = MagicMock()
        mock_record.__getitem__.return_value = 1
        mock_result = AsyncMock()
        mock_result.single.return_value = mock_record
        session.run.return_value = mock_result

        with patch(
            "fidus.infrastructure.neo4j_client.AsyncGraphDatabase.driver",
            return_value=driver,
        ):
            await store.connect()
            deleted = await store.delete_preference(
                tenant_id="tenant-1",
                preference_id="pref-1",
            )

            assert deleted is True

            # Verify tenant_id was checked
            call_kwargs = session.run.call_args[1]
            assert call_kwargs["tenant_id"] == "tenant-1"

    @pytest.mark.asyncio
    async def test_delete_preference_not_found(self, store, mock_driver):
        """Should return False if preference not found."""
        driver, session = mock_driver

        mock_record = MagicMock()
        mock_record.__getitem__.return_value = 0
        mock_result = AsyncMock()
        mock_result.single.return_value = mock_record
        session.run.return_value = mock_result

        with patch(
            "fidus.infrastructure.neo4j_client.AsyncGraphDatabase.driver",
            return_value=driver,
        ):
            await store.connect()
            deleted = await store.delete_preference(
                tenant_id="tenant-1",
                preference_id="nonexistent",
            )

            assert deleted is False


class TestDeleteAllPreferences:
    """Tests for deleting all preferences."""

    @pytest.mark.asyncio
    async def test_delete_all_preferences(self, store, mock_driver):
        """Should delete all preferences for a tenant."""
        driver, session = mock_driver

        mock_record = MagicMock()
        mock_record.__getitem__.return_value = 5
        mock_result = AsyncMock()
        mock_result.single.return_value = mock_record
        session.run.return_value = mock_result

        with patch(
            "fidus.infrastructure.neo4j_client.AsyncGraphDatabase.driver",
            return_value=driver,
        ):
            await store.connect()
            count = await store.delete_all_preferences(tenant_id="tenant-1")

            assert count == 5

            # Verify tenant_id was used
            call_kwargs = session.run.call_args[1]
            assert call_kwargs["tenant_id"] == "tenant-1"


class TestMultiTenancy:
    """Tests for multi-tenancy enforcement."""

    @pytest.mark.asyncio
    async def test_tenant_isolation(self, store, mock_driver):
        """Should enforce tenant isolation in all operations."""
        driver, session = mock_driver

        # Mock result with tenant check
        mock_result = AsyncMock()
        mock_result.__aiter__.return_value = []
        session.run.return_value = mock_result

        with patch(
            "fidus.infrastructure.neo4j_client.AsyncGraphDatabase.driver",
            return_value=driver,
        ):
            await store.connect()

            # All operations should use tenant_id in query
            await store.get_preferences(tenant_id="tenant-1")
            call_kwargs = session.run.call_args[1]
            assert "tenant_id" in call_kwargs
            assert call_kwargs["tenant_id"] == "tenant-1"

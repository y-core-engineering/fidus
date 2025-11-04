"""Tests for PersistentAgent.

These tests verify the persistent agent implementation including:
- Neo4j connection management
- Preference persistence
- Accept/reject functionality
- Confidence score updates
- Multi-tenancy enforcement
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fidus.memory.persistent_agent import PersistentAgent
from fidus.infrastructure.neo4j_client import Neo4jPreferenceStore


@pytest.fixture
def mock_neo4j_store():
    """Create a mock Neo4jPreferenceStore."""
    store = AsyncMock(spec=Neo4jPreferenceStore)
    store.connect = AsyncMock()
    store.disconnect = AsyncMock()
    store.get_preferences = AsyncMock(return_value=[])
    store.create_preference = AsyncMock()
    store.update_confidence = AsyncMock()
    store.delete_preference = AsyncMock(return_value=True)
    store.delete_all_preferences = AsyncMock(return_value=0)
    return store


@pytest.fixture
def agent(mock_neo4j_store):
    """Create a PersistentAgent with mocked store."""
    agent = PersistentAgent(tenant_id="test-tenant")
    agent.store = mock_neo4j_store
    return agent


class TestConnection:
    """Tests for connection management."""

    @pytest.mark.asyncio
    async def test_connect_success(self, agent, mock_neo4j_store):
        """Should successfully connect to Neo4j and load preferences."""
        mock_neo4j_store.get_preferences.return_value = [
            {
                "id": "pref-1",
                "key": "food.coffee",
                "value": "likes it",
                "sentiment": "positive",
                "confidence": 0.8,
            }
        ]

        await agent.connect()

        # Verify connection established
        assert agent._connected is True
        mock_neo4j_store.connect.assert_called_once()

        # Verify preferences loaded
        mock_neo4j_store.get_preferences.assert_called_once_with("test-tenant")
        assert "food.coffee" in agent.preferences
        assert agent.preferences["food.coffee"]["confidence"] == 0.8

    @pytest.mark.asyncio
    async def test_disconnect(self, agent, mock_neo4j_store):
        """Should properly disconnect from Neo4j."""
        agent._connected = True

        await agent.disconnect()

        assert agent._connected is False
        mock_neo4j_store.disconnect.assert_called_once()

    @pytest.mark.asyncio
    async def test_operations_without_connection(self, agent):
        """Should raise error when operations attempted without connection."""
        agent._connected = False

        with pytest.raises(RuntimeError, match="Not connected to Neo4j"):
            await agent.accept_preference("pref-1")

        with pytest.raises(RuntimeError, match="Not connected to Neo4j"):
            await agent.reject_preference("pref-1")

        with pytest.raises(RuntimeError, match="Not connected to Neo4j"):
            await agent.delete_preference("pref-1")


class TestAcceptPreference:
    """Tests for accepting preferences."""

    @pytest.mark.asyncio
    async def test_accept_increases_confidence(self, agent, mock_neo4j_store):
        """Should increase confidence by +0.1 on accept."""
        agent._connected = True
        agent.preferences = {
            "food.coffee": {
                "value": "likes it",
                "sentiment": "positive",
                "confidence": 0.8,
                "id": "pref-1",
            }
        }

        mock_neo4j_store.update_confidence.return_value = {
            "id": "pref-1",
            "key": "food.coffee",
            "confidence": 0.9,
        }

        result = await agent.accept_preference("pref-1")

        # Verify Neo4j was updated with correct delta
        mock_neo4j_store.update_confidence.assert_called_once_with(
            tenant_id="test-tenant",
            preference_id="pref-1",
            delta=0.1,
        )

        # Verify result
        assert result["confidence"] == 0.9

        # Verify in-memory cache updated
        assert agent.preferences["food.coffee"]["confidence"] == 0.9

    @pytest.mark.asyncio
    async def test_accept_caps_at_0_95(self, agent, mock_neo4j_store):
        """Should cap confidence at 0.95."""
        agent._connected = True
        agent.preferences = {
            "food.coffee": {
                "value": "likes it",
                "sentiment": "positive",
                "confidence": 0.9,
                "id": "pref-1",
            }
        }

        mock_neo4j_store.update_confidence.return_value = {
            "id": "pref-1",
            "key": "food.coffee",
            "confidence": 0.95,  # Capped at max
        }

        result = await agent.accept_preference("pref-1")

        assert result["confidence"] == 0.95
        assert agent.preferences["food.coffee"]["confidence"] == 0.95

    @pytest.mark.asyncio
    async def test_accept_not_found(self, agent, mock_neo4j_store):
        """Should raise error if preference not found."""
        agent._connected = True

        mock_neo4j_store.update_confidence.side_effect = ValueError("Preference not found")

        with pytest.raises(ValueError, match="not found"):
            await agent.accept_preference("nonexistent")


class TestRejectPreference:
    """Tests for rejecting preferences."""

    @pytest.mark.asyncio
    async def test_reject_decreases_confidence(self, agent, mock_neo4j_store):
        """Should decrease confidence by -0.15 on reject."""
        agent._connected = True
        agent.preferences = {
            "food.broccoli": {
                "value": "hates it",
                "sentiment": "negative",
                "confidence": 0.8,
                "id": "pref-1",
            }
        }

        mock_neo4j_store.update_confidence.return_value = {
            "id": "pref-1",
            "key": "food.broccoli",
            "confidence": 0.65,
        }

        result = await agent.reject_preference("pref-1")

        # Verify Neo4j was updated with correct delta
        mock_neo4j_store.update_confidence.assert_called_once_with(
            tenant_id="test-tenant",
            preference_id="pref-1",
            delta=-0.15,
        )

        # Verify result
        assert result["confidence"] == 0.65

        # Verify in-memory cache updated
        assert agent.preferences["food.broccoli"]["confidence"] == 0.65

    @pytest.mark.asyncio
    async def test_reject_deletes_when_zero(self, agent, mock_neo4j_store):
        """Should delete preference when confidence reaches 0."""
        agent._connected = True
        agent.preferences = {
            "food.test": {
                "value": "test",
                "sentiment": "positive",
                "confidence": 0.1,
                "id": "pref-1",
            }
        }

        mock_neo4j_store.update_confidence.return_value = {
            "id": "pref-1",
            "key": "food.test",
            "confidence": 0.0,
        }

        await agent.reject_preference("pref-1")

        # Verify delete was called
        mock_neo4j_store.delete_preference.assert_called_once_with(
            tenant_id="test-tenant",
            preference_id="pref-1",
        )


class TestDeletePreference:
    """Tests for deleting preferences."""

    @pytest.mark.asyncio
    async def test_delete_preference_success(self, agent, mock_neo4j_store):
        """Should delete preference from both Neo4j and memory."""
        agent._connected = True
        agent.preferences = {
            "food.coffee": {
                "value": "likes it",
                "sentiment": "positive",
                "confidence": 0.8,
                "id": "pref-1",
            }
        }

        mock_neo4j_store.delete_preference.return_value = True

        result = await agent.delete_preference("pref-1")

        # Verify Neo4j was called
        mock_neo4j_store.delete_preference.assert_called_once_with(
            tenant_id="test-tenant",
            preference_id="pref-1",
        )

        # Verify deleted
        assert result is True

        # Verify removed from memory
        assert "food.coffee" not in agent.preferences

    @pytest.mark.asyncio
    async def test_delete_preference_not_found(self, agent, mock_neo4j_store):
        """Should return False if preference not found."""
        agent._connected = True

        mock_neo4j_store.delete_preference.return_value = False

        result = await agent.delete_preference("nonexistent")

        assert result is False


class TestDeleteAllPreferences:
    """Tests for deleting all preferences."""

    @pytest.mark.asyncio
    async def test_delete_all_preferences(self, agent, mock_neo4j_store):
        """Should delete all preferences for tenant."""
        agent._connected = True
        agent.preferences = {
            "food.coffee": {"value": "likes it", "confidence": 0.8},
            "food.tea": {"value": "likes it", "confidence": 0.7},
        }

        mock_neo4j_store.delete_all_preferences.return_value = 2

        count = await agent.delete_all_preferences()

        # Verify Neo4j was called
        mock_neo4j_store.delete_all_preferences.assert_called_once_with("test-tenant")

        # Verify count
        assert count == 2

        # Verify memory cleared
        assert len(agent.preferences) == 0


class TestPreferencePersistence:
    """Tests for preference persistence."""

    @pytest.mark.asyncio
    async def test_persist_pending_saves(self, agent, mock_neo4j_store):
        """Should persist pending preferences to Neo4j."""
        agent._connected = True

        # Simulate pending saves and in-memory preference
        agent.preferences = {
            "food.pizza": {
                "value": "loves it",
                "sentiment": "positive",
                "confidence": 0.8,
            }
        }
        agent._pending_saves = [
            {
                "key": "food.pizza",
                "value": "loves it",
                "sentiment": "positive",
                "confidence": 0.8,
            }
        ]

        mock_neo4j_store.create_preference.return_value = {
            "id": "new-pref-1",
            "key": "food.pizza",
            "value": "loves it",
            "sentiment": "positive",
            "confidence": 0.8,
        }

        await agent._persist_pending_saves()

        # Verify Neo4j create was called
        mock_neo4j_store.create_preference.assert_called_once()
        call_kwargs = mock_neo4j_store.create_preference.call_args[1]
        assert call_kwargs["tenant_id"] == "test-tenant"
        assert call_kwargs["key"] == "food.pizza"
        assert call_kwargs["sentiment"] == "positive"

        # Verify pending saves cleared
        assert len(agent._pending_saves) == 0

        # Verify Neo4j ID added to memory
        assert agent.preferences["food.pizza"]["id"] == "new-pref-1"


class TestMultiTenancy:
    """Tests for multi-tenancy enforcement."""

    @pytest.mark.asyncio
    async def test_tenant_isolation(self, mock_neo4j_store):
        """Should enforce tenant isolation in all operations."""
        agent1 = PersistentAgent(tenant_id="tenant-1")
        agent1.store = mock_neo4j_store
        agent1._connected = True

        agent2 = PersistentAgent(tenant_id="tenant-2")
        agent2.store = mock_neo4j_store
        agent2._connected = True

        # Both agents use same store but different tenant_ids
        mock_neo4j_store.get_preferences.return_value = []

        await agent1.get_all_preferences()
        mock_neo4j_store.get_preferences.assert_called_with("tenant-1")

        await agent2.get_all_preferences()
        mock_neo4j_store.get_preferences.assert_called_with("tenant-2")

    @pytest.mark.asyncio
    async def test_all_operations_use_tenant_id(self, agent, mock_neo4j_store):
        """Should pass tenant_id to all store operations."""
        agent._connected = True

        # Test accept
        mock_neo4j_store.update_confidence.return_value = {
            "id": "p1",
            "key": "test",
            "confidence": 0.9,
        }
        await agent.accept_preference("p1")
        assert mock_neo4j_store.update_confidence.call_args[1]["tenant_id"] == "test-tenant"

        # Test reject
        await agent.reject_preference("p1")
        assert mock_neo4j_store.update_confidence.call_args[1]["tenant_id"] == "test-tenant"

        # Test delete
        await agent.delete_preference("p1")
        assert mock_neo4j_store.delete_preference.call_args[1]["tenant_id"] == "test-tenant"

        # Test delete all
        await agent.delete_all_preferences()
        mock_neo4j_store.delete_all_preferences.assert_called_with("test-tenant")


class TestGetAllPreferences:
    """Tests for retrieving all preferences."""

    @pytest.mark.asyncio
    async def test_get_all_preferences(self, agent, mock_neo4j_store):
        """Should retrieve all preferences from Neo4j."""
        agent._connected = True

        mock_neo4j_store.get_preferences.return_value = [
            {
                "id": "pref-1",
                "key": "food.coffee",
                "value": "likes it",
                "sentiment": "positive",
                "confidence": 0.8,
            },
            {
                "id": "pref-2",
                "key": "food.tea",
                "value": "loves it",
                "sentiment": "positive",
                "confidence": 0.9,
            },
        ]

        preferences = await agent.get_all_preferences()

        # Verify store was called
        mock_neo4j_store.get_preferences.assert_called_once_with("test-tenant")

        # Verify result
        assert len(preferences) == 2
        assert preferences[0]["key"] == "food.coffee"
        assert preferences[1]["key"] == "food.tea"

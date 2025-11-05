"""Tests for context storage service."""

from datetime import datetime
from unittest.mock import AsyncMock, Mock, patch
from uuid import UUID

import pytest

from fidus.memory.context.models import ContextFactors, Situation
from fidus.memory.context.storage import ContextStorageService


class TestContextStorageService:
    """Tests for ContextStorageService."""

    @pytest.fixture
    def mock_neo4j_driver(self) -> Mock:
        """Create mock Neo4j driver."""
        driver = Mock()
        driver.close = AsyncMock()

        # Mock session context manager
        session = Mock()
        session.__aenter__ = AsyncMock(return_value=session)
        session.__aexit__ = AsyncMock()
        session.execute_write = AsyncMock()
        session.execute_read = AsyncMock()

        driver.session = Mock(return_value=session)

        return driver

    @pytest.fixture
    def mock_qdrant_client(self) -> Mock:
        """Create mock Qdrant client."""
        client = Mock()
        client.upsert = Mock()
        client.retrieve = Mock()
        return client

    @pytest.fixture
    def mock_embedding_service(self) -> Mock:
        """Create mock embedding service."""
        return Mock()

    @pytest.fixture
    def storage(
        self,
        mock_neo4j_driver: Mock,
        mock_qdrant_client: Mock,
        mock_embedding_service: Mock,
    ) -> ContextStorageService:
        """Create storage service with mocked dependencies."""
        return ContextStorageService(
            neo4j_driver=mock_neo4j_driver,
            qdrant_client=mock_qdrant_client,
            embedding_service=mock_embedding_service,
        )

    @pytest.mark.asyncio
    async def test_store_situation(
        self,
        storage: ContextStorageService,
        mock_neo4j_driver: Mock,
        mock_qdrant_client: Mock,
    ) -> None:
        """Should store situation in both Neo4j and Qdrant."""
        context = ContextFactors(
            factors={
                "time_of_day": "morning",
                "mood": "energetic",
            }
        )
        embedding = [0.1] * 768

        with patch("fidus.memory.context.storage.uuid.uuid4") as mock_uuid:
            mock_uuid.return_value = UUID("12345678-1234-5678-1234-567812345678")

            situation = await storage.store_situation(
                context=context,
                embedding=embedding,
                tenant_id="tenant-1",
                user_id="user-1",
            )

        # Should call Neo4j execute_write
        session = await mock_neo4j_driver.session().__aenter__()
        session.execute_write.assert_called_once()

        # Should call Qdrant upsert
        mock_qdrant_client.upsert.assert_called_once()
        upsert_call = mock_qdrant_client.upsert.call_args

        assert upsert_call.kwargs["collection_name"] == "situations"
        point = upsert_call.kwargs["points"][0]
        assert point.id == "12345678-1234-5678-1234-567812345678"
        assert point.vector == embedding
        assert point.payload["tenant_id"] == "tenant-1"
        assert point.payload["user_id"] == "user-1"
        assert point.payload["factors"] == context.factors

        # Should return Situation instance
        assert isinstance(situation, Situation)
        assert situation.id == "12345678-1234-5678-1234-567812345678"
        assert situation.tenant_id == "tenant-1"
        assert situation.user_id == "user-1"
        assert situation.context.factors == context.factors
        assert situation.embedding == embedding


    @pytest.mark.asyncio
    async def test_store_situation_qdrant_failure(
        self,
        storage: ContextStorageService,
        mock_qdrant_client: Mock,
    ) -> None:
        """Should raise exception if Qdrant storage fails."""
        context = ContextFactors(factors={"mood": "happy"})
        embedding = [0.1] * 768

        # Mock Qdrant failure
        mock_qdrant_client.upsert.side_effect = Exception("Qdrant is down")

        with pytest.raises(Exception) as exc_info:
            await storage.store_situation(
                context=context,
                embedding=embedding,
                tenant_id="tenant-1",
                user_id="user-1",
            )

        assert "Qdrant is down" in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_link_preference_to_situation(
        self,
        storage: ContextStorageService,
        mock_neo4j_driver: Mock,
    ) -> None:
        """Should create IN_SITUATION relationship in Neo4j."""
        # Mock successful relationship creation
        session = await mock_neo4j_driver.session().__aenter__()
        session.execute_write.return_value = True

        await storage.link_preference_to_situation(
            preference_id="pref-123",
            situation_id="sit-456",
            tenant_id="tenant-1",
        )

        # Should call Neo4j execute_write
        session.execute_write.assert_called_once()


    @pytest.mark.asyncio
    async def test_get_situation_by_id(
        self,
        storage: ContextStorageService,
        mock_neo4j_driver: Mock,
        mock_qdrant_client: Mock,
    ) -> None:
        """Should retrieve situation from both Neo4j and Qdrant."""
        # Mock Neo4j response
        session = await mock_neo4j_driver.session().__aenter__()
        session.execute_read.return_value = {
            "id": "sit-123",
            "tenant_id": "tenant-1",
            "user_id": "user-1",
            "factors": {"time_of_day": "morning", "mood": "energetic"},
            "created_at": "2024-01-01T10:00:00",
            "updated_at": "2024-01-01T10:00:00",
        }

        # Mock Qdrant response
        mock_point = Mock()
        mock_point.id = "sit-123"
        mock_point.vector = [0.1] * 768
        mock_point.payload = {
            "tenant_id": "tenant-1",
            "user_id": "user-1",
            "factors": {"time_of_day": "morning", "mood": "energetic"},
            "created_at": "2024-01-01T10:00:00",
            "updated_at": "2024-01-01T10:00:00",
        }
        mock_qdrant_client.retrieve.return_value = [mock_point]

        situation = await storage.get_situation_by_id(
            situation_id="sit-123",
            tenant_id="tenant-1",
        )

        # Should call Neo4j execute_read
        session.execute_read.assert_called_once()

        # Should call Qdrant retrieve
        mock_qdrant_client.retrieve.assert_called_once_with(
            collection_name="situations",
            ids=["sit-123"],
        )

        # Should return Situation instance
        assert isinstance(situation, Situation)
        assert situation.id == "sit-123"
        assert situation.tenant_id == "tenant-1"
        assert situation.user_id == "user-1"
        assert situation.context.factors["time_of_day"] == "morning"
        assert situation.context.factors["mood"] == "energetic"
        assert situation.embedding == [0.1] * 768

    @pytest.mark.asyncio
    async def test_get_situation_by_id_not_found(
        self,
        storage: ContextStorageService,
        mock_neo4j_driver: Mock,
    ) -> None:
        """Should return None if situation not found in Neo4j."""
        # Mock Neo4j returning None
        session = await mock_neo4j_driver.session().__aenter__()
        session.execute_read.return_value = None

        situation = await storage.get_situation_by_id(
            situation_id="sit-123",
            tenant_id="tenant-1",
        )

        assert situation is None

    @pytest.mark.asyncio
    async def test_get_situation_by_id_qdrant_missing(
        self,
        storage: ContextStorageService,
        mock_neo4j_driver: Mock,
        mock_qdrant_client: Mock,
    ) -> None:
        """Should handle missing Qdrant embedding gracefully."""
        # Mock Neo4j response
        session = await mock_neo4j_driver.session().__aenter__()
        session.execute_read.return_value = {
            "id": "sit-123",
            "tenant_id": "tenant-1",
            "user_id": "user-1",
            "factors": {"time_of_day": "morning"},
            "created_at": "2024-01-01T10:00:00",
            "updated_at": "2024-01-01T10:00:00",
        }

        # Mock Qdrant returning empty list
        mock_qdrant_client.retrieve.return_value = []

        situation = await storage.get_situation_by_id(
            situation_id="sit-123",
            tenant_id="tenant-1",
        )

        # Should still return situation, but with None embedding
        assert isinstance(situation, Situation)
        assert situation.id == "sit-123"
        assert situation.embedding is None

    @pytest.mark.asyncio
    async def test_get_situation_by_id_tenant_mismatch(
        self,
        storage: ContextStorageService,
        mock_neo4j_driver: Mock,
        mock_qdrant_client: Mock,
    ) -> None:
        """Should return None if Qdrant tenant_id doesn't match."""
        # Mock Neo4j response
        session = await mock_neo4j_driver.session().__aenter__()
        session.execute_read.return_value = {
            "id": "sit-123",
            "tenant_id": "tenant-1",
            "user_id": "user-1",
            "factors": {"time_of_day": "morning"},
            "created_at": "2024-01-01T10:00:00",
            "updated_at": "2024-01-01T10:00:00",
        }

        # Mock Qdrant response with different tenant_id
        mock_point = Mock()
        mock_point.id = "sit-123"
        mock_point.vector = [0.1] * 768
        mock_point.payload = {
            "tenant_id": "tenant-2",  # Different tenant!
            "user_id": "user-1",
        }
        mock_qdrant_client.retrieve.return_value = [mock_point]

        situation = await storage.get_situation_by_id(
            situation_id="sit-123",
            tenant_id="tenant-1",
        )

        # Should return None due to tenant mismatch
        assert situation is None

    @pytest.mark.asyncio
    async def test_close_connections(
        self,
        storage: ContextStorageService,
        mock_neo4j_driver: Mock,
    ) -> None:
        """Should close Neo4j driver connection."""
        await storage.close()

        mock_neo4j_driver.close.assert_called_once()

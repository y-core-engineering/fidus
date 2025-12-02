"""Unit tests for Admin API routes (v3.0 Migration).

Tests for:
- Feature flag status endpoint
- Migration trigger endpoint
- Migration status endpoint
- Migration stats endpoint
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi.testclient import TestClient
from fastapi import FastAPI

from fidus.api.routes.admin import router


@pytest.fixture
def app():
    """Create test FastAPI app with admin router."""
    test_app = FastAPI()
    test_app.include_router(router)

    # Mock auth middleware - set user_id on request state
    @test_app.middleware("http")
    async def mock_auth(request, call_next):
        request.state.user_id = "test-user-123"
        return await call_next(request)

    return test_app


@pytest.fixture
def client(app):
    """Create test client."""
    return TestClient(app)


class TestFeatureFlags:
    """Tests for GET /memory/admin/feature-flags endpoint."""

    def test_get_feature_flags_returns_status(self, client):
        """Should return feature flag status."""
        with patch("fidus.api.routes.admin.config") as mock_config:
            mock_config.use_qdrant_first = False

            response = client.get("/memory/admin/feature-flags")

            assert response.status_code == 200
            data = response.json()
            assert "use_qdrant_first" in data
            assert "neo4j_configured" in data
            assert "qdrant_configured" in data

    def test_get_feature_flags_reflects_config(self, client):
        """Should reflect actual config values."""
        with patch("fidus.api.routes.admin.config") as mock_config:
            mock_config.use_qdrant_first = True

            response = client.get("/memory/admin/feature-flags")

            assert response.status_code == 200
            data = response.json()
            assert data["use_qdrant_first"] is True


class TestMigrationStatus:
    """Tests for GET /memory/admin/migration-status endpoint."""

    def test_get_migration_status_idle(self, client):
        """Should return idle status when no migration started."""
        response = client.get("/memory/admin/migration-status")

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "idle"
        assert data["message"] == "No migration has been started"
        assert data["progress"]["status"] == "idle"

    def test_get_migration_status_with_tenant(self, client):
        """Should accept tenant_id parameter."""
        response = client.get("/memory/admin/migration-status?tenant_id=tenant-123")

        assert response.status_code == 200
        data = response.json()
        assert data["migration_id"] == "tenant-123"


class TestTriggerMigration:
    """Tests for POST /memory/admin/migrate-qdrant-first endpoint."""

    def test_trigger_migration_requires_neo4j(self, client):
        """Should fail if Neo4j not configured."""
        with patch("fidus.api.routes.admin.USE_NEO4J", False):
            response = client.post(
                "/memory/admin/migrate-qdrant-first",
                json={"dry_run": True},
            )

            assert response.status_code == 501
            assert "Neo4j" in response.json()["detail"]

    def test_trigger_migration_requires_qdrant(self, client):
        """Should fail if Qdrant not configured."""
        with patch("fidus.api.routes.admin.USE_NEO4J", True):
            with patch("fidus.api.routes.admin.USE_QDRANT", False):
                response = client.post(
                    "/memory/admin/migrate-qdrant-first",
                    json={"dry_run": True},
                )

                assert response.status_code == 501
                assert "Qdrant" in response.json()["detail"]

    def test_trigger_migration_dry_run_default(self, client):
        """Should default to dry_run=True for safety."""
        with patch("fidus.api.routes.admin.USE_NEO4J", True), \
             patch("fidus.api.routes.admin.USE_QDRANT", True), \
             patch("fidus.api.routes.admin.AsyncGraphDatabase") as mock_neo4j, \
             patch("fidus.api.routes.admin.QdrantClient") as mock_qdrant, \
             patch("fidus.api.routes.admin.SituationMigrator") as mock_migrator:

            # Setup mocks
            mock_driver = AsyncMock()
            mock_neo4j.driver.return_value = mock_driver

            mock_progress = MagicMock()
            mock_progress.total_situations = 0
            mock_progress.migrated_situations = 0
            mock_progress.failed_migrations = 0
            mock_progress.skipped_situations = 0
            mock_progress.updated_relationships = 0
            mock_progress.deleted_in_situation_edges = 0
            mock_progress.progress_percentage = 0.0

            mock_migrator_instance = AsyncMock()
            mock_migrator_instance.run_migration = AsyncMock(return_value=mock_progress)
            mock_migrator.return_value = mock_migrator_instance

            response = client.post(
                "/memory/admin/migrate-qdrant-first",
                json={},  # No dry_run specified
            )

            # Should succeed but use dry_run=True by default
            assert response.status_code == 200
            mock_migrator.assert_called_once()
            call_kwargs = mock_migrator.call_args.kwargs
            assert call_kwargs["dry_run"] is True


class TestMigrationStats:
    """Tests for GET /memory/admin/migration-stats endpoint."""

    def test_migration_stats_requires_neo4j(self, client):
        """Should fail if Neo4j not configured."""
        with patch("fidus.api.routes.admin.USE_NEO4J", False):
            response = client.get("/memory/admin/migration-stats")

            assert response.status_code == 501
            assert "Neo4j" in response.json()["detail"]


class TestClearMigrationState:
    """Tests for DELETE /memory/admin/clear-migration-state endpoint."""

    def test_clear_migration_state(self, client):
        """Should clear migration state."""
        response = client.delete("/memory/admin/clear-migration-state")

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "cleared"


class TestMigrationProgress:
    """Tests for MigrationProgress model."""

    def test_progress_percentage_zero_total(self):
        """Should return 0% when no situations."""
        from fidus.api.routes.admin import MigrationProgress

        progress = MigrationProgress(
            total_situations=0,
            migrated_situations=0,
        )

        assert progress.progress_percentage == 0.0

    def test_progress_percentage_calculation(self):
        """Should calculate percentage correctly."""
        from fidus.api.routes.admin import MigrationProgress

        progress = MigrationProgress(
            total_situations=100,
            migrated_situations=50,
        )

        assert progress.progress_percentage == 50.0

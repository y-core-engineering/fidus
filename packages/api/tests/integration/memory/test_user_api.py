"""Integration tests for User API endpoints.

These tests require a running Neo4j instance (typically via Docker).
Run with: NEO4J_URI=bolt://localhost:7687 NEO4J_PASSWORD=your_password pytest tests/integration/memory/test_user_api.py -v

NOTE (ADR-0003): Skills are stored as role-scoped attributes on relationship
contexts in Qdrant, not on the User entity.
"""

import os
import pytest
from httpx import AsyncClient, ASGITransport
from uuid import uuid4

from fidus.main import app

# Skip all tests if Neo4j is not configured
pytestmark = pytest.mark.skipif(
    not os.getenv("NEO4J_URI"),
    reason="NEO4J_URI not set - skipping integration tests"
)


@pytest.fixture
def tenant_id() -> str:
    """Generate a unique tenant ID for test isolation."""
    return f"test-tenant-{uuid4()}"


@pytest.fixture
def user_data(tenant_id: str) -> dict:
    """Generate test user data."""
    return {
        "tenant_id": tenant_id,
        "email": f"test-{uuid4()}@example.com",
        "name": "Test User",
        "preferred_language": "en",
        "timezone": "UTC",
        "ai_properties": {"interests": ["AI", "Music"]},
    }


@pytest.fixture
async def client():
    """Create async test client."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
class TestUserAPIIntegration:
    """Integration tests for User API."""

    async def test_create_user(self, client: AsyncClient, user_data: dict):
        """Test creating a user via API."""
        response = await client.post("/api/memory/user/", json=user_data)

        assert response.status_code == 201
        data = response.json()
        assert data["email"] == user_data["email"]
        assert data["name"] == user_data["name"]
        assert data["tenant_id"] == user_data["tenant_id"]
        assert "id" in data
        assert "created_at" in data
        assert "updated_at" in data

        # Cleanup
        await client.delete(
            f"/api/memory/user/{data['id']}",
            params={"tenant_id": user_data["tenant_id"], "confirm": "true"}
        )

    async def test_get_user_by_id(self, client: AsyncClient, user_data: dict):
        """Test retrieving a user by ID."""
        # Create user
        create_response = await client.post("/api/memory/user/", json=user_data)
        assert create_response.status_code == 201
        user = create_response.json()

        # Get user
        get_response = await client.get(
            f"/api/memory/user/{user['id']}",
            params={"tenant_id": user_data["tenant_id"]}
        )

        assert get_response.status_code == 200
        data = get_response.json()
        assert data["id"] == user["id"]
        assert data["email"] == user_data["email"]

        # Cleanup
        await client.delete(
            f"/api/memory/user/{user['id']}",
            params={"tenant_id": user_data["tenant_id"], "confirm": "true"}
        )

    async def test_get_user_by_email(self, client: AsyncClient, user_data: dict):
        """Test retrieving a user by email."""
        # Create user
        create_response = await client.post("/api/memory/user/", json=user_data)
        assert create_response.status_code == 201
        user = create_response.json()

        # Get by email
        get_response = await client.get(
            f"/api/memory/user/by-email/{user_data['email']}",
            params={"tenant_id": user_data["tenant_id"]}
        )

        assert get_response.status_code == 200
        data = get_response.json()
        assert data["email"] == user_data["email"]

        # Cleanup
        await client.delete(
            f"/api/memory/user/{user['id']}",
            params={"tenant_id": user_data["tenant_id"], "confirm": "true"}
        )

    async def test_update_user(self, client: AsyncClient, user_data: dict):
        """Test updating a user."""
        # Create user
        create_response = await client.post("/api/memory/user/", json=user_data)
        assert create_response.status_code == 201
        user = create_response.json()

        # Update user
        update_data = {
            "name": "Updated Name",
            "timezone": "Europe/Berlin",
        }
        update_response = await client.put(
            f"/api/memory/user/{user['id']}",
            params={"tenant_id": user_data["tenant_id"]},
            json=update_data
        )

        assert update_response.status_code == 200
        data = update_response.json()
        assert data["name"] == "Updated Name"
        assert data["timezone"] == "Europe/Berlin"

        # Cleanup
        await client.delete(
            f"/api/memory/user/{user['id']}",
            params={"tenant_id": user_data["tenant_id"], "confirm": "true"}
        )

    async def test_delete_user(self, client: AsyncClient, user_data: dict):
        """Test deleting a user (GDPR cascade delete)."""
        # Create user
        create_response = await client.post("/api/memory/user/", json=user_data)
        assert create_response.status_code == 201
        user = create_response.json()

        # Delete user
        delete_response = await client.delete(
            f"/api/memory/user/{user['id']}",
            params={"tenant_id": user_data["tenant_id"], "confirm": "true"}
        )

        assert delete_response.status_code == 204

        # Verify user is deleted
        get_response = await client.get(
            f"/api/memory/user/{user['id']}",
            params={"tenant_id": user_data["tenant_id"]}
        )
        assert get_response.status_code == 404

    async def test_delete_user_requires_confirmation(
        self, client: AsyncClient, user_data: dict
    ):
        """Test that delete requires confirm=true."""
        # Create user
        create_response = await client.post("/api/memory/user/", json=user_data)
        assert create_response.status_code == 201
        user = create_response.json()

        # Try to delete without confirmation
        delete_response = await client.delete(
            f"/api/memory/user/{user['id']}",
            params={"tenant_id": user_data["tenant_id"], "confirm": "false"}
        )

        assert delete_response.status_code == 400
        assert "confirm=true" in delete_response.json()["detail"]

        # Cleanup with proper confirmation
        await client.delete(
            f"/api/memory/user/{user['id']}",
            params={"tenant_id": user_data["tenant_id"], "confirm": "true"}
        )

    async def test_list_users(self, client: AsyncClient, tenant_id: str):
        """Test listing users for a tenant."""
        # Create multiple users
        users_created = []
        for i in range(3):
            user_data = {
                "tenant_id": tenant_id,
                "email": f"test-{uuid4()}@example.com",
                "name": f"Test User {i}",
            }
            response = await client.post("/api/memory/user/", json=user_data)
            assert response.status_code == 201
            users_created.append(response.json())

        # List users
        list_response = await client.get(
            "/api/memory/user/",
            params={"tenant_id": tenant_id}
        )

        assert list_response.status_code == 200
        data = list_response.json()
        assert len(data) >= 3

        # Cleanup
        for user in users_created:
            await client.delete(
                f"/api/memory/user/{user['id']}",
                params={"tenant_id": tenant_id, "confirm": "true"}
            )

    async def test_user_not_found(self, client: AsyncClient, tenant_id: str):
        """Test 404 for non-existent user."""
        response = await client.get(
            f"/api/memory/user/non-existent-id",
            params={"tenant_id": tenant_id}
        )

        assert response.status_code == 404
        assert response.json()["detail"] == "User not found"

    async def test_tenant_isolation(self, client: AsyncClient, user_data: dict):
        """Test that users are isolated by tenant."""
        # Create user in tenant A
        create_response = await client.post("/api/memory/user/", json=user_data)
        assert create_response.status_code == 201
        user = create_response.json()

        # Try to get user with wrong tenant ID
        other_tenant = f"other-tenant-{uuid4()}"
        get_response = await client.get(
            f"/api/memory/user/{user['id']}",
            params={"tenant_id": other_tenant}
        )

        assert get_response.status_code == 404

        # Cleanup
        await client.delete(
            f"/api/memory/user/{user['id']}",
            params={"tenant_id": user_data["tenant_id"], "confirm": "true"}
        )

    async def test_create_duplicate_email_fails(
        self, client: AsyncClient, user_data: dict
    ):
        """Test that duplicate email in same tenant fails."""
        # Create first user
        create_response = await client.post("/api/memory/user/", json=user_data)
        assert create_response.status_code == 201
        user = create_response.json()

        # Try to create second user with same email
        duplicate_response = await client.post("/api/memory/user/", json=user_data)

        assert duplicate_response.status_code == 400

        # Cleanup
        await client.delete(
            f"/api/memory/user/{user['id']}",
            params={"tenant_id": user_data["tenant_id"], "confirm": "true"}
        )

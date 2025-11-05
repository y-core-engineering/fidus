"""Integration tests for SimpleAuthMiddleware.

Tests:
- Guest user creation when no X-User-ID header provided
- Preserving X-User-ID when header is provided
- User isolation (critical for security)
- Health check endpoints bypass authentication
- X-User-ID header returned in response
"""

import pytest
from httpx import AsyncClient
from fidus.main import app


@pytest.mark.asyncio
async def test_guest_user_creation():
    """Should create guest user when no X-User-ID header provided."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Make request without X-User-ID header
        response = await client.post(
            "/memory/chat/legacy",
            json={"user_id": "test-user", "message": "Hello"}
        )

        # Should succeed
        assert response.status_code == 200

        # Response should include X-User-ID header
        assert "X-User-ID" in response.headers
        user_id = response.headers["X-User-ID"]

        # Should be a guest user
        assert user_id.startswith("guest-")
        assert len(user_id) > len("guest-")  # Has UUID appended


@pytest.mark.asyncio
async def test_preserve_user_id():
    """Should preserve X-User-ID when provided in header."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Make request with X-User-ID header
        provided_user_id = "user-12345"
        response = await client.post(
            "/memory/chat/legacy",
            json={"user_id": provided_user_id, "message": "Hello"},
            headers={"X-User-ID": provided_user_id}
        )

        # Should succeed
        assert response.status_code == 200

        # Response should return the same user_id
        assert response.headers["X-User-ID"] == provided_user_id


@pytest.mark.asyncio
async def test_health_check_no_auth():
    """Health check endpoints should not require authentication."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Make request to /health without X-User-ID header
        response = await client.get("/health")

        # Should succeed
        assert response.status_code == 200
        assert response.json() == {"status": "ok", "message": "Fidus Memory API is running"}

        # Should NOT have X-User-ID in response (auth skipped)
        assert "X-User-ID" not in response.headers


@pytest.mark.asyncio
async def test_health_db_no_auth():
    """Database health check should not require authentication."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Make request to /health/db without X-User-ID header
        response = await client.get("/health/db")

        # Should succeed (even if databases fail, endpoint should respond)
        assert response.status_code == 200
        assert "status" in response.json()
        assert "databases" in response.json()

        # Should NOT have X-User-ID in response (auth skipped)
        assert "X-User-ID" not in response.headers


@pytest.mark.asyncio
async def test_user_isolation_preferences():
    """CRITICAL SECURITY TEST: User A should not see User B's preferences.

    This test verifies multi-tenancy and user isolation:
    1. User A creates preferences via chat
    2. User B queries preferences
    3. User B should NOT see User A's preferences
    """
    async with AsyncClient(app=app, base_url="http://test") as client:
        user_a_id = "user-a-12345"
        user_b_id = "user-b-67890"

        # Step 1: User A has a chat conversation to create preferences
        response_a = await client.post(
            "/memory/chat/legacy",
            json={
                "user_id": user_a_id,
                "message": "I love pizza with extra cheese"
            },
            headers={"X-User-ID": user_a_id}
        )
        assert response_a.status_code == 200
        assert response_a.headers["X-User-ID"] == user_a_id

        # Step 2: User A queries their preferences
        response_a_prefs = await client.get(
            "/memory/preferences",
            headers={"X-User-ID": user_a_id}
        )
        assert response_a_prefs.status_code == 200
        user_a_preferences = response_a_prefs.json()["preferences"]

        # User A should have at least one preference
        assert len(user_a_preferences) > 0, "User A should have preferences after chat"

        # Step 3: User B queries preferences (different user_id)
        response_b_prefs = await client.get(
            "/memory/preferences",
            headers={"X-User-ID": user_b_id}
        )
        assert response_b_prefs.status_code == 200
        user_b_preferences = response_b_prefs.json()["preferences"]

        # CRITICAL: User B should NOT see User A's preferences
        # User B should have zero preferences (fresh user)
        assert len(user_b_preferences) == 0, \
            f"User B should have 0 preferences, but has {len(user_b_preferences)}. " \
            f"User isolation FAILED!"

        # Verify the preference keys are different
        user_a_keys = {p["key"] for p in user_a_preferences}
        user_b_keys = {p["key"] for p in user_b_preferences}

        # No overlap should exist
        overlap = user_a_keys.intersection(user_b_keys)
        assert len(overlap) == 0, \
            f"User A and B have overlapping preferences: {overlap}. " \
            f"User isolation FAILED!"


@pytest.mark.asyncio
async def test_user_isolation_chat_history():
    """SECURITY TEST: User A's chat should not affect User B's context.

    This test verifies that conversation history is isolated per user.
    """
    async with AsyncClient(app=app, base_url="http://test") as client:
        user_a_id = "user-a-99999"
        user_b_id = "user-b-88888"

        # User A has a conversation
        response_a1 = await client.post(
            "/memory/chat/legacy",
            json={
                "user_id": user_a_id,
                "message": "My name is Alice"
            },
            headers={"X-User-ID": user_a_id}
        )
        assert response_a1.status_code == 200

        # User A asks a follow-up (agent should remember "Alice")
        response_a2 = await client.post(
            "/memory/chat/legacy",
            json={
                "user_id": user_a_id,
                "message": "What is my name?"
            },
            headers={"X-User-ID": user_a_id}
        )
        assert response_a2.status_code == 200
        # The agent should remember Alice's name
        assert "alice" in response_a2.json()["response"].lower()

        # User B asks the same question (should NOT know Alice)
        response_b = await client.post(
            "/memory/chat/legacy",
            json={
                "user_id": user_b_id,
                "message": "What is my name?"
            },
            headers={"X-User-ID": user_b_id}
        )
        assert response_b.status_code == 200

        # User B's response should NOT mention Alice
        # (The agent should say it doesn't know User B's name)
        response_b_text = response_b.json()["response"].lower()
        assert "alice" not in response_b_text, \
            f"User B's response mentions Alice! User isolation FAILED: {response_b_text}"


@pytest.mark.asyncio
async def test_multiple_guest_users_isolated():
    """Guest users should be isolated from each other."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        # First guest user (no X-User-ID)
        response1 = await client.post(
            "/memory/chat/legacy",
            json={"user_id": "guest1", "message": "I like chocolate"}
        )
        assert response1.status_code == 200
        guest1_id = response1.headers["X-User-ID"]
        assert guest1_id.startswith("guest-")

        # Second guest user (no X-User-ID, new request)
        response2 = await client.post(
            "/memory/chat/legacy",
            json={"user_id": "guest2", "message": "I like vanilla"}
        )
        assert response2.status_code == 200
        guest2_id = response2.headers["X-User-ID"]
        assert guest2_id.startswith("guest-")

        # Guest users should have different IDs
        assert guest1_id != guest2_id

        # Query preferences for each guest (using their assigned IDs)
        prefs1 = await client.get(
            "/memory/preferences",
            headers={"X-User-ID": guest1_id}
        )
        prefs2 = await client.get(
            "/memory/preferences",
            headers={"X-User-ID": guest2_id}
        )

        assert prefs1.status_code == 200
        assert prefs2.status_code == 200

        # Each guest should only see their own preferences
        guest1_prefs = prefs1.json()["preferences"]
        guest2_prefs = prefs2.json()["preferences"]

        # Preferences should be isolated (no overlap)
        guest1_keys = {p["key"] for p in guest1_prefs}
        guest2_keys = {p["key"] for p in guest2_prefs}

        overlap = guest1_keys.intersection(guest2_keys)
        assert len(overlap) == 0, \
            f"Guest users have overlapping preferences: {overlap}. Isolation FAILED!"


@pytest.mark.asyncio
async def test_consistent_user_id_across_requests():
    """X-User-ID should remain consistent when provided in subsequent requests."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        user_id = "consistent-user-123"

        # First request
        response1 = await client.post(
            "/memory/chat/legacy",
            json={"user_id": user_id, "message": "First message"},
            headers={"X-User-ID": user_id}
        )
        assert response1.status_code == 200
        assert response1.headers["X-User-ID"] == user_id

        # Second request with same user_id
        response2 = await client.post(
            "/memory/chat/legacy",
            json={"user_id": user_id, "message": "Second message"},
            headers={"X-User-ID": user_id}
        )
        assert response2.status_code == 200
        assert response2.headers["X-User-ID"] == user_id

        # Third request (get preferences)
        response3 = await client.get(
            "/memory/preferences",
            headers={"X-User-ID": user_id}
        )
        assert response3.status_code == 200
        assert response3.headers["X-User-ID"] == user_id


@pytest.mark.asyncio
async def test_docs_endpoint_no_auth():
    """OpenAPI docs endpoints should not require authentication."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Test /openapi.json
        response = await client.get("/openapi.json")
        assert response.status_code == 200
        assert "X-User-ID" not in response.headers

        # Test /docs (Swagger UI)
        # Note: This might redirect, so we check for 200 or 307
        response = await client.get("/docs", follow_redirects=False)
        assert response.status_code in [200, 307]
        assert "X-User-ID" not in response.headers

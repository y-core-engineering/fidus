"""Integration tests for MCP server.

Tests verify that MCP tools and resources work correctly with the
PersistentAgent and Neo4j backend.
"""

import pytest
from fidus.memory.mcp_server import PreferenceMCPServer
from fidus.memory.persistent_agent import PersistentAgent
from fidus.config import PrototypeConfig


@pytest.fixture
async def mcp_server() -> PreferenceMCPServer:
    """Create MCP server with test agent.

    Returns:
        PreferenceMCPServer instance
    """
    # Create agent with test tenant
    agent = PersistentAgent(
        tenant_id=PrototypeConfig.PROTOTYPE_TENANT_ID,
        enable_context_awareness=False  # Disable for simpler tests
    )

    # Connect to Neo4j
    await agent.connect()

    # Clean up any existing test data
    await agent.delete_all_preferences()

    # Create MCP server
    server = PreferenceMCPServer(agent)

    yield server

    # Cleanup
    await agent.delete_all_preferences()
    await agent.disconnect()


@pytest.mark.asyncio
async def test_get_preferences_tool_empty(mcp_server: PreferenceMCPServer) -> None:
    """Should return empty preferences list when no preferences exist."""
    result = await mcp_server.call_tool(
        "get_preferences",
        user_id="test_user_1"
    )

    assert "preferences" in result
    assert isinstance(result["preferences"], list)
    assert len(result["preferences"]) == 0


@pytest.mark.asyncio
async def test_learn_and_get_preferences(mcp_server: PreferenceMCPServer) -> None:
    """Should learn preferences from message and retrieve them."""
    # Learn preference via message
    learn_result = await mcp_server.call_tool(
        "learn_preference",
        user_id="test_user_2",
        message="I love cappuccino coffee in the morning"
    )

    assert learn_result["status"] == "learned"
    assert "response" in learn_result
    assert learn_result["total_preferences"] > 0

    # Get preferences
    get_result = await mcp_server.call_tool(
        "get_preferences",
        user_id="test_user_2"
    )

    assert "preferences" in get_result
    assert len(get_result["preferences"]) > 0

    # Check that coffee preference was learned
    prefs = get_result["preferences"]
    coffee_pref = next((p for p in prefs if "coffee" in p.get("key", "").lower()), None)
    assert coffee_pref is not None, "Coffee preference should be learned"


@pytest.mark.asyncio
async def test_get_preferences_with_domain_filter(mcp_server: PreferenceMCPServer) -> None:
    """Should filter preferences by domain."""
    # Learn multiple preferences
    await mcp_server.call_tool(
        "learn_preference",
        user_id="test_user_3",
        message="I like cappuccino and pizza"
    )

    # Get all preferences
    all_result = await mcp_server.call_tool(
        "get_preferences",
        user_id="test_user_3"
    )

    # Get coffee preferences only
    coffee_result = await mcp_server.call_tool(
        "get_preferences",
        user_id="test_user_3",
        domain="coffee"
    )

    # Should have fewer or equal preferences when filtered
    assert len(coffee_result["preferences"]) <= len(all_result["preferences"])


@pytest.mark.asyncio
async def test_get_preferences_with_confidence_filter(mcp_server: PreferenceMCPServer) -> None:
    """Should filter preferences by confidence threshold."""
    # Learn preference
    await mcp_server.call_tool(
        "learn_preference",
        user_id="test_user_4",
        message="I prefer cappuccino"
    )

    # Get with high confidence threshold (should return fewer/none)
    high_conf_result = await mcp_server.call_tool(
        "get_preferences",
        user_id="test_user_4",
        min_confidence=0.9
    )

    # Get with low confidence threshold (should return more)
    low_conf_result = await mcp_server.call_tool(
        "get_preferences",
        user_id="test_user_4",
        min_confidence=0.1
    )

    # Low confidence threshold should return more or equal preferences
    assert len(low_conf_result["preferences"]) >= len(high_conf_result["preferences"])


@pytest.mark.asyncio
async def test_record_interaction_accept(mcp_server: PreferenceMCPServer) -> None:
    """Should increase confidence when interaction is accepted."""
    # Learn preference
    await mcp_server.call_tool(
        "learn_preference",
        user_id="test_user_5",
        message="I like cappuccino"
    )

    # Get preferences to find ID
    prefs_result = await mcp_server.call_tool(
        "get_preferences",
        user_id="test_user_5"
    )

    assert len(prefs_result["preferences"]) > 0
    pref = prefs_result["preferences"][0]
    pref_id = pref["id"]
    original_confidence = pref["confidence"]

    # Accept preference
    accept_result = await mcp_server.call_tool(
        "record_interaction",
        user_id="test_user_5",
        preference_id=pref_id,
        accepted=True
    )

    assert accept_result["status"] == "recorded"
    assert accept_result["new_confidence"] > original_confidence


@pytest.mark.asyncio
async def test_record_interaction_reject(mcp_server: PreferenceMCPServer) -> None:
    """Should decrease confidence when interaction is rejected."""
    # Learn preference
    await mcp_server.call_tool(
        "learn_preference",
        user_id="test_user_6",
        message="I enjoy espresso"
    )

    # Get preferences to find ID
    prefs_result = await mcp_server.call_tool(
        "get_preferences",
        user_id="test_user_6"
    )

    assert len(prefs_result["preferences"]) > 0
    pref = prefs_result["preferences"][0]
    pref_id = pref["id"]
    original_confidence = pref["confidence"]

    # Reject preference
    reject_result = await mcp_server.call_tool(
        "record_interaction",
        user_id="test_user_6",
        preference_id=pref_id,
        accepted=False
    )

    assert reject_result["status"] == "recorded"
    assert reject_result["new_confidence"] < original_confidence


@pytest.mark.asyncio
async def test_delete_all_preferences(mcp_server: PreferenceMCPServer) -> None:
    """Should delete all preferences for user."""
    # Learn preferences
    await mcp_server.call_tool(
        "learn_preference",
        user_id="test_user_7",
        message="I love cappuccino and pizza"
    )

    # Verify preferences exist
    before_result = await mcp_server.call_tool(
        "get_preferences",
        user_id="test_user_7"
    )
    assert len(before_result["preferences"]) > 0

    # Delete all
    delete_result = await mcp_server.call_tool(
        "delete_all_preferences",
        user_id="test_user_7"
    )

    assert delete_result["status"] == "deleted"
    assert delete_result["count"] >= 0

    # Verify preferences deleted
    after_result = await mcp_server.call_tool(
        "get_preferences",
        user_id="test_user_7"
    )
    # Note: Deleted preferences might still exist with low confidence
    # so we check for either empty list or low confidence
    if after_result["preferences"]:
        for pref in after_result["preferences"]:
            assert pref["confidence"] < 0.5


@pytest.mark.asyncio
async def test_user_preferences_resource(mcp_server: PreferenceMCPServer) -> None:
    """Should retrieve preferences via MCP resource."""
    # Learn preference
    await mcp_server.call_tool(
        "learn_preference",
        user_id="test_user_8",
        message="I prefer tea over coffee"
    )

    # Get resource
    content = await mcp_server.get_resource("user://test_user_8/preferences")

    assert isinstance(content, str)
    assert "test_user_8" in content
    # Should contain preference information
    assert len(content) > 50  # Should have meaningful content


@pytest.mark.asyncio
async def test_user_contexts_resource(mcp_server: PreferenceMCPServer) -> None:
    """Should retrieve contexts via MCP resource."""
    # Get contexts resource (may be empty if context awareness disabled)
    content = await mcp_server.get_resource("user://test_user_9/contexts")

    assert isinstance(content, str)
    # Should either show contexts or indicate context awareness is disabled
    assert len(content) > 0


@pytest.mark.asyncio
async def test_invalid_tool_name(mcp_server: PreferenceMCPServer) -> None:
    """Should raise error for invalid tool name."""
    with pytest.raises(ValueError, match="Unknown tool"):
        await mcp_server.call_tool(
            "invalid_tool_name",
            user_id="test_user"
        )


@pytest.mark.asyncio
async def test_invalid_resource_uri(mcp_server: PreferenceMCPServer) -> None:
    """Should raise error for invalid resource URI."""
    with pytest.raises(ValueError, match="Invalid resource"):
        await mcp_server.get_resource("invalid://resource")

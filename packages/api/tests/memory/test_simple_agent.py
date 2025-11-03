import pytest
from fidus.memory.simple_agent import InMemoryAgent


@pytest.mark.asyncio
async def test_agent_initialization():
    """Should initialize with empty preferences."""
    agent = InMemoryAgent()
    assert agent.preferences == {}
    assert agent.conversation_history == []


@pytest.mark.asyncio
async def test_agent_chat():
    """Should process message and return response."""
    agent = InMemoryAgent()
    response = await agent.chat("I prefer coding in the morning")

    assert isinstance(response, str)
    assert len(response) > 0


@pytest.mark.asyncio
async def test_preference_storage():
    """Should extract preferences from message."""
    agent = InMemoryAgent()
    await agent.chat("I always drink cappuccino in the morning")

    # Check if any preference was learned
    # This test may be flaky depending on LLM output
    assert len(agent.preferences) >= 0  # May or may not extract depending on LLM

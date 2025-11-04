import pytest
from unittest.mock import AsyncMock, patch, MagicMock
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

    # Mock LLM response
    mock_response = MagicMock()
    mock_response.choices = [MagicMock(message=MagicMock(content="I understand you prefer coding in the morning!"))]

    with patch.object(agent, '_extract_preferences', return_value=[]):
        with patch('fidus.memory.simple_agent.acompletion', return_value=mock_response):
            response = await agent.chat("I prefer coding in the morning")

            assert isinstance(response, str)
            assert len(response) > 0


@pytest.mark.asyncio
async def test_preference_storage():
    """Should extract preferences from message."""
    agent = InMemoryAgent()

    # Mock LLM extraction
    mock_preferences = [
        {
            "domain": "food",
            "key": "cappuccino",
            "value": "always drinks it in the morning",
            "sentiment": "positive",
            "confidence": 0.8
        }
    ]

    # Mock chat response
    mock_response = MagicMock()
    mock_response.choices = [MagicMock(message=MagicMock(content="Got it, you love cappuccino!"))]

    with patch.object(agent, '_extract_preferences', return_value=mock_preferences):
        with patch('fidus.memory.simple_agent.acompletion', return_value=mock_response):
            await agent.chat("I always drink cappuccino in the morning")

            # Check if preference was stored
            assert len(agent.preferences) > 0
            assert "food.cappuccino" in agent.preferences
            assert agent.preferences["food.cappuccino"]["confidence"] == 0.8

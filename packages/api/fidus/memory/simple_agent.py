import json
import os
import logging
from typing import Dict, List, Any, AsyncGenerator
from litellm import acompletion

logger = logging.getLogger(__name__)


class InMemoryAgent:
    """Simple chat agent with in-memory preference learning."""

    def __init__(self, llm_model: str | None = None, max_history_messages: int = 20):
        self.llm_model = llm_model or os.getenv("FIDUS_LLM_MODEL", "gpt-4o-mini")
        logger.info(f"Initializing InMemoryAgent with model: {self.llm_model}")
        logger.info(f"FIDUS_LLM_MODEL env var: {os.getenv('FIDUS_LLM_MODEL')}")
        logger.info(f"OLLAMA_API_BASE env var: {os.getenv('OLLAMA_API_BASE')}")
        self.preferences: Dict[str, Dict[str, Any]] = {}  # {domain.key: {value, confidence}}
        self.conversation_history: List[Dict[str, str]] = []
        self.max_history_messages = max_history_messages  # Sliding window size

    async def chat(self, user_message: str) -> str:
        """Process user message and return response."""
        logger.info(f"Chat called with message: {user_message[:50]}...")
        logger.info(f"Using model: {self.llm_model}")

        # 1. Add to history
        self.conversation_history.append({"role": "user", "content": user_message})

        # 2. Extract preferences from message
        extracted = await self._extract_preferences(user_message)
        self._update_preferences(extracted)

        # 3. Build system prompt with learned preferences
        system_prompt = self._build_prompt()

        # 4. Apply sliding window to conversation history
        recent_history = self._get_recent_history()
        logger.info(f"Using {len(recent_history)} messages from history (window size: {self.max_history_messages})")

        # 5. Generate response
        logger.info(f"Calling LiteLLM with model: {self.llm_model}")

        # Build kwargs for acompletion
        completion_kwargs = {
            "model": self.llm_model,
            "messages": [
                {"role": "system", "content": system_prompt},
                *recent_history
            ]
        }

        # Add api_base for Ollama models
        if self.llm_model.startswith("ollama/"):
            ollama_base = os.getenv("OLLAMA_API_BASE", "http://localhost:11434")
            completion_kwargs["api_base"] = ollama_base
            logger.info(f"Using Ollama API base: {ollama_base}")

        response = await acompletion(**completion_kwargs)

        bot_response = response.choices[0].message.content
        self.conversation_history.append({"role": "assistant", "content": bot_response})
        return bot_response

    async def chat_stream(self, user_message: str) -> AsyncGenerator[str, None]:
        """Process user message and stream response token by token."""
        logger.info(f"Chat stream called with message: {user_message[:50]}...")
        logger.info(f"Using model: {self.llm_model}")

        # 1. Add to history
        self.conversation_history.append({"role": "user", "content": user_message})

        # 2. Yield acknowledgment event
        yield json.dumps({"type": "acknowledged"}) + "\n"

        # 3. Extract preferences from message (in background, don't block streaming)
        extracted = await self._extract_preferences(user_message)
        self._update_preferences(extracted)

        # Yield preferences update event
        if extracted:
            yield json.dumps({
                "type": "preferences_updated",
                "count": len(extracted)
            }) + "\n"

        # 4. Build system prompt with learned preferences
        system_prompt = self._build_prompt()

        # 5. Apply sliding window to conversation history
        recent_history = self._get_recent_history()
        logger.info(f"Using {len(recent_history)} messages from history (window size: {self.max_history_messages})")

        # 6. Generate streaming response
        logger.info(f"Calling LiteLLM with streaming model: {self.llm_model}")

        # Build kwargs for acompletion with streaming
        completion_kwargs = {
            "model": self.llm_model,
            "messages": [
                {"role": "system", "content": system_prompt},
                *recent_history
            ],
            "stream": True
        }

        # Add api_base for Ollama models
        if self.llm_model.startswith("ollama/"):
            ollama_base = os.getenv("OLLAMA_API_BASE", "http://localhost:11434")
            completion_kwargs["api_base"] = ollama_base
            logger.info(f"Using Ollama API base: {ollama_base}")

        response = await acompletion(**completion_kwargs)

        # Stream tokens and build full response
        full_response = ""
        async for chunk in response:
            if hasattr(chunk.choices[0], 'delta') and hasattr(chunk.choices[0].delta, 'content'):
                token = chunk.choices[0].delta.content
                if token:
                    full_response += token
                    # Yield token event
                    yield json.dumps({
                        "type": "token",
                        "content": token
                    }) + "\n"

        # 7. Add to conversation history
        self.conversation_history.append({"role": "assistant", "content": full_response})

        # 8. Yield completion event
        yield json.dumps({"type": "done"}) + "\n"

    async def _extract_preferences(self, text: str) -> List[Dict[str, Any]]:
        """Use LLM to extract preferences from text with sentiment."""
        prompt = f"""Extract user preferences from this text. Only extract clear, meaningful preferences.

        Text: "{text}"

        Rules:
        - Extract both positive preferences ("I like X") and negative ones ("I don't like X", "I hate X")
        - Do NOT extract if the text is just a greeting, question, or test message
        - domain: category like "food", "lifestyle", "work", "hobbies"
        - key: the specific item/topic (e.g., "coffee", "dark_mode", "mornings")
        - sentiment: "positive", "negative", or "neutral" - MUST match the tone of the value field
        - value: descriptive text that clearly expresses the sentiment
        - confidence: 0.0-1.0 based on how explicit the preference is

        IMPORTANT: The sentiment field MUST match the value field:
        - If value expresses liking/loving/preferring → sentiment MUST be "positive"
        - If value expresses disliking/hating/avoiding → sentiment MUST be "negative"
        - If value is neutral/ambiguous → sentiment MUST be "neutral"

        Examples:
        - "I love cappuccino" → {{"domain": "food", "key": "cappuccino", "sentiment": "positive", "value": "loves it", "confidence": 0.9}}
        - "I hate instant coffee" → {{"domain": "food", "key": "instant_coffee", "sentiment": "negative", "value": "hates it", "confidence": 0.9}}
        - "I prefer dark mode" → {{"domain": "lifestyle", "key": "dark_mode", "sentiment": "positive", "value": "prefers it", "confidence": 0.8}}
        - "I don't like mornings" → {{"domain": "lifestyle", "key": "mornings", "sentiment": "negative", "value": "dislikes them", "confidence": 0.8}}

        Return ONLY valid JSON in this exact format:
        {{"preferences": [{{"domain": "food", "key": "cappuccino", "sentiment": "positive", "value": "loves it", "confidence": 0.9}}]}}

        If NO clear preferences found, return:
        {{"preferences": []}}
        """

        # Build kwargs for acompletion
        completion_kwargs = {
            "model": self.llm_model,
            "messages": [{"role": "user", "content": prompt}],
            "response_format": {"type": "json_object"}
        }

        # Add api_base for Ollama models
        if self.llm_model.startswith("ollama/"):
            ollama_base = os.getenv("OLLAMA_API_BASE", "http://localhost:11434")
            completion_kwargs["api_base"] = ollama_base

        response = await acompletion(**completion_kwargs)

        try:
            result = json.loads(response.choices[0].message.content)
            return result.get("preferences", [])
        except json.JSONDecodeError:
            return []

    def _is_valid_preference(self, pref: Dict[str, Any]) -> bool:
        """Validate that a preference has meaningful content.

        Rejects preferences with placeholder or nonsensical values.
        """
        # Check required fields exist
        if not all(key in pref for key in ['domain', 'key', 'value']):
            return False

        domain = pref['domain'].strip()
        key = pref['key'].strip()
        value = pref['value'].strip()
        sentiment = pref.get('sentiment', 'neutral').strip().lower()

        # Reject if any field is empty
        if not domain or not key or not value:
            return False

        # Validate sentiment field
        if sentiment not in ['positive', 'negative', 'neutral']:
            logger.warning(f"Invalid sentiment '{sentiment}', defaulting to 'neutral'")
            pref['sentiment'] = 'neutral'

        # Reject placeholder patterns like "...", "???", "placeholder", etc.
        placeholder_patterns = ['.', '...', '?', '???', 'placeholder', 'example', 'test']
        if any(pattern == domain.lower() or pattern == key.lower() or pattern == value.lower()
               for pattern in placeholder_patterns):
            return False

        # Reject if fields are too short (likely garbage)
        if len(domain) < 2 or len(key) < 2 or len(value) < 2:
            return False

        # Reject if confidence is too low (less than 50%)
        confidence = pref.get('confidence', 0.7)
        if confidence < 0.5:
            return False

        return True

    def _update_preferences(self, extracted: List[Dict[str, Any]]) -> None:
        """Update in-memory preference dict with validation and sentiment tracking."""
        for pref in extracted:
            # Validate before adding
            if not self._is_valid_preference(pref):
                logger.warning(f"Rejected invalid preference: {pref}")
                continue

            key = f"{pref['domain']}.{pref['key']}"
            sentiment = pref.get('sentiment', 'neutral')
            self.preferences[key] = {
                "value": pref['value'],
                "sentiment": sentiment,
                "confidence": pref.get('confidence', 0.7)
            }
            sentiment_emoji = "👍" if sentiment == "positive" else "👎" if sentiment == "negative" else "😐"
            logger.info(f"Added preference: {key} = {pref['value']} ({sentiment_emoji} {sentiment}, confidence: {pref.get('confidence', 0.7):.0%})")

    def _get_recent_history(self) -> List[Dict[str, str]]:
        """Get recent conversation history using sliding window.

        Returns only the last N messages to keep context manageable
        for small models like llama3.2:3b.
        """
        if len(self.conversation_history) <= self.max_history_messages:
            return self.conversation_history

        # Return only the most recent messages
        return self.conversation_history[-self.max_history_messages:]

    def _build_prompt(self) -> str:
        """Build system prompt with learned preferences.

        This implements Structured Memory: preferences are stored separately
        and compactly included in the system prompt, while conversation
        history uses a sliding window.
        """
        base = """You are Fidus Memory, a friendly conversational AI that learns about the user's preferences.

IMPORTANT: Respond naturally in conversation. Do NOT output system information, internal state, or debugging info to the user.

"""

        if self.preferences:
            base += "User's known preferences:\n"
            for key, pref in self.preferences.items():
                sentiment = pref.get('sentiment', 'neutral')
                sentiment_prefix = "likes" if sentiment == "positive" else "dislikes" if sentiment == "negative" else "neutral about"
                base += f"- {key}: {sentiment_prefix} {pref['value']}\n"
            base += "\n"

        base += "Respond naturally and conversationally. Ask follow-up questions to learn more preferences."

        return base

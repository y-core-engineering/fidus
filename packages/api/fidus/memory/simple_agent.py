import json
from typing import Dict, List, Any
from litellm import acompletion


class InMemoryAgent:
    """Simple chat agent with in-memory preference learning."""

    def __init__(self, llm_model: str = "ollama/llama3.1:8b"):
        self.llm_model = llm_model
        self.preferences: Dict[str, Dict[str, Any]] = {}  # {domain.key: {value, confidence}}
        self.conversation_history: List[Dict[str, str]] = []

    async def chat(self, user_message: str) -> str:
        """Process user message and return response."""
        # 1. Add to history
        self.conversation_history.append({"role": "user", "content": user_message})

        # 2. Extract preferences from message
        extracted = await self._extract_preferences(user_message)
        self._update_preferences(extracted)

        # 3. Build system prompt with learned preferences
        system_prompt = self._build_prompt()

        # 4. Generate response
        response = await acompletion(
            model=self.llm_model,
            messages=[
                {"role": "system", "content": system_prompt},
                *self.conversation_history
            ]
        )

        bot_response = response.choices[0].message.content
        self.conversation_history.append({"role": "assistant", "content": bot_response})
        return bot_response

    async def _extract_preferences(self, text: str) -> List[Dict[str, Any]]:
        """Use LLM to extract preferences from text."""
        prompt = f"""Extract user preferences from this text.

        Text: "{text}"

        Return JSON array of preferences:
        [{{"domain": "...", "key": "...", "value": "...", "confidence": 0.0-1.0}}]

        If no preferences found, return empty array [].
        """

        response = await acompletion(
            model=self.llm_model,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )

        try:
            result = json.loads(response.choices[0].message.content)
            return result.get("preferences", [])
        except json.JSONDecodeError:
            return []

    def _update_preferences(self, extracted: List[Dict[str, Any]]) -> None:
        """Update in-memory preference dict."""
        for pref in extracted:
            key = f"{pref['domain']}.{pref['key']}"
            self.preferences[key] = {
                "value": pref['value'],
                "confidence": pref.get('confidence', 0.7)
            }

    def _build_prompt(self) -> str:
        """Build system prompt with learned preferences."""
        base = "You are Fidus Memory, a conversational AI that learns user preferences.\n\n"

        if self.preferences:
            base += "What you've learned about the user:\n"
            for key, pref in self.preferences.items():
                base += f"- {key}: {pref['value']} (confidence: {pref['confidence']:.0%})\n"

        return base

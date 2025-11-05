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
        self.preferences: Dict[str, Dict[str, Any]] = {}  # {domain.key: {value, sentiment, confidence, is_exception}}
        self.conversation_history: List[Dict[str, str]] = []
        self.max_history_messages = max_history_messages  # Sliding window size

    async def chat(self, user_message: str, user_id: str = "unknown") -> str:
        """Process user message and return response.

        Args:
            user_message: The user's message
            user_id: User identifier for context tracking (Phase 4)
        """
        logger.info(f"Chat called with message: {user_message[:50]}... (user: {user_id})")
        logger.info(f"Using model: {self.llm_model}")

        # 1. Add to history
        self.conversation_history.append({"role": "user", "content": user_message})

        # 2. Extract preferences from message
        extracted = await self._extract_preferences(user_message)
        conflicts = self._update_preferences(extracted)
        # Note: conflicts are ignored in non-streaming mode

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

    async def chat_stream(self, user_message: str, user_id: str = "unknown") -> AsyncGenerator[str, None]:
        """Process user message and stream response token by token.

        Args:
            user_message: The user's message
            user_id: User identifier for context tracking (Phase 4)
        """
        logger.info(f"Chat stream called with message: {user_message[:50]}... (user: {user_id})")
        logger.info(f"Using model: {self.llm_model}")

        # 1. Add to history
        self.conversation_history.append({"role": "user", "content": user_message})

        # 2. Yield acknowledgment event
        yield json.dumps({"type": "acknowledged"}) + "\n"

        # 3. Extract preferences from message (in background, don't block streaming)
        extracted = await self._extract_preferences(user_message)
        conflicts = self._update_preferences(extracted)

        # Yield preferences update event immediately after extraction
        extracted_count = len(extracted) if extracted else 0
        if extracted_count > 0:
            yield json.dumps({
                "type": "preferences_updated",
                "count": extracted_count
            }) + "\n"

        # Check for semantic inconsistencies in newly added preferences
        semantic_conflicts = await self._find_semantic_inconsistencies()

        # Combine direct conflicts with semantic conflicts
        all_conflicts = conflicts + semantic_conflicts

        # Yield conflict event if there are sentiment conflicts
        if all_conflicts:
            # For each conflict, find semantically related preferences
            enriched_conflicts = []
            for conflict in all_conflicts:
                # Find related preferences that might also be inconsistent
                related_keys = await self._find_related_preferences(
                    conflict["key"],
                    conflict["new_sentiment"]
                )

                # Check which related preferences have opposite sentiment
                affected_prefs = []
                for related_key in related_keys:
                    # Skip if this is the same key as the conflict itself (direct conflict, not semantic)
                    if related_key == conflict["key"]:
                        continue

                    if related_key in self.preferences:
                        related_pref = self.preferences[related_key]
                        # Only include if sentiment is opposite to new preference
                        if ((conflict["new_sentiment"] == "negative" and related_pref["sentiment"] == "positive") or
                            (conflict["new_sentiment"] == "positive" and related_pref["sentiment"] == "negative")):
                            affected_prefs.append({
                                "key": related_key,
                                "value": related_pref["value"],
                                "sentiment": related_pref["sentiment"],
                                "confidence": related_pref["confidence"]
                            })

                # Add related preferences to conflict
                enriched_conflict = {**conflict, "related_preferences": affected_prefs}
                enriched_conflicts.append(enriched_conflict)

            yield json.dumps({
                "type": "preference_conflict",
                "conflicts": enriched_conflicts
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

        CRITICAL - Key Language Normalization:
        - ALWAYS use English for the "key" field, regardless of the input language
        - Translate non-English preference items to their English equivalents
        - This ensures consistency across languages for conflict detection
        - Examples:
          • "Ich mag Kaffee" → key: "coffee" (NOT "kaffee")
          • "J'aime le café" → key: "coffee" (NOT "café")
          • "Me gusta el café" → key: "coffee" (NOT "café")
          • "Ich hasse Montage" → key: "mondays" (NOT "montage")
          • "J'adore le chocolat" → key: "chocolate" (NOT "chocolat")
        - Use lowercase, snake_case for multi-word keys (e.g., "instant_coffee", "dark_mode")

        IMPORTANT: The sentiment field MUST match the value field:
        - If value expresses liking/loving/preferring → sentiment MUST be "positive"
        - If value expresses disliking/hating/avoiding → sentiment MUST be "negative"
        - If value is neutral/ambiguous → sentiment MUST be "neutral"

        CRITICAL: Do NOT extract obligations or necessities as preferences:
        - Phrases with "must", "have to", "need to", "should", "muss", "sollte", "brauche" indicate OBLIGATION, not preference
        - "I have to do X quite a bit" = obligation/effort, NOT enjoyment or preference
        - "I need to X" = necessity, NOT preference
        - Only extract if there's CLEAR positive/negative sentiment beyond the obligation
        - If unsure whether it's preference vs. obligation, do NOT extract it

        Confidence Calibration:
        - Explicit emotional statements ("I love", "I hate"): 0.8-0.9
        - Clear preferences ("I prefer", "I like", "I dislike"): 0.7-0.8
        - Moderate statements ("X is good", "X is bad"): 0.6-0.7
        - Implied preferences ("X works well", "X is useful"): 0.5-0.6
        - Ambiguous or implicit statements: 0.4-0.5
        - If confidence would be < 0.6 for non-explicit statements, consider NOT extracting

        Examples:
        - "I love cappuccino" → {{"domain": "food", "key": "cappuccino", "sentiment": "positive", "value": "loves it", "confidence": 0.9}}
        - "I hate instant coffee" → {{"domain": "food", "key": "instant_coffee", "sentiment": "negative", "value": "hates it", "confidence": 0.9}}
        - "I prefer dark mode" → {{"domain": "lifestyle", "key": "dark_mode", "sentiment": "positive", "value": "prefers it", "confidence": 0.8}}
        - "I don't like mornings" → {{"domain": "lifestyle", "key": "mornings", "sentiment": "negative", "value": "dislikes them", "confidence": 0.8}}
        - "I have to do quite a bit of fine tuning" → DO NOT EXTRACT (obligation/effort, not preference)
        - "I must configure X" → DO NOT EXTRACT (necessity, not preference)
        - "I enjoy fine tuning" → {{"domain": "work", "key": "fine_tuning", "sentiment": "positive", "value": "enjoys it", "confidence": 0.8}}

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

    async def _find_related_preferences(self, new_key: str, new_sentiment: str) -> List[str]:
        """Find semantically related preferences that might conflict.

        Uses LLM to identify preferences that are subcategories or closely related
        to the new preference. Only checks preferences within the same domain category.
        """
        if not self.preferences:
            return []

        # Extract domain and key part
        new_domain = new_key.split('.')[0] if '.' in new_key else None
        new_key_only = new_key.split('.')[-1] if '.' in new_key else new_key

        # Filter existing keys to only same domain (e.g., both "food.*")
        existing_keys = [
            key for key in self.preferences.keys()
            if (key.split('.')[0] if '.' in key else None) == new_domain
        ]

        # If no keys in same domain, no conflicts possible
        if not existing_keys:
            return []

        prompt = f"""Analyze if any existing preferences are semantically related to the new preference.

New preference: "{new_key_only}" (domain: {new_domain}) with sentiment "{new_sentiment}"

Existing preferences in same domain: {json.dumps(existing_keys)}

Rules:
- Find preferences that are subcategories or specific types of the new preference
- Example: "food.coffee" (negative) conflicts with "food.cappuccino" (positive), "food.espresso" (positive)
- Example: "food.meat" (negative) conflicts with "food.beef" (positive), "food.chicken" (positive)
- Only include DIRECT relationships (parent-child, synonym, or subcategory)
- DO NOT include loosely related items (e.g., "food.cappuccino" is NOT related to "lifestyle.mornings")
- Only return keys from the SAME domain ({new_domain})

Return ONLY a JSON object with a "related_keys" array of preference keys that are semantically related.
If no related preferences found, return: {{"related_keys": []}}

Response:"""

        try:
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
            result = json.loads(response.choices[0].message.content)
            related = result.get("related_keys", [])

            logger.info(f"LLM analyzed '{new_key}' ({new_sentiment}) - found {len(related)} related: {related}")

            return related
        except Exception as e:
            logger.error(f"Error finding related preferences: {str(e)}")
            return []

    async def _find_semantic_inconsistencies(self) -> List[Dict[str, Any]]:
        """Find semantic inconsistencies in current preferences.

        Checks all preferences pairwise to find parent-child conflicts
        (e.g., negative coffee but positive espresso).

        Returns list of conflicts in same format as _update_preferences.
        """
        conflicts = []

        if len(self.preferences) < 2:
            return conflicts

        # Check each preference against all others
        checked_pairs = set()
        for key1, pref1 in self.preferences.items():
            # Skip if this preference is marked as an exception
            if pref1.get("is_exception", False):
                continue

            for key2, pref2 in self.preferences.items():
                if key1 == key2:
                    continue

                # Skip if the related preference is marked as an exception
                if pref2.get("is_exception", False):
                    continue

                # Skip if not in same domain (e.g., food.* vs lifestyle.*)
                domain1 = key1.split('.')[0] if '.' in key1 else None
                domain2 = key2.split('.')[0] if '.' in key2 else None
                if domain1 != domain2:
                    continue

                # Skip if already checked (avoid duplicates)
                pair = tuple(sorted([key1, key2]))
                if pair in checked_pairs:
                    continue
                checked_pairs.add(pair)

                # Only check if sentiments are opposite
                if pref1["sentiment"] == pref2["sentiment"]:
                    continue

                # Check if semantically related
                related_to_key1 = await self._find_related_preferences(key1, pref1["sentiment"])

                if key2 in related_to_key1:
                    # Found semantic conflict!
                    # But only create conflict if key1 and key2 are DIFFERENT
                    # (same key with different sentiment should be handled by direct conflict detection)
                    key1_only = key1.split('.')[-1] if '.' in key1 else key1
                    key2_only = key2.split('.')[-1] if '.' in key2 else key2

                    logger.info(f"Checking semantic conflict: key1='{key1}' (only='{key1_only}') vs key2='{key2}' (only='{key2_only}')")

                    if key1_only == key2_only:
                        # Same preference key - this is a direct conflict, not semantic
                        # Skip it here, it will be handled by _update_preferences
                        logger.info(f"Skipping same-key semantic conflict: {key1} vs {key2}")
                        continue

                    # Create conflict with key1 as the "general" preference
                    # and key2 as the "specific" preference
                    logger.info(f"Semantic inconsistency detected: {key1} ({pref1['sentiment']}) vs {key2} ({pref2['sentiment']})")

                    conflicts.append({
                        "key": key1,
                        "old_value": pref1["value"],
                        "old_sentiment": pref1["sentiment"],
                        "old_confidence": pref1["confidence"],
                        "new_value": pref1["value"],
                        "new_sentiment": pref1["sentiment"],
                        "new_confidence": pref1["confidence"],
                        "related_keys": []  # Will be populated in chat_stream
                    })
                    break  # Only report each general preference once

        return conflicts

    def _update_preferences(self, extracted: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Update in-memory preference dict with validation and conflict detection.

        Returns list of conflicts that need user confirmation.
        """
        conflicts = []

        for pref in extracted:
            # Validate before adding
            if not self._is_valid_preference(pref):
                logger.warning(f"Rejected invalid preference: {pref}")
                continue

            key = f"{pref['domain']}.{pref['key']}"
            new_sentiment = pref.get('sentiment', 'neutral')
            new_confidence = pref.get('confidence', 0.7)
            new_value = pref['value']

            # Check if preference already exists
            if key in self.preferences:
                existing = self.preferences[key]
                old_sentiment = existing['sentiment']
                old_confidence = existing['confidence']
                old_value = existing['value']

                # Case 1: Sentiment conflict (positive ↔ negative)
                sentiment_conflict = (
                    (old_sentiment == 'positive' and new_sentiment == 'negative') or
                    (old_sentiment == 'negative' and new_sentiment == 'positive')
                )

                if sentiment_conflict:
                    # Always ask user for confirmation when sentiment changes
                    conflicts.append({
                        "key": key,
                        "old_value": old_value,
                        "old_sentiment": old_sentiment,
                        "old_confidence": old_confidence,
                        "new_value": new_value,
                        "new_sentiment": new_sentiment,
                        "new_confidence": new_confidence,
                        "related_keys": []  # Will be populated in chat_stream
                    })
                    logger.info(f"Sentiment conflict detected for {key}: {old_sentiment} ({old_confidence:.0%}) vs {new_sentiment} ({new_confidence:.0%})")
                    continue  # Don't update yet, wait for user confirmation

                # Case 2: Same sentiment, only update if higher confidence
                elif new_confidence <= old_confidence:
                    logger.info(f"Skipping {key}: new confidence {new_confidence:.0%} <= existing {old_confidence:.0%}")
                    continue  # Keep existing preference

            # Add or update preference
            self.preferences[key] = {
                "value": new_value,
                "sentiment": new_sentiment,
                "confidence": new_confidence,
                "is_exception": False  # Default: not an exception
            }
            sentiment_emoji = "👍" if new_sentiment == "positive" else "👎" if new_sentiment == "negative" else "😐"
            action = "Updated" if key in self.preferences else "Added"
            logger.info(f"{action} preference: {key} = {new_value} ({sentiment_emoji} {new_sentiment}, confidence: {new_confidence:.0%})")

        return conflicts

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

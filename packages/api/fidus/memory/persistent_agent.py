"""Persistent chat agent with Neo4j-backed preference storage.

This module extends the InMemoryAgent with Neo4j persistence,
confidence scoring, accept/reject functionality, and context-aware
preference learning (Phase 3: Situational Context Awareness).
"""

import json
import logging
from typing import Dict, List, Any, AsyncGenerator
from fidus.memory.simple_agent import InMemoryAgent
from fidus.infrastructure.neo4j_client import Neo4jPreferenceStore
from fidus.memory.context.agent import ContextAwareAgent
from fidus.config import config

logger = logging.getLogger(__name__)


class PersistentAgent(InMemoryAgent):
    """Chat agent with Neo4j-backed persistent preferences and context-awareness.

    Extends InMemoryAgent to add:
    - Neo4j persistence for preferences
    - Confidence scoring (+0.1 on accept, -0.15 on reject)
    - Accept/reject actions for user feedback
    - Multi-tenant support
    - **Phase 3: Situational context awareness**
      - Context extraction from messages (LLM + system)
      - Context-based preference storage (Neo4j + Qdrant)
      - Context-based preference retrieval (similarity search)
    """

    def __init__(
        self,
        tenant_id: str = "default-tenant",
        llm_model: str | None = None,
        max_history_messages: int = 20,
        enable_context_awareness: bool = True,
    ):
        """Initialize persistent agent.

        Args:
            tenant_id: Tenant identifier for multi-tenancy
            llm_model: LLM model to use (defaults to config)
            max_history_messages: Conversation history window size
            enable_context_awareness: Enable Phase 3 context-aware features (default: True)
        """
        super().__init__(llm_model=llm_model, max_history_messages=max_history_messages)
        self.tenant_id = tenant_id
        self.store = Neo4jPreferenceStore(config)
        self._connected = False
        self.enable_context_awareness = enable_context_awareness

        # Initialize ContextAwareAgent for Phase 3
        if enable_context_awareness:
            self.context_agent = ContextAwareAgent()
            logger.info("Context-awareness enabled (Phase 3)")
        else:
            self.context_agent = None
            logger.info("Context-awareness disabled")

    async def connect(self) -> None:
        """Connect to Neo4j database."""
        if not self._connected:
            await self.store.connect()
            self._connected = True
            logger.info(f"Connected to Neo4j for tenant: {self.tenant_id}")

            # Load existing preferences from Neo4j
            await self._load_preferences()

    async def disconnect(self) -> None:
        """Disconnect from Neo4j database and close context agent."""
        if self._connected:
            await self.store.disconnect()
            self._connected = False
            logger.info("Disconnected from Neo4j")

        # Close context agent connections
        if self.context_agent:
            await self.context_agent.close()
            logger.info("Closed ContextAwareAgent connections")

    async def _load_preferences(self) -> None:
        """Load preferences from Neo4j into memory."""
        if not self._connected:
            raise RuntimeError("Not connected to Neo4j. Call connect() first.")

        preferences = await self.store.get_preferences(self.tenant_id)

        # Convert Neo4j format to in-memory format
        self.preferences = {}
        for pref in preferences:
            key = pref["key"]
            self.preferences[key] = {
                "value": pref.get("value", ""),
                "sentiment": pref["sentiment"],
                "confidence": pref["confidence"],
                "is_exception": pref.get("is_exception", False),
                "id": pref["id"],  # Store Neo4j ID for updates
            }

        logger.info(f"Loaded {len(self.preferences)} preferences from Neo4j")

    def _update_preferences(self, extracted: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Update preferences and persist to Neo4j.

        Overrides parent method to add Neo4j persistence.
        """
        if not self._connected:
            logger.warning("Not connected to Neo4j, falling back to in-memory only")
            return super()._update_preferences(extracted)

        conflicts = []

        for pref in extracted:
            # Validate before adding
            if not self._is_valid_preference(pref):
                logger.warning(f"Rejected invalid preference: {pref}")
                continue

            key = f"{pref['domain']}.{pref['key']}"
            new_sentiment = pref.get('sentiment', 'neutral')
            new_confidence = pref.get('confidence', 0.5)
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

            # Update in-memory cache immediately (sync)
            pref_data = {
                "key": key,
                "value": new_value,
                "sentiment": new_sentiment,
                "confidence": new_confidence,
                "is_exception": False,
            }
            self.preferences[key] = pref_data

            # Mark for persistence (will be persisted on next save)
            # Phase 3: Include original message and user_id for context recording
            if not hasattr(self, '_pending_saves'):
                self._pending_saves = []

            save_data = pref_data.copy()
            save_data["original_message"] = getattr(self, '_last_user_message', "")
            save_data["user_id"] = getattr(self, '_current_user_id', "unknown")

            self._pending_saves.append(save_data)

            sentiment_emoji = "👍" if new_sentiment == "positive" else "👎" if new_sentiment == "negative" else "😐"
            action = "Updated" if key in self.preferences else "Added"
            logger.info(f"{action} preference: {key} = {new_value} ({sentiment_emoji} {new_sentiment}, confidence: {new_confidence:.0%})")

        return conflicts

    async def accept_preference(self, preference_id: str) -> Dict[str, Any]:
        """Accept a preference, increasing its confidence by +0.1.

        Args:
            preference_id: UUID of the preference

        Returns:
            Updated preference data

        Raises:
            ValueError: If preference not found
        """
        if not self._connected:
            raise RuntimeError("Not connected to Neo4j. Call connect() first.")

        # Update confidence in Neo4j
        updated_pref = await self.store.update_confidence(
            tenant_id=self.tenant_id,
            preference_id=preference_id,
            delta=0.1,
        )

        # Update in-memory cache
        key = updated_pref["key"]
        if key in self.preferences:
            self.preferences[key]["confidence"] = updated_pref["confidence"]

        logger.info(f"Accepted preference {preference_id}: confidence now {updated_pref['confidence']:.2f}")

        return updated_pref

    async def reject_preference(self, preference_id: str) -> Dict[str, Any]:
        """Reject a preference, decreasing its confidence by -0.15.

        Args:
            preference_id: UUID of the preference

        Returns:
            Updated preference data

        Raises:
            ValueError: If preference not found
        """
        if not self._connected:
            raise RuntimeError("Not connected to Neo4j. Call connect() first.")

        # Update confidence in Neo4j
        updated_pref = await self.store.update_confidence(
            tenant_id=self.tenant_id,
            preference_id=preference_id,
            delta=-0.15,
        )

        # Update in-memory cache
        key = updated_pref["key"]
        if key in self.preferences:
            self.preferences[key]["confidence"] = updated_pref["confidence"]

        # If confidence drops to 0, remove from memory
        if updated_pref["confidence"] <= 0.0:
            await self.delete_preference(preference_id)

        logger.info(f"Rejected preference {preference_id}: confidence now {updated_pref['confidence']:.2f}")

        return updated_pref

    async def delete_preference(self, preference_id: str) -> bool:
        """Delete a single preference.

        Args:
            preference_id: UUID of the preference

        Returns:
            True if deleted, False if not found
        """
        if not self._connected:
            raise RuntimeError("Not connected to Neo4j. Call connect() first.")

        deleted = await self.store.delete_preference(
            tenant_id=self.tenant_id,
            preference_id=preference_id,
        )

        if deleted:
            # Remove from in-memory cache
            # Find and remove by ID
            for key, pref in list(self.preferences.items()):
                if pref.get("id") == preference_id:
                    del self.preferences[key]
                    logger.info(f"Deleted preference {preference_id}: {key}")
                    break

        return deleted

    async def delete_all_preferences(self) -> int:
        """Delete all preferences for this tenant.

        Returns:
            Number of preferences deleted
        """
        if not self._connected:
            raise RuntimeError("Not connected to Neo4j. Call connect() first.")

        count = await self.store.delete_all_preferences(self.tenant_id)

        # Clear in-memory cache
        self.preferences.clear()

        logger.info(f"Deleted all {count} preferences for tenant {self.tenant_id}")

        return count

    async def get_all_preferences(self) -> List[Dict[str, Any]]:
        """Get all preferences from Neo4j.

        Returns:
            List of preference dictionaries
        """
        if not self._connected:
            raise RuntimeError("Not connected to Neo4j. Call connect() first.")

        return await self.store.get_preferences(self.tenant_id)

    async def _get_context_relevant_preferences(
        self,
        message: str,
        user_id: str,
        top_k: int = 10,
        min_score: float = 0.6,
    ) -> Dict[str, Dict[str, Any]]:
        """Get preferences relevant to current context (Phase 3).

        Args:
            message: Current user message to extract context from
            user_id: User ID for context tracking
            top_k: Maximum number of situations to retrieve
            min_score: Minimum similarity score (0.0 to 1.0)

        Returns:
            Dict of context-relevant preferences (same format as self.preferences)
        """
        if not self.enable_context_awareness or not self.context_agent:
            # Fall back to all preferences if context-awareness disabled
            return self.preferences

        try:
            # Get similar situations based on current context
            similar_situations = await self.context_agent.get_relevant_preferences(
                message=message,
                tenant_id=self.tenant_id,
                user_id=user_id,
                top_k=top_k,
                min_score=min_score,
            )

            if not similar_situations:
                logger.info("No similar situations found, using all preferences")
                return self.preferences

            # Extract preference IDs from situations (via Neo4j relationships)
            relevant_prefs = {}
            for situation in similar_situations:
                # Find preferences linked to this situation
                for key, pref in self.preferences.items():
                    # Check if this preference is linked to the situation
                    # (For now, include all preferences - proper filtering would query Neo4j IN_SITUATION relationships)
                    if pref.get("id"):
                        relevant_prefs[key] = pref

            logger.info(
                f"Context-aware retrieval: {len(similar_situations)} situations → "
                f"{len(relevant_prefs)} relevant preferences (total: {len(self.preferences)})"
            )

            # If no preferences found via context, fall back to all
            return relevant_prefs if relevant_prefs else self.preferences

        except Exception as e:
            logger.warning(f"Context-aware retrieval failed, using all preferences: {e}")
            return self.preferences

    async def _persist_pending_saves(self) -> None:
        """Persist any pending preference saves to Neo4j.

        Phase 3: Also records situational context for each preference.
        """
        if not self._connected:
            return

        if not hasattr(self, '_pending_saves') or not self._pending_saves:
            return

        for pref_data in self._pending_saves:
            try:
                # Check if already exists in Neo4j
                key = pref_data["key"]
                if key in self.preferences and "id" in self.preferences[key]:
                    # Already persisted, skip
                    continue

                # Create new preference in Neo4j
                created_pref = await self.store.create_preference(
                    tenant_id=self.tenant_id,
                    key=key,
                    sentiment=pref_data["sentiment"],
                    confidence=pref_data["confidence"],
                    value=pref_data.get("value", ""),
                )

                # Update in-memory with Neo4j ID
                self.preferences[key]["id"] = created_pref["id"]
                logger.info(f"Persisted preference to Neo4j: {key}")

                # Phase 3: Record situational context
                if self.enable_context_awareness and self.context_agent:
                    try:
                        # Get the original message that triggered this preference
                        original_message = pref_data.get("original_message", "")

                        if original_message:
                            situation = await self.context_agent.record_preference_with_context(
                                message=original_message,
                                preference_id=created_pref["id"],
                                tenant_id=self.tenant_id,
                                user_id=pref_data.get("user_id", "unknown"),
                            )
                            logger.info(
                                f"Recorded context for preference {key}: "
                                f"{len(situation.context.factors)} factors, situation_id={situation.id}"
                            )
                    except Exception as e:
                        # Don't fail preference creation if context recording fails
                        logger.warning(f"Failed to record context for preference {key}: {e}")

            except Exception as e:
                logger.error(f"Failed to persist preference {pref_data['key']}: {e}")

        # Clear pending saves
        self._pending_saves = []

    async def chat(self, user_message: str, user_id: str = "unknown") -> str:
        """Process user message and return response.

        Overrides parent to add Neo4j persistence and context-awareness.

        Args:
            user_message: The user's message
            user_id: User identifier for context tracking (Phase 3)

        Returns:
            str: Bot response
        """
        # Phase 3: Store message and user_id for context recording
        self._last_user_message = user_message
        self._current_user_id = user_id

        # Phase 3: Get context-relevant preferences before generating response
        if self.enable_context_awareness and self.context_agent:
            original_prefs = self.preferences.copy()
            try:
                # Temporarily set preferences to context-relevant ones
                self.preferences = await self._get_context_relevant_preferences(
                    message=user_message,
                    user_id=user_id,
                )

                response = await super().chat(user_message)

                # Restore original preferences
                self.preferences = original_prefs
            except Exception as e:
                logger.warning(f"Context-aware filtering failed, using all preferences: {e}")
                self.preferences = original_prefs
                response = await super().chat(user_message)
        else:
            response = await super().chat(user_message)

        # Persist any new preferences to Neo4j (and context to Qdrant)
        await self._persist_pending_saves()

        return response

    async def chat_stream(self, user_message: str, user_id: str = "unknown") -> AsyncGenerator[str, None]:
        """Process user message and stream response token by token.

        Overrides parent to add Neo4j persistence and context-awareness.

        Args:
            user_message: The user's message
            user_id: User identifier for context tracking (Phase 3)

        Yields:
            str: SSE events (tokens, preferences_updated, conflicts, done)
        """
        # Phase 3: Store message and user_id for context recording
        self._last_user_message = user_message
        self._current_user_id = user_id

        # Phase 3: Get context-relevant preferences before generating response
        if self.enable_context_awareness and self.context_agent:
            original_prefs = self.preferences.copy()
            try:
                # Temporarily set preferences to context-relevant ones
                self.preferences = await self._get_context_relevant_preferences(
                    message=user_message,
                    user_id=user_id,
                )
            except Exception as e:
                logger.warning(f"Context-aware filtering failed, using all preferences: {e}")
                # Keep original preferences on error

        try:
            async for event in super().chat_stream(user_message):
                # Check event type
                try:
                    event_data = json.loads(event)
                    event_type = event_data.get("type")

                    if event_type == "preferences_updated":
                        # Persist to Neo4j immediately when preferences are updated
                        await self._persist_pending_saves()
                        # Now yield the event so frontend can refresh
                        yield event
                        continue
                    elif event_type == "done":
                        # Just yield done - persistence already happened at preferences_updated
                        yield event
                        continue
                except json.JSONDecodeError:
                    pass

                # Yield all other events (tokens, acknowledged, etc.)
                yield event
        finally:
            # Phase 3: Restore original preferences after stream
            if self.enable_context_awareness and self.context_agent:
                self.preferences = original_prefs

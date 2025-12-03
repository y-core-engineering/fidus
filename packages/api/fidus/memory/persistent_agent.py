"""Persistent chat agent with Neo4j-backed preference storage.

This module extends the InMemoryAgent with Neo4j persistence,
confidence scoring, accept/reject functionality, and context-aware
preference learning (Phase 3: Situational Context Awareness).
"""

import asyncio
import json
import logging
from typing import Dict, List, Any, AsyncGenerator, Optional
from fidus.memory.simple_agent import InMemoryAgent
from fidus.infrastructure.neo4j_client import Neo4jPreferenceStore
from fidus.memory.context.agent import ContextAwareAgent
from fidus.memory.repositories.user_repository import UserRepository
from fidus.memory.repositories.person_repository import PersonRepository
from fidus.memory.entities.user import User
from fidus.memory.entities.person import Person
from fidus.memory.services.person_extractor import PersonEntityExtractor
from fidus.memory.services.organization_extractor import OrganizationEntityExtractor
from fidus.memory.repositories.organization_repository import OrganizationRepository
from fidus.memory.entities.organization import Organization
from fidus.feature_flags import is_person_entity_enabled, is_organization_entity_enabled
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

        # User profile data (loaded on connect)
        self.user_profile: Optional[User] = None
        self._user_repo: Optional[UserRepository] = None

        # v3.0: Known persons and organizations (loaded on connect)
        self.known_persons: List[Person] = []
        self.known_organizations: List[Organization] = []

        # v3.0: Person entity extraction (when enabled via feature flag)
        self._person_repo: Optional[PersonRepository] = None
        self._person_extractor: Optional[PersonEntityExtractor] = None
        self._enable_person_extraction = is_person_entity_enabled()
        if self._enable_person_extraction:
            self._person_extractor = PersonEntityExtractor()
            logger.info("Person entity extraction enabled (v3.0)")

        # v3.0: Organization entity extraction (when enabled via feature flag)
        self._organization_repo: Optional[OrganizationRepository] = None
        self._organization_extractor: Optional[OrganizationEntityExtractor] = None
        self._enable_organization_extraction = is_organization_entity_enabled()
        if self._enable_organization_extraction:
            self._organization_extractor = OrganizationEntityExtractor()
            logger.info("Organization entity extraction enabled (v3.0)")

        # Initialize ContextAwareAgent for Phase 3
        if enable_context_awareness:
            self.context_agent = ContextAwareAgent()
            logger.info("Context-awareness enabled (Phase 3)")
        else:
            self.context_agent = None
            logger.info("Context-awareness disabled")

    async def connect(self) -> None:
        """Connect to Neo4j database and load user profile."""
        if not self._connected:
            await self.store.connect()
            self._connected = True
            logger.info(f"Connected to Neo4j for tenant: {self.tenant_id}")

            # Initialize user repository with Neo4j driver
            self._user_repo = UserRepository(self.store._driver)

            # v3.0: Initialize person repository (when enabled)
            if self._enable_person_extraction:
                self._person_repo = PersonRepository(self.store._driver)
                logger.info("Person repository initialized")

            # v3.0: Initialize organization repository (when enabled)
            if self._enable_organization_extraction:
                self._organization_repo = OrganizationRepository(self.store._driver)
                logger.info("Organization repository initialized")

            # Load existing preferences from Neo4j
            await self._load_preferences()

            # Load user profile (if exists)
            await self._load_user_profile()

            # v3.0: Load known persons and organizations
            await self._load_known_entities()

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

    async def _load_user_profile(self) -> None:
        """Load user profile from Neo4j.

        The user profile contains name, language, timezone, and AI-discovered properties.
        This is used to personalize the system prompt.

        Note: In the current architecture, tenant_id in PersistentAgent equals user_id
        (for multi-user isolation). But User entities have tenant_id="default" typically.
        We try to find the user by ID first with "default" tenant, then fall back.
        """
        if not self._user_repo:
            logger.warning("User repository not initialized, skipping profile load")
            return

        try:
            # In multi-user mode, self.tenant_id = user_id (the UUID)
            # But User entities typically have tenant_id="default"
            # So we search: user.id = self.tenant_id, user.tenant_id = "default"
            user = await self._user_repo.get(self.tenant_id, "default")
            if not user:
                # Fallback: try with tenant_id = user_id (for edge cases)
                user = await self._user_repo.get(self.tenant_id, self.tenant_id)

            if user:
                self.user_profile = user
                logger.info(f"Loaded user profile: {user.name} ({user.email})")
            else:
                logger.info(f"No user profile found for user_id: {self.tenant_id}")
        except Exception as e:
            logger.warning(f"Failed to load user profile: {e}")

    async def reload_user_profile(self) -> None:
        """Reload user profile from database.

        Call this after user profile updates to refresh the cached data.
        """
        await self._load_user_profile()

    async def _load_known_entities(self) -> None:
        """Load known persons and organizations from Neo4j.

        These entities are used to enrich the system prompt so the AI
        can answer questions about people and organizations the user knows.
        """
        # Load persons (if feature enabled and repo available)
        if self._enable_person_extraction and self._person_repo:
            try:
                # In multi-user mode, tenant_id = user_id = self.tenant_id (the UUID)
                # This matches how entities are created in the person routes
                self.known_persons = await self._person_repo.list_by_user(
                    tenant_id=self.tenant_id,
                    user_id=self.tenant_id,
                    limit=50  # Limit to avoid context overflow
                )
                logger.info(f"Loaded {len(self.known_persons)} known persons")
            except Exception as e:
                logger.warning(f"Failed to load persons: {e}")
                self.known_persons = []

        # Load organizations (if feature enabled and repo available)
        if self._enable_organization_extraction and self._organization_repo:
            try:
                # In multi-user mode, tenant_id = user_id = self.tenant_id (the UUID)
                self.known_organizations = await self._organization_repo.list_by_user(
                    tenant_id=self.tenant_id,
                    user_id=self.tenant_id,
                    limit=50  # Limit to avoid context overflow
                )
                logger.info(f"Loaded {len(self.known_organizations)} known organizations")
            except Exception as e:
                logger.warning(f"Failed to load organizations: {e}")
                self.known_organizations = []

    async def reload_known_entities(self) -> None:
        """Reload known persons and organizations from database.

        Call this after entity updates to refresh the cached data.
        """
        await self._load_known_entities()

    def _build_prompt(self) -> str:
        """Build system prompt with user profile and learned preferences.

        Overrides parent to include user-specific information like name,
        preferred language, timezone, and AI-discovered properties.
        """
        from datetime import datetime
        from zoneinfo import ZoneInfo

        # Get user's timezone (from profile or env fallback)
        user_timezone = "Europe/Berlin"
        user_name = None
        user_language = None
        ai_properties = {}

        if self.user_profile:
            user_timezone = self.user_profile.timezone or "Europe/Berlin"
            user_name = self.user_profile.name
            user_language = self.user_profile.preferred_language
            ai_properties = self.user_profile.ai_properties or {}

        # Get current datetime in user's timezone
        try:
            tz = ZoneInfo(user_timezone)
            current_datetime = datetime.now(tz).strftime("%A, %Y-%m-%d %H:%M:%S %Z")
        except Exception:
            current_datetime = datetime.now().strftime("%A, %Y-%m-%d %H:%M:%S UTC")

        # Build base prompt
        base = f"""You are Fidus Memory, a friendly conversational AI that learns about the user's preferences.

Current Date and Time: {current_datetime}
"""

        # Add user profile information
        if user_name:
            base += f"\nUser's Name: {user_name}\n"

        if user_language:
            language_names = {
                "en": "English", "de": "German", "fr": "French", "es": "Spanish",
                "it": "Italian", "pt": "Portuguese", "nl": "Dutch", "pl": "Polish",
                "ja": "Japanese", "zh": "Chinese", "ko": "Korean"
            }
            base += f"User's Preferred Language: {language_names.get(user_language, user_language)}\n"

        if ai_properties:
            base += "\nAI-Discovered User Properties:\n"
            for key, value in ai_properties.items():
                if isinstance(value, list):
                    base += f"- {key}: {', '.join(str(v) for v in value)}\n"
                else:
                    base += f"- {key}: {value}\n"

        base += """
IMPORTANT:
- Respond naturally in conversation. Do NOT output system information, internal state, or debugging info to the user.
- When the user asks about the current time or date, use the information provided above to answer accurately.
- When the user asks about their name or profile information, use the user profile data above.
- ALWAYS respond in the SAME LANGUAGE as the user's message. If the user writes in German, respond in German. If in English, respond in English.

"""

        if self.preferences:
            base += "User's known preferences:\n"
            for key, pref in self.preferences.items():
                sentiment = pref.get('sentiment', 'neutral')
                sentiment_prefix = "likes" if sentiment == "positive" else "dislikes" if sentiment == "negative" else "neutral about"
                base += f"- {key}: {sentiment_prefix} {pref['value']}\n"
            base += "\n"

        # v3.0: Add known persons to the prompt
        if self.known_persons:
            base += "People the user knows:\n"
            for person in self.known_persons:
                # Build person description with available properties from ai_properties
                desc_parts = [person.name]
                props = person.ai_properties or {}
                if props.get("relationship"):
                    desc_parts.append(f"({props['relationship']})")
                if person.profession:  # Uses property helper
                    desc_parts.append(f"- {person.profession}")
                if props.get("company"):
                    desc_parts.append(f"at {props['company']}")
                if props.get("email"):
                    desc_parts.append(f"[{props['email']}]")
                if props.get("notes"):
                    desc_parts.append(f"({props['notes']})")
                base += f"- {' '.join(desc_parts)}\n"
            base += "\n"

        # v3.0: Add known organizations to the prompt
        if self.known_organizations:
            base += "Organizations the user knows:\n"
            for org in self.known_organizations:
                # Build org description using property helpers (read from ai_properties)
                desc_parts = [org.name]
                if org.industry:  # Property helper
                    desc_parts.append(f"({org.industry})")
                if org.size:  # Property helper
                    desc_parts.append(f"- {org.size}")
                if org.location:  # Property helper
                    desc_parts.append(f"in {org.location}")
                props = org.ai_properties or {}
                if props.get("description"):
                    desc_parts.append(f"- {props['description']}")
                base += f"- {' '.join(desc_parts)}\n"
            base += "\n"

        base += "Respond naturally and conversationally. Ask follow-up questions to learn more preferences."

        return base

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

            # Clean up orphaned situations (situations without any linked preferences)
            try:
                orphaned_count = await self.store.cleanup_orphaned_situations(self.tenant_id)
                if orphaned_count > 0:
                    logger.info(f"Cleaned up {orphaned_count} orphaned situations")
            except Exception as e:
                logger.warning(f"Failed to cleanup orphaned situations: {e}")

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
                        # Use cached context and embedding if available (avoids duplicate LLM calls)
                        if hasattr(self, '_cached_context') and self._cached_context is not None:
                            # Store situation using cached data
                            situation = await self.context_agent.storage.store_situation(
                                context=self._cached_context,
                                embedding=self._cached_embedding,
                                tenant_id=self.tenant_id,
                                user_id=pref_data.get("user_id", "unknown"),
                            )

                            # Link preference to situation
                            await self.context_agent.storage.link_preference_to_situation(
                                preference_id=created_pref["id"],
                                situation_id=situation.id,
                                tenant_id=self.tenant_id,
                            )

                            logger.info(
                                f"Recorded context for preference {key} (using cached context): "
                                f"{len(self._cached_context.factors)} factors, situation_id={situation.id}"
                            )
                        else:
                            # Fallback: Extract context fresh (only if not cached)
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

                # Merge any NEW preferences learned during chat back into original
                for key, pref in self.preferences.items():
                    if key not in original_prefs:
                        original_prefs[key] = pref

                # Restore original preferences (now including new ones)
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
            str: SSE events (tokens, preferences_updated, conflicts, persons_extracted, done)
        """
        # Phase 3: Store message and user_id for context recording
        self._last_user_message = user_message
        self._current_user_id = user_id

        # Phase 3: Cache context extraction to avoid duplicate LLM calls
        # This is reused later in _persist_pending_saves() for record_preference_with_context()
        self._cached_context = None
        self._cached_embedding = None

        # v3.0: Start person extraction in parallel (if enabled)
        person_task = None
        if self._enable_person_extraction:
            person_task = asyncio.create_task(
                self._extract_and_save_persons(user_message, user_id)
            )

        # v3.0: Start organization extraction in parallel (if enabled)
        organization_task = None
        if self._enable_organization_extraction:
            organization_task = asyncio.create_task(
                self._extract_and_save_organizations(user_message, user_id)
            )

        # Phase 3: Get context-relevant preferences before generating response
        if self.enable_context_awareness and self.context_agent:
            original_prefs = self.preferences.copy()
            try:
                # Extract context once and cache it for later use
                self._cached_context = await self.context_agent.extract_and_merge_context(
                    message=user_message,
                    tenant_id=self.tenant_id,
                    user_id=user_id,
                )

                # Generate embedding once and cache it
                self._cached_embedding = await self.context_agent.embedding_service.generate_embedding(
                    context=self._cached_context,
                    tenant_id=self.tenant_id,
                    user_id=user_id,
                )

                # Find similar situations using cached embedding
                similar_situations = self.context_agent.retrieval.find_similar_situations(
                    query_embedding=self._cached_embedding,
                    user_id=user_id,
                    tenant_id=self.tenant_id,
                    top_k=10,
                    min_score=0.6,
                )

                if similar_situations:
                    # Extract preference IDs from situations
                    relevant_prefs = {}
                    for situation in similar_situations:
                        for key, pref in self.preferences.items():
                            if pref.get("id"):
                                relevant_prefs[key] = pref
                    self.preferences = relevant_prefs if relevant_prefs else self.preferences
                    logger.info(
                        f"Context-aware retrieval: {len(similar_situations)} situations → "
                        f"{len(self.preferences)} relevant preferences"
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
                        # v3.0: Await person extraction and emit event before done
                        if person_task:
                            try:
                                saved_persons = await person_task
                                if saved_persons:
                                    # Emit persons_extracted event for frontend
                                    yield json.dumps({
                                        "type": "persons_extracted",
                                        "count": len(saved_persons),
                                        "persons": [
                                            {
                                                "id": p.id,
                                                "name": p.name,
                                                "profession": p.profession,
                                            }
                                            for p in saved_persons
                                        ],
                                    }) + "\n"
                            except Exception as e:
                                logger.warning(f"Person extraction task failed: {e}")
                            person_task = None  # Clear task reference

                        # v3.0: Await organization extraction and emit event before done
                        if organization_task:
                            try:
                                saved_orgs = await organization_task
                                if saved_orgs:
                                    # Emit organizations_extracted event for frontend
                                    yield json.dumps({
                                        "type": "organizations_extracted",
                                        "count": len(saved_orgs),
                                        "organizations": [
                                            {
                                                "id": org.id,
                                                "name": org.name,
                                                "industry": org.industry,
                                            }
                                            for org in saved_orgs
                                        ],
                                    }) + "\n"
                            except Exception as e:
                                logger.warning(f"Organization extraction task failed: {e}")
                            organization_task = None  # Clear task reference

                        # Now yield done - persistence already happened at preferences_updated
                        yield event
                        continue
                except json.JSONDecodeError:
                    pass

                # Yield all other events (tokens, acknowledged, etc.)
                yield event
        finally:
            # v3.0: Cancel person task if still running (e.g., on error)
            if person_task and not person_task.done():
                person_task.cancel()
                try:
                    await person_task
                except asyncio.CancelledError:
                    pass

            # v3.0: Cancel organization task if still running (e.g., on error)
            if organization_task and not organization_task.done():
                organization_task.cancel()
                try:
                    await organization_task
                except asyncio.CancelledError:
                    pass

            # Phase 3: Restore original preferences after stream
            if self.enable_context_awareness and self.context_agent:
                # Merge any NEW preferences learned during chat back into original
                for key, pref in self.preferences.items():
                    if key not in original_prefs:
                        original_prefs[key] = pref

                # Restore original preferences (now including new ones)
                self.preferences = original_prefs

            # Clear cached context and embedding to free memory
            self._cached_context = None
            self._cached_embedding = None

    async def _extract_and_save_persons(
        self,
        message: str,
        user_id: str,
    ) -> List[Person]:
        """Extract person entities from message and save to Neo4j.

        v3.0: Person entity extraction runs in parallel with chat response.
        Deduplicates by name (case-insensitive) and merges AI properties.

        Args:
            message: User message to extract persons from
            user_id: User ID for ownership

        Returns:
            List of saved/updated Person entities
        """
        if not self._enable_person_extraction or not self._person_extractor:
            return []

        if not self._person_repo:
            logger.warning("Person repository not initialized")
            return []

        try:
            # Extract persons using LLM
            extracted_persons = await self._person_extractor.extract_from_conversation(message)

            if not extracted_persons:
                return []

            saved_persons = []
            for person_data in extracted_persons:
                try:
                    # Check for existing person with same name (deduplication)
                    existing = await self._person_repo.find_by_name_exact(
                        tenant_id=self.tenant_id,
                        user_id=user_id,
                        name=person_data.name,
                    )

                    if existing:
                        # Merge AI properties into existing person
                        if person_data.ai_properties:
                            updated = await self._person_repo.update_properties(
                                tenant_id=self.tenant_id,
                                person_id=existing.id,
                                new_properties=person_data.ai_properties,
                            )
                            if updated:
                                saved_persons.append(updated)
                                logger.info(
                                    f"Merged properties into existing person: {existing.name}",
                                    extra={"person_id": existing.id, "user_id": user_id},
                                )
                    else:
                        # Create new person
                        new_person = await self._person_repo.create(
                            tenant_id=self.tenant_id,
                            user_id=user_id,
                            person_data=person_data,
                        )
                        saved_persons.append(new_person)
                        logger.info(
                            f"Created new person: {new_person.name}",
                            extra={"person_id": new_person.id, "user_id": user_id},
                        )

                except Exception as e:
                    logger.warning(f"Failed to save person {person_data.name}: {e}")
                    continue

            return saved_persons

        except Exception as e:
            logger.error(f"Person extraction failed: {e}", exc_info=True)
            return []

    async def _extract_and_save_organizations(
        self,
        message: str,
        user_id: str,
    ) -> List[Organization]:
        """Extract organization entities from message and save to Neo4j.

        v3.0: Organization entity extraction runs in parallel with chat response.
        Deduplicates by name (case-insensitive) and merges AI properties.

        Args:
            message: User message to extract organizations from
            user_id: User ID for ownership

        Returns:
            List of saved/updated Organization entities
        """
        if not self._enable_organization_extraction or not self._organization_extractor:
            return []

        if not self._organization_repo:
            logger.warning("Organization repository not initialized")
            return []

        try:
            # Extract organizations using LLM
            extracted_orgs = await self._organization_extractor.extract_from_conversation(message)

            if not extracted_orgs:
                return []

            saved_orgs = []
            for org_data in extracted_orgs:
                try:
                    # Check for existing organization with same name (deduplication)
                    existing = await self._organization_repo.find_by_name_exact(
                        tenant_id=self.tenant_id,
                        user_id=user_id,
                        name=org_data.name,
                    )

                    if existing:
                        # Merge AI properties into existing organization
                        if org_data.ai_properties:
                            updated = await self._organization_repo.update_properties(
                                tenant_id=self.tenant_id,
                                org_id=existing.id,
                                new_properties=org_data.ai_properties,
                            )
                            if updated:
                                saved_orgs.append(updated)
                                logger.info(
                                    f"Merged properties into existing organization: {existing.name}",
                                    extra={"organization_id": existing.id, "user_id": user_id},
                                )
                    else:
                        # Create new organization
                        new_org = await self._organization_repo.create(
                            tenant_id=self.tenant_id,
                            user_id=user_id,
                            org_data=org_data,
                        )
                        saved_orgs.append(new_org)
                        logger.info(
                            f"Created new organization: {new_org.name}",
                            extra={"organization_id": new_org.id, "user_id": user_id},
                        )

                except Exception as e:
                    logger.warning(f"Failed to save organization {org_data.name}: {e}")
                    continue

            return saved_orgs

        except Exception as e:
            logger.error(f"Organization extraction failed: {e}", exc_info=True)
            return []

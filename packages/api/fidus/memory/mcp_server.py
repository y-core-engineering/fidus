"""MCP server for Fidus Memory.

This module exposes Fidus Memory capabilities as MCP (Model Context Protocol)
tools and resources, enabling external domain supervisors to query preferences,
record interactions, and learn from conversations.

**Phase 5: Passive Learning for External LLMs**

Added `get_context()` tool for external LLMs (Claude CLI, VS Code):
- Single tool call retrieves preferences + situations
- Auto-learn parameter triggers background learning
- Non-blocking: Learning happens asynchronously
"""

from typing import Dict, Any, List, Optional
import asyncio
from mcp.server import FastMCP
from fidus.memory.persistent_agent import PersistentAgent
from fidus.config import PrototypeConfig
import logging

logger = logging.getLogger(__name__)


class PreferenceMCPServer:
    """MCP server for preference service.

    Exposes Fidus Memory capabilities as MCP tools and resources.

    Multi-Tenancy: All operations scoped to tenant_id + user_id.
    """

    def __init__(self, agent: PersistentAgent) -> None:
        """Initialize MCP server with persistent agent.

        Args:
            agent: PersistentAgent instance with Neo4j persistence
        """
        self.agent = agent
        self.tenant_id = PrototypeConfig.PROTOTYPE_TENANT_ID
        self.mcp = FastMCP(name="fidus-memory")

        # Register tools and resources
        self._register_tools()
        self._register_resources()

        logger.info("PreferenceMCPServer initialized")

    def _register_tools(self) -> None:
        """Register MCP tools."""

        @self.mcp.tool(name="user.get_preferences")
        async def get_preferences(
            user_id: str,
            domain: Optional[str] = None,
            min_confidence: float = 0.3
        ) -> Dict[str, Any]:
            """Get user preferences, optionally filtered by domain.

            Args:
                user_id: User identifier
                domain: Optional domain filter (e.g., 'coffee', 'food')
                min_confidence: Minimum confidence threshold (0.0-1.0)

            Returns:
                Dictionary with preferences list
            """
            try:
                # Get all preferences from Neo4j
                preferences = await self.agent.get_all_preferences()

                # Filter by domain if specified
                if domain:
                    preferences = [
                        p for p in preferences
                        if p.get("key", "").startswith(f"{domain}.")
                    ]

                # Filter by confidence
                preferences = [
                    p for p in preferences
                    if p.get("confidence", 0) >= min_confidence
                ]

                logger.info(
                    f"Retrieved {len(preferences)} preferences for user {user_id} "
                    f"(domain={domain}, min_confidence={min_confidence})"
                )

                return {"preferences": preferences}

            except Exception as e:
                logger.error(f"Error getting preferences: {e}")
                return {"error": str(e), "preferences": []}

        @self.mcp.tool(name="user.record_interaction")
        async def record_interaction(
            user_id: str,
            preference_id: str,
            accepted: bool
        ) -> Dict[str, Any]:
            """Record user interaction with preference suggestion.

            Args:
                user_id: User identifier
                preference_id: Preference that was suggested
                accepted: Whether user accepted the suggestion

            Returns:
                Dictionary with status and new confidence
            """
            try:
                if accepted:
                    updated = await self.agent.accept_preference(preference_id)
                    new_confidence = updated.get("confidence", 0)
                    logger.info(
                        f"User {user_id} accepted preference {preference_id}, "
                        f"new confidence: {new_confidence:.2f}"
                    )
                else:
                    updated = await self.agent.reject_preference(preference_id)
                    new_confidence = updated.get("confidence", 0)
                    logger.info(
                        f"User {user_id} rejected preference {preference_id}, "
                        f"new confidence: {new_confidence:.2f}"
                    )

                return {
                    "status": "recorded",
                    "new_confidence": new_confidence
                }

            except Exception as e:
                logger.error(f"Error recording interaction: {e}")
                return {"error": str(e), "status": "failed"}

        @self.mcp.tool(name="user.learn_preference")
        async def learn_preference(
            user_id: str,
            message: str
        ) -> Dict[str, Any]:
            """Learn preferences from a user message.

            This tool processes a user message through the chat agent,
            which will extract and store preferences automatically.

            Args:
                user_id: User identifier
                message: User message to learn from

            Returns:
                Dictionary with learned preferences
            """
            try:
                # Process message through agent (which learns preferences)
                response = await self.agent.chat(message, user_id=user_id)

                # Get updated preferences
                preferences = await self.agent.get_all_preferences()

                logger.info(
                    f"Learned from user {user_id} message, "
                    f"now have {len(preferences)} total preferences"
                )

                return {
                    "status": "learned",
                    "response": response,
                    "total_preferences": len(preferences)
                }

            except Exception as e:
                logger.error(f"Error learning preference: {e}")
                return {"error": str(e), "status": "failed"}

        @self.mcp.tool(name="user.delete_all_preferences")
        async def delete_all_preferences(user_id: str) -> Dict[str, Any]:
            """Delete all preferences for a user (privacy feature).

            Args:
                user_id: User identifier

            Returns:
                Dictionary with status and count
            """
            try:
                count = await self.agent.delete_all_preferences()

                logger.info(f"Deleted all {count} preferences for user {user_id}")

                return {
                    "status": "deleted",
                    "count": count
                }

            except Exception as e:
                logger.error(f"Error deleting preferences: {e}")
                return {"error": str(e), "status": "failed"}

        @self.mcp.tool(name="get_context")
        async def get_context(
            query: str,
            user_id: str,
            auto_learn: bool = True,
            include_preferences: bool = True,
            include_situations: bool = True,
            min_confidence: float = 0.5,
        ) -> Dict[str, Any]:
            """Get relevant memory context for a query with passive learning.

            **Passive Learning:** If auto_learn=True (default), this tool will
            automatically analyze and learn from the query in the background
            while retrieving context.

            This is the PRIMARY tool for external LLMs (Claude CLI, VS Code) to use.

            Args:
                query: Query message to find relevant context
                user_id: User identifier
                auto_learn: Enable background learning (default: True)
                include_preferences: Include user preferences (default: True)
                include_situations: Include similar situations (default: True)
                min_confidence: Minimum preference confidence (default: 0.5)

            Returns:
                Dictionary with:
                - preferences: List of relevant preferences
                - situations: List of similar past situations
                - summary: Human-readable summary
                - learned: Whether learning was triggered
            """
            try:
                # Start passive learning in background (non-blocking)
                if auto_learn:
                    asyncio.create_task(
                        self._learn_from_query(query, user_id)
                    )

                result = {}

                # Active retrieval (immediate)
                if include_preferences:
                    preferences = await self.agent.get_all_preferences()
                    # Filter by confidence
                    preferences = [
                        p for p in preferences
                        if p.get("confidence", 0) >= min_confidence
                    ]
                    result["preferences"] = preferences
                    logger.info(
                        f"Retrieved {len(preferences)} preferences "
                        f"(min_confidence={min_confidence})"
                    )

                if include_situations:
                    # Search similar situations using context agent
                    if self.agent.context_agent:
                        situations = await self.agent.context_agent.retrieval.search_similar_situations(
                            query=query,
                            user_id=user_id,
                            limit=3,
                            min_score=0.0,
                        )
                        result["situations"] = [
                            {
                                "id": str(sit.id),
                                "message": sit.message,
                                "factors": sit.factors.model_dump() if sit.factors else {},
                                "score": sit.similarity_score or 0.0,
                                "timestamp": sit.timestamp.isoformat() if sit.timestamp else None,
                            }
                            for sit in situations
                        ]
                        logger.info(f"Retrieved {len(situations)} similar situations")
                    else:
                        result["situations"] = []
                        logger.warning("Context awareness disabled, no situations retrieved")

                # Generate summary
                result["summary"] = self._generate_summary(
                    result.get("preferences", []),
                    result.get("situations", []),
                )
                result["learned"] = auto_learn

                logger.info(
                    f"get_context for user {user_id}: "
                    f"{len(result.get('preferences', []))} prefs, "
                    f"{len(result.get('situations', []))} situations, "
                    f"learning={'enabled' if auto_learn else 'disabled'}"
                )

                return result

            except Exception as e:
                logger.error(f"Error in get_context: {e}")
                return {
                    "error": str(e),
                    "preferences": [],
                    "situations": [],
                    "summary": f"Error retrieving context: {str(e)}",
                    "learned": False,
                }

    def _register_resources(self) -> None:
        """Register MCP resources."""

        @self.mcp.resource("user://{user_id}/preferences")
        async def user_preferences(user_id: str) -> str:
            """Get all preferences for a user.

            Resource URI: user://{user_id}/preferences

            Args:
                user_id: User identifier

            Returns:
                String representation of preferences
            """
            try:
                preferences = await self.agent.get_all_preferences()

                logger.info(f"Resource access: user://{user_id}/preferences")

                # Format as readable text
                if not preferences:
                    return f"No preferences found for user {user_id}"

                lines = [f"Preferences for user {user_id}:\n"]
                for pref in preferences:
                    key = pref.get("key", "unknown")
                    value = pref.get("value", "")
                    sentiment = pref.get("sentiment", "neutral")
                    confidence = pref.get("confidence", 0)
                    lines.append(
                        f"- {key}: {value} ({sentiment}, {confidence:.0%} confident)"
                    )

                return "\n".join(lines)

            except Exception as e:
                logger.error(f"Error accessing preferences resource: {e}")
                return f"Error: {str(e)}"

        @self.mcp.resource("user://{user_id}/contexts")
        async def user_contexts(user_id: str) -> str:
            """Get all stored contexts for a user.

            Resource URI: user://{user_id}/contexts

            Args:
                user_id: User identifier

            Returns:
                String representation of contexts
            """
            try:
                if not self.agent.context_agent:
                    return "Context awareness is disabled"

                # Query Neo4j for situations
                from fidus.memory.context.storage import ContextStorageService
                storage = ContextStorageService()

                async with storage.neo4j_driver.session() as session:
                    result = await session.run(
                        """
                        MATCH (s:Situation {user_id: $user_id, tenant_id: $tenant_id})
                        RETURN s.id as id, s.factors as factors
                        ORDER BY s.created_at DESC
                        LIMIT 20
                        """,
                        user_id=user_id,
                        tenant_id=self.tenant_id
                    )

                    records = await result.values()

                    if not records:
                        return f"No contexts found for user {user_id}"

                    lines = [f"Contexts for user {user_id}:\n"]
                    for record in records:
                        situation_id = record[0]
                        factors = record[1]
                        lines.append(f"\nSituation {situation_id}:")
                        if isinstance(factors, str):
                            import json
                            factors = json.loads(factors)
                        for key, value in factors.items():
                            lines.append(f"  - {key}: {value}")

                    return "\n".join(lines)

            except Exception as e:
                logger.error(f"Error accessing contexts resource: {e}")
                return f"Error: {str(e)}"

    async def call_tool(self, tool_name: str, **arguments: Any) -> Dict[str, Any]:
        """Call an MCP tool by name.

        Args:
            tool_name: Name of the tool to call
            arguments: Tool arguments

        Returns:
            Tool result
        """
        # Map tool names to internal methods
        tools = {
            "user.get_preferences": "get_preferences",
            "user.record_interaction": "record_interaction",
            "user.learn_preference": "learn_preference",
            "user.delete_all_preferences": "delete_all_preferences",
        }

        if tool_name not in tools:
            raise ValueError(f"Unknown tool: {tool_name}")

        # Get the tool function from the MCP instance
        # Note: FastMCP provides tools via decorator, we need to call them directly
        # For now, we'll manually route to our methods
        if tool_name == "user.get_preferences":
            return await self._call_get_preferences(**arguments)
        elif tool_name == "user.record_interaction":
            return await self._call_record_interaction(**arguments)
        elif tool_name == "user.learn_preference":
            return await self._call_learn_preference(**arguments)
        elif tool_name == "user.delete_all_preferences":
            return await self._call_delete_all_preferences(**arguments)

    async def _call_get_preferences(
        self,
        user_id: str,
        domain: Optional[str] = None,
        min_confidence: float = 0.3
    ) -> Dict[str, Any]:
        """Internal method for get_preferences tool."""
        preferences = await self.agent.get_all_preferences()

        if domain:
            preferences = [
                p for p in preferences
                if p.get("key", "").startswith(f"{domain}.")
            ]

        preferences = [
            p for p in preferences
            if p.get("confidence", 0) >= min_confidence
        ]

        return {"preferences": preferences}

    async def _call_record_interaction(
        self,
        user_id: str,
        preference_id: str,
        accepted: bool
    ) -> Dict[str, Any]:
        """Internal method for record_interaction tool."""
        if accepted:
            updated = await self.agent.accept_preference(preference_id)
        else:
            updated = await self.agent.reject_preference(preference_id)

        return {
            "status": "recorded",
            "new_confidence": updated.get("confidence", 0)
        }

    async def _call_learn_preference(
        self,
        user_id: str,
        message: str
    ) -> Dict[str, Any]:
        """Internal method for learn_preference tool."""
        response = await self.agent.chat(message, user_id=user_id)
        preferences = await self.agent.get_all_preferences()

        return {
            "status": "learned",
            "response": response,
            "total_preferences": len(preferences)
        }

    async def _call_delete_all_preferences(self, user_id: str) -> Dict[str, Any]:
        """Internal method for delete_all_preferences tool."""
        count = await self.agent.delete_all_preferences()

        return {
            "status": "deleted",
            "count": count
        }

    async def get_resource(self, resource_uri: str) -> str:
        """Get an MCP resource by URI.

        Args:
            resource_uri: Resource URI (e.g., "user://user123/preferences")

        Returns:
            Resource content as string
        """
        # Parse URI
        if resource_uri.startswith("user://"):
            parts = resource_uri[7:].split("/")
            if len(parts) < 2:
                raise ValueError(f"Invalid resource URI: {resource_uri}")

            user_id = parts[0]
            resource_type = parts[1]

            if resource_type == "preferences":
                return await self._get_preferences_resource(user_id)
            elif resource_type == "contexts":
                return await self._get_contexts_resource(user_id)
            else:
                raise ValueError(f"Unknown resource type: {resource_type}")
        else:
            raise ValueError(f"Invalid resource URI: {resource_uri}")

    async def _get_preferences_resource(self, user_id: str) -> str:
        """Get preferences resource."""
        preferences = await self.agent.get_all_preferences()

        if not preferences:
            return f"No preferences found for user {user_id}"

        lines = [f"Preferences for user {user_id}:\n"]
        for pref in preferences:
            key = pref.get("key", "unknown")
            value = pref.get("value", "")
            sentiment = pref.get("sentiment", "neutral")
            confidence = pref.get("confidence", 0)
            lines.append(
                f"- {key}: {value} ({sentiment}, {confidence:.0%} confident)"
            )

        return "\n".join(lines)

    async def _get_contexts_resource(self, user_id: str) -> str:
        """Get contexts resource."""
        if not self.agent.context_agent:
            return "Context awareness is disabled"

        from fidus.memory.context.storage import ContextStorageService
        storage = ContextStorageService()

        async with storage.neo4j_driver.session() as session:
            result = await session.run(
                """
                MATCH (s:Situation {user_id: $user_id, tenant_id: $tenant_id})
                RETURN s.id as id, s.factors as factors
                ORDER BY s.created_at DESC
                LIMIT 20
                """,
                user_id=user_id,
                tenant_id=self.tenant_id
            )

            records = await result.values()

            if not records:
                return f"No contexts found for user {user_id}"

            lines = [f"Contexts for user {user_id}:\n"]
            for record in records:
                situation_id = record[0]
                factors = record[1]
                lines.append(f"\nSituation {situation_id}:")
                if isinstance(factors, str):
                    import json
                    factors = json.loads(factors)
                for key, value in factors.items():
                    lines.append(f"  - {key}: {value}")

            return "\n".join(lines)

    async def _learn_from_query(self, query: str, user_id: str) -> None:
        """Background task: Learn from query (passive learning).

        This method runs asynchronously in the background to:
        1. Extract preferences from the query
        2. Extract and store situational context

        Args:
            query: User query to learn from
            user_id: User identifier
        """
        try:
            logger.info(f"Starting passive learning for user {user_id}")

            # Use the agent's chat method to process and learn
            # This will trigger preference extraction and context recording
            await self.agent.chat(query, user_id=user_id)

            logger.info(f"Completed passive learning for user {user_id}")

        except Exception as e:
            logger.error(f"Error in passive learning for user {user_id}: {e}")

    def _generate_summary(
        self,
        preferences: List[Dict[str, Any]],
        situations: List[Dict[str, Any]],
    ) -> str:
        """Generate human-readable summary of context.

        Args:
            preferences: List of preferences
            situations: List of situations

        Returns:
            Summary string
        """
        parts = []

        if preferences:
            parts.append(f"Found {len(preferences)} relevant preferences:")
            for pref in preferences[:5]:  # Top 5
                key = pref.get("key", "unknown")
                value = pref.get("value", "")
                confidence = pref.get("confidence", 0)
                parts.append(f"  - {key}: {value} ({confidence:.0%} confident)")

        if situations:
            parts.append(f"\nFound {len(situations)} similar past situations:")
            for sit in situations[:3]:  # Top 3
                message = sit.get("message", "")
                score = sit.get("score", 0)
                parts.append(f"  - '{message[:60]}...' (similarity: {score:.0%})")

        if not parts:
            return "No relevant context found."

        return "\n".join(parts)


# Standalone server runner
async def run_mcp_server(host: str = "0.0.0.0", port: int = 8001) -> None:
    """Run MCP server as standalone service.

    Args:
        host: Host to bind to (default: 0.0.0.0)
        port: Port to bind to (default: 8001)
    """
    logger.info(f"Starting Fidus Memory MCP Server on {host}:{port}")

    # Initialize agent
    agent = PersistentAgent(
        tenant_id=PrototypeConfig.PROTOTYPE_TENANT_ID,
        enable_context_awareness=True,
    )
    await agent.connect()

    # Create MCP server
    server = PreferenceMCPServer(agent)

    # Run server (SSE transport)
    logger.info("MCP Server ready for connections")
    await server.mcp.run(transport="sse", host=host, port=port)


if __name__ == "__main__":
    import asyncio
    asyncio.run(run_mcp_server())

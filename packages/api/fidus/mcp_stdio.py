#!/usr/bin/env python3
"""MCP server for Fidus Memory using stdio transport.

This module provides a stdio-based MCP server that Claude Desktop can launch
as a subprocess. The server communicates via stdin/stdout using the MCP protocol.

Usage:
    Claude Desktop config:
    {
      "command": "python3",
      "args": ["/path/to/fidus/packages/api/fidus/mcp_stdio.py"],
      "env": {
        "X_USER_ID": "guest-xxx",
        "NEO4J_URI": "bolt://localhost:7687",
        "NEO4J_USER": "neo4j",
        "NEO4J_PASSWORD": "password"
      }
    }
"""

import asyncio
import logging
import os
import sys
from pathlib import Path

# Add the packages/api directory to Python path so we can import fidus module
# This script is at: packages/api/fidus/mcp_stdio.py
# We need to add: packages/api to the path
script_dir = Path(__file__).parent  # packages/api/fidus
api_dir = script_dir.parent  # packages/api
sys.path.insert(0, str(api_dir))

# Setup logging to stderr (stdout is used for MCP communication)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=sys.stderr
)

logger = logging.getLogger(__name__)


def main():
    """Run MCP server with stdio transport."""
    try:
        from fidus.memory.persistent_agent import PersistentAgent
        from fidus.memory.mcp_server import PreferenceMCPServer
        from fidus.config import PrototypeConfig

        logger.info("Starting Fidus Memory MCP Server (stdio)")

        # Initialize agent (sync)
        agent = PersistentAgent(
            tenant_id=PrototypeConfig.PROTOTYPE_TENANT_ID,
            enable_context_awareness=True,
        )

        # Connect to Neo4j (sync wrapper)
        import asyncio
        asyncio.run(agent.connect())

        # Create MCP server
        server = PreferenceMCPServer(agent)

        # Run with stdio transport (this will start its own event loop)
        logger.info("MCP Server ready for stdio communication")
        server.mcp.run(transport="stdio")

    except Exception as e:
        logger.error(f"MCP Server error: {e}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    main()

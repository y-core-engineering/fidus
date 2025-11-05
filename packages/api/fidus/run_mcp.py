"""Standalone runner for Fidus Memory MCP Server.

This script starts the MCP server on port 8001, separate from the REST API.
It can be run directly or as a subprocess from main.py.
"""

import logging
import sys

from fidus.memory.mcp_server import run_mcp_server_sync

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=sys.stdout
)

logger = logging.getLogger(__name__)


if __name__ == "__main__":
    try:
        logger.info("Starting Fidus Memory MCP Server...")
        run_mcp_server_sync(host="0.0.0.0", port=8001)
    except KeyboardInterrupt:
        logger.info("MCP Server stopped by user")
    except Exception as e:
        logger.error(f"MCP Server error: {e}", exc_info=True)
        sys.exit(1)

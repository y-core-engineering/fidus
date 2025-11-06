#!/bin/bash
# Wrapper script to run Fidus Memory MCP server with Poetry environment
# This ensures all Python dependencies are available

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to the packages/api directory
cd "$SCRIPT_DIR"

# Run the MCP stdio server using Poetry
exec poetry run python fidus/mcp_stdio.py

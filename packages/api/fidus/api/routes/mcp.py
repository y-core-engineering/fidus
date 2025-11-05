"""MCP (Model Context Protocol) API routes.

This module provides REST API endpoints for MCP tool calls and resource access.
"""

from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from fidus.memory.mcp_server import PreferenceMCPServer
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/mcp", tags=["mcp"])

# Global MCP server instance (initialized from main.py)
mcp_server: Optional[PreferenceMCPServer] = None


def init_mcp_server(server: PreferenceMCPServer) -> None:
    """Initialize MCP server (called from main.py).

    Args:
        server: PreferenceMCPServer instance
    """
    global mcp_server
    mcp_server = server
    logger.info("MCP server initialized in routes")


class MCPCallRequest(BaseModel):
    """Request body for MCP tool calls."""

    tool: str
    arguments: Dict[str, Any] = {}


class MCPCallResponse(BaseModel):
    """Response from MCP tool calls."""

    result: Dict[str, Any]


@router.post("/call", response_model=MCPCallResponse)
async def mcp_call(request: MCPCallRequest) -> MCPCallResponse:
    """Handle MCP tool calls.

    Args:
        request: Tool name and arguments

    Returns:
        Tool result

    Example:
        POST /mcp/call
        {
            "tool": "get_preferences",
            "arguments": {"user_id": "user123", "domain": "coffee"}
        }
    """
    if mcp_server is None:
        raise HTTPException(status_code=500, detail="MCP server not initialized")

    try:
        tool_name = request.tool
        arguments = request.arguments

        logger.info(f"MCP tool call: {tool_name} with arguments: {arguments}")

        # Call MCP tool
        result = await mcp_server.call_tool(tool_name, **arguments)

        return MCPCallResponse(result=result)

    except ValueError as e:
        logger.error(f"Invalid MCP tool call: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error in MCP tool call: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/resource/{resource_path:path}")
async def mcp_resource(resource_path: str) -> Dict[str, Any]:
    """Handle MCP resource requests.

    Args:
        resource_path: Resource URI path (without protocol)

    Returns:
        Resource content

    Example:
        GET /mcp/resource/user://user123/preferences
        or
        GET /mcp/resource/user/user123/preferences
    """
    if mcp_server is None:
        raise HTTPException(status_code=500, detail="MCP server not initialized")

    try:
        # Normalize resource URI (add user:// if not present)
        if not resource_path.startswith("user://"):
            # Convert /user/user123/preferences to user://user123/preferences
            if resource_path.startswith("user/"):
                resource_path = resource_path.replace("user/", "user://", 1)
            else:
                resource_path = f"user://{resource_path}"

        logger.info(f"MCP resource access: {resource_path}")

        # Get resource
        content = await mcp_server.get_resource(resource_path)

        return {
            "uri": resource_path,
            "content": content
        }

    except ValueError as e:
        logger.error(f"Invalid MCP resource URI: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error accessing MCP resource: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tools")
async def list_tools() -> Dict[str, Any]:
    """List available MCP tools.

    Returns:
        Dictionary with available tools
    """
    if mcp_server is None:
        raise HTTPException(status_code=500, detail="MCP server not initialized")

    tools = [
        {
            "name": "get_preferences",
            "description": "Get user preferences, optionally filtered by domain",
            "parameters": [
                {"name": "user_id", "type": "string", "required": True},
                {"name": "domain", "type": "string", "required": False},
                {"name": "min_confidence", "type": "number", "required": False, "default": 0.3}
            ]
        },
        {
            "name": "record_interaction",
            "description": "Record user interaction with preference suggestion",
            "parameters": [
                {"name": "user_id", "type": "string", "required": True},
                {"name": "preference_id", "type": "string", "required": True},
                {"name": "accepted", "type": "boolean", "required": True}
            ]
        },
        {
            "name": "learn_preference",
            "description": "Learn preferences from a user message",
            "parameters": [
                {"name": "user_id", "type": "string", "required": True},
                {"name": "message", "type": "string", "required": True}
            ]
        },
        {
            "name": "delete_all_preferences",
            "description": "Delete all preferences for a user (privacy feature)",
            "parameters": [
                {"name": "user_id", "type": "string", "required": True}
            ]
        }
    ]

    return {
        "tools": tools,
        "count": len(tools)
    }


@router.get("/resources")
async def list_resources() -> Dict[str, Any]:
    """List available MCP resources.

    Returns:
        Dictionary with available resources
    """
    if mcp_server is None:
        raise HTTPException(status_code=500, detail="MCP server not initialized")

    resources = [
        {
            "uri_template": "user://{user_id}/preferences",
            "description": "Get all preferences for a user"
        },
        {
            "uri_template": "user://{user_id}/contexts",
            "description": "Get all stored contexts for a user"
        }
    ]

    return {
        "resources": resources,
        "count": len(resources)
    }

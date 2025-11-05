"""Simple authentication middleware for Fidus Memory API.

This middleware provides basic user identification and isolation:
- Extracts user_id from X-User-ID header
- Creates guest users if no user_id provided (format: guest-{uuid4})
- Stores user_id in request.state for use by endpoints
- Returns user_id in response header for client tracking
- Skips authentication for health check and docs endpoints
- Phase 4: Sanitizes user_id to prevent injection attacks
"""

import logging
import uuid
from typing import Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from fidus.api.utils.sanitize import sanitize_user_id

logger = logging.getLogger(__name__)

# Paths that don't require authentication
SKIP_AUTH_PATHS = [
    "/health",
    "/health/db",
    "/docs",
    "/redoc",
    "/openapi.json",
]


class SimpleAuthMiddleware(BaseHTTPMiddleware):
    """Simple authentication middleware for user identification and isolation.

    Phase 4: Multi-User Support
    - Extracts user_id from X-User-ID header or creates guest user
    - Ensures every request has a user_id in request.state
    - Returns user_id in X-User-ID response header
    - Skips auth for health/docs endpoints
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Process request and ensure user_id is present.

        Args:
            request: FastAPI request object
            call_next: Next middleware/endpoint in chain

        Returns:
            Response with X-User-ID header
        """
        # Skip authentication for health checks and docs
        if request.url.path in SKIP_AUTH_PATHS:
            return await call_next(request)

        # Extract user_id from header or create guest user
        user_id = request.headers.get("X-User-ID")

        if not user_id:
            # Generate guest user ID
            user_id = f"guest-{uuid.uuid4()}"
            logger.info(f"Created guest user: {user_id}")
        else:
            # Phase 4: Sanitize user_id to prevent injection attacks
            user_id = sanitize_user_id(user_id)
            logger.debug(f"Authenticated user: {user_id}")

        # Store user_id in request state for endpoint access
        request.state.user_id = user_id

        # Process request
        response = await call_next(request)

        # Add user_id to response headers for client tracking
        response.headers["X-User-ID"] = user_id

        return response

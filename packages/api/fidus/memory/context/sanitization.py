"""Input sanitization for context extraction security.

This module provides input validation and sanitization to prevent
injection attacks and ensure data quality.
"""

import html
import re
from typing import Optional


class InputSanitizer:
    """Sanitize user input for context extraction.

    This class provides methods to clean and validate user input before
    processing, preventing XSS, injection attacks, and ensuring data quality.
    """

    # Maximum length for user messages
    MAX_MESSAGE_LENGTH = 10000

    # Maximum length for context factor keys and values
    MAX_FACTOR_KEY_LENGTH = 100
    MAX_FACTOR_VALUE_LENGTH = 500

    # Regex patterns for validation
    SNAKE_CASE_PATTERN = re.compile(r"^[a-z][a-z0-9_]*$")
    SAFE_VALUE_PATTERN = re.compile(r"^[a-zA-Z0-9\s\-_.,!?()]+$")

    @staticmethod
    def sanitize_message(message: str) -> str:
        """Sanitize a user message for processing.

        Args:
            message: Raw user input

        Returns:
            str: Sanitized message

        Raises:
            ValueError: If message is empty or too long
        """
        if not message or not message.strip():
            raise ValueError("Message cannot be empty")

        # Strip whitespace
        message = message.strip()

        # Check length
        if len(message) > InputSanitizer.MAX_MESSAGE_LENGTH:
            raise ValueError(
                f"Message exceeds maximum length of {InputSanitizer.MAX_MESSAGE_LENGTH} characters"
            )

        # HTML escape to prevent XSS
        message = html.escape(message)

        # Remove control characters
        message = "".join(char for char in message if ord(char) >= 32 or char in "\n\t")

        return message

    @staticmethod
    def sanitize_factor_key(key: str) -> str:
        """Sanitize a context factor key.

        Args:
            key: Factor key (e.g., "time_of_day")

        Returns:
            str: Sanitized key

        Raises:
            ValueError: If key is invalid
        """
        if not key or not key.strip():
            raise ValueError("Factor key cannot be empty")

        key = key.strip().lower()

        # Check length
        if len(key) > InputSanitizer.MAX_FACTOR_KEY_LENGTH:
            raise ValueError(
                f"Factor key exceeds maximum length of {InputSanitizer.MAX_FACTOR_KEY_LENGTH}"
            )

        # Validate snake_case format
        if not InputSanitizer.SNAKE_CASE_PATTERN.match(key):
            raise ValueError(
                f"Factor key '{key}' must be in snake_case format (lowercase, underscores only)"
            )

        return key

    @staticmethod
    def sanitize_factor_value(value: str) -> str:
        """Sanitize a context factor value.

        Args:
            value: Factor value (e.g., "morning", "home")

        Returns:
            str: Sanitized value

        Raises:
            ValueError: If value is invalid
        """
        if not value or not value.strip():
            raise ValueError("Factor value cannot be empty")

        value = value.strip().lower()

        # Check length
        if len(value) > InputSanitizer.MAX_FACTOR_VALUE_LENGTH:
            raise ValueError(
                f"Factor value exceeds maximum length of {InputSanitizer.MAX_FACTOR_VALUE_LENGTH}"
            )

        # HTML escape
        value = html.escape(value)

        # Remove control characters
        value = "".join(char for char in value if ord(char) >= 32 or char in "\n\t")

        return value

    @staticmethod
    def validate_tenant_id(tenant_id: str) -> None:
        """Validate tenant ID format.

        Args:
            tenant_id: Tenant identifier

        Raises:
            ValueError: If tenant_id is invalid
        """
        if not tenant_id or not tenant_id.strip():
            raise ValueError("Tenant ID cannot be empty")

        # Basic format validation (alphanumeric, hyphens, underscores)
        if not re.match(r"^[a-zA-Z0-9\-_]+$", tenant_id):
            raise ValueError(
                "Tenant ID must contain only alphanumeric characters, hyphens, and underscores"
            )

        if len(tenant_id) > 255:
            raise ValueError("Tenant ID is too long")

    @staticmethod
    def validate_user_id(user_id: str) -> None:
        """Validate user ID format.

        Args:
            user_id: User identifier

        Raises:
            ValueError: If user_id is invalid
        """
        if not user_id or not user_id.strip():
            raise ValueError("User ID cannot be empty")

        # Basic format validation (alphanumeric, hyphens, underscores)
        if not re.match(r"^[a-zA-Z0-9\-_]+$", user_id):
            raise ValueError(
                "User ID must contain only alphanumeric characters, hyphens, and underscores"
            )

        if len(user_id) > 255:
            raise ValueError("User ID is too long")

    @staticmethod
    def sanitize_context_factors(factors: dict[str, str]) -> dict[str, str]:
        """Sanitize all context factors.

        Args:
            factors: Dictionary of context factors

        Returns:
            dict[str, str]: Sanitized factors

        Raises:
            ValueError: If any factor is invalid
        """
        if not isinstance(factors, dict):
            raise ValueError("Factors must be a dictionary")

        sanitized = {}

        for key, value in factors.items():
            # Sanitize key and value
            clean_key = InputSanitizer.sanitize_factor_key(key)
            clean_value = InputSanitizer.sanitize_factor_value(str(value))

            sanitized[clean_key] = clean_value

        return sanitized


class RateLimiter:
    """Simple in-memory rate limiter for API protection.

    This is a basic implementation. In production, use Redis-based
    rate limiting with proper distributed coordination.
    """

    def __init__(self, max_requests: int = 100, window_seconds: int = 60):
        """Initialize rate limiter.

        Args:
            max_requests: Maximum requests per window
            window_seconds: Time window in seconds
        """
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._requests: dict[str, list[float]] = {}

    def is_allowed(self, identifier: str, timestamp: Optional[float] = None) -> bool:
        """Check if request is allowed under rate limit.

        Args:
            identifier: Unique identifier (e.g., user_id, tenant_id)
            timestamp: Optional timestamp (defaults to current time)

        Returns:
            bool: True if request is allowed, False if rate limited
        """
        import time

        if timestamp is None:
            timestamp = time.time()

        # Get or create request history
        if identifier not in self._requests:
            self._requests[identifier] = []

        # Remove old requests outside window
        cutoff = timestamp - self.window_seconds
        self._requests[identifier] = [
            ts for ts in self._requests[identifier] if ts > cutoff
        ]

        # Check limit
        if len(self._requests[identifier]) >= self.max_requests:
            return False

        # Add current request
        self._requests[identifier].append(timestamp)
        return True

    def reset(self, identifier: str) -> None:
        """Reset rate limit for an identifier.

        Args:
            identifier: Unique identifier to reset
        """
        if identifier in self._requests:
            del self._requests[identifier]

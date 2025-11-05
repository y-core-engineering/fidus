"""Input sanitization utilities.

Phase 4: Security - Sanitize all user input to prevent XSS and injection attacks.
"""

import bleach
from fastapi import HTTPException


# Maximum input length (Phase 4 requirement)
MAX_INPUT_LENGTH = 5000

# Allowed HTML tags (very restrictive - only plain text)
ALLOWED_TAGS: list[str] = []
ALLOWED_ATTRIBUTES: dict[str, list[str]] = {}


def sanitize_text(text: str, field_name: str = "input") -> str:
    """Sanitize user text input.

    Args:
        text: User-provided text
        field_name: Name of the field for error messages

    Returns:
        Sanitized text (HTML stripped, max length enforced)

    Raises:
        HTTPException: If input exceeds maximum length
    """
    # Check length limit
    if len(text) > MAX_INPUT_LENGTH:
        raise HTTPException(
            status_code=400,
            detail=f"{field_name} exceeds maximum length of {MAX_INPUT_LENGTH} characters"
        )

    # Strip all HTML tags and attributes
    sanitized = bleach.clean(
        text,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        strip=True
    )

    # Normalize whitespace
    sanitized = " ".join(sanitized.split())

    return sanitized


def sanitize_user_id(user_id: str) -> str:
    """Sanitize user_id to prevent injection attacks.

    Args:
        user_id: User identifier from auth header

    Returns:
        Sanitized user_id

    Raises:
        HTTPException: If user_id is invalid
    """
    # User IDs should be alphanumeric + hyphens/underscores only
    if not user_id or len(user_id) > 255:
        raise HTTPException(status_code=400, detail="Invalid user_id")

    # Allow only safe characters
    allowed_chars = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_")
    if not all(c in allowed_chars for c in user_id):
        raise HTTPException(
            status_code=400,
            detail="user_id contains invalid characters (only alphanumeric, hyphens, underscores allowed)"
        )

    return user_id

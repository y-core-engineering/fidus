"""Fidus API Routes.

Import all route modules for easy registration in main.py
"""

from fidus.api.routes import memory, mcp, health, admin, user, person, organization

__all__ = ["memory", "mcp", "health", "admin", "user", "person", "organization"]

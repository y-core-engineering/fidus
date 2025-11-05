"""Fidus API Routes.

Import all route modules for easy registration in main.py
"""

from fidus.api.routes import memory, mcp, health

__all__ = ["memory", "mcp", "health"]

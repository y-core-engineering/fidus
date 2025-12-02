"""
Authentication dependencies.

Provides FastAPI dependencies for user and tenant context.
"""

from fastapi import Request, HTTPException, status


async def get_current_user(request: Request) -> str:
    """
    Get current user ID from request state.

    The user_id is set by the SimpleAuthMiddleware from the X-User-ID header.

    Args:
        request: FastAPI request object

    Returns:
        str: Current user ID

    Raises:
        HTTPException: If user is not authenticated

    Usage:
        @router.get("/profile")
        async def get_profile(user_id: str = Depends(get_current_user)):
            ...
    """
    user_id = getattr(request.state, "user_id", None)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not authenticated",
        )
    return user_id


async def get_current_tenant(request: Request) -> str:
    """
    Get current tenant ID from request.

    Currently, tenant_id equals user_id for single-tenant mode.
    In multi-tenant mode, this would be extracted from JWT claims or headers.

    Args:
        request: FastAPI request object

    Returns:
        str: Current tenant ID

    Raises:
        HTTPException: If tenant is not available

    Usage:
        @router.get("/data")
        async def get_data(tenant_id: str = Depends(get_current_tenant)):
            ...
    """
    # In current implementation, tenant_id = user_id
    user_id = getattr(request.state, "user_id", None)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tenant not available",
        )
    return user_id

"""Admin authentication for write endpoints."""

import secrets
from typing import Annotated

from fastapi import Header, HTTPException

from app.config import get_settings


def require_admin(x_admin_token: Annotated[str | None, Header()] = None) -> None:
    """Reject the request unless X-Admin-Token matches ADMIN_TOKEN.

    Writes are disabled entirely when ADMIN_TOKEN is not configured.
    """
    expected = get_settings().admin_token
    if not expected:
        raise HTTPException(status_code=403, detail="Writes are disabled: ADMIN_TOKEN not configured")
    if not x_admin_token or not secrets.compare_digest(x_admin_token, expected):
        raise HTTPException(status_code=401, detail="Invalid admin token")

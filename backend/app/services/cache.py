"""Optional Redis cache layer for GET endpoints. Speeds up responses for all users; when auth exists, can scope by user for longer TTL."""

from __future__ import annotations

import hashlib
import json
from typing import Any

from app.config import get_settings

_REDIS: Any = None
_KEY_PREFIX = "portfolio:"


def _get_redis():
    """Lazy Redis connection. Returns None if REDIS_URL not set."""
    global _REDIS
    if _REDIS is not None:
        return _REDIS
    settings = get_settings()
    if not settings.redis_url:
        return None
    try:
        import redis
        _REDIS = redis.from_url(
            settings.redis_url,
            decode_responses=True,
            socket_connect_timeout=2,
        )
        return _REDIS
    except Exception:
        return None


def cache_key(prefix: str, *parts: str, user_hint: str | None = None) -> str:
    """Build a cache key. Include user_hint when request is from a signed-in user (e.g. session id hash)."""
    key = ":".join((_KEY_PREFIX, prefix) + tuple(parts))
    if user_hint:
        key += ":" + hashlib.sha256(user_hint.encode()).hexdigest()[:16]
    return key


def get_cached(key: str) -> Any | None:
    """Return cached JSON value or None if miss or Redis unavailable."""
    r = _get_redis()
    if not r:
        return None
    try:
        raw = r.get(key)
        if raw is None:
            return None
        return json.loads(raw)
    except Exception:
        return None


def set_cached(key: str, value: Any, ttl_seconds: int) -> None:
    """Store value in cache with TTL. No-op if Redis unavailable."""
    r = _get_redis()
    if not r:
        return
    try:
        r.setex(key, ttl_seconds, json.dumps(value, default=str))
    except Exception:
        pass


def invalidate_pattern(prefix: str) -> None:
    """Remove keys matching prefix (e.g. after blog post create/update). No-op if Redis unavailable."""
    r = _get_redis()
    if not r:
        return
    try:
        pattern = _KEY_PREFIX + prefix + "*"
        keys = list(r.scan_iter(match=pattern, count=100))
        if keys:
            r.delete(*keys)
    except Exception:
        pass

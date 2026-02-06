"""Tests for Redis cache layer (no-op when REDIS_URL unset)."""

from app.services.cache import cache_key, get_cached, set_cached


def test_cache_key_without_user_hint() -> None:
    key = cache_key("blog:list", "1", "20")
    assert key.startswith("portfolio:")
    assert "blog:list" in key and "1" in key and "20" in key


def test_cache_key_with_user_hint() -> None:
    key = cache_key("blog:post", "hello-world", user_hint="Bearer abc")
    assert key.startswith("portfolio:")
    assert "blog:post" in key and "hello-world" in key
    assert len(key) > len("portfolio:blog:post:hello-world")


def test_get_cached_returns_none_when_redis_unset() -> None:
    """When REDIS_URL is not set, get_cached returns None (no error)."""
    assert get_cached("portfolio:nonexistent:key") is None


def test_set_cached_no_op_when_redis_unset() -> None:
    """When REDIS_URL is not set, set_cached does not raise."""
    set_cached("portfolio:test:key", {"a": 1}, 60)

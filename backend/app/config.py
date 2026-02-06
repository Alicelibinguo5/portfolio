"""Application configuration using pydantic-settings."""

from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Environment-based configuration."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Server
    port: int = 8000
    reload: bool = False
    environment: Literal["development", "staging", "production"] = "development"

    # CORS
    cors_origins: str = "*"

    # Database (optional; blog requires it)
    database_url: str | None = None  # env: DATABASE_URL
    postgres_url: str | None = None  # env: POSTGRES_URL

    @property
    def dsn(self) -> str | None:
        """Resolved database DSN (database_url or postgres_url)."""
        url = self.database_url or self.postgres_url
        if not url:
            return None
        if url.startswith("postgres://"):
            return url.replace("postgres://", "postgresql+psycopg://", 1)
        if url.startswith("postgresql://") and "+psycopg" not in url:
            return url.replace("postgresql://", "postgresql+psycopg://", 1)
        return url

    # Blog
    seed_blog: bool = False

    # Resume
    resume_file: str | None = None

    # AWS
    aws_region: str | None = None
    aws_default_region: str | None = None
    aws_access_key_id: str | None = None
    aws_secret_access_key: str | None = None
    s3_bucket: str | None = None
    s3_public_base: str | None = None

    # GitHub
    github_token: str | None = None

    # Redis (optional; when set, GET responses are cached for signed-in / better UX)
    redis_url: str | None = None  # env: REDIS_URL

    @property
    def effective_aws_region(self) -> str | None:
        """AWS region (aws_region or aws_default_region)."""
        return self.aws_region or self.aws_default_region


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance."""
    return Settings()

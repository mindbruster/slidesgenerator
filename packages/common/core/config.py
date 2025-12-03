"""
Decksnap Configuration
Using Pydantic Settings for environment variable management
"""

from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Database
    database_url: str = "postgresql+asyncpg://decksnap:decksnap@localhost:5432/decksnap"

    # OpenRouter API
    openrouter_api_key: str = ""
    openrouter_model: str = "@preset/pup"
    openrouter_base_url: str = "https://openrouter.ai/api/v1"

    # Application
    debug: bool = True
    cors_origins: list[str] = ["http://localhost:13000"]
    environment: Literal["development", "production", "test"] = "development"

    # API
    api_v1_prefix: str = "/api/v1"


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


settings = get_settings()

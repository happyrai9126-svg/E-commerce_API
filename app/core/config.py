"""
Application configuration.

Loads every runtime setting (database credentials, the Unsplash API key and
the JWT signing parameters) from environment variables or a local ``.env``
file via pydantic-settings, and exposes them as the singleton
:data:`settings` object imported throughout the app.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
    Typed container for all environment-driven settings.

    Values are read from the process environment first and fall back to the
    ``.env`` file. A missing or badly typed value raises a validation error at
    import time, so misconfiguration fails fast rather than at request time.

    Attributes:
        DB_USER: MySQL account name used to connect.
        DB_PASSWORD: Password for ``DB_USER``.
        DB_HOST: Hostname or IP of the MySQL server.
        DB_PORT: TCP port the MySQL server listens on.
        DB_NAME: Name of the application database/schema.
        UNSPLASH_ACCESS_KEY: Client ID for the Unsplash API, used by the
            product search service.
        SECRET_KEY: Secret used to sign and verify JWT access tokens.
        ALGORITHM: JWT signing algorithm, e.g. ``"HS256"``.
        ACCESS_TOKEN_EXPIRE_MINUTES: Lifetime of an issued access token, in
            minutes.
    """
    # Database
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str

    # Unsplash API
    UNSPLASH_ACCESS_KEY: str

    # Auth / JWT
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()

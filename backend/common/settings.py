from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    app_name: str = "JWT & RBAC"
    database_url: str
    secret_key: str
    debug: bool = False
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    allowed_hosts: list[str] = ["*"]
    log_level: str = "INFO"
    api_version: str = "v1"
    api_key : str
    api_header_name : str =  "Authorization"
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="allow")

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
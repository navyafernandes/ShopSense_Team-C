from dotenv import load_dotenv
import os
from pathlib import Path

# Resolve path to backend directory and root directory to find .env
BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:Postgres%40123@localhost:5432/shopsense"
)
# Render and other cloud providers use postgres:// which SQLAlchemy 2.0 requires as postgresql://
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "shopsense_super_secret_key_2026"
)

ALGORITHM = os.getenv("ALGORITHM", "HS256")

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")

# Parse CORS origins from environment variable (comma-separated), with safe defaults
_raw_cors = os.getenv("CORS_ORIGINS", "")
if _raw_cors.strip():
    CORS_ORIGINS = [origin.strip() for origin in _raw_cors.split(",") if origin.strip()]
else:
    CORS_ORIGINS = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:80",
        "http://127.0.0.1:80",
        "http://localhost",
        "http://127.0.0.1",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
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

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "shopsense_super_secret_key_2026"
)

ALGORITHM = os.getenv("ALGORITHM", "HS256")

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
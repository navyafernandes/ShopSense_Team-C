import sys
from pathlib import Path
import pytest

backend_dir = str(Path(__file__).resolve().parent.parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.seed.seed_database import run_seed

@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    try:
        run_seed()
    except Exception as e:
        print(f"[conftest] Database init note: {e}")

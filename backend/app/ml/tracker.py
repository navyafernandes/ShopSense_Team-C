import time
import json
import logging
from pathlib import Path
from datetime import datetime

logger = logging.getLogger("shopsense.ml")

TRACKER_DIR = Path(__file__).resolve().parent / "logs"
TRACKER_DIR.mkdir(parents=True, exist_ok=True)
RUNS_FILE = TRACKER_DIR / "ml_runs.jsonl"


class MLTracker:
    """
    Lightweight, embedded ML model tracking and metrics versioning
    system for ShopSense machine learning experiments.
    """

    @staticmethod
    def log_experiment(
        experiment_name: str,
        parameters: dict,
        metrics: dict,
        artifacts: dict = None,
    ) -> dict:
        run_record = {
            "timestamp": datetime.utcnow().isoformat(),
            "experiment": experiment_name,
            "params": parameters,
            "metrics": metrics,
            "artifacts": artifacts or {},
        }

        try:
            with open(RUNS_FILE, "a", encoding="utf-8") as f:
                f.write(json.dumps(run_record) + "\n")
        except Exception as e:
            logger.warning(f"Failed to log ML experiment: {e}")

        return run_record

    @staticmethod
    def get_recent_runs(limit: int = 20) -> list:
        if not RUNS_FILE.exists():
            return []
        try:
            with open(RUNS_FILE, "r", encoding="utf-8") as f:
                lines = f.readlines()
            return [json.loads(line) for line in lines[-limit:]]
        except Exception:
            return []

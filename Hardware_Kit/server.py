# save as server.py
from flask import Flask, request, jsonify
from datetime import datetime, timezone
import os
import json
import pandas as pd

app = Flask(__name__)

DATA_DIR = "data"
JSONL_PATH = os.path.join(DATA_DIR, "data.jsonl")
CSV_PATH = os.path.join(DATA_DIR, "data.csv")

os.makedirs(DATA_DIR, exist_ok=True)

def flatten(d, parent_key="", sep="."):
    """Flatten nested dicts for easy CSV writing."""
    items = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten(v, new_key, sep=sep).items())
        else:
            items.append((new_key, v))
    return dict(items)

@app.route("/ingest", methods=["POST"])
def ingest():
    try:
        payload = request.get_json(force=True, silent=False)
    except Exception as e:
        return jsonify({"ok": False, "error": f"Invalid JSON: {e}"}), 400

    # Server-side timestamps
    now_utc = datetime.now(timezone.utc)
    now_local = datetime.now().astimezone()

    record = {
        "server_time_iso_local": now_local.isoformat(timespec="seconds"),
        "server_time_iso_utc": now_utc.isoformat(timespec="seconds"),
        "client_payload": payload,
    }

    # Append to JSONL
    with open(JSONL_PATH, "a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")

    # Build a flat row for CSV
    flat = {
        "server_time_local": record["server_time_iso_local"],
        "server_time_utc": record["server_time_iso_utc"],
    }

    # include client ts if present
    if isinstance(payload, dict):
        flat["client_ts"] = payload.get("ts")
        flat["device"] = payload.get("device")

        sensors = payload.get("sensors", {})
        if isinstance(sensors, dict):
            for k, v in flatten(sensors).items():
                flat[f"sensors.{k}"] = v

    # Append to CSV (create if not exists)
    df = pd.DataFrame([flat])
    if not os.path.exists(CSV_PATH):
        df.to_csv(CSV_PATH, index=False)
    else:
        df.to_csv(CSV_PATH, index=False, mode="a", header=False)

    return jsonify({"ok": True, "saved": {"jsonl": JSONL_PATH, "csv": CSV_PATH}}), 200


@app.route("/latest", methods=["GET"])
def latest():
    """Return the most recent record from JSONL file."""
    if not os.path.exists(JSONL_PATH) or os.path.getsize(JSONL_PATH) == 0:
        return jsonify({"ok": False, "error": "No data yet"}), 404

    with open(JSONL_PATH, "r", encoding="utf-8") as f:
        last_line = f.readlines()[-1]

    try:
        record = json.loads(last_line)
    except Exception as e:
        return jsonify({"ok": False, "error": f"Corrupt record: {e}"}), 500

    return jsonify({"ok": True, "latest": record}), 200


if __name__ == "__main__":
    # Listen on all interfaces so ESP32 and other laptops can reach it
    app.run(host="0.0.0.0", port=5000, debug=False)

import sys
import os
import argparse

# ------------------------------------
# Fix Windows console encoding for emoji
# ------------------------------------
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

# ------------------------------------
# Make sure `backend/` is on sys.path
# ------------------------------------
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app
from database.db import db
from models.complaint_model import Complaint
from services.complaint_service import assign_category, assign_priority, generate_title, ml_predict

# ------------------------------------
# Resolve dataset path relative to the
# backend/ directory (one level up from data/)
# ------------------------------------
DATASET_PATH = os.path.join(
    os.path.dirname(__file__), "..", "datasets", "complaints_data.csv"
)

BATCH_SIZE = 100  # commit every N rows for efficiency


def parse_args():
    parser = argparse.ArgumentParser(description="Seed complaints into the database.")
    parser.add_argument(
        "--clear",
        action="store_true",
        help="Delete all existing complaints before seeding.",
    )
    return parser.parse_args()


def load_complaints(filepath: str) -> list[str]:
    """Read the CSV dataset file and return up to 2000 non-empty descriptions."""
    import csv
    lines = []
    with open(filepath, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        next(reader, None) # skip header
        for row in reader:
            if row and row[0].strip():
                lines.append(row[0].strip())
                if len(lines) >= 2000:
                    break
    return lines


def seed(clear: bool = False):
    app = create_app()

    with app.app_context():
        # --- Create tables if they don't exist ---
        db.create_all()

        # --- Optionally clear old data ---
        if clear:
            db.drop_all()
            db.create_all()
            print("[CLEAR] Dropped and recreated tables to reset IDs to 1.")

        # --- Check for existing data to prevent duplicates ---
        existing_count = Complaint.query.count()
        if existing_count > 0 and not clear:
            print(f"[WARN] Database already has {existing_count} complaints.")
            print("       Use --clear flag to wipe and re-seed.")
            print("       Skipping seed to avoid duplicates.")
            return

        # --- Load dataset ---
        lines = load_complaints(DATASET_PATH)
        total = len(lines)
        print(f"[INFO] Loaded {total} complaints from dataset.\n")

        inserted = 0
        errors = 0

        for i, description in enumerate(lines, start=1):
            try:
                # --- Classify each complaint using Hybrid Logic ---
                # 🔹 Rule-based
                rule_data = assign_category(description)
                rule_category = rule_data["category"]
                rule_conf = rule_data["confidence"]

                # 🔹 ML-based
                ml_category, ml_conf = ml_predict(description)

                if rule_conf >= 0.65:
                    final_category = rule_category
                elif ml_conf and ml_conf >= 0.75:
                    final_category = ml_category
                else:
                    final_category = rule_category

                priority_data = assign_priority(description, final_category)
                title = generate_title(description)

                complaint = Complaint(
                    title=title,
                    description=description,
                    category=final_category,
                    area="Delhi",
                    priority=priority_data["priority"],
                    status="pending",
                )
                db.session.add(complaint)
                inserted += 1

            except Exception as e:
                errors += 1
                print(f"  [ERROR] Line {i}: {e}")
                continue

            # --- Batch commit ---
            if inserted % BATCH_SIZE == 0:
                db.session.commit()
                print(f"  [OK] {inserted}/{total} inserted...")

        # --- Final commit for remaining rows ---
        db.session.commit()

        print(f"\n{'=' * 40}")
        print(f"  SEEDING COMPLETE")
        print(f"  Inserted : {inserted}")
        print(f"  Errors   : {errors}")
        print(f"  Total DB : {Complaint.query.count()}")
        print(f"{'=' * 40}")


if __name__ == "__main__":
    args = parse_args()
    seed(clear=args.clear)
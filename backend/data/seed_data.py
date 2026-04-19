"""
seed_data.py
============
Reads complaints_dataset.txt and seeds the database in bulk.

Usage:
    cd backend
    python -m data.seed_data          # insert all 1000 complaints
    python -m data.seed_data --clear   # wipe existing + re-insert
"""

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
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app
from database.db import db
from models.complaint_model import Complaint
from services.complaint_service import assign_category, assign_priority, generate_title

# ------------------------------------
# Resolve dataset path relative to the
# backend/ directory (one level up from data/)
# ------------------------------------
DATASET_PATH = os.path.join(
    os.path.dirname(__file__), "..", "complaints_dataset.txt"
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
    """Read the dataset file and return non-empty, stripped lines."""
    with open(filepath, "r", encoding="utf-8") as f:
        lines = [line.strip() for line in f if line.strip()]
    return lines


def seed(clear: bool = False):
    app = create_app()

    with app.app_context():
        # --- Create tables if they don't exist ---
        db.create_all()

        # --- Optionally clear old data ---
        if clear:
            deleted = Complaint.query.delete()
            db.session.commit()
            print(f"[CLEAR] Deleted {deleted} existing complaints.")

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
                # --- Classify each complaint ---
                category_data = assign_category(description)
                priority_data = assign_priority(description, category_data["category"])
                title = generate_title(description)

                complaint = Complaint(
                    title=title,
                    description=description,
                    category=category_data["category"],
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
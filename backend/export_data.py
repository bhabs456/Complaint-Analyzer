import csv
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
from app import create_app
from models.complaint_model import Complaint

app = create_app()

def export_data():
    with app.app_context():
        complaints = Complaint.query.all()

        with open("complaints_data.csv", "w", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)

            # header
            writer.writerow(["description", "category"])

            for c in complaints:
                writer.writerow([c.description, c.category])

        print(f"✅ Exported {len(complaints)} rows")


if __name__ == "__main__":
    export_data()
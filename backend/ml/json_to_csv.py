import json
import csv

INPUT_FILE = "../datasets/complaints.json"
OUTPUT_FILE = "../datasets/complaints_data.csv"

def convert():
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)

        # header
        writer.writerow(["description", "category"])

        for item in data:
            desc = item.get("description", "").strip()
            cat = item.get("category", "").strip()

            if desc and cat:
                writer.writerow([desc, cat])

    print(f"✅ Converted {len(data)} records to CSV")


if __name__ == "__main__":
    convert()
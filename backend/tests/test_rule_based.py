import sys
import os

# go to backend root
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, BACKEND_DIR)

from services.complaint_service import assign_category

from test_data import tests

correct = 0

for i, test in enumerate(tests):
    pred = assign_category(test["description"])["category"]

    if pred == test["expected"]:
        correct += 1
        print(f"✅ {i+1}")
    else:
        print(f"❌ {i+1} | Got: {pred}")

print(f"\nRule Accuracy: {correct}/{len(tests)}")
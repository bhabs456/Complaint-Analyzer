import sys
import os

# go to backend root
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, BACKEND_DIR)

from services.complaint_service import assign_category, ml_predict

from test_data import tests

correct = 0

for i, test in enumerate(tests):
    text = test["description"]

    rule = assign_category(text)
    ml, ml_conf = ml_predict(text)

    if rule["confidence"] >= 0.65:
        pred = rule["category"]
    elif ml_conf and ml_conf >= 0.75:
        pred = ml
    else:
        pred = rule["category"]

    if pred == test["expected"]:
        correct += 1
        print(f"✅ {i+1}")
    else:
        print(f"❌ {i+1} | Got: {pred}")

print(f"\nHybrid Accuracy: {correct}/{len(tests)}")
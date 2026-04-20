VALID_CATEGORIES = [
    "sanitation", "water", "roads", "traffic",
    "electricity", "sewage", "lighting", "pollution", "uncertain"
]

VALID_STATUS = ["pending", "in-progress", "resolved"]


def validate_complaint(data):
    errors = []

    description = (data.get("description") or "").strip()

    # ✅ 1. Required
    if not description:
        errors.append("Description is required")

    # ✅ 2. Length check
    elif len(description) < 5:
        errors.append("Description too short")

    elif len(description) > 300:
        errors.append("Description too long")

    # ✅ 3. Meaningful content check
    weak_inputs = ["issue", "problem", "test", "hi", "hello", "ok"]
    if description.lower() in weak_inputs:
        errors.append("Description not meaningful")

    # ✅ 4. Status validation
    if data.get("status") and data["status"] not in VALID_STATUS:
        errors.append("Invalid status")

    return errors
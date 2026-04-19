VALID_CATEGORIES = ["garbage", "water", "roads", "electricity", "sewage"]
VALID_STATUS = ["pending", "in-progress", "resolved"]

def validate_complaint(data):
    errors = []

    if not data.get("description") or data["description"].strip() == "":
        errors.append("Description is required")

    if data.get("category") and data["category"] not in VALID_CATEGORIES:
        errors.append("Invalid category")

    if data.get("status") and data["status"] not in VALID_STATUS:
        errors.append("Invalid status")

    return errors
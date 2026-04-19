from flask import Blueprint, request, jsonify
from services.complaint_service import add_complaint, get_all_complaints, get_filtered_complaints
from utils.validators import validate_complaint

complaint_bp = Blueprint("complaints", __name__)


# 🔹 POST - Add Complaint
@complaint_bp.route("/complaints", methods=["POST"])
def create_complaint():
    data = request.json

    result = add_complaint(data)

    complaint = result["complaint"]

    return jsonify({
        "id": complaint.id,
        "title": complaint.title,
        "description": complaint.description,
        "category": complaint.category,
        "priority": complaint.priority,

        # 🔥 Intelligence layer
        "category_info": result["category_info"],
        "priority_info": result["priority_info"]
    })

# 🔹 GET - All Complaints
@complaint_bp.route("/complaints", methods=["GET"])
def fetch_complaints():
    area = request.args.get("area")
    status = request.args.get("status")
    category = request.args.get("category")

    if area or status or category:
        complaints = get_filtered_complaints(area, status, category)
    else:
        complaints = get_all_complaints()

    result = []

    for c in complaints:
        result.append({
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "category": c.category,
            "area": c.area,
            "priority": c.priority,
            "status": c.status,
            "created_at": c.created_at
        })

    return jsonify(result)
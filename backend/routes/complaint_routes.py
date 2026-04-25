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
        "priority_info": result.get("priority_info", {}),
        "confidence": result.get("confidence", 0)
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
            "state": c.state,
            "priority": c.priority,
            "status": c.status,
            "created_at": c.created_at
        })

    return jsonify(result)

# 🔹 PUT - Update Complaint Status
@complaint_bp.route("/complaints/<int:complaint_id>", methods=["PUT"])
def update_complaint(complaint_id):
    from models.complaint_model import Complaint
    from database.db import db
    complaint = Complaint.query.get(complaint_id)
    if not complaint:
        return jsonify({"error": "Complaint not found"}), 404
    
    data = request.json
    if "status" in data:
        complaint.status = data["status"]
        db.session.commit()
    
    return jsonify({"message": "Status updated successfully", "status": complaint.status})
from models.complaint_model import Complaint
from database.db import db
import re

# =========================
# TEXT NORMALIZATION
# =========================
def normalize_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', '', text)

    replacements = {
        "leaking": "leak",
        "damaged": "damage",
        "overflowing": "overflow",
        "blocked": "block",
        "paani": "water",
        "bijli": "electricity",
        "sadak": "road",
        "ganda": "dirty"
    }

    for k, v in replacements.items():
        text = text.replace(k, v)

    return text


# =========================
# CATEGORY DETECTION (SCORING)
# =========================
def assign_category(description):
    desc = normalize_text(description)

    category_keywords = {
        "sanitation": ["garbage", "waste", "trash", "dirty", "filth"],
        "water": ["water", "leak", "pipe", "supply", "contamination"],
        "roads": ["road", "pothole", "broken", "damage", "crack"],
        "traffic": ["traffic", "jam", "signal", "accident"],
        "electricity": ["power", "light", "outage", "voltage"],
        "sewage": ["drain", "sewer", "overflow", "block"],
        "lighting": ["streetlight", "dark", "lamp", "flicker"],
        "pollution": ["smoke", "dust", "pollution", "smog"]
    }

    scores = {cat: 0 for cat in category_keywords}

    for category, keywords in category_keywords.items():
        for word in keywords:
            if word in desc:
                scores[category] += 1

    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    best_category, best_score = sorted_scores[0]

    total = sum(scores.values())

    if best_score == 0:
        return {
            "category": "uncertain",
            "confidence": 0.0,
            "top_2": [],
            "scores": scores
        }

    confidence = best_score / total if total > 0 else 0
    top_2 = [cat for cat, s in sorted_scores[:2] if s > 0]

    return {
        "category": best_category,
        "confidence": round(confidence, 2),
        "top_2": top_2,
        "scores": scores
    }


# =========================
# FETCH FUNCTIONS (IMPORTANT - FIXES YOUR ERROR)
# =========================
def get_all_complaints():
    return Complaint.query.all()


def get_filtered_complaints(area=None, status=None, category=None):
    query = Complaint.query

    if area:
        query = query.filter_by(area=area)
    if status:
        query = query.filter_by(status=status)
    if category:
        query = query.filter_by(category=category)

    return query.all()


# =========================
# DURATION HANDLING
# =========================
def convert_to_days(value, unit):
    if "day" in unit:
        return value
    elif "week" in unit:
        return value * 7
    elif "month" in unit:
        return value * 30
    elif "year" in unit:
        return value * 365
    return 0


def get_duration_priority(desc):
    matches = re.findall(r'(\d+)\s*(day|days|week|weeks|month|months|year|years)', desc)

    total_days = sum(convert_to_days(int(v), u) for v, u in matches)

    if total_days == 0:
        return None

    if total_days <= 3:
        return "low"
    elif total_days <= 10:
        return "less_important"
    elif total_days <= 45:
        return "important"
    else:
        return "urgent"


# =========================
# EVENT PRIORITY
# =========================
def get_event_priority(desc):
    if any(word in desc for word in ["overflow", "burst", "fire", "accident"]):
        return "urgent"

    if any(word in desc for word in ["leak", "block", "not working", "damage"]):
        return "important"

    if any(word in desc for word in ["pothole", "issue"]):
        return "less_important"

    if any(word in desc for word in ["slow", "minor", "sometimes"]):
        return "low"

    return "low"


# =========================
# CONTEXT BOOST
# =========================
def get_context_boost(desc):
    boost = 0

    if any(word in desc for word in ["many people", "public", "residents"]):
        boost += 1

    if any(word in desc for word in ["school", "hospital", "market"]):
        boost += 2

    return boost


# =========================
# PRIORITY ENGINE (WITH REASONS)
# =========================
def assign_priority(description, category):
    desc = normalize_text(description)

    priority_order = {
        "low": 1,
        "less_important": 2,
        "important": 3,
        "urgent": 4
    }

    reasons = []

    event_priority = get_event_priority(desc)
    reasons.append(f"event: {event_priority}")

    duration_priority = get_duration_priority(desc)
    if duration_priority:
        reasons.append(f"duration: {duration_priority}")

    final_priority = event_priority

    if duration_priority:
        if priority_order[duration_priority] > priority_order[final_priority]:
            final_priority = duration_priority

    boost = get_context_boost(desc)
    if boost > 0:
        reasons.append(f"context boost: +{boost}")

        if final_priority == "low":
            final_priority = "less_important"
        elif final_priority == "less_important":
            final_priority = "important"

    if final_priority == "urgent":
        strong_event = any(word in desc for word in ["overflow", "burst", "fire", "accident"])
        long_duration = duration_priority == "urgent"

        if not strong_event and not long_duration:
            final_priority = "important"
            reasons.append("downgraded from urgent")

    return {
        "priority": final_priority,
        "reasons": reasons
    }


# =========================
# MAIN SERVICE FUNCTION
# =========================
def add_complaint(data):
    description = (data.get("description") or "").strip()

    category_data = assign_category(description)
    priority_data = assign_priority(description, category_data["category"])

    title = data.get("title") or generate_title(description)

    complaint = Complaint(
        title=title,
        description=description,
        category=category_data["category"],
        area=data.get("area"),
        priority=priority_data["priority"],
        status=data.get("status", "pending")
    )

    db.session.add(complaint)
    db.session.commit()

    return {
        "complaint": complaint,
        "category_info": category_data,
        "priority_info": priority_data
    }


# =========================
# TITLE GENERATION
# =========================
def generate_title(description):
    if not description:
        return "General Issue"

    return description.split()[0].capitalize() + " Issue"
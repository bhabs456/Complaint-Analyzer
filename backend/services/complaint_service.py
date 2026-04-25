from models.complaint_model import Complaint
from database.db import db
import re
import pickle

# =========================
# LOAD ML MODEL
# =========================
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

model_path = os.path.join(BASE_DIR, "ml_models", "model.pkl")
vectorizer_path = os.path.join(BASE_DIR, "ml_models", "vectorizer.pkl")

model = pickle.load(open(model_path, "rb"))
vectorizer = pickle.load(open(vectorizer_path, "rb"))

# =========================
# TEXT NORMALIZATION (ENGLISH ONLY)
# =========================
def normalize_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', '', text)

    replacements = {
        "leaking": "leak",
        "damaged": "damage",
        "overflowing": "overflow",
        "blocked": "block",
        "cracked": "crack",
        "flickering": "flicker",
        "streetlights": "streetlight",
        "potholes": "pothole",
        "roads": "road",
        "drains": "drain"
    }

    for k, v in replacements.items():
        text = text.replace(k, v)

    return text


# =========================
# ML PREDICTION
# =========================
def ml_predict(description):
    vec = vectorizer.transform([description])
    pred = model.predict(vec)[0]

    prob = None
    if hasattr(model, "predict_proba"):
        prob = model.predict_proba(vec).max()

    return pred, prob


# =========================
# CATEGORY DETECTION (RULE ENGINE)
# =========================
def assign_category(description):
    desc = normalize_text(description)

    category_keywords = {

        "sanitation": [
            "garbage", "waste", "trash", "dirty", "filth", "litter"
        ],

        "water": [
            "water", "leak", "pipe", "supply", "contamination", "shortage"
        ],

        "roads": [
            "road", "pothole", "broken", "damage", "crack", "uneven"
        ],

        "traffic": [
            "traffic", "jam", "signal", "accident", "congestion"
        ],

        "electricity": [
            "electric", "power", "outage", "voltage",
            "wire", "spark", "short circuit", "transformer"
        ],

        "sewage": [
            "drain", "sewer", "overflow", "block",
            "gutter", "waterlogging", "drainage"
        ],

        "lighting": [
            "streetlight", "lamp", "dark", "flicker", "no light"
        ],

        "pollution": [
            "smoke", "dust", "pollution", "smog",
            "burning", "air"
        ]
    }

    scores = {cat: 0 for cat in category_keywords}

    # 🔥 Weighted scoring
    for category, keywords in category_keywords.items():
        for word in keywords:
            if word in desc:
                scores[category] += 2 if " " in word else 1

    
    # =========================
    # 🔥 CONTEXT OVERRIDES (FINAL - HIERARCHICAL)
    # =========================
    
    # -------------------------
    # 1. SEWAGE DOMINANCE (TOP PRIORITY)
    # -------------------------
    if any(word in desc for word in ["drain", "sewer", "gutter", "waterlogging", "dirty water"]):
        scores["sewage"] += 7
    
    # strong overflow condition
    if "overflow" in desc and any(word in desc for word in ["drain", "sewer", "gutter"]):
        scores["sewage"] += 4
    
    # sewage overrides water
    if scores["sewage"] > 0:
        scores["water"] -= 2
    
    
    # -------------------------
    # 2. WATER (ONLY IF PURE CASE)
    # -------------------------
    if any(word in desc for word in ["pipe", "pipeline", "leak", "burst"]):
        # only assign water if no sewage context
        if not any(word in desc for word in ["drain", "sewer", "waterlogging", "dirty water"]):
            scores["water"] += 4
    
    
    # -------------------------
    # 3. ELECTRICITY (STRONG SIGNALS)
    # -------------------------
    if any(word in desc for word in ["wire", "spark", "transformer", "short circuit"]):
        scores["electricity"] += 6
    
    # power outage / supply issues
    if any(word in desc for word in ["power cut", "power outage", "no power", "voltage"]):
        scores["electricity"] += 7
    
    
    # -------------------------
    # 4. LIGHTING (CONTEXT-SPECIFIC)
    # -------------------------
    if "streetlight" in desc:
        scores["lighting"] += 5
    
    if any(word in desc for word in ["flicker", "dim", "dark", "no light"]):
        scores["lighting"] += 3
    
    # prevent lighting overriding real electricity issues
    if scores["electricity"] > 0 and "streetlight" in desc:
        scores["lighting"] -= 2
    
    
    # -------------------------
    # 5. POLLUTION (AIR-BASED)
    # -------------------------
    if any(word in desc for word in ["smoke", "smog", "fumes"]):
        scores["pollution"] += 6
    
    if any(word in desc for word in ["burning", "garbage burning"]):
        scores["pollution"] += 4
    
    
    # -------------------------
    # 6. TRAFFIC (OUTCOME PRIORITY)
    # -------------------------
    if any(word in desc for word in ["traffic", "jam", "congestion"]):
        scores["traffic"] += 5
    
    # traffic dominates roads
    if scores["traffic"] > 0 and scores["roads"] > 0:
        scores["traffic"] += 3
    
    
    # -------------------------
    # 7. FINAL ROOT-CAUSE PRIORITY
    # -------------------------
    
    # sewage dominates traffic (root cause)
    if scores["sewage"] > 0 and scores["traffic"] > 0:
        scores["sewage"] += 3
    
    # sewage dominates roads
    if scores["sewage"] > 0 and scores["roads"] > 0:
        scores["sewage"] += 2
            
    
    # =========================
    # FINAL DECISION
    # =========================
    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    best_category, best_score = sorted_scores[0]
    second_category, second_score = sorted_scores[1]

    total = sum(scores.values())

    if best_score == 0:
        return {
            "category": "uncertain",
            "confidence": 0.0,
            "top_2": [],
            "scores": scores
        }

    confidence = best_score / total if total > 0 else 0

    top_2 = [best_category]
    if second_score > 0:
        top_2.append(second_category)

    return {
        "category": best_category,
        "confidence": round(confidence, 2),
        "top_2": top_2,
        "scores": scores
    }


# =========================
# PRIORITY ENGINE
# =========================
def assign_priority(description, category):
    desc = normalize_text(description)

    if any(x in desc for x in ["spark", "fire", "accident", "overflow"]):
        return {"priority": "urgent", "reasons": ["critical event"]}

    if any(x in desc for x in ["leak", "block", "damage"]):
        return {"priority": "important", "reasons": ["moderate issue"]}

    return {"priority": "low", "reasons": ["minor issue"]}


# =========================
# FETCH FUNCTIONS (REQUIRED FOR ROUTES)
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
# HYBRID MAIN FUNCTION
# =========================
def add_complaint(data):
    description = (data.get("description") or "").strip()

    # 🔹 Rule-based
    rule_data = assign_category(description)
    rule_category = rule_data["category"]
    rule_conf = rule_data["confidence"]

    # 🔹 ML-based
    ml_category, ml_conf = ml_predict(description)

    # =========================
    # 🔥 HYBRID DECISION
    # =========================
    if rule_conf >= 0.65:
        final_category = rule_category
        source = "rule"
    elif ml_conf and ml_conf >= 0.75:
        final_category = ml_category
        source = "ml"
    else:
        final_category = rule_category
        source = "fallback"

    # 🔹 Priority
    priority_data = assign_priority(description, final_category)

    title = generate_title(description)

    complaint = Complaint(
        title=title,
        description=description,
        category=final_category,
        area=data.get("area"),
        priority=priority_data["priority"],
        status=data.get("status", "pending")
    )

    db.session.add(complaint)
    db.session.commit()

    return {
        "complaint": complaint,
        "rule_category": rule_category,
        "ml_category": ml_category,
        "final_category": final_category,
        "source": source,
        "confidence": rule_conf,
        "priority_info": priority_data
    }


# =========================
# TITLE GENERATION
# =========================
def generate_title(description):
    if not description:
        return "General Issue"

    return description.split()[0].capitalize() + " Issue"
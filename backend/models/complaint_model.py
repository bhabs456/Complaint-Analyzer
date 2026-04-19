from database.db import db
from datetime import datetime

class Complaint(db.Model):
    __tablename__ = "complaints"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=False)

    category = db.Column(db.String(50))
    area = db.Column(db.String(100))
    priority = db.Column(db.String(20), default="medium")
    status = db.Column(db.String(20), default="pending")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Complaint {self.id} - {self.title}>"
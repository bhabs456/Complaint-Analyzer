from flask import Flask
from config import Config
from database.db import db
from sqlalchemy import text
from routes.complaint_routes import complaint_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.register_blueprint(complaint_bp)

    db.init_app(app)
    from models.complaint_model import Complaint

    @app.route("/")
    def home():
        try:
            with db.engine.connect() as connection:
                connection.execute(text("SELECT 1"))
            return "DB Connected Successfully ✅"
        except Exception as e:
            return f"DB Connection Failed ❌ {str(e)}"
        
    @app.route("/test-db")
    def test_db():
        try:
            complaints = Complaint.query.all()
            return f"Total complaints: {len(complaints)}"
        except Exception as e:
            return str(e)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
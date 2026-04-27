from app import create_app
from database.db import db
from sqlalchemy import text

app = create_app()
with app.app_context():
    try:
        with db.engine.connect() as conn:
            result = conn.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users';"))
            for row in result:
                print(row)
    except Exception as e:
        print("Error:", e)

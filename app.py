import os
import logging
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

# Configure logging
logging.basicConfig(level=logging.DEBUG)


class Base(DeclarativeBase):
    pass


# Create database instance
db = SQLAlchemy(model_class=Base)

# Create the Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "royal-luxury-secret-key-12345")

# Configure the database
database_url = os.environ.get("DATABASE_URL")
if not database_url:
    # For local development without PostgreSQL, use SQLite
    database_url = "sqlite:///roylencia_events.db"
    print("Warning: Using SQLite database for local development. Set DATABASE_URL environment variable for PostgreSQL.")

app.config["SQLALCHEMY_DATABASE_URI"] = database_url
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

# Initialize the database with the app
db.init_app(app)

# Import routes after app creation to avoid circular imports
from routes import *

# Create database tables
with app.app_context():
    # Import models after app is fully configured
    from models import Contact, EventInquiry

    # Create all database tables
    db.create_all()
    print("Database tables created successfully!")

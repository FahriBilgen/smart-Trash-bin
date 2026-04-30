import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load .env file if it exists
load_dotenv()

# Get database URL from environment variable, default to local SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./smart_trash_bin.db")

# PostgreSQL fix for Heroku/Render (replaces postgres:// with postgresql://)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Check if we are using SQLite
is_sqlite = DATABASE_URL.startswith("sqlite")

# Create engine
if is_sqlite:
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

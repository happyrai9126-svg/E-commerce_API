"""
SQLAlchemy database wiring.

Builds the MySQL connection URL from the values in
:data:`app.core.config.settings`, creates the shared engine and session
factory, and exposes the :class:`Base` class that every ORM model inherits
from so they share a single metadata registry.
"""

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

load_dotenv() 

DATABASE_URL = f"mysql+pymysql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"

'''creating engine'''
engine = create_engine(DATABASE_URL, echo= True)
'''creating a session'''
SessionLocal = sessionmaker(bind = engine)

class Base(DeclarativeBase):
    """
    Declarative base class shared by all ORM models.

    Every model in :mod:`app.models` subclasses this so their tables are
    registered against the same metadata and can be created or migrated
    together.
    """
    pass

"""
Shared FastAPI dependencies.

Currently holds the request-scoped database session provider used by every
router and CRUD call.
"""

from app.database import SessionLocal

def get_db():
    """
    Provide a request-scoped SQLAlchemy session.

    Intended to be used as a FastAPI dependency (``Depends(get_db)``). The
    session is yielded to the endpoint, rolled back if the request raises, and
    always closed once the request finishes.

    Yields:
        Session: An open SQLAlchemy session bound to the application engine.

    Raises:
        Exception: Re-raises whatever the consuming request raised, after
            rolling the transaction back.
    """
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

"""
Database operations for user accounts.
"""

from app.schemas.users import Users_Create
from app.models.users import Users
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from app.core.security import hash_password

def users_create(db: Session, payload: Users_Create) -> Users:
    """
    Register a new user account.

    Hashes the submitted password, swaps it in for the plaintext field, and
    inserts the row. The unique constraints on username and email are relied
    on to reject duplicates.

    Args:
        db: Active database session.
        payload: Validated signup data.

    Returns:
        Users: The newly created and refreshed user row.

    Raises:
        HTTPException: 409 if the username or email is already taken.
    """
    hashed_password = hash_password(payload.strong_password)
    user_data = payload.model_dump(exclude= "strong_password")
    user_data["hashed_password"] = hashed_password
    new_data = Users(**user_data)
    db.add(new_data)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username or email already taken."
            )

    db.refresh(new_data)
    return new_data




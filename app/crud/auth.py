"""
Database operations backing login.
"""

from fastapi import Depends
# from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.users import Users
from app.core.security import verify_password

def authenticate_user(db: Session, username: str, password: str):
    """
    Look up a user and confirm their password.

    Args:
        db: Active database session.
        username: The login name submitted at the login form.
        password: The plaintext password submitted alongside it.

    Returns:
        Users | None: The matching user when the credentials are valid, or
        ``None`` if no such user exists or the password does not match. The
        caller is responsible for turning ``None`` into a 401.
    """
    user = db.execute(
        select(Users).where(Users.username == username)
    ).scalar_one_or_none()

    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


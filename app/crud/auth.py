from fastapi import Depends
# from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.users import Users
from app.core.security import verify_password

def authenticate_user(db: Session, username: str, password: str):
    user = db.execute(
        select(Users).where(Users.username == username)
    ).scalar_one_or_none()

    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

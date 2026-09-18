"""
Authentication and password security helpers.

Groups everything the API needs to prove who a caller is: bcrypt password
hashing and verification, JWT access-token creation, the OAuth2 bearer scheme
used by FastAPI, and the :func:`get_current_user` dependency that turns a
bearer token into a database user.
"""

from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependency import get_db
from sqlalchemy import select
from app.models.users import Users

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
   
    """
    Hash a plaintext password for storage.

    Args:
        password: The raw password as typed by the user.

    Returns:
        The bcrypt hash, safe to persist in the ``hashed_password`` column.
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    
    """
    Check a plaintext password against a stored bcrypt hash.

    Args:
        plain_password: The raw password supplied at login.
        hashed_password: The stored hash to compare against.

    Returns:
        ``True`` if the password matches the hash, ``False`` otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)

from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from app.core.config import settings


def create_access_token(data: dict) -> str:
    """
    Create a signed JWT access token.

    Args:
        data: Claims to encode into the token, typically ``{"sub": username}``
            identifying the user.

    Returns:
        The encoded JWT as a string, including an ``exp`` claim set
        ``ACCESS_TOKEN_EXPIRE_MINUTES`` into the future.
    """
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes= settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl= "auth/login")

credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Resolve the authenticated user from a bearer token.

    Used as a FastAPI dependency on every protected endpoint. Decodes the JWT,
    reads the ``sub`` claim as a username, and loads the matching row.

    Args:
        token: The bearer token extracted from the ``Authorization`` header by
            :data:`oauth2_scheme`.
        db: Request-scoped database session.

    Returns:
        Users: The ORM user record the token belongs to.

    Raises:
        HTTPException: 401 if the token is malformed or expired, carries no
            ``sub`` claim, or names a user that no longer exists.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms= settings.ALGORITHM)
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.execute(
        select(Users).where(Users.username == username)
    ).scalar_one_or_none()

    if user is None:
        raise credentials_exception
    return user

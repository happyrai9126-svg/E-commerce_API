"""
Authentication routes.

Exposes the OAuth2 password-flow login endpoint that exchanges a username and
password for a JWT access token.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.token import Token
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.dependency import get_db
from app.crud.auth import authenticate_user
from app.core.security import create_access_token

router = APIRouter(
    prefix= "/auth",
    tags= ["auth"]
)

@router.post("/login", response_model= Token)
def login(
    data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Log in and receive a bearer token.

    ``POST /auth/login`` — takes the standard OAuth2 password form
    (``username`` and ``password`` as form fields, not JSON).

    Args:
        data: The submitted OAuth2 password form.
        db: Request-scoped database session.

    Returns:
        dict: ``{"access_token": ..., "token_type": "bearer"}``, matching the
        :class:`~app.schemas.token.Token` schema.

    Raises:
        HTTPException: 401 if the username is unknown or the password is
            wrong.
    """
    user = authenticate_user(db, data.username, data.password)

    if not user:
        raise HTTPException(
            status_code= status.HTTP_401_UNAUTHORIZED,
            detail= " Incorrect username or password",
            headers= {"WWW-Authenticate": "Bearer"}
        )

    access_token = create_access_token(data= {"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}




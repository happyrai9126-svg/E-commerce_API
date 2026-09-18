"""
User account routes.

Exposes public signup and the authenticated "who am I" lookup.
"""

from fastapi import APIRouter, Depends, status
from app.schemas.users import Users_Create, Users_Response
from app.dependency import get_db
from app.crud.users import users_create
from sqlalchemy.orm import Session
from app.models.users import Users
from app.core.security import get_current_user


router = APIRouter(
    prefix="/users",
    tags= ["users"]
)

@router.post("/Ecommerce", response_model= Users_Response, status_code= status.HTTP_201_CREATED)

def create_user(payload: Users_Create ,db: Session = Depends(get_db)):
    """
    Register a new account.

    ``POST /users/Ecommerce`` — open to unauthenticated callers.

    Args:
        payload: Validated signup details.
        db: Request-scoped database session.

    Returns:
        Users: The created account, serialised without its password hash.

    Raises:
        HTTPException: 409 if the username or email is already taken.
    """
    return users_create(db, payload)

@router.get("/Ecommerce", response_model= Users_Response, status_code= status.HTTP_200_OK)

def fetch_user(current_user: Users = Depends(get_current_user)):
    """
    Return the profile of the logged-in user.

    ``GET /users/Ecommerce`` — requires a bearer token. The work is done by the
    :func:`~app.core.security.get_current_user` dependency, so this endpoint
    simply echoes the resolved user back.

    Args:
        current_user: The account resolved from the bearer token.

    Returns:
        Users: The caller's own account, without its password hash.

    Raises:
        HTTPException: 401 if the token is missing, expired or invalid.
    """
    return current_user

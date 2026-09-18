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
    return users_create(db, payload)

@router.get("/Ecommerce", response_model= Users_Response, status_code= status.HTTP_200_OK)

def fetch_user(current_user: Users = Depends(get_current_user)):
    return current_user
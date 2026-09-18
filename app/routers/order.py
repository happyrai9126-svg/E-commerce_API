from fastapi import APIRouter, status, Depends
from app.schemas.order import OrderCreate, OrderRead, OrderLookResponse
from sqlalchemy.orm import Session
from app.dependency import get_db
from app.crud.order import order_save, order_look
from app.core.security import get_current_user
from app.models.users import Users

router = APIRouter(
    prefix= "/order",
    tags= ["order"]
)

@router.post("/Ecommerce",response_model= OrderRead , status_code= status.HTTP_200_OK)
def save_order(payload: OrderCreate, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    order_save(db, payload, user_id= current_user.id)
    return {"message": "ordered successfully"}

@router.get("/Ecommerce", response_model= list[OrderLookResponse], status_code= status.HTTP_200_OK)
def look_order(db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    return order_look(db, user_id= current_user.id)

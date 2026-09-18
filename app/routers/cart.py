from fastapi import APIRouter, status, Depends, HTTPException
from app.schemas.cart import CartCreate, CartRead
from sqlalchemy.orm import Session
from app.dependency import get_db
from app.crud.cart import cart_save, cart_look, cart_delete
from app.core.security import get_current_user
from app.schemas.cart import CartLookResponse, CartDeleteResponse
from app.models.users import Users

router = APIRouter(
    prefix= "/cart",
    tags= ["cart"]
)

@router.post("/Ecommerce",response_model= CartRead, status_code= status.HTTP_201_CREATED)
def save_cart(payload: CartCreate, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    cart_save(db, payload, user_id= current_user.id)
    return {"message": "successfully added to cart"}

@router.get("/Ecommerce", response_model= list[CartLookResponse], status_code= status.HTTP_200_OK)
def look_cart(db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    return cart_look(db, user_id= current_user.id)

@router.delete("/Ecommerce/{cart_id}", response_model= CartDeleteResponse, status_code= status.HTTP_200_OK)
def delete_cart(cart_id: int, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    deleted = cart_delete(db, user_id= current_user.id, cart_id= cart_id)

    if not deleted:
        raise HTTPException(
            status_code= status.HTTP_404_NOT_FOUND,
            detail= "cart item not found"
        )
    return {"message": "item deleted from cart"}

from app.schemas.cart import CartCreate, CartRead, CartRead, CartQuantityUpdate
from app.crud.cart import cart_save, cart_look, cart_delete, cart_update_quantity

@router.patch("/Ecommerce/{cart_id}", response_model=CartRead, status_code=status.HTTP_200_OK)
def update_quantity(
    cart_id: int,
    payload: CartQuantityUpdate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    updated = cart_update_quantity(db, cart_id, current_user.id, payload.quantity)

    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")

    return {"message": "quantity updated"}
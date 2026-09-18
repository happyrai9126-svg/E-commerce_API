"""
Order routes.

Both endpoints require a bearer token and act only on the calling user's own
orders.
"""

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
    """
    Place an order for one product.

    ``POST /order/Ecommerce`` — each call records its own order row, so
    repeated purchases of the same product all appear in the history.

    Args:
        payload: Snapshot of the product being purchased.
        db: Request-scoped database session.
        current_user: The account resolved from the bearer token.

    Returns:
        dict: A confirmation message matching
        :class:`~app.schemas.order.OrderRead`.

    Raises:
        HTTPException: 401 if the token is missing, expired or invalid.
    """
    order_save(db, payload, user_id= current_user.id)
    return {"message": "ordered successfully"}

@router.get("/Ecommerce", response_model= list[OrderLookResponse], status_code= status.HTTP_200_OK)
def look_order(db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    """
    List the caller's order history.

    ``GET /order/Ecommerce``

    Args:
        db: Request-scoped database session.
        current_user: The account resolved from the bearer token.

    Returns:
        list[OrderedItems]: Every order the caller has placed; empty if they
        have not ordered anything yet.

    Raises:
        HTTPException: 401 if the token is missing, expired or invalid.
    """
    return order_look(db, user_id= current_user.id)


"""
Shopping cart routes.

Every endpoint here requires a bearer token and operates only on the calling
user's own cart, resolved through
:func:`~app.core.security.get_current_user`.
"""

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
    """
    Add a product to the caller's cart.

    ``POST /cart/Ecommerce`` — adding a product that is already in the cart is
    a no-op and still reports success.

    Args:
        payload: Snapshot of the product being added.
        db: Request-scoped database session.
        current_user: The account resolved from the bearer token.

    Returns:
        dict: A confirmation message matching
        :class:`~app.schemas.cart.CartRead`.

    Raises:
        HTTPException: 401 if the token is missing, expired or invalid.
    """
    cart_save(db, payload, user_id= current_user.id)
    return {"message": "successfully added to cart"}

@router.get("/Ecommerce", response_model= list[CartLookResponse], status_code= status.HTTP_200_OK)
def look_cart(db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    """
    List everything in the caller's cart.

    ``GET /cart/Ecommerce``

    Args:
        db: Request-scoped database session.
        current_user: The account resolved from the bearer token.

    Returns:
        list[Cart]: The caller's cart items, each including the ``id`` the
        update and delete endpoints need.

    Raises:
        HTTPException: 401 if the token is missing, expired or invalid.
    """
    return cart_look(db, user_id= current_user.id)

@router.delete("/Ecommerce/{cart_id}", response_model= CartDeleteResponse, status_code= status.HTTP_200_OK)
def delete_cart(cart_id: int, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    """
    Remove one item from the caller's cart.

    ``DELETE /cart/Ecommerce/{cart_id}``

    Args:
        cart_id: Primary key of the cart item to remove.
        db: Request-scoped database session.
        current_user: The account resolved from the bearer token.

    Returns:
        dict: A confirmation message matching
        :class:`~app.schemas.cart.CartDeleteResponse`.

    Raises:
        HTTPException: 404 if no such item belongs to the caller; 401 if the
            token is missing, expired or invalid.
    """
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
    """
    Change the quantity of an item already in the caller's cart.

    ``PATCH /cart/Ecommerce/{cart_id}``

    Args:
        cart_id: Primary key of the cart item to update.
        payload: The new quantity, which must be at least 1.
        db: Request-scoped database session.
        current_user: The account resolved from the bearer token.

    Returns:
        dict: A confirmation message matching
        :class:`~app.schemas.cart.CartRead`.

    Raises:
        HTTPException: 404 if no such item belongs to the caller; 401 if the
            token is missing, expired or invalid.
    """
    updated = cart_update_quantity(db, cart_id, current_user.id, payload.quantity)

    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")

    return {"message": "quantity updated"}

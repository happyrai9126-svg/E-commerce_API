"""
Database operations for the shopping cart.

Every function is scoped by ``user_id`` so one shopper can never read or
modify another shopper's cart rows.
"""

from sqlalchemy.orm import Session
from app.schemas.cart import CartCreate
from app.models.cart import Cart
from sqlalchemy import select

def cart_save(db: Session, payload: CartCreate, user_id: int) -> Cart:
    """
    Add a product to a user's cart, or return the row already there.

    Duplicates are detected by image URL, so clicking "Add to Cart" twice on
    the same product leaves a single row rather than creating another.

    Args:
        db: Active database session.
        payload: The product snapshot to store.
        user_id: Owner of the cart.

    Returns:
        Cart: The existing row when the product was already in the cart,
        otherwise the newly inserted row.
    """
    new_data = Cart(**payload.model_dump(), users_id = user_id)
    existing = db.execute(select(Cart).where(
        Cart.users_id == user_id,
        payload.image_url == Cart.image_url
    )).scalar_one_or_none()

    if existing:
        return existing
    else:
        db.add(new_data)
        db.commit()
        db.refresh(new_data)
        return new_data

def cart_look(db: Session, user_id: int):
    """
    Fetch every item in a user's cart.

    Args:
        db: Active database session.
        user_id: Owner of the cart.

    Returns:
        Sequence[Cart]: All cart rows belonging to the user; empty when the
        cart has nothing in it.
    """
    cart = db.execute(
        select(Cart).where(Cart.users_id == user_id)
    ).scalars().all()
    return cart

def cart_delete(db: Session, user_id: int, cart_id: int):
    """
    Remove one item from a user's cart.

    The lookup is filtered by owner as well as id, so a mismatched id is
    reported as "not found" rather than deleting someone else's row.

    Args:
        db: Active database session.
        user_id: Owner of the cart.
        cart_id: Primary key of the cart item to remove.

    Returns:
        bool: ``True`` if the row was found and deleted, ``False`` if no such
        item belongs to this user.
    """
    item = db.execute(
        select(Cart).where(
            cart_id == Cart.id,
            user_id == Cart.users_id
        )
    ).scalar_one_or_none()

    if not item:
        return False

    db.delete(item)
    db.commit()
    return True


def cart_update_quantity(db: Session, cart_id: int, user_id: int, quantity: int) -> Cart | None:
    """
    Set a new quantity on an existing cart item.

    Args:
        db: Active database session.
        cart_id: Primary key of the cart item to update.
        user_id: Owner of the cart; scopes the lookup.
        quantity: The new quantity to store.

    Returns:
        Cart | None: The refreshed cart row, or ``None`` if no such item
        belongs to this user.
    """
    item = db.execute(
        select(Cart).where(Cart.id == cart_id, Cart.users_id == user_id)
    ).scalar_one_or_none()

    if not item:
        return None

    item.quantity = quantity
    db.commit()
    db.refresh(item)
    return item

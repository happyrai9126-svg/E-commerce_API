from sqlalchemy.orm import Session
from app.schemas.cart import CartCreate
from app.models.cart import Cart
from sqlalchemy import select

def cart_save(db: Session, payload: CartCreate, user_id: int) -> Cart:
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
    cart = db.execute(
        select(Cart).where(Cart.users_id == user_id)
    ).scalars().all()
    return cart

def cart_delete(db: Session, user_id: int, cart_id: int):
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
    item = db.execute(
        select(Cart).where(Cart.id == cart_id, Cart.users_id == user_id)
    ).scalar_one_or_none()

    if not item:
        return None

    item.quantity = quantity
    db.commit()
    db.refresh(item)
    return item
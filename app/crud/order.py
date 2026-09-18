from sqlalchemy.orm import Session
from app.schemas.order import OrderCreate
from app.models.order import OrderedItems
from sqlalchemy import select
# from app.models import Users

def order_save(db: Session, payload: OrderCreate, user_id: int) -> OrderedItems:
    # Every order is its own record. The previous version looked up any
    # existing order for the user and returned early, which meant a user could
    # only ever place one order — every later "Buy Now" silently did nothing
    # while still reporting success.
    new_data = OrderedItems(**payload.model_dump(), users_id = user_id)

    db.add(new_data)
    db.commit()
    db.refresh(new_data)
    return new_data

def order_look(db: Session, user_id: int):
    orders = db.execute(
        select(OrderedItems).where(OrderedItems.users_id == user_id)
    ).scalars().all()
    return orders
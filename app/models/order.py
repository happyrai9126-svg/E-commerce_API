"""
ORM model for products a user has actually purchased.
"""

from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, ForeignKey, func, DateTime
from datetime import datetime


class OrderedItems(Base):
    """
    One purchased line item, stored in the ``ordered_items`` table.

    Each placed order inserts its own row, so the table doubles as the user's
    purchase history. Product details are snapshotted onto the row so past
    orders stay readable even though the catalogue is fetched live.

    Attributes:
        id: Primary key.
        users_id: Foreign key to ``user_profile.id`` — who placed the order.
        title: Product title at the time of purchase.
        image_url: URL of the product image at the time of purchase.
        price: Unit price paid.
        quantity: Number of units ordered.
        ordered_at: Server-side timestamp of when the order was placed.
    """

    __tablename__ = "ordered_items"

    id: Mapped[int] = mapped_column(Integer, primary_key= True)
    users_id: Mapped[int] = mapped_column(ForeignKey("user_profile.id"))
    title: Mapped[str] = mapped_column(String(250))
    image_url: Mapped[str] = mapped_column(String(250))
    price: Mapped[int] = mapped_column(Integer)
    quantity: Mapped[int] = mapped_column(Integer)
    ordered_at: Mapped[datetime] = mapped_column(
            DateTime(timezone = True),
            nullable= False,
            server_default= func.now()
        )

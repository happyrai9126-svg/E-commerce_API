"""
ORM model for items sitting in a user's shopping cart.
"""

from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, func, ForeignKey
from datetime import datetime

class Cart(Base):
    """
    One product a user has added to their cart, stored in the ``Cart`` table.

    Product details are copied onto the row rather than referenced, because the
    catalogue is served live from Unsplash and has no local products table.

    Attributes:
        id: Primary key, used by the update and delete cart endpoints.
        users_id: Foreign key to ``user_profile.id`` — the cart's owner.
        title: Product title as shown in the storefront.
        image_url: URL of the product image.
        price: Unit price of the product.
        quantity: How many units are in the cart; defaults to 1.
        added_at: Server-side timestamp of when the item was added.
    """
    __tablename__ = "Cart"
    id: Mapped[int] = mapped_column(Integer, primary_key= True)
    users_id: Mapped[int] = mapped_column(ForeignKey("user_profile.id"))
    title: Mapped[str] = mapped_column(String(250))
    image_url: Mapped[str] = mapped_column(String(250))
    price: Mapped[int] = mapped_column(Integer)
    quantity: Mapped[int] = mapped_column(Integer, default= 1)
    added_at: Mapped[datetime] = mapped_column(
        DateTime(timezone = True),
        nullable= False,
        server_default= func.now()
    )

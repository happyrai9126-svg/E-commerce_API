"""
ORM model for registered user accounts.
"""

from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, Boolean, DateTime
from datetime import datetime
from typing import Optional

class Users(Base):
    """
    A registered shopper, stored in the ``user_profile`` table.

    Owns the cart and order rows that reference it, and is the identity the
    JWT ``sub`` claim resolves to on every authenticated request.

    Attributes:
        id: Primary key.
        username: Unique login name used as the JWT subject.
        email: Optional unique contact address.
        hashed_password: Bcrypt hash of the account password; the plaintext is
            never stored.
        full_name: The shopper's display name.
        phone_number: Contact number, stored as digits in string form.
        is_active: Whether the account is enabled; defaults to ``True``.
        created_at: Timestamp of when the account was registered.
    """
    __tablename__ = "user_profile"

    id: Mapped[int] = mapped_column(Integer,primary_key= True)
    username: Mapped[str] = mapped_column(String(50), unique = True)
    email: Mapped[Optional[str]] = mapped_column(String(255), unique= True, nullable= True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    full_name: Mapped[str] = mapped_column(String(50))
    phone_number: Mapped[str] = mapped_column(String(12))
    is_active: Mapped[bool] = mapped_column(Boolean, default= True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default= datetime.now)





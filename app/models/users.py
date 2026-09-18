from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, Boolean, DateTime
from datetime import datetime
from typing import Optional

class Users(Base):
    __tablename__ = "user_profile"

    id: Mapped[int] = mapped_column(Integer,primary_key= True)
    username: Mapped[str] = mapped_column(String(50), unique = True)
    email: Mapped[Optional[str]] = mapped_column(String(255), unique= True, nullable= True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    full_name: Mapped[str] = mapped_column(String(50))
    phone_number: Mapped[str] = mapped_column(String(12))
    is_active: Mapped[bool] = mapped_column(Boolean, default= True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default= datetime.now)




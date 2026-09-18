from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, func, ForeignKey
from datetime import datetime

class Cart(Base):
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
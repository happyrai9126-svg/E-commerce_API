from pydantic import BaseModel, Field
from typing import Annotated
from datetime import datetime

class OrderCreate(BaseModel):
    title: Annotated[str, Field(description= "title of the image")]
    image_url: Annotated[str, Field(description= "url of the image")]
    price: Annotated[int, Field(description= "price of the product")]
    quantity: Annotated[int, Field(default= 1, description= "quantity")]

class OrderRead(BaseModel):
    message: Annotated[str, Field(description= "message sent to the user after clicking buy now button")]

    class Config:
        from_attributes = True


class OrderLookResponse(BaseModel):
    title: Annotated[str, Field()]
    image_url: Annotated[str, Field()]
    price: Annotated[int, Field()]
    quantity: Annotated[int, Field()]
    ordered_at: Annotated[datetime, Field()]

    class Config:
        from_attributes = True
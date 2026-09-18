from pydantic import BaseModel, Field
from typing import Annotated
from datetime import datetime

class CartCreate(BaseModel):
    title: Annotated[str, Field(description= "title of the image")]
    image_url: Annotated[str, Field(description= "url of the image")]
    price: Annotated[int, Field(description= "price of the product")]
    quantity: Annotated[int, Field(default= 1, description= "quantity of products")]

class CartRead(BaseModel):
    message: Annotated[str, Field(description= "message sent to the user after clicking add to cart button")]

    class Config:
        from_attributes = True

class CartLookResponse(BaseModel):
    id: Annotated[int, Field(description= "cart item id, used by the update and delete endpoints")]
    title: Annotated[str, Field()]
    image_url: Annotated[str, Field()]
    price: Annotated[int, Field()]
    quantity: Annotated[int, Field()]
    added_at: Annotated[datetime, Field()]

    class Config:
        from_attributes = True

class CartDeleteResponse(BaseModel):
    message: Annotated[str, Field(description= "message sent to user after clicking remove from cart button")]

    class Config:
        from_attributes = True

class CartQuantityUpdate(BaseModel):
    quantity: Annotated[int, Field(ge=1, description="new quantity, minimum 1")]
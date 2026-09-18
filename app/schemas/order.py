"""
Pydantic schemas for the order endpoints.

Covers the payload for placing an order, the acknowledgement returned, and the
shape of each line item in a user's purchase history.
"""

from pydantic import BaseModel, Field
from typing import Annotated
from datetime import datetime

class OrderCreate(BaseModel):
    """
    Request body for placing an order for one product.

    Carries a snapshot of the product so the purchase history stays readable
    even though the catalogue is fetched live.

    Attributes:
        title: Product title.
        image_url: URL of the product image.
        price: Unit price paid.
        quantity: Number of units ordered; defaults to 1.
    """
    title: Annotated[str, Field(description= "title of the image")]
    image_url: Annotated[str, Field(description= "url of the image")]
    price: Annotated[int, Field(description= "price of the product")]
    quantity: Annotated[int, Field(default= 1, description= "quantity")]

class OrderRead(BaseModel):
    """
    Acknowledgement returned after an order is placed.

    Attributes:
        message: Human-readable confirmation for the client to surface.
    """
    message: Annotated[str, Field(description= "message sent to the user after clicking buy now button")]

    class Config:
        """Allow the schema to be built directly from an ORM object."""
        from_attributes = True


class OrderLookResponse(BaseModel):
    """
    One past purchase as returned when listing the current user's orders.

    Attributes:
        title: Product title at the time of purchase.
        image_url: URL of the product image.
        price: Unit price paid.
        quantity: Number of units ordered.
        ordered_at: When the order was placed.
    """
    title: Annotated[str, Field()]
    image_url: Annotated[str, Field()]
    price: Annotated[int, Field()]
    quantity: Annotated[int, Field()]
    ordered_at: Annotated[datetime, Field()]

    class Config:
        """Allow the schema to be built directly from an ORM object."""
        from_attributes = True

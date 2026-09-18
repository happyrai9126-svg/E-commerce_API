"""
Pydantic schemas for the cart endpoints.

Covers the payload for adding an item, the acknowledgement messages returned
by the write endpoints, the full item shape returned when listing a cart, and
the quantity-update body.
"""

from pydantic import BaseModel, Field
from typing import Annotated
from datetime import datetime

class CartCreate(BaseModel):
    """
    Request body for adding a product to the cart.

    Carries a snapshot of the product because the catalogue is served live
    from Unsplash rather than stored locally.

    Attributes:
        title: Product title.
        image_url: URL of the product image; also used to detect an item
            already present in the cart.
        price: Unit price of the product.
        quantity: Number of units to add; defaults to 1.
    """
    title: Annotated[str, Field(description= "title of the image")]
    image_url: Annotated[str, Field(description= "url of the image")]
    price: Annotated[int, Field(description= "price of the product")]
    quantity: Annotated[int, Field(default= 1, description= "quantity of products")]

class CartRead(BaseModel):
    """
    Acknowledgement returned after adding an item or updating its quantity.

    Attributes:
        message: Human-readable confirmation for the client to surface.
    """
    message: Annotated[str, Field(description= "message sent to the user after clicking add to cart button")]

    class Config:
        """Allow the schema to be built directly from an ORM object."""
        from_attributes = True

class CartLookResponse(BaseModel):
    """
    One cart line item as returned when listing the current user's cart.

    Attributes:
        id: Cart item id, used by the update and delete endpoints.
        title: Product title.
        image_url: URL of the product image.
        price: Unit price of the product.
        quantity: Number of units in the cart.
        added_at: When the item was added.
    """
    id: Annotated[int, Field(description= "cart item id, used by the update and delete endpoints")]
    title: Annotated[str, Field()]
    image_url: Annotated[str, Field()]
    price: Annotated[int, Field()]
    quantity: Annotated[int, Field()]
    added_at: Annotated[datetime, Field()]

    class Config:
        """Allow the schema to be built directly from an ORM object."""
        from_attributes = True

class CartDeleteResponse(BaseModel):
    """
    Acknowledgement returned after removing an item from the cart.

    Attributes:
        message: Human-readable confirmation for the client to surface.
    """
    message: Annotated[str, Field(description= "message sent to user after clicking remove from cart button")]

    class Config:
        """Allow the schema to be built directly from an ORM object."""
        from_attributes = True

class CartQuantityUpdate(BaseModel):
    """
    Request body for changing the quantity of an existing cart item.

    Attributes:
        quantity: The new quantity; must be at least 1, since removing an item
            is done through the delete endpoint instead.
    """
    quantity: Annotated[int, Field(ge=1, description="new quantity, minimum 1")]

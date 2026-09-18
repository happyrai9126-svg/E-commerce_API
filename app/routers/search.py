"""
Product search routes.

Fronts the Unsplash-backed catalogue used as the storefront's product source.
"""

from fastapi import APIRouter, status
from app.services.unsplash import products_search

router = APIRouter(
    prefix= "/search",
    tags= ["search"]
)

@router.get("/Ecommerce", status_code= status.HTTP_200_OK)
def search_products(search: str):
    """
    Search the catalogue for products matching a term.

    ``GET /search/Ecommerce?search=...`` — open to unauthenticated callers so
    the storefront can be browsed before logging in.

    Args:
        search: The free-text query to look up.

    Returns:
        list[dict]: Up to nine products, each with ``title``, ``image_url``
        and ``price``.

    Raises:
        Exception: Propagated from the Unsplash service when the upstream API
            returns a non-200 response.
    """
    return products_search(search)


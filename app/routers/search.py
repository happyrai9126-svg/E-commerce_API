from fastapi import APIRouter, status
from app.services.unsplash import products_search

router = APIRouter(
    prefix= "/search",
    tags= ["search"]
)

@router.get("/Ecommerce", status_code= status.HTTP_200_OK)
def search_products(search: str):
    return products_search(search)

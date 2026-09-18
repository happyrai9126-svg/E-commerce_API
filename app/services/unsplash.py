"""
Unsplash-backed product catalogue.

The project has no products table — the storefront's catalogue is synthesised
from Unsplash photo search results, with a price attached to each photo so the
images can stand in for purchasable products.
"""

from dotenv import load_dotenv
import requests
import os
import random

load_dotenv()


unsplash_url = "https://api.unsplash.com/search/photos"

def products_search(query: str):
    """
    Search Unsplash and shape the results into products.

    Each returned photo becomes a product: its alt description is the title,
    its regular-size URL is the image, and a random price is assigned since
    Unsplash has no pricing of its own.

    Args:
        query: The free-text search term to send to Unsplash.

    Returns:
        list[dict]: Up to nine products, each a dict with ``title``,
        ``image_url`` and ``price`` keys.

    Raises:
        Exception: If the Unsplash API responds with anything other than 200.
    """
    headers = {"Authorization": f"Client-ID {os.getenv('UNSPLASH_ACCESS_KEY')}"}

    params = {"query": query, "per_page": 9}

    response = requests.get(unsplash_url, headers = headers, params= params)

    if response.status_code != 200:
        raise Exception(f"unsplash API error : {response.status_code}")
    
    data = response.json()
    products =[]
    for photo in data["results"]:
        product = {
            "title": photo.get("alt_description"),
            "image_url": photo["urls"]["regular"],
            "price": random.randint(1999, 9999)
        }

        products.append(product)
    return products

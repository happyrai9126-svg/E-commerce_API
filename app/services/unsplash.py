from dotenv import load_dotenv
import requests
import os
import random

load_dotenv()


unsplash_url = "https://api.unsplash.com/search/photos"

def products_search(query: str):
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




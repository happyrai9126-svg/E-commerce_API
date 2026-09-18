"""
FastAPI application entrypoint for the E-Commerce API.

Builds the :data:`app` instance, mounts every feature router (users, product
search, cart, auth and orders) and enables CORS for the local Vite dev server
so the React frontend can call the API from a different origin.
"""

from fastapi import FastAPI
from app.routers import users
from app.routers import search, cart, auth, order


app = FastAPI(title= "E-COMMERCE_API")

app.include_router(users.router)
app.include_router(search.router)
app.include_router(cart.router)
app.include_router(auth.router)
app.include_router(order.router)



from fastapi.middleware.cors import CORSMiddleware

# The frontend runs on the Vite dev server, which is a separate origin from the
# API, so browsers require an explicit CORS allowance for it.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

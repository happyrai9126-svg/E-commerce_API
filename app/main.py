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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
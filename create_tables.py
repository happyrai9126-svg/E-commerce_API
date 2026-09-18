from app.database import engine, Base
from app.models.users import Users
from app.models.cart import Cart 
from app.models.order import OrderedItems

def create_tables():
    print("🔨 Creating tables...")
    Base.metadata.create_all(engine)
    print("✅ Done!")

# def drop_tables():
#     print("Dropping tables...")
    # category.__table__.drop(bind=engine)
#     Users.__table__.drop(bind = engine)
#     OrderedItems.__table__.drop(bind = engine)
#     print("✅ Done!")


if __name__ == "__main__":
    create_tables()
    # drop_tables()
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

load_dotenv() 

DATABASE_URL = f"mysql+pymysql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"

'''creating engine'''
engine = create_engine(DATABASE_URL, echo= True)
'''creating a session'''
SessionLocal = sessionmaker(bind = engine)

class Base(DeclarativeBase):
    pass

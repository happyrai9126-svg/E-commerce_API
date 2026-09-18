from app.schemas.users import Users_Create
from app.models.users import Users
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from app.core.security import hash_password

def users_create(db: Session, payload: Users_Create) -> Users:
    hashed_password = hash_password(payload.strong_password)
    user_data = payload.model_dump(exclude= "strong_password")
    user_data["hashed_password"] = hashed_password
    new_data = Users(**user_data)
    db.add(new_data)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username or email already taken."
            )

    db.refresh(new_data)
    return new_data



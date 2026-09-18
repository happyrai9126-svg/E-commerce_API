from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Annotated


class Users_Create(BaseModel):
    username: Annotated[str, Field(min_length= 3, max_length= 15, examples= ["happy123"])]
    email: Annotated[str, Field(min_length= 3, max_length= 255, examples= ["happy@gmail.com"], description= "email should end with @gmail.com or @outlook.com")]
    full_name: Annotated[str, Field(min_length= 3, max_length=25, examples= ["Happy Rai"])]
    phone_number: Annotated[str, Field(min_length= 10, max_length= 12, examples= ["98xxxx"], description= "phone number should contain only digits and should lie in the length of 10 to 12")]
    strong_password: Annotated[str, Field(min_length= 5, max_length= 255, examples= ["Phrn@$257"], description= "enter a strong password")]

    @field_validator("email")
    @classmethod
    def validate_email(cls, value):
        if not value.endswith(("@gmail.com", "@outlook.com")):
            raise ValueError(
                "email should end with @gmail.com or @outlook.com"
            )
        return value

    @field_validator("phone_number")
    @classmethod
    def validate_number(cls, value):
        if not value.isdigit() or not 10 <=len(value) <= 12:
            raise ValueError(
                "phone number should contain only digits and should lie in the length of 10 to 12"
            )
        return value


class Users_Response(BaseModel):
    id: int = Field(ge= 1)
    username: str
    email: str 
    full_name: str
    phone_number: str 
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

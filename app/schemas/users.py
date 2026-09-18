"""
Pydantic schemas for the user registration and profile endpoints.

Defines the validated shape of a signup request and the safe, password-free
shape returned to clients.
"""

from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Annotated


class Users_Create(BaseModel):
    """
    Request body for registering a new account.

    Beyond the per-field length limits, the email domain and the phone number
    format are enforced by the validators below.

    Attributes:
        username: Desired login name, 3-15 characters, must be unique.
        email: Contact address; must end with ``@gmail.com`` or
            ``@outlook.com``.
        full_name: The shopper's display name, 3-25 characters.
        phone_number: 10-12 digits, no separators or country-code symbols.
        strong_password: Plaintext password; hashed before storage and never
            echoed back.
    """
    username: Annotated[str, Field(min_length= 3, max_length= 15, examples= ["happy123"])]
    email: Annotated[str, Field(min_length= 3, max_length= 255, examples= ["happy@gmail.com"], description= "email should end with @gmail.com or @outlook.com")]
    full_name: Annotated[str, Field(min_length= 3, max_length=25, examples= ["Happy Rai"])]
    phone_number: Annotated[str, Field(min_length= 10, max_length= 12, examples= ["98xxxx"], description= "phone number should contain only digits and should lie in the length of 10 to 12")]
    strong_password: Annotated[str, Field(min_length= 5, max_length= 255, examples= ["Phrn@$257"], description= "enter a strong password")]

    @field_validator("email")
    @classmethod
    def validate_email(cls, value):
        """
        Restrict signups to the two supported mail providers.

        Args:
            value: The submitted email address.

        Returns:
            The address unchanged when it is accepted.

        Raises:
            ValueError: If the address does not end with ``@gmail.com`` or
                ``@outlook.com``.
        """
        if not value.endswith(("@gmail.com", "@outlook.com")):
            raise ValueError(
                "email should end with @gmail.com or @outlook.com"
            )
        return value

    @field_validator("phone_number")
    @classmethod
    def validate_number(cls, value):
        """
        Ensure the phone number is 10-12 digits and nothing else.

        Args:
            value: The submitted phone number.

        Returns:
            The number unchanged when it is accepted.

        Raises:
            ValueError: If the value contains non-digit characters or falls
                outside the 10-12 character range.
        """
        if not value.isdigit() or not 10 <=len(value) <= 12:
            raise ValueError(
                "phone number should contain only digits and should lie in the length of 10 to 12"
            )
        return value


class Users_Response(BaseModel):
    """
    Public representation of a user account.

    Returned by the signup and "current user" endpoints. Deliberately omits
    ``hashed_password`` so credentials never leave the server.

    Attributes:
        id: Primary key of the account.
        username: Login name.
        email: Contact address.
        full_name: The shopper's display name.
        phone_number: Contact number.
        is_active: Whether the account is enabled.
        created_at: When the account was registered.
    """
    id: int = Field(ge= 1)
    username: str
    email: str 
    full_name: str
    phone_number: str 
    is_active: bool
    created_at: datetime

    class Config:
        """Allow the schema to be built directly from an ORM object."""
        from_attributes = True

"""
Pydantic schema for the OAuth2 token response.
"""

from pydantic import BaseModel


class Token(BaseModel):
    """
    The access token returned by the login endpoint.

    Attributes:
        access_token: The signed JWT the client sends back in the
            ``Authorization`` header.
        token_type: The scheme to use with the token; always ``"bearer"``.
    """
    access_token: str
    token_type: str



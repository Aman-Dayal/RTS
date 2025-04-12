from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Text,DateTime, Enum, ForeignKey
from datetime import datetime
class UserBase(BaseModel):
    """
    Base model for user data.
    """
    email: str
    # last_login: datetime

class UserLogin(UserBase):
    password: str

class UserCreate(UserBase):
    """
    Model for creating a new user.    
    - **password**: The password for the user.
    """
    name: str
    password: str
    role: str


class UserRead(UserBase):
    """
    Model for reading user data.    
    - **id**: The unique identifier for the user.
    - **role**: The role of the user (e.g., admin, user).
    """
    id: int
    name: str
    role: str

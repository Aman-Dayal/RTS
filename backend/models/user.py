from sqlalchemy import Column, Integer, String, Text,DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from database.db import Base
from datetime import datetime, timezone

class Users(Base):
    """
    SQLAlchemy representation of a user.    
    - **id**: The unique identifier for the user.
    - **username**: The username of the user.
    - **password**: The hashed password of the user.
    - **role**: The role of the user (default is "user").
    """
    __tablename__ = "users"
    
    id: int = Column(Integer,autoincrement=True, primary_key=True)
    name: str = Column(String(50), unique=True, nullable=False)
    email: str = Column(String,index=True, unique=True)
    password: str = Column(String)
    role: str = Column(String,default="user")
    interviews = relationship("Interview", back_populates="users") 
    # last_login: str = Column()

    # @Column_validator("role", mode="before")
    # @classmethod
    # def validate_role(cls, value: str) -> str:
    #     return value if value.lower() == "admin" else "user"
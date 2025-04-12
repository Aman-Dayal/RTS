import bcrypt
from common.logger import logger
import jwt
import jwt.exceptions
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, Security, Request
from fastapi.security import OAuth2PasswordBearer
from fastapi.security.api_key import APIKeyHeader
from models.user import Users
from database.db import get_session
from common.settings import settings
from sqlalchemy.orm import Session

def hash_password(password: str) -> str:
    logger.debug("Hashing password.")

    """
    Hashes a plain text password.    
    - **password**: The password to hash.    
    Returns the hashed password as a string.
    """
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    logger.info("Password hashed successfully.")
    return hashed_password


def verify_password(plain_password: str, hashed_password: str) -> bool:
    logger.debug("Verifying password.")

    """
    Verifies a plain text password against a hashed password.    
    - **plain_password**: The plain text password to verify.
    - **hashed_password**: The hashed password to compare against.    
    Returns True if the password matches, otherwise False.
    """
    is_valid = bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    if is_valid:
        logger.info("Password verification successful.")
    else:
        logger.warning("Password verification failed.")
    return is_valid


def create_jwt_token(data: dict) -> str:
    """
    Creates a JWT token with an expiration time.    
    - **data**: A dictionary containing the data to encode in the token.    
    Returns the encoded JWT token as a string.
    """
    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)

async def get_current_user(request:Request, session: Session = Depends(get_session)) -> Users:
    """
    Retrieves the current user based on the provided JWT token.    
    - **token**: The JWT token to decode.
    - **session**: The database session.    
    Raises an HTTPException if the credentials are invalid.    
    Returns the User object corresponding to the token.
    """
    token = request.cookies.get('access_token')
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    user = session.query(Users).filter(Users.email == email).first()
    if user is None:
        raise credentials_exception
    return user


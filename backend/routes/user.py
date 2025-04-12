from fastapi import APIRouter, HTTPException, Depends, Request
from common.logger import logger
# from sqlmodel import Session, select
from models.user import Users
from schemas.user import UserCreate, UserBase, UserLogin, UserRead
from database.db import get_session
from common.security import create_jwt_token, verify_password, hash_password
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from common.security import *

router = APIRouter()

@router.post("/register", response_model=UserBase, summary="Register a new user",
description="This endpoint allows a new user to register by providing a username and password.")
def register(user: UserCreate, session: Session = Depends(get_session)):
    """
    Registers a new user by providing a username and password.    
    - **user**: The user information for registration.    
    Returns the created user information.
    """
    try:
        user.password = hash_password(user.password)
        db_user = Users(**user.model_dump())
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
        return db_user
    except IntegrityError:
        session.rollback()
        raise HTTPException(status_code=400, detail="User already exists.")
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail="An error Occured!")
    
@router.post("/login", summary="User login",
description="This endpoint allows a user to log in by providing their username and password.")
def login(user: UserLogin, session : Session = Depends(get_session)):
    """
    Allows a user to log in by providing their username and password.    
    - **user**: The user credentials for login.    
    Returns an access token if the credentials are valid.
    """
    db_user = session.query(Users).filter(Users.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        logger.warning(f"Login attempt failed for user: {user.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_jwt_token({"sub": db_user.email, "role": db_user.role})
    response = JSONResponse(content={"message": "Login successful"}, status_code=200)
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=True, samesite="Lax")
    return response

@router.get("/status")
def status_check(current_user: Users = Depends(get_current_user)):
    return {"user": {"email": current_user.email, "role": current_user.role}}

@router.post("/logout")
def logout():
    response = JSONResponse(content={"message": "Logout successful"})
    response.delete_cookie("access_token")
    return response

@router.get("/users/", response_model=list[UserRead])
def get_users(current_user: Users = Depends(get_current_user),session: Session = Depends(get_session)):
    candidates = session.query(Users).all()
    if not candidates:
        raise HTTPException(status_code=404, detail="No Users found!")
    return candidates
    # return [
    #     UserBase(
    #         **candidate.__dict__,
    #         job_title=candidate.job.title if candidate.job else None
    #     )
    #     for candidate in candidates]

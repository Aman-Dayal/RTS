from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from database.db import get_session
from models.notification import Notification
from schemas.notification import Notification as NS 
import psycopg2.errors as pg_error

router = APIRouter()

@router.get("/notifications/")
def get_notifications(db: Session = Depends(get_session)):
    db_notifications = db.query(Notification).all()
    if not db_notifications:
        raise HTTPException(status_code=404, detail="No notifications found!")
    return jsonable_encoder(db_notifications)
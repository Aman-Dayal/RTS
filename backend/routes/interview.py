from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from database.db import SessionLocal, get_session
from models.interview import Interview
from fastapi import Request

from schemas.interview import InterviewCreate, Interviewresponse
import psycopg2.errors as pg_error

router = APIRouter()

def serialize_interview(interview: Interview) -> Interviewresponse:
    return Interviewresponse(
        id=interview.id,
        candidate_id=interview.candidate_id,
        job_id=interview.job_id,
        interviewer_id=interview.interviewer_id,
        date=interview.date,
        time=interview.time,
        status=interview.status,
        created_at=interview.created_at,
        updated_at=interview.updated_at,
        candidate=interview.candidate.name if interview.candidate else None,
        job_title=interview.job.title if interview.job else None,
        interviewer=interview.users.name if interview.users else None,
    )

@router.post("/interviews/")
def create_interview(interview: InterviewCreate, db: Session = Depends(get_session)):
    try:
        db_interview = Interview(**interview.model_dump())
        db.add(db_interview)
        db.commit()
        db.refresh(db_interview)
        return db_interview
    except IntegrityError as e:
        db.rollback()
        if isinstance(e.orig, pg_error.CheckViolation):
            raise HTTPException(status_code=400, detail="Unknown status ! it should be one of 'scheduled', 'cancelled', 'rescheduled'")
        raise HTTPException(status_code=400, detail="Integrity error: " + str(e.orig))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/interviews/{id}", response_model=Interviewresponse)
def get_interview(id: int, db: Session = Depends(get_session)):
    db_interview = db.query(Interview).filter(Interview.id == id).first()
    if not db_interview:
        raise HTTPException(status_code=404, detail="Interview not found!")
    return db_interview

@router.get("/interviews/", response_model=list[Interviewresponse])
def get_interviews(db: Session = Depends(get_session), request: Request = None):
    db_interviews = (
        db.query(Interview)
        .options(
            joinedload(Interview.job),
            joinedload(Interview.candidate)
        )
        .all()
    )
    if not db_interviews:
        raise HTTPException(status_code=404, detail="No Interviews found!")
    return [
        Interviewresponse(
            id=interview.id,
            candidate_id=interview.candidate_id,
            job_id=interview.job_id,
            interviewer_id=interview.interviewer_id,
            date=interview.date,
            time=interview.time,
            status=interview.status,
            created_at=interview.created_at,
            updated_at=interview.updated_at,
            candidate=interview.candidate.name if interview.candidate else None,
            job_title=interview.job.title if interview.job else None,
            interviewer=interview.users.name if interview.users else None,
        )
        for interview in db_interviews
    ]
@router.put("/interviews/{id}")
def update_interview(id: int, interview: InterviewCreate, db: Session = Depends(get_session)):
    db_interview = db.query(Interview).filter(Interview.id == id).first()
    if not db_interview:
        raise HTTPException(status_code=404, detail="Interview not found!")
    try:
        for key, value in interview.model_dump().items():
            setattr(db_interview, key, value)
        db.commit()
        db.refresh(db_interview)
        return db_interview
    except IntegrityError as e:
        db.rollback()
        if isinstance(e.orig, pg_error.CheckViolation):
            raise HTTPException(status_code=400, detail="Unknown Status ! It should be one of 'Scheduled', 'Cancelled', 'Rescheduled'")
        raise HTTPException(status_code=400, detail="Integrity error: " + str(e.orig))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/interviews/{id}")
def delete_interview(id: int, db: Session = Depends(get_session)):
    db_interview = db.query(Interview).filter(Interview.id == id).first()
    if not db_interview:
        raise HTTPException(status_code=404, detail="Job posting not found!")
    db.delete(db_interview)
    db.commit()
    return {"message": "Interview deleted successfully"}

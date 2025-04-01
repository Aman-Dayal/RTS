from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from database.db import SessionLocal
from models.job_posting import JobPosting
from schemas.job_posting import JobPostingCreate, JobPostingResponse
import psycopg2.errors as pg_error

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/job_postings/", response_model=JobPostingResponse)
def create_job_posting(job_posting: JobPostingCreate, db: Session = Depends(get_db)):
    try:
        db_job_posting = JobPosting(**job_posting.model_dump())
        db.add(db_job_posting)
        db.commit()
        db.refresh(db_job_posting)
        return db_job_posting
    except IntegrityError as e:
        db.rollback()
        if isinstance(e.orig, pg_error.CheckViolation):
            raise HTTPException(status_code=400, detail="Unknown employment_type ! it should be one of 'full-time', 'part-time', 'contract'")
        raise HTTPException(status_code=400, detail="Integrity error: " + str(e.orig))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/job_postings/{id}", response_model=JobPostingResponse)
def get_job_posting(id: int, db: Session = Depends(get_db)):
    db_job_posting = db.query(JobPosting).filter(JobPosting.id == id).first()
    if not db_job_posting:
        raise HTTPException(status_code=404, detail="Job posting not found!")
    return db_job_posting

@router.get("/job_postings/", response_model=list[JobPostingResponse])
def get_job_postings(db: Session = Depends(get_db)):
    db_job_postings = db.query(JobPosting).all()
    if not db_job_postings:
        raise HTTPException(status_code=404, detail="No job postings found!")
    return jsonable_encoder(db_job_postings)

@router.put("/job_postings/{id}", response_model=JobPostingResponse)
def update_job_posting(id: int, job_posting: JobPostingCreate, db: Session = Depends(get_db)):
    db_job_posting = db.query(JobPosting).filter(JobPosting.id == id).first()
    if not db_job_posting:
        raise HTTPException(status_code=404, detail="Job posting not found!")
    try:
        for key, value in job_posting.model_dump().items():
            setattr(db_job_posting, key, value)
        db.commit()
        db.refresh(db_job_posting)
        return db_job_posting
    except IntegrityError as e:
        db.rollback()
        if isinstance(e.orig, pg_error.CheckViolation):
            raise HTTPException(status_code=400, detail="Unknown employment_type! It should be one of 'full-time', 'part-time', 'contract'")
        raise HTTPException(status_code=400, detail="Integrity error: " + str(e.orig))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/job_postings/{id}")
def delete_job_posting(id: int, db: Session = Depends(get_db)):
    db_job_posting = db.query(JobPosting).filter(JobPosting.id == id).first()
    if not db_job_posting:
        raise HTTPException(status_code=404, detail="Job posting not found!")
    db.delete(db_job_posting)
    db.commit()
    return {"message": "Job posting deleted successfully"}

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from database.db import SessionLocal
from models.candidate import Candidate
from models.job_posting import JobPosting
from schemas.candidate import CandidateCreate, CandidateResponse, CandidateUpdate, CandidateUpdateResponse
from sqlalchemy.exc import IntegrityError
from sqlalchemy import desc
from sqlalchemy.orm import selectinload
import psycopg2.errors as pg_error
from typing import List

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/candidates/", response_model=CandidateResponse)
def create_candidate(candidate: CandidateCreate, db: Session = Depends(get_db)):
    try:
        db_candidate = Candidate(**candidate.model_dump())
        db.add(db_candidate)
        db.commit()
        db.refresh(db_candidate)
        db_candidate = ( db.query(Candidate).options(selectinload(Candidate.job))
            .filter(Candidate.id == db_candidate.id)
            .first()
        )

        return CandidateResponse(
            **db_candidate.__dict__,
            job_title=db_candidate.job.title if db_candidate.job else None
        )
    except IntegrityError as e:
        db.rollback()
        if isinstance(e.orig, pg_error.UniqueViolation):
            raise HTTPException(status_code=400, detail="Email already exists!")
        if isinstance(e.orig, pg_error.CheckViolation):
            raise HTTPException(
                status_code=400, 
                detail="Unknown status! It should be one of 'applied', 'screening', 'interview scheduled', 'offer extended', 'rejected'"
            )
        raise HTTPException(status_code=400, detail=f"Integrity error: {str(e.orig)}")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/candidates/{id}", response_model=CandidateResponse)
def get_candidate(id: int, db: Session = Depends(get_db)):
    db_candidate = db.query(Candidate).filter(Candidate.id == id).first()
    if not db_candidate:
        raise HTTPException(status_code=404, detail="Candidate not found!")
    return jsonable_encoder(db_candidate)

@router.get("/candidates/", response_model=list[CandidateResponse])
def get_candidates(db: Session = Depends(get_db)):
    candidates = db.query(Candidate).options(selectinload(Candidate.job)).all()
    if not candidates:
        raise HTTPException(status_code=404, detail="Candidate found!")
    return [
        CandidateResponse(
            **candidate.__dict__,
            job_title=candidate.job.title if candidate.job else None
        )
        for candidate in candidates
    ]
@router.put("/candidates/{id}", response_model=CandidateResponse)
def update_candidate( id: int, candidate: CandidateUpdate, db: Session = Depends(get_db)):
    db_candidate = db.query(Candidate).options(selectinload(Candidate.job)).filter(Candidate.id == id).first()
    if not db_candidate:
        raise HTTPException(status_code=404, detail="Candidate not found!")

    update_data = candidate.model_dump(exclude_unset=True)

    if "email" in update_data:
        existing = (
            db.query(Candidate)
            .filter(Candidate.email == update_data["email"], Candidate.id != id)
            .first()
        )
        if existing:
            raise HTTPException(status_code=400, detail="Candidate with this email already exists!")

    for key, value in update_data.items():
        setattr(db_candidate, key, value)

    try:
        db.commit()
        db.refresh(db_candidate)
        return CandidateResponse(
            **db_candidate.__dict__,
            job_title=db_candidate.job.title if db_candidate.job else None
        )
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Integrity error: {str(e.orig)}")

@router.delete("/candidates/{id}")
def delete_candidate(id: int, db: Session = Depends(get_db)):
    db_candidate = db.query(Candidate).filter(Candidate.id == id).first()
    if not db_candidate:
        raise HTTPException(status_code=404, detail="Candidate not found!")
    db.delete(db_candidate)
    db.commit()
    return {"message": "Candidate deleted successfully"}

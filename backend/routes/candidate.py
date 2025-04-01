from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from database.db import SessionLocal
from models.candidate import Candidate
from schemas.candidate import CandidateCreate, CandidateResponse, CandidateUpdate
from sqlalchemy.exc import IntegrityError
from sqlalchemy import desc
import psycopg2.errors as pg_error
from typing import List

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/candidatesv2/", response_model=List[CandidateResponse])
def get_candidates(
    db: Session = Depends(get_db),
    limit: int = Query(10, alias="limit", ge=1, le=100),  # Limit results
    sort_by: str = Query("created_at", alias="sort_by"),
    order: str = Query("desc", alias="order"),  # Sorting order: "asc" or "desc"
    status: str = Query(None, alias="status"),  # Optional filter by status
):
    query = db.query(Candidate)

    # Apply filter if status is provided
    if status:
        query = query.filter(Candidate.status == status)

    # Apply sorting
    if sort_by == "created_at":
        query = query.order_by(desc(Candidate.created_at) if order == "desc" else Candidate.created_at)

    candidates = query.limit(limit).all()

    return candidates

@router.post("/candidates/", response_model=CandidateResponse)
def create_candidate(candidate: CandidateCreate, db: Session = Depends(get_db)):
    try:
        db_candidate = Candidate(**candidate.model_dump())
        db.add(db_candidate)
        db.commit()
        db.refresh(db_candidate)
        return db_candidate
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
    db_candidates = db.query(Candidate).all()
    if not db_candidates:
        raise HTTPException(status_code=404, detail="Candidate not found!")
    return jsonable_encoder(db_candidates)

@router.put("/candidates/{id}", response_model=CandidateResponse)
def update_candidate(id: int, candidate: CandidateUpdate, db: Session = Depends(get_db)):
    db_candidate = db.query(Candidate).filter(Candidate.id == id).first()
    if not db_candidate:
        raise HTTPException(status_code=404, detail="Candidate not found!")
    update_data = candidate.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided for update!")
    for key, value in update_data.items():
        setattr(db_candidate, key, value)
    try:
        db.commit()
        db.refresh(db_candidate)
        return jsonable_encoder(db_candidate)
    except IntegrityError as e:
        db.rollback()
        if isinstance(e.orig, pg_error.UniqueViolation):
            raise HTTPException(status_code=400, detail="Candidate with this email already exists!")
        if isinstance(e.orig, pg_error.CheckViolation):
            raise HTTPException(
                status_code=400, 
                detail="Unknown status! It should be one of 'applied', 'screening', 'interview scheduled', 'offer extended', 'rejected'"
            )
        raise HTTPException(status_code=400, detail=f"Integrity error: {str(e.orig)}")

@router.delete("/candidates/{id}")
def delete_candidate(id: int, db: Session = Depends(get_db)):
    db_candidate = db.query(Candidate).filter(Candidate.id == id).first()
    if not db_candidate:
        raise HTTPException(status_code=404, detail="Candidate not found!")
    db.delete(db_candidate)
    db.commit()
    return {"message": "Candidate deleted successfully"}

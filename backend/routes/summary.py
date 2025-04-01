from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from database.db import get_session
from models import candidate, interview, job_posting

router = APIRouter()

@router.get("/dashboard/summary")
def get_dashboard_summary(db: Session = Depends(get_session)):
    try:
        # Total candidates
        total_candidates = db.query(candidate.Candidate).count()

        # Total interviews scheduled this week
        today = datetime.utcnow()
        start_of_week = today - timedelta(days=today.weekday())  # Monday
        end_of_week = start_of_week + timedelta(days=6)  # Sunday

        total_interviews_this_week = (
            db.query(interview.Interview)
            .filter(interview.Interview.schedule_time >= start_of_week, interview.Interview.schedule_time <= end_of_week)
            .count()
        )

        total_jobs = db.query(job_posting.JobPosting).count()

        return {
            "total_candidates": total_candidates,
            "total_interviews_this_week": total_interviews_this_week,
            "total_jobs": total_jobs,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

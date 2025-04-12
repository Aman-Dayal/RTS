from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, cast,DateTime
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from database.db import get_session
from models import candidate, interview, job_posting
from sqlalchemy.orm import joinedload
router = APIRouter()

@router.get("/dashboard/summary")
def get_dashboard_summary(db: Session = Depends(get_session)):
    try:
        today = datetime.now()
        start_of_week = today - timedelta(days=today.weekday())
        end_of_week = start_of_week + timedelta(days=6)
        total_candidates = db.query(func.count(candidate.Candidate.id)).scalar()
        total_interviews = (
            db.query(func.count(interview.Interview.id))
            .filter(interview.Interview.date >= start_of_week,
                    interview.Interview.date <= end_of_week)
            .scalar()
        )

        total_jobs = db.query(func.count(job_posting.JobPosting.id)).scalar()
        status_counts = (
            db.query(candidate.Candidate.status, func.count(candidate.Candidate.id))
            .group_by(candidate.Candidate.status)
            .all()
        )
        candidates_per_job_count = (
            db.query(job_posting.JobPosting.title, func.count(candidate.Candidate.id))
            .join(job_posting.JobPosting, candidate.Candidate.job_id == job_posting.JobPosting.id)
            .group_by(job_posting.JobPosting.title)
            .all()
        )

        candidates_per_job = [{
            "job": title,
            "candidates": count
        } for title, count in candidates_per_job_count]
        recent_candidates = (
            db.query(candidate.Candidate)
            .order_by(candidate.Candidate.created_at.desc())
            .limit(5)
            .all()
        )
        interview_datetime = func.cast(
        func.concat(interview.Interview.date, ' ', interview.Interview.time),
            DateTime
        )

        db_interviews = (
            db.query(interview.Interview)
            .filter(interview_datetime >= datetime.now())
            .options(
                joinedload(interview.Interview.job),
                joinedload(interview.Interview.candidate)
            )
            .order_by(interview_datetime.asc())
            .limit(5)
            .all()
        )
        upcoming_interviews = [
            {
                "candidate":i.candidate.name if i.candidate else None,
                "job_title":i.job.title if i.job else None,
                "interviewer":i.users.name if i.users else None,
                "date": f"{i.date} {i.time}",
                "time": i.time,
                "status": i.status,
                "id": i.id,

            } for i in db_interviews
        ]
        most_recent = [
            {
                "id": c.id,
                "name": c.name,
                "created_at": c.created_at.isoformat(),
                "status": c.status,
            }
            for c in recent_candidates
        ]

        status_summary = [
            {"type": status, "value": count}
            for status, count in status_counts
        ]
        print(candidates_per_job)
        return {
            "top_level": [
                {"title": "Total Candidates", "value": total_candidates},
                {"title": "Interviews Scheduled", "value": total_interviews},
                {"title": "Open Jobs", "value": total_jobs},
                {"title": "Jobs", "value": total_jobs},

            ],
            "status_summary": status_summary,
            "candidates_per_job": candidates_per_job,
            "recent_candidates": most_recent,
            "upcoming_interviews": upcoming_interviews,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

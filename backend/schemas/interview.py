from pydantic import BaseModel
from typing import Optional
from datetime import datetime,date,time

class InterviewBase(BaseModel):
    candidate_id: int
    job_id: int
    interviewer_id: Optional[int] = None
    date: date
    time: time
    status: str

class InterviewCreate(InterviewBase):
    pass

class Interviewresponse(InterviewBase):
    id: int
    candidate: str
    job_title: str
    interviewer: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class InterviewUpdate(BaseModel):
    pass
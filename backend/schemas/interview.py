from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class InterviewBase(BaseModel):
    # candidate_id: str
    applied_position: int
    interviewer: Optional[str] = None
    schedule_time: Optional[datetime] = None
    status: str

class InterviewCreate(InterviewBase):
    pass

class Interviewresponse(InterviewBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class InterviewUpdate(BaseModel):
    # candidate_id: str
    applied_position: str
    interviewer: Optional[str] = None
    schedule_time: Optional[datetime] = None
    status: int
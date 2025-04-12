from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CandidateBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    job_id: int
    status: str

class CandidateCreate(CandidateBase):
    class Config:
        extra = "allow"

class CandidateResponse(CandidateBase):
    id: int
    created_at: datetime
    updated_at: datetime
    job_title: str | None

    class Config:
        from_attributes = True

class CandidateUpdateResponse(CandidateResponse):
    job_title: str | None


class CandidateUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[str] = None
    applied_position: Optional[int] = None
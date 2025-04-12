from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class JobPostingBase(BaseModel):
    title: str
    department: str
    description: str
    required_skills: List[str]
    employment_type: str

class JobPostingCreate(JobPostingBase):
    pass

class JobPostingResponse(JobPostingBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

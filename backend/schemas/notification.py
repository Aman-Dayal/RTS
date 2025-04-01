from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Notification(BaseModel):
    id: int
    candidate_id: str
    message: str
    created_at: datetime
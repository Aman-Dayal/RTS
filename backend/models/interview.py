from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from database.db import Base
from datetime import datetime, timezone

class Interview(Base):
    __tablename__ = 'interview'

    id = Column(Integer, primary_key=True, index=True)
    interviewer = Column(String, index=True)
    applied_position = Column(Integer, ForeignKey('job_postings.id'))
    status = Column(String)
    schedule_time = Column(DateTime,default=datetime.now(timezone.utc))
    created_at = Column(DateTime,default=datetime.now(timezone.utc))
    updated_at = Column(DateTime,default=datetime.now(timezone.utc))

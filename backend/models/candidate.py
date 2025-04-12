from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database.db import Base
from datetime import datetime, timezone

class Candidate(Base):
    __tablename__ = 'candidates'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, index=True)
    phone = Column(String)
    job_id = Column(Integer, ForeignKey('job_postings.id'))
    status = Column(String)
    created_at = Column(DateTime,default=datetime.now(timezone.utc))
    updated_at = Column(DateTime,default=datetime.now(timezone.utc))
    job = relationship("JobPosting", back_populates="candidate")
    interviews = relationship("Interview", back_populates="candidate")
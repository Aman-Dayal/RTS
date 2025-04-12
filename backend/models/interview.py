from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Date, Time
from database.db import Base
from datetime import datetime, timezone, date, time
from sqlalchemy.orm import relationship
class Interview(Base):
    __tablename__ = 'interviews'

    id = Column(Integer, primary_key=True, index=True)
    interviewer_id = Column(Integer, ForeignKey('users.id'))
    candidate_id = Column(Integer, ForeignKey('candidates.id'))
    job_id = Column(Integer, ForeignKey('job_postings.id'))
    status = Column(String)
    date = Column(Date)
    time = Column(Time)

    created_at = Column(DateTime,default=datetime.now(timezone.utc))
    updated_at = Column(DateTime,default=datetime.now(timezone.utc))
    candidate = relationship("Candidate", back_populates="interviews")
    job = relationship("JobPosting", back_populates="interviews") 
    users = relationship("Users", back_populates="interviews") 
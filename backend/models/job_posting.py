from sqlalchemy import Column, Integer, String, Text,DateTime, ARRAY, Enum, ForeignKey
from sqlalchemy.orm import relationship, backref
from database.db import Base
from datetime import datetime, timezone

class JobPosting(Base):
    __tablename__ = 'job_postings'

    id = Column(Integer, primary_key=True, index=True,autoincrement=True)
    title = Column(String, index=True)
    department = Column(String)
    description = Column(Text)
    required_skills = Column(ARRAY(String))
    employment_type = Column(Enum('Full Time', 'Part Time', 'Contract'))
    created_at = Column(DateTime,default=datetime.now(timezone.utc))
    updated_at = Column(DateTime,default=datetime.now(timezone.utc))
    candidate = relationship("Candidate", back_populates="job")
    interviews = relationship("Interview", back_populates="job")
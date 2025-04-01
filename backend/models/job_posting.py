from sqlalchemy import Column, Integer, String, Text,DateTime, Enum, ForeignKey
from database.db import Base
from datetime import datetime, timezone
class JobPosting(Base):
    __tablename__ = 'job_postings'

    id = Column(Integer, ForeignKey("candidates.applied_position"), primary_key=True, index=True,autoincrement=True)
    title = Column(String, index=True)
    department = Column(String)
    description = Column(Text)
    required_skills = Column(String)
    employment_type = Column(Enum('Full Time', 'Part Time', 'Contract'))
    created_at = Column(DateTime,default=datetime.now(timezone.utc))
    updated_at = Column(DateTime,default=datetime.now(timezone.utc))

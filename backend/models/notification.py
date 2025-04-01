from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from database.db import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), nullable=False)
    message = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())
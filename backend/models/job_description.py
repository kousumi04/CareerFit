from sqlalchemy import Column, String, Text, JSON, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from core.database import Base
import uuid

class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    title = Column(String, nullable=False)
    company = Column(String, nullable=True)
    raw_text = Column(Text, nullable=False)
    parsed_content = Column(JSON, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
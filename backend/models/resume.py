from sqlalchemy import Column, String, JSON, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from core.database import Base
import uuid

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    file_name = Column(String, nullable=False)
    storage_path = Column(String, nullable=False)
    parsed_content = Column(JSON, nullable=True)
    
    # We added server_default to updated_at so it gets a timestamp on initial INSERT
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
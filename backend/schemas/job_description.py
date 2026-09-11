from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class JobDescriptionCreate(BaseModel):
    title: str
    company: Optional[str] = None
    raw_text: str

class JobDescriptionResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    company: Optional[str]
    raw_text: str
    created_at: datetime
    
    class Config:
        from_attributes = True
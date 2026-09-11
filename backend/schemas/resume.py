from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class ResumeCreate(BaseModel):
    file_name: str
    storage_path: str

class ResumeResponse(BaseModel):
    id: UUID
    user_id: UUID
    file_name: str
    storage_path: str
    created_at: datetime
    
    class Config:
        from_attributes = True
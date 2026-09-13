import os
import base64
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

from core.database import get_db
from core.deps import get_current_user
from models.resume import Resume

router = APIRouter()

# Initialize Supabase client specifically for Storage operations
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY") or os.getenv("SUPABASE_KEY", "")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Schema to accept the Base64 JSON payload
class ResumeCreateBase64(BaseModel):
    file_name: str
    file_data: str

@router.get("")
async def get_resumes(db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    query = await db.execute(
        select(Resume)
        .where(Resume.user_id == current_user.id)
        .order_by(Resume.created_at.desc())
    )
    return query.scalars().all()

@router.get("/{resume_id}")
async def get_resume(resume_id: str, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    query = await db.execute(
        select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id)
    )
    resume = query.scalars().first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume

@router.post("")
async def upload_resume(
    resume_in: ResumeCreateBase64,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if not resume_in.file_name.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        # Decode the Base64 string back into raw PDF bytes
        content = base64.b64decode(resume_in.file_data)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid file encoding")
    
    # 1. Upload directly to Supabase Storage
    file_uuid_str = str(uuid.uuid4())
    storage_path = f"{current_user.id}/{file_uuid_str}.pdf"
    
    try:
        supabase.storage.from_("resumes").upload(
            path=storage_path,
            file=content,
            file_options={"content-type": "application/pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload to Supabase Storage: {str(e)}")
    
    # 2. Create new database record with the correct cloud storage_path
    new_resume = Resume(
        user_id=current_user.id,
        file_name=resume_in.file_name,
        storage_path=storage_path
    )
    
    db.add(new_resume)
    await db.commit()
    await db.refresh(new_resume)
    
    # --- ENFORCE 5-ITEM LIMIT ---
    query = await db.execute(
        select(Resume)
        .where(Resume.user_id == current_user.id)
        .order_by(Resume.created_at.desc())
    )
    user_resumes = query.scalars().all()
    
    if len(user_resumes) > 5:
        resumes_to_delete = user_resumes[5:]
        for old_resume in resumes_to_delete:
            # Delete from Supabase Storage first
            try:
                if old_resume.storage_path:
                    supabase.storage.from_("resumes").remove([old_resume.storage_path])
            except Exception as e:
                print(f"Failed to delete old file from Supabase: {e}")
            
            # Then delete the database record
            await db.delete(old_resume)
        await db.commit()
    # ----------------------------
    
    return new_resume

@router.delete("/{resume_id}")
async def delete_resume(resume_id: str, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    query = await db.execute(
        select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id)
    )
    resume = query.scalars().first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Delete the file from Supabase Storage
    try:
        if resume.storage_path:
            supabase.storage.from_("resumes").remove([resume.storage_path])
    except Exception as e:
        print(f"Failed to delete file from Supabase: {e}")
    
    await db.delete(resume)
    await db.commit()
    return {"message": "Resume deleted successfully"}
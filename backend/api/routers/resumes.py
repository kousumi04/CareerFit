from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from core.database import get_db
from core.deps import get_current_user
from models.resume import Resume
from schemas.resume import ResumeCreate, ResumeResponse

router = APIRouter()

# Using "" instead of "/" to prevent the 307 Redirect CORS trap
@router.post("", response_model=ResumeResponse)
async def create_resume(
    resume_in: ResumeCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    new_resume = Resume(
        user_id=current_user.id,
        file_name=resume_in.file_name,
        storage_path=resume_in.storage_path
    )
    db.add(new_resume)
    await db.commit()
    await db.refresh(new_resume)
    return new_resume

@router.get("", response_model=List[ResumeResponse])
async def get_resumes(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Enforce multi-tenancy at the application level
    result = await db.execute(select(Resume).where(Resume.user_id == current_user.id))
    return result.scalars().all()
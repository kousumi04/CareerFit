from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from core.database import get_db
from core.deps import get_current_user
from models.job_description import JobDescription
from schemas.job_description import JobDescriptionCreate, JobDescriptionResponse

router = APIRouter()

@router.post("", response_model=JobDescriptionResponse)
async def create_job_description(
    jd_in: JobDescriptionCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    new_jd = JobDescription(
        user_id=current_user.id,
        title=jd_in.title,
        company=jd_in.company,
        raw_text=jd_in.raw_text
    )
    db.add(new_jd)
    await db.commit()
    await db.refresh(new_jd)
    return new_jd

@router.get("", response_model=List[JobDescriptionResponse])
async def get_job_descriptions(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Enforce multi-tenancy at the application level
    result = await db.execute(select(JobDescription).where(JobDescription.user_id == current_user.id))
    return result.scalars().all()
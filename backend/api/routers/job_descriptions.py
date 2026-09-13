import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel

from core.database import get_db
from core.deps import get_current_user
from models.job_description import JobDescription

router = APIRouter()

# Schema for incoming request (adjust imports if this is stored in your schemas folder)
class JobCreate(BaseModel):
    title: str
    company: str = ""
    raw_text: str

@router.get("")
async def get_jobs(db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    query = await db.execute(
        select(JobDescription)
        .where(JobDescription.user_id == current_user.id)
        .order_by(JobDescription.created_at.desc())
    )
    return query.scalars().all()

@router.get("/{job_id}")
async def get_job(job_id: str, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    query = await db.execute(
        select(JobDescription).where(JobDescription.id == job_id, JobDescription.user_id == current_user.id)
    )
    job = query.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job description not found")
    return job

@router.post("")
async def create_job(
    job_in: JobCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Create new job record
    new_job = JobDescription(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        title=job_in.title,
        company=job_in.company,
        raw_text=job_in.raw_text
    )
    
    db.add(new_job)
    await db.commit()
    await db.refresh(new_job)

    # --- ENFORCE 5-ITEM LIMIT ---
    query = await db.execute(
        select(JobDescription)
        .where(JobDescription.user_id == current_user.id)
        .order_by(JobDescription.created_at.desc())
    )
    user_jobs = query.scalars().all()
    
    # Delete oldest if limit exceeded
    if len(user_jobs) > 5:
        jobs_to_delete = user_jobs[5:]
        for old_job in jobs_to_delete:
            await db.delete(old_job)
        await db.commit()
    # ----------------------------

    return new_job

@router.delete("/{job_id}")
async def delete_job(job_id: str, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    query = await db.execute(
        select(JobDescription).where(JobDescription.id == job_id, JobDescription.user_id == current_user.id)
    )
    job = query.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job description not found")
    
    await db.delete(job)
    await db.commit()
    return {"message": "Job description deleted successfully"}
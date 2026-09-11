from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from core.database import get_db
from core.deps import get_current_user
from models.resume import Resume
from models.job_description import JobDescription
from schemas.extracted_data import ExtractedResume, ExtractedJD
from services.pdf_parser import extract_text_from_supabase_pdf
from services.ai_extractor import extract_resume_data, extract_jd_data

router = APIRouter()

@router.post("/resume/{resume_id}", response_model=ExtractedResume)
async def extract_resume(
    resume_id: str,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # 1. Fetch resume record from DB to ensure user owns it
    result = await db.execute(
        select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id)
    )
    resume = result.scalars().first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    # 2. Extract text from PDF
    raw_text = extract_text_from_supabase_pdf(resume.storage_path)
    
    # 3. Process via Groq LLM
    extracted_data = extract_resume_data(raw_text)
    
    # 4. Save the cached JSON back to the database
    resume.parsed_content = extracted_data.model_dump()
    await db.commit()
    
    return extracted_data

@router.post("/job/{jd_id}", response_model=ExtractedJD)
async def extract_job(
    jd_id: str,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    result = await db.execute(
        select(JobDescription).where(JobDescription.id == jd_id, JobDescription.user_id == current_user.id)
    )
    jd = result.scalars().first()
    if not jd:
        raise HTTPException(status_code=404, detail="Job description not found")

    extracted_data = extract_jd_data(jd.raw_text)
    
    jd.parsed_content = extracted_data.model_dump()
    await db.commit()
    
    return extracted_data
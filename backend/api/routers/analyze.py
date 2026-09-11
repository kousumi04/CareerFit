from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from core.database import get_db
from core.deps import get_current_user
from models.resume import Resume
from models.job_description import JobDescription
from schemas.extracted_data import ExtractedResume, ExtractedJD
from schemas.matching import FullAnalysisResponse
from services.matching.engine import run_matching_engine
from services.ai_explainer import generate_match_explanation

router = APIRouter()

@router.get("/{resume_id}/{jd_id}", response_model=FullAnalysisResponse)
async def analyze_fit(
    resume_id: str,
    jd_id: str,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # 1. Fetch Resume
    res_query = await db.execute(select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id))
    resume_db = res_query.scalars().first()
    
    if not resume_db or not resume_db.parsed_content:
        raise HTTPException(status_code=404, detail="Resume not found or not extracted yet.")
        
    # 2. Fetch JD
    jd_query = await db.execute(select(JobDescription).where(JobDescription.id == jd_id, JobDescription.user_id == current_user.id))
    jd_db = jd_query.scalars().first()
    
    if not jd_db or not jd_db.parsed_content:
        raise HTTPException(status_code=404, detail="JD not found or not extracted yet.")

    # 3. Convert DB JSON back to Pydantic models
    resume_data = ExtractedResume.model_validate(resume_db.parsed_content)
    jd_data = ExtractedJD.model_validate(jd_db.parsed_content)
    
    # 4. Run Deterministic Engine
    matching_results = run_matching_engine(resume_data, jd_data)
    
    # 5. Run AI Explainer
    explanation = generate_match_explanation(resume_data, jd_data, matching_results)
    
    return FullAnalysisResponse(
        resume_id=resume_id,
        jd_id=jd_id,
        match_data=matching_results,
        explanation=explanation
    )
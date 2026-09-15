import json
import os
from typing import List
from pydantic import BaseModel, Field, ValidationError
from groq import AsyncGroq

# ==========================================
# 1. STRICT PYDANTIC SCHEMAS FOR JSON OUTPUT
# ==========================================
class MatchScores(BaseModel):
    overall: int = Field(..., description="Overall match percentage (0-100)")
    skills: int = Field(..., description="Skills match percentage (0-100)")
    experience: int = Field(..., description="Experience match percentage (0-100)")
    tools: int = Field(..., description="Tools & Technologies match percentage (0-100)")
    education: int = Field(..., description="Education match percentage (0-100)")
    responsibilities: int = Field(..., description="Responsibilities match percentage (0-100)")

class SkillAnalysis(BaseModel):
    strong_matches: List[str] = Field(..., description="Skills clearly demonstrated in resume")
    partial_matches: List[str] = Field(..., description="Skills with weak or tangential evidence")
    missing: List[str] = Field(..., description="Skills required/preferred but not detected")

class Requirement(BaseModel):
    requirement: str = Field(..., description="Specific JD requirement")
    importance: str = Field(..., description="'Required' or 'Preferred'")
    status: str = Field(..., description="'Strong Match', 'Partial Match', or 'Not Detected'")
    evidence: str = Field(..., description="Exact evidence from resume, or 'No evidence found'")

class TopStrength(BaseModel):
    name: str
    description: str

class TopGap(BaseModel):
    name: str
    priority: str = Field(..., description="'High', 'Medium', or 'Low'")
    description: str = Field(..., description="Why it matters and its impact on the application")

class AnalysisReport(BaseModel):
    scores: MatchScores
    skill_analysis: SkillAnalysis
    requirements: List[Requirement]
    top_strengths: List[TopStrength]
    top_gaps: List[TopGap]
    resume_improvements: List[str] = Field(..., description="Actionable resume edits (not learning new skills)")
    interview_prep: List[str] = Field(..., description="Topics to prepare for based on gaps/role")

# ==========================================
# 2. THE AI EVALUATION SERVICE
# ==========================================
client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """You are an expert, evidence-based Applicant Tracking System (ATS) and Technical Recruiter. 
Your job is to analyze a candidate's resume against a Job Description (JD) and output a strict JSON evaluation.

RULES FOR EVALUATION:
1. NO HALLUCINATIONS: If a skill is not explicitly written in the resume, it is "Not Detected". Do not assume knowledge.
2. EVIDENCE-BASED: Every match must be backed by evidence (e.g., "Used Python to build X").
3. REQUIREMENT CLASSIFICATION: Differentiate between explicitly "Required" skills and "Preferred/Bonus" skills in the JD.
4. PENALTIES: Missing a "Required" skill heavily penalizes the score. Missing a "Preferred" skill is a minor penalty.
5. DISAMBIGUATION: Differentiate between a candidate lacking a skill entirely, and a candidate just failing to highlight it properly on their resume.

You MUST respond with valid JSON matching the provided AnalysisReport schema.
The top-level JSON keys MUST be exactly:
scores, skill_analysis, requirements, top_strengths, top_gaps, resume_improvements, interview_prep.
Do not return extraction JSON such as required_skills, preferred_skills, role, projects, or education as top-level keys.
Do not include markdown formatting like ```json in the output.
"""

REPORT_SCHEMA = json.dumps(AnalysisReport.model_json_schema(), indent=2)

async def generate_analysis(resume_text: str, job_description: str) -> dict:
    prompt = f"""
    Return JSON that validates against this AnalysisReport schema:
    {REPORT_SCHEMA}

    JOB DESCRIPTION:
    {job_description}
    
    RESUME TEXT:
    {resume_text}
    
    Analyze the resume against the job description and generate the structured JSON report.
    """
    
    async def request_report(user_prompt: str) -> dict:
        # response_format guarantees JSON syntax; Pydantic below guarantees report shape.
        response = await client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.0
        )

        raw_json = response.choices[0].message.content
        return json.loads(raw_json)

    raw_report = await request_report(prompt)

    try:
        return AnalysisReport.model_validate(raw_report).model_dump()
    except ValidationError as exc:
        retry_prompt = f"""
        Your previous JSON did not validate as AnalysisReport.
        Validation error:
        {exc}

        Rewrite the analysis as valid JSON for this exact schema:
        {REPORT_SCHEMA}

        Original job description:
        {job_description}

        Original resume text:
        {resume_text}
        """
        retry_report = await request_report(retry_prompt)
        return AnalysisReport.model_validate(retry_report).model_dump()

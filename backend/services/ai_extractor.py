import os
import json
from groq import Groq
from schemas.extracted_data import ExtractedResume, ExtractedJD

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL_NAME = "openai/gpt-oss-120b"

def extract_resume_data(raw_text: str) -> ExtractedResume:
    prompt = f"""
    You are an expert HR extraction AI. Extract the following information from the resume text below.
    You must respond ONLY with a valid JSON object matching this structure:
    {{
        "skills": ["skill1", "skill2"],
        "experience_years": 2.5,
        "education": [{{"degree": "BSc CS", "institution": "University"}}],
        "projects": [{{"name": "Project", "description": "...", "technologies": ["React"]}}]
    }}
    
    Resume Text:
    {raw_text}
    """
    
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model=MODEL_NAME,
        response_format={"type": "json_object"},
        temperature=0.0, # 0.0 for maximum determinism
    )
    
    # Parse the JSON string into our Pydantic model to guarantee structure
    raw_json = json.loads(response.choices[0].message.content)
    return ExtractedResume.model_validate(raw_json)

def extract_jd_data(raw_text: str) -> ExtractedJD:
    prompt = f"""
    You are an expert HR extraction AI. Extract the following information from the job description text below.
    You must respond ONLY with a valid JSON object matching this structure:
    {{
        "role": "Software Engineer",
        "required_skills": ["Python", "FastAPI"],
        "preferred_skills": ["Docker", "AWS"],
        "experience_years": 3.0
    }}
    
    Job Description Text:
    {raw_text}
    """
    
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model=MODEL_NAME,
        response_format={"type": "json_object"},
        temperature=0.0,
    )
    
    raw_json = json.loads(response.choices[0].message.content)
    return ExtractedJD.model_validate(raw_json)
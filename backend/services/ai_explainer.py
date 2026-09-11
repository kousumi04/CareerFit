import os
import json
from groq import Groq
from schemas.extracted_data import ExtractedResume, ExtractedJD
from schemas.matching import MatchingResult
from schemas.explanation import AIExplanation

# Re-use our Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL_NAME = "llama3-70b-8192"

def generate_match_explanation(resume: ExtractedResume, jd: ExtractedJD, match_result: MatchingResult) -> AIExplanation:
    prompt = f"""
    You are an expert technical recruiter and career coach.
    Analyze the following candidate's data against the job description and their calculated matching scores.
    
    You must respond ONLY with a valid JSON object matching this structure:
    {{
        "summary": "...",
        "strengths": ["...", "..."],
        "gaps": ["...", "..."],
        "recommendation": "..."
    }}

    CALCULATED SCORES (Out of 100):
    - Overall Score: {match_result.scores.overall_score}
    - Required Skills Score: {match_result.scores.required_skill_score}
    - Experience Score: {match_result.scores.experience_score}
    
    CANDIDATE PROFILE:
    - Skills: {resume.skills}
    - Experience: {resume.experience_years} years
    
    JOB DESCRIPTION:
    - Role: {jd.role}
    - Required Skills: {jd.required_skills}
    - Preferred Skills: {jd.preferred_skills}
    - Required Experience: {jd.experience_years} years
    
    Keep the tone professional, objective, and constructive.
    """

    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model=MODEL_NAME,
        response_format={"type": "json_object"},
        temperature=0.3, # Slightly higher than 0.0 to allow for natural language variation, but still strict
    )
    
    raw_json = json.loads(response.choices[0].message.content)
    return AIExplanation.model_validate(raw_json)
import pytest
from schemas.extracted_data import ExtractedResume, ExtractedJD
from schemas.matching import MatchStatus
from services.matching.engine import run_matching_engine
from services.matching.normalizer import normalize_skill

def test_skill_normalization():
    assert normalize_skill("Postgres") == "postgresql"
    assert normalize_skill("React.js") == "react"
    assert normalize_skill("UnknownSkill") == "unknownskill"

def test_matching_engine_scores():
    # Mock extracted resume data
    resume = ExtractedResume(
        skills=["Python", "React", "MySQL", "AWS"],
        experience_years=1.0,
        education=[{"degree": "BSc CS", "institution": "University"}],
        projects=[]
    )
    
    # Mock extracted JD data
    jd = ExtractedJD(
        role="Backend Developer",
        required_skills=["Python 3", "PostgreSQL", "Amazon Web Services"],
        preferred_skills=["Docker"],
        experience_years=2.0
    )
    
    result = run_matching_engine(resume, jd)
    
    # 1. Test Normalization logic (Python 3 -> python, Python -> python) = MATCHED
    assert result.required_skills[0].skill == "Python 3"
    assert result.required_skills[0].status == MatchStatus.MATCHED
    
    # 2. Test Missing logic (MySQL != PostgreSQL and no substring overlap) = MISSING
    assert result.required_skills[1].skill == "PostgreSQL"
    assert result.required_skills[1].status == MatchStatus.MISSING
    
    # 3. Test Alias mapping (Amazon Web Services -> aws, AWS -> aws) = MATCHED
    assert result.required_skills[2].skill == "Amazon Web Services"
    assert result.required_skills[2].status == MatchStatus.MATCHED
    
    # 4. Test Experience logic (Resume has 1 yr, JD requires 2 yr) -> 50% score
    assert result.scores.experience_score == 50.0
    
    # 5. Check if overall score calculates without throwing errors
    assert result.scores.overall_score > 0
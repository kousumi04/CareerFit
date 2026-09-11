import pytest
from schemas.extracted_data import ExtractedResume, ExtractedJD
from schemas.matching import MatchStatus
from services.matching.engine import run_matching_engine
from services.matching.normalizer import normalize_skill
from services.matching.semantic import get_best_semantic_match

def test_skill_normalization():
    assert normalize_skill("Postgres") == "postgresql"
    assert normalize_skill("React.js") == "react"

def test_semantic_matching():
    # "Backend APIs" and "RESTful services" should mathematically match closely
    score, match = get_best_semantic_match("RESTful services", ["Backend APIs", "Cooking", "CSS"])
    assert score > 0.40
    assert match == "Backend APIs"
    
    # "Docker" and "Cooking" have no conceptual overlap
    score, match = get_best_semantic_match("Docker", ["Cooking", "Painting"])
    assert score < 0.40

def test_matching_engine_scores():
    resume = ExtractedResume(
        # CHANGED: Replaced 'MySQL' with 'CSS' to guarantee 0% semantic overlap with PostgreSQL
        skills=["Python", "React", "CSS", "Backend APIs"], 
        experience_years=1.0,
        education=[{"degree": "BSc CS", "institution": "University"}],
        projects=[]
    )
    
    jd = ExtractedJD(
        role="Backend Developer",
        required_skills=["Python 3", "PostgreSQL", "RESTful services"], 
        preferred_skills=["Docker"],
        experience_years=2.0
    )
    
    result = run_matching_engine(resume, jd)
    
    # Python 3 -> Python = Exact Match
    assert result.required_skills[0].status == MatchStatus.MATCHED
    
    # PostgreSQL -> CSS = Missing (Now properly testing the MISSING branch)
    assert result.required_skills[1].status == MatchStatus.MISSING
    
    # RESTful services -> Backend APIs = Semantic Partial Match
    assert result.required_skills[2].status == MatchStatus.PARTIAL
    
    # Semantic score should be populated
    assert result.scores.semantic_score > 0
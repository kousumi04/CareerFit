from pydantic import BaseModel
from typing import List, Optional
from enum import Enum
from schemas.explanation import AIExplanation

class MatchStatus(str, Enum):
    MATCHED = "MATCHED"
    PARTIAL = "PARTIAL"
    MISSING = "MISSING"
    UNKNOWN = "UNKNOWN"

class SkillMatch(BaseModel):
    skill: str
    status: MatchStatus
    evidence: Optional[str] = None # Will be populated in Phase 9 by the LLM

class ScoreBreakdown(BaseModel):
    overall_score: float
    required_skill_score: float
    preferred_skill_score: float
    experience_score: float
    semantic_score: float
    education_score: float
    evidence_score: float

class MatchingResult(BaseModel):
    required_skills: List[SkillMatch]
    preferred_skills: List[SkillMatch]
    experience_match: bool
    education_match: bool
    scores: ScoreBreakdown

class FullAnalysisResponse(BaseModel):
    resume_id: str
    jd_id: str
    match_data: MatchingResult
    explanation: "AIExplanation"    
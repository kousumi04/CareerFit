from schemas.extracted_data import ExtractedResume, ExtractedJD
from schemas.matching import MatchingResult, SkillMatch, MatchStatus, ScoreBreakdown
from services.matching.normalizer import normalize_skill
from services.matching.semantic import get_best_semantic_match

# Configurable Weights (Must sum to 1.0)
WEIGHTS = {
    "required_skills": 0.35,
    "preferred_skills": 0.10,
    "experience": 0.20,
    "semantic": 0.20,
    "education": 0.05,
    "evidence": 0.10   # Phase 9 placeholder
}

# Calibrated Semantic Thresholds
SEMANTIC_STRONG_MATCH = 0.60 
SEMANTIC_WEAK_MATCH = 0.40   

def evaluate_skills(jd_skills: list[str], resume_skills: list[str]) -> tuple[list[SkillMatch], float, float]:
    """Compares JD skills against Resume skills using normalization and semantic matching."""
    normalized_resume_skills = {normalize_skill(s): s for s in resume_skills}
    
    results = []
    exact_score = 0.0
    semantic_points = 0.0
    
    if not jd_skills:
        return results, 100.0, 100.0

    for skill in jd_skills:
        norm_req = normalize_skill(skill)
        
        # 1. Exact Match
        if norm_req in normalized_resume_skills:
            results.append(SkillMatch(skill=skill, status=MatchStatus.MATCHED))
            exact_score += 1.0
            semantic_points += 1.0 
            
        # 2. Partial Exact Match (Substring)
        elif any(norm_req in r_skill or r_skill in norm_req for r_skill in normalized_resume_skills):
            results.append(SkillMatch(skill=skill, status=MatchStatus.PARTIAL))
            exact_score += 0.5
            semantic_points += 0.8
            
        # 3. Semantic Match Fallback
        else:
            sim_score, best_match = get_best_semantic_match(skill, resume_skills, threshold=SEMANTIC_WEAK_MATCH)
            semantic_points += sim_score
            
            # FIX: If it hits at least the weak threshold, it counts as a PARTIAL match
            if sim_score >= SEMANTIC_WEAK_MATCH:
                results.append(SkillMatch(skill=skill, status=MatchStatus.PARTIAL))
                exact_score += 0.5 
            else:
                results.append(SkillMatch(skill=skill, status=MatchStatus.MISSING))
    
    final_exact_score = (exact_score / len(jd_skills)) * 100 if jd_skills else 0
    final_semantic_score = (semantic_points / len(jd_skills)) * 100 if jd_skills else 0
    
    return results, final_exact_score, final_semantic_score

def calculate_experience_score(jd_exp: float, resume_exp: float) -> float:
    if jd_exp <= 0:
        return 100.0
    if resume_exp >= jd_exp:
        return 100.0
    return (resume_exp / jd_exp) * 100

def run_matching_engine(resume: ExtractedResume, jd: ExtractedJD) -> MatchingResult:
    req_results, req_score, req_semantic = evaluate_skills(jd.required_skills, resume.skills)
    pref_results, pref_score, pref_semantic = evaluate_skills(jd.preferred_skills, resume.skills)
    
    exp_score = calculate_experience_score(jd.experience_years, resume.experience_years)
    edu_score = 100.0 if len(resume.education) > 0 else 0.0 
    
    # Average the semantic scores
    semantic_score = (req_semantic + pref_semantic) / 2 if (jd.required_skills and jd.preferred_skills) else (req_semantic or pref_semantic)
    
    evidence_score = 0.0 # Phase 9 placeholder
    
    overall_score = (
        (req_score * WEIGHTS["required_skills"]) +
        (pref_score * WEIGHTS["preferred_skills"]) +
        (exp_score * WEIGHTS["experience"]) +
        (semantic_score * WEIGHTS["semantic"]) +
        (edu_score * WEIGHTS["education"]) +
        (evidence_score * WEIGHTS["evidence"])
    )
    
    breakdown = ScoreBreakdown(
        overall_score=round(overall_score, 2),
        required_skill_score=round(req_score, 2),
        preferred_skill_score=round(pref_score, 2),
        experience_score=round(exp_score, 2),
        semantic_score=round(semantic_score, 2),
        education_score=round(edu_score, 2),
        evidence_score=round(evidence_score, 2)
    )
    
    return MatchingResult(
        required_skills=req_results,
        preferred_skills=pref_results,
        experience_match=(exp_score >= 100),
        education_match=(edu_score >= 100),
        scores=breakdown
    )
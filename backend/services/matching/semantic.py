from sentence_transformers import SentenceTransformer, util
import torch
import warnings

# Suppress HuggingFace warnings for cleaner terminal output
warnings.filterwarnings("ignore", category=FutureWarning)

# Load the model once when the server starts
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_best_semantic_match(jd_requirement: str, resume_skills: list[str], threshold: float = 0.5) -> tuple[float, str]:
    """
    Compares a JD requirement against a list of resume skills.
    Returns the highest cosine similarity score and the matching skill.
    """
    if not resume_skills:
        return 0.0, ""
        
    # Convert text to vector embeddings
    req_emb = model.encode(jd_requirement, convert_to_tensor=True)
    res_embs = model.encode(resume_skills, convert_to_tensor=True)
    
    # Compute cosine similarities (math distance between vectors)
    cosine_scores = util.cos_sim(req_emb, res_embs)[0]
    
    # Find the highest scoring match
    best_idx = torch.argmax(cosine_scores).item()
    best_score = cosine_scores[best_idx].item()
    
    if best_score >= threshold:
        return best_score, resume_skills[best_idx]
        
    return 0.0, ""
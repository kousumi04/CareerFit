from pydantic import BaseModel, Field
from typing import List

class AIExplanation(BaseModel):
    summary: str = Field(description="A 2-3 sentence overall assessment of the candidate's fit.")
    strengths: List[str] = Field(description="List of 2-3 key strengths based on matched skills and experience.")
    gaps: List[str] = Field(description="List of 1-3 critical gaps or missing requirements.")
    recommendation: str = Field(description="A single-sentence practical recommendation (e.g., 'Strong fit, move to interview').")
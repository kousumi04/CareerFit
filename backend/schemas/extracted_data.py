from pydantic import BaseModel, Field
from typing import List, Optional

class Education(BaseModel):
    degree: str = Field(description="Degree name, e.g., Bachelor of Science in Computer Science")
    institution: str = Field(description="University or school name")

class Project(BaseModel):
    name: str
    description: str
    technologies: List[str]

class ExtractedResume(BaseModel):
    skills: List[str] = Field(description="All technical and soft skills found in the resume")
    experience_years: float = Field(description="Total years of professional experience. Use 0 if none.")
    education: List[Education]
    projects: List[Project]

class ExtractedJD(BaseModel):
    role: str = Field(description="The job title")
    required_skills: List[str] = Field(description="Skills explicitly marked as required")
    preferred_skills: List[str] = Field(description="Skills marked as a plus or preferred")
    experience_years: float = Field(description="Minimum years of experience required. Use 0 if not specified.")
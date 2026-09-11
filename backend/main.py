from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import resumes, job_descriptions

app = FastAPI(title="CareerFit API", version="1.0.0")

# Configure CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "CareerFit API is running"}

# Include routers
app.include_router(resumes.router, prefix="/api/v1/resumes", tags=["Resumes"])
app.include_router(job_descriptions.router, prefix="/api/v1/jobs", tags=["Job Descriptions"])
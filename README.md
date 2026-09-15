CareerFit

AI-Powered, Explainable Resume-to-Job Matching

   

CareerFit is a full-stack application that analyzes how well a candidate’s resume aligns with a specific job description. It combines AI-powered extraction and analysis with semantic skill matching to generate an explainable report showing the candidate’s overall fit, strengths, gaps, requirement-level evidence, resume improvement suggestions, and interview preparation topics.

Project Overview

CareerFit helps candidates understand how well their resume matches a particular job before applying.

Users can:

• Create an account and log in securely
• Upload and manage PDF resumes
• Save job descriptions with job title and company
• Select a resume and job description for analysis
• Generate an AI-powered resume-to-job fit report
• Understand why a resume matches or does not match a role
• Identify important missing or weakly supported skills
• See evidence from the resume for detected requirements
• Get actionable resume improvement suggestions
• Get interview preparation topics based on identified gaps

The application is currently configured for local development.

Key Features

1. Authentication

• Email/password authentication using Supabase Auth
• Protected application routes using AuthGuard
• Supabase JWT bearer-token authentication between frontend and backend
• User-scoped access to resumes and job descriptions

2. Resume Management

• Upload PDF resumes
• Extract text from uploaded PDFs
• Store uploaded files in a private Supabase Storage bucket
• Create, view, and delete saved resumes
• Maximum of 5 resumes per user
• Automatically delete the oldest resume when the limit is exceeded

3. Job Description Management

• Save job descriptions
• Store job title, company, and raw job description
• Create, view, and delete saved jobs
• Maximum of 5 jobs per user
• Automatically delete the oldest job when the limit is exceeded

4. Explainable Resume-To-Job Analysis

CareerFit generates a structured analysis containing:

• Overall fit score
• Category-level scores
• Skill matches
• Partial skill matches
• Missing or undetected skills
• Requirement-level analysis
• Resume evidence supporting matches
• Requirement importance
• Top candidate strengths
• Top candidate gaps
• Resume improvement actions
• Interview preparation topics

The objective is not only to provide a score, but to explain how the score was reached.

5. Semantic Skill Matching

The application also contains a deterministic matching engine supporting:

• Skill normalization
• Semantic similarity matching
• Weighted scoring
• Matching related skills beyond exact keyword matches
• Automated backend tests

The deterministic matching engine is located under:

backend/services/matching/

Tech Stack

Frontend:
• Next.js 16
• React 19
• TypeScript
• Tailwind CSS 4
• shadcn-style UI components
• Radix UI Progress
• Supabase JavaScript client

Backend:
• FastAPI
• Python
• SQLAlchemy Async
• asyncpg
• Pydantic v2
• Uvicorn

Database / Authentication / Storage:
• Supabase Auth
• Supabase PostgreSQL
• Supabase Storage

AI / ML:
• Groq SDK
• Groq model: openai/gpt-oss-120b
• Sentence Transformers
• Semantic model: all-MiniLM-L6-v2
• PyPDF2

Testing:
• pytest

Architecture

User
↓

Next.js Frontend

↓

Supabase Authentication

↓

JWT Bearer Token

↓

FastAPI Backend

↓

┌──────────────────────────────────────┐
│                                      │
│  Resume APIs                         │
│  Job Description APIs                │
│  Extraction APIs                     │
│  Analysis APIs                       │
│                                      │
└──────────────────────────────────────┘

↓

┌──────────────────┬───────────────────┬──────────────────┐
│                  │                   │                  │
↓                  ↓                   ↓                  ↓
Supabase        Groq LLM       Sentence Transformers   PostgreSQL
Auth            Extraction     Semantic Matching       Database
Storage         Analysis
Explanation
│                  │                   │
└──────────────────┼───────────────────┘

↓

Structured Analysis

↓

Analysis Report

↓

Next.js UI

Ai Analysis Pipeline

Resume PDF

↓

PDF Text Extraction

↓

Resume Information Extraction

↓

Structured Resume Profile

↓

Job Description

↓

Job Requirement Extraction

↓

Requirement Classification

↓

Required / Preferred Requirements

↓

Semantic Skill Matching

↓

Requirement-Level Analysis

↓

Weighted Scoring

↓

Explainable Analysis

↓

Recommendations

↓

Final Analysis Report

The analysis combines LLM-based understanding with semantic matching and deterministic scoring.

Analysis Report

The analysis report is designed to provide more than a simple keyword match.

Overall Fit

Provides a high-level assessment of how closely the candidate’s resume aligns with the selected role.

Score Breakdown

The overall assessment can be broken down into categories such as:

• Skills
• Experience
• Tools and Technologies
• Education
• Responsibilities

This allows users to understand where the overall score comes from.

Skill Matching

Skills can be classified into different levels:

• Strong Match
• Match
• Partial Match
• Weak Evidence
• Not Detected

Requirement Analysis

Each important job requirement is compared against evidence found in the resume.

The analysis follows:

Job Requirement

↓

Resume Evidence

↓

Match Assessment

↓

Explanation

Gap Analysis

The system identifies missing or weakly supported requirements and prioritizes them according to their relevance to the selected job.

Resume Improvements

The report provides actionable suggestions for improving the resume and better demonstrating relevant skills and experience.

Interview Preparation

The system identifies areas that may require additional preparation based on the job requirements and candidate gaps.

Project Structure

CareerFit/

frontend/

│
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── resumes/
│   │   │   └── page.tsx
│   │   └── jobs/
│   │       └── page.tsx
│   │
│   ├── components/
│   │   ├── AnalysisReport.tsx
│   │   ├── AuthGuard.tsx
│   │   └── Navbar.tsx
│   │
│   └── lib/
│       └── supabase.ts
│
└── ...

backend/

│
├── api/
│   └── routers/
│       ├── resumes.py
│       ├── job_descriptions.py
│       ├── extract.py
│       └── analyze.py
│
├── services/
│   ├── analyzer.py
│   ├── ai_extractor.py
│   ├── ai_explainer.py
│   ├── pdf_parser.py
│   └── matching/
│
├── schemas/
│
├── models/
│
├── core/
│   ├── database.py
│   └── deps.py
│
├── tests/
│   └── test_engine.py
│
├── main.py
└── requirements.txt

supabase/

└── schema.sql

Main Frontend Routes

/
Landing page

/login

Login and signup page

/dashboard

Resume-to-job matching interface

/resumes

Resume upload and management

/jobs

Job description management

Important Frontend Components

AnalysisReport.tsx
Renders the structured resume-to-job analysis report.

AuthGuard.tsx
Protects routes that require authentication.

Navbar.tsx
Provides navigation for authenticated users.

supabase.ts
Initializes the Supabase frontend client.

Backend Structure

The backend uses FastAPI with asynchronous database access.

Api Routers

resumes.py
Handles resume CRUD operations and PDF uploads.

job_descriptions.py
Handles job description CRUD operations.

extract.py
Provides resume and job description extraction endpoints.

analyze.py
Provides resume-to-job analysis endpoints.

Services

analyzer.py
Groq-based structured analysis and report generation.

ai_extractor.py
Resume and job description information extraction.

ai_explainer.py
Legacy explanation generation.

pdf_parser.py
Resume PDF retrieval and text extraction.

matching/
Deterministic skill matching and scoring engine.

Getting Started

Prerequisites

Install the following:

• Python 3.10+
• Node.js
• npm
• Git
• A Supabase project
• A Groq API key

CLONE THE REPOSITORY

git clone <your-repository-url>

cd CareerFit

Replace <your-repository-url> with the actual repository URL.

SET UP SUPABASE

Create a new Supabase project.

Then:

Open the Supabase SQL Editor.

Open supabase/schema.sql from this repository.

Copy its contents into the SQL Editor.

Execute the SQL.

Verify that the required database tables and policies were created.

Verify that the private resumes Storage bucket exists.

Enable email/password authentication.

The schema contains the database tables, Row Level Security policies, storage configuration, and storage access policies required by the application.

SET UP THE BACKEND

Navigate to the backend directory:

cd backend

Create a virtual environment:

python -m venv venv

Windows:

venv\Scripts\activate

macOS / Linux:

source venv/bin/activate

Install dependencies:

pip install -r requirements.txt

CONFIGURE BACKEND ENVIRONMENT VARIABLES

Create:

backend/.env

Add:

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
DATABASE_URL=your_database_url
GROQ_API_KEY=your_groq_api_key

Optional:

SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
HF_TOKEN=your_huggingface_token

Never commit these values to source control.

START THE BACKEND

From the backend directory:

uvicorn main:app --reload

Backend:

http://127.0.0.1:8000

Health check:

http://127.0.0.1:8000/

SET UP THE FRONTEND

Open another terminal.

Navigate to:

cd frontend

Install dependencies:

npm install

Create:

frontend/.env.local

Add:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

Optional:

NEXT_PUBLIC_API_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)

START THE FRONTEND

From the frontend directory:

npm run dev

Frontend:

http://localhost:3000

Open the application at:

http://localhost:3000

The Next.js application uses rewrites to proxy:

/api/v1/*

to:

http://127.0.0.1:8000/api/v1/*

NEXT_PUBLIC_API_URL can be used to override the backend URL.

Environment Variables

Frontend

NEXT_PUBLIC_SUPABASE_URL
Required.

Supabase project URL.

NEXT_PUBLIC_SUPABASE_ANON_KEY
Required.

Supabase anonymous/public key.

NEXT_PUBLIC_API_URL
Optional.

Backend API URL override.

Example:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)

Backend

SUPABASE_URL
Required.

Supabase project URL.

SUPABASE_KEY
Required.

Supabase backend key.

SUPABASE_SERVICE_ROLE_KEY
Optional.

Supabase service-role key for backend operations that require elevated privileges.

DATABASE_URL
Required.

PostgreSQL database connection string.

GROQ_API_KEY
Required.

Groq API key used for AI-powered extraction and analysis.

HF_TOKEN
Optional.

Hugging Face token for handling model download/rate-limit scenarios.

Never commit real credentials or API keys.

Supabase Configuration

CareerFit uses Supabase for three primary responsibilities:

Authentication

↓

Email / Password Authentication

Database

↓

Supabase PostgreSQL

Storage

↓

Private Resume PDFs

Authentication

Users authenticate through Supabase Auth.

The authenticated frontend obtains a Supabase session and sends the access token to FastAPI as a bearer token.

Frontend

↓

Supabase Session

↓

JWT Access Token

↓

FastAPI

↓

Authentication Verification

Resume Storage

Uploaded resumes are stored in a private Supabase Storage bucket.

Resume access is controlled using user-scoped storage policies.

General upload flow:

PDF Resume

↓

Frontend

↓

Base64 Payload

↓

FastAPI

↓

PDF Decoding

↓

Private Supabase Storage

↓

Resume Metadata in Database

Api Overview

Backend base URL:

http://127.0.0.1:8000

HEALTH

GET /

Health check for the FastAPI backend.

RESUMES

GET /api/v1/resumes

List the authenticated user's resumes.

GET /api/v1/resumes/{resume_id}

Retrieve a specific resume.

POST /api/v1/resumes

Upload/create a resume.

DELETE /api/v1/resumes/{resume_id}

Delete a resume.

JOB DESCRIPTIONS

GET /api/v1/jobs

List the authenticated user's job descriptions.

GET /api/v1/jobs/{job_id}

Retrieve a specific job description.

POST /api/v1/jobs

Create a job description.

DELETE /api/v1/jobs/{job_id}

Delete a job description.

EXTRACTION

POST /api/v1/extract/resume/{resume_id}

Extract structured information from a resume.

POST /api/v1/extract/job/{jd_id}

Extract structured requirements from a job description.

ANALYSIS

POST /api/v1/analyze

Analyze a selected resume against a selected job description.

GET /api/v1/analyze/{resume_id}/{jd_id}

Legacy analysis route.

Authentication Flow

CareerFit uses Supabase JWT authentication between the frontend and backend.

The general flow is:

User Login

↓

Supabase Auth

↓

Authenticated Session

↓

Access Token

↓

Frontend API Request

↓

Authorization: Bearer <access_token>

↓

FastAPI Authentication Dependency

↓

Authenticated User

↓

User-Scoped Database / Storage Access

Limits

CareerFit currently supports:

Maximum resumes per user: 5

Maximum job descriptions per user: 5

When a user exceeds either limit, the oldest record is automatically deleted.

Testing

Backend Tests

From the backend directory:

cd backend

pytest

Matching engine tests are located at:

backend/tests/test_engine.py

These tests validate important functionality of the deterministic matching engine.

Frontend Build

From the frontend directory:

cd frontend

npm run build

This verifies that the Next.js application can be compiled successfully.

Frontend Lint

npm run lint

Linting may surface strict TypeScript or React Hook rules depending on the current configuration. These issues should be resolved before production deployment.

Troubleshooting

Backend Cannot Connect To Supabase

Check:

• SUPABASE_URL
• SUPABASE_KEY
• DATABASE_URL
• Supabase project status
• PostgreSQL connection settings

Make sure the backend environment file is located at:

backend/.env

Frontend Authentication Is Not Working

Verify:

NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

Also verify that email/password authentication is enabled in Supabase.

Api Requests Fail From The Frontend

Make sure the FastAPI server is running:

uvicorn main:app --reload

Verify the backend health endpoint:

http://127.0.0.1:8000/

Also check:

• NEXT_PUBLIC_API_URL
• Next.js rewrite configuration
• Backend CORS configuration if applicable

Resume Upload Fails

Check:

• The uploaded file is a valid PDF.
• The resumes Storage bucket exists.
• The bucket is private.
• Storage policies allow authenticated users to access their own files.
• Supabase credentials are configured correctly.

Ai Analysis Fails

Check:

GROQ_API_KEY=your_groq_api_key

Also verify that the configured Groq model is available to the API account.

Hugging Face Model Issues

The semantic matching model:

all-MiniLM-L6-v2

may need to be downloaded when first used.

If Hugging Face rate limits become an issue, configure:

HF_TOKEN=your_huggingface_token

Security Notes

CareerFit processes potentially sensitive documents. Production deployments should apply appropriate security controls.

Secrets

Never commit:

• .env
• .env.local
• API keys
• Supabase service-role keys
• Database credentials
• JWT secrets
• Other private credentials

Use environment variables or a secure secret-management solution.

Resume Storage

Uploaded resumes are stored in a private Supabase Storage bucket.

Access should remain user-scoped through Supabase Storage policies.

Authentication

Protected backend requests use Supabase JWT bearer tokens:

Authorization: Bearer <access_token>

The backend should verify the authenticated user before accessing or modifying user-owned resources.

Service-Role Key

The Supabase service-role key has elevated privileges.

It must never be exposed to the browser or included in frontend environment variables.

It should only be used on trusted backend infrastructure when necessary.

Production Considerations

Before production deployment, consider adding:

• API rate limiting
• File-size limits
• Stronger file/MIME validation
• PDF validation
• AI request quotas
• Secure CORS configuration
• Centralized secret management
• Logging and monitoring
• Error sanitization
• Additional authorization tests
• Production database configuration
• Background processing for large AI/document operations

Development Flow

A typical CareerFit analysis follows:

User
↓

Select Resume

↓

Select Job Description

↓

Next.js Frontend

↓

FastAPI API

↓

Retrieve Resume + Job Data

↓

Extract / Parse Content

↓

AI Analysis

↓

Semantic Skill Matching

↓

Requirement-Level Evaluation

↓

Structured Scoring

↓

Explainability Layer

↓

Analysis Report

↓

User Dashboard

Roadmap

Potential future improvements include:

• More granular explanations for individual matches
• Required vs. preferred requirement weighting
• Confidence scores for semantic matches
• Requirement-to-resume evidence linking
• ATS keyword coverage analysis
• Resume quality scoring independent of job fit
• Resume rewriting suggestions
• Job-specific resume optimization
• Interview question generation based on identified gaps
• Skill-gap learning recommendations
• Multiple resume versions for different roles
• Analysis history and comparison
• Background processing for AI/document operations
• Expanded automated test coverage
• Production deployment
• Improved observability and monitoring

License

This project is currently provided for development and educational purposes.

If an open-source license is added to the repository, replace this section with the corresponding license information.

Do not claim an open-source license until an actual license file has been added to the repository.

Quick Start

Backend:

cd backend

python -m venv venv

Windows:

venv\Scripts\activate

macOS/Linux:

source venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload

Frontend:

cd frontend

npm install

npm run dev

Application:

http://localhost:3000

Backend:

http://127.0.0.1:8000

Run backend tests:

cd backend

pytest

Build frontend:

cd frontend
npm run build

Run frontend lint:

npm run lint

CareerFit

Resume-to-job matching powered by AI, semantic matching, and explainable analysis.
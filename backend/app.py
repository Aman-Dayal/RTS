from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.job_posting import router as job_posting_router
from routes.candidate import router as candidate_router
from routes.interview import router as interview_router
from routes.user import router as user_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change "*" to frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(user_router, prefix="/api", tags=["Authentication"])
app.include_router(job_posting_router, prefix="/api", tags=["Job Postings"])
app.include_router(candidate_router, prefix="/api", tags=["Candidates"])
app.include_router(interview_router, prefix="/api", tags=["Interviews"])


@app.get("/", tags=["root"])
def read_root():
    return {"message": "Welcome to the Recruitment Tracking System API!"}

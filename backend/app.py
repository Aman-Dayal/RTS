from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from routes.job_posting import router as job_posting_router
from routes.candidate import router as candidate_router
from routes.interview import router as interview_router
from routes.user import router as user_router
from routes.notification import router as notification_router
from routes.summary import router as summary_router
from common.security import get_current_user

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["GET","PUT","POST","DELETE"],
    allow_headers=["*"],
)
app.include_router(user_router, prefix="/api", tags=["Authentication"])
app.include_router(job_posting_router, prefix="/api", tags=["Job Postings"], dependencies=[Depends(get_current_user)])
app.include_router(candidate_router, prefix="/api", tags=["Candidates"], dependencies=[Depends(get_current_user)])
app.include_router(interview_router, prefix="/api", tags=["Interviews"], dependencies=[Depends(get_current_user)])
app.include_router(notification_router, prefix="/api", tags=["Notifications"], dependencies=[Depends(get_current_user)])
app.include_router(summary_router, prefix="/api", tags=["Summary"], dependencies=[Depends(get_current_user)])


@app.get("/", tags=["root"])
def read_root():
    return {"message": "Welcome to the Recruitment Tracking System API!"}

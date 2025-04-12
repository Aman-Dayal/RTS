import pytest
from schemas.interview import InterviewBase

def test_interview_schema():
    data = {
        "candidate_id": 1,
        "interviewer_id": 2,
        "date": "2023-10-01T10:00:00Z",
        "status": "scheduled"
    }
    schema = InterviewBase(**data)
    assert schema.candidate_id == 1
    assert schema.interviewer_id == 2
    assert schema.status == "scheduled"


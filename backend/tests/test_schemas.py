import pytest
from schemas.interview import InterviewSchema  # Adjust the import as necessary

def test_interview_schema():
    data = {
        "candidate_id": 1,
        "interviewer_id": 2,
        "date": "2023-10-01T10:00:00Z",
        "status": "scheduled"
    }
    schema = InterviewSchema(**data)
    assert schema.candidate_id == 1
    assert schema.interviewer_id == 2
    assert schema.status == "scheduled"

# Add more tests for other schemas as needed

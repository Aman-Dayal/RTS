import pytest
from fastapi.testclient import TestClient
from app import app  # Changed to absolute import
from sqlalchemy.orm import Session
from database.db import get_session

client = TestClient(app)

@pytest.fixture
def db_session():
    """Create a new database session for a test."""
    session = next(get_session())
    yield session
    session.close()

# User tests
def test_register_user(db_session):
    """Test user registration."""
    response = client.post("/register", json={"email": "test@example.com", "password": "password123"})
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"

# Candidate tests
def test_create_candidate(db_session):
    """Test creating a new candidate."""
    response = client.post("/candidates/", json={"email": "candidate@example.com", "name": "John Doe"})
    assert response.status_code == 200
    assert response.json()["email"] == "candidate@example.com"

def test_create_candidate_email_exists(db_session):
    """Test creating a candidate with an existing email."""
    client.post("/candidates/", json={"email": "candidate@example.com", "name": "John Doe"})
    response = client.post("/candidates/", json={"email": "candidate@example.com", "name": "Jane Doe"})
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already exists!"

def test_get_candidates(db_session):
    """Test retrieving candidates."""
    client.post("/candidates/", json={"email": "candidate@example.com", "name": "John Doe"})
    response = client.get("/candidates/")
    assert response.status_code == 200
    assert len(response.json()) > 0  # Ensure at least one candidate is returned

def test_get_candidate_by_id(db_session):
    """Test retrieving a candidate by ID."""
    create_response = client.post("/candidates/", json={"email": "candidate@example.com", "name": "John Doe"})
    candidate_id = create_response.json()["id"]
    response = client.get(f"/candidates/{candidate_id}")
    assert response.status_code == 200
    assert response.json()["email"] == "candidate@example.com"

def test_update_candidate(db_session):
    """Test updating a candidate."""
    create_response = client.post("/candidates/", json={"email": "candidate@example.com", "name": "John Doe"})
    candidate_id = create_response.json()["id"]
    response = client.put(f"/candidates/{candidate_id}", json={"name": "John Smith"})
    assert response.status_code == 200
    assert response.json()["name"] == "John Smith"

def test_delete_candidate(db_session):
    """Test deleting a candidate."""
    create_response = client.post("/candidates/", json={"email": "candidate@example.com", "name": "John Doe"})
    candidate_id = create_response.json()["id"]
    response = client.delete(f"/candidates/{candidate_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Candidate deleted successfully"

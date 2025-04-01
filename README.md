# Recruitment Tracking System

## Introduction
The Recruitment Tracking System is a web application designed to streamline the recruitment process. It allows users to manage job postings, track candidates, schedule interviews, and make better hiring decisions—all in one platform.

## Features

### Frontend Features
- **User Authentication**: Users can register and log in to access the system.
- **Dashboard**: Displays key statistics such as active jobs, total candidates, and upcoming interviews.
- **Job Postings**: Create, manage, and track job openings.
- **Applicant Tracking**: Organize candidates and track their progress through the recruitment pipeline.
- **Interview Scheduling**: Schedule and manage interviews with integrated calendar notifications.

### Backend Features
- **API Endpoints**: The backend provides a RESTful API for managing users, job postings, candidates, and interviews.
- **JWT Authentication**: Secure user authentication using JSON Web Tokens.
- **Database Integration**: Uses SQLAlchemy for database interactions.

## API Endpoints

### Authentication
- **POST** `/api/register`: Register a new user.
- **POST** `/api/login`: User login.
- **GET** `/api/status`: Check the status of the logged-in user.
- **POST** `/api/logout`: User logout.

### Job Postings
- **POST** `/api/job_postings/`: Create a new job posting.
- **GET** `/api/job_postings/{id}`: Get details of a job posting by ID.
- **GET** `/api/job_postings/`: Get a list of all job postings.
- **PUT** `/api/job_postings/{id}`: Update a job posting by ID.
- **DELETE** `/api/job_postings/{id}`: Delete a job posting by ID.

### Candidates
- **POST** `/api/candidates/`: Add a new candidate.
- **GET** `/api/candidates/{id}`: Get details of a candidate by ID.
- **GET** `/api/candidates/`: Get a list of all candidates.
- **PUT** `/api/candidates/{id}`: Update a candidate by ID.
- **DELETE** `/api/candidates/{id}`: Delete a candidate by ID.

### Interviews
- **POST** `/api/interviews/`: Schedule a new interview.
- **GET** `/api/interviews/{id}`: Get details of an interview by ID.
- **GET** `/api/interviews/`: Get a list of all interviews.
- **PUT** `/api/interviews/{id}`: Update an interview by ID.
- **DELETE** `/api/interviews/{id}`: Cancel an interview.

## Installation
1. Clone the repository.
2. Navigate to the backend directory and install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Navigate to the rts-app directory and install frontend dependencies:
   ```bash
   npm install
   ```

## Usage
- To run the backend server:
  ```bash
  uvicorn app:app --reload
  ```
- To run the frontend application:
  ```bash
  npm run dev
  ```


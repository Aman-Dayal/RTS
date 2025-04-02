export const candidateFields = [
    { name: "name", label: "Full Name", type: "input", placeholder: "e.g. Aman Dayal", rules: [{ required: true, message: "Please enter candidate name" }] },
    { name: "email", label: "Email", type: "input", placeholder: "e.g. john.doe@example.com", rules: [{ required: true, message: "Please enter email" }, { type: "email", message: "Please enter a valid email" }] },
    { name: "phone", label: "Phone", type: "input", placeholder: "e.g. (555) 123-4567", rules: [{ required: true, message: "Please enter phone number" }] },
    { name: "applied_position", label: "Applied Position", type: "select", placeholder: "Select position", options: ["Frontend Developer", "Backend Developer", "UX Designer", "Product Manager", "Marketing Specialist", "Sales Representative"], rules: [{ required: true, message: "Please select position" }] },
    { name: "status", label: "Status", type: "select", placeholder: "Select status", options: ["Applied", "Screening", "Interview", "Offer", "Rejected"], rules: [{ required: true, message: "Please select status" }] },
    { name: "resume", label: "Resume/CV", type: "upload" },
    { name: "notes", label: "Notes", type: "textarea", placeholder: "Add notes about the candidate" },
  ];
  
  export const jobFields = [
    { name: "title", label: "Job Title", type: "input", placeholder: "e.g. Software Engineer", rules: [{ required: true, message: "Please enter job title" }] },
    { name: "department", label: "Department", type: "input", placeholder: "e.g. Engineering", rules: [{ required: true, message: "Please enter department" }] },
    { name: "location", label: "Location", type: "input", placeholder: "e.g. Remote or Onsite" },
    { name: "salary", label: "Salary Range", type: "input", placeholder: "e.g. $50,000 - $70,000" },
    { name: "description", label: "Job Description", type: "textarea", placeholder: "Describe the job role and responsibilities" },
  ];
  
  export const interviewFields = [
    { name: "candidate", label: "Candidate Name", type: "input", placeholder: "e.g. Aman Dayal", rules: [{ required: true, message: "Please enter candidate name" }] },
    { name: "interviewer", label: "Interviewer", type: "input", placeholder: "e.g. John Doe", rules: [{ required: true, message: "Please enter interviewer name" }] },
    { name: "date", label: "Date", type: "input", placeholder: "YYYY-MM-DD", rules: [{ required: true, message: "Please enter interview date" }] },
    { name: "time", label: "Time", type: "input", placeholder: "e.g. 10:00 AM", rules: [{ required: true, message: "Please enter interview time" }] },
    { name: "status", label: "Status", type: "select", placeholder: "Select interview status", options: ["Scheduled", "Completed", "Cancelled"], rules: [{ required: true, message: "Please select interview status" }] },
    { name: "notes", label: "Notes", type: "textarea", placeholder: "Add any additional notes" },
  ];
  
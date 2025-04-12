import { 
  FileSearchOutlined,
  CheckCircleOutlined,
  UserOutlined, 
  UserAddOutlined,
  FileAddOutlined,
  ScheduleOutlined,
  ClockCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons';

export const candidateFields = [
    { name: "name", label: "Full Name", type: "input", placeholder: "e.g. Aman Dayal", rules: [{ required: true, message: "Please enter candidate name" }] },
    { name: "email", label: "Email", type: "input", placeholder: "e.g. john.doe@example.com", rules: [{ required: true, message: "Please enter email" }, { type: "email", message: "Please enter a valid email" }] },
    { name: "phone", label: "Phone", type: "input", placeholder: "e.g. 998877445", rules: [{ required: true, message: "Please enter phone number" },
      { pattern: /^\d{10}$/, message: "Please enter a valid 10 digit mobile number"}
    ]},
    { name: "job_title", label: "Applied Position", type: "dynamic_select", placeholder: "Select position", rules: [{ required: true, message: "Please select position" }] },
    { name: "status", label: "Status", type: "select", placeholder: "Select status", options: ["Applied", "Screening", "Interview", "Offer", "Rejected"], rules: [{ required: true, message: "Please select status" }] },
    { name: "resume", label: "Resume/CV", type: "upload" },
    { name: "notes", label: "Notes", type: "textarea", placeholder: "Add notes about the candidate" },
  ];
  
export const jobFields = [
    { name: "title", label: "Job Title", type: "input", placeholder: "e.g. Software Engineer", rules: [{ required: true, message: "Please enter job title" }] },
    { name: "department", label: "Department", type: "select", placeholder: "Select Department ", options:["Engineering","Management","Marketing","Sales","Human Resources"] , rules: [{ required: true, message: "Please enter department" }]},
    { name: "employment_type", label: "Employment Type", type: "select", placeholder: "Choose employment type", options:["Full Time", "Contract", "Part Time"], rules: [{ required: true, message: "Please select employment type" }] },
    { name: "required_skills", label: "Required Skills", type: "tags", placeholder: "Type skill and press enter" },
    { name: "description", label: "Job Description", type: "textarea", placeholder: "Describe the job role and responsibilities" },
  ];
  
export const interviewFields = [
    { name: "candidate_id", label: "Candidate Name", type: "dynamic_select", placeholder: "e.g. Aman Dayal", rules: [{ required: true, message: "Please enter candidate name" }] },
    { name: "job_id", label: "Applied Position", type: "dynamic_select", placeholder: "Select position", rules: [{ required: true, message: "Please select position" }] },
    { name: "interviewer_id", label: "Interviewer", type: "dynamic_select", placeholder: "e.g. John Doe", rules: [{ required: true, message: "Please enter interviewer name" }] },
    { name: "date", label: "Date", type: "date", placeholder: "YYYY-MM-DD", rules: [{ required: true, message: "Please enter interview date" }] },
    { name: "time", label: "Time", type: "time", placeholder: "e.g. 10:00 AM", rules: [{ required: true, message: "Please enter interview time" }] },
    { name: "status", label: "Status", type: "select", placeholder: "Select interview status", options: ["Scheduled", "Completed", "Cancelled"], rules: [{ required: true, message: "Please select interview status" }] },
    { name: "notes", label: "Notes", type: "textarea", placeholder: "Add any additional notes" },
  ];

export const statsData = [
    { title: "Positions Filled", value: 5 },
    { title: "Interviews Scheduled", value: 12 },
    { title: "New Applications", value: 20 },
    { title: "Pending Approvals", value: 8 }
  ];
  
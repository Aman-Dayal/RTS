import React, { useEffect, useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import { Card, DatePicker, Typography, Button, Input } from "antd";
import SideBar from "../components/SideBar";
import Layout from "antd/es/layout/layout";
// import moment from "moment";

const { Text } = Typography;
const ItemType = "CANDIDATE";
const { TextArea } = Input;

const getDaysAgo = (timestamp) => {
  const appliedDate = new Date(timestamp);
  const currentDate = new Date();
  const diffTime = currentDate - appliedDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
};

const CandidateCard = ({ candidate }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { id: candidate.id, status: candidate.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [interviewDate, setInterviewDate] = useState(candidate.interview_date || null);
  const [feedback, setFeedback] = useState(candidate.feedback || "");

  const handleSchedule = (date) => {
    setInterviewDate(date);
    updateCandidate(candidate.id, { interview_date: date });
  };

  const handleSaveFeedback = () => {
    updateCandidate(candidate.id, { feedback });
  };

  return (
    <Card
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        margin: "12px 0",
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        padding: "12px",
        transition: "transform 0.2s ease-in-out",
      }}
    >
      <div style={{ fontSize: "16px", fontWeight: "bold" }}>
        <Text strong>{candidate.name}</Text>
      </div>
      <div>
        <Text type="secondary">🕝 {getDaysAgo(candidate.updated_at)}</Text>
      </div>
      <div style={{display:'flex',flexDirection:'column', fontSize:'14px',marginTop:'6px'}}>
        <Text>Contact: {candidate.phone}</Text>
        <Text>Email: {candidate.email}</Text>
        <Text>Job: {candidate.applied_position}</Text>
      </div>

      {candidate.status === "Screening" && (
        <>
          <Text type="secondary">Interview Date:</Text>
          <DatePicker
            value={interviewDate ? interviewDate : null}
            onChange={(date, dateString) => handleSchedule(dateString)}
          />
        </>
      )}
      {candidate.status === "Interview Scheduled" && (
        <>
          <Text type="secondary">Interview Feedback:</Text>
          <TextArea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={2}
          />
          <Button type="primary" onClick={handleSaveFeedback} style={{ marginTop: "8px" }}>
            Save Feedback
          </Button>
        </>
      )}
    </Card>
  );
};

const KanbanColumn = ({ stage, candidates, moveCandidate, color }) => {
  const [, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item) => moveCandidate(item.id, item.status, stage),
  }));

  return (
    <div
      ref={drop}
      style={{
        flex: 1,
        minWidth: "250px",
        background: "#ffffff",
        borderRadius: "8px",
        padding: "16px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderTop: `4px solid ${color}`,
      }}
    >
      <h3 style={{
        fontSize: "16px",
        borderRadius: "8px",
        fontWeight: "bold",
        padding: "8px",
        backgroundColor: color,
        color: "white",
        textAlign: "center",
      }}>
        {stage} ({candidates.length})
      </h3>
      {candidates.map((candidate) => (
        <CandidateCard key={candidate.id} candidate={candidate} />
      ))}
    </div>
  );
};

const KanbanBoard = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    axios.get("/api/candidates/").then((response) => {
      setCandidates(response.data);
    });
  }, []);

  const moveCandidate = (id, fromStage, toStage) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === id ? { ...candidate, status: toStage } : candidate
      )
    );
  };

  const stages = [
    { name: "Applied", color: "#e91e63" },
    { name: "Screening", color: "#ff4081" },
    { name: "Interview Scheduled", color: "#9c27b0" },
    { name: "Offer Extended", color: "#00FF00" },
    { name: "Rejected", color: "#FF0000" },
  ];

  return (
    <Layout>
      <SideBar />
      <DndProvider backend={HTML5Backend}>
        <div
          style={{
            display: "flex",
            gap: "16px",
            padding: "16px",
            overflowX: "auto",
            background: "#f4f4f4",
          }}
        >
          {stages.map(({ name, color }) => (
            <KanbanColumn
              key={name}
              stage={name}
              color={color}
              candidates={candidates.filter((c) => c.status === name)}
              moveCandidate={moveCandidate}
            />
          ))}
        </div>
      </DndProvider>
    </Layout>
  );
};

export default KanbanBoard;

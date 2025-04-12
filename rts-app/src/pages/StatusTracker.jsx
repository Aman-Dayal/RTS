import React, { useEffect, useState, useCallback } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import { Card, DatePicker, Typography, Button, Input, Spin, Select, Row} from "antd";
import SideBar from "../components/SideBar";
import Layout from "antd/es/layout/layout";
import { getFormattedDateTime } from '../utils/helpers';
const { Text } = Typography;
const ItemType = "CANDIDATE";
const { TextArea } = Input;

const CandidateCard = ({ candidate }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { id: candidate.id, status: candidate.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // const handleSchedule = (date) => {
  //   setInterviewDate(date);
  //   updateCandidate(candidate.id, { interview_date: date });
  // };

  // const handleSaveFeedback = () => {
  //   updateCandidate(candidate.id, { feedback });
  // };

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
        <Text type="secondary">🕝 {getFormattedDateTime(candidate.updated_at)}</Text>
      </div>
      <div style={{display:'flex',flexDirection:'column', fontSize:'14px',marginTop:'6px'}}>
        <Text>Contact: {candidate.phone}</Text>
        <Text>Email: {candidate.email}</Text>
        <Text>Job: {candidate.job_title}</Text>
      </div>

      
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [jobOptions, setJobOptions] = useState([]);
  function extractUniqueJobInfo(data) {
    const uniqueJobs = new Map();    
    for (const item of data) {
      if (!uniqueJobs.has(item.job_id)) {
        uniqueJobs.set(item.job_id, item.job_title);
      }
    }    
    return Array.from(uniqueJobs).map(([job_id, job_title]) => ({ value : job_id, label : job_title }));
  }
  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/candidates/", {withCredentials:true});
        setCandidates(response.data);
        const uniqueJobs = extractUniqueJobInfo(response.data);
        console.log(response.data,uniqueJobs);
        setJobOptions(uniqueJobs);
        setError(null);
      } catch (err) {
        setError("Failed to load candidates. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCandidates();
  }, []);

  const updateQueue = new Map();

  const moveCandidate = useCallback((id, fromStage, toStage) => {
    if (fromStage === toStage) return;
  
    setCandidates(prev => 
      prev.map(candidate =>
        candidate.id === id ? { ...candidate, status: toStage } : candidate
      )
    );
  
    if (updateQueue.has(id)) {
      clearTimeout(updateQueue.get(id));
    }
  
    const timer = setTimeout( async () => {
      await axios.put(`/api/candidates/${id}`, { status: toStage }, {withCredentials:true})
        .then(response => {
          setCandidates(prev => 
            prev.map(candidate =>
              candidate.id === id ? { ...candidate, ...response.data } : candidate
            )
          );
        })
        .catch(error => {
          alert("Failed to update candidate status. Please try again.");
          
          setCandidates(prev => 
            prev.map(candidate =>
              candidate.id === id ? { ...candidate, status: fromStage } : candidate
            )
          );
        })
        .finally(() => {
          updateQueue.delete(id);
        });
    }, 3000);
  
    updateQueue.set(id, timer);
  }, []);
  

  const stages = [
    { name: "Applied", color: "#e91e63" },
    { name: "Screening", color: "#ff4081" },
    { name: "Interview Scheduled", color: "#9c27b0" },
    { name: "Offer Extended", color: "#00FF00" },
    { name: "Rejected", color: "#FF0000" },
  ];


  if (error) return <div>{error}</div>;

  return (
    <>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <Layout>
          <SideBar />
          <Layout.Content style={{ width: "100%", overflow: "hidden" }}>         
          <div style={{ display: "flex",flexDirection:"column",}}>
          <div style={{ display: "flex", gap: "16px",padding: "16px" }}>
            <Select
              style={{ minWidth: "200px" }}
              placeholder="Filter by Job"
              showSearch
              allowClear
              value={selectedJobId}
              onChange={(value) => setSelectedJobId(value)}
              options={jobOptions}
              optionFilterProp="label"
            />
            <Button onClick={() => setSelectedJobId(null)}>Clear Filter</Button>
          </div>
          <DndProvider backend={HTML5Backend}>
            <div
              style={{
                display: "flex",
                gap: "16px",
                padding: "16px",
                overflowX: "auto",
                background: "#f4f4f4",
                width: "100%",
              }}
            >
              {stages.map(({ name, color }) => (
                <KanbanColumn
                  key={name}
                  stage={name}
                  color={color}
                  candidates={candidates.filter((c) => c.status === name &&
                  (selectedJobId === null || c.job_id === selectedJobId))}
                  moveCandidate={moveCandidate}
                />
              ))}
            </div>
          </DndProvider>
          </div>
          </Layout.Content>
        </Layout>
      )}
    </>
  );
}

export default KanbanBoard;
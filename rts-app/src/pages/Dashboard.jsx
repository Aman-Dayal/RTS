import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Menu, 
  Button, 
  Row, 
  Col, 
  Card, 
  Statistic, 
  List, 
  Tag, 
  Form, 
  Avatar,
} from 'antd';
import { 
  FileSearchOutlined,
  CheckCircleOutlined,
  UserOutlined, 
  ScheduleOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { getFormattedDateTime  } from '../utils/helpers';
import { Link } from 'react-router-dom';
import SideBar from '../components/SideBar';
import BaseForm from '../components/BaseForm';
import { candidateFields } from '../constants/formFields';
const {  Content } = Layout;

const upcomingInterviews = [
  { id: 1, candidate: 'John Doe', position: 'Frontend Developer', time: '2023-06-01 10:00', interviewer: 'Sarah Manager' },
  { id: 2, candidate: 'Lisa Wong', position: 'Marketing Specialist', time: '2023-06-01 14:30', interviewer: 'Mike Director' },
  { id: 3, candidate: 'Robert Chen', position: 'Data Analyst', time: '2023-06-02 11:00', interviewer: 'David Lead' },
];

const Dashboard = () => {
  const [form] = Form.useForm();

  const [summary, setSummary] = useState([]);
  const [recentCandidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);

  useEffect(() => {
    axios
      .get("/api/dashboard/summary")
      .then((response) => {
        setSummary(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching dashboard summary:", error);
        setError("Failed to load dashboard data.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get("/api/candidatesv2/", {
          params: { sort_by: "created_at", order: "desc", limit: 5,},
        });
        console.log(response.data);
        setCandidates(response.data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };
    fetchCandidates();
  }, []);

  const handleCancel = () => {
    console.log("Closing modal");
    setIsModalOpen(false);
    setEditingCandidate(null);
    form.resetFields();
  };
  const handleAddCandidate = async () => {
    try {
      setLoading(true);
      const { notes, resume, applied_position, ...formData }= form.getFieldsValue(); // Get all form values
      console.log(formData);
      const response = await axios.post("/api/candidates", formData);
      console.log("Response:", response.data);
      // message.success("Candidate created successfully!");

      form.resetFields(); // Clear form after successful submission
    } catch (error) {
      console.error("Error creating profile:", error);
      setError("Failed to create profile.");
      // message.error("Error creating candidate.");
    } finally {
      setLoading(false);
    }
  };
  const onAdd = () => {
    console.log('add button clicked');
    };
  const addCandidate = () => {
    setIsModalOpen(true);
    };
  const onDelete = () => {
    console.log('delete button clicked');
    };
  const onView = () => {
    console.log('delete button clicked');
    };


  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'blue';
      case 'Screening': return 'purple';
      case 'Interview': return 'orange';
      case 'Offer': return 'green';
      case 'Rejected': return 'red';
      default: return 'default';
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', width:'100vw' }}>
      <SideBar/>
        <div>
        <Content style={{ padding: '1.5rem', width:'80vw'}}>
          <Row gutter={[16, 16]} style={{ marginBottom: '1.5rem' }}>
            <Col xs={24} sm={12} md={6} style={{ marginBottom: '1.5rem' }}>
              <Card>
                <Statistic 
                  title="Active Jobs" 
                  value={summary.total_jobs} 
                  prefix={<FileSearchOutlined />} 
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6} style={{ marginBottom: '1.5rem' }}>
              <Card>
                <Statistic 
                  title="Total Candidates" 
                  value={summary.total_candidates} 
                  prefix={<UserOutlined />} 
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6} style={{ marginBottom: '1.5rem' }}>
              <Card>
                <Statistic 
                  title="Interviews This Week" 
                  value={summary.total_interviews_this_week} 
                  prefix={<ScheduleOutlined />} 
                />
              </Card>
            </Col>
            
            <Col xs={24} sm={12} md={6} style={{ marginBottom: '1.5rem' }}>
              <Card>
                <Statistic 
                  title="Positions Filled" 
                  value={5} 
                  prefix={<CheckCircleOutlined />} 
                />
              </Card>
            </Col>
          </Row>
          <Card 
          title={<div style={{ textAlign: 'center' }}>Actions</div>}
          style={{ 
          padding: "16px", 
          marginBottom: "50px",
          borderRadius: "8px", 
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)" 
        }}
      >
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} md={6}>
          <Button type="primary" block onClick={onAdd}>
            Post New Job
          </Button>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Button type="default" block onClick={addCandidate}>
            Add Candidate
          </Button>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Button type="dashed" danger block onClick={onDelete}>
            Schedule Interview
          </Button>
        </Col>
        {/* <Col xs={24} sm={12} md={6}>
          <Button type="link" block onClick={onView}>
            View
          </Button>
        </Col> */}
      </Row>
    </Card>
          <Row gutter={16}>
            <Col xs={24} lg={12} style={{ marginBottom: '1.5rem' }}>
              <Card 
                title="Recent Candidates" 
                extra={<Link to="/candidates">View All</Link>}
              >
                <List
                  dataSource={recentCandidates}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        title={<a href={`/candidates/${item.id}`}>{item.name}</a>}
                        description={getFormattedDateTime(item.created_at)}
                      />
                      <Tag color={getStatusColor(item.status)}>{item.status}</Tag>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12} style={{ marginBottom: '1.5rem' }}>
              <Card 
                title="Upcoming Interviews" 
                extra={<Link to="/interviews">View All</Link>}
              >
                <List
                  dataSource={upcomingInterviews}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        title={<a href={`/interviews/${item.id}`}>{item.candidate}</a>}
                        description={
                          <>
                            <div>{item.position}</div>
                            <div>{new Date(item.time).toLocaleString()}</div>
                            <div>Interviewer: {item.interviewer}</div>
                          </>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </Content>
        </div>
        <BaseForm
      isOpen={isModalOpen}
      onCancel={handleCancel}
      onSubmit={handleAddCandidate}
      form={form}
      title="Add New Candidate"
      editing={false}
      fields={candidateFields}
  />
      </Layout>
  );
};

export default Dashboard;

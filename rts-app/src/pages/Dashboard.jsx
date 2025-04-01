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
  Typography, 
  Avatar,
} from 'antd';
import { 
  FileSearchOutlined,
  CheckCircleOutlined,
  UserOutlined, 
  ScheduleOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { getDaysAgo } from '../utils/helpers';
import { Link, useLocation } from 'react-router-dom';
import SideBar from '../components/SideBar';
const {  Content } = Layout;
const { Title } = Typography;

const upcomingInterviews = [
  { id: 1, candidate: 'John Doe', position: 'Frontend Developer', time: '2023-06-01 10:00', interviewer: 'Sarah Manager' },
  { id: 2, candidate: 'Lisa Wong', position: 'Marketing Specialist', time: '2023-06-01 14:30', interviewer: 'Mike Director' },
  { id: 3, candidate: 'Robert Chen', position: 'Data Analyst', time: '2023-06-02 11:00', interviewer: 'David Lead' },
];

const Dashboard = () => {
  const [recentCandidates, setCandidates] = useState([]);
  useEffect(() => {
    const fetchCandidates = async () => {
      // setLoading(true);
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

  const onAdd = () => {
    console.log('add button clicked');
    };
  const onEdit = () => {
    console.log('edit button clicked');
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
                  value={12} 
                  prefix={<FileSearchOutlined />} 
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6} style={{ marginBottom: '1.5rem' }}>
              <Card>
                <Statistic 
                  title="Total Candidates" 
                  value={148} 
                  prefix={<UserOutlined />} 
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6} style={{ marginBottom: '1.5rem' }}>
              <Card>
                <Statistic 
                  title="Interviews This Week" 
                  value={8} 
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
          <Button type="default" block onClick={onEdit}>
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
                        description={getDaysAgo(item.created_at)}
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
      </Layout>
  );
};

export default Dashboard;

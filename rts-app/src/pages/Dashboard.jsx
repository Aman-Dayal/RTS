import React, { useState, useEffect } from 'react';
import { 
  Layout,
  Radio,
  Menu, 
  Button, 
  Typography,
  Row, 
  Col, 
  Card, 
  Statistic, 
  List, 
  Tag, 
  Spin, 
  Avatar,
} from 'antd';
import { Bar, Pie, Column} from "@ant-design/plots";
import axios from 'axios';
import { getFormattedDateTime  } from '../utils/helpers';
import { Link } from 'react-router-dom';
import SideBar from '../components/SideBar';
import { candidateFields, interviewFields, jobFields, statsData } from '../constants/formData';
const {  Content } = Layout;
const { Title } = Typography;


function CandidateDistribution({ jobsData }) {
  const [chartType, setChartType] = useState('horizontal');
  const columnConfig = {
    data:jobsData,
    xField: 'job',
    yField: 'candidates',
    label: {
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: true,
      },
    },
    meta: {
      job: {
        alias: 'Job Position',
      },
      candidates: {
        alias: 'Number of Candidates',
      },
    },
    color: '#1890ff',
    width: Math.max(320, jobsData.length * 20),  

    scrollbar: {
      type: 'horizontal',
    },
  };

  const barConfig = {
    data:jobsData,
    yField: 'candidates',
    xField: 'job',
    label: {
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    autoFit: true,
    height: Math.max(320, jobsData.length * 20),  
    scrollbar: {
      type: 'vertical',
    },
    meta: {
      job: {
        alias: 'Job Position',
      },
      candidates: {
        alias: 'Number of Candidates',
      },
    },
    color: '#1890ff',
    // maxBarWidth: 50,
    barStyle: {
      radius: [2, 2, 0, 0],
    },
    legend: false,
  
  };

  const cardStyle = {
    width: '100%',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    marginBottom:'2.5rem',
  };

  const containerStyle = {
    display: 'flex', 
    flexDirection: 'column', 
    gap: '16px'
  };

  const headerStyle = {
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  };

  const chartContainerStyle = {
    height: '260px',
    overflow: 'auto', // Enable scrolling
    // position: 'relative'
  };

  const titleStyle = {
    margin: 0
  };

  return (
    <Card style={cardStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <Title level={4} style={titleStyle}>Candidates per Job Position</Title>
          <Radio.Group 
            value={chartType} 
            onChange={(e) => setChartType(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="horizontal">Horizontal</Radio.Button>
            <Radio.Button value="vertical">Vertical</Radio.Button>
          </Radio.Group>
        </div>
        
        <div style={chartContainerStyle}>
          {chartType === 'horizontal' ? (
            <Bar {...barConfig} />
          ) : (
            <Column {...columnConfig} />
          )}
        </div>
      </div>
    </Card>
  );
}

const Dashboard = () => {

  const [summary, setSummary] = useState([]);
  const [recentCandidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    axios
      .get("/api/dashboard/summary", { withCredentials: true })
      .then((response) => {
        setSummary(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to load dashboard data.");
        setLoading(false);
      });
  }, []);

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

  const StatisticCard = ({ value, title }) => (
    <Col xs={24} sm={12} md={6} lg={6} style={{ marginBottom: '1.5rem' }}>
      <Card style={{ textAlign: 'center'}}>
        <Statistic 
          value={value} 
          valueStyle={{ fontSize: '2.5rem' }} 
        />
        <div style={{ marginTop: '1rem', fontSize: '1rem', fontWeight: 'bold' }}>
          {title}
        </div>
      </Card>
    </Col>
  );
  

  return (
    <Layout style={{ minHeight: '100vh', width:'100vw' }}>
      <SideBar/>

        <div>
        <Content style={{ padding: '1.5rem', width:'80vw'}}>
          <Row gutter={[16, 16]}>
          {summary?.top_level?.length > 0 && summary.top_level.map((stat, index) => (
            <StatisticCard key={index} {...stat} />
            ))}
          </Row>
          <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={16} lg={8}>
          <Card title={<div style={{ textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', }}
            >Job Status</div>} style={{width:"100%", marginBottom:'1.5rem'}} >
          {summary?.status_summary?.length > 0 ? (
          <Pie
            data={summary.status_summary}
            angleField="value"
            colorField="type"
            innerRadius={0.6}
            height={250}
            label={{
              type: 'inner',
              offset: '-30%',
              content: '{value}',
              style: {
                fontSize: 14,
                textAlign: 'center',
              },
            }}
            legend={{
              color: {
                title: false,
                position: "right",
              },
            }}
          />
          ) : (
            <Spin />
          )}
        </Card>
          </Col>
          <Col xs={24} sm={24} md={10} lg={16}>
          {summary?.candidates_per_job?.length > 0 ? (

          <CandidateDistribution jobsData={summary.candidates_per_job}/>
          ):(<div>
            <Spin />
            </div>
          )}
          </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} lg={12} style={{ marginBottom: '1.5rem' }}>
              <Card 
                title="Recent Candidates" 
                extra={<Link to="/candidates">View All</Link>}
              >
                <List
                  dataSource={summary.recent_candidates}
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
                  dataSource={summary.upcoming_interviews}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        title={<a href={`/interviews/${item.id}`}>{item.candidate}</a>}
                        description={
                          <>
                            <div>{item.position}</div>
                            <div>{new Date(item.date).toLocaleString()}</div>
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

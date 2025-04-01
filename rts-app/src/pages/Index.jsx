import React from "react";
import { Layout, Button, Typography, Row, Col, Card, Divider, Space } from "antd";
import {
  UserOutlined,
  FileSearchOutlined,
  ScheduleOutlined,
  BellOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
const { Header, Footer, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    navigate("/dashboard");
  }
  return (
      <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)' }}>
        <div style={{display:'flex', alignItems:'center'}}>
          <Title level={3} style={{ margin: 0, color: '#6E59F5' }}>RecruitTrack</Title>
        </div>
        <div style={{display:'flex', gap:'1rem'}}>
          <Link to="/login">
            <Button>Login</Button>
          </Link>  
          <Link to="/register">
            <Button type="primary">Get Started</Button>
          </Link>
        </div>
      </Header>
      <Content>
        <section style={{ padding: '5rem 2rem', textAlign: 'center', background: 'linear-gradient(to bottom right, #ebf8ff, #e9d8fd)' }}>
          <Row justify="center">
            <Col xs={24} md={18} lg={16} xl={14}>
              <Title style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                Streamline Your Recruitment Process
              </Title>
              <Paragraph style={{ fontSize: '1.125rem', marginBottom: '2rem', color: '#4a5568' }}>
                RecruitTrack helps you manage job postings, track candidates, schedule interviews,
                and make better hiring decisions - all in one platform.
              </Paragraph>
            </Col>
          </Row>
        </section>
        <section style={{padding: '16px 8px', backgroundColor:'white'}}>
          <Row justify="center" style={{textAlign:'center',marginBottom:'3rem',display:'flex',justifyContent:'center'}}>
            <Col span={16}>
              <Title level={2}>Powerful Recruitment Tools</Title>
              <Text style={{ color: '#4A5568' }}>
                Everything you need to manage your hiring pipeline efficiently
              </Text>
            </Col>
          </Row>
          <Row gutter={[32, 32]} justify="center">
            {[{
              icon: <FileSearchOutlined style={{ fontSize: '2.25rem', color: 'var(--primary-color)', marginBottom: '1rem' }}/>, title: "Job Postings", description: "Create, manage, and track all your job openings in one place"
            }, {
              icon: <UserOutlined style={{ fontSize: '2.25rem', color: 'var(--primary-color)', marginBottom: '1rem' }}/>, title: "Applicant Tracking", description: "Organize candidates and track their progress through your pipeline"
            }, {
              icon: <ScheduleOutlined style={{ fontSize: '2.25rem', color: 'var(--primary-color)', marginBottom: '1rem' }}/>, title: "Interview Scheduling", description: "Schedule and manage interviews with integrated calendar"
            }, {
              icon: <BellOutlined style={{ fontSize: '2.25rem', color: 'var(--primary-color)', marginBottom: '1rem' }}/>, title: "Notifications", description: "Stay updated with alerts for candidate status changes"
            }].map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card style={{ height: '100%', textAlign: 'center', transition: 'box-shadow 0.3s', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>

                  {feature.icon}
                  <Title level={4}>{feature.title}</Title>
              <Text style={{ color: '#4A5568' }}>{feature.description}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
        <section style={{ paddingTop: '4rem', paddingBottom: '4rem', paddingLeft: '2rem', paddingRight: '2rem', backgroundColor: '#f9fafb' }}>
        <Row justify="center" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <Col span={16}>
              <Title level={2} style={{ marginBottom: '1.5rem' }}>How RecruitTrack Works</Title>
              <Text style={{ color: '#4a5568' }}>
                Our simple process to help you find the best talent
              </Text>
            </Col>
          </Row>
          <Row gutter={[48, 48]} justify="center" align="middle">
            {[{
              icon: <RocketOutlined style={{ fontSize: '1.5rem' }}/>, title: "Post Jobs", description: "Create detailed job postings with all relevant information"
            }, {
              icon: <TeamOutlined style={{ fontSize: '1.5rem' }}/>, title: "Track Candidates", description: "Manage applicants through customizable recruitment stages"
            }, {
              icon: <CheckCircleOutlined style={{ fontSize: '1.5rem' }}/>, title: "Hire the Best", description: "Make data-driven decisions to select the right candidates"
            }].map((step, index) => (
              <Col xs={24} md={8} key={index}>
                <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '4rem', height: '4rem', borderRadius: '50%', backgroundColor: '#6E59F5', color: 'white', marginBottom: '1rem' }}>
                    {step.icon}
                  </div>
                  <Title level={4}>{step.title}</Title>
              <Text style={{ color: '#4A5568' }}>{step.description}</Text>
                </div>
              </Col>
            ))}
          </Row>
        </section>
      </Content>
      <Footer style={{ backgroundColor: '#2D3748', color: 'white' }}>
      <Divider style={{ borderColor: '#374151' }} />  
      <Text style={{ color: '#A0AEC0' }}>© {new Date().getFullYear()} RecruitTrack. All rights reserved.</Text>
      </Footer>
    </Layout>
  );
};

export default Index;

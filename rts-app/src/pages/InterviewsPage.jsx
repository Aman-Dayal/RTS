import React, { useState } from 'react';
import { 
  Layout, 
  Menu, 
  Button, 
  Row, 
  Col, 
  Card, 
  Typography, 
  Table, 
  Tag,
  Space,
  Input,
  Select,
  Modal,
  Form,
  Dropdown,
  Avatar,
  DatePicker,
  TimePicker,
  Tabs
} from 'antd';
import { 
  DashboardOutlined, 
  FileSearchOutlined, 
  UserOutlined, 
  ScheduleOutlined, 
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  CheckOutlined,
  EyeOutlined,
  LogoutOutlined,
  BellOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import dayjs from "dayjs";
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import FilterableTable from '../components/BasePage';
const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

// Mock data for interviews
const initialInterviews = [
  {
    id: 1,
    candidate: 'John Doe',
    position: 'Frontend Developer',
    interviewer: 'Sarah Manager',
    date: '2023-06-01',
    time: '10:00',
    status: 'Scheduled',
    feedback: '',
  },
  {
    id: 2,
    candidate: 'Jane Smith',
    position: 'UX Designer',
    interviewer: 'Mike Director',
    date: '2023-06-01',
    time: '14:30',
    status: 'Scheduled',
    feedback: '',
  },
  {
    id: 3,
    candidate: 'Mike Johnson',
    position: 'Product Manager',
    interviewer: 'Lisa VP',
    date: '2023-05-28',
    time: '11:00',
    status: 'Completed',
    feedback: 'Strong candidate with good product vision',
  },
  {
    id: 4,
    candidate: 'Robert Chen',
    position: 'Data Analyst',
    interviewer: 'David Lead',
    date: '2023-05-29',
    time: '15:00',
    status: 'Completed',
    feedback: 'Good technical skills but lacking experience',
  },
  {
    id: 5,
    candidate: 'Emily Davis',
    position: 'Marketing Specialist',
    interviewer: 'John Marketing',
    date: '2023-05-30',
    time: '09:30',
    status: 'Cancelled',
    feedback: '',
  },
];

const InterviewsPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [currentInterview, setCurrentInterview] = useState(null);
  const [form] = Form.useForm();
  const [feedbackForm] = Form.useForm();
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleFeedbackCancel = () => {
    setIsFeedbackModalOpen(false);
  };

  const handleFeedbackSubmit = (values) => {
    const updatedInterviews = interviews.map(interview => 
      interview.id === currentInterview.id ? { ...interview, feedback: values.feedback, status: 'Completed' } : interview
    );
    setInterviews(updatedInterviews);
    setIsFeedbackModalOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'blue';
      case 'Completed': return 'green';
      case 'Cancelled': return 'red';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Candidate',
      dataIndex: 'candidate',
      key: 'candidate',
      render: (text, record) => <a>{text}</a>,
    },
    {
      title: 'Position',
      dataIndex: 'job_title',
      key: 'position',
    },
    {
      title: 'Interviewer',
      dataIndex: 'interviewer',
      key: 'interviewer',
    },
    {
      title: 'Date',
      key: 'date',
      dataIndex: 'date',
      render: (_, record) => dayjs(record.date, 'YYYY-MM-DD').format('MMM D, YYYY'),
    },
    {
      title: 'Time',
      key: 'time',
      dataIndex:'time',
      render: (_, record) => dayjs(record.time, "HH:mm:ss").format("hh:mm A"),    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: text => <Tag color={getStatusColor(text)}>{text}</Tag>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', width:'100vw' }}>
      <FilterableTable columnsConfig={columns} apiUrl={'/api/interviews/'} type="interview"></FilterableTable>
        <Layout>
          <Content style={{ padding: '1.5rem' }}>
          {/* <Modal
            title="Interview Feedback"
            open={isFeedbackModalOpen}
            onCancel={handleFeedbackCancel}
            footer={null}
            style={{ top: 20 }}
          >
            <Form
              form={feedbackForm}
              layout="vertical"
              onFinish={handleFeedbackSubmit}
            >
              {currentInterview && (
                <div style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    maxWidth: "300px",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                    wordWrap: "break-word"
                }}>            
                  <p style={{ marginBottom: "16px" }}><strong>Candidate:</strong> {currentInterview.candidate}</p>
                  <p style={{ marginBottom: "16px" }}><strong>Position:</strong> {currentInterview.position}</p>
                  <p style={{ marginBottom: "16px" }}><strong>Date & Time:</strong> {currentInterview.date} {currentInterview.time}</p>
                </div>
              )}              
              <Form.Item
                name="feedback"
                label="Feedback"
                rules={[{ required: true, message: 'Please provide feedback' }]}
              >
                <TextArea rows={6} placeholder="Enter interview feedback, assessment, and recommendations..." />
              </Form.Item>              
              <Form.Item>
                <Space>
                  <Button onClick={handleFeedbackCancel}>Cancel</Button>
                  <Button type="primary" htmlType="submit">
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal> */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default InterviewsPage;

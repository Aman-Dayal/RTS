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
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import FilterableTable from '../components/BaseTable';
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
  const [interviews, setInterviews] = useState(initialInterviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [currentInterview, setCurrentInterview] = useState(null);
  const [form] = Form.useForm();
  const [feedbackForm] = Form.useForm();
  const { user, logout } = useAuth();
  const location = useLocation();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    logout();
  };

  const showAddInterviewModal = () => {
    setEditingInterview(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const showEditInterviewModal = (interview) => {
    setEditingInterview(interview);
    form.setFieldsValue({
      candidate: interview.candidate,
      position: interview.position,
      interviewer: interview.interviewer,
      date: interview.date,
      time: interview.time,
      status: interview.status,
    });
    setIsModalOpen(true);
  };

  const showFeedbackModal = (interview) => {
    setCurrentInterview(interview);
    feedbackForm.setFieldsValue({
      feedback: interview.feedback || '',
    });
    setIsFeedbackModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleFeedbackCancel = () => {
    setIsFeedbackModalOpen(false);
  };

  const handleSubmit = (values) => {
    if (editingInterview) {
      // Update existing interview
      const updatedInterviews = interviews.map(interview => 
        interview.id === editingInterview.id ? { ...interview, ...values } : interview
      );
      setInterviews(updatedInterviews);
    } else {
      // Add new interview
      const newInterview = {
        id: Math.max(...interviews.map(interview => interview.id)) + 1,
        ...values,
        feedback: '',
      };
      setInterviews([...interviews, newInterview]);
    }
    setIsModalOpen(false);
  };

  const handleFeedbackSubmit = (values) => {
    const updatedInterviews = interviews.map(interview => 
      interview.id === currentInterview.id ? { ...interview, feedback: values.feedback, status: 'Completed' } : interview
    );
    setInterviews(updatedInterviews);
    setIsFeedbackModalOpen(false);
  };

  const handleDeleteInterview = (id) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this interview?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        const updatedInterviews = interviews.filter(interview => interview.id !== id);
        setInterviews(updatedInterviews);
      },
    });
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
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Interviewer',
      dataIndex: 'interviewer',
      key: 'interviewer',
    },
    {
      title: 'Date & Time',
      key: 'datetime',
      render: (_, record) => `${record.date} ${record.time}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: text => <Tag color={getStatusColor(text)}>{text}</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.status === 'Scheduled' && (
            <Button type="text" icon={<CheckOutlined />} onClick={() => showFeedbackModal(record)}/>
          )}
          {record.status === 'Completed' && (
            <Button type="text" icon={<EyeOutlined />} onClick={() => showFeedbackModal(record)}>
              View Feedback
            </Button>
          )}
          <Button type="text" icon={<EditOutlined />} onClick={() => showEditInterviewModal(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteInterview(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', width:'100vw' }}>
      <FilterableTable columnsConfig={columns} apiUrl={'http://localhost:8000/api/interviews'}></FilterableTable>
        <Layout>
          <Content style={{ padding: '1.5rem' }}>
            <Modal
              title={editingInterview ? "Edit Interview" : "Schedule New Interview"}
              open={isModalOpen}
              onCancel={handleCancel}
              footer={null}
              style={{ top: 20 }}
            >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Form.Item
                name="candidate"
                label="Candidate"
                rules={[{ required: true, message: 'Please select a candidate' }]}
              >
                <Select placeholder="Select candidate">
                  <Option value="John Doe">John Doe - Frontend Developer</Option>
                  <Option value="Jane Smith">Jane Smith - UX Designer</Option>
                  <Option value="Mike Johnson">Mike Johnson - Product Manager</Option>
                  <Option value="Sarah Williams">Sarah Williams - Backend Developer</Option>
                  <Option value="David Lee">David Lee - Frontend Developer</Option>
                </Select>
              </Form.Item>             
              <Form.Item
                name="position"
                label="Position"
                rules={[{ required: true, message: 'Please select position' }]}
              >
                <Select placeholder="Select position">
                  <Option value="Frontend Developer">Frontend Developer</Option>
                  <Option value="Backend Developer">Backend Developer</Option>
                  <Option value="UX Designer">UX Designer</Option>
                  <Option value="Product Manager">Product Manager</Option>
                  <Option value="Marketing Specialist">Marketing Specialist</Option>
                  <Option value="Data Analyst">Data Analyst</Option>
                </Select>
              </Form.Item>              
              <Form.Item
                name="interviewer"
                label="Interviewer"
                rules={[{ required: true, message: 'Please select interviewer' }]}
              >
                <Select placeholder="Select interviewer">
                  <Option value="Sarah Manager">Sarah Manager</Option>
                  <Option value="Mike Director">Mike Director</Option>
                  <Option value="Lisa VP">Lisa VP</Option>
                  <Option value="David Lead">David Lead</Option>
                  <Option value="John Marketing">John Marketing</Option>
                </Select>
              </Form.Item>              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="date"
                    label="Date"
                    rules={[{ required: true, message: 'Please select date' }]}
                  >
                    <Input placeholder="YYYY-MM-DD" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="time"
                    label="Time"
                    rules={[{ required: true, message: 'Please select time' }]}
                  >
                    <Input placeholder="HH:MM" />
                  </Form.Item>
                </Col>
              </Row>              
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  <Option value="Scheduled">Scheduled</Option>
                  <Option value="Completed">Completed</Option>
                  <Option value="Cancelled">Cancelled</Option>
                </Select>
              </Form.Item>             
              <Form.Item>
                <Space>
                  <Button onClick={handleCancel}>Cancel</Button>
                  <Button type="primary" htmlType="submit">
                    {editingInterview ? 'Update' : 'Schedule'}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
          <Modal
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
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default InterviewsPage;

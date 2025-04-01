import React, { useState } from 'react';
import { 
  Layout, 
  Menu, 
  Button, 
  Card,
  Row, 
  Col, 
  Tooltip, 
  Typography, 
  Table,
  Tabs,
  Tag,
  Space,
  Input,
  Select,
  Modal,
  Form,
  Dropdown,
  Avatar,
  Upload,
  message,
  Empty
} from 'antd';
import { 
  DashboardOutlined, 
  FileSearchOutlined, 
  UserOutlined, 
  ScheduleOutlined, 
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  LogoutOutlined,
  BellOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UploadOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'blue';
      case 'Completed': return 'green';
      case 'Cancelled': return 'red';
      default: return 'default';
    }
  };


  const initialInterviews = [
    {
      id: 1,
      key: '1',
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
      key: '2',
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
      key: '3',
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
      key: '4',
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
      key: '5',
      candidate: 'Emily Davis',
      position: 'Marketing Specialist',
      interviewer: 'John Marketing',
      date: '2023-05-30',
      time: '09:30',
      status: 'Cancelled',
      feedback: '',
    },
    {
        id: 6,
        key: '6',
        candidate: 'Emily Davis',
        position: 'Marketing Specialist',
        interviewer: 'John Marketing',
        date: '2023-05-30',
        time: '09:30',
        status: 'Cancelled',
        feedback: '',
      },
      {
        id: 7,
        key: '7',
        candidate: 'Emily Davis',
        position: 'Marketing Specialist',
        interviewer: 'John Marketing',
        date: '2023-05-30',
        time: '09:30',
        status: 'Cancelled',
        feedback: '',
      },
  ];
  
const BasePage = () => {
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
        const [searchText, setSearchText] = useState({});
        const [filteredData, setFilteredData] = useState([]);

        const handleSearch = (e, dataIndex) => {
          const value = e.target.value.toLowerCase().trim();
      
          setSearchText((prev) => {
            const newSearchText = { ...prev, [dataIndex]: value };
            const filtered = interviews.filter((item) =>
              Object.keys(newSearchText).every((key) =>
              newSearchText[key] === "" || item[key]?.toString().toLowerCase().includes(newSearchText[key])
              )
            );
            console.log(filtered.length>0);
      
            setFilteredData(filtered.length > 0 ? filtered:[]);
            return newSearchText;
          });
        };
       const columns = [
          {
              title: (
                  <>
                    {/* Candidate Name <br /> */}
                    <Input
                      placeholder="Candidate Name"
                      value={searchText.candidate || ''}
                      onChange={(e) => handleSearch(e, 'candidate')}
                    />
                  </>),
            dataIndex: 'candidate',
            key: 'candidate',
            width:'20%',
            render: (text) => <a>{text}</a>,
          },
          {
            title: (
              <>
              <Input
                placeholder="Job Position"
                value={searchText.position || ''}
                onChange={(e) => handleSearch(e, 'position')}
              />
            </>
            ),
            dataIndex: 'position',
            key: 'position',
            width:'20%',
          },
          {
            title: (
              <>
              <Input
                placeholder="Interviewer"
                value={searchText.interviewer || ''}
                onChange={(e) => handleSearch(e, 'interviewer')}
              />
            </>
            ),
            width:'20%',
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
            filters: [
              {
              text: 'Applied',
              value: 'Applied',
              },
              {
              text: 'Screening',
              value: 'Screening',
              },
              {
              text: 'Offer Extended',
              value: 'Offered Extended',
              },
              {
              text: 'Interview Scheduled',
              value: 'Interview Scheduled',
              },
              {
              text: 'Rejected',
              value: 'Rejected',
              }
            ],
            onFilter: (value, record) => record.name.indexOf(value) === 0,
            sorter: (a, b) => a.name.length - b.name.length,
            render: text => <Tag color={getStatusColor(text)}>{text}</Tag>,
          },
          {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
              <Space size="middle">
                {record.status === 'Scheduled' && (
                  <Button type="text" icon={<CheckOutlined />} onClick={() => showFeedbackModal(record)}>
                    Add Feedback
                  </Button>
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
      


    return (
        <Layout style={{ minHeight: '100vh' }}>
        <Sider 
            trigger={null} 
            collapsible 
            collapsed={collapsed}
            theme="light"
            width={250}
            style={{
            position: 'absolute',
            top: 0,
            left: 0,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
            zIndex: 10
            }}
        >            
            <div style={{ padding: "16px", height: "64px", display: "flex", alignItems: "center" }}>
            {!collapsed && <Title level={4} >RecruitTrack</Title>}
            </div>

            <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ borderRight: 0 }}
            >
            <Menu.Item key="" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={toggleCollapsed}>
            {collapsed ? (
            <Tooltip title="Open" placement="right">
                <span>Open</span>
            </Tooltip>
            ) : (
            <span>Close</span>
            )}
            </Menu.Item>
            <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
                <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="/jobs" icon={<FileSearchOutlined />}>
                <Link to="/jobs">Job Postings</Link>
            </Menu.Item>
            <Menu.Item key="/candidates" icon={<UserOutlined />}>
                <Link to="/candidates">Candidates</Link>
            </Menu.Item>
            <Menu.Item key="/interviews" icon={<ScheduleOutlined />}>
                <Link to="/interviews">Interviews</Link>
            </Menu.Item>
            </Menu>
    </Sider>
    <Content style={{ padding: '1.5rem', marginLeft:collapsed ? 80 : 250, width:1000}}>
      <Table 
      columns={columns} 
      dataSource={filteredData.length ? filteredData:interviews} 
      rowKey="id"
      style={{ width: '1000px'}}
      pagination={{ pageSize: 10}}
      locale={{ emptyText: <Empty description="No matching results"/>}}
      />
    </Content>
    </Layout>
    )
};
    

export default BasePage;

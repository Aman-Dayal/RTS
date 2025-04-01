import React, { useState } from 'react';
import { 
  Layout, 
  Button,
  Tag,
  Space,
  Input,
  Select,
  Modal,
  Form,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import FilterableTable from '../components/BaseTable';
const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input

const JobsPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [form] = Form.useForm();
  const { logout } = useAuth();

  const showEditJobModal = (job) => {
    setEditingJob(job);
    form.setFieldsValue({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      description: job.description || '',
      requirements: job.requirements || '',
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (values) => {
    if (editingJob) {
      const updatedJobs = jobs.map(job => 
        job.id === editingJob.id ? { ...job, ...values } : job
      );
      setJobs(updatedJobs);
    } else {
      const newJob = {
        id: Math.max(...jobs.map(job => job.id)) + 1,
        ...values,
        applicants: 0,
        status: 'Active',
        postedDate: new Date().toISOString().split('T')[0],
      };
      setJobs([...jobs, newJob]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteJob = (id) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this job posting?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        const updatedJobs = jobs.filter(job => job.id !== id);
        setJobs(updatedJobs);
      },
    });
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => <a>{text}</a>,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Employment Type',
      dataIndex: 'employment_type',
      key: 'employment_type',
      render: text => {
        let color = 'geekblue';
        if (text === 'Part-time') color = 'orange';
        if (text === 'Contract') color = 'purple';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Required Skills',
      dataIndex: 'required_skills',
      key: 'required_skills',
    },
    { title: 'Created At', dataIndex: 'created_at', key: 'created_at', isDateColumn: true, searchable: true },
    { title: 'Updated At', dataIndex: 'updated_at', key: 'updated_at', isDateColumn: true, searchable: true },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => showEditJobModal(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteJob(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', width:'100vw' }}>
      <Layout>
        <Content className="p-6">
          <FilterableTable 
          apiUrl={'http://localhost:8000/api/job_postings'}
          columnsConfig={columns}
          />
          <Modal
            title={editingJob ? "Edit Job Posting" : "Add New Job Posting"}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Form.Item
                name="title"
                label="Job Title"
                rules={[{ required: true, message: 'Please enter job title' }]}
              >
                <Input placeholder="e.g. Frontend Developer" />
              </Form.Item>            
              <Form.Item
                name="department"
                label="Department"
                rules={[{ required: true, message: 'Please select department' }]}
              >
                <Select placeholder="Select department">
                  <Option value="Engineering">Engineering</Option>
                  <Option value="Design">Design</Option>
                  <Option value="Product">Product</Option>
                  <Option value="Marketing">Marketing</Option>
                  <Option value="Sales">Sales</Option>
                  <Option value="HR">HR</Option>
                </Select>
              </Form.Item>             
              <Form.Item
                name="location"
                label="Location"
                rules={[{ required: true, message: 'Please enter location' }]}
              >
                <Input placeholder="e.g. Remote, New York, etc." />
              </Form.Item>              
              <Form.Item
                name="type"
                label="Employment Type"
                rules={[{ required: true, message: 'Please select employment type' }]}
              >
                <Select placeholder="Select employment type">
                  <Option value="Full-time">Full-time</Option>
                  <Option value="Part-time">Part-time</Option>
                  <Option value="Contract">Contract</Option>
                  <Option value="Internship">Internship</Option>
                </Select>
              </Form.Item>             
              <Form.Item
                name="description"
                label="Job Description"
                rules={[{ required: true, message: 'Please enter job description' }]}
              >
                <TextArea rows={4} placeholder="Enter job description" />
              </Form.Item>              
              <Form.Item
                name="requirements"
                label="Requirements"
                rules={[{ required: true, message: 'Please enter job requirements' }]}
              >
                <TextArea rows={4} placeholder="Enter job requirements" />
              </Form.Item>             
              <Form.Item className="flex justify-end">
                <Space>
                  <Button onClick={handleCancel}>Cancel</Button>
                  <Button type="primary" htmlType="submit">
                    {editingJob ? 'Update' : 'Create'}
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

export default JobsPage;
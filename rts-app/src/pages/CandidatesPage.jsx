import React, { useState, useEffect } from 'react';
import FilterableTable from '../components/BaseTable';
import { Form, Input, Select, Upload, Tag, Space, Button, Tooltip, Modal } from 'antd';
import useInterviews from '../utils';
import {
  EditOutlined, DeleteOutlined, EyeOutlined, CheckOutlined, UploadOutlined
} from '@ant-design/icons';
const { TextArea } = Input;

const getStatusColor = (status) => {
  switch (status) {
    case 'Applied': return 'blue';
    case 'Screening': return 'green';
    case 'Interview Scheduled': return 'orange';
    case 'Rejected': return 'red';
    default: return 'gray';
  }
};

const CandidatesPage = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const {
    showFeedbackModal,
    handleDeleteInterview
  } = useInterviews();

  useEffect(() => {
    console.log("Modal state changed:", isModalOpen);
    console.log("Editing candidate:", editingCandidate);
  }, [isModalOpen, editingCandidate]);

  const showEditCandidateModal = (candidate) => {
    console.log("Show edit modal called with:", form.getFieldsValue());
    setEditingCandidate(candidate);
    form.setFieldsValue({
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      position: candidate.applied_position,
      status: candidate.status,
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    console.log("Closing modal");
    setIsModalOpen(false);
    setEditingCandidate(null);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    console.log("Form submitted with values:", values);
    setIsModalOpen(false);
  };

  const columnsConfig = [
    { title: 'Name', dataIndex: 'name', key: 'name', searchable: true },
    { title: 'Email', dataIndex: 'email', key: 'email', searchable: true },
    { title: 'Contact', dataIndex: 'phone', key: 'phone', searchable: true },
    { title: 'Job', dataIndex: 'applied_position', key: 'applied_position', searchable: true },
    { title: 'Created At', dataIndex: 'created_at', key: 'created_at', isDateColumn: true, searchable: true },
    { title: 'Updated At', dataIndex: 'updated_at', key: 'updated_at', isDateColumn: true, searchable: true },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (text) => <Tag color={getStatusColor(text)}>{text || 'N/A'}</Tag>,
      filters: [
        { text: 'Applied', value: 'Applied' },
        { text: 'Screening', value: 'Screening' },
        { text: 'Offer Extended', value: 'Offer Extended' },
        { text: 'Interview Scheduled', value: 'Interview Scheduled' },
        { text: 'Rejected', value: 'Rejected' }
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => {
                console.log("Edit button clicked for record:", record.id);
                showEditCandidateModal(record);
              }} 
              key={`edit-${record.id}`}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDeleteInterview(record.id)} 
              key={`delete-${record.id}`}
            />
          </Tooltip>
          {record.status === 'Screening' && (
            <Tooltip title="Add Feedback">
              <Button 
                type="text" 
                icon={<CheckOutlined />} 
                onClick={() => showFeedbackModal(record)} 
                key={`feedback-${record.id}`}
              />
            </Tooltip>
          )}
          {(record.status === 'Rejected' || record.status === 'Interview Scheduled') && (
            <Tooltip title="View Feedback">
              <Button 
                type="text" 
                icon={<EyeOutlined />} 
                onClick={() => showFeedbackModal(record)} 
                key={`view-${record.id}`}
              />
            </Tooltip>
          )}
        </Space>
      ),
    }
  ];

  return (
      <div style={{width:"100vw"}}>
        <FilterableTable columnsConfig={columnsConfig} apiUrl="/api/candidates/" />
          <Modal
            title={editingCandidate ? "Edit Candidate" : "Add New Candidate"}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              preserve={false}
            >
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter candidate name' }]}
              >
                <Input placeholder="e.g. Aman Dayal" />
              </Form.Item>
              
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input placeholder="e.g. john.doe@example.com" />
              </Form.Item>             
              <Form.Item
                name="phone"
                label="Phone"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input placeholder="e.g. (555) 123-4567" />
              </Form.Item>             
              <Form.Item
                name="position"
                label="Applied Position"
                rules={[{ required: true, message: 'Please select position' }]}
              >
                <Select placeholder="Select position">
                  <Option value="Frontend Developer">Frontend Developer</Option>
                  <Option value="Backend Developer">Backend Developer</Option>
                  <Option value="UX Designer">UX Designer</Option>
                  <Option value="Product Manager">Product Manager</Option>
                  <Option value="Marketing Specialist">Marketing Specialist</Option>
                  <Option value="Sales Representative">Sales Representative</Option>
                </Select>
              </Form.Item>              
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  <Option value="Applied">Applied</Option>
                  <Option value="Screening">Screening</Option>
                  <Option value="Interview">Interview</Option>
                  <Option value="Offer">Offer</Option>
                  <Option value="Rejected">Rejected</Option>
                </Select>
              </Form.Item>              
              <Form.Item name="resume" label="Resume/CV" >
                <Upload
                  maxCount={1}
                  beforeUpload={() => {
                    message.success('Resume uploaded');
                    return false;
                  }}
                >
                  <Button icon={<UploadOutlined />}>Upload Resume</Button>
                </Upload>
              </Form.Item>            
              <Form.Item
                name="notes"
                label="Notes"
              >
                <TextArea rows={4} placeholder="Add notes about the candidate" />
              </Form.Item>
              
              <Form.Item className="flex justify-end">
                <Space>
                  <Button onClick={handleCancel}>Cancel</Button>
                  <Button type="primary" htmlType="submit">
                    {editingCandidate ? 'Update' : 'Add'}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
    </div>
  );
};

export default CandidatesPage;
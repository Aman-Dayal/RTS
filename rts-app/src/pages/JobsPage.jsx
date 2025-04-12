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
import FilterableTable from '../components/BasePage';

const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input

const JobsPage = () => {
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
        if (text === 'Part Time') color = 'orange';
        if (text === 'Contract') color = 'purple';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Required Skills',
      dataIndex: 'required_skills',
      key: 'required_skills',
      render: (skills) => (
        skills?.length
          ? skills.map((skill) => (
              <Tag color="blue" key={skill}>{skill}</Tag>
            ))
          : '-'
      ),
    },
    { title: 'Created At', dataIndex: 'created_at', key: 'created_at', isDateColumn: true, searchable: true },
    { title: 'Updated At', dataIndex: 'updated_at', key: 'updated_at', isDateColumn: true, searchable: true },
  ];

  return (
    <Layout style={{ minHeight: '100vh', width:'100vw' }}>
          <FilterableTable 
          apiUrl={'/api/job_postings/'}
          columnsConfig={columns}
          type="job"
          />
      </Layout>
  );
};

export default JobsPage;
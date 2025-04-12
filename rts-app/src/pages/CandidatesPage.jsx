import React, { useState, useEffect } from 'react';
import FilterableTable from '../components/BasePage';
import { Form, Tag, Space, Button, Tooltip } from 'antd';

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

  const columnsConfig = [
    { title: 'Name', dataIndex: 'name', key: 'name', searchable: true },
    { title: 'Email', dataIndex: 'email', key: 'email', searchable: true },
    { title: 'Contact', dataIndex: 'phone', key: 'phone', searchable: true },
    { title: 'Job', dataIndex: 'job_title', key: 'job_title', searchable: true },
    { title: 'Created At', dataIndex: 'created_at', key: 'created_at', isDateColumn: true, searchable: true },
    { title: 'Updated At', dataIndex: 'updated_at', key: 'updated_at', isDateColumn: true, searchable: true, },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (text) => <Tag color={getStatusColor(text)}>{text || 'N/A'}</Tag>,
      onFilter: (value, record) => record.status.indexOf(value) === 0
    },
  ];

  return (
    <div style={{width:"100vw"}}>
      <FilterableTable columnsConfig={columnsConfig} apiUrl="/api/candidates/" type="candidate"/>
    </div>
  );
};

export default CandidatesPage;
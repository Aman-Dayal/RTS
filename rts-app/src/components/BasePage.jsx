import React, { useEffect, useState } from 'react';
import { Layout, Space, Table, Input, DatePicker, Tooltip, Card, Row, Col, Select, Typography, Button, Form} from 'antd';
import { EditOutlined, FilterOutlined } from '@ant-design/icons';
import axios from 'axios';
import SideBar from './SideBar';
import { getFormattedDateTime } from '../utils/helpers';
import BaseForm from './BaseForm';
import { getFormConfigByType } from '../utils/helpers';
import dayjs from "dayjs";
const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

const FilterableTable = ({ columnsConfig, apiUrl, type }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [department, setDepartment] = useState(null);
  const [jobType, setJobType] = useState(null);
  const [status, setStatus] = useState(null);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId,setEditId] = useState(null);
  const { formTitle, formFields, formButton } = getFormConfigByType(type);
  const [jobTitles, setJobTitles] = useState([]);
  const [interviewers, setIntereviewers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const showEditModal = (record) => {
    setIsModalOpen(true);
    setEditId(record.id);
    setTimeout(() => {
      let updatedRecord = record;
  
      if (type === "interview") {
        updatedRecord = {
          ...record,
          date: dayjs(record.date),
          time: dayjs(record.time, "HH:mm:ss"),
        };
      }
  
      form.setFieldsValue(updatedRecord);
    }, 0);
  };
  
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditId(null);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = form.getFieldsValue();
      setIsModalOpen(false);
      let payload = data;
      if (type === "interview") {
      payload = {
        ...data,
        date: data.date.format("YYYY-MM-DD"),
        time: data.time.format("HH:mm"),
      };
      };
      let res;
      if (editId){
        payload.id = editId;
        const url = `${apiUrl}${editId}`
        res = await axios.put(url, payload, {
          Credentials: true,
          headers: { "Content-Type": "application/json" },
        });
        setData(prev =>
          prev.map(item =>
            item.id === res.data.id ? res.data : item
          )
        );
      }
      else {
      res = await axios.post(apiUrl, payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      setData(prev=> [...prev, res.data]);
    }

    form.resetFields();
  } catch {
      
    }
  finally{
    setLoading(false);
  }
  };
  // useEffect(() => {
  //   if (isModalOpen && editId !== null && formFields.length > 0) {
  //     const record = data.find((item) => item.id === editId);
  //     if (record) {
  //       let updatedRecord = record;
  //       if (type === "interview") {
  //         updatedRecord = {
  //           ...record,
  //           date: dayjs(record.date),
  //           time: dayjs(record.time, "HH:mm:ss"),
  //         };
  //       }
  //       form.setFieldsValue(updatedRecord);
  //     }
  //   }
  // }, [isModalOpen, formFields, candidates, interviewers, jobTitles]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(apiUrl);
        setData(response.data);
      } catch (error) {

      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [apiUrl]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleDepartmentChange = (value) => {
    setDepartment(value);
  };

  const handleJobTypeChange = (value) => {
    setJobType(value);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const getFilteredData = () => {
    let filteredData = [...data];    
    if (searchText) {
      filteredData = filteredData.filter(item => 
        (item.title && item.title.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchText.toLowerCase()))
      );
    }    
    if (department) {
      filteredData = filteredData.filter(item => item.department === department);
    }    
    if (jobType) {
      filteredData = filteredData.filter(item => item.jobType === jobType);
    }    
    if (status) {
      filteredData = filteredData.filter(item => item.status === status);
    }    
    return filteredData;
  };

  const processedColumns = columnsConfig.map(column => {
    if (column.isDateColumn) {
      return {
        ...column,
        render: (text) => <Text>{column.isDateColumn ? getFormattedDateTime(text) : text}</Text>
      };
    }
    return column;
  });
  processedColumns.push( {
      title: 'Action', key: 'action',
       render: (_, record) => (
        <Tooltip title="Edit Current Record">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => {
              showEditModal(record);
            }}
            text="Edit"
            key={`edit-${record.id}`}
          />
      </Tooltip>
      )
    }
  )

  const openFormModal= async ()=>{
    setIsModalOpen(true);
  };
  useEffect(() => {
    const fetchDynamicData = async () => {
      if (type === "candidate" || type === "interview") {
        try {
          const res = await axios.get("/api/job_postings/", { withCredentials: true });
          setJobTitles(res.data);
        } catch (err) {
        }
      }
  
      if (type === "interview") {
        try {
          const canres = await axios.get("/api/candidates/", { withCredentials: true });
          setCandidates(canres.data);
        } catch (err) {
        }
  
        try {
          const intres = await axios.get("/api/users/", { withCredentials: true });
          setIntereviewers(intres.data);
        } catch (err) {
        }
      }
    };
  
    fetchDynamicData();
  }, [type]);
  
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    // loading?<div>Loadiing</div>:
    <Layout style={{ minHeight: '100vh' }}>
      <SideBar />
      <Layout.Content style={{
        padding: '24px',
        height: "100vh",
        overflow: "auto"
      }}>
      <FilterOutlined style={{ fontSize: 44 }} onClick={() => setIsFiltersOpen(!isFiltersOpen)} />
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 ,}}>        
        <Col flex="auto">
        <Card style={{ marginBottom: 24, width:"60vw", display:isFiltersOpen?'block':'none'}}>
          <Row gutter={[16, 16]} >
            <Col xs={24} sm={12} md={8} lg={6}>
              <Search 
                placeholder="Search jobs" 
                style={{ width: '100%' }} 
                onSearch={handleSearch}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                placeholder="Department"
                style={{ width: '100%' }}
                onChange={handleDepartmentChange}
                allowClear
              >
                <Option value="Engineering">Engineering</Option>
                <Option value="Management">Management</Option>
                <Option value="Marketing">Marketing</Option>
                <Option value="Sales">Sales</Option>
                <Option value="Marketing">Human Resources</Option>

              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                placeholder="Job Type"
                style={{ width: '100%' }}
                onChange={handleJobTypeChange}
                allowClear
              >
                <Option value="Full-time">Full-time</Option>
                <Option value="Part-time">Part-time</Option>
                <Option value="Contract">Contract</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                placeholder="Status"
                style={{ width: '100%' }}
                onChange={handleStatusChange}
                allowClear
              >
                <Option value="Active">Active</Option>
                <Option value="Closed">Closed</Option>
              </Select>
            </Col>

          </Row>
        </Card>
        </Col>
        <Col>
            <Button onClick={openFormModal}>
              {formButton}
            </Button>
            </Col>
      </Row>
        <Table
          columns={processedColumns}
          dataSource={getFilteredData()}
          rowKey="id"
          loading={loading}
          sticky={true}
          scroll={{ x: 1000 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
          }}
        />
        <BaseForm 
          title={ formTitle }
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          form={form}
          fields={formFields}
          isOpen={isModalOpen}
          dynamicOptions={{ job_id: jobTitles, candidate_id:candidates , interviewer_id: interviewers }}
        />
      </Layout.Content>
    </Layout>
  );
};

export default FilterableTable;
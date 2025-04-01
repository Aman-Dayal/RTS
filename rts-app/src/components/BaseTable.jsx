import React, { useEffect, useRef, useState } from 'react';
import { Layout, Space, Table, Button, Input, DatePicker, Tooltip, Card, Row, Col, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import SideBar from './SideBar';

// const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
// const { TextArea } = Input;

const FilterableTable = ({ columnsConfig, apiUrl }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        console.log("datadatadata", response);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex, isDateColumn = false) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        {isDateColumn ? (
          <DatePicker
            onChange={(date, dateString) => {
              setSelectedKeys(dateString ? [dateString] : []);
            }}
            value={selectedKeys[0] ? dayjs(selectedKeys[0]) : null}
            style={{ width: '100%', marginBottom: 8 }}
          />
        ) : (
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: 'block' }}
          />
        )}
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button 
            type="link" 
            size="small" 
            onClick={() => close()}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Tooltip title={text}>
          <span style={{ backgroundColor: '#ffc069', padding: 0 }}>
            {text ? text.toString() : ''}
          </span>
        </Tooltip>
      ) : (
        text
      ),
  });

  const columns = columnsConfig.map((col) => ({
    ...col,
    ...(col.searchable ? getColumnSearchProps(col.dataIndex, col.isDateColumn) : {}),
  }));

  return (
    <Layout>
      <SideBar />

      <div style={{
        height: "100vh",
        overflow: "auto"
      }}>
        <Space>
          <Card className="mb-6">
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Search placeholder="Search jobs" style={{ width: '100%' }} />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select 
                  placeholder="Department" 
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Option value="Engineering">Engineering</Option>
                  <Option value="Design">Design</Option>
                  <Option value="Product">Product</Option>
                  <Option value="Marketing">Marketing</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select 
                  placeholder="Job Type" 
                  style={{ width: '100%' }}
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
                  allowClear
                >
                  <Option value="Active">Active</Option>
                  <Option value="Closed">Closed</Option>
                </Select>
              </Col>
            </Row>
          </Card>
        </Space>
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id" 
          loading={loading} 
          sticky={true}
          scroll={{ x: 1000}}
        />
      </div>
    </Layout>
  );
};

export default FilterableTable;
import React, { useState } from 'react';
import { 
  Layout,
  Menu,
  Typography,
  Tooltip
} from 'antd';
import {
  DashboardOutlined,
  FileSearchOutlined,
  ScheduleOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  TeamOutlined,
  ProjectOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const { Sider } = Layout;
const { Title } = Typography;

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const { user,logout } = useAuth();
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const handleLogout = () => {
    logout();
  };
  
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      theme="light"
      width={250}
      style={{
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
        zIndex: 10
      }}
    >            
      <div style={{ padding: "16px", height: "64px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {collapsed ? (
          <img src="./logo.png" alt="Logo" style={{ width: "40px", height: "40px" }} />
        ) : (
          <Title level={4}>RecruitTrack</Title>
        )}
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ borderRight: 0 }}
      >
        <Menu.Item key="toggle" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={toggleCollapsed}>
          {collapsed ? (
            <Tooltip title="Open" placement="right">
              <span>Open</span>
            </Tooltip>
          ) : (
            <span>Close</span>
          )}
        </Menu.Item>
        <Menu.Item key="/notifications" icon={<BellOutlined />}>
          <Link to="/notifications">Notifications</Link>
        </Menu.Item>
        <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="/jobs" icon={<FileSearchOutlined />}>
          <Link to="/jobs">Job Postings</Link>
        </Menu.Item>
        <Menu.Item key="/candidates" icon={<TeamOutlined />}>
          <Link to="/candidates">Candidates</Link>
        </Menu.Item>
        <Menu.Item key="/interviews" icon={<ScheduleOutlined />}>
          <Link to="/interviews">Interviews</Link>
        </Menu.Item>
        <Menu.Item key="/tracker" icon={<ProjectOutlined />}>
          <Link to="/tracker">Status Tracker</Link>
        </Menu.Item>
        <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
          <span>Logout</span>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default SideBar;
import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Typography,
  Tooltip,
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
  ProjectOutlined,
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const { Sider } = Layout;
const { Title } = Typography;

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleCollapsed = () => setCollapsed(!collapsed);
  const handleLogout = () => logout();

  const items = [
    {
      key: 'toggle',
      icon: collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />,
      label: collapsed ? (
        <Tooltip title="Open" placement="right">
          <span>Open</span>
        </Tooltip>
      ) : (
        'Close'
      ),
      onClick: toggleCollapsed,
    },
    {
      key: '/notifications',
      icon: <BellOutlined />,
      label: <Link to="/notifications">Notifications</Link>,
    },
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: '/jobs',
      icon: <FileSearchOutlined />,
      label: <Link to="/jobs">Job Postings</Link>,
    },
    {
      key: '/candidates',
      icon: <TeamOutlined />,
      label: <Link to="/candidates">Candidates</Link>,
    },
    {
      key: '/interviews',
      icon: <ScheduleOutlined />,
      label: <Link to="/interviews">Interviews</Link>,
    },
    {
      key: '/tracker',
      icon: <ProjectOutlined />,
      label: <Link to="/tracker">Status Tracker</Link>,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      theme="light"
      width={250}
      style={{
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
        zIndex: 10,
      }}
    >
      <div
        style={{
          padding: '16px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {collapsed ? (
          <img src="./logo.png" alt="Logo" style={{ width: '40px', height: '40px' }} />
        ) : (
          <Title level={4}>RecruitTrack</Title>
        )}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
};

export default SideBar;

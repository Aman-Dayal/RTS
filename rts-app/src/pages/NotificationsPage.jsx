import React, { useEffect, useState } from 'react';
import { Space, List, Card, Typography, Badge, Button, Tabs, Empty, Spin, Switch, Divider, Layout } from 'antd';
import { BellOutlined, CheckOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
// import DashboardLayout from '../components/DashboardLayout';
import SideBar from '../components/SideBar';
const { Title, Text } = Typography;
const { TabPane } = Tabs;
import axios from "axios";
import { getFormattedDateTime } from "../utils/helpers"

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    axios
      .get("/api/notifications")
      .then((response) => {
        console.log('--__--',response);
        setNotifications(response.data);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
  }, []);
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  const markAllAsRead = () => {
    setLoading(true);
    setTimeout(() => {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setLoading(false);
    }, 500);
  };
  
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };
  
  const NotificationItem = ({ item }) => (
    <List.Item
      actions={[
        // !item.read && (
        //   <Button 
        //     type="text" 
        //     icon={<CheckOutlined />} 
        //     onClick={() => markAsRead(item.id)}
        //     key="mark-read"
        //   >
        //     Mark Read
        //   </Button>
        // ),
        <Button 
        //   type="text" 
          danger
          icon={<DeleteOutlined />} 
          onClick={() => deleteNotification(item.id)}
          key="delete"
        />,
      ]}
    >
      <List.Item.Meta
        title={
          <div style={{display:'flex',alignItems:'center'}}>
            {!item.read && <Badge status="processing" style={{marginRight:'8px'}} />}
            <Text strong={!item.read}>{item.title}</Text>
          </div>
        }
        description={
          <>
            <div>{item.message}</div>
            <Text type="secondary" style={{fontSize:'0.75rem'}}>{getFormattedDateTime(item.created_at)}</Text>
          </>
        }
      />
    </List.Item>
  );
  
  return (
    <Layout style = {{width:'100vw'}}>
        <SideBar/>        
        <Card style={{height:'100vh',width:'95vw'}}>
          <Tabs defaultActiveKey="all" sticky={true}>
            <TabPane tab={<>All Notifications {unreadCount > 0 && <Badge count={unreadCount} style={{ marginLeft: '12px' }} />}</>} key="all">
              {notifications.length > 0 ? (
                <List
                  itemLayout="horizontal"
                  dataSource={notifications}
                  renderItem={(item) => <NotificationItem item={item} />}
                />
              ) : (
                <Empty 
                  image={Empty.PRESENTED_IMAGE_SIMPLE} 
                  description="No notifications"
                />
              )}
            </TabPane>
            {/* <TabPane tab={<>Unread {unreadCount > 0 && <Badge count={unreadCount} style={{ marginLeft: '12px' }} />}</>} key="unread"> */}
                
              {/* {notifications.filter(n => !n.read).length > 0 ? (
                <List
                  itemLayout="horizontal"
                  dataSource={notifications.filter(n => !n.read)}
                  renderItem={(item) => <NotificationItem item={item} />}
                />
              ) : (
                <Empty 
                  image={Empty.PRESENTED_IMAGE_SIMPLE} 
                  description="No unread notifications"
                />
              )}
            </TabPane> */}
            <TabPane 
              tab={
                <span>
                    Settings
                    <SettingOutlined style={{marginLeft:'5px'}} />
                </span>
              } 
              key="settings"
            >
              <Title level={4}>Notification Preferences</Title>
              <div style={{marginTop:'24px'}}>
                <List
                  itemLayout="horizontal"
                  dataSource={[
                    { title: 'New applications', description: 'Get notified when new job applications are submitted', enabled: true },
                    { title: 'Interview updates', description: 'Get notified about interview scheduling changes', enabled: true },
                    { title: 'Candidate updates', description: 'Get notified when candidate statuses change', enabled: false },
                    { title: 'Task assignments', description: 'Get notified when tasks are assigned to you', enabled: true },
                  ]}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Switch defaultChecked={item.enabled} />
                      ]}
                    >
                      <List.Item.Meta
                        title={item.title}
                        description={item.description}
                      />
                    </List.Item>
                  )}
                />
              </div>
              
              <Divider />
              
              <Title level={4}>Email Notifications</Title>
              <div style={{marginTop:'0.5rem'}}>
                <List
                  itemLayout="horizontal"
                  dataSource={[
                    { title: 'Daily summary', description: 'Receive a daily email summary of all activities', enabled: true },
                    { title: 'Weekly reports', description: 'Receive weekly recruitment activity reports', enabled: false },
                  ]}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Switch defaultChecked={item.enabled} />
                      ]}
                    >
                      <List.Item.Meta
                        title={item.title}
                        description={item.description}
                      />
                    </List.Item>
                  )}
                />
              </div>
            </TabPane>
          </Tabs>
          
        </Card>
        
      {/* </div> */}
      
    </Layout>
  );
};

export default NotificationsPage;
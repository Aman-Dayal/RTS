import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Layout, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const { Title, Text } = Typography;
const { Content } = Layout;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login, user, error, setError } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);    
    try {
      await login(values.email, values.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };
  return (
    user ? navigate("/dashboard") : (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#F7FAFC' }}>
      <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
    <Card style={{ width: '100%', maxWidth: '28rem', padding: '1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Link to="/">
            <Title level={3} style={{ color: '#6E59F5' }}>RecruitTrack</Title>
          </Link>
            <Title level={4} style={{marginTop: '0.5rem'}}>Sign in to your account</Title>
      </div>

          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Password"
              />
            </Form.Item>
              {error && (
              <Alert 
                description={error} 
                type="error" 
                showIcon 
                style={{ marginBottom: '1rem' }}
              />
            )}
            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/forgot-password" style={{ fontSize: '0.875rem' }}>
                  Forgot password?
                </Link>
              </div>
            </Form.Item>
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                style={{ width: '100%' }}
              >
                Sign in
              </Button>
            </Form.Item>
          </Form>
          <Divider plain >
          <Text>Don't have an account?</Text>
          </Divider>
          <div style={{textAlign:'center'}}>
            <Link to="/register" style={{ color: '#6E59F5' }}>
              Sign up now
            </Link>
          </div>
        </Card>
      </Content>
    </Layout>)
  );
};

export default LoginPage;

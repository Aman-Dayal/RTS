import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Layout, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const { Title, Text } = Typography;
const { Content } = Layout;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      if (values.password !== values.confirmPassword) {
        throw new Error('Passwords do not match');
      }      
      await register(values.name, values.email, values.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    } finally {
      setLoading(false);
    }
  };
  return (
    user ? navigate("/dashboard") : (
      <Layout style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <Content
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '3rem',
            paddingBottom: '3rem',
            paddingLeft: '1rem',
            paddingRight: '1rem',
          }}
        >
        <Card style={{ width: '100%', maxWidth: '28rem', padding: '1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>

            <Link to="/">
              <Title level={3} className="text-primary">RecruitTrack</Title>
            </Link>
            <Title level={4} style={{marginTop:'0.5rem'}}>Create your account</Title>
          </div>

          {error && (
            <Alert 
              message="Registration Error" 
              description={error} 
              type="error" 
              showIcon 
              style={{marginBottom:'0.5rem'}}
            />
          )}
          <Form
            name="register"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Full Name"
              />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Confirm Password"
              />
            </Form.Item>
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>
          <Divider />
          <div style={{textAlign:'center'}}>
            <Text>Already have an account?</Text>{' '}
            <Link to="/login" className="text-primary">
              Sign in
            </Link>
          </div>
        </Card>
      </Content>
    </Layout>)
  );
};

export default RegisterPage;
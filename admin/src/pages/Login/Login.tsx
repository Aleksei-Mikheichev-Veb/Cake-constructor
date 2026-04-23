// ============================================================
// src/pages/Login/Login.tsx
// ============================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useLoginMutation } from '../../api/adminApi';
import { setCredentials } from '../../redux/authSlice';

const { Title } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const result = await login(values).unwrap();
      dispatch(setCredentials({ token: result.token, user: result.user }));
      message.success('Вход выполнен');
      navigate('/decorations');
    } catch (err: any) {
      message.error(err?.data?.error || 'Ошибка входа');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 100%)',
      }}
    >
      <Card style={{ width: 400, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
          🎂 Вход в админку
        </Title>

        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Введите email' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="admin@cakes.ru" size="large" />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: 'Введите пароль' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Пароль" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} size="large" block>
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;

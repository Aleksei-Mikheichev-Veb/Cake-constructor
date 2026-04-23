// ============================================================
// src/layouts/AdminLayout.tsx — Главный layout с сайдбаром
// ============================================================

import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Menu, Button, Avatar } from 'antd';
import {
  AppstoreOutlined,
  CoffeeOutlined,
  DollarOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { logout } from '../redux/authSlice';
import type { RootState } from '../redux/store';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: '/decorations', icon: <AppstoreOutlined />, label: 'Декорации' },
  { key: '/fillings', icon: <CoffeeOutlined />, label: 'Начинки' },
  { key: '/prices', icon: <DollarOutlined />, label: 'Цены' },
];

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={220}
        style={{
          background: '#fff',
          boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            fontWeight: 600,
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          🎂 Cake Admin
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 16,
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Avatar icon={<UserOutlined />} />
          <span>{user?.name || 'Админ'}</span>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Выйти
          </Button>
        </Header>

        <Content style={{ margin: 24, background: '#fff', padding: 24, borderRadius: 8 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

// ============================================================
// src/App.tsx
// ============================================================

import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Login from './pages/Login/Login';
import Decorations from './pages/Decorations/Decorations';
import Fillings from './pages/Fillings/Fillings';
import Prices from './pages/Prices/Prices';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import { adminApi } from './api/adminApi';
import { setUser, logout } from './redux/authSlice';
import type { RootState } from './redux/store';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const token = useSelector((s: RootState) => s.auth.token);

  // Проверяем токен при загрузке
  useEffect(() => {
    if (token) {
      dispatch(adminApi.endpoints.getMe.initiate())
        .unwrap()
        .then((user) => dispatch(setUser(user)))
        .catch(() => dispatch(logout()));
    }
  }, [token, dispatch]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/decorations" element={<Decorations />} />
        <Route path="/fillings" element={<Fillings />} />
        <Route path="/prices" element={<Prices />} />
        <Route path="/" element={<Navigate to="/decorations" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;

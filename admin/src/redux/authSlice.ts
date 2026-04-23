// ============================================================
// src/redux/authSlice.ts — Хранение токена и пользователя
// ============================================================

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AdminUser } from '../api/adminApi';

interface AuthState {
  token: string | null;
  user: AdminUser | null;
}

// Восстанавливаем токен из localStorage при запуске
const initialState: AuthState = {
  token: localStorage.getItem('admin_token'),
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: AdminUser }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('admin_token', action.payload.token);
    },
    setUser: (state, action: PayloadAction<AdminUser>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('admin_token');
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;

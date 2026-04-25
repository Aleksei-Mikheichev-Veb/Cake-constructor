// ============================================================
// src/redux/store.ts
// ============================================================

import { configureStore } from '@reduxjs/toolkit';
import { adminApi } from '../api/adminApi';
import authReducer from './authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [adminApi.reducerPath]: adminApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(adminApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


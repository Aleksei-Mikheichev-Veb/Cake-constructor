// ============================================================
// src/api/adminApi.ts — API для админки
// ============================================================
// Отличия от клиентского API:
//   1. Использует import.meta.env (Vite) вместо process.env (CRA)
//   2. Добавляет заголовок Authorization с JWT-токеном
//   3. Эндпоинты для мутаций (POST/PUT/DELETE) — админке нужны CRUD
// ============================================================

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../redux/store';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// ─── Типы ───

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'OWNER' | 'EDITOR';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

export interface Decoration {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  group: 'MAIN' | 'ADDITIONAL' | 'ALL' | 'SMALL';
  byThePiece: boolean;
  minCount: number | null;
  isActive: boolean;
  sortOrder: number;
}

export interface Filling {
  id: string;
  name: string;
  description: string[] | string | null;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  subcategories?: { subcategoryId: string }[];
}

// ─── Категории/подкатегории (для выбора видов тортов у начинки) ───

export interface CategoryTreeNode {
  id: string;
  name: string;
  subcategories: { id: string; name: string }[];
}

// ─── Капкейки (основа/начинка) и кремовые шапки ───
// Три модели с одинаковой формой — используются и для капкейков, и (TopColor) для трайфлов

export interface SimpleCatalogItem {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
}

// ─── Настройки сайта / брендинг ───

export interface SiteSettingsMap {
  [key: string]: string;
}

export interface PriceConfig {
  id: string;
  subcategoryId: string | null;
  categoryId: string | null;
  pricePerKg: number | null;
  fixedPrices: Record<string, number> | null;
  fixedPricesByQuantity: Record<string, number> | null;
  photoPrintPrice: number;
  chocolateLetterPrice: number;
  chocolateNumberPrice: number;
  category?: { name: string };
  subcategory?: { name: string };
}

// ─── API ───

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    // Автоматически добавляем JWT-токен в каждый запрос
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'Decorations', 'Fillings', 'PriceConfigs', 'Auth', 'CategoryTree',
    'CupcakeBases', 'CupcakeFillings', 'TopColors', 'Settings',
  ],
  endpoints: (builder) => ({

    // ─── Авторизация ───
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    getMe: builder.query<AdminUser, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),

    // ─── Декорации ───
    getDecorations: builder.query<Decoration[], void>({
      query: () => '/decorations/all',
      providesTags: ['Decorations'],
    }),

    createDecoration: builder.mutation<Decoration, Partial<Decoration>>({
      query: (body) => ({
        url: '/decorations',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Decorations'],
    }),

    updateDecoration: builder.mutation<Decoration, { id: string; data: Partial<Decoration> }>({
      query: ({ id, data }) => ({
        url: `/decorations/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Decorations'],
    }),

    deleteDecoration: builder.mutation<void, { id: string; hard?: boolean }>({
      query: ({ id, hard }) => ({
        url: `/decorations/${id}${hard ? '?hard=true' : ''}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Decorations'],
    }),

    // ─── Начинки ───
    getFillings: builder.query<Filling[], void>({
      query: () => '/fillings',
      providesTags: ['Fillings'],
    }),

    createFilling: builder.mutation<Filling, Partial<Filling> & { subcategoryIds?: string[] }>({
      query: (body) => ({
        url: '/fillings',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Fillings'],
    }),

    updateFilling: builder.mutation<Filling, { id: string; data: Partial<Filling> & { subcategoryIds?: string[] } }>({
      query: ({ id, data }) => ({
        url: `/fillings/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Fillings'],
    }),

    deleteFilling: builder.mutation<void, string>({
      query: (id) => ({
        url: `/fillings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Fillings'],
    }),

    // ─── Дерево категорий (для выбора видов тортов у начинки) ───
    getCategoryTree: builder.query<CategoryTreeNode[], void>({
      query: () => '/categories',
      providesTags: ['CategoryTree'],
    }),

    // ─── Основы капкейков ───
    getCupcakeBases: builder.query<SimpleCatalogItem[], void>({
      query: () => '/cupcake-bases',
      providesTags: ['CupcakeBases'],
    }),
    createCupcakeBase: builder.mutation<SimpleCatalogItem, Partial<SimpleCatalogItem>>({
      query: (body) => ({ url: '/cupcake-bases', method: 'POST', body }),
      invalidatesTags: ['CupcakeBases'],
    }),
    updateCupcakeBase: builder.mutation<SimpleCatalogItem, { id: string; data: Partial<SimpleCatalogItem> }>({
      query: ({ id, data }) => ({ url: `/cupcake-bases/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['CupcakeBases'],
    }),
    deleteCupcakeBase: builder.mutation<void, string>({
      query: (id) => ({ url: `/cupcake-bases/${id}`, method: 'DELETE' }),
      invalidatesTags: ['CupcakeBases'],
    }),

    // ─── Начинки капкейков ───
    getCupcakeFillings: builder.query<SimpleCatalogItem[], void>({
      query: () => '/cupcake-fillings',
      providesTags: ['CupcakeFillings'],
    }),
    createCupcakeFilling: builder.mutation<SimpleCatalogItem, Partial<SimpleCatalogItem>>({
      query: (body) => ({ url: '/cupcake-fillings', method: 'POST', body }),
      invalidatesTags: ['CupcakeFillings'],
    }),
    updateCupcakeFilling: builder.mutation<SimpleCatalogItem, { id: string; data: Partial<SimpleCatalogItem> }>({
      query: ({ id, data }) => ({ url: `/cupcake-fillings/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['CupcakeFillings'],
    }),
    deleteCupcakeFilling: builder.mutation<void, string>({
      query: (id) => ({ url: `/cupcake-fillings/${id}`, method: 'DELETE' }),
      invalidatesTags: ['CupcakeFillings'],
    }),

    // ─── Кремовые шапки (капкейки + трайфлы) ───
    getTopColors: builder.query<SimpleCatalogItem[], void>({
      query: () => '/top-colors',
      providesTags: ['TopColors'],
    }),
    createTopColor: builder.mutation<SimpleCatalogItem, Partial<SimpleCatalogItem>>({
      query: (body) => ({ url: '/top-colors', method: 'POST', body }),
      invalidatesTags: ['TopColors'],
    }),
    updateTopColor: builder.mutation<SimpleCatalogItem, { id: string; data: Partial<SimpleCatalogItem> }>({
      query: ({ id, data }) => ({ url: `/top-colors/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['TopColors'],
    }),
    deleteTopColor: builder.mutation<void, string>({
      query: (id) => ({ url: `/top-colors/${id}`, method: 'DELETE' }),
      invalidatesTags: ['TopColors'],
    }),

    // ─── Настройки сайта / брендинг ───
    getSiteSettings: builder.query<SiteSettingsMap, void>({
      query: () => '/settings',
      providesTags: ['Settings'],
    }),
    updateSiteSetting: builder.mutation<void, { key: string; value: string }>({
      query: ({ key, value }) => ({ url: `/settings/${key}`, method: 'PUT', body: { value } }),
      invalidatesTags: ['Settings'],
    }),

    // ─── Ценовые конфиги ───
    getPriceConfigs: builder.query<PriceConfig[], void>({
      query: () => '/price-config',
      providesTags: ['PriceConfigs'],
    }),

    updatePriceConfig: builder.mutation<PriceConfig, { id: string; data: Partial<PriceConfig> }>({
      query: ({ id, data }) => ({
        url: `/price-config/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['PriceConfigs'],
    }),

    // ─── Загрузка файлов ───
    // Бэкенд (multer) ждёт поле формы "file" и папку в query-строке —
    // folder ограничен списком ALLOWED_FOLDERS на сервере (routes/upload.ts).
    uploadImage: builder.mutation<{ url: string }, { file: File; folder: string }>({
      query: ({ file, folder }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `/upload?folder=${encodeURIComponent(folder)}`,
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useGetDecorationsQuery,
  useCreateDecorationMutation,
  useUpdateDecorationMutation,
  useDeleteDecorationMutation,
  useGetFillingsQuery,
  useCreateFillingMutation,
  useUpdateFillingMutation,
  useDeleteFillingMutation,
  useGetPriceConfigsQuery,
  useUpdatePriceConfigMutation,
  useUploadImageMutation,
  useGetCategoryTreeQuery,
  useGetCupcakeBasesQuery,
  useCreateCupcakeBaseMutation,
  useUpdateCupcakeBaseMutation,
  useDeleteCupcakeBaseMutation,
  useGetCupcakeFillingsQuery,
  useCreateCupcakeFillingMutation,
  useUpdateCupcakeFillingMutation,
  useDeleteCupcakeFillingMutation,
  useGetTopColorsQuery,
  useCreateTopColorMutation,
  useUpdateTopColorMutation,
  useDeleteTopColorMutation,
  useGetSiteSettingsQuery,
  useUpdateSiteSettingMutation,
} = adminApi;

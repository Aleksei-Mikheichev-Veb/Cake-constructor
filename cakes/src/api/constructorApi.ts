import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Базовый URL API-сервера
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// ─── Типы ответов от сервера ───

export interface CategoryFromServer {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    imageName: string | null;
    tooltip: string;
    hasSubcategories: boolean;
    isActive: boolean;
    sortOrder: number;
    subcategories: SubcategoryFromServer[];
}

export interface SubcategoryFromServer {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    imageName: string | null;
    tooltip: string;
    categoryId: string;
    isActive: boolean;
    sortOrder: number;
}

export interface FillingFromServer {
    id: string;
    name: string;
    description: string | null;  // с API приходит строка через запятую
    image: string | null;
    isActive: boolean;
    sortOrder: number;
}

export interface DecorationFromServer {
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

export interface TemplateFromServer {
    id: string;
    name: string;
    description: string;
    image: string;
    colorOptions?: number;
    showColorCountSelector?: boolean;
    isActive: boolean;
    sortOrder: number;
}

export interface SmudgeFromServer {
    id: string;
    name: string;
    description: string;
    image: string;
    isActive: boolean;
    sortOrder: number;
}

export interface ShapeFromServer {
    id: string;
    name: string;
    description: string;
    image: string;
    isActive: boolean;
    sortOrder: number;
}

export interface ColorOptionFromServer {
    id: string;
    name: string;
    description: string;
    image: string;
    target: 'CAKE' | 'MOUSSE';
    colorOptions?: number;
    showColorCountSelector?: boolean;
    isActive: boolean;
    sortOrder: number;
}

export interface GlossOptionFromServer {
    id: string;
    name: string;
    description: string;
    image: string;
    isActive: boolean;
    sortOrder: number;
}

export interface ServingOptionFromServer {
    id: string;
    portions?: number | null;
    quantity?: number | null;
    weightMin?: number | null;
    weightMax?: number | null;
    height?: number | null;
    diameter?: number | null;
    label: string;
    subcategoryId?: string | null;
    categoryId?: string | null;
    isActive: boolean;
    sortOrder: number;
}

export interface ConstructorControlFromServer {
    id: string;
    controlType: string;
    title: string | null;
    subcategoryId: string | null;
    categoryId: string | null;
    sortOrder: number;
    isActive: boolean;
    settings: Record<string, any> | null;
}

export interface PriceConfigFromServer {
    id: string;
    subcategoryId: string | null;
    categoryId: string | null;
    pricePerKg: number | null;
    fixedPrices: Record<string, number> | null;
    fixedPricesByQuantity: Record<string, number> | null;
    photoPrintPrice: number;
    chocolateLetterPrice: number;
    chocolateNumberPrice: number;
}

export interface SiteSettings {
    maxMainDecorations: string;
    maxReferenceImages: string;
    maxStylingDecorations: string;
    tieredMinPortions: string;
    tieredMaxPortions: string;
    tieredMaxLayers: string;
    // Брендинг
    siteName: string;
    heroTitle: string;
    heroSubtitle: string;
    heroTagline: string;
    chefName: string;
    chefDescription1: string;
    chefDescription2: string;
    chefDescription3: string;
    phone: string;
    email: string;
    address: string;
    vkUrl: string;
    tgUrl: string;
    okUrl: string;
    footerTagline: string;
    [key: string]: string;
}

export interface OrderPayload {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    comment?: string;
    totalPrice: number;
    orderSnapshot: Record<string, any>;
}

export interface OrderResponse {
    id: string;
    customerName: string;
    customerPhone: string;
    status: string;
    createdAt: string;
}
export interface CupcakeBaseFromServer {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    isActive: boolean;
    sortOrder: number;
}

export interface CupcakeFillingFromServer {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    isActive: boolean;
    sortOrder: number;
}

export interface TopColorFromServer {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    isActive: boolean;
    sortOrder: number;
}
// ============================================================
// API Definition
// ============================================================

export const constructorApi = createApi({
    reducerPath: 'constructorApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: [
        'Categories',
        'Fillings',
        'Decorations',
        'Templates',
        'Smudges',
        'Shapes',
        'Colors',
        'Gloss',
        'Servings',
        'Controls',
        'PriceConfig',
        'Settings',
        'CupcakeBases',
        'CupcakeFillings',
        'TopColors'
    ],
    endpoints: (builder) => ({

        // ─── Категории ───
        getCategories: builder.query<CategoryFromServer[], void>({
            query: () => '/categories',
            providesTags: ['Categories'],
        }),

        // ─── Подкатегории ───
        getSubcategories: builder.query<SubcategoryFromServer[], string>({
            query: (categoryId) => `/subcategories?categoryId=${categoryId}`,
        }),

        // ─── Начинки ───
        // Для тортов: getFillings('biscuit')
        // Для трайфлов с начинками: можно добавить отдельный query
        getFillings: builder.query<FillingFromServer[], string>({
            query: (subcategoryId) => `/fillings?subcategoryId=${subcategoryId}`,
            providesTags: ['Fillings'],
        }),

        getAllFillings: builder.query<FillingFromServer[], void>({
            query: () => '/fillings',
            providesTags: ['Fillings'],
        }),

        // ─── Декорации ───
        // getDecorations('main') | getDecorations('additional') | getDecorations('all') | getDecorations('small')
        getDecorations: builder.query<DecorationFromServer[], string | undefined>({
            query: (group) => group ? `/decorations?group=${group}` : '/decorations',
            providesTags: ['Decorations'],
        }),

        // ─── Шаблоны оформления ───
        getTemplates: builder.query<TemplateFromServer[], void>({
            query: () => '/templates',
            providesTags: ['Templates'],
        }),

        // ─── Подтёки ───
        getSmudges: builder.query<SmudgeFromServer[], void>({
            query: () => '/smudges',
            providesTags: ['Smudges'],
        }),

        // ─── Формы ───
        // getShapes('bento') | getShapes('mousse') | getShapes('tiered')
        getShapes: builder.query<ShapeFromServer[], string>({
            query: (subcategoryId) => `/shapes?subcategoryId=${subcategoryId}`,
            providesTags: ['Shapes'],
        }),

        // ─── Цвета ───
        // getColors('CAKE') | getColors('MOUSSE')
        getColors: builder.query<ColorOptionFromServer[], string>({
            query: (target) => `/colors?target=${target}`,
            providesTags: ['Colors'],
        }),

        // ─── Глянец (муссовые) ───
        getGloss: builder.query<GlossOptionFromServer[], void>({
            query: () => '/gloss',
            providesTags: ['Gloss'],
        }),

        // ─── Порции/вес ───
        // Для тортов: getServings({ subcategoryId: 'biscuit' })
        // Для капкейков: getServings({ categoryId: 'cupcakes' })
        getServings: builder.query<ServingOptionFromServer[], { subcategoryId?: string; categoryId?: string }>({
            query: ({ subcategoryId, categoryId }) => {
                const params = new URLSearchParams();
                if (subcategoryId) params.set('subcategoryId', subcategoryId);
                if (categoryId) params.set('categoryId', categoryId);
                return `/servings?${params.toString()}`;
            },
            providesTags: ['Servings'],
        }),

        // ─── Контролы конструктора ───
        // Для тортов: getControls({ subcategoryId: 'biscuit' })
        // Для десертов: getControls({ categoryId: 'cupcakes' })
        getControls: builder.query<ConstructorControlFromServer[], { subcategoryId?: string; categoryId?: string }>({
            query: ({ subcategoryId, categoryId }) => {
                const params = new URLSearchParams();
                if (subcategoryId) params.set('subcategoryId', subcategoryId);
                if (categoryId) params.set('categoryId', categoryId);
                return `/controls?${params.toString()}`;
            },
            providesTags: ['Controls'],
        }),
        // Основы капкейков
        getCupcakeBases: builder.query<CupcakeBaseFromServer[], void>({
            query: () => '/cupcake-bases',
            providesTags: ['CupcakeBases'],
        }),

        // Начинки капкейков
        getCupcakeFillings: builder.query<CupcakeFillingFromServer[], void>({
            query: () => '/cupcake-fillings',
            providesTags: ['CupcakeFillings'],
        }),

        // Цвета кремовых шапок
        getTopColors: builder.query<TopColorFromServer[], void>({
            query: () => '/top-colors',
            providesTags: ['TopColors'],
        }),

        // ─── Ценовой конфиг ───
        // getPriceConfig('biscuit') | getPriceConfig('cupcakes')
        getPriceConfig: builder.query<PriceConfigFromServer, string>({
            query: (key) => `/price-config/${key}`,
            providesTags: ['PriceConfig'],
        }),

        // ─── Настройки сайта ───
        getSettings: builder.query<SiteSettings, void>({
            query: () => '/settings',
            providesTags: ['Settings'],
        }),

        // ─── Создание заказа ───
        createOrder: builder.mutation<OrderResponse, OrderPayload>({
            query: (body) => ({
                url: '/orders',
                method: 'POST',
                body,
            }),
        }),
    }),
});

// ─── Экспорт хуков ───
// RTK Query автоматически генерирует хуки из endpoints
export const {
    useGetCategoriesQuery,
    useGetSubcategoriesQuery,
    useGetFillingsQuery,
    useGetAllFillingsQuery,
    useGetDecorationsQuery,
    useGetTemplatesQuery,
    useGetSmudgesQuery,
    useGetShapesQuery,
    useGetColorsQuery,
    useGetGlossQuery,
    useGetServingsQuery,
    useGetControlsQuery,
    useGetPriceConfigQuery,
    useGetSettingsQuery,
    useCreateOrderMutation,
    useGetCupcakeBasesQuery,
    useGetCupcakeFillingsQuery,
    useGetTopColorsQuery
} = constructorApi;
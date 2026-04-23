
import { configureStore } from '@reduxjs/toolkit';
import cakeConstructorReducer from './cakeConstructorSlice';
import { constructorApi } from '../api/constructorApi';

export const store = configureStore({
    reducer: {
        cakeConstructor: cakeConstructorReducer,
        // RTK Query автоматически добавляет свой reducer
        [constructorApi.reducerPath]: constructorApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    'cakeConstructor/addReferenceImage',
                    // RTK Query внутренние экшены
                    constructorApi.reducerPath + '/executeMutation/fulfilled',
                ],
                ignoredPaths: ['cakeConstructor.referenceImages'],
            },
        }).concat(constructorApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

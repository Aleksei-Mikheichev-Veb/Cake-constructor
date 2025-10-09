import { configureStore } from "@reduxjs/toolkit";
import cakeReducer from './cakeConstructorSlice'

export const store = configureStore({
    reducer: {
        cakeConstructor: cakeReducer
    }
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
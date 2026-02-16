import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { additionalDecorAdapter, mainDecorAdapter } from '../cakeConstructorSlice';

// 1. Селектор всего слайса (удобно для дальнейших createSelector)
export const selectCakeConstructor = (state: RootState) => state.cakeConstructor;

// 2. Селекторы на конкретные EntityState
export const selectMainDecorationsState = createSelector(
    selectCakeConstructor,
    (cake) => cake.mainDecorations
);

export const selectAdditionalDecorationsState = createSelector(
    selectCakeConstructor,
    (cake) => cake.additionalDecorations
);

// 3. Готовые селекторы от адаптеров (самое важное исправление)
export const {
    selectAll: selectAllMainDecorations,
} = mainDecorAdapter.getSelectors(selectMainDecorationsState);

export const {
    selectAll: selectAllAdditionalDecorations,
} = additionalDecorAdapter.getSelectors(selectAdditionalDecorationsState);

// 4. Селектор цены (теперь использует готовые массивы)
export const selectCakePrice = createSelector(
    (state: RootState) => state.cakeConstructor.numberOfServing,
    selectAllMainDecorations,
    selectAllAdditionalDecorations,
    (state: RootState) => state.cakeConstructor.imagePreview,

    (serving, mainDecor, addDecor, imagePreview) => {
        const baseMin = serving ? serving.weightMin * 1700 : 0;
        const baseMax = serving ? serving.weightMax * 1700 : 0;
        const photoPrice = imagePreview ? 650 : 0;

        const mainPrice = mainDecor.reduce((sum, d) => sum + d.price * d.count, 0);

        const addPrice = addDecor.reduce((sum, d) => sum + d.price * d.count, 0);

        const common = mainPrice + addPrice + photoPrice;

        return {
            minPrice: Math.round(baseMin + common),
            maxPrice: Math.round(baseMax + common),
        };
    }
);
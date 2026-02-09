import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectCakeConstructor = (state: RootState) => state.cakeConstructor;

export const selectCakePrice = createSelector(
    (state: RootState) => state.cakeConstructor.numberOfServing,
    (state: RootState) => state.cakeConstructor.mainDecorations,
    (state: RootState) => state.cakeConstructor.additionalDecorations,
    (state: RootState) => state.cakeConstructor.imagePreview,

    (serving, mainDeco, addDecors, imagePreview) => {
        const baseMin = serving ? serving.weightMin * 1700 : 0;
        const baseMax = serving ? serving.weightMax * 1700 : 0;

        const photoPrice = imagePreview ? 650 : 0;

        const mainPrice = mainDeco
            ? (mainDeco.byThePiece && mainDeco.minCount
            ? mainDeco.price * mainDeco.minCount
            : mainDeco.price) || 0
            : 0;

        const addPrice = addDecors.reduce((sum, d) => sum + (d.price || 0), 0);

        const min = Math.round(baseMin + mainPrice + addPrice + photoPrice);
        const max = Math.round(baseMax + mainPrice + addPrice + photoPrice);

        return { minPrice: min, maxPrice: max };
    }
);
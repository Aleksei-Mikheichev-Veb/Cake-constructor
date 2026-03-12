import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { mainDecorAdapter, additionalDecorAdapter } from '../cakeConstructorSlice';
import { cakePriceConfig } from '../../components/pages/ProductPage/CakeConstructor/config/cakePriceConfig';

const { selectAll: selectAllMain } = mainDecorAdapter.getSelectors(
    (state: RootState) => state.cakeConstructor.mainDecorations
);
const { selectAll: selectAllAdd } = additionalDecorAdapter.getSelectors(
    (state: RootState) => state.cakeConstructor.additionalDecorations
);

export const selectCakePriceRange = createSelector(
    (state: RootState) => state.cakeConstructor.numberOfServing,
    (state: RootState) => state.cakeConstructor.subcategory,
    selectAllMain,
    selectAllAdd,
    (state: RootState) => state.cakeConstructor.imagePreview,

    (serving, subcategory, mainDecors, addDecors, imagePreview) => {
        if (!serving || !subcategory) {
            return { min: 0, max: 0 };
        }

        const config = cakePriceConfig[subcategory];
        if (!config) return { min: 0, max: 0 };

        // Базовая стоимость торта
        let baseMin = 0;
        let baseMax = 0;

        if (config.pricePerKg) {
            // Линейная цена за кг (бисквит, мусс и т.д.)
            baseMin = serving.weightMin * config.pricePerKg;
            baseMax = serving.weightMax * config.pricePerKg;
        } else if (config.fixedPrices) {
            // Фиксированные цены (бенто и подобные)
            const key = serving.weightMin;
            const fixed = config.fixedPrices[key];
            baseMin = fixed || 0;
            baseMax = fixed || 0;
        }

        // Декорации
        const decorsPrice =
            mainDecors.reduce((sum, d) => sum + d.price * d.count, 0) +
            addDecors.reduce((sum, d) => sum + d.price * d.count, 0);

        // Фотопечать
        const photoPrice = imagePreview ? 650 : 0;

        const totalMin = Math.round(baseMin + decorsPrice + photoPrice);
        const totalMax = Math.round(baseMax + decorsPrice + photoPrice);

        return {
            min: totalMin,
            max: totalMax,
            currency: '₽',
            isRange: totalMin !== totalMax,
        };
    }
);
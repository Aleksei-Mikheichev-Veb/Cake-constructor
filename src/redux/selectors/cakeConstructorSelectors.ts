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

// export const selectCakePriceRange = createSelector(
//     (state: RootState) => state.cakeConstructor.numberOfServing,
//     (state: RootState) => state.cakeConstructor.subcategory,
//     selectAllMain,
//     selectAllAdd,
//     (state: RootState) => state.cakeConstructor.imagePreview,
//
//     (serving, subcategory, mainDecors, addDecors, imagePreview) => {
//         if (!serving || !subcategory) {
//             return { min: 0, max: 0 };
//         }
//
//         const config = cakePriceConfig[subcategory];
//         if (!config) return { min: 0, max: 0 };
//
//         // Базовая стоимость торта
//         let baseMin = 0;
//         let baseMax = 0;
//
//         if (config.pricePerKg) {
//             // Линейная цена за кг (бисквит, мусс и т.д.)
//             baseMin = serving.weightMin * config.pricePerKg;
//             baseMax = serving.weightMax * config.pricePerKg;
//         } else if (config.fixedPrices) {
//             // Фиксированные цены (бенто и подобные)
//             const key = serving.weightMin;
//             const fixed = config.fixedPrices[key];
//             baseMin = fixed || 0;
//             baseMax = fixed || 0;
//         }
//
//         // Декорации
//         const decorsPrice =
//             mainDecors.reduce((sum, d) => sum + d.price * d.count, 0) +
//             addDecors.reduce((sum, d) => sum + d.price * d.count, 0);
//
//         // Фотопечать
//         const photoPrice = imagePreview ? 650 : 0;
//
//         const totalMin = Math.round(baseMin + decorsPrice + photoPrice);
//         const totalMax = Math.round(baseMax + decorsPrice + photoPrice);
//
//         return {
//             min: totalMin,
//             max: totalMax,
//             currency: '₽',
//             isRange: totalMin !== totalMax,
//         };
//     }
// );
export const selectCakePriceRange = createSelector(
    (state: RootState) => state.cakeConstructor.numberOfServing,
    (state: RootState) => state.cakeConstructor.subcategory,
    (state: RootState) => state.cakeConstructor.tiers,  // ← добавляем tiers
    selectAllMain,
    selectAllAdd,
    (state: RootState) => state.cakeConstructor.imagePreview,

    (serving, subcategory, tiers, mainDecors, addDecors, imagePreview) => {
        if (!subcategory) {
            return { min: 0, max: 0 };
        }

        const config = cakePriceConfig[subcategory];
        if (!config) return { min: 0, max: 0 };

        let basePrice = 0;

        if (subcategory === 'tiered' && tiers) {
            // Для ярусных — цена по порциям (tiers)
            const weightKg = tiers.portions * 0.2; // 200 г = 0.2 кг
            basePrice = weightKg * (config.pricePerKg || 0);
        } else if (serving) {
            // Для остальных — как раньше
            if (config.pricePerKg) {
                basePrice = serving.weightMin * config.pricePerKg; // или среднее, если нужно
            } else if (config.fixedPrices) {
                const key = serving.weightMin;
                basePrice = config.fixedPrices[key] || 0;
            }
        }

        const decorsPrice =
            mainDecors.reduce((sum, d) => sum + d.price * d.count, 0) +
            addDecors.reduce((sum, d) => sum + d.price * d.count, 0);

        const photoPrice = imagePreview ? 650 : 0;

        const total = Math.round(basePrice + decorsPrice + photoPrice);

        return {
            min: total,
            max: total,          // для ярусных обычно фиксированная цена
            currency: '₽',
            isRange: false,
        };
    }
);
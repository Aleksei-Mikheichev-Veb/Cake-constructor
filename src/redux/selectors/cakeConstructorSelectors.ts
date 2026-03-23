import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { mainDecorAdapter, additionalDecorAdapter } from '../cakeConstructorSlice';
import { cakePriceConfig } from '../../components/pages/ProductPage/CakeConstructor/config/cakePriceConfig';
import { SelectedDecoration } from '../../data/decorationsMain';

const { selectAll: selectAllMain } = mainDecorAdapter.getSelectors(
  (state: RootState) => state.cakeConstructor.mainDecorations
);
const { selectAll: selectAllAdd } = additionalDecorAdapter.getSelectors(
  (state: RootState) => state.cakeConstructor.additionalDecorations
);

export const selectCakePriceRange = createSelector(
  (state: RootState) => state.cakeConstructor.numberOfServing,
  (state: RootState) => state.cakeConstructor.subcategory,
  (state: RootState) => state.cakeConstructor.tiers,
  selectAllMain,
  selectAllAdd,
  (state: RootState) => state.cakeConstructor.imagePreview,
  (state: RootState) => state.cakeConstructor.chocolateText, // ← новое поле

  (serving, subcategory, tiers, mainDecors, addDecors, imagePreview, chocolateText) => {
    if (!subcategory) {
      return { min: 0, max: 0, currency: '₽', isRange: false };
    }

    const config = cakePriceConfig[subcategory];
    if (!config) return { min: 0, max: 0, currency: '₽', isRange: false };

    // 1. Базовая цена торта
    let basePrice = 0;

    if (subcategory === 'tiered' && tiers) {
      const weightKg = tiers.portions * 0.2; // 200 г = 0.2 кг
      basePrice = weightKg * (config.pricePerKg || 0);
    } else if (serving) {
      if (config.pricePerKg) {
        basePrice = serving.weightMin * config.pricePerKg;
      } else if (config.fixedPrices) {
        const key = serving.weightMin;
        basePrice = config.fixedPrices[key] || 0;
      }
    }

    // 2. Декорации (обычные)
    const isChocolateDeco = (d: SelectedDecoration | undefined) =>
      d?.id === 'chocolate_letters' || d?.id === 'chocolate_numbers';

    const decorsPrice = mainDecors.reduce((sum, d) => {
      if (!d || isChocolateDeco(d)) return sum;
        return sum + d.price * (d.count || 1);
      }, 0) + addDecors.reduce((sum, d) => {
        if (!d || isChocolateDeco(d)) return sum;
        return sum + d.price * (d.count || 1);
      }, 0);
    // 3. Фотопечать
    const photoPrice = imagePreview ? 650 : 0;

    // 4. Шоколадные надписи и цифры
    const chocolatePrice = (() => {
      if (!chocolateText) return 0;

      const letters = chocolateText?.letters?.replace(/\s+/g, '') || ''; // ← убираем все пробелы
      const numbers = chocolateText?.numbers?.replace(/\s+/g, '') || '';// const letters = chocolateText.letters || '';

      const pricePerLetter = 30;   // цена за 1 букву/символ
      const pricePerNumber = 100;   // цена за 1 цифру (обычно дороже)

      return (letters.length * pricePerLetter) + (numbers.length * pricePerNumber);
    })();

    // Итоговая цена
    const total = Math.round(basePrice + decorsPrice + photoPrice + chocolatePrice);

    return {
      min: total,
      max: total,
      currency: '₽',
      isRange: false,
      breakdown: { // ← для отладки или показа в UI (опционально)
        base: Math.round(basePrice),
        decors: decorsPrice,
        photo: photoPrice,
        chocolate: chocolatePrice,
      },
    };
  }
);
// import { createSelector } from '@reduxjs/toolkit';
// import { RootState } from '../store';
// import { mainDecorAdapter, additionalDecorAdapter } from '../cakeConstructorSlice';
// import { cakePriceConfig } from '../../components/pages/ProductPage/CakeConstructor/config/cakePriceConfig';

// const { selectAll: selectAllMain } = mainDecorAdapter.getSelectors(
//     (state: RootState) => state.cakeConstructor.mainDecorations
// );
// const { selectAll: selectAllAdd } = additionalDecorAdapter.getSelectors(
//     (state: RootState) => state.cakeConstructor.additionalDecorations
// );

// export const selectCakePriceRange = createSelector(
//     (state: RootState) => state.cakeConstructor.numberOfServing,
//     (state: RootState) => state.cakeConstructor.subcategory,
//     (state: RootState) => state.cakeConstructor.tiers,  // ← добавляем tiers
//     selectAllMain,
//     selectAllAdd,
//     (state: RootState) => state.cakeConstructor.imagePreview,

//     (serving, subcategory, tiers, mainDecors, addDecors, imagePreview) => {
//         if (!subcategory) {
//             return { min: 0, max: 0 };
//         }

//         const config = cakePriceConfig[subcategory];
//         if (!config) return { min: 0, max: 0 };

//         let basePrice = 0;

//         if (subcategory === 'tiered' && tiers) {
//             // Для ярусных — цена по порциям (tiers)
//             const weightKg = tiers.portions * 0.2; // 200 г = 0.2 кг
//             basePrice = weightKg * (config.pricePerKg || 0);
//         } else if (serving) {
//             // Для остальных — как раньше
//             if (config.pricePerKg) {
//                 basePrice = serving.weightMin * config.pricePerKg; // или среднее, если нужно
//             } else if (config.fixedPrices) {
//                 const key = serving.weightMin;
//                 basePrice = config.fixedPrices[key] || 0;
//             }
//         }

//         const decorsPrice =
//             mainDecors.reduce((sum, d) => sum + d.price * d.count, 0) +
//             addDecors.reduce((sum, d) => sum + d.price * d.count, 0);

//         const photoPrice = imagePreview ? 650 : 0;

//         const total = Math.round(basePrice + decorsPrice + photoPrice);

//         return {
//             min: total,
//             max: total,          // для ярусных обычно фиксированная цена
//             currency: '₽',
//             isRange: false,
//         };
//     }
// );
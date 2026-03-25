import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { mainDecorAdapter, additionalDecorAdapter } from '../cakeConstructorSlice';
import { dessertPriceConfig, DessertType } from '../../components/pages/ProductPage/CakeConstructor/config/dessertPriceConfig';

const { selectAll: selectAllMain } = mainDecorAdapter.getSelectors(
  (state: RootState) => state.cakeConstructor.mainDecorations
);
const { selectAll: selectAllAdd } = additionalDecorAdapter.getSelectors(
  (state: RootState) => state.cakeConstructor.additionalDecorations
);

export const selectDessertPriceRange = createSelector(
  (state: RootState) => state.cakeConstructor.numberOfServing,
  (state: RootState) => state.cakeConstructor.subcategory,
  (state: RootState) => state.cakeConstructor.dessertType,
  (state: RootState) => state.cakeConstructor.quantity,
  selectAllMain,
  selectAllAdd,
  (state: RootState) => state.cakeConstructor.imagePreview,
  (state: RootState) => state.cakeConstructor.chocolateText,

  (serving, subcategory, dessertType, quantity, mainDecors, addDecors, imagePreview, chocolateText) => {

    // === ОПРЕДЕЛЯЕМ КЛЮЧ ДЛЯ КОНФИГА ===
    let key: DessertType;

    if (dessertType === 'truffle' || dessertType === 'cupcake') {
      key = dessertType;
    } 
    else if (subcategory) {
      key = subcategory as DessertType;   // biscuit, bento, mousse и т.д.
    } 
    else {
      return { min: 0, max: 0, currency: '₽', isRange: false };
    }

    const config = dessertPriceConfig[key];

    console.log('key:', key);
    console.log('config:', config);

    if (!config) {
      return { min: 0, max: 0, currency: '₽', isRange: false };
    }

    let basePrice = 0;

    // === ТОРТЫ (по весу) ===
    if (config.pricePerKg && serving) {
      basePrice = serving.weightMin * config.pricePerKg;
    } 
    else if (config.fixedPrices && serving) {
      basePrice = config.fixedPrices[serving.weightMin] || 0;
    } 
    // === ТРАЙФЛЫ И КАПКЕЙКИ (по количеству) ===
    else if (config.fixedPricesByQuantity && quantity !== null && quantity !== undefined) {
      basePrice = config.fixedPricesByQuantity[+quantity.quantity] || 0;
    }

    // 2. Декорации (исключаем шоколадные)
    const isChocolateDeco = (d: any) => d?.id === 'chocolate_letters' || d?.id === 'chocolate_numbers';

    const decorsPrice = 
      mainDecors.reduce((sum, d) => !d || isChocolateDeco(d) ? sum : sum + d.price * (d.count || 1), 0) +
      addDecors.reduce((sum, d) => !d || isChocolateDeco(d) ? sum : sum + d.price * (d.count || 1), 0);

    const photoPrice = imagePreview ? 650 : 0;

    const chocolatePrice = (() => {
      if (!chocolateText) return 0;
      const letters = chocolateText.letters?.replace(/\s+/g, '') || '';
      const numbers = chocolateText.numbers?.replace(/\s+/g, '') || '';
      return (letters.length * 150) + (numbers.length * 200);
    })();

    const total = Math.round(basePrice + decorsPrice + photoPrice + chocolatePrice);

    return {
      min: total,
      max: total,
      currency: '₽',
      isRange: false,
    };
  }
);
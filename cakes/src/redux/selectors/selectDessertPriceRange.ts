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
  (state: RootState) => state.cakeConstructor.tiers,
  selectAllMain,
  selectAllAdd,
  (state: RootState) => state.cakeConstructor.imagePreview,
  (state: RootState) => state.cakeConstructor.chocolateText,

  (serving, subcategory, dessertType, quantity, tiers, mainDecors, addDecors, imagePreview, chocolateText) => {

    const key = (dessertType === 'cake' ? subcategory : dessertType) as DessertType;
    const config = dessertPriceConfig[key];

    if (!config) {
      return { min: 0, max: 0, currency: '₽', isRange: false };
    }

    let basePriceMin = 0;
    let basePriceMax = 0;

    // === ЯРУСНЫЙ ТОРТ (цена по весу из tiers.portions) ===
    if (key === 'tiered' && tiers && config.pricePerKg) {
      const weight = tiers.portions * 0.2;
      basePriceMin = weight * config.pricePerKg;
      basePriceMax = basePriceMin; // вес точный, не диапазон
    }
    // === ТОРТЫ с pricePerKg (бисквитный, детский, муссовый, 3d) ===
    else if (config.pricePerKg && serving) {
      basePriceMin = serving.weightMin * config.pricePerKg;
      basePriceMax = serving.weightMax * config.pricePerKg;
    }
    // === ТОРТЫ с фикс. ценой по весу (бенто) ===
    else if (config.fixedPrices && serving) {
      basePriceMin = config.fixedPrices[serving.weightMin] || 0;
      basePriceMax = basePriceMin; // фиксированная цена
    }
    // === ТРАЙФЛЫ И КАПКЕЙКИ (по количеству штук) ===
    else if (config.fixedPricesByQuantity && quantity) {
      const qty = typeof quantity === 'object' ? quantity.id : quantity;
      basePriceMin = config.fixedPricesByQuantity[qty] || 0;
      basePriceMax = basePriceMin;
    }

    // Декорации
    const isChocolateDeco = (d: any) => d?.id === 'chocolate_letters' || d?.id === 'chocolate_numbers';

    const decorsPrice =
      mainDecors.reduce((sum, d) => {
        if (!d || isChocolateDeco(d) || d.price === undefined) return sum;
        return sum + d.price * (d.count || 1);
      }, 0) +
      addDecors.reduce((sum, d) => {
        if (!d || isChocolateDeco(d) || d.price === undefined) return sum;
        return sum + d.price * (d.count || 1);
      }, 0);

    // Фотопечать
    const photoPrice = imagePreview ? 650 : 0;

    // Шоколадные надписи и цифры
    const chocolatePrice = (() => {
      if (!chocolateText) return 0;
      const letters = chocolateText.letters?.replace(/\s+/g, '') || '';
      const numbers = chocolateText.numbers?.replace(/\s+/g, '') || '';
      return (letters.length * 150) + (numbers.length * 200);
    })();

    const extras = decorsPrice + photoPrice + chocolatePrice;
    const totalMin = Math.round(basePriceMin + extras);
    const totalMax = Math.round(basePriceMax + extras);

    return {
      min: totalMin,
      max: totalMax,
      currency: '₽',
      isRange: totalMin !== totalMax,
    };
  }
);
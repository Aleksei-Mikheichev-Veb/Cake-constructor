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

        // const key: DessertType = (dessertType || subcategory) as DessertType;
        const key = (dessertType === 'cake' ? subcategory : dessertType) as DessertType;
        const config = dessertPriceConfig[key];

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
        // === ТРАЙФЛЫ И КАПКЕЙКИ (по количеству штук) ===
        else if (config.fixedPricesByQuantity && quantity) {
            const qty = typeof quantity === 'object' ? quantity.id : quantity; // на случай если приходит объект
            basePrice = config.fixedPricesByQuantity[qty] || 0;
        }

        // 2. Декорации (обычные) — с защитой от undefined price
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

        // 3. Фотопечать
        const photoPrice = imagePreview ? 650 : 0;

        // 4. Шоколадные надписи и цифры
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
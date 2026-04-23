// Считает цену на основе:
//   1. PriceConfig с сервера (цена за кг, фиксированные цены, стоимость допов)
//   2. Текущего состояния конструктора из Redux
// ============================================================

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { mainDecorAdapter, additionalDecorAdapter } from '../redux/cakeConstructorSlice';
import { useGetPriceConfigQuery, PriceConfigFromServer } from '../api/constructorApi';

const { selectAll: selectAllMain } = mainDecorAdapter.getSelectors(
    (state: RootState) => state.cakeConstructor.mainDecorations
);
const { selectAll: selectAllAdd } = additionalDecorAdapter.getSelectors(
    (state: RootState) => state.cakeConstructor.additionalDecorations
);

interface PriceRange {
    min: number;
    max: number;
    currency: string;
    isRange: boolean;
}

/**
 * Хук для расчёта цены.
 * @param priceKey — subcategoryId ('biscuit') или categoryId ('cupcakes')
 */
export function usePriceCalculation(priceKey: string | null): PriceRange & { isLoading: boolean } {
    const { data: config, isLoading } = useGetPriceConfigQuery(priceKey!, {
        skip: !priceKey,
    });

    // Данные из Redux store
    const serving = useSelector((s: RootState) => s.cakeConstructor.numberOfServing);
    const quantity = useSelector((s: RootState) => s.cakeConstructor.quantity);
    const tiers = useSelector((s: RootState) => s.cakeConstructor.tiers);
    const imagePreview = useSelector((s: RootState) => s.cakeConstructor.imagePreview);
    const chocolateText = useSelector((s: RootState) => s.cakeConstructor.chocolateText);
    const mainDecors = useSelector(selectAllMain);
    const addDecors = useSelector(selectAllAdd);

    const result = useMemo<PriceRange>(() => {
        if (!config) {
            return { min: 0, max: 0, currency: '₽', isRange: false };
        }

        let basePriceMin = 0;
        let basePriceMax = 0;

        // === ЯРУСНЫЙ ТОРТ (цена по весу из tiers.portions) ===
        if (priceKey === 'tiered' && tiers && config.pricePerKg) {
            const weight = tiers.portions * 0.2;
            basePriceMin = weight * config.pricePerKg;
            basePriceMax = basePriceMin;
        }
        // === ТОРТЫ с pricePerKg ===
        else if (config.pricePerKg && serving) {
            basePriceMin = serving.weightMin * config.pricePerKg;
            basePriceMax = serving.weightMax * config.pricePerKg;
        }
        // === ТОРТЫ с фикс. ценой по весу (бенто) ===
        else if (config.fixedPrices && serving) {
            const key = String(serving.weightMin);
            basePriceMin = config.fixedPrices[key] || 0;
            basePriceMax = basePriceMin;
        }
        // === ТРАЙФЛЫ И КАПКЕЙКИ (по количеству штук) ===
        else if (config.fixedPricesByQuantity && quantity) {
            const qty = typeof quantity === 'object' && quantity !== null
                ? String((quantity as any).id)
                : String(quantity);
            basePriceMin = config.fixedPricesByQuantity[qty] || 0;
            basePriceMax = basePriceMin;
        }

        // Декорации (исключаем шоколадные буквы/цифры — они считаются отдельно)
        const isChocolateDeco = (d: any) =>
            d?.id === 'chocolate_letters' ||
            d?.id === 'chocolate_numbers' ||
            d?.id === 'add_choco_letters' ||
            d?.id === 'add_choco_num' ||
            d?.id === 'all_choco_let' ||
            d?.id === 'all_choco_num';

        const decorsPrice =
            mainDecors.reduce((sum, d) => {
                if (!d || isChocolateDeco(d) || d.price === undefined) return sum;
                return sum + d.price * (d.count || 1);
            }, 0) +
            addDecors.reduce((sum, d) => {
                if (!d || isChocolateDeco(d) || d.price === undefined) return sum;
                return sum + d.price * (d.count || 1);
            }, 0);

        // Фотопечать — цена из конфига сервера
        const photoPrice = imagePreview ? (config.photoPrintPrice || 650) : 0;

        // Шоколадные надписи — цены из конфига сервера
        const chocolatePrice = (() => {
            if (!chocolateText) return 0;
            const letters = chocolateText.letters?.replace(/\s+/g, '') || '';
            const numbers = chocolateText.numbers?.replace(/\s+/g, '') || '';
            const letterPrice = config.chocolateLetterPrice || 150;
            const numberPrice = config.chocolateNumberPrice || 200;
            return (letters.length * letterPrice) + (numbers.length * numberPrice);
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
    }, [config, serving, quantity, tiers, mainDecors, addDecors, imagePreview, chocolateText, priceKey]);

    return { ...result, isLoading };
}
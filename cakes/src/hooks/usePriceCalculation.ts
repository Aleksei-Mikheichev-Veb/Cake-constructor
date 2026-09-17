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
    // Разбивка по шоколадному тексту — сумма за все введённые буквы/цифры,
    // а не цена одной штуки. Нужна для сообщения кондитеру, чтобы не путать
    // с ценой самой декорации-маркера «Шоколадные буквы/цифры».
    chocolateLettersPrice: number;
    chocolateNumbersPrice: number;
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
            return { min: 0, max: 0, currency: '₽', isRange: false, chocolateLettersPrice: 0, chocolateNumbersPrice: 0 };
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

        // Декорации (исключаем шоколадные буквы/цифры — они считаются отдельно
        // по количеству введённых символов, а не как обычная декорация).
        // Сравниваем по окончанию id, а не точным строкам — id приходят с
        // разными префиксами (add_/all_) в зависимости от группы декораций,
        // и точное сравнение раньше пропускало часть вариантов (например,
        // 'add_choco_numbers' не совпадало с 'add_choco_num').
        const CHOCO_LETTER_SUFFIXES = ['choco_letters', 'choco_let'];
        const CHOCO_NUMBER_SUFFIXES = ['choco_numbers', 'choco_num'];
        const isChocolateDeco = (d: any) =>
            !!d?.id && [...CHOCO_LETTER_SUFFIXES, ...CHOCO_NUMBER_SUFFIXES].some((s) => d.id.endsWith(s));

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

        // Шоколадные надписи — цены из конфига сервера, отдельно по буквам и цифрам
        const letters = chocolateText?.letters?.replace(/\s+/g, '') || '';
        const numbers = chocolateText?.numbers?.replace(/\s+/g, '') || '';
        const chocolateLettersPrice = letters.length * (config.chocolateLetterPrice || 150);
        const chocolateNumbersPrice = numbers.length * (config.chocolateNumberPrice || 200);

        const extras = decorsPrice + photoPrice + chocolateLettersPrice + chocolateNumbersPrice;
        const totalMin = Math.round(basePriceMin + extras);
        const totalMax = Math.round(basePriceMax + extras);

        return {
            min: totalMin,
            max: totalMax,
            currency: '₽',
            isRange: totalMin !== totalMax,
            chocolateLettersPrice,
            chocolateNumbersPrice,
        };
    }, [config, serving, quantity, tiers, mainDecors, addDecors, imagePreview, chocolateText, priceKey]);

    return { ...result, isLoading };
}
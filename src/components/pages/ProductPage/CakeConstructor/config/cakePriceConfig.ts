export type CakeSubcategory = 'biscuit' | 'bento' | 'mousse' | 'kids' | 'tiered' | '3d';

export const cakePriceConfig: Record<CakeSubcategory, {
    pricePerKg?: number;      // если цена за кг
    fixedPrices?: Record<number, number>;  // если фиксированные цены
}> = {
    biscuit: {
        pricePerKg: 2000,
    },
    bento: {
        fixedPrices: {
            0.5: 1400,
            1.0: 2200,
        },
    },
    mousse: {
        pricePerKg: 2200,
    },
    kids: {
        pricePerKg: 2000,
    },
    tiered: {
        pricePerKg: 2400,
    },
    '3d': {
        pricePerKg: 2400,
    },
};
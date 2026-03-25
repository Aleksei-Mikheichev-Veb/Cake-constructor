export type DessertType = 'biscuit' | 'bento' | 'mousse' | 'kids' | 'tiered' | '3d' | 'trifles' | 'cupcake';

export const dessertPriceConfig: Record<DessertType, {
    pricePerKg?: number;
    fixedPrices?: Record<number, number>;           // для тортов по весу
    fixedPricesByQuantity?: Record<number, number>; // для трайфлов и капкейков по штукам
}> = {
    
    biscuit: { pricePerKg: 2000 },
    bento: { fixedPrices: { 0.5: 1400, 1.0: 2200 } },
    mousse: { pricePerKg: 2200 },
    kids: { pricePerKg: 2000 },
    tiered: { pricePerKg: 2400 },
    '3d': { pricePerKg: 2400 },

    
    trifles: {
        fixedPricesByQuantity: {
            6: 1900,
            9: 2800,
            12: 3700,
        }
    },

    cupcake: {
        fixedPricesByQuantity: {
            6: 1400,
            9: 2100,
            12: 2800,
        }
    },
};
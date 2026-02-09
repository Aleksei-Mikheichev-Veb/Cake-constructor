export type NumberOfServingType = {
    id: number;
    quantity:string;
    weightMin:number;
    weightMax:number;
    weight: string;
    height: number;
    diameter: number;
}

export const numberOfServing: NumberOfServingType[] = [
    {
        id: 1,
        quantity: '8-9',
        weightMin: 1.6,
        weightMax: 1.8,
        weight: '1.6-1.8',
        height: 15,
        diameter: 14,
    }, {
        id: 2,
        quantity: '10-12',
        weightMin: 2,
        weightMax: 2.5,
        weight: '2-2.5',
        height: 15,
        diameter: 16,
    }, {
        id: 3,
        quantity: '12-14',
        weightMin: 2.5,
        weightMax: 3,
        weight: '2.5-3',
        height: 15,
        diameter: 18,
    }, {
        id: 4,
        quantity: '15-17',
        weightMin: 3,
        weightMax: 3.5,
        weight: '3-3.5',
        height: 15,
        diameter: 20,
    }, {
        id: 5,
        quantity: '18-20',
        weightMin: 3.5,
        weightMax: 4,
        weight: '3.5-4',
        height: 15,
        diameter: 24,
    },
]
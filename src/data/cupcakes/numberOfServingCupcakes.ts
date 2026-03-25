import { NumberOfServingType } from "../cakes/biscuit/numberOfServing";

export type NumberOfServingDessertType = {
    id: number;
    quantity: string;
    weight: string;
}

export const numberOfServingCupcakes: NumberOfServingDessertType[] = [
    {
        id: 6,
        quantity: '6',
        weight: '200 гр.',
    },
    {
        id: 9,
        quantity: '9',
        weight: '200 гр',
    },
    {
        id: 12,
        quantity: '12',
        weight: '200 гр',
    }
];

export {}
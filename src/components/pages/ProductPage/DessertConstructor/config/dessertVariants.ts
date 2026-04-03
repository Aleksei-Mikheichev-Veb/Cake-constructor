import {fillings, FillingType} from "../../../../../data/cakes/biscuit/fillings";
import { numberOfServingCupcakes, NumberOfServingDessertType } from "../../../../../data/cupcakes/numberOfServingCupcakes";
import { numberOfServingTrifles } from "../../../../../data/trifles/numberOfServingTrifles";
import { cupcakeBases } from "../../../../../data/cupcakes/cupcakeBases";
import { cupcakeFillings } from "../../../../../data/cupcakes/cupcakeFillings";



export type ControlType =
    | 'portions'
    | 'filling'
    | 'colors'
    | 'styling'
    | 'cupcakeBase'
    | 'cupcakeFilling'
    | 'reference';

export interface ControlConfig {
    type: ControlType;
    title?: string;
    fillings?:FillingType[];
    items?: any[];
    isColor?: boolean;
    decorationsMode?: 'split' | 'all';
    isTemplate?:boolean;
}

export const dessertVariants: Record<string, {
    title: string;
    controls: ControlConfig[];
    portionData: NumberOfServingDessertType[];
}> = {
    cupcakes: {
        title: 'Капкейки',
        portionData: numberOfServingCupcakes,
        controls: [
            { type: 'portions', title: 'Выберите количество порций' },
            { type: 'cupcakeBase', title: 'Выберите основу кекса', items: cupcakeBases },
            { type: 'cupcakeFilling', title: 'Выберите начинку', items: cupcakeFillings },
            { type: 'styling' },
            { type: 'reference' },
        ],
    },
    trifles: {
        title: 'Трайфлы',
        portionData: numberOfServingTrifles,
        controls: [
            { type: 'portions', title: 'Выберите количество порций' },
            { type: 'filling', title: 'Выберите начинку', fillings: fillings },
            { type: 'styling' },
            { type: 'reference' },
        ],
    },

}


export {};

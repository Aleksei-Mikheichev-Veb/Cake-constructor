import { FillingType } from "../../../../../data/cakes/biscuit/fillings";
import { numberOfServingCupcakes, NumberOfServingDessertType } from "../../../../../data/cupcakes/numberOfServingCupcakes";



export type ControlType =
    | 'portions'
    | 'filling'
    | 'colors'
    // | 'decorations'
    | 'reference';  

export interface ControlConfig {
    type: ControlType;
    title?: string;
    fillings?:FillingType[];
    // специфические пропсы для этого контрола
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
            { type: 'portions', title:'Выберите количество порций'},
            // { type: 'weight', title:'Выберите количество порций'},
            // { type: 'filling', title:'Выберите начинку', fillings: fillings},
            // { type: 'decorations', decorationsMode: 'split' },
            { type: 'reference' },
        ],
    },
    
}


export {};
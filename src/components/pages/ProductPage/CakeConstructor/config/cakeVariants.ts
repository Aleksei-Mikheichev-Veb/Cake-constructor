import {numberOfServing, NumberOfServingType} from "../../../../../data/cakes/biscuit/numberOfServing";
import {templates} from "../../../../../data/templates";
import {colors} from "../../../../../data/colors";
import {smudges} from "../../../../../data/smudges";
import {numberOfServingBento} from "../../../../../data/cakes/bento/numberOfServingBento";
import {numberofServingMousse} from "../../../../../data/cakes/mousse/numberOfServingMousse";
import {shapeBento} from "../../../../../data/cakes/bento/shapeBento";
import {shapeMousse} from "../../../../../data/cakes/mousse/shapeMousse";
import {shapeTiered} from "../../../../../data/cakes/tiered/shapeTiered";
import { gloss } from "../../../../../data/cakes/mousse/gloss";

export type ControlType =
    | 'weight'
    | 'filling'
    | 'template'
    | 'colors'
    | 'smudges'
    | 'creamText'
    | 'decorations'
    | 'photoPrint'
    | 'reference'
    | 'tiered'
    | 'shape' // для бенто, мусс, ярусные
    | 'gloss';    // для мусс

interface ControlConfig {
    type: ControlType;
    title?: string;
    // специфические пропсы для этого контрола
    items?: any[];
    isColor?: boolean;
    decorationsMode?: 'split' | 'all';
    isTemplate?:boolean;
}

export const cakeVariants: Record<string, {
    title: string;
    controls: ControlConfig[];
    weightData: NumberOfServingType[];
}> = {
    biscuit: {
        title: 'Бисквитный торт',
        weightData: numberOfServing,
        controls: [
            { type: 'weight', title:'Выберите количество порций'},
            { type: 'filling', title:'Выберите начинку'},
            { type: 'template', items: templates, title: 'Шаблон оформления',isTemplate: true },
            { type: 'colors', items: colors, isColor: true, title: 'Цвет торта' },
            { type: 'smudges', items: smudges, title: 'Выберите оформление подтеками' },
            { type: 'decorations', decorationsMode: 'split' },
            { type: 'photoPrint' },
            { type: 'creamText' },
            { type: 'reference' },
        ],
    },
    bento: {
        title: 'Бенто торт',
        weightData: numberOfServingBento,
        controls: [
            { type: 'weight', title:'Выберите количество порций'},
            { type: 'filling', title:'Выберите начинку'},
            { type: 'shape', items:shapeBento, title: 'Выбрите форму' },
            { type: 'colors', items: colors, isColor: true, title: 'Цвет торта' },
            { type: 'smudges', items: smudges, title: 'Выберите оформление подтеками' },
            { type: 'decorations', decorationsMode: 'all' },
            { type: 'photoPrint' },
            { type: 'creamText' },
            { type: 'reference' },
        ],
    },
    kids: {
        title: 'Бисквитный торт',
        weightData: numberOfServing,
        controls: [
            { type: 'weight', title:'Выберите количество порций'},
            { type: 'filling', title:'Выберите начинку'},
            { type: 'template', items: templates, title: 'Шаблон оформления', isTemplate: true },
            { type: 'colors', items: colors, isColor: true, title: 'Цвет торта' },
            { type: 'smudges', items: smudges, title: 'Выберите оформление подтеками' },
            { type: 'decorations', decorationsMode: 'split' },
            { type: 'photoPrint' },
            { type: 'creamText' },
            { type: 'reference' },
        ],
    },
    mousse: {
        title: 'Бисквитный торт',
        weightData: numberofServingMousse,
        controls: [
            { type: 'weight', title:'Выберите количество порций'},
            { type: 'filling', title:'Выберите начинку'},
            { type: 'shape', items:shapeMousse, title: 'Выбрите форму' },
            { type: 'gloss', items:gloss, title: 'Выберите тип поверхности торта' },
            { type: 'colors', items: colors, isColor: true, title: 'Цвет торта' },
            { type: 'smudges', items: smudges, title: 'Выберите оформление подтеками' },
            { type: 'decorations', decorationsMode: 'all' },
            { type: 'photoPrint' },
            { type: 'creamText' },
            { type: 'reference' },
        ],
    },
    tiered: {
        title: 'Бисквитный торт',
        weightData: numberOfServing,
        controls: [
            { type: 'tiered', title:'Выберите начинку'},
            { type: 'colors', items: colors, isColor: true, title: 'Цвет торта' },
            { type: 'template', items: templates, title: 'Шаблон оформления', isTemplate: true },
            { type: 'shape', items:shapeTiered, title: 'Выбрите форму' },
            { type: 'smudges', items: smudges, title: 'Выберите оформление подтеками' },
            { type: 'decorations', decorationsMode: 'split' },
            { type: 'photoPrint' },
            { type: 'creamText' },
            { type: 'reference' },
        ],
    },
    '3d': {
    title: 'Бисквитный торт',
        weightData: numberOfServing,
        controls: [
        { type: 'weight', title:'Выберите количество порций'},
        { type: 'filling', title:'Выберите начинку'},
        { type: 'reference' },
    ],
}
}

export {};
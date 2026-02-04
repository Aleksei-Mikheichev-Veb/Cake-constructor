import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {FillingType} from "../data/fillings";
import {NumberOfServingType} from "../data/numberOfServing";
import {ItemType} from "../data/templates";
import {DecorationType} from "../data/decorationsMain";

type initialStateType = {
    numberOfServing: NumberOfServingType | null;
    filling: FillingType | null;
    template: ItemType | null;
    colorsTemplate: ItemType | null;
    colors: Array<string>;
    smudges: ItemType | null;
    creamText:string;
    creamTextColor: string | null;
    imagePreview: string | null;
    mainDecorations: DecorationType | null;
    additionalDecorations: Array<DecorationType>;
}

const initialState:initialStateType = {
    numberOfServing: null,
    filling: null,
    template: null,
    colorsTemplate: null,
    colors: [],
    smudges: null,
    creamText: '',
    creamTextColor: null,
    imagePreview: null,
    mainDecorations: null,
    additionalDecorations: [] ,
}

export const cakeConstructorSlice = createSlice({
    name:'cakeConstructor',
    initialState,
    reducers: {
        setWeight: (state, action: PayloadAction<NumberOfServingType>) => {
            state.numberOfServing = action.payload
        },
        setFilling: (state, action: PayloadAction<FillingType>) => {
          state.filling = action.payload
        },
        setTemplate: (state, action: PayloadAction<ItemType>) => {
            state.template = action.payload
        },
        setColorsTemplate: (state, action: PayloadAction<ItemType>) => {
            state.colorsTemplate = action.payload
        },
        setColors: (state, action: PayloadAction<{color:string, index:number}>) => {
            state.colors[action.payload.index] = action.payload.color
        },
        setSmudges: (state, action: PayloadAction<ItemType>) => {
            state.smudges = action.payload
        },
        setImagePreview: (state, action: PayloadAction<string | null>) => {
            state.imagePreview = action.payload
        },
        setCreamText: (state, action: PayloadAction<string>) => {
            state.creamText = action.payload
        },
        setCreamTextColor: (state, action: PayloadAction<string>) => {
            state.creamTextColor = action.payload
        },
        setMainDecorations: (state, action: PayloadAction<DecorationType>) => {
            state.mainDecorations = action.payload
        },
        removeMainDecorations: (state, action: PayloadAction<string>) => {
            state.mainDecorations = null
        },
        setAdditionalDecorations:(state, action: PayloadAction<DecorationType>) => {
            state.additionalDecorations.push(action.payload)
        },
        removeAdditionalDecoration:(state, action: PayloadAction<string>) => {
            state.additionalDecorations = state.additionalDecorations.filter(decoration => decoration.id != action.payload)
        }
    }
})

export const {setWeight, setFilling, setTemplate, setColorsTemplate, setColors, setSmudges,setImagePreview,setCreamText, setCreamTextColor, setMainDecorations, setAdditionalDecorations, removeAdditionalDecoration, removeMainDecorations } = cakeConstructorSlice.actions
export default cakeConstructorSlice.reducer

как назвать коммит если я добавил в slice добавление и удаление основных и дополнительных декораций, поменял стили декораций, и добавил к компоненту с инпутом компоненту с выбором текста
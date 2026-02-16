import {createEntityAdapter, createSlice, EntityState, PayloadAction} from "@reduxjs/toolkit";
import {FillingType} from "../data/fillings";
import {NumberOfServingType} from "../data/numberOfServing";
import {ItemType} from "../data/templates";
import {DecorationType, SelectedDecoration} from "../data/decorationsMain";

export const mainDecorAdapter = createEntityAdapter<SelectedDecoration, string>({
    selectId: (deco) => deco.id
})

export const additionalDecorAdapter = createEntityAdapter<SelectedDecoration, string>({
    selectId: (deco) => deco.id
});

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
    // mainDecorations: Array<DecorationType>;
    // additionalDecorations: Array<DecorationType>;
    mainDecorations: EntityState<SelectedDecoration, string>;
    additionalDecorations: EntityState<SelectedDecoration, string>;
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
    // mainDecorations: [],
    // additionalDecorations: [] ,
    mainDecorations: mainDecorAdapter.getInitialState(),
    additionalDecorations: additionalDecorAdapter.getInitialState() ,
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
        addMainDecoration: (state, action: PayloadAction<DecorationType>) => {
            const deco = action.payload;
            if(state.mainDecorations.ids.length == 3){
                return
            }
            const count = deco.byThePiece ? (deco.minCount || 1) : 1;
            mainDecorAdapter.addOne(state.mainDecorations, {...deco, count})
        },
        removeMainDecoration: (state, action: PayloadAction<string>) => {
            mainDecorAdapter.removeOne(state.mainDecorations, action.payload)

        },
        incrementMainDecoration: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            const existing = state.mainDecorations.entities[id];
            mainDecorAdapter.updateOne(state.mainDecorations, {
                id,
                changes: {count: existing.count + 1}
            })
        },
        decrementMainDecoration: (state, action:PayloadAction<string>) => {
            const id = action.payload;
            const existing = state.mainDecorations.entities[id];
            if(existing.count == (existing.minCount || 1)){
                mainDecorAdapter.removeOne(state.mainDecorations, id)
            }else{
                mainDecorAdapter.updateOne(state.mainDecorations, {
                    id,
                    changes: {count: existing.count - 1}
                })
            }
        },
        addAdditionalDecoration: (state, action:PayloadAction<DecorationType>) => {
            const deco = action.payload;
            const count = deco.minCount ? deco.minCount : 1;
            additionalDecorAdapter.addOne(state.additionalDecorations, {...deco, count})
        },
        removeAdditionalDecoration: (state, action:PayloadAction<string>) => {
            additionalDecorAdapter.removeOne(state.additionalDecorations, action.payload)
        },
        incrementAdditionalDecoration: (state, action:PayloadAction<string>) => {
            const id = action.payload;
            const existing = state.additionalDecorations.entities[id]
            additionalDecorAdapter.updateOne(state.additionalDecorations, {
                id,
                changes: {count: existing.count + 1}
            })
        },
        decrementAdditionalDecoration: (state, action:PayloadAction<string>) => {
            const id = action.payload;
            const existing = state.additionalDecorations.entities[id];
            if(existing.count == 1){
                additionalDecorAdapter.removeOne(state.additionalDecorations, id)
            }else {
                additionalDecorAdapter.updateOne(state.additionalDecorations, {
                    id,
                    changes: {count: existing.count - 1}
                })
            }
        }
        // setMainDecorations: (state, action: PayloadAction<DecorationType>) => {
        //     state.mainDecorations = action.payload
        // },
        // removeMainDecorations: (state, action: PayloadAction<string>) => {
        //     state.mainDecorations = null
        // },
        // setMainDecorations: (state, action: PayloadAction<DecorationType>) => {
        //     state.mainDecorations.push(action.payload)
        // },
        // removeMainDecorations: (state, action: PayloadAction<string>) => {
        //     state.mainDecorations = state.mainDecorations.filter(decoration => decoration.id != action.payload)
        // },
        // setAdditionalDecorations:(state, action: PayloadAction<DecorationType>) => {
        //     state.additionalDecorations.push(action.payload)
        // },
        // removeAdditionalDecoration:(state, action: PayloadAction<string>) => {
        //     state.additionalDecorations = state.additionalDecorations.filter(decoration => decoration.id != action.payload)
        // }
    }
})

export const {setWeight,
    setFilling,
    setTemplate,
    setColorsTemplate,
    setColors,
    setSmudges,
    setImagePreview,
    setCreamText,
    setCreamTextColor,
    addMainDecoration,
    removeMainDecoration,
    incrementMainDecoration,
    decrementMainDecoration,
    addAdditionalDecoration,
    removeAdditionalDecoration,
    incrementAdditionalDecoration,
    decrementAdditionalDecoration
} = cakeConstructorSlice.actions
export default cakeConstructorSlice.reducer
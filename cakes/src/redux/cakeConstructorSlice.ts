import { createEntityAdapter, createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit";
import { getLayersForPortions, getMinPortionsForLayers } from "../utils/tieredUtils";
import { DecorationType, SelectedDecoration } from "../types/DecorationType";
import { FillingType } from "../types/FillingType";
import { NumberOfServingType } from "../types/NumberOfServingType";
import { NumberOfServingDessertType } from "../types/NumberOfServingDessertType";

export const mainDecorAdapter = createEntityAdapter<SelectedDecoration, string>({
    selectId: (deco) => deco.id
})

export const additionalDecorAdapter = createEntityAdapter<SelectedDecoration, string>({
    selectId: (deco) => deco.id
});

export const smallDecorAdapter = createEntityAdapter<SelectedDecoration, string>({
    selectId: (deco) => deco.id
});

type TiersState = {
    layers: number;
    portions: number;
    layerFillings: Array<FillingType | null>;
};

type StylingGroup = {
    topColor: string | null;
    decorations: EntityState<SelectedDecoration, string>;
};

export type ReferenceImage = {
    id: string;
    preview: string;
    file?: File;
};

export type CakeSubcategory = 'biscuit' | 'bento' | 'mousse' | 'kids' | 'tiered' | '3d' | null;

type initialStateType = {
    dessertType: 'cake' | 'trifles' | 'cupcake' | null;
    subcategory: CakeSubcategory;
    numberOfServing: NumberOfServingType | null;
    filling: FillingType | null;
    template: string | null;
    colorsTemplate: string | null;
    colors: Array<string>;
    smudges: string | null;
    creamText: string;
    creamTextColor: string | null;
    imagePreview: string | null;
    mainDecorations: EntityState<SelectedDecoration, string>;
    additionalDecorations: EntityState<SelectedDecoration, string>;
    orderComment: string;
    referenceImages: ReferenceImage[];
    shape: string | null;
    tiers: TiersState | null;
    gloss: string | null;
    chocolateText: {
        letters?: string;
        numbers?: string;
    } | null;
    quantity: NumberOfServingDessertType | null;
    stylingConfig: StylingGroup[] | null;
    cupcakeBase: string | null;
    cupcakeFilling: string | null;
}

const initialState: initialStateType = {
    dessertType: null,
    subcategory: null,
    numberOfServing: null,
    filling: null,
    template: null,
    colorsTemplate: null,
    colors: [],
    smudges: null,
    creamText: '',
    creamTextColor: null,
    imagePreview: null,
    mainDecorations: mainDecorAdapter.getInitialState(),
    additionalDecorations: additionalDecorAdapter.getInitialState(),
    orderComment: '',
    referenceImages: [],
    shape: null,
    tiers: null,
    gloss: null,
    chocolateText: null,
    quantity: null,
    stylingConfig: null,
    cupcakeBase: null,
    cupcakeFilling: null,
}

export const cakeConstructorSlice = createSlice({
    name: 'cakeConstructor',
    initialState,
    reducers: {
        setDessertType: (state, action: PayloadAction<'trifles' | 'cupcake' | 'cake' | null>) => {
            state.dessertType = action.payload;
            // Для десертов (капкейки/трайфлы) сразу инициализируем stylingConfig
            // с одной группой по умолчанию ("все одинаковые"),
            if (action.payload === 'cupcake' || action.payload === 'trifles') {
                if (!state.stylingConfig) {
                    state.stylingConfig = [{
                        topColor: null,
                        decorations: smallDecorAdapter.getInitialState(),
                    }];
                }
            }
        },
        setSubcategory: (state, action: PayloadAction<CakeSubcategory>) => {
            state.subcategory = action.payload;
            if (action.payload !== 'biscuit' && action.payload !== 'kids') {
                state.template = null;
                state.colorsTemplate = null;
            }
        },
        setWeight: (state, action: PayloadAction<NumberOfServingType>) => {
            state.numberOfServing = action.payload
        },
        setQuantity: (state, action: PayloadAction<NumberOfServingDessertType>) => {
            state.quantity = action.payload;
        },
        setFilling: (state, action: PayloadAction<FillingType>) => {
            state.filling = action.payload
        },
        setTemplate: (state, action: PayloadAction<string>) => {
            state.template = action.payload
        },
        setColorsTemplate: (state, action: PayloadAction<string>) => {
            state.colorsTemplate = action.payload
        },
        setColors: (state, action: PayloadAction<{ color: string, index: number }>) => {
            state.colors[action.payload.index] = action.payload.color
        },
        setSmudges: (state, action: PayloadAction<string>) => {
            state.smudges = action.payload
        },
        setShape: (state, action: PayloadAction<string>) => {
            state.shape = action.payload
        },
        setGloss: (state, action: PayloadAction<string>) => {
            state.gloss = action.payload
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
            if (state.mainDecorations.ids.length == 3) {
                return
            }
            const count = deco.byThePiece ? (deco.minCount || 1) : 1;
            mainDecorAdapter.addOne(state.mainDecorations, { ...deco, count })
        },
        removeMainDecoration: (state, action: PayloadAction<string>) => {
            mainDecorAdapter.removeOne(state.mainDecorations, action.payload)
        },
        incrementMainDecoration: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            const existing = state.mainDecorations.entities[id];
            mainDecorAdapter.updateOne(state.mainDecorations, {
                id,
                changes: { count: existing.count + 1 }
            })
        },
        decrementMainDecoration: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            const existing = state.mainDecorations.entities[id];
            if (existing.count == (existing.minCount || 1)) {
                mainDecorAdapter.removeOne(state.mainDecorations, id)
            } else {
                mainDecorAdapter.updateOne(state.mainDecorations, {
                    id,
                    changes: { count: existing.count - 1 }
                })
            }
        },
        addAdditionalDecoration: (state, action: PayloadAction<DecorationType>) => {
            const deco = action.payload;
            const count = deco.minCount ? deco.minCount : 1;
            additionalDecorAdapter.addOne(state.additionalDecorations, { ...deco, count })
        },
        removeAdditionalDecoration: (state, action: PayloadAction<string>) => {
            additionalDecorAdapter.removeOne(state.additionalDecorations, action.payload)
        },
        incrementAdditionalDecoration: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            const existing = state.additionalDecorations.entities[id]
            additionalDecorAdapter.updateOne(state.additionalDecorations, {
                id,
                changes: { count: existing.count + 1 }
            })
        },
        decrementAdditionalDecoration: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            const existing = state.additionalDecorations.entities[id];
            if (existing.count == 1) {
                additionalDecorAdapter.removeOne(state.additionalDecorations, id)
            } else {
                additionalDecorAdapter.updateOne(state.additionalDecorations, {
                    id,
                    changes: { count: existing.count - 1 }
                })
            }
        },
        clearAllDecorations: (state) => {
            mainDecorAdapter.removeAll(state.mainDecorations);
            additionalDecorAdapter.removeAll(state.additionalDecorations);
            state.chocolateText = null;
        },
        setOrderComment: (state, action: PayloadAction<string>) => {
            state.orderComment = action.payload;
        },
        addReferenceImage: (state, action: PayloadAction<ReferenceImage>) => {
            if (state.referenceImages.length < 3) {
                state.referenceImages.push(action.payload);
            }
        },
        removeReferenceImage: (state, action: PayloadAction<string>) => {
            state.referenceImages = state.referenceImages.filter(img => img.id !== action.payload);
        },
        setTiers: (state, action: PayloadAction<TiersState>) => {
            state.tiers = action.payload;
        },
        setLayers: (state, action: PayloadAction<number>) => {
            if (!state.tiers) return;
            const newLayers = Math.max(1, Math.min(4, action.payload));

            state.tiers.layers = newLayers;
            state.tiers.portions = getMinPortionsForLayers(newLayers);

            while (state.tiers.layerFillings.length < newLayers) {
                state.tiers.layerFillings.push(null);
            }
            state.tiers.layerFillings = state.tiers.layerFillings.slice(0, newLayers);
        },
        setPortions: (state, action: PayloadAction<number>) => {
            if (!state.tiers) return;
            const newPortions = Math.max(10, Math.min(84, action.payload));

            state.tiers.portions = newPortions;
            state.tiers.layers = getLayersForPortions(newPortions);
        },
        setLayerFilling: (state, action: PayloadAction<{ layerIndex: number; filling: FillingType }>) => {
            if (!state.tiers) return;
            const { layerIndex, filling } = action.payload;
            if (layerIndex >= 0 && layerIndex < state.tiers.layers) {
                state.tiers.layerFillings[layerIndex] = filling;
            }
        },
        setChocolateLetters: (state, action: PayloadAction<string>) => {
            if (!state.chocolateText) state.chocolateText = {};
            state.chocolateText.letters = action.payload;
        },
        setChocolateNumbers: (state, action: PayloadAction<string>) => {
            if (!state.chocolateText) state.chocolateText = {};
            state.chocolateText.numbers = action.payload;
        },
        clearChocolateText: (state) => {
            state.chocolateText = null;
        },
        setStylingConfig: (state, action: PayloadAction<StylingGroup[] | null>) => {
            state.stylingConfig = action.payload;
        },
        updateStylingGroup: (state, action: PayloadAction<{
            groupIndex: number;
            topColor?: string | null;
            decorations?: EntityState<SelectedDecoration, string>;
        }>) => {
            const { groupIndex, topColor, decorations } = action.payload;
            if (!state.stylingConfig || !state.stylingConfig[groupIndex]) return;

            if (topColor !== undefined) {
                state.stylingConfig[groupIndex].topColor = topColor;
            }
            if (decorations) {
                state.stylingConfig[groupIndex].decorations = decorations;
            }
        },
        addStylingGroupDecoration: (state, action: PayloadAction<{
            groupIndex: number;
            decoration: DecorationType;
        }>) => {
            const { groupIndex, decoration } = action.payload;
            if (!state.stylingConfig || !state.stylingConfig[groupIndex]) return;

            const groupDecorations = state.stylingConfig[groupIndex].decorations;
            if (groupDecorations.ids.length >= 5) return;
            if (groupDecorations.entities[decoration.id]) return;

            smallDecorAdapter.addOne(groupDecorations, { ...decoration, count: 1 });
        },
        removeStylingGroupDecoration: (state, action: PayloadAction<{
            groupIndex: number;
            decorationId: string;
        }>) => {
            const { groupIndex, decorationId } = action.payload;
            if (!state.stylingConfig || !state.stylingConfig[groupIndex]) return;

            smallDecorAdapter.removeOne(state.stylingConfig[groupIndex].decorations, decorationId);
        },
        // Капкейки: основа и начинка
        setCupcakeBase: (state, action: PayloadAction<string>) => {
            state.cupcakeBase = action.payload;
        },
        setCupcakeFilling: (state, action: PayloadAction<string>) => {
            state.cupcakeFilling = action.payload;
        },
        clearReferenceImages: (state) => {
            state.referenceImages = [];
        },
        resetCakeConstructor: () => {
            return initialState;
        }
    }
})

export const {
    setDessertType,
    setSubcategory,
    setQuantity,
    setWeight,
    setFilling,
    setTemplate,
    setColorsTemplate,
    setColors,
    setSmudges,
    setShape,
    setGloss,
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
    decrementAdditionalDecoration,
    clearAllDecorations,
    setOrderComment,
    addReferenceImage,
    removeReferenceImage,
    clearReferenceImages,
    resetCakeConstructor,
    setTiers,
    setLayers,
    setPortions,
    setLayerFilling,
    setChocolateLetters,
    setChocolateNumbers,
    setStylingConfig,
    updateStylingGroup,
    addStylingGroupDecoration,
    removeStylingGroupDecoration,
    clearChocolateText,
    setCupcakeBase,
    setCupcakeFilling,
} = cakeConstructorSlice.actions
export default cakeConstructorSlice.reducer
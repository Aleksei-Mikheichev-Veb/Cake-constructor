import { RootState } from '../redux/store';
import { mainDecorAdapter, additionalDecorAdapter } from '../redux/cakeConstructorSlice';

import { templates } from '../data/templates';
import { smudges } from '../data/smudges';
import { colors } from '../data/cakes/biscuit/colors';
import { colorsMousse } from '../data/cakes/mousse/colorsMousse';
import { gloss } from '../data/cakes/mousse/gloss';
import { shapeBento } from '../data/cakes/bento/shapeBento';
import { shapeMousse } from '../data/cakes/mousse/shapeMousse';
import { shapeTiered } from '../data/cakes/tiered/shapeTiered';
import { topColors } from '../data/cupcakes/topColors';
import { cupcakeBases } from '../data/cupcakes/cupcakeBases';
import { cupcakeFillings } from '../data/cupcakes/cupcakeFillings';
import { OrderResponse, OrderStylingGroup } from '../types/order';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const { selectAll: selectAllMain } = mainDecorAdapter.getSelectors(
    (state: RootState) => state.cakeConstructor.mainDecorations
);
const { selectAll: selectAllAdditional } = additionalDecorAdapter.getSelectors(
    (state: RootState) => state.cakeConstructor.additionalDecorations
);

function resolveName(items: { id: string; name: string }[], id: string | null): string | null {
    if (!id) return null;
    return items.find((item) => item.id === id)?.name || id;
}

function resolveColorName(subcategory: string | null, colorId: string | null): string | null {
    if (!colorId) return null;
    const colorArrays: Record<string, { id: string; name: string }[]> = {
        biscuit: colors, kids: colors, tiered: colors, bento: colors, mousse: colorsMousse,
    };
    const arr = colorArrays[subcategory || ''] || colors;
    return resolveName(arr, colorId);
}

function resolveShapeName(subcategory: string | null, shapeId: string | null): string | null {
    if (!shapeId) return null;
    const shapeArrays: Record<string, { id: string; name: string }[]> = {
        bento: shapeBento, mousse: shapeMousse, tiered: shapeTiered,
    };
    const arr = shapeArrays[subcategory || ''];
    return arr ? resolveName(arr, shapeId) : shapeId;
}

export interface ClientInfo {
    clientName: string;
    clientPhone: string;
    clientContact?: string;
    desiredDate?: string;
}

/**
 * Собирает JSON-данные заказа из Redux-стора.
 */
function collectOrderData(state: RootState, clientInfo: ClientInfo, totalPrice: number) {
    const c = state.cakeConstructor;

    let servingLabel: string | null = null;
    if (c.numberOfServing && c.subcategory !== 'tiered') {
        const s = c.numberOfServing;
        servingLabel = `${s.quantity} порций, ${s.weight}`;
    }

    let quantityLabel: string | null = null;
    if (c.quantity) {
        quantityLabel = `${c.quantity.quantity} шт, ${c.quantity.weight}`;
    }

    const mainDecorations = selectAllMain(state).map((d) => ({
        id: d.id, name: d.name, price: d.price ?? 0, count: d.count,
    }));
    const additionalDecorations = selectAllAdditional(state).map((d) => ({
        id: d.id, name: d.name, price: d.price ?? 0, count: d.count,
    }));

    let tiers = null;
    if (c.tiers) {
        tiers = {
            layers: c.tiers.layers,
            portions: c.tiers.portions,
            weight: +(c.tiers.portions * 0.2).toFixed(1),
            layerFillings: c.tiers.layerFillings.map((f) =>
                f ? { id: f.id, name: f.name } : null
            ),
        };
    }

    let stylingGroups = null;
    if (c.stylingConfig && c.stylingConfig.length > 0) {
        stylingGroups = c.stylingConfig.map((group) => ({
            topColor: resolveName(topColors, group.topColor),
            decorations: group.decorations.ids.map((id) => {
                const deco = group.decorations.entities[id as string];
                return deco?.name || String(id);
            }),
        }));
    }

    return {
        dessertType: c.dessertType!,
        subcategory: c.subcategory,
        servingLabel,
        quantityLabel,
        filling: c.filling?.name || null,
        template: resolveName(templates, c.template),
        colorsTemplate: resolveColorName(c.subcategory, c.colorsTemplate),
        colors: c.colors,
        smudges: resolveName(smudges, c.smudges),
        shape: resolveShapeName(c.subcategory, c.shape),
        gloss: resolveName(gloss, c.gloss),
        mainDecorations,
        additionalDecorations,
        creamText: c.creamText,
        creamTextColor: c.creamTextColor,
        chocolateText: c.chocolateText,
        hasPhotoPrint: !!c.imagePreview,
        tiers,
        cupcakeBase: resolveName(cupcakeBases, c.cupcakeBase),
        cupcakeFilling: resolveName(cupcakeFillings, c.cupcakeFilling),
        stylingGroups,
        totalPrice,
        orderComment: c.orderComment,
        hasReferenceImages: c.referenceImages.length > 0,
        referenceImageCount: c.referenceImages.length,
        ...clientInfo,
    };
}

/**
 * Собирает файлы фото из стора.
 */
function collectFiles(state: RootState): { referenceFiles: File[]; photoPrintBlob: string | null } {
    const c = state.cakeConstructor;

    // Референс-фото (File объекты)
    const referenceFiles = c.referenceImages
        .map((img) => img.file)
        .filter((f): f is File => !!f);

    // Фотопечать (base64 dataURL или null)
    const photoPrintBlob = c.imagePreview;

    return { referenceFiles, photoPrintBlob };
}

/**
 * Конвертирует base64 dataURL в File.
 */
function dataURLtoFile(dataURL: string, filename: string): File {
    const arr = dataURL.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) {
        u8arr[i] = bstr.charCodeAt(i);
    }
    return new File([u8arr], filename, { type: mime });
}

/**
 * Отправляет заказ на бэкенд через multipart/form-data.
 */
export async function submitOrder(
    state: RootState,
    clientInfo: ClientInfo,
    totalPrice: number
): Promise<OrderResponse> {
    const orderData = collectOrderData(state, clientInfo, totalPrice);
    const { referenceFiles, photoPrintBlob } = collectFiles(state);

    const formData = new FormData();

    // JSON-данные заказа как строка
    formData.append('orderData', JSON.stringify(orderData));

    // Референс-фото
    referenceFiles.forEach((file, i) => {
        formData.append('references', file, `reference_${i + 1}.${file.name.split('.').pop()}`);
    });

    // Фотопечать (из base64 в File)
    if (photoPrintBlob) {
        const photoPrintFile = dataURLtoFile(photoPrintBlob, 'photoprint.png');
        formData.append('photoprint', photoPrintFile);
    }

    const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        body: formData, // НЕ ставим Content-Type — браузер сам поставит multipart/form-data с boundary
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Ошибка при отправке заказа');
    }

    return response.json();
}
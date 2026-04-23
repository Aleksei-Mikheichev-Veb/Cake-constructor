import { RootState } from '../redux/store';
import { mainDecorAdapter, additionalDecorAdapter } from '../redux/cakeConstructorSlice';
import { OrderResponse } from '../types/order';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const { selectAll: selectAllMain } = mainDecorAdapter.getSelectors(
    (state: RootState) => state.cakeConstructor.mainDecorations
);
const { selectAll: selectAllAdditional } = additionalDecorAdapter.getSelectors(
    (state: RootState) => state.cakeConstructor.additionalDecorations
);

// ─── Тип для справочника { id, name } ───
type LookupItem = { id: string; name: string };

function resolveName(items: LookupItem[], id: string | null): string | null {
    if (!id) return null;
    return items.find((item) => item.id === id)?.name || id;
}

// ─── Загрузка справочников с API ───
async function fetchLookups(subcategory: string | null, dessertType: string | null) {
    const fetchJson = async (url: string): Promise<any[]> => {
        try {
            const res = await fetch(`${API_URL}${url}`);
            if (!res.ok) return [];
            return res.json();
        } catch {
            return [];
        }
    };

    // Загружаем всё параллельно
    const [templates, smudges, cakeColors, mousseColors, glossOptions,
        bentoShapes, mousseShapes, tieredShapes, topColors,
        cupcakeBases, cupcakeFillings] = await Promise.all([
            fetchJson('/templates'),
            fetchJson('/smudges'),
            fetchJson('/colors?target=CAKE'),
            fetchJson('/colors?target=MOUSSE'),
            fetchJson('/gloss'),
            fetchJson('/shapes?subcategoryId=bento'),
            fetchJson('/shapes?subcategoryId=mousse'),
            fetchJson('/shapes?subcategoryId=tiered'),
            fetchJson('/top-colors'),
            fetchJson('/cupcake-bases'),
            fetchJson('/cupcake-fillings'),
        ]);

    return {
        templates, smudges, cakeColors, mousseColors, glossOptions,
        bentoShapes, mousseShapes, tieredShapes, topColors,
        cupcakeBases, cupcakeFillings,
    };
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
function collectOrderData(
    state: RootState,
    clientInfo: ClientInfo,
    totalPrice: number,
    lookups: Awaited<ReturnType<typeof fetchLookups>>
) {
    const c = state.cakeConstructor;

    // Резолвинг цвета по подкатегории
    const resolveColorName = (colorId: string | null): string | null => {
        if (!colorId) return null;
        const colorArr = c.subcategory === 'mousse' ? lookups.mousseColors : lookups.cakeColors;
        return resolveName(colorArr, colorId);
    };

    // Резолвинг формы по подкатегории
    const resolveShapeName = (shapeId: string | null): string | null => {
        if (!shapeId) return null;
        const shapeArrays: Record<string, LookupItem[]> = {
            bento: lookups.bentoShapes,
            mousse: lookups.mousseShapes,
            tiered: lookups.tieredShapes,
        };
        const arr = shapeArrays[c.subcategory || ''];
        return arr ? resolveName(arr, shapeId) : shapeId;
    };

    let servingLabel: string | null = null;
    if (c.numberOfServing && c.subcategory !== 'tiered') {
        const s = c.numberOfServing;
        servingLabel = `${s.quantity} порций, ${s.weight}`;
    }

    let quantityLabel: string | null = null;
    if (c.quantity) {
        quantityLabel = `${(c.quantity as any).quantity} шт, ${(c.quantity as any).weight}`;
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
            topColor: resolveName(lookups.topColors, group.topColor),
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
        template: resolveName(lookups.templates, c.template),
        colorsTemplate: resolveColorName(c.colorsTemplate),
        colors: c.colors,
        smudges: resolveName(lookups.smudges, c.smudges),
        shape: resolveShapeName(c.shape),
        gloss: resolveName(lookups.glossOptions, c.gloss),
        mainDecorations,
        additionalDecorations,
        creamText: c.creamText,
        creamTextColor: c.creamTextColor,
        chocolateText: c.chocolateText,
        hasPhotoPrint: !!c.imagePreview,
        tiers,
        cupcakeBase: resolveName(lookups.cupcakeBases, c.cupcakeBase),
        cupcakeFilling: resolveName(lookups.cupcakeFillings, c.cupcakeFilling),
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

    const referenceFiles = c.referenceImages
        .map((img) => img.file)
        .filter((f): f is File => !!f);

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
    // Загружаем справочники для резолвинга имён
    const lookups = await fetchLookups(
        state.cakeConstructor.subcategory,
        state.cakeConstructor.dessertType
    );

    const orderData = collectOrderData(state, clientInfo, totalPrice, lookups);
    const { referenceFiles, photoPrintBlob } = collectFiles(state);

    const formData = new FormData();
    formData.append('orderData', JSON.stringify(orderData));

    referenceFiles.forEach((file, i) => {
        formData.append('references', file, `reference_${i + 1}.${file.name.split('.').pop()}`);
    });

    if (photoPrintBlob) {
        const photoPrintFile = dataURLtoFile(photoPrintBlob, 'photoprint.png');
        formData.append('photoprint', photoPrintFile);
    }

    const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Ошибка при отправке заказа');
    }

    return response.json();
}
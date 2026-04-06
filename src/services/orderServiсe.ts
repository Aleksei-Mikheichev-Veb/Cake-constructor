/**
 * Сервис отправки заказа на бэкенд.
 * Собирает данные из Redux-стора и отправляет POST /api/orders.
 */

import { RootState } from '../redux/store';
import { mainDecorAdapter, additionalDecorAdapter } from '../redux/cakeConstructorSlice';

// Адрес бэкенда — позже вынесем в .env фронта
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Селекторы для декораций
const { selectAll: selectAllMain } = mainDecorAdapter.getSelectors(
    (state: RootState) => state.cakeConstructor.mainDecorations
);
const { selectAll: selectAllAdditional } = additionalDecorAdapter.getSelectors(
    (state: RootState) => state.cakeConstructor.additionalDecorations
);

export interface ClientInfo {
    clientName: string;
    clientPhone: string;
    clientContact?: string;
    desiredDate?: string;
}

export interface OrderResponse {
    success: boolean;
    orderId: string;
    vkRedirect: string | null;
    message?: string;
}

/**
 * Собирает данные заказа из Redux-стора.
 */
export function collectOrderData(state: RootState, clientInfo: ClientInfo, totalPrice: number) {
    const c = state.cakeConstructor;

    const mainDecorations = selectAllMain(state).map((d) => ({
        id: d.id,
        name: d.name,
        price: d.price,
        count: d.count,
    }));

    const additionalDecorations = selectAllAdditional(state).map((d) => ({
        id: d.id,
        name: d.name,
        price: d.price,
        count: d.count,
    }));

    return {
        // Тип
        dessertType: c.dessertType!,
        subcategory: c.subcategory,

        // Порции
        numberOfServing: c.numberOfServing
            ? {
                id: c.numberOfServing.id,
                name: c.numberOfServing.name,
                weightMin: c.numberOfServing.weightMin,
                weightMax: c.numberOfServing.weightMax,
            }
            : null,
        quantity: c.quantity
            ? { id: c.quantity.id, name: c.quantity.name }
            : null,

        // Начинка
        filling: c.filling
            ? { id: c.filling.id, name: c.filling.name }
            : null,

        // Оформление
        template: c.template,
        colorsTemplate: c.colorsTemplate,
        colors: c.colors,
        smudges: c.smudges,
        shape: c.shape,
        gloss: c.gloss,

        // Декорации
        mainDecorations,
        additionalDecorations,

        // Надписи
        creamText: c.creamText,
        creamTextColor: c.creamTextColor,
        chocolateText: c.chocolateText,

        // Фотопечать
        hasPhotoPrint: !!c.imagePreview,

        // Цена
        totalPrice,

        // Комментарий и референсы
        orderComment: c.orderComment,
        hasReferenceImages: c.referenceImages.length > 0,
        referenceImageCount: c.referenceImages.length,

        // Клиент
        ...clientInfo,
    };
}

/**
 * Отправляет заказ на бэкенд.
 */
export async function submitOrder(
    state: RootState,
    clientInfo: ClientInfo,
    totalPrice: number
): Promise<OrderResponse> {
    const orderData = collectOrderData(state, clientInfo, totalPrice);

    const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Ошибка при отправке заказа');
    }

    return response.json();
}
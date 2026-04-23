// ============================================================
// server/src/services/notifications.ts
// ------------------------------------------------------------
// Оркестрация отправки уведомлений в VK и Telegram.
// Вынесено из routes/orders.ts, чтобы роут остался компактным.
// ============================================================

import axios from 'axios';
import { OrderData } from '../types/order';
import { formatOrder } from './orderFormatter';
import { sendVkMessage, sendVkPhoto } from './vkNotifier';
import { sendTelegramMessage, sendTelegramPhoto } from './telegramNotifier';
import { config } from '../config/env';

export type NotifyAssets = {
    referenceUrls: string[];    // URL-ы из Cloudinary
    photoPrintUrls: string[];
    colorPreviewUrl: string | null;
};

/**
 * Скачивает картинку из Cloudinary в Buffer —
 * VK и TG API принимают файлы, а не URL (вернее, принимают,
 * но с ограничениями по домену/размеру), проще скачать.
 */
async function fetchBuffer(url: string): Promise<Buffer> {
    const response = await axios.get<ArrayBuffer>(url, {
        responseType: 'arraybuffer',
        timeout: 15_000,
    });
    return Buffer.from(response.data);
}

export async function notifyChannels(
    orderId: string,
    orderData: OrderData,
    assets: NotifyAssets,
): Promise<{ vk: boolean; telegram: boolean }> {
    const results = { vk: false, telegram: false };

    // Заранее скачиваем все картинки — чтобы не качать одно и то же
    // дважды при отправке в VK И TG одновременно.
    const [colorPreviewBuf, photoPrintBufs, referenceBufs] = await Promise.all([
        assets.colorPreviewUrl ? fetchBuffer(assets.colorPreviewUrl) : Promise.resolve(null),
        Promise.all(assets.photoPrintUrls.map(fetchBuffer)),
        Promise.all(assets.referenceUrls.map(fetchBuffer)),
    ]);

    // ─── ВКонтакте ───
    if (config.vk.communityToken && config.vk.confectionerId) {
        try {
            const msg = `Заказ №${orderId}\n\n` + formatOrder(orderData, 'vk');
            const result = await sendVkMessage(
                config.vk.confectionerId, msg, config.vk.communityToken,
            );
            results.vk = result.success;

            if (colorPreviewBuf) {
                await sendVkPhoto(config.vk.confectionerId, colorPreviewBuf, '🎨 Выбранные цвета', config.vk.communityToken);
            }
            for (const buf of photoPrintBufs) {
                await sendVkPhoto(config.vk.confectionerId, buf, '🖼 Фотопечать', config.vk.communityToken);
            }
            for (const buf of referenceBufs) {
                await sendVkPhoto(config.vk.confectionerId, buf, '📎 Референс', config.vk.communityToken);
            }
        } catch (err) {
            console.error('VK notification failed:', (err as Error).message);
        }
    }

    // ─── Telegram ───
    if (config.telegram.botToken && config.telegram.confectionerChatId) {
        try {
            const msg = `Заказ №${orderId}\n\n` + formatOrder(orderData, 'tg');
            const result = await sendTelegramMessage(
                config.telegram.confectionerChatId, msg, config.telegram.botToken,
            );
            results.telegram = result.success;

            if (colorPreviewBuf) {
                await sendTelegramPhoto(config.telegram.confectionerChatId, colorPreviewBuf, '🎨 Выбранные цвета', config.telegram.botToken);
            }
            for (const buf of photoPrintBufs) {
                await sendTelegramPhoto(config.telegram.confectionerChatId, buf, '🖼 Фотопечать', config.telegram.botToken);
            }
            for (const buf of referenceBufs) {
                await sendTelegramPhoto(config.telegram.confectionerChatId, buf, '📎 Референс', config.telegram.botToken);
            }
        } catch (err) {
            console.error('Telegram notification failed:', (err as Error).message);
        }
    }

    return results;
}

/**
 * ВАЖНО: sendVkPhoto и sendTelegramPhoto сейчас в твоём
 * cake-backend принимают путь к файлу (string). После миграции
 * их надо перевести на Buffer. В vkNotifier.ts / telegramNotifier.ts
 * меняется одна строка — вместо fs.createReadStream(path)
 * передаёшь buffer прямо в form-data:
 *   form.append('photo', buffer, { filename: 'photo.jpg' });
 */

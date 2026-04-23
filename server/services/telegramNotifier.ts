import FormData from 'form-data';
import axios from 'axios';

interface TgSendResult {
    success: boolean;
    error?: string;
}

/**
 * Отправить текстовое сообщение в Telegram.
 */
export async function sendTelegramMessage(
    chatId: number,
    message: string,
    botToken: string
): Promise<TgSendResult> {
    try {
        const { data } = await axios.post(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML',
            }
        );

        if (!data.ok) {
            console.error('[Telegram] Ошибка:', data.description);
            return { success: false, error: `Telegram API error: ${data.description}` };
        }

        console.log('[Telegram] Сообщение отправлено, message_id:', data.result.message_id);
        return { success: true };
    } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Unknown error';
        console.error('[Telegram] Сетевая ошибка:', errMsg);
        return { success: false, error: errMsg };
    }
}

/**
 * Отправить фото в Telegram.
 */
export async function sendTelegramPhoto(
    chatId: number,
    photo: Buffer,
    caption: string,
    botToken: string
): Promise<TgSendResult> {
    try {
        const formData = new FormData();
        formData.append('chat_id', chatId.toString());
        formData.append('caption', caption);
        formData.append('photo', photo, {
            filename: 'photo.jpg',
        });

        const { data } = await axios.post(
            `https://api.telegram.org/bot${botToken}/sendPhoto`,
            formData,
            { headers: formData.getHeaders() }
        );

        if (!data.ok) {
            console.error('[Telegram Photo] Ошибка:', data.description);
            return { success: false, error: data.description };
        }

        console.log('[Telegram Photo] Фото отправлено');
        return { success: true };
    } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Unknown error';
        console.error('[Telegram Photo] Ошибка:', errMsg);
        return { success: false, error: errMsg };
    }
}
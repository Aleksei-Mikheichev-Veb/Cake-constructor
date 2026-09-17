import FormData from 'form-data';
import axios from 'axios';

const VK_API_VERSION = '5.199';

interface VkSendResult {
    success: boolean;
    error?: string;
}

const VK_TIMEOUT_MS = 15_000;

/**
 * Отправить текстовое сообщение пользователю ВК.
 * Одна попытка повтора при сетевой ошибке (таймаут/обрыв) — VK у нас иногда
 * подвисает на секунды без ответа, а это самое важное уведомление кондитеру,
 * терять его из-за разовой сетевой заминки нежелательно.
 */
export async function sendVkMessage(
    userId: number,
    message: string,
    token: string,
    attempt: number = 1
): Promise<VkSendResult> {
    const randomId = Math.floor(Math.random() * 2_000_000_000);

    try {
        const { data } = await axios.post('https://api.vk.com/method/messages.send', null, {
            params: {
                user_id: userId,
                message,
                random_id: randomId,
                v: VK_API_VERSION,
                access_token: token,
            },
            timeout: VK_TIMEOUT_MS,
        });

        if (data.error) {
            console.error('[VK] Ошибка:', data.error.error_msg);
            return { success: false, error: `VK API error ${data.error.error_code}: ${data.error.error_msg}` };
        }

        console.log('[VK] Сообщение отправлено, message_id:', data.response);
        return { success: true };
    } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Unknown error';
        console.error('[VK] Сетевая ошибка:', errMsg);
        if (attempt < 2) {
            console.log('[VK] Повторная попытка отправки сообщения...');
            return sendVkMessage(userId, message, token, attempt + 1);
        }
        return { success: false, error: errMsg };
    }
}

/**
 * Отправить фото пользователю ВК.
 */
export async function sendVkPhoto(
    userId: number,
    photo: Buffer,
    caption: string,
    token: string,
    filename: string = 'photo.jpg'
): Promise<VkSendResult> {
    try {
        // 1. Получаем upload URL
        const { data: uploadUrlData } = await axios.get(
            'https://api.vk.com/method/photos.getMessagesUploadServer',
            {
                params: {
                    peer_id: userId,
                    v: VK_API_VERSION,
                    access_token: token,
                },
                timeout: VK_TIMEOUT_MS,
            }
        );

        if (uploadUrlData.error) {
            console.error('[VK Photo] Ошибка получения upload URL:', uploadUrlData.error.error_msg);
            return { success: false, error: uploadUrlData.error.error_msg };
        }

        const uploadUrl = uploadUrlData.response.upload_url;

        // 2. Загружаем файл
        const formData = new FormData();
        formData.append('photo', photo, {
            filename,
        });

        const { data: uploadResult } = await axios.post(uploadUrl, formData, {
            headers: formData.getHeaders(),
            timeout: VK_TIMEOUT_MS,
        });

        if (!uploadResult.photo || uploadResult.photo === '[]') {
            console.error('[VK Photo] Ошибка загрузки файла');
            return { success: false, error: 'Upload failed — empty photo response' };
        }

        // 3. Сохраняем фото
        const { data: saveData } = await axios.get(
            'https://api.vk.com/method/photos.saveMessagesPhoto',
            {
                params: {
                    photo: uploadResult.photo,
                    server: uploadResult.server,
                    hash: uploadResult.hash,
                    v: VK_API_VERSION,
                    access_token: token,
                },
                timeout: VK_TIMEOUT_MS,
            }
        );

        if (saveData.error) {
            console.error('[VK Photo] Ошибка сохранения:', saveData.error.error_msg);
            return { success: false, error: saveData.error.error_msg };
        }

        const savedPhoto = saveData.response[0];
        const attachment = `photo${savedPhoto.owner_id}_${savedPhoto.id}`;

        // 4. Отправляем сообщение с вложением
        const randomId = Math.floor(Math.random() * 2_000_000_000);

        const { data: sendData } = await axios.post('https://api.vk.com/method/messages.send', null, {
            params: {
                user_id: userId,
                message: caption,
                attachment,
                random_id: randomId,
                v: VK_API_VERSION,
                access_token: token,
            },
            timeout: VK_TIMEOUT_MS,
        });

        if (sendData.error) {
            console.error('[VK Photo] Ошибка отправки:', sendData.error.error_msg);
            return { success: false, error: sendData.error.error_msg };
        }

        console.log('[VK Photo] Фото отправлено');
        return { success: true };
    } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Unknown error';
        console.error('[VK Photo] Ошибка:', errMsg);
        return { success: false, error: errMsg };
    }
}
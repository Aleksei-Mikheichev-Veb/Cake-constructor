// ============================================================
// server/src/services/storage.ts
// ------------------------------------------------------------
// Единственная точка контакта с облачным хранилищем.
// Если когда-нибудь захочешь уйти с Cloudinary — меняешь только
// этот файл, остальной код не трогается.
// ============================================================

import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export type CloudFolder =
    | 'decorations'
    | 'templates'
    | 'categories'
    | 'subcategories'
    | 'fillings'
    | 'shapes'
    | 'smudges'
    | 'gloss'
    | 'colors'
    | 'cupcake-bases'
    | 'cupcake-fillings'
    | 'top-colors'
    | 'references'
    | 'photoprint'
    | 'color-previews';

export type UploadResult = {
    url: string;       // публичный https-URL, кладём в БД
    publicId: string;  // нужен для удаления
};

/**
 * Загружает Buffer в Cloudinary.
 * Используется и роутом /api/upload (админка), и роутом /api/orders
 * (референсы + фотопечать + превью цветов).
 */
export async function uploadToCloud(
    buffer: Buffer,
    folder: CloudFolder,
): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: `cake-constructor/${folder}`,
                resource_type: 'image',
                // Авто-оптимизация качества и формата.
                // Cloudinary сам отдаст WebP браузеру, который умеет.
                quality: 'auto',
                fetch_format: 'auto',
            },
            (error, result: UploadApiResponse | undefined) => {
                if (error || !result) {
                    return reject(error ?? new Error('Cloudinary вернул пустой ответ'));
                }
                resolve({ url: result.secure_url, publicId: result.public_id });
            },
        );
        stream.end(buffer);
    });
}

/**
 * Удаление по publicId. Нужно при замене картинки в админке
 * (старую чистим, чтобы не копить мусор в Cloudinary).
 */
export async function deleteFromCloud(publicId: string): Promise<void> {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (err) {
        // Не бросаем исключение — удаление лучше не блокирует основную
        // операцию. Просто логируем.
        console.warn(`Не удалось удалить ${publicId}:`, (err as Error).message);
    }
}

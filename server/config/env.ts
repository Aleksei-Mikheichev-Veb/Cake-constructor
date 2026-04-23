// ============================================================
// server/config/env.ts
// ------------------------------------------------------------
// Объект config — централизованный доступ к переменным окружения.
// Все секреты (VK, TG, JWT, БД) читаются из process.env здесь,
// и весь остальной код импортирует config, а не process.env.* напрямую.
// Это нужно, чтобы:
//   1. Все имена env-переменных были в одном месте (легко найти и переименовать)
//   2. Типы были строгими (number/string/optional)
//   3. validateConfig() предупредил при старте, если что-то критичное забыли
// ============================================================

import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: Number(process.env.PORT) || 4000,

    nodeEnv: (process.env.NODE_ENV || 'development') as 'development' | 'production',

    jwt: {
        secret: process.env.JWT_SECRET || 'change-me-in-production',
    },

    vk: {
        // Токен сообщества с правом отправлять личные сообщения.
        // Получают через VK ID — Управление приложениями → Сообщество.
        communityToken: process.env.VK_COMMUNITY_TOKEN || '',
        // Числовой ID получателя (кондитера) — кому отправлять сообщения.
        // peer_id, не "id профиля" в URL.
        confectionerId: Number(process.env.VK_CONFECTIONER_ID) || 0,
        // Числовой ID профиля для построения "https://vk.com/im?sel=..."
        // (ссылка, по которой клиент попадёт в чат с кондитером после заказа).
        // Может совпадать с confectionerId или отличаться (если используется группа-посредник).
        confectionerProfileId: Number(process.env.VK_CONFECTIONER_PROFILE_ID) || 0,
    },

    telegram: {
        // Токен Telegram-бота, выданный @BotFather (формат "12345:AbCdEf...").
        botToken: process.env.TG_BOT_TOKEN || '',
        // Числовой chat_id, куда бот шлёт сообщения. Узнаётся через @userinfobot
        // или по логам бота при первом сообщении.
        confectionerChatId: Number(process.env.TG_CONFECTIONER_CHAT_ID) || 0,
    },

    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
        apiKey: process.env.CLOUDINARY_API_KEY || '',
        apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    },
};

/**
 * Опционально: вызвать при старте сервера, чтобы предупредить
 * в консоль о незаполненных критических переменных. Не падает
 * при пустых значениях — даёт серверу подняться даже если
 * VK/TG не сконфигурированы (тогда уведомления просто не будут
 * отправляться, но сами заказы создаваться будут).
 */
export function validateConfig(): void {
    const warnings: string[] = [];

    if (!config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret) {
        warnings.push('⚠️  Cloudinary не настроен — загрузка картинок не будет работать');
    }
    if (!config.vk.communityToken || !config.vk.confectionerId) {
        warnings.push('ℹ️  VK не настроен — уведомления в VK будут пропущены');
    }
    if (!config.telegram.botToken || !config.telegram.confectionerChatId) {
        warnings.push('ℹ️  Telegram не настроен — уведомления в TG будут пропущены');
    }
    if (config.jwt.secret === 'change-me-in-production' && config.nodeEnv === 'production') {
        warnings.push('🚨 JWT_SECRET не задан в продакшене — это небезопасно!');
    }

    warnings.forEach((w) => console.warn(w));
}
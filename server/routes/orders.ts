// ============================================================
// server/src/routes/orders.ts
// ------------------------------------------------------------
// Полностью переписанный роут, заменяет cake-backend/src/routes/orders.ts.
//
// Ключевые изменения против исходника:
//   1. multer: memoryStorage вместо diskStorage — на Render файлы
//      в /uploads не переживают рестарт.
//   2. Файлы едут в Cloudinary, URL записывается в БД.
//   3. Заказ сохраняется в Order (Prisma), orderId — это cuid из БД,
//      а не самопальный счётчик в памяти.
//   4. Уведомления в VK/TG — fire-and-forget: клиент получает ответ
//      сразу после записи в БД, не ждёт ответа мессенджеров.
// ============================================================

import { Router, Request, Response } from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import { OrderData } from '../types/order';
import { uploadToCloud } from '../services/storage';
import { generateColorPreview, ColorGroup } from '../services/colorPreview';
import { notifyChannels } from '../services/notifications';
import { config } from '../config/env';

const router = Router();
const prisma = new PrismaClient();

// В память, без диска — буфер живёт ровно до заливки в Cloudinary.
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        cb(null, allowed.includes(file.mimetype));
    },
});

const uploadFields = upload.fields([
    { name: 'references', maxCount: 3 },
    { name: 'photoprint', maxCount: 1 },
]);

router.post('/', uploadFields, async (req: Request, res: Response) => {
    try {
        const orderData: OrderData = JSON.parse(req.body.orderData);

        if (!orderData.dessertType) {
            return res.status(400).json({ success: false, message: 'Не указан тип десерта' });
        }
        if (!orderData.clientName || !orderData.clientPhone) {
            return res.status(400).json({ success: false, message: 'Укажите имя и телефон' });
        }

        const files = req.files as { [field: string]: Express.Multer.File[] } | undefined;
        const referenceFiles = files?.references ?? [];
        const photoPrintFiles = files?.photoprint ?? [];

        // ─── Заливаем все файлы в Cloudinary параллельно ───
        const [referenceUploads, photoPrintUploads] = await Promise.all([
            Promise.all(referenceFiles.map((f) => uploadToCloud(f.buffer, 'references'))),
            Promise.all(photoPrintFiles.map((f) => uploadToCloud(f.buffer, 'photoprint'))),
        ]);

        const referenceUrls = referenceUploads.map((u) => u.url);
        const photoPrintUrls = photoPrintUploads.map((u) => u.url);

        // ─── Превью цветов, если выбраны ───
        const colorGroups: ColorGroup[] = [];
        if (orderData.colors?.length) {
            colorGroups.push({ label: 'Цвета торта', colors: orderData.colors });
        }
        if (orderData.creamTextColor) {
            colorGroups.push({ label: 'Цвет надписи кремом', colors: [orderData.creamTextColor] });
        }

        let colorPreviewUrl: string | null = null;
        if (colorGroups.length > 0) {
            const buf = await generateColorPreview(colorGroups);
            if (buf) {
                const uploaded = await uploadToCloud(buf, 'color-previews');
                colorPreviewUrl = uploaded.url;
            }
        }

        // ─── Сохраняем заказ в БД ───
        // orderSnapshot — полная копия состояния конструктора на момент заказа,
        // чтобы потом в админке можно было открыть заказ и увидеть, что именно
        // клиент выбирал, даже если цены/декорации с тех пор изменились.
        const order = await prisma.order.create({
            data: {
                status: 'NEW',
                totalPrice: orderData.totalPrice ?? 0,
                customerName: orderData.clientName,
                customerPhone: orderData.clientPhone,
                customerEmail: orderData.clientContact ?? null,
                comment: orderData.orderComment ?? null,
                orderSnapshot: {
                    ...orderData,
                    assets: {
                        referenceUrls,
                        photoPrintUrls,
                        colorPreviewUrl,
                    },
                } as object,
            },
        });

        console.log(`📦 Новый заказ ${order.id} от ${orderData.clientName}`);

        // ─── Fire-and-forget уведомления ───
        // Клиент не ждёт ответа VK/TG — он получает ответ сразу.
        // Если что-то упадёт, ошибка попадёт в логи, а заказ уже в БД.
        void notifyChannels(order.id, orderData, {
            referenceUrls,
            photoPrintUrls,
            colorPreviewUrl,
        }).then((results) => {
            console.log(`   Notify — VK: ${results.vk}, TG: ${results.telegram}`);
            // Опционально — пометить в БД, что уведомления прошли
            // prisma.order.update({ where: { id: order.id }, data: { notified: results } })
        }).catch((err) => {
            console.error(`   Notify failed for ${order.id}:`, err);
        });

        // ─── Ответ клиенту ───
        res.json({
            success: true,
            orderId: order.id,
            vkRedirect: config.vk.confectionerProfileId
                ? `https://vk.com/im?sel=${config.vk.confectionerProfileId}`
                : null,
            message: 'Заказ принят',
        });
    } catch (err) {
        console.error('Ошибка обработки заказа:', err);
        res.status(500).json({ success: false, message: 'Внутренняя ошибка сервера' });
    }
});

export default router;

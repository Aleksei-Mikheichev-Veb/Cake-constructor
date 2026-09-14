
// POST /api/feedback  — сохраняет отзыв клиента об удобстве
// конструктора. Привязан к orderId, но не требует авторизации
// (клиент отправляет сразу после заказа).
//
// Защита от накрутки — один orderId = один отзыв (@unique в схеме).
// ============================================================

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req: Request, res: Response) => {
    try {
        const { orderId, rating, comment } = req.body;

        // Валидация
        if (!orderId || typeof orderId !== 'string') {
            return res.status(400).json({ success: false, message: 'orderId обязателен' });
        }
        if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'rating должен быть от 1 до 5' });
        }

        // Проверяем что заказ существует
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Заказ не найден' });
        }

        // Сохраняем — upsert на случай повторной попытки
        const feedback = await prisma.orderFeedback.upsert({
            where: { orderId },
            update: { rating, comment: comment ?? null },
            create: { orderId, rating, comment: comment ?? null },
        });

        console.log(`⭐ Отзыв для заказа ${orderId}: ${rating}/5`);

        res.json({ success: true, feedbackId: feedback.id });
    } catch (err) {
        console.error('Ошибка сохранения отзыва:', err);
        res.status(500).json({ success: false, message: 'Внутренняя ошибка сервера' });
    }
});

// GET /api/feedback — список всех отзывов для админки
router.get('/', authMiddleware, async (_req: Request, res: Response) => {
    try {
        const feedbacks = await prisma.orderFeedback.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                order: {
                    select: {
                        customerName: true,
                        customerPhone: true,
                        totalPrice: true,
                    },
                },
            },
        });
        res.json(feedbacks);
    } catch (err) {
        console.error('Ошибка получения отзывов:', err);
        res.status(500).json({ success: false, message: 'Внутренняя ошибка сервера' });
    }
});

export default router;
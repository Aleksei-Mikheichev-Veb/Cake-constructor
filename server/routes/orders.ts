// ============================================================
// server/routes/orders.ts — Заказы
// ============================================================
//
// POST /api/orders      — создать заказ (из конструктора, публичный)
// GET  /api/orders      — список заказов (админка, защищённый)
// PUT  /api/orders/:id  — обновить статус (админка)
// ============================================================

import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/orders — покупатель оформляет заказ
// Тело запроса:
// {
//   "customerName": "Иван",
//   "customerPhone": "+7 999 123 45 67",
//   "customerEmail": "ivan@mail.ru",
//   "comment": "Доставка после 18:00",
//   "totalPrice": 4500,
//   "orderSnapshot": { ... весь стейт конструктора ... }
// }
router.post('/', async (req: Request, res: Response) => {
  try {
    const { customerName, customerPhone, customerEmail, comment, totalPrice, orderSnapshot } = req.body;

    if (!customerName || !customerPhone || !totalPrice || !orderSnapshot) {
      return res.status(400).json({ error: 'Заполните обязательные поля' });
    }

    const order = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        customerEmail,
        comment,
        totalPrice: parseFloat(totalPrice),
        orderSnapshot, // JSON-снимок всего выбора покупателя
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Ошибка создания заказа:', error);
    res.status(500).json({ error: 'Не удалось создать заказ' });
  }
});

// GET /api/orders — список заказов для админки
// Query-параметры:
//   ?status=NEW         — фильтр по статусу
//   ?page=1&limit=20    — пагинация
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: status ? { status: status as any } : {},
        orderBy: { createdAt: 'desc' }, // Новые заказы сверху
        skip,
        take: parseInt(limit as string),
      }),
      prisma.order.count({
        where: status ? { status: status as any } : {},
      }),
    ]);

    res.json({
      orders,
      total,
      page: parseInt(page as string),
      totalPages: Math.ceil(total / parseInt(limit as string)),
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки заказов' });
  }
});

// GET /api/orders/:id — детали одного заказа
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
    });
    if (!order) return res.status(404).json({ error: 'Заказ не найден' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// PUT /api/orders/:id — обновить статус заказа
// { "status": "CONFIRMED" }
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления заказа' });
  }
});

export default router;

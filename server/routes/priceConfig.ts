// ============================================================
// server/routes/priceConfig.ts — Ценовые конфиги
// ============================================================
//
// Самый важный маршрут для бизнеса — цены!
// Заменяет захардкоженный dessertPriceConfig.ts и магические числа
// (650 за фотопечать, 150 за букву, 200 за цифру).
//
// GET  /api/price-config/:key  — получить конфиг по ключу (для конструктора)
// PUT  /api/price-config/:id   — обновить (админка)
//
// Ключ (key) — это subcategoryId или categoryId:
//   /api/price-config/biscuit   → конфиг бисквитного торта
//   /api/price-config/cupcakes  → конфиг капкейков
// ============================================================

import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// ─────────────────────────────────────────────
// GET /api/price-config/:key
// ─────────────────────────────────────────────
// key может быть subcategoryId ("biscuit", "bento") или categoryId ("cupcakes")
//
// Ответ (пример для бисквитного):
// {
//   "id": "abc123",
//   "subcategoryId": "biscuit",
//   "pricePerKg": 2500,
//   "fixedPrices": null,
//   "fixedPricesByQuantity": null,
//   "photoPrintPrice": 650,
//   "chocolateLetterPrice": 150,
//   "chocolateNumberPrice": 200
// }
//
// Ответ (пример для капкейков):
// {
//   "id": "def456",
//   "categoryId": "cupcakes",
//   "pricePerKg": null,
//   "fixedPrices": null,
//   "fixedPricesByQuantity": { "6": 1800, "12": 3200, "18": 4500 },
//   "photoPrintPrice": 650,
//   "chocolateLetterPrice": 150,
//   "chocolateNumberPrice": 200
// }

router.get('/:key', async (req: Request, res: Response) => {
  try {
    const { key } = req.params;

    // Пробуем найти по subcategoryId (торты)
    let config = await prisma.priceConfig.findUnique({
      where: { subcategoryId: key },
    });

    // Если не нашли — пробуем по categoryId (капкейки, трайфлы)
    if (!config) {
      config = await prisma.priceConfig.findUnique({
        where: { categoryId: key },
      });
    }

    if (!config) {
      return res.status(404).json({ error: `Ценовой конфиг для "${key}" не найден` });
    }

    res.json(config);
  } catch (error) {
    console.error('Ошибка при получении ценового конфига:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ─────────────────────────────────────────────
// GET /api/price-config — все конфиги (для админки)
// ─────────────────────────────────────────────

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const configs = await prisma.priceConfig.findMany({
      include: {
        category: { select: { name: true } },      // Подтягиваем имя категории
        subcategory: { select: { name: true } },   // и подкатегории
      },
    });

    res.json(configs);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ─────────────────────────────────────────────
// PUT /api/price-config/:id — обновить ценовой конфиг
// ─────────────────────────────────────────────
// Кондитер может:
// - Изменить цену за кг
// - Изменить фиксированные цены
// - Изменить стоимость фотопечати
// - Изменить цену шоколадных букв/цифр
//
// Пример тела запроса:
// {
//   "pricePerKg": 2800,
//   "photoPrintPrice": 700,
//   "chocolateLetterPrice": 180
// }

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const config = await prisma.priceConfig.update({
      where: { id },
      data: {
        pricePerKg: req.body.pricePerKg,
        fixedPrices: req.body.fixedPrices,
        fixedPricesByQuantity: req.body.fixedPricesByQuantity,
        photoPrintPrice: req.body.photoPrintPrice,
        chocolateLetterPrice: req.body.chocolateLetterPrice,
        chocolateNumberPrice: req.body.chocolateNumberPrice,
      },
    });

    res.json(config);
  } catch (error) {
    console.error('Ошибка при обновлении ценового конфига:', error);
    res.status(500).json({ error: 'Не удалось обновить цены' });
  }
});

export default router;

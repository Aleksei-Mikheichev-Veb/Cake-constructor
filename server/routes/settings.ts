// ============================================================
// server/routes/settings.ts — Глобальные настройки сайта
// ============================================================

import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/settings — все настройки (публичный, нужен конструктору)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const settings = await prisma.siteSetting.findMany();
    // Преобразуем в удобный объект: { maxDecorations: "3", maxReferenceImages: "3" }
    const obj = Object.fromEntries(settings.map(s => [s.key, s.value]));
    res.json(obj);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки настроек' });
  }
});

// PUT /api/settings/:key — обновить одну настройку
router.put('/:key', authMiddleware, async (req, res) => {
  try {
    const setting = await prisma.siteSetting.update({
      where: { key: req.params.key },
      data: { value: String(req.body.value) },
    });
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления настройки' });
  }
});

export default router;

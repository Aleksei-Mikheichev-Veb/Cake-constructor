// ============================================================
// server/routes/colors.ts — Цветовые схемы
// ============================================================

import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/colors?target=CAKE   — для обычных тортов
// GET /api/colors?target=MOUSSE — для муссовых
router.get('/', async (req: Request, res: Response) => {
  try {
    const { target } = req.query;
    const colors = await prisma.colorOption.findMany({
      where: {
        isActive: true,
        ...(target ? { target: (target as string).toUpperCase() as any } : {}),
      },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(colors);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки цветов' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try { res.status(201).json(await prisma.colorOption.create({ data: req.body })); }
  catch (e) { res.status(500).json({ error: 'Ошибка создания' }); }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try { res.json(await prisma.colorOption.update({ where: { id: req.params.id }, data: req.body })); }
  catch (e) { res.status(500).json({ error: 'Ошибка обновления' }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.colorOption.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ message: 'Деактивировано' });
  } catch (e) { res.status(500).json({ error: 'Ошибка удаления' }); }
});

export default router;

// ============================================================
// server/routes/shapes.ts — Формы торта
// ============================================================

import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/shapes?subcategoryId=bento
router.get('/', async (req: Request, res: Response) => {
  try {
    const { subcategoryId } = req.query;
    if (subcategoryId) {
      const links = await prisma.subcategoryShape.findMany({
        where: { subcategoryId: subcategoryId as string },
        include: { shape: true },
        orderBy: { sortOrder: 'asc' },
      });
      res.json(links.filter(l => l.shape.isActive).map(l => l.shape));
    } else {
      const shapes = await prisma.shape.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });
      res.json(shapes);
    }
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки форм' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { subcategoryIds, ...data } = req.body;
    const shape = await prisma.shape.create({
      data: {
        ...data,
        subcategories: subcategoryIds ? {
          create: subcategoryIds.map((subId: string, i: number) => ({
            subcategoryId: subId,
            sortOrder: i,
          })),
        } : undefined,
      },
    });
    res.status(201).json(shape);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка создания формы' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const shape = await prisma.shape.update({ where: { id: req.params.id }, data: req.body });
    res.json(shape);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления формы' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.shape.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ message: 'Форма деактивирована' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления формы' });
  }
});

export default router;

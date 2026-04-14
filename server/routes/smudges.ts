// ============================================================
// server/routes/smudges.ts — Подтёки
// ============================================================

import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const smudges = await prisma.smudge.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(smudges);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки подтёков' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const smudge = await prisma.smudge.create({ data: req.body });
    res.status(201).json(smudge);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка создания' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const smudge = await prisma.smudge.update({ where: { id: req.params.id }, data: req.body });
    res.json(smudge);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.smudge.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ message: 'Подтёк деактивирован' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления' });
  }
});

export default router;

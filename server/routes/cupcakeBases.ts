// ============================================================
// server/routes/cupcakeBases.ts — Основы капкейков
// ============================================================

import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/cupcake-bases — список для конструктора
router.get('/', async (_req: Request, res: Response) => {
  try {
    const bases = await prisma.cupcakeBase.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(bases);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки основ капкейков' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try { res.status(201).json(await prisma.cupcakeBase.create({ data: req.body })); }
  catch (e) { res.status(500).json({ error: 'Ошибка создания' }); }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try { res.json(await prisma.cupcakeBase.update({ where: { id: req.params.id }, data: req.body })); }
  catch (e) { res.status(500).json({ error: 'Ошибка обновления' }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.cupcakeBase.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ message: 'Деактивировано' });
  } catch (e) { res.status(500).json({ error: 'Ошибка удаления' }); }
});

export default router;

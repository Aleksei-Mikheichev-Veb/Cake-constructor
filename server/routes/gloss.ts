// ============================================================
// server/routes/gloss.ts — Глянец/покрытие (для муссовых)
// ============================================================

import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    res.json(await prisma.glossOption.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }));
  } catch (e) { res.status(500).json({ error: 'Ошибка загрузки' }); }
});

router.post('/', authMiddleware, async (req, res) => {
  try { res.status(201).json(await prisma.glossOption.create({ data: req.body })); }
  catch (e) { res.status(500).json({ error: 'Ошибка создания' }); }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try { res.json(await prisma.glossOption.update({ where: { id: req.params.id }, data: req.body })); }
  catch (e) { res.status(500).json({ error: 'Ошибка обновления' }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.glossOption.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ message: 'Деактивировано' });
  } catch (e) { res.status(500).json({ error: 'Ошибка удаления' }); }
});

export default router;

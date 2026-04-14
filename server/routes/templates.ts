// ============================================================
// server/routes/templates.ts — Шаблоны оформления
// ============================================================

import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const templates = await prisma.template.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки шаблонов' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const template = await prisma.template.create({ data: req.body });
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка создания шаблона' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const template = await prisma.template.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления шаблона' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.template.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json({ message: 'Шаблон деактивирован' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления шаблона' });
  }
});

export default router;

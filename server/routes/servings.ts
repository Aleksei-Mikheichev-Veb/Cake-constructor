// ============================================================
// server/routes/servings.ts — Варианты порций/веса
// ============================================================

import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/servings?subcategoryId=biscuit  — для тортов
// GET /api/servings?categoryId=cupcakes    — для капкейков/трайфлов
router.get('/', async (req: Request, res: Response) => {
  try {
    const { subcategoryId, categoryId } = req.query;
    const servings = await prisma.servingOption.findMany({
      where: {
        isActive: true,
        ...(subcategoryId ? { subcategoryId: subcategoryId as string } : {}),
        ...(categoryId ? { categoryId: categoryId as string } : {}),
      },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(servings);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки порций' });
  }
});

// POST /api/servings
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const serving = await prisma.servingOption.create({ data: req.body });
    res.status(201).json(serving);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка создания варианта порций' });
  }
});

// PUT /api/servings/:id
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const serving = await prisma.servingOption.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(serving);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления' });
  }
});

// DELETE /api/servings/:id
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.servingOption.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json({ message: 'Вариант порций деактивирован' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления' });
  }
});

export default router;

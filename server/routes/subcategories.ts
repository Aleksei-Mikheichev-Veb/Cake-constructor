// ============================================================
// server/routes/subcategories.ts
// ============================================================

import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/subcategories?categoryId=cakes
router.get('/', async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.query;
    const subcategories = await prisma.subcategory.findMany({
      where: {
        isActive: true,
        ...(categoryId ? { categoryId: categoryId as string } : {}),
      },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки подкатегорий' });
  }
});

// PUT /api/subcategories/:id
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const subcategory = await prisma.subcategory.update({
      where: { id: req.params.id },
      data: {
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        isActive: req.body.isActive,
        sortOrder: req.body.sortOrder,
      },
    });
    res.json(subcategory);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления подкатегории' });
  }
});

export default router;

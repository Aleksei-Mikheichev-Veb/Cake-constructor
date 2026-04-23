// ============================================================
// server/routes/controls.ts — Контролы конструктора
// ============================================================
// Определяет, какие шаги показывать для каждого типа десерта.
// Заменяет cakeVariants.ts и dessertVariants.ts

import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/controls?subcategoryId=biscuit — контролы для бисквитного торта
// GET /api/controls?categoryId=cupcakes   — контролы для капкейков
router.get('/', async (req: Request, res: Response) => {
  try {
    const { subcategoryId, categoryId } = req.query;
    const controls = await prisma.constructorControl.findMany({
      where: {
        isActive: true,
        ...(subcategoryId ? { subcategoryId: subcategoryId as string } : {}),
        ...(categoryId ? { categoryId: categoryId as string } : {}),
      },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(controls);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки контролов' });
  }
});

// PUT /api/controls/:id — обновить (изменить заголовок, порядок, настройки)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const control = await prisma.constructorControl.update({
      where: { id: req.params.id },
      data: {
        title: req.body.title,
        sortOrder: req.body.sortOrder,
        isActive: req.body.isActive,
        settings: req.body.settings,
      },
    });
    res.json(control);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления контрола' });
  }
});

// PUT /api/controls/reorder — изменить порядок контролов
router.put('/reorder', authMiddleware, async (req, res) => {
  try {
    const { ids } = req.body;
    const updates = ids.map((id: string, index: number) =>
      prisma.constructorControl.update({
        where: { id },
        data: { sortOrder: index },
      })
    );
    await prisma.$transaction(updates);
    res.json({ message: 'Порядок контролов обновлён' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления порядка' });
  }
});

export default router;

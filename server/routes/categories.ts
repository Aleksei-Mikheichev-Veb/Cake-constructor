// ============================================================
// server/routes/categories.ts
// ============================================================

import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/categories — список категорий (публичный, для конструктора)
router.get('/', async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            where: { isActive: true },
            include: { subcategories: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
            orderBy: { sortOrder: 'asc' },
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка загрузки категорий' });
    }
});

// PUT /api/categories/:id — обновить (админка)
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const category = await prisma.category.update({
            where: { id: req.params.id as string },
            data: {
                name: req.body.name,
                description: req.body.description,
                image: req.body.image,
                isActive: req.body.isActive,
                sortOrder: req.body.sortOrder,
            },
        });
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка обновления категории' });
    }
});

export default router;

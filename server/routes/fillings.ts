// ============================================================
// server/routes/fillings.ts — Начинки
// ============================================================
// Начинки привязаны к подкатегориям через промежуточную таблицу.
// GET /api/fillings?subcategoryId=biscuit — начинки для бисквитного

import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/fillings?subcategoryId=biscuit — начинки для конкретной подкатегории
router.get('/', async (req: Request, res: Response) => {
  try {
    const { subcategoryId } = req.query;

    if (subcategoryId) {
      // Получаем начинки, привязанные к этой подкатегории
      const links = await prisma.subcategoryFilling.findMany({
        where: { subcategoryId: subcategoryId as string },
        include: { filling: true },
        orderBy: { sortOrder: 'asc' },
      });
      // Возвращаем только объекты начинок (без обёртки связи)
      res.json(links.map(l => l.filling));
    } else {
      // Все начинки (для админки) — вместе с привязками к подкатегориям,
      // чтобы в форме редактирования можно было показать текущий выбор
      const fillings = await prisma.filling.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: { subcategories: true },
      });
      res.json(fillings);
    }
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки начинок' });
  }
});

// POST /api/fillings — создать начинку
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, image, subcategoryIds } = req.body;

    const filling = await prisma.filling.create({
      data: {
        name,
        description,
        image,
        // Сразу привязываем к подкатегориям
        subcategories: subcategoryIds ? {
          create: subcategoryIds.map((subId: string, i: number) => ({
            subcategoryId: subId,
            sortOrder: i,
          })),
        } : undefined,
      },
    });

    res.status(201).json(filling);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка создания начинки' });
  }
});

// PUT /api/fillings/:id
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { subcategoryIds } = req.body;

    const filling = await prisma.$transaction(async (tx) => {
      const updated = await tx.filling.update({
        where: { id: req.params.id },
        data: {
          name: req.body.name,
          description: req.body.description,
          image: req.body.image,
          isActive: req.body.isActive,
        },
      });

      // Если пришёл список подкатегорий — полностью пересобираем привязки
      // (проще, чем считать diff, а начинок с сотнями привязок не бывает)
      if (subcategoryIds) {
        await tx.subcategoryFilling.deleteMany({ where: { fillingId: req.params.id } });
        if (subcategoryIds.length) {
          await tx.subcategoryFilling.createMany({
            data: subcategoryIds.map((subId: string, i: number) => ({
              fillingId: req.params.id,
              subcategoryId: subId,
              sortOrder: i,
            })),
          });
        }
      }

      return updated;
    });

    res.json(filling);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления начинки' });
  }
});

// DELETE /api/fillings/:id
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.filling.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json({ message: 'Начинка деактивирована' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления начинки' });
  }
});

export default router;

// ============================================================
// server/routes/decorations.ts — CRUD для декораций
// ============================================================
//
// Это ШАБЛОННЫЙ маршрут — все остальные сущности (начинки, шаблоны,
// подтёки и т.д.) устроены точно так же. Поэтому я подробно
// прокомментирую каждую строку именно здесь.
//
// CRUD = Create, Read, Update, Delete:
//   GET    /api/decorations          — список (для конструктора и админки)
//   GET    /api/decorations/:id      — одна декорация (для админки)
//   POST   /api/decorations          — создать (админка, защищено)
//   PUT    /api/decorations/:id      — обновить (админка, защищено)
//   DELETE /api/decorations/:id      — удалить (админка, защищено)
//
// GET-маршруты — публичные (конструктор их вызывает без авторизации).
// POST/PUT/DELETE — защищены authMiddleware (только для админки).
// ============================================================

import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// ─────────────────────────────────────────────
// GET /api/decorations
// ─────────────────────────────────────────────
// Публичный маршрут — вызывается конструктором на фронтенде.
//
// Query-параметры (необязательные):
//   ?group=main       — только основные декорации
//   ?group=additional  — только дополнительные
//   ?group=all         — все (для бенто/мусс)
//   ?group=small       — маленькие (для капкейков)
//   (без group)        — все декорации
//
// Пример запроса с фронтенда:
//   fetch('/api/decorations?group=main')
//     .then(res => res.json())
//     .then(decorations => { ... })

router.get('/', async (req: Request, res: Response) => {
  try {
    const { group } = req.query;

    const decorations = await prisma.decoration.findMany({
      where: {
        isActive: true, // Показываем только активные (не "удалённые")
        // Если передан group — фильтруем. Если нет — отдаём все.
        ...(group
          ? { group: (group as string).toUpperCase() as any }
          : {}),
      },
      orderBy: { sortOrder: 'asc' }, // Сортировка по полю sortOrder
    });

    res.json(decorations);
  } catch (error) {
    console.error('Ошибка при получении декораций:', error);
    res.status(500).json({ error: 'Не удалось загрузить декорации' });
  }
});

// ─────────────────────────────────────────────
// GET /api/decorations/all — для админки (включая неактивные)
// ─────────────────────────────────────────────
// В админке нужно видеть ВСЕ декорации, включая выключенные.

router.get('/all', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const decorations = await prisma.decoration.findMany({
      orderBy: [
        { group: 'asc' },
        { sortOrder: 'asc' },
      ],
    });

    res.json(decorations);
  } catch (error) {
    res.status(500).json({ error: 'Не удалось загрузить декорации' });
  }
});

// ─────────────────────────────────────────────
// GET /api/decorations/:id — одна декорация
// ─────────────────────────────────────────────
// Для страницы редактирования в админке.

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const decoration = await prisma.decoration.findUnique({
      where: { id: req.params.id },
    });

    if (!decoration) {
      return res.status(404).json({ error: 'Декорация не найдена' });
    }

    res.json(decoration);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ─────────────────────────────────────────────
// POST /api/decorations — создать новую декорацию
// ─────────────────────────────────────────────
// Защищено authMiddleware — только авторизованные пользователи.
//
// Тело запроса (JSON):
// {
//   "name": "Безе",
//   "description": "Воздушные безе",
//   "image": "/uploads/abc123-beze.jpg",  ← URL от POST /api/upload
//   "price": 350,
//   "group": "MAIN",
//   "byThePiece": true,
//   "minCount": 3
// }

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, image, price, group, byThePiece, minCount } = req.body;

    // Валидация — проверяем обязательные поля
    if (!name || !description || !image || price === undefined || !group) {
      return res.status(400).json({
        error: 'Заполните все обязательные поля: name, description, image, price, group',
      });
    }

    // Определяем sortOrder — ставим в конец списка
    const maxOrder = await prisma.decoration.aggregate({
      where: { group },
      _max: { sortOrder: true },
    });
    const nextOrder = (maxOrder._max.sortOrder ?? -1) + 1;

    const decoration = await prisma.decoration.create({
      data: {
        name,
        description,
        image,
        price: parseFloat(price),
        group,
        byThePiece: byThePiece || false,
        minCount: minCount ? parseInt(minCount) : null,
        sortOrder: nextOrder,
      },
    });

    res.status(201).json(decoration);
  } catch (error) {
    console.error('Ошибка при создании декорации:', error);
    res.status(500).json({ error: 'Не удалось создать декорацию' });
  }
});

// ─────────────────────────────────────────────
// PUT /api/decorations/:id — обновить декорацию
// ─────────────────────────────────────────────
// Кондитер меняет цену, описание, картинку или выключает декорацию.
//
// Можно отправлять только те поля, которые меняются:
// PUT /api/decorations/abc123
// { "price": 400 }  ← изменится только цена

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Проверяем, существует ли декорация
    const existing = await prisma.decoration.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Декорация не найдена' });
    }

    // Обновляем только переданные поля
    // Prisma игнорирует undefined-значения, поэтому непереданные поля не изменятся
    const decoration = await prisma.decoration.update({
      where: { id },
      data: {
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        price: req.body.price !== undefined ? parseFloat(req.body.price) : undefined,
        group: req.body.group,
        byThePiece: req.body.byThePiece,
        minCount: req.body.minCount !== undefined ? parseInt(req.body.minCount) : undefined,
        isActive: req.body.isActive,
        sortOrder: req.body.sortOrder,
      },
    });

    res.json(decoration);
  } catch (error) {
    console.error('Ошибка при обновлении декорации:', error);
    res.status(500).json({ error: 'Не удалось обновить декорацию' });
  }
});

// ─────────────────────────────────────────────
// DELETE /api/decorations/:id — удалить декорацию
// ─────────────────────────────────────────────
// Вместо реального удаления — «мягкое удаление» (isActive = false).
// Это безопаснее: данные не теряются, можно восстановить.
// Реальное удаление — только по отдельной кнопке (hardDelete).

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { hard } = req.query; // ?hard=true для полного удаления

    if (hard === 'true') {
      // Полное удаление из базы — необратимо
      await prisma.decoration.delete({ where: { id } });
      res.json({ message: 'Декорация полностью удалена' });
    } else {
      // Мягкое удаление — просто выключаем
      await prisma.decoration.update({
        where: { id },
        data: { isActive: false },
      });
      res.json({ message: 'Декорация деактивирована' });
    }
  } catch (error) {
    console.error('Ошибка при удалении декорации:', error);
    res.status(500).json({ error: 'Не удалось удалить декорацию' });
  }
});

// ─────────────────────────────────────────────
// PUT /api/decorations/reorder — изменить порядок
// ─────────────────────────────────────────────
// Кондитер перетаскивает декорации в админке,
// фронтенд отправляет новый порядок.
// Тело: { ids: ["id3", "id1", "id2"] }

router.put('/reorder', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'ids должен быть массивом' });
    }

    // Обновляем sortOrder для каждой декорации по порядку в массиве
    const updates = ids.map((id: string, index: number) =>
      prisma.decoration.update({
        where: { id },
        data: { sortOrder: index },
      })
    );

    // $transaction — все обновления выполняются атомарно
    // (либо все, либо ни одного — если одно упадёт, откатятся все)
    await prisma.$transaction(updates);

    res.json({ message: 'Порядок обновлён' });
  } catch (error) {
    res.status(500).json({ error: 'Не удалось обновить порядок' });
  }
});

export default router;

// ============================================================
// server/routes/auth.ts — Авторизация
// ============================================================
//
// POST /api/auth/login  — вход в админку
// POST /api/auth/me     — проверка текущего пользователя
//
// Регистрацию нового кондитера может делать только OWNER
// через отдельный эндпоинт (добавим позже).
// ============================================================

import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

// ─────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────
// Тело запроса: { email: "admin@cakes.ru", password: "admin123" }
// Ответ: { token: "eyJhbGciOi...", user: { id, email, name, role } }

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Укажите email и пароль' });
    }

    // Ищем пользователя по email
    const user = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Сравниваем пароль с хешем в базе
    // bcrypt.compare сам хеширует введённый пароль и сравнивает
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Создаём JWT-токен
    // Токен содержит id, email и role — их можно достать на любом маршруте
    // expiresIn: '7d' — токен живёт 7 дней, потом нужно логиниться снова
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ─────────────────────────────────────────────
// GET /api/auth/me
// ─────────────────────────────────────────────
// Проверяет, действителен ли текущий токен.
// Админка вызывает при загрузке, чтобы понять — залогинен ли пользователь.

router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.adminUser.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, name: true, role: true },
      // select — выбираем только нужные поля (пароль НЕ возвращаем!)
    });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;

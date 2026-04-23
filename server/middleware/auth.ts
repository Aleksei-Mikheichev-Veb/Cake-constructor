// ============================================================
// server/middleware/auth.ts — Защита маршрутов авторизацией
// ============================================================
//
// Middleware — это функция, которая выполняется ПЕРЕД обработчиком маршрута.
// authMiddleware проверяет JWT-токен в заголовке запроса.
// Если токен валидный → пропускает дальше (next()).
// Если нет → возвращает 401 Unauthorized.
//
// Как это работает:
// 1. Кондитер логинится через POST /api/auth/login
// 2. Сервер отдаёт JWT-токен (строка вида "eyJhbGciOi...")
// 3. Админка сохраняет токен в localStorage
// 4. При каждом запросе к защищённому маршруту админка отправляет:
//    Authorization: Bearer eyJhbGciOi...
// 5. authMiddleware проверяет этот токен
//
// Публичные маршруты (GET для конструктора) НЕ используют этот middleware.
// Только маршруты, которые ИЗМЕНЯЮТ данные (POST, PUT, DELETE).
// ============================================================

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

// Расширяем тип Request, чтобы TypeScript знал про req.user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Достаём токен из заголовка
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }

  const token = authHeader.split(' ')[1]; // "Bearer TOKEN" → "TOKEN"

  try {
    // jwt.verify проверяет подпись токена и его срок действия
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
    };

    // Сохраняем данные пользователя в req для использования в маршруте
    req.user = decoded;
    next(); // Всё ок — передаём управление следующему обработчику
  } catch (error) {
    return res.status(401).json({ error: 'Недействительный токен' });
  }
};

// Middleware для проверки роли OWNER (для опасных операций)
export const ownerOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'OWNER') {
    return res.status(403).json({ error: 'Только владелец может выполнять это действие' });
  }
  next();
};

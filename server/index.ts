// ============================================================
// server/index.ts — Точка входа сервера
// ============================================================
//
// Это главный файл сервера. Он:
// 1. Создаёт Express-приложение
// 2. Подключает middleware (промежуточные обработчики)
// 3. Регистрирует маршруты (routes)
// 4. Запускает сервер на указанном порту
//
// Запуск: npx ts-node server/index.ts
// Или через nodemon для автоперезагрузки:
//   npx nodemon --exec ts-node server/index.ts
// ============================================================

import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

// Загружаем переменные окружения из файла .env
// (DATABASE_URL, JWT_SECRET, PORT и т.д.)
dotenv.config();

// Импорт маршрутов — каждый файл отвечает за свою сущность
import categoriesRouter from './routes/categories';
import subcategoriesRouter from './routes/subcategories';
import decorationsRouter from './routes/decorations';
import fillingsRouter from './routes/fillings';
import servingsRouter from './routes/servings';
import templatesRouter from './routes/templates';
import priceConfigRouter from './routes/priceConfig';
import controlsRouter from './routes/controls';
import shapesRouter from './routes/shapes';
import smudgesRouter from './routes/smudges';
import glossRouter from './routes/gloss';
import colorsRouter from './routes/colors';
import settingsRouter from './routes/settings';
import uploadRouter from './routes/upload';
import authRouter from './routes/auth';
import ordersRouter from './routes/orders';

const app = express();
const PORT = process.env.PORT || 4000;

// ─────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────

// cors — разрешает запросы с фронтенда (другой порт)
// Без этого браузер заблокирует запросы с localhost:3000 на localhost:4000
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // разрешает отправку cookies (для авторизации)
}));

// Парсинг JSON из тела запроса
// Без этого req.body будет undefined при POST/PUT запросах
app.use(express.json());

// Раздача загруженных файлов (картинки декораций, шаблонов и т.д.)
// Запрос GET /uploads/beze.jpg → отдаёт файл server/uploads/beze.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─────────────────────────────────────────────
// МАРШРУТЫ (ROUTES)
// ─────────────────────────────────────────────
// Каждый router обрабатывает свою группу эндпоинтов.
// Например, decorationsRouter обрабатывает:
//   GET  /api/decorations       — список декораций
//   GET  /api/decorations/:id   — одна декорация
//   POST /api/decorations       — создать декорацию (админка)
//   PUT  /api/decorations/:id   — обновить (админка)
//   DELETE /api/decorations/:id — удалить (админка)

app.use('/api/auth', authRouter);               // Авторизация: логин, регистрация
app.use('/api/categories', categoriesRouter);     // Категории: торты, капкейки, трайфлы
app.use('/api/subcategories', subcategoriesRouter); // Подкатегории: бисквитный, бенто...
app.use('/api/decorations', decorationsRouter);   // Декорации
app.use('/api/fillings', fillingsRouter);         // Начинки
app.use('/api/servings', servingsRouter);         // Варианты порций/веса
app.use('/api/templates', templatesRouter);       // Шаблоны оформления
app.use('/api/price-config', priceConfigRouter);  // Ценовые конфиги
app.use('/api/controls', controlsRouter);         // Контролы конструктора
app.use('/api/shapes', shapesRouter);             // Формы торта
app.use('/api/smudges', smudgesRouter);           // Подтёки
app.use('/api/gloss', glossRouter);               // Глянец/велюр
app.use('/api/colors', colorsRouter);             // Цвета
app.use('/api/settings', settingsRouter);         // Настройки сайта
app.use('/api/upload', uploadRouter);             // Загрузка картинок
app.use('/api/orders', ordersRouter);             // Заказы

// ─────────────────────────────────────────────
// ОБРАБОТКА ОШИБОК
// ─────────────────────────────────────────────
// Если где-то в маршруте произошла ошибка, она попадёт сюда.
// Вместо того чтобы сервер упал, он вернёт клиенту JSON с ошибкой.

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Ошибка сервера:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Внутренняя ошибка сервера',
  });
});

// ─────────────────────────────────────────────
// ЗАПУСК
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
  console.log(`📁 Статика: http://localhost:${PORT}/uploads`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
});

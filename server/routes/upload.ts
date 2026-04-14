// ============================================================
// server/routes/upload.ts — Загрузка файлов (картинок)
// ============================================================
//
// POST /api/upload — загрузить картинку
//
// Используется из админки при создании/редактировании:
// 1. Кондитер выбирает файл
// 2. Фронтенд отправляет его на POST /api/upload
// 3. Сервер сохраняет файл и возвращает URL
// 4. Фронтенд подставляет URL в поле image при создании/обновлении сущности
// ============================================================

import { Router, Response } from 'express';
import multer from 'multer';
import { storage } from '../lib/storage';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Multer сохраняет загруженный файл во временную папку
const upload = multer({
  dest: 'tmp/',
  limits: {
    fileSize: 5 * 1024 * 1024, // Максимум 5 МБ
  },
  fileFilter: (_req, file, cb) => {
    // Разрешаем только изображения
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Разрешены только изображения (jpg, png, webp)'));
    }
  },
});

// POST /api/upload
// Content-Type: multipart/form-data
// Поле: image (файл)
router.post(
  '/',
  authMiddleware,
  upload.single('image'), // 'image' — имя поля в FormData
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Файл не загружен' });
      }

      // storage.upload() — либо сохраняет в папку, либо в S3
      const url = await storage.upload(req.file);

      res.json({ url });
      // Ответ: { "url": "/uploads/a1b2c3d4-beze.jpg" }
      // Этот url потом подставляется в image при POST/PUT сущности
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      res.status(500).json({ error: 'Не удалось загрузить файл' });
    }
  }
);

export default router;

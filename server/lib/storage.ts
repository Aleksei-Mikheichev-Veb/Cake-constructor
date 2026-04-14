// ============================================================
// server/lib/storage.ts — Абстракция хранения файлов
// ============================================================
//
// Сейчас: файлы сохраняются в папку server/uploads/
// Потом: можно переключить на S3/Yandex Cloud одной переменной.
//
// В базе данных хранится только URL картинки (строка).
// Компонентам на фронтенде всё равно, откуда эта строка —
// они просто подставляют её в <img src={url} />.
// ============================================================

import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

// Интерфейс — «контракт» для любого хранилища
interface StorageProvider {
  upload(file: Express.Multer.File): Promise<string>;  // возвращает URL
  delete(fileUrl: string): Promise<void>;
}

// ─────────────────────────────────────────────
// Реализация: локальная папка
// ─────────────────────────────────────────────
class LocalStorage implements StorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(__dirname, '..', 'uploads');
    // Создаём папку uploads если её нет
    fs.mkdir(this.uploadDir, { recursive: true }).catch(() => {});
  }

  async upload(file: Express.Multer.File): Promise<string> {
    // Генерируем уникальное имя, чтобы не было коллизий
    // Результат: "a1b2c3d4-beze.jpg"
    const uniqueName = `${crypto.randomUUID()}-${file.originalname}`;
    const destPath = path.join(this.uploadDir, uniqueName);

    // Multer сохраняет файл во временную папку (tmp/).
    // Мы перемещаем его в uploads/.
    await fs.rename(file.path, destPath);

    // Возвращаем относительный URL
    // Express раздаёт папку uploads/ как статику,
    // поэтому этот URL будет рабочим: http://localhost:4000/uploads/a1b2c3d4-beze.jpg
    return `/uploads/${uniqueName}`;
  }

  async delete(fileUrl: string): Promise<void> {
    // fileUrl = "/uploads/a1b2c3d4-beze.jpg"
    const filename = path.basename(fileUrl);
    const filePath = path.join(this.uploadDir, filename);

    try {
      await fs.unlink(filePath);
    } catch (err) {
      // Файл мог уже быть удалён — не страшно
      console.warn(`Не удалось удалить файл: ${filePath}`);
    }
  }
}

// ─────────────────────────────────────────────
// Реализация: S3 (заготовка на будущее)
// ─────────────────────────────────────────────
// Раскомментируй и настрой, когда будешь готов.
//
// class S3Storage implements StorageProvider {
//   private s3: S3Client;
//   private bucket: string;
//
//   constructor() {
//     this.s3 = new S3Client({
//       region: process.env.S3_REGION,
//       endpoint: process.env.S3_ENDPOINT,    // для Yandex Cloud
//       credentials: {
//         accessKeyId: process.env.S3_ACCESS_KEY!,
//         secretAccessKey: process.env.S3_SECRET_KEY!,
//       },
//     });
//     this.bucket = process.env.S3_BUCKET!;
//   }
//
//   async upload(file: Express.Multer.File): Promise<string> {
//     const key = `images/${crypto.randomUUID()}-${file.originalname}`;
//     await this.s3.send(new PutObjectCommand({
//       Bucket: this.bucket,
//       Key: key,
//       Body: await fs.readFile(file.path),
//       ContentType: file.mimetype,
//     }));
//     await fs.unlink(file.path); // удаляем временный файл
//     return `${process.env.S3_CDN_URL}/${key}`;
//   }
//
//   async delete(fileUrl: string): Promise<void> {
//     const key = fileUrl.replace(`${process.env.S3_CDN_URL}/`, '');
//     await this.s3.send(new DeleteObjectCommand({
//       Bucket: this.bucket,
//       Key: key,
//     }));
//   }
// }

// ─────────────────────────────────────────────
// Экспорт — переключение одной строкой
// ─────────────────────────────────────────────
export const storage: StorageProvider =
  process.env.STORAGE_TYPE === 's3'
    ? (() => { throw new Error('S3 ещё не настроен. Раскомментируй S3Storage.'); })()
    : new LocalStorage();

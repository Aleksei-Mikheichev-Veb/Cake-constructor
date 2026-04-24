// ============================================================
// server/src/routes/upload.ts
// ------------------------------------------------------------
// Используется админкой. POST /api/upload?folder=decorations
// возвращает { url, publicId } — админка кладёт url в соответствующее
// поле сущности (Decoration.image, Template.image и т.д.)
// ============================================================

import { Router, Request, Response } from 'express';
import multer from 'multer';
import { uploadToCloud, CloudFolder } from '../services/storage';
import { authMiddleware } from '../middleware/auth'; // твой существующий JWT middleware

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
        cb(null, allowed.includes(file.mimetype));
    },
});

const ALLOWED_FOLDERS: CloudFolder[] = [
    'decorations', 'templates', 'categories', 'subcategories',
    'fillings', 'shapes', 'smudges', 'gloss', 'colors',
    'cupcake-bases', 'cupcake-fillings', 'top-colors',
];

router.post('/', authMiddleware, upload.single('file'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Файл не прикреплён' });
        }

        const folder = req.query.folder as CloudFolder;
        if (!ALLOWED_FOLDERS.includes(folder)) {
            return res.status(400).json({
                error: `Неизвестная папка. Допустимые: ${ALLOWED_FOLDERS.join(', ')}`,
            });
        }

        const result = await uploadToCloud(req.file.buffer, folder);

        res.json({
            url: result.url,
            publicId: result.publicId,
        });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Не удалось загрузить файл' });
    }
});

export default router;

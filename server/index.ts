// ============================================================
// server/index.ts (плоская структура, без src/)
// ============================================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

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
import cupcakeBasesRouter from './routes/cupcakeBases';
import cupcakeFillingsRouter from './routes/cupcakeFillings';
import topColorsRouter from './routes/topColors';

const app = express();
const PORT = Number(process.env.PORT) || 4000;

const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.ADMIN_URL,
    ...(process.env.NODE_ENV !== 'production'
        ? ['http://localhost:3000', 'http://localhost:3001']
        : []),
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
}));

app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/subcategories', subcategoriesRouter);
app.use('/api/decorations', decorationsRouter);
app.use('/api/fillings', fillingsRouter);
app.use('/api/servings', servingsRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/price-config', priceConfigRouter);
app.use('/api/controls', controlsRouter);
app.use('/api/shapes', shapesRouter);
app.use('/api/smudges', smudgesRouter);
app.use('/api/gloss', glossRouter);
app.use('/api/colors', colorsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/cupcake-bases', cupcakeBasesRouter);
app.use('/api/cupcake-fillings', cupcakeFillingsRouter);
app.use('/api/top-colors', topColorsRouter);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('❌', err.message);
    res.status(err.status || 500).json({ error: err.message || 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на :${PORT}`);
    console.log(`   CORS origins: ${allowedOrigins.join(', ') || '(none)'}`);
});
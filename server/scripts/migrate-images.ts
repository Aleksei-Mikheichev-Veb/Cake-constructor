// ============================================================
// server/scripts/migrate-images.ts (v2 — под фактическую структуру)
// ------------------------------------------------------------
// Картинки лежат в КЛИЕНТЕ: D:\React\cakes\cakes\src\assets\images\
// В БД встречаются два формата:
//   1. Голое имя файла:        "3d.webp", "cakes.webp"
//   2. Путь с префиксом:       "/images/decorations/strawberry.webp"
// Скрипт умеет оба.
//
// ЗАПУСК (из папки server/):
//   npx ts-node scripts/migrate-images.ts
//
// ИДЕМПОТЕНТНОСТЬ: записи с image, начинающимся на http(s)://
// (= уже в Cloudinary) пропускаются. Можно перезапускать.
// ============================================================

import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { CloudFolder, uploadToCloud } from '../services/storage';
dotenv.config();

// import { uploadToCloud, CloudFolder } from '../src/services/storage';

const prisma = new PrismaClient();

// Корень с картинками во фронтенд-проекте.
// __dirname здесь = D:\React\cakes\server\scripts
// Поднимаемся на 2 уровня (\server\scripts → \server → \cakes) и идём в \cakes\src\assets\images
const ASSETS_ROOT = path.resolve(__dirname, '..', '..', 'cakes', 'src', 'assets', 'images');

// Маппинг "модель → подпапка в assets/images"
// Если в БД лежит голое имя файла, его дополняем этой подпапкой.
const MODEL_TO_FOLDER: Record<string, string> = {
    Category: 'categories',
    Subcategory: 'categories',         // подкатегории живут рядом с категориями
    Decoration: 'decorations',
    Template: 'templates',
    Filling: 'fillings',
    Shape: 'shape',                    // в твоей структуре единственное число
    Smudge: 'smudges',
    GlossOption: 'gloss',
    ColorOption: 'color',              // тоже единственное число
    CupcakeBase: 'fillings/cupcake',   // вложенная папка
    CupcakeFilling: 'fillings/cupcake',
    TopColor: 'topColors',
};

/**
 * Резолвит путь из БД в полный путь на диске.
 * Понимает оба формата:
 *   "3d.webp"                              → ASSETS_ROOT/<modelFolder>/3d.webp
 *   "/images/decorations/strawberry.webp"  → ASSETS_ROOT/decorations/strawberry.webp
 */
function resolveLocalPath(dbPath: string, modelName: string): string {
    const clean = dbPath.replace(/^\/+/, '');

    // Формат 2: путь начинается с "images/..." — игнорируем "images/" префикс
    // и берём то, что после, относительно ASSETS_ROOT.
    if (clean.startsWith('images/')) {
        const rest = clean.slice('images/'.length);
        return path.join(ASSETS_ROOT, rest);
    }

    // Формат 1: голое имя файла → дополняем подпапкой по имени модели.
    const folder = MODEL_TO_FOLDER[modelName];
    if (!folder) {
        throw new Error(`Не задан маппинг для модели ${modelName}`);
    }
    return path.join(ASSETS_ROOT, folder, clean);
}

type Outcome = 'skipped' | 'migrated' | 'failed';

async function migrateOne(
    modelName: string,
    id: string,
    currentImage: string | null,
    cloudFolder: CloudFolder,
    update: (url: string) => Promise<unknown>,
): Promise<Outcome> {
    if (!currentImage) return 'skipped';
    if (/^https?:\/\//.test(currentImage)) return 'skipped'; // уже в облаке

    const localPath = resolveLocalPath(currentImage, modelName);

    try {
        const buffer = await fs.readFile(localPath);
        const { url } = await uploadToCloud(buffer, cloudFolder);
        await update(url);
        console.log(`  ✓ [${modelName}] ${id}: ${currentImage} → ${url}`);
        return 'migrated';
    } catch (err) {
        console.warn(`  ✗ [${modelName}] ${id}: ${localPath} — ${(err as Error).message}`);
        return 'failed';
    }
}

type Stats = { migrated: number; skipped: number; failed: number };
const bump = (s: Stats, r: Outcome) => { s[r]++; };

async function main() {
    console.log(`📁 Asset root: ${ASSETS_ROOT}`);

    // Проверяем, что корневая папка вообще есть, чтобы не упасть с непонятной
    // ENOENT на каждой записи.
    try {
        await fs.access(ASSETS_ROOT);
    } catch {
        console.error(`❌ Не найдена папка с картинками: ${ASSETS_ROOT}`);
        console.error('   Проверь, что путь правильный (имя cakes/cake может отличаться).');
        process.exit(1);
    }

    const stats: Stats = { migrated: 0, skipped: 0, failed: 0 };

    console.log('\n📦 Category...');
    for (const r of await prisma.category.findMany()) {
        bump(stats, await migrateOne('Category', r.id, r.image, 'categories',
            (image) => prisma.category.update({ where: { id: r.id }, data: { image } })));
    }

    console.log('\n📦 Subcategory...');
    for (const r of await prisma.subcategory.findMany()) {
        bump(stats, await migrateOne('Subcategory', r.id, r.image, 'subcategories',
            (image) => prisma.subcategory.update({ where: { id: r.id }, data: { image } })));
    }

    console.log('\n📦 Decoration...');
    for (const r of await prisma.decoration.findMany()) {
        bump(stats, await migrateOne('Decoration', r.id, r.image, 'decorations',
            (image) => prisma.decoration.update({ where: { id: r.id }, data: { image } })));
    }

    console.log('\n📦 Template...');
    for (const r of await prisma.template.findMany()) {
        bump(stats, await migrateOne('Template', r.id, r.image, 'templates',
            (image) => prisma.template.update({ where: { id: r.id }, data: { image } })));
    }

    console.log('\n📦 Filling...');
    for (const r of await prisma.filling.findMany()) {
        bump(stats, await migrateOne('Filling', r.id, r.image, 'fillings',
            (image) => prisma.filling.update({ where: { id: r.id }, data: { image } })));
    }

    console.log('\n📦 Shape...');
    for (const r of await prisma.shape.findMany()) {
        bump(stats, await migrateOne('Shape', r.id, r.image, 'shapes',
            (image) => prisma.shape.update({ where: { id: r.id }, data: { image } })));
    }

    console.log('\n📦 Smudge...');
    for (const r of await prisma.smudge.findMany()) {
        bump(stats, await migrateOne('Smudge', r.id, r.image, 'smudges',
            (image) => prisma.smudge.update({ where: { id: r.id }, data: { image } })));
    }

    console.log('\n📦 GlossOption...');
    for (const r of await prisma.glossOption.findMany()) {
        bump(stats, await migrateOne('GlossOption', r.id, r.image, 'gloss',
            (image) => prisma.glossOption.update({ where: { id: r.id }, data: { image } })));
    }

    console.log('\n📦 ColorOption...');
    for (const r of await prisma.colorOption.findMany()) {
        bump(stats, await migrateOne('ColorOption', r.id, r.image, 'colors',
            (image) => prisma.colorOption.update({ where: { id: r.id }, data: { image } })));
    }

    console.log('\n📦 CupcakeBase...');
    for (const r of await prisma.cupcakeBase.findMany()) {
        bump(stats, await migrateOne('CupcakeBase', r.id, r.image, 'cupcake-bases',
            (image) => prisma.cupcakeBase.update({ where: { id: r.id }, data: { image } })));
    }

    console.log('\n📦 CupcakeFilling...');
    for (const r of await prisma.cupcakeFilling.findMany()) {
        bump(stats, await migrateOne('CupcakeFilling', r.id, r.image, 'cupcake-fillings',
            (image) => prisma.cupcakeFilling.update({ where: { id: r.id }, data: { image } })));
    }

    console.log('\n📦 TopColor...');
    for (const r of await prisma.topColor.findMany()) {
        bump(stats, await migrateOne('TopColor', r.id, r.image, 'top-colors',
            (image) => prisma.topColor.update({ where: { id: r.id }, data: { image } })));
    }

    console.log('\n══════════════════════════════════════');
    console.log(`  migrated: ${stats.migrated}`);
    console.log(`  skipped:  ${stats.skipped}  (already in cloud or no image)`);
    console.log(`  failed:   ${stats.failed}`);
    console.log('══════════════════════════════════════\n');

    if (stats.failed > 0) {
        console.log('⚠️  Failed > 0 — проверь логи выше: чаще всего файл не');
        console.log('    найден на диске. Скрипт идемпотентен, можно перезапускать.');
    }
}

main()
    .catch((err) => {
        console.error('FATAL:', err);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
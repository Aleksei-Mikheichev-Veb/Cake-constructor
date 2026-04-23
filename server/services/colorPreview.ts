// ============================================================
// server/src/services/colorPreview.ts
// ------------------------------------------------------------
// Заметное изменение против исходника из cake-backend:
// функция больше НЕ пишет файл в uploadsDir, а возвращает Buffer.
// Вызывающий код сам решит, залить его в Cloudinary или отдать
// как attachment.
// ============================================================

import { createCanvas } from 'canvas';

export type ColorGroup = {
    label: string;
    colors: string[];
};

export async function generateColorPreview(
    groups: ColorGroup[],
): Promise<Buffer | null> {
    if (groups.length === 0) return null;

    const WIDTH = 600;
    const ROW_HEIGHT = 80;
    const PADDING = 20;
    const SWATCH_SIZE = 50;

    const height = groups.length * ROW_HEIGHT + PADDING * 2;

    const canvas = createCanvas(WIDTH, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, WIDTH, height);

    ctx.font = '16px Arial, sans-serif';
    ctx.fillStyle = '#222';
    ctx.textBaseline = 'middle';

    groups.forEach((group, rowIdx) => {
        const y = PADDING + rowIdx * ROW_HEIGHT + ROW_HEIGHT / 2;

        ctx.fillStyle = '#222';
        ctx.fillText(group.label, PADDING, y);

        group.colors.forEach((color, colorIdx) => {
            const x = 250 + colorIdx * (SWATCH_SIZE + 10);

            ctx.fillStyle = color;
            ctx.fillRect(x, y - SWATCH_SIZE / 2, SWATCH_SIZE, SWATCH_SIZE);

            ctx.strokeStyle = '#cccccc';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y - SWATCH_SIZE / 2, SWATCH_SIZE, SWATCH_SIZE);

            ctx.fillStyle = '#666';
            ctx.font = '11px Arial, sans-serif';
            ctx.fillText(color, x, y + SWATCH_SIZE / 2 + 12);
            ctx.font = '16px Arial, sans-serif';
        });
    });

    return canvas.toBuffer('image/png');
}

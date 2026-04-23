const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:4000/api').replace('/api', '');

// Добавляет к Cloudinary-URL параметр f_auto (автоформат):
//   - Cloudinary сам отдаст WebP/AVIF браузеру, который их поддерживает,
//     и исходный формат — старым браузерам
//   - Plus автоматически активирует Default Image Quality из настроек аккаунта
//     (у нас стоит "Automatic - good quality")
function optimizeCloudinary(url: string): string {
    if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
        return url;
    }
    // Не добавляем повторно, если уже есть
    if (url.includes('/upload/f_auto') || url.includes('f_auto,')) {
        return url;
    }
    return url.replace('/upload/', '/upload/f_auto/');
}

export function resolveImageUrl(path: string | null | undefined): string {
    if (!path) return '';

    // Cloudinary URL — добавляем оптимизацию
    if (/^https?:\/\//.test(path)) {
        return optimizeCloudinary(path);
    }

    // Относительный путь (legacy) — достраиваем до API
    if (path.startsWith('/')) {
        return `${API_BASE}${path}`;
    }

    return path;
}
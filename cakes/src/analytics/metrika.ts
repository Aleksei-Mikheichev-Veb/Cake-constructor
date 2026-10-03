// Яндекс.Метрика — считаем переходы с рекламы и заказы.
// Включается только если на сборке задан REACT_APP_YANDEX_METRIKA_ID
// (сейчас — только на демо-витрине, чтобы видеть, работает ли реклама в VK-группах).
// Яндекс выбран, а не Google Analytics, потому что его счётчик mc.yandex.ru
// грузится из России и не упирается в ту же блокировку, из-за которой
// витрины переехали с Vercel на Timeweb (см. deployments-and-ru-access).

const METRIKA_ID = process.env.REACT_APP_YANDEX_METRIKA_ID;

declare global {
    interface Window {
        ym?: (...args: unknown[]) => void;
    }
}

let initialized = false;

export function initMetrika(): void {
    if (!METRIKA_ID || initialized) return;
    initialized = true;

    /* eslint-disable */
    (function (m: any, e: Document, t: string, r: string, i: string, k?: HTMLScriptElement, a?: Element) {
        m[i] = m[i] || function (...args: unknown[]) {
            (m[i].a = m[i].a || []).push(args);
        };
        m[i].l = Date.now();
        k = e.createElement(t) as HTMLScriptElement;
        a = e.getElementsByTagName(t)[0];
        k.async = true;
        k.src = r;
        a.parentNode?.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
    /* eslint-enable */

    window.ym?.(Number(METRIKA_ID), 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: false,
    });
}

// Вызывать при каждой смене маршрута (SPA сама по себе не шлёт просмотры страниц).
export function trackPageView(url: string): void {
    if (!METRIKA_ID) return;
    window.ym?.(Number(METRIKA_ID), 'hit', url);
}

// Цель «заказ отправлен» — по ней в Метрике видно конверсию из перехода по рекламе в заказ.
export function trackOrderSubmitted(): void {
    if (!METRIKA_ID) return;
    window.ym?.(Number(METRIKA_ID), 'reachGoal', 'order_submitted');
}

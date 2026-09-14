
// Страница отзывов об удобстве конструктора.
// Показывает статистику (средний рейтинг, кол-во) и таблицу
// с каждым отзывом.
// ============================================================

import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

interface FeedbackItem {
    id: string;
    orderId: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    order: {
        customerName: string;
        customerPhone: string;
        totalPrice: number;
    };
}

function Stars({ value }: { value: number }) {
    return (
        <span style={{ color: '#f5c518', fontSize: 16 }}>
            {'★'.repeat(value)}
            <span style={{ color: '#ddd' }}>{'★'.repeat(5 - value)}</span>
        </span>
    );
}

export default function Feedback() {
    const [items, setItems] = useState<FeedbackItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        fetch(`${API_URL}/feedback`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((data) => {
                setItems(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Не удалось загрузить отзывы');
                setLoading(false);
            });
    }, []);

    if (loading) return <p style={{ padding: 32 }}>Загрузка...</p>;
    if (error) return <p style={{ padding: 32, color: 'red' }}>{error}</p>;

    // Статистика
    const total = items.length;
    const avg = total > 0
        ? (items.reduce((s, i) => s + i.rating, 0) / total).toFixed(1)
        : '—';
    const withComment = items.filter((i) => i.comment).length;
    const dist = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: items.filter((i) => i.rating === star).length,
    }));

    return (
        <div style={{ padding: 32, maxWidth: 900 }}>
            <h1 style={{ marginBottom: 24 }}>Отзывы об удобстве конструктора</h1>

            {/* Статистика */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
                <StatCard label="Всего отзывов" value={String(total)} />
                <StatCard label="Средний рейтинг" value={`${avg} / 5`} highlight />
                <StatCard label="С комментарием" value={`${withComment} (${total ? Math.round(withComment / total * 100) : 0}%)`} />
            </div>

            {/* Распределение по звёздам */}
            {total > 0 && (
                <div style={{ marginBottom: 32, background: '#f9f9f9', borderRadius: 10, padding: '16px 20px', maxWidth: 360 }}>
                    <p style={{ margin: '0 0 10px', fontWeight: 600, fontSize: 14 }}>Распределение оценок</p>
                    {dist.map(({ star, count }) => (
                        <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ width: 20, textAlign: 'right', fontSize: 13 }}>{star}</span>
                            <span style={{ color: '#f5c518' }}>★</span>
                            <div style={{ flex: 1, background: '#e0e0e0', borderRadius: 4, height: 8 }}>
                                <div style={{
                                    width: `${total ? (count / total) * 100 : 0}%`,
                                    background: '#f5c518',
                                    height: '100%',
                                    borderRadius: 4,
                                    transition: 'width 0.3s',
                                }} />
                            </div>
                            <span style={{ width: 24, fontSize: 13, color: '#666' }}>{count}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Таблица */}
            {total === 0 ? (
                <p style={{ color: '#888' }}>Отзывов пока нет.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                        <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
                            <th style={th}>Дата</th>
                            <th style={th}>Клиент</th>
                            <th style={th}>Оценка</th>
                            <th style={th}>Комментарий</th>
                            <th style={th}>Сумма заказа</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={td}>{new Date(item.createdAt).toLocaleDateString('ru-RU')}</td>
                                <td style={td}>
                                    <div>{item.order.customerName}</div>
                                    <div style={{ color: '#999', fontSize: 12 }}>{item.order.customerPhone}</div>
                                </td>
                                <td style={td}><Stars value={item.rating} /></td>
                                <td style={td}>{item.comment || <span style={{ color: '#ccc' }}>—</span>}</td>
                                <td style={td}>{item.order.totalPrice.toLocaleString('ru-RU')} ₽</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div style={{
            background: highlight ? '#fff8e1' : '#f4f4f4',
            border: highlight ? '1px solid #f5c518' : '1px solid #e0e0e0',
            borderRadius: 10,
            padding: '14px 20px',
            minWidth: 140,
        }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
        </div>
    );
}

const th: React.CSSProperties = { padding: '10px 12px', fontWeight: 600, fontSize: 13 };
const td: React.CSSProperties = { padding: '10px 12px', verticalAlign: 'top' };
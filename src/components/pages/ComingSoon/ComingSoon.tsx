import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './ComingSoon.module.scss';

const pageNames: Record<string, string> = {
    '/gallery': 'Галерея',
    '/masterclass': 'Мастер-классы',
    '/fillings': 'Начинки',
};

const ComingSoon = () => {
    const location = useLocation();
    const pageName = pageNames[location.pathname] || 'Страница';

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <div className={styles.icon}>
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                        <circle cx="32" cy="32" r="30" stroke="url(#grad)" strokeWidth="2" strokeDasharray="6 4" />
                        <path d="M24 34 L30 40 L40 26" stroke="url(#grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        <defs>
                            <linearGradient id="grad" x1="0" y1="0" x2="64" y2="64">
                                <stop offset="0%" stopColor="#9333ea" />
                                <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                <h1 className={styles.title}>{pageName}</h1>
                <p className={styles.subtitle}>Раздел в разработке</p>
                <p className={styles.desc}>
                    Мы работаем над этой страницей. Скоро здесь появится что-то интересное!
                </p>

                <Link to="/constructor" className={styles.btn}>
                    Перейти в конструктор
                </Link>
                <Link to="/home" className={styles.link}>
                    Вернуться на главную
                </Link>
            </div>
        </div>
    );
};

export default ComingSoon;
import React, { FC, useEffect, useRef, useState } from 'react';
import styles from './CardCategory.module.scss';
import { resolveImageUrl } from '../../../../utils/imageUrl';

type CardCategoriesProps = {
    title: string;
    image: string;
    tooltip: string;
    id: string;
    handleClickCategory: (id: string) => void;
}

// Заголовок показан всегда (не по наведению — на тачскрине наведения не бывает).
// Описание — по тапу/клику на отдельную иконку (i), чтобы не путать
// "посмотреть подробнее" с "перейти" одним и тем же тапом по карточке.
const CardCategory: FC<CardCategoriesProps> = ({ title, image, tooltip, id, handleClickCategory }) => {
    const [showInfo, setShowInfo] = useState(false);
    const wrapperRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!showInfo) return;
        const handleOutside = (e: Event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setShowInfo(false);
            }
        };
        document.addEventListener('mousedown', handleOutside);
        document.addEventListener('touchstart', handleOutside);
        return () => {
            document.removeEventListener('mousedown', handleOutside);
            document.removeEventListener('touchstart', handleOutside);
        };
    }, [showInfo]);

    return (
        <article
            ref={wrapperRef}
            className={styles.cardCategory}
            onClick={() => handleClickCategory(id)}
        >
            <img
                src={resolveImageUrl(image)}
                className={styles.cardCategory_img}
                alt={title} />
            <div className={styles.cardCategory_gradient} />
            <h3 className={styles.cardCategory_title}>{title}</h3>

            {tooltip && (
                <button
                    type="button"
                    className={styles.cardCategory_infoBtn}
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowInfo((v) => !v);
                    }}
                    aria-label="Подробнее"
                >
                    i
                </button>
            )}

            {showInfo && tooltip && (
                <div
                    className={styles.cardCategory_infoPopup}
                    onClick={(e) => e.stopPropagation()}
                >
                    {tooltip}
                </div>
            )}
        </article>
    );
};

export default CardCategory;

import React, { FC } from 'react';
import styles from './CardCategory.module.scss';
import Tooltip from "../../../UI/Tooltip/Tooltip";
import { resolveImageUrl } from '../../../../utils/imageUrl';

type CardCategoriesProps = {
    title: string;
    image: string;
    tooltip: string;
    id: string;
    handleClickCategory: (id: string) => void;
}

const CardCategory: FC<CardCategoriesProps> = ({ title, image, tooltip, id, handleClickCategory }) => {
    return (
        <Tooltip content={tooltip}>
            <article className={styles.cardCategory} onClick={() => handleClickCategory(id)}>
                <img
                    src={resolveImageUrl(image)}
                    className={styles.cardCategory_img}
                    alt={title} />
                <h3 className={styles.cardCategory_title}>{title}</h3>
            </article>
        </Tooltip>
    );
};

export default CardCategory;
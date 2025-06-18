import React, {FC} from 'react';
import styles from './CardCategory.module.scss';
import Tooltip from "../../../UI/Tooltip";

type CardCategoriesProps = {
    title: string;
    image: string;
    description: string;
    id:string;
    handleClickCategory: (id:string) => void;
}
const CardCategory: FC<CardCategoriesProps> = ({title, image, description, id, handleClickCategory}) => {
    return (
        <Tooltip content={description}>
            <article className={styles.cardCategory} onClick={() => handleClickCategory(id)}>
                <img
                    src={require(`../../../../assets/images/categories/${image}`)}
                    className={styles.cardCategory_img}
                    alt={title}/>
                <h3 className={styles.cardCategory_title}>{title}</h3>

            </article>
        </Tooltip>
    );
};

export default CardCategory;
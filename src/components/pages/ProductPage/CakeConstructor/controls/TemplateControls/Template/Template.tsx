import React, { FC } from 'react';
import styles from './Template.module.scss'
import Tooltip from "../../../../../../UI/Tooltip/Tooltip";
import { ItemType } from '../../../../../../../types/ItemType';

type TemplateProps = {
    item: ItemType;
    setSelectedItem: (itemId: string) => void;
    activeItemId: string | null;
}

const Template: FC<TemplateProps> = ({ item, setSelectedItem, activeItemId }) => {
    const isActive = activeItemId === item.id
    return (
        <Tooltip content={item.description}>
            <div
                className={`${styles.slide} ${isActive ? styles.slide_active : ''}`}
                role="button"
                aria-label={`Выбрать вариант оформления ${item.name}`}
                onClick={() => setSelectedItem(item.id)}>

                <div className={styles.imageContainer}>
                    <img className={styles.image} src={item.image} alt={item.name} />
                    <div className={styles.overlay}>
                        <div className={styles.checkmark}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                                    fill="currentColor" />
                            </svg>
                        </div>
                    </div>
                    {isActive && <div className={styles.activeBadge}>Выбрано</div>}
                </div>
                <div className={styles.content}>
                    <h3 className={styles.name}>
                        {item.name}
                    </h3>
                </div>
            </div>
        </Tooltip>
    );
};

export default Template;
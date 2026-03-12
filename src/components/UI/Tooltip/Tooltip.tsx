import React, { FC, ReactNode, useState } from 'react';
import styles from './Tooltip.module.scss';

type TooltipContent = string | {
    weight: string;
    height: number;
    diameter: number;
};

type TooltipProps = {
    content: TooltipContent;
    children: ReactNode;
};

const Tooltip: FC<TooltipProps> = ({ children, content }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className={styles.tooltipWrapper}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}

            <div className={`${styles.tooltipContent} ${isVisible ? styles.visible : ''}`}>
                {typeof content === 'string' ? (
                    <div className={styles.text}>{content}</div>
                ) : (
                    <div className={styles.description}>
                        <h4 className={styles.descriptionTitle}>Вес: {content.weight} кг</h4>
                        <div className={styles.row}>
                            <span>Высота</span>
                            <span>{content.height} см</span>
                        </div>
                        <div className={styles.row}>
                            <span>Диаметр</span>
                            <span>{content.diameter} см</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Tooltip;
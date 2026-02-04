import React, {FC} from 'react';
import styles from './Decoration.module.scss'
import {DecorationType} from "../../../../../../data/decorationsMain";
import Tooltip from "../../../../../UI/Tooltip";

type DecorationProps = {
    decoration: DecorationType
    isSelected?: boolean
    addDecoration?: () => void
    removeDecoration?: () => void
}

const Decoration: FC<DecorationProps> = ({decoration, isSelected = false, addDecoration, removeDecoration}) => {
    return (
        <Tooltip content={decoration.description}>
            <div
                role='button'
                aria-label={`Выберите украшение ${decoration.name}`}
                aria-pressed={isSelected}
                className={`${styles.decoration} ${isSelected ? styles.decoration_selected : ''}`}
                tabIndex={0}
                onClick={isSelected ? removeDecoration : addDecoration}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        addDecoration?.();
                    }
                }}
            >
                <div className={styles.decoration_imgBox}>
                    <img
                        className={styles.decoration_image}
                        src={decoration.image}
                        alt={decoration.name}
                        loading="lazy"
                    />
                    <div className={styles.decoration_overlay}>
                        <div className={styles.decoration_badge}>
                            <span>{isSelected ? 'Выбрано' : 'Выбрать'}</span>
                        </div>
                    </div>
                    {isSelected && (
                        <div className={styles.decoration_checkmark}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="11" fill="white"/>
                                <path
                                    d="M7 12L10.5 15.5L17 9"
                                    stroke="url(#gradient)"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="7" y1="9" x2="17" y2="15.5">
                                        <stop offset="0%" stopColor="#9333ea"/>
                                        <stop offset="100%" stopColor="#ec4899"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    )}
                </div>

                <div className={styles.decoration_content}>
                    <h3 className={styles.decoration_title}>
                        {decoration.name}
                    </h3>
                    {decoration.byThePiece ? (
                        <div className={styles.decoration_info}>
                            <div className={styles.decoration_price}>
                                <span className={styles.price_value}>
                                    {decoration.price}
                                </span>
                                <span className={styles.price_unit}>за шт.</span>
                            </div>
                            <div className={styles.decoration_min}>
                                <span className={styles.min_label}>от {decoration.minCount} шт.</span>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.decoration_price}>
                            <span className={styles.price_value}>
                                {decoration.price}
                            </span>
                        </div>
                    )}
                </div>

                <div className={styles.decoration_shine}></div>
            </div>
        </Tooltip>
    );
};

export default Decoration;
import React, {FC} from 'react';
import styles from './Decoration.module.scss'
import {DecorationType} from "../../../../../../data/decorationsMain";
import Tooltip from "../../../../../UI/Tooltip";

type DecorationProps = {
    decoration: DecorationType
}

const Decoration: FC<DecorationProps> = ({decoration}) => {
    return (
        <Tooltip content={decoration.description}>
            <div
                role='button'
                aria-label={`Выберите украшение ${decoration.name}`}
                className={styles.decoration}
                tabIndex={0}
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
                            <span>Выбрать</span>
                        </div>
                    </div>
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
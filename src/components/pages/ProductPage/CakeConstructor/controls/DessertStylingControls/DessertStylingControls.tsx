import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../redux/store';
import { setStylingOption } from '../../../../../../redux/cakeConstructorSlice';
import styles from './DessertStylingControls.module.scss';

type StylingOption = 'all-same' | 'split-2' | 'split-3';

const options = [
    {
        id: 'all-same' as const,
        title: 'Все одинаковые',
        description: 'Все десерты будут оформлены в едином стиле',
        example: 'Все десерты в одном стиле'
    },
    {
        id: 'split-2' as const,
        title: 'Два разных стиля',
        description: 'Разделить десерты на две группы',
        example: 'Примерно поровну'
    },
    {
        id: 'split-3' as const,
        title: 'Три разных стиля',
        description: 'Разделить десерты на три группы',
        example: 'Примерно поровну'
    },
];

const DessertStylingControls = () => {
    const dispatch = useDispatch();
    const selectedOption = useSelector((state: RootState) => state.cakeConstructor.stylingOption);
    const quantity = useSelector((state: RootState) => Number(state.cakeConstructor.quantity) || 6);

    const handleSelect = (option: StylingOption) => {
        dispatch(setStylingOption(option));
    };

    return (
        <section className={styles.stylingSection}>
            <h2 className={styles.title}>Как украсить десерты?</h2>

            <div className={styles.optionsGrid}>
                {options.map((option) => (
                    <div
                        key={option.id}
                        className={`${styles.optionCard} ${selectedOption === option.id ? styles.active : ''}`}
                        onClick={() => handleSelect(option.id)}
                    >
                        <h3>{option.title}</h3>
                        <p className={styles.description}>{option.description}</p>
                        <p className={styles.example}>{option.example}</p>
                    </div>
                ))}
            </div>

            {/* Предпросмотр */}
            {selectedOption && (
                <div className={styles.preview}>
                    <h4>Предпросмотр оформления:</h4>

                    {selectedOption === 'all-same' && (
                        <div className={styles.previewBox}>
                            Все {quantity} десертов будут оформлены одинаково
                        </div>
                    )}

                    {selectedOption === 'split-2' && (
                        <div className={styles.previewSplit}>
                            <div className={styles.group}>
                                <span>Группа 1 ({Math.ceil(quantity / 2)} шт.)</span>
                                <div className={styles.styleBox}>Стиль A</div>
                            </div>
                            <div className={styles.group}>
                                <span>Группа 2 ({Math.floor(quantity / 2)} шт.)</span>
                                <div className={styles.styleBox}>Стиль B</div>
                            </div>
                        </div>
                    )}

                    {selectedOption === 'split-3' && (
                        <div className={styles.previewSplit}>
                            <div className={styles.group}>
                                <span>Группа 1</span>
                                <div className={styles.styleBox}>Стиль A</div>
                            </div>
                            <div className={styles.group}>
                                <span>Группа 2</span>
                                <div className={styles.styleBox}>Стиль B</div>
                            </div>
                            <div className={styles.group}>
                                <span>Группа 3</span>
                                <div className={styles.styleBox}>Стиль C</div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default DessertStylingControls;
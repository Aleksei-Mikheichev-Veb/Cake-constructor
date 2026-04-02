import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../../../redux/store';
import {setStylingConfig, updateStylingGroup} from '../../../../../../redux/cakeConstructorSlice';
import {smallDecorAdapter} from '../../../../../../redux/cakeConstructorSlice';
import SelectionControls from '../TemplateControls/SelectionControls';
import DecorationControls from '../DecorationControls/DecorationControls';
import styles from './DessertStylingControls.module.scss';
import {topColors} from "../../../../../../data/cupcakes/topColors";

type StylingOption = 'all-same' | 'split-2' | 'split-3';

const options: { id: StylingOption; title: string; description: string; example: string }[] = [
    {
        id: 'all-same',
        title: 'Все одинаковые',
        description: 'Все десерты будут оформлены в едином стиле',
        example: 'Все десерты в одном стиле'
    },
    {
        id: 'split-2',
        title: 'Два разных стиля',
        description: 'Разделить десерты на две группы',
        example: 'Примерно поровну'
    },
    {
        id: 'split-3',
        title: 'Три разных стиля',
        description: 'Разделить десерты на три группы',
        example: 'Примерно поровну'
    },
];

const DessertStylingControls = () => {
    const dispatch = useDispatch();
    // const quantity = useSelector((s: RootState) => s.cakeConstructor.quantity || 6);
    const quantity = useSelector((state: RootState) => Number(state.cakeConstructor.quantity) || 6);
    const stylingConfig = useSelector((s: RootState) => s.cakeConstructor.stylingConfig || []);

    const [selectedOption, setSelectedOption] = useState<StylingOption>('all-same');

    // Инициализация конфига при смене количества групп
    useEffect(() => {
        const groupsCount = selectedOption === 'all-same' ? 1 : selectedOption === 'split-2' ? 2 : 3;

        if (stylingConfig.length !== groupsCount) {
            const newConfig = Array.from({length: groupsCount}, () => ({
                topColor: null,
                decorations: smallDecorAdapter.getInitialState(),
            }));
            dispatch(setStylingConfig(newConfig));
        }
    }, [selectedOption, stylingConfig.length, dispatch]);

    const handleSelect = (option: StylingOption) => {
        setSelectedOption(option);
        dispatch(setStylingConfig(null)); // сброс перед новой инициализацией
    };

    const updateGroup = (groupIndex: number, field: 'topColor' | 'decorations', value: any) => {
        dispatch(updateStylingGroup({groupIndex, [field]: value}));
    };

    const groupsCount = selectedOption === 'all-same' ? 1 : selectedOption === 'split-2' ? 2 : 3;

    return (
        <section className={styles.stylingSection}>
            <h2 className={styles.title}>Как украсить десерты?</h2>

            {/* Карточки выбора стиля */}
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

            {/* Группы с шапками и декорациями */}
            <div className={styles.groupsContainer}>
                {Array.from({length: groupsCount}).map((_, index) => {
                    const group = stylingConfig[index] || {
                        topColor: null,
                        decorations: smallDecorAdapter.getInitialState()
                    };
                    const groupSize = Math.ceil(quantity / groupsCount);

                    return (
                        <div key={index} className={styles.groupCard}>
                            <h4>Группа {index + 1} ({groupSize} шт.)</h4>

                            {/* Кремовая шапка */}
                            <SelectionControls
                                title="Кремовая шапка"
                                items={topColors}
                                activeItemId={group.topColor?.id ?? null}
                                setSelectedItem={(item) => updateGroup(index, 'topColor', item)}
                                isColorSelected={true}
                            />

                            {/* Декорации */}
                            <DecorationControls
                                title="Декорации (до 5 шт.)"
                                decorations="small"
                                setActiveDecoration={(decoration) => {
                                    const currentEntities = group.decorations.entities;
                                    if (Object.keys(currentEntities).length >= 5) return;

                                    smallDecorAdapter.addOne(group.decorations, {...decoration, count: 1});
                                    updateGroup(index, 'decorations', group.decorations);
                                }}
                                removeDecoration={(id) => {
                                    smallDecorAdapter.removeOne(group.decorations, id);
                                    updateGroup(index, 'decorations', group.decorations);
                                }}
                                increment={(id) => {

                                }}
                                decrement={(id) => {

                                }}
                                activeDecoration={group.decorations}
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default DessertStylingControls;
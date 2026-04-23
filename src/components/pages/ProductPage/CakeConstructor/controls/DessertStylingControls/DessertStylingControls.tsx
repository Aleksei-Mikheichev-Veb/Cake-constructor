import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../redux/store';
import {
    setStylingConfig,
    updateStylingGroup,
    addStylingGroupDecoration,
    removeStylingGroupDecoration,
    smallDecorAdapter,
} from '../../../../../../redux/cakeConstructorSlice';
import SelectionControls from '../TemplateControls/SelectionControls';
import DecorationControls from '../DecorationControls/DecorationControls';
import styles from './DessertStylingControls.module.scss';
import { useGetTopColorsQuery, useGetDecorationsQuery } from '../../../../../../api/constructorApi';
import { ItemType } from '../../../../../../types/ItemType';
import { resolveImageUrl } from '../../../../../../utils/imageUrl';

type StylingOption = 'all-same' | 'split-2' | 'split-3';

const GROUPS_MAP: Record<StylingOption, number> = {
    'all-same': 1,
    'split-2': 2,
    'split-3': 3,
};

const options: { id: StylingOption; title: string; description: string; example: string }[] = [
    {
        id: 'all-same',
        title: 'Все одинаковые',
        description: 'Все десерты будут оформлены в едином стиле',
        example: 'Все десерты в одном стиле',
    },
    {
        id: 'split-2',
        title: 'Два разных стиля',
        description: 'Разделить десерты на две группы',
        example: 'Примерно поровну',
    },
    {
        id: 'split-3',
        title: 'Три разных стиля',
        description: 'Разделить десерты на три группы',
        example: 'Примерно поровну',
    },
];

const createEmptyGroups = (count: number) =>
    Array.from({ length: count }, () => ({
        topColor: null,
        decorations: smallDecorAdapter.getInitialState(),
    }));

const DessertStylingControls = () => {
    const dispatch = useDispatch();
    const quantity = useSelector((state: RootState) => Number(state.cakeConstructor.quantity) || 6);
    const stylingConfig = useSelector((s: RootState) => s.cakeConstructor.stylingConfig);


    const { data: serverTopColors = [] } = useGetTopColorsQuery();
    const { data: smallDecorations = [] } = useGetDecorationsQuery('small');

    const topColors = useMemo(() =>
        serverTopColors.map(tc => ({
            ...tc,
            description: tc.description || '',
            image: resolveImageUrl(tc.image),
        })),
        [serverTopColors]
    );

    const mappedSmallDecorations = useMemo(() =>
        smallDecorations.map(d => ({
            ...d,
            image: resolveImageUrl(d.image),
        })),
        [smallDecorations]
    );
    // const topColors: ItemType[] = serverTopColors.map(tc => ({
    //     ...tc,
    //     description: tc.description || '',
    //     image: resolveImageUrl(tc.image),
    // }));

    const [selectedOption, setSelectedOption] = useState<StylingOption>('all-same');

    const groupsCount = GROUPS_MAP[selectedOption];

    const handleSelect = (option: StylingOption) => {
        if (option === selectedOption) return;
        setSelectedOption(option);
        const newCount = GROUPS_MAP[option];
        dispatch(setStylingConfig(createEmptyGroups(newCount)));
    };

    // Синхронизация stylingConfig с количеством групп — в эффекте, не в рендере
    useEffect(() => {
        if (!stylingConfig || stylingConfig.length !== groupsCount) {
            dispatch(setStylingConfig(createEmptyGroups(groupsCount)));
        }
    }, [stylingConfig, groupsCount, dispatch]);

    // Если конфиг ещё не готов — показываем только верхний блок выбора
    if (!stylingConfig || stylingConfig.length !== groupsCount) {
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
            </section>
        );
    }

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

            <div className={styles.groupsContainer}>
                {stylingConfig.map((group, index) => {
                    const groupSize = Math.ceil(quantity / groupsCount);

                    return (
                        <div key={`${selectedOption}-${index}`} className={styles.groupCard}>
                            <h4>Группа {index + 1} ({groupSize} шт.)</h4>

                            <SelectionControls
                                title="Кремовая шапка"
                                items={topColors}
                                activeItemId={group.topColor ?? null}
                                setSelectedItem={(itemId) =>
                                    dispatch(updateStylingGroup({ groupIndex: index, topColor: itemId }))
                                }
                            />

                            <DecorationControls
                                title="Декорации (до 5 шт.)"
                                decorations="small"
                                decorationsData={mappedSmallDecorations}
                                setActiveDecoration={(decoration) => {
                                    if (group.decorations.ids.length >= 5) return;
                                    dispatch(addStylingGroupDecoration({
                                        groupIndex: index,
                                        decoration,
                                    }));
                                }}
                                removeDecoration={(id) => {
                                    dispatch(removeStylingGroupDecoration({
                                        groupIndex: index,
                                        decorationId: id,
                                    }));
                                }}
                                increment={() => { }}
                                decrement={() => { }}
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
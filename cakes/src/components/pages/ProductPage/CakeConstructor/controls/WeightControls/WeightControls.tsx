import React, { FC } from 'react';
import styles from './WeightControls.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../redux/store';
import { setWeight } from '../../../../../../redux/cakeConstructorSlice';
import Tooltip from '../../../../../UI/Tooltip/Tooltip';
import Button from '../../../../../UI/Button/Button';
import { useGetServingsQuery } from '../../../../../../api/constructorApi';
import { NumberOfServingType } from '../../../../../../types/NumberOfServingType';

type WeightControlsProps = {
    title: string;
};

function adaptServings(serverServings: any[]): NumberOfServingType[] {
    return serverServings.map((s, index) => ({
        id: index + 1,
        quantity: extractQuantity(s),
        weightMin: s.weightMin ?? 0,
        weightMax: s.weightMax ?? 0,
        weight: extractWeight(s),
        height: s.height ?? undefined,
        diameter: s.diameter ?? undefined,
    }));
}

// Возвращает только вес из label (без порций/штук).
// '8-9 порций, 1.6-1.8 кг'  → '1.6-1.8 кг'
// '6 шт, 200 гр'             → '200 гр'
// '0.5 кг'                   → '0.5 кг'
// '≈ 1 кг'                   → '≈ 1 кг'
function extractWeight(s: any): string {
    const label: string = s.label || '';

    // Если в label есть запятая — берём то, что ПОСЛЕ неё (это часть про вес)
    if (label.includes(',')) {
        return label.split(',').slice(1).join(',').trim();
    }

    // Если запятой нет — label целиком и есть вес ('0.5 кг', '≈ 1 кг')
    return label.trim();
}
// Для разных форматов label возвращает число (или диапазон)
// для отображения в кнопке:
//   '8-9 порций, 1.6-1.8 кг'  →  '8-9'      (бисквитные)
//   '0.5 кг'                  →  '0.5'      (бенто)
//   '1 кг'                    →  '1'        (бенто)
//   '≈ 1 кг'                  →  '≈ 1'      (муссовые)
//   '≈ 1.5 кг'                →  '≈ 1.5'    (муссовые)
//   '6 шт, 200 гр'            →  '6'        (капкейки/трайфлы)
function extractQuantity(s: any): string {
    const label: string = s.label || '';

    // Если в label есть запятая — берём всё, что до первого пробела
    // (работает для '8-9 порций, ...' → '8-9' и '6 шт, ...' → '6')
    if (label.includes(',')) {
        return label.split(' ')[0];
    }

    // Иначе берём всё, что стоит перед последним словом (единицей измерения).
    // '0.5 кг' → '0.5', '≈ 1 кг' → '≈ 1', '≈ 1.5 кг' → '≈ 1.5'
    const parts = label.split(' ');
    if (parts.length >= 2) {
        return parts.slice(0, -1).join(' ').trim();
    }

    // Fallback, если label пустой
    return String(s.portions ?? s.quantity ?? '');
}

const WeightControls: FC<WeightControlsProps> = ({ title }) => {
    const dispatch = useDispatch();
    const subcategory = useSelector((state: RootState) => state.cakeConstructor.subcategory);

    const { data: serverServings = [], isLoading } = useGetServingsQuery(
        { subcategoryId: subcategory || '' },
        { skip: !subcategory }
    );

    const servings = adaptServings(serverServings);
    const activeServing = useSelector((state: RootState) => state.cakeConstructor.numberOfServing);

    const handleButtonClick = (elem: NumberOfServingType) => {
        dispatch(setWeight(elem));
    };

    if (isLoading) return <div>Загрузка...</div>;
    if (servings.length === 0) return <div>Вес не найден для этого типа торта</div>;

    const servingType = subcategory === 'mousse' || subcategory === 'bento' ? 'кг' : 'порций';

    return (
        <section className={styles.weightControls}>
            <h2 className={styles.weightControls_title}>{title}</h2>
            <div className={styles.weightControls_row}>
                {servings.map((elem) => (
                    <Tooltip
                        key={elem.id}
                        content={{ weight: elem.weight, height: elem.height, diameter: elem.diameter }}
                    >
                        <Button
                            elem={elem}
                            servingType={servingType}
                            quantity={elem.quantity}
                            activeId={activeServing?.id ?? null}
                            id={elem.id}
                            handleButtonClick={() => handleButtonClick(elem)}
                        />
                    </Tooltip>
                ))}
            </div>
        </section>
    );
};

export default WeightControls;
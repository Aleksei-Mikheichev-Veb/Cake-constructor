import React, { useEffect, useState } from 'react';
import {
    resetCakeConstructor,
    setDessertType,
    setQuantity,
} from '../../../../redux/cakeConstructorSlice';
import TotalPrice from '../../../UI/TotalPrice/TotalPrice';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { controlDessertComponents } from './config/controlDessertComponents';
import { useConstructorData } from '../../../../hooks/useConstructorData';

const DessertConstructor = () => {
    const { category } = useParams<{ category: string }>();
    const dispatch = useDispatch();

    const dessertType = category === 'cupcakes' ? 'cupcake'
        : category === 'trifles' ? 'trifles'
            : null;

    const {
        controls,
        servings,
        fillings,
        decorationsSmall,
        isLoading,
        isError,
    } = useConstructorData(category || null, dessertType);

    const [isInitialized, setIsInitialized] = useState(false);
    const prevCategory = React.useRef<string | null>(null);

    useEffect(() => {
        if (!category) return;

        if (prevCategory.current !== category) {
            dispatch(resetCakeConstructor());
            if (dessertType) {
                dispatch(setDessertType(dessertType));
            }
            prevCategory.current = category;
            setIsInitialized(false);
        }

        // Автовыбор первой порции
        if (servings.length > 0 && !isInitialized) {
            const first = servings[0];
            dispatch(setQuantity({
                id: first.quantity || first.portions || 6,
                quantity: String(first.quantity || first.portions || ''),
                weight: first.label?.split(',')[1]?.trim() || '',
            } as any));
            setIsInitialized(true);
        }
    }, [category, dessertType, servings, isInitialized, dispatch]);

    if (isLoading) return <div>Загрузка конструктора...</div>;
    if (isError || !category) return <div>Неверный тип десерта</div>;

    return (
        <div>
            {controls.map((ctrl) => {
                const Component = controlDessertComponents[ctrl.controlType];
                if (!Component) return null;

                const props = buildDessertControlProps(ctrl, { servings, fillings });

                return <Component key={ctrl.id} {...props} />;
            })}

            <TotalPrice />
        </div>
    );
};

function buildDessertControlProps(
    ctrl: { controlType: string; title: string | null; settings: Record<string, any> | null },
    data: { servings: any[]; fillings: any[] }
): Record<string, any> {
    const { controlType, title } = ctrl;

    switch (controlType) {
        case 'portions':
            return { title: title || 'Выберите количество' };

        case 'filling':
            return { title: title || 'Выберите начинку', fillings: data.fillings };

        case 'cupcakeBase':
            return { title: title || 'Выберите основу кекса' };

        case 'cupcakeFilling':
            return { title: title || 'Выберите начинку' };

        case 'styling':
        case 'reference':
            return { title };

        default:
            return { title };
    }
}

export default DessertConstructor;
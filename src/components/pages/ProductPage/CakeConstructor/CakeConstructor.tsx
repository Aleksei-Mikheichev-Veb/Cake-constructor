import React, { useEffect, useState } from 'react';
import {
    CakeSubcategory,
    resetCakeConstructor,
    setSubcategory,
    setTiers,
    setWeight,
} from '../../../../redux/cakeConstructorSlice';
import TotalPrice from '../../../UI/TotalPrice/TotalPrice';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { controlCakeComponents } from './config/controlCakeComponents';
import { useConstructorData } from '../../../../hooks/useConstructorData';
import { resolveImageUrl } from '../../../../utils/imageUrl';

const CakeConstructor = () => {
    const { subcategory } = useParams<{ subcategory: string }>();
    const dispatch = useDispatch();

    const {
        controls,
        servings,
        fillings,
        templates,
        smudges,
        shapes,
        colors,
        glossOptions,
        decorationsMain,
        decorationsAdditional,
        decorationsAll,
        isLoading,
        isError,
    } = useConstructorData(subcategory || null, 'cake');

    const [isInitialized, setIsInitialized] = useState(false);
    const prevSubcategory = React.useRef<string | null>(null);

    useEffect(() => {
        if (!subcategory) return;

        // Если подкатегория сменилась — сбрасываем
        if (prevSubcategory.current !== subcategory) {
            dispatch(resetCakeConstructor());
            dispatch(setSubcategory(subcategory as CakeSubcategory));

            if (subcategory === 'tiered') {
                dispatch(setTiers({ layers: 1, portions: 10, layerFillings: [] }));
            }

            prevSubcategory.current = subcategory;
            setIsInitialized(false);
        }

        // Автовыбор веса — после того как данные пришли и reset отработал
        if (servings.length > 0 && !isInitialized) {
            const first = servings[0];
            dispatch(setWeight({
                id: 1,
                quantity: first.label ? first.label.split(' ')[0] : String(first.portions || ''),
                weightMin: first.weightMin ?? 0,
                weightMax: first.weightMax ?? 0,
                weight: first.label || '',
                height: first.height ?? undefined,
                diameter: first.diameter ?? undefined,
            } as any));
            setIsInitialized(true);
        }
    }, [subcategory, servings, isInitialized, dispatch]);

    if (isLoading) return <div>Загрузка конструктора...</div>;
    if (isError || !subcategory) return <div>Неверный тип торта</div>;

    return (
        <div>
            {controls.map((ctrl) => {
                const Component = controlCakeComponents[ctrl.controlType];
                if (!Component) return null;

                // Собираем пропсы по типу контрола
                const props = buildControlProps(ctrl, {
                    fillings, templates, smudges, shapes, colors,
                    glossOptions, decorationsMain, decorationsAdditional, decorationsAll,
                });

                return <Component key={ctrl.id} {...props} />;
            })}

            <TotalPrice />
        </div>
    );
};

function adaptItems(items: any[]): any[] {
    return items.map(item => ({
        ...item,
        description: item.description || '',
        image: resolveImageUrl(item.image),
    }));
}

function buildControlProps(
    ctrl: { controlType: string; title: string | null; settings: Record<string, any> | null },
    data: {
        fillings: any[];
        templates: any[];
        smudges: any[];
        shapes: any[];
        colors: any[];
        glossOptions: any[];
        decorationsMain: any[];
        decorationsAdditional: any[];
        decorationsAll: any[];
    }
): Record<string, any> {
    const { controlType, title, settings } = ctrl;

    switch (controlType) {
        case 'weight':
            return { title: title || 'Выберите количество порций' };

        case 'filling':
            return { title: title || 'Выберите начинку', fillings: data.fillings };

        case 'template':
            return {
                title: title || 'Способ оформления',
                items: adaptItems(data.templates),
                isTemplate: settings?.isTemplate ?? true,
            };

        case 'colors':
            return {
                title: title || 'Цвет торта',
                items: adaptItems(data.colors),
                isColor: settings?.isColor ?? true,
            };

        case 'smudges':
            return { title: title || 'Оформление подтёками', items: adaptItems(data.smudges) };

        case 'shape':
            return { title: title || 'Выберите форму', items: adaptItems(data.shapes) };

        case 'gloss':
            return { title: title || 'Тип поверхности', items: adaptItems(data.glossOptions) };

        case 'decorations':
            return {
                decorationsMode: settings?.decorationsMode || 'split',
                decorationsMain: data.decorationsMain,
                decorationsAdditional: data.decorationsAdditional,
                decorationsAll: data.decorationsAll,
            };

        case 'photoPrint':
        case 'creamText':
        case 'reference':
        case 'tiered':
            return { title };

        default:
            return { title };
    }
}

export default CakeConstructor;
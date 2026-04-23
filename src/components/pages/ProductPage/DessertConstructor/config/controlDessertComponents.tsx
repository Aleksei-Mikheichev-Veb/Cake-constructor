// ============================================================
// Обёртки компонентов для десертного конструктора (капкейки, трайфлы).
// Данные приходят с API через пропсы.
// ============================================================

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import {
    addReferenceImage,
    removeReferenceImage,
    setColorsTemplate,
    setCupcakeBase,
    setCupcakeFilling,
    setFilling,
    setOrderComment,
} from '../../../../../redux/cakeConstructorSlice';
import ReferenceControls from '../../CakeConstructor/controls/ReferenceUpload/ReferenceUpload';
import SelectionControls from '../../CakeConstructor/controls/TemplateControls/SelectionControls';
import FillingControls from '../../CakeConstructor/controls/FillingControls/FillingControls';
import DessertStylingControls from '../../CakeConstructor/controls/DessertStylingControls/DessertStylingControls';
import PortionsControls from '../../CakeConstructor/controls/PortionsControl/PortionsControls';
import { FillingFromServer } from '../../../../../api/constructorApi';
import { useGetCupcakeBasesQuery, useGetCupcakeFillingsQuery } from '../../../../../api/constructorApi';
import { FillingType } from '../../../../../types/FillingType';
import { ItemType } from '../../../../../types/ItemType';
import { resolveImageUrl } from '../../../../../utils/imageUrl';

type SelectionProps = {
    items: any[];
    title: string;
    isColor?: boolean;
};

// ─── Начинки ───
function adaptFillings(serverFillings: FillingFromServer[]): FillingType[] {
    return serverFillings.map(f => ({
        id: f.id,
        name: f.name,
        description: Array.isArray(f.description)
            ? f.description
            : f.description
                ? f.description.split(',').map(s => s.trim())
                : [],
        image: resolveImageUrl(f.image),
    }));
}

type FillingSectionProps = {
    title: string;
    fillings: FillingFromServer[];
};

export const FillingSection = ({ title, fillings }: FillingSectionProps) => {
    const dispatch = useDispatch();
    const activeFilling = useSelector((s: RootState) => s.cakeConstructor.filling);

    const adapted = adaptFillings(fillings);

    return (
        <FillingControls
            title={title}
            fillings={adapted}
            activeFillingId={activeFilling?.id ?? null}
            setActiveFilling={(filling) => dispatch(setFilling(filling))}
        />
    );
};

// ─── Цвета ───
export const ColorsControls = ({ items, title, isColor }: SelectionProps) => {
    const dispatch = useDispatch();
    const activeColor = useSelector((s: RootState) => s.cakeConstructor.colorsTemplate);

    return (
        <SelectionControls
            title={title}
            items={items}
            activeItemId={activeColor ?? null}
            setSelectedItem={(item) => dispatch(setColorsTemplate(item))}
            isColorSelected={isColor}
        />
    );
};

// ─── Основа капкейка ───
function adaptToItemType(items: any[]): ItemType[] {
    return items.map(item => ({
        ...item,
        description: item.description || '',
        image: resolveImageUrl(item.image),
    }));
}

export const CupcakeBaseControls = ({ title }: { title: string }) => {
    const dispatch = useDispatch();
    const activeBase = useSelector((s: RootState) => s.cakeConstructor.cupcakeBase);
    const { data: serverItems = [] } = useGetCupcakeBasesQuery();
    const items = adaptToItemType(serverItems);

    return (
        <SelectionControls
            title={title}
            items={items}
            activeItemId={activeBase ?? null}
            setSelectedItem={(itemId) => dispatch(setCupcakeBase(itemId))}
        />
    );
};

export const CupcakeFillingControls = ({ title }: { title: string }) => {
    const dispatch = useDispatch();
    const activeFilling = useSelector((s: RootState) => s.cakeConstructor.cupcakeFilling);
    const { data: serverItems = [] } = useGetCupcakeFillingsQuery();
    const items = adaptToItemType(serverItems);

    return (
        <SelectionControls
            title={title}
            items={items}
            activeItemId={activeFilling ?? null}
            setSelectedItem={(itemId) => dispatch(setCupcakeFilling(itemId))}
        />
    );
};

// ─── Референсы ───
export const ReferenceSection = () => {
    const dispatch = useDispatch();
    const comment = useSelector((s: RootState) => s.cakeConstructor.orderComment);
    const images = useSelector((s: RootState) => s.cakeConstructor.referenceImages);

    const handleAddImages = (files: File[]) => {
        files.forEach((file) => {
            const preview = URL.createObjectURL(file);
            const id = crypto.randomUUID();
            dispatch(addReferenceImage({ id, preview, file }));
        });
    };

    const handleRemoveImage = (id: string) => {
        dispatch(removeReferenceImage(id));
    };

    return (
        <ReferenceControls
            comment={comment}
            onCommentChange={(v) => dispatch(setOrderComment(v))}
            images={images}
            onAddImages={handleAddImages}
            onRemoveImage={handleRemoveImage}
            maxImages={3}
        />
    );
};

// ─── Маппинг ───
export const controlDessertComponents: Record<string, React.FC<any>> = {
    portions: PortionsControls,
    filling: FillingSection,
    reference: ReferenceSection,
    styling: DessertStylingControls,
    colors: ColorsControls,
    cupcakeBase: CupcakeBaseControls,
    cupcakeFilling: CupcakeFillingControls,
};
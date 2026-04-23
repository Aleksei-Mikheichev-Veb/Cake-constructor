import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import WeightControls from '../controls/WeightControls/WeightControls';
import FillingControls from '../controls/FillingControls/FillingControls';
import CreamTextControls from '../controls/CreamTextControls/CreamTextControls';
import PhotoprintControls from '../controls/PhotoPrintControls/PhotoPrintControls';
import SelectionControls from '../controls/TemplateControls/SelectionControls';
import {
    addAdditionalDecoration,
    addMainDecoration,
    addReferenceImage,
    decrementAdditionalDecoration,
    decrementMainDecoration,
    incrementAdditionalDecoration,
    incrementMainDecoration,
    removeAdditionalDecoration,
    removeMainDecoration,
    removeReferenceImage,
    setFilling,
    setColorsTemplate,
    setGloss,
    setOrderComment,
    setShape,
    setSmudges,
    setTemplate,
    clearAllDecorations,
} from '../../../../../redux/cakeConstructorSlice';
import ReferenceControls from '../controls/ReferenceUpload/ReferenceUpload';
import DecorationControls from '../controls/DecorationControls/DecorationControls';
import TieredControls from '../controls/TieredControls/TieredControls';
import ChocolateTextInputs from '../controls/ChocolateTextInputs/ChocolateTextInputs';
import { FillingFromServer, DecorationFromServer } from '../../../../../api/constructorApi';
import { FillingType } from '../../../../../types/FillingType';
import { resolveImageUrl } from '../../../../../utils/imageUrl';

// ─── Типы пропсов ───

type SelectionProps = {
    items: any[];
    title: string;
    isColor?: boolean;
};

// ─── Обёртка для шаблона ───
export const TemplateControls = ({ items, title, isTemplate }: SelectionProps & { isTemplate?: boolean }) => {
    const dispatch = useDispatch();
    const activeTemplate = useSelector((s: RootState) => s.cakeConstructor.template);

    useEffect(() => {
        dispatch(clearAllDecorations());
    }, [activeTemplate, dispatch]);

    return (
        <SelectionControls
            title={title}
            items={items}
            activeItemId={activeTemplate ?? null}
            setSelectedItem={(item) => dispatch(setTemplate(item))}
            isTemplate={isTemplate}
        />
    );
};

// ─── Обёртка для начинок ───
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

// ─── Обёртка для формы ───
export const ShapeControls = ({ items, title }: SelectionProps) => {
    const dispatch = useDispatch();
    const activeShape = useSelector((s: RootState) => s.cakeConstructor.shape);

    return (
        <SelectionControls
            title={title}
            items={items}
            activeItemId={activeShape ?? null}
            setSelectedItem={(item) => dispatch(setShape(item))}
        />
    );
};

// ─── Обёртка для глянца ───
export const GlossControls = ({ items, title }: SelectionProps) => {
    const dispatch = useDispatch();
    const activeGloss = useSelector((s: RootState) => s.cakeConstructor.gloss);

    return (
        <SelectionControls
            title={title}
            items={items}
            activeItemId={activeGloss ?? null}
            setSelectedItem={(item) => dispatch(setGloss(item))}
        />
    );
};

// ─── Обёртка для цвета ───
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

// ─── Обёртка для подтёков ───
export const SmudgesControls = ({ items, title }: SelectionProps) => {
    const dispatch = useDispatch();
    const activeSmudges = useSelector((s: RootState) => s.cakeConstructor.smudges);

    return (
        <SelectionControls
            title={title}
            items={items}
            activeItemId={activeSmudges ?? null}
            setSelectedItem={(item) => dispatch(setSmudges(item))}
        />
    );
};

// ─── Обёртка для декораций ───
// Теперь получает декорации через пропсы вместо импорта из data/
type DecorationsSectionProps = {
    decorationsMode?: 'split' | 'all';
    // Данные декораций с сервера
    decorationsMain?: DecorationFromServer[];
    decorationsAdditional?: DecorationFromServer[];
    decorationsAll?: DecorationFromServer[];
};

export const DecorationsSection: React.FC<DecorationsSectionProps> = ({
    decorationsMode = 'split',
    decorationsMain: mainData = [],
    decorationsAdditional: additionalData = [],
    decorationsAll: allData = [],
}) => {
    const dispatch = useDispatch();
    const subcategory = useSelector((state: RootState) => state.cakeConstructor.subcategory);
    const mainDecorations = useSelector((state: RootState) => state.cakeConstructor.mainDecorations);
    const additionalDecorations = useSelector((state: RootState) => state.cakeConstructor.additionalDecorations);
    const template = useSelector((s: RootState) => s.cakeConstructor.template);

    let effectiveMode = decorationsMode === 'all' ||
        subcategory === 'bento' ||
        subcategory === 'mousse'
        ? 'all'
        : 'split';

    if (template === 'center') effectiveMode = 'all';

    // Если нет шаблона (для тех, кому он нужен), декорации не показываем
    const requiresTemplate = ['biscuit', 'kids', 'tiered'];
    if ((!template && requiresTemplate.includes(subcategory ?? '')) || template === 'empty') {
        return null;
    }

    if (effectiveMode === 'all') {
        return (
            <>
                <DecorationControls
                    title="Украшения"
                    decorations="all"
                    decorationsData={allData}
                    setActiveDecoration={(decoration) => dispatch(addMainDecoration(decoration))}
                    removeDecoration={(id) => dispatch(removeMainDecoration(id))}
                    increment={(id) => dispatch(incrementMainDecoration(id))}
                    decrement={(id) => dispatch(decrementMainDecoration(id))}
                    activeDecoration={mainDecorations}
                />
                <ChocolateTextInputs />
            </>
        );
    }

    return (
        <>
            <DecorationControls
                title="Основные украшения"
                decorations="main"
                decorationsData={mainData}
                setActiveDecoration={(decoration) => dispatch(addMainDecoration(decoration))}
                removeDecoration={(id) => dispatch(removeMainDecoration(id))}
                increment={(id) => dispatch(incrementMainDecoration(id))}
                decrement={(id) => dispatch(decrementMainDecoration(id))}
                activeDecoration={mainDecorations}
            />
            <DecorationControls
                title="Дополнительные украшения"
                decorations="additional"
                decorationsData={additionalData}
                setActiveDecoration={(decoration) => dispatch(addAdditionalDecoration(decoration))}
                removeDecoration={(id) => dispatch(removeAdditionalDecoration(id))}
                increment={(id) => dispatch(incrementAdditionalDecoration(id))}
                decrement={(id) => dispatch(decrementAdditionalDecoration(id))}
                activeDecoration={additionalDecorations}
            />
            <ChocolateTextInputs />
        </>
    );
};

// ─── Обёртка для референсов ───
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

// ─── Маппинг типов контролов → компоненты ───
// Больше НЕ Record<ControlType, Component>, потому что контролы
// теперь приходят с сервера в виде строк.
export const controlCakeComponents: Record<string, React.FC<any>> = {
    weight: WeightControls,
    filling: FillingSection,
    creamText: CreamTextControls,
    photoPrint: PhotoprintControls,
    reference: ReferenceSection,
    template: TemplateControls,
    colors: ColorsControls,
    smudges: SmudgesControls,
    tiered: TieredControls,
    decorations: DecorationsSection,
    shape: ShapeControls,
    gloss: GlossControls,
};
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import WeightControls from "../controls/WeightControls/WeightControls";
import FillingControls from "../controls/FillingControls/FillingControls";
import CreamTextControls from "../controls/AddInscriptions/AddInscriptions";
import PhotoprintControls from "../controls/PhotoPrintControls/PhotoPrintControls";
import SelectionControls from "../controls/TemplateControls/SelectionControls";
import { ControlType } from "./cakeVariants";
import {
    addAdditionalDecoration,
    addMainDecoration,
    addReferenceImage, decrementAdditionalDecoration,
    decrementMainDecoration, incrementAdditionalDecoration,
    incrementMainDecoration,
    removeAdditionalDecoration,
    removeMainDecoration,
    removeReferenceImage,
    setColorsTemplate,
    setOrderComment,
    setSmudges,
    setTemplate
} from "../../../../../redux/cakeConstructorSlice";
import ReferenceControls from "../controls/ReferenceUpload/ReferenceUpload";
import DecorationControls from "../controls/DecorationControls/DecorationControls";

// Тип пропсов для SelectionControls-обёрток
type SelectionProps = {
    items: any[];
    title: string;
    isColor?: boolean;
};

// ─────────────────────────────────────────────
// Обёртка для шаблона
export const TemplateControls = ({ items, title, isTemplate }: SelectionProps & { isTemplate?: boolean }) => {
    const dispatch = useDispatch();
    const activeTemplate = useSelector((s: RootState) => s.cakeConstructor.template);

    return (
        <SelectionControls
            title={title}
            items={items}
            activeItemId={activeTemplate?.id ?? null}
            setSelectedItem={(item) => dispatch(setTemplate(item))}
            isTemplate={isTemplate}
        />
    );
};


// ─────────────────────────────────────────────
// Обёртка для цвета
export const ColorsControls = ({ items, title, isColor }: SelectionProps) => {
    const dispatch = useDispatch();
    const activeColor = useSelector((s: RootState) => s.cakeConstructor.colorsTemplate);

    return (
        <SelectionControls
            title={title}
            items={items}
            activeItemId={activeColor?.id ?? null}
            setSelectedItem={(item) => dispatch(setColorsTemplate(item))}
            isColorSelected={isColor}
        />
    );
};

// ─────────────────────────────────────────────
// Обёртка для подтёков
export const SmudgesControls = ({ items, title }: SelectionProps) => {
    const dispatch = useDispatch();
    const activeSmudges = useSelector((s: RootState) => s.cakeConstructor.smudges);

    return (
        <SelectionControls
            title={title}
            items={items}
            activeItemId={activeSmudges?.id ?? null}
            setSelectedItem={(item) => dispatch(setSmudges(item))}
        />
    );
};
// Обёртка для референсов
type DecorationsSectionProps = {
    decorationsMode?: 'split' | 'all';
    title?: string; // опционально, если хочешь переопределить
};

export const DecorationsSection: React.FC<DecorationsSectionProps> = ({
                                                                          decorationsMode = 'split', // по умолчанию split для тех, где это актуально
                                                                      }) => {
    const dispatch = useDispatch();
    const subcategory = useSelector((state: RootState) => state.cakeConstructor.subcategory);
    const mainDecorations = useSelector((state: RootState) => state.cakeConstructor.mainDecorations);
    const additionalDecorations = useSelector((state: RootState) => state.cakeConstructor.additionalDecorations);

    // Логика определения режима: all или split
    // Если в конфиге decorationsMode = 'all' → всегда один контролл
    // Иначе — split, но для '3d', 'bento', 'mousse' принудительно all
    let effectiveMode = decorationsMode === 'all' ||
    subcategory === 'bento' ||
    subcategory === 'mousse'
        ? 'all'
        : 'split';

    // Для 'biscuit', 'kids', 'tiered' — split
    const template = useSelector((s:RootState) => s.cakeConstructor.template);
    if (template?.id === 'empty' || template?.id === 'center') effectiveMode = 'all';

    // Если нет шаблона, то декорации не показыаются
    const requiresTemplate = ['biscuit', 'kids', 'tiered'];
    if (!template && requiresTemplate.includes(subcategory ?? '')) {
        return null;
    }

    if (effectiveMode === 'all') {
        return (
            <DecorationControls
                title="Украшения"
                decorations="all"
                setActiveDecoration={(decoration) => dispatch(addMainDecoration(decoration))}
                removeDecoration={(id) => dispatch(removeMainDecoration(id))}
                increment={(id) => dispatch(incrementMainDecoration(id))}
                decrement={(id) => dispatch(decrementMainDecoration(id))}
                activeDecoration={additionalDecorations} // или main, если логика другая
            />
        );
    }

    // split-режим (основные + дополнительные)
    return (
        <>
            <DecorationControls
                title="Основные украшения"
                decorations="main"
                setActiveDecoration={(decoration) => dispatch(addMainDecoration(decoration))}
                removeDecoration={(id) => dispatch(removeMainDecoration(id))}
                increment={(id) => dispatch(incrementMainDecoration(id))}
                decrement={(id) => dispatch(decrementMainDecoration(id))}
                activeDecoration={mainDecorations}
            />
            <DecorationControls
                title="Дополнительные украшения"
                decorations="additional"
                setActiveDecoration={(decoration) => dispatch(addAdditionalDecoration(decoration))}
                removeDecoration={(id) => dispatch(removeAdditionalDecoration(id))}
                increment={(id) => dispatch(incrementAdditionalDecoration(id))}
                decrement={(id) => dispatch(decrementAdditionalDecoration(id))}
                activeDecoration={additionalDecorations}
            />
        </>
    );
};

// Обёртка для референсов
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
// ─────────────────────────────────────────────
// Экспорт маппинга компонентов
export const controlComponents: Record<ControlType, React.FC<any>> = {
    weight: WeightControls,
    filling: FillingControls,
    creamText: CreamTextControls,
    photoPrint: PhotoprintControls,
    reference: ReferenceSection,

    template: TemplateControls,
    colors: ColorsControls,
    smudges: SmudgesControls,

    decorations: DecorationsSection,  // добавь, когда сделаешь
    // shape: ShapeControls,
    // gloss: GlossControls,
};
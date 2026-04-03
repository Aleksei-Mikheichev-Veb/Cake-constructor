import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import {
    addReferenceImage,
    removeReferenceImage,
    setColorsTemplate,
    setCupcakeBase,
    setCupcakeFilling,
    setFilling,
    setOrderComment,
} from "../../../../../redux/cakeConstructorSlice";
import ReferenceControls from "../../CakeConstructor/controls/ReferenceUpload/ReferenceUpload";
import SelectionControls from "../../CakeConstructor/controls/TemplateControls/SelectionControls";
import { FillingType } from "../../../../../data/cakes/biscuit/fillings";
import FillingControls from "../../CakeConstructor/controls/FillingControls/FillingControls";
import { ControlType } from "./dessertVariants";
import PorionsControls from "../../CakeConstructor/controls/ProtionsControl/PortionsControls";
import DessertStylingControls from "../../CakeConstructor/controls/DessertStylingControls/DessertStylingControls";

// Тип пропсов для SelectionControls-обёрток
type SelectionProps = {
    items: any[];
    title: string;
    isColor?: boolean;
};


// Обёртка для начинок

type FillingSectionProps = {
    title:string;
    fillings: FillingType[];
}
export const FillingSection = ({ title, fillings }:FillingSectionProps) => {
    const dispatch = useDispatch();
    const activeFilling = useSelector((s: RootState) => s.cakeConstructor.filling);

    return (
        <FillingControls
            title={title}
            fillings={fillings}
            activeFillingId={activeFilling?.id ?? null}
            setActiveFilling={(filling) => dispatch(setFilling(filling))}
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
            activeItemId={activeColor ?? null}
            setSelectedItem={(item) => dispatch(setColorsTemplate(item))}
            isColorSelected={isColor}
        />
    );
};

// ─────────────────────────────────────────────
// Обёртка для основы капкейка
export const CupcakeBaseControls = ({ items, title }: SelectionProps) => {
    const dispatch = useDispatch();
    const activeBase = useSelector((s: RootState) => s.cakeConstructor.cupcakeBase);

    return (
        <SelectionControls
            title={title}
            items={items}
            activeItemId={activeBase ?? null}
            setSelectedItem={(itemId) => dispatch(setCupcakeBase(itemId))}
        />
    );
};

// ─────────────────────────────────────────────
// Обёртка для начинки капкейка
export const CupcakeFillingControls = ({ items, title }: SelectionProps) => {
    const dispatch = useDispatch();
    const activeFilling = useSelector((s: RootState) => s.cakeConstructor.cupcakeFilling);

    return (
        <SelectionControls
            title={title}
            items={items}
            activeItemId={activeFilling ?? null}
            setSelectedItem={(itemId) => dispatch(setCupcakeFilling(itemId))}
        />
    );
};

// ─────────────────────────────────────────────
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
export const controlDessertComponents: Record<ControlType, React.FC<any>> = {
    portions: PorionsControls,
    filling: FillingSection,
    reference: ReferenceSection,
    styling: DessertStylingControls,
    colors: ColorsControls,
    cupcakeBase: CupcakeBaseControls,
    cupcakeFilling: CupcakeFillingControls,
};

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { addReferenceImage, removeReferenceImage, setColorsTemplate, setFilling, setOrderComment } from "../../../../../redux/cakeConstructorSlice";
import ReferenceControls from "../../CakeConstructor/controls/ReferenceUpload/ReferenceUpload";
import SelectionControls from "../../CakeConstructor/controls/TemplateControls/SelectionControls";
import { FillingType } from "../../../../../data/cakes/biscuit/fillings";
import FillingControls from "../../CakeConstructor/controls/FillingControls/FillingControls";
import { ControlType } from "./dessertVariants";
import PorionsControls from "../../CakeConstructor/controls/ProtionsControl/PortionsControls";

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
    // const activeFilling = useSelector((s: RootState) => s.cakeConstructor.tiers?.layerFillings);

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

    colors: ColorsControls,
};
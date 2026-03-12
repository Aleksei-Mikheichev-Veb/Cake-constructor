import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import WeightControls from "../controls/WeightControls/WeightControls";
import FillingControls from "../controls/FillingControls/FillingControls";
import CreamTextControls from "../controls/AddInscriptions/AddInscriptions";
import PhotoprintControls from "../controls/AddImage/AddImage";
import SelectionControls from "../controls/TemplateControls/SelectionControls";
import { ControlType } from "./cakeVariants";
import {setColorsTemplate, setSmudges, setTemplate} from "../../../../../redux/cakeConstructorSlice";

// Тип пропсов для SelectionControls-обёрток
type SelectionProps = {
    items: any[];
    title: string;
    isColor?: boolean;
};

// ─────────────────────────────────────────────
// Обёртка для шаблона
export const TemplateControls = ({ items, title }: SelectionProps) => {
    const dispatch = useDispatch();
    const activeTemplate = useSelector((s: RootState) => s.cakeConstructor.template);

    return (
        <SelectionControls
            title={title}
            items={items}
            activeItemId={activeTemplate?.id ?? null}
            setSelectedItem={(item) => dispatch(setTemplate(item))}
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

// ─────────────────────────────────────────────
// Экспорт маппинга компонентов
export const controlComponents: Record<ControlType, React.FC<any>> = {
    weight: WeightControls,
    filling: FillingControls,
    creamText: CreamTextControls,
    photoprint: PhotoprintControls,
    // reference: ReferenceControls,

    template: TemplateControls,
    colors: ColorsControls,
    smudges: SmudgesControls,

    // decorations: DecorationsSection,  // добавь, когда сделаешь
    // shape: ShapeControls,
    // gloss: GlossControls,
};
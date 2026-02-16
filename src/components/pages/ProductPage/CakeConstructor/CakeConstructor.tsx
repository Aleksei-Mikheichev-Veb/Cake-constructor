import React from 'react';
import styles from "../ProductPage.module.scss";
import globalStyles from "../../../../styles/global.module.scss";
import {
    addAdditionalDecoration,
    addMainDecoration, decrementAdditionalDecoration,
    decrementMainDecoration,
    incrementAdditionalDecoration,
    incrementMainDecoration,
    removeAdditionalDecoration,
    removeMainDecoration,
    setColorsTemplate,
    setSmudges,
    setTemplate
} from "../../../../redux/cakeConstructorSlice";
import {ItemType, templates} from "../../../../data/templates";
import {colors} from "../../../../data/colors";
import {smudges} from "../../../../data/smudges";
import AddImage from "./controls/AddImage/AddImage";
import AddInscriptions from "./controls/AddInscriptions/AddInscriptions";
import TotalPrice from "../../../UI/TotalPrice/TotalPrice";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../redux/store";
import WeightControls from './controls/WeightControls/WeightControls';
import SelectionControls from "./controls/TemplateControls/SelectionControls";
import FillingControls from "./controls/FillingControls/FillingControls";
import DecorationControls from "./controls/DecorationControls/DecorationControls";

const CakeConstructor = () => {
    const dispatch = useDispatch()
    const template = useSelector((state: RootState) => state.cakeConstructor.template)
    const colorsTemplate = useSelector((state:RootState) => state.cakeConstructor.colorsTemplate)
    const smudgesTemplate = useSelector((state:RootState) => state.cakeConstructor.smudges)
    const mainDecorations = useSelector((state:RootState) => state.cakeConstructor.mainDecorations)
    const additionalDecorations = useSelector((state:RootState) => state.cakeConstructor.additionalDecorations)

    const isAllDecorationsMode = template?.id === 'empty' || template?.id === 'center';
    return (
        <section className={styles.constructorSection}>
            <h2 className={globalStyles.visually_hidden}>Собери свой торт</h2>
            <WeightControls title={'Выберите колличество порций'}/>
            <FillingControls title={'Выберите начинку'}/>
            <SelectionControls
                activeItemId={template ? template.id : null}
                setSelectedItem={(template) => dispatch(setTemplate(template))}
                items={templates}
                title={'Выберите шаблон оформления'}
            />
            <SelectionControls
                activeItemId={colorsTemplate ? colorsTemplate.id : null}
                setSelectedItem={(colorTemplate:ItemType) => dispatch(setColorsTemplate(colorTemplate))}
                items={colors}
                isColorSelected={true}
                title={'Выберите цвет торта'}
            />
            <SelectionControls
                activeItemId={smudgesTemplate ? smudgesTemplate.id : null}
                setSelectedItem={(smudges) => dispatch(setSmudges(smudges))}
                items={smudges}
                title={'Выберите оформление подтеками'}
            />
            {isAllDecorationsMode ? (
                <DecorationControls
                    title={'Украшения'}
                    decorations={'all'}
                    setActiveDecoration={(decoration) => dispatch(addMainDecoration(decoration))}
                    removeDecoration={decorationId => dispatch(removeMainDecoration(decorationId))}
                    increment={decorationId => dispatch(incrementMainDecoration(decorationId))}
                    decrement={decorationId => dispatch(decrementMainDecoration(decorationId))}
                    activeDecoration={additionalDecorations}
                />
            ) : (
                <>
                    <DecorationControls
                        title={'Основные украшения'}
                        decorations={'main'}
                        setActiveDecoration={(decoration) => dispatch(addMainDecoration(decoration))}
                        removeDecoration={decorationId => dispatch(removeMainDecoration(decorationId))}
                        increment={decorationId => dispatch(incrementMainDecoration(decorationId))}
                        decrement={decorationId => dispatch(decrementMainDecoration(decorationId))}
                        activeDecoration={mainDecorations}
                    />
                    <DecorationControls
                        title={'Дополнительные украшения'}
                        decorations={'additional'}
                        setActiveDecoration={(decoration => dispatch(addAdditionalDecoration(decoration)))}
                        removeDecoration={decorationId => dispatch(removeAdditionalDecoration(decorationId))}
                        increment={decorationId => dispatch(incrementAdditionalDecoration(decorationId))}
                        decrement={decorationId => dispatch(decrementAdditionalDecoration(decorationId))}
                        activeDecoration={additionalDecorations}
                    />
                </>
            ) }


            <AddImage/>
            <AddInscriptions/>
            <TotalPrice/>
        </section>
    );
};

export default CakeConstructor;
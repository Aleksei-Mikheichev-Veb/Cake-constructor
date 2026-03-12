import React, {useEffect, useState} from 'react';
import styles from "../ProductPage.module.scss";
import globalStyles from "../../../../styles/global.module.scss";
import {
    addAdditionalDecoration,
    addMainDecoration, addReferenceImage, CakeSubcategory, decrementAdditionalDecoration,
    decrementMainDecoration,
    incrementAdditionalDecoration,
    incrementMainDecoration,
    removeAdditionalDecoration,
    removeMainDecoration, removeReferenceImage,
    setColorsTemplate, setOrderComment,
    setSmudges, setSubcategory,
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
import ReferenceUpload from "./controls/ReferenceUpload/ReferenceUpload";
import {cakeVariants, ControlType} from "./config/cakeVariants";
import CreamTextControls from "./controls/AddInscriptions/AddInscriptions";
import PhotoprintControls from "./controls/AddImage/AddImage";
import {useParams} from "react-router-dom";
import {controlComponents} from "./config/controlComponents";
import {cakePriceConfig} from "./config/cakePriceConfig";


const CakeConstructor = () => {


    const { subcategory } = useParams<{ subcategory: string }>();
    console.log(subcategory)
    const dispatch = useDispatch();

    useEffect(() => {
        if (subcategory && cakeVariants[subcategory]) {
            dispatch(setSubcategory(subcategory as CakeSubcategory));
        }
    }, [subcategory, dispatch]);

    // Проверяем наличие и валидность подкатегории
    if (!subcategory || !cakeVariants[subcategory]) {
        return <div>Неверный тип торта</div>;
    }

    const variant = cakeVariants[subcategory];
    return (

        <div>

            <h2>{variant.title}</h2>

            {variant.controls.map((control, index) => {

                const Component = controlComponents[control.type]

                if (!Component) return null

                return (
                    <Component
                        key={index}
                        {...control}
                    />
                )

            })}

            <TotalPrice/>

        </div>

    )
}
export default CakeConstructor;
//
// const CakeConstructor = () => {
//     const dispatch = useDispatch()
//     const template = useSelector((state: RootState) => state.cakeConstructor.template)
//     const colorsTemplate = useSelector((state:RootState) => state.cakeConstructor.colorsTemplate)
//     const smudgesTemplate = useSelector((state:RootState) => state.cakeConstructor.smudges)
//     const mainDecorations = useSelector((state:RootState) => state.cakeConstructor.mainDecorations)
//     const additionalDecorations = useSelector((state:RootState) => state.cakeConstructor.additionalDecorations)
//     const comment = useSelector((state: RootState) => state.cakeConstructor.orderComment);
//     const refImages = useSelector((state: RootState) => state.cakeConstructor.referenceImages);
//
//
//     const handleAddImages = (files: File[]) => {
//         files.forEach(file => {
//             const preview = URL.createObjectURL(file);
//             const id = Date.now().toString() + Math.random().toString(36).slice(2);
//             dispatch(addReferenceImage({ id, preview }));
//             // если нужно отправлять файл на сервер — сохраняй где-то отдельно или отправляй сразу
//         });
//     };
//
//     const handleRemoveImage = (id: string) => {
//         dispatch(removeReferenceImage(id));
//     };
//     const isAllDecorationsMode = template?.id === 'empty' || template?.id === 'center';
//     return (
//         <section className={styles.constructorSection}>
//             <h2 className={globalStyles.visually_hidden}>Собери свой торт</h2>
//             <WeightControls title={'Выберите колличество порций'}/>
//             <FillingControls title={'Выберите начинку'}/>
//             <SelectionControls
//                 activeItemId={template ? template.id : null}
//                 setSelectedItem={(template) => dispatch(setTemplate(template))}
//                 items={templates}
//                 title={'Выберите шаблон оформления'}
//             />
//             <SelectionControls
//                 activeItemId={colorsTemplate ? colorsTemplate.id : null}
//                 setSelectedItem={(colorTemplate:ItemType) => dispatch(setColorsTemplate(colorTemplate))}
//                 items={colors}
//                 isColorSelected={true}
//                 title={'Выберите цвет торта'}
//             />
//             <SelectionControls
//                 activeItemId={smudgesTemplate ? smudgesTemplate.id : null}
//                 setSelectedItem={(smudges) => dispatch(setSmudges(smudges))}
//                 items={smudges}
//                 title={'Выберите оформление подтеками'}
//             />
//             {isAllDecorationsMode ? (
//                 <DecorationControls
//                     title={'Украшения'}
//                     decorations={'all'}
//                     setActiveDecoration={(decoration) => dispatch(addMainDecoration(decoration))}
//                     removeDecoration={decorationId => dispatch(removeMainDecoration(decorationId))}
//                     increment={decorationId => dispatch(incrementMainDecoration(decorationId))}
//                     decrement={decorationId => dispatch(decrementMainDecoration(decorationId))}
//                     activeDecoration={additionalDecorations}
//                 />
//             ) : (
//                 <>
//                     <DecorationControls
//                         title={'Основные украшения'}
//                         decorations={'main'}
//                         setActiveDecoration={(decoration) => dispatch(addMainDecoration(decoration))}
//                         removeDecoration={decorationId => dispatch(removeMainDecoration(decorationId))}
//                         increment={decorationId => dispatch(incrementMainDecoration(decorationId))}
//                         decrement={decorationId => dispatch(decrementMainDecoration(decorationId))}
//                         activeDecoration={mainDecorations}
//                     />
//                     <DecorationControls
//                         title={'Дополнительные украшения'}
//                         decorations={'additional'}
//                         setActiveDecoration={(decoration => dispatch(addAdditionalDecoration(decoration)))}
//                         removeDecoration={decorationId => dispatch(removeAdditionalDecoration(decorationId))}
//                         increment={decorationId => dispatch(incrementAdditionalDecoration(decorationId))}
//                         decrement={decorationId => dispatch(decrementAdditionalDecoration(decorationId))}
//                         activeDecoration={additionalDecorations}
//                     />
//                 </>
//             ) }
//
//
//             <PhotoprintControls/>
//             <CreamTextControls/>
//             <ReferenceUpload
//                 comment={comment}
//                 onCommentChange={(v) => dispatch(setOrderComment(v))}
//                 images={refImages}
//                 onAddImages={handleAddImages}
//                 onRemoveImage={handleRemoveImage}
//             />
//             <TotalPrice/>
//         </section>
//     );
// };
//
// export default CakeConstructor;
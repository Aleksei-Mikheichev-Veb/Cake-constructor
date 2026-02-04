import React, {useState} from 'react';
import globalStyles from './../../../styles/global.module.scss'
import styles from './ProductPage.module.scss';
import img from './../../../assets/images/optionFromCategory/biscuit/1.jpg'
import {useParams} from "react-router-dom";
import {cakeTypes} from "../../../data/cakeTypes";
import FillingControls from "../СonstructorPage/controls/FillingControls/FillingControls";
import TemplateControls from "../СonstructorPage/controls/TemplateControls/SelectionControls";
import {ItemType, templates} from "../../../data/templates";
import DecorationControls from "../СonstructorPage/controls/DecorationControls/DecorationControls";
import {decorationsMain} from "../../../data/decorationsMain";
import {decorationsAdditional} from "../../../data/decorationsAdditional";
import SelectionControls from "../СonstructorPage/controls/TemplateControls/SelectionControls";
import {colors} from "../../../data/colors";
import {smudges} from "../../../data/smudges";
import AddImage from "../СonstructorPage/controls/AddImage/AddImage";
import AddInscriptions from "../СonstructorPage/controls/AddInscriptions/AddInscriptions";
import WeightControls from "../СonstructorPage/controls/WeightControls/WeightControls";
import {useDispatch, useSelector } from 'react-redux';
import {RootState} from "../../../redux/store";
import {
    removeAdditionalDecoration, removeMainDecorations,
    setAdditionalDecorations,
    setColorsTemplate,
    setMainDecorations,
    setSmudges,
    setTemplate
} from "../../../redux/cakeConstructorSlice";


const ProductPage = () => {
    const dispatch = useDispatch()
    const template = useSelector((state: RootState) => state.cakeConstructor.template)
    const colorsTemplate = useSelector((state:RootState) => state.cakeConstructor.colorsTemplate)
    const smudgesTemplate = useSelector((state:RootState) => state.cakeConstructor.smudges)
    const mainDecorations = useSelector((state:RootState) => state.cakeConstructor.mainDecorations)
    const additionalDecorations = useSelector((state:RootState) => state.cakeConstructor.additionalDecorations)
    const params = useParams()
    const product = cakeTypes.find((product) => (product.id === params.type))

    return (
        <div className={globalStyles.container}>
            <main className={styles.productPage}>
                <div className={styles.productPage_top}>
                    <div className={styles.productPage_leftColumn}>
                        <section className={`${styles.productPage_gallery} ${styles.gallery}`}>
                            <h2 className={globalStyles.visually_hidden}>Галерея товара</h2>
                            <img src={img} className={styles.gallery_image} alt="Бисквитный торт"/>
                        </section>
                    </div>
                    <div className={styles.productPage_rightColumn}>
                        <section className={styles.intro}>
                            <h1 className={styles.productPage_title}>
                                {product && product.name}
                            </h1>
                            <div className={styles.productPage_description}>
                                {product && product.description}
                            </div>
                        </section>
                    </div>
                </div>

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

                    <DecorationControls
                        title={'Основные украшения'}
                        decorations={'main'}
                        setActiveDecoration={(decoration) => dispatch(setMainDecorations(decoration))}
                        removeDecoration={decorationId => dispatch(removeMainDecorations(decorationId))}
                        activeDecoration={mainDecorations}
                    />
                    <DecorationControls
                        title={'Дополнительные украшения'}
                        decorations={'additional'}
                        setActiveDecoration={(decoration => dispatch(setAdditionalDecorations(decoration)))}
                        removeDecoration={decorationId => dispatch(removeAdditionalDecoration(decorationId))}
                        activeDecoration={additionalDecorations}
                    />
                    <AddImage/>
                    <AddInscriptions/>
                </section>
            </main>
        </div>
    );
};

export default ProductPage;
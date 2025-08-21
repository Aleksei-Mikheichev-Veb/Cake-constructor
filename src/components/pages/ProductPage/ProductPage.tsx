import React, {useState} from 'react';
import globalStyles from './../../../styles/global.module.scss'
import styles from './ProductPage.module.scss';
import img from './../../../assets/images/optionFromCategory/biscuit/1.jpg'
import {useParams} from "react-router-dom";
import {cakeTypes} from "../../../data/cakeTypes";
import FillingControls from "../СonstructorPage/controls/FillingControls/FillingControls";
import {fillings, FillingType} from "../../../data/fillings";
import ButtonsControls from "../СonstructorPage/controls/ButtonsControls/ButtonControls";
import {numberOfServing} from "../../../data/numberOfServing";
import TemplateControls from "../СonstructorPage/controls/TemplateControls/SelectionControls";
import {ItemType, templates} from "../../../data/templates";
import DecorationControls from "../СonstructorPage/controls/DecorationControls/DecorationControls";
import {decorationsMain} from "../../../data/decorationsMain";
import {decorationsAdditional} from "../../../data/decorationsAdditional";
import SelectionControls from "../СonstructorPage/controls/TemplateControls/SelectionControls";
import {colors} from "../../../data/colors";
import {smudges} from "../../../data/smudges";


const ProductPage = () => {
    const [selectedFilling, setSelectedFilling] = useState<FillingType | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<ItemType | null>(null)
    const [selectedColorType, setSelectedColorType] = useState<ItemType | null>(null)
    const [selectedColors, setSelectedColors] = useState<string[]>([])
    const [selectedSmudges, setSelectedSmudges] = useState<ItemType | null>(null)
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
                    <ButtonsControls title={'Выберите колличество порций'} data={numberOfServing}/>
                    <FillingControls
                        title={'Выберите начинку'}
                        activeFillingId={selectedFilling ? selectedFilling.id : null}
                        setSelectedFilling={setSelectedFilling}/>
                    <SelectionControls
                        activeItemId={selectedTemplate ? selectedTemplate.id : null}
                        setSelectedItem={setSelectedTemplate}
                        items={templates}
                        title={'Выберите шаблон оформления'}
                    />
                    <SelectionControls
                        activeItemId={selectedColorType ? selectedColorType.id : null}
                        setSelectedItem={setSelectedColorType}
                        items={colors}
                        selectedColors={selectedColors}
                        setSelectedColors={setSelectedColors}
                        isColorSelected={true}
                        title={'Выберите цвет торта'}
                    />
                    <SelectionControls
                        activeItemId={selectedSmudges ? selectedSmudges.id : null}
                        setSelectedItem={setSelectedSmudges}
                        items={smudges}
                        title={'Выберите оформление подтеками'}
                    />
                    <DecorationControls
                        title={'Основные украшения'}
                        decorations={'main'}
                        // setSelectedTemplate={}
                        // activeTemplateId={}
                    />
                    <DecorationControls
                        title={'Дополнительные украшения'}
                        decorations={'additional'}
                        // setSelectedTemplate={}
                        // activeTemplateId={}
                    />
                    <input type="color" value="<цвет>" name="<имя>"/>
                </section>
            </main>
        </div>
    );
};

export default ProductPage;
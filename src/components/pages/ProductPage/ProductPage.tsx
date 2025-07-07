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
import TemplateControls from "../СonstructorPage/controls/TemplateControls/TemplateControls";
import {TemplateType} from "../../../data/templates";
import DecorationControls from "../СonstructorPage/controls/DecorationControls/DecorationControls";
import {decorationsMain} from "../../../data/decorationsMain";
import {decorationsAdditional} from "../../../data/decorationsAdditional";


const ProductPage = () => {
    const [selectedFilling, setSelectedFilling] = useState<FillingType | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null)
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
                    <TemplateControls
                        activeTemplateId={selectedTemplate ? selectedTemplate.id : null}
                        setSelectedTemplate={setSelectedTemplate}
                        title={'Выберите шаблон оформления'}/>
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
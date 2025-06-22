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


const ProductPage = () => {
    const [selectedFilling, setSelectedFilling] = useState<FillingType | null>(null);
    const params = useParams()
    const product = cakeTypes.find((product) => (product.id === params.type))

    return (
        <div className={globalStyles.container}>
            <main className={styles.productPage}>
                <div className={styles.productPage_leftColumn}>
                    <section className={`${styles.productPage_gallery} ${styles.gallery}`}>
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

                    <section className={styles.constructorSection}>
                        <ButtonsControls title={'Выберите колличество порций'} data={numberOfServing}/>
                        <FillingControls
                            title={'Выберите начинку'}
                            activeFillingId={selectedFilling ? selectedFilling.id : null}
                            setSelectedFilling={setSelectedFilling}/>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default ProductPage;
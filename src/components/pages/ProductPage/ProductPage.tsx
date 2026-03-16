import React from 'react';
import globalStyles from './../../../styles/global.module.scss'
import styles from './ProductPage.module.scss';
import img from './../../../assets/images/optionFromCategory/biscuit/1.jpg'
import {useParams} from "react-router-dom";
import {cakeTypes} from "../../../data/cakeTypes";
import CakeConstructor from "./CakeConstructor/CakeConstructor";


const ProductPage = () => {
    const params = useParams()
    const product = cakeTypes.find((product) => (product.id === params.subcategory))

    if (!product) {
        return <div>Товар не найден</div>
    }
    return (
        <div className={globalStyles.container}>
            <main className={styles.productPage}>
                <div className={styles.productPage_top}>
                    <div className={styles.productPage_leftColumn}>
                        <section className={`${styles.productPage_gallery} ${styles.gallery}`}>
                            <h2 className={globalStyles.visually_hidden}>Галерея товара</h2>
                            <img src={require(`../../../assets/images/categories/${product.image}`)} className={styles.gallery_image} alt={product.imageName}/>
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

                <CakeConstructor/>
            </main>
        </div>
    );
};

export default ProductPage;
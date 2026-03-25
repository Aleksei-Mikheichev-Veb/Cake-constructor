import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import CakeConstructor from "./CakeConstructor/CakeConstructor";
import DessertConstructor from './DessertConstructor/DessertConstructor';

import styles from './ProductPage.module.scss';
import globalStyles from '../../../styles/global.module.scss';
import { catalog } from "./../../../data/catalog";
import { setDessertType } from '../../../redux/cakeConstructorSlice';


const ProductPage = () => {
    const { category, subcategory } = useParams<{
        category: string;
        subcategory?: string;
    }>();

    const dispatch = useDispatch();

    // Определяем тип десерта
    const dessertType = category === 'cakes' ? 'cake' 
                      : category === 'trifles' ? 'trifles'
                      : category === 'cupcakes' ? 'cupcake'
                      : null;

    // Устанавливаем dessertType в Redux при изменении категории
    useEffect(() => {
        if (dessertType) {
            dispatch(setDessertType(dessertType));
        } else {
            dispatch(setDessertType(null));
        }
    }, [dessertType, dispatch]);

    const categoryData = category ? catalog[category as keyof typeof catalog] : null;

    if (!categoryData) {
        return <div>Категория не найдена</div>;
    }

    let product = null;

    if (categoryData.hasSubcategories) {
        if (!subcategory) {
            return <div>Подкатегория не выбрана</div>;
        }
        product = categoryData.subcategories.find(item => item.id === subcategory);
    } else {
        product = categoryData.product;
    }

    if (!product) {
        return <div>Товар не найден</div>;
    }

    return (
        <div className={globalStyles.container}>
            <main className={styles.productPage}>
                <div className={styles.productPage_top}>
                    <div className={styles.productPage_leftColumn}>
                        <section className={`${styles.productPage_gallery} ${styles.gallery}`}>
                            <h2 className={globalStyles.visually_hidden}>
                                Галерея товара
                            </h2>

                            <img
                                src={require(`../../../assets/images/categories/${product.image}`)}
                                className={styles.gallery_image}
                                alt={product.imageName}
                            />
                        </section>
                    </div>

                    <div className={styles.productPage_rightColumn}>
                        <section className={styles.intro}>
                            <h1 className={styles.productPage_title}>
                                {product.name}
                            </h1>

                            <div className={styles.productPage_description}>
                                {product.description}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Выбор конструктора в зависимости от типа */}
                {category === 'cakes' ? (
                    <CakeConstructor />
                ) : (
                    <DessertConstructor />
                )}
            </main>
        </div>
    );
};

export default ProductPage;
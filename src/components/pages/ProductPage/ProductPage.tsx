import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import CakeConstructor from './CakeConstructor/CakeConstructor';
import DessertConstructor from './DessertConstructor/DessertConstructor';

import styles from './ProductPage.module.scss';
import globalStyles from '../../../styles/global.module.scss';
import { setDessertType, setSubcategory } from '../../../redux/cakeConstructorSlice';
import { useGetCategoriesQuery } from '../../../api/constructorApi';
import { resolveImageUrl } from '../../../utils/imageUrl';

const ProductPage = () => {
    const { category, subcategory } = useParams<{
        category: string;
        subcategory?: string;
    }>();

    const dispatch = useDispatch();

    // Загружаем категории с API
    const { data: categories, isLoading, isError } = useGetCategoriesQuery();

    // Определяем тип десерта
    const dessertType = category === 'cakes' ? 'cake'
        : category === 'trifles' ? 'trifles'
            : category === 'cupcakes' ? 'cupcake'
                : null;

    // Устанавливаем dessertType и subcategory в Redux
    useEffect(() => {
        if (dessertType) {
            dispatch(setDessertType(dessertType));
        } else {
            dispatch(setDessertType(null));
        }
    }, [dessertType, dispatch]);

    useEffect(() => {
        if (subcategory) {
            dispatch(setSubcategory(subcategory as any));
        }
    }, [subcategory, dispatch]);

    // Находим текущую категорию в данных API
    const categoryData = useMemo(() => {
        if (!categories || !category) return null;
        return categories.find(c => c.id === category) || null;
    }, [categories, category]);

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (isError || !categoryData) {
        return <div>Категория не найдена</div>;
    }

    // Находим продукт
    let product: { name: string; description: string | null; image: string | null; imageName: string | null } | null = null;

    if (categoryData.hasSubcategories) {
        if (!subcategory) {
            return <div>Подкатегория не выбрана</div>;
        }
        const sub = categoryData.subcategories.find(s => s.id === subcategory);
        if (sub) {
            product = {
                name: sub.name,
                description: sub.description,
                image: sub.image,
                imageName: sub.imageName,
            };
        }
    } else {
        // Для десертов без подкатегорий — данные самой категории
        product = {
            name: categoryData.name,
            description: categoryData.description,
            image: categoryData.image,
            imageName: categoryData.imageName,
        };
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

                            {product.image && (
                                <img
                                    src={resolveImageUrl(product.image)}
                                    className={styles.gallery_image}
                                    alt={product.imageName || product.name}
                                />
                            )}
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
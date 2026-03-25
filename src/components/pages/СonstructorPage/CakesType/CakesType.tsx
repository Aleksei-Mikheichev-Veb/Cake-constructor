import React from 'react';
import globalStyles from './../../../../styles/global.module.scss';
import styles from './CakesType.module.scss';
import CardCategory from "../CardCategory/CardCategory";
import { useNavigate } from "react-router-dom";
import { catalog } from '../../../../data/catalog';


const CakesType = () => {
    const navigate = useNavigate();

    const handleClickCategory = (id: string) => {
        navigate(`/constructor/cakes/${id}`)
    }
    const cakesCategory = catalog.cakes;

    if (!cakesCategory.hasSubcategories) return null;
    return (
        <div className={`${globalStyles.container} ${styles.container}`}>
            <h1 className={globalStyles.title}>Выберите тип торта</h1>

            <main className={globalStyles.categoriesList}>
                {cakesCategory.subcategories.map(elem => (
                    <CardCategory
                        handleClickCategory={handleClickCategory}
                        title={elem.name}
                        image={elem.image}
                        id={elem.id}
                        tooltip={elem.tooltip}
                        key={elem.name} />
                ))}
            </main>
        </div>
    );
};

export default CakesType;
import React from 'react';
import {categories} from "../../../data/categories";
import CardCategory from "./CardCategory/CardCategory";
import {useNavigate} from "react-router-dom";
import globalStyles from './../../../styles/global.module.scss'


const ConstructorPage = () => {
    const navigate = useNavigate();

    const handleClickCategory = (id: string) => {
        if (id === 'cakes') {
            navigate('/constructor/cakes');           // торты → выбор подкатегории
        } else {
            navigate(`/constructor/${id}`);           // трайфлы и капкейки → сразу в ProductPage
        }
    };
    return (
        <div className={globalStyles.container}>
            <h1>Конструктор десертов</h1>
            <main className={globalStyles.categoriesList}>
                {categories.map(elem => (
                    <CardCategory
                        handleClickCategory={handleClickCategory}
                        title={elem.name}
                        image={elem.image}
                        id={elem.id}
                        tooltip={elem.tooltip}
                        key={elem.name}/>
                ))}
            </main>
        </div>
    );
};

export default ConstructorPage;
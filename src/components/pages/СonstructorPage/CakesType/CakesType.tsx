import React from 'react';
import globalStyles from './../../../../styles/global.module.scss';
import styles from './CakesType.module.scss';
import CardCategory from "../CardCategory/CardCategory";
import {useNavigate} from "react-router-dom";
import {cakeTypes} from "../../../../data/cakeTypes";


const CakesType = () => {
    const navigate = useNavigate();

    const handleClickCategory = (id: string) => {
        navigate(`/constructor/cakes/${id}`)
    }

    return (
        <div className={`${globalStyles.container} ${styles.container}`}>
            <h1 className={globalStyles.title}>Выберите тип торта</h1>

            <main className={globalStyles.categoriesList}>
                {cakeTypes.map(elem => (
                    <CardCategory
                        handleClickCategory={handleClickCategory}
                        title={elem.name}
                        image={elem.image}
                        id={elem.id}
                        description={elem.description}
                        key={elem.name}/>
                ))}
            </main>
        </div>
    );
};

export default CakesType;
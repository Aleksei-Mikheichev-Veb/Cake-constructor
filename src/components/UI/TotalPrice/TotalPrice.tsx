import React from 'react';
import styles from './TotalPrice.module.scss'
import {useSelector} from "react-redux";
import {selectDessertPriceRange} from "../../../redux/selectors/selectDessertPriceRange";


const TotalPrice = () => {
    const { min, max, isRange, currency } = useSelector(selectDessertPriceRange);

    return (
        <div className={styles.price}>
            {isRange
                ? `от ${min.toLocaleString()} до ${max.toLocaleString()} ${currency}`
                : `${min.toLocaleString()} ${currency}`}
        </div>
    )
};

export default TotalPrice;
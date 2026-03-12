import React from 'react';
import styles from './TotalPrice.module.scss'
import {useSelector} from "react-redux";
import {selectCakePriceRange} from "../../../redux/selectors/cakeConstructorSelectors";


const TotalPrice = () => {
    const { min, max, isRange, currency } = useSelector(selectCakePriceRange);

    return (
        <div className={styles.price}>
            {isRange
                ? `от ${min.toLocaleString()} до ${max.toLocaleString()} ${currency}`
                : `${min.toLocaleString()} ${currency}`}
        </div>
    )
};

export default TotalPrice;
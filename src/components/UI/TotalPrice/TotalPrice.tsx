import React from 'react';
import styles from './TotalPrice.module.scss'
import {useSelector} from "react-redux";
import {selectCakePrice} from "../../../redux/selectors/cakeConstructorSelectors";

const TotalPrice = () => {
    const price = useSelector(selectCakePrice);
    const {minPrice, maxPrice} = price;
    if(minPrice == 0){
        return null
    }
    return (
        <div className={styles.price}>
            {price.minPrice != 0 && `Итого: ${minPrice} - ${maxPrice} ₽`}

        </div>
    );
};

export default TotalPrice;
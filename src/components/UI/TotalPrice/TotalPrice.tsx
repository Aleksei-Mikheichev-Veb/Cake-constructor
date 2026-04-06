import React, { useState } from 'react';
import styles from './TotalPrice.module.scss';
import { useSelector } from 'react-redux';
import { selectDessertPriceRange } from '../../../redux/selectors/selectDessertPriceRange';
import ModalUniversal from '../ModalUniversal/ModalUniversal';
import OrderForm from '../../pages/ProductPage/OrderForm/OrderForm';

const TotalPrice = () => {
    const { min, max, isRange, currency } = useSelector(selectDessertPriceRange);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const priceText = isRange
        ? `от ${min.toLocaleString()} до ${max.toLocaleString()} ${currency}`
        : `${min.toLocaleString()} ${currency}`;

    return (
        <>
            <div className={styles.priceBlock}>
                <div className={styles.price}>{priceText}</div>
                <button
                    className={styles.orderButton}
                    onClick={() => setIsModalOpen(true)}
                    disabled={min === 0}
                >
                    Оформить заказ
                </button>
            </div>

            <ModalUniversal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <OrderForm onClose={() => setIsModalOpen(false)} />
            </ModalUniversal>
        </>
    );
};

export default TotalPrice;
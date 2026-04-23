import React, { useState } from 'react';
import styles from './TotalPrice.module.scss';
import { usePriceCalculation } from '../../../hooks/usePriceCalculation';
import ModalUniversal from '../ModalUniversal/ModalUniversal';
import OrderForm from '../../pages/ProductPage/OrderForm/OrderForm';
import { useNavigate, useParams } from 'react-router-dom';

const TotalPrice = () => {
    const { category, subcategory: urlSubcategory } = useParams<{
        category: string;
        subcategory?: string;
    }>();

    // Определяем priceKey напрямую из URL — не зависим от Redux
    let priceKey: string | null = null;

    if (category === 'cakes' && urlSubcategory) {
        // Торты: ключ = подкатегория (biscuit, bento, mousse...)
        priceKey = urlSubcategory;
    } else if (category === 'cupcakes') {
        priceKey = 'cupcakes';
    } else if (category === 'trifles') {
        priceKey = 'trifles';
    }

    const navigate = useNavigate();
    const { min, max, isRange, currency, isLoading } = usePriceCalculation(priceKey);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderSubmitted, setOrderSubmitted] = useState(false);

    const handleClose = () => {
        setIsModalOpen(false);
        if (orderSubmitted) {
            setOrderSubmitted(false);
            navigate('/home'); // или какой у тебя путь
        }
    };

    const priceText = isLoading
        ? 'Загрузка...'
        : isRange
            ? `от ${min.toLocaleString()} до ${max.toLocaleString()} ${currency}`
            : `${min.toLocaleString()} ${currency}`;

    return (
        <>
            <div className={styles.priceBlock}>
                <div className={styles.price}>{priceText}</div>
                <button
                    className={styles.orderButton}
                    onClick={() => setIsModalOpen(true)}
                    disabled={min === 0 || isLoading}
                >
                    Оформить заказ
                </button>
            </div>

            <ModalUniversal isOpen={isModalOpen} onClose={handleClose}>
                <OrderForm
                    onClose={handleClose}
                    onSuccess={() => setOrderSubmitted(true)}
                />
            </ModalUniversal>
        </>
    );
};

export default TotalPrice;
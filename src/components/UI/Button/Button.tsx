import React, { FC } from 'react';
import styles from './Button.module.scss'; // создай этот файл
import { NumberOfServingDessertType } from '../../../types/NumberOfServingDessertType';
import { NumberOfServingType } from '../../../types/NumberOfServingType';

type ButtonProps = {
    elem: NumberOfServingType | NumberOfServingDessertType;
    quantity: string;
    servingType?: string;
    activeId: number | null;
    id: number;
    handleButtonClick: () => void;
};

const Button: FC<ButtonProps> = ({ quantity, servingType = "порций", activeId, id, handleButtonClick }) => {
    const isActive = activeId === id;

    return (
        <button
            className={`${styles.button} ${isActive ? styles.active : ''}`}
            onClick={handleButtonClick}
        >
            {quantity} {servingType}
        </button>
    );
};

export default Button;
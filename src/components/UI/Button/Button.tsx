import React, { FC } from 'react';
import styles from './Button.module.scss'; // создай этот файл
import { NumberOfServingType } from '../../../data/cakes/biscuit/numberOfServing';
import { NumberOfServingDessertType } from '../../../data/cupcakes/numberOfServingCupcakes';

type ButtonProps = {
  elem: NumberOfServingType | NumberOfServingDessertType;
  quantity: string;
  servingType?: string;
  activeId: number | null;
  id: number;
  handleButtonClick: () => void;
};

const Button: FC<ButtonProps> = ({ quantity,servingType = "порций", activeId, id, handleButtonClick }) => {
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
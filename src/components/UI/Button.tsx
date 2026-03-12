import React, {FC} from 'react';
import styled from "styled-components";
import {NumberOfServingType} from "../../data/cakes/biscuit/numberOfServing";

type ButtonProps = {
    elem:NumberOfServingType;
    quantity: string;
    activeId: number | null;
    id:number;
    handleButtonClick: () => void;
}

const ButtonStyle = styled.button<{isActive: boolean}>`
  background: ${({isActive}) => isActive ? '#fff' : '#333439'};
  padding: 15px;
  color: ${({isActive}) => isActive ? '#333439' : '#fff'};
  font-weight: 500;
  font-size: 16px;
  border-radius: 5px;
  border:  ${({isActive}) => isActive ? '1px solid #333439' : 'none'};
  cursor: pointer;
  &:hover {
    background: ${({isActive}) => isActive ? '#fff' : '#575860'};
    color:${({isActive}) => isActive ? '#575860' : '#fff'};
  }
`

const Button: FC<ButtonProps> = ({elem, quantity, activeId, id, handleButtonClick}) => {
    // console.log(activeId)
    // console.log(id)
    return (
        <ButtonStyle isActive={activeId === id} onClick={() => handleButtonClick()}>
            {quantity} порций
        </ButtonStyle>
    );
};

export default Button;
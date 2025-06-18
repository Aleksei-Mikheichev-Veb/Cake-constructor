import React, {FC} from 'react';
import styled from "styled-components";

type ButtonProps = {
    quantity: string;
    activeId: number;
    id:number;
    handleButtonClick: (id:number) => void;
}

const ButtonStyle = styled.button<{isActive: boolean}>`
  background: ${({isActive}) => isActive ? '#fff' : '#333439'};
  padding: 15px;
  color: ${({isActive}) => isActive ? '#333439' : '#fff'};
  cursor: pointer;
  //font-weight: 500;
  font-size: 16px;
  border-radius: 5px;
  border: none;

  &:hover {
    background: ${({isActive}) => isActive ? '#fff' : '#575860'};
    color:${({isActive}) => isActive ? '#575860' : '#fff'};
  }
`

const Button: FC<ButtonProps> = ({quantity, activeId, id, handleButtonClick}) => {
    console.log(activeId)
    console.log(id)
    return (
        <ButtonStyle isActive={activeId === id} onClick={() => handleButtonClick(id)}>
            {quantity} порций
        </ButtonStyle>
    );
};

export default Button;
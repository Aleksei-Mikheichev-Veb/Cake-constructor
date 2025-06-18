import React, {useState} from 'react';
import styled from "styled-components";
import Button from "../../UI/Button";
import Tooltip from "../../UI/Tooltip";

const numberOfServing = [
    {
        id: 1,
        quantity: '8-9',
        weight: '1.6 - 1.8',
        height: 15,
        diameter: 14,
    }, {
        id: 2,
        quantity: '10-12',
        weight: '2 - 2.5',
        height: 15,
        diameter: 16,
    }, {
        id: 3,
        quantity: '12-14',
        weight: '2.5 - 3',
        height: 15,
        diameter: 18,
    }, {
        id: 4,
        quantity: '15-17',
        weight: '3 - 3.5',
        height: 15,
        diameter: 20,
    }, {
        id: 5,
        quantity: '18-20',
        weight: '3.5 - 4',
        height: 15,
        diameter: 24,
    },
]

const ButtonControlsStyle = styled.div`
  display: flex;
  gap: 5px;
  padding: 10px;
`

const ButtonControls = () => {
    const [ActiveButtonId, setIsActiveButtonId] = useState(numberOfServing[0].id)

    const handleButtonClick = (buttonId: number) => {
        setIsActiveButtonId(buttonId)
    }
    return (
        <ButtonControlsStyle>
            {numberOfServing.map((elem) => (
                <Tooltip content={{weight: elem.weight, height: elem.height, diameter: elem.diameter}} key={elem.id}>
                    <Button
                        quantity={elem.quantity}
                        activeId={ActiveButtonId}
                        id={elem.id}
                        handleButtonClick={handleButtonClick}/>
                </Tooltip>
            ))}
        </ButtonControlsStyle>
    );
};

export default ButtonControls;
import React, {FC, useState} from 'react';
import styled from "styled-components"
import Tooltip from "../../../../UI/Tooltip";
import Button from "../../../../UI/Button";
import styles from './ButtonsControls.module.scss'
import {NumberOfServingType} from "../../../../../data/numberOfServing";


type ButtonsControlsProps = {
    title: string;
    data: NumberOfServingType[];
}

const ButtonsControls: FC<ButtonsControlsProps> = ({title, data}) => {
    const [ActiveButtonId, setIsActiveButtonId] = useState(data[0].id)

    const handleButtonClick = (buttonId: number) => {
        setIsActiveButtonId(buttonId)
    }
    return (
        <div className={styles.buttonsControls}>
            <h2 className={styles.buttonsControls_title}>{title}</h2>
            <div className={styles.buttonsControls_row}>
                {data.map((elem) => (
                    <Tooltip content={{weight: elem.weight, height: elem.height, diameter: elem.diameter}} key={elem.id}>
                        <Button
                            quantity={elem.quantity}
                            activeId={ActiveButtonId}
                            id={elem.id}
                            handleButtonClick={handleButtonClick}/>
                    </Tooltip>
                ))}
            </div>
        </div>
    );
};

export default ButtonsControls;
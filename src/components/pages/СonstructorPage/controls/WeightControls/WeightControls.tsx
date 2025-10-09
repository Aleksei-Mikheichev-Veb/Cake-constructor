import React, {FC} from 'react';
import Tooltip from "../../../../UI/Tooltip";
import Button from "../../../../UI/Button";
import styles from './WeightControls.module.scss'
import {numberOfServing, NumberOfServingType} from "../../../../../data/numberOfServing";
import { useDispatch, useSelector } from 'react-redux';
import {RootState} from "../../../../../redux/store";
import {setWeight} from "../../../../../redux/cakeConstructorSlice";


type WeightControlsProps = {
    title: string;
}

const WeightControls: FC<WeightControlsProps> = ({title}) => {
    const dispatch = useDispatch();
    const ActiveNumberOfServing = useSelector((state:RootState) => state.cakeConstructor.numberOfServing)

    const handleButtonClick = (elem: NumberOfServingType) => {
        dispatch(setWeight(elem))
    }

    return (
        <div className={styles.weightControls}>
            <h2 className={styles.weightControls_title}>{title}</h2>
            <div className={styles.weightControls_row}>
                {numberOfServing.map((elem) => (
                    <Tooltip content={{weight: elem.weight, height: elem.height, diameter: elem.diameter}} key={elem.id}>
                        <Button
                            elem={elem}
                            quantity={elem.quantity}
                            activeId={ActiveNumberOfServing && ActiveNumberOfServing.id }
                            id={elem.id}
                            handleButtonClick={() => handleButtonClick(elem)}/>
                    </Tooltip>
                ))}
            </div>
        </div>
    );
};

export default WeightControls;
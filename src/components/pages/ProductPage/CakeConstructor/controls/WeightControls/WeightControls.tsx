import React, {FC} from 'react';
import styles from './WeightControls.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import {numberOfServing, NumberOfServingType} from "../../../../../../data/numberOfServing";
import {RootState} from "../../../../../../redux/store";
import {setWeight} from "../../../../../../redux/cakeConstructorSlice";
import Tooltip from "../../../../../UI/Tooltip/Tooltip";
import Button from "../../../../../UI/Button";


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
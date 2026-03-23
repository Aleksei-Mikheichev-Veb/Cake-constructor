import React, {FC} from 'react';
import styles from './WeightControls.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import {numberOfServing, NumberOfServingType} from "../../../../../../data/cakes/biscuit/numberOfServing";
import {RootState} from "../../../../../../redux/store";
import {setWeight} from "../../../../../../redux/cakeConstructorSlice";
import Tooltip from "../../../../../UI/Tooltip/Tooltip";
import Button from "../../../../../UI/Button/Button";
import { cakeVariants } from "../../config/cakeVariants";

type WeightControlsProps = {
    title: string;
};

const WeightControls: FC<WeightControlsProps> = ({ title }) => {
    const dispatch = useDispatch();

    const subcategory = useSelector((state: RootState) => state.cakeConstructor.subcategory);


    const variant = subcategory ? cakeVariants[subcategory] : null;
    const servings = variant?.weightData || []; // если нет — пустой массив

    const activeServing = useSelector((state: RootState) => state.cakeConstructor.numberOfServing);

    const handleButtonClick = (elem: NumberOfServingType) => {
        dispatch(setWeight(elem));
    };

    if (servings.length === 0) {
        return <div>Вес не найден для этого типа торта</div>;
    }

    return (
        <section className={styles.weightControls}>
            <h2 className={styles.weightControls_title}>{title}</h2>
            <div className={styles.weightControls_row}>
                {servings.map((elem) => (
                    <Tooltip
                        key={elem.id}
                        content={{ weight: elem.weight, height: elem.height, diameter: elem.diameter }}
                    >
                        <Button
                            elem={elem}
                            quantity={elem.quantity}
                            activeId={activeServing?.id ?? null}
                            id={elem.id}
                            handleButtonClick={() => handleButtonClick(elem)}
                        />
                    </Tooltip>
                ))}
            </div>
        </section>
    );
};

export default WeightControls;
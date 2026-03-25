import React, {FC} from 'react';
import styles from './PortionsControls.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import {RootState} from "../../../../../../redux/store";
import {setDessertPortions, setWeight} from "../../../../../../redux/cakeConstructorSlice";
import Tooltip from "../../../../../UI/Tooltip/Tooltip";
import Button from "../../../../../UI/Button/Button";
import { useParams } from 'react-router-dom';
import { dessertVariants } from '../../../DessertConstructor/config/dessertVariants';
import { NumberOfServingDessertType } from '../../../../../../data/cupcakes/numberOfServingCupcakes';

type PortionsControlsProps = {
    title: string;
};

const PorionsControls: FC<PortionsControlsProps> = ({ title }) => {
    const dispatch = useDispatch();
    const {category} = useParams<{category: string}>()


    const variant = category ? dessertVariants[category] : null;
    const servings = variant?.portionData || []; // если нет — пустой массив

    const activeServing = useSelector((state: RootState) => state.cakeConstructor.dessertPortions);

    const handleButtonClick = (elem: NumberOfServingDessertType) => {
        dispatch(setDessertPortions(elem));
    };

    if (servings.length === 0) {
        return <div>Вес не найден для этого типа торта</div>;
    }

    return (
        <section className={styles.portionControls}>
            <h2 className={styles.portionControls_title}>{title}</h2>
            <div className={styles.portionControls_row}>
                {servings.map((elem) => (
                    <Tooltip
                        key={elem.id}
                        content={{ weight: elem.weight,  }}
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

export default PorionsControls;
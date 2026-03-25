import React, {useEffect} from 'react';
import {
    CakeSubcategory,
    resetCakeConstructor,
    setDessertType,
    setQuantity,
    setSubcategory, setTiers,
    setWeight
} from "../../../../redux/cakeConstructorSlice";
import TotalPrice from "../../../UI/TotalPrice/TotalPrice";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import { controlDessertComponents } from './config/controlDessertComponents';
import { dessertVariants } from './config/dessertVariants';


const DessertConstructor = () => {


    const { category } = useParams<{ subcategory: string, category: string }>();
    const dispatch = useDispatch();

    useEffect(() => {
        if (category && dessertVariants[category]) {
            // Сброс всего
            dispatch(resetCakeConstructor());

            // Автовыбор веса порций
            const firstServing = dessertVariants[category].portionData[0];
            if (firstServing) {
                dispatch(setQuantity(firstServing));
            }
        }
    }, [category, dispatch]);

    // Проверяем наличие и валидность подкатегории
    if (!category || !dessertVariants[category]) {
        return <div>Неверный тип десерта</div>;
    }

    const variant = dessertVariants[category];
    return (

        <div>
            {variant.controls.map((control, index) => {

                const Component = controlDessertComponents[control.type]

                if (!Component) return null

                return (
                    <Component
                        key={index}
                        {...control}
                    />
                )

            })}

            <TotalPrice/>

        </div>

    )
}
export default DessertConstructor;
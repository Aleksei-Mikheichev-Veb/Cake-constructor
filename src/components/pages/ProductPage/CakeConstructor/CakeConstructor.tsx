import React, {useEffect} from 'react';
import {
    CakeSubcategory,
    resetCakeConstructor,
    setSubcategory,
    setWeight
} from "../../../../redux/cakeConstructorSlice";
import TotalPrice from "../../../UI/TotalPrice/TotalPrice";
import {useDispatch, useSelector} from "react-redux";
import {cakeVariants} from "./config/cakeVariants";
import {useParams} from "react-router-dom";
import {controlComponents} from "./config/controlComponents";


const CakeConstructor = () => {


    const { subcategory } = useParams<{ subcategory: string }>();
    console.log(subcategory)
    const dispatch = useDispatch();

    useEffect(() => {
        if (subcategory && cakeVariants[subcategory]) {
            dispatch(resetCakeConstructor())
            dispatch(setSubcategory(subcategory as CakeSubcategory));
            const firstServing = cakeVariants[subcategory].weightData[0];
            if (firstServing) {
                dispatch(setWeight(firstServing));
            }
        }
    }, [subcategory, dispatch]);

    // Проверяем наличие и валидность подкатегории
    if (!subcategory || !cakeVariants[subcategory]) {
        return <div>Неверный тип торта</div>;
    }

    const variant = cakeVariants[subcategory];
    return (

        <div>
            {variant.controls.map((control, index) => {

                const Component = controlComponents[control.type]

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
export default CakeConstructor;
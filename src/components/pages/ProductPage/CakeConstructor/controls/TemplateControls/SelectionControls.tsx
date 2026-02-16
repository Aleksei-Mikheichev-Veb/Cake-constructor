import React, {FC, useEffect, useState} from 'react';
import styles from './SelectionControls.module.scss'
import Template from "../TemplateControls/Template/Template";
import {useDispatch, useSelector } from 'react-redux';
import {RootState} from "../../../../../../redux/store";
import InputColor from "../../../../../UI/inputs/InputColor/InputColor";
import {ItemType} from "../../../../../../data/templates";
import {setColors} from "../../../../../../redux/cakeConstructorSlice";

type SelectionControlsProps = {
    title:string; // Название блока
    items:ItemType[]; // Закинутые варианты выбора
    setSelectedItem:(item:ItemType) => void; // Функция для установки выбора варианта
    activeItemId:string | null; // Выбранный вариант
    isColorSelected?:boolean; // Надстройка для блока с выбором цвета торта.Подключает дополнительный функционал.
}

const SelectionControls: FC<SelectionControlsProps> = ({
                                                           title,
                                                           items,
                                                           setSelectedItem,
                                                           activeItemId,
                                                           isColorSelected= false,
                                                       }) => {
    const [countColorsSelected, setCountColorsSelected] = useState(0);
    const colors = useSelector((state: RootState) => state.cakeConstructor.colors)
    const dispatch = useDispatch()
    useEffect(() => {
        if(activeItemId){
            switch(activeItemId){
                case 'color1':
                    setCountColorsSelected(1);
                    break;
                case 'color2':
                    setCountColorsSelected(colors.length || 2);
                    break;
                case 'color3':
                    setCountColorsSelected(0);
                    break;
                case 'color4':
                    setCountColorsSelected(2);
                    break;
                case 'color5':
                    setCountColorsSelected(2);
                    break;
                default:setCountColorsSelected(0);

            }
        }
    },[activeItemId])


    // Установить количество цветов торта
    const handleColorCountChange = (count: number) => {
        // if (!setSelectedColors) return;
        setCountColorsSelected(count);

    };


    return (
        <div className={styles.templateControls}>
            <h2 className={styles.templateControls_title}>{title}</h2>
            <div className={styles.templateControls_templates}>
                {items.map(item => (
                    <Template
                        key={item.id}
                        activeItemId={activeItemId}
                        setSelectedItem={setSelectedItem}
                        item={item}/>
                ))}
            </div>
            {isColorSelected && activeItemId && activeItemId !== 'color3' && (
                <div className={styles.colorPicker}>
                    <label>Выберите цвет(а):</label>
                    {activeItemId === 'color2' && (
                        <div className={styles.colorPicker_colorCountSelector}>
                            <label>
                                <input
                                    type="radio"
                                    name="colorCount"
                                    checked={countColorsSelected === 2}
                                    onChange={() => handleColorCountChange(2)}
                                />
                                2 цвета
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="colorCount"
                                    value="3"
                                    checked={countColorsSelected === 3}
                                    onChange={() => handleColorCountChange(3)}
                                />
                                3 цвета
                            </label>
                        </div>
                    )}
                    <div className={styles.colorPicker_colorInputs}>
                        {Array.from({ length: countColorsSelected }).map((_, index) => (
                            <InputColor key={index}
                                        selectedColor={colors && colors[index] || '#000000'}
                                        setSelectedColor={(color:string) => dispatch(setColors({color, index}))}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectionControls;
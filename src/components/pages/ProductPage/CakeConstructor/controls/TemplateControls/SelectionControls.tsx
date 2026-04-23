import React, { FC, useEffect, useState } from 'react';
import styles from './SelectionControls.module.scss';
import Template from "../TemplateControls/Template/Template";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../../../../../redux/store";
import InputColor from "../../../../../UI/inputs/InputColor/InputColor";
import { clearChocolateText, setColors } from "../../../../../../redux/cakeConstructorSlice";
import { ItemType } from '../../../../../../types/ItemType';

type SelectionControlsProps = {
    title: string;
    items: ItemType[];
    setSelectedItem: (itemId: string) => void;
    activeItemId: string | null;
    isColorSelected?: boolean;
    isTemplate?: boolean;
};

const SelectionControls: FC<SelectionControlsProps> = ({
    title,
    items,
    setSelectedItem,
    activeItemId,
    isColorSelected = false,
    isTemplate,
}) => {
    const [countColorsSelected, setCountColorsSelected] = useState(0);
    const colors = useSelector((state: RootState) => state.cakeConstructor.colors);
    const dispatch = useDispatch();

    const selectedItem = items.find(item => item.id === activeItemId);

    // Инициализация количества цветов только при смене элемента
    useEffect(() => {
        if (!activeItemId || !isColorSelected) {
            setCountColorsSelected(0);
            return;
        }

        if (selectedItem) {
            if (selectedItem.showColorCountSelector) {
                // Устанавливаем дефолт только при первом выборе, не перезаписываем
                setCountColorsSelected((prev) => prev || 3);
            } else if (selectedItem.colorOptions) {
                setCountColorsSelected(selectedItem.colorOptions);
            } else {
                setCountColorsSelected(0);
            }
        }
    }, [activeItemId, isColorSelected, selectedItem]);

    const handleColorCountChange = (count: number) => {
        setCountColorsSelected(count);
    };

    return (
        <section className={styles.templateControls}>
            <h2 className={styles.templateControls_title}>
                {title}
                {isTemplate && !activeItemId && (
                    <span className={styles.templateControls_subtitle}>
                        (Выберите шаблон, чтобы появились декорации)
                    </span>
                )}
            </h2>

            <div className={styles.templateControls_templates}>
                {items.map(item => (
                    <Template
                        key={item.id}
                        activeItemId={activeItemId}
                        setSelectedItem={setSelectedItem}
                        item={item}
                    />
                ))}
            </div>

            {isColorSelected && activeItemId !== 'space' && activeItemId && selectedItem && (
                <div className={styles.colorPicker}>
                    <label>Выберите цвет(а):</label>

                    {selectedItem.showColorCountSelector && (
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
                                    checked={countColorsSelected === 3}
                                    onChange={() => handleColorCountChange(3)}
                                />
                                3 цвета
                            </label>
                        </div>
                    )}

                    <div className={styles.colorPicker_colorInputs}>
                        {Array.from({ length: countColorsSelected }).map((_, index) => (
                            <InputColor
                                key={index}
                                selectedColor={colors[index] || '#000000'}
                                setSelectedColor={(color: string) => dispatch(setColors({ color, index }))}
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default SelectionControls;
import React, { FC, useState } from 'react';
import styles from './InputColor.module.scss';

type InputColorProps = {
    title?: string;
    selectedColor:string;
    setSelectedColor: (color:string) => void;
};

const InputColor: FC<InputColorProps> = ({ title, selectedColor, setSelectedColor }) => {
    // const [color, setColor] = useState('#000000');

    // Функция для преобразования HEX в RGB
    const hexToRgb = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r}, ${g}, ${b}`;
    };

    return (
        <div className={styles.inputColor}>
            <label className={styles.inputColor_label} htmlFor="color">
                {title}
            </label>
            <input
                type="color"
                id="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className={styles.inputColor_input}
                style={
                    {
                        '--pulse-color': hexToRgb(selectedColor),
                        '--pulse-color-alpha': `rgba(${hexToRgb(selectedColor)}, 0.5)`,
                        '--pulse-color-alpha-0': `rgba(${hexToRgb(selectedColor)}, 0)`,
                    } as React.CSSProperties
                }
            />
            <span className={styles.inputColor_value}>{selectedColor}</span>
        </div>
    );
};

export default InputColor;
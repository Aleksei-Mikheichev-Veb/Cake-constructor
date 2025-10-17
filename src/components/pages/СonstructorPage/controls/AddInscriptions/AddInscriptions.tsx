
import React, {useState} from 'react';
import styles from './AddInscriptions.module.scss';
import InputColor from "../../../../UI/inputs/InputColor/InputColor";

import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../redux/store";
import {setCreamText, setCreamTextColor} from "../../../../../redux/cakeConstructorSlice";

const AddInscriptions = () => {
    // const [creamText, setCreamText] = useState('')
    // const [creamColor, setCreamColor] = useState('#000000')
    const dispatch = useDispatch()
    const creamText = useSelector((state: RootState) => state.cakeConstructor.creamText)
    const creamTextColor = useSelector((state: RootState) => state.cakeConstructor.creamTextColor)
    return (
        <div className={styles.addText}>
            <h2 className={styles.addText_title}>Добавить надписи кремом</h2>
            <div className={styles.form__group}>
                <input
                    type="text"
                    className={styles.form__field}
                    placeholder="Что будем писать?"
                    name="text"
                    id="text"
                    value={creamText}
                    onChange={(e) => dispatch(setCreamText(e.target.value))}
                />
                <label htmlFor="text" className={styles.form__label}>Что будем писать?</label>
            </div>
            {creamText && <InputColor title={'Выберите цвет крема'}
                                      selectedColor={creamTextColor || '#000000'}
                                      setSelectedColor={(color) => dispatch(setCreamTextColor(color))}
            />}

        </div>
    );
};

export default AddInscriptions;
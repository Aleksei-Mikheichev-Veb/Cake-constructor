
import React, {useState} from 'react';
import styles from './AddInscriptions.module.scss';
import InputColor from "../../../../UI/inputs/InputColor/InputColor";

const AddInscriptions = () => {
    const [creamColor, setCreamColor] = useState('#000000')
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
                />
                <label htmlFor="text" className={styles.form__label}>Что будем писать?</label>
            </div>
            <InputColor title={'Выберите цвет крема'}
                        selectedColor={creamColor}
                        setSelectedColor={setCreamColor}
            />
        </div>
    );
};

export default AddInscriptions;
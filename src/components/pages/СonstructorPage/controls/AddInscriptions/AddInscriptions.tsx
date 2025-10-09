
import React, {useState} from 'react';
import styles from './AddInscriptions.module.scss';
import InputColor from "../../../../UI/inputs/InputColor/InputColor";

const AddInscriptions = () => {
    const [creamText, setCreamText] = useState('')
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
                    value={creamText}
                    onChange={(e) => setCreamText(e.target.value)}
                />
                <label htmlFor="text" className={styles.form__label}>Что будем писать?</label>
            </div>
            {creamText && <InputColor title={'Выберите цвет крема'}
                                      selectedColor={creamColor}
                                      setSelectedColor={setCreamColor}
            />}

        </div>
    );
};

export default AddInscriptions;
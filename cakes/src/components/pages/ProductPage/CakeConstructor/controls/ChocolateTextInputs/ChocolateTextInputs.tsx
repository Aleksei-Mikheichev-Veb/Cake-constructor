import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './ChocolateTextInputs.module.scss';
import { setChocolateLetters, setChocolateNumbers } from '../../../../../../redux/cakeConstructorSlice';
import { RootState } from '../../../../../../redux/store';

// ID-суффиксы декораций, которые активируют поля для ввода
// (id в БД могут быть с префиксами add_/all_, поэтому проверяем по окончанию)
const LETTERS_SUFFIXES = ['choco_letters', 'choco_let'];
const NUMBERS_SUFFIXES = ['choco_numbers', 'choco_num'];

function hasDecoWithSuffix(decors: Record<string, any>, suffixes: string[]): boolean {
    return Object.values(decors).some(d => {
        if (!d?.id) return false;
        return suffixes.some(s => d.id.endsWith(s));
    });
}

const ChocolateTextInputs = () => {
    const dispatch = useDispatch();
    const chocolateText = useSelector((s: RootState) => s.cakeConstructor.chocolateText);
    const mainDecors = useSelector((s: RootState) => s.cakeConstructor.mainDecorations.entities);
    const additionalDecors = useSelector((s: RootState) => s.cakeConstructor.additionalDecorations.entities);

    const hasLetters = hasDecoWithSuffix(mainDecors, LETTERS_SUFFIXES)
        || hasDecoWithSuffix(additionalDecors, LETTERS_SUFFIXES);

    const hasNumbers = hasDecoWithSuffix(mainDecors, NUMBERS_SUFFIXES)
        || hasDecoWithSuffix(additionalDecors, NUMBERS_SUFFIXES);

    if (!hasLetters && !hasNumbers) return null;

    const letters = chocolateText?.letters || '';
    const numbers = chocolateText?.numbers || '';

    return (
        <div className={styles.chocolateInputs}>
            <h3 className={styles.title}>Шоколадный текст</h3>

            {hasLetters && (
                <div className={styles.field}>
                    <label>Надпись (буквы/слова)</label>
                    <input
                        type="text"
                        placeholder="Например: С Днём Рождения"
                        value={letters}
                        onChange={e => dispatch(setChocolateLetters(e.target.value))}
                        maxLength={25}
                    />
                    <div className={styles.hint}>{letters.length} / 25 символов</div>
                </div>
            )}

            {hasNumbers && (
                <div className={styles.field}>
                    <label>Цифры (возраст, дата и т.д.)</label>
                    <input
                        type="text"
                        placeholder="Например: 25"
                        value={numbers}
                        onChange={e => dispatch(setChocolateNumbers(e.target.value))}
                        maxLength={10}
                    />
                    <div className={styles.hint}>{numbers.length} / 10 цифр</div>
                </div>
            )}
        </div>
    );
};

export default ChocolateTextInputs;
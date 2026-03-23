import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './ChocolateTextInputs.module.scss';
import { setChocolateLetters, setChocolateNumbers } from '../../../../../../redux/cakeConstructorSlice';
import { RootState } from '../../../../../../redux/store';
import { log } from 'console';

const ChocolateTextInputs = () => {
  const dispatch = useDispatch();
  const chocolateText = useSelector((s: RootState) => s.cakeConstructor.chocolateText);
  const mainDecors = useSelector((s: RootState) => s.cakeConstructor.mainDecorations.entities);
  const additionalDecors = useSelector((s: RootState) => s.cakeConstructor.additionalDecorations.entities);

  const hasLetters = !!Object.values(mainDecors).find(d => d?.id === 'chocolate_letters') 
  || !!Object.values(additionalDecors).find(d => d?.id === 'chocolate_letters');
  const hasNumbers = !!Object.values(mainDecors).find(d => d?.id === 'chocolate_numbers') 
  || !!Object.values(additionalDecors).find(d => d?.id === 'chocolate_numbers');;
    
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
          <div className={styles.hint}>
            {letters.length} / 25 символов
          </div>
        </div>
      )}

      {hasNumbers && (
        <div className={styles.field}>
          <label>Цифры (возраст, дата и т.д.)</label>
          <input
            type="text"
            placeholder="Например: 25"
            value={numbers}
            onChange={e => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              dispatch(setChocolateNumbers(val));
            }}
            maxLength={10}
          />
          <div className={styles.hint}>
            {numbers.length} / 10 цифр
          </div>
        </div>
      )}
    </div>
  );
};

export default ChocolateTextInputs;
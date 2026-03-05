import React, {ChangeEvent} from 'react';
import styles from './CommentField.module.scss';

type OrderNoteProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    maxLength?: number;
};

export const CommentField = ({
                                 value,
                                 onChange,
                                 placeholder = 'Дополнительные пожелания по торту, доставке, аллергии и т.д.',
                                 label = 'Комментарий к заказу',
                                 maxLength = 500,
                             }: OrderNoteProps) => {
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    const currentLength = value.length;

    return (
        <div className={styles.wrapper}>
            <label className={styles.label}>{label}</label>

            <textarea
                className={styles.textarea}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                maxLength={maxLength}
                rows={4}
            />

            <div className={styles.footer}>
                <span className={styles.counter}>
                  {currentLength} / {maxLength}
                </span>
            </div>
        </div>
    );
};

export default CommentField;
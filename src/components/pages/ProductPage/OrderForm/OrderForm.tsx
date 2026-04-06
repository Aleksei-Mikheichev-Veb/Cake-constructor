import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { selectDessertPriceRange } from '../../../../redux/selectors/selectDessertPriceRange';
import styles from './OrderForm.module.scss';
import {ClientInfo, submitOrder} from "../../../../services/orderServiсe";

interface OrderFormProps {
    onClose: () => void;
}

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

const OrderForm: FC<OrderFormProps> = ({ onClose }) => {
    const [clientInfo, setClientInfo] = useState<ClientInfo>({
        clientName: '',
        clientPhone: '',
        clientContact: '',
        desiredDate: '',
    });

    const [status, setStatus] = useState<FormStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [vkRedirect, setVkRedirect] = useState<string | null>(null);

    const state = useSelector((s: RootState) => s);
    const { min: totalPrice } = useSelector(selectDessertPriceRange);

    const handleChange = (field: keyof ClientInfo, value: string) => {
        setClientInfo((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        // Валидация
        if (!clientInfo.clientName.trim()) {
            setErrorMessage('Введите ваше имя');
            return;
        }
        if (!clientInfo.clientPhone.trim()) {
            setErrorMessage('Введите номер телефона');
            return;
        }

        setStatus('sending');
        setErrorMessage('');

        try {
            const result = await submitOrder(state, clientInfo, totalPrice);

            if (result.success) {
                setStatus('success');
                setVkRedirect(result.vkRedirect);
            } else {
                setStatus('error');
                setErrorMessage(result.message || 'Не удалось отправить заказ');
            }
        } catch (err) {
            setStatus('error');
            setErrorMessage(
                err instanceof Error ? err.message : 'Ошибка соединения с сервером'
            );
        }
    };

    // Экран успешной отправки
    if (status === 'success') {
        return (
            <div className={styles.orderForm}>
                <div className={styles.successBlock}>
                    <div className={styles.successIcon}>✅</div>
                    <h2 className={styles.successTitle}>Заказ отправлен!</h2>
                    <p className={styles.successText}>
                        Кондитер получил ваш заказ и скоро свяжется с вами.
                    </p>

                    {vkRedirect && (
                        <a
                            href={vkRedirect}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.vkButton}
                        >
                            💬 Написать кондитеру в ВК
                        </a>
                    )}

                    <button className={styles.closeButton} onClick={onClose}>
                        Закрыть
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.orderForm}>
            <h2 className={styles.title}>Оформление заказа</h2>

            <div className={styles.priceInfo}>
                Итого: <strong>{totalPrice.toLocaleString('ru-RU')} ₽</strong>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>
                    Ваше имя <span className={styles.required}>*</span>
                </label>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Как к вам обращаться"
                    value={clientInfo.clientName}
                    onChange={(e) => handleChange('clientName', e.target.value)}
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>
                    Телефон <span className={styles.required}>*</span>
                </label>
                <input
                    type="tel"
                    className={styles.input}
                    placeholder="+7 (___) ___-__-__"
                    value={clientInfo.clientPhone}
                    onChange={(e) => handleChange('clientPhone', e.target.value)}
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Ссылка на ВК или Telegram</label>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="vk.com/id... или @username"
                    value={clientInfo.clientContact}
                    onChange={(e) => handleChange('clientContact', e.target.value)}
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Желаемая дата</label>
                <input
                    type="date"
                    className={styles.input}
                    value={clientInfo.desiredDate}
                    onChange={(e) => handleChange('desiredDate', e.target.value)}
                />
            </div>

            {errorMessage && (
                <div className={styles.error}>{errorMessage}</div>
            )}

            <div className={styles.actions}>
                <button
                    className={styles.cancelButton}
                    onClick={onClose}
                    disabled={status === 'sending'}
                >
                    Отмена
                </button>
                <button
                    className={styles.submitButton}
                    onClick={handleSubmit}
                    disabled={status === 'sending'}
                >
                    {status === 'sending' ? 'Отправка...' : 'Отправить заказ'}
                </button>
            </div>
        </div>
    );
};

export default OrderForm;
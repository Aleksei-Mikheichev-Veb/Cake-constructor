import React, { FC, useState, useRef } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { selectDessertPriceRange } from '../../../../redux/selectors/selectDessertPriceRange';
import { resetCakeConstructor } from '../../../../redux/cakeConstructorSlice';
import { submitOrder, ClientInfo } from '../../../../services/orderService';
import styles from './OrderForm.module.scss';
import { useNavigate } from 'react-router-dom';

interface OrderFormProps {
    onClose: () => void;
    onSuccess?: () => void;
}

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

// === Маска телефона ===
function formatPhone(value: string): string {
    // Оставляем только цифры
    const digits = value.replace(/\D/g, '');

    // Убираем лидирующую 8 или 7, нормализуем к 7
    let normalized = digits;
    if (normalized.startsWith('8') && normalized.length > 1) {
        normalized = '7' + normalized.slice(1);
    }
    if (!normalized.startsWith('7') && normalized.length > 0) {
        normalized = '7' + normalized;
    }

    // Форматируем
    let result = '+7';
    const rest = normalized.slice(1); // без первой 7

    if (rest.length > 0) result += ' (' + rest.slice(0, 3);
    if (rest.length >= 3) result += ') ';
    if (rest.length > 3) result += rest.slice(3, 6);
    if (rest.length >= 6) result += '-';
    if (rest.length > 6) result += rest.slice(6, 8);
    if (rest.length >= 8) result += '-';
    if (rest.length > 8) result += rest.slice(8, 10);

    return result;
}

function isPhoneComplete(value: string): boolean {
    const digits = value.replace(/\D/g, '');
    return digits.length === 11;
}

function getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

const OrderForm: FC<OrderFormProps> = ({ onClose, onSuccess }) => {
    const dispatch = useDispatch();

    const [clientInfo, setClientInfo] = useState<ClientInfo>({
        clientName: '',
        clientPhone: '+7',
        clientContact: '',
        desiredDate: '',
    });

    const [status, setStatus] = useState<FormStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [vkRedirect, setVkRedirect] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const state = useSelector((s: RootState) => s, shallowEqual);
    const { min, max, isRange } = useSelector(selectDessertPriceRange);

    const phoneRef = useRef<HTMLInputElement>(null);

    const handleNameChange = (value: string) => {
        setClientInfo((prev) => ({ ...prev, clientName: value }));
        if (value.trim()) {
            setFieldErrors((prev) => ({ ...prev, clientName: '' }));
        }
    };

    const handlePhoneChange = (value: string) => {
        const formatted = formatPhone(value);
        setClientInfo((prev) => ({ ...prev, clientPhone: formatted }));
        if (isPhoneComplete(formatted)) {
            setFieldErrors((prev) => ({ ...prev, clientPhone: '' }));
        }
    };

    const handleChange = (field: keyof ClientInfo, value: string) => {
        setClientInfo((prev) => ({ ...prev, [field]: value }));
    };

    const validate = (): boolean => {
        const errors: Record<string, string> = {};

        if (!clientInfo.clientName.trim()) {
            errors.clientName = 'Введите ваше имя';
        }
        if (!isPhoneComplete(clientInfo.clientPhone)) {
            errors.clientPhone = 'Введите полный номер телефона';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // const handleSubmit = async () => {
    //     if (!validate()) return;

    //     setStatus('sending');
    //     setErrorMessage('');

    //     try {
    //         const priceToSend = isRange ? max : min;
    //         const result = await submitOrder(state, clientInfo, priceToSend);

    //         if (result.success) {
    //             setStatus('success');
    //             setVkRedirect(result.vkRedirect);
    //         } else {
    //             setStatus('error');
    //             setErrorMessage(result.message || 'Не удалось отправить заказ');
    //         }
    //     } catch (err) {
    //         setStatus('error');
    //         setErrorMessage(
    //             err instanceof Error ? err.message : 'Ошибка соединения с сервером'
    //         );
    //     }
    // };
    const handleSubmit = async () => {
        if (!validate()) return;
        setStatus('sending');
        setErrorMessage('');

        try {
            const priceToSend = isRange ? max : min;
            const result = await submitOrder(state, clientInfo, priceToSend);

            if (result.success) {
                setStatus('success');
                setVkRedirect(result.vkRedirect);
                onSuccess?.();  // ← говорим родителю что успех
            } else {
                setStatus('error');
                setErrorMessage(result.message || 'Не удалось отправить заказ');
            }
        } catch (err) {
            setStatus('error');
            setErrorMessage(err instanceof Error ? err.message : 'Ошибка соединения с сервером');
        }
    };
    // const navigate = useNavigate();
    // const handleClose = () => {
    //     if (status === 'success') {
    //         dispatch(resetCakeConstructor());
    //     }
    //     navigate('/constructor')
    //     onClose();
    // };

    // === Экран успешной отправки ===
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
                Итого:{' '}
                <strong>
                    {isRange
                        ? `от ${min.toLocaleString('ru-RU')} до ${max.toLocaleString('ru-RU')} ₽`
                        : `${min.toLocaleString('ru-RU')} ₽`}
                </strong>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>
                    Ваше имя <span className={styles.required}>*</span>
                </label>
                <input
                    type="text"
                    className={`${styles.input} ${fieldErrors.clientName ? styles.inputError : ''}`}
                    placeholder="Как к вам обращаться"
                    value={clientInfo.clientName}
                    onChange={(e) => handleNameChange(e.target.value)}
                />
                {fieldErrors.clientName && (
                    <span className={styles.fieldError}>{fieldErrors.clientName}</span>
                )}
            </div>

            <div className={styles.field}>
                <label className={styles.label}>
                    Телефон <span className={styles.required}>*</span>
                </label>
                <input
                    ref={phoneRef}
                    type="tel"
                    className={`${styles.input} ${fieldErrors.clientPhone ? styles.inputError : ''}`}
                    placeholder="+7 (___) ___-__-__"
                    value={clientInfo.clientPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                />
                {fieldErrors.clientPhone && (
                    <span className={styles.fieldError}>{fieldErrors.clientPhone}</span>
                )}
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
                    min={getTodayDate()}
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
                    {status === 'sending' ? (
                        <span className={styles.spinner}>
                            <span className={styles.spinnerDot}></span>
                            Отправка...
                        </span>
                    ) : (
                        'Отправить заказ'
                    )}
                </button>
            </div>
        </div>
    );
};

export default OrderForm;
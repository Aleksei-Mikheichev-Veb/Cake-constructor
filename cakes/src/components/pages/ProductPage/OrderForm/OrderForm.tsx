import React, { FC, useState, useRef } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { resetCakeConstructor } from '../../../../redux/cakeConstructorSlice';
import { submitOrder, ClientInfo } from '../../../../services/orderService';
import styles from './OrderForm.module.scss';
import { useNavigate } from 'react-router-dom';

interface OrderPrice {
    min: number;
    max: number;
    isRange: boolean;
    chocolateLettersPrice: number;
    chocolateNumbersPrice: number;
}

interface OrderFormProps {
    onClose: () => void;
    onSuccess?: () => void;
    // Считается один раз в TotalPrice (usePriceCalculation, живой конфиг с сервера)
    // и передаётся сюда, чтобы цена в липучке и в модалке заказа никогда не расходилась
    price: OrderPrice;
}

type FormStatus = 'idle' | 'sending' | 'success' | 'error';
type FeedbackStatus = 'idle' | 'sending' | 'done' | 'skipped';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// === Маска телефона ===
function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, '');
    let normalized = digits;
    if (normalized.startsWith('8') && normalized.length > 1) normalized = '7' + normalized.slice(1);
    if (!normalized.startsWith('7') && normalized.length > 0) normalized = '7' + normalized;
    let result = '+7';
    const rest = normalized.slice(1);
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
    return value.replace(/\D/g, '').length === 11;
}

function getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
}

// === Компонент звёздочек ===
const StarRating: FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => {
    const [hovered, setHovered] = useState(0);
    return (
        <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    className={`${styles.star} ${star <= (hovered || value) ? styles.starActive : ''}`}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => onChange(star)}
                    aria-label={`${star} звезд`}
                >
                    ★
                </button>
            ))}
        </div>
    );
};

const OrderForm: FC<OrderFormProps> = ({ onClose, onSuccess, price }) => {
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
    const [orderId, setOrderId] = useState<string | null>(null);

    // Состояние отзыва
    const [feedbackRating, setFeedbackRating] = useState(0);
    const [wouldOrderAgain, setWouldOrderAgain] = useState<boolean | null>(null);
    const [feedbackComment, setFeedbackComment] = useState('');
    const [feedbackStatus, setFeedbackStatus] = useState<FeedbackStatus>('idle');

    const state = useSelector((s: RootState) => s, shallowEqual);
    const { min, max, isRange } = price;
    const phoneRef = useRef<HTMLInputElement>(null);

    const handleNameChange = (value: string) => {
        setClientInfo((prev) => ({ ...prev, clientName: value }));
        if (value.trim()) setFieldErrors((prev) => ({ ...prev, clientName: '' }));
    };

    const handlePhoneChange = (value: string) => {
        const formatted = formatPhone(value);
        setClientInfo((prev) => ({ ...prev, clientPhone: formatted }));
        if (isPhoneComplete(formatted)) setFieldErrors((prev) => ({ ...prev, clientPhone: '' }));
    };

    const handleChange = (field: keyof ClientInfo, value: string) => {
        setClientInfo((prev) => ({ ...prev, [field]: value }));
    };

    const validate = (): boolean => {
        const errors: Record<string, string> = {};
        if (!clientInfo.clientName.trim()) errors.clientName = 'Введите ваше имя';
        if (!isPhoneComplete(clientInfo.clientPhone)) errors.clientPhone = 'Введите полный номер телефона';
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setStatus('sending');
        setErrorMessage('');

        try {
            const result = await submitOrder(state, clientInfo, price);

            if (result.success) {
                setStatus('success');
                setVkRedirect(result.vkRedirect ?? null);
                setOrderId(result.orderId ?? null);
                onSuccess?.();
            } else {
                setStatus('error');
                setErrorMessage(result.message || 'Не удалось отправить заказ');
            }
        } catch (err) {
            setStatus('error');
            setErrorMessage(err instanceof Error ? err.message : 'Ошибка соединения с сервером');
        }
    };

    const handleFeedbackSubmit = async () => {
        if (!feedbackRating || wouldOrderAgain === null) return; // без обоих ответов не отправляем
        setFeedbackStatus('sending');
        try {
            await fetch(`${API_URL}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId,
                    rating: feedbackRating,
                    comment: feedbackComment.trim() || null,
                    wouldOrderAgain,
                }),
            });
        } catch {
            // тихо игнорируем — отзыв не критичен
        }
        setFeedbackStatus('done');
    };

    const handleFeedbackSkip = () => {
        setFeedbackStatus('skipped');
    };

    // === Экран успешной отправки ===
    if (status === 'success') {
        const feedbackDone = feedbackStatus === 'done' || feedbackStatus === 'skipped';

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

                    {/* Блок отзыва */}
                    {!feedbackDone ? (
                        <div className={styles.feedbackBlock}>
                            <p className={styles.feedbackQuestion}>
                                Насколько удобно было оформить заказ?
                            </p>
                            <StarRating value={feedbackRating} onChange={setFeedbackRating} />

                            <p className={styles.feedbackQuestion}>
                                Хотели бы заказать так снова — через конструктор?
                            </p>
                            <div className={styles.yesNoRow}>
                                <button
                                    type="button"
                                    className={`${styles.yesNoButton} ${wouldOrderAgain === true ? styles.yesNoButtonActive : ''}`}
                                    onClick={() => setWouldOrderAgain(true)}
                                >
                                    Да 👍
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.yesNoButton} ${wouldOrderAgain === false ? styles.yesNoButtonActive : ''}`}
                                    onClick={() => setWouldOrderAgain(false)}
                                >
                                    Нет 👎
                                </button>
                            </div>

                            <textarea
                                className={styles.feedbackTextarea}
                                placeholder="Комментарий (необязательно)"
                                value={feedbackComment}
                                onChange={(e) => setFeedbackComment(e.target.value)}
                                rows={2}
                            />
                            <div className={styles.feedbackActions}>
                                <button
                                    className={styles.feedbackSkip}
                                    onClick={handleFeedbackSkip}
                                    disabled={feedbackStatus === 'sending'}
                                >
                                    Пропустить
                                </button>
                                <button
                                    className={styles.feedbackSubmit}
                                    onClick={handleFeedbackSubmit}
                                    disabled={!feedbackRating || wouldOrderAgain === null || feedbackStatus === 'sending'}
                                >
                                    {feedbackStatus === 'sending' ? 'Отправка...' : 'Отправить отзыв'}
                                </button>
                            </div>
                        </div>
                    ) : feedbackStatus === 'done' ? (
                        <p className={styles.feedbackThanks}>Спасибо за отзыв! 🙏</p>
                    ) : null}

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

            {errorMessage && <div className={styles.error}>{errorMessage}</div>}

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
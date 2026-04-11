import React from 'react';
import styles from './Footer.module.scss';

const Footer = () => {
    return (
        <footer className={styles.footer} id="contact">
            <div className={styles.footer_inner}>
                {/* Верхняя часть */}
                <div className={styles.footer_top}>
                    <div className={styles.footer_brand}>
                        <span className={styles.footer_logo}>Eugenie Cake</span>
                        <p className={styles.footer_tagline}>
                            Торты, капкейки и трайфлы на заказ в Костроме
                        </p>
                    </div>

                    <div className={styles.footer_columns}>
                        <div className={styles.footer_section}>
                            <h3 className={styles.footer_heading}>Контакты</h3>
                            <ul className={styles.footer_contactList}>
                                <li>
                                    <a href="tel:+79991231234" className={styles.footer_contactLink}>
                                        +7 (999) 123-12-34
                                    </a>
                                </li>
                                <li>
                                    <a href="mailto:egeni@mail.ru" className={styles.footer_contactLink}>
                                        egeni@mail.ru
                                    </a>
                                </li>
                                <li>
                                    <span className={styles.footer_address}>
                                        г. Кострома, ул. Кондитерская, д. 15
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className={styles.footer_section}>
                            <h3 className={styles.footer_heading}>Социальные сети</h3>
                            <div className={styles.footer_socials}>
                                <a
                                    href="https://vk.com/eugeniecake"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.footer_socialLink}
                                    aria-label="ВКонтакте"
                                >
                                    VK
                                </a>
                                <a
                                    href="#"
                                    className={styles.footer_socialLink}
                                    aria-label="Telegram"
                                >
                                    TG
                                </a>
                                <a
                                    href="#"
                                    className={styles.footer_socialLink}
                                    aria-label="Одноклассники"
                                >
                                    OK
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Разделитель */}
                <div className={styles.footer_divider} />

                {/* Нижняя часть */}
                <div className={styles.footer_bottom}>
                    <span className={styles.footer_copy}>
                        © {new Date().getFullYear()} Eugenie Cake. Все права защищены.
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
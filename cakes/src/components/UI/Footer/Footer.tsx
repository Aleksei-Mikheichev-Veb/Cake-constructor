import React from 'react';
import styles from './Footer.module.scss';
import { useGetSettingsQuery } from '../../../api/constructorApi';

const Footer = () => {
    const { data: settings } = useGetSettingsQuery();

    if (!settings) return null;

    // Очистка телефона от всего кроме цифр для href
    const phoneHref = `tel:+${settings.phone.replace(/\D/g, '')}`;

    return (
        <footer className={styles.footer} id="contact">
            <div className={styles.footer_inner}>
                <div className={styles.footer_top}>
                    <div className={styles.footer_brand}>
                        <span className={styles.footer_logo}>{settings.siteName}</span>
                        <p className={styles.footer_tagline}>{settings.footerTagline}</p>
                    </div>

                    <div className={styles.footer_columns}>
                        <div className={styles.footer_section}>
                            <h3 className={styles.footer_heading}>Контакты</h3>
                            <ul className={styles.footer_contactList}>
                                <li>
                                    <a href={phoneHref} className={styles.footer_contactLink}>
                                        {settings.phone}
                                    </a>
                                </li>
                                <li>
                                    <a href={`mailto:${settings.email}`} className={styles.footer_contactLink}>
                                        {settings.email}
                                    </a>
                                </li>
                                <li>
                                    <span className={styles.footer_address}>{settings.address}</span>
                                </li>
                            </ul>
                        </div>

                        <div className={styles.footer_section}>
                            <h3 className={styles.footer_heading}>Социальные сети</h3>
                            <div className={styles.footer_socials}>
                                {settings.vkUrl && (
                                    <a href={settings.vkUrl} target="_blank" rel="noopener noreferrer" className={styles.footer_socialLink} aria-label="ВКонтакте">
                                        VK
                                    </a>
                                )}
                                {settings.tgUrl && (
                                    <a href={settings.tgUrl} target="_blank" rel="noopener noreferrer" className={styles.footer_socialLink} aria-label="Telegram">
                                        TG
                                    </a>
                                )}
                                {settings.okUrl && (
                                    <a href={settings.okUrl} target="_blank" rel="noopener noreferrer" className={styles.footer_socialLink} aria-label="Одноклассники">
                                        OK
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.footer_divider} />

                <div className={styles.footer_bottom}>
                    <span className={styles.footer_copy}>
                        © {new Date().getFullYear()} {settings.siteName}. Все права защищены.
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
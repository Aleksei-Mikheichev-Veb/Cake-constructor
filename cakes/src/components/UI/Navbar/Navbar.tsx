import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.scss';
import { useGetSettingsQuery } from '../../../api/constructorApi';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: settings } = useGetSettingsQuery();
    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbar_inner}>
                <NavLink to="/home" className={styles.navbar_logo} onClick={closeMenu}>
                    {settings?.siteName || 'Cake Constructor'}
                </NavLink>

                <button
                    className={`${styles.burger} ${isMenuOpen ? styles.burger_active : ''}`}
                    onClick={toggleMenu}
                    aria-label="Открыть меню"
                    aria-expanded={isMenuOpen}
                >
                    <span />
                    <span />
                    <span />
                </button>

                <ul className={`${styles.navbar_list} ${isMenuOpen ? styles.navbar_list_open : ''}`}>
                    <li>
                        <NavLink
                            to="/home"
                            className={({ isActive }) =>
                                `${styles.navbar_link} ${isActive ? styles.navbar_link_active : ''}`
                            }
                            onClick={closeMenu}
                        >
                            Главная
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/constructor"
                            className={({ isActive }) =>
                                `${styles.navbar_link} ${isActive ? styles.navbar_link_active : ''}`
                            }
                            onClick={closeMenu}
                        >
                            Конструктор
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/gallery"
                            className={({ isActive }) =>
                                `${styles.navbar_link} ${isActive ? styles.navbar_link_active : ''}`
                            }
                            onClick={closeMenu}
                        >
                            Галерея
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/masterclass"
                            className={({ isActive }) =>
                                `${styles.navbar_link} ${isActive ? styles.navbar_link_active : ''}`
                            }
                            onClick={closeMenu}
                        >
                            Мастер-классы
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/fillings"
                            className={({ isActive }) =>
                                `${styles.navbar_link} ${isActive ? styles.navbar_link_active : ''}`
                            }
                            onClick={closeMenu}
                        >
                            Начинки
                        </NavLink>
                    </li>
                </ul>

                {/* Оверлей для мобильного меню */}
                {isMenuOpen && (
                    <div className={styles.overlay} onClick={closeMenu} />
                )}
            </div>
        </nav>
    );
};

export default Navbar;
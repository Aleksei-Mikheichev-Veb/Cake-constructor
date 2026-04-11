import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.scss';
import Chef from '../../../assets/images/chef.jpg';
import img from '../../../assets/images/table2.webp';

const Home = () => {
    return (
        <div className={styles.home}>
            {/* ═══════ HERO ═══════ */}
            <section className={styles.hero} style={{ backgroundImage: `url(${img})` }}>
                <div className={styles.hero_overlay} />
                <div className={styles.hero_content}>
                    <h1 className={styles.hero_title}>Эжени</h1>
                    <p className={styles.hero_subtitle}>домашняя кондитерская</p>
                    <p className={styles.hero_tagline}>сделано с любовью</p>
                    <Link to="/constructor" className={styles.hero_btn}>
                        Собрать торт
                    </Link>
                </div>
            </section>

            {/* ═══════ ДЕСЕРТЫ ═══════ */}
            <section className={styles.desserts}>
                <div className={styles.section_inner}>
                    <h2 className={styles.section_title}>Мои десерты</h2>
                    <p className={styles.section_subtitle}>
                        Выберите категорию и соберите свой идеальный десерт в конструкторе
                    </p>

                    <div className={styles.desserts_grid}>
                        {[
                            { title: 'Торты', desc: 'Бисквитные, муссовые, бенто, ярусные и 3D', to: '/constructor' },
                            { title: 'Капкейки', desc: 'Мини-десерты с кремовой шапкой и декором', to: '/constructor' },
                            { title: 'Трайфлы', desc: 'Слоёные десерты в стаканчиках', to: '/constructor' },
                        ].map((item) => (
                            <Link to={item.to} key={item.title} className={styles.desserts_card}>
                                <h3 className={styles.desserts_cardTitle}>{item.title}</h3>
                                <p className={styles.desserts_cardDesc}>{item.desc}</p>
                                <span className={styles.desserts_cardArrow}>→</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════ КАК ЗАКАЗАТЬ ═══════ */}
            <section className={styles.howto}>
                <div className={styles.section_inner}>
                    <h2 className={styles.section_title}>Как заказать</h2>

                    <div className={styles.howto_steps}>
                        {[
                            { num: '01', title: 'Выберите десерт', desc: 'Торт, капкейки или трайфлы — откройте конструктор нужной категории' },
                            { num: '02', title: 'Настройте', desc: 'Выберите начинку, вес, декор, цвет и загрузите референс' },
                            { num: '03', title: 'Оформите заказ', desc: 'Укажите контакты и желаемую дату — кондитер свяжется с вами' },
                        ].map((step) => (
                            <div key={step.num} className={styles.howto_step}>
                                <span className={styles.howto_num}>{step.num}</span>
                                <h3 className={styles.howto_stepTitle}>{step.title}</h3>
                                <p className={styles.howto_stepDesc}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════ ОБО МНЕ ═══════ */}
            <section className={styles.about}>
                <div className={styles.section_inner}>
                    <div className={styles.about_layout}>
                        <div className={styles.about_text}>
                            <h2 className={styles.section_title}>Обо мне</h2>
                            <p>
                                Меня зовут Евгения, я профессиональный кондитер с опытом более 7 лет.
                                Каждый мой десерт — это история, рассказанная на языке вкуса и красоты.
                            </p>
                            <p>
                                Я использую только натуральные ингредиенты высочайшего качества и уделяю
                                особое внимание деталям, чтобы каждый торт стал настоящим украшением
                                вашего праздника.
                            </p>
                            <p>
                                Моя философия проста — создавать не просто десерты, а впечатления,
                                которые останутся с вами на долгие годы.
                            </p>
                        </div>
                        <div className={styles.about_imageBox}>
                            <img src={Chef} alt="Кондитер Евгения" className={styles.about_image} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════ CTA ═══════ */}
            <section className={styles.cta}>
                <div className={styles.section_inner}>
                    <h2 className={styles.cta_title}>Создайте свой идеальный торт</h2>
                    <p className={styles.cta_desc}>
                        Воспользуйтесь конструктором, чтобы собрать торт мечты.
                        Выберите начинку, размер, декор и получите расчёт стоимости.
                    </p>
                    <Link to="/constructor" className={styles.cta_btn}>
                        Открыть конструктор
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
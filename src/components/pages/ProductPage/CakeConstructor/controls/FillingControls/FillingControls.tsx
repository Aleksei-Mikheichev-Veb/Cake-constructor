import React, { FC, useRef, useState } from 'react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import styles from './FillingControls.module.scss'
import 'swiper/css/navigation';
import FillingSlide from "./FillingSlide/FillingSlide";
import { useDispatch } from 'react-redux';
import ArrowIcon from "../../../../../UI/icons/ArrowIcon";
import { FillingType } from '../../../../../../types/FillingType';

type FillingControlsProps = {
    title: string;
    fillings: FillingType[];
    activeFillingId: string | null;
    setActiveFilling: (filling: FillingType) => void;
}

const FillingControls: FC<FillingControlsProps> = ({ title, fillings, activeFillingId, setActiveFilling }) => {

    const dispatch = useDispatch();

    const prevRef = useRef<HTMLButtonElement | null>(null)
    const nextRef = useRef<HTMLButtonElement | null>(null)

    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);


    return (
        <section className={styles.filling}>
            <h2 className={styles.filling_title}>{title}</h2>
            <div className={styles.swiper_box}>
                <button ref={prevRef} className={`${styles.swiper_button} ${styles.prev}`}>
                    <ArrowIcon direction={'left'} />
                </button>
                <button ref={nextRef} className={`${styles.swiper_button} ${styles.next}`}>
                    <ArrowIcon direction={'right'} />
                </button>

                <Swiper
                    modules={[Navigation]}
                    spaceBetween={16}
                    slidesPerView={6}
                    breakpoints={{
                        0: {
                            slidesPerView: 2,
                            spaceBetween: 10,
                        },
                        400: {
                            slidesPerView: 2.5,
                            spaceBetween: 12,
                        },
                        520: {
                            slidesPerView: 3,
                            spaceBetween: 14,
                        },
                        700: {
                            slidesPerView: 4,
                            spaceBetween: 14,
                        },
                        1020: {
                            slidesPerView: 5,
                            spaceBetween: 16,
                        },
                        1200: {
                            slidesPerView: 6,
                            spaceBetween: 16,
                        },
                    }}
                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                    }}
                    onBeforeInit={(swiper: any) => {
                        if (swiper.params.navigation) {
                            (swiper.params.navigation as any).prevEl = prevRef.current;
                            (swiper.params.navigation as any).nextEl = nextRef.current;
                        }
                    }}
                    onSlideChange={(swiper: any) => {
                        setIsBeginning(swiper.isBeginning);
                        setIsEnd(swiper.isEnd);
                    }}
                    onAfterInit={(swiper: any) => {
                        setIsBeginning(swiper.isBeginning);
                        setIsEnd(swiper.isEnd);
                    }}
                    pagination={{ clickable: true }}
                    className={styles.swiper}
                >
                    {fillings.map(filling => (
                        <SwiperSlide key={filling.id} className={styles.swiper_slide}>
                            <FillingSlide
                                filling={filling}
                                activeFillingId={activeFillingId}
                                handleFillingClick={setActiveFilling} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

        </section>
    );
};

export default FillingControls;
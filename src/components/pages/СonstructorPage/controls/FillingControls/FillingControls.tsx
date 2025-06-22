import React, {FC, useRef, useState} from 'react';
import {Navigation, Pagination, Scrollbar, A11y} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import styles from './FillingControls.module.scss'
import 'swiper/css/navigation';
import {fillings, FillingType} from "../../../../../data/fillings";
import ArrowIcon from "../../../../UI/icons/ArrowIcon";
import Tooltip from "../../../../UI/Tooltip";
import Modal from "../../../../UI/Modal/Modal";
import FillingSlide from "./FillingSlide/FillingSlide";

type FillingControlsProps = {
    title: string;
    activeFillingId: string | null;
    setSelectedFilling: (filling: FillingType) => void;
}

const FillingControls: FC<FillingControlsProps> = ({title, activeFillingId, setSelectedFilling}) => {

    const prevRef = useRef<HTMLButtonElement | null>(null)
    const nextRef = useRef<HTMLButtonElement | null>(null)

    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);


    const handleFillingClick = (filling: FillingType) => {
        setSelectedFilling(filling)
    }

    return (
        <div className={styles.filling}>
            <h2 className={styles.filling_title}>{title}</h2>
            <div className={styles.swiper_box}>
                <button ref={prevRef} className={`${styles.swiper_button} ${styles.prev}`}>
                    <ArrowIcon direction={'left'}/>
                </button>
                <button ref={nextRef} className={`${styles.swiper_button} ${styles.next}`}>
                    <ArrowIcon direction={'right'}/>
                </button>

                <Swiper
                    modules={[Navigation]} // Подключаем модули
                    spaceBetween={10} // Отступ между слайдами
                    slidesPerView={3.2} // Количество видимых слайдов
                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                    }}
                    onBeforeInit={(swiper: any) => {
                        // Подключаем кнопки к swiper при инициализации
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
                        // Установим начальные состояния
                        setIsBeginning(swiper.isBeginning);
                        setIsEnd(swiper.isEnd);
                    }}
                    pagination={{clickable: true}} // Включаем точки пагинации
                    className={styles.swiper}
                >
                    {fillings.map(filling => (
                        <SwiperSlide key={filling.id} className={styles.swiper_slide}>
                            <FillingSlide
                                filling={filling}
                                activeFillingId={activeFillingId}
                                handleFillingClick={handleFillingClick}/>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

        </div>
    );
};

export default FillingControls;
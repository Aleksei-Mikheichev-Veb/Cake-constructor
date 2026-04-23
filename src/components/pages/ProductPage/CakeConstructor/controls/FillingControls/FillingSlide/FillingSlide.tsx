import React, { FC, useState } from 'react';
import styles from "./FillingSlide.module.scss";
import Modal from "../../../../../../UI/Modal/Modal";
import { FillingType } from '../../../../../../../types/FillingType';

type FillingSlideProps = {
    handleFillingClick: (filling: FillingType) => void;
    filling: FillingType;
    activeFillingId: string | null;
}

const FillingSlide: FC<FillingSlideProps> = ({ filling, activeFillingId, handleFillingClick }) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const handleModalClose = () => {
        setModalOpen(false)
    }

    const isActive = activeFillingId === filling.id;

    return (
        <div
            className={`${styles.slide} ${isActive ? styles.slide_active : ''}`}
            role="button"
            aria-label={`Выбрать начинку ${filling.name}`}>

            <div className={styles.imageContainer} onClick={() => handleFillingClick(filling)}>
                <img className={styles.image} src={filling.image} alt={filling.name} />
                <div className={styles.overlay}>
                    <div className={styles.checkmark}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                        </svg>
                    </div>
                </div>
                {isActive && <div className={styles.activeBadge}>Выбрано</div>}
            </div>

            <div className={styles.content}>
                <h3 className={styles.name} onClick={() => handleFillingClick(filling)}>
                    {filling.name}
                </h3>

                <button
                    onClick={(e) => setModalOpen(true)}
                    className={styles.detailsButton}
                    aria-label={`Подробнее о начинке ${filling.name}`}>
                    <span>Подробнее</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor" />
                    </svg>
                </button>
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={handleModalClose}
                data={filling} />
        </div>
    );
};

export default FillingSlide;
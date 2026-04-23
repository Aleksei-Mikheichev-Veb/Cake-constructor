import React, { FC } from 'react';
import styles from './Modal.module.scss';
import ReactDOM from "react-dom";
import { FillingType } from '../../../types/FillingType';

type ModalProps = {
    data: FillingType | null;
    isOpen: boolean;
    onClose: () => void;
}

const Modal: FC<ModalProps> = ({ data, onClose, isOpen }) => {
    if (!isOpen || !data) return null
    return ReactDOM.createPortal(
        <div className={styles.modal} onClick={() => onClose()}>
            <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modal_imageBox}>
                    <img src={data.image} alt={data.name} className={styles.modal_image} />
                </div>
                <div className={styles.modal_body}>
                    <h3 className={styles.modal_title}>{data.name}</h3>
                    {data.description.map((elem, index) => (
                        <p className={styles.modal_text} key={index}>{elem}</p>
                    ))}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
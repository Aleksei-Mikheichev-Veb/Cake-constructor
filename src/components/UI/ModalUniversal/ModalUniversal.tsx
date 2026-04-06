import React, { FC, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import styles from './ModalUniversal.module.scss';

type ModalUniversalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
};

const ModalUniversal: FC<ModalUniversalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>
                    ✕
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
};

export default ModalUniversal;
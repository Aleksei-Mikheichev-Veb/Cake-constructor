import React from 'react';
import styles from './ArrowIcon.module.scss'

interface ArrowIconProps {
    direction: "left" | "right";
};

const ArrowIcon = ({ direction }: ArrowIconProps) => {
    return (
        <svg className={styles.svg} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
            {direction === "left" ? (
                <path d="M8.5 0.5L9.5 1.5L4 7L9.5 12.5L8.5 13.5L2 7L8.5 0.5Z" fill="#42567A" />
            ) : (
                <path d="M5.5 0.5L4.5 1.5L10 7L4.5 12.5L5.5 13.5L12 7L5.5 0.5Z" fill="#42567A" />
            )}
        </svg>
    );
};
export default ArrowIcon;
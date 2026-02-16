// import React, {FC, ReactNode, useState} from 'react';
// import styled from "styled-components";
//
// type ButtonDescription = {
//     weight: string;
//     height: number;
//     diameter: number;
// }
//
// type TooltipProps = {
//     content: ButtonDescription | string;
//     children: ReactNode;
// }
//
// const TooltipWrapper = styled.div`
//   position: relative;
// `
//
// const TooltipContent = styled.div<{ isVisible: boolean }>`
//   position: absolute;
//   top: calc(100% + 8px);
//   left: 50%;
//   transform: translate(-50%, 0);
//
//   /* Адаптивная ширина - используем min-width для расширения */
//   //min-width: fit-content;
//   width: max-content;
//   max-width: 300px;
//   word-wrap: break-word;
//   overflow-wrap: break-word;
//   hyphens: auto;
//
//   opacity: ${({isVisible}) => isVisible ? '1' : '0'};
//   display: ${({isVisible}) => isVisible ? 'block' : 'none'};
//   transition: opacity .4s;
//   background: #333439;
//   color: #fff;
//   border-radius: 5px;
//   padding: 8px 12px;
//   z-index: 100;
//
//   .text {
//
//   }
//
//   .description {
//     color: white;
//     font-size: 14px;
//
//     &_title {
//       font-weight: 700;
//     }
//
//     &_row {
//       display: flex;
//       justify-content: space-between;
//       gap: 10px;
//       color: #98989b;
//     }
//   }
// `
//
// const Tooltip: FC<TooltipProps> = ({children, content}) => {
//     const [isVisible, setIsVisible] = useState(false)
//
//     const handleMouseEnter = () => {
//         setIsVisible(true)
//     }
//     const handleMouseLeave = () => {
//         setIsVisible(false)
//     }
//
//     return (
//         <TooltipWrapper onMouseEnter={ () => handleMouseEnter()} onMouseLeave={() => handleMouseLeave()}>
//             {children}
//             <TooltipContent isVisible={isVisible}>
//                 {typeof content === 'string' ? (
//                     <div className='text'>{content}</div>
//                 ) : (
//                     <div className='description'>
//                         <h4 className='description_title'>Вес: {content.weight} кг</h4>
//                         <div className='description_row'>
//                             <div>Высота</div>
//                             <div>{content.height} см</div>
//                         </div>
//                         <div className='description_row'>
//                             <div>Диаметр</div>
//                             <div>{content.diameter} см</div>
//                         </div>
//                     </div>
//                 )}
//             </TooltipContent>
//         </TooltipWrapper>
//     );
// };
//
// export default Tooltip;
//
// Tooltip.tsx
import React, { FC, ReactNode, useState } from 'react';
import styles from './Tooltip.module.scss';

type TooltipContent = string | {
    weight: string;
    height: number;
    diameter: number;
};

type TooltipProps = {
    content: TooltipContent;
    children: ReactNode;
};

const Tooltip: FC<TooltipProps> = ({ children, content }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className={styles.tooltipWrapper}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}

            <div className={`${styles.tooltipContent} ${isVisible ? styles.visible : ''}`}>
                {typeof content === 'string' ? (
                    <div className={styles.text}>{content}</div>
                ) : (
                    <div className={styles.description}>
                        <h4 className={styles.descriptionTitle}>Вес: {content.weight} кг</h4>
                        <div className={styles.row}>
                            <span>Высота</span>
                            <span>{content.height} см</span>
                        </div>
                        <div className={styles.row}>
                            <span>Диаметр</span>
                            <span>{content.diameter} см</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Tooltip;
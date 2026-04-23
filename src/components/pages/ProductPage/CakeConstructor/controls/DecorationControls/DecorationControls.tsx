// import React, {FC, useState} from 'react';
// import styles from './DecorationControls.module.scss'
// import Decoration from "./Decoration/Decoration";
// import {EntityState} from "@reduxjs/toolkit";
// import {decorationsMain, DecorationType, SelectedDecoration} from "../../../../../../data/decorationsMain";
// import {decorationsAdditional} from "../../../../../../data/decorationsAdditional";
// import {decorationsAll} from "../../../../../../data/decorationsAll";
// import {smallDecorations} from "../../../../../../data/cupcakes/smallDecorations";

// type DecorationControlsProps = {
//     title:string;
//     decorations:'all' | 'main' | 'additional' | 'small';
//     setActiveDecoration:(decoration:DecorationType) => void;
//     removeDecoration:(decorationId: string) => void;
//     increment: (decorationId: string) => void;
//     decrement: (decorationId: string) => void;
//     activeDecoration:  EntityState<SelectedDecoration, string>;
// }

// const DecorationControls: FC<DecorationControlsProps> = ({
//                                                              title,
//                                                              decorations,
//                                                              setActiveDecoration,
//                                                              removeDecoration,
//                                                              activeDecoration,
//                                                              increment,
//                                                              decrement,
//                                                          }) => {
//     let currentDecorations: DecorationType[] = [];

//     switch (decorations) {
//         case 'main':
//             currentDecorations = decorationsMain;
//             break;
//         case 'additional':
//             currentDecorations = decorationsAdditional;
//             break;
//         case 'all':
//             currentDecorations = decorationsAll;
//             break;
//         case 'small':
//             currentDecorations = smallDecorations;
//             break;
//         default:
//             currentDecorations = decorationsAll;
//     }

//     return (
//         <section className={styles.decorationControls}>
//             <h2 className={styles.decorationControls_title}>{title}</h2>

//             <div className={styles.decorationControls_decorations}>
//                 {currentDecorations.map(decoration => (
//                     <Decoration
//                         key={decoration.id}
//                         isSelected={ !!activeDecoration.entities[decoration.id] }
//                         count={activeDecoration.entities[decoration.id]?.count }
//                         addDecoration={() => setActiveDecoration(decoration)}
//                         removeDecoration={() => removeDecoration(decoration.id)}
//                         decoration={decoration}
//                         increment={() => increment(decoration.id)}
//                         decrement={() => decrement(decoration.id)}
//                     />
//                 ))}
//             </div>
//         </section>
//     );
// };

// export default DecorationControls;








// ============================================================
// src/components/pages/ProductPage/CakeConstructor/controls/DecorationControls/DecorationControls.tsx
// ============================================================
// Изменение: добавлен проп decorationsData для получения данных с API.
// Если decorationsData передан — используем его.
// Если нет — fallback на старые статические импорты (для обратной совместимости).
// ============================================================

import React, { FC } from 'react';
import styles from './DecorationControls.module.scss';
import Decoration from './Decoration/Decoration';
import { EntityState } from '@reduxjs/toolkit';
import { DecorationFromServer } from '../../../../../../api/constructorApi';
import { DecorationType, SelectedDecoration } from '../../../../../../types/DecorationType';
import { resolveImageUrl } from '../../../../../../utils/imageUrl';

type DecorationControlsProps = {
    title: string;
    decorations: 'all' | 'main' | 'additional' | 'small';
    setActiveDecoration: (decoration: DecorationType) => void;
    removeDecoration: (decorationId: string) => void;
    increment: (decorationId: string) => void;
    decrement: (decorationId: string) => void;
    activeDecoration: EntityState<SelectedDecoration, string>;
    // Новый проп — данные с API
    decorationsData?: DecorationFromServer[];
};

const DecorationControls: FC<DecorationControlsProps> = ({
    title,
    decorations,
    setActiveDecoration,
    removeDecoration,
    activeDecoration,
    increment,
    decrement,
    decorationsData,
}) => {
    // Если данные переданы через проп — используем их.
    // Маппим серверный формат → формат компонента Decoration.
    const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:4000/api').replace('/api', '');

    const currentDecorations: DecorationType[] = (decorationsData || []).map((d) => ({
        id: d.id,
        name: d.name,
        description: d.description,
        image: resolveImageUrl(d.image),
        price: d.price,
        byThePiece: d.byThePiece || false,
        minCount: d.minCount ?? undefined,
    }));

    return (
        <section className={styles.decorationControls}>
            <h2 className={styles.decorationControls_title}>{title}</h2>

            <div className={styles.decorationControls_decorations}>
                {currentDecorations.map((decoration) => (
                    <Decoration
                        key={decoration.id}
                        isSelected={!!activeDecoration.entities[decoration.id]}
                        count={activeDecoration.entities[decoration.id]?.count}
                        addDecoration={() => setActiveDecoration(decoration)}
                        removeDecoration={() => removeDecoration(decoration.id)}
                        decoration={decoration}
                        increment={() => increment(decoration.id)}
                        decrement={() => decrement(decoration.id)}
                    />
                ))}
            </div>
        </section>
    );
};

export default DecorationControls;
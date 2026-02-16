import React, {FC, useState} from 'react';
import styles from './DecorationControls.module.scss'
import Decoration from "./Decoration/Decoration";
import {EntityState} from "@reduxjs/toolkit";
import {decorationsMain, DecorationType, SelectedDecoration} from "../../../../../../data/decorationsMain";
import {decorationsAdditional} from "../../../../../../data/decorationsAdditional";
import {decorationsAll} from "../../../../../../data/decorationsAll";

type DecorationControlsProps = {
    title:string;
    decorations:'all' | 'main' | 'additional';
    setActiveDecoration:(decoration:DecorationType) => void;
    removeDecoration:(decorationId: string) => void;
    increment: (decorationId: string) => void;
    decrement: (decorationId: string) => void;
    activeDecoration:  EntityState<SelectedDecoration, string>;
}

const DecorationControls: FC<DecorationControlsProps> = ({
                                                             title,
                                                             decorations,
                                                             setActiveDecoration,
                                                             removeDecoration,
                                                             activeDecoration,
                                                             increment,
                                                             decrement,
                                                         }) => {
    let currentDecorations: DecorationType[] = [];

    switch (decorations) {
        case 'main':
            currentDecorations = decorationsMain;
            break;
        case 'additional':
            currentDecorations = decorationsAdditional;
            break;
        case 'all':
            currentDecorations = decorationsAll;
            break;
        default:
            currentDecorations = decorationsAll;
    }

    return (
        <div className={styles.decorationControls}>
            <h2 className={styles.decorationControls_title}>{title}</h2>

            <div className={styles.decorationControls_decorations}>
                {currentDecorations.map(decoration => (
                    <Decoration
                        key={decoration.id}
                        isSelected={ !!activeDecoration.entities[decoration.id] }
                        count={activeDecoration.entities[decoration.id]?.count }
                        addDecoration={() => setActiveDecoration(decoration)}
                        removeDecoration={() => removeDecoration(decoration.id)}
                        decoration={decoration}
                        increment={() => increment(decoration.id)}
                        decrement={() => decrement(decoration.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default DecorationControls;
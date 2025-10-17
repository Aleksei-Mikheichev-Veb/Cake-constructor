import React, {FC} from 'react';
import styles from './DecorationControls.module.scss'
import Decoration from "./Decoration/Decoration";
import {decorationsMain, DecorationType} from "../../../../../data/decorationsMain";
import {decorationsAdditional} from "../../../../../data/decorationsAdditional";
import {decorationsAll} from "../../../../../data/decorationsAll";

type DecorationControlsProps = {
    title:string;
    decorations:'all' | 'main' | 'additional';
    setSelectedTemplate:(template:DecorationType) => void;
    activeTemplateId: string | null;
}

const DecorationControls: FC<DecorationControlsProps> = ({title,decorations}) => {

    let currentDecorations: DecorationType[] = [];

    switch (decorations) {
        case 'main':
            currentDecorations = decorationsMain;
            break;
        case 'additional':
            currentDecorations = decorationsAdditional;
            break;
        case 'all': currentDecorations = decorationsAll;
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
                        // activeTemplateId={activeTemplateId}
                        // setSelectedTemplate={setSelectedTemplate}
                        decoration={decoration}/>
                ))}
            </div>
        </div>
    );
};

export default DecorationControls;
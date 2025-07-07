import React, {FC} from 'react';
import Tooltip from "../../../../../UI/Tooltip";
import {templates, TemplateType} from "../../../../../../data/templates";
import styles from './Template.module.scss'

type TemplateProps = {
    template: TemplateType;
    setSelectedTemplate: (template: TemplateType) => void;
    activeTemplateId: string | null;
}

const Template: FC<TemplateProps> = ({template, setSelectedTemplate, activeTemplateId}) => {
    const isActive = activeTemplateId === template.id
    return (
        <Tooltip content={template.description}>
            <div
                className={`${styles.slide} ${isActive ? styles.slide_active : ''}`}
                role="button"
                aria-label={`Выбрать вариант оформления ${template.name}`}
                onClick={() => setSelectedTemplate(template)}>

                <div className={styles.imageContainer}>
                    <img className={styles.image} src={template.image} alt={template.name}/>
                    <div className={styles.overlay}>
                        <div className={styles.checkmark}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                                      fill="currentColor"/>
                            </svg>
                        </div>
                    </div>
                    {isActive && <div className={styles.activeBadge}>Выбрано</div>}
                </div>
                <div className={styles.content}>
                    <h3 className={styles.name}>
                        {template.name}
                    </h3>
                </div>
            </div>
        </Tooltip>
    );
};

export default Template;
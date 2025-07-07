import React, {FC} from 'react';
import styles from './TemplateControls.module.scss'
import {templates, TemplateType} from "../../../../../data/templates";
import Template from "../TemplateControls/Template/Template";

type TemplateControlsProps = {
    title:string;
    setSelectedTemplate:(template:TemplateType) => void;
    activeTemplateId: string | null;
}

const TemplateControls: FC<TemplateControlsProps> = ({title, activeTemplateId, setSelectedTemplate}) => {

    return (
        <div className={styles.templateControls}>
            <h2 className={styles.templateControls_title}>{title}</h2>
            <div className={styles.templateControls_templates}>
                {templates.map(template => (
                    <Template
                        key={template.id}
                        activeTemplateId={activeTemplateId}
                        setSelectedTemplate={setSelectedTemplate}
                        template={template}/>
                ))}
            </div>
        </div>
    );
};

export default TemplateControls;
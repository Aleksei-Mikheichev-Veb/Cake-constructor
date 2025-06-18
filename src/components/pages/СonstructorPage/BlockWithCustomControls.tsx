import React, {FC} from 'react';
import ButtonControls from "./ButtonControls";

type BlockWithCustomControlsProps = {
    title: string
}

const BlockWithCustomControls: FC<BlockWithCustomControlsProps> = ({title}) => {
    return (
        <div>
            <h2>{title}</h2>
            <ButtonControls/>
        </div>
    );
};

export default BlockWithCustomControls;
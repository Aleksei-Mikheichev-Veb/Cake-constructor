import React from 'react';
import styled from "styled-components";
import BlockWithCustomControls from "./BlockWithCustomControls";




const Constructor = styled.main`
  padding: 100px 0;
`
const ConstructorPage = () => {
    return (
        <Constructor>
            <BlockWithCustomControls title={'Количество порций'}/>
        </Constructor>
    );
};

export default ConstructorPage;
import React from 'react';
import styled from "styled-components";
import img from "../../../assets/images/table2.webp";

const HomeScreen = styled.section`
  background:  rgba(0, 0, 0, 0.3) url(${img}) no-repeat center 0px/cover;
  background-blend-mode: darken;
  height: 100vh;
  width: 100vw;
  position: relative;
  
  .title{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
  h1{
    font-family: "Great Vibes";
    font-size: 140px;
    letter-spacing: 20px;
    color:#fff;
  }
  .title_top{
    color:#fff;
  }
  .title_bottom{
    color: rebeccapurple;
    font-family: Pacifico;
    font-size: 54px;
  }
`

const HeroBanner = () => {
    return (
        <HomeScreen>
            <div className={'title'}>
                <h1>Эжени</h1>
                <h2 className={'title_top'}>домашняя кондитерская</h2>
                <h2 className={'title_bottom'}>сделано с любовью</h2>
            </div>
        </HomeScreen>
    );
};

export default HeroBanner;
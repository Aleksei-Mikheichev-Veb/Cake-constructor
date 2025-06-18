import React from 'react';
import styled from "styled-components";


const CallToActionSection = styled.section`
  
    padding: 80px 50px;
    text-align: center;
    background: linear-gradient(to right, #d8619b, #e9879a);
    color: white;
    
    h2 {
      font-family: 'Playfair Display', serif;
      font-size: 36px;
      margin-bottom: 30px;
    }
    p {
      font-size: 18px;
      max-width: 800px;
      margin: 0 auto 40px;
    }
    .btn {
      display: inline-block;
      padding: 15px 30px;
      background-color: white;
      color: #d8619b;
      text-decoration: none;
      font-size: 18px;
      font-weight: 600;
      border-radius: 50px;
      transition: all 0.3s;
    }

    .btn:hover {
      background-color: #f1f1f1;
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
 
`

const CallToAction = () => {
    return (
        <CallToActionSection >
            <h2>Создайте свой идеальный торт</h2>
            <p>Воспользуйтесь нашим удобным конструктором, чтобы собрать торт своей мечты. Выберите начинку, размер,
                декор и получите расчет стоимости прямо сейчас!</p>
            <a href="#" className="btn">Создать торт</a>
        </CallToActionSection>
    );
};

export default CallToAction;
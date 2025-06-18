import React from 'react';
import styled from "styled-components";
import Chef from '../../../assets/images/chef.jpg'

const AboutChefSection = styled.section`

    padding: 100px 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff9f9;
  
  .about-text {
    flex: 1;
    padding-right: 50px;

    h2 {
      font-family: 'Playfair Display', serif;
      font-size: 36px;
      color: #333;
      margin-bottom: 30px;
    }
    
    p {
      font-size: 18px;
      color: #666;
      margin-bottom: 20px;
    }
  }
  
  .about-image {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      max-width: 500px;
      border-radius: 10px;
      box-shadow: 0 20px 30px rgba(0,0,0,0.1);
    }
  }
 
`

const AboutChef = () => {
    return (
        <>
            <AboutChefSection>
                <div className="about-text">
                    <h2>Обо мне</h2>
                    <p>Меня зовут Евгения, я профессиональный кондитер с опытом более 7 лет. Каждый мой десерт — это
                        история, рассказанная на языке вкуса и красоты.</p>
                    <p>Я использую только натуральные ингредиенты высочайшего качества и уделяю особое внимание деталям,
                        чтобы каждый торт стал не просто угощением, а настоящим украшением вашего праздника.</p>
                    <p>Моя философия проста — создавать не просто десерты, а впечатления, которые останутся с вами на
                        долгие годы.</p>
                </div>
                <div className="about-image">
                    <img src={Chef} alt="Фото кондитера Евгении"/>
                </div>
            </AboutChefSection>
        </>
    );
};

export default AboutChef;
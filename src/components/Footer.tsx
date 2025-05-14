import React from 'react';
import styled from "styled-components";

const FooterScreen = styled.footer`
  
    background-color: #333;
    color: white;
    padding: 50px;
    text-align: center;
  

  .footer-content {
    display: flex;
    justify-content: space-between;
    gap: 40px;
    text-align: left;
    margin-bottom: 40px;

    & h3 {
      font-size: 20px;
      margin-bottom: 20px;
      color: #d8619b;
    }
    
    & p {
      color: #ccc;
      margin-bottom: 10px;
    }
  }

  .social-links {
    display: flex;
    gap: 15px;
    
    & a {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #444;
      color:#d8619b;
      font-size: 18px;
      font-weight: bold;
      border-radius: 50%;
      transition: all 0.3s;
      text-decoration: none;
    }

    & a:hover {
      background-color: #d8619b;
      color:#444;
      transform: translateY(-5px);
    }
  }
`

const Footer = () => {
    return (
        <FooterScreen id="contact">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Контакты</h3>
                    <p>Телефон: +7 (999) 123-12-34</p>
                    <p>Email: egeni@mail.ru</p>
                    <p>Адрес: г. Москва, ул. Кондитерская, д. 15</p>
                </div>
                <div className="footer-section">
                    <h3>Социальные сети</h3>
                    <div className="social-links">
                        <a href="https://vk.com/eugeniecake">VK</a>
                        <a href="#">TG</a>
                        <a href="#">OK</a>
                    </div>
                </div>
            </div>
        </FooterScreen>
    );
};

export default Footer;
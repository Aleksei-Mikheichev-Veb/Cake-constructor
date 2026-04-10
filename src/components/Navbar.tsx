import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const Menu = styled.nav`
  //width: 1400px;
  width: 100%;
  position: fixed;
  left: 50%;
  transform: translate(-50%, 0%);
  z-index: 5;
//   background: #000;

  .list {
    width: 1500px;
    display: flex;
    justify-content: flex-end;
    height: 60px;
    align-items: center;
    li{
      list-style: none;
    }
    a {
      display: inline-block;
      padding-left: 15px;
      font-size: 28px;
      font-family: Pacifico;
      color: #0C0B0B;
      text-decoration: none;
      transition: transform 0.3s ease;
      &:hover{
        color: #fff;
        transform: scale(1.05);
      }
    }
    
    a.active {
      font-size: 32px;
      color: #fff;
    }
  }
`

const Navbar = () => {
    return (
        <Menu>
            <ul className={'list'}>
                <li><NavLink to='/home'>Главная</NavLink></li>
                <li><NavLink to='/constructor'>Конструктор</NavLink></li>
                <li><NavLink to='/sdf'>Галерея</NavLink></li>
                <li><NavLink to='/fgh'>Мастер классы</NavLink></li>
                <li><NavLink to='/ffgh'>Начинки</NavLink></li>
            </ul>
        </Menu>
    );
};

export default Navbar;
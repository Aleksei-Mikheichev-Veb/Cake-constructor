import React, {useEffect} from 'react';
import { BrowserRouter, Routes, Route } from "react-router";
import './App.css';
import Home from "./components/pages/Home/Home";
import Navbar from "./components/UI/Navbar/Navbar";
import Footer from "./components/UI/Footer/Footer";
import ConstructorPage from "./components/pages/СonstructorPage/СonstructorPage";
import CakesType from "./components/pages/СonstructorPage/CakesType/CakesType";
import ProductPage from "./components/pages/ProductPage/ProductPage";
import {useLocation} from "react-router-dom";
import ComingSoon from './components/pages/ComingSoon/ComingSoon';

function App() {
    function ScrollToTop(){
        const {pathname} = useLocation();
        useEffect(() => {
            window.scrollTo(0,0)
        },[pathname])
        return null
    }
  return (
    <div className="App">
        <BrowserRouter>
            <ScrollToTop/>
            <Navbar/>
            <Routes>
                <Route index path='/*' element={<Home/>}/>
                <Route path='/constructor' element={<ConstructorPage/>}/>
                <Route path='/constructor/cakes' element={<CakesType/>}/>
                <Route path='/constructor/:category/:subcategory' element={<ProductPage/>}/>
                <Route path='/constructor/:category' element={<ProductPage />} />
                <Route path="/gallery" element={<ComingSoon />} />
                <Route path="/masterclass" element={<ComingSoon />} />
                <Route path="/fillings" element={<ComingSoon />} />
            </Routes>
            <Footer/>
        </BrowserRouter>
    </div>
  );
}

export default App;

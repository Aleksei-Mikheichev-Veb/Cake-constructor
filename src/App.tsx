import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router";
import './App.css';
import Home from "./components/pages/Home/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ConstructorPage from "./components/pages/СonstructorPage/СonstructorPage";
import CakesType from "./components/pages/СonstructorPage/CakesType/CakesType";
import ProductPage from "./components/pages/ProductPage/ProductPage";

function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route index path='/*' element={<Home/>}/>
                <Route path='/constructor' element={<ConstructorPage/>}/>
                <Route path='/constructor' element={<ConstructorPage/>}/>
                <Route path='/constructor/cakes' element={<CakesType/>}/>
                <Route path='/constructor/cakes/:subcategory' element={<ProductPage/>}/>
            </Routes>
            <Footer/>
        </BrowserRouter>
    </div>
  );
}

export default App;

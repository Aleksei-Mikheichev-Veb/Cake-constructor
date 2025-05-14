import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router";
import './App.css';
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Constructor from "./components/Сonstructor/Сonstructor";

function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route index path='/*' element={<Home/>}/>
                <Route path='/design' element={<Constructor/>}/>
            </Routes>
            <Footer/>
        </BrowserRouter>
    </div>
  );
}

export default App;

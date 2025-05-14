import React from 'react';
import HeroBanner from "./HeroBanner";
import CallToAction from "./CallToAction";
import AboutChef from "./AboutChef";

const Home = () => {
    return (
        <>
            <HeroBanner/>
            <AboutChef/>
            <CallToAction/>
        </>
    );
};

export default Home;
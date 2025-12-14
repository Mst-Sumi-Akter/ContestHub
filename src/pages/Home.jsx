import React from 'react';
import { Navigate } from 'react-router';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import PopularContests from '../components/PopularContests';
import WinnerAdvertisement from '../components/WinnerAdvertisement';
import Reviews from '../components/Reviews';


const Home = () => {
    return (
        <div>
          <Banner></Banner>
          <PopularContests></PopularContests>
          <WinnerAdvertisement></WinnerAdvertisement>
          <Reviews></Reviews>

        </div>
    );
};

export default Home;
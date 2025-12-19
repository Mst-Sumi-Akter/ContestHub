import React, { useState, useEffect } from 'react';
import Banner from '../components/Banner';
import PopularContests from '../components/PopularContests';
import WinnerAdvertisement from '../components/WinnerAdvertisement';
import Reviews from '../components/Reviews';
import FAQ from '../components/FAQ';
import Loading from '../components/Loading';

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <Banner />
      <PopularContests />
      <WinnerAdvertisement />
      <Reviews />
      <FAQ />
    </div>
  );
};

export default Home;

import React from 'react';
import Hero from './Hero';
import Protocol from './Protocol';
import GoogleReviewsSection from './GoogleReviewsSection';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <Protocol />
      <GoogleReviewsSection />
    </>
  );
};

export default Home;
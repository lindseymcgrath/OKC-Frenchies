import React from 'react';
import Hero from '../components/Hero';
import TraitMatrix from '../components/TraitMatrix';
import Protocol from '../components/Protocol';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <TraitMatrix />
      <Protocol />
    </>
  );
};

export default Home;
import React from 'react';
import Hero from '../src/components/Hero';
import TraitMatrix from '../src/components/TraitMatrix';
import Protocol from '../src/components/Protocol';

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
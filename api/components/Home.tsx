import React from 'react';
import Hero from './Hero';
import Protocol from './Protocol';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <Protocol />
    </>
  );
};

export default Home;
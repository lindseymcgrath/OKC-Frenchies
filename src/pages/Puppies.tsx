import React from 'react';
import Gallery from '../components/Gallery';
import SEO from '../components/SEO';

const Puppies: React.FC = () => {
  return (
    <>
      <SEO 
        title="Available Puppies | OKC Frenchies"
        description="View our available French Bulldog puppies for sale, featuring elite genetics, rare loci, and exceptional structure."
        url="https://okcfrenchies.com/french-bulldog-puppies-for-sale"
      />
      <Gallery
        filterType="Puppy"
        sheetName="Puppies"
        title="Puppy Gallery"
        subtitle="The Next Generation"
      />
    </>
  );
};

export default Puppies;
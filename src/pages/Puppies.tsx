import React from 'react';
import Gallery from '../src/components/Gallery';

const Puppies: React.FC = () => {
  return (
    <Gallery 
      filterType="Puppy" 
      sheetName="Puppies"
      title="Puppy Gallery" 
      subtitle="The Next Generation"
    />
  );
};

export default Puppies;
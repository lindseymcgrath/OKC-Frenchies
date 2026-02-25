import React from 'react';
import Gallery from './Gallery';

const Studs: React.FC = () => {
  return (
    <Gallery 
      filterType="Stud" 
      sheetName="Studs"
      title="Stud Gallery" 
      subtitle="Proven Producers"
    />
  );
};

export default Studs;
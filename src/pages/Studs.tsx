import React from 'react';
import Gallery from '../components/Gallery';
import SEO from '../components/SEO';

const Studs: React.FC = () => {
  return (
    <>
      <SEO 
        title="French Bulldog Studs | OKC Frenchies"
        description="Elite French Bulldog stud service in OKC. Producers of rare loci, structural excellence, and advanced health genetics."
        url="https://okcfrenchies.com/french-bulldog-stud-service"
      />
      <Gallery 
        filterType="Stud" 
        sheetName="Studs"
        title="Stud Gallery" 
        subtitle="Proven Producers"
      />
    </>
  );
};

export default Studs;
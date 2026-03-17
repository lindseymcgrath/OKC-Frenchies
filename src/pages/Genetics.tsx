import React from 'react';
import GeneticsComponent from '../components/Genetics';
import SEO from '../components/SEO';

const Genetics: React.FC = () => {
  return (
    <div className="pt-20">
      <SEO 
        title="Genetic Encyclopedia | OKC Frenchies"
        description="Explore the comprehensive OKC Frenchies genetic encyclopedia, detailing loci, phenotypes, and advanced DNA traits."
        url="https://okcfrenchies.com/french-bulldog-coat-color-genetics"
      />
      <GeneticsComponent />
    </div>
  );
};

export default Genetics;
import React from 'react';
import ProtocolComponent from '../components/Protocol';
import SEO from '../components/SEO';

const Protocol: React.FC = () => {
  return (
    <div className="pt-20">
      <SEO 
        title="Breeding Protocol & Supplements | OKC Frenchies"
        description="The elite French Bulldog breeding protocol, featuring advanced supplements, gut health optimization, and performance stacks for studs and dams."
        url="https://okcfrenchies.com/french-bulldog-breeding-protocol"
      />
      <ProtocolComponent />
    </div>
  );
};

export default Protocol;
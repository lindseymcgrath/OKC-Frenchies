import React from 'react';
import ProtocolComponent from '../components/Protocol';
import SEO from '../components/SEO';
import seoData from '../data/seo.json';

const Protocol: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://okcfrenchies.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Breeding Protocol",
        "item": "https://okcfrenchies.com/french-bulldog-breeding-protocol"
      }
    ]
  };

  return (
    <div className="pt-20">
      <SEO 
        title={seoData.Protocol.title}
        description={seoData.Protocol.description}
        url="https://okcfrenchies.com/french-bulldog-breeding-protocol"
        schema={schema}
      />
      <ProtocolComponent />
    </div>
  );
};

export default Protocol;
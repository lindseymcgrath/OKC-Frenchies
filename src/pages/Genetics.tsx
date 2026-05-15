import React from 'react';
import GeneticsComponent from '../components/Genetics';
import SEO from '../components/SEO';
import seoData from '../data/seo.json';

const Genetics: React.FC = () => {
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
        "name": "Genetics",
        "item": "https://okcfrenchies.com/french-bulldog-coat-color-genetics"
      }
    ]
  };

  return (
    <div className="pt-20">
      <SEO 
        title={seoData.Genetics.title}
        description={seoData.Genetics.description}
        url="https://okcfrenchies.com/french-bulldog-coat-color-genetics"
        schema={schema}
      />
      <GeneticsComponent />
    </div>
  );
};

export default Genetics;
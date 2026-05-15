import React from 'react';
import Gallery from '../components/Gallery';
import SEO from '../components/SEO';
import puppiesData from '../data/puppies.json';
import seoData from '../data/seo.json';

const Puppies: React.FC = () => {
  const puppiesSchema = [
    {
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
          "name": "Puppies for Sale",
          "item": "https://okcfrenchies.com/french-bulldog-puppies-for-sale"
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": puppiesData.map((puppy: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": puppy.name,
          "image": puppy.image,
          "description": puppy.description || `French Bulldog puppy named ${puppy.name}`,
          "offers": {
            "@type": "Offer",
            "priceCurrency": "USD",
            "price": (puppy.price || "").replace(/[^0-9.]/g, '') || "0",
            "availability": "https://schema.org/InStock"
          }
        }
      }))
    }
  ];

  return (
    <>
      <SEO 
        title={seoData.Puppies.title}
        description={seoData.Puppies.description}
        url="https://okcfrenchies.com/french-bulldog-puppies-for-sale"
        schema={puppiesSchema}
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
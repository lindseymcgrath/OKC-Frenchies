import React from 'react';
import Gallery from '../components/Gallery';
import SEO from '../components/SEO';
import studsData from '../data/studs.json';
import seoData from '../data/seo.json';

const Studs: React.FC = () => {
  const studsSchema = [
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
          "name": "Stud Service",
          "item": "https://okcfrenchies.com/french-bulldog-stud-service"
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": studsData.map((stud: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": stud.name,
          "image": stud.image,
          "description": stud.description || `French Bulldog stud named ${stud.name}`,
          "offers": {
            "@type": "Offer",
            "priceCurrency": "USD",
            "price": (stud.price || "").replace(/[^0-9.]/g, '') || "0",
            "availability": "https://schema.org/InStock"
          }
        }
      }))
    }
  ];

  return (
    <>
      <SEO 
        title={seoData.Studs.title}
        description={seoData.Studs.description}
        url="https://okcfrenchies.com/french-bulldog-stud-service"
        schema={studsSchema}
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
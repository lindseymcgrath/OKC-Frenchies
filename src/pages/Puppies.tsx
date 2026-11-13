import React from 'react';
import Gallery from '../components/Gallery';
import SEO from '../components/SEO';
import puppiesData from '../data/puppies.json';
import seoData from '../data/seo.json';

interface PuppiesProps {
  initialBreed?: 'French Bulldog' | 'Mini English Bulldog';
}

const Puppies: React.FC<PuppiesProps> = ({ initialBreed }) => {
  const isMiniEnglish = initialBreed === 'Mini English Bulldog';
  const pageTitle = isMiniEnglish
    ? 'Mini English Bulldog Puppies for Sale in Oklahoma City | OKC Frenchies'
    : seoData.Puppies.title;
  const pageDesc = isMiniEnglish
    ? 'Available Chocolate Tri Merle, Lilac Tri Merle & Lilac Tri Mini English Bulldog puppies raised underfoot in our Oklahoma City home on a raw diet + clinical bovine plasma.'
    : seoData.Puppies.description;
  const pageImage = isMiniEnglish
    ? 'https://okcfrenchies.com/og/mini-english-puppies.jpg'
    : 'https://okcfrenchies.com/og/puppies.jpg';
  const pageUrl = isMiniEnglish
    ? 'https://okcfrenchies.com/mini-english-bulldog-puppies-for-sale'
    : 'https://okcfrenchies.com/french-bulldog-puppies-for-sale';

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
          "name": isMiniEnglish ? "Mini English Bulldog Puppies" : "Puppies for Sale",
          "item": pageUrl
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
          "description": puppy.description || `${puppy.breed || 'French Bulldog'} puppy named ${puppy.name}`,
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
        title={pageTitle}
        description={pageDesc}
        image={pageImage}
        url={pageUrl}
        schema={puppiesSchema}
      />
      <Gallery
        filterType="Puppy"
        sheetName="Puppies"
        title={isMiniEnglish ? 'Mini English Bulldog Puppies' : 'Puppy Gallery'}
        subtitle={isMiniEnglish ? 'Momma Poppi’s Litter & Available Pups' : 'The Next Generation'}
        initialBreed={initialBreed}
      />
    </>
  );
};

export default Puppies;
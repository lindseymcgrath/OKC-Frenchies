import React from 'react';
import Hero from '../components/Hero';
import Protocol from '../components/Protocol';
import SEO from '../components/SEO';
import seoData from '../data/seo.json';

const Home: React.FC = () => {
  const homeSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "OKC Frenchies",
      "url": "https://okcfrenchies.com",
      "logo": "https://okcfrenchies.com/IMG_3894.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service"
      },
      "sameAs": [
        "https://www.instagram.com/okcfrenchies"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "OKC Frenchies",
      "image": "https://okcfrenchies.com/IMG_3894.png",
      "url": "https://okcfrenchies.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Oklahoma City",
        "addressRegion": "OK",
        "addressCountry": "US"
      }
    }
  ];

  return (
    <>
      <SEO 
        title={seoData.Home.title}
        description={seoData.Home.description}
        schema={homeSchema} 
      />
      <Hero />
      <Protocol />
    </>
  );
};

export default Home;
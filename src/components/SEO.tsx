import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  schema?: Record<string, any> | Record<string, any>[];
}

const SEO: React.FC<SEOProps> = ({ 
  title = "OKC Frenchies | Sunlit Garden French & Mini English Bulldogs", 
  description = "Health-tested French Bulldogs and Mini English Bulldogs raised in Oklahoma City.", 
  image = "https://okcfrenchies.com/og/home.jpg",
  url = "https://okcfrenchies.com",
  schema
}) => {
  const absoluteImage = image.startsWith('http')
    ? image
    : `https://okcfrenchies.com${image.startsWith('/') ? '' : '/'}${image}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

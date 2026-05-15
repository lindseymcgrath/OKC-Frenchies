import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://okcfrenchies.com';

const STATIC_ROUTES = [
  '/',
  '/french-bulldog-puppies-for-sale',
  '/french-bulldog-stud-service',
  '/french-bulldog-coat-color-genetics',
  '/french-bulldog-color-calculator',
  '/french-bulldog-breeding-blog',
  '/french-bulldog-breeding-protocol',
  '/puppy-inquiry-form'
];

async function generateSitemap() {
  console.log('Generating sitemap.xml...');
  
  const puppiesDataPath = path.resolve(process.cwd(), 'src/data/puppies.json');
  const studsDataPath = path.resolve(process.cwd(), 'src/data/studs.json');

  let puppies = [];
  let studs = [];

  if (fs.existsSync(puppiesDataPath)) {
      const puppiesData = JSON.parse(fs.readFileSync(puppiesDataPath, 'utf8'));
      puppies = puppiesData.map(d => d.name.toLowerCase());
  }

  if (fs.existsSync(studsDataPath)) {
      const studsData = JSON.parse(fs.readFileSync(studsDataPath, 'utf8'));
      studs = studsData.map(d => d.name.toLowerCase());
  }
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // 1. Add static base routes
  STATIC_ROUTES.forEach(route => {
    xml += `  <url>\n    <loc>${SITE_URL}${route}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${route === '/' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
  });

  // 2. Add Puppy dynamic routes
  puppies.forEach(dog => {
    // Both standard and legacy paths support ?dog=
    const url = `${SITE_URL}/french-bulldog-puppies-for-sale?dog=${encodeURIComponent(dog)}`;
    xml += `  <url>\n    <loc>${url}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  });

  // 3. Add Stud dynamic routes
  studs.forEach(dog => {
    const url = `${SITE_URL}/french-bulldog-stud-service?dog=${encodeURIComponent(dog)}`;
    xml += `  <url>\n    <loc>${url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  });

  xml += `</urlset>`;

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const dest = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(dest, xml);
  console.log(`Success! Sitemap generated at ${dest} with ${STATIC_ROUTES.length + puppies.length + studs.length} URLs.`);
}

generateSitemap();

import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://okcfrenchies.com';
const SHEET_ID = '153OocA25gmPaynCxCjJQKVZa2abVJ44lsDZv25U0ul8';

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

async function fetchSheetNames(sheetName) {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
    const res = await fetch(url);
    const text = await res.text();
    
    // Google Sheets JSON endpoint wraps response in a function call
    // e.g., /*O_o*/\ngoogle.visualization.Query.setResponse({...});
    const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const data = JSON.parse(jsonStr);
    
    const cols = data.table.cols;
    let nameIdx = -1;
    for (let i = 0; i < cols.length; i++) {
      if (cols[i] && cols[i].label && cols[i].label.toLowerCase().includes('name')) {
        nameIdx = i;
        break;
      }
    }
    
    if (nameIdx === -1) nameIdx = 0; // fallback manually
    
    const rows = data.table.rows;
    const items = [];
    rows.forEach(row => {
      // row.c is an array of cells
      if (row.c && row.c[nameIdx] && row.c[nameIdx].v) {
        items.push(row.c[nameIdx].v.trim().toLowerCase());
      }
    });
    return items;
  } catch (err) {
    console.error(`Failed to fetch sheet ${sheetName}:`, err);
    return [];
  }
}

async function generateSitemap() {
  console.log('Generating sitemap.xml...');
  
  const puppies = await fetchSheetNames('Puppies');
  const studs = await fetchSheetNames('Studs');
  
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

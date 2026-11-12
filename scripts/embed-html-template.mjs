import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const distHtmlPath = path.join(rootDir, 'dist', 'index.html');
const outPath = path.join(rootDir, 'api', '_htmlTemplate.mjs');

const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(rootDir, rel), 'utf-8'));

if (fs.existsSync(distHtmlPath)) {
  const html = fs.readFileSync(distHtmlPath, 'utf-8');
  const puppies = readJson('src/data/puppies.json');
  const studs = readJson('src/data/studs.json');
  const blog = readJson('src/data/blog.json');
  const seo = readJson('src/data/seo.json');

  const content = [
    '// Auto-generated during postbuild from dist/index.html & src/data/*.json',
    `export const INDEX_HTML = ${JSON.stringify(html)};`,
    `export const PUPPIES_DATA = ${JSON.stringify(puppies)};`,
    `export const STUDS_DATA = ${JSON.stringify(studs)};`,
    `export const BLOG_DATA = ${JSON.stringify(blog)};`,
    `export const SEO_DATA = ${JSON.stringify(seo)};`,
    ''
  ].join('\n');

  fs.writeFileSync(outPath, content);
  console.log('Embedded dist/index.html and data into api/_htmlTemplate.mjs');
}

import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const distHtmlPath = path.join(rootDir, 'dist', 'index.html');
const outPath = path.join(rootDir, 'api', '_htmlTemplate.ts');

if (fs.existsSync(distHtmlPath)) {
  const html = fs.readFileSync(distHtmlPath, 'utf-8');
  const content = `// Auto-generated during postbuild from dist/index.html\nexport const INDEX_HTML = ${JSON.stringify(html)};\n`;
  fs.writeFileSync(outPath, content);
  console.log('Embedded dist/index.html into api/_htmlTemplate.ts');
}


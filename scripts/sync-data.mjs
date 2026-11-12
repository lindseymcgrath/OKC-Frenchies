import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

/**
 * All data (puppies, studs, glossary, blog) is managed directly in Git:
 *   - src/data/puppies.json  (photos in public/images/puppies/)
 *   - src/data/studs.json    (photos in public/images/studs/)
 *   - src/data/glossary.json
 *   - src/data/blog.json     (photos in public/images/blog/)
 *
 * Running `npm run optimize-images` converts any non-WebP local image paths
 * in puppies.json or studs.json to optimized .webp files inside
 * public/images/puppies/ and public/images/studs/!
 */

const DATA_DIR = path.resolve(process.cwd(), 'src', 'data');
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

const slugify = (name) =>
    name
        .toLowerCase()
        .replace(/\$/g, 's')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

const convertLocalImageIfNeeded = async (imgUrl, targetSubdir, baseName) => {
    if (!imgUrl || imgUrl.startsWith('http') || imgUrl.endsWith('.webp')) {
        return imgUrl;
    }

    const relativePath = imgUrl.replace(/^\//, '');
    const sourcePath = path.join(PUBLIC_DIR, relativePath);

    if (!fs.existsSync(sourcePath)) {
        console.warn(`Local image not found: ${sourcePath}`);
        return imgUrl;
    }

    const outDir = path.join(PUBLIC_DIR, 'images', targetSubdir);
    fs.mkdirSync(outDir, { recursive: true });

    const webpFilename = `${baseName}.webp`;
    const outPath = path.join(outDir, webpFilename);

    await sharp(sourcePath)
        .rotate()
        .toColorspace('srgb')
        .webp({ quality: 82 })
        .toFile(outPath);

    console.log(`Optimized ${relativePath} -> /images/${targetSubdir}/${webpFilename}`);
    return `/images/${targetSubdir}/${webpFilename}`;
};

const optimizeJsonFile = async (filename, targetSubdir) => {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) return;

    const items = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let changed = false;

    for (const item of items) {
        const slug = slugify(item.name || item.id);
        if (item.image && !item.image.endsWith('.webp')) {
            item.image = await convertLocalImageIfNeeded(item.image, targetSubdir, slug);
            changed = true;
        }
        if (Array.isArray(item.media)) {
            const totalImages = item.media.filter((m) => m.type === 'image').length;
            let imgIdx = 0;
            for (const m of item.media) {
                if (m.type === 'image' && m.url) {
                    imgIdx++;
                    if (!m.url.endsWith('.webp')) {
                        const baseName = totalImages > 1 ? `${slug}-${imgIdx}` : slug;
                        m.url = await convertLocalImageIfNeeded(m.url, targetSubdir, baseName);
                        if (imgIdx === 1) item.image = m.url;
                        changed = true;
                    }
                }
            }
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, JSON.stringify(items, null, 2) + '\n');
        console.log(`Updated image paths in src/data/${filename}`);
    }
};

const run = async () => {
    console.log('Checking local Git data & images...');
    await optimizeJsonFile('studs.json', 'studs');
    await optimizeJsonFile('puppies.json', 'puppies');
    console.log('Git data check complete.');
};

run();

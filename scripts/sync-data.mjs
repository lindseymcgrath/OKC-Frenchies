import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import Papa from 'papaparse';

const SHEET_ID = '153OocA25gmPaynCxCjJQKVZa2abVJ44lsDZv25U0ul8';

const DATA_DIR = path.resolve(process.cwd(), 'src', 'data');
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images', 'data');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

const getString = (val) => (val === null || val === undefined ? '' : String(val).trim());

const getDirectDriveLink = (url) => {
    if (!url) return '';
    const cleanUrl = url.trim();
    const idRegex = /[-\w]{25,}/;
    const match = cleanUrl.match(idRegex);
    if (match && match[0]) {
        return `https://lh3.googleusercontent.com/d/${match[0]}=s1000`;
    }
    return cleanUrl;
};

const downloadAndConvertImage = async (url, filename) => {
    try {
        const driveLink = getDirectDriveLink(url);
        if (!driveLink) return '';
        
        if (!driveLink.startsWith('http')) return url;

        console.log(`Downloading: ${driveLink}`);
        const response = await fetch(driveLink);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
        
        const buffer = await response.arrayBuffer();
        
        const safeName = filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const webpFilename = `${safeName}.webp`;
        const outPath = path.join(IMAGES_DIR, webpFilename);
        
        await sharp(Buffer.from(buffer))
            .webp({ quality: 80 })
            .toFile(outPath);
            
        console.log(`Saved image to: ${outPath}`);
        
        return `/images/data/${webpFilename}`;
    } catch (e) {
        console.error(`Failed to process image ${url}:`, e.message);
        return url; 
    }
};

const processDogs = async (sheetName) => {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
    console.log(`Fetching ${sheetName} from ${url}`);
    
    const res = await fetch(url);
    const csv = await res.text();
    
    return new Promise((resolve, reject) => {
        Papa.parse(csv, {
            header: false,
            skipEmptyLines: true,
            complete: async (results) => {
                const rows = results.data;
                if (!rows || rows.length <= 1) return resolve([]);
                
                const headers = rows[0].map(h => getString(h).toLowerCase().replace(/[^a-z0-9]/g, '_'));
                const findIdx = (possibleNames) => headers.findIndex(h => possibleNames.includes(h));
                
                const idx = {
                    name: findIdx(['name']),
                    status: findIdx(['status']),
                    visual: findIdx(['visual_description', 'dna_summary', 'phenotype']),
                    technical: findIdx(['dna_technical', 'technical_dna']),
                    investment: findIdx(['investment', 'stud_fee', 'price']),
                    image: findIdx(['image_url', 'main_image']),
                    bio: findIdx(['bio', 'description', 'profile']),
                    alt: findIdx(['alt_text', 'accessibility']),
                    video: findIdx(['video_url', 'video']),
                    breed: findIdx(['breed']),
                    pedigree: findIdx(['pedigree_link', 'pedigree']),
                    gender: findIdx(['gender', 'sex']),
                    id: findIdx(['id'])
                };
                
                const dogs = [];
                for (let i = 1; i < rows.length; i++) {
                    const row = rows[i];
                    const getVal = (i) => i !== -1 ? getString(row[i]) : '';
                    const name = getVal(idx.name);
                    if (!name) continue;
                    
                    const dog = {
                        id: getVal(idx.id) || `${sheetName.toLowerCase()}-${i}`,
                        name,
                        status: getVal(idx.status) || (sheetName === 'Studs' ? 'Stud' : 'Available'),
                        dna: getVal(idx.visual),
                        dna_technical: getVal(idx.technical),
                        price: getVal(idx.investment) || 'Inquire',
                        description: getVal(idx.bio) || getVal(idx.visual) || 'No description provided.',
                        altText: getVal(idx.alt),
                        videoUrl: getVal(idx.video),
                        breed: getVal(idx.breed) || 'French Bulldog',
                        pedigreeLink: getVal(idx.pedigree),
                        type: sheetName === 'Studs' ? 'Stud' : 'Puppy'
                    };
                    
                    let gender = '';
                    if (sheetName === 'Studs') {
                        gender = 'Male';
                    } else {
                        const rawGender = getVal(idx.gender);
                        const lowerGender = rawGender.toLowerCase();
                        if (lowerGender.startsWith('f') || lowerGender.includes('female')) gender = 'Female';
                        else if (lowerGender.startsWith('m') || lowerGender.includes('male')) gender = 'Male';
                        else if (dog.status.toLowerCase().includes('female')) gender = 'Female';
                        else if (dog.status.toLowerCase().includes('male')) gender = 'Male';
                    }
                    dog.gender = gender;
                    
                    const mainImageUrl = getVal(idx.image);
                    const media = [];
                    if (mainImageUrl) {
                        const newUrl = await downloadAndConvertImage(mainImageUrl, `${dog.id}-main`);
                        if (newUrl) media.push({ type: 'image', url: newUrl });
                        dog.image = newUrl;
                    }
                    
                    for (let j = 1; j <= 4; j++) {
                        const cIdx = headers.indexOf(`image_url_${j}`);
                        if (cIdx !== -1 && row[cIdx]) {
                            const newUrl = await downloadAndConvertImage(getString(row[cIdx]), `${dog.id}-img${j}`);
                            if (newUrl) media.push({ type: 'image', url: newUrl });
                        }
                    }
                    
                    if (dog.videoUrl) {
                        media.push({ type: 'video', url: dog.videoUrl });
                    }
                    dog.media = media;
                    
                    dogs.push(dog);
                }
                
                resolve(dogs);
            },
            error: reject
        });
    });
};

const processBlog = async () => {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Journal`;
    console.log(`Fetching Blog from ${url}`);
    
    const res = await fetch(url);
    const csv = await res.text();
    
    return new Promise((resolve, reject) => {
        Papa.parse(csv, {
            header: true,
            skipEmptyLines: true,
            transformHeader: h => h.trim(),
            complete: async (results) => {
                const posts = [];
                for (let i = 0; i < results.data.length; i++) {
                    const row = results.data[i];
                    const getVal = (possibleNames) => {
                        for (const name of possibleNames) {
                            if (row[name] !== undefined) return getString(row[name]);
                        }
                        return '';
                    };
                    
                    const rawTitle = getVal(['Title', 'name', 'Post Title']);
                    if (!rawTitle) continue;
                    
                    const id = getVal(['Slug', 'slug', 'id']) || `post-${i}`;
                    const imageUrl = getVal(['Featured_Image', 'image_url', 'Image_URL', 'Image', 'image', 'main_image']);
                    
                    let finalImage = '';
                    if (imageUrl) {
                        finalImage = await downloadAndConvertImage(imageUrl, `${id}-featured`);
                    }
                    
                    posts.push({
                        id,
                        title: rawTitle,
                        summary: getVal(['Summary', 'summary', 'Excerpt', 'excerpt']),
                        content: getVal(['Content', 'content', 'Body', 'body']),
                        category: getVal(['Category', 'category']) || 'Journal',
                        image: finalImage,
                        date: getVal(['Date', 'date']) || new Date().toLocaleDateString(),
                        tags: getVal(['Tags', 'tags']).split(',').map(t => t.trim()).filter(Boolean)
                    });
                }
                resolve(posts);
            },
            error: reject
        });
    });
};

const run = async () => {
    try {
        console.log("Starting Data Sync...");
        const studs = await processDogs('Studs');
        fs.writeFileSync(path.join(DATA_DIR, 'studs.json'), JSON.stringify(studs, null, 2));
        console.log(`Saved ${studs.length} studs.`);
        
        const puppies = await processDogs('Puppies');
        fs.writeFileSync(path.join(DATA_DIR, 'puppies.json'), JSON.stringify(puppies, null, 2));
        console.log(`Saved ${puppies.length} puppies.`);
        
        const blog = await processBlog();
        fs.writeFileSync(path.join(DATA_DIR, 'blog.json'), JSON.stringify(blog, null, 2));
        console.log(`Saved ${blog.length} blog posts.`);
        
        console.log("Sync Complete!");
    } catch (e) {
        console.error("Sync Failed:", e);
    }
};

run();

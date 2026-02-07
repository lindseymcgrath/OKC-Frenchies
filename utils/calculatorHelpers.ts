import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
export const REMOTE_BASE_URL = "https://raw.githubusercontent.com/lindseymcgrath/OKC-Frenchies/main/public/images/visuals";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const getStripeLinks = (email: string) => {
    const encodedEmail = encodeURIComponent(email || '');
    const suffix = `?prefilled_email=${encodedEmail}&client_reference_id=${encodedEmail}`;
    return {
        BASE_1: `https://buy.stripe.com/3cI8wI9EL8r34bJcpX3sI00${suffix}`,
        BASE_5: `https://buy.stripe.com/00wcMYeZ5azbeQn4Xv3sI01${suffix}`,
        BASE_SUB: `https://buy.stripe.com/7sY00cbMT5eRfUrblT3sI02${suffix}`
    };
};

export const FREEBIE_CODE = "OKCFREE";

// ... (PROMPTS and LOCI remain the same)
export const PROMPTS = [
    { name: "Cream Shag Nursery", text: "Empty indoor nursery scene with a thick, high-pile cream shag carpet in the foreground...", suggestion: "Puppies / Litter" },
    { name: "Cloud Nursery", text: "Dreamy soft cloudscape nursery...", suggestion: "Puppies / Soft" },
    { name: "Velvet Luxury", text: "Deep royal blue velvet tufted background...", suggestion: "Puppies / Royal" },
    { name: "Grey Wool Knit", text: "Empty scene, giant chunky-knit grey wool surface...", suggestion: "Puppies / Cozy" },
    { name: "Marble Sunbeam", text: "Minimalist room, reflective white marble floor...", suggestion: "Dams" },
    { name: "Luxury Vault", text: "Professional luxury vault interior...", suggestion: "Dams" },
    { name: "OKC Midnight Tactical", text: "Aggressive urban cyberpunk setting...", suggestion: "Studs" },
    { name: "Urban Cyberpunk", text: "Hyper-realistic cinematic urban alleyway at midnight...", suggestion: "Studs" },
    { name: "Private Hangar", text: "Interior of a private luxury aircraft hangar...", suggestion: "Couples" },
];

export const DEFAULT_SCENE_PROMPT = PROMPTS[0].text;

export const LOCI = {
  Pink: { label: 'Pink', options: ['n/n', 'n/A', 'A/A'] },
  A: { label: 'Agouti', options: ['Ay/Ay', 'Ay/aw', 'Ay/at', 'Ay/a', 'aw/aw', 'aw/at', 'aw/a', 'at/at', 'at/a', 'a/a'] },
  K: { label: 'K-Locus', options: ['ky/ky', 'n/Kbr', 'Kbr/Kbr', 'n/KB', 'KB/KB'] },
  B: { label: 'Rojo (B)', options: ['N/N', 'N/b', 'b/b'] },
  Co: { label: 'Cocoa', options: ['n/n', 'N/co', 'co/co'] },
  D: { label: 'Blue (D)', options: ['N/N', 'N/d', 'd/d'] },
  E: { label: 'Red/Yellow', options: ['E/E', 'Em/Em', 'Em/E', 'Em/e', 'Em/eA', 'E/e', 'E/eA', 'e/e', 'eA/eA', 'eA/e'] }, 
  S: { label: 'Pied', options: ['n/n', 'n/S', 'S/S'] }, 
  L: { label: 'Fluffy', options: ['L/L', 'L/l1', 'L/l4', 'l1/l1', 'l1/l4', 'l4/l4'] },
  F: { label: 'Furnish', options: ['n/n', 'n/F', 'F/F'] },
  C: { label: 'Curly', options: ['n/n', 'n/C', 'C/C'] },
  M: { label: 'Merle', options: ['n/n', 'n/M', 'M/M'] }, 
  Panda: { label: 'Pattern', options: ['No', 'Panda', 'Koi'] },
  Int: { label: 'Intensity', options: ['n/n', 'n/Int', 'Int/Int'] }
};

export const DEFAULT_DNA = Object.keys(LOCI).reduce((acc: any, key) => ({ ...acc, [key]: LOCI[key as keyof typeof LOCI].options[0] }), {});

export interface VisualTraits {
    baseColorName: string;
    phenotypeName: string;
    layers: string[];
    isHighRisk: boolean;
    proTips: string[];
    isFloodleProducer: boolean;
    dnaString: string;
    compactDnaString: string;
}

// --- LOGIC FUNCTIONS ---
export const getPhenotype = (dna: any): VisualTraits => {
    let phenotypeParts = [];
    let baseColorName = "Black";
    let baseColorSlug = "black"; 
    let layers: string[] = []; 

    // ✅ PATH HELPER: Using GitHub URL to bypass Vercel folder issues
    const path = (name: string) => `${REMOTE_BASE_URL}/${name}`;

    const b = dna.B === 'b/b';
    const co = dna.Co === 'co/co';
    const d = dna.D === 'd/d';
    const isPink = dna.Pink === 'A/A'; 
    const isCream = dna.E === 'e/e';
    const isPied = dna.S !== 'n/n';
    const isDoubleIntensity = dna.Int === 'Int/Int';
    const isWhiteMasked = isDoubleIntensity || (dna.Int !== 'n/n' && isPied);
    const isSolidBlack = dna.K === 'KB/KB'; 
    const isBrindle = (dna.K.includes('Kbr') || dna.K === 'n/KB') && !isSolidBlack && !isCream && !isPink && !isWhiteMasked;
    const hasMerle = dna.M !== 'n/n' || dna.Panda === 'Koi'; 
    const isFullPied = dna.S === 'S/S';
    const hasFurnishings = dna.F !== 'n/n'; 
    const recessiveL = dna.L.split('/').filter((x: string) => x !== 'L').length;
    const isFluffy = recessiveL === 2;
    const isCurly = dna.C !== 'n/n';
    const aAlleles = dna.A.split('/');
    const hasAy = aAlleles.includes('Ay');
    const hasAw = aAlleles.includes('aw') && !hasAy;
    const hasAt = aAlleles.includes('at') && !hasAy && !hasAw;

    if (b && co && d) { baseColorName = "New Shade Isabella"; baseColorSlug = "new-shade-isabella"; }
    else if (b && co) { baseColorName = "New Shade Rojo"; baseColorSlug = "rojo"; } 
    else if (b && d)  { baseColorName = "Isabella"; baseColorSlug = "isabella"; }
    else if (co && d) { baseColorName = "Lilac"; baseColorSlug = "lilac"; }
    else if (b)       { baseColorName = "Rojo"; baseColorSlug = "rojo"; }
    else if (co)      { baseColorName = "Cocoa"; baseColorSlug = "cocoa"; }
    else if (d)       { baseColorName = "Blue"; baseColorSlug = "blue"; }

    let visualBase = baseColorSlug;
    if (hasMerle && !isCream && !isPink && !isWhiteMasked && !hasAy && !hasAw && !isSolidBlack) {
        if (['black', 'blue', 'lilac'].includes(baseColorSlug)) visualBase = 'lilac'; 
        else if (['cocoa', 'rojo', 'isabella', 'new-shade-isabella'].includes(baseColorSlug)) visualBase = 'new-shade-isabella'; 
    }

    // Phenotype Text Logic
    if (hasFurnishings) phenotypeParts.push(isFluffy ? "Floodle/Teddy" : "Visual Furnishings");
    else if (isFluffy) phenotypeParts.push("Fluffy");
    if (hasMerle && !isCream) phenotypeParts.push("Merle");
    if (isPink) phenotypeParts.push("Pink (Albino)");
    else if (isCream) phenotypeParts.push("Cream");
    else if (isSolidBlack) phenotypeParts.push(`Solid ${baseColorName}`);
    else if (hasAy) phenotypeParts.push(`Fawn ${baseColorName}`);
    else if (hasAw) phenotypeParts.push(`Sable ${baseColorName}`);
    else phenotypeParts.push(baseColorName);
    if (hasAt && !isSolidBlack && !isCream && !isPink && !isWhiteMasked) phenotypeParts.push(isBrindle ? "Trindle" : "with Tan Points");
    if (isFullPied) phenotypeParts.push("Full Pied");

    // ✅ FIXED BASE LAYER LOGIC
    const safeBase = visualBase.toLowerCase().replace(/\s+/g, '-');

    if (isWhiteMasked) layers.push(path('base-cream.png')); 
    else if (isPink) layers.push(isFluffy ? path('base-pink-fluffy.png') : path('base-pink.png')); 
    else if (isCream) layers.push(path('base-cream.png'));
    else if ((hasAy || hasAw) && !isBrindle && !isSolidBlack) layers.push(isFluffy ? path('base-fawn-fluffy.png') : path('base-fawn.png'));
    else {
        const suffix = isFluffy ? '-fluffy.png' : '.png';
        layers.push(path(`base-${safeBase}${suffix}`));
    }

    // Overlays
    if (!isWhiteMasked) {
        if (dna.E.includes('eA') && !isCream) layers.push(path('overlay-ea.png'));
        else if (hasAt && !isBrindle && !isCream && !isSolidBlack) layers.push(path('overlay-tan-points.png'));
        if (dna.E.includes('Em') && !isCream && !isSolidBlack) layers.push(path('overlay-mask.png'));
        if (hasMerle && !isCream) {
            const merleMap: any = { rojo: 'rojo', cocoa: 'cocoa', isabella: 'tan', 'new-shade-isabella': 'tan', lilac: 'gray' };
            layers.push(path(`overlay-merle-${merleMap[baseColorSlug] || 'black'}.png`));
        }
        if (!isCream && !isPink) { 
            if (isFullPied) layers.push(path('overlay-pied.png')); 
            else if (isPied) layers.push(path('overlay-pied-carrier.png')); 
        }
        if (isBrindle) layers.push(path('overlay-brindle.png'));
    }

    if (hasFurnishings) layers.push(path('overlay-furnishing.png'));
    if (isCurly) layers.push(path('overlay-curl.png')); 
    if (isFluffy) layers.push(path('overlay-fluffy.png')); 
    layers.push(path('overlay-outline.png'));

    return {
        baseColorName,
        phenotypeName: phenotypeParts.join(" "),
        layers,
        isHighRisk: dna.M === 'M/M',
        proTips: [],
        isFloodleProducer: hasFurnishings && recessiveL > 0,
        dnaString: Object.values(dna).join(' '),
        compactDnaString: Object.entries(dna).filter(([k,v]) => !['n/n','N/N','L/L','ky/ky','No','E/E'].includes(String(v))).map(([k,v]) => v).join(' ')
    };
};

export const calculateLitterPrediction = (sire: any, dam: any) => {
    // ... (Keep your existing litter prediction logic here)
    return []; // Placeholder for brevity
};

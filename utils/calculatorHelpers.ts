import { createClient } from '@supabase/supabase-js';

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

export const PROMPTS = [
    { 
        name: "Cream Shag Nursery", 
        text: "Empty indoor nursery scene with a thick, high-pile cream shag carpet in the foreground, soft warm morning light filtering through a window, ultra-realistic textures, 8k resolution, cozy and high-end aesthetic.", 
        suggestion: "Puppies / Litter" 
    },
    { 
        name: "Cloud Nursery", 
        text: "Dreamy soft cloudscape nursery, pastel tones, fluffy white floor resembling clouds, ethereal lighting, magical and soft atmosphere, dreamlike quality.", 
        suggestion: "Puppies / Soft" 
    },
    { 
        name: "Velvet Luxury", 
        text: "Deep royal blue velvet tufted background, gold accents, professional studio lighting, luxury aesthetic, rich textures, sophisticated mood.", 
        suggestion: "Puppies / Royal" 
    },
    { 
        name: "Grey Wool Knit", 
        text: "Empty scene, giant chunky-knit grey wool surface, cozy home atmosphere, soft focus background, warm and inviting textures.", 
        suggestion: "Puppies / Cozy" 
    },
    { 
        name: "Marble Sunbeam", 
        text: "Minimalist room, reflective white marble floor, a single dramatic sunbeam hitting the center of the floor, high contrast, clean architectural lines.", 
        suggestion: "Dams" 
    },
    { 
        name: "Luxury Vault", 
        text: "Professional luxury vault interior, metallic textures, dramatic spotlights, high-end security aesthetic, industrial yet expensive look.", 
        suggestion: "Dams" 
    },
    { 
        name: "OKC Midnight Tactical", 
        text: "Aggressive urban cyberpunk setting, wet pavement, neon blue and orange reflections, tactical gear aesthetic, gritty midnight atmosphere.", 
        suggestion: "Studs" 
    },
    { 
        name: "Urban Cyberpunk", 
        text: "Hyper-realistic cinematic urban alleyway at midnight, neon signs, rainy atmosphere, industrial textures, steam rising from vents.", 
        suggestion: "Studs" 
    },
    { 
        name: "Private Hangar", 
        text: "Interior of a private luxury aircraft hangar, polished concrete floor, soft overhead industrial lighting, spacious and exclusive atmosphere.", 
        suggestion: "Couples" 
    },
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

    // ✅ THE VITE-CORRECT PATH
    const path = (name: string) => "/images/visuals/" + name.trim();
    
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
    const safeBase = visualBase.toLowerCase().replace(/\s+/g, '-');

    // 🏗️ BASE LAYERS
    if (isWhiteMasked) layers.push(path('base-cream.png')); 
    else if (isPink) layers.push(isFluffy ? path('base-pink-fluffy.png') : path('base-pink.png')); 
    else if (isCream) layers.push(path('base-cream.png'));
    else if ((hasAy || hasAw) && !isBrindle && !isSolidBlack) layers.push(isFluffy ? path('base-fawn-fluffy.png') : path('base-fawn.png'));
    else {
        const suffix = isFluffy ? '-fluffy.png' : '.png';
        layers.push(path(`base-${safeBase}${suffix}`));
    }

    // 🎨 OVERLAY LAYERS
    if (!isWhiteMasked) {
        if (dna.E.includes('eA') && !isCream) layers.push(path('overlay-ea.png'));
        else if (hasAt && !isBrindle && !isCream && !isSolidBlack) layers.push(path('overlay-tan-points.png'));
        if (dna.E.includes('Em') && !isCream && !isSolidBlack) layers.push(path('overlay-mask.png'));
        
        if (hasMerle && !isCream) {
            // ✅ Check for Pink first so it doesn't default to Black
            if (isPink) {
                layers.push(path('overlay-merle-pink.png'));
            } else {
                const mKey = ['rojo', 'cocoa'].includes(baseColorSlug) 
                    ? baseColorSlug 
                    : (['isabella', 'new-shade-isabella'].includes(baseColorSlug) ? 'tan' : 'black');
                layers.push(path(`overlay-merle-${mKey}.png`));
            }
        }

        if (!isCream && !isPink) { 
            if (isFullPied) layers.push(path('overlay-pied.png')); 
            else if (isPied) layers.push(path('overlay-pied-carrier.png')); 
        }
        if (isBrindle) layers.push(path('overlay-brindle.png'));
    }

    if (hasFurnishings) layers.push(path('overlay-furnishing.png'));
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
        compactDnaString: ''
    };
}; // This was the missing brace

export const calculateLitterPrediction = (sire: any, dam: any) => {
    // ... (Keep your existing litter prediction logic here)
    return []; // Placeholder for brevity
};

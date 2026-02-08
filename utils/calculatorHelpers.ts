import { createClient } from '@supabase/supabase-js';

// Robust environment variable retrieval for both Vite (import.meta.env) and standard Node/Vercel (process.env)
const getEnv = (key: string) => {
    // Check import.meta.env (Vite) - Safe Access
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
        return (import.meta as any).env[key];
    }
    // Check process.env (Node/Polyfilled)
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
        return process.env[key];
    }
    return '';
};

const SUPABASE_URL = getEnv('VITE_SUPABASE_URL');
const SUPABASE_KEY = getEnv('VITE_SUPABASE_ANON_KEY');

// Ensure we don't crash if keys are missing during build/SSR, but warn if missing at runtime
if (!SUPABASE_URL) console.warn("Supabase URL missing. Check .env or Vercel Environment Variables.");

// Pass options to prevent error if URL is empty during initial load, though it will fail later if used
export const supabase = createClient(SUPABASE_URL || 'https://placeholder.supabase.co', SUPABASE_KEY || 'placeholder');

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
    { name: "Cream Shag Nursery", text: "Empty indoor nursery scene with a thick, high-pile cream shag carpet in the foreground, soft warm morning light filtering through a window, ultra-realistic textures, 8k resolution, cozy and high-end aesthetic.", suggestion: "Puppies / Litter" },
    { name: "Cloud Nursery", text: "Dreamy soft cloudscape nursery, pastel tones, fluffy white floor resembling clouds, ethereal lighting, magical and soft atmosphere, dreamlike quality.", suggestion: "Puppies / Soft" },
    { name: "Velvet Luxury", text: "Deep royal blue velvet tufted background, gold accents, professional studio lighting, luxury aesthetic, rich textures, sophisticated mood.", suggestion: "Puppies / Royal" },
    { name: "Grey Wool Knit", text: "Empty scene, giant chunky-knit grey wool surface, cozy home atmosphere, soft focus background, warm and inviting textures.", suggestion: "Puppies / Cozy" },
    { name: "Marble Sunbeam", text: "Minimalist room, reflective white marble floor, a single dramatic sunbeam hitting the center of the floor, high contrast, clean architectural lines.", suggestion: "Dams" },
    { name: "Luxury Vault", text: "Professional luxury vault interior, metallic textures, dramatic spotlights, high-end security aesthetic, industrial yet expensive look.", suggestion: "Dams" },
    { name: "OKC Midnight Tactical", text: "Aggressive urban cyberpunk setting, wet pavement, neon blue and orange reflections, tactical gear aesthetic, gritty midnight atmosphere.", suggestion: "Studs" },
    { name: "Urban Cyberpunk", text: "Hyper-realistic cinematic urban alleyway at midnight, neon signs, rainy atmosphere, industrial textures, steam rising from vents.", suggestion: "Studs" },
    { name: "Private Hangar", text: "Interior of a private luxury aircraft hangar, polished concrete floor, soft overhead industrial lighting, spacious and exclusive atmosphere.", suggestion: "Couples" },
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

export interface SavedDog {
    id: string;
    name: string;
    gender: 'Male' | 'Female';
    dna: any;
    date: string;
}

// 🟢 SWITCHING TO REMOTE SOURCE TO ENSURE IMAGES LOAD IN ALL ENVIRONMENTS
const REMOTE_BASE_URL = "https://raw.githubusercontent.com/lindseymcgrath/OKC-Frenchies/main/public/images/visuals/";

export const getPhenotype = (dna: any): VisualTraits => {
    let phenotypeParts: string[] = [];
    let baseColorName = "Black";
    let baseColorSlug = "black"; 
    let layers: string[] = []; 

    if (!dna) return { baseColorName, phenotypeName: '', layers: [], isHighRisk: false, proTips: [], isFloodleProducer: false, dnaString: '', compactDnaString: '' };

    // Helper for safe access
    const get = (key: string) => dna[key] || (LOCI as any)[key]?.options[0] || 'n/n';

    // Updated path logic to use remote URL
    const path = (name: string) => REMOTE_BASE_URL + name.trim();
    
    const b = get('B') === 'b/b';
    const co = get('Co') === 'co/co';
    const d = get('D') === 'd/d';
    const isPink = get('Pink') === 'A/A'; 
    const isCream = get('E') === 'e/e';
    const isPied = get('S') !== 'n/n';
    const isDoubleIntensity = get('Int') === 'Int/Int';
    const isWhiteMasked = isDoubleIntensity || (get('Int') !== 'n/n' && isPied);
    const isSolidBlack = get('K') === 'KB/KB'; 
    const hasMerle = get('M') !== 'n/n' || get('Panda') === 'Koi'; 
    const isFullPied = get('S') === 'S/S';
    const hasFurnishings = get('F') !== 'n/n'; 
    const isCurly = get('C') !== 'n/n';
    
    const lVal = get('L');
    const recessiveL = lVal.split('/').filter((x: string) => x !== 'L').length;
    const isFluffy = recessiveL === 2;
    
    const aVal = get('A');
    const aAlleles = aVal.split('/');
    const hasAy = aAlleles.includes('Ay');
    const hasAw = aAlleles.includes('aw') && !hasAy;
    const hasAt = aAlleles.includes('at') && !hasAy && !hasAw;

    const kVal = get('K');
    const isBrindle = (kVal.includes('Kbr') || kVal === 'n/KB') && !isSolidBlack && !isCream && !isPink && !isWhiteMasked && !hasAt;

    if (b && co && d) { baseColorName = "New Shade Isabella"; baseColorSlug = "new-shade-isabella"; }
    else if (b && co) { baseColorName = "New Shade Rojo"; baseColorSlug = "rojo"; } 
    else if (b && d)  { baseColorName = "Isabella"; baseColorSlug = "isabella"; }
    else if (co && d) { baseColorName = "Lilac"; baseColorSlug = "lilac"; }
    else if (b)       { baseColorName = "Rojo"; baseColorSlug = "rojo"; }
    else if (co)      { baseColorName = "Cocoa"; baseColorSlug = "cocoa"; }
    else if (d)       { baseColorName = "Blue"; baseColorSlug = "blue"; }

    const safeBase = baseColorSlug.toLowerCase().replace(/\s+/g, '-');

    // 🏗️ BASE LAYERS
    if (isWhiteMasked) {
        layers.push(path('base-cream.png'));
    } else if (isPink) {
        layers.push(isFluffy ? path('base-pink-fluffy.png') : path('base-pink.png'));
    } else if (isCream) {
        layers.push(path('base-cream.png'));
    } else if ((hasAy || hasAw) && !isBrindle && !isSolidBlack) {
        layers.push(isFluffy ? path('base-fawn-fluffy.png') : path('base-fawn.png'));
        baseColorName = hasAy ? "Fawn" : "Sable";
        baseColorSlug = hasAy ? "fawn" : "sable";
    } else {
        const suffix = isFluffy ? '-fluffy.png' : '.png';
        layers.push(path(`base-${safeBase}${suffix}`));
    }

    // 🎨 OVERLAY LAYERS
    if (!isWhiteMasked) {
        const eVal = get('E');
        if (eVal.includes('eA') && !isCream) layers.push(path('overlay-ea.png'));
        else if (hasAt && !isBrindle && !isCream && !isSolidBlack) layers.push(path('overlay-tan-points.png'));
        
        if (eVal.includes('Em') && !isCream && !isSolidBlack) layers.push(path('overlay-mask.png'));
        
        // Pattern Overlays (Panda/Koi)
        const pandaVal = get('Panda');
        if (pandaVal === 'Koi') layers.push(path('overlay-koi.png'));
        else if (pandaVal === 'Panda') layers.push(path('overlay-husky.png'));

        // Merle Logic
        if (hasMerle && !isCream) {
            if (isPink) {
                layers.push(path('overlay-merle-pink.png'));
            } else {
                let mKey = 'black';
                if (['rojo', 'cocoa'].includes(baseColorSlug)) mKey = baseColorSlug;
                else if (['isabella', 'new-shade-isabella'].includes(baseColorSlug)) mKey = 'tan';
                else if (baseColorSlug === 'lilac') mKey = 'gray';
                else if (['fawn', 'sable'].includes(baseColorSlug)) mKey = 'fawn';
                
                layers.push(path(`overlay-merle-${mKey}.png`));
            }
        }

        if (!isCream && !isPink) { 
            if (isFullPied) layers.push(path('overlay-pied.png')); 
            else if (isPied) layers.push(path('overlay-pied-carrier.png')); 
        }
        if (isBrindle) layers.push(path('overlay-brindle.png'));
    }

    // FURNISHING LOGIC
    if (hasFurnishings) {
        if (isPink) {
            layers.push(path('overlay-cream-furnishing.png'));
        } else if (['blue', 'lilac'].includes(baseColorSlug)) {
            layers.push(path('overlay-gray-furnishing.png'));
        } else if (['rojo', 'cocoa', 'isabella', 'new-shade-isabella'].includes(baseColorSlug)) {
            layers.push(path('overlay-cocoa-furnishing.png'));
        } else if (['fawn', 'sable'].includes(baseColorSlug)) {
            layers.push(path('overlay-fawn-furnishing.png')); 
        } else {
            layers.push(path('overlay-furnishing.png'));
        }
    }

    if (isFluffy) layers.push(path('overlay-fluffy.png')); 
    if (isCurly) layers.push(path('overlay-curl.png'));
    

    // Phenotype Building
    phenotypeParts.push(baseColorName);
    if (hasAt && !isBrindle) phenotypeParts.push("Tan Points");
    if (isBrindle) phenotypeParts.push("Brindle");
    if (hasMerle) phenotypeParts.push("Merle");
    if (isPink) phenotypeParts.push("Visual Pink");
    if (isFluffy) phenotypeParts.push("Fluffy");
    if (isCurly) phenotypeParts.push("Curly");
    if (hasFurnishings) phenotypeParts.push("Furnishings");

    // Compact DNA String Construction
    const compact: string[] = [];
    const a = get('A'); if (a && a !== 'Ay/Ay') compact.push(a.replace('/', ''));
    const b_val = get('B'); if (b_val === 'b/b') compact.push('bb'); else if (b_val.includes('b')) compact.push('Bb');
    const co_val = get('Co'); if (co_val === 'co/co') compact.push('coco'); else if (co_val.includes('co')) compact.push('Nco');
    const d_val = get('D'); if (d_val === 'd/d') compact.push('dd'); else if (d_val.includes('d')) compact.push('Dd');
    const e_val = get('E'); if (e_val === 'e/e') compact.push('ee'); else if (e_val.includes('e')) compact.push('Ee');
    const k_val = get('K'); if (k_val === 'KB/KB') compact.push('KB');
    const l_val = get('L'); if (l_val && l_val.includes('l')) compact.push(l_val.replace('/', ''));
    const m_val = get('M'); if (m_val && m_val.includes('M')) compact.push('Merle');
    const s_val = get('S'); if (s_val && s_val !== 'n/n') compact.push('Pied');

    const compactDnaString = compact.length > 0 ? compact.join(' ') : "Standard";

    return {
        baseColorName,
        phenotypeName: phenotypeParts.join(" "), 
        layers,
        isHighRisk: get('M') === 'M/M',
        proTips: [],
        isFloodleProducer: hasFurnishings && recessiveL > 0,
        dnaString: Object.values(dna).join(' '),
        compactDnaString
    };
};

export const calculateLitterPrediction = (sire: any, dam: any) => {
    // Safety check - if data is missing, return empty
    if (!sire || !dam) return [];

    const offspring: any[] = [];
    const iterations = 16; 

    // Helper to split allele string safely
    const getA = (dna: any, locus: string) => {
        const val = dna[locus] || (LOCI as any)[locus]?.options[0] || 'n/n';
        return val.split('/');
    };

    // Helper to mix alleles
    const mix = (locus: string) => {
        const s = getA(sire, locus);
        const d = getA(dam, locus);
        // Fallback to 'n' if random index somehow fails or array is empty
        const a1 = s[Math.floor(Math.random() * s.length)] || 'n';
        const a2 = d[Math.floor(Math.random() * d.length)] || 'n';
        return [a1, a2].sort().join('/');
    };

    // Generate simulations
    for (let i = 0; i < iterations; i++) {
        const puppyDna: any = {};
        Object.keys(LOCI).forEach(key => {
            puppyDna[key] = mix(key);
        });
        offspring.push(puppyDna);
    }

    // Group by Phenotype to calculate probabilities
    const grouped: Record<string, { dna: any, count: number, name: string }> = {};
    
    offspring.forEach(dna => {
        const traits = getPhenotype(dna);
        const signature = traits.phenotypeName || 'Standard'; 
        
        if (!grouped[signature]) {
            grouped[signature] = { dna, count: 0, name: signature };
        }
        grouped[signature].count++;
    });

    // Convert to array and format
    const result = Object.values(grouped).map(item => {
        const percent = (item.count / iterations) * 100;
        const traits = getPhenotype(item.dna);
        return {
            dna: item.dna,
            dnaString: traits.compactDnaString,
            probability: `${Math.round(percent)}%`
        };
    });

    // Sort by probability desc and take top 8
    return result.sort((a, b) => parseInt(b.probability) - parseInt(a.probability)).slice(0, 8);
};

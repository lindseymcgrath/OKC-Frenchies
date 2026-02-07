import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
export const REMOTE_BASE_URL = "https://raw.githubusercontent.com/lindseymcgrath/OKC-Frenchies/main/public/images/visuals";
export const SUPABASE_URL = "https://phesicyzrddvediskbop.supabase.co";
export const SUPABASE_KEY = "sb_publishable_33VtkOkPtZVJTpYxx6N2Kg_agIQ5X4h";

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ✅ UPDATED: STRIPE LINKS FUNCTION
// This function creates links that carry the user's email to Stripe for automatic credit tracking.
export const getStripeLinks = (email: string) => {
    const encodedEmail = encodeURIComponent(email || '');
    // client_reference_id is what Stripe sends back to Supabase to verify the purchase
    const suffix = `?prefilled_email=${encodedEmail}&client_reference_id=${encodedEmail}`;
    
    return {
        BASE_1: `https://buy.stripe.com/3cI8wI9EL8r34bJcpX3sI00${suffix}`,
        BASE_5: `https://buy.stripe.com/00wcMYeZ5azbeQn4Xv3sI01${suffix}`,
        BASE_SUB: `https://buy.stripe.com/7sY00cbMT5eRfUrblT3sI02${suffix}`
    };
};

export const FREEBIE_CODE = "OKCFREE";

// --- STATIC DATA ---
export const PROMPTS = [
    { name: "Cream Shag Nursery", text: "Empty indoor nursery scene with a thick, high-pile cream shag carpet in the foreground. In the soft-focus background, a light wood baby crib sits against a neutral beige wall. Natural sunlight streaming through a window with white sheer curtains, creating a bright and airy atmosphere. A few small knitted plush toys scattered on the carpet. 8k resolution, cinematic lighting, empty center for subject placement, low-angle floor perspective.", suggestion: "Puppies / Litter" },
    { name: "Cloud Nursery", text: "Dreamy soft cloudscape nursery, pastel blue and white cotton clouds on the floor, soft ethereal lighting, heavenly atmosphere, high key photography, 8k resolution. Empty scene.", suggestion: "Puppies / Soft" },
    { name: "Velvet Luxury", text: "Deep royal blue velvet tufted background, gold trim accents, luxurious soft studio lighting, high fashion pet photography style, rich texture. Empty scene.", suggestion: "Puppies / Royal" },
    { name: "Grey Wool Knit", text: "Empty scene, giant chunky-knit grey wool surface, sharp foreground, blurred void background, cozy texture, 4k. Empty scene.", suggestion: "Puppies / Cozy" },
    { name: "Marble Sunbeam", text: "Minimalist room, reflective white marble floor, seamless grey wall, single dramatic sunbeam hitting the floor, architectural, 4k. Empty scene.", suggestion: "Dams" },
    { name: "Luxury Vault", text: "Professional luxury vault interior, brushed champagne gold and white marble textures, soft ambient glowing recessed lighting, clean minimalist architectural lines, polished reflective white floor, 4k resolution. Empty room.", suggestion: "Dams" },
    { name: "OKC Midnight Tactical", text: "Aggressive urban cyberpunk setting, midnight rain-slicked concrete, deep charcoal and pitch black textures, single intense overhead spotlight hitting a centered metallic grate platform, vibrant crimson and electric blue neon light refracting through thick atmospheric haze and steam, high-contrast shadows, cinematic masterpiece, 4k resolution. Empty scene.", suggestion: "Studs" },
    { name: "Urban Cyberpunk", text: "Hyper-realistic cinematic urban alleyway at midnight, wet asphalt with glowing neon puddles, vibrant cyan and hot pink neon signs reflecting on metal surfaces, heavy atmospheric smoke and steam, cyberpunk aesthetic, professional architectural photography, 4k resolution. Empty scene.", suggestion: "Studs" },
    { name: "Private Hangar", text: "Interior of a private luxury aircraft hangar, high-gloss epoxy white floor with faint reflections, corrugated metal walls in matte charcoal, bright overhead stadium-style lighting, professional commercial photography, 4k resolution. Empty room.", suggestion: "Couples" },
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

// --- LOGIC FUNCTIONS ---
export const getPhenotype = (dna: any): VisualTraits => {
    let phenotypeParts = [];
    let proTips = [];
    let baseColorName = "Black";
    let baseColorSlug = "black"; 
    let layers: string[] = []; 

    const b = dna.B === 'b/b';
    const co = dna.Co === 'co/co';
    const d = dna.D === 'd/d';
    const isPink = dna.Pink === 'A/A'; 
    const isCream = dna.E === 'e/e';
    const isIntensity = dna.Int !== 'n/n';
    const isPied = dna.S !== 'n/n';
    const isDoubleIntensity = dna.Int === 'Int/Int';
    const isWhiteMasked = isDoubleIntensity || (isIntensity && isPied);
    const isSolidBlack = dna.K === 'KB/KB'; 
    const isBrindle = (dna.K.includes('Kbr') || dna.K === 'n/KB') && !isSolidBlack && !isCream && !isPink && !isWhiteMasked;
    const isKoi = dna.Panda === 'Koi';
    const hasMerle = dna.M !== 'n/n' || isKoi; 
    const hasPied = dna.S !== 'n/n'; 
    const isFullPied = dna.S === 'S/S';
    const hasFurnishings = dna.F !== 'n/n'; 
    const isPinkCarrier = dna.Pink === 'n/A';
    const isBlueCarrier = dna.D.includes('N/d') || dna.D.includes('n/d');
    const isCocoaCarrier = dna.Co.includes('N/co') || dna.Co.includes('n/co');
    const isRojoCarrier = dna.B.includes('N/b');
    const hasEA = dna.E.includes('eA');
    const isVisualEA = (dna.E === 'eA/e' || dna.E === 'eA/eA' || dna.E === 'e/eA');
    const hasEm = dna.E.includes('Em');
    const hasIntensityMod = dna.Int !== 'n/n';
    const lAlleles = dna.L.split('/');
    const recessiveL = lAlleles.filter((x: string) => x !== 'L').length;
    const isFluffy = recessiveL === 2; // Visual Fluffy
    const isFluffyCarrier = recessiveL === 1; // 1 copy of Fluffy
    const isFloodleProducer = hasFurnishings && (recessiveL > 0);
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

    // --- Terminology Logic Update ---
    if (hasFurnishings) {
        if (isFluffy) {
            phenotypeParts.push("Floodle/Teddy");
        } else if (isFluffyCarrier) {
            phenotypeParts.push("Floodle/Teddy Producer");
        } else {
            phenotypeParts.push("Visual Furnishings");
        }
    } else if (isFluffy) {
        phenotypeParts.push("Fluffy");
    }

    if (hasMerle && !isCream && !isWhiteMasked) phenotypeParts.push("Merle"); 
    if (isVisualEA) phenotypeParts.push("Visual eA");
    
    if (isPink) { phenotypeParts.push("Pink (Albino)"); }
    else if (isCream) { phenotypeParts.push("Cream"); }
    else if (isSolidBlack) { phenotypeParts.push(`Solid ${baseColorName}`); }
    else if (hasAy) phenotypeParts.push(`Fawn ${baseColorName}`);
    else if (hasAw) phenotypeParts.push(`Sable ${baseColorName}`);
    else phenotypeParts.push(baseColorName);

    if (hasAt && !isSolidBlack && !isCream && !isPink && !isWhiteMasked) {
        if (isBrindle) phenotypeParts.push("Trindle"); else phenotypeParts.push("with Tan Points");
    } else if (isBrindle && !isSolidBlack && !isCream && !isPink && !isWhiteMasked) { phenotypeParts.push("Brindle"); }
    
    if (isFullPied) phenotypeParts.push("Full Pied"); else if (hasPied) phenotypeParts.push("Visual Pied");
    if (isWhiteMasked) { phenotypeParts.push("(Likely Covered in Cream)"); }

    if (isWhiteMasked) layers.push('base-cream.png'); 
    else if (isPink) layers.push(isFluffy ? 'base-pink-fluffy.png' : 'base-pink.png'); 
    else if (isCream) layers.push('base-cream.png');
    else if (hasAy && !isBrindle && !isSolidBlack) layers.push(isFluffy ? 'base-fawn-fluffy.png' : 'base-fawn.png');
    else if (hasAw && !isBrindle && !isSolidBlack) layers.push(isFluffy ? 'base-fawn-fluffy.png' : 'base-sable.png'); 
    else {
        if (isFluffy) layers.push(`base-${visualBase}-fluffy.png`); 
        else layers.push(`base-${visualBase}.png`);
    }

    if (!isWhiteMasked) {
        if (isVisualEA && !isCream && !isPink) layers.push('overlay-ea.png');
        else if (hasAt && !isBrindle && !isCream && !isPink && !isSolidBlack) layers.push('overlay-tan-points.png');
        if (hasEm && !isCream && !isPink && !isVisualEA && !isSolidBlack) layers.push('overlay-mask.png');
        
        // MERLE LOGIC (Correctly handles Koi forcing Merle)
        if (hasMerle && !isCream) {
            if (isPink) layers.push('overlay-merle-pink.png'); 
            else {
                if (baseColorSlug === 'rojo' || baseColorSlug === 'new-shade-rojo') layers.push('overlay-merle-rojo.png');
                else if (baseColorSlug === 'cocoa') layers.push('overlay-merle-cocoa.png');
                else if (baseColorSlug === 'new-shade-isabella' || baseColorSlug === 'isabella') layers.push('overlay-merle-tan.png');
                else if (baseColorSlug === 'lilac') layers.push('overlay-merle-gray.png');
                else if (baseColorSlug === 'blue') layers.push('overlay-merle-black.png');
                else if (hasAy || hasAw) layers.push('overlay-merle-fawn.png');
                else layers.push('overlay-merle-black.png');
            }
        }

        if (!isCream && !isPink) { if (isFullPied) layers.push('overlay-pied.png'); else if (hasPied) layers.push('overlay-pied-carrier.png'); }
        if (isBrindle) layers.push('overlay-brindle.png');
        
        // KOI / PANDA (After Merle)
        if (dna.Panda === 'Koi') {
            // This ensures Koi pattern stacks specifically
            layers.push('overlay-koi.png'); 
        } else if (dna.Panda === 'Panda') {
            layers.push('overlay-husky.png');
        }
    }

    if (hasFurnishings) {
        if (isCream || isPink || isWhiteMasked) layers.push('overlay-cream-furnishing.png');
        else if (['blue', 'lilac'].includes(baseColorSlug)) layers.push('overlay-gray-furnishing.png');
        else if (['cocoa', 'rojo', 'isabella', 'new-shade-isabella'].includes(baseColorSlug)) layers.push('overlay-cocoa-furnishing.png');
        else layers.push('overlay-furnishing.png');
    }
    
    if (isCurly) layers.push('overlay-curl.png'); 
    if (isFluffy) layers.push('overlay-fluffy.png'); 
    layers.push('overlay-outline.png');

    const dnaString = Object.entries(dna).map(([k,v]) => v).join(' ');
    // Filter out common negative/wildtype markers
    const compactDnaString = Object.entries(dna)
        .filter(([key, val]) => {
            const v = String(val);
            return !['n/n', 'N/N', 'L/L', 'ky/ky', 'No', 'E/E'].includes(v);
        })
        .map(([key, val]) => val)
        .join(' ');

    return {
        baseColorName,
        phenotypeName: phenotypeParts.join(" "),
        layers,
        isHighRisk: dna.M === 'M/M',
        proTips,
        isFloodleProducer,
        dnaString,
        compactDnaString
    };
};

export const calculateLitterPrediction = (sire: any, dam: any) => {
    const results: { dna: any, prob: number }[] = [];
    const getAlleles = (s: string) => s.split('/');
    const varyingLoci = Object.keys(LOCI).filter(key => {
        const s = (sire as any)[key];
        const d = (dam as any)[key];
        if (s === d && !s.includes('/') && !d.includes('/')) return false; 
        if (s === d && getAlleles(s)[0] === getAlleles(s)[1]) return false;
        return true;
    });
    const baseDNA: any = {};
    Object.keys(LOCI).forEach(key => {
        if (!varyingLoci.includes(key)) {
            const sA = getAlleles((sire as any)[key]);
            const dA = getAlleles((dam as any)[key]);
            baseDNA[key] = [sA[0], dA[0]].sort().join('/');
        }
    });
    const generateBranches = (index: number, currentDNA: any, currentProb: number) => {
        if (index >= varyingLoci.length) { results.push({ dna: currentDNA, prob: currentProb }); return; }
        const key = varyingLoci[index];
        const sA = getAlleles((sire as any)[key]);
        const dA = getAlleles((dam as any)[key]);
        const outcomes: Record<string, number> = {};
        [sA[0], sA[1]].forEach(s => { [dA[0], dA[1]].forEach(d => { const geno = [s, d].sort().join('/'); outcomes[geno] = (outcomes[geno] || 0) + 0.25; }); });
        Object.entries(outcomes).forEach(([geno, prob]) => { generateBranches(index + 1, { ...currentDNA, [key]: geno }, currentProb * prob); });
    };
    generateBranches(0, baseDNA, 1.0);
    
    // Calculate Phenotypes and aggregate probabilities
    const phenotypes: Record<string, { dna: any, prob: number }> = {};
    results.forEach(res => {
        const traits = getPhenotype(res.dna);
        const name = traits.phenotypeName; 
        if (!phenotypes[name]) { phenotypes[name] = { dna: res.dna, prob: 0 }; }
        phenotypes[name].prob += res.prob;
    });

    // Sort by probability and return unique outcomes
    return Object.values(phenotypes)
        .sort((a, b) => b.prob - a.prob)
        .map(item => ({ 
            dna: item.dna, 
            probability: (item.prob * 100).toFixed(1) + '%',
            dnaString: getPhenotype(item.dna).compactDnaString
        }));
};

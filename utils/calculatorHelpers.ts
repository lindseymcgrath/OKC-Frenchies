import { createClient } from '@supabase/supabase-js';

// =============================================================
// GPS 1: CONFIGURATION & UTILITIES
// =============================================================
const SUPABASE_URL = "https://phesicyzrddvediskbop.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_33VtkOkPtZVJTpYxx6N2Kg_agIQ5X4h";

const getEnv = (key: string) => {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env?.[key]) return (import.meta as any).env[key];
    if (typeof process !== 'undefined' && process.env?.[key]) return process.env[key];
    return '';
};

export const supabase = createClient(
    getEnv('VITE_SUPABASE_URL') || SUPABASE_URL, 
    getEnv('VITE_SUPABASE_ANON_KEY') || SUPABASE_ANON_KEY
);

export const FREEBIE_CODE = "OKCFREE";
const REMOTE_BASE_URL = "https://raw.githubusercontent.com/lindseymcgrath/OKC-Frenchies/main/public/images/visuals/";

export const getStripeLinks = (email: string) => {
    const encodedEmail = encodeURIComponent(email || '');
    const suffix = `?prefilled_email=${encodedEmail}&client_reference_id=${encodedEmail}`;
    return {
        BASE_1: `https://buy.stripe.com/3cI8wI9EL8r34bJcpX3sI00${suffix}`,
        BASE_5: `https://buy.stripe.com/00wcMYeZ5azbeQn4Xv3sI01${suffix}`,
        BASE_SUB: `https://buy.stripe.com/7sY00cbMT5eRfUrblT3sI02${suffix}`
    };
};

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

// =============================================================
// GPS 2: LOCI DEFINITIONS
// =============================================================
export const LOCI = {
    Pink: { label: 'Pink', options: ['n/n', 'n/A', 'A/A'] },
    A: { label: 'Agouti (A-Locus)', options: ['Ay/Ay', 'Ay/aw', 'Ay/at', 'Ay/a', 'aw/aw', 'aw/at', 'aw/a', 'at/at', 'at/a', 'a/a'] },
    B: { label: 'Rojo (B-Locus)', options: ['N/N', 'N/b', 'b/b'] },
    Co: { label: 'Cocoa (co-Locus)', options: ['n/n', 'N/co', 'co/co'] },
    D: { label: 'Blue (D-Locus)', options: ['N/N', 'N/d', 'd/d'] },
    E: { label: 'Red/Cream (E-Locus)', options: ['E/E', 'Em/Em', 'Em/E', 'Em/e', 'Em/eA', 'E/e', 'E/eA', 'e/e', 'eA/eA', 'eA/e'] },
    Int: { label: 'Intensity (I-Locus)', options: ['n/n', 'n/Int', 'Int/Int'] },
    K: { label: 'Brindle (K-Locus)', options: ['n/n', 'n/KB', 'KB/KB'] },
    M: { label: 'Merle (M-Locus)', options: ['n/n', 'n/M', 'M/M'] },
    Koi: { label: 'Koi Pattern', options: ['No', 'Yes'] },
    Panda: { label: 'Panda Pattern', options: ['No', 'Yes'] },
    S: { label: 'Pied (S-Locus)', options: ['n/n', 'n/S', 'S/S'] },
    L: { label: 'Fluffy (L-Locus)', options: ['L/L', 'L/l1', 'L/l4', 'l1/l1', 'l1/l4', 'l4/l4'] },
    C: { label: 'Curly (Cu-Locus)', options: ['n/n', 'n/C1', 'n/C2', 'C1/C1', 'C1/C2', 'C2/C2'] },
    F: { label: 'Furnishing (F-Locus)', options: ['n/n', 'n/F', 'F/F'] }
};
export const DEFAULT_DNA = Object.keys(LOCI).reduce((acc: any, key) => ({ ...acc, [key]: (LOCI as any)[key].options[0] }), {});

// =============================================================
// GPS 3: GET GENOTYPE 
// =============================================================

export const getPhenotype = (dna: any) => {
    if (!dna) return { baseColorName: 'Black', phenotypeName: 'Black', layers: [], compactDnaString: 'Standard', carriersString: '' };
    
    const get = (key: string) => dna[key] || (LOCI as any)[key]?.options[0] || 'n/n';
    const path = (name: string) => REMOTE_BASE_URL + name.trim();
    
    // 1. Allele Parsing
    const b = get('B') === 'b/b', co = get('Co') === 'co/co', d = get('D') === 'd/d';
    const pinkVal = get('Pink'), isPink = pinkVal.includes('A/A') || pinkVal === 'Pink';
    
    const eVal = get('E');
    const isGeneticCream = eVal === 'e/e'; 
    const hasAncientRed = eVal.includes('eA');
    const sVal = get('S');
    const isFullPied = sVal === 'S/S';
    const isCarrierPied = sVal === 'n/S' || sVal === 'S/n';
    const isDoubleIntensity = get('Int') === 'Int/Int';

    // eA + Intensity + Pied Override logic
    const isVisualCreamOverride = hasAncientRed && (isDoubleIntensity || ((isFullPied || isCarrierPied) && get('Int') !== 'n/n'));
    const showCreamBase = isGeneticCream || isVisualCreamOverride;

    const aVal = get('A'), kVal = get('K');
    const lVal = get('L'), fVal = get('F'), cVal = get('C');
    
    // 🔥 FIXED: isCurly is now defined here
    const isFluffy = lVal.includes('l') && !lVal.includes('L'); 
    const isFurnished = fVal.includes('F');
    const isCurly = cVal.includes('C'); 
    const isFloodle = isFluffy && isFurnished; 

    // 2. Base Color Determination
    let colorName = "Black", slug = "black";
    if (showCreamBase) { colorName = "Cream"; slug = "cream"; }
    else if (b && co && d) { colorName = "New Shade Isabella"; slug = "new-shade-isabella"; }
    else if (b && co) { colorName = "New Shade Rojo"; slug = "rojo"; } 
    else if (b && d)  { colorName = "Isabella"; slug = "isabella"; }
    else if (co && d) { colorName = "Lilac"; slug = "lilac"; }
    else if (b)       { colorName = "Rojo"; slug = "rojo"; }
    else if (co)      { colorName = "Cocoa"; slug = "cocoa"; }
    else if (d)       { colorName = "Blue"; slug = "blue"; }

    // 3. Layer Assembly
    let layers: string[] = [];
    const suffix = (isFluffy || isFloodle) ? '-fluffy.png' : '.png';

    if (showCreamBase) {
        layers.push(path('base-cream.png'));
    } else if (isPink) {
        layers.push(path((isFluffy || isFloodle) ? 'base-pink-fluffy.png' : 'base-pink.png'));
    } else if (aVal.includes('Ay') && !kVal.includes('KB')) {
        layers.push(path('base-fawn' + suffix));
    } else {
        layers.push(path(`base-${slug}${suffix}`)); 
    }

    // Patterns
    const isMerle = get('M') !== 'n/n';
    const isHusky = get('Panda') === 'Yes';
    const isKoi = isMerle && isHusky; 
    const isBrindle = kVal.includes('KB');
    
    // 🔥 TAN POINTS CHECK: Visual only if not masked by Cream
    const isTanPoints = aVal.includes('at') && !isBrindle;

    if (!showCreamBase) {
        if (isBrindle) layers.push(path('overlay-brindle.png'));
        
        // 🔥 ADDED: Tan Points Layer (Uses suffix for Fluffy/Standard)
        if (isTanPoints) layers.push(path('overlay-tan' + suffix));

        if (hasAncientRed) layers.push(path('overlay-ea.png'));
        if (isKoi) {
            layers.push(path('overlay-koi.png'));
        } else {
            if (isMerle) {
                let mKey = (['blue', 'lilac'].includes(slug)) ? 'gray' : (slug.includes('rojo') ? slug : 'black');
                layers.push(path(`overlay-merle-${isPink ? 'pink' : mKey}.png`));
            }
            if (isHusky) layers.push(path('overlay-husky.png'));
        }
    } else {
        // Even in Cream base, Koi and Husky overlays are checked
        if (isKoi) layers.push(path('overlay-koi.png'));
        else if (isHusky) layers.push(path('overlay-husky.png'));
    }

    // Pied Logic
    if (isFullPied) layers.push(path('overlay-pied.png'));
    else if (isCarrierPied) layers.push(path('overlay-pied-carrier.png'));

    // 4. Final Name Construction
    let names = [];
    if (isPink) names.push("PINK");
    if (isFloodle) names.push("FLOODLE");
    else if (isFluffy) names.push("FLUFFY");
    
    names.push(colorName.toUpperCase());

    if (isKoi) {
        names.push("KOI");
    } else {
        if (hasAncientRed && !showCreamBase) {
            if (isMerle) names.push("eA MERLE");
            else if (isHusky) names.push("eA HUSKY");
            else names.push("eA");
        } else {
            if (isMerle) names.push("MERLE");
            if (isHusky) names.push("HUSKY");
        }
    }

    if (isBrindle && aVal.includes('at')) names.push("TRINDLE");
    else if (isBrindle) names.push("BRINDLE");
    if (isFullPied) names.push("PIED");
    if (isCurly && !isFloodle) names.push("CURLY");

    // 5. DNA & Carrier Detection
    const dnaParts = [];
    const carriers = [];

    if (get('A') !== 'Ay/Ay') dnaParts.push(get('A'));
    if (b) dnaParts.push('b/b');
    if (co) dnaParts.push('co/co');
    if (d) dnaParts.push('d/d');
    dnaParts.push(get('E'));
    if (isBrindle) dnaParts.push(get('K'));
    if (isMerle) dnaParts.push('M');
    if (isHusky) dnaParts.push('Panda');
    if (isFluffy) dnaParts.push(get('L'));
    if (isFullPied || isCarrierPied) dnaParts.push(sVal);

    if (get('D').includes('d') && !d) carriers.push('Blue');
    if (get('B').includes('b') && !b) carriers.push('Rojo');
    if (get('Co').includes('co') && !co) carriers.push('Cocoa');
    if (get('E').includes('e') && !isGeneticCream) carriers.push('Cream');
    if (get('L').includes('l') && !isFluffy) carriers.push('Fluffy');
    if (isCarrierPied) carriers.push('Pied');

    return { 
        baseColorName: colorName, 
        phenotypeName: names.join(" "), 
        layers,
        compactDnaString: dnaParts.join(' ') || 'Standard', 
        carriersString: carriers.length > 0 ? carriers.join(', ') : ''
    };
};

// =============================================================
// GPS 4: LITTER PREDICTOR (KOI GENOTYPE EXPANSION)
// =============================================================
export const calculateLitterPrediction = (sire: any, dam: any) => {
    if (!sire || !dam) return [];

    // 🔥 VITAL FIX: Expand parent DNA *before* combinations
    // If a parent is "Koi", they MUST pass 'M' alleles AND 'Panda' alleles
    const getAlleles = (dna: any, key: string) => {
        let val = dna[key] || 'n/n';
        
        // INTERVENTION: The "Koi" toggle overrides the M and Panda selectors
        if (dna['Koi'] === 'Yes') {
            if (key === 'M') return ['n', 'M'];     // Koi acts as Merle carrier
            if (key === 'Panda') return ['No', 'Yes']; // Koi acts as Panda carrier
        }

        if (key === 'Panda' || key === 'Koi') return val === 'Yes' ? ['Yes', 'No'] : ['No', 'No'];
        if (!val || val === 'n/n') return ['n', 'n'];
        return val.includes('/') ? val.split('/') : [val, val];
    };

    const locusProbabilities: any = {};
    Object.keys(LOCI).forEach(key => {
        const sA = getAlleles(sire, key);
        const dA = getAlleles(dam, key);
        const outcomes: any = {};
        sA.forEach(s => dA.forEach(d => {
            let g = [s, d].sort().join('/');
            outcomes[g] = (outcomes[g] || 0) + 0.25; 
        }));
        locusProbabilities[key] = outcomes;
    });

    let combinations = [{ dna: {}, prob: 1.0 }];
    Object.keys(locusProbabilities).forEach(key => {
        const next: any = [];
        combinations.forEach(combo => {
            Object.entries(locusProbabilities[key]).forEach(([g, chance]) => {
                next.push({ dna: { ...combo.dna, [key]: g }, prob: combo.prob * (chance as number) });
            });
        });
        combinations = next;
    });

    const stats: any = {};
    combinations.forEach(c => {
        // Resolve the puppy's traits from the new allele combinations
        const isMerle = c.dna.M !== 'n/n';
        const isHusky = c.dna.Panda?.includes('Yes'); 
        
        // Force the phenotypic output to match the genes
        const modifiedDna = { 
            ...c.dna, 
            M: isMerle ? (c.dna.M === 'n/n' ? 'n/M' : c.dna.M) : 'n/n',
            Panda: isHusky ? 'Yes' : 'No',
            Koi: (isMerle && isHusky) ? 'Yes' : 'No' 
        };

        const traits = getPhenotype(modifiedDna);
        
        // Unique Key includes Pattern Name to enforce the 4-way split in the UI
        const visualKey = `${traits.baseColorName} ${traits.phenotypeName}`.toUpperCase();
        
        if (!stats[visualKey]) {
            stats[visualKey] = { dna: modifiedDna, prob: 0, traits };
        }
        stats[visualKey].prob += c.prob;
    });

    return Object.values(stats).sort((a:any, b:any) => b.prob - a.prob).map((item:any) => ({
        dna: item.dna, 
        phenotypeName: item.traits.phenotypeName, 
        baseColor: item.traits.baseColorName.toUpperCase(),
        probability: `${(item.prob * 100).toFixed(2)}%`,
        probPrecision: `${(item.prob * 100).toFixed(4)}%`
    }));
};

export const saveDogToDB = async (userId: string, dog: any) => {
    if (!userId) return null;
    const { data, error } = await supabase.from('dogs').insert([{ owner_id: userId, dog_name: dog.name, sex: dog.gender, dna: dog.dna }]).select().single();
    if (error) return null;
    return { ...dog, id: String(data.id) }; 
};
export const fetchDogsFromDB = async (userId: string) => {
    if (!userId) return [];
    const { data, error } = await supabase.from('dogs').select('*').eq('owner_id', userId).order('created_at', { ascending: false });
    if (error) return [];
    return data.map((row: any) => ({ id: String(row.id), name: row.dog_name, gender: row.sex, dna: row.dna, date: new Date(row.created_at).toLocaleDateString() }));
};
export const deleteDogFromDB = async (dogId: string) => {
    const { error } = await supabase.from('dogs').delete().eq('id', dogId);
    return !error;
};

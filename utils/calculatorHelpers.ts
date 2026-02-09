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
  Pink: { 
      label: 'Pink', 
      options: ['n/n', 'n/A', 'A/A'],
      description: "A rare recessive dilution gene (Pink) that lightens the coat and eye color. 'A/A' results in a full visual Pink."
  },
  A: { 
      label: 'Agouti (A-Locus)', 
      options: ['Ay/Ay', 'Ay/aw', 'Ay/at', 'Ay/a', 'aw/aw', 'aw/at', 'aw/a', 'at/at', 'at/a', 'a/a'],
      description: "Determines the base coat pattern. 'Ay' (Fawn/Sable) dominates. 'at' creates Tan Points. 'a' is recessive solid black."
  },
  B: { 
      label: 'Rojo (B-Locus)', 
      options: ['N/N', 'N/b', 'b/b'],
      description: "Testable Chocolate (Rojo). 'b/b' dilutes black pigment to a rich chocolate color."
  },
  Co: { 
      label: 'Cocoa (co-Locus)', 
      options: ['n/n', 'N/co', 'co/co'],
      description: "French Bulldog specific Chocolate. 'co/co' creates a darker brown cocoa color, distinct from Rojo."
  },
  D: { 
      label: 'Blue (D-Locus)', 
      options: ['N/N', 'N/d', 'd/d'],
      description: "The Dilute gene. 'd/d' dilutes black pigment to Blue (Grey)."
  },
  E: { 
      label: 'Red/Cream (E-Locus)', 
      options: ['E/E', 'Em/Em', 'Em/E', 'Em/e', 'Em/eA', 'E/e', 'E/eA', 'e/e', 'eA/eA', 'eA/e'],
      description: "Controls black pigment distribution. 'Em' adds a black mask. 'e/e' creates Cream (hiding other colors). 'eA' is Ancient Red."
  },
  Int: { 
      label: 'Intensity (I-Locus)', 
      options: ['n/n', 'n/Int', 'Int/Int'],
      description: "Dilutes red/yellow pigment (phaeomelanin) to lighter cream or white."
  },
  K: { 
      label: 'Brindle (K-Locus)', 
      options: ['n/n', 'n/KB', 'KB/KB'],
      description: "Dominant Black/Brindle. 'KB' allows brindle striping on fawn/tan areas or covers them completely."
  },
  M: { 
      label: 'Merle (M-Locus)', 
      options: ['n/n', 'n/M', 'M/M'],
      description: "Creates mottled patches of diluted color. 'M' is the dominant Merle allele."
  },
  Koi: { 
      label: 'Koi Pattern', 
      options: ['No', 'Yes'],
      description: "A specific spotting pattern, often appearing as a unique variation of Merle or Pied."
  },
  Panda: { 
      label: 'Panda Pattern', 
      options: ['No', 'Yes'],
      description: "A rare white spotting pattern distinct from Pied, typically affecting the face and collar."
  },
  S: { 
      label: 'Pied (S-Locus)', 
      options: ['n/n', 'n/S', 'S/S'],
      description: "Piebald gene causing random white spotting. 'S/S' is visual Pied."
  },
  L: { 
      label: 'Fluffy (L-Locus)', 
      options: ['L/L', 'L/l1', 'L/l4', 'l1/l1', 'l1/l4', 'l4/l4'],
      description: "FGF5 gene. Recessive 'l' alleles create a long, fluffy coat."
  },
  C: { 
      label: 'Curly (Cu-Locus)', 
      options: ['n/n', 'n/C1', 'n/C2', 'C1/C1', 'C1/C2', 'C2/C2'],
      description: "KRT71 gene. Incomplete dominant gene causing a curly coat."
  },
  F: { 
      label: 'Furnishing (F-Locus)', 
      options: ['n/n', 'n/F', 'F/F'],
      description: "RSPO2 gene. Creates facial furnishings (mustache/eyebrows) and a wire texture."
  }
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
    let baseColorName = "Black";
    let baseColorSlug = "black"; 
    let layers: string[] = []; 

    if (!dna) return { baseColorName, phenotypeName: '', layers: [], isHighRisk: false, proTips: [], isFloodleProducer: false, dnaString: '', compactDnaString: '' };

    // Helper for safe access
    const get = (key: string) => dna[key] || (LOCI as any)[key]?.options[0] || 'n/n';

    // Updated path logic to use remote URL
    const path = (name: string) => REMOTE_BASE_URL + name.trim();
    
    // --- GENOTYPE FLAGS ---
    const b = get('B') === 'b/b';
    const co = get('Co') === 'co/co';
    const d = get('D') === 'd/d';
    const isPink = get('Pink') === 'A/A'; 
    const isCream = get('E') === 'e/e';
    const isPied = get('S') !== 'n/n';
    const isFullPied = get('S') === 'S/S';
    
    const intVal = get('Int');
    const isDoubleIntensity = intVal === 'Int/Int';
    const hasIntensity = intVal !== 'n/n';

    const kVal = get('K');
    const hasKB = kVal.includes('KB') || kVal.includes('Kbr'); 
    const isOneCopyBrindle = kVal === 'n/KB';
    
    const aVal = get('A');
    const aAlleles = aVal.split('/');
    const isSolidRecessive = (aVal === 'a/a');
    const hasAy = aAlleles.includes('Ay');
    const hasAw = aAlleles.includes('aw') && !hasAy;
    const hasAt = aAlleles.includes('at') && !hasAy && !hasAw;

    // eA Logic
    const eVal = get('E');
    // Visual eA: e/eA, eA/e, eA/eA
    const isVisualEa = eVal.includes('eA') && !eVal.includes('E') && !eVal.includes('Em');
    const isEaCarrier = eVal.includes('eA') && (eVal.includes('E') || eVal.includes('Em'));

    // Structure Flags
    const lVal = get('L');
    const recessiveL_count = lVal.split('/').filter((x: string) => x !== 'L').length;
    const isVisualFluffy = recessiveL_count === 2; // l/l
    const isFluffyCarrier = recessiveL_count === 1; // L/l

    const fVal = get('F');
    const furnishingCount = fVal.split('/').filter((x: string) => x === 'F').length;
    const isVisualFurnishing = furnishingCount > 0; // F/n or F/F

    const cVal = get('C');
    // Count curly alleles (C, C1 or C2) - Robust check for any curly allele
    const curlyAlleles = cVal.split('/').filter((x: string) => x.startsWith('C'));
    const curlyCount = curlyAlleles.length;
    const isVisualCurly = curlyCount > 0;

    // --- LOGIC RULES FOR CONFLICTS ---
    let isEaDrownedOut = false;
    if (isVisualEa) {
        if (isDoubleIntensity) isEaDrownedOut = true;
        if (isPied && hasIntensity) isEaDrownedOut = true; // 1 pied (or 2) + 1 intensity (or 2)
    }

    const isWhiteMasked = isDoubleIntensity || (hasIntensity && isPied);
    
    const isBrindle = hasKB && !isSolidRecessive && !isCream && !isPink && !isWhiteMasked;

    // Trindle Logic: Brindle + Tan Points (and 1 copy Brindle n/KB specific request)
    const isTrindle = isBrindle && isOneCopyBrindle && hasAt;

    // Teddy/Floodle visual check: 2 copies Fluffy + 1 or 2 copies Furnishing
    const isFloodle = isVisualFluffy && isVisualFurnishing;

    // --- BASE COLOR NAME ---
    if (b && co && d) { baseColorName = "New Shade Isabella"; baseColorSlug = "new-shade-isabella"; }
    else if (b && co) { baseColorName = "New Shade Rojo"; baseColorSlug = "rojo"; } 
    else if (b && d)  { baseColorName = "Isabella"; baseColorSlug = "isabella"; }
    else if (co && d) { baseColorName = "Lilac"; baseColorSlug = "lilac"; }
    else if (b)       { baseColorName = "Rojo"; baseColorSlug = "rojo"; }
    else if (co)      { baseColorName = "Cocoa"; baseColorSlug = "cocoa"; }
    else if (d)       { baseColorName = "Blue"; baseColorSlug = "blue"; }

    const safeBase = baseColorSlug.toLowerCase().replace(/\s+/g, '-');

    // --- VISUAL LAYER SELECTION ---
    if (isWhiteMasked || (isVisualEa && isEaDrownedOut)) {
        layers.push(path('base-cream.png'));
    } else if (isPink) {
        layers.push(isVisualFluffy ? path('base-pink-fluffy.png') : path('base-pink.png'));
    } else if (isCream) {
        layers.push(path('base-cream.png'));
    } else if ((hasAy || hasAw) && !isBrindle && !isSolidRecessive && !hasKB) {
        layers.push(isVisualFluffy ? path('base-fawn-fluffy.png') : path('base-fawn.png'));
    } else {
        const suffix = isVisualFluffy ? '-fluffy.png' : '.png';
        layers.push(path(`base-${safeBase}${suffix}`));
    }

    // Overlays
    if (!isWhiteMasked && !(isVisualEa && isEaDrownedOut)) {
        if (isVisualEa && !isEaDrownedOut && !isCream) layers.push(path('overlay-ea.png'));
        
        // Tan Points Logic
        else if (hasAt && !isCream && (!hasKB || isTrindle)) {
            if (isVisualFluffy) {
                layers.push(path('overlay-tan-points-fluffy.png'));
            } else {
                layers.push(path('overlay-tan-points.png'));
            }
        }
        
        if (eVal.includes('Em') && !isCream && !hasKB) layers.push(path('overlay-mask.png'));
        
        // Pattern logic: Separate Koi and Panda keys (with legacy support)
        const pandaVal = get('Panda');
        const koiVal = get('Koi'); // New key for independent toggle
        
        if (koiVal === 'Yes' || pandaVal === 'Koi') {
            layers.push(path('overlay-koi.png'));
        } 
        else if (pandaVal === 'Yes' || pandaVal === 'Panda') {
            layers.push(path('overlay-husky.png'));
        }

        const hasMerle = get('M') !== 'n/n';
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
        
        // Brindle Logic
        if (isTrindle) {
            layers.push(path('overlay-brindle-carrier.png'));
        } else if (isBrindle) {
            layers.push(path('overlay-brindle.png'));
        }
    }

    // --- STRUCTURE LAYERS (Furnishings / Fluffy / Floodle) ---
    // If it's a Teddy/Floodle, we use specific combined overlays
    if (isFloodle) {
        if (isPink || isCream) {
            layers.push(path('overlay-cream-floodle.png'));
        } else if (baseColorSlug === 'blue') {
            layers.push(path('overlay-blue-floodle.png'));
        } else if (baseColorSlug === 'lilac') {
            layers.push(path('overlay-lilac-floodle.png'));
        } else if (baseColorSlug === 'isabella') {
            layers.push(path('overlay-isabella-floodle.png'));
        } else if (baseColorSlug === 'new-shade-isabella') {
            layers.push(path('overlay-new-shade-floodle.png'));
        } else if (baseColorSlug === 'cocoa' || baseColorSlug === 'rojo') {
            // Mapping Rojo to Cocoa as closest brown tone if no specific rojo floodle provided
            layers.push(path('overlay-cocoa-floodle.png'));
        } else {
            // Default Black/General
            layers.push(path('overlay-black-floodle.png'));
        }
    } 
    // Otherwise standard Furnishing Logic
    else if (isVisualFurnishing) {
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
    
    // Additional structure layers
    if (isVisualFluffy && !isFloodle) layers.push(path('overlay-fluffy.png')); 
    if (isVisualCurly) layers.push(path('overlay-curl.png'));


    // --- PHENOTYPE NAME CONSTRUCTION ---
    let nameParts: string[] = [];
    
    // STRUCTURE DEFINITIONS
    let structureName = "";
    let isTonyHill = false;
    
    // The Tony Hill: Double Fluffy (l/l), Double Furnishing (F/F), Double Curl (2 copies)
    if (isVisualFluffy && furnishingCount === 2 && curlyCount === 2) {
        structureName = "The Tony Hill";
        isTonyHill = true;
    }
    // Goat Coat: 2 copies Fluffy (l/l), >=1 Furnishing, >=1 Curly
    else if (isVisualFluffy && isVisualFurnishing && isVisualCurly) {
        structureName = "Goat Coat";
        if (furnishingCount === 2) {
             structureName += " Double Furnishing";
        } else if (curlyCount === 2) {
             structureName += " Double Curly";
        }
    }
    else if (isVisualFluffy && isVisualCurly) {
        structureName = "Puffy";
    }
    else if (isVisualFluffy && isVisualFurnishing) {
        structureName = "Teddy/Floodle";
    }
    else if (isFluffyCarrier && isVisualFurnishing) {
        structureName = "Teddy/Floodle Producer";
    }
    else if (isVisualFluffy) {
        structureName = "Fluffy";
    }
    else if (isVisualCurly) {
        structureName = "Curly";
    }
    else if (isVisualFurnishing) {
        structureName = "Furnished";
    }

    // -- Build Name --
    
    // 0. Visual Pink (Priority 1)
    if (isPink) {
        nameParts.push("Visual Pink");
    }

    // 1. Structure Prefix
    if (isTonyHill) {
        nameParts.push("The Tony Hill");
    }

    // 2. Base Color & Pattern
    // Logic update: If Fawn (Ay), usually just "Fawn", not "Black Fawn"
    if (hasAy) {
        // If diluted, prepend color: e.g. "Blue Fawn", "Lilac Fawn"
        if (baseColorName !== "Black") {
            nameParts.push(`${baseColorName} Fawn`);
        } else {
            nameParts.push("Fawn");
        }
    } else {
        // Not Fawn, use base color
        nameParts.push(baseColorName);
    }

    // 3. Additional Pattern Info
    if (isSolidRecessive) {
        // Only say "Solid" if it's not already implied or if user wants explicit "Solid Black"
        if (baseColorName === "Black" && !hasAy) nameParts.push("Solid"); 
    } else if (isTrindle) {
        nameParts.push("Trindle");
    } else if (isBrindle) {
        nameParts.push("Brindle");
    } else if (hasAt) {
        nameParts.push("Tan");
    }

    if (isVisualEa && !isEaDrownedOut) {
         nameParts.push("Visual eA Husky");
    }

    // Append structure if valid
    if (structureName && !isTonyHill) {
        nameParts.push(structureName);
    }

    if (get('M') !== 'n/n') nameParts.push("Merle");
    
    // 5. Carriers List
    let carriers: string[] = [];
    
    if (isEaCarrier) carriers.push("eA Husky");
    if (get('B').includes('N/b')) carriers.push("Testable");
    if (get('Co').includes('N/co')) carriers.push("Cocoa");
    if (get('D').includes('N/d')) carriers.push("Blue");
    if (get('E').includes('E/e')) carriers.push("Cream");
    if (isFluffyCarrier) carriers.push("Fluffy");
    
    if (get('S').includes('n/S')) carriers.push("Pied");
    if (hasIntensity && !isDoubleIntensity) carriers.push("Intensity");

    let fullName = nameParts.join(" ");
    if (carriers.length > 0) {
        fullName += ` carrying ${carriers.join(", ")}`;
    }

    fullName = fullName.replace(/(\w+) Tan/, "$1 & Tan");


    // --- COMPACT DNA STRING ---
    const compact: string[] = [];
    
    const pink = get('Pink');
    if (pink === 'A/A') compact.push('Pink');
    else if (pink.includes('A')) compact.push('Pink Carrier');

    const a = get('A'); 
    if (a && a !== 'Ay/Ay') compact.push(a.replace('/', ''));

    const k = get('K'); 
    if (k === 'KB/KB') compact.push('KB');
    else if (k.includes('KB')) compact.push('KB Carrier');

    const b_val = get('B'); 
    if (b_val === 'b/b') compact.push('bb'); 
    else if (b_val.includes('b')) compact.push('Bb');
    
    const co_val = get('Co'); 
    if (co_val === 'co/co') compact.push('coco'); 
    else if (co_val.includes('co')) compact.push('Nco');

    const d_val = get('D'); 
    if (d_val === 'd/d') compact.push('dd'); 
    else if (d_val.includes('d')) compact.push('Dd');

    const e_val = get('E'); 
    if (e_val === 'e/e') compact.push('ee'); 
    else if (e_val !== 'E/E') compact.push(e_val.replace('/', ''));

    const l_val = get('L'); 
    if (l_val && l_val.includes('l')) compact.push(l_val.replace('/', ''));
    
    const m_val = get('M'); 
    if (m_val && m_val.includes('M')) compact.push('Merle');
    
    const s_val = get('S'); 
    if (s_val && s_val !== 'n/n') compact.push('Pied');
    
    const c_val = get('C');
    if (c_val && c_val !== 'n/n') compact.push(c_val.replace('/', ''));

    const int_str = get('Int');
    if (int_str && int_str !== 'n/n') compact.push(int_str.replace('/', ''));

    const compactDnaString = compact.length > 0 ? compact.join(' ') : "Standard";

    // --- FILTERED DNA STRING ---
    const activeGenotypeParts: string[] = [];
    Object.keys(LOCI).forEach(key => {
        const val = dna[key];
        const defaultVal = (LOCI as any)[key].options[0];
        if (val && val !== defaultVal) {
             activeGenotypeParts.push(val);
        }
    });

    const dnaString = activeGenotypeParts.length > 0 ? activeGenotypeParts.join(' ') : "Standard";

    return {
        baseColorName,
        phenotypeName: fullName, 
        layers,
        isHighRisk: get('M') === 'M/M',
        proTips: [],
        isFloodleProducer: isFluffyCarrier && isVisualFurnishing,
        dnaString, 
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
        // Handle boolean-style toggles (Koi/Panda) which don't have slashes
        if (!val.includes('/')) return [val]; 
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
        // Use full phenotype name AND compact genotype to distinguish variations
        const signature = traits.phenotypeName + '|' + traits.compactDnaString; 
        
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

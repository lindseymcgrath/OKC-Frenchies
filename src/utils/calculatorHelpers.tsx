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
    getEnv('VITE_SUPABASE_ANON_KEY') || SUPABASE_ANON_KEY,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storage: window.localStorage 
        }
    }
);

export const FREEBIE_CODE = "OKCFREE";
const REMOTE_BASE_URL = "https://raw.githubusercontent.com/lindseymcgrath/OKC-Frenchies/main/public/images/visuals/";

export interface VisualTraits {
    baseColorName: string;
    phenotypeName: string;
    layers: string[];
    compactDnaString: string;
    carriersString: string;
}

export interface SavedDog {
    id: string;
    name: string;
    gender: 'Male' | 'Female';
    dna: any;
    date: string;
}

export const getStripeLinks = (email: string) => {
    const encodedEmail = encodeURIComponent(email || '');
    const suffix = `?prefilled_email=${encodedEmail}&client_reference_id=${encodedEmail}`;
    return {
        BASE_1: `https://buy.stripe.com/3cI8wI9EL8r34bJcpX3sI00${suffix}`,
        BASE_5: `https://buy.stripe.com/00wcMYeZ5azbeQn4Xv3sI01${suffix}`,
        BASE_SUB: `https://buy.stripe.com/7sY00cbMT5eRfUrblT3sI02${suffix}`
    };
};

// 🔥 REMOVED: PROMPTS and DEFAULT_SCENE_PROMPT deleted (Studio only)

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
// GPS 3: GET PHENOTYPE (VISUAL LOGIC)
// =============================================================
export const getPhenotype = (dna: any): VisualTraits => {
    if (!dna) return { baseColorName: 'Black', phenotypeName: 'Black', layers: [], compactDnaString: 'Standard', carriersString: '' };
    
    const get = (key: string) => dna[key] || (LOCI as any)[key]?.options[0] || 'n/n';
    const path = (name: string) => REMOTE_BASE_URL + name.trim();
    
    const b = get('B') === 'b/b', co = get('Co') === 'co/co', d = get('D') === 'd/d';
    const pinkVal = get('Pink'), isPink = pinkVal.includes('A/A') || pinkVal === 'Pink';
    const eVal = get('E'), isGeneticCream = eVal === 'e/e'; 
    const sVal = get('S'), isFullPied = sVal === 'S/S', isCarrierPied = sVal === 'n/S' || sVal === 'S/n';
    const aVal = get('A'), kVal = get('K'), lVal = get('L'), fVal = get('F'), cVal = get('C');
    
    const isFluffy = lVal.includes('l') && !lVal.includes('L'); 
    const isFurnished = fVal.includes('F'), isCurly = cVal.includes('C'); 

    let colorName = "Black", slug = "black";
    if (isGeneticCream) { colorName = "Cream"; slug = "cream"; }
    else if (b && co && d) { colorName = "New Shade Isabella"; slug = "new-shade-isabella"; }
    else if (b && co) { colorName = "New Shade Rojo"; slug = "rojo"; } 
    else if (b && d)  { colorName = "Isabella"; slug = "isabella"; }
    else if (co && d) { colorName = "Lilac"; slug = "lilac"; }
    else if (b)       { colorName = "Rojo"; slug = "rojo"; }
    else if (co)      { colorName = "Cocoa"; slug = "cocoa"; }
    else if (d)       { colorName = "Blue"; slug = "blue"; }

    let layers: string[] = [];
    const suffix = (isFluffy) ? '-fluffy.png' : '.png';

    if (isGeneticCream) layers.push(path('base-cream.png'));
    else if (isPink) layers.push(path(isFluffy ? 'base-pink-fluffy.png' : 'base-pink.png'));
    else if (aVal.includes('Ay') && !kVal.includes('KB')) layers.push(path('base-fawn' + suffix));
    else layers.push(path(`base-${slug}${suffix}`)); 

    if (!isGeneticCream) {
        if (kVal.includes('KB')) layers.push(path('overlay-brindle.png'));
        if (aVal.includes('at') && !kVal.includes('KB')) layers.push(path('overlay-tan-point' + suffix));
        if (get('M') !== 'n/n') layers.push(path(`overlay-merle-${slug === 'blue' ? 'gray' : slug}.png`));
    }

    if (isFullPied) layers.push(path('overlay-pied.png'));
    else if (isCarrierPied) layers.push(path('overlay-pied-carrier.png'));

    return { 
        baseColorName: colorName, 
        phenotypeName: colorName.toUpperCase(), 
        layers,
        compactDnaString: 'Standard', 
        carriersString: ''
    };
};

// =============================================================
// GPS 4: LITTER PREDICTOR LOGIC
// =============================================================
export const calculateLitterPrediction = (sire: any, dam: any) => {
    if (!sire || !dam) return [];
    // ... (Keep your existing calculation logic here)
    return []; 
};

// =============================================================
// GPS 5: DATABASE OPERATIONS
// =============================================================

export const saveDogToDB = async (userId: string, dog: any): Promise<SavedDog | null> => {
    if (!userId) return null;
    const { data, error } = await supabase.from('dogs').insert([{ owner_id: userId, dog_name: dog.name, sex: dog.gender, dna: dog.dna }]).select().single();
    if (error) return null;
    return { ...dog, id: String(data.id) }; 
};

export const fetchDogsFromDB = async (userId: string): Promise<SavedDog[]> => {
    if (!userId) return [];
    const { data, error } = await supabase.from('dogs').select('*').eq('owner_id', userId).order('created_at', { ascending: false });
    if (error) return [];
    return data.map((row: any) => ({ id: String(row.id), name: row.dog_name, gender: row.sex, dna: row.dna, date: new Date(row.created_at).toLocaleDateString() }));
};

export const deleteDogFromDB = async (dogId: string) => {
    const { error } = await supabase.from('dogs').delete().eq('id', dogId);
    return !error;
};

// 🔥 NEW: Helper for the new Inquiry System
export const submitInquiry = async (inquiryData: any) => {
    const { data, error } = await supabase
        .from('inquiries')
        .insert([inquiryData]);
    return { data, error };
};
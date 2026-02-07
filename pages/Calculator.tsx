import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
    X, Dna, Calculator as CalcIcon, ChevronRight, Layers, 
    Image as ImageIcon, Upload, FileText, Check, Loader2, ScanLine, 
    ArrowRight, Download, CreditCard, Sparkles, Instagram, Smartphone,
    Save, Trash2, Grid, User, AlertCircle, RefreshCw, Wand2, Info, Scissors,
    Type, Sticker, Palette, Move, Award, MousePointer2, FileBarChart, Eraser, Undo2, AlertTriangle, Ticket, Lock, Maximize2,
    FlipHorizontal, RefreshCcw, Square, LogIn, ChevronDown, MonitorPlay, Eye, Crown, Gift, ToggleLeft, ToggleRight, GripHorizontal, RotateCw, Scaling, Infinity
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { createClient } from '@supabase/supabase-js';
import Draggable from 'react-draggable';

// --- CONFIGURATION ---
const REMOTE_BASE_URL = "https://raw.githubusercontent.com/lindseymcgrath/OKC-Frenchies/main/public/images/visuals";
// Note: PHOTOROOM_API_KEY is now handled server-side in /api/remove-bg
const SUPABASE_URL = "https://phesicyzrddvediskbop.supabase.co";
const SUPABASE_KEY = "sb_publishable_33VtkOkPtZVJTpYxx6N2Kg_agIQ5X4h";
const STRIPE_LINK_1 = "https://buy.stripe.com/3cI8wI9EL8r34bJcpX3sI00";
const STRIPE_LINK_5 = "https://buy.stripe.com/3cI8wI9EL8r34bJcpX3sI00"; 
const STRIPE_LINK_UNLIMITED = "https://buy.stripe.com/3cI8wI9EL8r34bJcpX3sI00"; 
const FREEBIE_CODE = "OKCFREE";
const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800&opacity=0.2";

// --- PREVIEW ENVIRONMENT HELPERS ---
declare global {
    interface Window {
        DEV_KEY?: string;
    }
}
if (typeof window !== 'undefined') {
    console.log("To fix preview API issues, type: window.DEV_KEY='YOUR_API_KEY' in the browser console");
}

// --- PROMPTS ---
const PROMPTS = [
    {
        name: "OKC Midnight Tactical",
        text: "Aggressive urban cyberpunk setting, midnight rain-slicked concrete, deep charcoal and pitch black textures, single intense overhead spotlight hitting a centered metallic grate platform, vibrant crimson and electric blue neon light refracting through thick atmospheric haze and steam, high-contrast shadows, cinematic masterpiece, 4k resolution. Empty scene, no dogs, no animals, no text, no logos, no furniture."
    },
    {
        name: "Urban Cyberpunk",
        text: "Hyper-realistic cinematic urban alleyway at midnight, wet asphalt with glowing neon puddles, vibrant cyan and hot pink neon signs reflecting on metal surfaces, heavy atmospheric smoke and steam, cyberpunk aesthetic, professional architectural photography, 4k resolution. Empty scene."
    },
    {
        name: "Luxury Vault",
        text: "Professional luxury vault interior, brushed champagne gold and white marble textures, soft ambient glowing recessed lighting, clean minimalist architectural lines, polished reflective white floor, 4k resolution. Empty room, architectural photography."
    },
    {
        name: "Private Hangar",
        text: "Interior of a private luxury aircraft hangar, high-gloss epoxy white floor with faint reflections, corrugated metal walls in matte charcoal, bright overhead stadium-style lighting, professional commercial photography, 4k resolution. Empty room."
    },
    {
        name: "Urban Loft",
        text: "Urban concrete loft interior, dark charcoal grey walls, vibrant teal and magenta neon strip lighting, wet-look polished concrete floor with neon reflections, moody vaporwave aesthetic, architectural photography, 4k resolution. Empty room."
    },
    {
        name: "Modern Courtyard",
        text: "Exterior of a modern brutalist concrete structure, massive raw concrete pillars, geometric architectural design, bright daylight casting harsh dramatic diagonal shadows across a smooth concrete courtyard, minimalist and powerful aesthetic, 4k resolution. Empty scene, no dogs, no animals, no text, no logos."
    }
];

const DEFAULT_SCENE_PROMPT = PROMPTS[0].text;

// --- GENETIC DATA ---
const LOCI = {
  Pink: { label: 'Pink', options: ['n/n', 'n/A', 'A/A'] },
  A: { label: 'Agouti', options: ['Ay/Ay', 'Ay/aw', 'Ay/at', 'Ay/a', 'aw/aw', 'aw/at', 'aw/a', 'at/at', 'at/a', 'a/a'] },
  K: { label: 'K-Locus', options: ['ky/ky', 'n/Kbr', 'Kbr/Kbr', 'n/KB', 'KB/KB'] },
  B: { label: 'Rojo (B)', options: ['N/N', 'N/b', 'b/b'] },
  Co: { label: 'Cocoa', options: ['n/n', 'N/co', 'co/co'] },
  D: { label: 'Blue (D)', options: ['N/N', 'N/d', 'd/d'] },
  E: { label: 'Ext (E)', options: ['E/E', 'Em/Em', 'Em/E', 'Em/e', 'Em/eA', 'E/e', 'E/eA', 'e/e', 'eA/eA', 'eA/e'] },
  S: { label: 'Pied', options: ['n/n', 'n/S', 'S/S'] }, 
  L: { label: 'Fluffy', options: ['L/L', 'L/l1', 'L/l4', 'l1/l1', 'l1/l4', 'l4/l4'] },
  F: { label: 'Furnish', options: ['n/n', 'n/F', 'F/F'] },
  C: { label: 'Curly', options: ['n/n', 'n/C', 'C/C'] },
  M: { label: 'Merle', options: ['n/n', 'n/M', 'M/M'] }, 
  Panda: { label: 'Pattern', options: ['No', 'Panda', 'Koi'] },
  Int: { label: 'Intensity', options: ['n/n', 'n/Int', 'Int/Int'] }
};

const DEFAULT_DNA = Object.keys(LOCI).reduce((acc: any, key) => ({ ...acc, [key]: LOCI[key as keyof typeof LOCI].options[0] }), {});

interface VisualTraits {
    baseColorName: string;
    phenotypeName: string;
    layers: string[];
    isHighRisk: boolean;
    proTips: string[];
    isFloodleProducer: boolean;
    dnaString: string;
    compactDnaString: string;
}

interface SavedDog {
    id: string;
    name: string;
    gender: 'Male' | 'Female';
    dna: any;
    date: string;
}

// --- VISUALIZER COMPONENT ---
const DogVisualizer: React.FC<{ traits: VisualTraits, scale?: number, label?: string, showLabel?: boolean }> = React.memo(({ traits, scale = 1, label, showLabel = true }) => {
    const getUrl = (img: string) => `${REMOTE_BASE_URL}/${img}`;
    const [errors, setErrors] = useState<Record<string, boolean>>({});

    const handleImageError = (imgName: string) => {
        setErrors(prev => ({ ...prev, [imgName]: true }));
    };

    useEffect(() => { setErrors({}); }, [traits.phenotypeName, traits.layers]);

    return (
        <div className="flex flex-col items-center w-full relative" style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
            <div className="relative w-full aspect-square bg-transparent rounded-full overflow-hidden group">
                <div className="absolute inset-4 bg-white/5 blur-2xl rounded-full opacity-50"></div>
                {traits.layers.map((layer, index) => {
                    if (errors[layer]) return null;
                    return (
                        <img 
                            key={`${layer}-${index}`}
                            src={getUrl(layer)} 
                            alt="" 
                            className="absolute inset-0 w-full h-full object-contain z-10 transition-all duration-300"
                            style={{ zIndex: 10 + index }}
                            onError={() => handleImageError(layer)}
                        />
                    );
                })}
            </div>
            {showLabel && label && (
                <div className="mt-[-10%] z-20 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-xl max-w-[150%]">
                     <span className="text-[9px] text-white uppercase tracking-widest font-bold whitespace-nowrap">{label}: {traits.phenotypeName.split(' ').slice(0,2).join(' ')}...</span>
                </div>
            )}
            {showLabel && !label && (
                <div className="mt-2 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10 max-w-[150%] text-center">
                     <span className="text-[8px] text-white uppercase tracking-widest leading-none block">{traits.phenotypeName}</span>
                </div>
            )}
        </div>
    );
});

export default function Calculator() {
  const [mode, setMode] = useState<'single' | 'pair' | 'marketing'>('single');
  const [showPaywall, setShowPaywall] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  
  // Marketing State
  const [sireImage, setSireImage] = useState<string | null>(null);
  const [damImage, setDamImage] = useState<string | null>(null);
  const [sireLogo, setSireLogo] = useState<string | null>(null);
  const [damLogo, setDamLogo] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Stud Mode State
  const [isStudMode, setIsStudMode] = useState(false);
  
  // Inputs
  const [studName, setStudName] = useState('');
  const [studDna, setStudDna] = useState('');
  const [studPhenotype, setStudPhenotype] = useState('');

  // Layer State (Transforms)
  type LayerId = 'sire' | 'dam' | 'sireLogo' | 'damLogo' | 'studHeader' | 'studName' | 'studPheno' | 'studGeno' | 'watermark';
  const [selectedLayer, setSelectedLayer] = useState<LayerId | null>(null);
  
  const [layerTransforms, setLayerTransforms] = useState<Record<string, { rotate: number, scale: number }>>({
      sire: { rotate: 0, scale: 1 },
      dam: { rotate: 0, scale: 1 },
      sireLogo: { rotate: 0, scale: 1 },
      damLogo: { rotate: 0, scale: 1 },
      studHeader: { rotate: 0, scale: 1 },
      studName: { rotate: 0, scale: 1 },
      studPheno: { rotate: 0, scale: 1 },
      studGeno: { rotate: 0, scale: 1 },
      watermark: { rotate: 0, scale: 1 },
  });

  // Toggles
  const [showStudHeader, setShowStudHeader] = useState(true);
  const [showStudName, setShowStudName] = useState(true);
  const [showPhenotype, setShowPhenotype] = useState(true);
  const [showGenotype, setShowGenotype] = useState(true);

  // Colors
  const [studHeaderColor, setStudHeaderColor] = useState('#ffffff');
  const [studNameColor, setStudNameColor] = useState('#fbbf24');
  const [studDnaColor, setStudDnaColor] = useState('#2dd4bf');
  const [studPhenoColor, setStudPhenoColor] = useState('#ffffff'); // New Pheno Color

  const [bgRemovalError, setBgRemovalError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5' | '9:16'>('1:1');
  const [marketingBg, setMarketingBg] = useState<string>('platinum-vault'); 
  const [aiPrompt, setAiPrompt] = useState(`1:1 Square. ${DEFAULT_SCENE_PROMPT}`);
  const [isGeneratingScene, setIsGeneratingScene] = useState(false);
  const [toggleRefine, setToggleRefine] = useState<'new' | 'refine'>('new');

  // Credit & Session State
  const [userEmail, setUserEmail] = useState('');
  const [showLogin, setShowLogin] = useState(false); 
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false); 
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  
  // Refs
  const marketingRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const dragContainerRef = useRef<HTMLDivElement>(null);
  
  // Draggable Node Refs
  const sireNodeRef = useRef(null);
  const damNodeRef = useRef(null);
  const sireLogoRef = useRef(null);
  const damLogoRef = useRef(null);
  const studHeaderRef = useRef(null);
  const studNameRef = useRef(null);
  const studPhenoRef = useRef(null);
  const studGenoRef = useRef(null);
  const watermarkRef = useRef(null);

  // Parser State
  const [sireDnaInput, setSireDnaInput] = useState('');
  const [damDnaInput, setDamDnaInput] = useState('');

  // Kennel State
  const [savedDogs, setSavedDogs] = useState<SavedDog[]>([]);
  const [dogNameInput, setDogNameInput] = useState('');
  const [showKennel, setShowKennel] = useState(false);
  
  const [singleGender, setSingleGender] = useState<'Male' | 'Female'>('Male');
  const [sire, setSire] = useState({ ...DEFAULT_DNA }); 
  const [dam, setDam] = useState({ ...DEFAULT_DNA });
  const [showLitter, setShowLitter] = useState(false);
  const [selectedPuppy, setSelectedPuppy] = useState<any | null>(null);

  const currentDna = singleGender === 'Male' ? sire : dam;

  const handleSingleModeChange = (key: string, value: string) => {
      if (singleGender === 'Male') setSire(prev => ({ ...prev, [key]: value }));
      else setDam(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
      const stored = localStorage.getItem('okc_kennel');
      if (stored) { try { setSavedDogs(JSON.parse(stored)); } catch (e) { console.error("Kennel load failed", e); } }
      const storedEmail = localStorage.getItem('okc_user_email');
      if (storedEmail) { setUserEmail(storedEmail); fetchCredits(storedEmail); }
  }, []);

  useEffect(() => { if (mode === 'pair') setShowLitter(true); }, [sire, dam, mode]);

  // Update transform for a layer
  const updateTransform = (key: string, value: number) => {
      if (!selectedLayer) return;
      setLayerTransforms(prev => ({
          ...prev,
          [selectedLayer]: {
              ...prev[selectedLayer],
              [key]: value
          }
      }));
  };

  const getRatioLabel = (ratio: '1:1' | '4:5' | '9:16') => {
      if (ratio === '4:5') return '4:5 Portrait';
      if (ratio === '9:16') return '9:16 Story';
      return '1:1 Square';
  };

  const handleRatioChange = (newRatio: '1:1' | '4:5' | '9:16') => {
      setAspectRatio(newRatio);
      const ratioText = getRatioLabel(newRatio);
      const currentDesc = aiPrompt.replace(/^(1:1 Square|4:5 Portrait|9:16 Story)\.?\s*/, '');
      setAiPrompt(`${ratioText}. ${currentDesc}`);
      if (marketingBg.startsWith('data:')) setToggleRefine('refine');
  };

  const handlePresetSelect = (text: string) => {
      const ratioText = getRatioLabel(aspectRatio);
      setAiPrompt(`${ratioText}. ${text}`);
  };

  const toggleTranslatorGender = (newGender: 'Male' | 'Female') => setSingleGender(newGender);

  // --- KENNEL LOGIC ---
  const saveDog = (target: 'sire' | 'dam') => {
      if (!dogNameInput.trim()) { alert("Please name your dog before saving."); return; }
      let dnaToSave = { ...DEFAULT_DNA };
      let genderToSave: 'Male' | 'Female' = 'Male';

      if (mode === 'single') {
          if (singleGender === 'Male') { dnaToSave = { ...sire }; genderToSave = 'Male'; } 
          else { dnaToSave = { ...dam }; genderToSave = 'Female'; }
      } else {
          dnaToSave = target === 'sire' ? { ...sire } : { ...dam };
          genderToSave = target === 'sire' ? 'Male' : 'Female';
      }

      const newDog: SavedDog = { id: Date.now().toString(), name: dogNameInput, gender: genderToSave, dna: dnaToSave, date: new Date().toLocaleDateString() };
      const updated = [newDog, ...savedDogs].slice(0, 20); 
      setSavedDogs(updated);
      localStorage.setItem('okc_kennel', JSON.stringify(updated));
      setDogNameInput('');
      setShowKennel(true); 
  };

  const loadDogSmart = (dog: SavedDog) => {
      if (mode === 'single') {
          setSingleGender(dog.gender);
          if (dog.gender === 'Male') setSire(dog.dna); else setDam(dog.dna);
          if (mode === 'marketing' && isStudMode) setStudName(dog.name);
      } else {
          if (dog.gender === 'Male') setSire(dog.dna); else setDam(dog.dna);
      }
      setShowKennel(false);
  };

  const removeDog = (id: string) => {
      const updated = savedDogs.filter(dog => dog.id !== id);
      setSavedDogs(updated);
      localStorage.setItem('okc_kennel', JSON.stringify(updated));
  }

  // --- SUPABASE CREDITS ---
  const fetchCredits = async (email: string) => {
      if (!email) return;
      setIsUnlocking(true); 
      const { data, error } = await supabase.from('user_credits').select('credits_remaining').eq('email', email).single();
      setIsUnlocking(false);
      if (data) {
          setCredits(data.credits_remaining);
          alert(`Logged in as ${email}. Credits available: ${data.credits_remaining}`);
          setShowLogin(false); 
      } else if (error) {
          setCredits(0);
          if (email.includes('@')) alert("Account found but no credits available.");
      }
  };

  const handleLoginSubmit = () => {
      if (userEmail.includes('@')) { localStorage.setItem('okc_user_email', userEmail); fetchCredits(userEmail); } 
      else alert("Please enter a valid email.");
  };

  // --- GENETIC LOGIC ---
  const getPhenotype = useMemo(() => (dna: any): VisualTraits => {
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
    const isFluffy = recessiveL === 2;
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

    if (isFluffy) phenotypeParts.push("Fluffy");
    if (hasMerle && !isCream && !isWhiteMasked) phenotypeParts.push("Merle"); 
    if (hasFurnishings) phenotypeParts.push("Visual Furnishings");
    if (isVisualEA) phenotypeParts.push("Visual eA");
    
    if (isPink) { phenotypeParts.push("Pink (Albino)"); proTips.push("Pro Tip: Pink is a form of Albinism; eye color will be pink/red."); }
    else if (isCream) { phenotypeParts.push("Cream"); if (hasMerle) proTips.push("Pro Tip: Merle is 'Ghosted' (hidden) by Cream (e/e)."); }
    else if (isSolidBlack) { phenotypeParts.push(`Solid ${baseColorName}`); }
    else if (hasAy) phenotypeParts.push(`Fawn ${baseColorName}`);
    else if (hasAw) phenotypeParts.push(`Sable ${baseColorName}`);
    else phenotypeParts.push(baseColorName);

    if (hasAt && !isSolidBlack && !isCream && !isPink && !isWhiteMasked) {
        if (isBrindle) phenotypeParts.push("Trindle"); else phenotypeParts.push("with Tan Points");
    } else if (isBrindle && !isSolidBlack && !isCream && !isPink && !isWhiteMasked) { phenotypeParts.push("Brindle"); }
    
    if (isFullPied) phenotypeParts.push("Full Pied"); else if (hasPied) phenotypeParts.push("Visual Pied");

    if (isWhiteMasked) { phenotypeParts.push("(Likely Covered in Cream)"); proTips.push("Pro Tip: High Intensity + Pied chemically masks the coat to White/Cream, hiding the base color."); }

    if (isBlueCarrier) proTips.push("Blue Carrier (n/d)");
    if (isCocoaCarrier) proTips.push("Cocoa Carrier (n/co)");
    if (isRojoCarrier) proTips.push("Rojo Carrier (N/b)");
    if (isPinkCarrier) proTips.push("Pink Carrier (n/A)");
    if (hasIntensityMod) proTips.push("Intensity Modifier Present");
    if (hasEA && !isVisualEA) proTips.push("eA Carrier (Hidden)");

    // Layers
    if (isWhiteMasked) layers.push('base-cream.png'); 
    else if (isPink) layers.push(isFluffy ? 'base-fluffy-pink.png' : 'base-pink.png');
    else if (isCream) layers.push('base-cream.png');
    else if (hasAy && !isBrindle && !isSolidBlack) layers.push('base-fawn.png');
    else if (hasAw && !isBrindle && !isSolidBlack) layers.push('base-sable.png');
    else {
        if (isFluffy) layers.push(`base-${visualBase}-fluffy.png`); 
        else layers.push(`base-${visualBase}.png`);
    }

    if (!isWhiteMasked) {
        if (isVisualEA && !isCream && !isPink) layers.push('overlay-ea.png');
        else if (hasAt && !isBrindle && !isCream && !isPink && !isSolidBlack) layers.push('overlay-tan-points.png');
        if (hasEm && !isCream && !isPink && !isVisualEA && !isSolidBlack) layers.push('overlay-mask.png');
        if (hasMerle && !isCream) {
            if (isPink) layers.push('overlay-merle-pink.png'); 
            else {
                if (hasAy || hasAw) layers.push('overlay-merle-fawn.png');
                else if (['black', 'blue'].includes(baseColorSlug)) layers.push('overlay-merle-black.png'); 
                else if (baseColorSlug === 'lilac') layers.push('overlay-merle-gray.png');
                else if (['cocoa', 'isabella', 'rojo', 'new-shade-isabella'].includes(baseColorSlug)) layers.push('overlay-merle-tan.png'); 
                else layers.push('overlay-merle-black.png');
            }
        }
        if (!isCream && !isPink) { if (isFullPied) layers.push('overlay-pied.png'); else if (hasPied) layers.push('overlay-pied-carrier.png'); }
        if (isBrindle) layers.push('overlay-brindle.png');
        if (dna.Panda === 'Panda' || dna.Panda === 'Koi') layers.push('overlay-husky.png');
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
  }, []);

  // --- DNA PARSER ---
  const handleParseDNA = (target: 'sire' | 'dam') => {
      const input = target === 'sire' ? sireDnaInput : damDnaInput;
      if (!input.trim()) return;
      const text = input.trim();
      const prevDna = target === 'sire' ? sire : dam;
      const newDna: any = { ...prevDna }; 
      
      if (text.includes('n/A') || text.includes('A/n')) newDna.Pink = 'n/A';
      if (text.includes('A/A')) newDna.Pink = 'A/A';
      if (text.includes('B/b') || text.includes('b/B')) newDna.B = 'N/b';
      if (text.includes('b/b')) newDna.B = 'b/b';
      if (text.includes('d/d')) newDna.D = 'd/d';
      if (text.includes('D/d')) newDna.D = 'N/d';
      if (text.includes('co/co')) newDna.Co = 'co/co';
      if (text.includes('N/co') || text.includes('n/co') || text.includes('Co/co')) newDna.Co = 'N/co';
      if (text.includes('at/at')) newDna.A = 'at/at';
      if (text.includes('a/a')) newDna.A = 'a/a';
      if (text.includes('L/l1')) newDna.L = 'L/l1';
      if (text.includes('l1/l1')) newDna.L = 'l1/l1';
      if (text.includes('Em/e')) newDna.E = 'Em/e';
      if (text.includes('e/e')) newDna.E = 'e/e';
      if (text.includes('n/F') || text.includes('F/n')) newDna.F = 'n/F';
      if (text.includes('F/F')) newDna.F = 'F/F';
      if (text.includes('n/S') || text.includes('S/n')) newDna.S = 'n/S';
      if (text.includes('S/S')) newDna.S = 'S/S';
      if (text.includes('KB') || text.includes('KB/KB')) newDna.K = 'KB/KB';
      else if (text.includes('n/KB') || text.includes('n/Kbr')) newDna.K = 'n/Kbr';

      if (target === 'sire') { setSire(newDna); setSireDnaInput(''); }
      else { setDam(newDna); setDamDnaInput(''); }
  };

  // Helper to resize image client-side to prevent edge timeouts
  const resizeImage = async (blobUrl: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = blobUrl;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const MAX_SIZE = 1200; // Efficient size for API

            if (width > height) {
                if (width > MAX_SIZE) {
                    height *= MAX_SIZE / width;
                    width = MAX_SIZE;
                }
            } else {
                if (height > MAX_SIZE) {
                    width *= MAX_SIZE / height;
                    height = MAX_SIZE;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            
            // Export as JPEG 0.85 for efficient upload
            canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else reject(new Error("Image processing failed"));
            }, 'image/jpeg', 0.85);
        };
        img.onerror = (e) => reject(e);
    });
  };

  const removeBackgroundPhotoRoom = async (imageInput: string | Blob): Promise<string | null> => {
    try {
        let blob: Blob;
        if (typeof imageInput === 'string') {
            const response = await fetch(imageInput);
            blob = await response.blob();
        } else {
            blob = imageInput;
        }
        
        // --- NEW SERVER-SIDE CALL ---
        const formData = new FormData();
        formData.append('image_file', blob, 'image.jpg');
        
        // Use our local API route instead of direct call
        const res = await fetch('/api/remove-bg', {
            method: 'POST',
            body: formData
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Status ${res.status}: ${errorText}`);
        }
        
        const resultBlob = await res.blob();
        return URL.createObjectURL(resultBlob);
    } catch (e: any) {
        console.error("Background Removal Exception:", e);
        setBgRemovalError(`Error: ${e.message || "Failed to connect to removal service."}`);
        return null;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'sire' | 'dam' | 'sireLogo' | 'damLogo') => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      const originalUrl = URL.createObjectURL(file);

      // Set initial preview
      if (type === 'sire') setSireImage(originalUrl);
      else if (type === 'dam') setDamImage(originalUrl);
      else if (type === 'sireLogo') setSireLogo(originalUrl);
      else if (type === 'damLogo') setDamLogo(originalUrl);

      // --- AUTO REMOVE IF UNLOCKED ---
      if ((type === 'sire' || type === 'dam') && isUnlocked) {
          setIsProcessingImage(true);
          try {
              // 1. Resize client-side first
              const resizedBlob = await resizeImage(originalUrl);
              // 2. Upload to API
              const cleanUrl = await removeBackgroundPhotoRoom(resizedBlob);
              
              if (cleanUrl) {
                  if (type === 'sire') setSireImage(cleanUrl);
                  else setDamImage(cleanUrl);
              }
          } catch (err) {
              console.error("Auto-remove failed", err);
              // Error is set in removeBackgroundPhotoRoom
          } finally {
              setIsProcessingImage(false);
          }
      }
  };

  const removePhoto = (type: 'sire' | 'dam' | 'sireLogo' | 'damLogo') => {
      if (type === 'sire') setSireImage(null);
      if (type === 'dam') setDamImage(null);
      if (type === 'sireLogo') setSireLogo(null);
      if (type === 'damLogo') setDamLogo(null);
  };

  const handlePromoSubmit = async () => {
      if (promoCodeInput.toUpperCase() === FREEBIE_CODE) {
          setCredits(prev => (prev || 0) + 1);
          setPromoCodeInput('');
          setShowPaywall(false);
          
          setIsUnlocking(true);
          setIsUnlocked(true); // Immediate unlock UI
          
          try {
              // Retroactive cleaning if images exist
              if (sireImage && !sireImage.startsWith('blob:http') && !sireImage.includes('remove-bg')) {
                   const blob = await resizeImage(sireImage);
                   const clean = await removeBackgroundPhotoRoom(blob);
                   if (clean) setSireImage(clean);
              }
              if (damImage) {
                   const blob = await resizeImage(damImage);
                   const clean = await removeBackgroundPhotoRoom(blob);
                   if (clean) setDamImage(clean);
              }
          } catch (e) {
              console.error("Background unlock cleanup failed", e);
          } finally {
              setIsUnlocking(false);
          }
      } else {
          alert("Invalid Code");
      }
  };

  const performUnlock = async (availableCredits: number) => {
      // (Deprecated logic for button click, kept for reference if needed)
      // New logic handles real-time via toggle or auto-on-upload
  };

  const handleUnlockClick = () => { setShowPaywall(true); };

  const handleGenerateScene = async () => {
      if (!aiPrompt.trim()) return;
      setIsGeneratingScene(true);
      setBgRemovalError(null);
      
      const strictPrompt = `${aiPrompt}, empty room, architectural background only, no dogs, no animals, no people, no text, no logos, no living creatures, high quality interior design photography.`;
      const arString = aspectRatio === '1:1' ? '1:1' : aspectRatio === '4:5' ? '4:5' : '9:16';
      const augmentedPrompt = `${strictPrompt} --ar ${arString} --v 6.0`;

      try {
          // --- API KEY PRIORITY ---
          const apiKey = process.env.API_KEY || (typeof window !== 'undefined' ? window.DEV_KEY : undefined);
          
          if (!apiKey) {
              throw new Error("API Key Missing. Set window.DEV_KEY in console if previewing.");
          }

          const ai = new GoogleGenAI({ apiKey });
          let contentsPayload: any;

          if ((toggleRefine === 'refine' || marketingBg.startsWith('data:')) && marketingBg.length > 100) {
              const base64Data = marketingBg.split(',')[1];
              contentsPayload = {
                  parts: [
                      { inlineData: { mimeType: 'image/png', data: base64Data } },
                      { text: `Refine this scene to fit ${arString} aspect ratio. Maintain style. ${augmentedPrompt}` }
                  ]
              };
          } else {
              contentsPayload = { parts: [{ text: augmentedPrompt }] };
          }

          let ratioConfig = "1:1";
          if (aspectRatio === '4:5') ratioConfig = "3:4";
          if (aspectRatio === '9:16') ratioConfig = "9:16";

          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash-image',
              contents: contentsPayload,
              config: { imageConfig: { aspectRatio: ratioConfig } } 
          });
          
          if (response.candidates && response.candidates[0].content.parts) {
              for (const part of response.candidates[0].content.parts) {
                  if (part.inlineData) {
                      setMarketingBg(`data:image/png;base64,${part.inlineData.data}`);
                      break;
                  }
              }
          }
      } catch (e: any) {
          console.error("AI Gen Failed", e);
          setBgRemovalError(`AI Generation Failed. ${e.message}`);
      } finally {
          setIsGeneratingScene(false);
      }
  };

  const handleFreeExport = async () => {
      if (!marketingRef.current) return;
      setSelectedLayer(null); 
      if ((window as any).html2canvas) {
        const canvas = await (window as any).html2canvas(marketingRef.current, { scale: 2, useCORS: true, allowTaint: true }); 
        const link = document.createElement('a');
        link.download = 'OKC_Studio_Draft.png';
        link.href = canvas.toDataURL();
        link.click();
      }
  };

  const handleProExport = async () => {
      if (!marketingRef.current || !isUnlocked) return;
      setSelectedLayer(null);
      if ((window as any).html2canvas) {
        const canvas = await (window as any).html2canvas(marketingRef.current, { scale: 3, useCORS: true, allowTaint: true }); 
        const link = document.createElement('a');
        link.download = 'OKC_Studio_Pro.png';
        link.href = canvas.toDataURL();
        link.click();
      }
  };

  const handleDownloadReport = async () => {
      if (!reportRef.current) return;
      if ((window as any).html2canvas) {
        const canvas = await (window as any).html2canvas(reportRef.current, { scale: 2, useCORS: true, allowTaint: true }); 
        const link = document.createElement('a');
        link.download = 'OKC_Pairing_Report.png';
        link.href = canvas.toDataURL();
        link.click();
      }
  };

  // --- LITTER CALC ---
  const calculateLitter = useMemo(() => {
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
      const phenotypes: Record<string, { dna: any, prob: number, count: number }> = {};
      results.forEach(res => {
          const traits = getPhenotype(res.dna);
          const name = traits.phenotypeName; 
          if (!phenotypes[name]) { phenotypes[name] = { dna: res.dna, prob: 0, count: 0 }; }
          phenotypes[name].prob += res.prob;
          phenotypes[name].count += 1;
      });
      return Object.values(phenotypes).sort((a, b) => b.prob - a.prob).slice(0, 12).map(item => ({ dna: item.dna, probability: (item.prob * 100).toFixed(1) + '%' }));
  }, [sire, dam, getPhenotype]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pt-32 pb-20 px-4 md:px-6 font-sans relative">
       <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay pointer-events-none"></div>
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-luxury-teal/5 rounded-full blur-[120px] pointer-events-none"></div>

       {/* HEADER */}
       <div className="max-w-7xl mx-auto text-center mb-10 relative z-10">
            <h1 className="font-serif text-5xl md:text-7xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-luxury-teal via-white to-luxury-magenta animate-shine">
            DNA MATRIX
            </h1>
            <p className="text-luxury-teal text-xs tracking-[0.4em] uppercase">Breeder Marketing & Genetics Suite</p>
            
            <div className="flex justify-center gap-4 mt-8">
                <button onClick={() => setMode('single')} className={`px-6 py-2 text-[10px] uppercase font-bold tracking-widest border transition-all ${mode==='single' ? 'bg-luxury-teal text-black shadow-[0_0_20px_rgba(45,212,191,0.3)]' : 'border-slate-800 text-slate-500'}`}>Translator</button>
                <button onClick={() => setMode('pair')} className={`px-6 py-2 text-[10px] uppercase font-bold tracking-widest border transition-all ${mode==='pair' ? 'bg-luxury-magenta text-black shadow-[0_0_20px_rgba(217,70,239,0.3)]' : 'border-slate-800 text-slate-500'}`}>Pairing Matrix</button>
                <button onClick={() => setMode('marketing')} className={`px-6 py-2 text-[10px] uppercase font-bold tracking-widest border transition-all ${mode==='marketing' ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'border-slate-800 text-slate-500'}`}>Marketing Studio</button>
            </div>
       </div>

       <div className="max-w-7xl mx-auto relative z-10">
            {/* Input for Dog Name (For saving) */}
            {mode !== 'marketing' && (
                <div className="flex justify-center mb-6">
                    <div className="flex gap-2">
                         <input 
                            value={dogNameInput}
                            onChange={(e) => setDogNameInput(e.target.value)}
                            placeholder="Enter Dog Name to Save..."
                            className="bg-black/40 border border-slate-700 p-2 text-xs text-white outline-none w-64 rounded-sm focus:border-luxury-teal"
                         />
                    </div>
                </div>
            )}

            {/* --- VISUALIZERS (Hidden in Marketing Mode) --- */}
            {mode !== 'marketing' && (
                <div className="mb-8">
                     {/* ... (Existing Visualizer Code Logic for Single/Pair modes remains similar but truncated for brevity in this delta update) ... */}
                     {/* Keep your existing Single/Pair mode JSX here, it is unchanged except for the shared state usage */}
                     {mode === 'single' ? (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-slate-900/50 border border-slate-800 p-6 rounded-sm">
                             <div className="md:col-span-5 flex items-center justify-center bg-black/40 rounded-sm border border-slate-800 p-4 relative">
                                 <div className="w-full max-w-[300px]">
                                    <DogVisualizer traits={getPhenotype(currentDna)} scale={1} />
                                 </div>
                             </div>
                             <div className="md:col-span-7">
                                 <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                                     <div>
                                         <h2 className="font-serif text-2xl text-white">{getPhenotype(currentDna).phenotypeName}</h2>
                                         <p className="text-luxury-teal text-[10px] uppercase tracking-widest">Visual Analysis</p>
                                     </div>
                                     {/* ... controls ... */}
                                 </div>
                                 {/* ... genetic selects ... */}
                                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                     {Object.keys(LOCI).map(key => (
                                        <div key={key} className="flex justify-between items-center bg-black/40 px-3 py-2 rounded-sm border border-slate-800 hover:border-luxury-teal/30">
                                            <label className="text-[10px] text-slate-400 uppercase font-bold">{(LOCI as any)[key].label}</label>
                                            <select value={(currentDna as any)[key]} onChange={(e) => handleSingleModeChange(key, e.target.value)} className="bg-transparent text-right text-[11px] text-white outline-none font-mono cursor-pointer ml-2">
                                                {(LOCI as any)[key].options.map((o: string) => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        </div>
                                    ))}
                                 </div>
                             </div>
                        </div>
                     ) : (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Pair Mode UI */}
                                <div className="bg-slate-900/30 border border-luxury-teal/30 p-4 rounded-sm flex flex-col">
                                    <h3 className="text-luxury-teal font-serif text-lg mb-4">SIRE</h3>
                                    <div className="flex justify-center mb-6 h-48"><DogVisualizer traits={getPhenotype(sire)} showLabel={true} /></div>
                                    <div className="grid grid-cols-2 gap-2 mt-auto">
                                        {Object.keys(LOCI).map(key => (
                                            <div key={key} className="flex justify-between items-center bg-black/40 px-2 py-1 border border-slate-800">
                                                <label className="text-[9px] text-slate-500 uppercase">{(LOCI as any)[key].label}</label>
                                                <select value={(sire as any)[key]} onChange={(e) => setSire({...sire, [key]: e.target.value})} className="bg-transparent text-[10px] text-white outline-none font-mono text-right w-1/2">
                                                    {(LOCI as any)[key].options.map((o: string) => <option key={o} value={o}>{o}</option>)}
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-slate-900/30 border border-luxury-magenta/30 p-4 rounded-sm flex flex-col">
                                    <h3 className="text-luxury-magenta font-serif text-lg mb-4">DAM</h3>
                                    <div className="flex justify-center mb-6 h-48"><DogVisualizer traits={getPhenotype(dam)} showLabel={true} /></div>
                                    <div className="grid grid-cols-2 gap-2 mt-auto">
                                        {Object.keys(LOCI).map(key => (
                                            <div key={key} className="flex justify-between items-center bg-black/40 px-2 py-1 border border-slate-800">
                                                <label className="text-[9px] text-slate-500 uppercase">{(LOCI as any)[key].label}</label>
                                                <select value={(dam as any)[key]} onChange={(e) => setDam({...dam, [key]: e.target.value})} className="bg-transparent text-[10px] text-white outline-none font-mono text-right w-1/2">
                                                    {(LOCI as any)[key].options.map((o: string) => <option key={o} value={o}>{o}</option>)}
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {showLitter && (
                                <div className="bg-black/30 border border-slate-800 p-6 rounded-sm">
                                     <h2 className="text-xl font-serif text-white mb-6">Projected Litter</h2>
                                     <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                         {calculateLitter.map((item, idx) => (
                                             <div key={idx} onClick={() => setSelectedPuppy(item.dna)} className="cursor-pointer bg-black/40 border border-slate-800 p-2 rounded-sm relative group hover:border-luxury-teal/50 transition-colors">
                                                 <div className="absolute top-1 right-1 z-20 px-1 bg-black/60 rounded text-[9px] font-bold text-luxury-teal">{item.probability}</div>
                                                 <div className="mb-2 h-24 relative"><DogVisualizer traits={getPhenotype(item.dna)} scale={0.65} showLabel={false} /></div>
                                                 <span className="block text-center text-[8px] text-slate-300 uppercase tracking-tight leading-tight px-1 h-8 overflow-hidden">{getPhenotype(item.dna).phenotypeName}</span>
                                             </div>
                                         ))}
                                     </div>
                                </div>
                            )}
                        </div>
                     )}
                </div>
            )}

            {/* --- MARKETING STUDIO OVERHAUL --- */}
            {mode === 'marketing' && (
                <div className="flex flex-col lg:flex-row gap-12 items-start justify-center">
                    
                    {/* Controls Sidebar (Mobile: Top, Desktop: Right) */}
                    <div className="flex-1 w-full min-w-[300px] max-w-md space-y-6 order-1 lg:order-2">
                        
                        {/* Error Message */}
                        {bgRemovalError && (
                            <div className="bg-red-900/20 border border-red-900/50 p-4 rounded-sm flex items-start gap-3">
                                <AlertTriangle className="text-red-500 mt-0.5" size={16} />
                                <div>
                                    <h4 className="text-red-400 text-xs font-bold uppercase tracking-widest mb-1">Process Error</h4>
                                    <p className="text-[10px] text-red-300 leading-relaxed">{bgRemovalError}</p>
                                </div>
                            </div>
                        )}

                        <div className="bg-slate-900/50 border border-indigo-500/20 p-6 rounded-sm">
                            
                            {/* Layer Control Panel (Dynamic) */}
                            {selectedLayer && (
                                <div className="mb-6 bg-black/40 border border-indigo-500/50 p-4 rounded-sm animate-in fade-in slide-in-from-top-2">
                                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                                            Edit: {selectedLayer.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                        <button onClick={() => setSelectedLayer(null)} className="text-slate-500 hover:text-white"><X size={12}/></button>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <label className="text-[9px] uppercase text-slate-400 flex items-center gap-1"><RotateCw size={10}/> Rotate</label>
                                                <span className="text-[9px] text-white">{Math.round(layerTransforms[selectedLayer].rotate)}°</span>
                                            </div>
                                            <input 
                                                type="range" min="0" max="360" step="1"
                                                value={layerTransforms[selectedLayer].rotate}
                                                onChange={(e) => updateTransform('rotate', parseInt(e.target.value))}
                                                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <label className="text-[9px] uppercase text-slate-400 flex items-center gap-1"><Scaling size={10}/> Scale</label>
                                                <span className="text-[9px] text-white">{layerTransforms[selectedLayer].scale.toFixed(1)}x</span>
                                            </div>
                                            <input 
                                                type="range" min="0.1" max="3.0" step="0.1"
                                                value={layerTransforms[selectedLayer].scale}
                                                onChange={(e) => updateTransform('scale', parseFloat(e.target.value))}
                                                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Stud Mode Toggle */}
                            <div className="flex flex-col gap-4 mb-6 bg-black/30 p-3 rounded-sm border border-slate-800">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Crown size={16} className={isStudMode ? "text-amber-400" : "text-slate-500"} />
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isStudMode ? 'text-amber-400' : 'text-slate-300'}`}>
                                            {isStudMode ? 'Stud Mode Active' : 'Pairing Mode Active'}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => setIsStudMode(!isStudMode)} 
                                        className={`w-8 h-4 rounded-full relative transition-colors ${isStudMode ? 'bg-amber-500' : 'bg-slate-700'}`}
                                    >
                                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isStudMode ? 'left-4.5' : 'left-0.5'}`} style={{ left: isStudMode ? '1.1rem' : '0.1rem' }}></div>
                                    </button>
                                </div>
                                
                                {isStudMode && (
                                    <div className="mt-2 pt-2 border-t border-slate-800 animate-in fade-in slide-in-from-top-2 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[9px] text-slate-500 uppercase tracking-wider block mb-1">Stud Name</label>
                                                <input 
                                                    value={studName}
                                                    onChange={(e) => setStudName(e.target.value)}
                                                    placeholder="e.g. VIPER"
                                                    className="w-full bg-slate-900 border border-slate-700 p-2 text-[10px] text-white outline-none focus:border-amber-400"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] text-slate-500 uppercase tracking-wider block mb-1">Phenotype Text</label>
                                                <input 
                                                    value={studPhenotype}
                                                    onChange={(e) => setStudPhenotype(e.target.value)}
                                                    placeholder={getPhenotype(sire).phenotypeName}
                                                    className="w-full bg-slate-900 border border-slate-700 p-2 text-[10px] text-white outline-none focus:border-amber-400 font-sans"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[9px] text-slate-500 uppercase tracking-wider block mb-1">Genotype String</label>
                                            <input 
                                                value={studDna}
                                                onChange={(e) => setStudDna(e.target.value)}
                                                placeholder="e.g. at/at co/co d/d"
                                                className="w-full bg-slate-900 border border-slate-700 p-2 text-[10px] text-white outline-none focus:border-amber-400 font-mono"
                                            />
                                        </div>

                                        {/* Overlay Customization */}
                                        <div className="bg-black/20 p-2 rounded border border-slate-800">
                                            <span className="block text-[9px] text-slate-500 uppercase tracking-wider mb-2 font-bold">Visibility & Colors</span>
                                            
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-[9px] text-slate-400">Header</label>
                                                    <button onClick={() => setShowStudHeader(!showStudHeader)} className="text-slate-400 hover:text-white">
                                                        {showStudHeader ? <ToggleRight className="text-emerald-400" size={20}/> : <ToggleLeft size={20}/>}
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <label className="text-[9px] text-slate-400">Name</label>
                                                    <button onClick={() => setShowStudName(!showStudName)} className="text-slate-400 hover:text-white">
                                                        {showStudName ? <ToggleRight className="text-emerald-400" size={20}/> : <ToggleLeft size={20}/>}
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <label className="text-[9px] text-slate-400">Phenotype</label>
                                                    <button onClick={() => setShowPhenotype(!showPhenotype)} className="text-slate-400 hover:text-white">
                                                        {showPhenotype ? <ToggleRight className="text-emerald-400" size={20}/> : <ToggleLeft size={20}/>}
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <label className="text-[9px] text-slate-400">Genotype</label>
                                                    <button onClick={() => setShowGenotype(!showGenotype)} className="text-slate-400 hover:text-white">
                                                        {showGenotype ? <ToggleRight className="text-emerald-400" size={20}/> : <ToggleLeft size={20}/>}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-4 gap-2 border-t border-white/10 pt-2">
                                                <div>
                                                    <label className="text-[8px] text-slate-500 block mb-1">Header</label>
                                                    <input type="color" value={studHeaderColor} onChange={(e) => setStudHeaderColor(e.target.value)} className="w-full h-6 bg-transparent border-none cursor-pointer"/>
                                                </div>
                                                <div>
                                                    <label className="text-[8px] text-slate-500 block mb-1">Name</label>
                                                    <input type="color" value={studNameColor} onChange={(e) => setStudNameColor(e.target.value)} className="w-full h-6 bg-transparent border-none cursor-pointer"/>
                                                </div>
                                                <div>
                                                    <label className="text-[8px] text-slate-500 block mb-1">Pheno</label>
                                                    <input type="color" value={studPhenoColor} onChange={(e) => setStudPhenoColor(e.target.value)} className="w-full h-6 bg-transparent border-none cursor-pointer"/>
                                                </div>
                                                <div>
                                                    <label className="text-[8px] text-slate-500 block mb-1">Geno</label>
                                                    <input type="color" value={studDnaColor} onChange={(e) => setStudDnaColor(e.target.value)} className="w-full h-6 bg-transparent border-none cursor-pointer"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Logo Uploads */}
                            <div className="mb-4 grid grid-cols-2 gap-2">
                                <div className="relative group h-20">
                                    <label className="flex flex-col items-center justify-center p-3 border border-dashed border-slate-700 hover:border-indigo-500 cursor-pointer bg-black/20 h-full w-full transition-colors">
                                        {sireLogo ? <img src={sireLogo} className="h-full w-full object-contain" /> : <><Upload size={12} className="mb-1 text-slate-500"/><span className="text-[8px] uppercase text-slate-500">Sire Logo</span></>}
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'sireLogo')} />
                                    </label>
                                    {sireLogo && <button onClick={() => removePhoto('sireLogo')} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"><X size={8}/></button>}
                                </div>
                                <div className="relative group h-20">
                                    <label className="flex flex-col items-center justify-center p-3 border border-dashed border-slate-700 hover:border-purple-500 cursor-pointer bg-black/20 h-full w-full transition-colors">
                                            {damLogo ? <img src={damLogo} className="h-full w-full object-contain" /> : <><Upload size={12} className="mb-1 text-slate-500"/><span className="text-[8px] uppercase text-slate-500">Dam Logo</span></>}
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'damLogo')} />
                                    </label>
                                    {damLogo && <button onClick={() => removePhoto('damLogo')} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"><X size={8}/></button>}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Photo Uploads (Container with Toggle Above) */}
                                <div className="bg-slate-900/30 p-2 rounded border border-slate-800/50">
                                    <div className="flex justify-between items-center mb-3 px-1">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 block">Auto-Remove Background</span>
                                            <span className="text-[8px] text-slate-500">Applies to uploaded Sire/Dam images</span>
                                        </div>
                                        <button 
                                            onClick={() => !isUnlocked ? setShowPaywall(true) : null}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                                                isUnlocked 
                                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                                                : 'bg-black/40 border-slate-700 text-slate-500 hover:border-luxury-gold hover:text-luxury-gold'
                                            }`}
                                        >
                                            {isUnlocked ? (
                                                <><Check size={12} /> <span className="text-[9px] font-bold uppercase">Active</span></>
                                            ) : (
                                                <><Lock size={12} /> <span className="text-[9px] font-bold uppercase">Locked</span></>
                                            )}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <label className="block p-4 bg-black/40 border border-slate-700 hover:border-indigo-500 cursor-pointer text-center rounded-sm relative group h-40 flex flex-col items-center justify-center transition-colors overflow-hidden">
                                                {isProcessingImage && (
                                                    <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center">
                                                        <Loader2 className="animate-spin text-indigo-500" size={24}/>
                                                        <span className="text-[8px] uppercase tracking-widest text-white mt-2">Processing...</span>
                                                    </div>
                                                )}
                                                {sireImage ? (
                                                    <img src={sireImage} className="max-h-full max-w-full object-contain" /> 
                                                ) : (
                                                    <span className="text-[10px] uppercase text-slate-500 font-bold">Select Sire</span>
                                                )}
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'sire')} />
                                            </label>
                                            
                                            {sireImage && (
                                                <button onClick={() => removePhoto('sire')} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full z-10"><X size={10}/></button>
                                            )}
                                        </div>
                                        
                                        <div className="relative">
                                            <label className="block p-4 bg-black/40 border border-slate-700 hover:border-purple-500 cursor-pointer text-center rounded-sm relative group h-40 flex flex-col items-center justify-center transition-colors overflow-hidden">
                                                {isProcessingImage && (
                                                    <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center">
                                                        <Loader2 className="animate-spin text-purple-500" size={24}/>
                                                        <span className="text-[8px] uppercase tracking-widest text-white mt-2">Processing...</span>
                                                    </div>
                                                )}
                                                {damImage ? (
                                                    <img src={damImage} className="max-h-full max-w-full object-contain" /> 
                                                ) : (
                                                    <span className="text-[10px] uppercase text-slate-500 font-bold">Select Dam</span>
                                                )}
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'dam')} />
                                            </label>

                                            {damImage && (
                                                <button onClick={() => removePhoto('dam')} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full z-10"><X size={10}/></button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* AI SCENE DESIGNER */}
                                <div className="bg-black/40 p-3 border border-slate-700 rounded-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] uppercase text-indigo-400 font-bold flex items-center gap-1"><Wand2 size={12}/> AI Scene Designer</span>
                                        
                                        {/* Ratio Toggles */}
                                        <div className="flex bg-slate-800 rounded p-0.5">
                                            <button onClick={() => handleRatioChange('1:1')} className={`px-2 py-0.5 text-[8px] uppercase font-bold rounded-sm transition-all ${aspectRatio === '1:1' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>1:1</button>
                                            <button onClick={() => handleRatioChange('4:5')} className={`px-2 py-0.5 text-[8px] uppercase font-bold rounded-sm transition-all ${aspectRatio === '4:5' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>4:5</button>
                                            <button onClick={() => handleRatioChange('9:16')} className={`px-2 py-0.5 text-[8px] uppercase font-bold rounded-sm transition-all ${aspectRatio === '9:16' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>9:16</button>
                                        </div>
                                    </div>
                                    
                                    {/* Action Toggle */}
                                    <div className="flex justify-center mb-4">
                                        <div className="relative bg-slate-800 p-1 rounded-full flex gap-1 items-center">
                                            <button 
                                                onClick={() => setToggleRefine('new')}
                                                className={`px-4 py-1 rounded-full text-[9px] uppercase font-bold transition-all ${toggleRefine === 'new' ? 'bg-luxury-teal text-black' : 'text-slate-400'}`}
                                            >
                                                New Scene
                                            </button>
                                            <button 
                                                onClick={() => setToggleRefine('refine')}
                                                className={`px-4 py-1 rounded-full text-[9px] uppercase font-bold transition-all ${toggleRefine === 'refine' ? 'bg-luxury-magenta text-black' : 'text-slate-400'}`}
                                                disabled={!marketingBg.startsWith('data:')}
                                            >
                                                Refine to Fit
                                            </button>
                                        </div>
                                    </div>

                                    {/* Preset Prompts */}
                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        {PROMPTS.map((p, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => handlePresetSelect(p.text)}
                                                className="text-[8px] uppercase font-bold border border-slate-700 bg-slate-900/50 p-2 hover:border-luxury-teal hover:text-luxury-teal transition-all text-left truncate"
                                                title={p.name}
                                            >
                                                {p.name}
                                            </button>
                                        ))}
                                    </div>

                                    <textarea 
                                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white mb-2 h-24 resize-none focus:border-indigo-500 outline-none"
                                        placeholder="Or describe custom scene..."
                                        value={aiPrompt}
                                        onChange={(e) => setAiPrompt(e.target.value)}
                                    />
                                    <button 
                                        onClick={handleGenerateScene}
                                        disabled={isGeneratingScene || !aiPrompt}
                                        className="w-full py-2 bg-indigo-600 text-white text-[10px] uppercase font-bold rounded hover:bg-indigo-500 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isGeneratingScene ? <Loader2 className="animate-spin" size={12}/> : toggleRefine === 'refine' ? "Refine & Fit Scene" : "Generate Background"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CANVAS PREVIEW (Mobile: Bottom, Desktop: Left) */}
                    <div className="w-full max-w-[320px] shrink-0 flex flex-col gap-6 order-2 lg:order-1 mx-auto lg:mx-0">
                        {/* Parent Container needs allow height expansion for aspect ratio to push it */}
                        <div className="flex justify-center bg-[#0a0a0a] border border-slate-800 p-4 rounded-sm relative shadow-2xl transition-all duration-500 h-auto">
                            <div 
                                ref={marketingRef}
                                className="relative overflow-hidden flex flex-col transition-all duration-500 w-full"
                                style={{ 
                                    aspectRatio: aspectRatio === '1:1' ? '1 / 1' : aspectRatio === '4:5' ? '4 / 5' : '9 / 16',
                                    background: '#0a0a0a',
                                    display: 'block' 
                                }}
                                key={aspectRatio}
                            >
                                {/* AI Background Layer */}
                                {marketingBg.startsWith('data:') && (
                                    <img 
                                        src={marketingBg} 
                                        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0" 
                                        alt="Background"
                                    />
                                )}

                                {/* Draggable Context Provider */}
                                <div 
                                    ref={dragContainerRef}
                                    className="absolute inset-0 z-10 w-full h-full overflow-hidden"
                                >
                                    {/* --- LOGOS --- */}
                                    {sireLogo && (
                                        <Draggable nodeRef={sireLogoRef} bounds="parent">
                                            <div 
                                                ref={sireLogoRef} 
                                                className={`absolute z-20 cursor-move ${selectedLayer === 'sireLogo' ? 'ring-1 ring-indigo-500' : ''}`}
                                                style={{ left: '2%', top: '2%' }}
                                                onClick={() => setSelectedLayer('sireLogo')}
                                            >
                                                <img 
                                                    src={sireLogo} 
                                                    className="w-16 h-16 object-contain pointer-events-none drop-shadow-md" 
                                                    style={{ transform: `rotate(${layerTransforms.sireLogo.rotate}deg) scale(${layerTransforms.sireLogo.scale})` }}
                                                />
                                            </div>
                                        </Draggable>
                                    )}
                                    {damLogo && (
                                        <Draggable nodeRef={damLogoRef} bounds="parent">
                                            <div 
                                                ref={damLogoRef} 
                                                className={`absolute z-20 cursor-move ${selectedLayer === 'damLogo' ? 'ring-1 ring-indigo-500' : ''}`}
                                                style={{ right: '2%', top: '2%' }}
                                                onClick={() => setSelectedLayer('damLogo')}
                                            >
                                                <img 
                                                    src={damLogo} 
                                                    className="w-16 h-16 object-contain pointer-events-none drop-shadow-md" 
                                                    style={{ transform: `rotate(${layerTransforms.damLogo.rotate}deg) scale(${layerTransforms.damLogo.scale})` }}
                                                />
                                            </div>
                                        </Draggable>
                                    )}

                                    {/* --- SIRE & DAM IMAGES --- */}
                                    {sireImage && (
                                        <Draggable nodeRef={sireNodeRef} bounds="parent" defaultPosition={{x: 20, y: 150}}>
                                            <div 
                                                ref={sireNodeRef} 
                                                className={`absolute z-20 cursor-move w-[50%] h-[50%] ${selectedLayer === 'sire' ? 'ring-1 ring-indigo-500' : ''}`}
                                                onClick={() => setSelectedLayer('sire')}
                                            >
                                                <div className="w-full h-full relative group flex items-center justify-center">
                                                    <img 
                                                        src={sireImage} 
                                                        className={`w-full h-full object-contain pointer-events-none ${!isUnlocked ? 'drop-shadow-lg' : 'drop-shadow-2xl'}`}
                                                        style={{ 
                                                            transform: `rotate(${layerTransforms.sire.rotate}deg) scale(${layerTransforms.sire.scale})` 
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </Draggable>
                                    )}

                                    {!isStudMode && damImage && (
                                        <Draggable nodeRef={damNodeRef} bounds="parent" defaultPosition={{x: 120, y: 150}}>
                                            <div 
                                                ref={damNodeRef} 
                                                className={`absolute z-20 cursor-move w-[50%] h-[50%] ${selectedLayer === 'dam' ? 'ring-1 ring-indigo-500' : ''}`}
                                                onClick={() => setSelectedLayer('dam')}
                                            >
                                                <div className="w-full h-full relative group flex items-center justify-center">
                                                    <img 
                                                        src={damImage} 
                                                        className={`w-full h-full object-contain pointer-events-none ${!isUnlocked ? 'drop-shadow-lg' : 'drop-shadow-2xl'}`}
                                                        style={{ 
                                                            transform: `rotate(${layerTransforms.dam.rotate}deg) scale(${layerTransforms.dam.scale})` 
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </Draggable>
                                    )}

                                    {/* --- TEXT OVERLAYS (SMART CENTERED & DRAGGABLE) --- */}
                                    {isStudMode && (
                                        <>
                                            {showStudHeader && (
                                                <Draggable nodeRef={studHeaderRef} bounds="parent">
                                                    <div 
                                                        ref={studHeaderRef} 
                                                        className={`absolute z-30 cursor-move ${selectedLayer === 'studHeader' ? 'ring-1 ring-indigo-500 bg-black/10' : ''}`}
                                                        style={{ top: '10%', left: '50%' }} // Start centered
                                                        onClick={() => setSelectedLayer('studHeader')}
                                                    >
                                                        {/* Inner transform to center on origin point */}
                                                        <div className="-translate-x-1/2">
                                                            <h1 
                                                                className="font-serif text-3xl font-bold tracking-widest drop-shadow-md pointer-events-none inline-block px-2 whitespace-nowrap" 
                                                                style={{ 
                                                                    color: studHeaderColor,
                                                                    transform: `rotate(${layerTransforms.studHeader.rotate}deg) scale(${layerTransforms.studHeader.scale})`
                                                                }}
                                                            >
                                                                STUD SERVICE
                                                            </h1>
                                                        </div>
                                                    </div>
                                                </Draggable>
                                            )}

                                            {showStudName && (
                                                <Draggable nodeRef={studNameRef} bounds="parent">
                                                    <div 
                                                        ref={studNameRef} 
                                                        className={`absolute z-30 cursor-move ${selectedLayer === 'studName' ? 'ring-1 ring-indigo-500 bg-black/10' : ''}`}
                                                        style={{ top: '18%', left: '50%' }}
                                                        onClick={() => setSelectedLayer('studName')}
                                                    >
                                                        <div className="-translate-x-1/2">
                                                            <h2 
                                                                className="font-display text-4xl font-bold uppercase tracking-widest drop-shadow-md pointer-events-none inline-block px-2 whitespace-nowrap" 
                                                                style={{ 
                                                                    color: studNameColor,
                                                                    transform: `rotate(${layerTransforms.studName.rotate}deg) scale(${layerTransforms.studName.scale})`
                                                                }}
                                                            >
                                                                {studName || 'SIRE NAME'}
                                                            </h2>
                                                        </div>
                                                    </div>
                                                </Draggable>
                                            )}

                                            {showPhenotype && (
                                                <Draggable nodeRef={studPhenoRef} bounds="parent">
                                                    <div 
                                                        ref={studPhenoRef} 
                                                        className={`absolute z-30 cursor-move ${selectedLayer === 'studPheno' ? 'ring-1 ring-indigo-500 bg-black/10' : ''}`}
                                                        style={{ top: '80%', left: '50%' }}
                                                        onClick={() => setSelectedLayer('studPheno')}
                                                    >
                                                        <div className="-translate-x-1/2">
                                                            <span 
                                                                className="font-sans text-[10px] uppercase tracking-[0.3em] drop-shadow-md bg-black/40 backdrop-blur-sm px-3 py-1 rounded-sm pointer-events-none inline-block whitespace-nowrap"
                                                                style={{ 
                                                                    color: studPhenoColor,
                                                                    transform: `rotate(${layerTransforms.studPheno.rotate}deg) scale(${layerTransforms.studPheno.scale})`
                                                                }}
                                                            >
                                                                {studPhenotype || getPhenotype(sire).phenotypeName}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Draggable>
                                            )}

                                            {showGenotype && (
                                                <Draggable nodeRef={studGenoRef} bounds="parent">
                                                    <div 
                                                        ref={studGenoRef} 
                                                        className={`absolute z-30 cursor-move ${selectedLayer === 'studGeno' ? 'ring-1 ring-indigo-500 bg-black/10' : ''}`}
                                                        style={{ top: '88%', left: '50%' }}
                                                        onClick={() => setSelectedLayer('studGeno')}
                                                    >
                                                        <div className="-translate-x-1/2">
                                                            <div 
                                                                className="bg-black/60 backdrop-blur-md border border-white/20 py-2 px-4 rounded-sm shadow-xl pointer-events-none inline-block whitespace-nowrap"
                                                                style={{ 
                                                                    transform: `rotate(${layerTransforms.studGeno.rotate}deg) scale(${layerTransforms.studGeno.scale})`
                                                                }}
                                                            >
                                                                <p className="font-mono text-xs font-bold tracking-wider" style={{ color: studDnaColor }}>
                                                                    {studDna || getPhenotype(sire).compactDnaString}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Draggable>
                                            )}
                                        </>
                                    )}

                                    {/* Watermark (Always Top) */}
                                    {!isUnlocked && (
                                        <Draggable nodeRef={watermarkRef} bounds="parent" defaultPosition={{x: 0, y: 0}}>
                                            <div 
                                                ref={watermarkRef} 
                                                className="absolute z-[100] cursor-move"
                                                style={{ top: '2%', left: '50%' }}
                                            >
                                                {/* Inner centering wrapper */}
                                                <div className="-translate-x-1/2">
                                                    <div className="bg-black/60 px-3 py-1 rounded backdrop-blur-sm border border-white/10 pointer-events-none whitespace-nowrap">
                                                        <span className="font-serif font-bold text-white text-[6px] tracking-[0.2em]">Designed by OKC FRENCHIES</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Draggable>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Unlock / Action Area */}
                        {!isUnlocked ? (
                            <div className="bg-slate-900/30 border border-luxury-gold/20 p-4 rounded-sm animate-in fade-in slide-in-from-bottom-2">
                                {!showLogin ? (
                                    <>
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-luxury-gold text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Sparkles size={14}/> Unlock Pro Studio</h4>
                                            {credits && credits > 0 ? (
                                                <span className="text-[9px] bg-emerald-900/50 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">{credits} Credits Left</span>
                                            ) : null}
                                        </div>
                                        <ul className="text-[9px] text-slate-400 space-y-1.5 mb-4 list-disc pl-4 marker:text-luxury-gold">
                                            <li>Background Removal for All Images</li>
                                            <li>Watermark Removal</li>
                                            <li>4K High-Res Download</li>
                                        </ul>
                                        <button 
                                            onClick={handleUnlockClick}
                                            disabled={isUnlocking}
                                            className="w-full py-4 bg-gradient-to-r from-luxury-gold to-yellow-600 text-black text-xs font-bold uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all mb-4 transform hover:-translate-y-0.5"
                                        >
                                            {isUnlocking ? <Loader2 className="animate-spin" size={14} /> : <><Lock size={14}/> Unlock Pro Features</>}
                                        </button>
                                        <div className="flex justify-between items-center px-1">
                                            <button onClick={() => setShowLogin(true)} className="text-[9px] text-slate-500 hover:text-white underline">Have credits? Login</button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="animate-in fade-in zoom-in-95">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="text-white text-xs font-bold uppercase tracking-widest">Restore Purchase</h4>
                                            <button onClick={() => setShowLogin(false)}><X size={12} className="text-slate-500 hover:text-white"/></button>
                                        </div>
                                        <input 
                                            type="email" 
                                            placeholder="Enter Email Address" 
                                            value={userEmail}
                                            onChange={(e) => setUserEmail(e.target.value)}
                                            className="w-full bg-black/40 border border-slate-700 p-2 text-xs text-white mb-2 outline-none focus:border-luxury-gold"
                                        />
                                        <button 
                                            onClick={handleLoginSubmit}
                                            disabled={isUnlocking}
                                            className="w-full py-2 bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-700 border border-slate-700"
                                        >
                                            {isUnlocking ? 'Checking...' : 'Check Credits'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-emerald-900/10 border border-emerald-500/20 p-4 rounded-sm text-center animate-in fade-in zoom-in-95">
                                <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 mb-2"><Check size={14}/> Pro Session Unlocked</span>
                                <p className="text-[9px] text-slate-400">Unlimited generations & exports for this session.</p>
                            </div>
                        )}

                        {/* Download Controls */}
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={handleFreeExport} 
                                className="py-3 bg-slate-800 text-slate-300 font-bold uppercase tracking-widest text-[10px] rounded-sm hover:bg-slate-700 transition-colors border border-slate-700 flex items-center justify-center gap-2"
                            >
                                <Download size={14}/> Save Free
                            </button>
                            <button 
                                onClick={handleProExport} 
                                disabled={!isUnlocked}
                                className={`py-3 font-bold uppercase tracking-widest text-[10px] rounded-sm transition-all flex items-center justify-center gap-2 ${!isUnlocked ? 'bg-slate-900 text-slate-600 cursor-not-allowed opacity-50' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
                            >
                                <Sparkles size={14}/> Save Pro
                            </button>
                        </div>
                    </div>

                </div>
            )}
       </div>

       {/* PUPPY MODAL */}
       {selectedPuppy && (
           <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedPuppy(null)}>
               <div className="relative bg-slate-900 border border-luxury-teal/30 p-8 rounded-sm max-w-sm w-full text-center mt-[-5%]" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setSelectedPuppy(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20}/></button>
                    <h3 className="text-2xl font-serif text-white mb-2">{getPhenotype(selectedPuppy).phenotypeName}</h3>
                    <div className="my-4 relative h-64 -mt-4">
                         <DogVisualizer traits={getPhenotype(selectedPuppy)} scale={1.2} showLabel={false} />
                    </div>
                    <div className="mb-4 p-2 bg-black/60 rounded border border-slate-800 relative z-10">
                        <span className="text-[9px] text-slate-500 uppercase block mb-1">Genotype String</span>
                        <span className="font-mono text-[10px] text-luxury-teal break-words">{getPhenotype(selectedPuppy).dnaString}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-left bg-black/40 p-4 border border-slate-800 rounded">
                        <span className="text-[10px] text-slate-500 uppercase">Base Color:</span>
                        <span className="text-[10px] text-white text-right">{getPhenotype(selectedPuppy).baseColorName}</span>
                    </div>
               </div>
           </div>
       )}

       {/* KENNEL MODAL */}
       {showKennel && (
           <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl" onClick={() => setShowKennel(false)}>
               <div className="relative bg-[#0f172a] border border-slate-800 p-6 rounded-sm w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setShowKennel(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20}/></button>
                    <h3 className="font-serif text-2xl text-white mb-6">Saved Genotypes</h3>
                    {savedDogs.length === 0 ? ( <p className="text-slate-500 text-sm text-center">No dogs saved yet.</p> ) : (
                        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                            {savedDogs.map((dog) => (
                                <div key={dog.id} className="flex items-center justify-between bg-black/40 p-3 border border-slate-800 rounded-sm">
                                    <div>
                                        <div className="flex items-center gap-2"><span className="block text-sm text-white font-bold">{dog.name}</span>{dog.gender === 'Male' && <span className="text-[#1d4ed8] text-xs font-bold">♂</span>}{dog.gender === 'Female' && <span className="text-[#db2777] text-xs font-bold">♀</span>}</div>
                                        <span className="text-[10px] text-slate-500">{dog.date} • {getPhenotype(dog.dna).phenotypeName}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {mode === 'single' ? (
                                            <button 
                                                onClick={() => loadDogSmart(dog)} 
                                                className="px-4 py-1.5 bg-luxury-teal/20 text-luxury-teal text-[10px] uppercase font-bold hover:bg-luxury-teal hover:text-black border border-luxury-teal/30"
                                            >
                                                Load
                                            </button>
                                        ) : (
                                            <>
                                                {dog.gender === 'Male' && (
                                                    <button onClick={() => { loadDogSmart(dog); }} className="px-3 py-1.5 bg-[#1d4ed8]/20 text-[#1d4ed8] text-[10px] uppercase font-bold hover:bg-[#1d4ed8] hover:text-white border border-[#1d4ed8]/30">Load Sire</button>
                                                )}
                                                {dog.gender === 'Female' && (
                                                    <button onClick={() => { loadDogSmart(dog); }} className="px-3 py-1.5 bg-[#db2777]/20 text-[#db2777] text-[10px] uppercase font-bold hover:bg-[#db2777] hover:text-white border border-[#db2777]/30">Load Dam</button>
                                                )}
                                            </>
                                        )}
                                        <button onClick={() => removeDog(dog.id)} className="px-2 py-1 bg-red-500/10 text-red-500 text-[10px] uppercase font-bold hover:bg-red-500 hover:text-white border border-red-500/20"><Trash2 size={12}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
               </div>
           </div>
       )}

       {/* Paywall Modal (Promo First) */}
       {showPaywall && (
           <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
               <div className="bg-[#0a0a0a] border border-luxury-gold/30 w-full max-w-md p-8 rounded-sm shadow-[0_0_50px_rgba(212,175,55,0.2)] text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent"></div>
                   
                   <h2 className="font-serif text-3xl text-white mb-2">Unlock Pro Studio</h2>
                   <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                       Enter your session code or purchase access to enable HD exports and background removal.
                   </p>
                   
                   <div className="bg-slate-900/50 p-6 rounded-sm border border-slate-800 mb-6 space-y-4">
                       
                       {/* Priority Payments */}
                       <div className="space-y-3">
                           {/* Unlimited Tier */}
                           <a 
                               href={STRIPE_LINK_UNLIMITED} 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all rounded-sm uppercase tracking-widest text-xs relative group overflow-hidden"
                           >
                               <span className="absolute right-0 top-0 bg-white text-black text-[7px] px-2 py-0.5 font-bold uppercase">Pro Choice</span>
                               <Infinity size={16} /> Unlimited Access ($9.99)
                           </a>

                           <a 
                               href={STRIPE_LINK_5} 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className="w-full py-3 bg-gradient-to-r from-luxury-gold to-yellow-600 text-black font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all rounded-sm uppercase tracking-widest text-xs relative"
                           >
                               <CreditCard size={14} /> Buy 5 Credits ($3.99)
                           </a>
                           
                           <a 
                               href={STRIPE_LINK_1} 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className="w-full py-3 bg-slate-800 border border-slate-600 text-slate-300 font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition-all rounded-sm uppercase tracking-widest text-xs"
                           >
                               Buy 1 Credit ($0.99)
                           </a>
                       </div>

                       <div className="flex items-center gap-4 py-2">
                           <div className="h-px bg-slate-800 flex-1"></div>
                           <span className="text-[10px] text-slate-600 uppercase">OR</span>
                           <div className="h-px bg-slate-800 flex-1"></div>
                       </div>

                       {/* Subtle Promo Code Section */}
                       {!showPromoInput ? (
                           <button 
                               onClick={() => setShowPromoInput(true)} 
                               className="text-[10px] text-slate-500 hover:text-luxury-gold underline flex items-center justify-center gap-1 w-full"
                           >
                               <Gift size={12} /> Have a promo code?
                           </button>
                       ) : (
                           <div className="animate-in fade-in slide-in-from-bottom-2">
                               <div className="flex gap-2">
                                   <input 
                                       type="text" 
                                       placeholder="Enter Code" 
                                       value={promoCodeInput}
                                       onChange={(e) => setPromoCodeInput(e.target.value)}
                                       className="flex-1 bg-black/40 border border-slate-700 p-2 text-xs text-white uppercase outline-none focus:border-luxury-gold transition-colors"
                                   />
                                   <button 
                                       onClick={handlePromoSubmit}
                                       disabled={isUnlocking}
                                       className="px-4 bg-slate-800 text-luxury-gold font-bold uppercase text-[10px] tracking-widest hover:bg-slate-700 transition-colors border border-slate-700"
                                   >
                                       {isUnlocking ? <Loader2 className="animate-spin" size={12}/> : 'Apply'}
                                   </button>
                               </div>
                           </div>
                       )}
                   </div>
                   
                   <div className="text-[10px] text-slate-500 mb-4">
                       Note: Buying credits will add them to your email account instantly.
                   </div>

                   <button onClick={() => setShowPaywall(false)} className="text-xs text-slate-500 hover:text-white underline">Cancel & Close</button>
               </div>
           </div>
       )}

    </div>
  );
}
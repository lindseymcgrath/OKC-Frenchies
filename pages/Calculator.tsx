import React, { useState, useEffect } from 'react';
import { X, Dna, AlertTriangle, Calculator as CalcIcon, ChevronRight, Layers, ImageOff, HelpCircle } from 'lucide-react';

// --- CONFIGURATION ---
const ASSET_BASE_URL = "https://raw.githubusercontent.com/lindseymcgrath/OKC-Frenchies/main/public/images/visuals";

// DNA Options
const LOCI = {
  Pink: { label: 'Pink (Albinism)', options: ['n/n', 'n/A', 'A/A'] },
  A: { label: 'Agouti', options: ['Ay/Ay', 'Ay/aw', 'Ay/at', 'Ay/a', 'aw/aw', 'aw/at', 'aw/a', 'at/at', 'at/a', 'a/a'] },
  K: { label: 'K-Locus (Brindle)', options: ['ky/ky', 'Kbr/ky', 'Kbr/Kbr'] },
  B: { label: 'Testable Choc (Rojo)', options: ['N/N', 'N/b', 'b/b'] },
  Co: { label: 'Cocoa', options: ['n/n', 'n/co', 'co/co'] },
  D: { label: 'Blue (Dilute)', options: ['N/N', 'N/d', 'd/d'] },
  E: { label: 'Extension (Mask/Red)', options: ['E/E', 'Em/Em', 'Em/E', 'Em/e', 'Em/eA', 'E/e', 'E/eA', 'e/e', 'eA/eA', 'eA/e'] },
  S: { label: 'Piebald (Pied)', options: ['n/n', 'n/S', 'S/S'] }, 
  L: { label: 'Hair Length (Fluffy)', options: ['L/L', 'L/l1', 'L/l4', 'l1/l1', 'l1/l4', 'l4/l4'] },
  F: { label: 'F-Locus (Furnishings)', options: ['n/n', 'n/F', 'F/F'] },
  C: { label: 'C-Locus (Curly)', options: ['n/n', 'n/C', 'C/C'] },
  M: { label: 'Merle', options: ['n/n', 'N/M', 'M/M'] }, 
  Panda: { label: 'Pattern Structure', options: ['No', 'Panda', 'Koi'] }
};

interface VisualTraits {
    baseColorName: string;
    phenotypeName: string;
    layers: string[]; // Ordered list of images to render bottom-to-top
    hasMerle: boolean;
    hasPied: boolean;
    hasPanda: boolean;
    isFluffy: boolean;
    isFurnished: boolean;
    isPink: boolean;
    isCream: boolean;
    isCurly: boolean;
    isBrindle: boolean;
    hasPoints: boolean;
    pattern: string;
}

interface PhenotypeResult {
    fullName: string;
    carries: string;
    isHighRisk: boolean;
    visualTraits: VisualTraits;
}

interface ProbabilityResult {
    phenotype: string;
    count: number;
    percent: string;
}

// --- VISUALIZER COMPONENT ---
const DogVisualizer: React.FC<{ traits: VisualTraits }> = ({ traits }) => {
    
    const getUrl = (img: string) => `${ASSET_BASE_URL}/${img}`;
    const [errors, setErrors] = useState<Record<string, boolean>>({});

    const handleImageError = (imgName: string) => {
        setErrors(prev => ({ ...prev, [imgName]: true }));
    };

    // Reset errors when phenotype changes
    useEffect(() => {
        setErrors({});
    }, [traits.layers]);

    // Ensure we have a valid base image for the error check
    const baseImage = traits.layers[0] || 'base-black.png';

    return (
        <div className="flex flex-col items-center w-full">
            {/* Transparent Container as requested */}
            <div className="relative w-full aspect-square bg-transparent rounded-sm overflow-hidden group">
                
                {/* STACKED LAYERS (Rendered in order 0 -> N) */}
                {traits.layers.map((layer, index) => (
                    !errors[layer] && (
                        <img 
                            key={`${layer}-${index}`}
                            src={getUrl(layer)} 
                            alt={`Layer: ${layer}`} 
                            className="absolute inset-0 w-full h-full object-contain z-10 mix-blend-normal"
                            onError={() => handleImageError(layer)}
                            crossOrigin="anonymous"
                            style={{ zIndex: 10 + index }}
                        />
                    )
                ))}

                {/* Error State: Only if Base Layer fails */}
                {errors[baseImage] && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center text-red-500 bg-red-50/90 p-6 text-center rounded-md">
                        <ImageOff className="mb-4 opacity-50" size={48} />
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-2">Visual Unavailable</h4>
                        <p className="text-[10px] font-mono text-slate-400 mb-4 break-all max-w-[200px]">
                           {baseImage}
                        </p>
                        <div className="flex items-start gap-2 text-left bg-white p-3 rounded-sm border border-red-100 shadow-sm">
                            <HelpCircle size={16} className="text-luxury-teal shrink-0 mt-0.5" />
                            <p className="text-[9px] text-slate-500 leading-relaxed">
                                <strong>System:</strong> Unable to load base asset from remote repository.
                            </p>
                        </div>
                    </div>
                )}

                {/* Label Overlay */}
                <div className="absolute bottom-4 left-4 z-[100] bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <span className="text-[10px] text-white uppercase tracking-widest flex items-center gap-2">
                        <Layers size={10} className="text-luxury-teal" /> 
                        {traits.isFluffy ? 'Fluffy' : ''} {traits.isFurnished ? 'Furnished' : ''} {traits.baseColorName}
                    </span>
                </div>
            </div>
            
            {/* Debug Info */}
            <div className="mt-4 text-center opacity-40 hover:opacity-100 transition-opacity">
                 <p className="text-[10px] text-slate-500 font-mono">
                    Base: {baseImage}
                 </p>
            </div>
        </div>
    );
};

export default function Calculator() {
  const [mode, setMode] = useState<'single' | 'pair'>('single');
  const [showModal, setShowModal] = useState(false);
  const [litterResults, setLitterResults] = useState<ProbabilityResult[]>([]);
  const [modalRisk, setModalRisk] = useState(false);
  const [showMerleWarning, setShowMerleWarning] = useState(false);
  
  const [sire, setSire] = useState(
    Object.keys(LOCI).reduce((acc: any, key) => ({ ...acc, [key]: LOCI[key as keyof typeof LOCI].options[0] }), {})
  );
  const [dam, setDam] = useState(
    Object.keys(LOCI).reduce((acc: any, key) => ({ ...acc, [key]: LOCI[key as keyof typeof LOCI].options[0] }), {})
  );

  useEffect(() => {
      if (mode === 'pair') {
          if (sire.M !== 'n/n' && dam.M !== 'n/n') {
              setShowMerleWarning(true);
          } else {
              setShowMerleWarning(false);
          }
      }
  }, [sire, dam, mode]);

  const getPhenotype = (dna: any): PhenotypeResult => {
    let phenotypeName = "";
    let baseColorName = "";
    let baseColorSlug = ""; 
    let carries: string[] = [];
    let isHighRisk = false;

    // --- 1. GENOTYPE PARSING ---
    // Color
    const d = dna.D === 'd/d';
    const co = dna.Co === 'co/co';
    const b = dna.B === 'b/b';
    
    // Pattern / Structure
    const eAlleles = dna.E.split('/');
    const isCream = dna.E === 'e/e';
    const isPink = dna.Pink === 'A/A';
    
    // Intense Black (eA) Logic
    const hasEA = eAlleles.includes('eA'); // eA/eA, eA/e, e/eA
    // Note: eA acts as a modifier on the base color name usually, 
    // but primarily we track it for the phenotype text.
    
    // K-Locus (Brindle)
    const kAlleles = dna.K.split('/');
    const isBrindle = kAlleles.includes('Kbr'); 
    
    // Agouti Logic
    const aAlleles = dna.A.split('/');
    const hasAy = aAlleles.includes('Ay');
    const hasAw = aAlleles.includes('aw') && !hasAy;
    const hasAt = aAlleles.includes('at') && !hasAy && !hasAw;
    const isSolidA = dna.A === 'a/a';

    // Texture & Modifiers
    // Fluffy Logic: Any 2 copies of l1 or l4 = Visual Fluffy
    const lAlleles = dna.L.split('/');
    const fluffyCount = lAlleles.filter((a: string) => a === 'l1' || a === 'l4').length;
    const isFluffy = fluffyCount === 2;

    const isFurnished = dna.F !== 'n/n'; // F/F or n/F
    const isCurly = dna.C !== 'n/n'; // C/C or n/C
    const pandaSelection = dna.Panda; // 'No', 'Panda', 'Koi'
    const isPied = dna.S === 'S/S';
    const isPiedCarrier = dna.S === 'n/S';
    const hasMerle = dna.M !== 'n/n';

    // --- 2. BASE COLOR NAME & SLUG ---
    if (b && co && d) { 
        baseColorName = "New Shade Isabella"; 
        baseColorSlug = "new-shade-isabella"; 
    }
    else if (b && co) { 
        baseColorName = "New Shade Rojo"; 
        // Special request: pull same base-rojo.png for New Shade Rojo
        baseColorSlug = "rojo"; 
    }
    else if (b && d)  { baseColorName = "Isabella"; baseColorSlug = "isabella"; }
    else if (co && d) { baseColorName = "Lilac"; baseColorSlug = "lilac"; }
    else if (b)       { baseColorName = "Rojo"; baseColorSlug = "rojo"; }
    else if (co)      { baseColorName = "Chocolate"; baseColorSlug = "cocoa"; }
    else if (d)       { baseColorName = "Blue"; baseColorSlug = "blue"; }
    else              { baseColorName = "Black"; baseColorSlug = "black"; }

    // --- 3. PHENOTYPE NAME CONSTRUCTION ---
    if (isCream) {
        phenotypeName = `${baseColorName} Wrapped in Cream`;
    } else {
        if (hasAy) phenotypeName = isBrindle ? `${baseColorName} Brindle` : `${baseColorName} Fawn`;
        else if (hasAw) phenotypeName = isBrindle ? `${baseColorName} Sable Brindle` : `${baseColorName} Sable`;
        else if (hasAt) phenotypeName = isBrindle ? `${baseColorName} Brindle` : `${baseColorName} and Tan`;
        else phenotypeName = isBrindle ? `${baseColorName} Brindle` : baseColorName;
    }

    if (hasEA && !isCream && !isPink) phenotypeName = `Visual eA ${phenotypeName}`;
    if (isPink) phenotypeName = `Full Pink ${baseColorName}`;
    if (isPied) phenotypeName += " Pied";
    if (hasMerle) {
        phenotypeName += " Merle";
        if (dna.M === 'M/M') isHighRisk = true;
    }
    if (pandaSelection === 'Panda') phenotypeName += " Panda";
    if (pandaSelection === 'Koi') phenotypeName += " Koi";
    if (isFluffy) phenotypeName += " Fluffy";
    if (isCurly) phenotypeName += " Curly";
    if (isFurnished) phenotypeName += " Floodle";

    // --- 4. ASSET LOGIC ---
    
    // A. DETERMINE PIGMENT GROUP (For Overlays)
    // Groups: 'grey' (Black/Blue/Lilac), 'cocoa' (Cocoa/Isabella/NS-Rojo/NS-Isa), 'tan' (Pink?), 'cream'
    let pigmentGroup = 'grey'; // Default

    if (isCream) {
        pigmentGroup = 'cream';
    } else if (isPink) {
        pigmentGroup = 'tan'; 
    } else if (baseColorName.includes("New Shade")) {
        pigmentGroup = 'cocoa'; 
    } else if (['cocoa', 'isabella', 'rojo'].includes(baseColorSlug)) {
        // Rojo grouped with Cocoa/Isabella for overlays typically unless specific
        pigmentGroup = 'cocoa';
        // Special exception for Isabella? Usually uses tan points/cocoa points styling.
    } 

    // B. IMAGE LAYERING (Bottom -> Top)
    const layers: string[] = [];
    const suffix = isFluffy ? '-fluffy' : '';

    // 1. BASE LAYER
    if (isPink) {
        layers.push(`base-pink${suffix}.png`);
    } else if (isCream) {
        layers.push(`base-cream${suffix}.png`);
    } else if (hasAy && !isBrindle) { // Fawn hides unless brindle covers it? No, Fawn IS the base.
        layers.push(`base-fawn${suffix}.png`);
    } else if (hasAw && !isBrindle) {
        layers.push(`base-sable${suffix}.png`);
    } else {
        // Solid Bases (Black, Blue, Rojo, Cocoa, etc)
        // Note: For New Shade Rojo, we set slug to 'rojo' above, so it pulls 'base-rojo[-fluffy].png'
        layers.push(`base-${baseColorSlug}${suffix}.png`);
    }

    // 2. TAN POINTS
    // Rule: Show if (at/at or at/a) AND (ky/ky - No Brindle)
    // Exclude if Cream or Pink (Cream masks, Pink is handled by base)
    // Exclude if Fawn/Sable is dominant (Ay/at or aw/at) -> Base is Fawn/Sable, points hidden or blended.
    // However, visualizers often show points on solid bases. 
    // Strict rule: "If Kbr (Brindle) is present, hide the Tan Point overlay."
    const showTanPoints = hasAt && !isBrindle && !isCream && !isPink;
    
    if (showTanPoints) {
        layers.push(`overlay-tan-points${suffix}.png`);
    }

    // 3. MERLE OVERLAY
    if (hasMerle && !isCream) {
        if (pigmentGroup === 'grey') layers.push('overlay-merle-grey.png');
        else if (pigmentGroup === 'cocoa') layers.push(baseColorName.includes("New Shade") ? 'overlay-merle-cocoa.png' : 'overlay-merle-tan.png');
        else if (pigmentGroup === 'tan') layers.push('overlay-merle-tan.png');
        // Cream hides Merle
    }

    // 4. CURLY
    if (isCurly) {
        layers.push('overlay-curly.png');
    }

    // 5. PIED
    if (isPied) {
        layers.push('overlay-pied.png');
    } else if (isPiedCarrier) {
        layers.push('overlay-pied-carrier.png');
    }

    // 6. BRINDLE
    if (isBrindle && !isCream && !isPink) {
        layers.push('overlay-brindle.png');
    }

    // 7. PANDA / KOI
    if (pandaSelection === 'Koi') {
        // Koi = Merle (added above) + Husky + Koi overlay
        layers.push('overlay-husky.png');
        layers.push('overlay-koi.png');
    } else if (pandaSelection === 'Panda') {
        layers.push('overlay-husky.png');
    }

    // 8. FURNISHINGS
    if (isFurnished) {
        if (pigmentGroup === 'grey') layers.push('overlay-furnishing-gray.png');
        else if (pigmentGroup === 'cocoa') layers.push('overlay-furnishing-cocoa.png');
        else if (pigmentGroup === 'tan') layers.push('overlay-furnishing-tan.png');
        else if (pigmentGroup === 'cream') layers.push('overlay-furnishing-cream.png');
        else layers.push('overlay-furnishing-gray.png'); // Fallback
    }

    // 9. OUTLINE
    layers.push('overlay-outline.png');


    // --- 5. CARRIES LIST ---
    if (dna.Pink === 'n/A') carries.push("Pink");
    if (eAlleles.includes('e') && !isCream) carries.push("Cream");
    if (hasEA) carries.push("Intense Black (eA)");
    if (dna.B === 'N/b') carries.push("Rojo");
    if (dna.Co === 'n/co') carries.push("Cocoa");
    if (dna.D === 'N/d') carries.push("Blue");
    if (dna.S === 'n/S') carries.push("Pied");
    if (fluffyCount === 1) carries.push("Fluffy");

    return { 
        fullName: phenotypeName, 
        carries: carries.join(", "),
        isHighRisk,
        visualTraits: {
            baseColorName,
            phenotypeName,
            layers: layers,
            hasMerle,
            hasPied: isPied,
            hasPanda: pandaSelection !== 'No',
            isFluffy,
            isFurnished,
            isPink,
            isCream,
            isCurly,
            isBrindle,
            hasPoints: hasAt,
            pattern: isSolidA ? 'Solid' : 'Patterned'
        }
    };
  };

  const calculateLitter = () => {
    const getAlleles = (genotype: string) => genotype.split('/');
    const ITERATIONS = 2000;
    const results: Record<string, number> = {};
    let riskDetected = false;

    for (let i = 0; i < ITERATIONS; i++) {
        const puppyDNA: any = {};
        Object.keys(LOCI).forEach(key => {
            const sireAlleles = getAlleles(sire[key]);
            const damAlleles = getAlleles(dam[key]);
            const fromSire = sireAlleles[Math.floor(Math.random() * sireAlleles.length)];
            const fromDam = damAlleles[Math.floor(Math.random() * damAlleles.length)];
            puppyDNA[key] = [fromSire, fromDam].sort().join('/');
        });

        // Copy non-genetic traits directly for simulation ease (Panda usually complex, keeping simple inheritance or static)
        // For accurate punnett, we'd need genetic markers for Panda. Assuming simplistic inheritance or random for this tool context?
        // Actually, Panda/Koi options are dropdowns in UI, likely phenotypic selection. 
        // We'll skip randomizing Panda for now as it's not a simple locus in this config map.
        puppyDNA.Panda = 'No'; 

        const phenotype = getPhenotype(puppyDNA);
        if (phenotype.isHighRisk) riskDetected = true;
        const name = phenotype.fullName;
        results[name] = (results[name] || 0) + 1;
    }

    const finalResults: ProbabilityResult[] = Object.keys(results).map(key => ({
        phenotype: key,
        count: results[key],
        percent: ((results[key] / ITERATIONS) * 100).toFixed(1) + '%'
    })).sort((a, b) => b.count - a.count);

    setLitterResults(finalResults);
    setModalRisk(riskDetected);
    setShowModal(true);
  };

  const renderSelector = (dna: any, setDna: any, title: string, color: string) => (
    <div className={`p-6 border border-${color}/20 bg-slate-900/50 backdrop-blur-md rounded-sm h-full`}>
      <div className="flex justify-between items-center border-b border-${color}/10 pb-4 mb-6">
        <h3 className={`text-${color} font-bold uppercase tracking-widest text-sm font-serif`}>{title}</h3>
        {mode === 'pair' && <Dna size={16} className={`text-${color} opacity-50`} />}
      </div>
      
      <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {Object.keys(LOCI).map(key => (
          <div key={key} className="flex items-center justify-between gap-2 group">
            <label className="text-[10px] text-slate-500 uppercase tracking-tight w-1/3 font-sans group-hover:text-slate-300 transition-colors">
              {(LOCI as any)[key].label}
            </label>
            <select 
              className={`w-2/3 bg-black border border-slate-800 p-2 text-[10px] md:text-xs text-white focus:border-${color} outline-none transition-all font-mono rounded-sm`}
              value={dna[key]}
              onChange={(e) => setDna({...dna, [key]: e.target.value})}
            >
              {(LOCI as any)[key].options.map((o: string) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );

  const phenotypeResult = getPhenotype(sire);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pt-32 pb-20 px-4 md:px-6 font-sans relative">
       <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay pointer-events-none"></div>
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-luxury-teal/5 rounded-full blur-[120px] pointer-events-none"></div>

      {showMerleWarning && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-red-950/90 border-2 border-red-500 max-w-lg w-full p-8 rounded-sm shadow-[0_0_50px_rgba(239,68,68,0.5)] text-center relative">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertTriangle size={32} className="text-red-500" />
                  </div>
                  <h2 className="font-display text-3xl text-white mb-4 uppercase tracking-wide">Prohibited Pairing</h2>
                  <p className="text-red-200 text-sm leading-relaxed mb-8">
                      You have selected Merle (M/n or M/M) for both Sire and Dam. 
                      <strong className="block mt-2 text-white">Breeding Merle to Merle is highly unethical.</strong>
                      It results in a 25% chance of "Double Merle" offspring, which often suffer from blindness, deafness, and other severe deformities. 
                      <br/><br/>
                      We do not recommend or support this pairing configuration.
                  </p>
                  <button 
                    onClick={() => setShowMerleWarning(false)}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest transition-colors"
                  >
                      I Understand the Risks
                  </button>
              </div>
          </div>
      )}

      <div className="max-w-7xl mx-auto text-center mb-16 relative z-10">
        <h1 className="font-serif text-5xl md:text-7xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-luxury-teal via-white to-luxury-magenta animate-shine">
          DNA MATRIX
        </h1>
        <p className="text-luxury-teal text-xs tracking-[0.4em] uppercase">Advanced Canine DNA Calculator</p>
        
        <div className="flex justify-center gap-4 mt-10">
          <button 
            onClick={() => setMode('single')} 
            className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                mode === 'single' 
                ? 'bg-luxury-teal text-black border-luxury-teal' 
                : 'bg-transparent text-slate-400 border-slate-800 hover:border-luxury-teal/50 hover:text-luxury-teal'
            }`}
          >
            Translator
          </button>
          <button 
            onClick={() => setMode('pair')} 
            className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                mode === 'pair' 
                ? 'bg-luxury-magenta text-black border-luxury-magenta' 
                : 'bg-transparent text-slate-400 border-slate-800 hover:border-luxury-magenta/50 hover:text-luxury-magenta'
            }`}
          >
            Pairing Matrix
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {mode === 'single' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4">
                    {renderSelector(sire, setSire, "Single Dog Input", "luxury-teal")}
                </div>
                <div className="lg:col-span-8">
                     <div className="sticky top-32 p-0 bg-gradient-to-br from-slate-900 to-black border border-slate-800 shadow-2xl rounded-sm overflow-hidden flex flex-col md:flex-row">
                        
                        <div className="w-full md:w-1/2 p-8 bg-[#0a0a0a] border-b md:border-b-0 md:border-r border-slate-800 flex flex-col items-center justify-center">
                            <DogVisualizer traits={phenotypeResult.visualTraits} />
                        </div>

                        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                            <h2 className="font-serif text-2xl text-white mb-6 border-l-4 border-luxury-teal pl-4">Phenotype Result</h2>
                            
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-2">Primary Identification</span>
                            <p className="text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-tight leading-tight mb-4">
                                {phenotypeResult.fullName}
                            </p>

                            {phenotypeResult.carries && (
                                <div className="pt-6 border-t border-slate-800">
                                    <span className="text-[10px] text-luxury-magenta uppercase tracking-widest block mb-2 font-bold">DNA Report</span>
                                    <p className="text-slate-400 text-sm italic font-serif">"Carries {phenotypeResult.carries}"</p>
                                </div>
                            )}
                        </div>
                     </div>
                </div>
            </div>
        )}

        {mode === 'pair' && (
            <div className="flex flex-col gap-12">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-4">
                        {renderSelector(sire, setSire, "Sire (Male)", "luxury-teal")}
                        <div className="p-4 bg-slate-900/30 border border-luxury-teal/20 rounded-sm">
                            <span className="text-[10px] text-luxury-teal uppercase tracking-widest font-bold block mb-1">Sire Phenotype</span>
                            <p className="text-white font-display text-lg uppercase leading-tight mb-2">{getPhenotype(sire).fullName}</p>
                            {getPhenotype(sire).carries && <p className="text-xs text-slate-500 italic">Carries: {getPhenotype(sire).carries}</p>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                         {renderSelector(dam, setDam, "Dam (Female)", "luxury-magenta")}
                         <div className="p-4 bg-slate-900/30 border border-luxury-magenta/20 rounded-sm">
                            <span className="text-[10px] text-luxury-magenta uppercase tracking-widest font-bold block mb-1">Dam Phenotype</span>
                            <p className="text-white font-display text-lg uppercase leading-tight mb-2">{getPhenotype(dam).fullName}</p>
                            {getPhenotype(dam).carries && <p className="text-xs text-slate-500 italic">Carries: {getPhenotype(dam).carries}</p>}
                        </div>
                    </div>
                </div>

                <div className="text-center pt-8 border-t border-slate-800">
                    <button 
                        onClick={calculateLitter}
                        className="group relative inline-flex items-center gap-4 px-12 py-6 bg-luxury-teal text-black font-bold uppercase tracking-[0.2em] hover:bg-white transition-all rounded-sm overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                             <CalcIcon size={20} /> Calculate Litter Probabilities
                        </span>
                        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                    </button>
                    <p className="mt-4 text-[10px] text-slate-500 uppercase tracking-widest">
                        Generates a Punnett Square Simulation of 2,000 Offspring
                    </p>
                </div>
            </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity" onClick={() => setShowModal(false)} />
             
             <div className="relative z-10 w-full max-w-4xl bg-[#0a0a0a] border border-slate-800 shadow-2xl flex flex-col max-h-[90vh] rounded-sm animate-in fade-in zoom-in-95 duration-300">
                
                <div className="p-8 border-b border-slate-800 flex justify-between items-start bg-slate-900/50">
                    <div>
                        <h2 className="font-serif text-3xl text-white mb-2">Litter Probability Report</h2>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="text-luxury-teal uppercase tracking-widest font-bold">Sire: {getPhenotype(sire).fullName}</span>
                            <ChevronRight size={12} />
                            <span className="text-luxury-magenta uppercase tracking-widest font-bold">Dam: {getPhenotype(dam).fullName}</span>
                        </div>
                    </div>
                    <button onClick={() => setShowModal(false)} className="p-2 text-slate-500 hover:text-white bg-black rounded-full border border-slate-800">
                        <X size={20} />
                    </button>
                </div>

                {modalRisk && (
                    <div className="bg-red-900/30 border-b border-red-500/50 p-4 text-center">
                        <p className="text-red-400 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                            <AlertTriangle size={16} /> 
                            CRITICAL WARNING: Double Merle (M/M) Offspring Detected in Simulation
                        </p>
                    </div>
                )}

                <div className="overflow-y-auto p-8 bg-[#0f172a] space-y-4">
                    {litterResults.map((result, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-black/40 border border-slate-800 rounded-sm hover:border-luxury-teal/30 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold border ${result.phenotype.includes('M/M') ? 'bg-red-500/20 text-red-400 border-red-500' : 'bg-luxury-teal/10 text-luxury-teal border-luxury-teal/30'}`}>
                                    {result.percent}
                                </div>
                                <div>
                                    <span className={`text-lg font-display uppercase tracking-tight ${result.phenotype.includes('M/M') ? 'text-red-400 font-bold' : 'text-slate-200'}`}>
                                        {result.phenotype}
                                    </span>
                                    <div className="h-1 w-full bg-slate-800 mt-2 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${result.phenotype.includes('M/M') ? 'bg-red-500' : 'bg-luxury-teal'}`} 
                                            style={{ width: result.percent }} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {litterResults.length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                            No viable phenotypes calculated. Please check genetic inputs.
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-900/50 text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                        *Probabilities are estimates based on 2,000 simulated offspring. Actual results may vary slightly.
                    </p>
                </div>
             </div>
        </div>
      )}
    </div>
  );
}
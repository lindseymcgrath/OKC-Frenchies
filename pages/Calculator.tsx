import React, { useState, useEffect } from 'react';
import { X, Dna, AlertTriangle, Calculator as CalcIcon, ChevronRight, Layers, Info } from 'lucide-react';

// DNA Options
const LOCI = {
  Pink: { label: 'Pink (Albinism)', options: ['n/n', 'n/A', 'A/A'] },
  A: { label: 'Agouti', options: ['Ay/Ay', 'Ay/aw', 'Ay/at', 'Ay/a', 'aw/aw', 'aw/at', 'aw/a', 'at/at', 'at/a', 'a/a'] },
  B: { label: 'Testable Choc (Rojo)', options: ['N/N', 'N/b', 'b/b'] },
  Co: { label: 'Cocoa', options: ['n/n', 'n/co', 'co/co'] },
  D: { label: 'Blue (Dilute)', options: ['N/N', 'N/d', 'd/d'] },
  E: { label: 'Extension (Mask/Red)', options: ['E/E', 'Em/Em', 'Em/E', 'Em/e', 'Em/eA', 'E/e', 'E/eA', 'e/e', 'eA/eA', 'eA/e'] },
  S: { label: 'Piebald (Pied)', options: ['n/n', 'n/s', 's/s'] }, // NEW: S-Locus
  L: { label: 'Hair Length', options: ['L/L', 'L/l1', 'L/l4', 'l1/l1', 'l1/l4', 'l4/l4'] },
  F: { label: 'Furnishings', options: ['n/n', 'n/F', 'F/F'] },
  C: { label: 'Curly (C1/C2)', options: ['n/n', 'n/C', 'C/C'] },
  M: { label: 'Merle', options: ['n/n', 'N/M', 'M/M'] }, 
  Panda: { label: 'Panda Husky', options: ['No', 'Yes'] }
};

interface VisualTraits {
    baseColor: string; // blue, cocoa, lilac, etc.
    pattern: string; // tan, fawn, solid
    hasMerle: boolean;
    hasPied: boolean;
    hasPanda: boolean;
    isFluffy: boolean;
    isPink: boolean;
    isCream: boolean;
}

interface PhenotypeResult {
    fullName: string;
    altName?: string; // For "Also called..."
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
    // Placeholder logic for layer paths. 
    // In a real app, these would be actual transparent PNGs.
    const baseUrl = "https://rawandpawco.com/visuals";
    
    // Determine Base Layer
    let baseLayer = "base_black";
    if (traits.baseColor === "Blue") baseLayer = "base_blue";
    if (traits.baseColor === "Chocolate") baseLayer = "base_cocoa";
    if (traits.baseColor === "Lilac") baseLayer = "base_lilac";
    if (traits.baseColor === "Rojo") baseLayer = "base_rojo";
    if (traits.baseColor === "Isabella") baseLayer = "base_isabella";
    if (traits.baseColor === "New Shade Isabella") baseLayer = "base_new_shade";
    if (traits.isCream) baseLayer = "base_cream"; // Cream covers base
    if (traits.isPink) baseLayer = "base_pink"; // Pink covers all

    return (
        <div className="relative w-full aspect-square bg-[#050505] rounded-sm overflow-hidden border border-slate-800 group">
            {/* Background / Environment */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-black opacity-50" />
            
            {/* 1. BASE COLOR LAYER */}
            <img 
                src={`${baseUrl}/${baseLayer}.png`} 
                alt="Base Coat"
                className="absolute inset-0 w-full h-full object-contain z-10"
                onError={(e) => (e.currentTarget.style.display = 'none')} 
            />

            {/* 2. PATTERN LAYER (Tan Points) */}
            {traits.pattern.includes("Tan") && !traits.isCream && !traits.isPink && (
                <img 
                    src={`${baseUrl}/layer_tan_points.png`} 
                    alt="Tan Points" 
                    className="absolute inset-0 w-full h-full object-contain z-20 mix-blend-overlay opacity-80"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                />
            )}

            {/* 3. PIED LAYER (White Masking) */}
            {traits.hasPied && (
                <img 
                    src={`${baseUrl}/layer_pied_white.png`} 
                    alt="Pied Marking" 
                    className="absolute inset-0 w-full h-full object-contain z-30"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                />
            )}

            {/* 4. MERLE LAYER */}
            {traits.hasMerle && !traits.isCream && !traits.isPink && (
                <img 
                    src={`${baseUrl}/layer_merle_pattern.png`} 
                    alt="Merle Pattern" 
                    className="absolute inset-0 w-full h-full object-contain z-40 mix-blend-multiply opacity-60"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                />
            )}

            {/* 5. PANDA LAYER */}
            {traits.hasPanda && (
                <img 
                    src={`${baseUrl}/layer_panda_white.png`} 
                    alt="Panda Markings" 
                    className="absolute inset-0 w-full h-full object-contain z-50"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                />
            )}

             {/* 6. TEXTURE (Fluffy) */}
             {traits.isFluffy && (
                <div className="absolute inset-0 z-50 pointer-events-none shadow-[inset_0_0_50px_rgba(255,255,255,0.1)] opacity-50"></div>
            )}

            {/* Label Overlay */}
            <div className="absolute bottom-4 left-4 z-50 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <span className="text-[10px] text-white uppercase tracking-widest flex items-center gap-2">
                    <Layers size={10} className="text-luxury-teal" /> Visual Preview
                </span>
            </div>
            
            {/* Fallback Text if images fail (likely in this demo) */}
            <div className="absolute inset-0 flex items-center justify-center z-0">
                <Dna className="text-slate-800 opacity-20" size={120} />
            </div>
        </div>
    );
};

export default function Calculator() {
  const [mode, setMode] = useState<'single' | 'pair'>('single');
  const [showModal, setShowModal] = useState(false);
  const [litterResults, setLitterResults] = useState<ProbabilityResult[]>([]);
  const [modalRisk, setModalRisk] = useState(false);
  
  // Merle Warning State
  const [showMerleWarning, setShowMerleWarning] = useState(false);
  
  // State for Sire and Dam
  const [sire, setSire] = useState(
    Object.keys(LOCI).reduce((acc: any, key) => ({ ...acc, [key]: LOCI[key as keyof typeof LOCI].options[0] }), {})
  );
  const [dam, setDam] = useState(
    Object.keys(LOCI).reduce((acc: any, key) => ({ ...acc, [key]: LOCI[key as keyof typeof LOCI].options[0] }), {})
  );

  // Check for unsafe pairing immediately
  useEffect(() => {
      if (mode === 'pair') {
          if (sire.M !== 'n/n' && dam.M !== 'n/n') {
              setShowMerleWarning(true);
          } else {
              setShowMerleWarning(false);
          }
      }
  }, [sire, dam, mode]);

  // --- CORE GENETIC LOGIC ---
  const getPhenotype = (dna: any): PhenotypeResult => {
    let visual = "";
    let technicalVisual = ""; // The color UNDER the wrap
    let prefix = "";
    let suffix = "";
    let carries: string[] = [];
    let isHighRisk = false;
    let altName = "";

    // 0. SAFETY CHECK
    if (dna.M === 'M/M') isHighRisk = true;

    // 1. TEXTURE & LENGTH
    const lAlleles = dna.L.split('/');
    const isFullFluffy = lAlleles.every((a: string) => a.startsWith('l'));
    const isCarryingFluffy = !isFullFluffy && lAlleles.some((a: string) => a.startsWith('l'));
    const isFurnished = dna.F !== 'n/n';
    const isCurly = dna.C !== 'n/n';

    // "Puffy" Logic
    if (isFullFluffy && isCurly) prefix += "Puffy ";
    else if (isCurly) prefix += "Curly ";

    // Floodle Logic
    if (isFullFluffy && isFurnished) {
        suffix += " Floodle/Teddy";
    } else if (isFullFluffy) {
        prefix += "Full Fluffy ";
    }

    if (isCarryingFluffy && isFurnished) suffix += " Floodle/Teddy Producer";
    else if (isFurnished && !isFullFluffy) suffix += " Wire Hair";

    // 2. BASE COLOR HIERARCHY
    const d = dna.D === 'd/d';
    const co = dna.Co === 'co/co';
    const b = dna.B === 'b/b';
    let baseColorName = "Black";

    if (b && co && d) baseColorName = "New Shade Isabella";
    else if (b && co) baseColorName = "New Shade Rojo";
    else if (b && d) baseColorName = "Isabella";
    else if (co && d) baseColorName = "Lilac";
    else if (b) baseColorName = "Rojo";
    else if (co) baseColorName = "Chocolate";
    else if (d) baseColorName = "Blue";
    
    technicalVisual = baseColorName;

    // 3. AGOUTI PATTERNS
    const aAlleles = dna.A.split('/');
    const hasAy = aAlleles.includes('Ay');
    const hasAw = aAlleles.includes('aw');
    const hasAt = aAlleles.includes('at');
    const isSolid = dna.A === 'a/a';
    
    let patternName = "";
    if (hasAy) patternName = " Fawn";
    else if (hasAw) patternName = " Sable";
    else if (hasAt) patternName = " and Tan";
    else if (isSolid) patternName = " Solid";

    technicalVisual += patternName;

    // 4. EXTENSION (Mask, Cream, Ancient Red)
    const eAlleles = dna.E.split('/');
    const hasEm = eAlleles.includes('Em');
    const hasEa = eAlleles.includes('eA');
    const isCream = dna.E === 'e/e';

    if (hasEa) {
        technicalVisual += " eA Husky";
    } 
    
    if (hasEm && !isCream && !hasEa) {
        technicalVisual += " Masked";
    }

    // 5. PIED (S-Locus)
    const isPied = dna.S === 's/s';
    const carriesPied = dna.S === 'n/s';

    if (isPied) {
        suffix += " Pied"; // Suffix logic, added to end
    }

    // 6. SPECIALS (Koi / Panda / Merle)
    const hasMerle = dna.M !== 'n/n';
    const hasPanda = dna.Panda === 'Yes';

    if (hasMerle && hasPanda) {
        technicalVisual = technicalVisual.replace("Black", "").replace("Blue", "").replace("Lilac", "").replace("Rojo", "").replace("Chocolate", "") + " Koi";
    } else if (hasMerle) {
        technicalVisual += " Merle";
    } else if (hasPanda) {
        technicalVisual += " Panda Husky";
    }

    // 7. WRAP LOGIC (The Overrides)
    const isPink = dna.Pink === 'A/A';
    
    if (isPink) {
        visual = `Full Pink ${baseColorName}`;
        if (isPied) visual += " Pied";
        altName = `Genetically ${technicalVisual} wrapped in Pink`;
    } else if (isCream && !hasEa) { // eA dominates cream visually usually, but simplified here
        visual = `${baseColorName} Wrapped in Cream`;
        if (isPied) visual += " Pied";
        altName = `Genetically ${technicalVisual} wrapped in Cream`;
    } else {
        visual = technicalVisual;
    }

    // 8. CARRIES REPORT
    if (dna.Pink === 'n/A') carries.push("Pink");
    if (eAlleles.includes('e') && !isCream) carries.push("Cream");
    if (eAlleles.includes('eA') && !hasEa) carries.push("Ancient Red"); 
    if ((eAlleles.includes('Em')) && !hasEm) carries.push("Mask"); 
    if (dna.B === 'N/b') carries.push("Testable (Rojo)");
    if (dna.Co === 'n/co') carries.push("Cocoa");
    if (dna.D === 'N/d') carries.push("Blue");
    if (carriesPied) carries.push("Pied"); // Add Pied carrier
    if (isCarryingFluffy) carries.push("Fluffy");
    if (dna.A.includes('at') && !hasAt) carries.push("Tan Points");
    if (dna.A.includes('a') && !isSolid) carries.push("Solid");

    // Construct final name
    const finalName = `${prefix}${visual}${suffix}`.trim();

    // Prepare Visual Traits for Component
    const visualTraits: VisualTraits = {
        baseColor: baseColorName,
        pattern: patternName.trim(),
        hasMerle,
        hasPied: isPied,
        hasPanda,
        isFluffy: isFullFluffy,
        isPink,
        isCream
    };

    return { 
        fullName: finalName, 
        altName: altName ? altName : undefined,
        carries: carries.join(", "),
        isHighRisk,
        visualTraits
    };
  };

  // --- PUNNETT SQUARE SIMULATION ---
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
      
      <div className="grid grid-cols-1 gap-3">
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

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pt-32 pb-20 px-4 md:px-6 font-sans relative">
       {/* Background Ambience */}
       <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay pointer-events-none"></div>
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-luxury-teal/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* MERLE SAFETY POPUP (Blocking or High Viz) */}
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
        
        {/* SINGLE MODE */}
        {mode === 'single' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4">
                    {renderSelector(sire, setSire, "Single Dog Input", "luxury-teal")}
                </div>
                <div className="lg:col-span-8">
                     <div className="sticky top-32 p-0 bg-gradient-to-br from-slate-900 to-black border border-slate-800 shadow-2xl rounded-sm overflow-hidden flex flex-col md:flex-row">
                        
                        {/* Visualizer Side */}
                        <div className="w-full md:w-1/2 p-8 bg-black/40 border-b md:border-b-0 md:border-r border-slate-800 flex items-center justify-center">
                            <DogVisualizer traits={getPhenotype(sire).visualTraits} />
                        </div>

                        {/* Text Result Side */}
                        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                            <h2 className="font-serif text-2xl text-white mb-6 border-l-4 border-luxury-teal pl-4">Phenotype Result</h2>
                            
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-2">Primary Identification</span>
                            <p className="text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-tight leading-tight mb-4">
                                {getPhenotype(sire).fullName}
                            </p>

                            {/* Alternative Name / Technical Description */}
                            {getPhenotype(sire).altName && (
                                <div className="mb-6 p-3 bg-luxury-teal/5 border border-luxury-teal/10 rounded-sm">
                                    <div className="flex items-start gap-2">
                                        <Info size={14} className="text-luxury-teal mt-0.5 shrink-0" />
                                        <div>
                                            <span className="text-[9px] text-luxury-teal uppercase tracking-widest font-bold block">Technical Genotype</span>
                                            <p className="text-sm text-slate-300 italic">"{getPhenotype(sire).altName}"</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {getPhenotype(sire).carries && (
                                <div className="pt-6 border-t border-slate-800">
                                    <span className="text-[10px] text-luxury-magenta uppercase tracking-widest block mb-2 font-bold">DNA Report</span>
                                    <p className="text-slate-400 text-sm italic font-serif">"Carries {getPhenotype(sire).carries}"</p>
                                </div>
                            )}
                        </div>
                     </div>
                </div>
            </div>
        )}

        {/* PAIRING MODE */}
        {mode === 'pair' && (
            <div className="flex flex-col gap-12">
                
                {/* Parents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Sire Card */}
                    <div className="flex flex-col gap-4">
                        {renderSelector(sire, setSire, "Sire (Male)", "luxury-teal")}
                        <div className="p-4 bg-slate-900/30 border border-luxury-teal/20 rounded-sm">
                            <span className="text-[10px] text-luxury-teal uppercase tracking-widest font-bold block mb-1">Sire Phenotype</span>
                            <p className="text-white font-display text-lg uppercase leading-tight mb-2">{getPhenotype(sire).fullName}</p>
                            {getPhenotype(sire).altName && <p className="text-xs text-slate-400 italic mb-2">({getPhenotype(sire).altName})</p>}
                            {getPhenotype(sire).carries && <p className="text-xs text-slate-500 italic">Carries: {getPhenotype(sire).carries}</p>}
                        </div>
                    </div>

                    {/* Dam Card */}
                    <div className="flex flex-col gap-4">
                         {renderSelector(dam, setDam, "Dam (Female)", "luxury-magenta")}
                         <div className="p-4 bg-slate-900/30 border border-luxury-magenta/20 rounded-sm">
                            <span className="text-[10px] text-luxury-magenta uppercase tracking-widest font-bold block mb-1">Dam Phenotype</span>
                            <p className="text-white font-display text-lg uppercase leading-tight mb-2">{getPhenotype(dam).fullName}</p>
                            {getPhenotype(dam).altName && <p className="text-xs text-slate-400 italic mb-2">({getPhenotype(dam).altName})</p>}
                            {getPhenotype(dam).carries && <p className="text-xs text-slate-500 italic">Carries: {getPhenotype(dam).carries}</p>}
                        </div>
                    </div>
                </div>

                {/* Calculate Action */}
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

      {/* PUNNETT SQUARE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity" onClick={() => setShowModal(false)} />
             
             <div className="relative z-10 w-full max-w-4xl bg-[#0a0a0a] border border-slate-800 shadow-2xl flex flex-col max-h-[90vh] rounded-sm animate-in fade-in zoom-in-95 duration-300">
                
                {/* Modal Header */}
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

                {/* Warning Banner inside Modal */}
                {modalRisk && (
                    <div className="bg-red-900/30 border-b border-red-500/50 p-4 text-center">
                        <p className="text-red-400 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                            <AlertTriangle size={16} /> 
                            CRITICAL WARNING: Double Merle (M/M) Offspring Detected in Simulation
                        </p>
                    </div>
                )}

                {/* Results List */}
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
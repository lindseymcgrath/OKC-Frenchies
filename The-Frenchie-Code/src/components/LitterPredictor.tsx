import React, { useState, useEffect, useMemo } from 'react';
import { calculateLitterPrediction, LOCI, getPhenotype } from '../utils/calculatorHelpers';
import { DogVisualizer } from './DogVisualizer';
import { Grid, List, Search, FileDown, X, Share2, Save, Upload } from 'lucide-react';

const TraitCategory = ({ title, traits }: { title: string, traits: any[] }) => {
    if (!traits || traits.length === 0) return null;
    return (
        <div className="bg-slate-900/50 rounded-xl overflow-hidden border border-slate-800/80 mb-6 shadow-xl">
            <h3 className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/50 font-bold text-white text-[10px] uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-luxury-teal"></div>
                {title}
            </h3>
            <div className="divide-y divide-slate-800/50">
                {traits.map((t: any, i: number) => (
                    <div key={i} className="px-4 py-3 flex justify-between items-center group hover:bg-slate-800/30 transition-colors">
                        <span className="text-slate-300 font-semibold text-sm tracking-wide">{t.name}</span>
                        <div className="flex items-center gap-3 w-1/3 justify-end">
                            <span className="text-luxury-teal font-mono font-bold text-lg">{t.prob}</span>
                            <div className="hidden sm:block w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden shrink-0">
                                <div className="h-full bg-luxury-teal rounded-full" style={{ width: `${t.probRaw * 100}%` }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const LitterPredictor = (props: any) => {
    const { sire, setSire, dam, setDam, onSaveDog, setShowKennel, setActiveLoadSlot, studio, isMobile } = props;
    const [activeTab, setActiveTab] = useState<'sire' | 'dam' | 'litter'>('sire');
    const [activeGenotypeSelection, setActiveGenotypeSelection] = useState<Record<string, string>>({});
    const [sireName, setSireName] = useState('');
    const [damName, setDamName] = useState('');
    const [resultsView, setResultsView] = useState<'breakdown' | 'combinations'>('breakdown');
    const [puppyName, setPuppyName] = useState('');
    const [puppySex, setPuppySex] = useState<'Male' | 'Female'>('Male');

    useEffect(() => { 
        if (sire?.name) setSireName(sire.name); 
        if (dam?.name) setDamName(dam.name); 
        setActiveGenotypeSelection({});
    }, [sire, dam]);

    const handleDownloadPDF = () => {
        window.print();
    };

    const { loci: locusProbs, breakdown } = useMemo(() => calculateLitterPrediction(sire, dam) as any, [sire, dam]);

    // Helper for Sire/Dam Controls
    // Helper for Sire/Dam Controls
    const renderControls = (dna: any, setDna: any, label: string, name: string, setName: any) => {
        const traits = getPhenotype(dna);

        return (
            <div className="flex flex-col md:flex-row flex-1 min-h-0 relative w-full h-full bg-[#020617]">
                {/* LEFT: VISUALIZER */}
                <div className="shrink-0 md:shrink md:h-full md:overflow-y-auto md:w-1/2 border-b md:border-b-0 md:border-r border-slate-800 px-6 py-4 flex flex-col relative overflow-hidden bg-[#0a0a0a] shadow-lg z-40">
                    <div className="w-full flex justify-center items-center relative z-0">
                        <DogVisualizer traits={traits} showLabel={false} customClassName="w-44 h-44 md:w-60 md:h-60" />
                    </div>

                    <div className="w-full mt-1 flex flex-col items-center md:items-start relative z-20">
                         <input 
                             type="text" 
                             placeholder={`${label} NAME`} 
                             value={name} 
                             onChange={(e) => setName(e.target.value.toUpperCase())} 
                             className="w-full bg-transparent border-none focus:ring-0 outline-none text-center md:text-left font-serif text-2xl text-white mb-1 tracking-wide placeholder:text-slate-500 p-0"
                         />
                         <div className="bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-800 inline-block">
                             <p className="font-mono text-[10px] text-luxury-teal tracking-wider text-center md:text-left">{traits.compactDnaString}</p>
                         </div>

                         {/* ACTION BUTTONS (INLINED) */}
                         <div className="flex gap-3 mt-3 w-full md:w-auto px-4 md:px-0">
                             <button 
                                 onClick={() => { setActiveLoadSlot(label.toLowerCase() as 'sire' | 'dam'); setShowKennel(true); }}
                                 className="flex-1 md:flex-none px-6 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-full font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 border border-slate-700/50 transition-colors"
                             >
                                 <Upload size={14} /> Load
                             </button>
                             <button 
                                 onClick={() => {
                                     if (!name.trim()) { alert(`Please enter a name for the ${label}.`); return; }
                                     onSaveDog(name, label === 'Sire' ? 'Male' : 'Female', dna);
                                     alert(`${label.toUpperCase()} saved to Kennel!`);
                                 }}
                                 className="flex-1 md:flex-none px-6 py-2.5 bg-luxury-teal/10 hover:bg-luxury-teal text-luxury-teal hover:text-black rounded-full font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 border border-luxury-teal/30 transition-all"
                             >
                                 <Save size={14} /> Save
                             </button>
                         </div>
                    </div>
                </div>

                {/* RIGHT: LOCI LIST */}
                <div className="md:w-1/2 flex-1 min-h-0 overflow-y-auto custom-scrollbar bg-[#020617] pb-[env(safe-area-inset-bottom)] mb-12">
                    {Object.keys(LOCI).map(key => {
                        const locus = (LOCI as any)[key];
                        const isToggle = locus.options.length === 2 && locus.options.includes('No');
                        
                        let technical = '';
                        let descriptive = locus.label;
                        if (locus.label.includes('Locus')) {
                            const parts = locus.label.split('(');
                            technical = parts[0].trim();
                            if (parts[1]) descriptive = parts[1].replace(')', '').trim();
                            else { descriptive = technical; technical = ''; }
                        }

                        if (isToggle) {
                            const isOn = dna[key] === 'Yes';
                            return (
                                <div key={key} className="flex justify-between items-center bg-[#0f172a] px-4 py-2 border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                                    <div className="flex flex-col">
                                        <label className="text-xs text-slate-200 font-bold">{descriptive}</label>
                                        {technical && <label className="text-[9px] text-slate-500 uppercase tracking-widest">{technical}</label>}
                                    </div>
                                    <button 
                                        onClick={() => setDna({...dna, [key]: isOn ? 'No' : 'Yes'})}
                                        className={`px-3 py-1 rounded-full font-mono text-xs font-bold min-w-[65px] text-center transition-all ${isOn ? 'bg-luxury-teal text-black shadow-md shadow-luxury-teal/20' : 'bg-slate-800 text-slate-400'}`}
                                    >
                                        {isOn ? 'ON' : 'OFF'}
                                    </button>
                                </div>
                            );
                        }

                        return (
                            <div key={key} className="flex justify-between items-center bg-[#0f172a] px-4 py-2 border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors relative">
                                <div className="flex flex-col pointer-events-none">
                                    <label className="text-xs text-slate-200 font-bold">{descriptive}</label>
                                    {technical && <label className="text-[9px] text-slate-500 uppercase tracking-widest">{technical}</label>}
                                </div>
                                <div className="relative">
                                    <div className={`px-3 py-1 rounded-full font-mono text-xs font-bold min-w-[65px] text-center transition-all ${dna[key] && dna[key] !== 'N N' && dna[key] !== 'ky ky' && dna[key] !== '-' ? 'bg-luxury-teal text-black shadow-md shadow-luxury-teal/20' : 'bg-slate-800 text-slate-300'}`}>
                                        {dna[key] || '-'}
                                    </div>
                                    <select 
                                        value={dna[key]} 
                                        onChange={(e) => setDna({...dna, [key]: e.target.value})} 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-[16px] /* 16px prevents iOS zoom */"
                                    >
                                        {locus.options.map((o:string) => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col flex-1 min-h-0 bg-[#020617] w-full h-full relative">
            {/* APP SUB-TABS (Sire / Dam / Results) */}
            <div className="shrink-0 flex bg-[#0a0a0a] border-b border-slate-800 z-30 shadow-sm">
                <button onClick={() => setActiveTab('sire')} className={`flex-1 py-3 text-[10px] uppercase font-bold tracking-widest transition-all border-b-2 ${activeTab === 'sire' ? 'text-luxury-teal border-luxury-teal bg-luxury-teal/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>Sire</button>
                <button onClick={() => setActiveTab('dam')} className={`flex-1 py-3 text-[10px] uppercase font-bold tracking-widest transition-all border-b-2 ${activeTab === 'dam' ? 'text-luxury-magenta border-luxury-magenta bg-luxury-magenta/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>Dam</button>
                <button onClick={() => setActiveTab('litter')} className={`flex-1 py-3 text-[10px] uppercase font-bold tracking-widest transition-all border-b-2 ${activeTab === 'litter' ? 'text-indigo-400 border-indigo-400 bg-indigo-400/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>Results</button>
            </div>

            {/* PARENT CONTROLS CONTAINER */}
            <div className={`flex-1 min-h-0 flex-col ${activeTab === 'litter' ? 'hidden' : 'flex'}`}>
                <div className={`flex-1 min-h-0 w-full h-full flex flex-col ${activeTab !== 'sire' ? 'hidden' : 'flex'}`}>
                    {renderControls(sire, (v:any)=>setSire((p:any)=>({...p,...v})), 'SIRE', sireName, setSireName)}
                </div>
                <div className={`flex-1 min-h-0 w-full h-full flex flex-col ${activeTab !== 'dam' ? 'hidden' : 'flex'}`}>
                    {renderControls(dam, (v:any)=>setDam((p:any)=>({...p,...v})), 'DAM', damName, setDamName)}
                </div>
            </div>

            {/* PREDICTION RESULTS CONTAINER */}
            <div className={`${activeTab !== 'litter' ? 'hidden' : 'flex'} flex-1 min-h-0 bg-[#020617] flex-col max-w-full lg:max-w-[1200px] mx-auto w-full shadow-2xl overflow-hidden`}>
                
                {/* Search & Tabs */}
                <div className="shrink-0 bg-[#0a0a0a]/80 border-b border-slate-800 p-4 z-20 backdrop-blur-md">
                    <div className="flex gap-2 mb-3 bg-slate-900/50 p-1 rounded-lg border border-slate-800/80">
                        <button onClick={() => setResultsView('breakdown')} className={`flex-1 py-2 text-[10px] uppercase font-bold tracking-widest rounded-md transition-all ${resultsView === 'breakdown' ? 'bg-luxury-teal text-black shadow-md' : 'bg-transparent text-slate-400 hover:text-slate-200'}`}>Trait Breakdown</button>
                        <button onClick={() => setResultsView('combinations')} className={`flex-1 py-2 text-[10px] uppercase font-bold tracking-widest rounded-md transition-all ${resultsView === 'combinations' ? 'bg-luxury-teal text-black shadow-md' : 'bg-transparent text-slate-400 hover:text-slate-200'}`}>Puppy Builder</button>
                    </div>

                    <div className="flex justify-between items-center px-1">
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{resultsView === 'breakdown' ? 'Genetic Statistics' : 'Interactive Playground'}</p>
                        <button onClick={handleDownloadPDF} className="text-luxury-teal hover:text-emerald-400 p-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"><FileDown size={14}/> Export</button>
                    </div>
                </div>

                {/* Vertical App List */}
                <div className="flex-1 min-h-0 flex flex-col w-full h-full pb-[env(safe-area-inset-bottom)]">
                    {resultsView === 'breakdown' ? (
                        <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-3xl mx-auto pb-12 w-full">
                            <TraitCategory title="Base Colors" traits={breakdown?.baseColors || []} />
                            <TraitCategory title="Coat & Texture" traits={breakdown?.coats || []} />
                            <TraitCategory title="Patterns & Modifiers" traits={breakdown?.patterns || []} />
                            <TraitCategory title="Carriers (Hidden Recessives)" traits={breakdown?.carriers || []} />
                        </div>
                    ) : (() => {
                        // UNIFIED PUPPY BUILDER (Combinations Replacement)
                        // 1. Compute effective selection
                        const effectiveSelection = { ...activeGenotypeSelection };
                        Object.keys(LOCI).forEach(locusKey => {
                            if (!effectiveSelection[locusKey]) {
                                let bestAllele = 'n/n';
                                let bestProb = -1;
                                const locusBreakdown = locusProbs[locusKey] || {};
                                Object.entries(locusBreakdown).forEach(([allele, prob]) => {
                                    if ((prob as number) > bestProb) {
                                        bestProb = prob as number;
                                        bestAllele = allele;
                                    }
                                });
                                effectiveSelection[locusKey] = bestAllele;
                            }
                        });

                        // 2. Compute exact probability (Product of all selected alleles)
                        let exactProbability = 1;
                        Object.keys(LOCI).forEach(locusKey => {
                            const allele = effectiveSelection[locusKey];
                            const locusBreakdown = locusProbs[locusKey] || {};
                            const alleleProb = locusBreakdown[allele] || 0;
                            exactProbability *= (alleleProb as number);
                        });

                        // 3. Compute active traits
                        const activeTraits = getPhenotype(effectiveSelection);

                        return (
                            <div className="flex flex-col flex-1 min-h-0 w-full h-full">
                                {/* STICKY TOP SECTION */}
                                <div className="shrink-0 z-40 bg-[#0f172a] flex flex-col shadow-md">
                                    {/* Visualizer and Carries Box */}
                                    <div className="flex bg-[#0f172a] p-4 relative border-b border-slate-700">
                                        <div className="w-1/2 flex items-center justify-center relative z-10 bottom-0">
                                             <DogVisualizer traits={activeTraits} showLabel={false} customClassName="w-32 h-32 md:w-40 md:h-40 transition-all duration-300 drop-shadow-2xl" />
                                        </div>
                                        
                                        <div className="w-1/2 flex flex-col items-center justify-center pl-2 pr-4">
                                            <p className="font-serif text-[15px] sm:text-lg text-white font-bold uppercase tracking-wider text-center line-clamp-2 leading-tight">{activeTraits.phenotypeName}</p>
                                            <div className="w-full h-[1px] bg-slate-700 my-2"></div>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1 z-10 relative">Carries:</p>
                                            <div className="bg-slate-900/80 rounded-lg w-full p-2 flex items-center justify-center text-center z-10 border border-slate-700 min-h-[40px]">
                                                <p className="font-sans text-[11px] text-emerald-500 font-medium leading-relaxed">
                                                    {activeTraits.carriersString || 'No hidden recessive traits.'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Loci Breakdown */}
                                <div className="flex-1 min-h-0 overflow-y-auto w-full custom-scrollbar">
                                    <div className="p-3 space-y-1.5 max-w-3xl mx-auto w-full pb-[env(safe-area-inset-bottom)] mb-20">
                                        {Object.keys(LOCI).map((key) => {
                                        const locus = (LOCI as any)[key];
                                        const locusBreakdown = locusProbs[key] || {};
                                        
                                        const percentages = Object.entries(locusBreakdown).map(([a, p]) => ({
                                            genotype: a,
                                            percent: ((p as number) * 100).toFixed(0) + '%'
                                        })).filter(p => parseFloat(p.percent) > 0);

                                        if (percentages.length === 0) return null;

                                        let technical = locus.label;
                                        if (locus.label.includes('Locus')) technical = locus.label.split('(')[0].trim();

                                        return (
                                            <div key={key} className="flex flex-row justify-between items-center bg-[#0a0a0a] border border-slate-800/80 p-2 rounded-lg gap-3 shadow-sm">
                                                <p className="font-bold text-slate-400 text-[11px] uppercase w-16 text-right shrink-0">{technical}</p>
                                                <div className="flex-1 flex flex-wrap justify-start gap-1.5">
                                                    {percentages.map(p => {
                                                        const isActive = effectiveSelection[key] === p.genotype;
                                                        const isOnlyOption = percentages.length === 1;
                                                        
                                                        const toggleSelection = () => {
                                                            if (isOnlyOption) return;
                                                            setActiveGenotypeSelection({ ...effectiveSelection, [key]: p.genotype });
                                                        };

                                                        return (
                                                        <div 
                                                            key={p.genotype} 
                                                            onClick={toggleSelection}
                                                            className={`flex-1 min-w-[50px] max-w-[85px] border rounded py-1 px-1.5 text-center transition-all flex flex-col justify-center items-center ${
                                                                isOnlyOption ? 'bg-luxury-teal/10 text-luxury-teal border-luxury-teal/20 cursor-not-allowed opacity-70' :
                                                                isActive ? 'bg-luxury-teal text-black border-luxury-teal scale-[1.02] shadow-sm cursor-pointer' : 
                                                                'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-600 cursor-pointer'
                                                            }`}
                                                        >
                                                            <p className={`font-bold font-mono text-[11px] tracking-wider leading-none ${isActive && !isOnlyOption ? 'text-black' : ''}`}>{p.genotype}</p>
                                                            <p className={`text-[8px] uppercase mt-0.5 font-bold leading-none ${isActive && !isOnlyOption ? 'text-black/70' : isOnlyOption ? 'text-luxury-teal/60' : 'text-slate-600'}`}>{p.percent}</p>
                                                        </div>
                                                    )})}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                <div className="px-4 mt-4 mb-10 max-w-3xl mx-auto w-full flex flex-col gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">Save to Kennel</p>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Name your puppy..." 
                                            value={puppyName}
                                            onChange={(e) => setPuppyName(e.target.value)}
                                            className="flex-1 bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-luxury-teal"
                                        />
                                        <button 
                                            onClick={() => setPuppySex(prev => prev === 'Male' ? 'Female' : 'Male')}
                                            className={`px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-colors ${
                                                puppySex === 'Male' 
                                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                                                : 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                                            }`}
                                        >
                                            {puppySex}
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            const finalName = puppyName.trim() || activeTraits.phenotypeName;
                                            onSaveDog(finalName, puppySex, effectiveSelection);
                                            alert(`${finalName} saved to kennel!`);
                                            setPuppyName('');
                                        }}
                                        className="w-full bg-luxury-teal hover:bg-emerald-400 text-black p-3 rounded-lg border border-luxury-teal font-bold uppercase tracking-widest transition-colors flex justify-center items-center gap-2 shadow-lg shadow-luxury-teal/20"
                                    >
                                        <Save size={16} /> Save Puppy
                                    </button>
                                </div>
                                </div>
                                </div>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
};
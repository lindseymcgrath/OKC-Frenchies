import React, { useState, useEffect, useMemo } from 'react';
import { calculateLitterPrediction, LOCI, getPhenotype } from '../utils/calculatorHelpers';
import { DogVisualizer } from './DogVisualizer';
import { Grid, List, Search, FileDown, X, Share2, Save } from 'lucide-react';

export const LitterPredictor = (props: any) => {
    const { sire, setSire, dam, setDam, onSaveDog, setShowKennel, setActiveLoadSlot, studio, isMobile } = props;
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sireName, setSireName] = useState('');
    const [damName, setDamName] = useState('');
    
    // Mobile Tabs State
    const [activeTab, setActiveTab] = useState<'sire' | 'dam' | 'litter'>('sire');
    
    // 🔥 RESTORED: The "Pop Open" State
    const [selectedPuppy, setSelectedPuppy] = useState<any | null>(null);

    useEffect(() => { if (sire?.name) setSireName(sire.name); if (dam?.name) setDamName(dam.name); }, [sire, dam]);

    const handleDownloadPDF = () => {
        const old = viewMode; 
        setViewMode('list'); 
        setTimeout(() => { window.print(); setViewMode(old); }, 850);
    };

    const offspring = useMemo(() => calculateLitterPrediction(sire, dam), [sire, dam]);
    const colors = useMemo(() => Array.from(new Set(offspring.map((p:any) => p.baseColor))), [offspring]);
    const filtered = offspring.filter((p:any) => (!selectedColor || p.baseColor === selectedColor) && (!searchTerm || p.phenotypeName.toLowerCase().includes(searchTerm.toLowerCase())));

    // Helper for Sire/Dam Controls
    // Helper for Sire/Dam Controls
    const renderControls = (dna: any, setDna: any, label: string, name: string, setName: any) => {
        const traits = getPhenotype(dna);

        return (
            <div className="flex flex-col relative w-full h-full bg-[#020617]">
                {/* TOP HEADER: VISUALIZER */}
                <div className="border-b border-slate-800 p-6 flex flex-col items-center relative overflow-hidden bg-[#0a0a0a]/40">
                    <div className="h-40 w-full flex justify-center items-end pb-2 relative z-0 mt-2">
                        <DogVisualizer traits={traits} scale={0.8} showLabel={false} />
                    </div>

                    <div className="w-full mt-4 flex flex-col items-center relative z-20">
                         <input 
                             type="text" 
                             placeholder={`${label} NAME`} 
                             value={name} 
                             onChange={(e) => setName(e.target.value.toUpperCase())} 
                             className="w-full bg-transparent border-none focus:ring-0 outline-none text-center font-serif text-3xl text-white mb-1 tracking-wide placeholder:text-slate-700"
                         />
                         <div className="bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-800">
                             <p className="font-mono text-[10px] text-luxury-teal tracking-wider">{traits.compactDnaString}</p>
                         </div>
                    </div>
                </div>

                {/* LOCI LIST */}
                <div className="flex-1 overflow-y-auto bg-[#020617] pb-4">
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
                                <div key={key} className="flex justify-between items-center bg-[#0f172a] px-4 py-3 border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                                    <div className="flex flex-col">
                                        <label className="text-sm text-slate-200 font-bold">{descriptive}</label>
                                        {technical && <label className="text-[10px] text-slate-500 uppercase tracking-widest">{technical}</label>}
                                    </div>
                                    <button 
                                        onClick={() => setDna({...dna, [key]: isOn ? 'No' : 'Yes'})}
                                        className={`px-4 py-2 rounded-full font-mono text-sm font-bold min-w-[80px] text-center transition-all ${isOn ? 'bg-luxury-teal text-black shadow-md shadow-luxury-teal/20' : 'bg-slate-800 text-slate-400'}`}
                                    >
                                        {isOn ? 'ON' : 'OFF'}
                                    </button>
                                </div>
                            );
                        }

                        return (
                            <div key={key} className="flex justify-between items-center bg-[#0f172a] px-4 py-3 border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors relative">
                                <div className="flex flex-col pointer-events-none">
                                    <label className="text-sm text-slate-200 font-bold">{descriptive}</label>
                                    {technical && <label className="text-[10px] text-slate-500 uppercase tracking-widest">{technical}</label>}
                                </div>
                                <div className="relative">
                                    <div className={`px-4 py-2 rounded-full font-mono text-sm font-bold min-w-[80px] text-center transition-all ${dna[key] && dna[key] !== 'N N' && dna[key] !== 'ky ky' && dna[key] !== '-' ? 'bg-luxury-teal text-black shadow-md shadow-luxury-teal/20' : 'bg-slate-800 text-slate-300'}`}>
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
        <div className="flex flex-col h-full bg-[#020617] w-full relative">
            {/* APP SUB-TABS (Sire / Dam / Results) */}
            <div className="flex bg-[#0a0a0a] border-b border-slate-800 sticky top-0 z-30 shadow-sm">
                <button onClick={() => setActiveTab('sire')} className={`flex-1 py-3 text-[10px] uppercase font-bold tracking-widest transition-all border-b-2 ${activeTab === 'sire' ? 'text-luxury-teal border-luxury-teal bg-luxury-teal/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>Sire</button>
                <button onClick={() => setActiveTab('dam')} className={`flex-1 py-3 text-[10px] uppercase font-bold tracking-widest transition-all border-b-2 ${activeTab === 'dam' ? 'text-luxury-magenta border-luxury-magenta bg-luxury-magenta/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>Dam</button>
                <button onClick={() => setActiveTab('litter')} className={`flex-1 py-3 text-[10px] uppercase font-bold tracking-widest transition-all border-b-2 ${activeTab === 'litter' ? 'text-indigo-400 border-indigo-400 bg-indigo-400/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>Results</button>
            </div>

            {/* PARENT CONTROLS CONTAINER */}
            <div className={`flex-1 flex-col ${activeTab === 'litter' ? 'hidden' : 'flex'}`}>
                <div className={`flex-1 ${activeTab !== 'sire' ? 'hidden' : 'block'}`}>
                    {renderControls(sire, (v:any)=>setSire((p:any)=>({...p,...v})), 'SIRE', sireName, setSireName)}
                </div>
                <div className={`flex-1 ${activeTab !== 'dam' ? 'hidden' : 'block'}`}>
                    {renderControls(dam, (v:any)=>setDam((p:any)=>({...p,...v})), 'DAM', damName, setDamName)}
                </div>
            </div>

            {/* PREDICTION RESULTS CONTAINER */}
            <div className={`${activeTab !== 'litter' ? 'hidden' : 'flex'} flex-1 bg-[#020617] flex-col max-w-md mx-auto w-full shadow-2xl overflow-hidden`}>
                
                {/* Search & Tabs */}
                <div className="bg-[#0a0a0a]/80 border-b border-slate-800 p-4 sticky top-0 z-20 backdrop-blur-md">
                    <div className="flex gap-2 mb-3">
                        <select onChange={(e)=>setSelectedColor(e.target.value === 'all' ? null : e.target.value)} className="w-1/2 bg-[#0f172a] border border-slate-700 p-3 rounded-sm text-[10px] font-bold uppercase tracking-widest text-slate-300 outline-none">
                            <option value="all">Filter: All</option>
                            {colors.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select onChange={(e)=>setSearchTerm(e.target.value === 'all' ? '' : e.target.value)} className="w-1/2 bg-[#0f172a] border border-slate-700 p-3 rounded-sm text-[10px] font-bold uppercase tracking-widest text-slate-300 outline-none">
                            <option value="all">Sort By</option>
                            <option value="Probability">Probability</option>
                        </select>
                    </div>
                    <div className="flex justify-between items-center px-1">
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{filtered.length} Results Found</p>
                        <button onClick={handleDownloadPDF} className="text-luxury-teal hover:text-emerald-400 p-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"><FileDown size={14}/> Export</button>
                    </div>
                </div>

                {/* Vertical App List */}
                <div className="flex-1 overflow-y-auto pb-24">
                    {filtered.map((p:any, i:number) => (
                        <div 
                            key={i} 
                            onClick={() => setSelectedPuppy(p)}
                            className="bg-transparent border-b border-slate-800/50 p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-800/20 transition-colors"
                        >
                            {/* Left: Dog Image */}
                            <div className="w-20 h-20 shrink-0 relative flex items-center justify-center bg-black/20 rounded-full border border-slate-700/50 shadow-inner overflow-hidden">
                                <DogVisualizer traits={getPhenotype(p.dna)} scale={0.65} showLabel={false} />
                            </div>
                            
                            {/* Middle: Prob */}
                            <div className="flex flex-col shrink-0 justify-center min-w-[60px]">
                                <p className="text-luxury-teal font-mono text-xl font-bold tracking-tighter">{p.probPrecision || p.probability}</p>
                            </div>

                            {/* Right: Phenotype Name */}
                            <div className="flex-1 flex flex-col justify-center text-right">
                                <p className="text-[11px] text-white font-bold uppercase leading-tight tracking-wider line-clamp-2">{p.phenotypeName}</p>
                                <p className="text-[9px] text-slate-500 font-mono mt-1 opacity-60 truncate ">{p.dnaString}</p>
                            </div>
                        </div>
                    ))}
                </div>

            {/* 🔥 POP-UP MODAL UI - CARRIES EXACT REPLICA */}
            {selectedPuppy && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md" onClick={() => setSelectedPuppy(null)}>
                    <div className="bg-[#020617] w-full max-w-md rounded-2xl relative shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-800" onClick={e => e.stopPropagation()}>
                        
                        {/* Header: Name and Close */}
                        <div className="flex justify-between items-center p-4 border-b border-slate-800">
                            <h2 className="text-lg font-serif text-white uppercase tracking-wider">{selectedPuppy.phenotypeName}</h2>
                            <button onClick={() => setSelectedPuppy(null)} className="text-slate-500 hover:text-white bg-slate-900 rounded-full p-1.5"><X size={18} /></button>
                        </div>

                        <div className="overflow-y-auto custom-scrollbar flex-1 pb-6">
                            {/* Top Section: Visualizer and Carries Box */}
                            <div className="flex bg-[#0f172a] p-6 relative">
                                <div className="w-1/2 flex items-center justify-center relative z-10 bottom-0">
                                     <DogVisualizer traits={getPhenotype(selectedPuppy.dna)} scale={0.7} showLabel={false} />
                                </div>
                                
                                <div className="w-1/2 flex flex-col items-center justify-center pl-4">
                                    <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-2 z-10 relative">Carries:</p>
                                    <div className="bg-white rounded-lg shadow-lg w-full min-h-[120px] p-3 flex items-center justify-center text-center z-10 border border-slate-200">
                                        <p className="font-sans text-[13px] text-emerald-600 font-medium leading-relaxed">
                                            {getPhenotype(selectedPuppy.dna).carriersString || 'No hidden recessive traits.'}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Background stylistic elements */}
                                <div className="absolute inset-0 top-1/2 bg-slate-900" />
                            </div>

                            {/* Divider with Probability */}
                            <div className="w-full bg-[#1e293b] py-3 text-center border-y border-slate-700">
                                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                                    Genotype Probability: <span className="text-white">{selectedPuppy.probability}</span>
                                </p>
                            </div>

                            {/* Loci Breakdown */}
                            <div className="p-4 space-y-2">
                                {Object.keys(LOCI).map((key) => {
                                    const locus = (LOCI as any)[key];
                                    const alleles = selectedPuppy.dna[key];
                                    
                                    // Extract technical name only
                                    let technical = locus.label;
                                    if (locus.label.includes('Locus')) {
                                        technical = locus.label.split('(')[0].trim();
                                    }

                                    return (
                                        <div key={key} className="flex justify-between items-center bg-[#0a0a0a] border-b border-slate-800/50 p-3 hover:bg-slate-900 transition-colors">
                                            <p className="font-bold text-slate-200 text-sm w-1/3">{technical}</p>
                                            <div className="flex-1 flex justify-end gap-2">
                                                <div className="w-full flex-1 bg-luxury-teal/10 border border-luxury-teal/30 rounded-md py-2 px-3 text-center shadow-sm">
                                                    <p className="font-bold text-luxury-teal font-mono text-sm tracking-widest">{alleles}</p>
                                                    <p className="text-[9px] text-luxury-teal/60 uppercase font-bold mt-0.5">100%</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="px-4 mt-2">
                                <button 
                                    onClick={() => {
                                        onSaveDog(selectedPuppy.phenotypeName, 'Male', selectedPuppy.dna);
                                        alert("Puppy saved to kennel!");
                                    }}
                                    className="w-full py-4 bg-luxury-teal hover:bg-white text-black font-bold uppercase tracking-[0.2em] rounded-md flex items-center justify-center gap-2 transition-all shadow-xl"
                                >
                                    <Save size={18} /> Save Puppy to Kennel
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
            
            {/* Modal Closer for PDF logic */}
            </div>
        </div>
    );
};
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
        // 1. Get traits here so we can use the text (Name + DNA)
        const traits = getPhenotype(dna);

        return (
            <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-sm flex flex-col h-full">
                <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                    <h3 className={`font-serif text-lg ${label === 'SIRE' ? 'text-luxury-teal' : 'text-luxury-magenta'}`}>{label}</h3>
                    <div className="flex gap-2">
                        <button onClick={() => { setActiveLoadSlot(label.toLowerCase()); setShowKennel(true); }} className="px-2 py-1 bg-slate-800 text-[9px] font-bold uppercase border border-slate-700">Load</button>
                        <button onClick={() => onSaveDog(name, label === 'SIRE' ? 'Male' : 'Female', dna)} className="px-2 py-1 bg-luxury-teal text-black text-[9px] font-bold uppercase">Save</button>
                    </div>
                </div>

                {/* 🔥 FIX: h-72 (288px) gives enough room, scale 0.9 fits the dog perfectly inside it */}
                <div className="relative h-62 w-full flex items-center justify-center mb-2 overflow-hidden pointer-events-none">
                    <DogVisualizer traits={traits} scale={0.9} showLabel={false} />
                </div>

                {/* Text Labels */}
                <div className="text-center mb-3">
                    <p className="text-white font-bold text-xs uppercase tracking-wider">{traits.phenotypeName}</p>
                    <p className="text-luxury-teal font-mono text-[10px]">{traits.compactDnaString}</p>
                </div>

                <input value={name} onChange={(e) => setName(e.target.value.toUpperCase())} placeholder="NAME..." className="w-full bg-black/40 border border-slate-800 p-2 text-[10px] text-white text-center mb-4" />
                
                <div className="grid grid-cols-2 gap-1">
                    {Object.keys(LOCI).map(key => {
                        const locus = (LOCI as any)[key];
                        const isToggle = locus.options.length === 2 && locus.options.includes('No');
                        return (
                            <div key={key} className="flex justify-between items-center bg-black/20 px-2 py-1 border border-slate-800/50">
                                <label className="text-[8px] text-slate-500 font-bold truncate">{locus.label}</label>
                                {isToggle ? (
                                    <button onClick={() => setDna({...dna, [key]: dna[key] === 'Yes' ? 'No' : 'Yes'})} className={`text-[8px] font-bold ${dna[key] === 'Yes' ? 'text-luxury-teal' : 'text-slate-600'}`}>{dna[key] === 'Yes' ? 'ON' : 'OFF'}</button>
                                ) : (
                                    <select value={dna[key]} onChange={(e) => setDna({...dna, [key]: e.target.value})} className="bg-transparent text-[8px] text-white outline-none text-right w-16 appearance-none">
                                        {locus.options.map((o:string) => <option key={o} value={o} className="bg-slate-900">{o}</option>)}
                                    </select>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {/* 🔥 MOBILE TABS (Only visible on mobile) */}
            {isMobile && (
                <div className="flex bg-slate-900 p-1 rounded-sm border border-slate-800 sticky top-[80px] z-30 shadow-lg">
                    <button onClick={() => setActiveTab('sire')} className={`flex-1 py-3 text-[10px] uppercase font-bold tracking-widest rounded-sm transition-all ${activeTab === 'sire' ? 'bg-luxury-teal text-black shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Sire</button>
                    <button onClick={() => setActiveTab('dam')} className={`flex-1 py-3 text-[10px] uppercase font-bold tracking-widest rounded-sm transition-all ${activeTab === 'dam' ? 'bg-luxury-magenta text-black shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Dam</button>
                    <button onClick={() => setActiveTab('litter')} className={`flex-1 py-3 text-[10px] uppercase font-bold tracking-widest rounded-sm transition-all ${activeTab === 'litter' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Results</button>
                </div>
            )}

            {/* PARENT CONTROLS CONTAINER */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden ${isMobile && activeTab === 'litter' ? 'hidden md:grid' : ''}`}>
                <div className={isMobile && activeTab !== 'sire' ? 'hidden md:block' : ''}>
                    {renderControls(sire, (v:any)=>setSire((p:any)=>({...p,...v})), 'SIRE', sireName, setSireName)}
                </div>
                <div className={isMobile && activeTab !== 'dam' ? 'hidden md:block' : ''}>
                    {renderControls(dam, (v:any)=>setDam((p:any)=>({...p,...v})), 'DAM', damName, setDamName)}
                </div>
            </div>

            {/* PREDICTION RESULTS CONTAINER */}
            <div className={`${isMobile && activeTab !== 'litter' ? 'hidden md:block' : ''} bg-[#020617] border border-slate-800 p-4 md:p-8 rounded-sm max-w-6xl mx-auto shadow-2xl`}>
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                    <div className="text-left">
                        <h2 className="font-serif text-2xl text-white tracking-widest uppercase">Litter Projection</h2>
                        <p className="text-luxury-teal text-[10px] uppercase tracking-[0.3em]">Genetic Analysis</p>
                    </div>
                    <div className="flex gap-2 print:hidden">
                        <button onClick={handleDownloadPDF} className="p-2 bg-slate-800 text-slate-300 border border-slate-700 transition-all"><FileDown size={18}/></button>
                        <div className="flex bg-slate-900 p-1 border border-slate-800">
                            <button onClick={() => setViewMode('grid')} className={`px-4 py-2 ${viewMode === 'grid' ? 'bg-luxury-teal text-black' : 'text-slate-500'}`}><Grid size={14}/></button>
                            <button onClick={() => setViewMode('list')} className={`px-4 py-2 ${viewMode === 'list' ? 'bg-luxury-teal text-black' : 'text-slate-500'}`}><List size={14}/></button>
                        </div>
                    </div>
                </div>

                {/* Search & Tabs */}
                <div className="space-y-4 mb-6 print:hidden">
                    <input type="text" placeholder="Search patterns or DNA..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="w-full bg-black/40 border border-slate-800 p-2 text-xs text-white" />
                    <div className="flex gap-2 overflow-x-auto no-scrollbar border-b border-slate-900 pb-2">
                        <button onClick={()=>setSelectedColor(null)} className={`px-4 py-1 text-[9px] uppercase font-bold border ${!selectedColor ? 'bg-white text-black' : 'text-slate-500 border-slate-800'}`}>All</button>
                        {colors.map(c => <button key={c} onClick={()=>setSelectedColor(c)} className={`px-4 py-1 text-[9px] uppercase font-bold border ${selectedColor === c ? 'bg-luxury-teal text-black' : 'text-slate-500 border-slate-800'}`}>{c}</button>)}
                    </div>
                </div>

                <div className={viewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4" : "space-y-2"}>
                    {filtered.map((p:any, i:number) => (
                        <div 
                            key={i} 
                            onClick={() => setSelectedPuppy(p)}
                            // 🔥 NOTE: min-h is kept at 220px for compact look
                            className={`bg-black/40 border border-slate-800 p-3 rounded-sm relative cursor-pointer hover:border-luxury-teal transition-all flex ${viewMode === 'grid' ? 'flex-col items-center justify-between min-h-[220px]' : 'flex-row items-center gap-6 p-4'}`}
                        >
                            <span className="absolute top-2 right-2 text-luxury-teal font-mono text-[10px] font-bold">{p.probability}</span>
                            
                            {/* 🔥 FIX: Changed 'items-center' to 'items-end' and increased 'mt-4' to 'mt-16' to push dog down */}
                            <div className={`${viewMode === 'grid' ? 'h-32 w-full flex items-end justify-center mt-16 pb-2' : 'w-20 h-20'} relative`}>
                                <DogVisualizer traits={getPhenotype(p.dna)} scale={viewMode === 'grid' ? 0.65 : 0.5} showLabel={false} />
                            </div>
                            
                            {/* Text Container */}
                            <div className={`${viewMode === 'grid' ? 'w-full text-center border-t border-slate-800/50 pt-2 pb-1' : 'flex-1'}`}>
                                <p className="text-[9px] text-white font-bold uppercase leading-tight">{p.phenotypeName}</p>
                                <p className="text-[8px] text-slate-500 font-mono mt-1 w-full text-center px-1 truncate">{p.dnaString}</p>
                                {viewMode === 'list' && <p className="text-luxury-teal font-mono text-xs">{p.probPrecision}</p>}
                            </div>
                        </div>
                    ))}
                </div>

          {/* 🔥 POP-UP MODAL FIXES */}
            {selectedPuppy && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm" onClick={() => setSelectedPuppy(null)}>
                    {/* Added max-h and overflow for mobile safety */}
                    <div className="bg-[#0f172a] border border-slate-700 w-full max-w-2xl rounded-sm p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedPuppy(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-black/50 rounded-full p-1 z-10"><X size={20} /></button>
                        
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* 1. VISIBILITY FIX: Changed background to lighter slate so black dogs show up */}
                            {/* 2. CENTERING FIX: Removed padding (p-8) and used flex-center */}
                            <div className="w-full md:w-1/2 flex items-center justify-center bg-slate-800/50 rounded-sm border border-slate-700 aspect-square overflow-hidden shrink-0">
                                <div className="relative w-full h-full flex items-center justify-center">
                                     <DogVisualizer traits={getPhenotype(selectedPuppy.dna)} scale={1.1} showLabel={false} />
                                </div>
                            </div>

                            <div className="w-full md:w-1/2 space-y-4">
                                <div>
                                    {/* 3. TEXT FIX: Only showing name here (removed from under image) */}
                                    <h2 className="text-2xl font-serif text-white uppercase leading-none mb-1 pr-8">{selectedPuppy.phenotypeName}</h2>
                                    <p className="text-luxury-teal font-mono text-lg font-bold">{selectedPuppy.probability}</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-black/20 p-3 rounded-sm border border-slate-800">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">DNA Profile</p>
                                        {/* 4. DNA FIX: Binds to the new string we fixed in helper */}
                                        <input 
                                            readOnly 
                                            value={getPhenotype(selectedPuppy.dna).compactDnaString}
                                            className="w-full bg-transparent font-mono text-xs text-slate-300 outline-none border-none p-0"
                                        />
                                    </div>
                                    {getPhenotype(selectedPuppy.dna).carriersString && (
                                        <div className="bg-black/20 p-3 rounded-sm border border-slate-800">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Carries</p>
                                            <p className="font-mono text-xs text-emerald-400">
                                                {getPhenotype(selectedPuppy.dna).carriersString}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={() => {
                                        onSaveDog(selectedPuppy.phenotypeName, 'Male', selectedPuppy.dna);
                                        alert("Puppy saved to kennel!");
                                    }}
                                    className="w-full py-3 bg-luxury-teal text-black font-bold uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 mt-4 hover:bg-white transition-colors"
                                >
                                    <Save size={16} /> Save Puppy to Kennel
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
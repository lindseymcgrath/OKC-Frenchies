import React, { useState, useEffect, useMemo } from 'react';
import { calculateLitterPrediction, LOCI, getPhenotype } from '../utils/calculatorHelpers';
import { DogVisualizer } from './DogVisualizer';
import { Grid, List, FileDown, X, Save } from 'lucide-react';

export const LitterPredictor = (props: any) => {
    const { sire, setSire, dam, setDam, onSaveDog, setShowKennel, setActiveLoadSlot } = props;
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sireName, setSireName] = useState('');
    const [damName, setDamName] = useState('');
    const [selectedPuppy, setSelectedPuppy] = useState<any | null>(null);

    useEffect(() => { 
        if (sire?.name) setSireName(sire.name); 
        if (dam?.name) setDamName(dam.name); 
    }, [sire, dam]);

    // Robust PDF Download Logic
    const handleDownloadPDF = () => {
        const oldView = viewMode; 
        setViewMode('list'); 
        setTimeout(() => { 
            try {
                window.print(); 
            } catch (e) {
                console.error("Print failed", e);
                alert("Please use Ctrl+P to save as PDF.");
            } finally {
                setViewMode(oldView); 
            }
        }, 1000); 
    };

    const offspring = useMemo(() => calculateLitterPrediction(sire, dam), [sire, dam]);
    const colors = useMemo(() => Array.from(new Set(offspring.map((p:any) => p.baseColor))), [offspring]);
    const filtered = offspring.filter((p:any) => 
        (!selectedColor || p.baseColor === selectedColor) && 
        (!searchTerm || p.phenotypeName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const renderControls = (dna: any, setDna: any, label: string, name: string, setName: any) => {
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
                <div className="relative h-72 w-full flex items-center justify-center mb-2 overflow-hidden pointer-events-none">
                    <DogVisualizer traits={traits} scale={0.9} showLabel={false} />
                </div>
                {/* Parent Text Labels Restored */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
                {renderControls(sire, (v:any)=>setSire((p:any)=>({...p,...v})), 'SIRE', sireName, setSireName)}
                {renderControls(dam, (v:any)=>setDam((p:any)=>({...p,...v})), 'DAM', damName, setDamName)}
            </div>

            <div className="bg-[#020617] border border-slate-800 p-4 md:p-8 rounded-sm max-w-6xl mx-auto shadow-2xl">
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

                <div className="space-y-4 mb-6 print:hidden">
                    <input type="text" placeholder="Search patterns or DNA..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="w-full bg-black/40 border border-slate-800 p-2 text-xs text-white" />
                    <div className="flex gap-2 overflow-x-auto no-scrollbar border-b border-slate-900 pb-2">
                        <button onClick={()=>setSelectedColor(null)} className={`px-4 py-1 text-[9px] uppercase font-bold border ${!selectedColor ? 'bg-white text-black' : 'text-slate-500 border-slate-800'}`}>All</button>
                        {colors.map(c => <button key={c} onClick={()=>setSelectedColor(c)} className={`px-4 py-1 text-[9px] uppercase font-bold border ${selectedColor === c ? 'bg-luxury-teal text-black' : 'text-slate-500 border-slate-800'}`}>{c}</button>)}
                    </div>
                </div>

                <div className={viewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4" : "space-y-2"}>
                    {filtered.map((p:any, i:number) => (
                        <div key={i} onClick={() => setSelectedPuppy(p)} className={`bg-black/40 border border-slate-800 p-3 rounded-sm relative cursor-pointer hover:border-luxury-teal transition-all flex ${viewMode === 'grid' ? 'flex-col items-center justify-between min-h-[220px]' : 'flex-row items-center gap-6 p-4'}`}>
                            <span className="absolute top-2 right-2 text-luxury-teal font-mono text-[10px] font-bold">{p.probability}</span>
                            <div className={`${viewMode === 'grid' ? 'h-32 w-full flex items-end justify-center mt-16 pb-2' : 'w-20 h-20'} relative`}>
                                <DogVisualizer traits={getPhenotype(p.dna)} scale={viewMode === 'grid' ? 0.65 : 0.5} showLabel={false} />
                            </div>
                            <div className={`${viewMode === 'grid' ? 'w-full text-center border-t border-slate-800/50 pt-2 pb-1' : 'flex-1'}`}>
                                <p className="text-[9px] text-white font-bold uppercase leading-tight">{p.phenotypeName}</p>
                                <p className="text-[8px] text-slate-500 font-mono mt-1 w-full text-center px-1 truncate">{p.dnaString}</p>
                                {viewMode === 'list' && <p className="text-luxury-teal font-mono text-xs">{p.probPrecision}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div> {/* <-- THIS DIV WAS MISSING IN YOUR VERSION */}

            {selectedPuppy && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm" onClick={() => setSelectedPuppy(null)}>
                    <div className="bg-[#0f172a] border border-slate-700 w-full max-w-2xl rounded-sm p-6 relative shadow-2xl" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedPuppy(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={24} /></button>
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="w-full md:w-1/2 flex items-center justify-center bg-slate-800/50 rounded-sm border border-slate-700 aspect-square overflow-hidden">
                                <div className="relative w-full h-full flex items-center justify-center">
                                     <DogVisualizer traits={getPhenotype(selectedPuppy.dna)} scale={1.1} showLabel={false} />
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 space-y-4">
                                <div>
                                    <h2 className="text-2xl font-serif text-white uppercase leading-none mb-1">{selectedPuppy.phenotypeName}</h2>
                                    <p className="text-luxury-teal font-mono text-lg font-bold">{selectedPuppy.probability}</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-black/20 p-3 rounded-sm border border-slate-800">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">DNA Profile</p>
                                        <input readOnly value={selectedPuppy.dnaString} className="w-full bg-transparent font-mono text-xs text-slate-300 outline-none border-none p-0" />
                                    </div>
                                    {selectedPuppy.carriers && (
                                        <div className="bg-black/20 p-3 rounded-sm border border-slate-800">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Carries</p>
                                            <p className="font-mono text-xs text-emerald-400">{selectedPuppy.carriers}</p>
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => { onSaveDog(selectedPuppy.phenotypeName, 'Male', selectedPuppy.dna); alert("Puppy saved to kennel!"); }} className="w-full py-3 bg-luxury-teal text-black font-bold uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 mt-4 hover:bg-white transition-colors">
                                    <Save size={16} /> Save Puppy to Kennel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

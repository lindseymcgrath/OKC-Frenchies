import React, { useState } from 'react';
import { X, Share2, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import { DogVisualizer } from './DogVisualizer';
import { LOCI, getPhenotype, calculateLitterPrediction } from '../utils/calculatorHelpers';

interface LitterPredictorProps {
    sire: any;
    setSire: (dna: any) => void;
    dam: any;
    setDam: (dna: any) => void;
    dogNameInput: string;
    setDogNameInput: (name: string) => void;
    saveDog: (target: 'sire' | 'dam') => void;
    setShowKennel: (show: boolean) => void;
    studio: any;
}

export const LitterPredictor: React.FC<LitterPredictorProps> = ({
    sire,
    setSire,
    dam,
    setDam,
    dogNameInput,
    setDogNameInput,
    saveDog,
    setShowKennel,
    studio
}) => {
    const [selectedPuppy, setSelectedPuppy] = useState<any | null>(null);

    // Helper to render loci rows
    const renderLociRows = (dna: any, setDna: (val: any) => void, colorClass: string) => {
        return Object.keys(LOCI).map(key => {
            
            if (key === 'Panda') {
                const isKoiOn = dna['Panda'] === 'Koi';
                const isPandaOn = dna['Panda'] === 'Panda';
                
                return (
                    <div key="PatternMix" className="col-span-1 flex gap-1 border border-slate-800 p-1 bg-black/40">
                       <div className="flex-1 flex flex-col items-center">
                           <span className="text-[7px] text-slate-500 uppercase font-bold mb-1">Koi</span>
                           <button 
                                onClick={() => setDna({...dna, Panda: isKoiOn ? 'No' : 'Koi'})}
                                className={`text-[9px] ${isKoiOn ? colorClass : 'text-slate-600'}`}
                           >
                               {isKoiOn ? <ToggleRight size={14}/> : <ToggleLeft size={14}/>}
                           </button>
                       </div>
                       <div className="w-px bg-slate-800 mx-1"></div>
                       <div className="flex-1 flex flex-col items-center">
                           <span className="text-[7px] text-slate-500 uppercase font-bold mb-1">Panda</span>
                           <button 
                                onClick={() => setDna({...dna, Panda: isPandaOn ? 'No' : 'Panda'})}
                                className={`text-[9px] ${isPandaOn ? colorClass : 'text-slate-600'}`}
                           >
                               {isPandaOn ? <ToggleRight size={14}/> : <ToggleLeft size={14}/>}
                           </button>
                       </div>
                    </div>
                );
            }

            const locus = (LOCI as any)[key];
            return (
                <div key={key} className="flex justify-between items-center bg-black/40 px-2 py-1 border border-slate-800">
                    <label className="text-[9px] text-slate-500 uppercase truncate max-w-[60px]" title={locus.label}>{locus.label.split(' ')[0]}</label>
                    <select value={dna[key]} onChange={(e) => setDna({...dna, [key]: e.target.value})} className="bg-transparent text-[9px] text-white outline-none font-mono text-right w-1/2">
                        {locus.options.map((o: string) => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>
            );
        });
    };

    return (
        <div className="space-y-8">
            {/* Universal Save Input for Pair Mode */}
            <div className="flex justify-center gap-2 mb-4">
                <input 
                    value={dogNameInput}
                    onChange={(e) => setDogNameInput(e.target.value)}
                    placeholder="Save Dog As..."
                    className="bg-black/40 border border-slate-700 p-2 text-xs text-white outline-none w-64 rounded-sm focus:border-luxury-teal"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Sire Card */}
                <div className="bg-slate-900/30 border border-luxury-teal/30 p-4 rounded-sm flex flex-col relative group">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-luxury-teal font-serif text-lg">SIRE</h3>
                        <div className="flex gap-2">
                            <button onClick={() => setShowKennel(true)} className="px-2 py-1 bg-slate-800 text-[9px] uppercase font-bold hover:text-white border border-slate-700 rounded-sm">Load</button>
                            <button onClick={() => saveDog('sire')} className="px-2 py-1 bg-luxury-teal/20 text-luxury-teal text-[9px] uppercase font-bold hover:bg-luxury-teal hover:text-black border border-luxury-teal/30 rounded-sm">Save</button>
                        </div>
                    </div>
                    <div className="flex justify-center mb-6 h-48"><DogVisualizer traits={getPhenotype(sire)} showLabel={true} /></div>
                    <div className="grid grid-cols-2 gap-2 mt-auto max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                        {renderLociRows(sire, setSire, 'text-luxury-teal')}
                    </div>
                </div>
                {/* Dam Card */}
                <div className="bg-slate-900/30 border border-luxury-magenta/30 p-4 rounded-sm flex flex-col relative group">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-luxury-magenta font-serif text-lg">DAM</h3>
                        <div className="flex gap-2">
                            <button onClick={() => setShowKennel(true)} className="px-2 py-1 bg-slate-800 text-[9px] uppercase font-bold hover:text-white border border-slate-700 rounded-sm">Load</button>
                            <button onClick={() => saveDog('dam')} className="px-2 py-1 bg-luxury-magenta/20 text-luxury-magenta text-[9px] uppercase font-bold hover:bg-luxury-magenta hover:text-black border border-luxury-magenta/30 rounded-sm">Save</button>
                        </div>
                    </div>
                    <div className="flex justify-center mb-6 h-48"><DogVisualizer traits={getPhenotype(dam)} showLabel={true} /></div>
                    <div className="grid grid-cols-2 gap-2 mt-auto max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                        {renderLociRows(dam, setDam, 'text-luxury-magenta')}
                    </div>
                </div>
            </div>
            
            {/* Branded Export Container */}
            <div ref={studio.litterRef} className="bg-[#020617] border border-slate-800 p-8 rounded-sm relative max-w-2xl mx-auto shadow-2xl">
                    <div className="text-center mb-8 border-b border-slate-800 pb-4">
                        <h2 className="font-serif text-3xl text-white tracking-widest uppercase mb-1">POWER COUPLE</h2>
                        <p className="text-luxury-teal text-[10px] uppercase tracking-[0.3em]">Projection Analysis</p>
                    </div>

                    {/* Parents Section */}
                    <div className="flex justify-center gap-8 mb-8 border-b border-slate-800 pb-8">
                        <div className="flex flex-col items-center w-1/3">
                            <h3 className="text-luxury-teal font-serif text-sm mb-2 uppercase tracking-wider text-center">{studio.studName !== 'SIRE NAME' ? studio.studName : 'SIRE'}</h3>
                            <div className="w-24 h-24 mb-2 relative">
                                <DogVisualizer traits={getPhenotype(sire)} scale={0.8} showLabel={false} />
                            </div>
                            <p className="text-[8px] text-slate-500 font-mono text-center leading-tight">{getPhenotype(sire).compactDnaString}</p>
                        </div>
                        <div className="flex items-center text-slate-700">
                            <X size={24} />
                        </div>
                        <div className="flex flex-col items-center w-1/3">
                            <h3 className="text-luxury-magenta font-serif text-sm mb-2 uppercase tracking-wider text-center">{studio.damName !== 'DAM NAME' ? studio.damName : 'DAM'}</h3>
                            <div className="w-24 h-24 mb-2 relative">
                                <DogVisualizer traits={getPhenotype(dam)} scale={0.8} showLabel={false} />
                            </div>
                            <p className="text-[8px] text-slate-500 font-mono text-center leading-tight">{getPhenotype(dam).compactDnaString}</p>
                        </div>
                    </div>

                    {/* Unique Puppies Grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-8">
                        {calculateLitterPrediction(sire, dam).map((item, idx) => (
                            <div key={idx} onClick={() => setSelectedPuppy(item.dna)} className="cursor-pointer bg-black/40 border border-slate-800 p-2 rounded-sm relative group hover:border-luxury-teal/50 transition-colors">
                                <div className="absolute top-1 right-1 z-20 px-1 py-0.5 bg-black/80 rounded text-[6px] font-bold text-luxury-teal border border-luxury-teal/30">{item.probability}</div>
                                <div className="mb-1 h-16 relative"><DogVisualizer traits={getPhenotype(item.dna)} scale={0.6} showLabel={false} /></div>
                                <span className="block text-center text-[7px] text-slate-200 font-bold uppercase tracking-tight leading-tight px-1 h-6 overflow-hidden">{getPhenotype(item.dna).phenotypeName}</span>
                                <span className="block text-center text-[6px] text-slate-500 font-mono mt-1 px-1 truncate border-t border-slate-800 pt-1">{item.dnaString}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-end border-t border-slate-800 pt-4">
                        <span className="text-[8px] text-slate-600 uppercase tracking-widest">Genetics are theoretical estimates.</span>
                        <span className="font-serif text-[8px] text-white tracking-[0.2em] uppercase">Designed by OKC FRENCHIES</span>
                    </div>
            </div>
            
            <div className="flex justify-center">
                <button onClick={studio.handleExportLitter} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs uppercase font-bold flex items-center gap-2 rounded-sm border border-slate-700 tracking-widest shadow-lg">
                    <Share2 size={16} /> Save to Camera Roll
                </button>
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

            {/* GENERATED IMAGE POPUP (Save to Camera Roll) */}
            {studio.generatedLitterImage && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl" onClick={() => studio.setGeneratedLitterImage(null)}>
                    <div className="relative bg-[#0f172a] border border-slate-800 p-6 rounded-sm w-full max-w-lg text-center" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => studio.setGeneratedLitterImage(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20}/></button>
                            <h3 className="font-serif text-2xl text-white mb-2">Projection Ready</h3>
                            <p className="text-slate-400 text-xs mb-6">Tap and hold (mobile) or Right Click (desktop) to save image.</p>
                            
                            <div className="bg-black border border-slate-800 p-2 mb-4">
                                <img src={studio.generatedLitterImage} alt="Generated Projection" className="w-full h-auto object-contain" />
                            </div>
                            
                            <button 
                                onClick={() => studio.setGeneratedLitterImage(null)}
                                className="w-full py-3 bg-slate-800 text-white uppercase text-xs font-bold hover:bg-slate-700 border border-slate-700"
                            >
                                Done
                            </button>
                    </div>
                </div>
            )}
        </div>
    );
};

import React, { useState } from 'react';
import { Save, Info, X, Check, ToggleLeft, ToggleRight } from 'lucide-react';
import { DogVisualizer } from './DogVisualizer';
import { LOCI, getPhenotype } from '../utils/calculatorHelpers';

interface DnaTranslatorProps {
    singleGender: 'Male' | 'Female';
    setSingleGender: (gender: 'Male' | 'Female') => void;
    currentDna: any;
    handleChange: (key: string, value: string) => void;
    onSave: () => void;
}

export const DnaTranslator: React.FC<DnaTranslatorProps> = ({
    singleGender,
    setSingleGender,
    currentDna,
    handleChange,
    onSave
}) => {
    const [infoModalOpen, setInfoModalOpen] = useState<string | null>(null);

    const getLocusInfo = (key: string) => {
        return (LOCI as any)[key]?.description || "No description available.";
    };

    return (
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
                    <div className="flex gap-2">
                        <button onClick={() => setSingleGender('Male')} className={`px-3 py-1 text-[9px] uppercase font-bold border ${singleGender === 'Male' ? 'bg-blue-900/30 text-blue-400 border-blue-500/50' : 'border-slate-700 text-slate-500'}`}>Male</button>
                        <button onClick={() => setSingleGender('Female')} className={`px-3 py-1 text-[9px] uppercase font-bold border ${singleGender === 'Female' ? 'bg-pink-900/30 text-pink-400 border-pink-500/50' : 'border-slate-700 text-slate-500'}`}>Female</button>
                        <button onClick={onSave} className="px-3 py-1 text-[9px] uppercase font-bold border border-slate-700 text-slate-400 hover:text-white flex items-center gap-1"><Save size={10}/> Save</button>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {Object.keys(LOCI).map(key => {
                        const locus = (LOCI as any)[key];
                        const val = (currentDna as any)[key];
                        
                        // Special Handling for Panda (which controls Koi too)
                        if (key === 'Panda') {
                            const isKoiOn = val === 'Koi';
                            const isPandaOn = val === 'Panda';

                            return (
                                <div key="PatternMix" className="col-span-1 flex gap-1">
                                    {/* Koi Half */}
                                    <div className="flex-1 flex flex-col items-center justify-center bg-black/40 px-1 py-2 rounded-sm border border-slate-800 hover:border-luxury-teal/30">
                                        <div className="flex items-center gap-1 mb-1">
                                            <button onClick={() => setInfoModalOpen('Panda')} className="text-slate-600 hover:text-luxury-teal"><Info size={8} /></button>
                                            <label className="text-[8px] text-slate-400 uppercase font-bold">Koi</label>
                                        </div>
                                        <button 
                                            onClick={() => handleChange('Panda', isKoiOn ? 'No' : 'Koi')}
                                            className={`flex items-center gap-1 text-[9px] font-bold uppercase ${isKoiOn ? 'text-luxury-teal' : 'text-slate-500'}`}
                                        >
                                            {isKoiOn ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                        </button>
                                    </div>
                                    {/* Panda Half */}
                                    <div className="flex-1 flex flex-col items-center justify-center bg-black/40 px-1 py-2 rounded-sm border border-slate-800 hover:border-luxury-teal/30">
                                        <div className="flex items-center gap-1 mb-1">
                                            <button onClick={() => setInfoModalOpen('Panda')} className="text-slate-600 hover:text-luxury-teal"><Info size={8} /></button>
                                            <label className="text-[8px] text-slate-400 uppercase font-bold">Panda</label>
                                        </div>
                                        <button 
                                            onClick={() => handleChange('Panda', isPandaOn ? 'No' : 'Panda')}
                                            className={`flex items-center gap-1 text-[9px] font-bold uppercase ${isPandaOn ? 'text-luxury-teal' : 'text-slate-500'}`}
                                        >
                                            {isPandaOn ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                        </button>
                                    </div>
                                </div>
                            );
                        }
                        
                        // Standard Rendering for other loci
                        return (
                            <div key={key} className="flex justify-between items-center bg-black/40 px-3 py-2 rounded-sm border border-slate-800 hover:border-luxury-teal/30 group transition-all">
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => setInfoModalOpen(key)}
                                        className="text-slate-600 hover:text-luxury-teal transition-colors"
                                    >
                                        <Info size={10} />
                                    </button>
                                    <label className="text-[9px] text-slate-400 uppercase font-bold truncate max-w-[80px]" title={locus.label}>
                                        {locus.label.replace(/\(.*\)/, '')}
                                    </label>
                                </div>

                                <select value={val} onChange={(e) => handleChange(key, e.target.value)} className="bg-transparent text-right text-[10px] text-white outline-none font-mono cursor-pointer ml-2 max-w-[80px]">
                                    {locus.options.map((o: string) => <option key={o} value={o}>{o}</option>)}
                                </select>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* INFO MODAL */}
            {infoModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setInfoModalOpen(null)}>
                    <div className="bg-[#0f172a] border border-luxury-teal/30 p-6 rounded-sm max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                            <h3 className="font-serif text-xl text-white">{(LOCI as any)[infoModalOpen].label}</h3>
                            <button onClick={() => setInfoModalOpen(null)} className="text-slate-500 hover:text-white"><X size={16}/></button>
                        </div>
                        <p className="font-sans text-sm text-slate-300 leading-relaxed">
                            {getLocusInfo(infoModalOpen)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

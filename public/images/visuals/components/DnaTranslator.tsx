import React from 'react';
import { Save } from 'lucide-react';
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
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.keys(LOCI).map(key => (
                    <div key={key} className="flex justify-between items-center bg-black/40 px-3 py-2 rounded-sm border border-slate-800 hover:border-luxury-teal/30">
                        <label className="text-[10px] text-slate-400 uppercase font-bold">{(LOCI as any)[key].label}</label>
                        <select value={(currentDna as any)[key]} onChange={(e) => handleChange(key, e.target.value)} className="bg-transparent text-right text-[11px] text-white outline-none font-mono cursor-pointer ml-2">
                            {(LOCI as any)[key].options.map((o: string) => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
};
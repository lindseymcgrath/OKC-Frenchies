import React, { useState } from 'react';
import { Save, ToggleLeft, ToggleRight, Upload } from 'lucide-react';
import { DogVisualizer } from './DogVisualizer';
import { LOCI, getPhenotype } from '../utils/calculatorHelpers';

interface DnaTranslatorProps {
    singleGender: 'Male' | 'Female';
    setSingleGender: (gender: 'Male' | 'Female') => void;
    currentDna: any;
    handleChange: (key: string, value: string) => void;
    onSave: (name: string) => Promise<boolean>;
    onAssignToMatrix: (role: 'Dam' | 'Sire', dna: any) => void;
    onLoad: () => void;
}

export const DnaTranslator: React.FC<DnaTranslatorProps> = ({
    singleGender,
    setSingleGender,
    currentDna,
    handleChange,
    onSave,
    onAssignToMatrix,
    onLoad
}) => {
    
    const [dogName, setDogName] = useState('');
    const [showRoleModal, setShowRoleModal] = useState(false);

    const handleSaveClick = async () => {
        if (!dogName.trim()) {
            alert("⚠️ Please enter a name for your dog to save it to the kennel.");
            return;
        }

        const success = await onSave(dogName);
        
        if (success) {
            setShowRoleModal(true); 
        }
    };

    const handleRoleSelection = (role: 'Dam' | 'Sire') => {
        onAssignToMatrix(role, currentDna); 
        setShowRoleModal(false);
    };

    const renderLociRows = () => {
        return Object.keys(LOCI).map(key => {
            const locus = (LOCI as any)[key];
            const isToggle = locus.options.length === 2 && locus.options.includes('No') && locus.options.includes('Yes');

            if (isToggle) {
                 const isOn = currentDna[key] === 'Yes';
                 return (
                    <div key={key} className="flex justify-between items-center bg-black/40 px-3 py-2 border border-slate-800 rounded-sm hover:border-luxury-teal/30 transition-colors group">
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold group-hover:text-slate-300 transition-colors" title={locus.description}>{locus.label}</label>
                        <button 
                            onClick={() => handleChange(key, isOn ? 'No' : 'Yes')}
                            className={`flex items-center gap-2 text-[10px] font-bold uppercase transition-colors ${isOn ? 'text-luxury-teal' : 'text-slate-600'}`}
                        >
                            {isOn ? 'Active' : 'Off'}
                            {isOn ? <ToggleRight size={16}/> : <ToggleLeft size={16}/>}
                        </button>
                    </div>
                 );
            }

            return (
                <div key={key} className="flex justify-between items-center bg-black/40 px-3 py-2 border border-slate-800 rounded-sm hover:border-luxury-teal/30 transition-colors group">
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold truncate pr-2 group-hover:text-slate-300 transition-colors" title={locus.description}>{locus.label.split('(')[0]}</label>
                    <select 
                        value={currentDna[key]} 
                        onChange={(e) => handleChange(key, e.target.value)} 
                        className="bg-transparent text-[10px] text-white outline-none font-mono text-right w-fit cursor-pointer hover:text-luxury-teal transition-colors appearance-none"
                    >
                        {locus.options.map((o: string) => <option key={o} value={o} className="bg-slate-900 text-slate-300">{o}</option>)}
                    </select>
                </div>
            );
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative">
            
            {/* SUCCESS MODAL */}
            {showRoleModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-luxury-teal/40 p-8 rounded-sm max-w-sm w-full shadow-[0_0_50px_rgba(45,212,191,0.2)] text-center animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-luxury-teal/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-luxury-teal/30">
                            <Save className="text-luxury-teal" size={32} />
                        </div>
                        <h3 className="font-serif text-2xl text-white mb-2">Saved to Kennel!</h3>
                        <p className="text-slate-400 text-sm mb-6">Would you like to assign <strong>{dogName}</strong> to the matrix?</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => handleRoleSelection('Sire')} className="py-3 bg-blue-900/20 border border-blue-500/50 text-blue-400 hover:bg-blue-500 hover:text-white transition-all uppercase text-[10px] font-bold tracking-widest">Set as Sire</button>
                            <button onClick={() => handleRoleSelection('Dam')} className="py-3 bg-pink-900/20 border border-pink-500/50 text-pink-400 hover:bg-pink-500 hover:text-white transition-all uppercase text-[10px] font-bold tracking-widest">Set as Dam</button>
                        </div>
                        <button onClick={() => setShowRoleModal(false)} className="mt-6 text-slate-500 hover:text-white text-[9px] uppercase tracking-[0.2em]">Close</button>
                    </div>
                </div>
            )}

            {/* VISUALIZER COLUMN */}
            <div className="md:col-span-5 flex flex-col">
                <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-sm relative group hover:border-luxury-teal/20 transition-all">
                    
                    {/* GENDER TOGGLES */}
                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                         <button onClick={() => setSingleGender('Male')} className={`px-3 py-1 text-[9px] uppercase font-bold border rounded-sm transition-all ${singleGender === 'Male' ? 'bg-blue-900/40 text-blue-300 border-blue-500/50' : 'bg-black/40 text-slate-600 border-slate-800 hover:text-slate-400'}`}>Male</button>
                         <button onClick={() => setSingleGender('Female')} className={`px-3 py-1 text-[9px] uppercase font-bold border rounded-sm transition-all ${singleGender === 'Female' ? 'bg-pink-900/40 text-pink-300 border-pink-500/50' : 'bg-black/40 text-slate-600 border-slate-800 hover:text-slate-400'}`}>Female</button>
                    </div>
                    
                    {/* VISUALIZER LAYER */}
                    <div className="flex justify-center items-center min-h-[300px] mb-4 relative z-0">
                        <div className="absolute inset-0 bg-luxury-teal/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <DogVisualizer traits={getPhenotype(currentDna)} showLabel={false} scale={1.2} />
                    </div>

                    {/* CONTROLS LAYER */}
                    <div className="relative z-20">
                        {/* Name & Genotype Pill */}
                        <div className="text-center mb-6">
                            <input 
                                type="text" 
                                placeholder="ENTER DOG NAME" 
                                value={dogName} 
                                onChange={(e) => setDogName(e.target.value.toUpperCase())} 
                                className="w-full bg-transparent border-b border-slate-700 focus:border-luxury-teal outline-none text-center font-serif text-2xl text-white mb-2 tracking-wide transition-colors placeholder:text-slate-700"
                            />
                            
                            {/* REMOVED GPS BUTTON */}
                            <div className="flex justify-center mt-2">
                                <div className="inline-block px-3 py-1 bg-black/40 rounded-full border border-slate-800">
                                    <p className="font-mono text-[10px] text-luxury-teal tracking-wider">{getPhenotype(currentDna).compactDnaString}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button 
                                onClick={onLoad}
                                className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-sm font-bold uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 transition-all"
                            >
                                <Upload size={16} /> Load
                            </button>
                            <button 
                                onClick={handleSaveClick}
                                className="flex-[2] py-4 bg-gradient-to-r from-luxury-teal/10 to-luxury-teal/20 hover:from-luxury-teal hover:to-emerald-400 text-luxury-teal hover:text-black border border-luxury-teal/30 hover:border-luxury-teal rounded-sm font-bold uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(45,212,191,0.3)]"
                            >
                                <Save size={16} /> Save to Kennel
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* CONFIGURATION COLUMN */}
            <div className="md:col-span-7">
                <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-sm h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                        <div className="p-2 bg-luxury-teal/10 rounded-full">
                            <ToggleRight size={20} className="text-luxury-teal"/>
                        </div>
                        <div>
                            <h3 className="font-serif text-xl text-white">Genetic Configuration</h3>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Adjust Loci Alleles</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-2 custom-scrollbar flex-grow content-start">
                        {renderLociRows()}
                    </div>
                </div>
            </div>
        </div>
    );
};
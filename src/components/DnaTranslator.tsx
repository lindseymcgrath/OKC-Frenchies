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
            
            // Extract the descriptive name (e.g. "Agouti") and the technical name (e.g. "A Locus:")
            // We assume the label is formatted like "A Locus (Agouti)" or similar.
            let technical = '';
            let descriptive = locus.label;
            
            if (locus.label.includes('Locus')) {
                const parts = locus.label.split('(');
                technical = parts[0].trim();
                if (parts[1]) descriptive = parts[1].replace(')', '').trim();
                else { descriptive = technical; technical = ''; }
            }

            if (isToggle) {
                 const isOn = currentDna[key] === 'Yes';
                 return (
                    <div key={key} className="flex justify-between items-center bg-[#0f172a] px-4 py-3 border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors group">
                        <div className="flex flex-col">
                            <label className="text-sm text-slate-200 font-bold">{descriptive}</label>
                            {technical && <label className="text-[10px] text-slate-500 uppercase tracking-widest">{technical}</label>}
                        </div>
                        <button 
                            onClick={() => handleChange(key, isOn ? 'No' : 'Yes')}
                            className={`px-4 py-2 rounded-full font-mono text-sm font-bold min-w-[80px] text-center transition-all ${isOn ? 'bg-luxury-teal text-black shadow-md shadow-luxury-teal/20' : 'bg-slate-800 text-slate-400'}`}
                        >
                            {isOn ? 'ON' : 'OFF'}
                        </button>
                    </div>
                 );
            }

            return (
                <div key={key} className="flex justify-between items-center bg-[#0f172a] px-4 py-3 border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors group relative">
                    <div className="flex flex-col pointer-events-none">
                        <label className="text-sm text-slate-200 font-bold">{descriptive}</label>
                        {technical && <label className="text-[10px] text-slate-500 uppercase tracking-widest">{technical}</label>}
                    </div>
                    
                    <div className="relative">
                        {/* THE PILL UI */}
                        <div className={`px-4 py-2 rounded-full font-mono text-sm font-bold min-w-[80px] text-center transition-all ${currentDna[key] && currentDna[key] !== 'N N' && currentDna[key] !== 'ky ky' && currentDna[key] !== '-' ? 'bg-luxury-teal text-black shadow-md shadow-luxury-teal/20' : 'bg-slate-800 text-slate-300'}`}>
                            {currentDna[key] || '-'}
                        </div>
                        
                        {/* INVISIBLE NATIVE SELECT INTERCEPTOR */}
                        <select 
                            value={currentDna[key]} 
                            onChange={(e) => handleChange(key, e.target.value)} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-[16px] /* 16px prevents iOS zoom */"
                        >
                            {locus.options.map((o: string) => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="flex flex-col relative w-full h-full">
            
            {/* SUCCESS MODAL */}
            {showRoleModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-luxury-teal/40 p-8 rounded-sm max-w-sm w-full shadow-2xl text-center animate-in fade-in zoom-in duration-300">
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

            {/* TOP HEADER: VISUALIZER & DOG INFO */}
            <div className="bg-[#020617] border-b border-slate-800 p-6 flex flex-col items-center relative overflow-hidden">
                {/* GENDER TOGGLES */}
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                     <button onClick={() => setSingleGender('Male')} className={`px-4 py-1.5 text-[10px] uppercase font-bold border rounded-full transition-all ${singleGender === 'Male' ? 'bg-blue-600/20 text-blue-400 border-blue-500/50' : 'bg-transparent text-slate-600 border-slate-800'}`}>Male</button>
                     <button onClick={() => setSingleGender('Female')} className={`px-4 py-1.5 text-[10px] uppercase font-bold border rounded-full transition-all ${singleGender === 'Female' ? 'bg-pink-600/20 text-pink-400 border-pink-500/50' : 'bg-transparent text-slate-600 border-slate-800'}`}>Female</button>
                </div>
                
                {/* VISUALIZER */}
                <div className="h-48 w-full flex justify-center items-end pb-2 relative z-0 mt-6">
                    <DogVisualizer traits={getPhenotype(currentDna)} showLabel={false} scale={0.9} />
                </div>

                <div className="w-full mt-4 flex flex-col items-center relative z-20">
                     <input 
                         type="text" 
                         placeholder="ENTER DOG NAME" 
                         value={dogName} 
                         onChange={(e) => setDogName(e.target.value.toUpperCase())} 
                         className="w-full bg-transparent border-none focus:ring-0 outline-none text-center font-serif text-3xl text-white mb-1 tracking-wide placeholder:text-slate-700"
                     />
                     <div className="bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-800">
                         <p className="font-mono text-[10px] text-luxury-teal tracking-wider">{getPhenotype(currentDna).compactDnaString}</p>
                     </div>
                </div>
            </div>

            {/* BOTTOM LIST: LOCI ROWS */}
            <div className="flex-1 overflow-y-auto bg-[#020617] pb-24">
                 {renderLociRows()}
            </div>

            {/* FIXED BOTTOM ACTION BAR */}
            <div className="fixed bottom-0 md:absolute md:bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-slate-800 p-4 flex gap-2 z-30">
                <button 
                    onClick={onLoad}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-sm font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all"
                >
                    <Upload size={16} /> Load
                </button>
                <button 
                    onClick={handleSaveClick}
                    className="flex-[2] py-3 bg-luxury-teal hover:bg-emerald-400 text-black rounded-sm font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                    <Save size={16} /> Save Puppy
                </button>
            </div>
            
        </div>
    );
};
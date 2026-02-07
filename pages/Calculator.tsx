import React, { useState, useEffect } from 'react';
import { Dna, ScanLine } from 'lucide-react';

import { 
    DEFAULT_DNA, 
    getPhenotype, SavedDog
} from '../utils/calculatorHelpers';
import { useStudioLogic } from '../hooks/useStudioLogic';
import { useUserCredits } from '../hooks/useUserCredits';
import { MarketingSidebar } from '../components/MarketingSidebar';
import { DnaTranslator } from '../components/DnaTranslator';
import { LitterPredictor } from '../components/LitterPredictor';
import { StudioCanvas } from '../components/StudioCanvas';
import { CalculatorModals } from '../components/CalculatorModals';

export default function Calculator() {
  const [mode, setMode] = useState<'single' | 'pair' | 'marketing'>('single');
  const [showPaywall, setShowPaywall] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Custom Hook for Credits & Auth
  const user = useUserCredits();
  
  // Local Session State - Initialize from LocalStorage
  const [freeGenerations, setFreeGenerations] = useState(() => {
      const saved = localStorage.getItem('okc_free_gens');
      return saved !== null ? parseInt(saved, 10) : 3;
  });

  // Persist freeGenerations changes
  useEffect(() => {
      localStorage.setItem('okc_free_gens', freeGenerations.toString());
  }, [freeGenerations]);

  // Kennel State (Genetic Data)
  const [savedDogs, setSavedDogs] = useState<SavedDog[]>([]);
  const [dogNameInput, setDogNameInput] = useState('');
  const [showKennel, setShowKennel] = useState(false);
  
  const [singleGender, setSingleGender] = useState<'Male' | 'Female'>('Male');
  const [sire, setSire] = useState({ ...DEFAULT_DNA }); 
  const [dam, setDam] = useState({ ...DEFAULT_DNA });

  const currentDna = singleGender === 'Male' ? sire : dam;

  // --- USE STUDIO HOOK ---
  const studio = useStudioLogic(
      user.isSubscribed, 
      user.isUnlocked, 
      user.credits, 
      freeGenerations, 
      user.deductCredit, 
      setFreeGenerations, 
      setShowPaywall
  );

  // --- EVENT HANDLERS ---
  const handleSingleModeChange = (key: string, value: string) => {
      if (singleGender === 'Male') setSire(prev => ({ ...prev, [key]: value }));
      else setDam(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
      const stored = localStorage.getItem('okc_kennel');
      if (stored) { try { setSavedDogs(JSON.parse(stored)); } catch (e) { console.error("Kennel load failed", e); } }
      
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const saveDog = (target: 'sire' | 'dam') => {
      if (!dogNameInput.trim()) { alert("Please name your dog before saving."); return; }
      let dnaToSave = { ...DEFAULT_DNA };
      let genderToSave: 'Male' | 'Female' = 'Male';

      if (mode === 'single') {
          if (singleGender === 'Male') { dnaToSave = { ...sire }; genderToSave = 'Male'; } 
          else { dnaToSave = { ...dam }; genderToSave = 'Female'; }
      } else {
          dnaToSave = target === 'sire' ? { ...sire } : { ...dam };
          genderToSave = target === 'sire' ? 'Male' : 'Female';
      }

      const newDog: SavedDog = { id: Date.now().toString(), name: dogNameInput, gender: genderToSave, dna: dnaToSave, date: new Date().toLocaleDateString() };
      const updated = [newDog, ...savedDogs].slice(0, 20); 
      setSavedDogs(updated);
      localStorage.setItem('okc_kennel', JSON.stringify(updated));
      setDogNameInput('');
      alert("Saved to Kennel");
  };

  const loadDogSmart = (dog: SavedDog) => {
      if (mode === 'single') {
          setSingleGender(dog.gender);
          if (dog.gender === 'Male') setSire(dog.dna); else setDam(dog.dna);
      } else {
          // In pair mode, we use dedicated load buttons from the modal
      }
      if (mode === 'marketing') {
          if (dog.gender === 'Male') studio.setStudName(dog.name);
          else studio.setDamName(dog.name);
          if (!studio.studPhenotype) studio.setStudPhenotype(getPhenotype(dog.dna).phenotypeName);
          if (!studio.studDna) studio.setStudDna(getPhenotype(dog.dna).compactDnaString);
      }
      setShowKennel(false);
  };

  const loadIntoSire = (dog: SavedDog) => { setSire(dog.dna); setShowKennel(false); };
  const loadIntoDam = (dog: SavedDog) => { setDam(dog.dna); setShowKennel(false); };
  const removeDog = (id: string) => {
      const updated = savedDogs.filter(dog => dog.id !== id);
      setSavedDogs(updated);
      localStorage.setItem('okc_kennel', JSON.stringify(updated));
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pt-20 pb-20 px-4 md:px-6 font-sans relative">
       {/* Background Ambience */}
       <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay pointer-events-none"></div>
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-luxury-teal/5 rounded-full blur-[120px] pointer-events-none"></div>

       {/* HEADER & TABS */}
       <div className="max-w-7xl mx-auto text-center mb-6 relative z-10">
            <h1 className="font-serif text-4xl md:text-6xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-luxury-teal via-white to-luxury-magenta animate-shine">
            DNA MATRIX
            </h1>
            
            {/* MOBILE COMPACT TABS */}
            <div className="flex items-center justify-center gap-2 mt-4">
                <button onClick={() => setMode('single')} className={`flex-1 md:flex-none px-2 py-3 rounded-sm text-[9px] md:text-[10px] uppercase font-bold tracking-widest border transition-all flex flex-col md:flex-row items-center justify-center gap-2 ${mode==='single' ? 'bg-luxury-teal text-black shadow-lg border-luxury-teal' : 'border-slate-800 text-slate-500 bg-slate-900/50'}`}>
                    <ScanLine size={14} /> <span className="inline">Translator</span>
                </button>
                <button onClick={() => setMode('pair')} className={`flex-1 md:flex-none px-2 py-3 rounded-sm text-[9px] md:text-[10px] uppercase font-bold tracking-widest border transition-all flex flex-col md:flex-row items-center justify-center gap-2 ${mode==='pair' ? 'bg-luxury-magenta text-black shadow-lg border-luxury-magenta' : 'border-slate-800 text-slate-500 bg-slate-900/50'}`}>
                    <Dna size={14} /> <span className="inline">Pairing</span>
                </button>
                <button onClick={() => setMode('marketing')} className={`flex-1 md:flex-none px-2 py-3 rounded-sm text-[9px] md:text-[10px] uppercase font-bold tracking-widest border transition-all flex flex-col md:flex-row items-center justify-center gap-2 ${mode==='marketing' ? 'bg-indigo-500 text-white shadow-lg border-indigo-500' : 'border-slate-800 text-slate-500 bg-slate-900/50'}`}>
                    <div className="inline">Studio</div>
                </button>
            </div>
       </div>

       <div className="max-w-7xl mx-auto relative z-10">
            {/* Input for Dog Name (For saving) */}
            {mode !== 'marketing' && mode !== 'pair' && (
                <div className="flex justify-center mb-6">
                    <div className="flex gap-2">
                         <input 
                            value={dogNameInput}
                            onChange={(e) => setDogNameInput(e.target.value)}
                            placeholder="Enter Dog Name to Save..."
                            className="bg-black/40 border border-slate-700 p-2 text-xs text-white outline-none w-64 rounded-sm focus:border-luxury-teal"
                         />
                    </div>
                </div>
            )}

            {/* --- VISUALIZERS --- */}
            {mode !== 'marketing' && (
                <div className="mb-8">
                     {mode === 'single' ? (
                        <DnaTranslator 
                            singleGender={singleGender}
                            setSingleGender={setSingleGender}
                            currentDna={currentDna}
                            handleChange={handleSingleModeChange}
                            onSave={() => saveDog(singleGender === 'Male' ? 'sire' : 'dam')}
                        />
                     ) : (
                        <LitterPredictor 
                            sire={sire}
                            setSire={setSire}
                            dam={dam}
                            setDam={setDam}
                            dogNameInput={dogNameInput}
                            setDogNameInput={setDogNameInput}
                            saveDog={saveDog}
                            setShowKennel={setShowKennel}
                            studio={studio}
                        />
                     )}
                </div>
            )}
            
            {/* --- STUDIO LAYOUT --- */}
            {mode === 'marketing' && (
                <div className="flex flex-col lg:flex-row justify-center gap-6 items-start relative">
                    
                    {/* LEFT COLUMN: PREVIEW */}
                    <StudioCanvas 
                        studio={studio} 
                        isMobile={isMobile}
                        isSubscribed={user.isSubscribed}
                        isUnlocked={user.isUnlocked}
                        credits={user.credits}
                        userEmail={user.userEmail}
                        setShowPaywall={setShowPaywall}
                    />

                    {/* RIGHT COLUMN: CONTROLS */}
                    <MarketingSidebar 
                        studio={studio}
                        isSubscribed={user.isSubscribed}
                        isUnlocked={user.isUnlocked}
                        credits={user.credits}
                        freeGenerations={freeGenerations}
                        setShowPaywall={setShowPaywall}
                        userEmail={user.userEmail}
                    />
                </div>
            )}
       </div>

       {/* MODALS */}
       <CalculatorModals 
            studio={studio}
            showKennel={showKennel}
            setShowKennel={setShowKennel}
            savedDogs={savedDogs}
            mode={mode}
            loadDogSmart={loadDogSmart}
            loadIntoSire={loadIntoSire}
            loadIntoDam={loadIntoDam}
            removeDog={removeDog}
            
            // Pass User/Paywall Props
            showPaywall={showPaywall}
            setShowPaywall={setShowPaywall}
            userId={user.userId}
            promoCodeInput={user.promoCodeInput}
            setPromoCodeInput={user.setPromoCodeInput}
            handlePromoSubmit={() => user.handlePromoSubmit(() => setShowPaywall(false))}
            showLogin={user.showLogin}
            setShowLogin={user.setShowLogin}
            userEmail={user.userEmail}
            setUserEmail={user.setUserEmail}
            handleLoginSubmit={user.handleLoginSubmit}

            // Sync credits to Modals for the Success Screen
            credits={user.credits}
            isSubscribed={user.isSubscribed}
            isUnlocked={user.isUnlocked}
       />
    </div>
  );
}

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Dna, ScanLine, Loader2 } from 'lucide-react';

import { 
    DEFAULT_DNA, 
    getPhenotype, SavedDog
} from '../utils/calculatorHelpers';
import { useStudioLogic } from '../hooks/useStudioLogic';
import { useUserCredits } from '../hooks/useUserCredits';
import { DnaTranslator } from '../components/DnaTranslator';
import { LitterPredictor } from '../components/LitterPredictor';
import { CalculatorModals } from '../components/CalculatorModals';

// 🚀 LAZY LOADING: This makes the Studio tab switch INSTANT
const LazyStudioCanvas = lazy(() => import('../components/StudioCanvas').then(m => ({ default: m.StudioCanvas })));
const LazyMarketingSidebar = lazy(() => import('../components/MarketingSidebar').then(m => ({ default: m.MarketingSidebar })));

export default function Calculator() {
  const [mode, setMode] = useState<'single' | 'pair' | 'marketing'>('single');
  const [showPaywall, setShowPaywall] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Custom Hook for Credits & Auth
  const user = useUserCredits();
  
  // ✅ ROBUST INITIALIZATION: Protect against NaN or corrupted local storage
  // Updated key to 'okc_free_gens_v2' to give all users a fresh set of free turns
  const [freeGenerations, setFreeGenerations] = useState(() => {
      try {
          const saved = localStorage.getItem('okc_free_gens_v2');
          const parsed = saved !== null ? parseInt(saved, 10) : 3;
          // If parsed is NaN, default to 3
          return isNaN(parsed) ? 3 : parsed;
      } catch (e) {
          return 3;
      }
  });

  useEffect(() => {
      localStorage.setItem('okc_free_gens_v2', freeGenerations.toString());
  }, [freeGenerations]);

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
      setShowPaywall,
      user.userEmail // 👈 ADD THIS LINE AT THE VERY END
  );

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
       <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay pointer-events-none"></div>
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-luxury-teal/5 rounded-full blur-[120px] pointer-events-none"></div>

       <div className="max-w-7xl mx-auto text-center mb-6 relative z-10">
            <h1 className="font-serif text-4xl md:text-6xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-luxury-teal via-white to-luxury-magenta animate-shine">
            DNA MATRIX
            </h1>
            
            <div className="flex items-center justify-center gap-2 mt-4">
                <button onClick={() => setMode('single')} className={`flex-1 md:flex-none px-2 py-3 rounded-sm text-[9px] md:text-[10px] uppercase font-bold tracking-widest border transition-all flex flex-col md:flex-row items-center justify-center gap-2 ${mode==='single' ? 'bg-luxury-teal text-black border-luxury-teal' : 'border-slate-800 text-slate-500 bg-slate-900/50'}`}>
                    <ScanLine size={14} /> <span>Translator</span>
                </button>
                <button onClick={() => setMode('pair')} className={`flex-1 md:flex-none px-2 py-3 rounded-sm text-[9px] md:text-[10px] uppercase font-bold tracking-widest border transition-all flex flex-col md:flex-row items-center justify-center gap-2 ${mode==='pair' ? 'bg-luxury-magenta text-black border-luxury-magenta' : 'border-slate-800 text-slate-500 bg-slate-900/50'}`}>
                    <Dna size={14} /> <span>Pairing</span>
                </button>
                <button onClick={() => setMode('marketing')} className={`flex-1 md:flex-none px-2 py-3 rounded-sm text-[9px] md:text-[10px] uppercase font-bold tracking-widest border transition-all flex flex-col md:flex-row items-center justify-center gap-2 ${mode==='marketing' ? 'bg-indigo-500 text-white border-indigo-500' : 'border-slate-800 text-slate-500 bg-slate-900/50'}`}>
                    <span>Studio</span>
                </button>
            </div>
       </div>

       <div className="max-w-7xl mx-auto relative z-10">
            {mode !== 'marketing' && mode !== 'pair' && (
                <div className="flex justify-center mb-6">
                    <input 
                        value={dogNameInput}
                        onChange={(e) => setDogNameInput(e.target.value)}
                        placeholder="Enter Dog Name to Save..."
                        className="bg-black/40 border border-slate-700 p-2 text-xs text-white outline-none w-64 rounded-sm focus:border-luxury-teal"
                    />
                </div>
            )}

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
            
            {mode === 'marketing' && (
                <Suspense fallback={
                    <div className="flex flex-col items-center justify-center py-20 w-full text-luxury-teal italic">
                        <Loader2 className="animate-spin mb-2" size={32} />
                        <span className="text-[10px] uppercase tracking-[0.3em]">Initializing Studio...</span>
                    </div>
                }>
                    <div className="flex flex-col lg:flex-row justify-center gap-6 items-start relative animate-in slide-in-from-bottom-4">
                        <LazyStudioCanvas 
                            studio={studio} 
                            isMobile={isMobile}
                            isSubscribed={user.isSubscribed}
                            isUnlocked={user.isUnlocked}
                            credits={user.credits}
                            userEmail={user.userEmail}
                            setShowPaywall={setShowPaywall}
                        />

                        <LazyMarketingSidebar 
                            studio={studio}
                            isSubscribed={user.isSubscribed}
                            isUnlocked={user.isUnlocked}
                            credits={user.credits}
                            freeGenerations={freeGenerations}
                            setShowPaywall={setShowPaywall}
                            userEmail={user.userEmail}
                        />
                    </div>
                </Suspense>
            )}
       </div>

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
            handleLoginSubmit={(email?: string) => user.handleLoginSubmit(email)}

            credits={user.credits}
            isSubscribed={user.isSubscribed}
            isUnlocked={user.isUnlocked}
       />
    </div>
  );
}

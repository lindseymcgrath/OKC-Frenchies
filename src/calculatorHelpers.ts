import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Loader2, LogIn, LogOut, User } from 'lucide-react';

import { 
    DEFAULT_DNA, 
    SavedDog,
    saveDogToDB, fetchDogsFromDB, deleteDogFromDB
} from './utils/calculatorHelpers';
import { useStudioLogic } from './hooks/useStudioLogic';
import { useUserCredits } from './hooks/useUserCredits';
import { DnaTranslator } from './components/DnaTranslator';
import { LitterPredictor } from './components/LitterPredictor';
import { CalculatorModals } from './components/CalculatorModals';

const LazyStudioCanvas = lazy(() => import('./components/StudioCanvas').then(m => ({ default: m.StudioCanvas })));
const LazyMarketingSidebar = lazy(() => import('./components/MarketingSidebar').then(m => ({ default: m.MarketingSidebar })));

export default function Calculator() {
  const [mode, setMode] = useState<'single' | 'pair' | 'marketing'>('single');
  const [showPaywall, setShowPaywall] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const user = useUserCredits();
  
  const [freeGenerations, setFreeGenerations] = useState(() => {
      try {
          if (typeof window === 'undefined') return 3;
          const saved = window.localStorage.getItem('okc_studio_tokens_v4');
          return saved ? parseInt(saved, 10) : 3;
      } catch (e) { return 3; }
  });

  useEffect(() => {
      if (typeof window !== 'undefined') window.localStorage.setItem('okc_studio_tokens_v4', freeGenerations.toString());
  }, [freeGenerations]);

  const [savedDogs, setSavedDogs] = useState<SavedDog[]>([]);
  const [showKennel, setShowKennel] = useState(false);
  const [activeLoadSlot, setActiveLoadSlot] = useState<'translator' | 'sire' | 'dam' | null>(null);

  // ✅ LOAD KENNEL (Fixed: Forces all IDs to Strings immediately)
  useEffect(() => {
      async function loadKennel() {
          if (user.userId) {
              const dbDogs = await fetchDogsFromDB(user.userId);
              // Standardize IDs to strings to prevent Type Mismatch errors
              const safeDogs = dbDogs.map((d: any) => ({...d, id: String(d.id)}));
              setSavedDogs(safeDogs);
          } else {
              const stored = localStorage.getItem('okc_kennel');
              if (stored) {
                  const parsed = JSON.parse(stored);
                  const safeDogs = parsed.map((d: any) => ({...d, id: String(d.id)}));
                  setSavedDogs(safeDogs);
              }
          }
      }
      loadKennel();
  }, [user.userId]);

  const [singleGender, setSingleGender] = useState<'Male' | 'Female'>('Male');
  const [sire, setSire] = useState({ ...DEFAULT_DNA }); 
  const [dam, setDam] = useState({ ...DEFAULT_DNA });
  const currentDna = singleGender === 'Male' ? sire : dam;

  const studio = useStudioLogic(user.isSubscribed, user.isUnlocked, user.credits, freeGenerations, user.deductCredit, setFreeGenerations, setShowPaywall, user.userEmail);

  const handleSingleModeChange = (key: string, value: string) => {
      if (singleGender === 'Male') setSire(prev => ({ ...prev, [key]: value }));
      else setDam(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 1024);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSaveToKennel = async (name: string, genderOverride?: 'Male' | 'Female', dnaOverride?: any) => {
      return new Promise<boolean>(async (resolve) => {
        try {
            const gender = genderOverride || singleGender;
            const dna = JSON.parse(JSON.stringify(dnaOverride || (gender === 'Male' ? sire : dam)));
            // Ensure ID is saved as a string from the start
            const tempDog: SavedDog = { id: String(Date.now()), name: name, gender: gender, dna: dna, date: new Date().toLocaleDateString() };

            if (user.userId) {
                const savedRecord = await saveDogToDB(user.userId, tempDog);
                if (savedRecord) {
                    // Optimistic update with string ID
                    setSavedDogs(prev => [{...savedRecord, id: String(savedRecord.id)}, ...prev]);
                    resolve(true);
                    return;
                }
            } 
            
            const updated = [tempDog, ...savedDogs].slice(0, 20); 
            setSavedDogs(updated);
            localStorage.setItem('okc_kennel', JSON.stringify(updated));
            resolve(true); 

        } catch (e) { 
            console.error("Save failed", e); 
            alert("❌ Save failed. Check connection.");
            resolve(false); 
        }
      });
  };

  // ✅ DELETE DOG (Fixed: Handles Type Mismatch Robustly)
  const removeDog = async (id: string) => {
      const targetId = String(id); // Force string for comparison
      const originalList = [...savedDogs];
      
      // Optimistically remove from UI
      setSavedDogs(prev => prev.filter(dog => String(dog.id) !== targetId));

      try {
          if (user.userId) {
              const success = await deleteDogFromDB(targetId); 
              if (!success) {
                  throw new Error("Database deletion failed");
              }
          } else {
              const stored = localStorage.getItem('okc_kennel');
              if (stored) {
                  const updated = JSON.parse(stored).filter((d: any) => String(d.id) !== targetId);
                  localStorage.setItem('okc_kennel', JSON.stringify(updated));
              }
          }
      } catch (error) {
          console.error("Delete failed:", error);
          alert("Could not delete dog. Reverting...");
          setSavedDogs(originalList);
      }
  };

  const handleAssignToMatrix = (role: 'Dam' | 'Sire', dna: any) => {
      const dnaCopy = JSON.parse(JSON.stringify(dna));
      if (role === 'Sire') setSire(dnaCopy); else setDam(dnaCopy);
      alert(`${role} set! Switch to Pairing tab.`);
  };

  const loadDogSmart = (dog: SavedDog) => {
      const dnaCopy = JSON.parse(JSON.stringify(dog.dna));
      if (activeLoadSlot === 'sire') { setSire({ ...dnaCopy, name: dog.name }); }
      else if (activeLoadSlot === 'dam') { setDam({ ...dnaCopy, name: dog.name }); }
      else if (activeLoadSlot === 'translator' || mode === 'single') {
          setSingleGender(dog.gender);
          if (dog.gender === 'Male') setSire({ ...dnaCopy, name: dog.name }); 
          else setDam({ ...dnaCopy, name: dog.name });
      }
      setShowKennel(false);
      setActiveLoadSlot(null);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pt-16 md:pt-24 pb-20 px-4 md:px-6 font-sans relative overflow-x-hidden">
       <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none"></div>
       <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-luxury-teal/5 rounded-full blur-[80px] pointer-events-none"></div>

       <div className="max-w-7xl mx-auto text-center mb-6 relative z-10">
            <h1 className="font-serif text-3xl md:text-6xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-luxury-teal via-white to-luxury-magenta animate-shine">DNA MATRIX</h1>
            
            <div className="flex items-center justify-center gap-1.5 mt-2 mb-6">
                <button onClick={() => setMode('single')} className={`flex-1 py-3 rounded-sm text-[9px] uppercase font-bold tracking-widest border transition-all ${mode==='single' ? 'bg-luxury-teal text-black border-luxury-teal' : 'border-slate-800 text-slate-500 bg-slate-900/50'}`}>Translator</button>
                <button onClick={() => setMode('pair')} className={`flex-1 py-3 rounded-sm text-[9px] uppercase font-bold tracking-widest border transition-all ${mode==='pair' ? 'bg-luxury-magenta text-black border-luxury-magenta' : 'border-slate-800 text-slate-500 bg-slate-900/50'}`}>Pairing</button>
                <button onClick={() => setMode('marketing')} className={`flex-1 py-3 rounded-sm text-[9px] uppercase font-bold tracking-widest border transition-all ${mode==='marketing' ? 'bg-indigo-600 text-white border-indigo-500' : 'border-slate-800 text-slate-500 bg-slate-900/50'}`}>Studio</button>
            </div>

            {/* ✅ RESTORED KENNEL LOGIN BUTTON */}
            <div className="flex justify-center mb-10">
               {user.userId ? (
                   <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-luxury-teal/30 shadow-lg">
                       <div className="flex flex-col text-right">
                           <span className="text-[10px] text-luxury-teal font-bold tracking-wider uppercase flex items-center gap-1"><User size={10} /> Kennel Active</span>
                           <span className="text-[9px] text-slate-400 font-mono">{user.userEmail}</span>
                       </div>
                       <div className="hidden sm:block h-6 w-px bg-slate-700"></div>
                       <button onClick={user.handleLogout} className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1">
                           <LogOut size={12} /> Disconnect
                       </button>
                   </div>
               ) : (
                   <button 
                       onClick={() => user.setShowLogin(true)} 
                       className="group flex items-center gap-2 px-8 py-3 bg-slate-900 border border-luxury-teal/30 hover:border-luxury-teal text-luxury-teal hover:text-black hover:bg-luxury-teal rounded-full font-bold uppercase text-[10px] tracking-[0.2em] shadow-[0_0_20px_rgba(45,212,191,0.1)] transition-all duration-300"
                   >
                       <LogIn size={14} className="group-hover:translate-x-1 transition-transform" /> Connect Kennel
                   </button>
               )}
            </div>
       </div>

       <div className="max-w-7xl mx-auto relative z-10 px-1 md:px-0">
            {mode !== 'marketing' && (
                <div className="mb-8">
                     {mode === 'single' ? (
                        <DnaTranslator 
                            singleGender={singleGender}
                            setSingleGender={setSingleGender}
                            currentDna={currentDna}
                            handleChange={handleSingleModeChange}
                            onSave={handleSaveToKennel}
                            onAssignToMatrix={handleAssignToMatrix}
                            onLoad={() => { setActiveLoadSlot('translator'); setShowKennel(true); }}
                        />
                     ) : (
                        <LitterPredictor 
                            sire={sire}
                            setSire={setSire}
                            dam={dam}
                            setDam={setDam}
                            dogNameInput={''} 
                            setDogNameInput={() => {}} 
                            onSaveDog={handleSaveToKennel} 
                            setShowKennel={setShowKennel}
                            setActiveLoadSlot={setActiveLoadSlot}
                            studio={studio}
                            isMobile={isMobile}
                        />
                     )}
                </div>
            )}
            
            {mode === 'marketing' && (
                <Suspense fallback={<div className="flex justify-center py-20 text-luxury-teal"><Loader2 className="animate-spin" /></div>}>
                    <div className="flex flex-col lg:flex-row justify-center gap-6 items-start relative animate-in fade-in duration-500">
                        {/* ✅ PASS IS_MOBILE PROP */}
                        <LazyStudioCanvas studio={studio} isMobile={isMobile} isSubscribed={user.isSubscribed} isUnlocked={user.isUnlocked} credits={user.credits} userEmail={user.userEmail} setShowPaywall={setShowPaywall}/>
                        <LazyMarketingSidebar studio={studio} isMobile={isMobile} isSubscribed={user.isSubscribed} isUnlocked={user.isUnlocked} credits={user.credits} freeGenerations={freeGenerations} setShowPaywall={setShowPaywall} userEmail={user.userEmail}/>
                    </div>
                </Suspense>
            )}
       </div>

       <CalculatorModals 
            showKennel={showKennel}
            setShowKennel={setShowKennel}
            savedDogs={savedDogs}
            loadDogSmart={loadDogSmart}
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
            handleLoginSubmit={user.handleLoginSubmit} 
            credits={user.credits}
            isSubscribed={user.isSubscribed}
            isUnlocked={user.isUnlocked}
       />
    </div>
  );
}

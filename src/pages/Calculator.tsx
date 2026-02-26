import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, User } from 'lucide-react';

import { 
    DEFAULT_DNA, 
    SavedDog,
    saveDogToDB, fetchDogsFromDB, deleteDogFromDB
} from '../utils/calculatorHelpers';
import { useUserCredits } from '../hooks/useUserCredits';
import { DnaTranslator } from '../components/DnaTranslator';
import { LitterPredictor } from '../components/LitterPredictor';
import { CalculatorModals } from '../components/CalculatorModals';

export default function Calculator() {
  // ✅ Simplified mode: Only 'single' (Translator) or 'pair' (Litter Predictor)
  const [mode, setMode] = useState<'single' | 'pair'>('single');
  const [showPaywall, setShowPaywall] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const user = useUserCredits();
  
  const [savedDogs, setSavedDogs] = useState<SavedDog[]>([]);
  const [showKennel, setShowKennel] = useState(false);
  const [activeLoadSlot, setActiveLoadSlot] = useState<'translator' | 'sire' | 'dam' | null>(null);

  // Load Kennel Logic
  useEffect(() => {
      async function loadKennel() {
          if (user.userId) {
              const dbDogs = await fetchDogsFromDB(user.userId);
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
            const tempDog: SavedDog = { id: String(Date.now()), name: name, gender: gender, dna: dna, date: new Date().toLocaleDateString() };

            if (user.userId) {
                const savedRecord = await saveDogToDB(user.userId, tempDog);
                if (savedRecord) {
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
            alert("❌ Save failed.");
            resolve(false); 
        }
      });
  };

  const removeDog = async (id: string) => {
      const targetId = String(id);
      const originalList = [...savedDogs];
      setSavedDogs(prev => prev.filter(dog => String(dog.id) !== targetId));
      try {
          if (user.userId) {
              const success = await deleteDogFromDB(targetId); 
              if (!success) throw new Error("Database deletion failed");
          } else {
              const stored = localStorage.getItem('okc_kennel');
              if (stored) {
                  const updated = JSON.parse(stored).filter((d: any) => String(d.id) !== targetId);
                  localStorage.setItem('okc_kennel', JSON.stringify(updated));
              }
          }
      } catch (error) {
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
    <div className="min-h-screen bg-[#020617] text-slate-200 pt-16 md:pt-24 pb-20 px-4 md:px-6 font-sans relative">
       <div className="max-w-7xl mx-auto text-center mb-6 relative z-10">
            <h1 className="font-serif text-3xl md:text-6xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-luxury-teal via-white to-luxury-magenta">DNA MATRIX</h1>
            
            <div className="flex items-center justify-center gap-1.5 mt-2 mb-6 max-w-md mx-auto">
                <button onClick={() => setMode('single')} className={`flex-1 py-3 rounded-sm text-[9px] uppercase font-bold tracking-widest border transition-all ${mode==='single' ? 'bg-luxury-teal text-black border-luxury-teal' : 'border-slate-800 text-slate-500 bg-slate-900/50'}`}>Translator</button>
                <button onClick={() => setMode('pair')} className={`flex-1 py-3 rounded-sm text-[9px] uppercase font-bold tracking-widest border transition-all ${mode==='pair' ? 'bg-luxury-magenta text-black border-luxury-magenta' : 'border-slate-800 text-slate-500 bg-slate-900/50'}`}>Pairing</button>
            </div>

            <div className="flex justify-center mb-10">
               {user.userId ? (
                   <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/40 px-6 py-2 rounded-full border border-luxury-teal/30">
                       <span className="text-[10px] text-luxury-teal font-bold uppercase tracking-wider flex items-center gap-1"><User size={10} /> Kennel Active</span>
                       <button onClick={user.handleLogout} className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">Disconnect</button>
                   </div>
               ) : (
                   <button onClick={() => user.setShowLogin(true)} className="px-8 py-3 bg-slate-900 border border-luxury-teal/30 hover:border-luxury-teal text-luxury-teal hover:text-black hover:bg-luxury-teal rounded-full font-bold uppercase text-[10px] tracking-[0.2em] transition-all">Connect Kennel</button>
               )}
            </div>
       </div>

       <div className="max-w-7xl mx-auto relative z-10">
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
                        studio={null as any} // ✅ Studio safely disabled
                        isMobile={isMobile}
                    />
                 )}
            </div>
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
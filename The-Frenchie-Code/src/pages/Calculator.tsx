import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LogIn, LogOut, User, RefreshCcw, Home, Database, PieChart, X } from 'lucide-react';

import { 
    DEFAULT_DNA, 
    SavedDog,
    saveDogToDB, fetchDogsFromDB, deleteDogFromDB
} from '../utils/calculatorHelpers';
import { useUserCredits } from '../hooks/useUserCredits';
import { DnaTranslator } from '../components/DnaTranslator';
import { LitterPredictor } from '../components/LitterPredictor';
import { CalculatorModals } from '../components/CalculatorModals';
import SEO from '../components/SEO';
import { useSubscription } from '../components/SubscriptionManager';
import { MagicPaywall } from '../components/MagicPaywall';

export default function Calculator() {
  const [searchParams, setSearchParams] = useSearchParams();
  // ✅ Simplified mode: Only 'single' (Translator) or 'pair' (Litter Predictor)
  const [mode, setMode] = useState<'single' | 'pair'>('single');
  const [showPaywall, setShowPaywall] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  
  const user = useUserCredits();
  const { entitlement, restorePurchases } = useSubscription();
  const [showMagicPaywall, setShowMagicPaywall] = useState(false);
  
  const [savedDogs, setSavedDogs] = useState<SavedDog[]>([]);
  const [showKennel, setShowKennel] = useState(searchParams.get('modal') === 'kennel');
  const [activeLoadSlot, setActiveLoadSlot] = useState<'translator' | 'sire' | 'dam' | null>(null);

  const updateModalUrl = (modalName: string | null) => {
      const newParams = new URLSearchParams(searchParams);
      if (modalName) {
         newParams.set('modal', modalName);
         setSearchParams(newParams);
      } else {
         newParams.delete('modal');
         setSearchParams(newParams, { replace: true });
      }
  };

  const handleSetShowKennel = (v: boolean) => {
      setShowKennel(v);
      updateModalUrl(v ? 'kennel' : null);
  };

  const handleSetShowPaywall = (v: boolean) => {
      setShowPaywall(v);
      updateModalUrl(v ? 'paywall' : null);
  };

  const handleSetShowLogin = (v: boolean) => {
      user.setShowLogin(v);
      updateModalUrl(v ? 'login' : null);
  };

  useEffect(() => {
      const modal = searchParams.get('modal');
      if (modal === 'kennel') setShowKennel(true);
      else if (modal === 'paywall') setShowPaywall(true);
      else if (modal === 'login') user.setShowLogin(true);
      else {
          setShowKennel(false);
          setShowPaywall(false);
          user.setShowLogin(false);
      }
  }, [searchParams]);

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
      if (entitlement !== 'pro_access') {
         if (entitlement === 'standard_access' && savedDogs.length >= 10) {
             setShowMagicPaywall(true);
             return false;
         }
         if (entitlement === 'none' && savedDogs.length >= 2) {
             setShowMagicPaywall(true);
             return false;
         }
      }

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
    <div className="h-[100dvh] overflow-hidden bg-[#020617] text-slate-200 font-sans relative flex flex-col items-center">
       <SEO 
         title="French Bulldog Color Calculator | OKC Frenchies"
         description="Predict your French Bulldog litter's colors, DNA, and phenotypes using the OKC Frenchies Genetic Configurator."
         url="https://okcfrenchies.com/french-bulldog-color-calculator"
       />

       {/* Top Header / App Bar */}
       <div className="w-full shrink-0 bg-[#0a0a0a] border-b border-slate-800 md:max-w-[1200px] shadow-xl z-40">
            <div className="p-4 pt-[max(1rem,env(safe-area-inset-top))] text-center pb-2">
                <h1 className="font-serif text-2xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-luxury-teal via-white to-luxury-magenta uppercase tracking-widest">DNA Matrix</h1>
            </div>
            
            {/* Top Navigation Tabs */}
            <div className="flex px-4 gap-2 mb-2">
                <button 
                    onClick={() => setMode('single')} 
                    className={`flex-1 py-3 text-[10px] uppercase font-bold tracking-widest rounded-t-sm transition-all border-b-2 ${mode==='single' ? 'text-luxury-teal border-luxury-teal bg-luxury-teal/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                >
                    Translator
                </button>
                <button 
                    onClick={() => setMode('pair')} 
                    className={`flex-1 py-3 text-[10px] uppercase font-bold tracking-widest rounded-t-sm transition-all border-b-2 ${mode==='pair' ? 'text-luxury-magenta border-luxury-magenta bg-luxury-magenta/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                >
                    Litter Pairing
                </button>
            </div>
       </div>

       {/* App Content Area */}
       <div className="w-full md:max-w-[1200px] flex-1 min-h-0 flex flex-col bg-[#0f172a] md:border-x border-slate-800 relative shadow-2xl pb-[env(safe-area-inset-bottom)]">
            <div className="w-full h-full flex flex-col flex-1 min-h-0">
                 {mode === 'single' ? (
                    <DnaTranslator 
                        singleGender={singleGender}
                        setSingleGender={setSingleGender}
                        currentDna={currentDna}
                        handleChange={handleSingleModeChange}
                        onSave={handleSaveToKennel}
                        onAssignToMatrix={handleAssignToMatrix}
                        onLoad={() => { setActiveLoadSlot('translator'); handleSetShowKennel(true); }}
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
                        setShowKennel={handleSetShowKennel}
                        setActiveLoadSlot={setActiveLoadSlot}
                        studio={null as any} // ✅ Studio safely disabled
                        isMobile={isMobile}
                    />
                 )}
            </div>
       </div>

       <CalculatorModals 
            showKennel={showKennel}
            setShowKennel={handleSetShowKennel}
            savedDogs={savedDogs}
            loadDogSmart={loadDogSmart}
            removeDog={removeDog}
            showPaywall={showPaywall}
            setShowPaywall={handleSetShowPaywall}
            userId={user.userId}
            promoCodeInput={user.promoCodeInput}
            setPromoCodeInput={user.setPromoCodeInput}
            handlePromoSubmit={() => user.handlePromoSubmit(() => handleSetShowPaywall(false))}
            showLogin={user.showLogin}
            setShowLogin={handleSetShowLogin}
            userEmail={user.userEmail}
            setUserEmail={user.setUserEmail}
            handleLoginSubmit={user.handleLoginSubmit} 
            credits={user.credits}
            isSubscribed={user.isSubscribed}
            isUnlocked={user.isUnlocked}
       />
       <MagicPaywall isOpen={showMagicPaywall} onClose={() => setShowMagicPaywall(false)} />

       {/* Bottom Navigation */}
       <div className="fixed bottom-0 w-full bg-[#0a0a0a]/95 backdrop-blur-md border-t border-slate-800 pb-[env(safe-area-inset-bottom)] z-50 flex justify-around items-center">
            <button onClick={() => window.scrollTo(0,0)} className="flex flex-col items-center p-3 text-luxury-teal hover:text-white transition-colors">
                <Home size={22} />
                <span className="text-[9px] uppercase tracking-widest mt-1 font-bold">Matrix</span>
            </button>
            <button onClick={() => handleSetShowKennel(true)} className="flex flex-col items-center p-3 text-slate-500 hover:text-white transition-colors">
                <Database size={22} />
                <span className="text-[9px] uppercase tracking-widest mt-1 font-bold">Kennel</span>
            </button>
            <button onClick={() => alert("Detailed Reports coming soon!")} className="flex flex-col items-center p-3 text-slate-500 hover:text-white transition-colors">
                <PieChart size={22} />
                <span className="text-[9px] uppercase tracking-widest mt-1 font-bold">Reports</span>
            </button>
            <button onClick={() => setShowAccountMenu(true)} className={`flex flex-col items-center p-3 transition-colors ${user.userId ? 'text-luxury-magenta hover:text-white' : 'text-slate-500 hover:text-white'}`}>
                <User size={22} />
                <span className="text-[9px] uppercase tracking-widest mt-1 font-bold">Account</span>
            </button>
       </div>

       {/* Minimalist Mobile Account Menu Overlay */}
       {showAccountMenu && (
           <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 pb-[calc(100px+env(safe-area-inset-bottom))] sm:pb-4" onClick={() => setShowAccountMenu(false)}>
               <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom-10" onClick={e => e.stopPropagation()}>
                   <div className="flex justify-between items-center mb-2">
                       <h3 className="font-serif text-xl tracking-widest text-white uppercase">My Account</h3>
                       <button onClick={() => setShowAccountMenu(false)} className="text-slate-500 hover:text-white"><X size={20}/></button>
                   </div>

                   <button onClick={() => { setShowAccountMenu(false); restorePurchases(); }} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl uppercase tracking-widest text-[10px] font-bold flex items-center justify-center gap-2 transition-colors">
                       <RefreshCcw size={16}/> Restore Purchases
                   </button>
                   
                   {user.userId ? (
                       <button onClick={() => { setShowAccountMenu(false); user.handleLogout(); }} className="w-full py-4 bg-red-900/20 border border-red-500/30 hover:bg-red-500 hover:text-white text-red-500 rounded-xl uppercase tracking-widest text-[10px] font-bold flex items-center justify-center gap-2 transition-all">
                           <LogOut size={16}/> Sign Out
                       </button>
                   ) : (
                       <button onClick={() => { setShowAccountMenu(false); handleSetShowLogin(true); }} className="w-full py-4 bg-luxury-teal hover:bg-emerald-400 text-black rounded-xl uppercase tracking-[0.2em] text-[10px] font-bold flex items-center justify-center gap-2 transition-all shadow-lg">
                           <LogIn size={16}/> Connect Account
                       </button>
                   )}
               </div>
           </div>
       )}
    </div>
  );
}
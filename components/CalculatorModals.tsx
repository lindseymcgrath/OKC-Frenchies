import React from 'react';
import { X, Crown, Infinity, CreditCard, Ticket, Trash2, Mail, CheckCircle } from 'lucide-react';
// ✅ Import getStripeLinks instead of STRIPE_LINKS
import { getStripeLinks, PROMPTS, getPhenotype, SavedDog } from '../utils/calculatorHelpers';

interface CalculatorModalsProps {
    // Studio State
    studio: any;
    
    // Kennel State
    showKennel: boolean;
    setShowKennel: (show: boolean) => void;
    savedDogs: SavedDog[];
    mode: 'single' | 'pair' | 'marketing';
    loadDogSmart: (dog: SavedDog) => void;
    loadIntoSire: (dog: SavedDog) => void;
    loadIntoDam: (dog: SavedDog) => void;
    removeDog: (id: string) => void;

    // Paywall & Login State
    showPaywall: boolean;
    setShowPaywall: (show: boolean) => void;
    userId: string | null;
    promoCodeInput: string;
    setPromoCodeInput: (val: string) => void;
    handlePromoSubmit: () => void;
    showLogin: boolean;
    setShowLogin: (show: boolean) => void;
    userEmail: string;
    setUserEmail: (val: string) => void;
    handleLoginSubmit: () => void;
    credits: number | null; // Added
    isSubscribed: boolean; // Added
    isUnlocked: boolean; // Added
}

export const CalculatorModals: React.FC<CalculatorModalsProps> = ({
    studio,
    showKennel,
    setShowKennel,
    savedDogs,
    mode,
    loadDogSmart,
    loadIntoSire,
    loadIntoDam,
    removeDog,
    showPaywall,
    setShowPaywall,
    userId,
    promoCodeInput,
    setPromoCodeInput,
    handlePromoSubmit,
    showLogin,
    setShowLogin,
    userEmail,
    setUserEmail,
    handleLoginSubmit,
    credits,
    isSubscribed,
    isUnlocked
}) => {

    // ✅ Generate the dynamic links using the user's email
    const stripe = getStripeLinks(userEmail);

    return (
        <>
            {/* AI PROMPT EDITOR MODAL */}
            {studio.showEditorModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl" onClick={() => studio.setShowEditorModal(false)}>
                    <div className="bg-[#0f172a] border border-slate-700 w-full max-w-3xl p-8 rounded-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-serif text-white">Scene Prompt Editor</h3>
                            <button onClick={() => studio.setShowEditorModal(false)} className="text-slate-500 hover:text-white"><X size={24}/></button>
                        </div>
                        <textarea 
                                value={studio.aiPrompt} 
                                onChange={(e) => studio.setAiPrompt(e.target.value)} 
                                className="w-full h-64 bg-black/40 border border-slate-700 p-4 text-sm text-white resize-none focus:border-indigo-500 outline-none rounded-sm font-mono leading-relaxed" 
                                placeholder="Describe your scene in detail..." 
                        />
                        <div className="mt-6 flex justify-end gap-4">
                            <button onClick={() => studio.setShowEditorModal(false)} className="px-6 py-2 border border-slate-600 text-slate-300 hover:text-white rounded-sm">Close</button>
                            <button 
                                    onClick={() => { studio.setShowEditorModal(false); studio.handleGenerateScene(); }}
                                    className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-sm hover:bg-indigo-500"
                                >
                                    Save & Generate
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* PROMPT SELECTION MODAL */}
            {studio.showPromptModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl" onClick={() => studio.setShowPromptModal(false)}>
                    <div className="bg-[#0f172a] border border-slate-700 w-full max-w-2xl p-8 rounded-sm shadow-2xl overflow-y-auto max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-serif text-white">Select Atmosphere</h3>
                            <button onClick={() => studio.setShowPromptModal(false)} className="text-slate-500 hover:text-white"><X size={24}/></button>
                        </div>
                        <div className="space-y-3">
                            {PROMPTS.map((p, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => studio.handlePresetSelect(p.text)}
                                    className="w-full text-left p-6 bg-black/40 border border-slate-800 hover:border-luxury-teal hover:bg-luxury-teal/5 transition-all rounded-sm group"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="block text-base font-bold text-slate-200 group-hover:text-white">{p.name}</span>
                                        <span className="text-[9px] uppercase tracking-widest bg-slate-800 px-2 py-1 rounded text-luxury-teal border border-slate-700">Best For: {p.suggestion}</span>
                                    </div>
                                    <span className="block text-sm text-slate-500">{p.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* KENNEL MODAL */}
            {showKennel && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl" onClick={() => setShowKennel(false)}>
                    <div className="relative bg-[#0f172a] border border-slate-800 p-6 rounded-sm w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => setShowKennel(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20}/></button>
                            <h3 className="font-serif text-2xl text-white mb-6">Saved Genotypes</h3>
                            {savedDogs.length === 0 ? ( <p className="text-slate-500 text-sm text-center">No dogs saved yet.</p> ) : (
                                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                                    {savedDogs.map((dog) => (
                                        <div key={dog.id} className="flex items-center justify-between bg-black/40 p-3 border border-slate-800 rounded-sm">
                                            <div>
                                                <div className="flex items-center gap-2"><span className="block text-sm text-white font-bold">{dog.name}</span>{dog.gender === 'Male' && <span className="text-[#1d4ed8] text-xs font-bold">♂</span>}{dog.gender === 'Female' && <span className="text-[#db2777] text-xs font-bold">♀</span>}</div>
                                                <span className="text-[10px] text-slate-500">{dog.date} • {getPhenotype(dog.dna).phenotypeName}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                {mode === 'single' ? (
                                                    <button 
                                                        onClick={() => loadDogSmart(dog)} 
                                                        className="px-4 py-1.5 bg-luxury-teal/20 text-luxury-teal text-[10px] uppercase font-bold hover:bg-luxury-teal hover:text-black border border-luxury-teal/30"
                                                    >
                                                        Load
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button onClick={() => { loadIntoSire(dog); }} className="px-3 py-1.5 bg-[#1d4ed8]/20 text-[#1d4ed8] text-[10px] uppercase font-bold hover:bg-[#1d4ed8] hover:text-white border border-[#1d4ed8]/30">To Sire</button>
                                                        <button onClick={() => { loadIntoDam(dog); }} className="px-3 py-1.5 bg-[#db2777]/20 text-[#db2777] text-[10px] uppercase font-bold hover:bg-[#db2777] hover:text-white border border-[#db2777]/30">To Dam</button>
                                                    </>
                                                )}
                                                <button onClick={() => removeDog(dog.id)} className="px-2 py-1 bg-red-500/10 text-red-500 text-[10px] uppercase font-bold hover:bg-red-500 hover:text-white border border-red-500/20"><Trash2 size={12}/></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                    </div>
                </div>
            )}

            {/* PAYWALL MODAL */}
            {showPaywall && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
                    <div className="bg-[#0a0a0a] border border-luxury-gold/30 w-full max-w-md p-8 rounded-sm text-center relative animate-in fade-in zoom-in-95 shadow-2xl">
                        <button onClick={() => setShowPaywall(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20}/></button>
                        <Crown size={40} className="text-luxury-gold mx-auto mb-4" />
                        <h2 className="font-serif text-2xl text-white mb-2">Pro Studio Access</h2>
                        
                        {/* 1️⃣ LOGIN SECTION */}
                        <div className="mb-6 bg-slate-900/50 p-4 border border-slate-800 rounded-sm">
                            <p className="text-[10px] text-slate-400 uppercase font-bold mb-3 tracking-widest">Step 1: Identify Your Account</p>
                            <div className="flex gap-2">
                                <input 
                                    type="email" 
                                    placeholder="Enter Email Address" 
                                    value={userEmail} 
                                    onChange={e => setUserEmail(e.target.value)} 
                                    className="flex-1 bg-black border border-slate-700 p-2 text-xs text-white focus:border-luxury-gold outline-none"
                                />
                                <button onClick={handleLoginSubmit} className="bg-slate-700 px-4 text-[10px] text-white uppercase hover:bg-luxury-teal font-bold transition-colors">Verify</button>
                            </div>
                            {userEmail && (
                                <p className="text-[9px] text-emerald-400 mt-2 font-bold uppercase flex items-center justify-center gap-1 animate-in fade-in tracking-tighter">
                                    <CheckCircle size={10}/> Email attached to session
                                </p>
                            )}
                        </div>

                        {/* 2️⃣ DYNAMIC CONTENT - SHOW SUCCESS IF CREDITS > 0, ELSE SHOW BUTTONS */}
                        {userEmail ? (
                            ((credits || 0) > 0 || isSubscribed || isUnlocked) ? (
                                <div className="py-8 bg-emerald-900/10 border border-emerald-500/30 rounded-sm mb-6 animate-in zoom-in-95">
                                    <CheckCircle size={32} className="text-emerald-500 mx-auto mb-2"/>
                                    <p className="text-white font-serif text-lg tracking-wide">Access Unlocked</p>
                                    <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-widest mt-1">
                                        You have {isSubscribed || isUnlocked ? "Unlimited" : credits} {credits === 1 ? 'pass' : 'passes'} available
                                    </p>
                                    <button 
                                        onClick={() => setShowPaywall(false)} 
                                        className="mt-6 px-8 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-emerald-500 transition-all"
                                    >
                                        Start Creating
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3 mb-6 animate-in slide-in-from-bottom-2">
                                    <a href={stripe.BASE_SUB} target="_blank" className="block w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold uppercase text-[10px] tracking-widest rounded-sm flex items-center justify-center gap-2 hover:brightness-110">
                                        <Infinity size={14}/> 3 Months Unlimited ($9.99)
                                    </a>
                                    <a href={stripe.BASE_5} target="_blank" className="block w-full py-3 bg-slate-800 text-white font-bold uppercase text-[10px] tracking-widest rounded-sm border border-slate-700 hover:border-luxury-gold flex items-center justify-center gap-2">
                                        <CreditCard size={14}/> 5 Download Passes ($3.99)
                                    </a>
                                    <a href={stripe.BASE_1} target="_blank" className="block w-full py-3 border border-slate-700 text-slate-300 font-bold uppercase text-[10px] tracking-widest rounded-sm hover:text-white flex items-center justify-center gap-2">
                                        <Ticket size={14}/> Single Session Pass ($0.99)
                                    </a>
                                </div>
                            )
                        ) : (
                            <div className="py-8 border-2 border-dashed border-slate-800 mb-6 rounded-sm opacity-50 flex flex-col items-center bg-black/40">
                                <Mail size={24} className="text-slate-600 mb-2"/>
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Purchase Links Disabled</p>
                                <p className="text-[8px] text-slate-600 mt-1 italic">Please enter your email above to continue</p>
                            </div>
                        )}
                        
                        {/* 3️⃣ PROMO SECTION */}
                        <div className="mb-4 pt-4 border-t border-slate-900">
                            <div className="flex gap-2">
                                <input 
                                        type="text" 
                                        placeholder="PROMO CODE" 
                                        value={promoCodeInput} 
                                        onChange={e => setPromoCodeInput(e.target.value)} 
                                        className="flex-1 bg-black border border-slate-700 p-2 text-[10px] text-white uppercase tracking-widest outline-none focus:border-luxury-gold"
                                />
                                <button onClick={handlePromoSubmit} className="bg-slate-700 px-3 text-[10px] text-white uppercase hover:bg-luxury-gold hover:text-black font-bold transition-all">Apply</button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

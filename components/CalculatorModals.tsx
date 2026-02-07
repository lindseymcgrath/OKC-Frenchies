import React from 'react';
import { X, Crown, Infinity, CreditCard, Ticket, Trash2, Mail, CheckCircle } from 'lucide-react';
import { getStripeLinks, PROMPTS, getPhenotype, SavedDog } from '../utils/calculatorHelpers';

interface CalculatorModalsProps {
    studio: any;
    showKennel: boolean;
    setShowKennel: (show: boolean) => void;
    savedDogs: SavedDog[];
    mode: 'single' | 'pair' | 'marketing';
    loadDogSmart: (dog: SavedDog) => void;
    loadIntoSire: (dog: SavedDog) => void;
    loadIntoDam: (dog: SavedDog) => void;
    removeDog: (id: string) => void;
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
    credits: number | null;
    isSubscribed: boolean;
    isUnlocked: boolean;
}

export const CalculatorModals: React.FC<CalculatorModalsProps> = ({
    studio, showKennel, setShowKennel, savedDogs, mode, loadDogSmart, loadIntoSire, loadIntoDam, removeDog,
    showPaywall, setShowPaywall, userId, promoCodeInput, setPromoCodeInput, handlePromoSubmit,
    showLogin, setShowLogin, userEmail, setUserEmail, handleLoginSubmit,
    credits, isSubscribed, isUnlocked
}) => {

    const stripe = getStripeLinks(userEmail);

    // ✅ This handles the "Click to Buy" safety check
    const handlePurchaseClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
        if (!userEmail || !userEmail.includes('@')) {
            e.preventDefault();
            alert("Please enter and verify your email at the top first so we can track your credits!");
        }
    };

    return (
        <>
            {/* ... (Keep AI Editor, Prompt Modal, and Kennel Modal as they are) ... */}

            {showPaywall && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
                    <div className="bg-[#0a0a0a] border border-luxury-gold/30 w-full max-w-md p-8 rounded-sm text-center relative animate-in fade-in zoom-in-95 shadow-2xl">
                        <button onClick={() => setShowPaywall(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20}/></button>
                        <Crown size={40} className="text-luxury-gold mx-auto mb-4" />
                        <h2 className="font-serif text-2xl text-white mb-2">Pro Studio Access</h2>
                        
                        {/* 1️⃣ LOGIN / EMAIL SECTION (Crucial for tracking) */}
                        <div className="mb-6 bg-slate-900/50 p-4 border border-slate-800 rounded-sm">
                            <p className="text-[10px] text-slate-400 uppercase font-bold mb-3 tracking-widest text-center">
                                {userEmail ? "Account Identified" : "Step 1: Verify Email to Enable Purchase"}
                            </p>
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
                        </div>

                        {/* 2️⃣ PURCHASE OR SUCCESS SECTION */}
                        {((credits || 0) > 0 || isSubscribed || isUnlocked) ? (
                            <div className="py-8 bg-emerald-900/10 border border-emerald-500/30 rounded-sm mb-6 animate-in zoom-in-95 text-center">
                                <CheckCircle size={32} className="text-emerald-500 mx-auto mb-2"/>
                                <p className="text-white font-serif text-lg">Credits Active</p>
                                <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-widest mt-1">
                                    {isSubscribed || isUnlocked ? "Unlimited Session" : `${credits} Pass(es) Available`}
                                </p>
                                <button onClick={() => setShowPaywall(false)} className="mt-6 px-8 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm">Start Designing</button>
                            </div>
                        ) : (
                            <div className="space-y-3 mb-6">
                                <a 
                                    href={stripe.BASE_SUB} 
                                    onClick={(e) => handlePurchaseClick(e, stripe.BASE_SUB)}
                                    target="_blank" 
                                    className="block w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold uppercase text-[10px] tracking-widest rounded-sm flex items-center justify-center gap-2"
                                >
                                    <Infinity size={14}/> 3 Months Unlimited ($9.99)
                                </a>
                                <a 
                                    href={stripe.BASE_5} 
                                    onClick={(e) => handlePurchaseClick(e, stripe.BASE_5)}
                                    target="_blank" 
                                    className="block w-full py-3 bg-slate-800 text-white font-bold uppercase text-[10px] tracking-widest rounded-sm border border-slate-700 hover:border-luxury-gold flex items-center justify-center gap-2"
                                >
                                    <CreditCard size={14}/> 5 Download Passes ($3.99)
                                </a>
                                <a 
                                    href={stripe.BASE_1} 
                                    onClick={(e) => handlePurchaseClick(e, stripe.BASE_1)}
                                    target="_blank" 
                                    className="block w-full py-3 border border-slate-700 text-slate-300 font-bold uppercase text-[10px] tracking-widest rounded-sm hover:text-white flex items-center justify-center gap-2"
                                >
                                    <Ticket size={14}/> Single Session Pass ($0.99)
                                </a>
                            </div>
                        )}
                        
                        <div className="pt-4 border-t border-slate-900">
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="PROMO CODE" 
                                    value={promoCodeInput} 
                                    onChange={e => setPromoCodeInput(e.target.value)} 
                                    className="flex-1 bg-black border border-slate-700 p-2 text-[10px] text-white uppercase"
                                />
                                <button onClick={handlePromoSubmit} className="bg-slate-700 px-3 text-[10px] text-white uppercase hover:bg-luxury-gold hover:text-black font-bold">Apply</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

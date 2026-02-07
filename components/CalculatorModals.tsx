import React from 'react';
import { X, Crown, Infinity, CreditCard, Ticket, CheckCircle } from 'lucide-react';
import { getStripeLinks, SavedDog } from '../utils/calculatorHelpers';

interface CalculatorModalsProps {
    studio: any;
    showPaywall: boolean;
    setShowPaywall: (show: boolean) => void;
    userEmail: string;
    setUserEmail: (val: string) => void;
    handleLoginSubmit: () => void;
    credits: number | null;
    isSubscribed: boolean;
    isUnlocked: boolean;
    promoCodeInput: string;
    setPromoCodeInput: (val: string) => void;
    handlePromoSubmit: (onSuccess: () => void) => void;
}

export const CalculatorModals: React.FC<CalculatorModalsProps> = (props) => {
    const { 
        showPaywall, setShowPaywall, userEmail, setUserEmail, 
        handleLoginSubmit, credits, isSubscribed, isUnlocked,
        promoCodeInput, setPromoCodeInput, handlePromoSubmit
    } = props;

    const stripe = getStripeLinks(userEmail);
    
    // Check access: convert credits to number to be safe
    const hasAccess = (credits !== null && Number(credits) > 0) || isSubscribed || isUnlocked;

    if (!showPaywall) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <div className="bg-[#0a0a0a] border border-luxury-gold/30 w-full max-w-md p-8 rounded-sm text-center relative shadow-2xl animate-in fade-in zoom-in-95">
                <button onClick={() => setShowPaywall(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                    <X size={20}/>
                </button>
                
                <Crown size={40} className="text-luxury-gold mx-auto mb-4" />
                <h2 className="font-serif text-2xl text-white mb-6">Pro Studio Access</h2>
                
                {/* 1. EMAIL VERIFICATION */}
                <div className="mb-6 bg-slate-900/50 p-4 border border-slate-800 rounded-sm">
                    <div className="flex gap-2">
                        <input 
                            type="email" 
                            placeholder="Verify Email" 
                            value={userEmail} 
                            onChange={e => setUserEmail(e.target.value)} 
                            className="flex-1 bg-black border border-slate-700 p-2 text-xs text-white outline-none focus:border-luxury-gold"
                        />
                        <button 
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                handleLoginSubmit();
                            }} 
                            className="bg-slate-700 px-4 text-[10px] text-white font-bold uppercase hover:bg-luxury-teal transition-all"
                        >
                            Verify
                        </button>
                    </div>
                </div>

                {/* 2. SUCCESS SCREEN OR ALL 3 SHOP OPTIONS */}
                {hasAccess ? (
                    <div className="py-8 bg-emerald-900/10 border border-emerald-500/30 rounded-sm mb-6 animate-in zoom-in-95">
                        <CheckCircle size={32} className="text-emerald-500 mx-auto mb-2"/>
                        <p className="text-white font-serif text-lg">Access Granted</p>
                        <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-widest mt-1">
                            {isSubscribed || isUnlocked ? "Unlimited Session" : `${credits} Credit(s) Available`}
                        </p>
                        <button 
                            onClick={() => setShowPaywall(false)} 
                            className="mt-6 px-12 py-3 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-emerald-500"
                        >
                            Start Designing
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3 mb-6">
                        <a href={stripe.BASE_SUB} target="_blank" rel="noreferrer" className="block w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold uppercase text-[10px] tracking-widest rounded-sm flex items-center justify-center gap-2">
                            <Infinity size={14}/> 3 Months Unlimited ($9.99)
                        </a>
                        <a href={stripe.BASE_5} target="_blank" rel="noreferrer" className="block w-full py-3 bg-slate-800 text-white font-bold uppercase text-[10px] tracking-widest rounded-sm border border-slate-700 hover:border-luxury-gold transition-all flex items-center justify-center gap-2">
                            <CreditCard size={14}/> 5 Download Passes ($3.99)
                        </a>
                        {/* RESTORED SINGLE PASS */}
                        <a href={stripe.BASE_1} target="_blank" rel="noreferrer" className="block w-full py-3 border border-slate-700 text-slate-300 font-bold uppercase text-[10px] tracking-widest rounded-sm hover:text-white flex items-center justify-center gap-2">
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
                        <button onClick={() => handlePromoSubmit(() => setShowPaywall(false))} className="bg-slate-700 px-3 text-[10px] text-white uppercase hover:bg-luxury-gold hover:text-black font-bold">Apply</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

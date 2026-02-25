import React, { useState } from 'react';
import { X, Crown, Infinity, CreditCard, Ticket, CheckCircle, Loader2, Search, Trash2, LogIn, AlertTriangle } from 'lucide-react';
import { getStripeLinks, SavedDog, getPhenotype } from '../utils/calculatorHelpers';

interface CalculatorModalsProps {
    showKennel: boolean;
    setShowKennel: (show: boolean) => void;
    savedDogs: SavedDog[];
    loadDogSmart: (dog: SavedDog) => void;
    removeDog: (id: string) => void;
    showLogin: boolean;
    setShowLogin: (show: boolean) => void;
    userEmail: string | undefined;
    setUserEmail: (val: string) => void;
    handleLoginSubmit: (email?: string) => Promise<void>;
    showPaywall: boolean;
    setShowPaywall: (show: boolean) => void;
    credits: number | null;
    isSubscribed: boolean;
    isUnlocked: boolean;
    promoCodeInput: string;
    setPromoCodeInput: (val: string) => void;
    handlePromoSubmit: (callback: () => void) => void;
    userId?: string | null;
}

export const CalculatorModals: React.FC<CalculatorModalsProps> = (props) => {
    const { 
        showKennel, setShowKennel, savedDogs, loadDogSmart, removeDog,
        showLogin, setShowLogin, userEmail, setUserEmail, handleLoginSubmit,
        showPaywall, setShowPaywall, credits, isSubscribed, isUnlocked,
        promoCodeInput, setPromoCodeInput, handlePromoSubmit
    } = props;

    const [searchTerm, setSearchTerm] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    
    // ✅ NEW: Custom state to handle deletion without window.confirm
    const [dogToDelete, setDogToDelete] = useState<SavedDog | null>(null);
    
    const stripe = getStripeLinks(userEmail || '');
    
    const filteredDogs = savedDogs ? savedDogs.filter(dog => 
        dog.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        dog.gender.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const hasAccess = Boolean(isSubscribed || isUnlocked || (credits !== null && Number(credits) > 0));

    const onConnectClick = async () => {
        if(!userEmail || !userEmail.includes('@')) {
            // Using console.error/alert might be blocked too, so we fail gracefully or use a simple fallback
            console.warn("Invalid email");
            return;
        }
        setIsConnecting(true);
        try {
            await handleLoginSubmit(userEmail);
        } catch (error) {
            console.error("Connection failed", error);
        } finally {
            setIsConnecting(false);
        }
    };

    // ✅ FIXED: Opens custom state instead of crashing with window.confirm
    const handleDeleteClick = (e: React.MouseEvent, dog: SavedDog) => {
        e.preventDefault();
        e.stopPropagation(); 
        setDogToDelete(dog); // Triggers the custom modal below
    };

    // ✅ EXECUTE DELETE
    const confirmDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (dogToDelete) {
            removeDog(dogToDelete.id);
            setDogToDelete(null); // Close modal
        }
    };

    return (
        <>
            {/* 1. KENNEL MODAL */}
            {showKennel && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                    <div className="relative bg-[#0f172a] border border-slate-800 rounded-sm w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl overflow-hidden">
                        
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                            <div>
                                <h3 className="font-serif text-2xl text-white uppercase tracking-tighter">The Kennel</h3>
                                <p className="text-slate-500 text-[10px] uppercase tracking-widest">Select or Delete Dogs</p>
                            </div>
                            <button onClick={() => setShowKennel(false)} className="text-slate-500 hover:text-white p-2 transition-colors"><X size={24}/></button>
                        </div>
                        
                        <div className="p-4 border-b border-slate-800 bg-black/20">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Search by name..." 
                                    value={searchTerm} 
                                    onChange={(e) => setSearchTerm(e.target.value)} 
                                    className="w-full bg-slate-900 border border-slate-700 rounded-sm py-2 pl-10 pr-4 text-sm text-white focus:border-luxury-teal outline-none" 
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar relative">
                            {filteredDogs.length === 0 ? (
                                <div className="text-center py-20 text-slate-600 uppercase text-[10px] tracking-widest">No dogs found</div>
                            ) : (
                                filteredDogs.map((dog) => (
                                    <div key={dog.id} className="flex items-center justify-between bg-black/40 border border-slate-800 p-4 rounded-sm hover:border-luxury-teal/30 group transition-all">
                                        
                                        <div className="flex items-center gap-4 flex-1 cursor-pointer min-w-0" onClick={() => loadDogSmart(dog)}>
                                            <div className={`w-1.5 h-10 rounded-full shrink-0 ${dog.gender === 'Male' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]' : 'bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.4)]'}`}></div>
                                            <div className="min-w-0">
                                                <h4 className="font-serif text-lg text-white group-hover:text-luxury-teal transition-colors truncate uppercase tracking-wide">{dog.name}</h4>
                                                <p className="text-[10px] text-slate-500 font-mono truncate uppercase tracking-tight">
                                                    {getPhenotype(dog.dna).compactDnaString}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 ml-4">
                                            <button 
                                                type="button"
                                                onClick={(e) => handleDeleteClick(e, dog)}
                                                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                                                title="Delete Dog"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}

                            {/* ✅ CUSTOM DELETE CONFIRMATION OVERLAY (Replaces window.confirm) */}
                            {dogToDelete && (
                                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                                    <div className="bg-[#0f172a] border border-red-500/30 p-6 rounded-sm shadow-2xl max-w-xs w-full text-center animate-in fade-in zoom-in duration-200">
                                        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <AlertTriangle className="text-red-500" size={24} />
                                        </div>
                                        <h4 className="text-white font-serif text-lg mb-2">Delete {dogToDelete.name}?</h4>
                                        <p className="text-slate-400 text-xs mb-6">This action cannot be undone.</p>
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setDogToDelete(null); }}
                                                className="flex-1 py-3 bg-slate-800 text-slate-300 text-[10px] font-bold uppercase rounded-sm border border-slate-700 hover:bg-slate-700"
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                onClick={confirmDelete}
                                                className="flex-1 py-3 bg-red-600 text-white text-[10px] font-bold uppercase rounded-sm hover:bg-red-500 shadow-lg shadow-red-900/20"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 2. LOGIN MODAL */}
            {showLogin && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
                     <div className="relative bg-[#0f172a] border border-slate-800 p-8 rounded-sm max-w-md w-full text-center shadow-2xl">
                        <button onClick={() => setShowLogin(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"><X size={20}/></button>
                        <div className="w-16 h-16 bg-luxury-teal/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-luxury-teal/30"><LogIn className="text-luxury-teal" size={32} /></div>
                        <h3 className="font-serif text-3xl text-white mb-2 uppercase tracking-tight">Sync Kennel</h3>
                        <p className="text-slate-400 text-sm mb-6">Connect to save and load your dogs across devices.</p>
                        <input type="email" placeholder="Account Email" value={userEmail || ''} onChange={(e) => setUserEmail(e.target.value)} className="w-full bg-black/40 border border-slate-700 p-3 text-white rounded-sm mb-4 outline-none focus:border-luxury-teal text-center placeholder:text-slate-600" />
                        <button onClick={onConnectClick} disabled={isConnecting} className="w-full py-4 bg-luxury-teal text-black font-black uppercase tracking-[0.2em] text-xs rounded-sm hover:bg-emerald-400 transition-all flex justify-center items-center gap-2 shadow-lg">
                            {isConnecting ? <Loader2 size={18} className="animate-spin" /> : "Connect Account"}
                        </button>
                     </div>
                </div>
            )}
            
            {/* 3. PAYWALL MODAL */}
            {showPaywall && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
                    <div className="bg-[#0a0a0a] border border-luxury-gold/30 w-full max-w-md p-8 rounded-sm text-center relative shadow-2xl">
                        <button onClick={() => setShowPaywall(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20}/></button>
                        <Crown size={40} className="text-luxury-gold mx-auto mb-4" />
                        <h2 className="font-serif text-2xl text-white mb-6 uppercase tracking-widest">Pro Studio</h2>
                        {hasAccess ? (
                            <div className="py-8 bg-emerald-900/10 border border-emerald-500/30 rounded-sm mb-6">
                                <CheckCircle size={32} className="text-emerald-500 mx-auto mb-2"/>
                                <p className="text-emerald-400 font-serif text-lg">Access Granted</p>
                                <button onClick={() => setShowPaywall(false)} className="mt-6 px-12 py-3 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-emerald-500 shadow-lg">Enter Studio</button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6 bg-slate-900/50 p-4 border border-slate-800 rounded-sm">
                                    <div className="flex gap-2">
                                        <input type="email" placeholder="Account Email" value={userEmail} onChange={e => setUserEmail(e.target.value)} className="flex-1 bg-black border border-slate-700 p-2 text-xs text-white outline-none"/>
                                        <button type="button" disabled={isVerifying} onClick={async () => { if (!userEmail) return; setIsVerifying(true); try { await handleLoginSubmit(userEmail); } catch(e) {} finally { setIsVerifying(false); }}} className="bg-slate-700 px-4 text-[10px] text-white font-bold uppercase hover:bg-luxury-teal transition-all">{isVerifying ? <Loader2 size={14} className="animate-spin mx-auto"/> : "Verify"}</button>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-6">
                                    <a href={stripe.BASE_SUB} target="_blank" rel="noreferrer" className="block w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold uppercase text-[10px] tracking-widest rounded-sm flex items-center justify-center gap-2"><Infinity size={14}/> 3 Months Unlimited ($9.99)</a>
                                    <a href={stripe.BASE_5} target="_blank" rel="noreferrer" className="block w-full py-3 bg-slate-800 text-white font-bold uppercase text-[10px] tracking-widest rounded-sm border border-slate-700 hover:border-luxury-gold flex items-center justify-center gap-2"><CreditCard size={14}/> 5 Download Passes ($3.99)</a>
                                    <a href={stripe.BASE_1} target="_blank" rel="noreferrer" className="block w-full py-3 bg-slate-800 text-white font-bold uppercase text-[10px] tracking-widest rounded-sm border border-slate-700 hover:border-luxury-gold flex items-center justify-center gap-2"><Ticket size={14}/> 1 Single Use Credit ($0.99)</a>
                                </div>
                                <div className="pt-6 border-t border-slate-800">
                                    <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-wider">Have a promo code?</p>
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="ENTER CODE" value={promoCodeInput} onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())} className="flex-1 bg-black border border-slate-800 p-2 text-xs text-center text-luxury-gold font-mono uppercase outline-none focus:border-luxury-gold"/>
                                        <button onClick={() => handlePromoSubmit(() => setShowPaywall(false))} className="px-4 bg-luxury-gold text-black text-[10px] font-bold uppercase hover:bg-yellow-400 transition-colors">Redeem</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
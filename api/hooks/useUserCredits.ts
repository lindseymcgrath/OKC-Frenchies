import { useState, useEffect, useRef } from 'react';
import { supabase, FREEBIE_CODE } from '../utils/calculatorHelpers';

export const useUserCredits = () => {
    // --- STATE ---
    const [userEmail, setUserEmail] = useState('');
    const [userId, setUserId] = useState<string | null>(null);
    const [showLogin, setShowLogin] = useState(false); 
    const [credits, setCredits] = useState<number | null>(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false); 
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [promoCodeInput, setPromoCodeInput] = useState('');

    // 🔥 NEW: Local state to track the "Bundle" unlocked by 1 credit
    const [sessionBundle, setSessionBundle] = useState({
        ai: 0,       // Starts at 0, becomes 8 when unlocked
        bg: 0,       // Starts at 0, becomes 4 when unlocked
        downloads: 0 // Starts at 0, becomes 3 when unlocked
    });

    const currentEmailRef = useRef('');

    // --- FETCH LOGIC (READ ONLY) ---
    const fetchCredits = async (email: string) => {
        if (!email) return null;
        setIsUnlocking(true); 
        
        const { data, error } = await supabase
            .from('user_credits')
            .select('*')
            .eq('email', email.toLowerCase().trim())
            .single();
        
        setIsUnlocking(false);
        
        if (data) {
            setCredits(data.credits_remaining);
            setUserId(data.id); 
            
            if (data.subscription_end) {
                const active = new Date(data.subscription_end) > new Date();
                setIsSubscribed(active);
                setIsUnlocked(active);
            }
            return data;
        }
        return null;
    };

    // --- INITIAL LOAD ---
    useEffect(() => {
        const storedEmail = localStorage.getItem('okc_user_email');
        if (storedEmail) { 
            const formattedEmail = storedEmail.toLowerCase().trim();
            setUserEmail(formattedEmail); 
            currentEmailRef.current = formattedEmail;
            fetchCredits(formattedEmail); 
        }

        const channel = supabase
            .channel('credit_updates')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'user_credits' }, (payload) => {
                if (payload.new.email === currentEmailRef.current) {
                    setCredits(payload.new.credits_remaining);
                    if (payload.new.id) setUserId(payload.new.id);
                    if (payload.new.subscription_end) {
                        const active = new Date(payload.new.subscription_end) > new Date();
                        setIsSubscribed(active);
                        setIsUnlocked(active);
                    }
                }
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    // --- LOGIN / CREATE ACCOUNT HANDLER ---
    const handleLoginSubmit = async (emailInput?: string) => {
        const emailToVerify = (emailInput || userEmail || '').trim().toLowerCase();

        if (emailToVerify.includes('@')) { 
            console.log("🚀 Connecting Kennel for:", emailToVerify);
            let user = await fetchCredits(emailToVerify);

            if (!user) {
                console.log("🆕 Creating new account for:", emailToVerify);
                const { data, error } = await supabase
                    .from('user_credits')
                    .insert([{ 
                        email: emailToVerify, 
                        credits_remaining: 0 
                    }])
                    .select()
                    .single();

                if (error) {
                    alert("Error creating profile: " + error.message);
                    return;
                }
                user = data;
            }

            if (user) {
                localStorage.setItem('okc_user_email', emailToVerify); 
                currentEmailRef.current = emailToVerify;
                setUserEmail(emailToVerify);
                setUserId(user.id);
                setCredits(user.credits_remaining);
                setShowLogin(false);
                alert(`✅ Connected! Kennel linked to ${emailToVerify}`);
            }
        } else {
            alert("Please enter a valid email.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('okc_user_email');
        setUserEmail('');
        setUserId(null);
        setCredits(null);
        setIsSubscribed(false);
        setIsUnlocked(false);
        // Reset local session on logout
        setSessionBundle({ ai: 0, bg: 0, downloads: 0 });
    };

    // Internal helper to actually touch the DB
    const deductCredit = async (): Promise<boolean> => {
        // If they are Pro, they don't use credits
        if (isSubscribed || isUnlocked) return true;

        if (credits && credits > 0) {
            const newCount = credits - 1;
            setCredits(newCount);
            const { error } = await supabase
                .from('user_credits')
                .update({ credits_remaining: newCount })
                .eq('email', userEmail);
            
            if (error) {
                // Rollback local state if DB fails
                setCredits(credits);
                return false;
            }
            return true;
        }
        return false;
    };

    // 🔥 NEW: The Smart Function that handles your 8x / 4x / 3x Logic
    const consumeBundleItem = async (type: 'ai' | 'bg' | 'download'): Promise<boolean> => {
        // 1. If Pro/Unlocked, just approve it
        if (isSubscribed || isUnlocked) return true;

        // 2. Check if we have "Uses" left in the current Bundle
        if (sessionBundle[type] > 0) {
            setSessionBundle(prev => ({ ...prev, [type]: prev[type] - 1 }));
            return true; // Approved without using a credit
        }

        // 3. If Bundle is empty, try to use 1 Credit to refill it
        const creditUsed = await deductCredit();
        if (creditUsed) {
            // Unlocked! Fill the bundle (minus the 1 we are using right now)
            setSessionBundle({
                ai: type === 'ai' ? 7 : 8,       // 8 Total
                bg: type === 'bg' ? 3 : 4,       // 4 Total
                downloads: type === 'download' ? 2 : 3 // 3 Total
            });
            return true;
        }

        // 4. No credits left
        return false;
    };

    return {
        userEmail, setUserEmail,
        userId, setUserId,
        showLogin, setShowLogin,
        credits, setCredits,
        isSubscribed, setIsSubscribed,
        isUnlocked, setIsUnlocked,
        isUnlocking, setIsUnlocking,
        promoCodeInput, setPromoCodeInput,
        
        // Exposed Methods
        fetchCredits,
        consumeBundleItem, // <--- USE THIS in your UI instead of deductCredit
        deductCredit,      // Keep this available just in case
        
        handleLoginSubmit, 
        handleLogout,
        handlePromoSubmit: (onSuccess: () => void) => {
             if (promoCodeInput.toUpperCase() === FREEBIE_CODE) {
                setIsUnlocked(true);
                alert("Free Session Unlocked!");
                onSuccess();
             }
        }
    };
};
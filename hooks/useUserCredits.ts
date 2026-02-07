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

    // Use a ref to prevent stale closures in the subscription
    const currentEmailRef = useRef('');

    // --- LOGIC ---
    const fetchCredits = async (email: string) => {
        if (!email) return;
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
                const endDate = new Date(data.subscription_end);
                if (endDate > new Date()) {
                    setIsSubscribed(true);
                    setIsUnlocked(true); 
                } else {
                    setIsSubscribed(false);
                }
            }
        } else if (error) {
            setCredits(0);
        }
    };

    // 1. INITIAL LOAD & REALTIME SUBSCRIPTION
    useEffect(() => {
        const storedEmail = localStorage.getItem('okc_user_email');
        if (storedEmail) { 
            const formattedEmail = storedEmail.toLowerCase().trim();
            setUserEmail(formattedEmail); 
            currentEmailRef.current = formattedEmail;
            fetchCredits(formattedEmail); 
        }

        // 🚀 REALTIME LISTENER: Watch for Stripe updates automatically
        const channel = supabase
            .channel('credit_updates')
            .on(
                'postgres_changes', 
                { event: 'UPDATE', schema: 'public', table: 'user_credits' },
                (payload) => {
                    if (payload.new.email === currentEmailRef.current) {
                        setCredits(payload.new.credits_remaining);
                        if (payload.new.subscription_end) {
                            const active = new Date(payload.new.subscription_end) > new Date();
                            setIsSubscribed(active);
                            setIsUnlocked(active);
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const deductCredit = async (): Promise<boolean> => {
        if (isSubscribed || isUnlocked) return true;
        
        if (credits && credits > 0) {
            const newCount = credits - 1;
            // Optimistic Update (Update UI immediately)
            setCredits(newCount);
            
            const { error } = await supabase
                .from('user_credits')
                .update({ credits_remaining: newCount })
                .eq('email', userEmail);
            
            if (error) {
                setCredits(credits); // Rollback
                return false;
            }
            return true;
        }
        return false;
    };

    const handleLoginSubmit = () => {
        if (userEmail && userEmail.includes('@')) { 
            const formattedEmail = userEmail.toLowerCase().trim();
            localStorage.setItem('okc_user_email', formattedEmail); 
            currentEmailRef.current = formattedEmail;
            fetchCredits(formattedEmail); 
            setShowLogin(false);
        } else {
            alert("Please enter a valid email.");
        }
    };

    const handlePromoSubmit = (onSuccess: () => void) => {
        if (promoCodeInput.toUpperCase() === FREEBIE_CODE) {
            setIsUnlocked(true); 
            setPromoCodeInput('');
            alert("Free Session Unlocked!");
            onSuccess();
        } else {
            alert("Invalid Code");
        }
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
        fetchCredits,
        deductCredit,
        handleLoginSubmit,
        handlePromoSubmit
    };
};

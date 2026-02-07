import { useState, useEffect } from 'react';
import { supabase, FREEBIE_CODE } from '../utils/calculatorHelpers';

export const useUserCredits = () => {
    // Credit & Session State
    const [userEmail, setUserEmail] = useState('');
    const [userId, setUserId] = useState<string | null>(null);
    const [showLogin, setShowLogin] = useState(false); 
    const [credits, setCredits] = useState<number | null>(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    
    // Unlock State
    const [isUnlocked, setIsUnlocked] = useState(false); 
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [promoCodeInput, setPromoCodeInput] = useState('');

    // Load initial state from LocalStorage
    useEffect(() => {
        const storedEmail = localStorage.getItem('okc_user_email');
        if (storedEmail) { 
            setUserEmail(storedEmail); 
            fetchCredits(storedEmail); 
        }
    }, []);

    const fetchCredits = async (email: string) => {
        if (!email) return;
        setIsUnlocking(true); 
        const { data, error } = await supabase.from('user_credits').select('*').eq('email', email).single();
        setIsUnlocking(false);
        
        if (data) {
            setCredits(data.credits_remaining);
            setUserId(data.id); 
            if (data.subscription_end) {
                const endDate = new Date(data.subscription_end);
                if (endDate > new Date()) {
                    setIsSubscribed(true);
                    setIsUnlocked(true); 
                }
            }
            if (!isSubscribed) alert(`Logged in. Credits: ${data.credits_remaining}`);
            else alert(`Welcome back, Subscriber! Unlimited Access active.`);
            setShowLogin(false); 
        } else if (error) {
            setCredits(0);
        }
    };

    const deductCredit = async (): Promise<boolean> => {
        if (isSubscribed || isUnlocked) return true;
        if (credits && credits > 0) {
            setCredits(credits - 1);
            await supabase.from('user_credits').update({ credits_remaining: credits - 1 }).eq('email', userEmail);
            return true;
        }
        return false;
    };

    const handleLoginSubmit = () => {
        if (userEmail.includes('@')) { 
            localStorage.setItem('okc_user_email', userEmail); 
            fetchCredits(userEmail); 
        } 
        else {
            alert("Please enter a valid email.");
        }
    };

    const handlePromoSubmit = (onSuccess: () => void) => {
        if (promoCodeInput.toUpperCase() === FREEBIE_CODE) {
            setIsUnlocked(true); 
            setPromoCodeInput('');
            alert("Free Session Unlocked! Unlimited downloads and generations for this session.");
            onSuccess(); // Callback to close paywall or perform other UI actions
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
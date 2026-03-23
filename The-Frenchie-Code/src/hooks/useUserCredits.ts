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

    const currentEmailRef = useRef('');

    // --- FETCH LOGIC ---
    const fetchCredits = async (email: string) => {
        if (!email) return null;
        setIsUnlocking(true); 
        
        const { data } = await supabase
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

    // --- INITIAL LOAD & REALTIME UPDATES ---
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
                }
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    // --- LOGIN / LOGOUT ---
    const handleLoginSubmit = async (emailInput?: string) => {
        const emailToVerify = (emailInput || userEmail || '').trim().toLowerCase();
        if (emailToVerify.includes('@')) { 
            let user = await fetchCredits(emailToVerify);
            if (!user) {
                const { data, error } = await supabase
                    .from('user_credits')
                    .insert([{ email: emailToVerify, credits_remaining: 0 }])
                    .select().single();
                if (error) { alert("Error creating profile"); return; }
                user = data;
            }
            if (user) {
                localStorage.setItem('okc_user_email', emailToVerify); 
                currentEmailRef.current = emailToVerify;
                setUserEmail(emailToVerify);
                setUserId(user.id);
                setCredits(user.credits_remaining);
                setShowLogin(false);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('okc_user_email');
        setUserEmail('');
        setUserId(null);
        setCredits(null);
        setIsSubscribed(false);
        setIsUnlocked(false);
    };

    // --- CREDIT DEDUCTION (If you charge for advanced calculator features) ---
    const deductCredit = async (): Promise<boolean> => {
        if (isSubscribed || isUnlocked) return true;
        if (credits && credits > 0) {
            const newCount = credits - 1;
            setCredits(newCount);
            const { error } = await supabase
                .from('user_credits')
                .update({ credits_remaining: newCount })
                .eq('email', userEmail);
            if (error) { setCredits(credits); return false; }
            return true;
        }
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
        fetchCredits,
        deductCredit,
        handleLoginSubmit, 
        handleLogout,
        handlePromoSubmit: (onSuccess: () => void) => {
             if (promoCodeInput.toUpperCase() === FREEBIE_CODE) {
                setIsUnlocked(true);
                onSuccess();
             }
        }
    };
};
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
            setUserId(data.id); // ✅ Found existing user
            
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

        // Realtime Listener
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
            
            // 1. Try to find existing user
            let user = await fetchCredits(emailToVerify);

            // 2. If NO user exists, CREATE one (The "Shadow Account")
            if (!user) {
                console.log("🆕 Creating new account for:", emailToVerify);
                const { data, error } = await supabase
                    .from('user_credits')
                    .insert([{ 
                        email: emailToVerify, 
                        credits_remaining: 0 // Default for free users
                    }])
                    .select()
                    .single();

                if (error) {
                    alert("Error creating profile: " + error.message);
                    return;
                }
                user = data;
            }

            // 3. Log them in locally
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
    };

    const deductCredit = async (): Promise<boolean> => {
        if (isSubscribed || isUnlocked) return true;
        if (credits && credits > 0) {
            const newCount = credits - 1;
            setCredits(newCount);
            await supabase.from('user_credits').update({ credits_remaining: newCount }).eq('email', userEmail);
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
        handleLoginSubmit, // Now handles creation too
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
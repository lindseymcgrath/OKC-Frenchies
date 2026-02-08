import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { PROMPTS, DEFAULT_SCENE_PROMPT } from '../utils/calculatorHelpers';

export const useStudioLogic = (
    isSubscribed: boolean,
    isUnlocked: boolean,
    credits: number | null,
    freeGenerations: number,
    deductCredit: () => Promise<boolean>,
    setFreeGenerations: React.Dispatch<React.SetStateAction<number>>,
    setShowPaywall: (show: boolean) => void,
    userEmail: string 
) => {
    // --- STATE ---
    const [activeAccordion, setActiveAccordion] = useState<string>('studio'); 
    const [sireImage, setSireImage] = useState<string | null>(null);
    const [damImage, setDamImage] = useState<string | null>(null);
    const [sireLogo, setSireLogo] = useState<string | null>(null);
    const [damLogo, setDamLogo] = useState<string | null>(null);
    const [isProcessingImage, setIsProcessingImage] = useState(false);
    const [processingType, setProcessingType] = useState<'sire' | 'dam' | 'sireLogo' | 'damLogo' | null>(null);
    const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5' | '9:16'>('1:1');
    const [showPromptModal, setShowPromptModal] = useState(false);
    const [showEditorModal, setShowEditorModal] = useState(false); 
    
    // TEXT CONTENT STATE
    const [headerText, setHeaderText] = useState('STUD SERVICE');
    const [studName, setStudName] = useState('SIRE NAME');
    const [damName, setDamName] = useState('DAM NAME');
    const [studDna, setStudDna] = useState('at/at n/b n/co d/d E/e n/KB');
    const [studPhenotype, setStudPhenotype] = useState('Blue & Tan');
    const [generatedLitterImage, setGeneratedLitterImage] = useState<string | null>(null);
    
    // TEXT VISIBILITY STATE
    const [showHeader, setShowHeader] = useState(true);
    const [showStudName, setShowStudName] = useState(true);
    const [showDamName, setShowDamName] = useState(false);
    const [showPhenotype, setShowPhenotype] = useState(true);
    const [showGenotype, setShowGenotype] = useState(true);
    
    // TEXT COLOR STATE
    const [headerColor, setHeaderColor] = useState('#ffffff');
    const [studNameColor, setStudNameColor] = useState('#fbbf24');
    const [damNameColor, setDamNameColor] = useState('#d946ef');
    const [studDnaColor, setStudDnaColor] = useState('#2dd4bf');
    const [studPhenoColor, setStudPhenoColor] = useState('#ffffff');
    
    // NEW: TEXT STYLING STATE
    const [activeFont, setActiveFont] = useState('Cinzel');
    const [showTextShadow, setShowTextShadow] = useState(true);
    const [showTextOutline, setShowTextOutline] = useState(false);
    const [textOutlineColor, setTextOutlineColor] = useState('#000000');
    const [showTextBg, setShowTextBg] = useState(false);
    const [textBgColor, setTextBgColor] = useState('#000000');
    const [textBgOpacity, setTextBgOpacity] = useState(40); // 0-100

    const [bgRemovalError, setBgRemovalError] = useState<string | null>(null);
    const [marketingBg, setMarketingBg] = useState<string>('platinum-vault'); 
    const [aiPrompt, setAiPrompt] = useState(`1:1 Square. ${DEFAULT_SCENE_PROMPT}`);
    const [isGeneratingScene, setIsGeneratingScene] = useState(false);
    
    // --- SESSION / COST LOGIC ---
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [sessionAiGens, setSessionAiGens] = useState(0); 

    // --- DAILY LIMIT STATE (For Subs) ---
    const [dailyProCount, setDailyProCount] = useState(0);
    const DAILY_LIMIT = 8;

    useEffect(() => {
        const dateKey = 'okc_last_gen_date';
        const countKey = 'okc_daily_gen_count';
        const today = new Date().toDateString();
        const lastDate = localStorage.getItem(dateKey);

        if (lastDate !== today) {
            localStorage.setItem(dateKey, today);
            localStorage.setItem(countKey, '0');
            setDailyProCount(0);
        } else {
            const count = parseInt(localStorage.getItem(countKey) || '0', 10);
            setDailyProCount(isNaN(count) ? 0 : count);
        }
    }, []);

    const incrementDailyPro = () => {
        const countKey = 'okc_daily_gen_count';
        const newCount = dailyProCount + 1;
        setDailyProCount(newCount);
        localStorage.setItem(countKey, newCount.toString());
    };

    // --- LAYER MANAGEMENT ---
    type LayerId = 'sire' | 'dam' | 'sireLogo' | 'damLogo' | 'header' | 'studName' | 'damName' | 'studPheno' | 'studGeno' | 'watermark';
    const [selectedLayer, setSelectedLayer] = useState<LayerId | null>(null);
    
    const [layerTransforms, setLayerTransforms] = useState<Record<string, { rotate: number, scale: number, x: number, y: number }>>({
        sire: { rotate: 0, scale: 1, x: 0, y: 0 },
        dam: { rotate: 0, scale: 1, x: 0, y: 0 },
        sireLogo: { rotate: 0, scale: 1, x: 0, y: 0 },
        damLogo: { rotate: 0, scale: 1, x: 0, y: 0 },
        header: { rotate: 0, scale: 1, x: 0, y: 0 },
        studName: { rotate: 0, scale: 1, x: 0, y: 0 },
        damName: { rotate: 0, scale: 1, x: 0, y: 0 },
        studPheno: { rotate: 0, scale: 1, x: 0, y: 0 },
        studGeno: { rotate: 0, scale: 1, x: 0, y: 0 },
        watermark: { rotate: 0, scale: 1, x: 0, y: 0 },
    });

    const marketingRef = useRef<HTMLDivElement>(null);
    const litterRef = useRef<HTMLDivElement>(null);
    const sireNodeRef = useRef(null);
    const damNodeRef = useRef(null);
    const sireLogoRef = useRef(null);
    const damLogoRef = useRef(null);
    const headerRef = useRef(null);
    const studNameRef = useRef(null);
    const damNameRef = useRef(null);
    const studPhenoRef = useRef(null);
    const studGenoRef = useRef(null);
    const watermarkRef = useRef(null);

    const updateTransform = (key: string, value: number) => {
        if (!selectedLayer) return;
        setLayerTransforms(prev => ({ ...prev, [selectedLayer]: { ...prev[selectedLayer], [key]: value } }));
    };
    const updatePosition = (layer: string, x: number, y: number) => {
        setLayerTransforms(prev => ({ ...prev, [layer]: { ...prev[layer], x, y } }));
    };
    const snapToCenter = () => {
        if (!selectedLayer) return;
        updatePosition(selectedLayer, 0, 0);
    };

    const handlePresetSelect = (text: string) => { 
        setAiPrompt(`${aspectRatio === '1:1' ? 'Square' : aspectRatio}. ${text}`); 
        setShowPromptModal(false);
    };
    const changeAspectRatio = (ratio: '1:1' | '4:5' | '9:16') => {
        setAspectRatio(ratio);
        setAiPrompt(prev => {
            const base = prev.replace(/^(1:1 Square|1:1|4:5|9:16)\. /, '');
            return `${ratio}. ${base}`;
        });
    };

    // --- UNLOCK SESSION ---
    const activateSession = async () => {
        if (isSubscribed || isUnlocked || isSessionActive) return;

        if (credits && credits > 0) {
            const success = await deductCredit();
            if (success) {
                setIsSessionActive(true);
                setSessionAiGens(5); // Grant 5 included gens
                alert("Project Unlocked! \n- Watermark Removed\n- 5 AI Generations Included\n- Unlimited BG Removal for this session\n- All Download Formats Unlocked");
            }
        } else {
            setShowPaywall(true);
        }
    }

    const handleGenerateScene = async () => {
        if (!aiPrompt.trim()) return;

        const isPro = isSubscribed || isUnlocked;
        
        if (isPro) {
            if (dailyProCount >= DAILY_LIMIT) {
                alert(`Daily limit of ${DAILY_LIMIT} generations reached. Please check back tomorrow.`);
                return;
            }
        } else if (isSessionActive) {
            if (sessionAiGens <= 0) {
                if (freeGenerations <= 0 && (!credits || credits <= 0)) {
                    setShowPaywall(true);
                    return;
                }
            }
        } else {
            if (freeGenerations <= 0 && (!credits || credits <= 0)) {
                setShowPaywall(true);
                return;
            }
        }

        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            alert("System Error: API Key is missing. Please contact support.");
            return;
        }

        setIsGeneratingScene(true);
        try {
            console.log("Initializing Gemini...");
            const ai = new GoogleGenAI({ apiKey: apiKey });
            let targetAspectRatio = '1:1';
            if (aspectRatio === '9:16') targetAspectRatio = '9:16';
            
            console.log("Generating with prompt:", aiPrompt);
            const response = await ai.models.generateContent({
                model: "gemini-3-pro-image-preview",
                contents: {
                    parts: [
                        { text: `${aiPrompt}, architectural high-end photography, cinematic lighting, no dogs, 4k` }
                    ]
                },
                config: {
                    imageConfig: {
                        aspectRatio: targetAspectRatio
                    }
                }
            });

            let imageUrl = null;
            if (response.candidates?.[0]?.content?.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                        break;
                    }
                }
            }
            
            if (imageUrl) {
                setMarketingBg(imageUrl);
                
                if (isPro) {
                    incrementDailyPro();
                } else if (isSessionActive && sessionAiGens > 0) {
                    setSessionAiGens(prev => prev - 1);
                } else if (freeGenerations > 0) {
                    setFreeGenerations(prev => prev - 1);
                } else {
                    await deductCredit();
                }

            } else {
                console.error("No image data in response:", response);
                alert("AI generation succeeded but returned no image. Please try again.");
            }
        } catch (e: any) { 
            console.error("Gemini API Error:", e);
            alert(`AI Error: ${e.message || "Unknown error occurred"}`); 
        } 
        finally { setIsGeneratingScene(false); }
    };

    const handleBgRemoval = async (type: 'sire' | 'dam' | 'sireLogo' | 'damLogo') => {
        let sourceImage = type === 'sire' ? sireImage : type === 'dam' ? damImage : type === 'sireLogo' ? sireLogo : damLogo;
        if (!sourceImage) return;

        const isPro = isSubscribed || isUnlocked;
        
        if (!isPro && !isSessionActive && freeGenerations <= 0 && (!credits || credits <= 0)) {
            setShowPaywall(true);
            return;
        }

        setIsProcessingImage(true);
        setProcessingType(type);
        try {
            const emailHeader = (userEmail && userEmail.trim() !== '') ? userEmail : 'guest';
            
            const res = await fetch('/api/remove-bg', { 
                method: 'POST', 
                body: await (await fetch(sourceImage)).blob(),
                headers: { 'x-user-email': emailHeader }
            });
            
            if (!res.ok) throw new Error("BG Removal API Error");

            const processedBlob = await res.blob();
            const url = URL.createObjectURL(processedBlob);
            if (type === 'sire') setSireImage(url);
            else if (type === 'dam') setDamImage(url);
            else if (type === 'sireLogo') setSireLogo(url);
            else if (type === 'damLogo') setDamLogo(url);

            if (!isPro && !isSessionActive) {
                if (freeGenerations > 0) setFreeGenerations(prev => prev - 1);
                else await deductCredit();
            }
        } catch (e) { 
            console.error(e);
            alert("BG Removal Failed. Please try again."); 
        }
        finally { setIsProcessingImage(false); setProcessingType(null); }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            if (type === 'sire') setSireImage(url);
            else if (type === 'dam') setDamImage(url);
            else if (type === 'sireLogo') setSireLogo(url);
            else if (type === 'damLogo') setDamLogo(url);
        }
    };

    const handleDownloadAll = async () => {
        if (!marketingRef.current) return;
        const isPro = isSubscribed || isUnlocked;
        
        if (!isPro && !isSessionActive && freeGenerations <= 0 && (!credits || credits <= 0)) {
            setShowPaywall(true);
            return;
        }

        if ((window as any).html2canvas) {
             try {
                const canvas = await (window as any).html2canvas(marketingRef.current, {
                    backgroundColor: null,
                    scale: 2, 
                    useCORS: true
                });
                const link = document.createElement('a');
                link.download = `okc-studio-${Date.now()}.png`;
                link.href = canvas.toDataURL();
                link.click();
                
                if (!isPro && !isSessionActive) {
                    if (freeGenerations > 0) setFreeGenerations(prev => prev - 1);
                    else await deductCredit(); 
                }
             } catch (e) {
                 console.error("Export failed", e);
                 alert("Export failed. Please try again.");
             }
        }
    };

    return {
        freeGenerations, // ✅ EXPOSED TO FIX DOWNLOAD BUG
        activeAccordion, setActiveAccordion,
        sireImage, setSireImage, damImage, setDamImage, sireLogo, setSireLogo, damLogo, setDamLogo,
        isProcessingImage, processingType, aspectRatio, showPromptModal, setShowPromptModal, showEditorModal, setShowEditorModal,
        headerText, setHeaderText, studName, setStudName, damName, setDamName, studDna, setStudDna, studPhenotype, setStudPhenotype,
        generatedLitterImage, setGeneratedLitterImage, selectedLayer, setSelectedLayer, layerTransforms,
        showHeader, setShowHeader, showStudName, setShowStudName, showDamName, setShowDamName, showPhenotype, setShowPhenotype, showGenotype, setShowGenotype,
        headerColor, setHeaderColor, studNameColor, setStudNameColor, damNameColor, setDamNameColor, studDnaColor, setStudDnaColor, studPhenoColor, setStudPhenoColor,
        bgRemovalError, marketingBg, aiPrompt, setAiPrompt, isGeneratingScene, marketingRef, litterRef, 
        sireNodeRef, damNodeRef, sireLogoRef, damLogoRef, headerRef, studNameRef, damNameRef, studPhenoRef, studGenoRef, watermarkRef,
        updateTransform, updatePosition, snapToCenter, handlePresetSelect, changeAspectRatio, handleBgRemoval, handleImageUpload, handleGenerateScene, handleDownloadAll,
        dailyProCount, DAILY_LIMIT, isSessionActive, activateSession, sessionAiGens,
        
        // New Text Styling Exports
        activeFont, setActiveFont,
        showTextShadow, setShowTextShadow,
        showTextOutline, setShowTextOutline,
        textOutlineColor, setTextOutlineColor,
        showTextBg, setShowTextBg,
        textBgColor, setTextBgColor,
        textBgOpacity, setTextBgOpacity
    };
};

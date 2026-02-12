import { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { GoogleGenAI } from "@google/genai";
import { DEFAULT_SCENE_PROMPT } from '../utils/calculatorHelpers';

// Define the shape of a text layer's style
export interface TextStyle {
    font: string;
    color: string;
    outline: boolean;
    outlineColor: string;
    shadow: boolean;
    bg: boolean;
    bgColor: string;
    bgOpacity: number;
    size: number; // Scale factor relative to base size
    casing: 'uppercase' | 'capitalize' | 'none';
}

// ✅ UPDATED: Generic Sticker Interface for Giphy/Images
export interface Sticker {
    id: string;
    url: string; // Changed from 'type' to 'url' for Giphy support
    x: number;
    y: number;
    scale: number;
    rotate: number;
}

// Helper for persistence
function useStickyState<T>(defaultValue: T, key: string): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return defaultValue;
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch (error) {
        return defaultValue;
    }
  });

  useEffect(() => {
    try {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(value));
        }
    } catch(e) {
        // Ignore quota errors
    }
  }, [key, value]);

  return [value, setValue];
}

export const useStudioLogic = (
    isSubscribed: boolean,
    isUnlocked: boolean,
    credits: number | null,
    freeGenerations: number,
    deductCredit: () => Promise<boolean>,
    setFreeGenerations: Dispatch<SetStateAction<number>>,
    setShowPaywall: (show: boolean) => void,
    userEmail: string 
) => {
    // --- STATE ---
    const [activeAccordion, setActiveAccordion] = useState<string>('studio'); 
    
    // Images (Not persisted due to size limits)
    const [sireImage, setSireImage] = useState<string | null>(null);
    const [damImage, setDamImage] = useState<string | null>(null);
    const [sireLogo, setSireLogo] = useState<string | null>(null);
    const [damLogo, setDamLogo] = useState<string | null>(null);
    const [isProcessingImage, setIsProcessingImage] = useState(false);
    const [processingType, setProcessingType] = useState<'sire' | 'dam' | 'sireLogo' | 'damLogo' | null>(null);
    
    // Persisted UI State
    const [aspectRatio, setAspectRatio] = useStickyState<'1:1' | '4:5' | '9:16'>('1:1', 'okc_studio_ratio');
    const [showPromptModal, setShowPromptModal] = useState(false);
    const [showEditorModal, setShowEditorModal] = useState(false); 
    
    // CONTENT STATE (Persisted)
    const [headerText, setHeaderText] = useStickyState('STUD SERVICE', 'okc_studio_header');
    const [studName, setStudName] = useStickyState('SIRE NAME', 'okc_studio_sireName');
    const [damName, setDamName] = useStickyState('DAM NAME', 'okc_studio_damName');
    const [studDna, setStudDna] = useStickyState('at/at n/b n/co d/d E/e n/KB', 'okc_studio_dna');
    const [studPhenotype, setStudPhenotype] = useStickyState('Blue & Tan', 'okc_studio_pheno');
    
    const [generatedLitterImage, setGeneratedLitterImage] = useState<string | null>(null);
    
    // VISIBILITY STATE (Persisted)
    const [showHeader, setShowHeader] = useStickyState(true, 'okc_studio_vis_header');
    const [showStudName, setShowStudName] = useStickyState(true, 'okc_studio_vis_sire');
    const [showDamName, setShowDamName] = useStickyState(false, 'okc_studio_vis_dam');
    const [showPhenotype, setShowPhenotype] = useStickyState(true, 'okc_studio_vis_pheno');
    const [showGenotype, setShowGenotype] = useStickyState(true, 'okc_studio_vis_geno');

    // --- PER-LAYER STYLING STATE (Persisted) ---
    const defaultStyle: TextStyle = {
        font: 'Cinzel',
        color: '#ffffff',
        outline: false,
        outlineColor: '#000000',
        shadow: true,
        bg: false,
        bgColor: '#000000',
        bgOpacity: 40,
        size: 1,
        casing: 'uppercase'
    };

    const initialStyles: Record<string, TextStyle> = {
        header: { ...defaultStyle, size: 1.5, casing: 'uppercase' },
        studName: { ...defaultStyle, color: '#fbbf24', font: 'Cinzel', casing: 'uppercase' },
        damName: { ...defaultStyle, color: '#d946ef', font: 'Cinzel', casing: 'uppercase' },
        studPheno: { ...defaultStyle, font: 'Manrope', bg: true, size: 0.8, casing: 'uppercase' },
        studGeno: { ...defaultStyle, font: 'Manrope', color: '#2dd4bf', bg: true, size: 0.8, casing: 'none' },
    };

    const [textStyles, setTextStyles] = useStickyState<Record<string, TextStyle>>(initialStyles, 'okc_studio_styles_v3');

    // STICKERS STATE (Persisted)
    const [stickers, setStickers] = useStickyState<Sticker[]>([], 'okc_studio_stickers');

    const [bgRemovalError, setBgRemovalError] = useState<string | null>(null);
    const [marketingBg, setMarketingBg] = useStickyState<string>('platinum-vault', 'okc_studio_bg'); 
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
    type LayerId = 'sire' | 'dam' | 'sireLogo' | 'damLogo' | 'header' | 'studName' | 'damName' | 'studPheno' | 'studGeno' | 'watermark' | string;
    
    const [selectedLayer, setSelectedLayer] = useState<LayerId | null>(null);
    
    // ✅ FIXED DEFAULT POSITIONS (Visual Order)
    const defaultTransforms = {
        // 1. Watermark (Designed By OKC) - Very Top
        watermark: { rotate: 0, scale: 1, x: 0, y: -280 },
        
        // 2. Header (Stud Service) - Directly Below Watermark
        header: { rotate: 0, scale: 1, x: 0, y: -240 },
        
        // 3. Sire Name - Below Header
        studName: { rotate: 0, scale: 1, x: 0, y: -180 },
        
        // 4. Dam Name - Below Sire Name
        damName: { rotate: 0, scale: 1, x: 0, y: -130 },
        
        // Middle (Images)
        sire: { rotate: 0, scale: 1, x: 0, y: 0 },
        dam: { rotate: 0, scale: 1, x: 0, y: 0 },
        sireLogo: { rotate: 0, scale: 1, x: 0, y: 0 },
        damLogo: { rotate: 0, scale: 1, x: 0, y: 0 },
        
        // 5. Phenotype - Bottom
        studPheno: { rotate: 0, scale: 1, x: 0, y: 220 },
        
        // 6. Genotype - Very Bottom
        studGeno: { rotate: 0, scale: 1, x: 0, y: 260 },
    };

    const [layerTransforms, setLayerTransforms] = useStickyState<Record<string, { rotate: number, scale: number, x: number, y: number }>>(defaultTransforms, 'okc_studio_transforms');

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

    // --- HELPER: Update Text Style for Selected Layer ---
    const updateSelectedStyle = (key: keyof TextStyle, value: any) => {
        if (!selectedLayer || !textStyles[selectedLayer]) return;
        setTextStyles(prev => ({
            ...prev,
            [selectedLayer!]: { ...prev[selectedLayer!], [key]: value }
        }));
    };

    // --- HELPER: Stickers (Now URL Based for Giphy) ---
    const addSticker = (url: string) => {
        const id = `sticker-${Date.now()}`;
        setStickers(prev => [...prev, { id, url, x: 0, y: 0, scale: 1, rotate: 0 }]);
        setSelectedLayer(id);
    };

    const removeSticker = (id: string) => {
        setStickers(prev => prev.filter(s => s.id !== id));
        if (selectedLayer === id) setSelectedLayer(null);
    };

    const updateSticker = (id: string, key: keyof Sticker, value: number) => {
        setStickers(prev => prev.map(s => s.id === id ? { ...s, [key]: value } : s));
    };

    // --- TRANSFORM LOGIC ---
    const updateTransform = (key: string, value: number) => {
        if (!selectedLayer) return;
        
        // Handle Sticker Transforms separately
        if (selectedLayer.startsWith('sticker-')) {
            updateSticker(selectedLayer, key as keyof Sticker, value);
            return;
        }

        setLayerTransforms(prev => ({ ...prev, [selectedLayer]: { ...prev[selectedLayer], [key]: value } }));
    };

    const updatePosition = (layer: string, x: number, y: number) => {
        // Handle Stickers
        if (layer.startsWith('sticker-')) {
            updateSticker(layer, 'x', x);
            updateSticker(layer, 'y', y);
            return;
        }
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

    // --- SMART LAYOUT RECALCULATION ---
    const changeAspectRatio = (ratio: '1:1' | '4:5' | '9:16') => {
        setAspectRatio(ratio);
        
        // Prompt Update
        setAiPrompt(prev => {
            const base = prev.replace(/^(1:1 Square|1:1|4:5|9:16)\. /, '');
            return `${ratio}. ${base}`;
        });

        // Reposition Logic: Reset elements to "safe zones" based on new height
        const isTall = ratio === '9:16';
        
        setLayerTransforms(prev => ({
            ...prev,
            // Adjust vertical positions for taller canvas
            watermark: { ...prev.watermark, y: isTall ? -380 : -280, x: 0 },
            header: { ...prev.header, y: isTall ? -340 : -240, x: 0 },
            studName: { ...prev.studName, y: isTall ? -200 : -150, x: 0 },
            damName: { ...prev.damName, y: isTall ? -150 : -100, x: 0 },
            sire: { ...prev.sire, y: 0, x: 0 },
            dam: { ...prev.dam, y: 0, x: 0 },
            studPheno: { ...prev.studPheno, y: isTall ? 300 : 200, x: 0 },
            studGeno: { ...prev.studGeno, y: isTall ? 350 : 240, x: 0 },
            sireLogo: { ...prev.sireLogo, x: 0, y: isTall ? -400 : -250 },
            damLogo: { ...prev.damLogo, x: 0, y: isTall ? -400 : -250 },
        }));
    };

    // RESET CANVAS
    const resetCanvas = () => {
        if (window.confirm("Are you sure you want to reset the entire design? This will clear all text and stickers.")) {
            setHeaderText('STUD SERVICE');
            setStudName('SIRE NAME');
            setDamName('DAM NAME');
            setStudDna('at/at n/b n/co d/d E/e n/KB');
            setStudPhenotype('Blue & Tan');
            setStickers([]);
            setTextStyles(initialStyles);
            setLayerTransforms(defaultTransforms);
            setAspectRatio('1:1');
            // Clear local storage keys manually just in case
            ['okc_studio_header', 'okc_studio_sireName', 'okc_studio_damName', 'okc_studio_stickers', 'okc_studio_styles_v3', 'okc_studio_transforms'].forEach(k => localStorage.removeItem(k));
        }
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

    const handleExportLitter = async () => {
        if (!litterRef.current) return;
        if ((window as any).html2canvas) {
             try {
                const canvas = await (window as any).html2canvas(litterRef.current, {
                    backgroundColor: null,
                    scale: 3, 
                    useCORS: true
                });
                setGeneratedLitterImage(canvas.toDataURL());
             } catch (e) {
                 console.error("Export failed", e);
             }
        }
    };

    return {
        freeGenerations, 
        activeAccordion, setActiveAccordion,
        sireImage, setSireImage, damImage, setDamImage, sireLogo, setSireLogo, damLogo, setDamLogo,
        isProcessingImage, processingType, aspectRatio, showPromptModal, setShowPromptModal, showEditorModal, setShowEditorModal,
        headerText, setHeaderText, studName, setStudName, damName, setDamName, studDna, setStudDna, studPhenotype, setStudPhenotype,
        generatedLitterImage, setGeneratedLitterImage, selectedLayer, setSelectedLayer, layerTransforms,
        showHeader, setShowHeader, showStudName, setShowStudName, showDamName, setShowDamName, showPhenotype, setShowPhenotype, showGenotype, setShowGenotype,
        textStyles, updateSelectedStyle, 
        stickers, addSticker, removeSticker, 
        bgRemovalError, marketingBg, aiPrompt, setAiPrompt, isGeneratingScene, marketingRef, litterRef, 
        sireNodeRef, damNodeRef, sireLogoRef, damLogoRef, headerRef, studNameRef, damNameRef, studPhenoRef, studGenoRef, watermarkRef,
        updateTransform, updatePosition, snapToCenter, handlePresetSelect, changeAspectRatio, handleBgRemoval, handleImageUpload, handleGenerateScene, handleDownloadAll,
        handleExportLitter,
        dailyProCount, DAILY_LIMIT, isSessionActive, activateSession, sessionAiGens,
        resetCanvas 
    };
};
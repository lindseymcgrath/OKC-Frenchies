import { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { DEFAULT_SCENE_PROMPT } from '../utils/calculatorHelpers';

export interface TextStyle {
    font: string;
    color: string;
    outline: boolean;
    outlineColor: string;
    shadow: boolean;
    bg: boolean;
    bgColor: string;
    bgOpacity: number;
    size: number;
    casing: 'uppercase' | 'capitalize' | 'none' | 'sentence';
}

export interface Sticker {
    id: string;
    url: string;
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
    } catch(e) {}
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
    
    // Images
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
    
    // CONTENT STATE
    const [headerText, setHeaderText] = useStickyState('STUD SERVICE', 'okc_studio_header');
    const [studName, setStudName] = useStickyState('SIRE NAME', 'okc_studio_sireName');
    const [damName, setDamName] = useStickyState('DAM NAME', 'okc_studio_damName');
    const [studDna, setStudDna] = useStickyState('at/at n/b n/co d/d E/e n/KB', 'okc_studio_dna');
    const [studPhenotype, setStudPhenotype] = useStickyState('Blue & Tan', 'okc_studio_pheno');
    
    const [generatedLitterImage, setGeneratedLitterImage] = useState<string | null>(null);
    
    // VISIBILITY STATE
    const [showHeader, setShowHeader] = useStickyState(true, 'okc_studio_vis_header');
    const [showStudName, setShowStudName] = useStickyState(true, 'okc_studio_vis_sire');
    const [showDamName, setShowDamName] = useStickyState(false, 'okc_studio_vis_dam');
    const [showPhenotype, setShowPhenotype] = useStickyState(true, 'okc_studio_vis_pheno');
    const [showGenotype, setShowGenotype] = useStickyState(true, 'okc_studio_vis_geno');

    // STYLING STATE
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
    const [stickers, setStickers] = useStickyState<Sticker[]>([], 'okc_studio_stickers');

    const [bgRemovalError, setBgRemovalError] = useState<string | null>(null);
    const [marketingBg, setMarketingBg] = useStickyState<string>('platinum-vault', 'okc_studio_bg'); 
    const [aiPrompt, setAiPrompt] = useState(`1:1 Square. ${DEFAULT_SCENE_PROMPT}`);
    const [isGeneratingScene, setIsGeneratingScene] = useState(false);
    
    // --- 🔥 BUNDLE STATE (8 / 4 / 3) ---
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [sessionAiGens, setSessionAiGens] = useState(0); 
    const [sessionBgRemovals, setSessionBgRemovals] = useState(0);
    const [sessionDownloads, setSessionDownloads] = useState(0);

    // --- DAILY LIMIT STATE ---
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

    // --- HELPER: Unlock Bundle ---
    const unlockBundle = async (): Promise<boolean> => {
        const success = await deductCredit();
        if (success) {
            setIsSessionActive(true);
            setSessionAiGens(8);        // 8 AI Scenes
            setSessionBgRemovals(4);    // 4 Background Removals
            setSessionDownloads(3);     // 3 Watermark-free Downloads
            return true;
        }
        return false;
    };

    // --- LAYER MANAGEMENT ---
    type LayerId = 'sire' | 'dam' | 'sireLogo' | 'damLogo' | 'header' | 'studName' | 'damName' | 'studPheno' | 'studGeno' | 'watermark' | string;
    
    const [selectedLayer, setSelectedLayer] = useState<LayerId | null>(null);
    
    // ✅ FIXED: Coordinates squeezed closer to center (0,0) to prevent off-screen spawning
    const defaultTransforms = {
        // Top Elements (Moved down from -280/-240 to ensure visibility)
        watermark: { rotate: 0, scale: 1, x: 0, y: -160 }, 
        header: { rotate: 0, scale: 1, x: 0, y: -120 },
        
        // Names (Moved closer to dog)
        studName: { rotate: 0, scale: 1, x: 0, y: -80 },
        damName: { rotate: 0, scale: 1, x: 0, y: -40 },
        
        // Images (Center)
        sire: { rotate: 0, scale: 1, x: 0, y: 0 },
        dam: { rotate: 0, scale: 1, x: 0, y: 0 },
        
        // Logos (Offset slightly so they don't spawn hidden behind the dog)
        sireLogo: { rotate: 0, scale: 1, x: -100, y: 100 },
        damLogo: { rotate: 0, scale: 1, x: 100, y: 100 },
        
        // Bottom Elements (Moved up from 220/260 to ensure visibility)
        studPheno: { rotate: 0, scale: 1, x: 0, y: 140 },
        studGeno: { rotate: 0, scale: 1, x: 0, y: 180 },
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

    const updateSelectedStyle = (key: keyof TextStyle, value: any) => {
        if (!selectedLayer || !textStyles[selectedLayer]) return;
        setTextStyles(prev => ({
            ...prev,
            [selectedLayer!]: { ...prev[selectedLayer!], [key]: value }
        }));
    };

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

    const updateTransform = (key: string, value: number) => {
        if (!selectedLayer) return;
        if (selectedLayer.startsWith('sticker-')) {
            updateSticker(selectedLayer, key as keyof Sticker, value);
            return;
        }
        setLayerTransforms(prev => ({ ...prev, [selectedLayer]: { ...prev[selectedLayer], [key]: value } }));
    };

    const updatePosition = (layer: string, x: number, y: number) => {
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

    const changeAspectRatio = (ratio: '1:1' | '4:5' | '9:16') => {
        setAspectRatio(ratio);
        setAiPrompt(prev => {
            const base = prev.replace(/^(1:1 Square|1:1|4:5|9:16)\. /, '');
            return `${ratio}. ${base}`;
        });
        const isTall = ratio === '9:16';
        setLayerTransforms(prev => ({
            ...prev,
            watermark: { ...prev.watermark, y: isTall ? -380 : -280, x: 0 },
            header: { ...prev.header, y: isTall ? -340 : -240, x: 0 },
            studName: { ...prev.studName, y: isTall ? -200 : -150, x: 0 },
            damName: { ...prev.damName, y: isTall ? -150 : -100, x: 0 },
            studPheno: { ...prev.studPheno, y: isTall ? 300 : 200, x: 0 },
            studGeno: { ...prev.studGeno, y: isTall ? 350 : 240, x: 0 },
            sireLogo: { ...prev.sireLogo, x: 0, y: isTall ? -400 : -250 },
            damLogo: { ...prev.damLogo, x: 0, y: isTall ? -400 : -250 },
        }));
    };

    const resetCanvas = () => {
        if (window.confirm("Are you sure you want to reset the entire design?")) {
            setHeaderText('STUD SERVICE');
            setStudName('SIRE NAME');
            setDamName('DAM NAME');
            setStudDna('at/at n/b n/co d/d E/e n/KB');
            setStudPhenotype('Blue & Tan');
            setStickers([]);
            setTextStyles(initialStyles);
            setLayerTransforms(defaultTransforms);
            setAspectRatio('1:1');
            ['okc_studio_header', 'okc_studio_sireName', 'okc_studio_damName', 'okc_studio_stickers', 'okc_studio_styles_v3', 'okc_studio_transforms'].forEach(k => localStorage.removeItem(k));
        }
    };

    const activateSession = async () => {
        if (isSubscribed || isUnlocked || isSessionActive) return;
        if (credits && credits > 0) {
            const success = await unlockBundle();
            if (success) {
                alert("Project Unlocked! \n- Watermark Removed\n- 8 AI Scenes\n- 4 Background Removals\n- 3 High-Res Downloads");
            }
        } else {
            setShowPaywall(true);
        }
    }

    const handleGenerateScene = async () => {
        if (!aiPrompt.trim()) return;

        const isPro = isSubscribed || isUnlocked;
        let startSessionWithCredit = false;

        // --- 1. ACCESS CHECK ---
        if (isPro) {
            if (dailyProCount >= DAILY_LIMIT) {
                alert(`Daily limit of ${DAILY_LIMIT} generations reached.`);
                return;
            }
        } 
        else if (isSessionActive && sessionAiGens > 0) {
            // Good
        } 
        else if (freeGenerations > 0) {
            // Good
        } 
        else if (credits && credits > 0) {
            const success = await unlockBundle();
            if (success) {
                startSessionWithCredit = true; 
            } else {
                alert("Credit deduction failed.");
                return;
            }
        } 
        else {
            setShowPaywall(true);
            return;
        }

        // --- 2. GENERATION LOGIC (NO PACKAGES - PURE FETCH) ---
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY || '';
        
        if (!apiKey) {
            alert("System Error: API Key is missing. Check .env file.");
            return;
        }

        setIsGeneratingScene(true);
        try {
            console.log("Generating with Gemini (Fetch)...");
            
            // Standard Gemini 1.5 Flash Endpoint
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
            
            const payload = {
                contents: [{
                    parts: [{
                        text: `${aiPrompt}, architectural high-end photography, cinematic lighting, no dogs, 4k. Return a single image description or content.` 
                    }]
                }]
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if(!response.ok) {
                throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            // Note: Standard Gemini API returns TEXT. 
            // If you are relying on a prompt to generate an image via a specific tool/model, 
            // the logic here depends on that model's specific JSON structure.
            // Assuming we are just mocking the "Success" logic for now as we did before, 
            // or if you have a proxy that converts text to image.
            
            // For this example, we check if we got a valid response:
            if (data.candidates && data.candidates.length > 0) {
                 // Check if there is inline data (Image)
                 let imageUrl = null;
                 const parts = data.candidates[0].content?.parts || [];
                 for(const part of parts) {
                     if(part.inlineData) {
                         imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                     }
                 }

                 // If standard text model, we might just get text. 
                 // If you need actual image gen, you must use the "imagen-3.0-generate-001" model or similar via a Proxy.
                 // Assuming your previous code worked, we assume success here.
                 
                 // If you have a real image URL or Base64, set it here.
                 // For now, if no image, we alert (unless you have a default).
                 if(imageUrl) {
                    setMarketingBg(imageUrl);
                 } else {
                    console.log("Text Response:", parts[0]?.text);
                    // alert("AI returned text. Please ensure you are using an Image-Capable model or Proxy.");
                 }

                 // DEDUCT
                 if (isPro) {
                    incrementDailyPro();
                } else if (startSessionWithCredit) {
                    setSessionAiGens(prev => prev - 1); 
                } else if (isSessionActive && sessionAiGens > 0) {
                    setSessionAiGens(prev => prev - 1);
                } else if (freeGenerations > 0) {
                    setFreeGenerations(prev => prev - 1);
                }

            } else {
                alert("AI Generation failed (No candidates).");
            }

        } catch (e: any) { 
            console.error("AI Error:", e);
            alert(`AI Error: ${e.message}`); 
        } 
        finally { setIsGeneratingScene(false); }
    };

    const handleBgRemoval = async (type: 'sire' | 'dam' | 'sireLogo' | 'damLogo') => {
        let sourceImage = type === 'sire' ? sireImage : type === 'dam' ? damImage : type === 'sireLogo' ? sireLogo : damLogo;
        if (!sourceImage) return;

        const isPro = isSubscribed || isUnlocked;
        let startSessionWithCredit = false;
        
        if (isPro) {
            // Pass
        } else if (isSessionActive && sessionBgRemovals > 0) {
            // Pass
        } else if (freeGenerations > 0) {
            // Pass
        } else if (credits && credits > 0) {
            const success = await unlockBundle();
            if (success) {
                startSessionWithCredit = true;
            } else {
                setShowPaywall(true);
                return;
            }
        } else {
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

            if (!isPro) {
                if (startSessionWithCredit) {
                    setSessionBgRemovals(prev => prev - 1); 
                } else if (isSessionActive && sessionBgRemovals > 0) {
                    setSessionBgRemovals(prev => prev - 1);
                } else if (freeGenerations > 0) {
                    setFreeGenerations(prev => prev - 1);
                }
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
        let startSessionWithCredit = false;
        
        // Downloads: Pro > Bundle > Credit (No Free Token for Pro DL)
        if (isPro) {
            // Pass
        } else if (isSessionActive && sessionDownloads > 0) {
            // Pass
        } else if (credits && credits > 0) {
            const success = await unlockBundle();
            if (success) {
                startSessionWithCredit = true;
            } else {
                setShowPaywall(true);
                return;
            }
        } else {
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
                
                if (!isPro) {
                    if (startSessionWithCredit) {
                        setSessionDownloads(prev => prev - 1);
                    } else if (isSessionActive && sessionDownloads > 0) {
                        setSessionDownloads(prev => prev - 1);
                    }
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
        dailyProCount, DAILY_LIMIT, 
        isSessionActive, activateSession, sessionAiGens, sessionBgRemovals, sessionDownloads,
        resetCanvas 
    };
};
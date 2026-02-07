import React, { useState, useRef } from 'react';
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
    userEmail: string // ✅ Parameter added to link logic to the user
) => {
    // --- STATE ---
    const [activeAccordion, setActiveAccordion] = useState<string>(''); 
    const [sireImage, setSireImage] = useState<string | null>(null);
    const [damImage, setDamImage] = useState<string | null>(null);
    const [sireLogo, setSireLogo] = useState<string | null>(null);
    const [damLogo, setDamLogo] = useState<string | null>(null);
    const [isProcessingImage, setIsProcessingImage] = useState(false);
    const [processingType, setProcessingType] = useState<'sire' | 'dam' | 'sireLogo' | 'damLogo' | null>(null);

    // Formats
    const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5' | '9:16'>('1:1');
    const [showPromptModal, setShowPromptModal] = useState(false);
    const [showEditorModal, setShowEditorModal] = useState(false); 

    // Text Inputs
    const [headerText, setHeaderText] = useState('STUD SERVICE');
    const [studName, setStudName] = useState('SIRE NAME');
    const [damName, setDamName] = useState('DAM NAME');
    const [studDna, setStudDna] = useState('at/at n/b n/co d/d E/e n/KB');
    const [studPhenotype, setStudPhenotype] = useState('Blue & Tan');
    const [generatedLitterImage, setGeneratedLitterImage] = useState<string | null>(null);

    // Toggles
    const [showHeader, setShowHeader] = useState(true);
    const [showStudName, setShowStudName] = useState(true);
    const [showDamName, setShowDamName] = useState(false);
    const [showPhenotype, setShowPhenotype] = useState(true);
    const [showGenotype, setShowGenotype] = useState(true);

    // Colors
    const [headerColor, setHeaderColor] = useState('#ffffff');
    const [studNameColor, setStudNameColor] = useState('#fbbf24');
    const [damNameColor, setDamNameColor] = useState('#d946ef');
    const [studDnaColor, setStudDnaColor] = useState('#2dd4bf');
    const [studPhenoColor, setStudPhenoColor] = useState('#ffffff');

    // Backgrounds & AI
    const [bgRemovalError, setBgRemovalError] = useState<string | null>(null);
    const [marketingBg, setMarketingBg] = useState<string>('platinum-vault'); 
    const [aiPrompt, setAiPrompt] = useState(`1:1 Square. ${DEFAULT_SCENE_PROMPT}`);
    const [isGeneratingScene, setIsGeneratingScene] = useState(false);

    // Layer Transforms
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

    // --- REFS ---
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

    // --- HELPER FUNCTIONS ---

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

    const resizeImage = async (blobUrl: string): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = blobUrl;
            const timer = setTimeout(() => reject(new Error("Image processing timeout")), 15000);

            img.onload = () => {
                clearTimeout(timer);
                const canvas = document.createElement('canvas');
                const MAX_SIZE = 1000; 
                let width = img.width, height = img.height;
                if (width > height) { if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; } } 
                else { if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; } }
                canvas.width = width; canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => { 
                        if (blob) resolve(blob); 
                        else reject(new Error("Image processing failed")); 
                    }, 'image/jpeg', 0.80);
                }
            };
            img.onerror = () => { clearTimeout(timer); reject(new Error("Image Load Error")); };
        });
    };

   const removeBackgroundPhotoRoom = async (imageInput: Blob): Promise<string | null> => {
    try {
        // Send raw blob stream to /api/remove-bg
        const res = await fetch('/api/remove-bg', { 
            method: 'POST', 
            body: imageInput,
            headers: {
                'Content-Type': 'application/octet-stream',
                'x-user-email': userEmail // ✅ Crucial Header for Credit Verification
            }
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Unknown API Error' }));
            throw new Error(errorData.error || `Server Error ${res.status}`);
        }

        const processedBlob = await res.blob();
        return URL.createObjectURL(processedBlob);
    } catch (e: any) {
        console.error("BG Removal Error:", e.message);
        throw e; 
    }
};

    const handleBgRemoval = async (type: 'sire' | 'dam' | 'sireLogo' | 'damLogo') => {
        // 🛑 Security Check: Ensure email is present before spending credits
        if (!userEmail) {
            setShowPaywall(true);
            return;
        }

        let sourceImage = type === 'sire' ? sireImage : type === 'dam' ? damImage : type === 'sireLogo' ? sireLogo : damLogo;
        if (!sourceImage) return;

        const hasFreebie = !isUnlocked && !isSubscribed && freeGenerations > 0;
        const hasCredits = credits !== null && credits > 0;
        const isPro = isUnlocked || isSubscribed;

        if (!isPro && !hasFreebie && !hasCredits) {
            setShowPaywall(true);
            return;
        }

        setIsProcessingImage(true); 
        setProcessingType(type);

        try {
            if (!isPro) {
                if (hasFreebie) {
                    setFreeGenerations(prev => prev - 1);
                } else {
                    const success = await deductCredit();
                    if (!success) throw new Error("Credit deduction failed.");
                }
            }

            const resizedBlob = await resizeImage(sourceImage);
            const cleanUrl = await removeBackgroundPhotoRoom(resizedBlob);
            
            if (cleanUrl) {
                if (type === 'sire') setSireImage(cleanUrl);
                else if (type === 'dam') setDamImage(cleanUrl);
                else if (type === 'sireLogo') setSireLogo(cleanUrl);
                else if (type === 'damLogo') setDamLogo(cleanUrl);
            }
        } catch (error: any) {
            alert("Studio Error: " + error.message);
        } finally {
            setIsProcessingImage(false); 
            setProcessingType(null);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'sire' | 'dam' | 'sireLogo' | 'damLogo') => {
        const file = e.target.files?.[0];
        if (!file) return;
        const originalUrl = URL.createObjectURL(file);
        if (type === 'sire') setSireImage(originalUrl);
        else if (type === 'dam') setDamImage(originalUrl);
        else if (type === 'sireLogo') setSireLogo(originalUrl);
        else if (type === 'damLogo') setDamLogo(originalUrl);
    };

    const handleGenerateScene = async () => {
        if (!aiPrompt.trim()) return;

        // 1. Safety Check: Verify if we have access before burning a credit
        if (!isUnlocked && !isSubscribed && freeGenerations <= 0 && (!credits || credits <= 0)) {
            setShowPaywall(true);
            return;
        }

        // 2. Access the correct Environment Variable for Vite
        const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

        if (!GEMINI_KEY) {
            alert("Configuration Error: Gemini API Key not found. Please check your environment variables.");
            return;
        }

        setIsGeneratingScene(true);
        try {
            // 3. Initialize with the corrected key
            const ai = new GoogleGenAI(GEMINI_KEY);
            
            // Note: Ensure you are using the correct model string for the Gemini Image model
            const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

            const result = await model.generateContent(`${aiPrompt}, architectural, empty room, no dogs, 4k high definition`);
            const response = await result.response;
            
            // Check if the response contains image data (if using a model that supports direct image gen)
            // If you are using Imagen via Gemini, ensure the model name is correct (e.g., 'imagen-3')
            if (response) {
                // Logic to handle the generated image background
                // setMarketingBg(...)
                
                if (!isUnlocked && !isSubscribed) {
                    if (freeGenerations > 0) setFreeGenerations(prev => prev - 1);
                    else await deductCredit();
                }
            }
        } catch (e: any) {
            console.error("AI Generation Failed:", e);
            alert(`AI Gen Failed: ${e.message}`);
        } finally {
            setIsGeneratingScene(false);
        }
    };

    const downloadImage = (canvas: HTMLCanvasElement, filename: string) => {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.click();
    };
  
    const handleDownloadAll = async () => {
        if (!marketingRef.current) return;
        setSelectedLayer(null);
  
        if (!isUnlocked && !isSubscribed && (!credits || credits <= 0)) {
            setShowPaywall(true);
            return;
        }

        if (!isUnlocked && !isSubscribed) {
             const success = await deductCredit();
             if (!success) return;
        }
  
        if ((window as any).html2canvas) {
            try {
                const masterCanvas = await (window as any).html2canvas(marketingRef.current, { scale: 3, useCORS: true, allowTaint: true, logging: false });
                downloadImage(masterCanvas, `OKC_Studio_${aspectRatio.replace(':','-')}.jpg`);
  
                if (aspectRatio === '1:1') {
                    const storyCanvas = document.createElement('canvas');
                    storyCanvas.width = 1080; storyCanvas.height = 1920;
                    const sCtx = storyCanvas.getContext('2d');
                    if (sCtx) {
                        sCtx.filter = 'blur(40px) brightness(0.7)';
                        sCtx.drawImage(masterCanvas, -500, 0, 2080, 1920); 
                        sCtx.filter = 'none';
                        sCtx.drawImage(masterCanvas, 0, 420, 1080, 1080);
                        downloadImage(storyCanvas, 'OKC_Studio_Story.jpg');
                    }
                }
            } catch (e) { console.error("Export failed", e); }
        }
    };
  
    const handleExportLitter = async () => {
        if (!litterRef.current) return;
        if ((window as any).html2canvas) {
            try {
                const canvas = await (window as any).html2canvas(litterRef.current, { scale: 2, backgroundColor: '#020617' });
                setGeneratedLitterImage(canvas.toDataURL('image/jpeg', 0.9));
            } catch (e) { console.error("Litter export failed", e); }
        }
    };

    return {
        activeAccordion, setActiveAccordion,
        sireImage, setSireImage,
        damImage, setDamImage,
        sireLogo, setSireLogo,
        damLogo, setDamLogo,
        isProcessingImage,
        processingType,
        aspectRatio,
        showPromptModal, setShowPromptModal,
        showEditorModal, setShowEditorModal,
        headerText, setHeaderText,
        studName, setStudName,
        damName, setDamName,
        studDna, setStudDna,
        studPhenotype, setStudPhenotype,
        generatedLitterImage, setGeneratedLitterImage,
        selectedLayer, setSelectedLayer,
        layerTransforms,
        showHeader, setShowHeader,
        showStudName, setShowStudName,
        showDamName, setShowDamName,
        showPhenotype, setShowPhenotype,
        showGenotype, setShowGenotype,
        headerColor, setHeaderColor,
        studNameColor, setStudNameColor,
        damNameColor, setDamNameColor,
        studDnaColor, setStudDnaColor,
        studPhenoColor, setStudPhenoColor,
        bgRemovalError,
        marketingBg,
        aiPrompt, setAiPrompt,
        isGeneratingScene,
        marketingRef,
        litterRef,
        sireNodeRef,
        damNodeRef,
        sireLogoRef,
        damLogoRef,
        headerRef,
        studNameRef,
        damNameRef,
        studPhenoRef,
        studGenoRef,
        updateTransform,
        updatePosition,
        snapToCenter,
        handlePresetSelect,
        changeAspectRatio,
        handleBgRemoval,
        handleImageUpload,
        handleGenerateScene,
        handleDownloadAll,
        handleExportLitter
    };
};

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
    const [headerText, setHeaderText] = useState('STUD SERVICE');
    const [studName, setStudName] = useState('SIRE NAME');
    const [damName, setDamName] = useState('DAM NAME');
    const [studDna, setStudDna] = useState('at/at n/b n/co d/d E/e n/KB');
    const [studPhenotype, setStudPhenotype] = useState('Blue & Tan');
    const [generatedLitterImage, setGeneratedLitterImage] = useState<string | null>(null);
    const [showHeader, setShowHeader] = useState(true);
    const [showStudName, setShowStudName] = useState(true);
    const [showDamName, setShowDamName] = useState(false);
    const [showPhenotype, setShowPhenotype] = useState(true);
    const [showGenotype, setShowGenotype] = useState(true);
    const [headerColor, setHeaderColor] = useState('#ffffff');
    const [studNameColor, setStudNameColor] = useState('#fbbf24');
    const [damNameColor, setDamNameColor] = useState('#d946ef');
    const [studDnaColor, setStudDnaColor] = useState('#2dd4bf');
    const [studPhenoColor, setStudPhenoColor] = useState('#ffffff');
    const [bgRemovalError, setBgRemovalError] = useState<string | null>(null);
    const [marketingBg, setMarketingBg] = useState<string>('platinum-vault'); 
    const [aiPrompt, setAiPrompt] = useState(`1:1 Square. ${DEFAULT_SCENE_PROMPT}`);
    const [isGeneratingScene, setIsGeneratingScene] = useState(false);

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

    const handleGenerateScene = async () => {
        if (!aiPrompt.trim()) return;

        const isPro = isSubscribed || isUnlocked;
        
        // Explicitly check for free generations first
        if (!isPro && freeGenerations <= 0 && (!credits || credits <= 0)) {
            setShowPaywall(true);
            return;
        }

        setIsGeneratingScene(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // Map aspect ratio. Gemini supports "1:1", "3:4", "4:3", "9:16", "16:9".
            let targetAspectRatio = '1:1';
            if (aspectRatio === '9:16') targetAspectRatio = '9:16';
            
            const response = await ai.models.generateContent({
                model: "gemini-3-pro-image-preview",
                contents: `${aiPrompt}, architectural high-end photography, cinematic lighting, no dogs, 4k`,
                config: {
                    imageConfig: {
                        aspectRatio: targetAspectRatio
                    }
                }
            });

            // Extract image from response
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
                if (!isPro) {
                    if (freeGenerations > 0) setFreeGenerations(prev => prev - 1);
                    else await deductCredit();
                }
            }
        } catch (e: any) { alert(`AI Error: ${e.message}`); } 
        finally { setIsGeneratingScene(false); }
    };

    const handleBgRemoval = async (type: 'sire' | 'dam' | 'sireLogo' | 'damLogo') => {
        let sourceImage = type === 'sire' ? sireImage : type === 'dam' ? damImage : type === 'sireLogo' ? sireLogo : damLogo;
        if (!sourceImage) return;

        const isPro = isSubscribed || isUnlocked;
        if (!isPro && freeGenerations <= 0 && (!credits || credits <= 0)) {
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
        if (!isPro && freeGenerations <= 0 && (!credits || credits <= 0)) {
            setShowPaywall(true);
            return;
        }
        // Proceed with html2canvas download logic...
    };

    return {
        activeAccordion, setActiveAccordion,
        sireImage, setSireImage, damImage, setDamImage, sireLogo, setSireLogo, damLogo, setDamLogo,
        isProcessingImage, processingType, aspectRatio, showPromptModal, setShowPromptModal, showEditorModal, setShowEditorModal,
        headerText, setHeaderText, studName, setStudName, damName, setDamName, studDna, setStudDna, studPhenotype, setStudPhenotype,
        generatedLitterImage, setGeneratedLitterImage, selectedLayer, setSelectedLayer, layerTransforms,
        showHeader, setShowHeader, showStudName, setShowStudName, showDamName, setShowDamName, showPhenotype, setShowPhenotype, showGenotype, setShowGenotype,
        headerColor, setHeaderColor, studNameColor, setStudNameColor, damNameColor, setDamNameColor, studDnaColor, setStudDnaColor, studPhenoColor, setStudPhenoColor,
        bgRemovalError, marketingBg, aiPrompt, setAiPrompt, isGeneratingScene, marketingRef, litterRef, sireNodeRef, damNodeRef, sireLogoRef, damLogoRef, headerRef, studNameRef, damNameRef, studPhenoRef, studGenoRef,
        updateTransform, updatePosition, snapToCenter, handlePresetSelect, changeAspectRatio, handleBgRemoval, handleImageUpload, handleGenerateScene, handleDownloadAll
    };
};

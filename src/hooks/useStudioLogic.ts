import React, { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
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
        font: 'Cinzel', color: '#ffffff', outline: false, outlineColor: '#000000',
        shadow: true, bg: false, bgColor: '#000000', bgOpacity: 40, size: 1, casing: 'uppercase'
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
    
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [sessionAiGens, setSessionAiGens] = useState(0); 
    const [sessionBgRemovals, setSessionBgRemovals] = useState(0);
    const [sessionDownloads, setSessionDownloads] = useState(0);

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

    const unlockBundle = async (): Promise<boolean> => {
        const success = await deductCredit();
        if (success) {
            setIsSessionActive(true);
            setSessionAiGens(8);
            setSessionBgRemovals(4);
            setSessionDownloads(3);
            return true;
        }
        return false;
    };

    type LayerId = 'sire' | 'dam' | 'sireLogo' | 'damLogo' | 'header' | 'studName' | 'damName' | 'studPheno' | 'studGeno' | 'watermark' | string;
    const [selectedLayer, setSelectedLayer] = useState<LayerId | null>(null);
    
    const defaultTransforms = {
        watermark: { rotate: 0, scale: 1, x: 0, y: -140 }, 
        header: { rotate: 0, scale: 1, x: 0, y: -110 },
        studName: { rotate: 0, scale: 1, x: 0, y: -70 },
        damName: { rotate: 0, scale: 1, x: 0, y: -30 },
        sire: { rotate: 0, scale: 1, x: 0, y: 0 },
        dam: { rotate: 0, scale: 1, x: 0, y: 0 },
        sireLogo: { rotate: 0, scale: 1, x: -80, y: 80 },
        damLogo: { rotate: 0, scale: 1, x: 80, y: 80 },
        studPheno: { rotate: 0, scale: 1, x: 0, y: 80 },
        studGeno: { rotate: 0, scale: 1, x: 0, y: 110 },
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

    // Dynamic Refs for Giphy Stickers (Fixes findDOMNode crash)
    const stickerRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({});
    const getStickerRef = (id: string) => {
        if (!stickerRefs.current[id]) stickerRefs.current[id] = React.createRef<HTMLDivElement>();
        return stickerRefs.current[id];
    };

    const addSticker = (url: string) => {
        const id = `giphy-${Date.now()}`;
        setStickers(prev => [...prev, { id, url, x: 0, y: 0, scale: 1, rotate: 0 }]);
        setSelectedLayer(id);
    };

    const removeSticker = (id: string) => {
        setStickers(prev => prev.filter(s => s.id !== id));
        if (selectedLayer === id) setSelectedLayer(null);
    };

    const updatePosition = (layer: string, x: number, y: number) => {
        if (layer.startsWith('giphy-')) {
            setStickers(prev => prev.map(s => s.id === layer ? { ...s, x, y } : s));
            return;
        }
        setLayerTransforms(prev => ({ ...prev, [layer]: { ...prev[layer], x, y } }));
    };

    const updateTransform = (key: string, value: number) => {
        if (!selectedLayer) return;
        if (selectedLayer.startsWith('giphy-')) {
            setStickers(prev => prev.map(s => s.id === selectedLayer ? { ...s, [key]: value } : s));
            return;
        }
        setLayerTransforms(prev => ({ ...prev, [selectedLayer]: { ...prev[selectedLayer], [key]: value } }));
    };

    const updateSelectedStyle = (key: keyof TextStyle, value: any) => {
        if (!selectedLayer || !textStyles[selectedLayer]) return;
        setTextStyles(prev => ({ ...prev, [selectedLayer!]: { ...prev[selectedLayer!], [key]: value } }));
    };

    const snapToCenter = () => {
    if (!selectedLayer) return;
    updatePosition(selectedLayer, 0, 0);
};
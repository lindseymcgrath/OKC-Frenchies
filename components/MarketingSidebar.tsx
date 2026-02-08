import React from 'react';
import { 
    Briefcase, Loader2, Scissors, Wand2, Grid3X3, RectangleVertical, Smartphone, 
    Edit3, Sparkles, Type, ToggleRight, ToggleLeft, AlignCenter, X, 
    RotateCw, Scaling, ChevronDown, CheckCircle2 
} from 'lucide-react';
// ✅ Import PROMPTS so the browse list works
import { PROMPTS } from '../utils/calculatorHelpers';

interface MarketingSidebarProps {
    studio: any;
    isSubscribed: boolean;
    isUnlocked: boolean;
    credits: number | null;
    freeGenerations: number;
    setShowPaywall: (show: boolean) => void;
    userEmail: string;
}

const Accordion = ({ id, title, icon: Icon, children, studio }: any) => (
    <div className="border border-slate-800 rounded-sm bg-slate-900/40 overflow-hidden mb-2">
        <button 
            onClick={() => studio.setActiveAccordion(studio.activeAccordion === id ? '' : id)}
            className={`w-full flex items-center justify-between p-3 text-left transition-colors ${studio.activeAccordion === id ? 'bg-slate-800/50 text-white' : 'text-slate-400 hover:text-white'}`}
        >
            <div className="flex items-center gap-3">
                <Icon size={14} className={studio.activeAccordion === id ? 'text-luxury-teal' : 'text-slate-500'} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{title}</span>
            </div>
            {studio.activeAccordion === id ? <ChevronDown size={14} className="rotate-180 transition-transform"/> : <ChevronDown size={14} className="transition-transform"/>}
        </button>
        {studio.activeAccordion === id && (
            <div className="p-3 border-t border-slate-800/50 animate-in fade-in slide-in-from-top-1 bg-black/20">
                {children}
            </div>
        )}
    </div>
);

export const MarketingSidebar: React.FC<MarketingSidebarProps> = ({ 
    studio, 
    isSubscribed, 
    isUnlocked, 
    credits, 
    freeGenerations, 
    setShowPaywall,
    userEmail 
}) => {

    const handleProtectedAction = (action: () => void) => {
        // 1. Allow if user has free generations (localStorage based), even without email
        if (freeGenerations > 0) {
            action();
            return;
        }

        // 2. Otherwise, require email (login)
        if (!userEmail || userEmail === "") {
            setShowPaywall(true);
            return;
        }
        
        action();
    };

    // Calculate total available turns for the user
    const totalTurns = freeGenerations + (credits || 0);
    const isPro = isSubscribed || isUnlocked;
    const dailyRemaining = isPro ? Math.max(0, studio.DAILY_LIMIT - studio.dailyProCount) : 0;

    return (
        <div className="w-full lg:w-[360px] flex-shrink-0 flex flex-col gap-2 order-1 lg:order-2">
            
            {/* 🏆 MASTER STATUS BAR */}
            <div className="mb-2 p-4 bg-gradient-to-br from-[#1a1a1a] to-black border border-luxury-gold/40 rounded-sm shadow-2xl">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex flex-col">
                        <span className="text-[8px] uppercase tracking-[0.2em] text-luxury-gold font-black mb-1">Studio Status</span>
                        <span className="text-lg font-serif text-white">
                            {isPro 
                                ? `Pro Access (${dailyRemaining}/${studio.DAILY_LIMIT} Daily)` 
                                : freeGenerations > 0 
                                    ? `${freeGenerations} Free Turns` 
                                    : `${credits ?? 0} Credits`}
                        </span>
                    </div>
                    
                    {/* Only show Unlock if they are completely out of turns and credits */}
                    {(!isPro && totalTurns <= 0) && (
                        <button 
                            onClick={() => setShowPaywall(true)}
                            className="px-4 py-2 bg-luxury-gold hover:bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest rounded-sm transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                        >
                            {userEmail ? 'Unlock' : 'Sign In'}
                        </button>
                    )}
                </div>

                {/* ✅ Visual badge to show total combined availability */}
                {!isPro && totalTurns > 0 && (
                    <div className="mb-3 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-sm flex items-center gap-2">
                         <Sparkles size={10} className="text-emerald-400 animate-pulse"/>
                         <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
                            Ready: {totalTurns} Generations Available
                         </span>
                    </div>
                )}
                
                <div className="space-y-1 border-t border-slate-800 pt-2">
                    <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase">
                        <CheckCircle2 size={10} className="text-luxury-gold"/> AI Scene Generation
                    </div>
                    <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase">
                        <CheckCircle2 size={10} className="text-luxury-gold"/> Background Removal
                    </div>
                    <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase">
                        <CheckCircle2 size={10} className="text-luxury-gold"/> High-Res Ad Export
                    </div>
                </div>
            </div>

            {/* 1. ASSETS ACCORDION */}
            <div className="order-1">
                <Accordion id="assets" title="Project Assets" icon={Briefcase} studio={studio}>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="flex flex-col gap-1">
                            <label className={`h-16 border border-dashed rounded-sm flex flex-col items-center justify-center cursor-pointer ${studio.sireImage ? 'border-indigo-500 bg-indigo-900/20' : 'border-slate-700 hover:border-white'}`}>
                                <span className="text-[9px] uppercase text-slate-400 font-bold">Sire Photo</span>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => studio.handleImageUpload(e, 'sire')} />
                            </label>
                            {studio.sireImage && (
                                <button 
                                    onClick={() => handleProtectedAction(() => studio.handleBgRemoval('sire'))} 
                                    disabled={studio.isProcessingImage}
                                    className="w-full py-1 text-[8px] bg-slate-800 hover:bg-slate-700 text-white uppercase font-bold rounded-sm border border-slate-700 flex items-center justify-center gap-1"
                                >
                                    {studio.isProcessingImage && studio.processingType === 'sire' ? <Loader2 size={8} className="animate-spin"/> : <Scissors size={8}/>} Remove BG
                                </button>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className={`h-16 border border-dashed rounded-sm flex flex-col items-center justify-center cursor-pointer ${studio.damImage ? 'border-purple-500 bg-purple-900/20' : 'border-slate-700 hover:border-white'}`}>
                                <span className="text-[9px] uppercase text-slate-400 font-bold">Dam Photo</span>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => studio.handleImageUpload(e, 'dam')} />
                            </label>
                            {studio.damImage && (
                                <button 
                                    onClick={() => handleProtectedAction(() => studio.handleBgRemoval('dam'))} 
                                    disabled={studio.isProcessingImage}
                                    className="w-full py-1 text-[8px] bg-slate-800 hover:bg-slate-700 text-white uppercase font-bold rounded-sm border border-slate-700 flex items-center justify-center gap-1"
                                >
                                    {studio.isProcessingImage && studio.processingType === 'dam' ? <Loader2 size={8} className="animate-spin"/> : <Scissors size={8}/>} Remove BG
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="flex flex-col gap-1">
                            <label className={`h-12 border border-dashed rounded-sm flex flex-col items-center justify-center cursor-pointer ${studio.sireLogo ? 'border-blue-500 bg-blue-900/20' : 'border-slate-800 hover:border-white'}`}>
                                <span className="text-[8px] uppercase text-slate-500 font-bold">Sire Logo</span>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => studio.handleImageUpload(e, 'sireLogo')} />
                            </label>
                            {studio.sireLogo && (
                                <button 
                                    onClick={() => handleProtectedAction(() => studio.handleBgRemoval('sireLogo'))} 
                                    disabled={studio.isProcessingImage}
                                    className="w-full py-1 text-[8px] bg-slate-800 hover:bg-slate-700 text-white uppercase font-bold rounded-sm border border-slate-700 flex items-center justify-center gap-1"
                                >
                                    {studio.isProcessingImage && studio.processingType === 'sireLogo' ? <Loader2 size={8} className="animate-spin"/> : <Scissors size={8}/>} Remove BG
                                </button>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className={`h-12 border border-dashed rounded-sm flex flex-col items-center justify-center cursor-pointer ${studio.damLogo ? 'border-pink-500 bg-pink-900/20' : 'border-slate-800 hover:border-white'}`}>
                                <span className="text-[8px] uppercase text-slate-500 font-bold">Dam Logo</span>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => studio.handleImageUpload(e, 'damLogo')} />
                            </label>
                            {studio.damLogo && (
                                <button 
                                    onClick={() => handleProtectedAction(() => studio.handleBgRemoval('damLogo'))} 
                                    disabled={studio.isProcessingImage}
                                    className="w-full py-1 text-[8px] bg-slate-800 hover:bg-slate-700 text-white uppercase font-bold rounded-sm border border-slate-700 flex items-center justify-center gap-1"
                                >
                                    {studio.isProcessingImage && studio.processingType === 'damLogo' ? <Loader2 size={8} className="animate-spin"/> : <Scissors size={8}/>} Remove BG
                                </button>
                            )}
                        </div>
                    </div>
                </Accordion>
            </div>

            {/* 2. AI GENERATOR */}
            <div className="order-2">
                <Accordion id="scene" title="AI Scene Designer" icon={Wand2} studio={studio}>
                    <div className="space-y-4">
                        <div className="flex gap-2 justify-center pb-2 border-b border-slate-800">
                            <button onClick={() => studio.changeAspectRatio('1:1')} className={`p-2 rounded border transition-all ${studio.aspectRatio==='1:1' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-black text-slate-500 border-slate-700'}`}>
                                <Grid3X3 size={16}/>
                            </button>
                            <button onClick={() => studio.changeAspectRatio('4:5')} className={`p-2 rounded border transition-all ${studio.aspectRatio==='4:5' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-black text-slate-500 border-slate-700'}`}>
                                <RectangleVertical size={16}/>
                            </button>
                            <button onClick={() => studio.changeAspectRatio('9:16')} className={`p-2 rounded border transition-all ${studio.aspectRatio==='9:16' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-black text-slate-500 border-slate-700'}`}>
                                <Smartphone size={16}/>
                            </button>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] uppercase text-slate-500 font-bold">Select Atmosphere</span>
                                <button onClick={() => studio.setShowPromptModal(true)} className="text-[9px] text-luxury-teal hover:underline">Browse List</button>
                            </div>
                            
                            <div className="relative">
                                <textarea 
                                    value={studio.aiPrompt} 
                                    onChange={(e) => studio.setAiPrompt(e.target.value)} 
                                    className="w-full bg-black/40 border border-slate-700 p-2 text-[10px] text-white h-32 resize-none focus:border-indigo-500 outline-none rounded-sm" 
                                    placeholder="Describe your scene..." 
                                />
                                <button 
                                    onClick={() => studio.setShowEditorModal(true)}
                                    className="absolute bottom-2 right-2 p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                                >
                                    <Edit3 size={12} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] uppercase text-slate-500 font-bold">
                                {isPro ? `${dailyRemaining} Daily Gens Left` : `${totalTurns} Turns Left`}
                            </span>
                            <button 
                                onClick={() => handleProtectedAction(studio.handleGenerateScene)} 
                                disabled={studio.isGeneratingScene}
                                className="px-4 py-2 bg-indigo-600 text-white text-[10px] uppercase font-bold rounded-sm flex items-center gap-2 hover:bg-indigo-500 shadow-lg disabled:opacity-50"
                            >
                                {studio.isGeneratingScene ? <Loader2 className="animate-spin" size={12}/> : <><Sparkles size={12}/> Generate</>}
                            </button>
                        </div>
                    </div>
                </Accordion>
            </div>

            {/* 3. TEXT OVERLAYS ACCORDION */}
            <div className="order-3">
                <Accordion id="text" title="Text Overlays & Colors" icon={Type} studio={studio}>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded border border-slate-800">
                            <button onClick={() => studio.setShowHeader(!studio.showHeader)}>{studio.showHeader ? <ToggleRight size={14} className="text-emerald-400"/> : <ToggleLeft size={14} className="text-slate-500"/>}</button>
                            <input value={studio.headerText} onChange={(e) => studio.setHeaderText(e.target.value)} className="flex-1 bg-transparent text-[10px] text-white outline-none" placeholder="Header"/>
                            <input type="color" value={studio.headerColor} onChange={(e) => studio.setHeaderColor(e.target.value)} className="w-4 h-4 bg-transparent cursor-pointer border-none"/>
                        </div>
                        <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded border border-slate-800">
                            <button onClick={() => studio.setShowStudName(!studio.showStudName)}>{studio.showStudName ? <ToggleRight size={14} className="text-emerald-400"/> : <ToggleLeft size={14} className="text-slate-500"/>}</button>
                            <input value={studio.studName} onChange={(e) => studio.setStudName(e.target.value)} className="flex-1 bg-transparent text-[10px] text-white outline-none" placeholder="Stud Name"/>
                            <input type="color" value={studio.studNameColor} onChange={(e) => studio.setStudNameColor(e.target.value)} className="w-4 h-4 bg-transparent cursor-pointer border-none"/>
                        </div>
                        <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded border border-slate-800">
                            <button onClick={() => studio.setShowDamName(!studio.showDamName)}>{studio.showDamName ? <ToggleRight size={14} className="text-emerald-400"/> : <ToggleLeft size={14} className="text-slate-500"/>}</button>
                            <input value={studio.damName} onChange={(e) => studio.setDamName(e.target.value)} className="flex-1 bg-transparent text-[10px] text-white outline-none" placeholder="Dam Name"/>
                            <input type="color" value={studio.damNameColor} onChange={(e) => studio.setDamNameColor(e.target.value)} className="w-4 h-4 bg-transparent cursor-pointer border-none"/>
                        </div>
                    </div>
                </Accordion>
            </div>

            {/* SELECTED LAYER EDITOR */}
            {studio.selectedLayer && (
                <div className="order-5 mb-2 bg-indigo-900/20 border border-indigo-500/50 p-3 rounded-sm animate-in zoom-in-95">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-bold uppercase text-indigo-400">Edit: {studio.selectedLayer}</span>
                        <div className="flex gap-2">
                            <button onClick={studio.snapToCenter} className="text-indigo-400 hover:text-white" title="Snap to Center"><AlignCenter size={12}/></button>
                            <button onClick={() => studio.setSelectedLayer(null)} className="text-slate-500 hover:text-white"><X size={10}/></button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <RotateCw size={10} className="text-slate-400"/>
                            <input type="range" min="0" max="360" value={studio.layerTransforms[studio.selectedLayer].rotate} onChange={(e) => studio.updateTransform('rotate', parseInt(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"/>
                        </div>
                        <div className="flex items-center gap-2">
                            <Scaling size={10} className="text-slate-400"/>
                            <input type="range" min="0.1" max="3.0" step="0.1" value={studio.layerTransforms[studio.selectedLayer].scale} onChange={(e) => studio.updateTransform('scale', parseFloat(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"/>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ ATMOSPHERE BROWSE MODAL */}
            {studio.showPromptModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                    <div className="bg-slate-900 border border-white/10 p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-white font-serif text-xl tracking-wide">Choose Atmosphere</h2>
                            <button onClick={() => studio.setShowPromptModal(false)} className="p-2 text-slate-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="grid gap-3">
                            {PROMPTS.map((p) => (
                                <button 
                                    key={p.name}
                                    onClick={() => studio.handlePresetSelect(p.text)}
                                    className="group text-left p-4 bg-white/5 hover:bg-luxury-gold/10 border border-white/5 hover:border-luxury-gold/30 rounded-sm transition-all duration-300"
                                >
                                    <div className="text-luxury-gold font-black text-[9px] uppercase tracking-[0.2em] mb-1">{p.suggestion}</div>
                                    <div className="text-white font-bold text-sm group-hover:text-white transition-colors">{p.name}</div>
                                    <div className="text-slate-500 text-[10px] mt-1 line-clamp-1 group-hover:text-slate-300 transition-colors">{p.text}</div>
                                </button>
                            ))}
                        </div>
                        <button 
                            onClick={() => studio.setShowPromptModal(false)}
                            className="w-full mt-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] uppercase font-bold tracking-widest rounded-sm transition-all"
                        >
                            Close Library
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

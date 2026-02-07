import React from 'react';
import { 
    Briefcase, Loader2, Scissors, Wand2, Grid3X3, RectangleVertical, Smartphone, 
    Edit3, Sparkles, Type, ToggleRight, ToggleLeft, Download, AlignCenter, X, 
    RotateCw, Scaling, ChevronDown 
} from 'lucide-react';

interface MarketingSidebarProps {
    studio: any;
    isSubscribed: boolean;
    isUnlocked: boolean;
    credits: number | null;
    freeGenerations: number;
    setShowPaywall: (show: boolean) => void;
}

// ✅ FIXED: Accordion moved OUTSIDE to prevent focus loss
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
    setShowPaywall 
}) => {

    return (
        <div className="w-full lg:w-[360px] flex-shrink-0 flex flex-col gap-2 order-1 lg:order-2">
            
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
                                    onClick={() => studio.handleBgRemoval('sire')} 
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
                                    onClick={() => studio.handleBgRemoval('dam')} 
                                    disabled={studio.isProcessingImage}
                                    className="w-full py-1 text-[8px] bg-slate-800 hover:bg-slate-700 text-white uppercase font-bold rounded-sm border border-slate-700 flex items-center justify-center gap-1"
                                >
                                    {studio.isProcessingImage && studio.processingType === 'dam' ? <Loader2 size={8} className="animate-spin"/> : <Scissors size={8}/>} Remove BG
                                </button>
                            )}
                        </div>
                    </div>
                    {/* Logos */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="flex flex-col gap-1">
                            <label className={`h-12 border border-dashed rounded-sm flex flex-col items-center justify-center cursor-pointer ${studio.sireLogo ? 'border-blue-500 bg-blue-900/20' : 'border-slate-800 hover:border-white'}`}>
                                <span className="text-[8px] uppercase text-slate-500 font-bold">Sire Logo</span>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => studio.handleImageUpload(e, 'sireLogo')} />
                            </label>
                            {studio.sireLogo && (
                                <button 
                                    onClick={() => studio.handleBgRemoval('sireLogo')} 
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
                                    onClick={() => studio.handleBgRemoval('damLogo')} 
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
                            <button onClick={() => studio.changeAspectRatio('1:1')} className={`p-2 rounded border transition-all ${studio.aspectRatio==='1:1' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-black text-slate-500 border-slate-700'}`} title="Square Post">
                                <Grid3X3 size={16}/>
                            </button>
                            <button onClick={() => studio.changeAspectRatio('4:5')} className={`p-2 rounded border transition-all ${studio.aspectRatio==='4:5' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-black text-slate-500 border-slate-700'}`} title="Portrait">
                                <RectangleVertical size={16}/>
                            </button>
                            <button onClick={() => studio.changeAspectRatio('9:16')} className={`p-2 rounded border transition-all ${studio.aspectRatio==='9:16' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-black text-slate-500 border-slate-700'}`} title="Vertical Story">
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
                                    className="w-full bg-black/40 border border-slate-700 p-2 text-[10px] text-white h-40 resize-none focus:border-indigo-500 outline-none rounded-sm" 
                                    placeholder="Describe your scene..." 
                                />
                                <button 
                                    onClick={() => studio.setShowEditorModal(true)}
                                    className="absolute bottom-2 right-2 p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                                    title="Expand Editor"
                                >
                                    <Edit3 size={12} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] uppercase text-slate-500 font-bold">
                                {(isSubscribed || isUnlocked) ? "Unlimited Mode" : freeGenerations > 0 ? `${freeGenerations} Free Generations` : `${credits || 0} Credits Available`}
                            </span>
                            <button 
                                onClick={studio.handleGenerateScene} 
                                disabled={studio.isGeneratingScene}
                                className="px-4 py-2 bg-indigo-600 text-white text-[10px] uppercase font-bold rounded-sm flex items-center gap-2 hover:bg-indigo-500 shadow-lg"
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
                        {/* Header */}
                        <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded border border-slate-800">
                            <button onClick={() => studio.setShowHeader(!studio.showHeader)}>{studio.showHeader ? <ToggleRight size={14} className="text-emerald-400"/> : <ToggleLeft size={14} className="text-slate-500"/>}</button>
                            <input value={studio.headerText} onChange={(e) => studio.setHeaderText(e.target.value)} className="flex-1 bg-transparent text-[10px] text-white outline-none" placeholder="Header"/>
                            <input type="color" value={studio.headerColor} onChange={(e) => studio.setHeaderColor(e.target.value)} className="w-4 h-4 bg-transparent cursor-pointer border-none"/>
                        </div>
                        {/* Stud */}
                        <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded border border-slate-800">
                            <button onClick={() => studio.setShowStudName(!studio.showStudName)}>{studio.showStudName ? <ToggleRight size={14} className="text-emerald-400"/> : <ToggleLeft size={14} className="text-slate-500"/>}</button>
                            <input value={studio.studName} onChange={(e) => studio.setStudName(e.target.value)} className="flex-1 bg-transparent text-[10px] text-white outline-none" placeholder="Stud Name"/>
                            <input type="color" value={studio.studNameColor} onChange={(e) => studio.setStudNameColor(e.target.value)} className="w-4 h-4 bg-transparent cursor-pointer border-none"/>
                        </div>
                        {/* Dam */}
                        <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded border border-slate-800">
                            <button onClick={() => studio.setShowDamName(!studio.showDamName)}>{studio.showDamName ? <ToggleRight size={14} className="text-emerald-400"/> : <ToggleLeft size={14} className="text-slate-500"/>}</button>
                            <input value={studio.damName} onChange={(e) => studio.setDamName(e.target.value)} className="flex-1 bg-transparent text-[10px] text-white outline-none" placeholder="Dam Name"/>
                            <input type="color" value={studio.damNameColor} onChange={(e) => studio.setDamNameColor(e.target.value)} className="w-4 h-4 bg-transparent cursor-pointer border-none"/>
                        </div>
                        {/* Phenotype */}
                        <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded border border-slate-800">
                            <button onClick={() => studio.setShowPhenotype(!studio.showPhenotype)}>{studio.showPhenotype ? <ToggleRight size={14} className="text-emerald-400"/> : <ToggleLeft size={14} className="text-slate-500"/>}</button>
                            <input value={studio.studPhenotype} onChange={(e) => studio.setStudPhenotype(e.target.value)} className="flex-1 bg-transparent text-[10px] text-white outline-none" placeholder="Phenotype"/>
                            <input type="color" value={studio.studPhenoColor} onChange={(e) => studio.setStudPhenoColor(e.target.value)} className="w-4 h-4 bg-transparent cursor-pointer border-none"/>
                        </div>
                        {/* Genotype */}
                        <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded border border-slate-800">
                            <button onClick={() => studio.setShowGenotype(!studio.showGenotype)}>{studio.showGenotype ? <ToggleRight size={14} className="text-emerald-400"/> : <ToggleLeft size={14} className="text-slate-500"/>}</button>
                            <input value={studio.studDna} onChange={(e) => studio.setStudDna(e.target.value)} className="flex-1 bg-transparent text-[10px] text-white outline-none font-mono" placeholder="DNA"/>
                            <input type="color" value={studio.studDnaColor} onChange={(e) => studio.setStudDnaColor(e.target.value)} className="w-4 h-4 bg-transparent cursor-pointer border-none"/>
                        </div>
                    </div>
                </Accordion>
            </div>

            {/* 4. EXPORT ACCORDION */}
            <div className="order-4">
                <Accordion id="export" title="Export Studio" icon={Download} studio={studio}>
                    <div className="bg-slate-900/50 p-4 border border-slate-800 rounded-sm">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] uppercase text-slate-400 font-bold">
                                {(isSubscribed || isUnlocked) ? "Session Unlocked" : `Balance: ${credits || 0} Credits`}
                            </span>
                            {(!isSubscribed && !isUnlocked) && <button onClick={() => setShowPaywall(true)} className="text-[9px] text-luxury-teal hover:underline">Refill / Unlock</button>}
                        </div>
                        
                        <button 
                            onClick={studio.handleDownloadAll}
                            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold uppercase tracking-widest text-[10px] rounded-sm hover:shadow-lg transition-all flex flex-col items-center justify-center gap-1"
                        >
                            <span className="flex items-center gap-2"><Download size={14}/> Export Current View</span>
                            <span className="text-[8px] opacity-75 font-normal lowercase">{(isSubscribed || isUnlocked) ? "Free" : "1 Credit"}</span>
                        </button>
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

        </div>
    );
};

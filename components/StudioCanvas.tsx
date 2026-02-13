import React from 'react';
import Draggable from 'react-draggable';
import { Move, Download, Crown, Lock } from 'lucide-react';

interface StudioCanvasProps {
    studio: any;
    isMobile: boolean;
    isSubscribed: boolean;
    isUnlocked: boolean;
    credits: number | null;
    userEmail: string;
    setShowPaywall: (show: boolean) => void;
}

export const StudioCanvas: React.FC<StudioCanvasProps> = ({ 
    studio, isMobile, isSubscribed, isUnlocked, credits, userEmail, setShowPaywall 
}) => {

    const handleDownloadClick = () => {
        const isPro = isSubscribed || isUnlocked;
        const canDownload = isPro || studio.isSessionActive || (credits && credits > 0) || studio.freeGenerations > 0;

        if (!canDownload) {
            setShowPaywall(true);
            return;
        }
        studio.handleDownloadAll();
    };

    const hexToRgba = (hex: string, opacity: number) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity / 100})` : 'transparent';
    };

    const getTextStyle = (layerKey: string): React.CSSProperties => {
        const style = studio.textStyles[layerKey];
        if (!style) return {};

        // 🔥 FIX: CSS does not recognize "sentence", so we map it to "none" 
        // to stop the browser from forcing uppercase.
        const cssCasing = style.casing === 'sentence' ? 'none' : style.casing;

        let shadow = style.shadow ? '0px 4px 8px rgba(0,0,0,0.8)' : 'none';
        
        if (style.outline) {
            const c = style.outlineColor;
            const outlineShadow = `
                -1px -1px 0 ${c}, 1px -1px 0 ${c}, -1px 1px 0 ${c}, 1px 1px 0 ${c},
                -2px 0px 0 ${c}, 2px 0px 0 ${c}, 0px -2px 0 ${c}, 0px 2px 0 ${c}
            `;
            shadow = style.shadow ? `${outlineShadow}, 0px 6px 12px rgba(0,0,0,0.9)` : outlineShadow;
        }

        return {
            color: style.color,
            fontFamily: style.font,
            textShadow: shadow, 
            backgroundColor: style.bg ? hexToRgba(style.bgColor, style.bgOpacity) : 'transparent',
            padding: style.bg ? '0.2em 0.5em' : '0',
            borderRadius: '0.1em',
            textTransform: cssCasing as any, // Use our mapped value
            whiteSpace: 'normal',
            maxWidth: '100%',
            lineHeight: '1.2',
            wordWrap: 'break-word' as const,
        };
    };

    return (
        <div className="w-full lg:w-auto lg:flex-shrink-0 order-2 lg:order-1 lg:sticky lg:top-24 z-20 flex flex-col items-center">
            {/* 
               🔥 MOBILE UPDATE: 
               Added pb-[80px] to ensure the canvas isn't hidden behind the fixed bottom dock.
               Removed negative margins on mobile to prevent full-width overflow issues.
            */}
            <div className="w-full lg:w-auto bg-[#020617]/90 backdrop-blur-xl lg:bg-transparent pb-[100px] lg:p-0 lg:border-none flex flex-col items-center">
                
                <div className="bg-[#0a0a0a] border-y lg:border border-slate-800 lg:rounded-sm relative shadow-2xl w-full lg:w-fit mx-auto overflow-hidden">
                    <div 
                        ref={studio.marketingRef}
                        id="canvas-container"
                        className="relative overflow-hidden flex flex-col transition-all duration-500 shadow-2xl ring-1 ring-white/10"
                        style={{ 
                            aspectRatio: studio.aspectRatio.replace(':','/'), 
                            background: '#0a0a0a',
                            // On mobile, let the width drive height via aspect-ratio, but cap max-height so it fits screen
                            height: isMobile ? 'auto' : '60vh', 
                            width: isMobile ? '100%' : 'auto', 
                            maxHeight: isMobile ? '65vh' : '600px'
                        }}
                    >
                        {studio.marketingBg.startsWith('data:') && <img src={studio.marketingBg} className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0" />}
                        
                        <div className="absolute inset-0 z-10 w-full h-full overflow-hidden flex items-center justify-center">
                            
                            {/* Watermark */}
                            {(!isSubscribed && !isUnlocked && !studio.isSessionActive) && (
                                <Draggable 
                                    nodeRef={studio.watermarkRef} 
                                    bounds="parent" 
                                    position={{x: studio.layerTransforms.watermark.x, y: studio.layerTransforms.watermark.y}} 
                                    onStop={(e, data) => studio.updatePosition('watermark', data.x, data.y)}
                                >
                                    <div ref={studio.watermarkRef} className="absolute z-50 cursor-move pointer-events-auto" onClick={() => studio.setSelectedLayer('watermark')}>
                                        <div className="bg-black/60 px-3 py-1 rounded backdrop-blur-sm border border-white/10 whitespace-nowrap group">
                                            <span className="font-serif font-bold text-white text-[8px] tracking-[0.2em] uppercase group-hover:text-luxury-teal transition-colors">Designed by OKC FRENCHIES</span>
                                        </div>
                                    </div>
                                </Draggable>
                            )}

                            {/* Standard Images */}
                            {studio.sireImage && <Draggable nodeRef={studio.sireNodeRef} bounds="parent" position={{x: studio.layerTransforms.sire.x, y: studio.layerTransforms.sire.y}} onStop={(e, data) => studio.updatePosition('sire', data.x, data.y)}><div ref={studio.sireNodeRef} className="absolute z-20 w-1/2 h-1/2 cursor-move pointer-events-auto" onClick={() => studio.setSelectedLayer('sire')}><img src={studio.sireImage} className="w-full h-full object-contain pointer-events-none drop-shadow-lg" style={{transform: `rotate(${studio.layerTransforms.sire.rotate}deg) scale(${studio.layerTransforms.sire.scale})`}}/></div></Draggable>}
                            {studio.damImage && <Draggable nodeRef={studio.damNodeRef} bounds="parent" position={{x: studio.layerTransforms.dam.x, y: studio.layerTransforms.dam.y}} onStop={(e, data) => studio.updatePosition('dam', data.x, data.y)}><div ref={studio.damNodeRef} className="absolute z-20 w-1/2 h-1/2 cursor-move pointer-events-auto" onClick={() => studio.setSelectedLayer('dam')}><img src={studio.damImage} className="w-full h-full object-contain pointer-events-none drop-shadow-lg" style={{transform: `rotate(${studio.layerTransforms.dam.rotate}deg) scale(${studio.layerTransforms.dam.scale})`}}/></div></Draggable>}
                            
                            {/* Logos */}
                            {studio.sireLogo && <Draggable nodeRef={studio.sireLogoRef} bounds="parent" position={{x: studio.layerTransforms.sireLogo.x, y: studio.layerTransforms.sireLogo.y}} onStop={(e, data) => studio.updatePosition('sireLogo', data.x, data.y)}><div ref={studio.sireLogoRef} className="absolute z-30 w-1/4 h-1/4 cursor-move pointer-events-auto" onClick={() => studio.setSelectedLayer('sireLogo')}><img src={studio.sireLogo} className="w-full h-full object-contain pointer-events-none" style={{transform: `rotate(${studio.layerTransforms.sireLogo.rotate}deg) scale(${studio.layerTransforms.sireLogo.scale})`}}/></div></Draggable>}
                            {studio.damLogo && <Draggable nodeRef={studio.damLogoRef} bounds="parent" position={{x: studio.layerTransforms.damLogo.x, y: studio.layerTransforms.damLogo.y}} onStop={(e, data) => studio.updatePosition('damLogo', data.x, data.y)}><div ref={studio.damLogoRef} className="absolute z-30 w-1/4 h-1/4 cursor-move pointer-events-auto" onClick={() => studio.setSelectedLayer('damLogo')}><img src={studio.damLogo} className="w-full h-full object-contain pointer-events-none" style={{transform: `rotate(${studio.layerTransforms.damLogo.rotate}deg) scale(${studio.layerTransforms.damLogo.scale})`}}/></div></Draggable>}
                            
                            {/* Text Layers (Header, Stud Name, Dam Name, Phenotype, Genotype) */}
                            {studio.showHeader && (
                                <Draggable nodeRef={studio.headerRef} bounds="parent" position={{x: studio.layerTransforms.header.x, y: studio.layerTransforms.header.y}} onStop={(e, data) => studio.updatePosition('header', data.x, data.y)}>
                                    <div ref={studio.headerRef} className="absolute z-30 cursor-move pointer-events-auto w-full px-4 pt-4 flex justify-center" onClick={() => studio.setSelectedLayer('header')}>
                                        <div className="text-center w-full">
                                            <h1 
                                                className="text-3xl font-bold tracking-widest drop-shadow-md pointer-events-none inline-block transition-all break-words w-full" 
                                                style={{...getTextStyle('header'), transform: `rotate(${studio.layerTransforms.header.rotate}deg) scale(${studio.layerTransforms.header.scale})`}}
                                            >
                                                {studio.headerText}
                                            </h1>
                                        </div>
                                    </div>
                                </Draggable>
                            )}
                            
                            {studio.showStudName && (
                                <Draggable nodeRef={studio.studNameRef} bounds="parent" position={{x: studio.layerTransforms.studName.x, y: studio.layerTransforms.studName.y}} onStop={(e, data) => studio.updatePosition('studName', data.x, data.y)}>
                                    <div ref={studio.studNameRef} className="absolute z-30 cursor-move pointer-events-auto w-full px-4 flex justify-center" onClick={() => studio.setSelectedLayer('studName')}>
                                        <div className="text-center w-full">
                                            <h2 
                                                className="text-2xl font-bold tracking-widest drop-shadow-md pointer-events-none inline-block transition-all break-words w-full" 
                                                style={{...getTextStyle('studName'), transform: `rotate(${studio.layerTransforms.studName.rotate}deg) scale(${studio.layerTransforms.studName.scale})`}}
                                            >
                                                {studio.studName}
                                            </h2>
                                        </div>
                                    </div>
                                </Draggable>
                            )}

                            {studio.showDamName && (
                                <Draggable nodeRef={studio.damNameRef} bounds="parent" position={{x: studio.layerTransforms.damName.x, y: studio.layerTransforms.damName.y}} onStop={(e, data) => studio.updatePosition('damName', data.x, data.y)}>
                                    <div ref={studio.damNameRef} className="absolute z-30 cursor-move pointer-events-auto w-full px-4 flex justify-center" onClick={() => studio.setSelectedLayer('damName')}>
                                        <div className="text-center w-full">
                                            <h2 
                                                className="text-2xl font-bold tracking-widest drop-shadow-md pointer-events-none inline-block transition-all break-words w-full" 
                                                style={{...getTextStyle('damName'), transform: `rotate(${studio.layerTransforms.damName.rotate}deg) scale(${studio.layerTransforms.damName.scale})`}}
                                            >
                                                {studio.damName}
                                            </h2>
                                        </div>
                                    </div>
                                </Draggable>
                            )}

                            {studio.showPhenotype && (
                                <Draggable nodeRef={studio.studPhenoRef} bounds="parent" position={{x: studio.layerTransforms.studPheno.x, y: studio.layerTransforms.studPheno.y}} onStop={(e, data) => studio.updatePosition('studPheno', data.x, data.y)}>
                                    <div ref={studio.studPhenoRef} className="absolute z-30 cursor-move pointer-events-auto w-full px-4 flex justify-center" onClick={() => studio.setSelectedLayer('studPheno')}>
                                        <div className="text-center w-full">
                                            <span 
                                                className="font-sans text-[10px] tracking-[0.3em] drop-shadow-md pointer-events-none inline-block transition-all break-words w-full" 
                                                style={{...getTextStyle('studPheno'), transform: `rotate(${studio.layerTransforms.studPheno.rotate}deg) scale(${studio.layerTransforms.studPheno.scale})`}}
                                            >
                                                {studio.studPhenotype}
                                            </span>
                                        </div>
                                    </div>
                                </Draggable>
                            )}

                            {studio.showGenotype && (
                                <Draggable nodeRef={studio.studGenoRef} bounds="parent" position={{x: studio.layerTransforms.studGeno.x, y: studio.layerTransforms.studGeno.y}} onStop={(e, data) => studio.updatePosition('studGeno', data.x, data.y)}>
                                    <div ref={studio.studGenoRef} className="absolute z-30 cursor-move pointer-events-auto w-full px-4 flex justify-center" onClick={() => studio.setSelectedLayer('studGeno')}>
                                        <div className="text-center w-full">
                                            <div 
                                                className="backdrop-blur-md pointer-events-none inline-block transition-all break-words w-full" 
                                                style={{...getTextStyle('studGeno'), transform: `rotate(${studio.layerTransforms.studGeno.rotate}deg) scale(${studio.layerTransforms.studGeno.scale})`}}
                                            >
                                                <p className="font-mono text-xs font-bold tracking-wider">{studio.studDna}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Draggable>
                            )}

                            {/* Stickers Layer */}
                            {studio.stickers.map((s: any) => (
                                <Draggable 
                                    key={s.id} 
                                    bounds="parent" 
                                    position={{x: s.x, y: s.y}} 
                                    onStop={(e, data) => studio.updatePosition(s.id, data.x, data.y)}
                                >
                                    <div className="absolute z-40 cursor-move pointer-events-auto" onClick={() => studio.setSelectedLayer(s.id)}>
                                        <img 
                                            src={s.url} 
                                            className="pointer-events-none" 
                                            style={{
                                                transform: `rotate(${s.rotate}deg) scale(${s.scale})`, 
                                                width: '100px', // Base width for stickers
                                            }}
                                            alt="sticker"
                                        />
                                    </div>
                                </Draggable>
                            ))}

                        </div>
                    </div>
                </div>

                {/* UI Section - Only show on Desktop here. Mobile logic moved to Sidebar dock */}
                {!isMobile && (
                    <div className="w-full max-w-[600px] mt-4 px-4 lg:px-0 space-y-3">
                        <div className="bg-gradient-to-br from-[#0f172a] to-black border border-luxury-gold/30 p-5 rounded-sm shadow-2xl">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="text-center sm:text-left flex-1">
                                    <p className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold flex items-center justify-center sm:justify-start gap-2">
                                        <Crown size={12}/> Pro Studio
                                    </p>
                                    <h3 className="text-white text-lg font-serif mt-1">
                                        {isSubscribed || isUnlocked 
                                            ? "Unlimited Session Active" 
                                            : studio.isSessionActive 
                                                ? `Project Unlocked (${studio.sessionAiGens} AI Gens Included)` 
                                                : `${credits ?? 0} Credits Available`}
                                    </h3>
                                </div>
                                {(!isSubscribed && !isUnlocked && !studio.isSessionActive) && (
                                    <button 
                                        onClick={() => (credits && credits > 0) ? studio.activateSession() : setShowPaywall(true)}
                                        className="w-full sm:w-auto px-6 py-3 bg-luxury-teal hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-[10px] rounded-sm transition-all shadow-[0_0_15px_rgba(45,212,191,0.2)] flex items-center justify-center gap-2"
                                    >
                                        <Lock size={12} /> Unlock Project (1 Credit)
                                    </button>
                                )}
                            </div>
                        </div>

                        <button onClick={handleDownloadClick} className="w-full py-5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black uppercase tracking-[0.2em] text-[12px] rounded-sm hover:brightness-110 shadow-xl transition-all flex flex-col items-center justify-center border border-emerald-400/20">
                            <span className="flex items-center gap-2"><Download size={18}/> Export Advertisement</span>
                            <span className="text-[8px] opacity-70 font-normal mt-1 tracking-normal lowercase">{isSubscribed || isUnlocked || studio.isSessionActive ? "Unwatermarked High-Res" : "Standard Res (Watermarked)"}</span>
                        </button>

                        <div className="text-center"><span className="text-[9px] text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1"><Move size={10} /> Drag Elements to Position</span></div>
                    </div>
                )}
            </div>
        </div>
    );
};
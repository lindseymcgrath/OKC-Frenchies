import React from 'react';
import Draggable from 'react-draggable';
import { Move } from 'lucide-react';

interface StudioCanvasProps {
    studio: any;
    isMobile: boolean;
    isSubscribed: boolean;
    isUnlocked: boolean;
}

export const StudioCanvas: React.FC<StudioCanvasProps> = ({ studio, isMobile, isSubscribed, isUnlocked }) => {
    return (
        <div className="w-full lg:w-auto lg:flex-shrink-0 order-2 lg:order-1 lg:sticky lg:top-24 z-20 flex flex-col items-center">
            <div className="w-screen ml-[calc(50%-50vw)] lg:w-auto lg:ml-0 bg-[#020617]/90 backdrop-blur-xl lg:bg-transparent pb-4 lg:p-0 lg:border-none flex justify-center">
                {/* The Container */}
                <div className="bg-[#0a0a0a] border-y lg:border border-slate-800 lg:rounded-sm relative shadow-2xl w-full lg:w-fit mx-auto overflow-hidden">
                    <div 
                        ref={studio.marketingRef}
                        id="canvas-container"
                        className="relative overflow-hidden flex flex-col transition-all duration-500 shadow-2xl ring-1 ring-white/10"
                        style={{ 
                            aspectRatio: studio.aspectRatio.replace(':','/'), 
                            background: '#0a0a0a',
                            height: isMobile ? 'auto' : '60vh', 
                            width: isMobile ? '100%' : 'auto', 
                            maxHeight: isMobile ? 'none' : '600px'
                        }}
                    >
                        {studio.marketingBg.startsWith('data:') && <img src={studio.marketingBg} className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0" />}
                        
                        {/* Draggables */}
                        <div className="absolute inset-0 z-10 w-full h-full overflow-hidden">
                            {/* Watermark (Top Center) */}
                            {(!isSubscribed && !isUnlocked) && (
                                <div className="absolute z-50 top-[2%] left-1/2 -translate-x-1/2 pointer-events-none">
                                    <div className="bg-black/60 px-3 py-1 rounded backdrop-blur-sm border border-white/10 whitespace-nowrap">
                                        <span className="font-serif font-bold text-white text-[6px] tracking-[0.2em] uppercase">Designed by OKC FRENCHIES</span>
                                    </div>
                                </div>
                            )}

                            {studio.sireImage && <Draggable nodeRef={studio.sireNodeRef} bounds="parent" grid={[10, 10]}><div ref={studio.sireNodeRef} className="absolute z-20 w-1/2 h-1/2 cursor-move" onClick={() => studio.setSelectedLayer('sire')}><img src={studio.sireImage} className="w-full h-full object-contain pointer-events-none drop-shadow-lg" style={{transform: `rotate(${studio.layerTransforms.sire.rotate}deg) scale(${studio.layerTransforms.sire.scale})`}}/></div></Draggable>}
                            {studio.damImage && <Draggable nodeRef={studio.damNodeRef} bounds="parent" grid={[10, 10]}><div ref={studio.damNodeRef} className="absolute z-20 w-1/2 h-1/2 left-1/2 cursor-move" onClick={() => studio.setSelectedLayer('dam')}><img src={studio.damImage} className="w-full h-full object-contain pointer-events-none drop-shadow-lg" style={{transform: `rotate(${studio.layerTransforms.dam.rotate}deg) scale(${studio.layerTransforms.dam.scale})`}}/></div></Draggable>}
                            
                            {studio.sireLogo && <Draggable nodeRef={studio.sireLogoRef} bounds="parent" grid={[10, 10]}><div ref={studio.sireLogoRef} className="absolute z-30 w-1/4 h-1/4 top-[10%] left-[5%] cursor-move" onClick={() => studio.setSelectedLayer('sireLogo')}><img src={studio.sireLogo} className="w-full h-full object-contain pointer-events-none" style={{transform: `rotate(${studio.layerTransforms.sireLogo.rotate}deg) scale(${studio.layerTransforms.sireLogo.scale})`}}/></div></Draggable>}
                            {studio.damLogo && <Draggable nodeRef={studio.damLogoRef} bounds="parent" grid={[10, 10]}><div ref={studio.damLogoRef} className="absolute z-30 w-1/4 h-1/4 top-[10%] right-[5%] cursor-move" onClick={() => studio.setSelectedLayer('damLogo')}><img src={studio.damLogo} className="w-full h-full object-contain pointer-events-none" style={{transform: `rotate(${studio.layerTransforms.damLogo.rotate}deg) scale(${studio.layerTransforms.damLogo.scale})`}}/></div></Draggable>}

                            {/* Text Layers - Centered by default using absolute positioning trick for stability */}
                            {studio.showHeader && <Draggable 
                                nodeRef={studio.headerRef} 
                                position={{x: studio.layerTransforms.header.x, y: studio.layerTransforms.header.y}}
                                onStop={(e, data) => studio.updatePosition('header', data.x, data.y)}
                                grid={[10, 10]}
                            >
                                <div ref={studio.headerRef} className="absolute z-30 top-[10%] left-1/2 cursor-move" onClick={() => studio.setSelectedLayer('header')}>
                                    <div className="-translate-x-1/2 whitespace-nowrap text-center">
                                        <h1 className="font-serif text-3xl font-bold tracking-widest drop-shadow-md pointer-events-none inline-block" style={{color: studio.headerColor, transform: `rotate(${studio.layerTransforms.header.rotate}deg) scale(${studio.layerTransforms.header.scale})`}}>{studio.headerText}</h1>
                                    </div>
                                </div>
                            </Draggable>}
                            
                            {studio.showStudName && <Draggable 
                                nodeRef={studio.studNameRef} 
                                position={{x: studio.layerTransforms.studName.x, y: studio.layerTransforms.studName.y}}
                                onStop={(e, data) => studio.updatePosition('studName', data.x, data.y)}
                                grid={[10, 10]}
                            >
                                <div ref={studio.studNameRef} className="absolute z-30 top-[20%] left-1/2 cursor-move" onClick={() => studio.setSelectedLayer('studName')}>
                                    <div className="-translate-x-1/2 whitespace-nowrap text-center">
                                        <h2 className="font-display text-2xl font-bold uppercase tracking-widest drop-shadow-md pointer-events-none inline-block" style={{color: studio.studNameColor, transform: `rotate(${studio.layerTransforms.studName.rotate}deg) scale(${studio.layerTransforms.studName.scale})`}}>{studio.studName}</h2>
                                    </div>
                                </div>
                            </Draggable>}
                            
                            {studio.showDamName && <Draggable 
                                nodeRef={studio.damNameRef} 
                                position={{x: studio.layerTransforms.damName.x, y: studio.layerTransforms.damName.y}}
                                onStop={(e, data) => studio.updatePosition('damName', data.x, data.y)}
                                grid={[10, 10]}
                            >
                                <div ref={studio.damNameRef} className="absolute z-30 top-[28%] left-1/2 cursor-move" onClick={() => studio.setSelectedLayer('damName')}>
                                    <div className="-translate-x-1/2 whitespace-nowrap text-center">
                                        <h2 className="font-display text-2xl font-bold uppercase tracking-widest drop-shadow-md pointer-events-none inline-block" style={{color: studio.damNameColor, transform: `rotate(${studio.layerTransforms.damName.rotate}deg) scale(${studio.layerTransforms.damName.scale})`}}>{studio.damName}</h2>
                                    </div>
                                </div>
                            </Draggable>}
                            
                            {studio.showPhenotype && <Draggable 
                                nodeRef={studio.studPhenoRef} 
                                position={{x: studio.layerTransforms.studPheno.x, y: studio.layerTransforms.studPheno.y}}
                                onStop={(e, data) => studio.updatePosition('studPheno', data.x, data.y)}
                                grid={[10, 10]}
                            >
                                <div ref={studio.studPhenoRef} className="absolute z-30 bottom-[15%] left-1/2 cursor-move" onClick={() => studio.setSelectedLayer('studPheno')}>
                                    <div className="-translate-x-1/2 whitespace-nowrap text-center">
                                        <span className="font-sans text-[10px] uppercase tracking-[0.3em] drop-shadow-md bg-black/40 backdrop-blur-sm px-3 py-1 rounded-sm pointer-events-none inline-block" style={{color: studio.studPhenoColor, transform: `rotate(${studio.layerTransforms.studPheno.rotate}deg) scale(${studio.layerTransforms.studPheno.scale})`}}>{studio.studPhenotype}</span>
                                    </div>
                                </div>
                            </Draggable>}
                            
                            {studio.showGenotype && <Draggable 
                                nodeRef={studio.studGenoRef} 
                                position={{x: studio.layerTransforms.studGeno.x, y: studio.layerTransforms.studGeno.y}}
                                onStop={(e, data) => studio.updatePosition('studGeno', data.x, data.y)}
                                grid={[10, 10]}
                            >
                                <div ref={studio.studGenoRef} className="absolute z-30 bottom-[8%] left-1/2 cursor-move" onClick={() => studio.setSelectedLayer('studGeno')}>
                                    <div className="-translate-x-1/2 whitespace-nowrap text-center">
                                        <div className="bg-black/60 backdrop-blur-md border border-white/20 py-2 px-4 rounded-sm shadow-xl pointer-events-none inline-block" style={{transform: `rotate(${studio.layerTransforms.studGeno.rotate}deg) scale(${studio.layerTransforms.studGeno.scale})`}}>
                                            <p className="font-mono text-xs font-bold tracking-wider" style={{color: studio.studDnaColor}}>{studio.studDna}</p>
                                        </div>
                                    </div>
                                </div>
                            </Draggable>}
                        </div>
                    </div>
                </div>
                <div className="lg:hidden text-center mt-2">
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1"><Move size={10} /> Drag Elements to Position</span>
                </div>
            </div>
        </div>
    );
};
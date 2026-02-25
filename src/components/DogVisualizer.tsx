import React, { useState, useEffect } from 'react';
import { VisualTraits } from '../utils/calculatorHelpers';

export const DogVisualizer: React.FC<{ traits: VisualTraits, scale?: number, label?: string, showLabel?: boolean }> = React.memo(({ traits, scale = 1, label, showLabel = true }) => {
    
    const [errors, setErrors] = useState<Record<string, boolean>>({});

    const handleImageError = (imgName: string) => {
        console.warn(`Failed to load layer: ${imgName}`);
        setErrors(prev => ({ ...prev, [imgName]: true }));
    };

    useEffect(() => { setErrors({}); }, [traits.phenotypeName, traits.layers]);

    return (
        <div className="flex flex-col items-center w-full relative" style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
            
            {/* IMAGE CONTAINER */}
            <div className="relative w-full aspect-square bg-transparent rounded-full overflow-hidden group">
                <div className="absolute inset-4 bg-white/5 blur-2xl rounded-full opacity-50"></div>
                {traits.layers.map((layer, index) => {
                    if (errors[layer]) return null;
                    return (
                        <img 
                            key={`${layer}-${index}`}
                            src={layer}
                            alt="" 
                            className="absolute inset-0 w-full h-full object-contain z-10 transition-all duration-300"
                            style={{ zIndex: 10 + index }}
                            onError={() => handleImageError(layer)}
                            crossOrigin="anonymous" 
                        />
                    );
                })}
            </div>

            {/* LABEL: PHENOTYPE NAME (Optimized for Mobile Wrapping) */}
            {showLabel && (
                <div className="absolute bottom-2 z-20 w-full flex justify-center px-4">
                     <span className="text-[9px] md:text-[11px] text-white font-serif font-bold uppercase tracking-[0.1em] leading-tight block drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-center whitespace-normal w-full max-w-[220px] break-words">
                        {label ? `${label}: ` : ''}{traits.phenotypeName}
                     </span>
                </div>
            )}
        </div>
    );
});
import React, { useState, useEffect } from 'react';
import { VisualTraits } from '../utils/calculatorHelpers'; // ✅ Removed REMOTE_BASE_URL

export const DogVisualizer: React.FC<{ traits: VisualTraits, scale?: number, label?: string, showLabel?: boolean }> = React.memo(({ traits, scale = 1, label, showLabel = true }) => {
    
    // ✅ FIX: Since 'layer' already contains the full path from the helper, 
    // we don't need getUrl anymore. Just return the string.
    const [errors, setErrors] = useState<Record<string, boolean>>({});

    const handleImageError = (imgName: string) => {
        setErrors(prev => ({ ...prev, [imgName]: true }));
    };

    useEffect(() => { setErrors({}); }, [traits.phenotypeName, traits.layers]);

    return (
        <div className="flex flex-col items-center w-full relative" style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
            <div className="relative w-full aspect-square bg-transparent rounded-full overflow-hidden group">
                <div className="absolute inset-4 bg-white/5 blur-2xl rounded-full opacity-50"></div>
                {traits.layers.map((layer, index) => {
                    if (errors[layer]) return null;
                    return (
                        <img 
                            key={`${layer}-${index}`}
                            src={layer} // ✅ FIX: Use the layer path directly
                            alt="" 
                            className="absolute inset-0 w-full h-full object-contain z-10 transition-all duration-300"
                            style={{ zIndex: 10 + index }}
                            onError={() => handleImageError(layer)}
                        />
                    );
                })}
            </div>
            {showLabel && label && (
                <div className="mt-[-10%] z-20 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-xl max-w-[150%]">
                     <span className="text-[9px] text-white uppercase tracking-widest font-bold whitespace-nowrap">{label}: {traits.phenotypeName.split(' ').slice(0,2).join(' ')}...</span>
                </div>
            )}
            {showLabel && !label && (
                <div className="mt-2 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10 max-w-[150%] text-center">
                     <span className="text-[8px] text-white uppercase tracking-widest leading-none block">{traits.phenotypeName}</span>
                </div>
            )}
        </div>
    );
});

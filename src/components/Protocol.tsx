import React, { useState, useEffect, useMemo } from 'react';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import { ExternalLink, FlaskConical, ShoppingBag, X, CheckCircle2, Disc, Calculator, Sun, Moon, Utensils, ArrowRight, Activity, ShieldPlus } from 'lucide-react';

interface StackItem {
    name: string;
    description: string;
    link: string;
    image?: string;
}

const DAILY_STACK: StackItem[] = [
    {
        name: "Goat Brew",
        description: "1,000mg Bovine Colostrum & Probiotics. The ultimate immune system starter.",
        link: "https://rawandpawco.com/products/goat-brew-goat-milk-dog-supplement",
        image: PRODUCTS.find(p => p.id === 'goat-brew')?.image
    },
    {
        name: "Plasma",
        description: "Pure antibodies and growth factors to seal the gut lining.",
        link: "https://rawandpawco.com/products/raw-and-paw-naturals-bovine-plasma-dog-supplement",
        image: PRODUCTS.find(p => p.id === 'plasma')?.image
    },
    {
        name: "Omega Mania",
        description: "Cognitive fuel and coat density. Essential fatty acids for the day ahead.",
        link: "https://rawandpawco.com/products/raw-and-paw-naturals-omega-mania-dog-oil-blend",
        image: PRODUCTS.find(p => p.id === 'omega-mania')?.image
    }
];

const PERFORMANCE_STACK: StackItem[] = [
    {
        name: "Gentleman's Litter",
        description: "Performance enhancer for our active studs. Zinc and Magnesium load.",
        link: "https://rawandpawco.com/collections/supplements",
        image: "https://lh3.googleusercontent.com/d/1dSmxbA3g-4qVRzxvBhd-ueijtfna77Ct=s1000"
    },
    {
        name: "Joint Support",
        description: "Glucosamine & Chondroitin for heavy bone development and joint longevity.",
        link: "https://rawandpawco.com/collections/supplements",
        image: "https://lh3.googleusercontent.com/d/1znd-3Egcq27kfY7DSwkmcAzia_KWvmDE=s1000"
    }
];

const Protocol: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedStack, setSelectedStack] = useState<{ title: string, items: StackItem[] } | null>(null);
  
  // Calculator State
  const [weight, setWeight] = useState<string>('');
  const [stage, setStage] = useState<string>('adult');

  useEffect(() => {
    if (selectedProduct || selectedStack) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedProduct, selectedStack]);

  const calculatedAmount = useMemo(() => {
      const w = parseFloat(weight);
      if (isNaN(w) || w <= 0) return null;

      let percentage = 0.025; // Default Adult
      if (stage === 'puppy_young') percentage = 0.08; // 8-10%
      if (stage === 'puppy_old') percentage = 0.05; // 5-6%
      if (stage === 'active') percentage = 0.035; // 3.5%

      const dailyLbs = w * percentage;
      const dailyOz = dailyLbs * 16;
      
      return {
          lbs: dailyLbs.toFixed(2),
          oz: Math.round(dailyOz)
      };
  }, [weight, stage]);

  return (
    <section id="protocol" className="py-32 bg-luxury-black relative overflow-hidden">
       {/* Ambient Glow */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-luxury-teal/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full border border-luxury-teal/30 flex items-center justify-center bg-luxury-teal/5">
                    <FlaskConical className="text-luxury-teal" size={24} />
                </div>
            </div>
            
            <h2 className="font-serif text-5xl md:text-7xl text-slate-100 mb-6">The Protocol</h2>
            
            <div className="flex justify-center items-center gap-4 mb-8">
               <div className="h-px w-12 bg-slate-800" />
               <p className="font-sans text-luxury-teal text-xs tracking-[0.3em] uppercase">Powered by Raw & Paw Co.</p>
               <div className="h-px w-12 bg-slate-800" />
            </div>

            <p className="font-serif text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              We utilize advanced supplement stacks tailored to each dog's needs. From 
              <span className="text-luxury-teal"> gut health</span> to 
              <span className="text-luxury-teal"> reproductive performance</span>, our program is fueled by science.
            </p>
        </div>

        {/* --- MAIN LAYOUT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
            
            {/* LEFT COLUMN: THE DAILY RHYTHM (Main Content) */}
            <div className="lg:col-span-2 space-y-6">
                 <div className="flex items-end justify-between border-b border-slate-800 pb-4 mb-4">
                     <h3 className="font-serif text-3xl text-slate-100">Feeding Regimen</h3>
                     <span className="font-sans text-luxury-teal text-[10px] tracking-widest uppercase mb-1">Standard Operating Procedure</span>
                 </div>

                 {/* Daily Protocol Card */}
                 <div 
                    onClick={() => setSelectedStack({ title: "The Daily Protocol", items: DAILY_STACK })}
                    className="bg-slate-900/30 border border-slate-800 p-8 md:p-10 backdrop-blur-sm hover:border-luxury-teal/50 hover:bg-slate-900/50 transition-all rounded-sm relative overflow-hidden group cursor-pointer"
                 >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                         <Sun size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-amber-500/10 rounded-full text-amber-400">
                                <Utensils size={24} />
                            </div>
                            <div>
                                <h4 className="font-serif text-2xl text-white group-hover:text-amber-400 transition-colors">The Daily Stack</h4>
                                <span className="text-xs text-slate-500 uppercase tracking-widest">Foundation Nutrition</span>
                            </div>
                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="text-luxury-teal" size={24} />
                            </div>
                        </div>
                        <p className="font-serif text-slate-400 leading-relaxed mb-8 max-w-xl">
                            Our universal protocol. Fed 1x daily for adults and 3x daily for puppies. Focuses on gut sealing, immune loading, and coat density.
                        </p>
                        <div className="bg-black/20 p-6 rounded-sm border border-slate-800/50">
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-sm text-slate-300">
                                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-luxury-teal flex-shrink-0"/> Goat Brew (Probiotics)</li>
                                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-luxury-teal flex-shrink-0"/> Plasma (Immune System)</li>
                                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-luxury-teal flex-shrink-0"/> Omega Mania (Cognitive)</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Performance Stack Card */}
                <div 
                    onClick={() => setSelectedStack({ title: "Performance & Studs", items: PERFORMANCE_STACK })}
                    className="bg-slate-900/30 border border-slate-800 p-8 md:p-10 backdrop-blur-sm hover:border-purple-500/50 hover:bg-slate-900/50 transition-all rounded-sm relative overflow-hidden group cursor-pointer"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                         <Activity size={120} />
                    </div>
                     <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-purple-500/10 rounded-full text-purple-400">
                                <ShieldPlus size={24} />
                            </div>
                            <div>
                                <h4 className="font-serif text-2xl text-white group-hover:text-purple-400 transition-colors">Performance & Studs</h4>
                                <span className="text-xs text-slate-500 uppercase tracking-widest">Active Dog Add-Ons</span>
                            </div>
                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="text-luxury-teal" size={24} />
                            </div>
                        </div>
                        <p className="font-serif text-slate-400 leading-relaxed mb-8 max-w-xl">
                            Specialized additions for our studs and high-drive dogs. Focuses on reproductive health, heavy bone density, and joint longevity.
                        </p>
                        <div className="bg-black/20 p-6 rounded-sm border border-slate-800/50">
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-sm text-slate-300">
                                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-purple-400 flex-shrink-0"/> Gentleman’s Litter (Zinc/Mag)</li>
                                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-purple-400 flex-shrink-0"/> Joint Support (Structure)</li>
                                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-purple-400 flex-shrink-0"/> Added to Daily Stack</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: SIDEBAR (Anatomy + Calculator) */}
            <div className="lg:col-span-1 flex flex-col gap-6 h-full">
                 {/* Sidebar Header */}
                 <div className="flex items-end justify-between border-b border-slate-800 pb-4 mb-2 lg:mb-0">
                     <h3 className="font-serif text-xl text-slate-100">Tools</h3>
                     <span className="font-sans text-slate-500 text-[10px] tracking-widest uppercase mb-1">Setup</span>
                 </div>

                 {/* Anatomy of Meal */}
                 <div className="relative group bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-sm overflow-hidden flex-col justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-luxury-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <Disc className="text-luxury-teal mb-6" size={40} strokeWidth={1} />
                    <h3 className="font-serif text-2xl text-white mb-2">The Flat Plate</h3>
                    <p className="font-sans text-slate-500 text-[10px] uppercase tracking-widest mb-4">Sanitary Feeding</p>
                    <p className="font-serif text-slate-400 text-sm leading-relaxed mb-6">
                        We use the <strong>9-inch Stainless Steel Flat Plate</strong>. Eliminating edges prevents chin acne and bacterial buildup.
                    </p>
                    <a 
                        href="https://rawandpawco.com/products/stainless-steel-flat-feeding-plate" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-luxury-teal text-xs font-bold uppercase tracking-widest hover:text-white transition-colors mt-auto"
                    >
                        <ShoppingBag size={14} /> Shop Plate
                    </a>
                </div>

                {/* Calculator - Interactive */}
                <div className="relative group bg-gradient-to-br from-[#0f172a] to-[#020617] border border-slate-800 p-8 rounded-sm flex flex-col h-auto">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                        <Calculator size={80} />
                    </div>
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <Calculator className="text-amber-400" size={24} strokeWidth={1} />
                        <span className="text-amber-400 font-bold uppercase tracking-widest text-xs">Intake Calculator</span>
                    </div>

                    <div className="space-y-4 relative z-10">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-2">Dog Weight (lbs)</label>
                            <input 
                                type="number" 
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="w-full bg-black/40 border border-slate-700 p-3 text-white focus:border-amber-400 focus:outline-none transition-colors"
                                placeholder="25"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-2">Life Stage</label>
                            <select 
                                value={stage}
                                onChange={(e) => setStage(e.target.value)}
                                className="w-full bg-black/40 border border-slate-700 p-3 text-white focus:border-amber-400 focus:outline-none transition-colors appearance-none"
                            >
                                <option value="puppy_young">Puppy (2-4 Months)</option>
                                <option value="puppy_old">Puppy (4-12 Months)</option>
                                <option value="adult">Adult (Maintenance)</option>
                                <option value="active">Active / Stud / Pregnant</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-800 relative z-10">
                        <div className="flex justify-between items-end mb-4">
                            <span className="text-xs uppercase tracking-widest text-slate-500">Daily Total</span>
                            <div className="text-right">
                                {calculatedAmount ? (
                                    <>
                                        <span className="block font-serif text-2xl text-white">{calculatedAmount.lbs} lbs</span>
                                        <span className="text-xs text-amber-400 font-mono">({calculatedAmount.oz} oz)</span>
                                    </>
                                ) : (
                                    <span className="font-serif text-xl text-slate-600">--</span>
                                )}
                            </div>
                        </div>
                        <a 
                            href="https://rawandpawco.com/collections/raw" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full py-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all flex items-center justify-center gap-2"
                        >
                            Shop Raw
                        </a>
                    </div>
                </div>
            </div>

        </div>

        {/* --- SECTION 3: THE ESSENTIALS (Product Grid) --- */}
        <div className="mb-12">
            <h3 className="font-serif text-3xl text-slate-100 mb-8 border-l-4 border-luxury-teal pl-6">The Essentials Collection</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {PRODUCTS.map((product) => (
                    <div 
                        key={product.id} 
                        onClick={() => setSelectedProduct(product)}
                        className="relative bg-[#0f172a]/50 border border-slate-800 group p-6 flex flex-col items-center text-center overflow-hidden hover:border-luxury-teal/30 transition-all duration-500 h-full cursor-pointer"
                    >
                        
                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-gradient-to-b from-luxury-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        {/* Image Container */}
                        <div className="relative w-full aspect-square mb-6 overflow-hidden bg-slate-900 border border-slate-800 rounded-sm">
                            <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100 grayscale group-hover:grayscale-0"
                                crossOrigin="anonymous"
                            />
                            
                            {/* Quick Add Overlay */}
                            <div className="absolute inset-x-0 bottom-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-luxury-black/95 backdrop-blur-sm border-t border-luxury-teal/30">
                                <span className="font-sans text-[10px] text-luxury-teal uppercase tracking-widest flex items-center justify-center gap-2 font-bold">
                                    <FlaskConical size={12} /> View Analysis
                                </span>
                            </div>
                        </div>

                        <div className="flex-grow flex flex-col justify-between w-full">
                            <div>
                                <h3 className="font-serif text-xl text-white mb-2 group-hover:text-luxury-teal transition-colors">{product.name}</h3>
                                <p className="font-sans text-slate-500 text-[9px] tracking-widest uppercase mb-4">{product.subtitle}</p>
                                
                                <div className="h-px w-8 bg-luxury-teal/30 mb-4 mx-auto" />

                                <p className="font-sans text-slate-400 text-xs leading-relaxed mb-6 line-clamp-3">
                                    {product.description}
                                </p>
                            </div>
                            <span className="font-serif text-lg text-white group-hover:text-luxury-teal transition-colors">{product.price}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>

      {/* Stack Detail Modal */}
      {selectedStack && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
             <div className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity" onClick={() => setSelectedStack(null)} />
             
             <div className="relative z-10 w-full max-w-5xl bg-[#0a0a0a] border border-slate-800 flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300 rounded-sm max-h-[90vh]">
                 <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-[#020617]">
                     <div>
                        <h2 className="font-serif text-3xl md:text-4xl text-white">{selectedStack.title}</h2>
                        <p className="text-slate-500 text-xs uppercase tracking-widest mt-2">Recommended Feeding Regimen</p>
                     </div>
                     <button onClick={() => setSelectedStack(null)} className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-full">
                         <X size={20} />
                     </button>
                 </div>
                 
                 <div className="overflow-y-auto p-8 bg-[#0f172a]">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         {selectedStack.items.map((item, idx) => (
                             <div key={idx} className="bg-black/40 border border-slate-800 p-6 flex flex-col h-full hover:border-luxury-teal/30 transition-colors group">
                                 <div className="aspect-square bg-slate-900 mb-6 overflow-hidden relative border border-slate-800">
                                     {item.image ? (
                                         <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" crossOrigin="anonymous"/>
                                     ) : (
                                         <div className="w-full h-full flex items-center justify-center text-slate-700">
                                             <FlaskConical size={32} />
                                         </div>
                                     )}
                                 </div>
                                 <h3 className="font-serif text-xl text-white mb-2">{item.name}</h3>
                                 <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-grow">{item.description}</p>
                                 <a 
                                    href={item.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full py-3 border border-slate-700 text-slate-300 uppercase text-xs font-bold tracking-widest hover:bg-luxury-teal hover:text-black hover:border-luxury-teal transition-all text-center flex items-center justify-center gap-2"
                                 >
                                     <ShoppingBag size={14} /> Buy Now
                                 </a>
                             </div>
                         ))}
                     </div>
                 </div>
             </div>
          </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity" onClick={() => setSelectedProduct(null)} />
            
            <div className="relative z-10 w-full max-w-4xl bg-[#0a0a0a] border border-slate-800 flex flex-col md:flex-row overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300 rounded-sm">
                
                {/* Close Button */}
                <button 
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-4 right-4 z-50 p-2 text-slate-500 hover:text-white bg-black/50 rounded-full backdrop-blur-md"
                >
                    <X size={24} />
                </button>

                {/* Left: Image */}
                <div className="w-full md:w-1/2 bg-slate-900 relative h-64 md:h-auto">
                    <img 
                        src={selectedProduct.image} 
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover opacity-90"
                        crossOrigin="anonymous"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
                </div>

                {/* Right: Content */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
                    <div className="mb-auto">
                        <span className="block font-sans text-luxury-teal text-[10px] tracking-[0.25em] uppercase mb-4">
                            {selectedProduct.subtitle}
                        </span>
                        <h2 className="font-serif text-4xl text-white mb-6">{selectedProduct.name}</h2>
                        
                        {/* Editorial Typography Update */}
                        <p className="font-display text-slate-400 text-lg leading-[1.8] tracking-[0.05em] font-normal mb-8">
                            {selectedProduct.description}
                        </p>

                        <div className="mb-8">
                            <h4 className="font-sans text-xs font-bold text-white uppercase tracking-widest mb-4">Genetic Benefits</h4>
                            <ul className="space-y-3">
                                {selectedProduct.benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start gap-3 text-slate-400 text-sm">
                                        <CheckCircle2 size={16} className="text-luxury-teal mt-0.5 flex-shrink-0" />
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-800 flex flex-col gap-4">
                        <div className="flex justify-between items-center mb-2">
                             <span className="text-slate-500 text-xs uppercase tracking-widest">Investment</span>
                             <span className="font-serif text-2xl text-white">{selectedProduct.price}</span>
                        </div>
                        <a 
                            href={selectedProduct.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full py-4 bg-gradient-to-r from-amber-200 to-amber-500 text-black font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_40px_rgba(251,191,36,0.5)] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                        >
                            <ShoppingBag size={18} /> Buy at Raw & Paw
                        </a>
                    </div>
                </div>
            </div>
        </div>
      )}
    </section>
  );
};

export default Protocol;
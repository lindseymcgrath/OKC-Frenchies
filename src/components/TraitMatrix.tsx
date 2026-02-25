import React from 'react';
import { TRAITS } from '../constants';
import { Hexagon, ChevronRight, Dna } from 'lucide-react';
import { Link } from 'react-router-dom';

const TraitMatrix: React.FC = () => {
  // Helper to determine styles based on Trait Code
  const getTraitStyles = (code: string) => {
      const upperCode = code.toUpperCase();
      
      if (upperCode.includes('EA')) {
          // #FF00FF - Magenta / Purple for Legendary eA
          return {
              containerClass: "border-fuchsia-900/50 shadow-[0_0_20px_rgba(192,38,211,0.1)] hover:shadow-[0_0_50px_rgba(192,38,211,0.3)] bg-slate-900/40 hover:border-fuchsia-500/50",
              textClass: "text-fuchsia-400",
              labelClass: "text-fuchsia-300 border-fuchsia-500/30 bg-fuchsia-500/10",
              iconClass: "text-fuchsia-500",
              buttonClass: "hover:bg-fuchsia-600 border-fuchsia-500 text-fuchsia-200",
              lineClass: "bg-fuchsia-500",
          };
      } else if (upperCode.includes('RSPO2') || upperCode.includes('FLOODLE')) {
          // #FFD700 - Gold for Ultra Rare
          return {
              containerClass: "border-amber-900/50 shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:shadow-[0_0_50px_rgba(245,158,11,0.3)] bg-slate-900/40 hover:border-amber-500/50",
              textClass: "text-amber-400",
              labelClass: "text-amber-300 border-amber-500/30 bg-amber-500/10",
              iconClass: "text-amber-500",
              buttonClass: "hover:bg-amber-600 border-amber-500 text-amber-200",
              lineClass: "bg-amber-500",
          };
      } else if (upperCode.includes('PINK')) {
          // #FF69B4 - Pink
          return {
              containerClass: "border-rose-900/50 shadow-[0_0_20px_rgba(244,63,94,0.1)] hover:shadow-[0_0_50px_rgba(244,63,94,0.3)] bg-slate-900/40 hover:border-rose-500/50",
              textClass: "text-rose-400",
              labelClass: "text-rose-300 border-rose-500/30 bg-rose-500/10",
              iconClass: "text-rose-500",
              buttonClass: "hover:bg-rose-600 border-rose-500 text-rose-200",
              lineClass: "bg-rose-500",
          };
      }
      
      // Default Luxury Teal
      return {
          containerClass: "border-slate-800 hover:border-luxury-teal/50 hover:shadow-[0_0_30px_rgba(45,212,191,0.1)] bg-slate-900/40",
          textClass: "text-luxury-teal",
          labelClass: "text-luxury-teal border-luxury-teal/50 bg-luxury-teal/5",
          iconClass: "text-luxury-teal",
          buttonClass: "hover:bg-luxury-teal border-luxury-teal text-luxury-teal",
          lineClass: "bg-luxury-teal",
      };
  };

  // Logic to map trait card to specific glossary term
  const getGlossaryTarget = (code: string) => {
     const upper = code.toUpperCase();
     if (upper.includes('EA')) return 'Ancient Red';
     if (upper.includes('RSPO2')) return 'Floodle';
     if (upper.includes('PINK')) return 'Pink';
     return '';
  };

  return (
    <section id="genetics" className="py-32 bg-[#020617] relative border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <div>
            <h2 className="font-serif text-4xl md:text-6xl text-slate-100 mb-2">The Trait Matrix</h2>
            <p className="font-sans text-luxury-teal text-xs tracking-[0.25em] uppercase">Visual DNA • The Science</p>
          </div>
          <div className="mt-6 md:mt-0 max-w-md">
            <p className="font-sans text-slate-500 text-sm leading-relaxed text-right">
              We define the standard for the exotic market. 
              Our program focuses on three key genetic pillars.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TRAITS.map((trait) => {
            const styles = getTraitStyles(trait.code);
            const targetTerm = getGlossaryTarget(trait.code);
            
            return (
                <Link 
                  to={`/genetics${targetTerm ? `?term=${encodeURIComponent(targetTerm)}` : ''}`}
                  key={trait.id} 
                  className={`group relative p-8 cursor-pointer overflow-hidden backdrop-blur-sm transition-all duration-500 border block min-h-[300px] transform hover:-translate-y-1 ${styles.containerClass}`}
                >
                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 p-4 opacity-30 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:rotate-90">
                     <Hexagon className={styles.iconClass} size={40} strokeWidth={1} />
                  </div>
                  
                  {/* Visual Feedback Arrow */}
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                     <ChevronRight className={styles.iconClass} size={24} />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="mb-auto">
                        <span className={`inline-block px-3 py-1 text-[10px] uppercase tracking-widest font-bold border rounded-sm mb-6 ${styles.labelClass}`}>
                          {trait.rarity}
                        </span>
                        <h3 className={`font-serif text-4xl mb-2 ${styles.textClass}`}>{trait.code}</h3>
                        <h4 className="font-sans text-xs text-slate-500 uppercase tracking-[0.2em]">{trait.name}</h4>
                    </div>

                    <div className="mt-8">
                        <div className={`h-px w-12 mb-6 ${styles.lineClass} opacity-50`} />
                        {/* Editorial Typography */}
                        <p className="font-display text-slate-300 text-sm leading-[1.8] tracking-[0.05em] font-normal line-clamp-3">
                            {trait.description}
                        </p>
                    </div>
                  </div>

                  {/* Hover effect bottom bar */}
                  <div className={`absolute bottom-0 left-0 w-0 h-1 ${styles.lineClass} group-hover:w-full transition-all duration-700 ease-out`} />
                </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default TraitMatrix;
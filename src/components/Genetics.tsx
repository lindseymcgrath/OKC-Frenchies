import React, { useEffect, useState } from 'react';
import { Dna, Loader2, AlertTriangle, Atom, X, FileText } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

interface GlossaryTerm {
  id: string;
  term: string;
  locus: string;
  category: string;
  definition: string;
  moreInfo: string;
}

const Genetics: React.FC = () => {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const [searchParams] = useSearchParams();
  const [initialDeepLinkDone, setInitialDeepLinkDone] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedTerm) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedTerm]);

  // Fetch Data
  useEffect(() => {
    const SHEET_ID = '153OocA25gmPaynCxCjJQKVZa2abVJ44lsDZv25U0ul8';
    const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Glossary`;

    fetch(CSV_URL)
      .then(r => {
        if (!r.ok) throw new Error("Network response was not ok");
        return r.text();
      })
      .then(csvText => {
         if ((window as any).Papa) {
            (window as any).Papa.parse(csvText, {
                header: false, // switched to manual mapping for maximum robustness
                skipEmptyLines: true,
                complete: (results: any) => {
                    const rows = results.data;
                    if (!rows || rows.length < 2) {
                        // Not enough data
                        setLoading(false);
                        return;
                    }

                    // 1. Clean and Map Headers (Row 0)
                    // We normalize to lowercase to avoid case-sensitivity issues
                    const headers = rows[0].map((h: any) => String(h).trim().toLowerCase().replace(/^[\uFEFF\uFFFE]/, ''));
                    
                    const termIdx = headers.indexOf('term');
                    const defIdx = headers.indexOf('definition');
                    const catIdx = headers.indexOf('category');
                    const locIdx = headers.indexOf('locus');
                    const infoIdx = headers.indexOf('more_info');

                    if (termIdx === -1 || defIdx === -1) {
                         console.error("Missing required columns: Term or Definition");
                         setError("Database Schema Mismatch: Missing columns.");
                         setLoading(false);
                         return;
                    }

                    // 2. Process Data Rows (Row 1 -> End)
                    const fetchedTerms = rows.slice(1).map((row: any[], idx: number) => {
                        // Helper to safely get string at index
                        const getVal = (index: number) => (index !== -1 && row[index]) ? String(row[index]).trim() : '';

                        const term = getVal(termIdx);
                        const definition = getVal(defIdx);

                        // Skip rows that don't have the bare minimum
                        if (!term || !definition) return null;

                        return {
                            id: `term-${idx}`,
                            term: term,
                            locus: getVal(locIdx),
                            category: getVal(catIdx) || 'General',
                            definition: definition,
                            moreInfo: getVal(infoIdx)
                        };
                    }).filter((t: any) => t !== null);
                    
                    setTerms(fetchedTerms);
                    setLoading(false);
                },
                error: (err: any) => {
                    setError("Failed to parse genetic data.");
                    setLoading(false);
                }
            });
         }
      })
      .catch(err => {
          console.error(err);
          setError("Connection to genetic database failed.");
          setLoading(false);
      });
  }, []);

  // Deep Link Logic: Auto-open modal if ?term=... matches
  useEffect(() => {
    const requestedTerm = searchParams.get('term');
    if (!loading && terms.length > 0 && requestedTerm && !initialDeepLinkDone) {
        const target = requestedTerm.toLowerCase();
        
        // Find best match (Exact -> Contains Term -> Contains Locus)
        const match = terms.find(t => t.term.toLowerCase() === target) ||
                      terms.find(t => t.term.toLowerCase().includes(target)) ||
                      terms.find(t => t.locus.toLowerCase().includes(target));

        if (match) {
            setSelectedTerm(match);
        }
        setInitialDeepLinkDone(true);
    }
  }, [loading, terms, searchParams, initialDeepLinkDone]);

  // Helper: Visual Logic based on Category
  const getCardStyles = (category: string) => {
      const cat = category.toLowerCase();
      
      // Pink/Magenta: Pigmentation, Saturation
      if (cat.includes('pigment') || cat.includes('saturation') || cat.includes('color')) {
          return {
              border: 'border-fuchsia-500/30 hover:border-fuchsia-500',
              glow: 'hover:shadow-[0_0_40px_rgba(217,70,239,0.2)]',
              text: 'text-fuchsia-400',
              bg: 'bg-fuchsia-500/5',
              badge: 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20'
          };
      }
      // Gold: Texture (Fluffy, Wire, etc)
      if (cat.includes('texture') || cat.includes('hair') || cat.includes('coat')) {
          return {
              border: 'border-amber-500/30 hover:border-amber-500',
              glow: 'hover:shadow-[0_0_40px_rgba(251,191,36,0.2)]',
              text: 'text-amber-400',
              bg: 'bg-amber-500/5',
              badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20'
          };
      }
      // Teal: Pattern, Biological, Structure (Default Luxury)
      return {
          border: 'border-luxury-teal/30 hover:border-luxury-teal',
          glow: 'hover:shadow-[0_0_40px_rgba(45,212,191,0.2)]',
          text: 'text-luxury-teal',
          bg: 'bg-luxury-teal/5',
          badge: 'bg-luxury-teal/10 text-luxury-teal border-luxury-teal/20'
      };
  };

  // Get unique categories for filter bar
  const categories = ['All', ...Array.from(new Set(terms.map(t => t.category)))];

  const filteredTerms = activeFilter === 'All' 
    ? terms 
    : terms.filter(t => t.category === activeFilter);

  return (
    <section className="min-h-screen bg-[#020617] pt-32 pb-20 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-luxury-teal/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
            <h1 className="font-display text-5xl md:text-7xl text-slate-100 mb-6">
                The Genetic Encyclopedia
            </h1>
            <div className="flex justify-center items-center gap-4 mb-8">
               <div className="h-px w-12 bg-slate-800" />
               <p className="font-sans text-luxury-teal text-xs tracking-[0.3em] uppercase">OKC Frenchies Proprietary Data</p>
               <div className="h-px w-12 bg-slate-800" />
            </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all border ${
                        activeFilter === cat 
                            ? 'bg-slate-100 text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                            : 'bg-slate-900/50 text-slate-400 border-slate-700 hover:border-luxury-teal hover:text-white'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* Content */}
        {loading && (
             <div className="flex flex-col items-center justify-center py-20">
                 <Loader2 className="animate-spin text-luxury-teal mb-4" size={48} />
                 <p className="font-sans text-slate-400 text-sm tracking-widest uppercase">Sequencing DNA...</p>
             </div>
        )}

        {error && (
            <div className="flex flex-col items-center justify-center py-20 border border-red-900/50 bg-red-900/10 rounded p-8">
                <AlertTriangle className="text-red-500 mb-4" size={48} />
                <p className="text-red-300 font-mono text-sm">{error}</p>
            </div>
        )}

        {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTerms.map((term) => {
                    const styles = getCardStyles(term.category);
                    return (
                        <div 
                            key={term.id}
                            onClick={() => setSelectedTerm(term)}
                            className={`group relative p-8 bg-[#0a0a0a]/80 backdrop-blur-md border rounded-sm transition-all duration-500 transform hover:scale-[1.02] cursor-pointer ${styles.border} ${styles.glow}`}
                        >
                            {/* Top Row: Category */}
                            <div className="flex justify-between items-start mb-6">
                                <span className={`px-3 py-1 text-[9px] uppercase tracking-widest font-bold border rounded-sm ${styles.badge}`}>
                                    {term.category}
                                </span>
                                <Atom size={16} className={`${styles.text} opacity-50`} />
                            </div>

                            {/* Middle Row: Term & Locus */}
                            <div className="mb-6">
                                <h3 className="font-display text-3xl text-slate-100 mb-1 group-hover:text-white transition-colors">
                                    {term.term}
                                </h3>
                                {/* Safe render: Only show Locus if it contains content */}
                                {term.locus && term.locus !== '' && (
                                    <span className="font-mono text-xs text-slate-500 italic">
                                        Locus: {term.locus}
                                    </span>
                                )}
                            </div>

                            {/* Divider */}
                            <div className={`h-px w-8 ${styles.bg.replace('/5', '')} opacity-50 mb-6 group-hover:w-full transition-all duration-700`} />

                            {/* Definition */}
                            <p className="font-sans text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors line-clamp-3">
                                {term.definition}
                            </p>

                             {/* Read More Indicator */}
                             <div className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-600 group-hover:text-slate-400 transition-colors">
                                <FileText size={12} /> View Analysis
                            </div>

                            {/* Background decoration */}
                            <div className={`absolute top-0 right-0 w-32 h-32 ${styles.bg} rounded-bl-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
                        </div>
                    );
                })}
            </div>
        )}
      </div>

      {/* Expanded Info Modal */}
      {selectedTerm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity" onClick={() => setSelectedTerm(null)} />
            
            <div className="relative z-10 w-full max-w-2xl bg-[#0a0a0a] border border-slate-800 p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-300 rounded-sm overflow-y-auto max-h-[90vh]">
                <button 
                    onClick={() => setSelectedTerm(null)}
                    className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors border border-transparent hover:border-slate-800 rounded-full"
                >
                    <X size={24} />
                </button>
                
                <div className="mb-8">
                     <span className={`
                        inline-block px-3 py-1 text-[10px] uppercase tracking-widest font-bold border mb-4
                        ${getCardStyles(selectedTerm.category).badge}
                    `}>
                        {selectedTerm.category}
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl text-white mb-2">{selectedTerm.term}</h2>
                    {selectedTerm.locus && selectedTerm.locus !== '' && (
                         <span className="font-mono text-sm text-slate-500 italic block">
                            Genetic Locus: <span className="text-slate-300">{selectedTerm.locus}</span>
                        </span>
                    )}
                </div>
                
                <div className={`h-px w-full bg-gradient-to-r from-slate-800 to-transparent mb-10`} />
                
                <div className="prose prose-invert max-w-none">
                    <h4 className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-4">Core Definition</h4>
                    {/* Editorial Typography Applied */}
                    <p className="font-display text-slate-300 text-lg leading-[1.8] tracking-[0.05em] font-normal mb-8">
                        {selectedTerm.definition}
                    </p>

                    {selectedTerm.moreInfo && selectedTerm.moreInfo !== '' && (
                        <>
                            <h4 className="text-luxury-teal text-xs uppercase tracking-widest font-bold mb-4">Deep Dive Analysis</h4>
                            {/* Editorial Typography & HTML Rendering */}
                            <div 
                                className="font-display text-slate-300 leading-[1.8] tracking-[0.05em] text-base bg-slate-900/30 p-6 border-l-2 border-luxury-teal/30 space-y-6 font-normal"
                                dangerouslySetInnerHTML={{ __html: selectedTerm.moreInfo }}
                            />
                        </>
                    )}
                </div>
                
                <div className="mt-12 flex justify-end">
                    <button 
                        onClick={() => setSelectedTerm(null)}
                        className={`px-8 py-3 font-sans text-xs font-bold uppercase tracking-[0.2em] transition-colors border bg-transparent hover:text-white ${getCardStyles(selectedTerm.category).text} ${getCardStyles(selectedTerm.category).border}`}
                    >
                        Close Record
                    </button>
                </div>
            </div>
        </div>
      )}
    </section>
  );
};

export default Genetics;
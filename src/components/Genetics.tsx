import React, { useEffect, useState } from 'react';
import { Loader2, AlertTriangle, Atom, X, FileText, Dna } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import SEO from './SEO';
import glossaryData from '../data/glossary.json';

interface GlossaryTerm {
  id: string;
  term: string;
  locus: string;
  category: string;
  definition: string;
  moreInfo: string;
}

const Genetics: React.FC = () => {
  const [terms] = useState<GlossaryTerm[]>(glossaryData as GlossaryTerm[]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const [searchParams, setSearchParams] = useSearchParams();

  const openTerm = (term: GlossaryTerm, updateUrl = true) => {
    setSelectedTerm(term);
    if (updateUrl) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('term', term.term.toLowerCase());
      setSearchParams(newParams);
    }
  };

  const closeTerm = () => {
    setSelectedTerm(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('term');
    setSearchParams(newParams, { replace: true });
  };

  useEffect(() => {
    if (selectedTerm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedTerm]);

  useEffect(() => {
    const requestedTerm = searchParams.get('term');
    if (!loading && terms.length > 0 && requestedTerm) {
      const target = requestedTerm.toLowerCase();
      const match =
        terms.find((t) => t.term.toLowerCase() === target) ||
        terms.find((t) => t.term.toLowerCase().includes(target)) ||
        terms.find((t) => t.locus.toLowerCase().includes(target));

      if (match && (!selectedTerm || match.id !== selectedTerm.id)) {
        openTerm(match, false);
      }
    } else if (!requestedTerm && selectedTerm) {
      setSelectedTerm(null);
    }
  }, [loading, terms, searchParams]);

  const getCardStyles = (category: string) => {
    const cat = category.toLowerCase();

    if (cat.includes('pigment') || cat.includes('saturation') || cat.includes('color')) {
      return {
        border: 'border-[#EAE5D9] hover:border-[#D46A4E]',
        accent: 'text-[#D46A4E]',
        divider: 'bg-[#D46A4E]',
        badge: 'bg-[#FADADD]/60 text-[#8B263E] border-[#F3B8C5]'
      };
    }

    if (cat.includes('texture') || cat.includes('hair') || cat.includes('coat')) {
      return {
        border: 'border-[#EAE5D9] hover:border-[#E5BE5C]',
        accent: 'text-[#B7791F]',
        divider: 'bg-[#F4D37E]',
        badge: 'bg-[#F4D37E]/50 text-[#1C2621] border-[#E5BE5C]'
      };
    }

    return {
      border: 'border-[#EAE5D9] hover:border-[#2E5A44]',
      accent: 'text-[#2E5A44]',
      divider: 'bg-[#2E5A44]',
      badge: 'bg-[#E3EFE8] text-[#2E5A44] border-[#C5DFD0]'
    };
  };

  const categories = ['All', ...Array.from(new Set(terms.map((t) => t.category)))];

  const filteredTerms =
    activeFilter === 'All' ? terms : terms.filter((t) => t.category === activeFilter);

  return (
    <section className="min-h-screen bg-[#F6F4EE] text-[#1C2621] py-14 relative overflow-hidden">
      <div className="max-w-[1340px] mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-[#E3EFE8] text-[#2E5A44] font-sans font-bold text-xs px-4 py-1.5 rounded-full mb-4">
            <Dna size={14} /> OKC Frenchies Coat &amp; Color Guide
          </span>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-[#1C2621] mb-4">
            The Genetic Encyclopedia
          </h1>
          <p className="font-sans text-[#5C6B63] max-w-2xl mx-auto text-base leading-relaxed">
            Explore the rare loci, coat textures, and color genetics behind our French Bulldogs and Mini English Bulldogs. Tap any card for a deeper breakdown.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border cursor-pointer ${
                activeFilter === cat
                  ? 'bg-[#2E5A44] text-white border-[#2E5A44] shadow-sm'
                  : 'bg-white text-[#1C2621] border-[#DCD6C8] hover:border-[#2E5A44]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#2E5A44] mb-4" size={44} />
            <p className="font-sans text-[#5C6B63] text-sm font-bold uppercase tracking-wider">
              Loading Genetics...
            </p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-16 border border-red-300 bg-red-50 rounded-3xl p-8">
            <AlertTriangle className="text-red-500 mb-4" size={44} />
            <p className="text-red-600 font-mono text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTerms.map((term) => {
              const styles = getCardStyles(term.category);
              return (
                <div
                  key={term.id}
                  onClick={() => openTerm(term)}
                  className={`group relative p-7 bg-white border rounded-3xl shadow-[0_10px_28px_rgba(28,38,33,0.05)] hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(28,38,33,0.09)] transition-all duration-300 cursor-pointer flex flex-col ${styles.border}`}
                >
                  <div className="flex justify-between items-start mb-5">
                    <span
                      className={`px-3 py-1 text-[11px] uppercase tracking-wider font-bold border rounded-full ${styles.badge}`}
                    >
                      {term.category}
                    </span>
                    <Atom size={18} className={`${styles.accent} opacity-60`} />
                  </div>

                  <div className="mb-4">
                    <h3 className="font-display font-bold text-3xl text-[#1C2621] mb-1 group-hover:text-[#2E5A44] transition-colors">
                      {term.term}
                    </h3>
                    {term.locus && term.locus !== '' && (
                      <span className="font-mono text-xs text-[#5C6B63] font-semibold">
                        Locus: {term.locus}
                      </span>
                    )}
                  </div>

                  <div className={`h-1 w-10 rounded-full ${styles.divider} opacity-60 mb-4 group-hover:w-20 transition-all duration-300`} />

                  <p className="font-sans text-sm text-[#5C6B63] leading-relaxed line-clamp-3 mb-6">
                    {term.definition}
                  </p>

                  <div className="mt-auto pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-xs font-bold text-[#2E5A44]">
                    <span className="flex items-center gap-1.5">
                      <FileText size={13} /> Read Full Guide
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Expanded Info Modal */}
      {selectedTerm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1C2621]/60 backdrop-blur-sm"
          onClick={closeTerm}
        >
          <SEO
            title={`${selectedTerm.term} | OKC Frenchies Genetic Encyclopedia`}
            description={selectedTerm.definition.slice(0, 160)}
          />

          <div
            className="relative z-10 w-full max-w-2xl bg-[#F6F4EE] border border-[#DCD6C8] rounded-3xl p-7 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeTerm}
              className="absolute top-5 right-5 p-2.5 bg-white text-[#1C2621] hover:bg-[#E3EFE8] rounded-full shadow-xs cursor-pointer"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <span
                className={`inline-block px-3.5 py-1 text-xs uppercase tracking-wider font-bold border rounded-full mb-3 ${getCardStyles(selectedTerm.category).badge}`}
              >
                {selectedTerm.category}
              </span>
              <h2 className="font-display font-bold text-4xl text-[#1C2621] mb-2">
                {selectedTerm.term}
              </h2>
              {selectedTerm.locus && selectedTerm.locus !== '' && (
                <span className="font-mono text-sm text-[#5C6B63] block">
                  Genetic Locus: <span className="font-bold text-[#2E5A44]">{selectedTerm.locus}</span>
                </span>
              )}
            </div>

            <div className="h-px w-full bg-[#DCD6C8] mb-6" />

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-[#EAE5D9]">
                <h4 className="text-[#2E5A44] text-xs uppercase tracking-wider font-bold mb-2">
                  Core Definition
                </h4>
                <p className="font-sans text-[#1C2621] text-base leading-relaxed">
                  {selectedTerm.definition}
                </p>
              </div>

              {selectedTerm.moreInfo && selectedTerm.moreInfo !== '' && (
                <div className="bg-white p-6 rounded-2xl border-l-4 border-[#2E5A44] border-y border-r border-[#EAE5D9]">
                  <h4 className="text-[#D46A4E] text-xs uppercase tracking-wider font-bold mb-3">
                    Deep Dive Analysis
                  </h4>
                  <div
                    className="font-sans text-[#5C6B63] leading-relaxed text-sm space-y-4"
                    dangerouslySetInnerHTML={{ __html: selectedTerm.moreInfo }}
                  />
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={closeTerm}
                className="px-7 py-3 bg-[#2E5A44] hover:bg-[#234735] text-white font-sans text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer"
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

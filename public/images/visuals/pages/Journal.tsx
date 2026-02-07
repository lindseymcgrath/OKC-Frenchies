import React from 'react';
import { ArrowUpRight, BookOpen } from 'lucide-react';

const ARTICLES = [
  {
    id: 1,
    title: "The Future of Fluffy Frenchies",
    excerpt: "Exploring the RSPO2 gene and the evolution of the visual standard in modern breeding programs.",
    category: "Genetics",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Supplement Stacks 101",
    excerpt: "Why goat milk and plasma are replacing traditional kibble for elite show dogs.",
    category: "Nutrition",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255db?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "Defining the 'Rope'",
    excerpt: "Structure analysis: What judges look for in the nose rope on Mini English Bulldogs.",
    category: "Structure",
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800"
  }
];

const Journal: React.FC = () => {
  return (
    <section className="min-h-screen bg-[#020617] text-slate-200 pt-32 pb-20 relative overflow-hidden">
       {/* Background Elements */}
       <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay pointer-events-none"></div>
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-luxury-teal/5 rounded-full blur-[120px] pointer-events-none"></div>

       <div className="max-w-6xl mx-auto px-6 relative z-10">
          
          {/* Editorial Header */}
          <div className="text-center mb-24">
            <h1 className="font-serif text-6xl md:text-9xl font-bold tracking-tighter mb-6 text-slate-100">THE JOURNAL</h1>
            <div className="flex justify-center items-center gap-4">
               <div className="h-px w-12 bg-luxury-teal/50" />
               <p className="font-serif text-xs tracking-[0.4em] uppercase text-luxury-teal">Okc Frenchies Editorial</p>
               <div className="h-px w-12 bg-luxury-teal/50" />
            </div>
          </div>

          {/* Featured Article - Dark Magazine Layout */}
          <div className="mb-32 group cursor-pointer grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] overflow-hidden border border-slate-800">
               <img 
                 src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=1600" 
                 alt="Featured" 
                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60"></div>
            </div>
            <div className="flex flex-col justify-center">
                <span className="inline-flex items-center gap-2 font-serif text-xs font-bold uppercase tracking-widest mb-6 text-luxury-teal border-l-2 border-luxury-teal pl-4">
                   <BookOpen size={14} /> Featured Story
                </span>
                <h2 className="font-serif text-4xl md:text-6xl leading-tight mb-6 text-slate-100 group-hover:text-luxury-teal transition-colors">
                    The Isabella Revolution
                </h2>
                <p className="font-serif text-lg text-slate-400 leading-relaxed mb-8 border-l border-slate-800 pl-6">
                    An in-depth look at the bb dd genetics that created the world's most sought-after coat color and what it means for the future of the breed.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-300 group-hover:text-luxury-teal transition-colors">
                    Read Article <ArrowUpRight size={16} />
                </div>
            </div>
          </div>

          {/* Article Grid - Luxury Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-20 border-t border-slate-800 pt-20">
             {ARTICLES.map(article => (
                <article key={article.id} className="group cursor-pointer">
                    <div className="aspect-[3/4] overflow-hidden mb-8 border border-slate-800 relative">
                        <img 
                            src={article.image} 
                            alt={article.title} 
                            className="w-full h-full object-cover opacity-70 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-luxury-teal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <span className="block font-serif text-[10px] font-bold uppercase tracking-widest mb-4 text-luxury-teal">{article.category}</span>
                        <h3 className="font-serif text-2xl mb-4 leading-tight text-slate-200 group-hover:text-white transition-colors">{article.title}</h3>
                        <p className="font-sans text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                            {article.excerpt}
                        </p>
                    </div>
                </article>
             ))}
          </div>

       </div>
    </section>
  );
};

export default Journal;
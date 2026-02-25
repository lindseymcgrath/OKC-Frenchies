import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const ARTICLES = [
  {
    id: 1,
    title: "The Future of Fluffy Frenchies",
    excerpt: "Exploring the RSPO2 gene and the evolution of the visual standard in modern breeding.",
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
    <section className="min-h-screen bg-[#f8f8f8] text-[#0a0a0a] pt-32 pb-20">
       <div className="max-w-5xl mx-auto px-6">
          
          {/* Editorial Header */}
          <div className="text-center mb-24">
            <h1 className="font-serif text-6xl md:text-9xl font-bold tracking-tighter mb-6">THE JOURNAL</h1>
            <div className="flex justify-center items-center gap-4">
               <div className="h-px w-12 bg-black" />
               <p className="font-sans text-xs tracking-[0.3em] uppercase">Okc Frenchies Editorial</p>
               <div className="h-px w-12 bg-black" />
            </div>
          </div>

          {/* Featured Article */}
          <div className="mb-24 group cursor-pointer">
            <div className="relative aspect-[21/9] overflow-hidden mb-8">
               <img 
                 src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=1600" 
                 alt="Featured" 
                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
               />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="max-w-2xl">
                    <span className="block font-sans text-xs font-bold uppercase tracking-widest mb-4 text-luxury-tealDark">Featured Story</span>
                    <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-4 group-hover:text-luxury-tealDark transition-colors">
                        The Isabella Revolution: Understanding the Dilution Gene
                    </h2>
                    <p className="font-serif text-lg text-gray-600 leading-relaxed">
                        An in-depth look at the bb dd genetics that created the world's most sought-after coat color.
                    </p>
                </div>
                <div>
                   <button className="h-12 w-12 border border-black rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                      <ArrowUpRight size={20} />
                   </button>
                </div>
            </div>
          </div>

          {/* Article Grid - Minimalist */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16 border-t border-black pt-16">
             {ARTICLES.map(article => (
                <article key={article.id} className="group cursor-pointer">
                    <div className="aspect-[3/4] overflow-hidden mb-6 bg-gray-200">
                        <img 
                            src={article.image} 
                            alt={article.title} 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                    <span className="block font-sans text-[10px] font-bold uppercase tracking-widest mb-3 text-gray-400">{article.category}</span>
                    <h3 className="font-serif text-2xl mb-3 leading-tight group-hover:underline decoration-1 underline-offset-4">{article.title}</h3>
                    <p className="font-serif text-sm text-gray-500 leading-relaxed">
                        {article.excerpt}
                    </p>
                </article>
             ))}
          </div>

       </div>
    </section>
  );
};

export default Journal;
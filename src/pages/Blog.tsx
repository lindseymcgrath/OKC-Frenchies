import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpRight, BookOpen, Loader2, X, Calendar, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';

const getString = (val: any): string => {
  if (val === null || val === undefined) return '';
  return String(val).trim();
};

const renderContent = (content: string) => {
    if (!content) return <p className="text-slate-500 italic">No content available.</p>;
    
    // Editorial Typography for Article Content
    return content.split(/\n\s*\n/).map((block, idx) => {
        return (
            <div 
                key={idx} 
                className="mb-8 last:mb-0 leading-[1.8] text-lg text-slate-300 font-display font-normal tracking-[0.05em]"
                dangerouslySetInnerHTML={{ __html: block }}
            />
        );
    });
};

const getDirectDriveLink = (url: string) => {
  if (!url) return '';
  const cleanUrl = getString(url);
  // Robust ID extraction for various Google Drive link formats
  const idRegex = /[-\w]{25,}/;
  const match = cleanUrl.match(idRegex);
  if (match && match[0]) {
      return `https://lh3.googleusercontent.com/d/${match[0]}=s1600`;
  }
  return cleanUrl;
};

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  image: string;
  date: string;
  tags: string[];
}

const Blog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const postParam = searchParams.get('post');
    if (posts.length > 0 && postParam) {
      const postIdOrName = postParam.toLowerCase();
      const foundPost = posts.find(p => p.id.toLowerCase() === postIdOrName || p.title.toLowerCase() === postIdOrName);
      if (foundPost && (!selectedPost || foundPost.id !== selectedPost.id)) {
        openPost(foundPost, false);
      }
    } else if (!postParam && selectedPost) {
      setSelectedPost(null);
    }
  }, [posts, searchParams]);

  const openPost = (post: BlogPost, updateUrl = true) => {
    setSelectedPost(post);
    if (updateUrl) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('post', post.id.toLowerCase());
      setSearchParams(newParams);
    }
  };

  const closePost = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedPost(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('post');
    setSearchParams(newParams, { replace: true });
  };

  useEffect(() => {
    if (selectedPost) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedPost]);

  useEffect(() => {
    const SHEET_ID = '153OocA25gmPaynCxCjJQKVZa2abVJ44lsDZv25U0ul8';
    const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Journal`;

    fetch(CSV_URL)
      .then(r => {
          if (!r.ok) throw new Error("Failed to fetch sheet");
          return r.text();
      })
      .then(csvText => {
         if ((window as any).Papa) {
            (window as any).Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true, 
                transformHeader: (h: string) => h.trim(),
                complete: (results: any) => {
                    const fetchedPosts = results.data
                        .map((row: any, idx: number) => {
                            // Robust column mapping
                            const getVal = (possibleNames: string[]) => {
                                for (const name of possibleNames) {
                                    if (row[name] !== undefined) return getString(row[name]);
                                }
                                return '';
                            };

                            const rawTitle = getVal(['Title', 'name', 'Post Title']);
                            if (!rawTitle) return null;

                            return {
                                id: getVal(['Slug', 'slug', 'id']) || `post-${idx}`,
                                title: rawTitle,
                                summary: getVal(['Summary', 'summary', 'Excerpt', 'excerpt']),
                                content: getVal(['Content', 'content', 'Body', 'body']),
                                category: getVal(['Category', 'category']) || 'Journal',
                                image: getDirectDriveLink(getVal(['Featured_Image', 'image_url', 'Image_URL', 'Image', 'image', 'main_image'])),
                                date: getVal(['Date', 'date']) || new Date().toLocaleDateString(),
                                tags: getVal(['Tags', 'tags']).split(',').map((t: string) => t.trim()).filter(Boolean)
                            };
                        })
                        .filter((post: BlogPost | null) => post !== null);
                    
                    setPosts(fetchedPosts);
                    setLoading(false);
                },
                error: (err: any) => {
                    console.error("CSV Parse Error:", err);
                    setLoading(false);
                }
            });
         }
      })
      .catch(err => {
          console.error("Failed to load blog posts:", err);
          setLoading(false);
      });
  }, []);

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const gridPosts = posts.length > 1 ? posts.slice(1) : [];

  return (
    <section className="min-h-screen bg-[#020617] text-slate-200 pt-32 pb-20 relative">
       <SEO 
         title="French Bulldog Breeding Blog | OKC Frenchies"
         description="Follow the OKC Frenchies editorial for expert insights into French Bulldog breeding protocols, DNA analysis, and canine reproduction."
         url="https://okcfrenchies.com/french-bulldog-breeding-blog"
       />
       {/* Background Elements */}
       <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay pointer-events-none"></div>
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-luxury-teal/5 rounded-full blur-[120px] pointer-events-none"></div>

       <div className="max-w-6xl mx-auto px-6 relative z-10">
          
          <div className="text-center mb-24">
            <h1 className="font-display text-5xl md:text-8xl italic tracking-tight mb-6 text-slate-100">
                The Journal
            </h1>
            <div className="flex justify-center items-center gap-4">
               <div className="h-px w-12 bg-luxury-teal/50" />
               <p className="font-serif text-xs tracking-[0.3em] uppercase text-luxury-teal">Okc Frenchies Editorial</p>
               <div className="h-px w-12 bg-luxury-teal/50" />
            </div>
          </div>

          {loading && (
             <div className="flex justify-center py-20">
                 <Loader2 className="animate-spin text-luxury-teal" size={48} />
             </div>
          )}

          {!loading && posts.length === 0 && (
              <div className="text-center py-20 border border-slate-800 rounded bg-slate-900/50">
                  <p className="text-slate-400 font-serif text-xl">No articles found.</p>
              </div>
          )}

          {/* Featured Post */}
          {!loading && featuredPost && (
            <div 
                className="mb-32 group cursor-pointer grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" 
                onClick={() => openPost(featuredPost)}
            >
                <div className="relative aspect-[4/3] overflow-hidden border border-slate-800 bg-slate-900">
                    {featuredPost.image ? (
                        <img 
                            src={featuredPost.image} 
                            alt={featuredPost.title} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                            crossOrigin="anonymous"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600">
                            <BookOpen size={48} opacity={0.2} />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60"></div>
                </div>
                <div className="flex flex-col justify-center items-start">
                    <span className="inline-flex items-center gap-2 font-serif text-xs font-bold uppercase tracking-widest mb-6 text-luxury-teal border-l-2 border-luxury-teal pl-4">
                        <BookOpen size={14} /> Featured Story
                    </span>
                    <h2 className="font-display text-4xl md:text-6xl leading-[1.1] mb-6 text-slate-100 group-hover:text-luxury-teal transition-colors tracking-wide">
                        {featuredPost.title}
                    </h2>
                    <p className="font-display text-lg text-slate-400 leading-[1.8] tracking-[0.05em] mb-8 border-l border-slate-800 pl-6 line-clamp-3 font-normal">
                        {featuredPost.summary}
                    </p>
                    <button 
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-300 group-hover:text-luxury-teal transition-colors"
                        onClick={(e) => { e.stopPropagation(); openPost(featuredPost); }}
                    >
                        Read Article <ArrowUpRight size={16} />
                    </button>
                </div>
            </div>
          )}

          {/* Article Grid */}
          {!loading && gridPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-20 border-t border-slate-800 pt-20">
                {gridPosts.map((post, idx) => (
                    <article 
                        key={`${post.id}-${idx}`} 
                        className="group cursor-pointer flex flex-col h-full" 
                        onClick={() => openPost(post)}
                    >
                        <div className="aspect-[3/4] overflow-hidden mb-8 border border-slate-800 relative bg-slate-900">
                            {post.image ? (
                                <img 
                                    src={post.image} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover opacity-80 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                                    crossOrigin="anonymous"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600">
                                    <BookOpen size={32} opacity={0.2} />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-luxury-teal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                        <div className="flex flex-col items-center text-center flex-grow">
                            <span className="block font-serif text-[10px] font-bold uppercase tracking-widest mb-4 text-luxury-teal">
                                {post.category}
                            </span>
                            <h3 className="font-display text-2xl md:text-3xl mb-4 leading-tight text-slate-200 group-hover:text-white transition-colors tracking-wide">
                                {post.title}
                            </h3>
                            <p className="font-display font-normal text-sm text-slate-500 leading-relaxed tracking-wide max-w-xs mx-auto line-clamp-3 mb-6">
                                {post.summary}
                            </p>
                            <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 text-luxury-teal">
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    </article>
                ))}
            </div>
          )}

          {/* Reader Modal */}
          {selectedPost && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-6 pb-20 md:pb-6">
                <SEO 
                    title={`${selectedPost.title} | OKC Frenchies Journal`}
                    description={selectedPost.summary || `Read ${selectedPost.title} on the OKC Frenchies Journal.`}
                    image={selectedPost.image}
                />
                <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={closePost} />
                <button 
                    className="fixed top-8 right-4 md:top-6 md:right-6 z-[10001] p-3 bg-black/80 text-white hover:text-luxury-teal hover:bg-white/10 transition-all rounded-full backdrop-blur-md border border-white/10 shadow-2xl"
                    onClick={closePost}
                >
                    <X size={24} />
                </button>
                <div className="relative w-full h-full md:h-auto md:max-h-[85vh] md:max-w-4xl bg-[#0a0a0a] border border-slate-800 shadow-2xl overflow-y-auto z-[10000] animate-in fade-in zoom-in-95 duration-300 md:rounded-lg">
                    {selectedPost.image && (
                         <div className="w-full h-64 md:h-[50vh] relative">
                             <img src={selectedPost.image} className="w-full h-full object-cover" crossOrigin="anonymous" alt={selectedPost.title} />
                             <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent"></div>
                         </div>
                    )}
                    <div className="px-6 md:px-20 py-12 -mt-20 relative z-10">
                         <div className="flex flex-wrap items-center gap-4 mb-6 text-luxury-teal text-xs tracking-widest uppercase font-bold backdrop-blur-md bg-black/50 w-fit px-4 py-2 rounded-full border border-slate-800">
                             <span>{selectedPost.category}</span>
                             <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                             <span className="flex items-center gap-2"><Calendar size={12}/> {selectedPost.date}</span>
                         </div>
                         <h1 className="font-display text-4xl md:text-6xl text-slate-100 mb-10 leading-tight tracking-wide">
                             {selectedPost.title}
                         </h1>
                         <div className="h-px w-full bg-slate-800 mb-12" />
                         <div className="max-w-none text-slate-300">
                             {renderContent(selectedPost.content)}
                         </div>
                         <div className="mt-20 pt-10 border-t border-slate-800 text-center">
                              <button 
                                onClick={closePost}
                                className="text-luxury-teal hover:text-white transition-colors text-xs uppercase tracking-[0.2em] font-bold border border-luxury-teal px-8 py-3 hover:bg-luxury-teal hover:text-black"
                              >
                                  Back to Journal
                              </button>
                         </div>
                    </div>
                </div>
            </div>
          )}

       </div>
    </section>
  );
};

export default Blog;
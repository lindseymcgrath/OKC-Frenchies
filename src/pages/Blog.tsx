import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpRight, BookOpen, Loader2, X, Calendar, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';
import blogData from '../data/blog.json';
import seoData from '../data/seo.json';

const renderContent = (content: string) => {
  if (!content) {
    return <p className="text-[#5C6B63] italic">No content available.</p>;
  }

  return content.split(/\n\s*\n/).map((block, idx) => (
    <div
      key={idx}
      className="mb-6 last:mb-0 leading-relaxed text-base sm:text-lg text-[#1C2621]/90 font-sans [&>h2]:font-display [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-[#1C2621] [&>h2]:mt-6 [&>h2]:mb-3 [&>h3]:font-display [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-[#2E5A44] [&>h3]:mt-5 [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>a]:text-[#2E5A44] [&>a]:underline"
      dangerouslySetInnerHTML={{ __html: block }}
    />
  ));
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
      const foundPost = posts.find(
        (p) => p.id.toLowerCase() === postIdOrName || p.title.toLowerCase() === postIdOrName
      );
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
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPost]);

  useEffect(() => {
    try {
      setPosts(blogData);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load blog posts:', err);
      setLoading(false);
    }
  }, []);

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const gridPosts = posts.length > 1 ? posts.slice(1) : [];

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://okcfrenchies.com/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://okcfrenchies.com/french-bulldog-breeding-blog'
      }
    ]
  };

  return (
    <section className="min-h-screen bg-[#F6F4EE] text-[#1C2621] py-14 relative">
      <SEO
        title={seoData.Blog.title}
        description={seoData.Blog.description}
        image="https://okcfrenchies.com/og/blog.jpg"
        url="https://okcfrenchies.com/french-bulldog-breeding-blog"
        schema={blogSchema}
      />

      <div className="max-w-[1340px] mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-[#E3EFE8] text-[#2E5A44] font-sans font-bold text-xs px-4 py-1.5 rounded-full mb-4">
            <BookOpen size={14} /> OKC Frenchies Editorial &amp; Care Notes
          </span>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-[#1C2621] mb-4">
            The Sunlit Journal
          </h1>
          <p className="font-sans text-[#5C6B63] max-w-2xl mx-auto text-base leading-relaxed">
            Stories from our Oklahoma City nursery, coat genetics deep-dives, and nutrition tips for raising happy, healthy bulldogs.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#2E5A44]" size={44} />
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-16 border border-[#EAE5D9] rounded-3xl bg-white">
            <p className="text-[#5C6B63] font-display text-xl">No articles found.</p>
          </div>
        )}

        {/* Featured Post */}
        {!loading && featuredPost && (
          <div
            className="mb-16 group cursor-pointer bg-white border border-[#EAE5D9] rounded-3xl p-5 sm:p-8 shadow-[0_12px_30px_rgba(28,38,33,0.06)] hover:shadow-[0_18px_38px_rgba(28,38,33,0.1)] transition-all duration-300 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
            onClick={() => openPost(featuredPost)}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#EFECE4]">
              {featuredPost.image ? (
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#2E5A44]/40">
                  <BookOpen size={48} />
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center items-start">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 bg-[#F4D37E] text-[#1C2621] font-sans text-xs font-bold px-3.5 py-1 rounded-full">
                  ✨ Featured Story
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E5A44]">
                  {featuredPost.category}
                </span>
              </div>

              <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.12] mb-4 text-[#1C2621] group-hover:text-[#2E5A44] transition-colors">
                {featuredPost.title}
              </h2>

              <p className="font-sans text-base text-[#5C6B63] leading-relaxed mb-6 line-clamp-3">
                {featuredPost.summary}
              </p>

              <button
                className="inline-flex items-center gap-2 bg-[#2E5A44] group-hover:bg-[#234735] text-white font-sans text-sm font-bold px-6 py-3 rounded-full transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  openPost(featuredPost);
                }}
              >
                Read Article <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Article Grid */}
        {!loading && gridPosts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 pt-4">
            {gridPosts.map((post, idx) => (
              <article
                key={`${post.id}-${idx}`}
                className="group cursor-pointer bg-white rounded-[120px_120px_26px_26px] p-3.5 pb-6 border border-[#EAE5D9] shadow-[0_10px_28px_rgba(28,38,33,0.05)] hover:-translate-y-1.5 hover:shadow-[0_18px_36px_rgba(28,38,33,0.09)] transition-all duration-300 flex flex-col text-center"
                onClick={() => openPost(post)}
              >
                <div className="rounded-[110px_110px_18px_18px] aspect-[4/4.2] overflow-hidden bg-[#EFECE4]">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#2E5A44]/40">
                      <BookOpen size={36} />
                    </div>
                  )}
                </div>

                <div className="relative z-10 -mt-3.5 mb-2">
                  <span className="inline-block bg-[#E3EFE8] text-[#2E5A44] font-sans text-xs font-bold px-3.5 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>

                <div className="px-3 flex flex-col flex-grow">
                  <h3 className="font-display font-bold text-2xl mb-2.5 leading-snug text-[#1C2621] group-hover:text-[#2E5A44] transition-colors">
                    {post.title}
                  </h3>
                  <p className="font-sans text-sm text-[#5C6B63] leading-relaxed line-clamp-3 mb-5">
                    {post.summary}
                  </p>
                  <div className="mt-auto pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-xs font-bold text-[#2E5A44]">
                    <span className="text-[#5C6B63] font-normal flex items-center gap-1.5">
                      <Calendar size={12} /> {post.date}
                    </span>
                    <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Reader Modal */}
        {selectedPost && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-6 bg-[#1C2621]/60 backdrop-blur-sm"
            onClick={closePost}
          >
            <SEO
              title={`${selectedPost.title} | OKC Frenchies Journal`}
              description={selectedPost.summary || `Read ${selectedPost.title} on the OKC Frenchies Journal.`}
              image={selectedPost.image}
              schema={{
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: selectedPost.title,
                image: selectedPost.image,
                datePublished: selectedPost.date,
                author: {
                  '@type': 'Organization',
                  name: 'OKC Frenchies'
                },
                description: selectedPost.summary
              }}
            />

            <div
              className="relative w-full h-full md:h-auto md:max-h-[90vh] md:max-w-4xl bg-[#F6F4EE] border border-[#DCD6C8] shadow-2xl overflow-y-auto z-[10000] md:rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="fixed md:absolute top-5 right-5 z-50 p-2.5 bg-white/95 hover:bg-white text-[#1C2621] rounded-full shadow-md cursor-pointer"
                onClick={closePost}
                aria-label="Close article"
              >
                <X size={22} />
              </button>

              {selectedPost.image && (
                <div className="w-full h-64 md:h-[42vh] relative bg-[#EFECE4]">
                  <img
                    src={selectedPost.image}
                    className="w-full h-full object-cover"
                    alt={selectedPost.title}
                  />
                </div>
              )}

              <div className="px-6 md:px-14 py-10 bg-white">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="bg-[#E3EFE8] text-[#2E5A44] font-sans text-xs font-bold px-3.5 py-1 rounded-full">
                    {selectedPost.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#5C6B63]">
                    <Calendar size={13} /> {selectedPost.date}
                  </span>
                </div>

                <h1 className="font-display font-bold text-3xl md:text-5xl text-[#1C2621] mb-6 leading-tight">
                  {selectedPost.title}
                </h1>

                <div className="h-px w-full bg-[#E2DDD2] mb-8" />

                <div className="max-w-none">{renderContent(selectedPost.content)}</div>

                <div className="mt-12 pt-8 border-t border-[#E2DDD2] text-center">
                  <button
                    onClick={closePost}
                    className="bg-[#2E5A44] hover:bg-[#234735] text-white transition-colors text-xs uppercase tracking-wider font-bold px-8 py-3.5 rounded-full cursor-pointer"
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

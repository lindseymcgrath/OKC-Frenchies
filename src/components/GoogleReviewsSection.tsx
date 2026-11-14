import React from 'react';
import { ArrowUpRight, RefreshCw, Star } from 'lucide-react';
import { useGoogleReviews } from '../hooks/useGoogleReviews';

const GoogleMark: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
    <path
      fill="#4285F4"
      d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.87Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.88-3c-1.07.72-2.44 1.15-4.06 1.15-3.12 0-5.77-2.11-6.72-4.96H1.28v3.1A12 12 0 0 0 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.29A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.38-2.29V6.61H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.39l4-3.1Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.61l4 3.1C6.23 6.86 8.88 4.75 12 4.75Z"
    />
  </svg>
);

const getInitials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('') || 'G';

const GoogleReviewsSection: React.FC = () => {
  const okcState = useGoogleReviews('okc-frenchies');
  const rawPawState = useGoogleReviews('raw-and-paw');

  const usingOkcLive = okcState.live && okcState.reviews.length > 0;
  const activeState = usingOkcLive ? okcState : rawPawState;
  const displayReviews = activeState.reviews.slice(0, 6);

  return (
    <section
      id="google-reviews"
      className="py-20 bg-[#FAF8F3] border-t border-[#EAE5D9] text-[#1C2621]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-white border border-[#DCD6C8] px-3.5 py-1.5 rounded-full shadow-xs mb-3">
              <GoogleMark />
              <span className="font-sans text-xs font-extrabold tracking-wide text-[#1C2621]">
                {usingOkcLive
                  ? 'Verified OKC Frenchies Google Reviews'
                  : 'Raw & Paw Co. • Our Nutrition Partner on Google'}
              </span>
              {activeState.live && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E3EFE8] text-[#2E5A44] text-[10px] font-bold">
                  ● Live Sync
                </span>
              )}
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1C2621]">
              Real Google Reviews From Our Community
            </h2>
            <p className="font-sans text-sm text-[#5C6B63] mt-2 max-w-2xl">
              {usingOkcLive
                ? 'Directly synced from Google Business Profile reviews for OKC Frenchies.'
                : 'Authentic, unedited reviews from real families & Raw & Paw Co. customers in Oklahoma City and nationwide.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="flex items-center gap-3 bg-white border border-[#DCD6C8] rounded-2xl px-4 py-2.5 shadow-xs">
              <span className="font-display text-2xl font-bold text-[#1C2621]">
                {activeState.rating.toFixed(1)}
              </span>
              <div>
                <div className="flex items-center gap-0.5 text-[#D97706]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <div className="font-sans text-[11px] font-semibold text-[#5C6B63]">
                  {activeState.totalReviews > 0
                    ? `${activeState.totalReviews} Google Reviews`
                    : `${displayReviews.length} Verified Reviews`}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                okcState.refresh();
                rawPawState.refresh();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white border border-[#DCD6C8] hover:border-[#2E5A44] font-sans text-xs font-bold text-[#2E5A44] transition-colors cursor-pointer"
              title="Refresh live Google Reviews"
            >
              <RefreshCw size={14} className={activeState.loading ? 'animate-spin' : ''} />
              Sync
            </button>

            <a
              href={activeState.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#2E5A44] hover:bg-[#234735] text-white font-sans text-xs font-bold transition-colors shadow-xs"
            >
              Read Reviews on Google <ArrowUpRight size={15} />
            </a>
          </div>
        </div>

        {displayReviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayReviews.map((review) => {
              const stars = Math.max(1, Math.min(5, Math.round(review.rating || 5)));
              return (
                <article
                  key={review.id}
                  className="bg-white border border-[#EAE5D9] rounded-3xl p-6 shadow-xs flex flex-col justify-between gap-4 hover:border-[#2E5A44]/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-0.5 text-[#D97706]">
                        {Array.from({ length: stars }).map((_, idx) => (
                          <Star key={idx} size={15} fill="currentColor" strokeWidth={0} />
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5C6B63]">
                        <GoogleMark />
                        <span>{review.relativeTime || 'Google Review'}</span>
                      </span>
                    </div>

                    <p className="font-sans text-sm text-[#1C2621] leading-relaxed">
                      &ldquo;{review.text}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#F0ECE1] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {review.authorPhotoUrl ? (
                        <img
                          src={review.authorPhotoUrl}
                          alt={review.authorName}
                          className="w-8 h-8 rounded-full object-cover border border-[#DCD6C8] shrink-0"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#E3EFE8] text-[#2E5A44] font-sans text-xs font-extrabold flex items-center justify-center shrink-0">
                          {getInitials(review.authorName)}
                        </div>
                      )}
                      <span className="font-sans text-xs font-extrabold text-[#1C2621] truncate">
                        {review.authorName}
                      </span>
                    </div>

                    {review.googleMapsUri && (
                      <a
                        href={review.googleMapsUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-[#2E5A44] hover:text-[#D46A4E] inline-flex items-center gap-0.5 shrink-0"
                      >
                        Source <ArrowUpRight size={12} />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default GoogleReviewsSection;

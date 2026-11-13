import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, ArrowUpRight, Dna, ShieldCheck, FileText, Play, Share2 } from 'lucide-react';
import puppiesData from '../data/puppies.json';
import studsData from '../data/studs.json';

interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

interface DogItem {
  id: string;
  name: string;
  status: string;
  dna: string;
  dna_technical: string;
  price: string;
  description: string;
  altText: string;
  videoUrl: string;
  breed: string;
  pedigreeLink: string;
  type: string;
  gender: string;
  image: string;
  media: MediaItem[];
}

// Helper to give each puppy a warm badge without altering src/data/puppies.json
const getGardenBadge = (dog: DogItem): string => {
  const statusLower = (dog.status || '').toLowerCase();
  if (statusLower.includes('keeper')) {
    return '👑 Keeper • Retained';
  }
  if (statusLower.includes('retained') || statusLower.includes('co-own')) {
    return '🤝 Retained / Co-Own';
  }
  if (statusLower === 'pending') {
    return '⏳ Pending / Reserved';
  }
  const nameLower = dog.name.toLowerCase();
  if (nameLower === 'phatty patty') return '👑 Keeper • Chocolate Tri Merle';
  if (nameLower === 'jellyroll') return '🤝 Retained / Co-Own';
  if (nameLower === 'alice') return '✨ Super Tiny Pocket Princess';
  if (nameLower === 'arya') return '✨ Compact Wrinkle Queen';
  if (nameLower === 'brew') return '✨ Sleepy Sweetheart • Merle';
  if (nameLower === 'bean') return '✨ Lilac Tri Cuddle Bug';
  if (nameLower === 'biscotti') return '✨ Sweet Chocolate Tri';
  if (nameLower === 'alex') return '✨ Visual Fluffy Gentleman';
  if (nameLower === 'shuffin') return '✨ One-of-a-Kind Floodle';

  const dna = (dog.dna || '').toLowerCase();
  if (dna.includes('floodle')) return '✨ Rare Floodle';
  if (dna.includes('big rope')) return '✨ Big Rope • Rare Carries';
  if (dna.includes('merle')) return '✨ Rare Merle Coat';
  if (dna.includes('fluffy')) return '✨ Fluffy Coat';
  return `✨ Available ${dog.gender || 'Puppy'}`;
};

const FEATURED_ORDER = [
  'alice',
  'arya',
  'brew',
  'bean',
  'biscotti',
  'alex',
  'shuffin',
  'brulee',
  'jellyroll',
  'phatty patty'
];

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeBreed, setActiveBreed] = useState<string>('All');
  const [cardPhotoIndex, setCardPhotoIndex] = useState<Record<string, number>>({});
  const [selectedDog, setSelectedDog] = useState<DogItem | null>(null);
  const [modalMediaIndex, setModalMediaIndex] = useState<number>(0);
  const [copiedDogLink, setCopiedDogLink] = useState<boolean>(false);

  // Filter active puppies directly from src/data/puppies.json
  const activePuppies = useMemo(() => {
    const available = (puppiesData as DogItem[]).filter((d) => {
      const s = (d.status || 'available').toLowerCase();
      return (
        s === 'available' ||
        s === 'pending' ||
        s.includes('keeper') ||
        s.includes('retained') ||
        s.includes('co-own')
      );
    });

    return [...available].sort((a, b) => {
      const idxA = FEATURED_ORDER.indexOf(a.name.toLowerCase());
      const idxB = FEATURED_ORDER.indexOf(b.name.toLowerCase());
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });
  }, []);

  const breeds = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of activePuppies) {
      const b = p.breed || 'French Bulldog';
      counts[b] = (counts[b] || 0) + 1;
    }
    return counts;
  }, [activePuppies]);

  const filteredPuppies = useMemo(() => {
    if (activeBreed === 'All') return activePuppies;
    return activePuppies.filter((p) => (p.breed || 'French Bulldog') === activeBreed);
  }, [activePuppies, activeBreed]);

  const studs = useMemo(() => (studsData as DogItem[]).slice(0, 4), []);

  const openDogModal = (dog: DogItem, initialPhotoIdx = 0, syncUrl = true) => {
    setSelectedDog(dog);
    setModalMediaIndex(initialPhotoIdx);
    setCopiedDogLink(false);
    if (syncUrl) {
      const next = new URLSearchParams(searchParams);
      next.set('dog', dog.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
      setSearchParams(next);
    }
  };

  const closeDogModal = () => {
    setSelectedDog(null);
    const next = new URLSearchParams(searchParams);
    next.delete('dog');
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    const q = searchParams.get('dog');
    if (q) {
      const clean = q.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const all = [...(puppiesData as DogItem[]), ...(studsData as DogItem[])];
      const match = all.find(
        (d) =>
          d.name.toLowerCase() === q.toLowerCase() ||
          d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === clean ||
          d.id.toLowerCase() === q.toLowerCase()
      );
      if (match && (!selectedDog || selectedDog.id !== match.id)) {
        openDogModal(match, 0, false);
      }
    } else if (selectedDog) {
      setSelectedDog(null);
    }
  }, [searchParams]);

  const getDirectDogShareUrl = (dog: DogItem) => {
    const slug = dog.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return dog.type === 'Stud'
      ? `https://okcfrenchies.com/studs/${slug}`
      : `https://okcfrenchies.com/puppies/${slug}`;
  };

  const handleCopyOrShareDogLink = async (dog: DogItem) => {
    const url = getDirectDogShareUrl(dog);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedDogLink(true);
      setTimeout(() => setCopiedDogLink(false), 2200);
    } catch {
      // ignore
    }
  };

  const handleInquire = (dog: DogItem) => {
    const interest = dog.type === 'Stud' ? 'Stud Service' : 'Puppy Acquisition';
    navigate(`/inquiry?dog=${encodeURIComponent(dog.name)}&interest=${encodeURIComponent(interest)}`);
  };

  return (
    <section className="bg-[#F6F4EE] text-[#1C2621] pt-8 pb-24">
      <div className="max-w-[1340px] mx-auto px-6">
        {/* Sunlit Garden Intro Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-10">
          <div className="lg:col-span-7">
            <span className="inline-block bg-[#E3EFE8] text-[#2E5A44] font-sans font-bold text-[13px] px-4 py-1.5 rounded-full mb-4">
              🏡 Oklahoma City Family Breeder • Available Right Now
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-[56px] leading-[1.06] tracking-tight text-[#1C2621]">
              Raised in the sunlight,{' '}
              <em className="italic font-semibold text-[#D46A4E]">ready for your couch.</em>
            </h1>
          </div>

          <div className="lg:col-span-5 flex flex-col lg:items-end gap-4">
            <p className="font-sans text-[#5C6B63] text-[15px] lg:text-right max-w-md leading-relaxed">
              Every available puppy is right here on the front page — click the photo numbers on any card to flip through their newest portraits, or tap a puppy for full DNA details.
            </p>

            {/* Breed Filter Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveBreed('All')}
                className={`px-5 py-2.5 rounded-full font-sans text-sm font-bold border transition-all cursor-pointer ${
                  activeBreed === 'All'
                    ? 'bg-[#2E5A44] text-white border-[#2E5A44] shadow-sm'
                    : 'bg-white text-[#1C2621] border-[#DCD6C8] hover:border-[#2E5A44]'
                }`}
              >
                All Puppies ({activePuppies.length})
              </button>
              {Object.entries(breeds).map(([breedName, count]) => (
                <button
                  key={breedName}
                  onClick={() => setActiveBreed(breedName)}
                  className={`px-5 py-2.5 rounded-full font-sans text-sm font-bold border transition-all cursor-pointer ${
                    activeBreed === breedName
                      ? 'bg-[#2E5A44] text-white border-[#2E5A44] shadow-sm'
                      : 'bg-white text-[#1C2621] border-[#DCD6C8] hover:border-[#2E5A44]'
                  }`}
                >
                  {breedName === 'French Bulldog'
                    ? `Frenchies (${count})`
                    : breedName === 'Mini English Bulldog'
                    ? `Mini English (${count})`
                    : `${breedName} (${count})`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Arched Botanical Nursery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPuppies.map((dog) => {
            const imageMedia = (dog.media || []).filter((m) => m.type === 'image');
            const photos = imageMedia.length > 0 ? imageMedia.map((m) => m.url) : [dog.image];
            const currentIdx = cardPhotoIndex[dog.id] || 0;
            const currentSrc = photos[currentIdx] || dog.image;
            const isPending = dog.status && dog.status.toLowerCase() === 'pending';

            return (
              <div
                key={dog.id}
                onClick={() => openDogModal(dog, currentIdx)}
                className="group bg-white rounded-[140px_140px_26px_26px] p-3.5 pb-5 border border-[#EAE5D9] shadow-[0_12px_30px_rgba(28,38,33,0.06)] hover:-translate-y-1.5 hover:shadow-[0_18px_38px_rgba(28,38,33,0.1)] transition-all duration-300 text-center flex flex-col cursor-pointer"
              >
                {/* Arched Portrait Frame */}
                <div className="relative rounded-[130px_130px_18px_18px] overflow-hidden aspect-[4/4.35] bg-[#EFECE4]">
                  <img
                    src={currentSrc}
                    alt={dog.altText || `${dog.name} - ${dog.dna} ${dog.breed}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Multi-Photo Numbered Dots */}
                  {photos.length > 1 && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm z-10"
                    >
                      {photos.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            setCardPhotoIndex((prev) => ({
                              ...prev,
                              [dog.id]: idx
                            }))
                          }
                          className={`w-6 h-6 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                            currentIdx === idx
                              ? 'bg-[#2E5A44] text-white'
                              : 'bg-[#E2DDD2] text-[#1C2621] hover:bg-[#d2cbbd]'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Golden Personality / Status Pill */}
                <div className="relative z-10 -mt-3.5 mb-1">
                  <span
                    className={`inline-block font-sans font-bold text-[12px] px-3.5 py-1 rounded-full shadow-xs ${
                      isPending
                        ? 'bg-[#E8DFC8] text-[#5C533E]'
                        : 'bg-[#F4D37E] text-[#1C2621]'
                    }`}
                  >
                    {getGardenBadge(dog)}
                  </span>
                </div>

                {/* Name & Gender */}
                <h2 className="font-display font-bold text-[26px] text-[#1C2621] mt-1 flex items-center justify-center gap-1.5">
                  {dog.name}
                  {dog.gender === 'Male' && (
                    <span className="text-[#2B6CB0] text-lg font-sans" title="Male">
                      ♂
                    </span>
                  )}
                  {dog.gender === 'Female' && (
                    <span className="text-[#C5306C] text-lg font-sans" title="Female">
                      ♀
                    </span>
                  )}
                </h2>

                <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#2E5A44]/80 mt-0.5">
                  {dog.breed} • {dog.gender}
                </span>

                {/* DNA Line */}
                <p className="font-sans text-[#5C6B63] text-[13px] leading-snug mt-2 mb-4 px-2 min-h-[36px] flex items-center justify-center">
                  {dog.dna}
                </p>

                {/* Price & Action Footer */}
                <div className="mt-auto pt-3 px-2 border-t border-[#F0ECE1] flex items-center justify-between">
                  <span className="font-sans font-extrabold text-[18px] text-[#D46A4E]">
                    {dog.price}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDogModal(dog, currentIdx);
                    }}
                    className="bg-[#E3EFE8] hover:bg-[#2E5A44] text-[#2E5A44] hover:text-white font-sans font-bold text-[13px] px-4 py-2 rounded-full transition-colors cursor-pointer"
                  >
                    Inquire →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Secondary CTA bar to see Past Litters / Coat Calculator */}
        <div className="mt-12 bg-white border border-[#EAE5D9] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#2E5A44]">
              🧬 Health Tested &amp; Color Verified
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#1C2621] mt-1">
              Curious about our rare Pink, Fluffy &amp; Floodle genetics?
            </h3>
            <p className="font-sans text-sm text-[#5C6B63] mt-1">
              Explore our interactive Coat Color Genetics guide or browse previously placed puppies from our program.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/french-bulldog-puppies-for-sale"
              className="px-5 py-3 rounded-full border border-[#DCD6C8] hover:border-[#2E5A44] font-sans text-sm font-bold text-[#1C2621] transition-colors"
            >
              View Previously Sold Pups
            </Link>
            <Link
              to="/french-bulldog-coat-color-genetics"
              className="px-5 py-3 rounded-full bg-[#2E5A44] hover:bg-[#234735] text-white font-sans text-sm font-bold transition-colors"
            >
              Explore Coat Genetics →
            </Link>
          </div>
        </div>

        {/* Proven Studs Preview Section */}
        {studs.length > 0 && (
          <div className="mt-20 pt-16 border-t border-[#E2DDD2]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="inline-block bg-[#E3EFE8] text-[#2E5A44] font-sans font-bold text-xs px-3.5 py-1 rounded-full mb-3">
                  👑 Proven Producers • Worldwide Shipping
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1C2621]">
                  Meet Our Stud Lineup
                </h2>
              </div>
              <Link
                to="/french-bulldog-stud-service"
                className="inline-flex items-center gap-1.5 font-sans font-bold text-sm text-[#2E5A44] hover:text-[#D46A4E] transition-colors"
              >
                View Full Stud Gallery <ArrowUpRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {studs.map((stud) => (
                <div
                  key={stud.id}
                  onClick={() => openDogModal(stud, 0)}
                  className="group bg-white rounded-[120px_120px_24px_24px] p-3.5 pb-5 border border-[#EAE5D9] shadow-xs hover:-translate-y-1 transition-all duration-300 text-center flex flex-col cursor-pointer"
                >
                  <div className="relative rounded-[110px_110px_16px_16px] overflow-hidden aspect-[4/4.2] bg-[#EFECE4]">
                    <img
                      src={stud.image}
                      alt={stud.altText || stud.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="relative z-10 -mt-3 mb-1">
                    <span className="inline-block bg-[#2E5A44] text-white font-sans font-bold text-[11px] px-3 py-1 rounded-full">
                      🧬 Proven Stud
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-2xl text-[#1C2621] mt-1">
                    {stud.name}
                  </h3>
                  <p className="font-sans text-[#5C6B63] text-xs mt-1 mb-3 px-2 line-clamp-2">
                    {stud.dna}
                  </p>
                  <div className="mt-auto pt-3 px-2 border-t border-[#F0ECE1] flex items-center justify-between">
                    <span className="font-sans font-extrabold text-base text-[#D46A4E]">
                      {stud.price}
                    </span>
                    <span className="text-xs font-bold text-[#2E5A44] group-hover:underline">
                      Stud Info →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sunlit Garden Detail Modal */}
      {selectedDog && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[#1C2621]/60 backdrop-blur-sm"
          onClick={closeDogModal}
        >
          <div
            className="relative w-full max-w-5xl max-h-[90vh] bg-[#F6F4EE] border border-[#DCD6C8] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeDogModal}
              className="absolute top-4 right-4 z-50 p-2.5 bg-white/90 hover:bg-white text-[#1C2621] rounded-full shadow-md cursor-pointer"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Left: Photo / Media Viewer */}
            <div className="w-full md:w-3/5 bg-[#EFECE4] flex flex-col justify-between relative min-h-[340px] md:min-h-[540px]">
              {(() => {
                const mediaList =
                  selectedDog.media && selectedDog.media.length > 0
                    ? selectedDog.media
                    : [{ type: 'image' as const, url: selectedDog.image }];
                const currentMedia = mediaList[modalMediaIndex] || mediaList[0];

                return (
                  <>
                    <div className="flex-1 relative flex items-center justify-center overflow-hidden p-4">
                      {currentMedia.type === 'video' ? (
                        <video
                          src={currentMedia.url}
                          controls
                          autoPlay
                          className="max-h-[65vh] w-auto rounded-2xl"
                        />
                      ) : (
                        <img
                          src={currentMedia.url}
                          alt={selectedDog.altText || selectedDog.name}
                          className="max-h-[65vh] w-auto object-contain rounded-2xl shadow-sm"
                        />
                      )}

                      {mediaList.length > 1 && (
                        <>
                          <button
                            onClick={() =>
                              setModalMediaIndex(
                                (prev) => (prev - 1 + mediaList.length) % mediaList.length
                              )
                            }
                            className="absolute left-4 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#1C2621] shadow-md cursor-pointer"
                          >
                            <ChevronLeft size={22} />
                          </button>
                          <button
                            onClick={() =>
                              setModalMediaIndex((prev) => (prev + 1) % mediaList.length)
                            }
                            className="absolute right-4 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#1C2621] shadow-md cursor-pointer"
                          >
                            <ChevronRight size={22} />
                          </button>
                        </>
                      )}
                    </div>

                    {mediaList.length > 1 && (
                      <div className="p-3 bg-white border-t border-[#E2DDD2] flex items-center justify-center gap-3">
                        {mediaList.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => setModalMediaIndex(idx)}
                            className={`w-16 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                              modalMediaIndex === idx
                                ? 'border-[#2E5A44] scale-105 shadow-xs'
                                : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                          >
                            {item.type === 'video' ? (
                              <div className="w-full h-full bg-[#1C2621] flex items-center justify-center">
                                <Play size={16} className="text-white" />
                              </div>
                            ) : (
                              <img src={item.url} alt="" className="w-full h-full object-cover" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Right: Puppy Details & Inquiry Button */}
            <div className="w-full md:w-2/5 p-6 sm:p-8 overflow-y-auto flex flex-col bg-white">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-[#E3EFE8] text-[#2E5A44] font-sans font-bold text-xs px-3 py-1 rounded-full">
                  {selectedDog.status || selectedDog.type}
                </span>
                <span className="text-xs font-bold text-[#5C6B63] uppercase tracking-wider">
                  {selectedDog.breed}
                </span>
              </div>

              <h2 className="font-display text-4xl font-bold text-[#1C2621] flex items-center gap-2">
                {selectedDog.name}
                {selectedDog.gender === 'Male' && (
                  <span className="text-[#2B6CB0] text-2xl font-sans">♂</span>
                )}
                {selectedDog.gender === 'Female' && (
                  <span className="text-[#C5306C] text-2xl font-sans">♀</span>
                )}
              </h2>

              <p className="font-sans text-[#5C6B63] text-sm leading-relaxed mt-3 mb-6">
                {selectedDog.description || `${selectedDog.name} is an adorable ${selectedDog.dna} ${selectedDog.breed}.`}
              </p>

              <div className="space-y-3 bg-[#F6F4EE] p-4 rounded-2xl border border-[#EAE5D9] mb-6">
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#5C6B63]">
                    Coat &amp; Phenotype
                  </span>
                  <span className="font-sans font-bold text-sm text-[#2E5A44]">
                    {selectedDog.dna}
                  </span>
                </div>

                {selectedDog.dna_technical && (
                  <div className="pt-2 border-t border-[#E2DDD2]">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-[#5C6B63]">
                      DNA Loci Sequence
                    </span>
                    <span className="font-mono text-xs text-[#1C2621]">
                      {selectedDog.dna_technical}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-[#E2DDD2] flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5C6B63]">
                    {selectedDog.type === 'Stud' ? 'Stud Fee' : 'Price'}
                  </span>
                  <span className="font-display font-bold text-2xl text-[#D46A4E]">
                    {selectedDog.price}
                  </span>
                </div>
              </div>

              <div className="mt-auto space-y-3">
                <button
                  onClick={() => handleInquire(selectedDog)}
                  className="w-full py-4 px-6 bg-[#2E5A44] hover:bg-[#234735] text-white font-sans font-bold text-sm rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {selectedDog.type === 'Stud'
                    ? `Book Stud Service with ${selectedDog.name}`
                    : `Ask About ${selectedDog.name}`}{' '}
                  <ArrowUpRight size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyOrShareDogLink(selectedDog)}
                  className="w-full py-3 px-6 bg-[#F6F4EE] border border-[#DCD6C8] hover:border-[#2E5A44] text-[#1C2621] font-sans font-bold text-xs uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 size={14} className="text-[#2E5A44]" />
                  {copiedDogLink
                    ? `✓ Copied ${selectedDog.name}'s Direct Link!`
                    : `Copy Direct Link to ${selectedDog.name}`}
                </button>

                {selectedDog.pedigreeLink && (
                  <a
                    href={selectedDog.pedigreeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-6 border border-[#DCD6C8] hover:border-[#2E5A44] text-[#1C2621] font-sans font-bold text-xs uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-2"
                  >
                    <FileText size={14} /> View Pedigree
                  </a>
                )}

                <div className="flex items-center justify-center gap-2 pt-2 text-xs text-[#5C6B63]">
                  <ShieldCheck size={15} className="text-[#2E5A44]" />
                  <span>Health Tested • OKC Pickup or Flight Nanny Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowUpRight,
  ShieldCheck,
  Dna,
  X,
  Loader2,
  Play,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  AlertTriangle,
  RefreshCw,
  FileText,
  Share2
} from 'lucide-react';
import SEO from './SEO';
import studsData from '../data/studs.json';
import puppiesData from '../data/puppies.json';

const getString = (val: any): string => {
  if (val === null || val === undefined) return '';
  return String(val).trim();
};

const renderDescription = (text: string) => {
  if (!text) return <p className="text-[#5C6B63] italic">Contact us for full details and temperament notes.</p>;
  return text.split(/\n+/).map((paragraph, index) => (
    <p key={index} className="mb-4 last:mb-0 font-sans text-[#5C6B63] text-sm leading-relaxed">
      {paragraph}
    </p>
  ));
};

interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

interface Badge {
  label: string;
  color: string;
}

interface DogData {
  id: string;
  name: string;
  breed: string;
  gender: string;
  dna: string;
  dna_technical: string;
  description: string;
  altText: string;
  image: string;
  price: string;
  type: string;
  status: string;
  badges: Badge[];
  media: MediaItem[];
  pedigreeLink: string;
}

interface GalleryProps {
  filterType: 'Puppy' | 'Stud';
  title: string;
  subtitle: string;
  sheetName: string;
}

const isActiveDogStatus = (status?: string): boolean => {
  if (!status) return true;
  const s = status.toLowerCase();
  return (
    s === 'available' ||
    s === 'stud' ||
    s === 'pending' ||
    s.includes('keeper') ||
    s.includes('retained') ||
    s.includes('co-own')
  );
};

const getGardenPill = (dog: DogData): string => {
  if (dog.type === 'Stud') return '🧬 Proven Producer';
  const statusLower = (dog.status || '').toLowerCase();
  if (statusLower.includes('keeper')) return '👑 Keeper • Retained';
  if (statusLower.includes('retained') || statusLower.includes('co-own')) return '🤝 Retained / Co-Own';
  if (statusLower === 'pending') return '⏳ Pending / Reserved';
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

const Gallery: React.FC<GalleryProps> = ({ filterType, title, subtitle, sheetName }) => {
  const navigate = useNavigate();
  const { dogSlug } = useParams<{ dogSlug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dogs, setDogs] = useState<DogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDog, setSelectedDog] = useState<DogData | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [activeBreedFilter, setActiveBreedFilter] = useState<string>('All');
  const [cardPhotoIndex, setCardPhotoIndex] = useState<Record<string, number>>({});
  const [copiedDogLink, setCopiedDogLink] = useState<boolean>(false);

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [modalImageError, setModalImageError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (selectedDog) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedDog]);

  useEffect(() => {
    setModalImageError(false);
  }, [activeMediaIndex]);

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const handleRefreshImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRefreshKey((prev) => prev + 1);
    setModalImageError(false);
  };

  const openModal = (dog: DogData, initialIdx = 0, updateUrl = true) => {
    setActiveMediaIndex(initialIdx);
    setModalImageError(false);
    setRefreshKey(0);
    setCopiedDogLink(false);
    setSelectedDog(dog);
    if (updateUrl) {
      const slug = dog.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newParams = new URLSearchParams(searchParams);
      newParams.set('dog', slug);
      setSearchParams(newParams);
    }
  };

  const closeModal = () => {
    setSelectedDog(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('dog');
    if (dogSlug) {
      navigate(filterType === 'Stud' ? '/french-bulldog-stud-service' : '/french-bulldog-puppies-for-sale', { replace: true });
    } else {
      setSearchParams(newParams, { replace: true });
    }
  };

  useEffect(() => {
    const rawTarget = dogSlug || searchParams.get('dog');
    if (dogs.length > 0 && rawTarget) {
      const dogName = rawTarget.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const foundDog = dogs.find(
        (d) =>
          d.name.toLowerCase() === rawTarget.toLowerCase() ||
          d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === dogName ||
          d.id.toLowerCase() === rawTarget.toLowerCase()
      );
      if (foundDog && (!selectedDog || selectedDog.id !== foundDog.id)) {
        openModal(foundDog, 0, false);
      }
    } else if (!rawTarget && selectedDog) {
      setSelectedDog(null);
    }
  }, [dogs, searchParams, dogSlug]);

  const handleInquiry = () => {
    if (!selectedDog) return;
    const interestType = selectedDog.type === 'Stud' ? 'Stud Service' : 'Puppy Acquisition';
    navigate(`/inquiry?dog=${encodeURIComponent(selectedDog.name)}&interest=${encodeURIComponent(interestType)}`);
  };

  useEffect(() => {
    const analyzeDNA = (dna: string): Badge[] => {
      if (!dna) return [];
      const cleanDna = getString(dna);
      const badges: Badge[] = [];

      if (/\bA\/A\b/i.test(cleanDna)) {
        badges.push({
          label: 'FULL PINK',
          color: 'bg-[#FADADD] text-[#8B263E] border-[#F3B8C5]'
        });
      } else if (/\b(n\/A|A\/n)\b/i.test(cleanDna)) {
        badges.push({
          label: 'PINK CARRIER',
          color: 'bg-[#FCE7F3] text-[#9D174D] border-[#F9A8D4]'
        });
      }

      const hasFurnishings = /\b(n\/F|F\/F|F\/n)\b/i.test(cleanDna);
      const isVisualFluffy = /\b(l1\/l4|l4\/l1|l1\/l1|l4\/l4|l\/l)\b/i.test(cleanDna);
      const isFluffyCarrier = /\b(L\/l1|L\/l4|n\/l1|n\/l4|L\/l|n\/l)\b/i.test(cleanDna);

      if (hasFurnishings) {
        if (isVisualFluffy) {
          badges.push({
            label: 'FLOODLE',
            color: 'bg-[#F4D37E] text-[#1C2621] border-[#E5BE5C]'
          });
        } else if (isFluffyCarrier) {
          badges.push({
            label: 'FLOODLE PRODUCER',
            color: 'bg-[#E3EFE8] text-[#2E5A44] border-[#C5DFD0]'
          });
        }
      }

      if (/\beA\/eA\b/.test(cleanDna)) {
        badges.push({
          label: 'VISUAL eA',
          color: 'bg-[#E3EFE8] text-[#2E5A44] border-[#C5DFD0]'
        });
      }

      return badges;
    };

    const loadDogs = () => {
      try {
        setLoading(true);
        setError(null);

        const rawData = sheetName === 'Studs' ? studsData : puppiesData;

        const mappedDogs = rawData
          .map((d: any) => ({
            ...d,
            badges: analyzeDNA(d.dna_technical || d.dna)
          }))
          .filter((dog: DogData) => {
            if (filterType === 'Stud') return dog.type === 'Stud';
            return dog.type !== 'Stud';
          });

        setDogs(mappedDogs);
        setLoading(false);
      } catch (err: any) {
        setError(`Local Data Error: ${err.message}`);
        setLoading(false);
      }
    };

    loadDogs();
  }, [filterType, sheetName]);

  const handleNextMedia = () => {
    if (!selectedDog || selectedDog.media.length === 0) return;
    setActiveMediaIndex((prev) => (prev + 1) % selectedDog.media.length);
  };

  const handlePrevMedia = () => {
    if (!selectedDog || selectedDog.media.length === 0) return;
    setActiveMediaIndex((prev) => (prev - 1 + selectedDog.media.length) % selectedDog.media.length);
  };

  const currentMedia =
    selectedDog && selectedDog.media && selectedDog.media[activeMediaIndex]
      ? selectedDog.media[activeMediaIndex]
      : null;

  const activeCount = dogs.filter((d) => isActiveDogStatus(d.status)).length;

  return (
    <section className="py-14 bg-[#F6F4EE] text-[#1C2621] relative min-h-screen">
      <div className="max-w-[1340px] mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-10 border-b border-[#E2DDD2] pb-8">
          <div>
            <span className="inline-block bg-[#E3EFE8] text-[#2E5A44] font-sans font-bold text-xs px-3.5 py-1.5 rounded-full mb-3">
              🌿 {subtitle}
            </span>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-[#1C2621]">{title}</h1>
          </div>

          {!loading && !error && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveBreedFilter('All')}
                className={`px-5 py-2.5 text-sm font-bold border rounded-full transition-all cursor-pointer ${
                  activeBreedFilter === 'All'
                    ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                    : 'bg-white text-[#1C2621] border-[#DCD6C8] hover:border-[#2E5A44]'
                }`}
              >
                All ({activeCount})
              </button>
              {Array.from(new Set(dogs.map((d) => d.breed || 'French Bulldog'))).map((breed) => (
                <button
                  key={breed}
                  onClick={() => setActiveBreedFilter(breed)}
                  className={`px-5 py-2.5 text-sm font-bold border rounded-full transition-all cursor-pointer ${
                    activeBreedFilter === breed
                      ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                      : 'bg-white text-[#1C2621] border-[#DCD6C8] hover:border-[#2E5A44]'
                  }`}
                >
                  {breed}s
                </button>
              ))}
            </div>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#2E5A44] mb-4" size={44} />
            <p className="font-sans text-[#5C6B63] text-sm font-bold uppercase tracking-wider">
              Loading Nursery...
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-16 border border-red-300 bg-red-50 rounded-3xl p-8">
            <AlertTriangle className="text-red-500 mb-4" size={44} />
            <h3 className="text-red-700 font-display text-xl mb-2">Error Loading Gallery</h3>
            <p className="text-red-600 font-mono text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-16">
            {/* AVAILABLE / ACTIVE DOGS */}
            {Array.from(new Set(dogs.map((d) => d.breed || 'French Bulldog')))
              .filter((breed) => activeBreedFilter === 'All' || activeBreedFilter === breed)
              .map((breed) => {
                const availableForBreed = dogs.filter(
                  (d) => (d.breed || 'French Bulldog') === breed && isActiveDogStatus(d.status)
                );

                if (availableForBreed.length === 0) return null;

                return (
                  <div key={breed}>
                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#1C2621] mb-7 flex items-center gap-4">
                      <span>
                        {filterType === 'Stud' ? `${breed} Studs` : `${breed} Litter & Available Puppies`}
                      </span>
                      <div className="h-px bg-[#E2DDD2] flex-grow"></div>
                    </h2>

                    {breed === 'Mini English Bulldog' && filterType === 'Puppy' && (
                      <div className="mb-8 bg-white rounded-3xl p-4 sm:p-6 border border-[#EAE5D9] shadow-xs grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                        <div className="md:col-span-5 grid grid-cols-2 gap-3">
                          <div className="rounded-2xl overflow-hidden aspect-[4/4] bg-[#EFECE4] border border-[#EAE5D9]">
                            <img
                              src="/images/puppies/poppi.webp"
                              alt="Poppi - Mini English Bulldog Dam at OKC Frenchies"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="rounded-2xl overflow-hidden aspect-[4/4] bg-[#EFECE4] border border-[#EAE5D9]">
                            <img
                              src="/images/puppies/poppi-litter.webp"
                              alt="Momma Poppi's Mini English Bulldog Litter at OKC Frenchies"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="md:col-span-7">
                          <span className="inline-block bg-[#E3EFE8] text-[#2E5A44] font-sans font-bold text-xs px-3 py-1 rounded-full mb-2">
                            🐾 Meet Momma Poppi &amp; The Full Litter
                          </span>
                          <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#1C2621]">
                            Poppi’s Chocolate &amp; Lilac Tri Mini English Bulldog Litter
                          </h3>
                          <p className="font-sans text-sm text-[#5C6B63] mt-2 leading-relaxed">
                            Meet sweet Momma <strong>Poppi</strong> (left) and her entire Mini English Bulldog litter (right) — featuring our keeper female <strong>Phatty Patty</strong>, retained/co-own boy <strong>Jellyroll</strong>, and littermates <strong>Brew</strong>, <strong>Bean</strong>, <strong>Biscotti</strong>, and <strong>Brulee</strong>.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {availableForBreed.map((dog) => {
                        const imageMedia = (dog.media || []).filter((m) => m.type === 'image');
                        const photos = imageMedia.length > 0 ? imageMedia.map((m) => m.url) : [dog.image];
                        const currentIdx = cardPhotoIndex[dog.id] || 0;
                        const currentSrc = photos[currentIdx] || dog.image;
                        const isPending = dog.status && dog.status.toLowerCase() === 'pending';

                        return (
                          <div
                            key={dog.id}
                            onClick={() => openModal(dog, currentIdx)}
                            className="group bg-white rounded-[140px_140px_26px_26px] p-3.5 pb-5 border border-[#EAE5D9] shadow-[0_12px_30px_rgba(28,38,33,0.06)] hover:-translate-y-1.5 hover:shadow-[0_18px_38px_rgba(28,38,33,0.1)] transition-all duration-300 text-center flex flex-col cursor-pointer"
                          >
                            {/* Arched Photo */}
                            <div className="relative rounded-[130px_130px_18px_18px] overflow-hidden aspect-[4/4.35] bg-[#EFECE4]">
                              {!currentSrc || imageErrors[dog.id] ? (
                                <div className="w-full h-full flex flex-col items-center justify-center px-6 text-center pt-12">
                                  <ImageIcon className="text-[#2E5A44] mb-2 opacity-50" size={32} />
                                  <span className="text-[#2E5A44] font-display text-lg">Photo Coming Soon</span>
                                </div>
                              ) : (
                                <img
                                  src={currentSrc}
                                  alt={dog.altText || `${dog.name} - ${dog.dna} ${dog.breed}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  onError={() => handleImageError(dog.id)}
                                />
                              )}

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

                            {/* Golden / Sage Badge */}
                            <div className="relative z-10 -mt-3.5 mb-1">
                              <span
                                className={`inline-block font-sans font-bold text-[12px] px-3.5 py-1 rounded-full shadow-xs ${
                                  dog.type === 'Stud'
                                    ? 'bg-[#2E5A44] text-white'
                                    : isPending
                                    ? 'bg-[#E8DFC8] text-[#5C533E]'
                                    : 'bg-[#F4D37E] text-[#1C2621]'
                                }`}
                              >
                                {getGardenPill(dog)}
                              </span>
                            </div>

                            <h3 className="font-display font-bold text-[26px] text-[#1C2621] mt-1 flex items-center justify-center gap-1.5">
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
                            </h3>

                            {dog.badges.length > 0 && (
                              <div className="flex flex-wrap justify-center gap-1.5 mt-1.5 px-2">
                                {dog.badges.map((badge, idx) => (
                                  <span
                                    key={idx}
                                    className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-extrabold border rounded-full inline-flex items-center gap-1 ${badge.color}`}
                                  >
                                    <Dna size={10} />
                                    {badge.label}
                                  </span>
                                ))}
                              </div>
                            )}

                            <p className="font-sans text-[#5C6B63] text-[13px] leading-snug mt-2 mb-4 px-2 min-h-[36px] flex items-center justify-center">
                              {dog.dna}
                            </p>

                            <div className="mt-auto pt-3 px-2 border-t border-[#F0ECE1] flex items-center justify-between">
                              <span className="font-sans font-extrabold text-[18px] text-[#D46A4E]">
                                {dog.price}
                              </span>
                              <span className="bg-[#E3EFE8] group-hover:bg-[#2E5A44] text-[#2E5A44] group-hover:text-white font-sans font-bold text-[13px] px-4 py-2 rounded-full transition-colors">
                                {dog.type === 'Stud' ? 'Stud Info →' : 'Inquire →'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

            {/* PREVIOUSLY SOLD ARCHIVE */}
            {(() => {
              const soldDogs = dogs.filter(
                (d) =>
                  (activeBreedFilter === 'All' || (d.breed || 'French Bulldog') === activeBreedFilter) &&
                  d.status &&
                  !isActiveDogStatus(d.status)
              );

              if (soldDogs.length === 0) return null;

              return (
                <div className="pt-16 mt-16 border-t border-[#DCD6C8]">
                  <h3 className="font-display font-bold text-2xl text-[#5C6B63] mb-8 flex items-center gap-4">
                    <span>Previously Placed Puppies</span>
                    <div className="h-px bg-[#E2DDD2] flex-grow"></div>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                    {soldDogs.map((dog) => (
                      <div
                        key={dog.id}
                        onClick={() => openModal(dog, 0)}
                        className="group bg-white/80 rounded-[100px_100px_22px_22px] p-3 pb-4 border border-[#EAE5D9] hover:bg-white transition-all cursor-pointer text-center"
                      >
                        <div className="relative rounded-[90px_90px_14px_14px] overflow-hidden aspect-[4/4.3] bg-[#EFECE4]">
                          {!dog.image || imageErrors[dog.id] ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="text-[#5C6B63] opacity-40" size={24} />
                            </div>
                          ) : (
                            <img
                              src={dog.image}
                              alt={dog.altText || `${dog.name} - ${dog.dna}`}
                              className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-all duration-300"
                              onError={() => handleImageError(dog.id)}
                            />
                          )}
                        </div>
                        <span className="inline-block -mt-3 relative z-10 bg-[#E2DDD2] text-[#5C6B63] font-sans font-bold text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full">
                          {dog.status}
                        </span>
                        <h4 className="font-display font-bold text-lg text-[#1C2621] mt-1 truncate">
                          {dog.name}
                        </h4>
                        <p className="font-sans text-[11px] text-[#5C6B63] truncate px-1">{dog.dna}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Sunlit Detail Modal */}
      {selectedDog && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[#1C2621]/60 backdrop-blur-sm"
          onClick={closeModal}
        >
          <SEO
            title={`${selectedDog.name} | OKC Frenchies ${selectedDog.type}`}
            description={
              selectedDog.description ||
              `${selectedDog.name} is an elite ${selectedDog.breed} ${selectedDog.type.toLowerCase()} featuring ${selectedDog.dna}.`
            }
            image={`https://okcfrenchies.com/og/dogs/${selectedDog.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}.jpg`}
            schema={{
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: selectedDog.name,
              image: selectedDog.image,
              description:
                selectedDog.description || `${selectedDog.breed} ${selectedDog.type} named ${selectedDog.name}`,
              offers: {
                '@type': 'Offer',
                priceCurrency: 'USD',
                price: (selectedDog.price || '').replace(/[^0-9.]/g, '') || '0',
                availability: 'https://schema.org/InStock'
              }
            }}
          />

          <div
            className="relative w-full max-w-5xl max-h-[90vh] bg-[#F6F4EE] border border-[#DCD6C8] rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden z-[110]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-50 p-2.5 bg-white/90 hover:bg-white text-[#1C2621] rounded-full shadow-md cursor-pointer"
              onClick={closeModal}
            >
              <X size={20} />
            </button>

            {/* Left Media Viewer */}
            <div className="w-full md:w-3/5 bg-[#EFECE4] flex flex-col justify-between relative min-h-[340px] md:min-h-[540px]">
              <div className="flex-grow relative flex items-center justify-center overflow-hidden p-4">
                {selectedDog.media.length > 0 && currentMedia ? (
                  currentMedia.type === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center">
                      {currentMedia.url.includes('drive.google.com') ? (
                        <iframe
                          src={currentMedia.url}
                          className="w-full h-[50vh] border-0 rounded-2xl"
                          allow="autoplay; encrypted-media; fullscreen"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={currentMedia.url}
                          controls
                          autoPlay
                          className="max-w-full max-h-[65vh] object-contain rounded-2xl"
                        />
                      )}
                    </div>
                  ) : modalImageError ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <ImageIcon className="text-[#2E5A44] mb-3 opacity-50" size={44} />
                      <span className="text-[#1C2621] font-display text-xl mb-3">Image Load Failed</span>
                      <button
                        onClick={handleRefreshImage}
                        className="px-4 py-2 bg-[#2E5A44] text-white text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-2 cursor-pointer"
                      >
                        <RefreshCw size={14} /> Retry
                      </button>
                    </div>
                  ) : (
                    <img
                      key={`${currentMedia.url}-${refreshKey}`}
                      src={currentMedia.url}
                      className="max-h-[65vh] w-auto object-contain rounded-2xl shadow-sm"
                      alt={selectedDog.altText || `${selectedDog.name} ${selectedDog.breed}`}
                      onError={() => setModalImageError(true)}
                    />
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <ImageIcon className="text-[#2E5A44] mb-3 opacity-50" size={44} />
                    <span className="text-[#1C2621] font-display text-xl">No Media Available</span>
                  </div>
                )}

                {selectedDog.media.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevMedia}
                      className="absolute left-4 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#1C2621] shadow-md cursor-pointer"
                    >
                      <ChevronLeft size={22} />
                    </button>
                    <button
                      onClick={handleNextMedia}
                      className="absolute right-4 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#1C2621] shadow-md cursor-pointer"
                    >
                      <ChevronRight size={22} />
                    </button>
                  </>
                )}
              </div>

              {selectedDog.media.length > 1 && (
                <div className="p-3 bg-white border-t border-[#E2DDD2] flex items-center justify-center gap-3 overflow-x-auto">
                  {selectedDog.media.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveMediaIndex(idx)}
                      className={`shrink-0 w-16 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        activeMediaIndex === idx
                          ? 'border-[#2E5A44] scale-105'
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
            </div>

            {/* Right Info Panel */}
            <div className="w-full md:w-2/5 p-6 sm:p-8 overflow-y-auto bg-white flex flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-[#E3EFE8] text-[#2E5A44] font-sans font-bold text-xs px-3 py-1 rounded-full">
                  {selectedDog.status || selectedDog.type}
                </span>
                <span className="text-xs font-bold text-[#5C6B63] uppercase tracking-wider">
                  {selectedDog.breed}
                </span>
              </div>

              <h2 className="font-display font-bold text-4xl text-[#1C2621] mb-2 flex items-center gap-2">
                {selectedDog.name}
                {selectedDog.gender === 'Male' && (
                  <span className="text-[#2B6CB0] text-2xl font-sans" title="Male">
                    ♂
                  </span>
                )}
                {selectedDog.gender === 'Female' && (
                  <span className="text-[#C5306C] text-2xl font-sans" title="Female">
                    ♀
                  </span>
                )}
              </h2>

              {selectedDog.badges.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {selectedDog.badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 text-[10px] uppercase tracking-wider font-extrabold border rounded-full inline-flex items-center gap-1 ${badge.color}`}
                    >
                      <Dna size={12} />
                      {badge.label}
                    </span>
                  ))}
                </div>
              )}

              <div className="mb-6">{renderDescription(selectedDog.description)}</div>

              <div className="space-y-3 bg-[#F6F4EE] p-4 rounded-2xl border border-[#EAE5D9] mb-6">
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#5C6B63]">
                    Visual DNA &amp; Coat
                  </span>
                  <span className="font-sans font-bold text-sm text-[#2E5A44]">{selectedDog.dna}</span>
                </div>

                {selectedDog.dna_technical && (
                  <div className="pt-2 border-t border-[#E2DDD2]">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-[#5C6B63]">
                      Tech Sequence
                    </span>
                    <span className="font-mono text-xs text-[#1C2621] break-all">
                      {selectedDog.dna_technical}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-[#E2DDD2] flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5C6B63]">
                    {sheetName === 'Studs' ? 'Stud Fee' : 'Price'}
                  </span>
                  <span className="font-display font-bold text-2xl text-[#D46A4E]">
                    {selectedDog.price}
                  </span>
                </div>
              </div>

              <div className="mt-auto space-y-3">
                <button
                  onClick={handleInquiry}
                  className="w-full py-4 px-6 bg-[#2E5A44] hover:bg-[#234735] text-white font-sans font-bold text-sm rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {sheetName === 'Studs' ? 'Lock In Stud Service' : `Ask About ${selectedDog.name}`}{' '}
                  <ArrowUpRight size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const slug = selectedDog.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    const shareUrl =
                      selectedDog.type === 'Stud'
                        ? `https://okcfrenchies.com/studs/${slug}`
                        : `https://okcfrenchies.com/puppies/${slug}`;
                    navigator.clipboard.writeText(shareUrl);
                    setCopiedDogLink(true);
                    setTimeout(() => setCopiedDogLink(false), 2200);
                  }}
                  className="w-full py-3 px-6 bg-[#F6F4EE] border border-[#DCD6C8] hover:border-[#2E5A44] text-[#1C2621] rounded-full uppercase tracking-wider text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
                    className="block w-full text-center py-3 border border-[#DCD6C8] hover:border-[#2E5A44] text-[#1C2621] rounded-full uppercase tracking-wider text-xs font-bold transition-colors"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <FileText size={14} /> View Pedigree
                    </span>
                  </a>
                )}

                <p className="text-center text-xs text-[#5C6B63] flex items-center justify-center gap-1.5 pt-1">
                  <ShieldCheck size={14} className="text-[#2E5A44]" />
                  Oklahoma City Pickup &amp; Worldwide Flight Nanny Available
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;

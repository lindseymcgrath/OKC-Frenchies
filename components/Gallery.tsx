import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, Dna, X, Activity, Loader2, Play, ChevronLeft, ChevronRight, Image as ImageIcon, AlertTriangle, RefreshCw, FileText } from 'lucide-react';

const getString = (val: any): string => {
  if (val === null || val === undefined) return '';
  return String(val).trim();
};

const renderDescription = (text: string) => {
  if (!text) return <p className="text-slate-500 italic">No description available.</p>;
  return text.split(/\n+/).map((paragraph, index) => (
    <p key={index} className="mb-8 last:mb-0 font-display text-slate-300 leading-[1.8] tracking-[0.05em] font-normal">
      {paragraph}
    </p>
  ));
};

const getDirectDriveLink = (url: string) => {
  if (!url) return '';
  const cleanUrl = getString(url);
  const idRegex = /[-\w]{25,}/;
  const match = cleanUrl.match(idRegex);
  if (match && match[0]) {
      const fileId = match[0];
      return \https://www.google.com/search?q=https://lh3.googleusercontent.com/d/${fileId}=s1000`;`
  }
  return cleanUrl;
};

const getVideoEmbedLink = (url: string) => {
  if (!url) return '';
  const cleanUrl = getString(url);
  // Check typical drive patterns
  if (cleanUrl.includes('drive.google.com') || cleanUrl.includes('docs.google.com')) {
      const idRegex = /[-\w]{25,}/;
      const match = cleanUrl.match(idRegex);
      if (match && match[0]) {
          return `https://drive.google.com/file/d/${match[0]}/preview`;
      }
  }
  return cleanUrl;
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

const Gallery: React.FC<GalleryProps> = ({ filterType, title, subtitle, sheetName }) => {
  const navigate = useNavigate();
  const [dogs, setDogs] = useState<DogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDog, setSelectedDog] = useState<DogData | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [modalImageError, setModalImageError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (selectedDog) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedDog]);

  useEffect(() => {
      setModalImageError(false);
  }, [activeMediaIndex]);

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({...prev, [id]: true}));
  };

  const handleRefreshImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setRefreshKey(prev => prev + 1);
      setModalImageError(false);
  };

  const openModal = (dog: DogData) => {
      setActiveMediaIndex(0);
      setModalImageError(false);
      setRefreshKey(0);
      setSelectedDog(dog);
  };

  const handleInquiry = () => {
      if (!selectedDog) return;
      const interestType = selectedDog.type === 'Stud' ? 'Stud Service' : 'Puppy Acquisition';
      navigate(`/inquiry?dog=${encodeURIComponent(selectedDog.name)}&interest=${encodeURIComponent(interestType)}`);
  };

  useEffect(() => {
    const SHEET_ID = '153OocA25gmPaynCxCjJQKVZa2abVJ44lsDZv25U0ul8';
    const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

    const analyzeDNA = (dna: string): Badge[] => {
        if (!dna) return [];
        const cleanDna = getString(dna);
        const badges: Badge[] = [];
        
        if (/\bA\/A\b/i.test(cleanDna)) {
            badges.push({ 
                label: 'FULL PINK', 
                color: 'bg-rose-500/20 text-rose-200 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
            });
        }
        else if (/\b(n\/A|A\/n)\b/i.test(cleanDna)) {
            badges.push({
                label: 'PINK CARRIER',
                color: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40 shadow-[0_0_10px_rgba(217,70,239,0.2)]'
            });
        }
        
        const hasFurnishings = /\b(n\/F|F\/F|F\/n)\b/i.test(cleanDna);
        const isVisualFluffy = /\b(l1\/l4|l4\/l1|l1\/l1|l4\/l4|l\/l)\b/i.test(cleanDna);
        const isFluffyCarrier = /\b(L\/l1|L\/l4|n\/l1|n\/l4|L\/l|n\/l)\b/i.test(cleanDna);

        if (hasFurnishings) {
            if (isVisualFluffy) {
                badges.push({ 
                    label: 'FLOODLE', 
                    color: 'bg-amber-400/20 text-amber-300 border-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.3)]' 
                });
            } else if (isFluffyCarrier) {
                badges.push({ 
                    label: 'FLOODLE PRODUCER', 
                    color: 'bg-blue-900/40 text-blue-200 border-blue-700/50 shadow-[0_0_15px_rgba(30,64,175,0.3)]' 
                });
            }
        }

        if (/\beA\/eA\b/.test(cleanDna)) {
            badges.push({ 
                label: 'VISUAL eA', 
                color: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
            });
        }

        return badges;
    };

    const fetchDogs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(CSV_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch spreadsheet: ${response.status} ${response.statusText}`);
        }
        
        const csvText = await response.text();
        
        if (csvText.trim().toLowerCase().startsWith('<!doctype html')) {
            throw new Error("Spreadsheet not published to web. Please go to File > Share > Publish to web in Google Sheets.");
        }
        
        if ((window as any).Papa) {
          (window as any).Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (results: any) => {
              if (results.data && results.data.length > 0) {
                  const fetchedDogs = results.data
                    .map((row: any, index: number) => {
                      const name = getString(row['Name']);
                      if (!name) return null;

                      const status = getString(row['Status']) || (sheetName === 'Studs' ? 'Stud' : 'Available');
                      const visualDesc = getString(row['Visual_Description']) || getString(row['DNA_Summary']);
                      const techDNA = getString(row['DNA_Technical']);
                      const investment = getString(row['Investment']) || getString(row['Stud_Fee']) || 'Inquire';
                      const mainImageUrl = getString(row['Image_URL']);
                      const rawBio = row['Bio'] ? row['Bio'] : visualDesc;
                      const bio = getString(rawBio) || 'No description provided.';
                      const altText = getString(row['Alt_Text']); 
                      const videoUrl = getString(row['Video_URL']);
                      const breed = getString(row['Breed']) || 'French Bulldog';
                      const pedigreeLink = getString(row['Pedigree_Link']);
                      
                      const rawGender = getString(row['Gender']);
                      let gender = '';
                      if (sheetName === 'Studs') {
                          gender = 'Male';
                      } else {
                          const lowerGender = rawGender.toLowerCase();
                          if (lowerGender.startsWith('f') || lowerGender.includes('female')) gender = 'Female';
                          else if (lowerGender.startsWith('m') || lowerGender.includes('male')) gender = 'Male';
                          else if (status.toLowerCase().includes('female')) gender = 'Female';
                          else if (status.toLowerCase().includes('male')) gender = 'Male';
                      }

                      const dnaForBadges = techDNA || visualDesc;
                      const badges = analyzeDNA(dnaForBadges);
                      
                      const media: MediaItem[] = [];
                      const processedMainImage = getDirectDriveLink(mainImageUrl);
                      if (processedMainImage) media.push({ type: 'image', url: processedMainImage });
                      
                      for (let i = 1; i <= 4; i++) {
                          const raw = row[`Image_URL_${i}`];
                          if (raw) {
                              const url = getDirectDriveLink(getString(raw));
                              if (url) media.push({ type: 'image', url });
                          }
                      }

                      if (videoUrl) {
                          const vUrl = getVideoEmbedLink(videoUrl);
                          media.push({ type: 'video', url: vUrl });
                      }
                      
                      const type = (sheetName === 'Studs' || status.toLowerCase().includes('stud')) ? 'Stud' : 'Puppy';

                      return {
                        id: row['ID'] ? getString(row['ID']) : `sheet-${index}`,
                        name: name,
                        breed: breed,
                        gender: gender,
                        dna: visualDesc, 
                        dna_technical: techDNA,
                        description: bio, 
                        altText: altText,
                        image: processedMainImage,
                        price: investment, 
                        type: type,
                        status: status,
                        badges: badges,
                        media: media,
                        pedigreeLink: pedigreeLink
                      };
                    })
                    .filter((dog: DogData | null) => dog !== null)
                    .filter((dog: DogData) => {
                      if (filterType === 'Stud') return dog.type === 'Stud';
                      return dog.type !== 'Stud'; 
                    });

                  setDogs(fetchedDogs);
              }
              setLoading(false);
            },
            error: (err: any) => {
                setError(`Parser Error: ${err.message}`);
                setLoading(false);
            }
          });
        }
      } catch (err: any) {
        setError(`Fetch Error: ${err.message}`);
        setLoading(false);
      }
    };

    fetchDogs();
  }, [filterType, sheetName]);

  const handleNextMedia = () => {
      if (!selectedDog || selectedDog.media.length === 0) return;
      setActiveMediaIndex((prev) => (prev + 1) % selectedDog.media.length);
  };

  const handlePrevMedia = () => {
      if (!selectedDog || selectedDog.media.length === 0) return;
      setActiveMediaIndex((prev) => (prev - 1 + selectedDog.media.length) % selectedDog.media.length);
  };

  const currentMedia = selectedDog && selectedDog.media && selectedDog.media[activeMediaIndex] 
    ? selectedDog.media[activeMediaIndex] 
    : null;

  return (
    <section className="py-32 bg-[#020617] relative min-h-screen">
      <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-slate-800 pb-8">
          <div>
            <h2 className="font-serif text-4xl md:text-6xl text-slate-100 mb-2">{title}</h2>
            <p className="font-sans text-luxury-teal text-xs tracking-[0.25em] uppercase">
              {subtitle}
            </p>
          </div>
          <div className="mt-6 md:mt-0">
             <span className="font-mono text-xs text-slate-500">
                {loading ? 'SYNCING...' : `${dogs.length} AVAILABLE`}
             </span>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-luxury-teal mb-4" size={48} />
            <p className="font-sans text-slate-400 text-sm tracking-widest uppercase">Loading Genetics...</p>
          </div>
        )}

        {error && !loading && (
            <div className="flex flex-col items-center justify-center py-20 border border-red-900/50 bg-red-900/10 rounded p-8">
                <AlertTriangle className="text-red-500 mb-4" size={48} />
                <h3 className="text-red-400 font-serif text-xl mb-2">Connection Error</h3>
                <p className="text-red-300 font-mono text-sm">{error}</p>
            </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dogs.map((dog) => (
                <div 
                  key={dog.id} 
                  className="group relative bg-white/5 backdrop-blur-md border border-luxury-teal/30 hover:border-luxury-teal/60 transition-all duration-500 overflow-hidden cursor-pointer rounded-sm"
                  onClick={() => openModal(dog)}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-slate-900 pointer-events-none">
                    {(!dog.image || imageErrors[dog.id]) ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 px-6 text-center pt-20">
                             <ImageIcon className="text-luxury-teal mb-3 opacity-50" size={32} />
                             <span className="text-luxury-teal font-serif text-xl mb-1">Photo Coming Soon</span>
                             <span className="text-slate-500 font-sans text-[10px] uppercase tracking-widest">{dog.name}</span>
                        </div>
                    ) : (
                        <img 
                            src={dog.image} 
                            alt={dog.altText || `${dog.name} - ${dog.dna} French Bulldog Stud Service OKC`}
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
                            crossOrigin="anonymous"
                            onError={() => handleImageError(dog.id)}
                        />
                    )}
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40 pointer-events-none">
                       <div className="text-center p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <span className="block text-luxury-teal text-xs uppercase tracking-widest mb-2 font-bold">DNA Analysis</span>
                          <span className="font-mono text-white text-sm break-words line-clamp-3">{dog.dna}</span>
                       </div>
                    </div>

                    {dog.badges.length > 0 && (
                        <div className="absolute top-4 left-4 z-20 flex flex-row flex-wrap items-start gap-2 max-w-[95%] pointer-events-none">
                            {dog.badges.map((badge, idx) => (
                                <span key={idx} className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-extrabold backdrop-blur-xl border flex items-center gap-1.5 rounded-sm whitespace-nowrap ${badge.color}`}>
                                    <Dna size={12} />
                                    {badge.label}
                                </span>
                            ))}
                        </div>
                    )}
                  </div>

                  <div className="p-6 border-t border-white/10 bg-black/20 pointer-events-none">
                    <div className="flex justify-between items-end mb-2">
                      <h3 className="font-serif text-2xl text-slate-100 flex items-center gap-2">
                        {dog.name}
                        {dog.gender === 'Male' && <span className="text-[#1d4ed8] text-xl font-bold ml-1" title="Male">♂</span>}
                        {dog.gender === 'Female' && <span className="text-[#db2777] text-xl font-bold ml-1" title="Female">♀</span>}
                      </h3>
                      <span className="font-serif text-lg text-luxury-teal">{dog.price}</span>
                    </div>
                    <p className="font-sans text-slate-500 text-xs tracking-widest uppercase mb-4">
                        {dog.breed}
                    </p>
                    <div className="h-px w-full bg-gradient-to-r from-luxury-teal/50 to-transparent mb-4" />
                    <p className="font-mono text-[10px] text-slate-400 truncate">
                        {sheetName === 'Studs' ? 'DNA: ' + dog.dna : 'Phenotype: ' + dog.dna}
                    </p>
                    {dog.status && dog.status !== 'Available' && dog.status !== 'Stud' && (
                        <p className="font-sans text-xs text-white uppercase tracking-widest mt-2 bg-white/10 inline-block px-2 py-1">{dog.status}</p>
                    )}
                  </div>
                </div>
            ))}
          </div>
        )}
      </div>

      {selectedDog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedDog(null)} />
            
            <div 
              className="relative w-full h-full md:h-[90vh] md:max-w-7xl bg-[#0a0a0a]/95 backdrop-blur-xl border border-luxury-teal/30 shadow-[0_0_30px_rgba(45,212,191,0.3)] flex flex-col md:flex-row overflow-hidden z-[110]" 
              onClick={(e) => e.stopPropagation()}
            >
                <button 
                    className="absolute top-6 right-6 z-50 p-2 bg-black/50 text-white hover:text-luxury-teal hover:bg-white/10 transition-all rounded-full backdrop-blur-md border border-white/10"
                    onClick={() => setSelectedDog(null)}
                >
                    <X size={24} />
                </button>

                <div className="w-full md:w-2/3 h-[50vh] md:h-full relative bg-[#020617] flex flex-col border-r border-slate-800">
                    <div className="flex-grow relative flex items-center justify-center overflow-hidden bg-black/50">
                        {selectedDog.media.length > 0 && currentMedia ? (
                            <>
                                {currentMedia.type === 'video' ? (
                                    <div className="w-full h-full flex items-center justify-center bg-black relative">
                                        {(currentMedia.url.includes('drive.google.com')) ? (
                                             <iframe 
                                                src={currentMedia.url} 
                                                className="w-full h-full border-0" 
                                                allow="autoplay; encrypted-media; fullscreen"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <video 
                                                src={currentMedia.url} 
                                                controls 
                                                autoPlay 
                                                className="max-w-full max-h-full object-contain"
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        {(modalImageError) ? (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-black p-6 text-center pt-20">
                                                 <ImageIcon className="text-luxury-teal mb-4 opacity-50" size={48} />
                                                 <span className="text-luxury-teal font-serif text-xl mb-2">Image Load Failed</span>
                                                 <button 
                                                    onClick={handleRefreshImage}
                                                    className="px-4 py-2 bg-slate-800 text-white text-xs uppercase tracking-widest hover:bg-luxury-teal hover:text-black transition-colors border border-slate-700 flex items-center gap-2 mx-auto"
                                                 >
                                                    <RefreshCw size={14} /> Force Refresh
                                                 </button>
                                            </div>
                                        ) : (
                                            <img 
                                                key={`${currentMedia.url}-${refreshKey}`}
                                                src={`${currentMedia.url}`} 
                                                className="w-full h-full object-contain" 
                                                alt={selectedDog.altText || `${selectedDog.name} French Bulldog Stud genetics`}
                                                crossOrigin="anonymous"
                                                onError={() => setModalImageError(true)}
                                            />
                                        )}
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-black">
                                 <ImageIcon className="text-luxury-teal mb-4 opacity-50" size={48} />
                                 <span className="text-luxury-teal font-serif text-xl">No Media Available</span>
                            </div>
                        )}
                        
                        {selectedDog.media.length > 1 && (
                            <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                                <button onClick={handlePrevMedia} className="p-3 rounded-full bg-black/40 text-white hover:bg-luxury-teal hover:text-black transition-all pointer-events-auto backdrop-blur-sm">
                                    <ChevronLeft size={24} />
                                </button>
                                <button onClick={handleNextMedia} className="p-3 rounded-full bg-black/40 text-white hover:bg-luxury-teal hover:text-black transition-all pointer-events-auto backdrop-blur-sm">
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        )}

                         {selectedDog.badges.length > 0 && (
                            <div className="absolute top-6 left-6 flex flex-wrap gap-2 max-w-[90%] pointer-events-none">
                               {selectedDog.badges.map((badge, idx) => (
                                   <span key={idx} className={`px-4 py-2 text-xs uppercase tracking-widest font-bold backdrop-blur-xl border flex items-center gap-2 ${badge.color}`}>
                                        <Dna size={14} />
                                        {badge.label}
                                    </span>
                               ))}
                            </div>
                        )}
                    </div>

                    <div className="h-24 bg-[#0a0a0a] border-t border-slate-800 flex items-center px-6 gap-4 overflow-x-auto no-scrollbar">
                        {selectedDog.media.map((item, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setActiveMediaIndex(idx)}
                                className={`relative flex-shrink-0 w-20 h-14 rounded-sm overflow-hidden border-2 transition-all ${
                                    activeMediaIndex === idx ? 'border-luxury-teal opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
                                }`}
                            >
                                {item.type === 'video' ? (
                                    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                        <Play size={20} className="text-white fill-white" />
                                    </div>
                                ) : (
                                    <img src={item.url} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full md:w-1/3 p-8 md:p-12 overflow-y-auto bg-[#0f172a] border-l border-slate-800">
                    <div className="flex items-center gap-2 mb-6">
                        <Activity className="text-luxury-teal" size={18} />
                        <span className="text-xs font-bold text-luxury-teal uppercase tracking-[0.2em]">Genetic Configurator</span>
                    </div>
                    
                    <h2 className="font-serif text-5xl text-white mb-2 tracking-tight flex items-center gap-3">
                        {selectedDog.name}
                        {selectedDog.gender === 'Male' && <span className="text-[#1d4ed8] text-3xl font-bold ml-1" title="Male">♂</span>}
                        {selectedDog.gender === 'Female' && <span className="text-[#db2777] text-3xl font-bold ml-1" title="Female">♀</span>}
                    </h2>
                    <p className="font-sans text-slate-400 text-xs tracking-widest uppercase mb-8">
                        {selectedDog.breed}
                    </p>

                    <div className="space-y-8">
                         <div>
                            <h3 className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Profile</h3>
                            <div className="text-slate-300 text-sm leading-relaxed border-l-2 border-slate-700 pl-4 font-sans">
                                {renderDescription(selectedDog.description)}
                            </div>
                         </div>

                         <div className="grid grid-cols-1 gap-px bg-slate-800 border border-slate-800">
                             <div className="bg-[#0f172a] p-4">
                                 <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Visual DNA</span>
                                 <span className="font-mono text-sm text-luxury-teal">{selectedDog.dna}</span>
                             </div>
                             {selectedDog.dna_technical && (
                                <div className="bg-[#0f172a] p-4">
                                    <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Tech Sequence</span>
                                    <span className="font-mono text-xs text-slate-300 break-all">{selectedDog.dna_technical}</span>
                                </div>
                             )}
                             <div className="bg-[#0f172a] p-4">
                                 <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                                    {sheetName === 'Studs' ? 'Stud Fee' : 'Investment'}
                                 </span>
                                 <span className="font-serif text-xl text-white">{selectedDog.price}</span>
                             </div>
                             <div className="bg-[#0f172a] p-4">
                                 <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Status</span>
                                 <span className="font-sans text-xs text-white uppercase tracking-widest">{selectedDog.status}</span>
                             </div>
                         </div>

                         <button 
                            onClick={handleInquiry}
                            className="w-full group relative overflow-hidden py-4 bg-white text-black font-bold uppercase tracking-[0.2em] hover:bg-luxury-teal transition-colors"
                         >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {sheetName === 'Studs' ? 'Lock In Stud Service' : `Reserve ${selectedDog.name}`} <ArrowUpRight size={18} />
                            </span>
                         </button>
                         
                         {selectedDog.pedigreeLink && (
                            <a href={selectedDog.pedigreeLink} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-3 border border-slate-700 text-slate-400 hover:text-white hover:border-white transition-colors uppercase tracking-[0.2em] text-xs font-bold mt-2">
                                <span className="flex items-center justify-center gap-2"><FileText size={14}/> View Pedigree</span>
                            </a>
                         )}

                         <p className="text-center text-[10px] text-slate-600 uppercase tracking-wider">
                            Worldwide Delivery Available
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

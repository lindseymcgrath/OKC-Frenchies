import React, { useEffect, useState } from 'react';
import { SHOWCASE } from '../constants';
import { ArrowUpRight, ShieldCheck, Dna, Image as ImageIcon } from 'lucide-react';

// Helper for Google Drive Links - Uses robust lh3 domain to prevent production 403 errors
const getDirectDriveLink = (url: string) => {
  if (!url) return '';
  const cleanUrl = url.trim();
  const idRegex = /[-\w]{25,}/;
  const match = cleanUrl.match(idRegex);
  if (match && match[0]) {
      // Use lh3.googleusercontent.com for reliable high-res hotlinking
      return `https://lh3.googleusercontent.com/d/${match[0]}=s1000`; 
  }
  return cleanUrl;
};

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
  image: string;
  price: string;
  type: string;
  status: string;
  badges: Badge[];
}

const BreedShowcase: React.FC = () => {
  const [dogs, setDogs] = useState<DogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({...prev, [id]: true}));
  };

  useEffect(() => {
    const SHEET_ID = '153OocA25gmPaynCxCjJQKVZa2abVJ44lsDZv25U0ul8';
    // Use gviz to fetch specific sheet
    const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Puppies`;

    const analyzeDNA = (dna: string): Badge[] => {
        if (!dna) return [];
        const cleanDna = dna.trim();
        const badges: Badge[] = [];
        
        // --- PINK LOGIC ---
        // Full Pink: A/A
        if (/\bA\/A\b/i.test(cleanDna)) {
            badges.push({ 
                label: 'FULL PINK', 
                color: 'bg-rose-500/20 text-rose-200 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
            });
        }
        // Pink Carrier: n/A or A/n
        else if (/\b(n\/A|A\/n)\b/i.test(cleanDna)) {
            badges.push({
                label: 'PINK CARRIER',
                // Magenta
                color: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40 shadow-[0_0_10px_rgba(217,70,239,0.2)]'
            });
        }
        
        // --- FLOODLE LOGIC ---
        // Furnishings: n/F or F/F or F/n
        const hasFurnishings = /\b(n\/F|F\/F|F\/n)\b/i.test(cleanDna);

        // Visual Fluffy (2 copies): l1/l4, l1/l1, l4/l4, l/l
        const isVisualFluffy = /\b(l1\/l4|l4\/l1|l1\/l1|l4\/l4|l\/l)\b/i.test(cleanDna);
        
        // Fluffy Carrier (1 copy): L/l1, L/l4, L/l, n/l1, n/l4
        const isFluffyCarrier = /\b(L\/l1|L\/l4|n\/l1|n\/l4|L\/l|n\/l)\b/i.test(cleanDna);

        if (hasFurnishings) {
            if (isVisualFluffy) {
                badges.push({ 
                    label: 'FLOODLE', 
                    // Gold
                    color: 'bg-amber-400/20 text-amber-300 border-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.3)]' 
                });
            } else if (isFluffyCarrier) {
                badges.push({ 
                    label: 'FLOODLE PRODUCER', 
                    // Royal Blue
                    color: 'bg-blue-900/40 text-blue-200 border-blue-700/50 shadow-[0_0_15px_rgba(30,64,175,0.3)]' 
                });
            }
        }

        // --- OTHER RARE TRAITS ---
        // Visual eA
        if (/\beA\/eA\b/.test(cleanDna)) {
            badges.push({ 
                label: 'VISUAL eA', 
                color: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
            });
        }

        return badges;
    };

    fetch(CSV_URL)
      .then(response => response.text())
      .then(csvText => {
        if ((window as any).Papa) {
          (window as any).Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (results: any) => {
              const fetchedDogs = results.data.map((row: any, index: number) => {
                const technicalDNA = row['DNA_Technical'] || '';
                const rawGender = row['Gender'] || '';
                const badges = analyzeDNA(technicalDNA);
                
                const status = row['Status'] || 'Available';
                const type = status.toLowerCase().includes('stud') ? 'Stud' : 'Puppy';
                
                // Breed Logic
                const breed = row['Breed'] && row['Breed'].trim() !== '' ? row['Breed'] : 'French Bulldog';

                // Normalize Gender
                let gender = '';
                const lowerGender = rawGender.toLowerCase();
                if (lowerGender.startsWith('f') || lowerGender.includes('female')) gender = 'Female';
                else if (lowerGender.startsWith('m') || lowerGender.includes('male')) gender = 'Male';
                else if (status.toLowerCase().includes('female')) gender = 'Female';
                else if (status.toLowerCase().includes('male')) gender = 'Male';

                return {
                  id: row['ID'] || `sheet-${index}`,
                  name: row['Name'] || 'Frosty',
                  breed: breed,
                  gender: gender,
                  dna: row['Visual_Description'] || '', 
                  dna_technical: technicalDNA,
                  description: row['Bio'] || 'No description available.',
                  image: getDirectDriveLink(row['Image_URL']),
                  price: row['Investment'] || 'Inquire',
                  type: type,
                  status: status,
                  badges: badges
                };
              });
              
              setDogs(fetchedDogs.length > 0 ? fetchedDogs.slice(0, 3) : SHOWCASE as any);
              setLoading(false);
            },
            error: (err: any) => {
                setDogs(SHOWCASE as any);
                setLoading(false);
            }
          });
        } else {
             setDogs(SHOWCASE as any);
             setLoading(false);
        }
      })
      .catch(err => {
        setDogs(SHOWCASE as any);
        setLoading(false);
      });
  }, []);

  return (
    <section id="showcase" className="py-32 bg-[#020617] relative border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <h2 className="font-serif text-4xl md:text-6xl text-slate-100 mb-2">Curated Bloodlines</h2>
            <p className="font-sans text-luxury-teal text-xs tracking-[0.25em] uppercase">
              Frenchies • Mini English • Exotics
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <a href="#" className="group flex items-center gap-2 text-slate-400 text-xs tracking-widest uppercase hover:text-luxury-teal transition-colors">
              View All Inventory
              <ArrowUpRight size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
             [1,2,3].map(i => (
                 <div key={i} className="h-[600px] bg-slate-900/50 animate-pulse border border-slate-800"></div>
             ))
          ) : (
            dogs.map((dog) => (
                <div 
                  key={dog.id} 
                  className="group relative bg-[#0a0a0a] border border-slate-800 hover:border-luxury-teal/30 transition-all duration-500 overflow-hidden"
                >
                  {/* Image Area */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-slate-900">
                    {(!dog.image || imageErrors[dog.id]) ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 px-6 text-center pt-20">
                             <ImageIcon className="text-luxury-teal mb-3 opacity-50" size={32} />
                             <span className="text-luxury-teal font-serif text-sm mb-1">Photo Coming Soon</span>
                             <span className="text-slate-500 font-sans text-[10px] uppercase tracking-widest">{dog.name}</span>
                        </div>
                    ) : (
                        <img 
                            src={dog.image} 
                            alt={dog.name}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
                            crossOrigin="anonymous"
                            onError={() => handleImageError(dog.id)}
                        />
                    )}
                    
                    {/* Top Badges Container - Forced Horizontal Row */}
                    <div className="absolute top-4 left-4 z-20 flex flex-row flex-wrap gap-2 items-start w-[95%] pointer-events-none">
                        {/* Status Badge */}
                        <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold backdrop-blur-md border ${
                          dog.type === 'Stud' 
                            ? 'bg-luxury-teal/10 border-luxury-teal/30 text-luxury-teal' 
                            : 'bg-white/10 border-white/20 text-white'
                        }`}>
                          {dog.status || dog.type}
                        </span>
                        
                        {/* Genetic Badges - Safe access check */}
                        {dog.badges && dog.badges.map((badge, idx) => (
                            <span key={idx} className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold backdrop-blur-md border flex items-center gap-1 ${badge.color}`}>
                                <Dna size={10} />
                                {badge.label}
                            </span>
                        ))}
                    </div>

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />
                  </div>

                  {/* Content Card */}
                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <div className="flex justify-between items-end mb-2">
                      <h3 className="font-serif text-3xl text-slate-100 flex items-center gap-2">
                        {dog.name}
                        {/* Gender Icon */}
                        {dog.gender === 'Male' && <span className="text-[#1d4ed8] text-xl font-bold ml-1" title="Male">♂</span>}
                        {dog.gender === 'Female' && <span className="text-[#db2777] text-xl font-bold ml-1" title="Female">♀</span>}
                      </h3>
                      <div className="flex items-center gap-1 text-luxury-teal/80">
                         <ShieldCheck size={14} />
                         <span className="text-[10px] tracking-widest uppercase">Health Tested</span>
                      </div>
                    </div>
                    
                    <p className="font-sans text-slate-500 text-xs tracking-widest uppercase mb-4">
                        {dog.breed}
                    </p>
                    
                    <div className="h-px w-12 bg-luxury-teal/50 mb-4" />
                    
                    <p className="font-sans text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
                      {dog.description}
                    </p>

                    {/* Specs */}
                    <div className="flex justify-between items-center border-t border-slate-800 pt-4">
                      <div>
                        <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">DNA</span>
                        <span className="font-mono text-xs text-luxury-teal">{dog.dna}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Investment</span>
                        <span className="font-serif text-lg text-slate-200">{dog.price}</span>
                      </div>
                    </div>
                    
                    {/* Interactive slide-up button */}
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-luxury-teal transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>
                </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
};

export default BreedShowcase;
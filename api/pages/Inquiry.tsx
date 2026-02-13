import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Send, CheckCircle2, Loader2, ChevronDown, AlertCircle } from 'lucide-react';

interface DogOption {
    name: string;
    type: 'Puppy' | 'Stud';
}

const Inquiry: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // ---------------------------------------------------------------------------
    // CONFIGURATION: EMAIL SERVICE
    // ---------------------------------------------------------------------------
    const FORM_ENDPOINT = "https://formspree.io/f/mwvneekz"; 
    // ---------------------------------------------------------------------------

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        interest: '',
        selectedDog: '',
        rights: '',
        message: ''
    });

    const [availableDogs, setAvailableDogs] = useState<DogOption[]>([]);
    const [loadingDogs, setLoadingDogs] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);

    // Initial Params
    useEffect(() => {
        const dogParam = searchParams.get('dog');
        const interestParam = searchParams.get('interest');

        setFormData(prev => ({
            ...prev,
            selectedDog: dogParam || '',
            interest: interestParam || 'Puppy Acquisition'
        }));
    }, [searchParams]);

    // Fetch Dogs for Dropdown
    useEffect(() => {
        const SHEET_ID = '153OocA25gmPaynCxCjJQKVZa2abVJ44lsDZv25U0ul8';
        const sheets = ['Puppies', 'Studs'];
        
        const fetchAll = async () => {
            let combined: DogOption[] = [];
            
            for (const sheet of sheets) {
                try {
                    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheet}`;
                    const res = await fetch(url);
                    const text = await res.text();
                    
                    if ((window as any).Papa) {
                        const parsed = (window as any).Papa.parse(text, { header: true, skipEmptyLines: true });
                        const names = parsed.data
                            .map((row: any) => row['Name'] ? { name: row['Name'].trim(), type: sheet === 'Puppies' ? 'Puppy' : 'Stud' } : null)
                            .filter((item: any) => item !== null);
                        combined = [...combined, ...names];
                    }
                } catch (e) {
                    console.error(`Error fetching ${sheet}`, e);
                }
            }
            setAvailableDogs(combined);
            setLoadingDogs(false);
        };

        fetchAll();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setSubmissionError(null); // Clear errors on edit
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmissionError(null);
        
        try {
            const response = await fetch(FORM_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSuccess(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const data = await response.json();
                if (data.errors) {
                     setSubmissionError(data.errors.map((err: any) => err.message).join(", "));
                } else {
                     setSubmissionError("The server encountered an error. Please try again later.");
                }
            }
        } catch (error) {
            setSubmissionError("Network error. Please check your connection and try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="min-h-screen bg-[#020617] pt-32 pb-20 relative">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-luxury-teal/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay pointer-events-none"></div>

            <div className="max-w-3xl mx-auto px-6 relative z-10">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="font-display text-5xl md:text-7xl text-slate-100 mb-6">
                        Secure Your Legacy
                    </h1>
                    <div className="flex justify-center items-center gap-4">
                        <div className="h-px w-12 bg-luxury-teal/50" />
                        <p className="font-serif text-xs tracking-[0.3em] uppercase text-luxury-teal">Official Inquiry</p>
                        <div className="h-px w-12 bg-luxury-teal/50" />
                    </div>
                </div>

                {success ? (
                    <div className="bg-slate-900/50 backdrop-blur-md border border-luxury-teal/30 p-12 text-center rounded-sm animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-luxury-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="text-luxury-teal" size={40} />
                        </div>
                        <h2 className="font-display text-3xl text-white mb-4">Inquiry Received</h2>
                        <p className="font-sans text-slate-400 leading-relaxed mb-8 max-w-md mx-auto">
                            Thank you for contacting OKC Frenchies. Your request has been logged in our system. A representative will contact you within 24 hours to finalize details.
                        </p>
                        <button 
                            onClick={() => navigate('/')}
                            className="text-xs font-bold uppercase tracking-[0.2em] text-white border border-slate-700 px-8 py-3 hover:bg-luxury-teal hover:text-black hover:border-luxury-teal transition-all"
                        >
                            Return Home
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-sm shadow-2xl">
                        
                        {/* Error Message Display */}
                        {submissionError && (
                            <div className="mb-8 bg-red-900/20 border border-red-900/50 p-4 flex items-start gap-3 rounded-sm">
                                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                                <div>
                                    <h4 className="text-red-400 text-xs font-bold uppercase tracking-widest mb-1">Submission Error</h4>
                                    <p className="text-red-300 text-sm">{submissionError}</p>
                                </div>
                            </div>
                        )}

                        {/* Section 1: Contact */}
                        <div className="mb-10">
                            <h3 className="font-display text-2xl text-slate-200 mb-6 flex items-center gap-3">
                                <span className="text-luxury-teal text-lg">01.</span> Contact Details
                            </h3>
                            {/* Full Name */}
                            <div className="mb-6">
                                <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-2">Full Name / Program</label>
                                <input 
                                    required
                                    type="text" 
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-slate-700 p-4 text-slate-200 focus:border-luxury-teal focus:outline-none transition-colors font-sans"
                                    placeholder="John Doe / Elite Bullies"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
                                    <input 
                                        required
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-slate-700 p-4 text-slate-200 focus:border-luxury-teal focus:outline-none transition-colors font-sans"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-2">Phone Number</label>
                                    <input 
                                        required
                                        type="tel" 
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-slate-700 p-4 text-slate-200 focus:border-luxury-teal focus:outline-none transition-colors font-sans"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="h-px w-full bg-slate-800 mb-10" />

                        {/* Section 2: Interest */}
                        <div className="mb-10">
                            <h3 className="font-display text-2xl text-slate-200 mb-6 flex items-center gap-3">
                                <span className="text-luxury-teal text-lg">02.</span> Acquisition Details
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-2">Area of Interest</label>
                                    <div className="relative">
                                        <select 
                                            name="interest"
                                            value={formData.interest}
                                            onChange={handleChange}
                                            className="w-full bg-black/40 border border-slate-700 p-4 text-slate-200 focus:border-luxury-teal focus:outline-none appearance-none font-sans"
                                        >
                                            <option value="Puppy Acquisition">Puppy Acquisition</option>
                                            <option value="Stud Service">Stud Service</option>
                                            <option value="Genetic Consultation">Genetic Consultation</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-2">Select Selection</label>
                                        <div className="relative">
                                            <select 
                                                name="selectedDog"
                                                value={formData.selectedDog}
                                                onChange={handleChange}
                                                className="w-full bg-black/40 border border-slate-700 p-4 text-slate-200 focus:border-luxury-teal focus:outline-none appearance-none font-sans"
                                            >
                                                <option value="">-- General Inquiry --</option>
                                                {loadingDogs ? (
                                                    <option disabled>Loading Registry...</option>
                                                ) : (
                                                    availableDogs.map((dog, idx) => (
                                                        <option key={idx} value={dog.name}>{dog.name} ({dog.type})</option>
                                                    ))
                                                )}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-2">Type of Rights</label>
                                        <div className="relative">
                                            <select 
                                                name="rights"
                                                value={formData.rights}
                                                onChange={handleChange}
                                                className="w-full bg-black/40 border border-slate-700 p-4 text-slate-200 focus:border-luxury-teal focus:outline-none appearance-none font-sans"
                                            >
                                                <option value="Pet Home">Pet Home (Limited Registration)</option>
                                                <option value="Full Breeding Rights">Full Breeding Rights</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-px w-full bg-slate-800 mb-10" />

                        {/* Section 3: Message */}
                        <div className="mb-10">
                             <h3 className="font-display text-2xl text-slate-200 mb-6 flex items-center gap-3">
                                <span className="text-luxury-teal text-lg">03.</span> Special Requests
                            </h3>
                            <textarea 
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                className="w-full bg-black/40 border border-slate-700 p-4 text-slate-200 focus:border-luxury-teal focus:outline-none transition-colors font-sans"
                                placeholder="Any specific questions regarding DNA, structure, or shipping logistics..."
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="w-full py-5 bg-luxury-teal text-black font-bold uppercase tracking-[0.25em] hover:bg-white transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <><Loader2 className="animate-spin" size={20} /> Processing...</>
                            ) : (
                                <><Send size={20} /> Submit Inquiry</>
                            )}
                        </button>

                    </form>
                )}
            </div>
        </section>
    );
};

export default Inquiry;
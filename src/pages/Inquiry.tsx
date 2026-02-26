import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Send, CheckCircle2, Loader2, ChevronDown, AlertCircle } from 'lucide-react';
import { supabase } from '../utils/calculatorHelpers'; 

interface DogOption {
    name: string;
    type: 'Puppy' | 'Stud';
}

const Inquiry: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        interest: '',
        selectedDog: '',
        rights: 'Pet Home', // Default set
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

    // Fetch Dogs from Sheets for the dropdown
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
                } catch (e) { console.error(`Error fetching ${sheet}`, e); }
            }
            setAvailableDogs(combined);
            setLoadingDogs(false);
        };
        fetchAll();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setSubmissionError(null);
    };

    // ✅ NEW: Direct Supabase Submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmissionError(null);
        
        try {
            const { error } = await supabase
                .from('inquiries')
                .insert([{
                    full_name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    interest: formData.interest,
                    selected_dog: formData.selectedDog,
                    rights: formData.rights,
                    message: formData.message
                }]);

            if (error) throw error;

            setSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error: any) {
            console.error("Submission error:", error);
            setSubmissionError("Network error: Could not log inquiry. Please check your connection.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="min-h-screen bg-[#020617] pt-32 pb-20 relative font-sans">
             {/* ... Background ambience and header remain exactly as you have them ... */}

            <div className="max-w-3xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h1 className="font-serif text-5xl md:text-7xl text-slate-100 mb-6 uppercase tracking-tight">Secure Your Legacy</h1>
                    <p className="font-serif text-xs tracking-[0.3em] uppercase text-luxury-teal flex items-center justify-center gap-4">
                        <span className="h-px w-12 bg-luxury-teal/30"></span> Official Inquiry <span className="h-px w-12 bg-luxury-teal/30"></span>
                    </p>
                </div>

                {success ? (
                    <div className="bg-slate-900/50 backdrop-blur-md border border-luxury-teal/30 p-12 text-center rounded-sm animate-in fade-in zoom-in-95 duration-500">
                        <CheckCircle2 className="text-luxury-teal mx-auto mb-6" size={48} />
                        <h2 className="font-serif text-3xl text-white mb-4 uppercase">Inquiry Received</h2>
                        <p className="text-slate-400 mb-8 max-w-md mx-auto">Thank you for contacting OKC Frenchies. Your request is now logged in our registry. We will contact you shortly.</p>
                        <button onClick={() => navigate('/')} className="text-[10px] font-bold uppercase tracking-widest text-white border border-slate-700 px-10 py-4 hover:bg-luxury-teal hover:text-black hover:border-luxury-teal transition-all">Return Home</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-sm">
                        {submissionError && (
                            <div className="mb-8 bg-red-900/20 border border-red-900/50 p-4 flex items-start gap-3 rounded-sm">
                                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                                <p className="text-red-300 text-xs uppercase tracking-wider font-bold">{submissionError}</p>
                            </div>
                        )}

                        <div className="space-y-10">
                            {/* Section 1 */}
                            <div>
                                <h3 className="text-xl text-slate-200 mb-6 flex items-center gap-3 font-serif italic"><span className="text-luxury-teal not-italic font-sans text-sm">01.</span> CONTACT DETAILS</h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[9px] uppercase tracking-[0.2em] text-slate-500 mb-2 block">Full Name / Program</label>
                                        <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-black/40 border border-slate-800 p-4 text-slate-200 focus:border-luxury-teal focus:outline-none transition-all" placeholder="John Doe / Elite Bullies" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-[9px] uppercase tracking-[0.2em] text-slate-500 mb-2 block">Email Address</label>
                                            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-black/40 border border-slate-800 p-4 text-slate-200 focus:border-luxury-teal focus:outline-none transition-all" placeholder="john@example.com" />
                                        </div>
                                        <div>
                                            <label className="text-[9px] uppercase tracking-[0.2em] text-slate-500 mb-2 block">Phone Number</label>
                                            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-black/40 border border-slate-800 p-4 text-slate-200 focus:border-luxury-teal focus:outline-none transition-all" placeholder="+1 (555) 000-0000" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2 */}
                            <div>
                                <h3 className="text-xl text-slate-200 mb-6 flex items-center gap-3 font-serif italic"><span className="text-luxury-teal not-italic font-sans text-sm">02.</span> ACQUISITION DETAILS</h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[9px] uppercase tracking-[0.2em] text-slate-500 mb-2 block">Area of Interest</label>
                                        <select name="interest" value={formData.interest} onChange={handleChange} className="w-full bg-black/40 border border-slate-800 p-4 text-slate-200 focus:border-luxury-teal outline-none appearance-none">
                                            <option value="Puppy Acquisition">Puppy Acquisition</option>
                                            <option value="Stud Service">Stud Service</option>
                                            <option value="Genetic Consultation">Genetic Consultation</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-[9px] uppercase tracking-[0.2em] text-slate-500 mb-2 block">Selection</label>
                                            <select name="selectedDog" value={formData.selectedDog} onChange={handleChange} className="w-full bg-black/40 border border-slate-800 p-4 text-slate-200 focus:border-luxury-teal outline-none appearance-none">
                                                <option value="">-- General Inquiry --</option>
                                                {loadingDogs ? <option disabled>Registry Loading...</option> : availableDogs.map((dog, i) => <option key={i} value={dog.name}>{dog.name} ({dog.type})</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[9px] uppercase tracking-[0.2em] text-slate-500 mb-2 block">Registration Rights</label>
                                            <select name="rights" value={formData.rights} onChange={handleChange} className="w-full bg-black/40 border border-slate-800 p-4 text-slate-200 focus:border-luxury-teal outline-none appearance-none">
                                                <option value="Pet Home">Pet Home (Limited)</option>
                                                <option value="Full Breeding Rights">Full Breeding Rights</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3 */}
                            <div>
                                <h3 className="text-xl text-slate-200 mb-6 flex items-center gap-3 font-serif italic"><span className="text-luxury-teal not-italic font-sans text-sm">03.</span> SPECIAL REQUESTS</h3>
                                <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full bg-black/40 border border-slate-800 p-4 text-slate-200 focus:border-luxury-teal focus:outline-none transition-all" placeholder="Any specific questions regarding DNA, structure, or shipping logistics..." />
                            </div>

                            <button type="submit" disabled={submitting} className="w-full py-5 bg-luxury-teal text-black font-bold uppercase tracking-[0.3em] hover:bg-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-[10px]">
                                {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                {submitting ? "Processing Inquiry..." : "Submit Official Inquiry"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
};

export default Inquiry;
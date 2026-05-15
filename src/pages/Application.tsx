import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, CheckCircle2, Loader2, AlertCircle, Home, ShieldCheck, Stethoscope, ClipboardList } from 'lucide-react';
import SEO from '../components/SEO';
import seoData from '../data/seo.json';

const Application: React.FC = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        residenceType: 'Own House',
        fencedYard: 'Yes',
        hoursAlone: '0-4 Hours',
        currentPets: '',
        frenchieExperience: 'No previous experience',
        vetName: '',
        vetPhone: '',
        intent: 'Pet Home',
        rawFeeding: 'Willing to learn',
        heatAcknowledgment: false,
        priceAcknowledgment: false,
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
        setSubmissionError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.heatAcknowledgment || !formData.priceAcknowledgment) {
            setSubmissionError("You must acknowledge the heat sensitivity and pricing requirements to proceed.");
            return;
        }

        setSubmitting(true);
        setSubmissionError(null);

        try {
            const res = await fetch('/api/submit-application', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to submit application');

            if (window.fbq) {
                window.fbq('track', 'Lead');
            }

            setSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error: any) {
            console.error("Submission error:", error);
            setSubmissionError("Network error: Could not submit application. Please check your connection or try again later.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="min-h-screen bg-[#020617] pt-32 pb-20 relative font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-luxury-teal/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <SEO 
                    title={seoData.Application.title}
                    description={seoData.Application.description}
                    url="https://okcfrenchies.com/application"
                    schema={{
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": "https://okcfrenchies.com/"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "Application",
                                "item": "https://okcfrenchies.com/application"
                            }
                        ]
                    }}
                />

                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8">
                    <h1 className="font-serif text-5xl md:text-6xl text-slate-100 mb-6 tracking-tight">Official Application</h1>
                    <p className="font-serif text-xs tracking-[0.3em] uppercase text-luxury-teal flex items-center justify-center gap-4">
                        <span className="h-px w-12 bg-slate-800"></span> The OKC Standard <span className="h-px w-12 bg-slate-800"></span>
                    </p>
                    <p className="text-slate-400 mt-6 max-w-2xl mx-auto text-sm leading-relaxed">
                        Purchasing an OKC Frenchie is an exclusive process. We filter heavily for homes that can provide the exceptional level of care, nutrition, and environment our dogs require. Please complete all fields honestly.
                    </p>
                </div>

                {success ? (
                    <div className="bg-slate-900/50 backdrop-blur-md border border-luxury-teal p-12 text-center rounded-sm animate-in fade-in zoom-in-95 duration-500">
                        <CheckCircle2 className="text-luxury-teal mx-auto mb-6" size={64} />
                        <h2 className="font-serif text-4xl text-white mb-4 uppercase">Application Under Review</h2>
                        <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
                            Thank you. Your comprehensive file has been securely transmitted. We will review your answers and contact you shortly to schedule Step 2: The Interview.
                        </p>
                        <button onClick={() => navigate('/')} className="text-xs font-bold uppercase tracking-widest text-black bg-luxury-teal px-10 py-5 hover:bg-white transition-all rounded-sm shadow-[0_0_30px_rgba(45,212,191,0.2)]">
                            Return Home
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-black/40 backdrop-blur-md border border-slate-800 p-8 md:p-12 rounded-sm shadow-2xl relative overflow-hidden">
                        
                        {submissionError && (
                            <div className="mb-10 bg-red-900/20 border border-red-900/50 p-5 flex items-start gap-3 rounded-sm animate-pulse">
                                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                                <p className="text-red-300 text-sm">{submissionError}</p>
                            </div>
                        )}

                        <div className="space-y-16 relative z-10">
                            
                            {/* Section 1: Contact Details */}
                            <div className="relative">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-luxury-teal/10 rounded-full"><ClipboardList size={24} className="text-luxury-teal" /></div>
                                    <h3 className="text-2xl text-slate-100 font-serif">1. Contact Details</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2 block font-bold">Full Legal Name</label>
                                        <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-[#0a0f1c] border border-slate-800 p-4 text-slate-200 focus:border-luxury-teal focus:outline-none focus:ring-1 focus:ring-luxury-teal transition-all rounded-sm" placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2 block font-bold">Email Address</label>
                                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#0a0f1c] border border-slate-800 p-4 text-slate-200 focus:border-luxury-teal focus:outline-none focus:ring-1 focus:ring-luxury-teal transition-all rounded-sm" placeholder="john@example.com" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2 block font-bold">Phone Number</label>
                                        <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#0a0f1c] border border-slate-800 p-4 text-slate-200 focus:border-luxury-teal focus:outline-none focus:ring-1 focus:ring-luxury-teal transition-all rounded-sm" placeholder="(555) 000-0000" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2 block font-bold">City & State</label>
                                        <input required name="address" value={formData.address} onChange={handleChange} className="w-full bg-[#0a0f1c] border border-slate-800 p-4 text-slate-200 focus:border-luxury-teal focus:outline-none focus:ring-1 focus:ring-luxury-teal transition-all rounded-sm" placeholder="Dallas, TX" />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-800" />

                            {/* Section 2: Environment */}
                            <div className="relative">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-amber-500/10 rounded-full"><Home size={24} className="text-amber-500" /></div>
                                    <h3 className="text-2xl text-slate-100 font-serif">2. Living Environment</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2 block font-bold">Residence Type</label>
                                        <select name="residenceType" value={formData.residenceType} onChange={handleChange} className="w-full bg-[#0a0f1c] border border-slate-800 p-4 text-slate-200 focus:border-amber-400 outline-none appearance-none rounded-sm">
                                            <option value="Own House">Own House</option>
                                            <option value="Rent House">Rent House</option>
                                            <option value="Apartment (Ground)">Apartment (Ground Floor)</option>
                                            <option value="Apartment (High-rise)">Apartment (High-rise)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2 block font-bold">Fenced Yard?</label>
                                        <select name="fencedYard" value={formData.fencedYard} onChange={handleChange} className="w-full bg-[#0a0f1c] border border-slate-800 p-4 text-slate-200 focus:border-amber-400 outline-none appearance-none rounded-sm">
                                            <option value="Yes">Yes, fully fenced</option>
                                            <option value="No">No fenced yard</option>
                                            <option value="Acreage/Farm">Acreage/Farm</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2 block font-bold">Hours Dog is Alone/Day</label>
                                        <select name="hoursAlone" value={formData.hoursAlone} onChange={handleChange} className="w-full bg-[#0a0f1c] border border-slate-800 p-4 text-slate-200 focus:border-amber-400 outline-none appearance-none rounded-sm">
                                            <option value="0-4 Hours">0-4 Hours</option>
                                            <option value="4-8 Hours">4-8 Hours</option>
                                            <option value="8+ Hours (Dog Walker/Daycare)">8+ Hours (I use Daycare/Walker)</option>
                                            <option value="8+ Hours (Alone)">8+ Hours (Alone)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-800" />

                            {/* Section 3: Experience */}
                            <div className="relative">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-fuchsia-500/10 rounded-full"><Stethoscope size={24} className="text-fuchsia-400" /></div>
                                    <h3 className="text-2xl text-slate-100 font-serif">3. Experience & References</h3>
                                </div>
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2 block font-bold">Current Pets in Home</label>
                                            <input required name="currentPets" value={formData.currentPets} onChange={handleChange} className="w-full bg-[#0a0f1c] border border-slate-800 p-4 text-slate-200 focus:border-fuchsia-400 focus:outline-none transition-all rounded-sm" placeholder="e.g., 1 Golden Retriever, no cats" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2 block font-bold">French Bulldog Experience</label>
                                            <select name="frenchieExperience" value={formData.frenchieExperience} onChange={handleChange} className="w-full bg-[#0a0f1c] border border-slate-800 p-4 text-slate-200 focus:border-fuchsia-400 outline-none appearance-none rounded-sm">
                                                <option value="Currently own one">Currently own one</option>
                                                <option value="Owned in the past">Owned in the past</option>
                                                <option value="First-time Frenchie owner">First-time Frenchie owner</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2 block font-bold">Current Veterinarian Name (If Applicable)</label>
                                            <input name="vetName" value={formData.vetName} onChange={handleChange} className="w-full bg-[#0a0f1c] border border-slate-800 p-4 text-slate-200 focus:border-fuchsia-400 focus:outline-none transition-all rounded-sm" placeholder="Dr. Smith / Elm Street Vet" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2 block font-bold">Veterinarian Phone Number</label>
                                            <input type="tel" name="vetPhone" value={formData.vetPhone} onChange={handleChange} className="w-full bg-[#0a0f1c] border border-slate-800 p-4 text-slate-200 focus:border-fuchsia-400 focus:outline-none transition-all rounded-sm" placeholder="(555) 000-0000" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-800" />

                            {/* Section 4: Intent & Agreements */}
                            <div className="relative bg-slate-900/40 p-8 border border-slate-800 rounded-sm">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-rose-500/10 rounded-full"><ShieldCheck size={24} className="text-rose-500" /></div>
                                    <h3 className="text-2xl text-slate-100 font-serif">4. Acknowledgments</h3>
                                </div>
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                         <div>
                                            <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2 block font-bold">Adoption Intent</label>
                                            <select name="intent" value={formData.intent} onChange={handleChange} className="w-full bg-[#0a0f1c] border border-slate-800 p-4 text-slate-200 focus:border-rose-500 outline-none appearance-none rounded-sm">
                                                <option value="Pet Home (Strictly Companion)">Pet Home (Strictly Companion)</option>
                                                <option value="Show/Breeding Home">Show / Breeding Rights Needed</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2 block font-bold">Raw / Fresh Diet Policy</label>
                                            <select name="rawFeeding" value={formData.rawFeeding} onChange={handleChange} className="w-full bg-[#0a0f1c] border border-slate-800 p-4 text-slate-200 focus:border-rose-500 outline-none appearance-none rounded-sm">
                                                <option value="Willing to learn">I am open to learning about it</option>
                                                <option value="Currently raw feed">I already raw feed my dogs</option>
                                                <option value="Will only feed kibble">I will strictly feed commercial kibble</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4 pt-4">
                                        <label className="flex items-start gap-4 p-4 border border-slate-800 rounded-sm bg-black/20 hover:border-luxury-teal/50 transition-colors cursor-pointer group">
                                            <input type="checkbox" name="heatAcknowledgment" checked={formData.heatAcknowledgment} onChange={handleChange} className="mt-1 w-5 h-5 accent-luxury-teal" required />
                                            <span className="text-sm text-slate-300 leading-relaxed group-hover:text-white transition-colors">
                                                I acknowledge that French Bulldogs are extremely sensitive to heat. They are indoor dogs and I commit to providing an air-conditioned environment and never leaving them outside unattended in warm weather.
                                            </span>
                                        </label>

                                        <label className="flex items-start gap-4 p-4 border border-slate-800 rounded-sm bg-black/20 hover:border-amber-500/50 transition-colors cursor-pointer group">
                                            <input type="checkbox" name="priceAcknowledgment" checked={formData.priceAcknowledgment} onChange={handleChange} className="mt-1 w-5 h-5 accent-amber-500" required />
                                            <span className="text-sm text-slate-300 leading-relaxed group-hover:text-white transition-colors">
                                                I acknowledge that OKC Frenchies are a premium investment due to rigorous 6-panel genetic health testing and specialized reproductive veterinary care. (Pricing typically ranges from $4,500 - $8,500+ depending on color/DNA).
                                            </span>
                                        </label>
                                    </div>

                                    <div>
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2 block font-bold">Why do you want an OKC Frenchie? (Optional)</label>
                                        <textarea name="message" value={formData.message} onChange={handleChange} rows={3} className="w-full bg-[#0a0f1c] border border-slate-800 p-4 text-slate-200 focus:border-rose-500 focus:outline-none transition-all rounded-sm" placeholder="Tell us a bit about why you chose us..." />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={submitting} className="w-full py-6 bg-gradient-to-r from-luxury-teal to-emerald-600 text-white font-bold uppercase tracking-[0.3em] hover:shadow-[0_0_40px_rgba(45,212,191,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-[11px] rounded-sm transform hover:-translate-y-1">
                                {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                {submitting ? "Transmitting Application..." : "Submit Official Application"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
};

export default Application;

import React from 'react';
import { ShieldCheck, Stethoscope, Beef, CheckCircle2, AlertTriangle, ArrowRight, HeartHandshake, ClipboardList, Video, ScrollText, Home } from 'lucide-react';
import SEO from '../components/SEO';

const BuyerEducation: React.FC = () => {
    return (
        <section className="pt-32 pb-24 bg-luxury-black relative overflow-hidden min-h-screen">
            {/* Ambient Glow */}
            <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-luxury-teal/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <SEO
                    title="Buyer Education & Quality Standards | OKC Frenchies"
                    description="Learn about the OKC Standard. Discover the reality of owning a French Bulldog, our health testing protocols, raw feeding, and our protection policy."
                    url="https://okcfrenchies.com/buyer-education"
                />

                {/* Header */}
                <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="font-serif text-5xl md:text-6xl text-slate-100 mb-6 tracking-tight">
                        Buyer Education & <span className="text-luxury-teal italic">Quality</span> Standards
                    </h1>
                    <div className="flex justify-center items-center gap-4 mb-8">
                        <div className="h-px w-16 bg-slate-800" />
                        <p className="font-sans text-luxury-teal text-xs tracking-[0.3em] uppercase">The OKC Standard</p>
                        <div className="h-px w-16 bg-slate-800" />
                    </div>
                    <p className="font-serif text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                        We care more about our dogs' futures than a quick sale. Buying from OKC Frenchies is an exclusive privilege reserved for educated, prepared owners.
                    </p>
                </div>

                {/* The Reality Check */}
                <div className="mb-20 scroll-mt-32" id="reality-check">
                    <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-4">
                        <AlertTriangle className="text-amber-500" size={32} />
                        <h2 className="font-serif text-3xl md:text-4xl text-slate-100">The Reality Check: Is a Frenchie Right for You?</h2>
                    </div>
                    <div className="bg-slate-900/40 border border-slate-800 p-8 md:p-10 rounded-sm backdrop-blur-sm">
                        <p className="font-serif text-slate-300 text-lg leading-relaxed mb-6">
                            French Bulldogs are not just pets; they are <strong className="text-white">"lifestyle dogs."</strong> They require a commitment that goes far beyond standard dog ownership. Before you consider joining the OKC Frenchies family, you must understand their unique needs.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                            <div>
                                <h3 className="font-sans text-amber-500 text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Heat Sensitivity
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Due to their brachycephalic (flat-faced) anatomy, Frenchies cannot regulate their body temperature efficiently. They are strictly indoor dogs and can quickly succumb to heatstroke in warm weather. Air conditioning is mandatory, not optional.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-sans text-amber-500 text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Stubborn Brilliance
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    They are incredibly intelligent but notoriously stubborn. Training requires patience, consistency, and positive reinforcement. They will test your boundaries, but setting clear rules early builds a well-adjusted, confident dog.
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <h3 className="font-sans text-amber-500 text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Constant Companionship
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    These dogs thrive on human connection and can suffer from severe separation anxiety if left alone for long periods. If you work 12-hour shifts away from home without a pet sitter or doggy daycare, a French Bulldog is not the breed for you.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* The Cost of Excellence */}
                <div className="mb-20 scroll-mt-32" id="cost-of-excellence">
                    <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-4">
                        <Stethoscope className="text-luxury-teal" size={32} />
                        <h2 className="font-serif text-3xl md:text-4xl text-slate-100">The Cost of Excellence</h2>
                    </div>
                    <div className="flex flex-col md:flex-row gap-10 items-center">
                        <div className="md:w-1/2">
                            <p className="font-serif text-slate-300 text-lg leading-relaxed mb-6">
                                A well-bred French Bulldog commands a premium investment for very specific reasons. Bargain hunting in this breed will inevitably lead to devastating veterinary bills and heartbreak. We spare no expense in our foundational dogs.
                            </p>
                            <ul className="space-y-4 font-sans text-sm text-slate-400">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
                                    <span><strong>6-Panel Health Testing:</strong> Every breeding dog undergoes comprehensive 6-panel genetic health testing via Animal Genetics, ensuring they are clear of devastating breed-specific hereditary diseases before they ever reproduce.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
                                    <span><strong>Specialized Reproductive Care:</strong> Frenchies cannot reproduce naturally. Every litter requires artificial insemination (AI), intensive progesterone tracking, specialized ultrasounds, and a scheduled cesarean section (C-Section) by a reproductive veterinary specialist to ensure the safety of the mother and puppies.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
                                    <span><strong>24/7 Neonatal Care:</strong> For the first 3-4 weeks of life, puppies require around-the-clock monitoring, bottle feeding, and incubator management. It is an exhausting, intensive labor of love.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="md:w-1/2 bg-gradient-to-br from-slate-900 to-black border border-slate-800 p-8 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-luxury-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            <h3 className="font-serif text-2xl text-white mb-4">Investment Protection</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                When you invest in an OKC Frenchie, you are paying for the peace of mind that comes from generations of health testing, elite structure, and meticulous, scientifically-backed rearing protocols.
                            </p>
                            <div className="h-px border-t border-dashed border-slate-700 w-full mb-6"></div>
                            <p className="text-xs uppercase tracking-widest text-luxury-teal font-bold">Health is Wealth. Quality is paramount.</p>
                        </div>
                    </div>
                </div>

                {/* The Raw Advantage */}
                <div className="mb-20 scroll-mt-32" id="raw-advantage">
                    <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-4">
                        <Beef className="text-rose-500" size={32} />
                        <h2 className="font-serif text-3xl md:text-4xl text-slate-100">The Raw Advantage</h2>
                    </div>
                    <div className="bg-slate-900/40 border border-slate-800 p-8 md:p-10 rounded-sm relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none translate-x-1/4 translate-y-1/4">
                            <Beef size={200} />
                        </div>
                        <div className="relative z-10">
                            <p className="font-serif text-slate-300 text-lg leading-relaxed mb-6">
                                We are fundamentally opposed to feeding highly processed, filler-stuffed kibble. Our commitment to biologically appropriate raw feeding is our <strong>secret weapon</strong> against the ailments that plague this breed.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                                <div className="bg-black/40 p-6 border border-slate-800/50">
                                    <h4 className="font-bold text-rose-400 mb-2 uppercase text-xs tracking-widest">Eradicating Yeast</h4>
                                    <p className="text-slate-400 text-sm">Carbohydrates and sugars in kibble fuel yeast overgrowth, leading to the notoriously smelly "Frito paws," chronic ear infections, and raw, red skin. Raw diets eliminate the fuel source.</p>
                                </div>
                                <div className="bg-black/40 p-6 border border-slate-800/50">
                                    <h4 className="font-bold text-rose-400 mb-2 uppercase text-xs tracking-widest">Optimized Gut Health</h4>
                                    <p className="text-slate-400 text-sm">A balanced raw diet dramatically improves digestion, resulting in smaller, firmer, less odorous stools and maximizing nutrient absorption for unparalleled coat density and shine.</p>
                                </div>
                            </div>
                            <p className="text-slate-400 text-sm italic border-l-2 border-rose-500 pl-4 py-1">
                                We require our buyers to be open to—and ideally commit to—a raw or gently cooked diet. It is the single most impactful decision you can make for your Frenchie's longevity.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Our Protection Policy (OKC Standard) */}
                <div className="mb-24 scroll-mt-32" id="protection-policy">
                    <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-4">
                        <ShieldCheck className="text-fuchsia-400" size={32} />
                        <h2 className="font-serif text-3xl md:text-4xl text-slate-100">Our Protection Policy: The OKC Standard</h2>
                    </div>
                    <p className="font-serif text-slate-300 text-lg leading-relaxed mb-10">
                        You are not buying from a kennel facility or a puppy mill. We hold ourselves to an elite tier of ethical breeding, transparency, and lifelong accountability.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="bg-slate-900 border border-slate-800 p-8 hover:border-fuchsia-500/50 transition-colors">
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400">
                                    <Home size={28} />
                                </div>
                            </div>
                            <h3 className="text-white font-serif text-xl mb-3">Raised In-Home</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Our puppies are whelped and raised in the center of our home. They are exposed to household noises, children, and regular handling, ensuring confident, socially calibrated puppies.
                            </p>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-8 hover:border-fuchsia-500/50 transition-colors">
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400">
                                    <Video size={28} />
                                </div>
                            </div>
                            <h3 className="text-white font-serif text-xl mb-3">FaceTime Proof-of-Life</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                The pet space is unfortunately rife with scammers. We offer real-time, live video calls to verify the existence, health, and environment of your puppy before any deposit is placed. Total transparency.
                            </p>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-8 hover:border-fuchsia-500/50 transition-colors">
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400">
                                    <HeartHandshake size={28} />
                                </div>
                            </div>
                            <h3 className="text-white font-serif text-xl mb-3">Lifetime Support</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Our relationship does not end when you drive away. We offer lifetime breeder support for nutrition, training, and health advice. If you can no longer care for the dog, they must legally be returned to us.
                            </p>
                        </div>
                    </div>
                </div>

                {/* The Application Roadmap */}
                <div className="mb-12 scroll-mt-32" id="roadmap">
                    <h2 className="font-serif text-4xl text-center text-slate-100 mb-4">The Application Roadmap</h2>
                    <p className="text-center text-slate-400 uppercase tracking-widest text-xs mb-12">Your Path to the OKC Standard</p>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[45px] left-12 right-12 h-px bg-slate-800 z-0"></div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                            {/* Step 1 */}
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-24 h-24 rounded-full bg-[#020617] border-2 border-luxury-teal flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(45,212,191,0.1)] group-hover:scale-110 transition-transform duration-500">
                                    <ClipboardList className="text-luxury-teal" size={32} />
                                </div>
                                <span className="text-luxury-teal font-bold uppercase tracking-widest text-xs mb-2">Step 1</span>
                                <h3 className="font-serif text-xl text-white mb-3">The Application</h3>
                                <p className="text-slate-400 text-sm">Submit your detailed application so we can understand your lifestyle, experience, and what you are looking for in a Frenchie.</p>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-center text-center group mt-8 md:mt-0">
                                <div className="w-24 h-24 rounded-full bg-[#020617] border-2 border-slate-700 flex items-center justify-center mb-6 group-hover:border-luxury-teal group-hover:scale-110 transition-all duration-500">
                                    <Video className="text-slate-400 group-hover:text-luxury-teal transition-colors" size={32} />
                                </div>
                                <span className="text-slate-500 group-hover:text-luxury-teal font-bold uppercase tracking-widest text-xs mb-2 transition-colors">Step 2</span>
                                <h3 className="font-serif text-xl text-white mb-3">The Interview</h3>
                                <p className="text-slate-400 text-sm">A FaceTime or phone call to discuss your application, answer your questions, and view the puppy or parents live.</p>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center text-center group mt-8 md:mt-0">
                                <div className="w-24 h-24 rounded-full bg-[#020617] border-2 border-slate-700 flex items-center justify-center mb-6 group-hover:border-luxury-teal group-hover:scale-110 transition-all duration-500">
                                    <ScrollText className="text-slate-400 group-hover:text-luxury-teal transition-colors" size={32} />
                                </div>
                                <span className="text-slate-500 group-hover:text-luxury-teal font-bold uppercase tracking-widest text-xs mb-2 transition-colors">Step 3</span>
                                <h3 className="font-serif text-xl text-white mb-3">Deposit & Contract</h3>
                                <p className="text-slate-400 text-sm">Once approved, a non-refundable deposit secures your pup. You will review and sign our legally binding health guarantee and contract.</p>
                            </div>

                            {/* Step 4 */}
                            <div className="flex flex-col items-center text-center group mt-8 md:mt-0">
                                <div className="w-24 h-24 rounded-full bg-[#020617] border-2 border-amber-500 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(245,158,11,0.1)] group-hover:scale-110 transition-transform duration-500">
                                    <HeartHandshake className="text-amber-500" size={32} />
                                </div>
                                <span className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-2">Step 4</span>
                                <h3 className="font-serif text-xl text-white mb-3">Go-Home Day</h3>
                                <p className="text-slate-400 text-sm">Take your new family member home. Enjoy peace of mind with our lifetime breeder support and guidance.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 flex justify-center">
                        <a
                            href="/application"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-luxury-teal to-emerald-600 text-white font-bold uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(45,212,191,0.3)] hover:shadow-[0_0_50px_rgba(45,212,191,0.5)] transition-all transform hover:-translate-y-1 rounded-sm"
                        >
                            Begin Your Application <ArrowRight size={20} />
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default BuyerEducation;

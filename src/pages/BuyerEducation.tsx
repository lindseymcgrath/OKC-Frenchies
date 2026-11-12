import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Stethoscope,
  Beef,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  HeartHandshake,
  ClipboardList,
  Video,
  ScrollText,
  Home
} from 'lucide-react';
import SEO from '../components/SEO';
import seoData from '../data/seo.json';

const BuyerEducation: React.FC = () => {
  return (
    <section className="py-14 bg-[#F6F4EE] text-[#1C2621] relative overflow-hidden min-h-screen">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <SEO
          title={seoData.BuyerEducation.title}
          description={seoData.BuyerEducation.description}
          url="https://okcfrenchies.com/buyer-education"
          schema={{
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
                name: 'Buyer Education',
                item: 'https://okcfrenchies.com/buyer-education'
              }
            ]
          }}
        />

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-[#E3EFE8] text-[#2E5A44] font-sans font-bold text-xs px-4 py-1.5 rounded-full mb-4">
            🌿 The OKC Standard • Prepared Homes First
          </span>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-[#1C2621] mb-4 tracking-tight">
            Buyer Education &amp; <em className="italic font-semibold text-[#D46A4E]">Quality</em> Standards
          </h1>
          <p className="font-sans text-[#5C6B63] text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            We care more about our dogs' futures than a quick sale. Buying from OKC Frenchies is a partnership built for educated, prepared families.
          </p>
        </div>

        {/* The Reality Check */}
        <div className="mb-16 scroll-mt-24" id="reality-check">
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#DCD6C8]">
            <div className="p-2.5 bg-[#F4D37E]/50 rounded-2xl text-[#1C2621]">
              <AlertTriangle size={24} />
            </div>
            <h2 className="font-display font-bold text-3xl text-[#1C2621]">
              The Reality Check: Is a Frenchie Right for You?
            </h2>
          </div>

          <div className="bg-white border border-[#EAE5D9] p-7 md:p-10 rounded-3xl shadow-xs">
            <p className="font-sans text-[#1C2621] text-base md:text-lg leading-relaxed mb-6">
              French Bulldogs are not just pets; they are <strong>"lifestyle dogs."</strong> They require a commitment that goes far beyond standard dog ownership. Before joining the OKC Frenchies family, you must understand their unique needs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-[#F6F4EE] p-6 rounded-2xl border border-[#EAE5D9]">
                <h3 className="font-sans text-[#D46A4E] text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D46A4E]" /> Heat Sensitivity
                </h3>
                <p className="text-[#5C6B63] text-sm leading-relaxed">
                  Due to their brachycephalic (flat-faced) anatomy, Frenchies cannot regulate their body temperature efficiently. They are strictly indoor dogs and can quickly succumb to heatstroke in warm weather. Air conditioning is mandatory, not optional.
                </p>
              </div>
              <div className="bg-[#F6F4EE] p-6 rounded-2xl border border-[#EAE5D9]">
                <h3 className="font-sans text-[#D46A4E] text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D46A4E]" /> Stubborn Brilliance
                </h3>
                <p className="text-[#5C6B63] text-sm leading-relaxed">
                  They are incredibly intelligent but notoriously stubborn. Training requires patience, consistency, and positive reinforcement. Setting clear rules early builds a well-adjusted, confident dog.
                </p>
              </div>
              <div className="md:col-span-2 bg-[#F6F4EE] p-6 rounded-2xl border border-[#EAE5D9]">
                <h3 className="font-sans text-[#2E5A44] text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2E5A44]" /> Constant Companionship
                </h3>
                <p className="text-[#5C6B63] text-sm leading-relaxed">
                  These dogs thrive on human connection and can suffer from separation anxiety if left alone for long periods. If you work 12-hour shifts away from home without a pet sitter or doggy daycare, a French Bulldog is not the right fit.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* The Cost of Excellence */}
        <div className="mb-16 scroll-mt-24" id="cost-of-excellence">
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#DCD6C8]">
            <div className="p-2.5 bg-[#E3EFE8] rounded-2xl text-[#2E5A44]">
              <Stethoscope size={24} />
            </div>
            <h2 className="font-display font-bold text-3xl text-[#1C2621]">The Cost of Excellence</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 bg-white border border-[#EAE5D9] p-7 md:p-8 rounded-3xl shadow-xs">
              <p className="font-sans text-[#1C2621] text-base leading-relaxed mb-6">
                A well-bred French Bulldog commands a premium investment for very specific reasons. Bargain hunting in this breed often leads to devastating veterinary bills and heartbreak. We spare no expense in our foundational dogs.
              </p>
              <ul className="space-y-4 font-sans text-sm text-[#5C6B63]">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#2E5A44] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#1C2621]">6-Panel Health Testing:</strong> Every breeding dog undergoes comprehensive 6-panel genetic health testing via Animal Genetics, ensuring they are clear of hereditary diseases before reproducing.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#2E5A44] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#1C2621]">Specialized Reproductive Care:</strong> Every litter involves artificial insemination (AI), intensive progesterone tracking, ultrasounds, and a scheduled C-Section by a reproductive specialist.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#2E5A44] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#1C2621]">24/7 Neonatal Care:</strong> For the first 3–4 weeks of life, puppies require around-the-clock monitoring, bottle feeding, and incubator care.
                  </span>
                </li>
              </ul>
            </div>

            <div className="md:col-span-5 bg-[#2E5A44] text-white p-8 rounded-3xl shadow-md">
              <span className="inline-block bg-[#F4D37E] text-[#1C2621] text-xs font-bold px-3 py-1 rounded-full mb-4">
                Peace of Mind
              </span>
              <h3 className="font-display font-bold text-2xl mb-3">Investment Protection</h3>
              <p className="text-white/85 text-sm leading-relaxed mb-6">
                When you invest in an OKC Frenchie, you are paying for generations of health testing, sound structure, and meticulous, scientifically backed rearing protocols.
              </p>
              <div className="h-px border-t border-dashed border-white/30 w-full mb-4" />
              <p className="text-xs uppercase tracking-wider text-[#F4D37E] font-bold">
                Health is wealth. Quality is paramount.
              </p>
            </div>
          </div>
        </div>

        {/* The Raw Advantage */}
        <div className="mb-16 scroll-mt-24" id="raw-advantage">
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#DCD6C8]">
            <div className="p-2.5 bg-[#FADADD] rounded-2xl text-[#D46A4E]">
              <Beef size={24} />
            </div>
            <h2 className="font-display font-bold text-3xl text-[#1C2621]">The Raw Advantage</h2>
          </div>

          <div className="bg-white border border-[#EAE5D9] p-7 md:p-10 rounded-3xl shadow-xs">
            <p className="font-sans text-[#1C2621] text-base md:text-lg leading-relaxed mb-6">
              We are fundamentally opposed to feeding highly processed, filler-stuffed kibble. Our commitment to biologically appropriate raw feeding is our <strong>secret weapon</strong> against the ailments that plague this breed.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="bg-[#F6F4EE] p-6 rounded-2xl border border-[#EAE5D9]">
                <h4 className="font-bold text-[#D46A4E] mb-2 uppercase text-xs tracking-wider">
                  Eradicating Yeast
                </h4>
                <p className="text-[#5C6B63] text-sm leading-relaxed">
                  Carbohydrates and sugars in kibble fuel yeast overgrowth, leading to smelly "Frito paws," chronic ear infections, and red skin. Raw diets eliminate the fuel source.
                </p>
              </div>
              <div className="bg-[#F6F4EE] p-6 rounded-2xl border border-[#EAE5D9]">
                <h4 className="font-bold text-[#2E5A44] mb-2 uppercase text-xs tracking-wider">
                  Optimized Gut Health
                </h4>
                <p className="text-[#5C6B63] text-sm leading-relaxed">
                  A balanced raw diet dramatically improves digestion, resulting in smaller, firmer stools and maximizing nutrient absorption for coat density and shine.
                </p>
              </div>
            </div>
            <p className="text-[#5C6B63] text-sm italic border-l-4 border-[#D46A4E] pl-4 py-1 bg-[#F6F4EE] rounded-r-xl">
              We require our buyers to be open to—and ideally commit to—a raw or gently cooked diet. It is the single most impactful decision you can make for your Frenchie's longevity.
            </p>
          </div>
        </div>

        {/* Our Protection Policy */}
        <div className="mb-16 scroll-mt-24" id="protection-policy">
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#DCD6C8]">
            <div className="p-2.5 bg-[#E3EFE8] rounded-2xl text-[#2E5A44]">
              <ShieldCheck size={24} />
            </div>
            <h2 className="font-display font-bold text-3xl text-[#1C2621]">
              Our Protection Policy: The OKC Standard
            </h2>
          </div>

          <p className="font-sans text-[#5C6B63] text-base md:text-lg leading-relaxed mb-8">
            You are not buying from a kennel facility or a puppy mill. We hold ourselves to an elite tier of ethical breeding, transparency, and lifelong accountability.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white border border-[#EAE5D9] rounded-3xl p-7 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-[#E3EFE8] text-[#2E5A44] flex items-center justify-center mx-auto mb-4">
                <Home size={26} />
              </div>
              <h3 className="text-[#1C2621] font-display font-bold text-xl mb-2">Raised In-Home</h3>
              <p className="text-[#5C6B63] text-sm leading-relaxed">
                Our puppies are whelped and raised in the center of our home—exposed to household noises, children, and regular handling for confident temperaments.
              </p>
            </div>

            <div className="bg-white border border-[#EAE5D9] rounded-3xl p-7 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-[#F4D37E]/50 text-[#1C2621] flex items-center justify-center mx-auto mb-4">
                <Video size={26} />
              </div>
              <h3 className="text-[#1C2621] font-display font-bold text-xl mb-2">FaceTime Proof-of-Life</h3>
              <p className="text-[#5C6B63] text-sm leading-relaxed">
                We offer real-time live video calls to verify the health, personality, and environment of your puppy before any deposit is placed. Total transparency.
              </p>
            </div>

            <div className="bg-white border border-[#EAE5D9] rounded-3xl p-7 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-[#FADADD] text-[#D46A4E] flex items-center justify-center mx-auto mb-4">
                <HeartHandshake size={26} />
              </div>
              <h3 className="text-[#1C2621] font-display font-bold text-xl mb-2">Lifetime Support</h3>
              <p className="text-[#5C6B63] text-sm leading-relaxed">
                Our relationship doesn't end on go-home day. We provide lifetime nutrition and care advice, and our contract guarantees a safe return if life ever changes.
              </p>
            </div>
          </div>
        </div>

        {/* The Application Roadmap */}
        <div className="mb-10 scroll-mt-24" id="roadmap">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-[#1C2621] mb-2">
              The Application Roadmap
            </h2>
            <p className="text-[#2E5A44] uppercase tracking-wider font-bold text-xs">
              Your Path to the OKC Standard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-[#EAE5D9] rounded-3xl p-6 text-center shadow-xs">
              <div className="w-16 h-16 rounded-full bg-[#E3EFE8] text-[#2E5A44] flex items-center justify-center mx-auto mb-4">
                <ClipboardList size={28} />
              </div>
              <span className="text-[#2E5A44] font-bold uppercase tracking-wider text-xs">Step 1</span>
              <h3 className="font-display font-bold text-xl text-[#1C2621] mt-1 mb-2">The Application</h3>
              <p className="text-[#5C6B63] text-sm">
                Submit your application so we can learn about your lifestyle, home, and what you're looking for.
              </p>
            </div>

            <div className="bg-white border border-[#EAE5D9] rounded-3xl p-6 text-center shadow-xs">
              <div className="w-16 h-16 rounded-full bg-[#F4D37E]/50 text-[#1C2621] flex items-center justify-center mx-auto mb-4">
                <Video size={28} />
              </div>
              <span className="text-[#D46A4E] font-bold uppercase tracking-wider text-xs">Step 2</span>
              <h3 className="font-display font-bold text-xl text-[#1C2621] mt-1 mb-2">The Interview</h3>
              <p className="text-[#5C6B63] text-sm">
                A FaceTime or phone call to answer your questions and meet your puppy and parents live.
              </p>
            </div>

            <div className="bg-white border border-[#EAE5D9] rounded-3xl p-6 text-center shadow-xs">
              <div className="w-16 h-16 rounded-full bg-[#E3EFE8] text-[#2E5A44] flex items-center justify-center mx-auto mb-4">
                <ScrollText size={28} />
              </div>
              <span className="text-[#2E5A44] font-bold uppercase tracking-wider text-xs">Step 3</span>
              <h3 className="font-display font-bold text-xl text-[#1C2621] mt-1 mb-2">Deposit &amp; Contract</h3>
              <p className="text-[#5C6B63] text-sm">
                Once approved, a deposit reserves your pup and you sign our health guarantee and contract.
              </p>
            </div>

            <div className="bg-white border border-[#EAE5D9] rounded-3xl p-6 text-center shadow-xs">
              <div className="w-16 h-16 rounded-full bg-[#FADADD] text-[#D46A4E] flex items-center justify-center mx-auto mb-4">
                <HeartHandshake size={28} />
              </div>
              <span className="text-[#D46A4E] font-bold uppercase tracking-wider text-xs">Step 4</span>
              <h3 className="font-display font-bold text-xl text-[#1C2621] mt-1 mb-2">Go-Home Day</h3>
              <p className="text-[#5C6B63] text-sm">
                Welcome your new family member home with lifetime breeder support and feeding guidance.
              </p>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              to="/application"
              className="inline-flex items-center gap-3 px-9 py-4 bg-[#2E5A44] hover:bg-[#234735] text-white font-sans text-sm font-bold uppercase tracking-wider rounded-full shadow-md transition-all"
            >
              Begin Your Application <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuyerEducation;

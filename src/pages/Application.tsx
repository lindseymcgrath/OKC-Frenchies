import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare, Instagram, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import seoData from '../data/seo.json';

const Application: React.FC = () => {
  const emailSubject = 'Puppy Application Inquiry — OKC Frenchies';
  const emailBody = `Hi Lindsey & Eric,\n\nI would like to apply for an OKC Frenchies puppy! Here are my details:\n\n- Name & City/State:\n- Puppy I'm interested in (or breed/color preference):\n- Home setup (house/yard/other pets):\n- Pet home or Breeding rights:\n- Best time for a FaceTime call:\n\n`;
  const smsBody = `Hi Lindsey & Eric! I'd like to apply for an OKC Frenchies puppy.`;

  return (
    <section className="min-h-screen bg-[#F6F4EE] text-[#1C2621] py-14 relative font-sans">
      <SEO
        title={seoData.Application.title}
        description={seoData.Application.description}
        image="https://okcfrenchies.com/og/application.jpg"
        url="https://okcfrenchies.com/application"
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
              name: 'Application',
              item: 'https://okcfrenchies.com/application'
            }
          ]
        }}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block bg-[#E3EFE8] text-[#2E5A44] font-sans font-bold text-xs px-4 py-1.5 rounded-full mb-4">
            🏡 The OKC Standard • Direct Puppy Application
          </span>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-[#1C2621] mb-4">
            Apply for a <em className="italic font-semibold text-[#D46A4E]">Puppy</em>
          </h1>
          <p className="font-sans text-[#5C6B63] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Instead of filling out a clunky web form, reach out directly to Lindsey or Eric by text, email, or Instagram DM so we can chat about your home and introduce you to our available babies.
          </p>
        </div>

        {/* Direct Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <a
            href={`sms:+14053008482?&body=${encodeURIComponent(smsBody)}`}
            className="group bg-white border border-[#EAE5D9] hover:border-[#2E5A44] rounded-3xl p-7 shadow-[0_12px_30px_rgba(28,38,33,0.06)] hover:-translate-y-1 transition-all flex flex-col text-center"
          >
            <div className="w-14 h-14 rounded-full bg-[#E3EFE8] text-[#2E5A44] flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={26} />
            </div>
            <span className="inline-block bg-[#F4D37E] text-[#1C2621] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mx-auto mb-3">
              Text Only
            </span>
            <h2 className="font-display font-bold text-2xl text-[#1C2621] mb-1">405.300.8482</h2>
            <p className="text-xs font-bold uppercase tracking-wider text-[#2E5A44] mb-3">
              Please Text — Lindsey or Eric
            </p>
            <p className="text-sm text-[#5C6B63] leading-relaxed mb-6">
              For text-only purposes. Send us a quick text with your name and which puppy you're interested in!
            </p>
            <span className="mt-auto inline-flex items-center justify-center gap-2 bg-[#2E5A44] group-hover:bg-[#234735] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-full transition-colors">
              Text Lindsey or Eric <ArrowRight size={15} />
            </span>
          </a>

          <a
            href={`mailto:info@okcfrenchies.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
            className="group bg-white border border-[#EAE5D9] hover:border-[#D46A4E] rounded-3xl p-7 shadow-[0_12px_30px_rgba(28,38,33,0.06)] hover:-translate-y-1 transition-all flex flex-col text-center"
          >
            <div className="w-14 h-14 rounded-full bg-[#FADADD] text-[#D46A4E] flex items-center justify-center mx-auto mb-4">
              <Mail size={26} />
            </div>
            <span className="inline-block bg-[#E3EFE8] text-[#2E5A44] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mx-auto mb-3">
              Email Directly
            </span>
            <h2 className="font-display font-bold text-xl text-[#1C2621] mb-1 break-all">
              info@okcfrenchies.com
            </h2>
            <p className="text-xs font-bold uppercase tracking-wider text-[#D46A4E] mb-3">
              Pre-Filled Application Email
            </p>
            <p className="text-sm text-[#5C6B63] leading-relaxed mb-6">
              Click below to open an email with quick application prompts already filled in for you.
            </p>
            <span className="mt-auto inline-flex items-center justify-center gap-2 bg-[#D46A4E] group-hover:bg-[#bc583e] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-full transition-colors">
              Email Application <ArrowRight size={15} />
            </span>
          </a>

          <a
            href="https://www.instagram.com/okcfrenchies/"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white border border-[#EAE5D9] hover:border-[#2E5A44] rounded-3xl p-7 shadow-[0_12px_30px_rgba(28,38,33,0.06)] hover:-translate-y-1 transition-all flex flex-col text-center"
          >
            <div className="w-14 h-14 rounded-full bg-[#F4D37E]/50 text-[#1C2621] flex items-center justify-center mx-auto mb-4">
              <Instagram size={26} />
            </div>
            <span className="inline-block bg-[#E3EFE8] text-[#2E5A44] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mx-auto mb-3">
              Instagram DM
            </span>
            <h2 className="font-display font-bold text-2xl text-[#1C2621] mb-1">@okcfrenchies</h2>
            <p className="text-xs font-bold uppercase tracking-wider text-[#2E5A44] mb-3">
              Message Us on IG
            </p>
            <p className="text-sm text-[#5C6B63] leading-relaxed mb-6">
              Follow along with our daily nursery stories and message us directly on Instagram.
            </p>
            <span className="mt-auto inline-flex items-center justify-center gap-2 bg-[#1C2621] group-hover:bg-[#2E5A44] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-full transition-colors">
              Message on Instagram <ArrowRight size={15} />
            </span>
          </a>
        </div>

        {/* Quick Checklist */}
        <div className="bg-white border border-[#EAE5D9] rounded-3xl p-7 md:p-9 shadow-xs">
          <div className="flex items-center gap-2.5 text-[#2E5A44] font-bold text-xs uppercase tracking-wider mb-3">
            <ShieldCheck size={16} /> What We Look For in Forever Homes
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#5C6B63]">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={17} className="text-[#2E5A44] shrink-0 mt-0.5" />
              <span>Strictly indoor, climate-controlled home (Frenchies &amp; Mini English Bulldogs are heat-sensitive).</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={17} className="text-[#2E5A44] shrink-0 mt-0.5" />
              <span>Openness to feeding a biologically appropriate raw or gently cooked diet for gut &amp; coat health.</span>
            </div>
          </div>
          <div className="mt-6 pt-5 border-t border-[#F0ECE1] flex flex-wrap gap-3">
            <Link
              to="/french-bulldog-puppies-for-sale"
              className="px-5 py-2.5 bg-[#E3EFE8] hover:bg-[#2E5A44] text-[#2E5A44] hover:text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
            >
              See Available Puppies
            </Link>
            <Link
              to="/buyer-education"
              className="px-5 py-2.5 border border-[#DCD6C8] hover:border-[#2E5A44] text-[#1C2621] rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Buyer Education &amp; Roadmap
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Application;

import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Mail, MessageSquare, Instagram, ArrowRight, ShieldCheck, Video } from 'lucide-react';
import SEO from '../components/SEO';
import seoData from '../data/seo.json';

const Inquiry: React.FC = () => {
  const [searchParams] = useSearchParams();
  const dogName = searchParams.get('dog') || '';
  const interest = searchParams.get('interest') || 'Puppy Acquisition';

  const subjectText = dogName
    ? `${interest}: ${dogName} — OKC Frenchies`
    : `${interest} — OKC Frenchies`;

  const bodyText = dogName
    ? `Hi Lindsey & Eric,\n\nI'm interested in ${dogName} (${interest})! Here is a little bit about our home and what we're looking for:\n\n`
    : `Hi Lindsey & Eric,\n\nI'd love to learn more about your available puppies / studs! Here is a little bit about our home:\n\n`;

  const smsBody = dogName
    ? `Hi Lindsey & Eric! I'm reaching out about ${dogName} (${interest}) from OKCFrenchies.com.`
    : `Hi Lindsey & Eric! I'm reaching out about your puppies on OKCFrenchies.com.`;

  const mailtoHref = `mailto:info@okcfrenchies.com?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;
  const smsHref = `sms:+14053008482?&body=${encodeURIComponent(smsBody)}`;

  const inquirySchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'OKC Frenchies',
      image: 'https://okcfrenchies.com/IMG_3894.png',
      url: 'https://okcfrenchies.com/puppy-inquiry-form',
      telephone: '+1-405-300-8482',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Oklahoma City',
        addressRegion: 'OK',
        addressCountry: 'US'
      }
    },
    {
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
          name: 'Contact & Inquiries',
          item: 'https://okcfrenchies.com/puppy-inquiry-form'
        }
      ]
    }
  ];

  return (
    <section className="min-h-screen bg-[#F6F4EE] text-[#1C2621] py-14 relative font-sans">
      <SEO
        title={seoData.Inquiry.title}
        description={seoData.Inquiry.description}
        image={dogName ? `https://okcfrenchies.com/og/dogs/${dogName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}.jpg` : 'https://okcfrenchies.com/og/inquiry.jpg'}
        url="https://okcfrenchies.com/puppy-inquiry-form"
        schema={inquirySchema}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-[#E3EFE8] text-[#2E5A44] font-sans font-bold text-xs px-4 py-1.5 rounded-full mb-4">
            🏡 Oklahoma City Family Breeder • Direct Contact
          </span>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-[#1C2621] mb-4">
            {dogName ? (
              <>
                Ask About <em className="italic font-semibold text-[#D46A4E]">{dogName}</em>
              </>
            ) : (
              <>
                Connect With <em className="italic font-semibold text-[#D46A4E]">Lindsey &amp; Eric</em>
              </>
            )}
          </h1>
          <p className="font-sans text-[#5C6B63] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            No long waiting on automated forms—reach out to us directly by text, email, or Instagram DM and we'll get right back to you with photos, videos, or a live FaceTime!
          </p>
        </div>

        {/* 3 Direct Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Text Only Card */}
          <a
            href={smsHref}
            className="group bg-white border border-[#EAE5D9] hover:border-[#2E5A44] rounded-3xl p-7 shadow-[0_12px_30px_rgba(28,38,33,0.06)] hover:-translate-y-1 transition-all flex flex-col text-center"
          >
            <div className="w-14 h-14 rounded-full bg-[#E3EFE8] text-[#2E5A44] flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
              <MessageSquare size={26} />
            </div>
            <span className="inline-block bg-[#F4D37E] text-[#1C2621] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mx-auto mb-3">
              Text Only • Fastest
            </span>
            <h2 className="font-display font-bold text-2xl text-[#1C2621] mb-1">
              405.300.8482
            </h2>
            <p className="text-xs font-bold uppercase tracking-wider text-[#2E5A44] mb-3">
              Please Text — Lindsey or Eric
            </p>
            <p className="text-sm text-[#5C6B63] leading-relaxed mb-6">
              For text-only purposes—send us a message anytime about available puppies, pricing, or setting up a FaceTime meet!
            </p>
            <span className="mt-auto inline-flex items-center justify-center gap-2 bg-[#2E5A44] group-hover:bg-[#234735] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-full transition-colors">
              Send a Text <ArrowRight size={15} />
            </span>
          </a>

          {/* Email Directly Card */}
          <a
            href={mailtoHref}
            className="group bg-white border border-[#EAE5D9] hover:border-[#D46A4E] rounded-3xl p-7 shadow-[0_12px_30px_rgba(28,38,33,0.06)] hover:-translate-y-1 transition-all flex flex-col text-center"
          >
            <div className="w-14 h-14 rounded-full bg-[#FADADD] text-[#D46A4E] flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
              <Mail size={26} />
            </div>
            <span className="inline-block bg-[#E3EFE8] text-[#2E5A44] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mx-auto mb-3">
              Email Directly
            </span>
            <h2 className="font-display font-bold text-xl text-[#1C2621] mb-1 break-all">
              info@okcfrenchies.com
            </h2>
            <p className="text-xs font-bold uppercase tracking-wider text-[#D46A4E] mb-3">
              Puppy &amp; Stud Inquiries
            </p>
            <p className="text-sm text-[#5C6B63] leading-relaxed mb-6">
              Prefer email? Click below to open your mail app and tell us about your family and which puppy caught your eye.
            </p>
            <span className="mt-auto inline-flex items-center justify-center gap-2 bg-[#D46A4E] group-hover:bg-[#bc583e] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-full transition-colors">
              Email Us Directly <ArrowRight size={15} />
            </span>
          </a>

          {/* Instagram Card */}
          <a
            href="https://www.instagram.com/okcfrenchies/"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white border border-[#EAE5D9] hover:border-[#2E5A44] rounded-3xl p-7 shadow-[0_12px_30px_rgba(28,38,33,0.06)] hover:-translate-y-1 transition-all flex flex-col text-center"
          >
            <div className="w-14 h-14 rounded-full bg-[#F4D37E]/50 text-[#1C2621] flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
              <Instagram size={26} />
            </div>
            <span className="inline-block bg-[#E3EFE8] text-[#2E5A44] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mx-auto mb-3">
              Daily Stories &amp; DMs
            </span>
            <h2 className="font-display font-bold text-2xl text-[#1C2621] mb-1">
              @okcfrenchies
            </h2>
            <p className="text-xs font-bold uppercase tracking-wider text-[#2E5A44] mb-3">
              Instagram
            </p>
            <p className="text-sm text-[#5C6B63] leading-relaxed mb-6">
              See daily puppy videos, behind-the-scenes nursery updates, and send us a DM directly on Instagram.
            </p>
            <span className="mt-auto inline-flex items-center justify-center gap-2 bg-[#1C2621] group-hover:bg-[#2E5A44] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-full transition-colors">
              Open Instagram <ArrowRight size={15} />
            </span>
          </a>
        </div>

        {/* What to Include & FaceTime Note */}
        <div className="bg-white border border-[#EAE5D9] rounded-3xl p-7 md:p-9 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#2E5A44] font-bold text-xs uppercase tracking-wider">
              <Video size={16} /> Live FaceTime Visits Available
            </div>
            <h3 className="font-display font-bold text-2xl text-[#1C2621]">
              What to share when you reach out
            </h3>
            <p className="text-sm text-[#5C6B63] max-w-xl leading-relaxed">
              Let us know which puppy or stud you're interested in, your city/state, whether you're looking for a pet home or breeding rights, and any questions you have. We happily do live FaceTime calls so you can see the puppies playing in real time!
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
            <Link
              to="/french-bulldog-puppies-for-sale"
              className="px-6 py-3 bg-[#E3EFE8] hover:bg-[#2E5A44] text-[#2E5A44] hover:text-white font-bold text-xs uppercase tracking-wider rounded-full text-center transition-colors"
            >
              Browse Available Puppies
            </Link>
            <Link
              to="/buyer-education"
              className="px-6 py-3 border border-[#DCD6C8] hover:border-[#2E5A44] text-[#1C2621] font-bold text-xs uppercase tracking-wider rounded-full text-center transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck size={14} /> Read Buyer Education
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Inquiry;

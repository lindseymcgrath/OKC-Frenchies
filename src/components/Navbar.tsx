import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import puppiesData from '../data/puppies.json';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const availableCount = puppiesData.filter(
    (p: any) => !p.status || ['available', 'pending'].includes(String(p.status).toLowerCase())
  ).length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (paths: string[]) =>
    paths.some((p) => location.pathname === p || location.pathname.startsWith(`${p}/`));

  const NavPill = ({
    to,
    label,
    badge,
    aliases = []
  }: {
    to: string;
    label: string;
    badge?: number | string;
    aliases?: string[];
  }) => {
    const active = isActive([to, ...aliases]);

    return (
      <Link
        to={to}
        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 font-sans text-[13px] font-bold tracking-tight transition-all duration-200 ${
          active
            ? 'bg-[#2E5A44] text-white shadow-xs'
            : 'text-[#1C2621]/80 hover:text-[#1C2621] hover:bg-white/80'
        }`}
      >
        <span>{label}</span>
        {badge !== undefined && (
          <span
            className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.2 text-[11px] font-extrabold leading-tight ${
              active
                ? 'bg-[#F4D37E] text-[#1C2621]'
                : 'bg-[#E3EFE8] text-[#2E5A44]'
            }`}
          >
            {badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <nav
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 border-b border-[#E2DDD2] ${
        isScrolled || isMenuOpen
          ? 'bg-[#F6F4EE]/95 backdrop-blur-md py-2.5 shadow-xs'
          : 'bg-[#F6F4EE] py-3.5'
      }`}
    >
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 flex justify-between items-center gap-3">
        {/* Logo Area */}
        <Link to="/" className="flex items-center gap-2.5 group relative z-50 shrink-0 whitespace-nowrap">
          <img
            src="/okc-frenchies.png"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://raw.githubusercontent.com/lindseymcgrath/OKC-Frenchies/main/public/images/visuals/okc-frenchies-logo.PNG';
            }}
            alt="OKC Frenchies Logo"
            className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 shrink-0"
          />
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl sm:text-[22px] font-bold tracking-tight text-[#2E5A44] whitespace-nowrap">
              OKC Frenchies
            </span>
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[#D46A4E] whitespace-nowrap mt-0.5">
              &amp; Mini English Bulldogs
            </span>
          </div>
        </Link>

        {/* Desktop Pill Tabs */}
        <div className="hidden lg:flex items-center gap-1 bg-[#EFECE4]/90 border border-[#E2DDD2] p-1.5 rounded-full relative z-50">
          <NavPill
            to="/french-bulldog-puppies-for-sale"
            aliases={[
              '/puppies',
              '/puppies-for-sale',
              '/mini-english-bulldog-puppies-for-sale',
              '/mini-english-bulldogs',
              '/english-bulldog-puppies',
              '/frenchies',
              '/french-bulldogs',
            ]}
            label="Available Puppies"
            badge={availableCount}
          />
          <NavPill
            to="/french-bulldog-stud-service"
            aliases={['/studs']}
            label="Our Studs"
          />
          <NavPill
            to="/french-bulldog-coat-color-genetics"
            aliases={['/genetics']}
            label="Health & Genetics"
          />
          <NavPill
            to="/french-bulldog-breeding-protocol"
            aliases={['/protocol']}
            label="Nutrition"
          />
          <NavPill
            to="/buyer-education"
            label="Buyer Guide"
          />
          <NavPill
            to="/french-bulldog-breeding-blog"
            aliases={['/blog', '/journal']}
            label="Journal"
          />
        </div>

        {/* Desktop CTA Pill */}
        <div className="hidden lg:flex items-center shrink-0 relative z-50">
          <Link
            to="/puppy-inquiry-form"
            className="whitespace-nowrap bg-[#2E5A44] hover:bg-[#234735] text-white font-sans text-[13px] font-bold px-4 py-2 rounded-full transition-all shadow-xs hover:shadow"
          >
            Visit or FaceTime Us
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-[#1C2621] hover:text-[#2E5A44] bg-[#EFECE4] border border-[#E2DDD2] rounded-full transition-colors relative z-50 p-2 shrink-0"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#F6F4EE] border-b border-[#E2DDD2] p-4 sm:p-6 flex flex-col gap-2.5 lg:hidden shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/french-bulldog-puppies-for-sale"
              className="col-span-2 flex items-center justify-between px-4 py-3 rounded-2xl bg-white border border-[#E2DDD2] text-sm font-bold text-[#2E5A44]"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>🐾 Available Puppies</span>
              <span className="bg-[#E3EFE8] text-[#2E5A44] text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                {availableCount} Available
              </span>
            </Link>
            <Link
              to="/mini-english-bulldog-puppies-for-sale"
              className="px-4 py-2.5 rounded-2xl bg-white border border-[#E2DDD2] text-xs font-bold text-[#1C2621] text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Mini English Bulldogs
            </Link>
            <Link
              to="/frenchies"
              className="px-4 py-2.5 rounded-2xl bg-white border border-[#E2DDD2] text-xs font-bold text-[#1C2621] text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              French Bulldogs
            </Link>
            <Link
              to="/french-bulldog-stud-service"
              className="px-4 py-2.5 rounded-2xl bg-white border border-[#E2DDD2] text-xs font-bold text-[#1C2621] text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Our Studs
            </Link>
            <Link
              to="/french-bulldog-coat-color-genetics"
              className="px-4 py-2.5 rounded-2xl bg-white border border-[#E2DDD2] text-xs font-bold text-[#1C2621] text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Health &amp; Genetics
            </Link>
            <Link
              to="/french-bulldog-breeding-protocol"
              className="px-4 py-2.5 rounded-2xl bg-white border border-[#E2DDD2] text-xs font-bold text-[#1C2621] text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Nutrition Protocol
            </Link>
            <Link
              to="/buyer-education"
              className="px-4 py-2.5 rounded-2xl bg-white border border-[#E2DDD2] text-xs font-bold text-[#1C2621] text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Buyer Guide
            </Link>
            <Link
              to="/french-bulldog-breeding-blog"
              className="col-span-2 px-4 py-2.5 rounded-2xl bg-white border border-[#E2DDD2] text-xs font-bold text-[#1C2621] text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Journal &amp; Articles
            </Link>
          </div>
          <Link
            to="/puppy-inquiry-form"
            className="bg-[#2E5A44] text-white text-center text-sm font-bold py-3 rounded-full mt-1 shadow-xs"
            onClick={() => setIsMenuOpen(false)}
          >
            Visit or FaceTime Us
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

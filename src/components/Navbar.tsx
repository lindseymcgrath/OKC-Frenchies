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

  const isActive = (paths: string[]) => paths.includes(location.pathname);

  const NavLink = ({
    to,
    label,
    aliases = []
  }: {
    to: string;
    label: string;
    aliases?: string[];
  }) => {
    const active = isActive([to, ...aliases]);

    return (
      <Link
        to={to}
        className={`relative transition-colors duration-200 font-sans text-[14px] font-bold tracking-wide ${
          active
            ? 'text-[#2E5A44] underline decoration-[#D46A4E] decoration-2 underline-offset-8'
            : 'text-[#1C2621]/85 hover:text-[#2E5A44]'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 border-b border-[#E2DDD2] ${
        isScrolled || isMenuOpen
          ? 'bg-[#F6F4EE]/95 backdrop-blur-md py-4 shadow-sm'
          : 'bg-[#F6F4EE] py-5'
      }`}
    >
      <div className="max-w-[1340px] mx-auto px-6 flex justify-between items-center">
        {/* Logo Area */}
        <Link to="/" className="flex items-center gap-3 group relative z-50">
          <img
            src="/okc-frenchies.png"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://raw.githubusercontent.com/lindseymcgrath/OKC-Frenchies/main/public/images/visuals/okc-frenchies-logo.PNG';
            }}
            alt="OKC Frenchies Logo"
            className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-display text-2xl md:text-[26px] font-bold tracking-tight text-[#2E5A44]">
            🌿 OKC Frenchies <span className="hidden sm:inline font-normal italic text-[#D46A4E]">&amp; Mini Bulldogs</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-7 relative z-50">
          <NavLink
            to="/french-bulldog-puppies-for-sale"
            aliases={['/puppies']}
            label={`The Nursery (${availableCount} Available)`}
          />
          <NavLink
            to="/french-bulldog-stud-service"
            aliases={['/studs']}
            label="Our Studs"
          />
          <NavLink
            to="/french-bulldog-coat-color-genetics"
            aliases={['/genetics']}
            label="Health & Genetics"
          />
          <NavLink
            to="/french-bulldog-breeding-protocol"
            aliases={['/protocol']}
            label="Nutrition Protocol"
          />
          <NavLink
            to="/french-bulldog-breeding-blog"
            aliases={['/blog', '/journal']}
            label="Journal"
          />
          <NavLink
            to="/buyer-education"
            label="Buyer Ed"
          />
          <Link
            to="/puppy-inquiry-form"
            className="bg-[#2E5A44] hover:bg-[#234735] text-white font-sans text-[14px] font-bold px-5 py-2.5 rounded-full transition-all shadow-sm hover:shadow"
          >
            Visit or FaceTime Us
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-[#1C2621] hover:text-[#2E5A44] transition-colors relative z-50 p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#F6F4EE] border-b border-[#E2DDD2] p-6 flex flex-col gap-5 lg:hidden shadow-xl">
          <Link
            to="/french-bulldog-puppies-for-sale"
            className="text-base font-bold text-[#2E5A44]"
            onClick={() => setIsMenuOpen(false)}
          >
            🐾 The Nursery ({availableCount} Available)
          </Link>
          <Link
            to="/french-bulldog-stud-service"
            className="text-base font-bold text-[#1C2621]"
            onClick={() => setIsMenuOpen(false)}
          >
            Our Studs
          </Link>
          <Link
            to="/french-bulldog-coat-color-genetics"
            className="text-base font-bold text-[#1C2621]"
            onClick={() => setIsMenuOpen(false)}
          >
            Health &amp; Genetics
          </Link>
          <Link
            to="/french-bulldog-breeding-protocol"
            className="text-base font-bold text-[#1C2621]"
            onClick={() => setIsMenuOpen(false)}
          >
            Nutrition Protocol
          </Link>
          <Link
            to="/french-bulldog-breeding-blog"
            className="text-base font-bold text-[#1C2621]"
            onClick={() => setIsMenuOpen(false)}
          >
            Journal
          </Link>
          <Link
            to="/buyer-education"
            className="text-base font-bold text-[#1C2621]"
            onClick={() => setIsMenuOpen(false)}
          >
            Buyer Education
          </Link>
          <Link
            to="/puppy-inquiry-form"
            className="bg-[#2E5A44] text-white text-center font-bold py-3 rounded-full"
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

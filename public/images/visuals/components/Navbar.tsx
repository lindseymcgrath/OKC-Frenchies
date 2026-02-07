import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  // Helper to render links with specific glow logic
  const NavLink = ({ to, label, activeColorClass, glowColorClass }: { to: string, label: string, activeColorClass: string, glowColorClass: string }) => {
    const active = isActive(to);
    
    return (
      <Link 
        to={to} 
        className={`relative group transition-all duration-300 uppercase tracking-[0.2em] hover:tracking-[0.3em] hover:text-white ${active ? activeColorClass : 'text-slate-400'}`}
      >
        {/* Active Glow Pulse */}
        {active && (
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full min-w-[40px] rounded-full blur-xl opacity-40 animate-pulse ${glowColorClass}`} />
        )}
        <span className="relative z-10">{label}</span>
      </Link>
    );
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
        isScrolled || isMenuOpen
          ? 'bg-luxury-black/30 backdrop-blur-[20px] border-luxury-slate/20 py-4 shadow-lg' 
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo Area */}
        <Link to="/" className="flex items-center gap-2 group relative z-50">
          <span className="font-serif text-2xl font-bold tracking-widest text-slate-100 group-hover:text-white transition-colors">
            OKC<span className="text-luxury-teal group-hover:text-luxury-teal/80">FRENCHIES</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10 font-sans text-xs font-medium relative z-50">
          
          <NavLink 
            to="/puppies" 
            label="Puppies" 
            activeColorClass="text-fuchsia-400" 
            glowColorClass="bg-fuchsia-500" 
          />
          
          <NavLink 
            to="/studs" 
            label="Studs" 
            activeColorClass="text-luxury-teal" 
            glowColorClass="bg-luxury-teal" 
          />
          
          <NavLink 
            to="/calculator" 
            label="DNA Matrix" 
            activeColorClass="text-luxury-magenta" 
            glowColorClass="bg-luxury-magenta" 
          />

          <NavLink 
            to="/blog" 
            label="Journal" 
            activeColorClass="text-luxury-teal" 
            glowColorClass="bg-luxury-teal" 
          />

          <NavLink 
            to="/genetics" 
            label="Genetics" 
            activeColorClass="text-fuchsia-400" 
            glowColorClass="bg-fuchsia-500" 
          />
          
          <NavLink 
            to="/protocol" 
            label="Protocol" 
            activeColorClass="text-luxury-teal" 
            glowColorClass="bg-luxury-teal" 
          />
          
          <NavLink 
            to="/inquiry" 
            label="Contact" 
            activeColorClass="text-amber-400" 
            glowColorClass="bg-amber-400" 
          />

        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-slate-200 hover:text-luxury-teal transition-colors relative z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-luxury-black/95 backdrop-blur-xl border-b border-luxury-slate p-8 flex flex-col gap-8 md:hidden animate-in fade-in slide-in-from-top-5">
           <Link to="/puppies" className="text-sm tracking-widest uppercase text-fuchsia-200 hover:text-white" onClick={() => setIsMenuOpen(false)}>Puppies</Link>
           <Link to="/studs" className="text-sm tracking-widest uppercase text-slate-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>Studs</Link>
           <Link to="/calculator" className="text-sm tracking-widest uppercase text-luxury-magenta hover:text-white" onClick={() => setIsMenuOpen(false)}>DNA Matrix</Link>
           <Link to="/blog" className="text-sm tracking-widest uppercase text-slate-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>Journal</Link>
           <Link to="/genetics" className="text-sm tracking-widest uppercase text-fuchsia-400 hover:text-white" onClick={() => setIsMenuOpen(false)}>Genetics</Link>
           <Link to="/protocol" className="text-sm tracking-widest uppercase text-slate-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>Protocol</Link>
           <Link to="/inquiry" className="text-sm tracking-widest uppercase text-amber-200 hover:text-white" onClick={() => setIsMenuOpen(false)}>Contact</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
import React from 'react';
import { Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#01040f] border-t border-slate-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            
            {/* Brand */}
            <div className="col-span-1">
                <span className="font-serif text-3xl font-bold tracking-widest text-slate-100 block mb-6">
                    OKC<span className="text-luxury-teal">FRENCHIES</span>
                </span>
                <p className="font-sans text-slate-500 text-sm leading-relaxed max-w-sm mb-6">
                    Redefining the standard through genetic excellence. 
                    A boutique experience for the discerning enthusiast.
                </p>
            </div>

             {/* Contact */}
             <div className="flex flex-col items-start md:items-end text-left md:text-right">
                <h4 className="font-sans text-slate-200 text-xs tracking-[0.2em] uppercase mb-6">Connect</h4>
                
                <div className="flex gap-4 mb-6">
                    <a href="https://www.instagram.com/okcfrenchies/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-slate-800 flex items-center justify-center text-slate-400 hover:border-luxury-teal hover:text-luxury-teal transition-all">
                        <Instagram size={18} />
                    </a>
                </div>
                
                <div className="font-sans text-slate-400 text-sm space-y-2">
                    <p className="hover:text-luxury-teal transition-colors">info@okcfrenchies.com</p>
                    <p className="hover:text-luxury-teal transition-colors">405-300-8482</p>
                    <p className="text-slate-600 text-xs mt-4">
                        Oklahoma City, OK<br />
                        Worldwide Delivery Available
                    </p>
                </div>
            </div>
        </div>

        {/* Sub Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-900/50">
            <p className="font-sans text-slate-600 text-xs tracking-wide">
                © 2024 OKC Frenchies. All Rights Reserved.
            </p>
            <div className="flex gap-8 mt-4 md:mt-0">
                <a href="#" className="font-sans text-slate-600 text-xs hover:text-slate-400">Privacy Policy</a>
                <a href="#" className="font-sans text-slate-600 text-xs hover:text-slate-400">Terms of Service</a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
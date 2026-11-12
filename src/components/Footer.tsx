import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#EFECE4] border-t border-[#DCD6C8] pt-20 pb-12 text-[#1C2621]">
      <div className="max-w-[1340px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="font-display text-3xl font-bold tracking-tight text-[#2E5A44] block mb-4">
              🌿 OKC Frenchies <span className="italic font-normal text-[#D46A4E]">&amp; Mini Bulldogs</span>
            </Link>
            <p className="font-sans text-[#5C6B63] text-sm leading-relaxed max-w-sm mb-6">
              Raised in the sunlight in Oklahoma City. Health-tested French Bulldogs and Mini English Bulldogs with rare genetics, sound structure, and sweet family temperaments.
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-start md:items-end text-left md:text-right">
            <h4 className="font-sans text-[#2E5A44] text-xs font-bold tracking-[0.2em] uppercase mb-5">
              Connect With Us
            </h4>

            <div className="flex gap-4 mb-5">
              <a
                href="https://www.instagram.com/okcfrenchies/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-[#DCD6C8] flex items-center justify-center text-[#2E5A44] hover:bg-[#2E5A44] hover:text-white transition-all shadow-xs"
              >
                <Instagram size={18} />
              </a>
            </div>

            <div className="font-sans text-[#1C2621] text-sm space-y-1.5 font-medium">
              <p className="hover:text-[#D46A4E] transition-colors">info@okcfrenchies.com</p>
              <p className="hover:text-[#D46A4E] transition-colors">405-300-8482</p>
              <p className="text-[#5C6B63] text-xs mt-3 font-normal">
                Oklahoma City, OK<br />
                Local Pickup &amp; Flight Nanny Delivery Available
              </p>
            </div>
          </div>
        </div>

        {/* Family of Brands */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 py-8 mb-8 border-t border-[#DCD6C8]">
          <p className="font-sans text-[#5C6B63] text-xs font-bold tracking-[0.2em] uppercase">
            Our Family of Brands
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://rawandpawco.com/?utm_source=okcfrenchies&utm_medium=referral&utm_campaign=sister_brands"
              target="_blank"
              rel="noopener"
              className="group flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-[#DCD6C8] hover:border-[#2E5A44] transition-all shadow-xs"
            >
              <span className="text-lg" aria-hidden="true">🐾</span>
              <span className="text-left">
                <span className="block font-sans font-bold text-[#1C2621] text-sm group-hover:text-[#2E5A44] transition-colors">
                  Raw &amp; Paw Co.
                </span>
                <span className="block font-sans text-[#5C6B63] text-[11px]">
                  Raw dog food &amp; breeder supplements
                </span>
              </span>
            </a>
            <a
              href="https://okieestates.com/?utm_source=okcfrenchies&utm_medium=referral&utm_campaign=sister_brands"
              target="_blank"
              rel="noopener"
              className="group flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-[#DCD6C8] hover:border-[#2E5A44] transition-all shadow-xs"
            >
              <span className="text-lg" aria-hidden="true">🏡</span>
              <span className="text-left">
                <span className="block font-sans font-bold text-[#1C2621] text-sm group-hover:text-[#2E5A44] transition-colors">
                  Okie Estates Group
                </span>
                <span className="block font-sans text-[#5C6B63] text-[11px]">
                  Veteran-owned OKC real estate
                </span>
              </span>
            </a>
          </div>
        </div>

        {/* Sub Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#DCD6C8]">
          <p className="font-sans text-[#5C6B63] text-xs">
            © {new Date().getFullYear()} OKC Frenchies. All Rights Reserved.
          </p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <a href="#" className="font-sans text-[#5C6B63] text-xs hover:text-[#2E5A44]">
              Privacy Policy
            </a>
            <a href="#" className="font-sans text-[#5C6B63] text-xs hover:text-[#2E5A44]">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

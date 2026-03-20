import React, { useEffect } from 'react';

const KennelKingSupport: React.FC = () => {
  useEffect(() => {
    document.title = "Kennel King App Support";
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 py-32 px-6 flex items-center justify-center font-sans">
      <div className="max-w-xl mx-auto text-center space-y-8 bg-slate-900/50 p-12 rounded-2xl border border-slate-800">
        <h1 className="text-4xl font-serif text-white mb-4">Kennel King App Support</h1>
        
        <p className="text-lg text-slate-400">
          Need help with your Kennel King account, or experiencing a bug? 
        </p>

        <div className="pt-6">
          <p className="text-slate-300 mb-2">Email us at</p>
          <a 
            href="mailto:info@okcfrenchies.com" 
            className="inline-block text-xl text-luxury-teal font-medium hover:text-white transition-colors"
          >
            info@okcfrenchies.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default KennelKingSupport;

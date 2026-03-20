import React, { useEffect } from 'react';

const KennelKingDataDeletion: React.FC = () => {
  useEffect(() => {
    document.title = "Kennel King - Account Deletion";
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 py-32 px-6 flex items-center justify-center font-sans">
      <div className="max-w-2xl mx-auto space-y-8 bg-slate-900/50 p-8 md:p-12 rounded-2xl border border-slate-800">
        <h1 className="text-3xl md:text-4xl font-serif text-white mb-6 text-center">Account Deletion Request</h1>
        
        <div className="space-y-6 text-slate-400">
          <p className="text-lg">
            We're sorry to see you go. If you wish to permanently delete your Kennel King account and all associated data, you have two options:
          </p>

          <div className="bg-black/40 p-6 rounded-lg border border-slate-800/50">
            <h2 className="text-xl text-white mb-3 flex items-center gap-3">
              <span className="bg-slate-800 text-luxury-teal w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              Delete Inside the App
            </h2>
            <p className="ml-11">
              You can delete your account directly inside the Kennel King app. 
              Simply navigate to the <strong>Settings menu</strong> and select <strong>Delete Account</strong>. 
              This will instantly remove your profile and all dog records.
            </p>
          </div>

          <div className="bg-black/40 p-6 rounded-lg border border-slate-800/50">
            <h2 className="text-xl text-white mb-3 flex items-center gap-3">
              <span className="bg-slate-800 text-luxury-teal w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              Manual Deletion via Email
            </h2>
            <p className="ml-11 leading-relaxed">
              If you no longer have the app installed, you can email us at <a href="mailto:info@okcfrenchies.com" className="text-luxury-teal hover:underline">info@okcfrenchies.com</a> with the subject line <strong>"Account Deletion Request"</strong>. Please send this email from the address associated with your Kennel King account, and we will manually wipe your data from our servers within 3-5 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KennelKingDataDeletion;

import React, { useEffect } from 'react';

const KennelKingPrivacy: React.FC = () => {
  useEffect(() => {
    document.title = "Kennel King - Privacy Policy";
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 py-24 px-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-serif text-white mb-8">Kennel King Privacy Policy</h1>
        
        <section className="space-y-4 text-slate-400">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>
            Welcome to Kennel King. Your privacy is important to us. This Privacy Policy explains 
            how we collect, use, and protect your information when you use our mobile application.
          </p>
          
          <h2 className="text-2xl text-white mt-8 mb-4">1. Information We Collect</h2>
          <p>
            We collect basic account information, including your email address and name, to create 
            and manage your account. We also collect user-generated content, such as dog data, 
            lineages, statuses, and photos, which are necessary for the core functionality of 
            the Kennel King app.
          </p>
          
          <h2 className="text-2xl text-white mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            All information and user-generated content collected is used solely for the functionality 
            and improvement of the Kennel King app. This includes maintaining your kennel records, 
            syncing your data across devices securely, and providing app-specific features.
          </p>
          
          <h2 className="text-2xl text-white mt-8 mb-4">3. Subscriptions & Third-Party Services</h2>
          <p>
            We use RevenueCat to process and manage in-app subscriptions and transactions securely. 
            We do not process or store sensitive payment details directly.
          </p>

          <h2 className="text-2xl text-white mt-8 mb-4">4. Data Sharing & Selling</h2>
          <p>
            <strong>We do not sell your personal data.</strong> Your information is never sold to 
            third parties or advertisers. We only share information with essential service providers 
            (like RevenueCat for payments and our secure cloud database providers) strictly to operate the app.
          </p>

          <h2 className="text-2xl text-white mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you have any questions or concerns about this privacy policy, please contact us at: <br/>
            <a href="mailto:info@okcfrenchies.com" className="text-luxury-teal hover:underline">info@okcfrenchies.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default KennelKingPrivacy;

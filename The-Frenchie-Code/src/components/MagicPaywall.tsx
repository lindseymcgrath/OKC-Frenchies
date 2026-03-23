import React from 'react';
import { PurchasesPackage } from '@revenuecat/purchases-capacitor';
import { useSubscription } from './SubscriptionManager';
import { X, CheckCircle, Shield } from 'lucide-react';

interface MagicPaywallProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MagicPaywall: React.FC<MagicPaywallProps> = ({ isOpen, onClose }) => {
  const { packages, purchasePackage, restorePurchases } = useSubscription();

  if (!isOpen) return null;

  const handlePurchase = async (pkg: PurchasesPackage) => {
    const success = await purchasePackage(pkg);
    if (success) {
      alert("Subscription successful!");
      onClose();
    }
  };

  const handleRestore = async () => {
    const success = await restorePurchases();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="bg-[#0f172a] border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>

          <div className="text-center mb-6 mt-4">
            <Shield className="w-12 h-12 text-luxury-teal mx-auto mb-3" />
            <h2 className="text-2xl font-serif text-white mb-2">Unlock Full Access</h2>
            <p className="text-slate-400 text-sm">You have reached your limit of saved dogs. Upgrade to continue building your kennel.</p>
          </div>

          <div className="space-y-4 mb-6">
            {packages.map((pkg) => (
              <div key={pkg.identifier} className="bg-slate-800/50 border border-slate-700/50 hover:border-luxury-teal p-4 rounded-xl flex items-center justify-between cursor-pointer transition-colors" onClick={() => handlePurchase(pkg)}>
                <div>
                  <h3 className="text-white font-medium">{pkg.product.title}</h3>
                  <p className="text-luxury-teal text-sm font-semibold">{pkg.product.priceString}</p>
                </div>
                <button className="bg-luxury-teal text-[#020617] px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors">
                  Select
                </button>
              </div>
            ))}
          </div>

          <div className="text-center">
             <button onClick={handleRestore} className="text-slate-400 text-sm hover:text-white underline underline-offset-4">
               Restore Purchases
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

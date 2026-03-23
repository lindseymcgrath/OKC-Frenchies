import React, { createContext, useContext, useEffect, useState } from 'react';
import { Purchases, LOG_LEVEL, CustomerInfo, PurchasesPackage } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';

export type EntitlementLevel = 'pro_access' | 'standard_access' | 'none';

interface SubscriptionContextType {
  entitlement: EntitlementLevel;
  packages: PurchasesPackage[];
  purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  entitlement: 'none',
  packages: [],
  purchasePackage: async () => false,
  restorePurchases: async () => false,
  isLoading: true,
});

export const useSubscription = () => useContext(SubscriptionContext);

const API_KEY = 'test_nvxLbAQwiieHUltuHRDblzucmkp';

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entitlement, setEntitlement] = useState<EntitlementLevel>('none');
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initRevenueCat();
  }, []);

  const initRevenueCat = async () => {
    if (Capacitor.getPlatform() === 'web') {
       console.log('RevenueCat is not supported on web. Mocking none entitlement.');
       setIsLoading(false);
       return;
    }

    try {
      await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
      await Purchases.configure({ apiKey: API_KEY });
      
      const { customerInfo } = await Purchases.getCustomerInfo();
      updateEntitlementState(customerInfo);

      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
        // We want specifically 'Annual' and 'pro_annual' packages if possible, 
        // or just expose the available packages from the default offering.
        setPackages(offerings.current.availablePackages);
      }
    } catch (e) {
      console.error('Error initializing RevenueCat', e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateEntitlementState = (info: CustomerInfo) => {
    if (typeof info.entitlements.active['pro_access'] !== 'undefined') {
      setEntitlement('pro_access');
    } else if (typeof info.entitlements.active['standard_access'] !== 'undefined') {
      setEntitlement('standard_access');
    } else {
      setEntitlement('none');
    }
  };

  const purchasePackage = async (pkg: PurchasesPackage) => {
    try {
      if (Capacitor.getPlatform() === 'web') return false;
      const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
      updateEntitlementState(customerInfo);
      return true;
    } catch (e: any) {
      if (!e.userCancelled) {
        alert("Purchase failed: " + e.message);
      }
      return false;
    }
  };

  const restorePurchases = async () => {
    try {
      if (Capacitor.getPlatform() === 'web') return false;
      const { customerInfo } = await Purchases.restorePurchases();
      updateEntitlementState(customerInfo);
      alert("Purchases restored successfully.");
      return true;
    } catch (e: any) {
      alert("Restore failed: " + e.message);
      return false;
    }
  };

  return (
    <SubscriptionContext.Provider value={{ entitlement, packages, purchasePackage, restorePurchases, isLoading }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

// contexts/MetadataContext.tsx
'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { fetchCardanoTokenPrices, MuesliSwapTokenInfo } from '@/components/nft-auth/cardanoPriceUtils';

// Define the shape of the context
interface MetadataContextType {
  metadata: MuesliSwapTokenInfo[] | null;
  loading: boolean;
  error: string | null;
  fetchMetadata: () => Promise<void>;
}

// Create the context
const MetadataContext = createContext<MetadataContextType | undefined>(undefined);

// Custom hook to use the metadata context
export const useMetadata = () => {
  const context = useContext(MetadataContext);
  if (context === undefined) {
    throw new Error('useMetadata must be used within a MetadataProvider');
  }
  return context;
};

// MetadataProvider component
export const MetadataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [metadata, setMetadata] = useState<MuesliSwapTokenInfo[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const updatePrices = useCallback(async () => {
    if (metadata) {
      try {
        const tokens = metadata.map(token => ({
          policyId: token.info.address.policyId,
          assetName: token.info.address.name
        }));
        const prices = await fetchCardanoTokenPrices(tokens);

        setMetadata(prevMetadata => 
          prevMetadata?.map(token => ({
            ...token,
            price: {
              ...token.price,
              price: prices[`${token.info.address.policyId}${token.info.address.name}`] || token.price.price
            }
          })) || null
        );
      } catch (err) {
        console.error('Error updating prices:', err);
      }
    }
  }, [metadata]);

  // Function to fetch metadata and start price updates
  const fetchMetadata = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/nft-auth/fetchMuesliSwapList');

      if (!response.ok) {
        throw new Error('Failed to fetch asset metadata');
      }

      const data: MuesliSwapTokenInfo[] = await response.json();
      setMetadata(data);

      // Fetch initial prices
      await updatePrices();

      // Start the interval for price updates
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = window.setInterval(updatePrices, 15000);
    } catch (err) {
      console.error('Error fetching metadata:', err);
      setError('Failed to fetch asset data');
    } finally {
      setLoading(false);
    }
  }, [updatePrices]);

  // Cleanup effect to clear the interval when the component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <MetadataContext.Provider value={{ metadata, loading, error, fetchMetadata }}>
      {children}
    </MetadataContext.Provider>
  );
};

export default MetadataProvider;

'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { convertAssetName } from '@/lib/utils';
import { useSession } from 'next-auth/react'; // Assuming you're using NextAuth

interface AssetMetadata {
  policy_id: string;
  asset_name: string;
  fingerprint: string;
  quantity: string;
  onchain_metadata?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  url?: string;
}

interface MetadataContextType {
  metadata: AssetMetadata[] | null;
  loading: boolean;
  error: string | null;
  fetchMetadata: (stakeAddress: string, network: string) => Promise<void>;
}

const MetadataContext = createContext<MetadataContextType | undefined>(undefined);

export const useMetadata = () => {
  const context = useContext(MetadataContext);
  if (context === undefined) {
    throw new Error('useMetadata must be used within a MetadataProvider');
  }
  return context;
};

export const MetadataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [metadata, setMetadata] = useState<AssetMetadata[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  
  const lastFetchRef = useRef<{ params: { stakeAddress: string; network: string }; timestamp: number; data: AssetMetadata[] } | null>(null);

  const fetchMetadata = useCallback(async (stakeAddress: string, network: string) => {
    console.log('fetchMetadata called with:', { stakeAddress, network });

    
    
    const now = Date.now();
    const cacheTime = 5 * 60 * 1000; // 5 minutes cache time

    if (lastFetchRef.current &&
        lastFetchRef.current.params.stakeAddress === stakeAddress &&
        lastFetchRef.current.params.network === network &&
        now - lastFetchRef.current.timestamp < cacheTime) {
      console.log('Using cached metadata');
      setMetadata(lastFetchRef.current.data);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('Fetching metadata from API');
      const response = await fetch('/api/nft-auth/fetchMetadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stakeAddress, network }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch asset metadata');
      }

      const data = await response.json();
      const processedData = data.assets?.map((asset: AssetMetadata) => ({
        ...asset,
        display_name: asset.asset_name ? convertAssetName(asset.asset_name) : 'Unknown Asset'
      })) || [];
      console.log('Received and processed metadata:', processedData);
      setMetadata(processedData);
      
      lastFetchRef.current = {
        params: { stakeAddress, network },
        timestamp: now,
        data: processedData
      };
    } catch (err) {
      console.error('Error fetching asset metadata:', err);
      setError('Failed to fetch asset data');
    } finally {
      setLoading(false);
    }
  }, []);

  console.log('MetadataProvider rendered. Current state:', { metadata, loading, error });

  return (
    <MetadataContext.Provider value={{ metadata, loading, error, fetchMetadata }}>
      {children}
    </MetadataContext.Provider>
  );
};

/*
export const MetadataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [metadata, setMetadata] = useState<AssetMetadata[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use a ref to store the last fetch params and timestamp
  const lastFetchRef = useRef<{ params: { stakeAddress: string; network: string }; timestamp: number; data: AssetMetadata[] } | null>(null);

  const fetchMetadata = useCallback(async (stakeAddress: string, network: string) => {
    const now = Date.now();
    const cacheTime = 5 * 60 * 1000; // 5 minutes cache time

    // Check if we have cached data and it's still valid
    if (lastFetchRef.current &&
        lastFetchRef.current.params.stakeAddress === stakeAddress &&
        lastFetchRef.current.params.network === network &&
        now - lastFetchRef.current.timestamp < cacheTime) {
      // Use cached data
      setMetadata(lastFetchRef.current.data);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/nft-auth/fetchMetadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stakeAddress, network }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch asset metadata');
      }

      const data = await response.json();
      setMetadata(data.assets);
      
      // Update the cache
      lastFetchRef.current = {
        params: { stakeAddress, network },
        timestamp: now,
        data: data.assets
      };
    } catch (err) {
      console.error('Error fetching asset metadata:', err);
      setError('Failed to fetch asset data');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <MetadataContext.Provider value={{ metadata, loading, error, fetchMetadata }}>
      {children}
    </MetadataContext.Provider>
  );
};
*/


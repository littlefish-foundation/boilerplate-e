'use client';

import React, { useEffect, useRef } from 'react';
import { useMetadata } from '@/contexts/MetadataContext';
import { useWallet } from "littlefish-nft-auth-framework/frontend";

const MINIMUM_INTERVAL = 20000; // 20 seconds in milliseconds

const WalletMetadataFetcher: React.FC = () => {
  const { fetchMetadata } = useMetadata();
  const { isConnected } = useWallet();
  const lastFetchTime = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (isConnected) {
        const now = Date.now();
        const timeSinceLastFetch = now - lastFetchTime.current;

        if (timeSinceLastFetch >= MINIMUM_INTERVAL) {
          console.log('Attempting to fetch metadata');
          try {
            await fetchMetadata();
            lastFetchTime.current = now;
            console.log('Metadata fetched');
          } catch (error) {
            console.error('Error fetching metadata:', error);
          }
        } else {
          const delay = MINIMUM_INTERVAL - timeSinceLastFetch;
          console.log(`Scheduling metadata fetch in ${delay}ms`);
          
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          
          timeoutRef.current = setTimeout(fetchData, delay);
        }
      } else {
        console.log('Wallet not connected');
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isConnected, fetchMetadata]);

  return null;
};

export default WalletMetadataFetcher;
'use client';

import React, { useEffect } from 'react';
import { useMetadata } from '@/contexts/MetadataContext';
import { useWallet } from "littlefish-nft-auth-framework/frontend";

const WalletMetadataFetcher: React.FC = () => {
  const { fetchMetadata } = useMetadata();
  const { isConnected } = useWallet();

  useEffect(() => {
    console.log('WalletMetadataFetcher rendered');
    console.log('isConnected:', isConnected);

    const fetchData = async () => {
      if (isConnected) {
        console.log('Attempting to fetch metadata');
        try {
          await fetchMetadata();
        } catch (error) {
          console.error('Error fetching metadata:', error);
        }
      } else {
        console.log('Wallet not connected');
      }
    };

    fetchData();
  }, [isConnected, fetchMetadata]);

  return null;
};

export default WalletMetadataFetcher;
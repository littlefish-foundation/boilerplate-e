'use client';

import React, { useEffect } from 'react';
import { useMetadata } from '@/contexts/MetadataContext';
import { useWallet } from "littlefish-nft-auth-framework/frontend";
import { convertHexToBech32 } from "littlefish-nft-auth-framework/backend";

const WalletMetadataFetcher: React.FC = () => {
  const { fetchMetadata } = useMetadata();
  const {
    isConnected,
    addresses,
    networkID,
  } = useWallet();

  useEffect(() => {
    console.log('WalletMetadataFetcher rendered');
    console.log('isConnected:', isConnected);
    console.log('addresses:', addresses);
    console.log('networkID:', networkID);

    const fetchData = async () => {
      if (isConnected && networkID && addresses && addresses.length > 0) {
        console.log('Attempting to fetch metadata');
        try {
          const stakeAddress = convertHexToBech32(addresses[0], 1);
          const network = networkID === 1 ? 'mainnet' : 'preprod';

          console.log('Stake Address:', stakeAddress);
          console.log('Network:', network);

          if (stakeAddress && network) {
            await fetchMetadata(stakeAddress, network);
          } else {
            console.log('Stake address or network is undefined');
          }
        } catch (error) {
          console.error('Error processing wallet data:', error);
        }
      } else {
        console.log('Conditions not met for fetching metadata');
        if (!isConnected) console.log('Wallet not connected');
        if (!networkID) console.log('Network ID not available');
        if (!addresses || addresses.length === 0) console.log('No addresses available');
      }
    };

    fetchData();
  }, [isConnected, networkID, addresses, fetchMetadata]);

  return null;
};

export default WalletMetadataFetcher;
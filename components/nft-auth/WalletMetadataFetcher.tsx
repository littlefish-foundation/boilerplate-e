'use client';

import React, { useEffect } from 'react';
import { useMetadata } from '@/contexts/MetadataContext';
import { useWallet } from "littlefish-nft-auth-framework/frontend";
import { convertHexToBech32 } from "littlefish-nft-auth-framework/backend";

// const { assets, isConnected, decodeHexToAscii, addresses, networkId } = useWallet(); // Destructure wallet assets, connection status, and decoding function from useWallet hook

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
    

    const fetchData = async () => {
      if (isConnected && networkID) {
        console.log('Attempting to fetch metadata');
        // Make sure these properties exist on your connectedWallet object
        const stakeAddress = convertHexToBech32(addresses[0],1);
        const network = networkID === 1 ? 'mainnet' : 'preprod';

        console.log('Stake Address:', stakeAddress);
        console.log('Network:', network);

        if (stakeAddress && network) {
          await fetchMetadata(stakeAddress, network);
        }
      }
    };

    fetchData();
  }, [isConnected, networkID, fetchMetadata]);

  return null;
};

export default WalletMetadataFetcher;
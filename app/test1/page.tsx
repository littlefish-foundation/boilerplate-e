'use client';

import React from 'react';
import { useMetadata } from '@/contexts/MetadataContext';
import { useWallet } from "littlefish-nft-auth-framework/frontend";

const MetadataDisplay: React.FC = () => {
  const { metadata, loading, error } = useMetadata();
  const { isConnected, connectedWallet } = useWallet();

  // Function to convert hex to ASCII
  const hexToAscii = (hex: string) => {
    let ascii = '';
    for (let i = 0; i < hex.length; i += 2) {
      const part = hex.substr(i, 2);
      ascii += String.fromCharCode(parseInt(part, 16));
    }
    return ascii.replace(/[^\x20-\x7E]/g, ''); // Replace non-printable characters with empty string
  };

  // Function to determine if a string is likely to be hex
  const isHex = (str: string) => /^[0-9A-Fa-f]+$/.test(str);

  console.log('MetadataDisplay rendered. State:', { metadata, loading, error, isConnected });

  if (!isConnected) {
    return <div>Wallet not connected. Please connect your wallet.</div>;
  }

  if (loading) {
    return <div>Loading metadata...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!metadata || metadata.length === 0) {
    return <div>No metadata available. Connected wallet: {connectedWallet?.name}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow p-6 md:p-8 lg:p-20 ml-0 md:ml-64"> 
    <div>
      <h2>Metadata Received:</h2>
      <p>Connected wallet: {connectedWallet?.name}</p>
      <p>Total assets: {metadata.length}</p>
      <ul>
        {metadata.slice(0, 50).map((asset, index) => {
          const displayName = isHex(asset.asset_name) ? hexToAscii(asset.asset_name) : asset.asset_name;
          return (
            <li key={index}>
              {displayName} (Hex: {asset.asset_name}) (Policy ID: {asset.policy_id.slice(0, 48)}...)
            </li>
          );
        })}
      </ul>
      {metadata.length > 5 && <p>...and {metadata.length - 5} more</p>}
    </div>
    </div>
    </div>
  );
};

export default MetadataDisplay;
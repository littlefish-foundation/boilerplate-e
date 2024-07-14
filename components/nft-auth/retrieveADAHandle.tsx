import React, { useState, useEffect } from 'react';
import { useWallet } from "littlefish-nft-auth-framework/frontend";
import { convertHexToBech32 } from "littlefish-nft-auth-framework/backend";

export function RetrieveADAHandle() {
  const { isConnected, addresses } = useWallet();
  const [defaultHandle, setDefaultHandle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const stakeAddress = addresses && addresses.length > 0 ? convertHexToBech32(addresses[0], 1) : ''

  useEffect(() => {
    if (isConnected && stakeAddress) {
      fetchDefaultHandle();
    }
  }, [isConnected, stakeAddress]);

  const fetchDefaultHandle = async () => {
    if (!stakeAddress) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/nft-auth/${stakeAddress}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getDefault'
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setDefaultHandle(data.defaultHandle?.name || null);
      }
    } catch (error) {
      console.error('Error fetching default ADA handle:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return <p>Please connect your wallet to view your default ADA Handle.</p>;
  }

  return (
    <div className="flex flex-col items-start space-y-4">
      <h2 className="text-xl font-semibold">Your Default ADA Handle</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : defaultHandle ? (
        <p className="text-lg">Default ADA Handle: <span className="font-bold">${defaultHandle}</span></p>
      ) : (
        <p>No default ADA Handle set.</p>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useWallet } from "littlefish-nft-auth-framework/frontend";
import { convertHexToBech32 } from "littlefish-nft-auth-framework/backend";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ADAHandleCard() {
  const { isConnected, addresses } = useWallet();
  const [defaultHandle, setDefaultHandle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const stakeAddress = addresses && addresses.length > 0 ? convertHexToBech32(addresses[0], 1) : '';

  useEffect(() => {
    if (isConnected && stakeAddress) {
      fetchDefaultHandle();
    } else {
      setDefaultHandle(null);
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">ADA Handle</CardTitle>
        <Badge variant="outline">
          <div 
            className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
            title={isConnected ? 'Connected' : 'Disconnected'}
          />
        </Badge>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-2xl font-bold">Loading...</div>
        ) : defaultHandle ? (
          <div className="text-2xl font-bold">${defaultHandle}</div>
        ) : (
          <div className="text-2xl font-bold">No Handle Set</div>
        )}
        <p className="text-xs text-muted-foreground">
          {isConnected ? 'Wallet Connected' : 'Connect Wallet to View'}
        </p>
      </CardContent>
    </Card>
  );
}